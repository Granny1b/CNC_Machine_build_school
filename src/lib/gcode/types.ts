/**
 * The G-code simulator contract. SPEC.md section 16 item 1.
 *
 * Everything here is pure data. The parser produces it, the interpreter walks
 * it, and the components only ever read it — so the simulator can be tested
 * without a browser, and so no component ever holds machine state of its own.
 *
 * THE ONE HARD RULE: this is a browser-only teaching model. Nothing in this
 * module, or anything built on it, may acquire a route to hardware — no serial,
 * no network output, no export that a control could consume as a job. The model
 * deliberately knows nothing about fixtures, clamps, real tool lengths, machine
 * travels or what is on the table, which is exactly why it must never be
 * mistaken for proving a program out.
 *
 * Internal units are ALWAYS millimetres and millimetres per minute. `G20`
 * converts at the point of parsing so that one unit system reaches the rest of
 * the system. SPEC rule 5: SI internally, shop units shown at the edges.
 */

export type LengthUnit = "mm" | "inch";
export type Plane = "XY" | "ZX" | "YZ";
export type DistanceMode = "absolute" | "incremental";
export type MotionMode = "rapid" | "feed" | "arc-cw" | "arc-ccw";
export type SpindleState = "off" | "cw" | "ccw";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/* ---------------- Lexing and parsing ---------------- */

/** One address-and-value pair, e.g. `G01` or `X-12.5`. */
export interface GcodeWord {
  /** Upper-case address letter: G, M, X, Y, Z, I, J, K, R, F, S, T, N, P. */
  letter: string;
  value: number;
  /** The word exactly as written, for echoing back to the learner. */
  text: string;
  /** 0-based column in the source line, so an issue can point at it. */
  column: number;
}

export interface ParsedLine {
  /** 0-based index into the source lines. */
  index: number;
  raw: string;
  words: GcodeWord[];
  /** Comment text with its delimiters stripped, in the order written. */
  comments: string[];
  /** True when the line begins with `/`, the block-delete character. */
  blockDelete: boolean;
  /** The `N` word if present. Never used for control flow, only for display. */
  lineNumber?: number;
  /** True when the line carries no words at all (blank, or comment only). */
  empty: boolean;
}

/* ---------------- Machine state ---------------- */

/**
 * The modal state a line leaves behind. "Modal" is the whole point: a word set
 * on one line stays in force until something changes it, which is the single
 * idea beginners most often miss.
 */
export interface MachineState {
  /** Commanded position in work coordinates, millimetres. */
  position: Vec3;
  motion: MotionMode;
  plane: Plane;
  units: LengthUnit;
  distance: DistanceMode;
  /** Millimetres per minute. 0 means no feed has been commanded yet. */
  feed: number;
  /** Revolutions per minute. 0 means no speed has been commanded yet. */
  spindleSpeed: number;
  spindle: SpindleState;
  coolant: boolean;
  /** Tool number from the last `T` word. 0 means none selected. */
  tool: number;
  /** `G54`–`G59`, or "none" before one is commanded. */
  workOffset: string;
  /** True once `G43` has been seen; `G49` clears it. */
  toolLengthOffset: boolean;
  programEnded: boolean;
}

/* ---------------- Geometry ---------------- */

export interface PathSegment {
  kind: MotionMode;
  from: Vec3;
  to: Vec3;
  /** Absolute arc centre. Present only for `arc-cw` / `arc-ccw`. */
  centre?: Vec3;
  /** Arc radius in millimetres, present for arcs. */
  radius?: number;
  plane: Plane;
  /** Source line that produced this move. */
  lineIndex: number;
  /** Feed in mm/min for cutting moves; 0 for rapids. */
  feed: number;
  /** Path length in millimetres, following the arc where it is one. */
  length: number;
}

/* ---------------- Explanation ---------------- */

/**
 * Per-word teaching text. SPEC 16: plain language first, terminology second.
 * `modal` marks the words that stay in force on the following lines, because
 * that is the property a beginner cannot see from the listing.
 */
export interface WordExplanation {
  /** The word as written, e.g. `G01`. */
  word: string;
  /** Short title, e.g. "Linear feed move". */
  title: string;
  /** One or two plain sentences saying what the machine was asked to do. */
  body: string;
  modal: boolean;
}

export interface LineExplanation {
  lineIndex: number;
  /** One sentence covering the line as a whole, in plain language. */
  summary: string;
  words: WordExplanation[];
  /** Modal words still in force here that this line did not itself set. */
  inheritedModals: string[];
}

/* ---------------- Diagnostics ---------------- */

export type IssueSeverity = "error" | "warning" | "note";

/**
 * A diagnostic. Every one carries all three parts on purpose: what is wrong,
 * what would actually happen because of it, and what to do instead. A bare
 * "syntax error" teaches nothing, which is the same principle SPEC rule 8
 * applies to quiz answers.
 */
export interface Diagnostic {
  lineIndex: number;
  severity: IssueSeverity;
  /** Stable identifier, e.g. "plunge-at-feed". Used for tests and filtering. */
  code: string;
  /** What is wrong, in plain language. */
  message: string;
  /** What this would actually do on a machine. */
  consequence: string;
  /** What to write instead. */
  fix: string;
}

/* ---------------- The simulated program ---------------- */

export interface ExecutedStep {
  lineIndex: number;
  /** State before this line ran. */
  before: MachineState;
  /** State after this line ran. */
  after: MachineState;
  /** Moves this line produced. Usually one, sometimes none. */
  segments: PathSegment[];
}

export interface Bounds {
  min: Vec3;
  max: Vec3;
}

export interface SimulationOptions {
  /**
   * Assumed rapid traverse rate in mm/min, used only for the time estimate.
   * It is an assumption about a machine we know nothing about, so the UI must
   * label any time derived from it as an estimate. SPEC rule 3.
   */
  assumedRapidRate?: number;
  /**
   * Z height at or above which the tool is assumed clear of the workpiece and
   * the fixture. Also an assumption, and labelled as one wherever it is used.
   */
  clearanceZ?: number;
  /** Top face of the stock in Z. Moves below this are treated as in-material. */
  stockTopZ?: number;
}

export const DEFAULT_SIMULATION_OPTIONS: Required<SimulationOptions> = {
  assumedRapidRate: 10000,
  clearanceZ: 5,
  stockTopZ: 0,
};

export interface SimulatedProgram {
  lines: ParsedLine[];
  steps: ExecutedStep[];
  /** Every move in execution order — the toolpath. */
  segments: PathSegment[];
  explanations: LineExplanation[];
  diagnostics: Diagnostic[];
  /** Extent of the toolpath, or null when the program produces no motion. */
  bounds: Bounds | null;
  /** Estimated cycle time in minutes. An estimate, and labelled as one. */
  estimatedMinutes: number;
  /** Total distance travelled at feed, millimetres. */
  cuttingDistance: number;
  finalState: MachineState;
  options: Required<SimulationOptions>;
}

/** The state a control powers up in, before the program says anything. */
export function initialMachineState(): MachineState {
  return {
    position: { x: 0, y: 0, z: 0 },
    motion: "rapid",
    plane: "XY",
    units: "mm",
    distance: "absolute",
    feed: 0,
    spindleSpeed: 0,
    spindle: "off",
    coolant: false,
    tool: 0,
    workOffset: "none",
    toolLengthOffset: false,
    programEnded: false,
  };
}

export const MM_PER_INCH = 25.4;
