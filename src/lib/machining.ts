/**
 * Machining calculator maths. SPEC.md section 9.1.
 *
 * Every number the machining calculator shows is produced by a pure function in
 * this file. Components hold state and lay things out; they never do sums.
 *
 * The reference-card formula and the worked-example prose live here as well,
 * beside the equations they describe, so that no calculator component ends up
 * carrying content (SPEC section 4).
 */

import type { Formula } from "@/content/types";
import { rpmToRadPerSecond, significant } from "./format";

/* ------------------------------------------------------------------ *
 * Shared calculator primitives
 * ------------------------------------------------------------------ */

/**
 * A guard-rail message. Guard rails never block input — they explain the
 * physical consequence of the numbers as entered and leave the decision with
 * the learner. They are not safety content, so they are never coloured amber.
 *
 * Shared with the axis-sizing calculator, which imports the type from here.
 */
export interface CalcWarning {
  id: string;
  title: string;
  /** The physical consequence, in plain words. */
  detail: string;
}

/**
 * Display formatting for calculator outputs, shared by both calculators.
 *
 * `format.ts` is frozen and its `formatNumber` rounds to three significant
 * figures with thousands separators, which turns 6366 rev/min into "6,370".
 * The course's worked examples quote 6366, so calculator outputs are rendered
 * with a chosen number of significant figures and no separator, which is also
 * how a shop-floor readout shows them.
 */
export function formatCalcValue(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return "—";
  return String(significant(value, digits));
}

/* ------------------------------------------------------------------ *
 * Inputs and outputs
 * ------------------------------------------------------------------ */

export interface MachiningInputs {
  /** D — tool diameter, mm. */
  toolDiameter: number;
  /** z — number of cutting edges (flutes). */
  teeth: number;
  /** vc — cutting speed, m/min. */
  cuttingSpeed: number;
  /** fz — feed per tooth, mm/tooth. */
  feedPerTooth: number;
  /** ap — axial depth of cut, mm. */
  axialDepth: number;
  /** ae — radial width of cut, mm. */
  radialWidth: number;
  /** L — length of the pass, mm. */
  passLength: number;
  /** The machine's stated maximum spindle speed, rev/min. Guard rail only. */
  spindleMax: number;
}

export interface MachiningResults {
  /** n — spindle speed, rev/min. */
  spindleSpeed: number;
  /** n expressed in SI, rad/s. */
  spindleAngular: number;
  /** vf — feed rate, mm/min. */
  feedRate: number;
  /** vf expressed in SI, m/s. */
  feedSpeed: number;
  /** z × fz — how far the tool advances per revolution, mm/rev. */
  feedPerRevolution: number;
  /** Q — material removal rate, cm³/min. */
  removalRate: number;
  /** t — time for one pass, min. */
  passTime: number;
  /** t in seconds. */
  passTimeSeconds: number;
  /** vc recovered from n and D — a check that the chain closes. */
  cuttingSpeedCheck: number;
}

/* ------------------------------------------------------------------ *
 * The five relationships of SPEC 9.1
 * ------------------------------------------------------------------ */

/** `n = (vc × 1000) / (π × D)` — n rev/min, vc m/min, D mm. */
export function spindleSpeedFromCuttingSpeed(cuttingSpeed: number, toolDiameter: number): number {
  return (cuttingSpeed * 1000) / (Math.PI * toolDiameter);
}

/** `vc = (π × D × n) / 1000` — the same relationship read the other way. */
export function cuttingSpeedFromSpindleSpeed(spindleSpeed: number, toolDiameter: number): number {
  return (Math.PI * toolDiameter * spindleSpeed) / 1000;
}

/** `vf = n × z × fz` — vf mm/min, z teeth, fz mm/tooth. */
export function feedRate(spindleSpeed: number, teeth: number, feedPerTooth: number): number {
  return spindleSpeed * teeth * feedPerTooth;
}

/** `Q = (ap × ae × vf) / 1000` — Q cm³/min, ap and ae mm, vf mm/min. */
export function materialRemovalRate(
  axialDepth: number,
  radialWidth: number,
  feed: number,
): number {
  return (axialDepth * radialWidth * feed) / 1000;
}

/** `t = L / vf` — t min, L mm, vf mm/min. Single pass, cutting time only. */
export function machiningTime(passLength: number, feed: number): number {
  return passLength / feed;
}

/**
 * The whole chain in one call. Each step feeds the next at full precision, so
 * the displayed values match the worked example rather than drifting through
 * rounded intermediates.
 */
export function machiningResults(inputs: MachiningInputs): MachiningResults {
  const spindleSpeed = spindleSpeedFromCuttingSpeed(inputs.cuttingSpeed, inputs.toolDiameter);
  const feed = feedRate(spindleSpeed, inputs.teeth, inputs.feedPerTooth);
  const passTime = machiningTime(inputs.passLength, feed);

  return {
    spindleSpeed,
    spindleAngular: rpmToRadPerSecond(spindleSpeed),
    feedRate: feed,
    feedSpeed: feed / 60000,
    feedPerRevolution: inputs.teeth * inputs.feedPerTooth,
    removalRate: materialRemovalRate(inputs.axialDepth, inputs.radialWidth, feed),
    passTime,
    passTimeSeconds: passTime * 60,
    cuttingSpeedCheck: cuttingSpeedFromSpindleSpeed(spindleSpeed, inputs.toolDiameter),
  };
}

/* ------------------------------------------------------------------ *
 * Guard rails
 * ------------------------------------------------------------------ */

/**
 * A crude sanity band for feed per tooth, expressed as a fraction of tool
 * diameter. It exists to catch a decimal point in the wrong place, nothing
 * more. It is an order of magnitude and emphatically not a specification: real
 * feed-per-tooth values come from the tool manufacturer's cutting data for the
 * specific tool, material, coating and engagement.
 */
export const FEED_PER_TOOTH_BAND = { lower: 0.004, upper: 0.04 } as const;

export function plausibleFeedPerToothRange(toolDiameter: number): { min: number; max: number } {
  return {
    min: toolDiameter * FEED_PER_TOOTH_BAND.lower,
    max: toolDiameter * FEED_PER_TOOTH_BAND.upper,
  };
}

function usable(...values: number[]): boolean {
  return values.every((v) => Number.isFinite(v) && v > 0);
}

/**
 * Structured guard-rail warnings for the machining calculator, in the order a
 * learner should read them. Nothing here blocks input or changes a result; each
 * message says what the entered numbers would physically do.
 */
export function machiningWarnings(
  inputs: MachiningInputs,
  results: MachiningResults,
): CalcWarning[] {
  const warnings: CalcWarning[] = [];

  if (
    !usable(
      inputs.toolDiameter,
      inputs.teeth,
      inputs.cuttingSpeed,
      inputs.feedPerTooth,
      inputs.axialDepth,
      inputs.radialWidth,
      inputs.passLength,
    )
  ) {
    warnings.push({
      id: "incomplete",
      title: "One or more inputs is not yet a positive number",
      detail:
        "Results show a dash until every box holds a number greater than zero. Nothing is stopping you typing — the calculator simply has nothing to divide with yet.",
    });
    return warnings;
  }

  if (inputs.radialWidth > inputs.toolDiameter) {
    warnings.push({
      id: "ae-over-d",
      title: `Radial width of cut ${formatCalcValue(inputs.radialWidth)} mm is wider than the ${formatCalcValue(inputs.toolDiameter)} mm cutter`,
      detail:
        `A cutter cannot engage more of the workpiece than its own diameter in a single pass: the widest slot a ${formatCalcValue(inputs.toolDiameter)} mm end mill can make is ${formatCalcValue(inputs.toolDiameter)} mm. ` +
        "The removal rate above is therefore arithmetic rather than physics — the real job would need several stepovers side by side, each no wider than the tool, and the time would rise in proportion.",
    });
  }

  const band = plausibleFeedPerToothRange(inputs.toolDiameter);
  if (inputs.feedPerTooth < band.min) {
    warnings.push({
      id: "fz-low",
      title: `Feed per tooth ${formatCalcValue(inputs.feedPerTooth)} mm looks very light for a ${formatCalcValue(inputs.toolDiameter)} mm cutter`,
      detail:
        "When each edge is asked to take a slice thinner than the rounding of the edge itself, it stops cutting and starts ploughing: the metal is pushed and rubbed rather than sheared away. The work goes into heat instead of chips, the surface work-hardens ahead of the tool, and flank wear climbs quickly. " +
        `As a rough sanity band, a cutter this size is usually run somewhere between ${formatCalcValue(band.min, 2)} and ${formatCalcValue(band.max, 2)} mm/tooth — an order of magnitude to check yourself against, never a specification. The tool manufacturer's cutting data for your material is the authority.`,
    });
  } else if (inputs.feedPerTooth > band.max) {
    warnings.push({
      id: "fz-high",
      title: `Feed per tooth ${formatCalcValue(inputs.feedPerTooth)} mm looks very heavy for a ${formatCalcValue(inputs.toolDiameter)} mm cutter`,
      detail:
        "A thicker slice per tooth means a larger force on each edge as it enters the cut, and force is what bends the tool, deflects the part and chips carbide. It also makes a bigger chip, which has to fit through the flute and get out — in a deep slot it may not, and packed chips break tools. " +
        `As a rough sanity band, a cutter this size is usually run somewhere between ${formatCalcValue(band.min, 2)} and ${formatCalcValue(band.max, 2)} mm/tooth — an order of magnitude to check yourself against, never a specification. The tool manufacturer's cutting data for your material is the authority.`,
    });
  }

  if (usable(inputs.spindleMax) && results.spindleSpeed > inputs.spindleMax) {
    const achievable = cuttingSpeedFromSpindleSpeed(inputs.spindleMax, inputs.toolDiameter);
    const achievableFeed = feedRate(inputs.spindleMax, inputs.teeth, inputs.feedPerTooth);
    warnings.push({
      id: "over-spindle-max",
      title: `The spindle would have to turn at ${formatCalcValue(results.spindleSpeed, 4)} rev/min, above the ${formatCalcValue(inputs.spindleMax, 4)} rev/min maximum you entered`,
      detail:
        `The machine will simply run as fast as it can, so the edge sweeps past the metal at about ${formatCalcValue(achievable)} m/min instead of the ${formatCalcValue(inputs.cuttingSpeed)} m/min you asked for. That is a different cutting condition, and tool life will not match the data you took the cutting speed from. ` +
        `The feed rate has to come down with it: to keep the same slice per tooth at ${formatCalcValue(inputs.spindleMax, 4)} rev/min the feed becomes about ${formatCalcValue(achievableFeed, 4)} mm/min. Leave the feed where it is and every tooth takes a thicker chip than intended. ` +
        "The usual fix is a larger-diameter cutter, which reaches the same cutting speed at a lower spindle speed.",
    });
  }

  return warnings;
}

/* ------------------------------------------------------------------ *
 * Reference card, worked example and the estimate note
 * ------------------------------------------------------------------ */

/** The canonical worked example of SPEC Phase 7, used as the default state. */
export const MACHINING_WORKED_EXAMPLE: MachiningInputs = {
  toolDiameter: 10,
  teeth: 4,
  cuttingSpeed: 200,
  feedPerTooth: 0.05,
  axialDepth: 5,
  radialWidth: 3,
  passLength: 250,
  spindleMax: 12000,
};

export const MACHINING_FORMULA: Formula = {
  expression: [
    "n  = (vc × 1000) / (π × D)",
    "vc = (π × D × n) / 1000",
    "vf = n × z × fz",
    "Q  = (ap × ae × vf) / 1000",
    "t  = L / vf",
  ].join("\n"),
  variables: [
    { symbol: "n", meaning: "Spindle speed — how fast the tool turns", unit: "rev/min" },
    {
      symbol: "vc",
      meaning: "Cutting speed — how fast the edge sweeps past the metal",
      unit: "m/min",
    },
    { symbol: "D", meaning: "Tool diameter", unit: "mm" },
    { symbol: "z", meaning: "Number of cutting edges, or flutes, on the tool", unit: "teeth" },
    {
      symbol: "fz",
      meaning: "Feed per tooth — the thickness of the slice each edge takes",
      unit: "mm/tooth",
    },
    { symbol: "vf", meaning: "Feed rate — how fast the tool travels through the metal", unit: "mm/min" },
    { symbol: "ap", meaning: "Axial depth of cut — how deep the tool is engaged", unit: "mm" },
    { symbol: "ae", meaning: "Radial width of cut — how wide a bite it takes sideways", unit: "mm" },
    { symbol: "Q", meaning: "Material removal rate — metal leaving the part each minute", unit: "cm³/min" },
    { symbol: "L", meaning: "Length of the pass along the workpiece", unit: "mm" },
    { symbol: "t", meaning: "Cutting time for one pass, ignoring rapids and tool changes", unit: "min" },
    {
      symbol: "1000",
      meaning: "Converts metres to millimetres, and mm³ to cm³, so the units agree",
      unit: "—",
    },
  ],
  meaning:
    "Only two of these numbers belong to the tool and the material: cutting speed and feed per tooth. Everything else falls out of them once you choose a diameter and a tooth count. Fit a smaller cutter and the spindle speed must rise to keep the edge sweeping past the metal at the same rate; swap four flutes for three and leave the feed rate alone, and every remaining edge quietly takes a thicker slice than you intended.",
};

/**
 * Worked examples are held as data rather than sentences so that the renderer
 * can obey SPEC 5.2: every measured or calculated number is set in mono, and
 * the surrounding explanation is set in sans. Notes therefore carry no numerals
 * — the numbers live in `expression` and `result`, which are mono.
 */
export interface WorkedGiven {
  symbol: string;
  value: string;
}

export interface WorkedStep {
  label: string;
  /** The arithmetic as it would be written out, mono. */
  expression: string;
  /** The answer with its unit, mono. */
  result: string;
  /** Why the number matters. No numerals — they belong in the mono fields. */
  note: string;
}

export const MACHINING_WORKED_INTRO =
  "A carbide end mill with four flutes, cutting an aluminium alloy. The cutting speed and the feed per tooth come from the tool supplier's data sheet; the rest is the geometry of the pass. These are the numbers the calculator starts with, so the results above are this example.";

export const MACHINING_WORKED_GIVENS: WorkedGiven[] = [
  { symbol: "D", value: "10 mm" },
  { symbol: "z", value: "4 flutes" },
  { symbol: "vc", value: "200 m/min" },
  { symbol: "fz", value: "0.05 mm/tooth" },
  { symbol: "ap", value: "5 mm" },
  { symbol: "ae", value: "3 mm" },
  { symbol: "L", value: "250 mm" },
];

export const MACHINING_WORKED_STEPS: WorkedStep[] = [
  {
    label: "Spindle speed",
    expression: "n = (200 × 1000) / (π × 10)",
    result: "6366 rev/min (6366.2)",
    note: "This exists only because the tool happens to be that diameter. Fit a smaller cutter and the spindle speed must rise to keep the edge sweeping past the metal at the same rate — the cutting speed stays where the supplier put it.",
  },
  {
    label: "Feed rate",
    expression: "vf = 6366.2 × 4 × 0.05",
    result: "1273 mm/min (1273.2)",
    note: "Tooth count matters more than beginners expect. Swap to a three-flute cutter at the same feed per tooth and the feed rate falls by a quarter; leave the feed alone instead, and every remaining edge takes a thicker slice than intended.",
  },
  {
    label: "Material removal rate",
    expression: "Q = (5 × 3 × 1273.2) / 1000",
    result: "19.1 cm³/min (19.099)",
    note: "The honest measure of how productive the pass is, and the number to compare when judging one cutting strategy against another.",
  },
  {
    label: "Time for one pass",
    expression: "t = 250 / 1273.2",
    result: "0.196 min ≈ 11.8 s",
    note: "Cutting time only — no rapids, no entries, no tool changes. Multiply by the number of passes and you have a cycle-time estimate long before going near the machine.",
  },
];

export const MACHINING_SI_NOTE =
  "Rev/min, m/min and mm/min are what the shop floor and the control actually use, so the calculator uses them too — but they are not SI. The conversions are listed with the results above, and it is the SI value that goes into any physics you do with these numbers. Whenever a formula mixes units, check that the conversion factors are doing their job.";

export const MACHINING_ESTIMATE_NOTE =
  "This is an educational tool. It applies the five textbook relationships above and nothing else: it knows nothing about your alloy, tool coating, machine stiffness, spindle power, coolant, tool overhang or fixture. It does not replace the tool manufacturer's cutting data or professional engineering validation, and no number it produces should be typed into a machine without checking it against the supplier's recommendations and the judgement of someone experienced on that machine.";
