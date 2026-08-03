/**
 * Beginner-mistake detection. SPEC.md section 16 item 1, and the list the
 * /simulator page names out loud: a rapid that passes through the material, a
 * missing retract before a move across the part, a plunge at the cutting feed
 * rate, an incremental move written as though it were absolute, a missing tool
 * length offset, a feed with no spindle speed.
 *
 * Three rules bind every diagnostic in this file.
 *
 * NEVER A BARE "SYNTAX ERROR". Each one says what is wrong, what it would
 * actually do on a machine, and what to write instead — the same principle SPEC
 * rule 8 applies to quiz answers. A message a learner cannot act on is a defect.
 *
 * ASSUMPTIONS ARE NAMED WHERE THEY ARE USED. The clearance height and the top of
 * the stock are values the learner supplies, not facts the model can discover, so
 * any rule that leans on one says so in its own text rather than in a footnote.
 *
 * THE MODEL KNOWS NOTHING ABOUT YOUR MACHINE. It has no fixture, no clamps, no
 * real tool length, no travels and no idea what is on the table. A clean run here
 * is not a proven program, and several of these messages say exactly that.
 *
 * Severity: "error" for what will not run or will certainly gouge, "warning" for
 * what is very likely wrong, "note" for habit and style.
 */

import { formatFixed } from "../format";
import type {
  Diagnostic,
  ExecutedStep,
  ParsedLine,
  PathSegment,
  Plane,
  SimulationOptions,
  Vec3,
} from "./types";

const EPS = 1e-9;
const TWO_PI = Math.PI * 2;

/**
 * Feed per revolution above which `feed-far-above-commanded` speaks up. It is a
 * deliberately generous educational sanity check chosen so that ordinary milling
 * never trips it — not a limit from any standard, tool catalogue or machine.
 */
const FEED_PER_REV_SANITY = 1;

/** How much bigger than the other steps an incremental move must be to look wrong. */
const INCREMENTAL_SUSPICION_FACTOR = 4;
const INCREMENTAL_SUSPICION_FLOOR = 5;

function coord(value: number): string {
  return formatFixed(value, 3);
}

function trim(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(Math.round(value * 1000) / 1000);
}

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

function isCutting(segment: PathSegment): boolean {
  return segment.kind !== "rapid";
}

function planarLength(segment: PathSegment): number {
  return Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);
}

function lowestZ(segment: PathSegment): number {
  return Math.min(segment.from.z, segment.to.z);
}

function highestZ(segment: PathSegment): number {
  return Math.max(segment.from.z, segment.to.z);
}

const PLANE_KEYS: Record<Plane, [keyof Vec3, keyof Vec3]> = {
  XY: ["x", "y"],
  ZX: ["z", "x"],
  YZ: ["y", "z"],
};

function planeDistance(a: Vec3, b: Vec3, plane: Plane): number {
  const [first, second] = PLANE_KEYS[plane];
  return Math.hypot(a[first] - b[first], a[second] - b[second]);
}

interface Rect {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Points along a move in the XY plane. Arcs are walked, not chorded. */
function samplePlanarXY(segment: PathSegment, count: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const centre = segment.centre;
  if ((segment.kind === "arc-cw" || segment.kind === "arc-ccw") && centre && segment.plane === "XY") {
    const radius = Math.hypot(segment.from.x - centre.x, segment.from.y - centre.y);
    const start = Math.atan2(segment.from.y - centre.y, segment.from.x - centre.x);
    let end = Math.atan2(segment.to.y - centre.y, segment.to.x - centre.x);
    if (segment.kind === "arc-ccw") {
      while (end <= start + 1e-9) end += TWO_PI;
    } else {
      while (end >= start - 1e-9) end -= TWO_PI;
    }
    for (let i = 0; i <= count; i += 1) {
      const angle = lerp(start, end, i / count);
      points.push({ x: centre.x + radius * Math.cos(angle), y: centre.y + radius * Math.sin(angle) });
    }
    return points;
  }
  for (let i = 0; i <= count; i += 1) {
    const u = i / count;
    points.push({ x: lerp(segment.from.x, segment.to.x, u), y: lerp(segment.from.y, segment.to.y, u) });
  }
  return points;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const SEVERITY_RANK: Record<Diagnostic["severity"], number> = { error: 0, warning: 1, note: 2 };

/** A move with the state of the line that produced it. */
interface Move {
  segment: PathSegment;
  step: ExecutedStep;
  /** Index into the flattened move list, so rules can ask what came before. */
  order: number;
}

export function lintProgram(input: {
  lines: ParsedLine[];
  steps: ExecutedStep[];
  segments: PathSegment[];
  options: Required<SimulationOptions>;
}): Diagnostic[] {
  const { lines, steps, options } = input;
  const found: Diagnostic[] = [];

  // An empty editor is not a mistake, so it gets no diagnostics at all.
  if (lines.length === 0 || lines.every((line) => line.empty)) return found;

  const stockTop = options.stockTopZ;
  const clearance = options.clearanceZ;
  const stockTopText = `Z${coord(stockTop)}`;
  const clearanceText = `Z${coord(clearance)}`;

  const lineByIndex = new Map<number, ParsedLine>();
  for (const line of lines) lineByIndex.set(line.index, line);

  const stepByLine = new Map<number, ExecutedStep>();
  for (const step of steps) if (!stepByLine.has(step.lineIndex)) stepByLine.set(step.lineIndex, step);

  const moves: Move[] = [];
  for (const step of steps) {
    for (const segment of step.segments) {
      moves.push({ segment, step, order: moves.length });
    }
  }

  const inMaterial = (segment: PathSegment) => lowestZ(segment) < stockTop - EPS;
  const cuttingMoves = moves.filter((move) => isCutting(move.segment));
  const materialCuts = cuttingMoves.filter((move) => inMaterial(move.segment));
  const firstCut = materialCuts[0] ?? cuttingMoves[0];

  /* -------------------------------------------------------------- *
   * Words used across several rules                                 *
   * -------------------------------------------------------------- */

  const hasG = (code: number) =>
    lines.some((line) => line.words.some((word) => word.letter === "G" && word.value === code));
  const hasM = (code: number) =>
    lines.some((line) => line.words.some((word) => word.letter === "M" && word.value === code));
  const hasLetter = (letter: string) =>
    lines.some((line) => line.words.some((word) => word.letter === letter));

  const firstMoveLine = moves.length > 0 ? moves[0].step.lineIndex : Number.POSITIVE_INFINITY;
  const declaredBeforeFirstMove = (letter: string, codes: number[]) =>
    lines.some(
      (line) =>
        line.index <= firstMoveLine &&
        line.words.some((word) => word.letter === letter && codes.includes(word.value)),
    );

  const lastContentLine =
    [...lines].reverse().find((line) => !line.empty)?.index ?? lines[lines.length - 1].index;

  /* -------------------------------------------------------------- *
   * The header a program should declare before it moves anything    *
   * -------------------------------------------------------------- */

  if (moves.length > 0 && !declaredBeforeFirstMove("G", [20, 21])) {
    found.push({
      lineIndex: moves[0].step.lineIndex,
      severity: "warning",
      code: "units-not-declared",
      message:
        "The program moves the tool before it says whether it is working in millimetres or inches: there is no G21 or G20 in front of the first move.",
      consequence:
        "The control uses whichever mode the last job left it in. The same numbers mean 25.4 times the distance in the wrong one, so a program written in millimetres and run in inches drives the machine far past the end of the part.",
      fix: "Open the program with the mode stated: G21 for millimetres (or G20 for inches), alongside the distance mode and the plane — G21 G90 G17 is the usual first block.",
    });
  }

  if (moves.length > 0 && !declaredBeforeFirstMove("G", [90, 91])) {
    found.push({
      lineIndex: moves[0].step.lineIndex,
      severity: "note",
      code: "distance-mode-not-declared",
      message:
        "The program moves before it says whether coordinates are absolute or incremental: there is no G90 or G91 in front of the first move.",
      consequence:
        "Whichever mode the previous program left behind is the one this one inherits. In G91 every coordinate meant as a position becomes a step instead, and the tool ends up somewhere else entirely.",
      fix: "Put G90 in the first block — or G91, if steps are genuinely what you mean — together with the units and the plane.",
    });
  }

  if (moves.length > 0 && !declaredBeforeFirstMove("G", [54, 55, 56, 57, 58, 59])) {
    found.push({
      lineIndex: moves[0].step.lineIndex,
      severity: "note",
      code: "no-work-offset",
      message: "No work offset (G54 to G59) is commanded before the first move.",
      consequence:
        "Part zero comes from whichever offset the control happens to have active, often the one the previous job used. The program then cuts the right shape in the wrong place.",
      fix: "Name the offset in the header: G54, or whichever one holds this part's zero. It is the word that ties the numbers in the program to where the part is actually clamped.",
    });
  }

  /* -------------------------------------------------------------- *
   * Spindle, speed and feed against the cutting moves               *
   * -------------------------------------------------------------- */

  let spindleOffReported = false;
  for (const move of moves) {
    if (move.step.after.spindle !== "off") {
      spindleOffReported = false;
      continue;
    }
    if (!isCutting(move.segment) || !inMaterial(move.segment) || spindleOffReported) continue;
    spindleOffReported = true;
    found.push({
      lineIndex: move.step.lineIndex,
      severity: "error",
      code: "feed-without-spindle",
      message:
        "This cutting move runs with the spindle stopped: nothing has commanded M3 or M4 yet, or an M5 has stopped it again.",
      consequence:
        "The machine will happily drive a stationary cutter into the material. It will not cut — it will push — and something has to give: the tool, the part, or whatever is holding the part.",
      fix: "Start the spindle, with a direction and a speed, before the first cut: S6366 M03 for example, and give it a moment to reach speed before feeding in.",
    });
  }

  if (firstCut && !hasLetter("S")) {
    found.push({
      lineIndex: firstCut.step.lineIndex,
      severity: "warning",
      code: "feed-without-speed",
      message: "The program cuts without ever commanding a spindle speed: there is no S word anywhere in it.",
      consequence:
        "The spindle has no speed to run at. Controls differ — some alarm on the block, some quietly keep whatever speed the last program left behind — so what actually happens depends on the machine, which is the last thing that should be left to chance.",
      fix: "Command the speed with the direction, before the first cut: S3000 M03. The number itself comes from the cutting speed for your tool and material; the machining calculator on this site works it through.",
    });
  }

  const cuttingCodes = [1, 2, 3];
  const noFeedStep = steps.find((step) => {
    const line = lineByIndex.get(step.lineIndex);
    const commandsCut =
      step.segments.some((segment) => isCutting(segment)) ||
      (line?.words.some((word) => word.letter === "G" && cuttingCodes.includes(word.value)) ?? false);
    return commandsCut && step.after.feed <= 0;
  });
  if (noFeedStep) {
    found.push({
      lineIndex: noFeedStep.lineIndex,
      severity: "error",
      code: "no-feed-rate",
      message: "A cutting move (G1, G2 or G3) is commanded here before any F word has set a feed rate.",
      consequence:
        "A feed move with no feed rate is not something a control can carry out; most machines alarm on the block. The ones that do not fall back on whatever F was left in memory, which is worse, because nothing on the screen tells you what it chose.",
      fix: "Put the feed on the first cutting move or on a line above it: G1 Z-2.0 F200. F is modal, so once set it stays in force until another F changes it.",
    });
  }

  if (firstCut && !hasG(43) && !steps.some((step) => step.after.toolLengthOffset)) {
    found.push({
      lineIndex: firstCut.step.lineIndex,
      severity: "warning",
      code: "missing-tool-length-offset",
      message: "The program cuts without ever applying a tool length offset: there is no G43 before the first cut.",
      consequence:
        "Every tool stands out of its holder by a different amount, and the offset is what tells the control the difference. Without it the Z on the screen is not where the tip actually is, so the depth of cut is wrong by the length of the tool — either cutting air or driving straight into the part.",
      fix: "Apply the offset after the tool change and before Z is used for anything: G43 H01 Z25.0, with the H number matching the tool. This model records the H number and nothing else — it cannot know your tool's real length, so it cannot check this one for you.",
    });
  }

  const reportedFeedPairs = new Set<string>();
  for (const move of cuttingMoves) {
    const feed = move.segment.feed;
    const speed = move.step.after.spindleSpeed;
    if (feed <= 0 || speed <= 0) continue;
    const perRev = feed / speed;
    if (perRev <= FEED_PER_REV_SANITY) continue;
    const key = `${feed}|${speed}`;
    if (reportedFeedPairs.has(key)) continue;
    reportedFeedPairs.add(key);
    found.push({
      lineIndex: move.step.lineIndex,
      severity: "warning",
      code: "feed-far-above-commanded",
      message: `A feed of ${trim(feed)} mm/min against a spindle speed of ${trim(speed)} rev/min works out at ${coord(perRev)} mm of feed for every single turn of the spindle. This model treats anything above ${trim(FEED_PER_REV_SANITY)} mm per revolution as worth a second look — a deliberately generous educational sanity check, not a limit from any standard or tool catalogue.`,
      consequence:
        "Either the feed is far too high for that speed or the speed is far too low for that feed. Either way the chip each tooth takes is nothing like the one intended: the tool rubs and burns, or it is overloaded and snaps.",
      fix: "Work the pair out together instead of typing them in separately. Feed per minute is spindle speed times the number of teeth times the feed per tooth, and the machining calculator on this site derives both from the cutting speed and chip load in the tool manufacturer's data.",
    });
  }

  /* -------------------------------------------------------------- *
   * Geometry: rapids, plunges and traverses                         *
   * -------------------------------------------------------------- */

  let footprint: Rect | null = null;
  for (const move of materialCuts) {
    for (const point of samplePlanarXY(move.segment, 16)) {
      footprint = footprint
        ? {
            minX: Math.min(footprint.minX, point.x),
            maxX: Math.max(footprint.maxX, point.x),
            minY: Math.min(footprint.minY, point.y),
            maxY: Math.max(footprint.maxY, point.y),
          }
        : { minX: point.x, maxX: point.x, minY: point.y, maxY: point.y };
    }
  }

  const insideFootprint = (x: number, y: number) =>
    footprint !== null &&
    x >= footprint.minX - EPS &&
    x <= footprint.maxX + EPS &&
    y >= footprint.minY - EPS &&
    y <= footprint.maxY + EPS;

  /** Moves already reported as driving through the part, so no rule doubles up. */
  const gouging = new Set<number>();

  for (const move of moves) {
    const segment = move.segment;
    if (segment.kind !== "rapid") continue;

    const planar = planarLength(segment);

    if (planar > 1e-6 && footprint) {
      let deepest = Number.POSITIVE_INFINITY;
      const samples = 32;
      for (let i = 0; i <= samples; i += 1) {
        const u = i / samples;
        const x = lerp(segment.from.x, segment.to.x, u);
        const y = lerp(segment.from.y, segment.to.y, u);
        const z = lerp(segment.from.z, segment.to.z, u);
        if (z < stockTop - EPS && insideFootprint(x, y)) deepest = Math.min(deepest, z);
      }
      if (Number.isFinite(deepest)) {
        gouging.add(move.order);
        found.push({
          lineIndex: move.step.lineIndex,
          severity: "error",
          code: "rapid-through-material",
          message: `This G0 rapid travels across the area the program cuts while the tool is below the top of the stock — down to Z${coord(deepest)} against the assumed stock top of ${stockTopText}.`,
          consequence:
            "A rapid does not cut, it travels. Dragged sideways through material at full traverse rate the cutter cannot clear chips or take a chip load, so the usual result is a broken tool and a scrapped part — and at worst the work pulled out of the fixture.",
          fix: "Retract in Z first, then move, then feed back down: G0 Z25.0 (or whatever your clearance height is), G0 X.. Y.., G1 Z.. F.. — and remember that the stock top is an assumption supplied to the model, so correct it if part zero is not on the top face.",
        });
      }
    }

    if (planar <= 1e-6 && segment.to.z < segment.from.z - EPS && segment.to.z < stockTop - EPS) {
      found.push({
        lineIndex: move.step.lineIndex,
        severity: "error",
        code: "rapid-plunge-into-stock",
        message: `This G0 drives straight down to Z${coord(segment.to.z)}, below the assumed stock top of ${stockTopText}, without moving in X or Y.`,
        consequence:
          "Rapid means the machine's fastest traverse. Entering material that way loads the end of the cutter far faster than it can possibly cut, and an end mill is at its weakest cutting straight down its own axis.",
        fix: "Rapid down to a small clearance above the face and feed the rest of the way: G0 Z2.0, then G1 Z-2.0 F200 with a plunge feed well below the cutting feed. Ramping in along X or Y, or helical entry, is gentler still.",
      });
    }
  }

  const cutBefore: boolean[] = [];
  const cutAfter: boolean[] = [];
  {
    let seen = false;
    for (const move of moves) {
      cutBefore.push(seen);
      if (isCutting(move.segment) && inMaterial(move.segment)) seen = true;
    }
    seen = false;
    for (let i = moves.length - 1; i >= 0; i -= 1) {
      cutAfter[i] = seen;
      if (isCutting(moves[i].segment) && inMaterial(moves[i].segment)) seen = true;
    }
  }

  for (const move of moves) {
    const segment = move.segment;
    if (segment.kind !== "rapid" || gouging.has(move.order)) continue;
    if (planarLength(segment) <= 1e-6) continue;
    if (!cutBefore[move.order] || !cutAfter[move.order]) continue;
    if (highestZ(segment) >= clearance - EPS) continue;
    found.push({
      lineIndex: move.step.lineIndex,
      severity: "warning",
      code: "no-retract-before-traverse",
      message: `The tool crosses from one cutting area to the next without going up to clearance first: the highest this move reaches is Z${coord(highestZ(segment))}, and this model is assuming clearance means ${clearanceText} or above.`,
      consequence:
        "The model knows nothing about your clamps, vice jaws, fixture, or the shape already cut into the part, so a move that looks clear on this drawing can still hit something on the machine — and it hits it at rapid speed.",
      fix: "Put a retract in front of the traverse: G0 Z25.0, then the X and Y move, then feed back down. The clearance height is yours to set, and it has to clear the tallest thing the tool can pass over, not just the part.",
    });
  }

  for (const move of moves) {
    const segment = move.segment;
    if (!isCutting(segment)) continue;
    if (planarLength(segment) > 1e-6) continue;
    if (segment.to.z >= segment.from.z - EPS) continue;
    if (segment.to.z >= stockTop - EPS) continue;
    const plungeFeed = segment.feed;
    if (plungeFeed <= 0) continue;
    const nextCut = moves.find(
      (candidate) =>
        candidate.order > move.order &&
        isCutting(candidate.segment) &&
        planarLength(candidate.segment) > 1e-6,
    );
    if (!nextCut || nextCut.segment.feed <= 0) continue;
    if (plungeFeed < nextCut.segment.feed - EPS) continue;
    found.push({
      lineIndex: move.step.lineIndex,
      severity: "warning",
      code: "plunge-at-feed",
      message: `The tool feeds straight down into the material at ${trim(plungeFeed)} mm/min — the same rate as the sideways cutting that follows (${trim(nextCut.segment.feed)} mm/min).`,
      consequence:
        "Cutting straight down is the hardest thing an end mill is ever asked to do: the very centre of the tool has no cutting speed at all, so at the middle the material is pushed rather than cut. At full cutting feed that usually means a burnt or broken cutter, or a plunge mark left in the floor of the cut.",
      fix: "Give the plunge its own, slower feed — G1 Z-3.0 F200, then G1 X.. F900 for the cut — or ramp down over a distance in X and Y rather than dropping straight in. This model holds no data for your tool, so it cannot tell you the right plunge feed: that comes from the tool manufacturer's cutting data.",
    });
  }

  /* -------------------------------------------------------------- *
   * Incremental moves that read like absolute positions             *
   * -------------------------------------------------------------- */

  const incrementalSteps: { move: Move; letter: string; delta: number }[] = [];
  for (const move of moves) {
    if (move.step.after.distance !== "incremental") continue;
    const deltas: [string, number][] = [
      ["X", move.segment.to.x - move.segment.from.x],
      ["Y", move.segment.to.y - move.segment.from.y],
      ["Z", move.segment.to.z - move.segment.from.z],
    ];
    for (const [letter, delta] of deltas) {
      if (Math.abs(delta) > 1e-6) incrementalSteps.push({ move, letter, delta });
    }
  }
  const incrementalMagnitudes = incrementalSteps.map((entry) => Math.abs(entry.delta));
  const reportedIncremental = new Set<number>();
  for (let i = 0; i < incrementalSteps.length; i += 1) {
    const entry = incrementalSteps[i];
    const magnitude = Math.abs(entry.delta);
    if (magnitude < INCREMENTAL_SUSPICION_FLOOR) continue;
    if (reportedIncremental.has(entry.move.step.lineIndex)) continue;
    const others = incrementalMagnitudes.filter((_, index) => index !== i);
    const typical = others.length > 0 ? median(others) : 0;
    const looksAbsolute =
      typical > 0
        ? magnitude >= typical * INCREMENTAL_SUSPICION_FACTOR
        : magnitude >= INCREMENTAL_SUSPICION_FLOOR * 5;
    if (!looksAbsolute) continue;
    reportedIncremental.add(entry.move.step.lineIndex);
    found.push({
      lineIndex: entry.move.step.lineIndex,
      severity: "warning",
      code: "absolute-incremental-confusion",
      message: `G91 is in force, so ${entry.letter}${trim(entry.delta)} on this line is read as a step of ${coord(magnitude)} mm, not as a position — and that is far bigger than the other steps this program takes${typical > 0 ? ` (a typical one is ${coord(typical)} mm)` : ""}, which is what makes it look like an absolute coordinate written in incremental mode. That is a heuristic, not a fact: a program that genuinely does take one long step will trip it.`,
      consequence: `If ${entry.letter}${trim(entry.delta)} was meant as a position, the tool finishes at ${entry.letter}${coord(entry.move.segment.to[entry.letter.toLowerCase() as "x" | "y" | "z"])} instead — cutting all the way there — and every move after it inherits the error, because each one starts from wherever the last one left off.`,
      fix: "Decide which mode each block is written in and say so out loud: G90 for positions measured from part zero, G91 for steps from where the tool is now. Switching back to G90 the moment the incremental block ends stops the mistake spreading down the program.",
    });
  }

  /* -------------------------------------------------------------- *
   * Arcs                                                            *
   * -------------------------------------------------------------- */

  for (const move of moves) {
    const segment = move.segment;
    if (segment.kind !== "arc-cw" && segment.kind !== "arc-ccw") continue;
    if (!segment.centre) continue;
    const startRadius = planeDistance(segment.from, segment.centre, segment.plane);
    const endRadius = planeDistance(segment.to, segment.centre, segment.plane);
    const tolerance = Math.max(0.01, Math.max(startRadius, endRadius) * 0.001);
    if (Math.abs(startRadius - endRadius) <= tolerance) continue;
    found.push({
      lineIndex: move.step.lineIndex,
      severity: "error",
      code: "arc-endpoint-mismatch",
      message: `The start of this arc is ${coord(startRadius)} mm from the centre the line gives, but the end point is ${coord(endRadius)} mm from it. One arc cannot have two radii.`,
      consequence:
        "Most controls stop on the block and alarm rather than guess which end to believe. The ones that accept it distort the arc to make the ends meet, so the shape produced is not the shape drawn.",
      fix: "Work the centre out from the start of the arc: I and J are offsets from where the arc begins, not positions from part zero. Then check the end point as well — both ends must be exactly one radius from the same centre.",
    });
  }

  for (const step of steps) {
    const line = lineByIndex.get(step.lineIndex);
    if (!line) continue;
    const arcCommanded =
      line.words.some((word) => word.letter === "G" && (word.value === 2 || word.value === 3)) ||
      ((step.after.motion === "arc-cw" || step.after.motion === "arc-ccw") &&
        line.words.some((word) => "XYZ".includes(word.letter)));
    if (!arcCommanded) continue;
    // Only speak where the interpreter clearly let the line through: if it
    // produced no move at all it has rejected the block and said so already.
    if (step.segments.length === 0) continue;
    const plane = step.after.plane;
    const centreLetters = plane === "XY" ? ["I", "J"] : plane === "ZX" ? ["I", "K"] : ["J", "K"];
    const hasCentre = line.words.some((word) => centreLetters.includes(word.letter));
    const hasRadius = line.words.some((word) => word.letter === "R");
    if (hasCentre || hasRadius) continue;
    found.push({
      lineIndex: step.lineIndex,
      severity: "error",
      code: "arc-missing-centre",
      message: `This arc says where to finish but not how to curve: there is no ${centreLetters[0]} or ${centreLetters[1]} for the ${plane} plane and no R.`,
      consequence:
        "The control has a start point and an end point and no idea which of the infinitely many arcs between them you meant, so it cannot run the block.",
      fix: `Give the centre as an offset from the start of the arc — ${centreLetters[0]} and ${centreLetters[1]} in the ${plane} plane — or give the radius with R. R is convenient up to a quarter circle; past a half turn the centre form is far safer.`,
    });
  }

  /* -------------------------------------------------------------- *
   * Tool changes                                                    *
   * -------------------------------------------------------------- */

  for (const line of lines) {
    if (!line.words.some((word) => word.letter === "M" && word.value === 6)) continue;
    const step = stepByLine.get(line.index);
    if (!step) continue;
    const movesBefore = moves.filter((move) => move.step.lineIndex < line.index);
    // The first tool change of a program happens before the model knows where
    // anything is, so there is nothing honest to say about it.
    if (movesBefore.length === 0) continue;

    const heightAtChange = step.before.position.z;
    if (heightAtChange < clearance - EPS) {
      found.push({
        lineIndex: line.index,
        severity: "warning",
        code: "tool-change-without-retract",
        message: `M6 is commanded with the tool at Z${coord(heightAtChange)} — below ${clearanceText}, the height this model is assuming is clear of the work.`,
        consequence:
          "A tool change starts with the machine driving to its own change position, and this model knows nothing about where that is or what the tool passes on the way. Starting from down beside the part is how holders, vice jaws and half-finished work get introduced to one another.",
        fix: "Retract before you change: G0 Z25.0 — many programs use the machine's own safe height through G28 or G53 instead — and then T2 M6.",
      });
    }

    let lastCutOrder = -1;
    for (const move of movesBefore) {
      if (isCutting(move.segment) && inMaterial(move.segment)) lastCutOrder = move.order;
    }
    const strayRapid = movesBefore.find(
      (move) =>
        move.order > lastCutOrder &&
        move.segment.kind === "rapid" &&
        !gouging.has(move.order) &&
        planarLength(move.segment) > 1e-6 &&
        highestZ(move.segment) < clearance - EPS,
    );
    if (strayRapid) {
      found.push({
        lineIndex: strayRapid.step.lineIndex,
        severity: "note",
        code: "rapid-before-tool-change",
        message: `This rapid moves in X and Y on the way to the tool change on line ${line.index + 1}, with the tool still below the assumed clearance height of ${clearanceText}.`,
        consequence:
          "The move buys nothing, because the machine goes to its own tool change position anyway — and it takes the old tool back across the work at rapid speed to get there.",
        fix: "Retract in Z and change the tool from there: G0 Z25.0, then T2 M6. Leave positioning until the new tool has its own length offset applied.",
      });
    }
  }

  /* -------------------------------------------------------------- *
   * How the program ends                                            *
   * -------------------------------------------------------------- */

  const ends = hasM(2) || hasM(30);
  if (!ends) {
    found.push({
      lineIndex: lastContentLine,
      severity: "warning",
      code: "no-program-end",
      message: "The program has no M2 or M30: nothing in it tells the control that it has finished.",
      consequence:
        "The control simply runs out of file, leaving everything as the program left it — spindle, coolant and modal state — and it is not reset to the top ready for the next part.",
      fix: "End with M30 (finish and rewind to the first line) or M2 (finish where it stands), after retracting in Z and stopping the spindle.",
    });
  }

  const spindleStarted = hasM(3) || hasM(4);
  if (spindleStarted && !hasM(5)) {
    found.push(
      ends
        ? {
            lineIndex: lastContentLine,
            severity: "note",
            code: "spindle-left-running",
            message: "The program ends without an explicit M5, so nothing in the program itself stops the spindle.",
            consequence:
              "Most controls do stop the spindle at M2 or M30, but that is the control's own behaviour rather than something this program asked for, and this model cannot know what your control does.",
            fix: "Say it out loud: M5 on the line before M30. It costs one line and removes an assumption.",
          }
        : {
            lineIndex: lastContentLine,
            severity: "warning",
            code: "spindle-left-running",
            message: "The program runs off the end with the spindle still turning: there is no M5 anywhere in it.",
            consequence:
              "A spinning tool at the end of a program is a spinning tool nobody is expecting. Anyone reaching in to measure the part or clear chips away meets a live cutter.",
            fix: "Retract, stop the spindle, then end: G0 Z25.0, M5, M30. Commanding M5 yourself is the habit worth building — do not leave it to the end-of-program code.",
          },
    );
  }

  /* -------------------------------------------------------------- */

  const seen = new Set<string>();
  return found
    .filter((diagnostic) => {
      const key = `${diagnostic.code}|${diagnostic.lineIndex}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        a.lineIndex - b.lineIndex || SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
    );
}
