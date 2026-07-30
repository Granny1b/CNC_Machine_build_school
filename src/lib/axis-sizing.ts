/**
 * Axis-sizing maths. SPEC.md section 9.2.
 *
 * A first estimate of what a feed drive has to produce: thrust, screw torque,
 * motor speed, reflected inertia and move time, plus the trapezoidal velocity
 * profile the chart draws. Pure functions only — the calculator component holds
 * state and lays things out, it never does sums.
 *
 * Units are the trap here, so every signature says which unit it wants. The
 * screw lead appears in metres in the torque and inertia equations and in
 * millimetres in the motor-speed equation; that single inconsistency is the
 * most common arithmetic slip in axis sizing.
 *
 * The reference-card formula, the worked example and the list of everything
 * this model ignores live here beside the equations, so that no calculator
 * component ends up carrying content (SPEC section 4).
 */

import type { Formula } from "@/content/types";
import { G, rpmToRadPerSecond, significant } from "./format";
import {
  formatCalcValue,
  type CalcWarning,
  type WorkedGiven,
  type WorkedStep,
} from "./machining";

export type AxisOrientation = "horizontal" | "vertical";

/** θ, in radians, from the orientation selector. */
export const AXIS_ANGLE: Record<AxisOrientation, number> = {
  horizontal: 0,
  vertical: Math.PI / 2,
};

export interface AxisInputs {
  /** m — total moving mass, including fixture and workpiece, kg. */
  mass: number;
  /** v — required traverse speed, m/min. */
  speed: number;
  /** a — required acceleration, m/s². */
  acceleration: number;
  /** L — travel of the move, mm. */
  travel: number;
  /** F_ext — external process force from the cut, N. */
  externalForce: number;
  /** P — screw lead: the axis distance per screw revolution, mm. */
  lead: number;
  /** η — mechanical efficiency of screw and nut, 0 to 1. */
  efficiency: number;
  /** μ — guideway friction coefficient, dimensionless. */
  friction: number;
  orientation: AxisOrientation;
}

export interface ProfilePoint {
  /** Time from the start of the move, s. */
  t: number;
  /** Axis speed at that instant, m/s. */
  v: number;
}

export interface MotionProfile {
  shape: "trapezoidal" | "triangular";
  /** Speed actually reached, m/s. Below the commanded speed on a short move. */
  peakSpeed: number;
  /** Duration of each ramp, s. */
  rampTime: number;
  /** Duration of the constant-speed section, s. Zero on a triangular move. */
  cruiseTime: number;
  /** Whole move, start to standstill, s. */
  totalTime: number;
  points: ProfilePoint[];
}

export interface AxisResults {
  /** θ from the orientation selector, radians. */
  theta: number;
  /** v converted to SI, m/s. */
  speedSi: number;
  /** L converted to SI, m. */
  travelSi: number;
  /** P converted to metres, as the torque and inertia equations need it. */
  leadSi: number;
  /** m × g — the weight the guideways carry, N. */
  weight: number;
  /** F_a, N. */
  accelerationForce: number;
  /** F_f, N. */
  frictionForce: number;
  /** F_g, N. */
  gravityForce: number;
  /** F, N. */
  thrust: number;
  /** T, N·m at the screw shaft. */
  torque: number;
  /** n, rev/min at the screw. */
  motorSpeed: number;
  /** n expressed in SI, rad/s. */
  motorAngular: number;
  /** J_load, kg·m². */
  loadInertia: number;
  /** t from the trapezoidal formula of SPEC 9.2, s. */
  moveTime: number;
  profile: MotionProfile;
}

/* ------------------------------------------------------------------ *
 * The eight relationships of SPEC 9.2
 * ------------------------------------------------------------------ */

/** `F_a = m × a` — kg and m/s² in, newtons out. */
export function accelerationForce(mass: number, acceleration: number): number {
  return mass * acceleration;
}

/** `F_f = μ × m × g × cos θ` — θ in radians, g from format.ts. */
export function frictionForce(friction: number, mass: number, theta: number): number {
  return friction * mass * G * Math.cos(theta);
}

/** `F_g = m × g × sin θ` — zero on a horizontal axis, full weight on a vertical one. */
export function gravityForce(mass: number, theta: number): number {
  return mass * G * Math.sin(theta);
}

/** `F = F_a + F_f + F_g + F_ext` — all four demands, in newtons. */
export function totalThrust(
  acceleration: number,
  friction: number,
  gravity: number,
  external: number,
): number {
  return acceleration + friction + gravity + external;
}

/** `T = (F × P) / (2π × η)` — **P in metres**, T in N·m at the screw shaft. */
export function screwTorque(thrust: number, leadMetres: number, efficiency: number): number {
  return (thrust * leadMetres) / (2 * Math.PI * efficiency);
}

/** `n = (v × 1000) / P` — v in m/min and **P in millimetres**, n in rev/min. */
export function motorSpeed(speedMetresPerMinute: number, leadMillimetres: number): number {
  return (speedMetresPerMinute * 1000) / leadMillimetres;
}

/** `J_load = m × (P / 2π)²` — **P in metres**, J in kg·m² as seen at the screw. */
export function reflectedLoadInertia(mass: number, leadMetres: number): number {
  return mass * Math.pow(leadMetres / (2 * Math.PI), 2);
}

/**
 * `t = (L / v) + (v / a)` — **L in metres, v in m/s**, t in seconds.
 *
 * This is exact for a trapezoidal move that actually reaches the commanded
 * speed. Over a travel too short to get there it overstates the time, and
 * {@link velocityProfile} reports the triangular case instead.
 */
export function moveTime(
  travelMetres: number,
  speedMetresPerSecond: number,
  acceleration: number,
): number {
  return travelMetres / speedMetresPerSecond + speedMetresPerSecond / acceleration;
}

/* ------------------------------------------------------------------ *
 * Trapezoidal velocity profile sampler
 * ------------------------------------------------------------------ */

const EMPTY_PROFILE: MotionProfile = {
  shape: "trapezoidal",
  peakSpeed: 0,
  rampTime: 0,
  cruiseTime: 0,
  totalTime: 0,
  points: [],
};

/**
 * Sample the velocity profile of one move: accelerate at `a`, hold the
 * commanded speed, decelerate at `a` back to rest.
 *
 * If the travel is too short for the ramps to finish, the move is triangular —
 * the axis never reaches the commanded speed — and that is reported in `shape`.
 *
 * @param travelMetres      L, metres
 * @param speedMetresPerSecond v, metres per second
 * @param acceleration      a, metres per second squared
 * @param samples           roughly how many points to return
 */
export function velocityProfile(
  travelMetres: number,
  speedMetresPerSecond: number,
  acceleration: number,
  samples = 48,
): MotionProfile {
  if (
    ![travelMetres, speedMetresPerSecond, acceleration].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  ) {
    return EMPTY_PROFILE;
  }

  const rampDistance = (speedMetresPerSecond * speedMetresPerSecond) / (2 * acceleration);
  const reachesSpeed = 2 * rampDistance <= travelMetres;
  const peakSpeed = reachesSpeed
    ? speedMetresPerSecond
    : Math.sqrt(travelMetres * acceleration);
  const rampTime = peakSpeed / acceleration;
  const cruiseTime = reachesSpeed
    ? (travelMetres - 2 * rampDistance) / speedMetresPerSecond
    : 0;
  const totalTime = 2 * rampTime + cruiseTime;

  const rampSamples = Math.max(2, Math.round(samples / 4));
  const cruiseSamples = Math.max(2, Math.round(samples / 2));
  const points: ProfilePoint[] = [];
  const add = (t: number, v: number) => points.push({ t, v: Math.max(0, v) });

  for (let i = 0; i <= rampSamples; i += 1) {
    const t = (rampTime * i) / rampSamples;
    add(t, Math.min(peakSpeed, t * acceleration));
  }
  if (cruiseTime > 0) {
    for (let i = 1; i <= cruiseSamples; i += 1) {
      add(rampTime + (cruiseTime * i) / cruiseSamples, peakSpeed);
    }
  }
  for (let i = 1; i <= rampSamples; i += 1) {
    const elapsed = (rampTime * i) / rampSamples;
    add(rampTime + cruiseTime + elapsed, peakSpeed - elapsed * acceleration);
  }

  return { shape: reachesSpeed ? "trapezoidal" : "triangular", peakSpeed, rampTime, cruiseTime, totalTime, points };
}

/* ------------------------------------------------------------------ *
 * The whole chain
 * ------------------------------------------------------------------ */

export function axisResults(inputs: AxisInputs): AxisResults {
  const theta = AXIS_ANGLE[inputs.orientation];
  const speedSi = inputs.speed / 60;
  const travelSi = inputs.travel / 1000;
  const leadSi = inputs.lead / 1000;

  const fa = accelerationForce(inputs.mass, inputs.acceleration);
  const ff = frictionForce(inputs.friction, inputs.mass, theta);
  const fg = gravityForce(inputs.mass, theta);
  const thrust = totalThrust(fa, ff, fg, inputs.externalForce);
  const speed = motorSpeed(inputs.speed, inputs.lead);

  return {
    theta,
    speedSi,
    travelSi,
    leadSi,
    weight: inputs.mass * G,
    accelerationForce: fa,
    frictionForce: ff,
    gravityForce: fg,
    thrust,
    torque: screwTorque(thrust, leadSi, inputs.efficiency),
    motorSpeed: speed,
    motorAngular: rpmToRadPerSecond(speed),
    loadInertia: reflectedLoadInertia(inputs.mass, leadSi),
    moveTime: moveTime(travelSi, speedSi, inputs.acceleration),
    profile: velocityProfile(travelSi, speedSi, inputs.acceleration),
  };
}

/* ------------------------------------------------------------------ *
 * Display helper
 * ------------------------------------------------------------------ */

const SUPERSCRIPT_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function superscript(exponent: number): string {
  const digits = Math.abs(exponent)
    .toString()
    .split("")
    .map((d) => SUPERSCRIPT_DIGITS[Number(d)])
    .join("");
  return `${exponent < 0 ? "⁻" : ""}${digits}`;
}

/**
 * Reflected inertia is always a small number, and `formatNumber` in the frozen
 * `format.ts` would round 0.000633 kg·m² down to 0.0006. Scientific notation is
 * how a drive datasheet quotes it anyway.
 */
export function formatInertia(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  if (exponent === 0) return formatCalcValue(value, digits);
  const mantissa = significant(value / Math.pow(10, exponent), digits);
  return `${mantissa.toFixed(digits - 1)} × 10${superscript(exponent)}`;
}

/* ------------------------------------------------------------------ *
 * Guard rails
 * ------------------------------------------------------------------ */

export function axisWarnings(inputs: AxisInputs, results: AxisResults): CalcWarning[] {
  const warnings: CalcWarning[] = [];

  const positives = [
    inputs.mass,
    inputs.speed,
    inputs.acceleration,
    inputs.travel,
    inputs.lead,
    inputs.efficiency,
  ];
  if (
    !positives.every((v) => Number.isFinite(v) && v > 0) ||
    !Number.isFinite(inputs.externalForce) ||
    !Number.isFinite(inputs.friction)
  ) {
    warnings.push({
      id: "incomplete",
      title: "One or more inputs is not yet a usable number",
      detail:
        "Results show a dash until mass, speed, acceleration, travel, lead and efficiency are all greater than zero, and the process force and friction coefficient are numbers. Nothing is stopping you typing.",
    });
    return warnings;
  }

  if (inputs.efficiency > 1) {
    warnings.push({
      id: "efficiency-over-one",
      title: "Efficiency above 1 would mean the screw gives out more than it takes in",
      detail:
        "Efficiency is the fraction of the work you put into the screw that arrives at the load as useful thrust; the rest becomes heat in the balls, the raceway and the seals. A value above 1 makes the torque figure smaller than physics allows. Ball screws are efficient, but not free.",
    });
  }

  if (results.profile.shape === "triangular") {
    warnings.push({
      id: "never-reaches-speed",
      title: `Over ${formatCalcValue(inputs.travel, 4)} mm the axis never reaches ${formatCalcValue(inputs.speed)} m/min`,
      detail:
        `It runs out of travel first: the ramps meet in the middle, so the axis peaks at about ${formatCalcValue(results.profile.peakSpeed * 60)} m/min and immediately begins to slow. ` +
        `The trapezoidal move-time formula assumes a constant-speed section that does not exist here, so it overstates the move; the real time is about ${formatCalcValue(results.profile.totalTime)} s, and the chart shows a triangle rather than a trapezium. ` +
        "On short moves acceleration, not top speed, is what buys cycle time — which is why raising a machine's rapid rate often changes far less than the brochure suggests.",
    });
  }

  if (inputs.friction > 0.05) {
    warnings.push({
      id: "high-friction",
      title: `A friction coefficient of ${formatCalcValue(inputs.friction, 2)} is in sliding-contact territory`,
      detail:
        `It puts ${formatCalcValue(results.frictionForce, 3)} N of drag into the thrust, against ${formatCalcValue(results.accelerationForce, 3)} N to accelerate the mass. Rolling elements are normally an order of magnitude lower than this, and box ways with wipers and full-film lubrication are higher. ` +
        "Check which guideway you are actually describing before trusting the torque — friction that big changes the motor, and on a vertical axis it also changes what happens when the power goes off.",
    });
  }

  if (inputs.externalForce > results.accelerationForce * 4) {
    warnings.push({
      id: "process-force-dominates",
      title: "The cut, not the motion, is setting the size of this drive",
      detail:
        `The process force of ${formatCalcValue(inputs.externalForce, 4)} N dwarfs the ${formatCalcValue(results.accelerationForce, 4)} N needed to accelerate the mass. That is a legitimate machine — a heavy cutting machine rather than a fast one — but it means the argument has moved from inertia to stiffness. A force that size deflects the structure, the rails and the screw, and deflection lands directly on the part as a dimensional error.`,
    });
  }

  return warnings;
}

/* ------------------------------------------------------------------ *
 * Reference card, worked example, exclusions and the estimate note
 * ------------------------------------------------------------------ */

/** The canonical worked example of SPEC Phase 7, used as the default state. */
export const AXIS_WORKED_EXAMPLE: AxisInputs = {
  mass: 250,
  speed: 30,
  acceleration: 3,
  travel: 600,
  externalForce: 800,
  lead: 10,
  efficiency: 0.9,
  friction: 0.005,
  orientation: "horizontal",
};

export const AXIS_FORMULA: Formula = {
  expression: [
    "F_a = m × a",
    "F_f = μ × m × g × cos θ",
    "F_g = m × g × sin θ",
    "F   = F_a + F_f + F_g + F_ext",
    "T   = (F × P) / (2π × η)          P in metres",
    "n   = (v × 1000) / P              P in millimetres",
    "J   = m × (P / 2π)²               P in metres",
    "t   = (L / v) + (v / a)           L in metres, v in m/s",
  ].join("\n"),
  variables: [
    { symbol: "m", meaning: "Total moving mass, including fixture and workpiece", unit: "kg" },
    { symbol: "a", meaning: "Required acceleration", unit: "m/s²" },
    { symbol: "v", meaning: "Required traverse speed", unit: "m/min" },
    { symbol: "L", meaning: "Length of the move", unit: "mm" },
    { symbol: "μ", meaning: "Guideway friction coefficient", unit: "dimensionless" },
    { symbol: "g", meaning: "Standard gravity, 9.80665", unit: "m/s²" },
    {
      symbol: "θ",
      meaning: "Angle of the axis from horizontal — 0° horizontal, 90° vertical",
      unit: "degrees",
    },
    { symbol: "F_ext", meaning: "External process force from the cut", unit: "N" },
    { symbol: "F_a", meaning: "Force to accelerate the moving mass", unit: "N" },
    { symbol: "F_f", meaning: "Force to overcome guideway friction", unit: "N" },
    { symbol: "F_g", meaning: "Force to support weight along the direction of travel", unit: "N" },
    { symbol: "F", meaning: "Total thrust the drive must produce", unit: "N" },
    { symbol: "P", meaning: "Screw lead — axis distance per screw revolution", unit: "mm or m" },
    { symbol: "η", meaning: "Mechanical efficiency of the screw and nut", unit: "dimensionless" },
    { symbol: "T", meaning: "Torque required at the screw shaft", unit: "N·m" },
    { symbol: "n", meaning: "Screw speed at full traverse", unit: "rev/min" },
    { symbol: "J", meaning: "Reflected load inertia — the mass as the motor feels it", unit: "kg·m²" },
    { symbol: "t", meaning: "Time for one move, start to standstill", unit: "s" },
  ],
  meaning:
    "Read which term is in charge before choosing anything. If the acceleration force dominates you are designing a light, fast machine and the argument is about mass and inertia; if the process force dominates you are designing a heavy cutting machine and the argument is about stiffness. Watch the lead: it is in metres for torque and inertia and in millimetres for speed, and halving it halves the torque demand while doubling the motor speed needed for the same axis speed.",
};

export const AXIS_WORKED_INTRO =
  "The horizontal X axis of a small vertical machining centre. The moving mass is the table, the saddle, the fixture and the workpiece together; the process force is the heaviest cut the machine is expected to take. These are the numbers the calculator starts with, so the results above are this example.";

export const AXIS_WORKED_GIVENS: WorkedGiven[] = [
  { symbol: "m", value: "250 kg" },
  { symbol: "v", value: "30 m/min (0.5 m/s)" },
  { symbol: "a", value: "3 m/s²" },
  { symbol: "L", value: "600 mm (0.6 m)" },
  { symbol: "F_ext", value: "800 N" },
  { symbol: "P", value: "10 mm (0.010 m)" },
  { symbol: "η", value: "0.90" },
  { symbol: "μ", value: "0.005" },
  { symbol: "θ", value: "0° (horizontal)" },
];

export const AXIS_WORKED_STEPS: WorkedStep[] = [
  {
    label: "Acceleration force",
    expression: "F_a = 250 × 3",
    result: "750 N",
    note: "Usually the largest single demand on a fast machine, and it appears twice in every move: once to speed up and once to slow down.",
  },
  {
    label: "Friction force",
    expression: "F_f = 0.005 × 250 × 9.80665 × cos 0°",
    result: "12.3 N",
    note: "The weight has not vanished — the guideways carry all of it, which is exactly why it turns up inside the friction term rather than the gravity one.",
  },
  {
    label: "Gravity force",
    expression: "F_g = 250 × 9.80665 × sin 0°",
    result: "0 N",
    note: "Zero only because the axis lies horizontal. Stand the same axis upright and this becomes the largest of the four terms, present even at standstill.",
  },
  {
    label: "Total thrust",
    expression: "F = 750 + 12.3 + 0 + 800",
    result: "1562 N (1562.3)",
    note: "The cut and the acceleration are of almost equal size here, while friction contributes well under one per cent. That is the useful reading: these are the two numbers worth arguing about.",
  },
  {
    label: "Screw torque",
    expression: "T = (1562.3 × 0.010) / (2π × 0.90)",
    result: "2.76 N·m",
    note: "A modest motor. Halve the lead and the torque demand halves with it — at the price of doubling the speed the motor has to reach for the same axis speed.",
  },
  {
    label: "Screw speed",
    expression: "n = (30 × 1000) / 10",
    result: "3000 rev/min",
    note: "This, rather than the torque, is the demanding requirement on this axis. Note that the lead is in millimetres here and in metres in the torque line above.",
  },
  {
    label: "Reflected load inertia",
    expression: "J = 250 × (0.010 / 2π)²",
    result: "6.33 × 10⁻⁴ kg·m²",
    note: "The moving mass as the motor feels it: a flywheel on its own shaft. A drive engineer compares this with the motor's rotor inertia to judge how tunable the axis will be.",
  },
  {
    label: "Move time, end to end",
    expression: "t = (0.6 / 0.5) + (0.5 / 3)",
    result: "1.37 s (1.3667)",
    note: "A business number rather than an engineering one. It is worth shaving only once you multiply it by every rapid in every program across a year, and that argument should be made honestly rather than dressed up as accuracy.",
  },
];

export const AXIS_SI_NOTE =
  "Rev/min and m/min are the units a drive catalogue and a machine specification use, so the calculator uses them too — but they are not SI. The conversions are listed with the results above, and it is the SI values that go into the force, torque and move-time arithmetic. The lead is the trap: metres for torque and inertia, millimetres for speed.";

/** Everything this model leaves out. SPEC 9.2 requires these to be stated. */
export const AXIS_EXCLUSIONS: { title: string; detail: string }[] = [
  {
    title: "The inertia of the screw itself",
    detail:
      "Only the moving mass is reflected here. A long or thick screw can have more inertia than the load it is driving, and it is the total that a motor is matched against.",
  },
  {
    title: "Coupling, support-bearing and seal losses",
    detail:
      "Efficiency here covers the screw and nut alone. The coupling, the support bearings, the wipers and the way covers all take their share as well.",
  },
  {
    title: "Duty cycle",
    detail:
      "Nothing here distinguishes a peak from a continuous rating. A motor that can produce this torque for a moment may overheat producing it all day.",
  },
  {
    title: "Thermal limits",
    detail:
      "Heat in the motor, the drive and the screw sets a real ceiling, and it also moves the machine — a warm screw is a longer screw, and that lands on the part.",
  },
  {
    title: "Critical speed",
    detail:
      "A screw shaft has a bending frequency of its own. Approach it and the shaft whips and destroys itself, whatever the torque figure says.",
  },
  {
    title: "Column buckling",
    detail:
      "A screw loaded in compression can buckle. That is a property of its diameter, length and end fixing, and none of them appear above.",
  },
];

export const AXIS_ESTIMATE_NOTE =
  "This is an educational first estimate, not a selection. It is the textbook force build-up and nothing more, and the list of what it ignores is longer than the list of what it includes. A real axis selection is done with the screw and motor manufacturers' own sizing software against the full duty cycle, and reviewed by a qualified engineer before anything is ordered, built or operated.";

export const VERTICAL_AXIS_SAFETY =
  "A vertical axis is a suspended load. A ball screw is efficient in both directions, so it back-drives readily: remove the motor's holding torque and the head descends under its own weight, gathering speed, with whatever is below it in the way. Real machines fit a brake that engages when power is lost, often with a counterbalance as well, and that brake is a safety function that has to be specified, verified and periodically tested rather than assumed. Never work under a vertical axis that is held only electrically. Work on the drives, brakes and interlocks themselves must be carried out and verified by qualified personnel under the applicable standards and law.";
