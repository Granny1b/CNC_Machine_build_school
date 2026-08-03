/**
 * The interpreter: parsed lines in, machine state and toolpath out.
 *
 * Two ideas drive the whole file.
 *
 * The first is modality. A word set on one line stays in force until something
 * changes it, and that is the single thing beginners most often miss — so every
 * line gets an `ExecutedStep` carrying the state before it and the state after
 * it, including lines that do nothing at all. The UI can then scrub to any line
 * and show exactly what was in force there without re-running anything.
 *
 * The second is honesty about the edges of the model. This is a teaching model
 * of a control, not a control. Where it does not implement a code it says so by
 * name; where it cannot know something — a work offset, a tool length, what is
 * on the table — it refuses to invent it and says why. A simulation that
 * quietly skipped a code it did not understand would draw a path the machine
 * would never follow, which is worse than no simulation at all.
 *
 * Units: `G20` converts inches to millimetres here, at the boundary, so that
 * only millimetres and millimetres per minute reach anything downstream. That
 * conversion covers I, J, K and F as well as X, Y and Z.
 *
 * Nothing in this file can reach hardware. It is arithmetic over data.
 */

import type {
  Bounds,
  Diagnostic,
  ExecutedStep,
  IssueSeverity,
  MachineState,
  MotionMode,
  ParsedLine,
  PathSegment,
  Plane,
  SimulationOptions,
  Vec3,
} from "./types";
import { MM_PER_INCH, initialMachineState } from "./types";

const TAU = Math.PI * 2;

/**
 * How far apart the start radius and the end radius of an arc may be before
 * this model calls the arc mismatched, in millimetres. It is this teaching
 * model's own tolerance, chosen to be tight enough to catch a mistyped offset.
 * It is not a figure from any standard and it is not what any particular
 * control uses — real machines each have their own setting for this.
 */
export const ARC_TOLERANCE_MM = 0.01;

/** Moves shorter than this are treated as no move at all. */
const ZERO_LENGTH_MM = 1e-9;

/* ---------------- Code tables ---------------- */

/**
 * Modal groups. Two codes from one group in the same block contradict each
 * other, which is worth catching because the block still looks plausible.
 */
const G_MODAL_GROUP: Record<string, string> = {
  "0": "motion",
  "1": "motion",
  "2": "motion",
  "3": "motion",
  "33": "motion",
  "73": "motion",
  "74": "motion",
  "76": "motion",
  "80": "motion",
  "81": "motion",
  "82": "motion",
  "83": "motion",
  "84": "motion",
  "85": "motion",
  "86": "motion",
  "87": "motion",
  "88": "motion",
  "89": "motion",
  "17": "plane",
  "18": "plane",
  "19": "plane",
  "90": "distance",
  "91": "distance",
  "90.1": "arc-centre-mode",
  "91.1": "arc-centre-mode",
  "20": "units",
  "21": "units",
  "93": "feed-rate mode",
  "94": "feed-rate mode",
  "95": "feed-rate mode",
  "40": "cutter compensation",
  "41": "cutter compensation",
  "42": "cutter compensation",
  "43": "tool length offset",
  "43.1": "tool length offset",
  "44": "tool length offset",
  "49": "tool length offset",
  "54": "work offset",
  "55": "work offset",
  "56": "work offset",
  "57": "work offset",
  "58": "work offset",
  "59": "work offset",
  "61": "path control",
  "61.1": "path control",
  "64": "path control",
  "98": "canned cycle return",
  "99": "canned cycle return",
  "4": "one-shot",
  "28": "one-shot",
  "30": "one-shot",
  "53": "one-shot",
  "92": "one-shot",
};

/**
 * Codes in the one-shot group act on the block they appear in and then stop
 * being in force, so two of them in a block is a different kind of mistake from
 * two competing modes; the diagnostic says so in the right words.
 */
const ONE_SHOT_GROUP = "one-shot";

/**
 * Codes this model reads and then does nothing about, because doing nothing is
 * exactly right: each of these selects the behaviour the model already has.
 */
const G_ALREADY_TRUE = new Set([
  // Cutter radius compensation off — the model never offsets the path.
  "40",
  // Feed per minute — the only feed-rate mode the model has.
  "94",
  // Arc centres as offsets from the start point — what the model reads.
  "91.1",
  // Cancel canned cycle — the model never starts one.
  "80",
]);

/** Plain descriptions of codes the model does not implement. */
const G_DESCRIPTIONS: Record<string, string> = {
  "30": "returning to a second reference point",
  "31": "a skip move that stops early when a probe touches something",
  "33": "cutting a thread synchronised to the spindle",
  "41": "cutter radius compensation, which offsets the whole path to the left of the line you programmed",
  "42": "cutter radius compensation, which offsets the whole path to the right of the line you programmed",
  "43.1": "taking the tool length offset from this block rather than from the offset table",
  "50": "cancelling scaling",
  "51": "scaling the programmed coordinates",
  "52": "shifting to a local coordinate system",
  "53": "one move measured in machine coordinates instead of work coordinates",
  "61": "exact stop mode, where the machine comes to rest at every corner",
  "61.1": "exact stop mode",
  "64": "continuous path mode, where corners are rounded to keep the feed up",
  "65": "calling a macro",
  "66": "calling a macro that stays in force",
  "68": "rotating the coordinate system",
  "69": "cancelling coordinate system rotation",
  "73": "a high-speed peck drilling cycle",
  "74": "a left-hand tapping cycle",
  "76": "a fine boring cycle",
  "81": "a drilling cycle",
  "82": "a drilling cycle that dwells at the bottom",
  "83": "a deep-hole peck drilling cycle",
  "84": "a tapping cycle",
  "85": "a boring cycle",
  "86": "a boring cycle that stops the spindle at the bottom",
  "87": "a back boring cycle",
  "88": "a boring cycle with a dwell and a manual retract",
  "89": "a boring cycle that dwells at the bottom",
  "90.1": "reading arc centres as absolute coordinates rather than offsets",
  "92": "setting a coordinate system offset from wherever the tool happens to be",
  "92.1": "clearing a coordinate system offset",
  "93": "inverse time feed, where F says how long the move should take",
  "95": "feed per revolution rather than feed per minute",
  "96": "constant surface speed, where the spindle speed changes with diameter",
  "97": "constant spindle speed",
  "98": "retracting to the initial level at the end of each hole in a canned cycle",
  "99": "retracting to the R level at the end of each hole in a canned cycle",
};

/** Codes whose absence changes the drawn path, not merely the timing. */
const G_GEOMETRY_CHANGING = new Set([
  "30",
  "31",
  "33",
  "41",
  "42",
  "43.1",
  "51",
  "52",
  "53",
  "65",
  "66",
  "68",
  "73",
  "74",
  "76",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "90.1",
  "92",
]);

/** Codes that change nothing this model represents at all. */
const G_NO_EFFECT_HERE = new Set(["50", "61", "61.1", "64", "69", "92.1", "96", "97", "98", "99"]);

const M_DESCRIPTIONS: Record<string, string> = {
  "19": "turning the spindle to a fixed angular position and holding it there",
  "29": "rigid tapping, where the spindle and the Z axis are locked together",
  "48": "enabling the feed and speed override switches",
  "49": "disabling the feed and speed override switches",
  "98": "calling a subprogram",
  "99": "returning from a subprogram",
};

/** Address letters the interpreter reads, or knowingly leaves to other parts. */
const KNOWN_ADDRESSES = new Set([
  "G",
  "M",
  "X",
  "Y",
  "Z",
  "I",
  "J",
  "K",
  "R",
  "F",
  "S",
  "T",
  "P",
  // Read elsewhere or carried for display only.
  "N",
  "O",
  "H",
  "D",
  "L",
  "Q",
]);

const ROTARY_ADDRESSES = new Set(["A", "B", "C"]);
const SECOND_LINEAR_ADDRESSES = new Set(["U", "V", "W"]);

/* ---------------- Geometry helpers ---------------- */

interface PlaneAxes {
  /** First axis of the plane, in the right-handed order the arc maths needs. */
  u: keyof Vec3;
  /** Second axis of the plane. */
  v: keyof Vec3;
  /** Axis normal to the plane, which a helix travels along. */
  w: keyof Vec3;
  /** Centre-offset word belonging to `u`. */
  uOffset: "I" | "J" | "K";
  /** Centre-offset word belonging to `v`. */
  vOffset: "I" | "J" | "K";
  /** Centre-offset word belonging to `w`, which cannot describe a centre. */
  wOffset: "I" | "J" | "K";
}

/**
 * (X, Y, Z), (Z, X, Y) and (Y, Z, X) are the right-handed orderings, which is
 * what makes one rule cover all three planes: G2 always sweeps in the direction
 * of decreasing angle in the (u, v) pair below, and G3 always increasing.
 */
const PLANE_AXES: Record<Plane, PlaneAxes> = {
  XY: { u: "x", v: "y", w: "z", uOffset: "I", vOffset: "J", wOffset: "K" },
  ZX: { u: "z", v: "x", w: "y", uOffset: "K", vOffset: "I", wOffset: "J" },
  YZ: { u: "y", v: "z", w: "x", uOffset: "J", vOffset: "K", wOffset: "I" },
};

function cloneState(state: MachineState): MachineState {
  return { ...state, position: { ...state.position } };
}

function distance3(a: Vec3, b: Vec3): number {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}

function growBounds(bounds: Bounds | null, point: Vec3): Bounds {
  if (!bounds) return { min: { ...point }, max: { ...point } };
  return {
    min: {
      x: Math.min(bounds.min.x, point.x),
      y: Math.min(bounds.min.y, point.y),
      z: Math.min(bounds.min.z, point.z),
    },
    max: {
      x: Math.max(bounds.max.x, point.x),
      y: Math.max(bounds.max.y, point.y),
      z: Math.max(bounds.max.z, point.z),
    },
  };
}

/** Three decimals, the resolution a millimetre readout conventionally shows. */
function mm(value: number): string {
  return value.toFixed(3);
}

/* ---------------- Arcs ---------------- */

interface ArcGeometry {
  centre: Vec3;
  radius: number;
  /** Angle of the start point about the centre, in the plane's (u, v) pair. */
  startAngle: number;
  /** Signed swept angle: negative clockwise, positive anticlockwise. */
  sweep: number;
  /** True arc length in millimetres, including any travel along the normal. */
  length: number;
}

interface ArcFailure {
  code: string;
  severity: IssueSeverity;
  message: string;
  consequence: string;
  fix: string;
}

type ArcResult =
  | { ok: true; geometry: ArcGeometry; warnings: ArcFailure[] }
  | { ok: false; problem: ArcFailure };

/**
 * Work out the circle an arc block describes.
 *
 * Two formats are in common use and both are supported. Centre format gives
 * I, J and K as offsets from the start point to the centre. Radius format gives
 * R, and the sign of R chooses between the two arcs that fit: positive takes
 * the shorter way round, negative the longer.
 */
function solveArc(
  from: Vec3,
  to: Vec3,
  plane: Plane,
  offsets: { I?: number; J?: number; K?: number },
  radiusWord: number | undefined,
  clockwise: boolean,
): ArcResult {
  const axes = PLANE_AXES[plane];
  const warnings: ArcFailure[] = [];

  const su = from[axes.u];
  const sv = from[axes.v];
  const eu = to[axes.u];
  const ev = to[axes.v];
  const chord = Math.hypot(eu - su, ev - sv);
  const closed = chord < 1e-9;

  const offsetU = offsets[axes.uOffset];
  const offsetV = offsets[axes.vOffset];
  const offsetW = offsets[axes.wOffset];
  const hasCentreWords = offsetU !== undefined || offsetV !== undefined;

  if (offsetW !== undefined) {
    warnings.push({
      code: "arc-offset-outside-plane",
      severity: "warning",
      message: `“${axes.wOffset}” gives an offset along the axis at right angles to the ${plane} plane, so it cannot help describe this arc's centre.`,
      consequence:
        "This model ignores it and uses the other two offsets. Some controls read the third offset as a helix pitch instead, so the same block can mean different things on different machines.",
      fix: `Describe the centre with “${axes.uOffset}” and “${axes.vOffset}” only, and let the end point set the height the helix climbs to.`,
    });
  }

  let centreU: number;
  let centreV: number;

  if (radiusWord !== undefined) {
    if (hasCentreWords) {
      warnings.push({
        code: "arc-r-and-offsets",
        severity: "warning",
        message: "This arc gives both a radius and centre offsets.",
        consequence:
          "The two can easily describe different circles. Controls resolve the conflict differently, so the block does not have one meaning; this model uses R and ignores the offsets.",
        fix: "Delete whichever you did not mean. Centre offsets are the safer of the two, because they say exactly where the centre is.",
      });
    }

    if (closed) {
      return {
        ok: false,
        problem: {
          code: "full-circle-with-radius",
          severity: "error",
          message: "This arc starts and ends at the same point, and it uses R to give the radius.",
          consequence:
            "R says how big the circle is, not where its centre is, so a start point that is also the end point leaves the centre undetermined. A control cannot choose, and stops.",
          fix: "Write a full circle with centre offsets — I and J in the XY plane — which fix the centre exactly. Or split the circle into two half arcs.",
        },
      };
    }

    const magnitude = Math.abs(radiusWord);
    const half = chord / 2;
    if (magnitude + ARC_TOLERANCE_MM < half) {
      return {
        ok: false,
        problem: {
          code: "arc-radius-too-small",
          severity: "error",
          message: `The radius R${mm(magnitude)} mm is too small to reach from the start point to the end point, which are ${mm(chord)} mm apart.`,
          consequence:
            "No circle of that radius passes through both points, so there is no arc to cut. The control stops on the block.",
          fix: `The radius must be at least half the distance between the two points — ${mm(half)} mm here. Check the end point as well as the radius; one of the two is usually a typing mistake.`,
        },
      };
    }

    const height = Math.sqrt(Math.max(0, magnitude * magnitude - half * half));
    const midU = (su + eu) / 2;
    const midV = (sv + ev) / 2;
    // Unit vector along the chord, turned a quarter turn anticlockwise.
    const normalU = -(ev - sv) / chord;
    const normalV = (eu - su) / chord;
    // Anticlockwise with a positive R takes the short way round, which puts the
    // centre on this side; clockwise, or a negative R, flips it.
    const side = (clockwise ? -1 : 1) * (radiusWord < 0 ? -1 : 1);
    centreU = midU + side * height * normalU;
    centreV = midV + side * height * normalV;
  } else if (hasCentreWords) {
    centreU = su + (offsetU ?? 0);
    centreV = sv + (offsetV ?? 0);
  } else {
    return {
      ok: false,
      problem: {
        code: "arc-without-centre",
        severity: "error",
        message: "This arc says nothing about where its centre is.",
        consequence:
          "An arc needs either offsets to its centre or a radius. Without one of them there is no curve to follow, and the control stops on the block. Unlike a feed rate, arc words are not modal, so an earlier block cannot supply them.",
        fix: `In the ${plane} plane, give “${axes.uOffset}” and “${axes.vOffset}” as the distance from the start point to the centre, or give “R” and let the sign choose the short or the long way round.`,
      },
    };
  }

  const startRadius = Math.hypot(su - centreU, sv - centreV);
  const endRadius = Math.hypot(eu - centreU, ev - centreV);

  if (startRadius < 1e-9) {
    return {
      ok: false,
      problem: {
        code: "arc-zero-radius",
        severity: "error",
        message: "The centre this block describes is the point the tool is already standing on.",
        consequence:
          "A circle of no radius is not a path. The control stops rather than turning the block into a dwell.",
        fix: "Check the centre offsets. They are measured from the start of the arc to the centre, not from part zero, so a centre at the start point usually means they were written as absolute coordinates.",
      },
    };
  }

  if (Math.abs(startRadius - endRadius) > ARC_TOLERANCE_MM) {
    warnings.push({
      code: "arc-endpoint-mismatch",
      severity: "error",
      message: `The start point is ${mm(startRadius)} mm from the centre these offsets give, but the end point is ${mm(endRadius)} mm from it — a difference of ${mm(Math.abs(startRadius - endRadius))} mm.`,
      consequence:
        "The end point is not on the circle, so there is no arc joining the two. A control checks this and stops on the block; the arc drawn here splits the difference so that you can see roughly where the mistake is.",
      fix: "Recheck the offsets and the end point together. I and J are measured from the start of the arc to the centre — writing them from part zero instead is the usual cause.",
    });
  }

  const radius = (startRadius + endRadius) / 2;
  const startAngle = Math.atan2(sv - centreV, su - centreU);
  let sweep: number;

  if (closed) {
    // Start and end at the same point with centre offsets: a full circle.
    sweep = clockwise ? -TAU : TAU;
  } else {
    const endAngle = Math.atan2(ev - centreV, eu - centreU);
    sweep = endAngle - startAngle;
    if (clockwise) {
      while (sweep >= 0) sweep -= TAU;
    } else {
      while (sweep <= 0) sweep += TAU;
    }
  }

  const alongNormal = to[axes.w] - from[axes.w];
  const inPlaneLength = Math.abs(sweep) * radius;
  const length = Math.hypot(inPlaneLength, alongNormal);

  const centre: Vec3 = { x: 0, y: 0, z: 0 };
  centre[axes.u] = centreU;
  centre[axes.v] = centreV;
  // A helix has an axis rather than a centre point; the start height is the
  // useful value for drawing the arc in its own plane.
  centre[axes.w] = from[axes.w];

  return { ok: true, geometry: { centre, radius, startAngle, sweep, length }, warnings };
}

/**
 * The points where an arc reaches furthest out. An arc can bulge past both of
 * its end points, so bounds taken from end points alone are wrong — this is why
 * a part looks like it fits the stock right up until it does not.
 */
function arcExtremes(from: Vec3, to: Vec3, plane: Plane, geometry: ArcGeometry): Vec3[] {
  const axes = PLANE_AXES[plane];
  const total = Math.abs(geometry.sweep);
  if (total <= 0) return [];

  const points: Vec3[] = [];
  for (let quadrant = 0; quadrant < 4; quadrant += 1) {
    const angle = (quadrant * Math.PI) / 2;
    let travelled = geometry.sweep > 0 ? angle - geometry.startAngle : geometry.startAngle - angle;
    travelled = ((travelled % TAU) + TAU) % TAU;
    if (travelled > total + 1e-9) continue;

    const fraction = travelled / total;
    const point: Vec3 = { x: 0, y: 0, z: 0 };
    point[axes.u] = geometry.centre[axes.u] + geometry.radius * Math.cos(angle);
    point[axes.v] = geometry.centre[axes.v] + geometry.radius * Math.sin(angle);
    point[axes.w] = from[axes.w] + (to[axes.w] - from[axes.w]) * fraction;
    points.push(point);
  }
  return points;
}

/* ---------------- Execution ---------------- */

interface Runtime {
  options: Required<SimulationOptions>;
  diagnostics: Diagnostic[];
  segments: PathSegment[];
  /** Segments produced by the line being executed. */
  current: PathSegment[];
  bounds: Bounds | null;
  cuttingDistance: number;
  minutes: number;
  /** Diagnostic codes already raised once, for the notes that only need saying once. */
  said: Set<string>;
}

function report(runtime: Runtime, diagnostic: Diagnostic): void {
  runtime.diagnostics.push(diagnostic);
}

/** Raise a diagnostic the first time it applies and never again. */
function reportOnce(runtime: Runtime, diagnostic: Diagnostic): void {
  if (runtime.said.has(diagnostic.code)) return;
  runtime.said.add(diagnostic.code);
  runtime.diagnostics.push(diagnostic);
}

function addSegment(runtime: Runtime, state: MachineState, segment: PathSegment): void {
  runtime.segments.push(segment);
  runtime.current.push(segment);

  if (segment.kind === "rapid") {
    const rate = runtime.options.assumedRapidRate;
    if (rate > 0) runtime.minutes += segment.length / rate;
  } else {
    runtime.cuttingDistance += segment.length;
    if (state.feed > 0) {
      runtime.minutes += segment.length / state.feed;
    } else {
      reportOnce(runtime, {
        lineIndex: segment.lineIndex,
        severity: "error",
        code: "no-feed-rate",
        message: "This is a cutting move, and no feed rate has been set yet.",
        consequence:
          "A control has nothing to move at, so it stops rather than choosing a speed on your behalf. The time estimate below leaves this move out, so the estimate is short as well as the program being wrong.",
        fix: "Put an F word on this line or on an earlier one — F is modal, so one F before the first cut covers every cut that follows until you change it.",
      });
    }
  }
}

function emitLinear(
  runtime: Runtime,
  state: MachineState,
  from: Vec3,
  to: Vec3,
  kind: "rapid" | "feed",
  lineIndex: number,
): void {
  const length = distance3(from, to);
  if (length < ZERO_LENGTH_MM) return;

  addSegment(runtime, state, {
    kind,
    from: { ...from },
    to: { ...to },
    plane: state.plane,
    lineIndex,
    feed: kind === "feed" ? state.feed : 0,
    length,
  });

  runtime.bounds = growBounds(growBounds(runtime.bounds, from), to);
}

function emitArc(
  runtime: Runtime,
  state: MachineState,
  from: Vec3,
  to: Vec3,
  kind: "arc-cw" | "arc-ccw",
  lineIndex: number,
  geometry: ArcGeometry,
): void {
  if (geometry.length < ZERO_LENGTH_MM) return;

  addSegment(runtime, state, {
    kind,
    from: { ...from },
    to: { ...to },
    centre: { ...geometry.centre },
    radius: geometry.radius,
    plane: state.plane,
    lineIndex,
    feed: state.feed,
    length: geometry.length,
  });

  runtime.bounds = growBounds(growBounds(runtime.bounds, from), to);
  for (const point of arcExtremes(from, to, state.plane, geometry)) {
    runtime.bounds = growBounds(runtime.bounds, point);
  }
}

/** `G01` from a value of 1, `G43.1` from 43.1 — a stable key for the tables. */
function codeKey(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function unsupportedG(runtime: Runtime, key: string, lineIndex: number): void {
  const description = G_DESCRIPTIONS[key];
  const severity: IssueSeverity = G_GEOMETRY_CHANGING.has(key)
    ? "error"
    : G_NO_EFFECT_HERE.has(key)
      ? "note"
      : "warning";

  const named = description
    ? `G${key} asks for ${description}, and this teaching model does not implement it.`
    : `This teaching model does not implement G${key}, and cannot tell you what your control does with it.`;

  const consequence = G_NO_EFFECT_HERE.has(key)
    ? "Nothing this model draws or counts is affected, because the model does not represent what the code changes. On a machine it does change something, so read it in your control's manual rather than treating it as decoration."
    : G_GEOMETRY_CHANGING.has(key)
      ? "The line is read and then skipped, so from here on the path drawn below is not the path the machine would follow. Treat everything after this line as unreliable."
      : "The line is read and then skipped, so the machine's behaviour from here on differs from what is drawn below.";

  report(runtime, {
    lineIndex,
    severity,
    code: `unsupported-g${key}`,
    message: named,
    consequence,
    fix: "Look the code up in the programming manual for your control. To see the motion here, write it out as G0, G1, G2 and G3 moves — which is also the fastest way to understand what the code was doing for you.",
  });
}

function unsupportedM(runtime: Runtime, key: string, lineIndex: number): void {
  const description = M_DESCRIPTIONS[key];
  const severity: IssueSeverity = key === "98" || key === "99" ? "error" : "warning";

  report(runtime, {
    lineIndex,
    severity,
    code: `unsupported-m${key}`,
    message: description
      ? `M${key} asks for ${description}, and this teaching model does not implement it.`
      : `This teaching model does not implement M${key}. Beyond the common few, M codes are chosen by the machine builder, so the same number means different things on different machines.`,
    consequence:
      key === "98" || key === "99"
        ? "Subprogram calls decide which blocks actually run. This model runs the file straight through from top to bottom, so what is drawn below is not what the machine would do."
        : "The line is read and then skipped here. On the machine it does something, and this model cannot tell you what.",
    fix:
      key === "98" || key === "99"
        ? "Paste the subprogram's blocks in place of the call to see them run here."
        : "Check the M code list in the manual for your specific machine, not a general G-code reference.",
  });
}

interface Block {
  gCodes: string[];
  mCodes: string[];
  /** Last value seen for each non-G, non-M address, as written. */
  values: Partial<Record<string, number>>;
}

function readBlock(line: ParsedLine): Block {
  const gCodes: string[] = [];
  const mCodes: string[] = [];
  const values: Partial<Record<string, number>> = {};

  for (const word of line.words) {
    if (word.letter === "G") gCodes.push(codeKey(word.value));
    else if (word.letter === "M") mCodes.push(codeKey(word.value));
    // A repeated address is reported by the parser; the last one wins here,
    // which is one of the things a control might do and at least is defined.
    else values[word.letter] = word.value;
  }

  return { gCodes, mCodes, values };
}

function checkModalConflicts(runtime: Runtime, gCodes: string[], lineIndex: number): void {
  const byGroup = new Map<string, string[]>();
  for (const key of gCodes) {
    const group = G_MODAL_GROUP[key];
    if (!group) continue;
    const existing = byGroup.get(group);
    if (existing) existing.push(key);
    else byGroup.set(group, [key]);
  }

  byGroup.forEach((keys, group) => {
    const distinct = Array.from(new Set(keys));
    if (distinct.length < 2) return;
    const written = distinct.map((key) => `G${key}`).join(" and ");

    if (group === ONE_SHOT_GROUP) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "conflicting-modes",
        message: `${written} each take over the whole block, and this block has both.`,
        consequence:
          "Each of them decides on its own what the block does, so together they have no agreed meaning. A control either alarms or acts on one of the two without saying which.",
        fix: "Give each one a line of its own, written in the order you want them to happen.",
      });
      return;
    }

    report(runtime, {
      lineIndex,
      severity: "error",
      code: "conflicting-modes",
      message: `${written} both set the ${group} mode, and they contradict each other in one block.`,
      consequence:
        "Only one of them can be in force. A control either alarms or silently keeps one of the two, and the line gives you no way to tell which — this model keeps the last one written.",
      fix: "Delete the one you did not mean. If you genuinely need both, they belong on separate lines, in the order you want them applied.",
    });
  });
}

function motionModeFor(key: string): MotionMode | null {
  if (key === "0") return "rapid";
  if (key === "1") return "feed";
  if (key === "2") return "arc-cw";
  if (key === "3") return "arc-ccw";
  return null;
}

/**
 * Run one block against the live state, mutating it and pushing any segments,
 * diagnostics and time onto the runtime.
 */
function executeBlock(runtime: Runtime, state: MachineState, line: ParsedLine): void {
  const block = readBlock(line);
  const lineIndex = line.index;

  checkModalConflicts(runtime, block.gCodes, lineIndex);

  for (const word of line.words) {
    if (KNOWN_ADDRESSES.has(word.letter)) continue;
    if (ROTARY_ADDRESSES.has(word.letter)) {
      reportOnce(runtime, {
        lineIndex,
        severity: "warning",
        code: `unsupported-address-${word.letter}`,
        message: `“${word.letter}” commands a rotary axis, and this model has only the three linear axes X, Y and Z.`,
        consequence:
          "Rotary words are read and ignored here, so any part of the path that depends on the table or the head turning is missing from the drawing below.",
        fix: "Use this model for the three-axis parts of the program. A rotary axis changes where the tool points as well as where it is, and nothing here represents that.",
      });
      continue;
    }
    if (SECOND_LINEAR_ADDRESSES.has(word.letter)) {
      reportOnce(runtime, {
        lineIndex,
        severity: "warning",
        code: `unsupported-address-${word.letter}`,
        message: `“${word.letter}” is not an address this model reads. On many controls it commands a second set of linear axes, or an incremental move on a lathe.`,
        consequence: "The word is ignored here, so any motion it commands is missing from the path.",
        fix: "Rewrite the move using X, Y and Z if you want to see it here, and check the manual for what the letter means on your machine.",
      });
      continue;
    }
    reportOnce(runtime, {
      lineIndex,
      severity: "warning",
      code: `unsupported-address-${word.letter}`,
      message: `This model does not know what the address letter “${word.letter}” means.`,
      consequence: "The word is read and ignored, so whatever it was setting is not represented here.",
      fix: "Check the address against the programming manual for your control.",
    });
  }

  /* --- Modal settings, in the order written so the last one wins. --- */

  let motionKey: string | null = null;
  let referenceReturn = false;
  let dwell = false;

  for (const key of block.gCodes) {
    switch (key) {
      case "0":
      case "1":
      case "2":
      case "3":
        motionKey = key;
        break;
      case "4":
        dwell = true;
        break;
      case "17":
        state.plane = "XY";
        break;
      case "18":
        state.plane = "ZX";
        break;
      case "19":
        state.plane = "YZ";
        break;
      case "20":
        state.units = "inch";
        break;
      case "21":
        state.units = "mm";
        break;
      case "28":
        referenceReturn = true;
        break;
      case "43":
      case "44":
        state.toolLengthOffset = true;
        reportOnce(runtime, {
          lineIndex,
          severity: "note",
          code: "tool-length-not-modelled",
          message:
            "G43 applies the length stored for a tool, and the H word says which stored length to use. This model records that the offset is switched on; it does not know any tool's length.",
          consequence:
            "Z in the readout below is the Z your program commands, not the height the tool tip would actually reach. Getting the H number wrong is one of the classic ways to crash a machine, and nothing here can catch it.",
          fix: "Check the H number against the tool you have actually loaded, on the machine, before the program runs. That check belongs at the control, not in a simulation.",
        });
        break;
      case "49":
        state.toolLengthOffset = false;
        break;
      case "54":
      case "55":
      case "56":
      case "57":
      case "58":
      case "59":
        state.workOffset = `G${key}`;
        reportOnce(runtime, {
          lineIndex,
          severity: "note",
          code: "work-offset-not-applied",
          message:
            "A work offset says where on the table the part is clamped. That figure lives in the control, not in the program, so this model records which offset is selected and applies nothing.",
          consequence:
            "Every coordinate drawn and read out below is a work coordinate — a distance from part zero. It is not where the tool would be on the machine's own scales.",
          fix: "Set and check the offset at the control against the part actually clamped on the table. Nothing here can stand in for measuring it.",
        });
        break;
      case "90":
        state.distance = "absolute";
        break;
      case "91":
        state.distance = "incremental";
        break;
      default:
        if (!G_ALREADY_TRUE.has(key)) unsupportedG(runtime, key, lineIndex);
        break;
    }
  }

  /* --- Convert this block's numbers to millimetres. --- */

  const scale = state.units === "inch" ? MM_PER_INCH : 1;
  const scaled = (letter: string): number | undefined => {
    const value = block.values[letter];
    return value === undefined ? undefined : value * scale;
  };

  const axisX = scaled("X");
  const axisY = scaled("Y");
  const axisZ = scaled("Z");
  const offsets = { I: scaled("I"), J: scaled("J"), K: scaled("K") };
  const radiusWord = scaled("R");

  /* --- Feed, speed and tool. --- */

  const feedWord = scaled("F");
  if (feedWord !== undefined) {
    if (feedWord < 0) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "negative-feed",
        message: "A feed rate cannot be negative.",
        consequence:
          "Feed is a speed along the path; the direction comes from the coordinates. A control stops on this rather than reversing the move. The previous feed rate is still in force here.",
        fix: "Write the feed as a positive number, and change the end point if you meant to cut the other way.",
      });
    } else if (feedWord === 0) {
      state.feed = 0;
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "zero-feed",
        message: "F0 asks the machine to cut at no feed at all.",
        consequence:
          "The tool would sit in the cut without ever advancing, rubbing rather than cutting, until something gave. There is no reading of the block that is safe to run.",
        fix: "Set a real feed rate. The machining calculator on this site works one out from the spindle speed, the number of flutes and the feed per tooth.",
      });
    } else {
      state.feed = feedWord;
    }
  }

  const speedWord = block.values.S;
  if (speedWord !== undefined) {
    if (speedWord < 0) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "negative-speed",
        message: "A spindle speed cannot be negative.",
        consequence:
          "The direction of rotation comes from M3 or M4, not from the sign of S. A control stops on this. The previous speed is still in force here.",
        fix: "Write S as a positive number and use M4 if you wanted the spindle to turn the other way.",
      });
    } else {
      state.spindleSpeed = speedWord;
    }
  }

  const toolWord = block.values.T;
  if (toolWord !== undefined) {
    if (toolWord < 0 || !Number.isInteger(toolWord)) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "invalid-tool-number",
        message: `“T${toolWord}” is not a tool number this model can use — tool numbers are whole numbers, zero or above.`,
        consequence: "The control has no such pocket to go to, so the block stops the program.",
        fix: "Write the tool number as a whole number matching a pocket in the machine's carousel.",
      });
    } else {
      state.tool = toolWord;
    }
  }

  /* --- M codes that set up the machine, before anything moves. --- */

  const endingCodes: string[] = [];
  for (const key of block.mCodes) {
    switch (key) {
      case "0":
      case "1":
      case "2":
      case "30":
        endingCodes.push(key);
        break;
      case "3":
        state.spindle = "cw";
        break;
      case "4":
        state.spindle = "ccw";
        break;
      case "5":
        state.spindle = "off";
        break;
      case "6":
        // Selecting a tool with T and changing to it with M6 are two separate
        // jobs; T has already set the tool number above.
        break;
      case "7":
      case "8":
        state.coolant = true;
        break;
      case "9":
        state.coolant = false;
        break;
      default:
        unsupportedM(runtime, key, lineIndex);
        break;
    }
  }

  /* --- Dwell. --- */

  if (dwell) {
    const seconds = block.values.P;
    if (seconds === undefined) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "dwell-without-time",
        message: "G4 asks the machine to pause, and this block does not say for how long.",
        consequence: "The control has no duration to wait for, so it stops on the block.",
        fix: "Add a P word — this model reads P as a number of seconds.",
      });
    } else if (seconds < 0) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "negative-dwell",
        message: "A dwell time cannot be negative.",
        consequence: "There is no such pause, so the control stops on the block.",
        fix: "Write the dwell time as a positive number of seconds.",
      });
    } else {
      runtime.minutes += seconds / 60;
      reportOnce(runtime, {
        lineIndex,
        severity: "note",
        code: "dwell-units",
        message:
          "This model reads the P word of a dwell as seconds, so P2 is a two second pause.",
        consequence:
          "Controls differ on this: on some, the same P is read as milliseconds, which makes P2 a two thousandth of a second pause instead. The estimated time below assumes seconds.",
        fix: "Check which your control uses before relying on a dwell — the difference is a factor of a thousand.",
      });
    }

    if (axisX !== undefined || axisY !== undefined || axisZ !== undefined) {
      report(runtime, {
        lineIndex,
        severity: "warning",
        code: "dwell-with-motion",
        message: "This block asks for a dwell and also carries axis words.",
        consequence:
          "A pause and a move in one block is ambiguous, and controls resolve it differently. This model performs the dwell and ignores the axis words, so the move you wrote does not appear in the path.",
        fix: "Put the dwell on a line of its own, before or after the move, so the order is written down.",
      });
    }
  }

  /* --- Motion. --- */

  const from = { ...state.position };
  const hasAxisWord = axisX !== undefined || axisY !== undefined || axisZ !== undefined;

  const target = (current: number, commanded: number | undefined): number => {
    if (commanded === undefined) return current;
    return state.distance === "incremental" ? current + commanded : commanded;
  };

  if (referenceReturn && !dwell) {
    // G28 sends the tool to the machine's own reference point, by way of an
    // intermediate point if the block names one. This model applies no work
    // offsets, so its coordinates and the machine's coincide and the reference
    // point sits at X0 Y0 Z0 — which is stated below rather than implied.
    if (hasAxisWord) {
      const intermediate: Vec3 = {
        x: target(from.x, axisX),
        y: target(from.y, axisY),
        z: target(from.z, axisZ),
      };
      emitLinear(runtime, state, from, intermediate, "rapid", lineIndex);
      state.position = intermediate;
    }

    const reference: Vec3 = { ...state.position };
    if (hasAxisWord) {
      if (axisX !== undefined) reference.x = 0;
      if (axisY !== undefined) reference.y = 0;
      if (axisZ !== undefined) reference.z = 0;
    } else {
      reference.x = 0;
      reference.y = 0;
      reference.z = 0;
    }

    emitLinear(runtime, state, state.position, reference, "rapid", lineIndex);
    state.position = reference;
    // A control leaves rapid in force after a reference return, and so does
    // this model; do not rely on it in your own programs — say what you mean on
    // the next line.
    state.motion = "rapid";

    reportOnce(runtime, {
      lineIndex,
      severity: "note",
      code: "reference-return-modelled",
      message:
        "G28 sends the tool to the machine's own reference point — a fixed position built into the machine, not a position in your program.",
      consequence:
        "Because this model applies no work offsets, it can only draw that reference at X0 Y0 Z0. On a machine the reference point sits wherever the builder put it, and where that falls relative to your part depends on the work offset in the control.",
      fix: "Treat the drawn move as showing that the tool goes away to a fixed place, not where that place is. Never use a G28 in Z as a substitute for retracting to a height you have chosen yourself.",
    });
  } else if (!dwell) {
    if (motionKey) {
      const mode = motionModeFor(motionKey);
      if (mode) state.motion = mode;
    }

    const isArc = state.motion === "arc-cw" || state.motion === "arc-ccw";
    const hasArcWords =
      offsets.I !== undefined ||
      offsets.J !== undefined ||
      offsets.K !== undefined ||
      radiusWord !== undefined;
    const shouldMove = hasAxisWord || (isArc && hasArcWords);

    if (shouldMove) {
      const to: Vec3 = {
        x: target(from.x, axisX),
        y: target(from.y, axisY),
        z: target(from.z, axisZ),
      };

      if (isArc) {
        const clockwise = state.motion === "arc-cw";
        const result = solveArc(from, to, state.plane, offsets, radiusWord, clockwise);
        if (result.ok) {
          for (const warning of result.warnings) {
            report(runtime, { lineIndex, ...warning });
          }
          emitArc(runtime, state, from, to, clockwise ? "arc-cw" : "arc-ccw", lineIndex, result.geometry);
          state.position = to;
        } else {
          report(runtime, { lineIndex, ...result.problem });
          // The arc could not be worked out, so nothing is drawn and the tool
          // is left where it was rather than teleported to the end point.
        }
      } else {
        emitLinear(runtime, state, from, to, state.motion === "rapid" ? "rapid" : "feed", lineIndex);
        state.position = to;
      }
    } else if (isArc && motionKey) {
      report(runtime, {
        lineIndex,
        severity: "error",
        code: "arc-without-anything",
        message: "This block asks for an arc but gives neither an end point nor a centre.",
        consequence: "There is no curve to follow, so the control stops on the block.",
        fix: "An arc needs an end point and a centre — the offsets I and J in the XY plane — or an end point and a radius R. A full circle is the one case that needs no end point, and it still needs its centre offsets.",
      });
    }
  }

  /* --- Stops and ends, after the block's motion. --- */

  for (const key of endingCodes) {
    if (key === "2" || key === "30") state.programEnded = true;
  }
}

/**
 * Walk a parsed program.
 *
 * Every line produces exactly one step, in source order, whether or not it did
 * anything — so `steps[i]` always describes `lines[i]` and the UI can scrub to
 * any line without searching.
 */
export function interpret(
  lines: ParsedLine[],
  options: Required<SimulationOptions>,
): {
  steps: ExecutedStep[];
  segments: PathSegment[];
  diagnostics: Diagnostic[];
  bounds: Bounds | null;
  estimatedMinutes: number;
  cuttingDistance: number;
  finalState: MachineState;
} {
  const runtime: Runtime = {
    options,
    diagnostics: [],
    segments: [],
    current: [],
    bounds: null,
    cuttingDistance: 0,
    minutes: 0,
    said: new Set<string>(),
  };

  const state = initialMachineState();
  const steps: ExecutedStep[] = [];

  for (const line of lines) {
    const before = cloneState(state);
    runtime.current = [];

    if (!line.empty) {
      if (state.programEnded) {
        reportOnce(runtime, {
          lineIndex: line.index,
          severity: "warning",
          code: "after-program-end",
          message: "There are more commands after the block that ends the program.",
          consequence:
            "The control stops at the end of program, so nothing from here down runs — unless these blocks are a subprogram, called by name from somewhere above.",
          fix: "Move the end of program to the bottom of the part of the file you meant to run, or delete the blocks that follow it.",
        });
      } else {
        if (line.blockDelete) {
          reportOnce(runtime, {
            lineIndex: line.index,
            severity: "note",
            code: "block-delete",
            message:
              "The leading “/” marks this block for block delete: whether it runs depends on a switch on the machine's own control panel, not on anything in the program.",
            consequence:
              "This model runs the block, as a machine does with the switch off. With the switch on, the machine would skip it — so the same file cuts two different paths.",
            fix: "Read the program both ways before running it, and check the switch at the control. If the block should always run, delete the slash.",
          });
        }
        executeBlock(runtime, state, line);
      }
    }

    steps.push({
      lineIndex: line.index,
      before,
      after: cloneState(state),
      segments: runtime.current,
    });
  }

  return {
    steps,
    segments: runtime.segments,
    diagnostics: runtime.diagnostics,
    bounds: runtime.bounds,
    estimatedMinutes: runtime.minutes,
    cuttingDistance: runtime.cuttingDistance,
    finalState: cloneState(state),
  };
}
