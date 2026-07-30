/**
 * The homepage hero program. SPEC.md section 5.4.
 *
 * The hero shows the course's central idea rather than describing it, so the
 * program has to be real: a valid, trivially simple rectangular contour whose
 * every line is a line Level 10 goes on to explain. Nothing here is decorative
 * gibberish, and no line appears in the listing that is not modelled below.
 *
 * The module is data plus pure functions. It holds the program, the machine
 * state each line produces, the nine-second timeline, and the prose that
 * accompanies the figure. `GcodeHero.tsx` decides only how it looks.
 *
 * The speed and feed are the course's canonical worked example — a 10 mm
 * four-flute carbide end mill in an aluminium alloy at a cutting speed of
 * 200 m/min and 0.05 mm per tooth — so the numbers on the homepage are the same
 * numbers the lessons and the machining calculator derive.
 */

/** A tool-tip position in the work coordinate system, in millimetres. */
export interface Pose {
  x: number;
  y: number;
  z: number;
}

export interface GcodeLine {
  /** The block exactly as it appears in the program. */
  text: string;
  /** Plain language first: what this line asks the machine to do. */
  explain: string;
  /** The machine state the line leaves behind, set as a mono readout. */
  result: string;
  /** Share of the cycle spent on this line, in seconds. */
  seconds: number;
  /** G00 is a rapid positioning move, G01 a straight cut at the feed rate. */
  motion?: "rapid" | "feed";
  /** Commanded target. Axes left out hold the position they already had. */
  target?: Partial<Pose>;
  /** Feed rate in force from this line onwards, mm/min. */
  feed?: number;
  /** Spindle speed in force from this line onwards, rev/min. */
  spindle?: number;
}

/* ---------------- The geometry the program produces ---------------- */

/** The contour: 60 mm along X, 40 mm along Y, cut 2 mm below the top face. */
export const CONTOUR = { width: 60, height: 40, depth: 2 } as const;

/** 60 + 40 + 60 + 40. The trace animation reveals this length. */
export const CONTOUR_PERIMETER = 2 * (CONTOUR.width + CONTOUR.height);

/** Safe height above the top face for rapid moves, mm. */
export const SAFE_Z = 25;
/** Height the rapid stops at before feeding into the material, mm. */
export const CLEARANCE_Z = 2;

export const TOOL_DIAMETER = 10;
export const SPINDLE_SPEED = 6366;
export const CUTTING_FEED = 1273;
export const PLUNGE_FEED = 200;

/**
 * Where the tool sits when the strip starts: parked clear of the part after the
 * tool change. Every machine parks somewhere different, which is why the figure
 * caption says so rather than presenting this as a standard position. It exists
 * so the first rapid is visible as a move rather than a jump.
 */
export const PROGRAM_START: Pose = { x: -20, y: -20, z: 40 };

/* ---------------- The program ---------------- */

export const gcodeProgram: GcodeLine[] = [
  {
    text: "O1000 (RECTANGULAR CONTOUR)",
    explain:
      "Program number 1000. Anything in brackets is a comment for the person reading the program — the machine skips straight past it.",
    result: "program O1000 loaded",
    seconds: 0.4,
  },
  {
    text: "G21 G90 G17",
    explain:
      "Three settings at once: work in millimetres, read every coordinate as an absolute position measured from part zero, and interpolate in the XY plane.",
    result: "mm · absolute · XY plane",
    seconds: 0.4,
  },
  {
    text: "G54",
    explain:
      "Use work coordinate system 1 — the stored offset that tells the control where on the table this part is actually clamped.",
    result: "work offset G54 active",
    seconds: 0.3,
  },
  {
    text: "T1 M06",
    explain:
      "Select tool 1, a `10 mm` four-flute end mill, and change to it. Selecting and changing are two separate jobs, which is why the line carries two words.",
    result: "T1 in the spindle",
    seconds: 0.5,
  },
  {
    text: "S6366 M03",
    explain:
      "Turn the spindle clockwise at `6366` revolutions per minute — the speed a `10 mm` cutter needs for a cutting speed of `200 m/min`.",
    result: "S6366 · clockwise",
    seconds: 0.5,
    spindle: SPINDLE_SPEED,
  },
  {
    text: "G43 H01 Z25.0",
    explain:
      "Apply the length offset stored for tool 1, so Z now reads from the tip of this tool, and move to a safe height `25 mm` above the top of the part.",
    result: "H01 applied · Z25.000",
    seconds: 0.5,
    motion: "rapid",
    target: { z: SAFE_Z },
  },
  {
    text: "G00 X0 Y0",
    explain:
      "Rapid — the fastest non-cutting move the machine has — across to part zero, the corner every coordinate in this program is measured from.",
    result: "X0.000 Y0.000 · over part zero",
    seconds: 0.6,
    motion: "rapid",
    target: { x: 0, y: 0 },
  },
  {
    text: "G00 Z2.0",
    explain:
      "Rapid down to `2 mm` above the material: close enough to save time, far enough that a rapid can never touch the part.",
    result: "Z2.000 · clear of the material",
    seconds: 0.4,
    motion: "rapid",
    target: { z: CLEARANCE_Z },
  },
  {
    text: "G01 Z-2.0 F200",
    explain:
      "Feed straight down at `200 mm/min` to `2 mm` below the top face. Plunging is the hardest thing you can ask of an end mill, so this feed is deliberately slow.",
    result: "Z-2.000 · cutting · F200",
    seconds: 0.6,
    motion: "feed",
    target: { z: -CONTOUR.depth },
    feed: PLUNGE_FEED,
  },
  {
    text: "G01 X60.0 F1273",
    explain:
      "Cut in a straight line to X60 at `1273 mm/min`, which is `6366` rev/min × `4` flutes × `0.05 mm` per tooth.",
    result: "X60.000 · F1273",
    seconds: 1.0,
    motion: "feed",
    target: { x: CONTOUR.width },
    feed: CUTTING_FEED,
  },
  {
    text: "G01 Y40.0",
    explain:
      "Cut to Y40. The plane, the units, the feed rate and the spindle speed are all still in force, so the line only has to say what changed.",
    result: "Y40.000 · F1273",
    seconds: 0.7,
    motion: "feed",
    target: { y: CONTOUR.height },
  },
  {
    text: "G01 X0",
    explain: "Cut back to X0 along the far side of the rectangle.",
    result: "X0.000 · F1273",
    seconds: 1.0,
    motion: "feed",
    target: { x: 0 },
  },
  {
    text: "G01 Y0",
    explain:
      "Cut back to Y0, closing the contour exactly where it started. Absolute positioning is what makes the corner land on the corner.",
    result: "Y0.000 · contour closed",
    seconds: 0.7,
    motion: "feed",
    target: { y: 0 },
  },
  {
    text: "G00 Z25.0",
    explain:
      "Rapid the tool straight up clear of the part. Retracting in Z before anything else moves is the habit that saves clamps and fixtures.",
    result: "Z25.000 · clear",
    seconds: 0.4,
    motion: "rapid",
    target: { z: SAFE_Z },
  },
  {
    text: "M05",
    explain: "Stop the spindle.",
    result: "spindle stopped",
    seconds: 0.3,
    spindle: 0,
  },
  {
    text: "M30",
    explain:
      "End of program, and reset back to the first line ready to run the next part.",
    result: "program end · ready to run again",
    seconds: 0.7,
  },
];

/* ---------------- The timeline ---------------- */

interface TimelineEntry {
  index: number;
  start: number;
  end: number;
  from: Pose;
  to: Pose;
  /** Contour distance already cut when the line starts and ends, mm. */
  cutFrom: number;
  cutTo: number;
  /** 0–1 along the rapid approach from the park position to part zero. */
  approachFrom: number;
  approachTo: number;
  spindle: number;
  feed: number;
}

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

const timeline: TimelineEntry[] = (() => {
  const entries: TimelineEntry[] = [];
  let clock = 0;
  let pose: Pose = { ...PROGRAM_START };
  let cut = 0;
  let approach = 0;
  let spindle = 0;
  let feed = 0;

  gcodeProgram.forEach((line, index) => {
    const from = pose;
    const to: Pose = {
      x: line.target?.x ?? from.x,
      y: line.target?.y ?? from.y,
      z: line.target?.z ?? from.z,
    };
    const planarDistance = Math.hypot(to.x - from.x, to.y - from.y);

    // A cutting move below the top face advances the contour trace. The plunge
    // is a feed move too, but it travels nowhere in X or Y, so it adds nothing.
    const cutFrom = cut;
    if (line.motion === "feed" && from.z < 0) cut += planarDistance;

    // The one rapid that travels in the plane is the approach to part zero.
    const approachFrom = approach;
    if (line.motion === "rapid" && planarDistance > 0) approach = 1;

    if (line.spindle !== undefined) spindle = line.spindle;
    if (line.feed !== undefined) feed = line.feed;

    entries.push({
      index,
      start: clock,
      end: clock + line.seconds,
      from,
      to,
      cutFrom,
      cutTo: cut,
      approachFrom,
      approachTo: approach,
      spindle,
      feed,
    });

    clock += line.seconds;
    pose = to;
  });

  return entries;
})();

/** The loop length. SPEC 5.4 asks for roughly nine seconds. */
export const CYCLE_SECONDS =
  Math.round(gcodeProgram.reduce((total, line) => total + line.seconds, 0) * 1000) / 1000;

export interface FrameState {
  /** Index into `gcodeProgram` of the line executing now. */
  lineIndex: number;
  pose: Pose;
  /** Which axes are moving on this line, so the readout can mark them live. */
  moving: { x: boolean; y: boolean; z: boolean };
  /** 0–1 of the contour cut so far, which drives the dash trace. */
  cutFraction: number;
  /** 0–1 along the rapid approach to part zero. */
  approachFraction: number;
  spindle: number;
  /** Modal feed rate, mm/min. Zero before the first F word. */
  feed: number;
  motion: "rapid" | "feed" | "none";
  /** True while the tool tip is below the top face of the material. */
  inCut: boolean;
}

/**
 * The machine state at `seconds` into the cycle. Positions are interpolated
 * along each move so the trace, the drawing and the readout cannot drift apart:
 * all three read this one function.
 */
export function frameAt(seconds: number): FrameState {
  const t = ((seconds % CYCLE_SECONDS) + CYCLE_SECONDS) % CYCLE_SECONDS;

  let entry = timeline[timeline.length - 1];
  for (const candidate of timeline) {
    if (t < candidate.end) {
      entry = candidate;
      break;
    }
  }

  const span = entry.end - entry.start;
  const u = span <= 0 ? 1 : clamp01((t - entry.start) / span);
  const line = gcodeProgram[entry.index];

  const pose: Pose = {
    x: lerp(entry.from.x, entry.to.x, u),
    y: lerp(entry.from.y, entry.to.y, u),
    z: lerp(entry.from.z, entry.to.z, u),
  };

  return {
    lineIndex: entry.index,
    pose,
    moving: {
      x: entry.from.x !== entry.to.x,
      y: entry.from.y !== entry.to.y,
      z: entry.from.z !== entry.to.z,
    },
    cutFraction: lerp(entry.cutFrom, entry.cutTo, u) / CONTOUR_PERIMETER,
    approachFraction: lerp(entry.approachFrom, entry.approachTo, u),
    spindle: entry.spindle,
    feed: entry.feed,
    motion: line.motion ?? "none",
    inCut: pose.z < 0,
  };
}

/**
 * The finished state: last line, contour complete, tool retracted to the safe
 * height above part zero, spindle stopped. This is the server-rendered first
 * paint and the state the strip holds under `prefers-reduced-motion`, so there
 * is never a flash of motion and never a hydration mismatch.
 */
export const FINAL_FRAME: FrameState = frameAt(CYCLE_SECONDS - 1e-6);

/* ---------------- Prose that travels with the figure ---------------- */

export const HERO_PROGRAM_NAME = "O1000 — rectangular contour";

export const HERO_SVG_LABEL =
  "Plan view of the toolpath: the cutter approaches from its parked position, feeds into the material at part zero and cuts a closed rectangle 60 millimetres along X by 40 millimetres along Y. Dimensions in millimetres.";

/**
 * The visible text alternative. Numbers sit between backticks so the renderer
 * can set them in mono without any number appearing in body copy — the same
 * convention the lesson prose uses. See `plainSegments` in `lib/autolink`.
 */
export const HERO_CAPTION =
  "Sixteen lines of G-code and the shape they cut. The program sets millimetres and absolute positioning, picks up work offset G54, changes to a `10 mm` four-flute end mill, starts the spindle clockwise at `6366 rev/min` and rapids to a safe height. It then rapids to part zero, feeds `2 mm` below the top face and cuts a closed rectangle — `60 mm` along X by `40 mm` along Y — at `1273 mm/min`, before retracting to `25 mm`, stopping the spindle and ending. The tool finishes where it began in X and Y, at `X 0.000 Y 0.000 Z 25.000`. The strip starts with the tool parked clear of the part; every machine's tool-change position is different, so treat that starting corner as illustrative.";

export const HERO_EXAMPLE_NOTE =
  "The spindle speed and feed rate are this course's worked example: a `10 mm` four-flute carbide end mill in an aluminium alloy, at a cutting speed of `200 m/min` with `0.05 mm` per tooth. They are illustrative teaching figures, not a recommendation. Real values come from the tool manufacturer's cutting data for your alloy, tool, machine and fixture.";

export const HERO_SI_NOTE =
  "Spindle speed is quoted in rev/min and feed in mm/min because that is what tooling data and the control itself use. In SI, `1 rev/min = 2π/60 rad/s ≈ 0.105 rad/s`, so `6366 rev/min` is about `667 rad/s`, and `1273 mm/min` is about `0.0212 m/s`.";

export const HERO_REDUCED_MOTION_NOTE =
  "Motion is paused because your system asks for reduced motion. The drawing below shows the finished toolpath and the position the program ends at. Press play if you would like to watch it run.";

export interface HeroLegendItem {
  kind: "rapid" | "cut" | "tool";
  label: string;
  meaning: string;
}

export const HERO_LEGEND: HeroLegendItem[] = [
  { kind: "rapid", label: "G00 rapid", meaning: "positioning, nothing being cut" },
  { kind: "cut", label: "G01 feed", meaning: "cutting at the programmed feed rate" },
  { kind: "tool", label: "Tool Ø10", meaning: "the cutter, drawn to size" },
];
