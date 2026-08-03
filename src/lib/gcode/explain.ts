/**
 * Per-command teaching text for the G-code simulator. SPEC.md section 16 item 1,
 * and the promise the /simulator page makes: for each block, a plain-language
 * sentence first and the correct terminology second — what the machine was asked
 * to do, and which words are modal and therefore still in force on the next line.
 *
 * Two rules shape everything in this file.
 *
 * PLAIN LANGUAGE FIRST. Every `body` opens with what the machine does and only
 * then names the idea. Someone who has never seen a program should be able to
 * read any one word explanation without having read another one first.
 *
 * MODALITY IS THE IDEA BEGINNERS MISS, so `modal` is not decoration. It marks the
 * words whose value is carried onto the following lines, which is exactly what
 * makes an otherwise bare `X10 Y10` legible: G0-G3, G17-G19, G20/G21, G90/G91,
 * G54-G59, G43/G49, F, S and T. G4, G28, M0/M1/M2/M30, M3/M4/M5, M6 and M8/M9 are
 * not marked: they are things that happen once, on the line that asks for them.
 * The spindle and the coolant do of course stay on afterwards, but that is a
 * machine state the readout shows, not a value a later line inherits.
 *
 * The module is pure text. It reads the state either side of a line and returns
 * sentences; it computes no geometry, and it never asserts anything about a real
 * machine — least of all about tool length, which it cannot know.
 */

import { formatFixed } from "../format";
import type {
  DistanceMode,
  GcodeWord,
  LineExplanation,
  MachineState,
  MotionMode,
  ParsedLine,
  Plane,
  WordExplanation,
} from "./types";

/* ------------------------------------------------------------------ *
 * Small formatting helpers                                            *
 * ------------------------------------------------------------------ */

/** Coordinates are shown the way a readout shows them: three decimals. */
function coord(value: number): string {
  return formatFixed(value, 3);
}

/** Feeds, speeds and tool numbers read better without trailing zeros. */
function trim(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(Math.round(value * 1000) / 1000);
}

function axisAt(letter: string, value: number): string {
  return `${letter}${coord(value)}`;
}

function joinClauses(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function sentence(text: string): string {
  const trimmed = text.trim();
  if (trimmed === "") return "";
  const body = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(body) ? body : `${body}.`;
}

const AXIS_KEY = { X: "x", Y: "y", Z: "z" } as const;
type AxisLetter = keyof typeof AXIS_KEY;

/** The two words that give an arc centre in each plane, and the axis each names. */
const CENTRE_LETTERS: Record<Plane, [string, string]> = {
  XY: ["I", "J"],
  ZX: ["I", "K"],
  YZ: ["J", "K"],
};

const CENTRE_AXIS: Record<string, string> = { I: "X", J: "Y", K: "Z" };

const PLANE_WORD: Record<Plane, string> = { XY: "G17", ZX: "G18", YZ: "G19" };
const MOTION_WORD: Record<MotionMode, string> = {
  rapid: "G00",
  feed: "G01",
  "arc-cw": "G02",
  "arc-ccw": "G03",
};

/* ------------------------------------------------------------------ *
 * Line context                                                        *
 * ------------------------------------------------------------------ */

interface LineContext {
  line: ParsedLine;
  before: MachineState;
  after: MachineState;
  /** The mode this line executes under — a G90 on this line applies to it. */
  motion: MotionMode;
  distance: DistanceMode;
  plane: Plane;
  gValues: Set<number>;
  mValues: Set<number>;
  has: (letter: string) => boolean;
  wordOf: (letter: string) => GcodeWord | undefined;
  /** True when this line commands an arc. */
  arc: boolean;
  /** Axis letters written on this line, in X, Y, Z order. */
  namedAxes: AxisLetter[];
}

function buildContext(line: ParsedLine, before: MachineState, after: MachineState): LineContext {
  const gValues = new Set(line.words.filter((w) => w.letter === "G").map((w) => w.value));
  const mValues = new Set(line.words.filter((w) => w.letter === "M").map((w) => w.value));
  const has = (letter: string) => line.words.some((w) => w.letter === letter);
  const wordOf = (letter: string) => line.words.find((w) => w.letter === letter);

  const motion = after.motion;
  const namedAxes = (["X", "Y", "Z"] as AxisLetter[]).filter((letter) => has(letter));

  return {
    line,
    before,
    after,
    motion,
    distance: after.distance,
    plane: after.plane,
    gValues,
    mValues,
    has,
    wordOf,
    arc: motion === "arc-cw" || motion === "arc-ccw",
    namedAxes,
  };
}

/* ------------------------------------------------------------------ *
 * G words                                                             *
 * ------------------------------------------------------------------ */

interface Spec {
  title: string;
  body: string;
  modal: boolean;
}

/** Cycles this model does not run. Named so the explanation can say so plainly. */
const CANNED_CYCLES = new Set([73, 74, 76, 81, 82, 83, 84, 85, 86, 87, 88, 89]);

function explainG(word: GcodeWord, ctx: LineContext): Spec {
  const value = word.value;
  const [firstCentre, secondCentre] = CENTRE_LETTERS[ctx.plane];

  if (Number.isInteger(value)) {
    if (value >= 54 && value <= 59) {
      const number = value - 53;
      return {
        title: `Work coordinate system ${number}`,
        body: `Use the offset stored in G${value} to say where this part is clamped on the table, so that every coordinate in the program is measured from the part rather than from the machine. It stays in force until another work offset replaces it.`,
        modal: true,
      };
    }
    if (CANNED_CYCLES.has(value)) {
      return {
        title: `Canned cycle G${value}`,
        body: `A one-line drilling, tapping or boring cycle: the control repeats a whole retract, position, plunge and retract sequence at every point that follows. This model does not run canned cycles, so nothing is drawn for it — write the moves out in full and you will see each one on the toolpath.`,
        modal: true,
      };
    }

    switch (value) {
      case 0:
        return {
          title: "Rapid positioning",
          body: "Move to the point as fast as the machine will go. A rapid is for getting somewhere, never for cutting, and on many machines the axes each simply run at their own top speed, so the path is not necessarily the straight line between the two points.",
          modal: true,
        };
      case 1:
        return {
          title: "Straight cut at the feed rate",
          body: "Move in a straight line at the feed rate the F word sets, cutting the whole way. This is the workhorse of milling: most of the metal a program removes comes off under G1.",
          modal: true,
        };
      case 2:
        return {
          title: "Clockwise arc",
          body: `Cut an arc from where the tool is now round to the end point, going clockwise as the part is seen from above when G17 is in force. Where the centre sits comes from ${firstCentre} and ${secondCentre}, measured from the start of the arc, or from R, the radius.`,
          modal: true,
        };
      case 3:
        return {
          title: "Anticlockwise arc",
          body: `Cut an arc round to the end point going anticlockwise, the other way round from G2. The centre comes from ${firstCentre} and ${secondCentre} measured from the start of the arc, or from R.`,
          modal: true,
        };
      case 4:
        return {
          title: "Dwell",
          body: "Stay exactly where you are for the time given by the P word, with the spindle still turning. It happens once, on this line only, and is used to let a spindle reach speed or to clean up the bottom of a bore.",
          modal: false,
        };
      case 17:
        return {
          title: "XY plane",
          body: "Arcs are interpolated in the XY plane, so I and J give the centre and Z is the axis they turn about. This is the normal setting for milling on a vertical machine, and it stays in force until G18 or G19 changes it.",
          modal: true,
        };
      case 18:
        return {
          title: "ZX plane",
          body: "Arcs are interpolated in the ZX plane, so I and K give the centre and the arc turns about Y. Set it for an arc cut down the side of a part, and set G17 back afterwards.",
          modal: true,
        };
      case 19:
        return {
          title: "YZ plane",
          body: "Arcs are interpolated in the YZ plane, so J and K give the centre and the arc turns about X. Set G17 back afterwards, or the next ordinary arc will be cut in the wrong plane.",
          modal: true,
        };
      case 20:
        return {
          title: "Work in inches",
          body: "Read every length on the lines that follow as inches. This model converts them to millimetres as it reads, so the drawing and the readout stay in millimetres; getting this word wrong is the classic expensive mistake, because the same numbers then mean 25.4 times the distance.",
          modal: true,
        };
      case 21:
        return {
          title: "Work in millimetres",
          body: "Read every length on the lines that follow as millimetres. State the units at the top of every program: whatever mode the control was left in by the last job is the mode you inherit.",
          modal: true,
        };
      case 28:
        return {
          title: "Return to the machine reference position",
          body: "Send the machine back to its own home reference position, by way of the point on this line if one is given. It happens once, on this line, and this model knows nothing about your machine's travels or where its reference position is, so treat what it draws here as indicative only.",
          modal: false,
        };
      case 40:
        return {
          title: "Cancel cutter compensation",
          body: "Stop offsetting the path to one side of the programmed line, so the coordinates once again describe where the centre of the tool goes. This model always draws the centre of the tool, so it shows no change here.",
          modal: true,
        };
      case 41:
      case 42:
        return {
          title: `Cutter compensation ${value === 41 ? "left" : "right"}`,
          body: `Ask the control to shift the path by the tool radius in the D register, to the ${value === 41 ? "left" : "right"} of the direction of travel, so the program can describe the finished edge instead of the tool centre. This model does not apply that shift: the path it draws is the line as written, not the line the machine would take.`,
          modal: true,
        };
      case 43:
        return {
          title: "Tool length offset on",
          body: "From here on, Z is measured from the tip of this tool, using the length stored in the offset register the H word names. This model records the H number and nothing else: it cannot know how far your tool actually sticks out of the holder, so it cannot tell you whether your Z is right.",
          modal: true,
        };
      case 49:
        return {
          title: "Cancel tool length offset",
          body: "Stop applying any tool length, so Z goes back to being measured without one. Cancelling before a tool change is a common habit; leaving it cancelled while cutting is not.",
          modal: true,
        };
      case 53:
        return {
          title: "Move in machine coordinates",
          body: "For this line only, read the coordinates as positions in the machine's own coordinate system rather than from part zero. This model has no machine coordinate system and no knowledge of your machine's travels, so it cannot show you where that would be.",
          modal: false,
        };
      case 80:
        return {
          title: "Cancel canned cycle",
          body: "Stop the drilling or boring cycle that was in force, so ordinary moves behave normally again. This model does not run canned cycles, so there is nothing here for it to cancel.",
          modal: true,
        };
      case 90:
        return {
          title: "Absolute positioning",
          body: "Every coordinate from here on is a position measured from part zero. X60 means go to sixty, not go sixty further, and the mode stays in force until G91 changes it.",
          modal: true,
        };
      case 91:
        return {
          title: "Incremental positioning",
          body: "Every coordinate from here on is a distance from wherever the tool is now. X60 means go sixty millimetres further along X — powerful for a repeated pattern, and the easiest way there is to send a tool somewhere you did not intend.",
          modal: true,
        };
      case 94:
        return {
          title: "Feed in units per minute",
          body: "Read F as a speed: millimetres per minute here. This is the mode this model always works in, and the one nearly every milling program uses.",
          modal: true,
        };
      case 95:
        return {
          title: "Feed per revolution",
          body: "Read F as a distance the tool advances for each turn of the spindle rather than a speed. This model works in millimetres per minute and does not convert feed per revolution, so treat the times and feeds it shows for such a program as unreliable.",
          modal: true,
        };
      default:
        break;
    }
  }

  return {
    title: `G${trim(value)} is not simulated here`,
    body: "This model does not simulate this code, so the toolpath is drawn as though the line were not there. G codes beyond the common set differ between controls: check the programming manual for the machine you are on.",
    modal: false,
  };
}

/* ------------------------------------------------------------------ *
 * M words                                                             *
 * ------------------------------------------------------------------ */

function explainM(word: GcodeWord, ctx: LineContext): Spec {
  const value = word.value;
  const speed = ctx.after.spindleSpeed;
  const speedPhrase =
    speed > 0 ? `at the ${trim(speed)} rev/min the S word asks for` : "at the speed set by S";

  if (Number.isInteger(value)) {
    switch (value) {
      case 0:
        return {
          title: "Program stop",
          body: "Stop everything here and wait until somebody presses cycle start. Used mid-program to measure the part or clear chips away, and it happens every time the program runs.",
          modal: false,
        };
      case 1:
        return {
          title: "Optional stop",
          body: "Stop here only if the optional stop switch on the control is turned on; otherwise carry straight on. Handy for a check you want on the first part and not on the next hundred.",
          modal: false,
        };
      case 2:
        return {
          title: "End of program",
          body: "Finish the program where it stands. Most controls also reset the modal state at the end, but never lean on that to stop the spindle or the coolant: command M5 yourself.",
          modal: false,
        };
      case 3:
        return {
          title: "Spindle on, clockwise",
          body: `Start the spindle turning clockwise ${speedPhrase}. Clockwise seen from above the spindle is the normal direction for an ordinary right-hand cutter.`,
          modal: false,
        };
      case 4:
        return {
          title: "Spindle on, anticlockwise",
          body: `Start the spindle turning anticlockwise ${speedPhrase}. Ordinary right-hand cutters will rub rather than cut this way round, so it belongs to left-hand tools and to tapping.`,
          modal: false,
        };
      case 5:
        return {
          title: "Spindle stop",
          body: "Stop the spindle turning. Command it yourself at the end of a program rather than trusting the end-of-program code to do it for you.",
          modal: false,
        };
      case 6:
        return {
          title: "Tool change",
          body: "Carry out the tool change to whichever tool the T word selected. The machine goes to its own tool change position to do it, and this model knows nothing about where that is, so get the tool clear in Z before you ask for a change.",
          modal: false,
        };
      case 7:
      case 8:
        return {
          title: value === 7 ? "Mist coolant on" : "Flood coolant on",
          body: "Turn the coolant on. This model tracks coolant as nothing more than on or off; it has no idea whether any is actually reaching the cut.",
          modal: false,
        };
      case 9:
        return {
          title: "Coolant off",
          body: "Turn the coolant off. Programs usually do this at the end, alongside stopping the spindle.",
          modal: false,
        };
      case 30:
        return {
          title: "End of program and rewind",
          body: "Finish the program and go back to the first line, ready to run the next part. It is the usual way to end a production program.",
          modal: false,
        };
      case 98:
      case 99:
        return {
          title: value === 98 ? "Call a subprogram" : "Return from a subprogram",
          body: "Jump to another program (or back from it) so that a shape can be written once and used many times. This model runs the lines in front of it from top to bottom and does not follow subprogram calls.",
          modal: false,
        };
      default:
        break;
    }
  }

  return {
    title: `M${trim(value)} is not simulated here`,
    body: "This model does not simulate this code. Many M codes belong to one machine and nothing else — an air blast, a door, a pallet change — so check the manual for the machine you are on.",
    modal: false,
  };
}

/* ------------------------------------------------------------------ *
 * Axis and argument words                                             *
 * ------------------------------------------------------------------ */

function explainAxis(letter: AxisLetter, ctx: LineContext): Spec {
  const key = AXIS_KEY[letter];
  const from = ctx.before.position[key];
  const to = ctx.after.position[key];
  const delta = to - from;

  if (ctx.distance === "incremental") {
    const direction = delta < 0 ? "negative" : "positive";
    return {
      title: `Step along ${letter}`,
      body: `How far to move along ${letter} from wherever the tool is now: ${coord(Math.abs(delta))} mm in the ${direction} direction, finishing at ${axisAt(letter, to)}. With G91 in force the number is a distance, not a place.`,
      modal: false,
    };
  }

  if (letter === "Z") {
    if (to < 0) {
      return {
        title: "Target Z position",
        body: `Where the move ends on the Z axis: the tool tip finishes at ${axisAt("Z", to)}, below part zero. Where part zero is set on the top face of the stock, as it usually is, that is a cut ${coord(Math.abs(to))} mm deep.`,
        modal: false,
      };
    }
    return {
      title: "Target Z position",
      body: `Where the move ends on the Z axis: the tool tip finishes at ${axisAt("Z", to)}, above part zero. Height is the one axis worth reading twice, because this model cannot know your tool length, your fixture or what is sitting on the table.`,
      modal: false,
    };
  }

  return {
    title: `Target ${letter} position`,
    body: `Where the move ends on the ${letter} axis, measured from part zero: ${axisAt(letter, to)}. With G90 in force that is a place, not a distance — the tool finishes there however far away it happened to start.`,
    modal: false,
  };
}

function explainCentre(word: GcodeWord, ctx: LineContext): Spec {
  const letter = word.letter;
  const axis = CENTRE_AXIS[letter] ?? letter;
  const [firstCentre, secondCentre] = CENTRE_LETTERS[ctx.plane];
  const belongs = letter === firstCentre || letter === secondCentre;

  if (!belongs) {
    return {
      title: `${letter} is not used in the ${ctx.plane} plane`,
      body: `${letter} describes the ${axis} axis, but arcs are being interpolated in the ${ctx.plane} plane, where the centre is given by ${firstCentre} and ${secondCentre}. Check that the plane word (G17, G18 or G19) and the centre words agree with one another.`,
      modal: false,
    };
  }

  if (!ctx.arc) {
    return {
      title: "Arc centre offset",
      body: `${letter} says how far the centre of an arc sits from the start of that arc, measured along ${axis}. No arc is commanded on this line, so nothing here uses it.`,
      modal: false,
    };
  }

  return {
    title: "Arc centre offset",
    body: `How far the centre of the arc sits from the START of the arc, measured along ${axis}. ${firstCentre} and ${secondCentre} are offsets from where the arc begins, never positions from part zero — remembering that one sentence prevents most arc alarms.`,
    modal: false,
  };
}

function explainWordSpec(word: GcodeWord, ctx: LineContext): Spec {
  switch (word.letter) {
    case "G":
      return explainG(word, ctx);
    case "M":
      return explainM(word, ctx);
    case "X":
    case "Y":
    case "Z":
      return explainAxis(word.letter as AxisLetter, ctx);
    case "I":
    case "J":
    case "K":
      return explainCentre(word, ctx);
    case "R":
      return {
        title: "Arc radius",
        body: `The radius of the arc, given instead of its centre. It is quicker to write, but many controls read a positive R as the shorter way round and a negative R as the longer, and near a half turn those two arcs are almost the same size — so ${CENTRE_LETTERS[ctx.plane][0]} and ${CENTRE_LETTERS[ctx.plane][1]} are the safer habit for anything past a quarter circle.`,
        modal: false,
      };
    case "F":
      if (ctx.after.units === "inch") {
        return {
          title: "Feed rate",
          body: `How fast the tool travels while cutting. The program writes it in inches per minute; this model works in millimetres, so the feed now in force is ${trim(ctx.after.feed)} mm/min. It is modal and stays in force until another F changes it.`,
          modal: true,
        };
      }
      return {
        title: "Feed rate",
        body: `How fast the tool travels while cutting: ${trim(ctx.after.feed)} millimetres per minute. It stays in force until another F changes it, and G0 ignores it entirely — a rapid always moves at the machine's own traverse rate.`,
        modal: true,
      };
    case "S":
      return {
        title: "Spindle speed",
        body: `How fast the spindle is asked to turn: ${trim(ctx.after.spindleSpeed)} revolutions per minute, the shop unit for a quantity whose SI form is radians per second (1 rev/min is 2π/60 rad/s). S on its own turns nothing — the spindle starts at M3 or M4 and stops at M5 — and the speed stays in force until another S changes it.`,
        modal: true,
      };
    case "T":
      return {
        title: "Tool select",
        body: `Choose tool ${trim(ctx.after.tool)} for the next tool change. On most machines T only gets the tool ready and M6 is what actually puts it in the spindle, which is why the two so often share a line.`,
        modal: true,
      };
    case "H":
      return {
        title: "Tool length offset register",
        body: `Names the offset register — H${trim(word.value)} — that G43 reads this tool's length from, and it is normally the same number as the tool. This model records the number and nothing else: it has no idea how far your tool really sticks out of the holder, so it cannot tell you whether your Z is safe.`,
        modal: false,
      };
    case "D":
      return {
        title: "Cutter compensation register",
        body: "Names the register holding the tool radius that G41 or G42 offsets the path by. This model draws the centre of the tool exactly as programmed and never applies that offset.",
        modal: false,
      };
    case "N":
      return {
        title: "Line number",
        body: "A label for this block, so that people and the control can refer to it by name. It changes nothing: the control runs the lines in the order they are written, not in N order.",
        modal: false,
      };
    case "P":
      if (ctx.gValues.has(4)) {
        return {
          title: "Dwell time",
          body: "How long the G4 dwell lasts. Controls differ over the unit here — many read P in seconds, some in milliseconds — so check the manual for the machine you are on.",
          modal: false,
        };
      }
      return {
        title: "Parameter",
        body: "A parameter belonging to another word on this line, so what it means depends on that word. This model uses P for one thing only: the time a G4 dwell lasts.",
        modal: false,
      };
    case "O":
      return {
        title: "Program number",
        body: "The number this program is stored under, which is how the control finds it in memory. It does not change anything the machine does.",
        modal: false,
      };
    default:
      return {
        title: `The ${word.letter} word is not used here`,
        body: `This model does not use ${word.letter}, so it reads the line without it. Address letters vary between controls — rotary axes, tool life counters and machine options all claim their own — so check the programming manual for the machine you are on.`,
        modal: false,
      };
  }
}

function explainWord(word: GcodeWord, ctx: LineContext): WordExplanation {
  const spec = explainWordSpec(word, ctx);
  return { word: word.text, title: spec.title, body: spec.body, modal: spec.modal };
}

/* ------------------------------------------------------------------ *
 * The one-sentence summary                                            *
 * ------------------------------------------------------------------ */

function motionClause(ctx: LineContext): string | null {
  const { line, before, after, motion, namedAxes } = ctx;
  const hasCentre = line.words.some((w) => "IJKR".includes(w.letter));
  const verb =
    motion === "rapid"
      ? "rapid"
      : motion === "feed"
        ? "cut in a straight line"
        : motion === "arc-cw"
          ? "cut a clockwise arc"
          : "cut an anticlockwise arc";
  const feedPhrase = motion === "rapid" ? "" : ` at ${trim(after.feed)} mm/min`;

  if (namedAxes.length === 0) {
    if (ctx.arc && hasCentre) {
      return `${verb} right round the centre and back to where it started${feedPhrase}`;
    }
    return null;
  }

  // A move in Z alone reads far better as up or down than as a coordinate list.
  if (namedAxes.length === 1 && namedAxes[0] === "Z" && ctx.distance === "absolute") {
    const target = axisAt("Z", after.position.z);
    const down = after.position.z < before.position.z;
    if (motion === "rapid") {
      return down ? `rapid down to ${target}` : `retract at rapid to ${target}`;
    }
    return down
      ? `feed straight down to ${target}${feedPhrase}`
      : `feed straight up to ${target}${feedPhrase}`;
  }

  if (ctx.distance === "incremental") {
    const steps = namedAxes
      .map((letter) => {
        const delta = after.position[AXIS_KEY[letter]] - before.position[AXIS_KEY[letter]];
        return `${letter}${delta >= 0 ? "+" : "-"}${coord(Math.abs(delta))}`;
      })
      .join(" ");
    const ends = namedAxes.map((letter) => axisAt(letter, after.position[AXIS_KEY[letter]])).join(" ");
    return `${verb}${feedPhrase}, stepping ${steps} to finish at ${ends}`;
  }

  const targets = namedAxes.map((letter) => axisAt(letter, after.position[AXIS_KEY[letter]])).join(" ");
  const holdsZ =
    !namedAxes.includes("Z") && (namedAxes.includes("X") || namedAxes.includes("Y"))
      ? `, holding ${axisAt("Z", after.position.z)}`
      : "";
  return `${verb} to ${targets}${feedPhrase}${holdsZ}`;
}

function buildSummary(ctx: LineContext): string {
  const { line, after, gValues, mValues, has, wordOf } = ctx;

  if (line.empty) {
    if (line.comments.length > 0) {
      return "A comment for whoever reads the program; the control skips straight past it.";
    }
    return "A blank line — nothing for the control to do.";
  }

  const clauses: string[] = [];

  if (gValues.has(20)) clauses.push("read every length that follows as inches");
  if (gValues.has(21)) clauses.push("read every length that follows as millimetres");
  if (gValues.has(90)) clauses.push("read coordinates as positions measured from part zero");
  if (gValues.has(91)) clauses.push("read coordinates as distances from where the tool is now");
  if (gValues.has(17)) clauses.push("interpolate arcs in the XY plane");
  if (gValues.has(18)) clauses.push("interpolate arcs in the ZX plane");
  if (gValues.has(19)) clauses.push("interpolate arcs in the YZ plane");
  if (gValues.has(94)) clauses.push("read the feed rate as millimetres per minute");
  if (gValues.has(95)) clauses.push("read the feed rate as a distance per turn of the spindle");
  if (gValues.has(40)) clauses.push("cancel cutter compensation");
  if (gValues.has(41)) clauses.push("offset the path a tool radius to the left of the line");
  if (gValues.has(42)) clauses.push("offset the path a tool radius to the right of the line");
  if (gValues.has(80)) clauses.push("cancel the canned cycle");

  for (let code = 54; code <= 59; code += 1) {
    if (gValues.has(code)) clauses.push(`pick up work offset G${code}`);
  }

  const toolWord = wordOf("T");
  if (toolWord && mValues.has(6)) {
    clauses.push(`select tool ${trim(after.tool)} and change to it`);
  } else if (toolWord) {
    clauses.push(`select tool ${trim(after.tool)}, ready for the next tool change`);
  } else if (mValues.has(6)) {
    clauses.push("change to the selected tool");
  }

  if (gValues.has(43)) {
    const hWord = wordOf("H");
    clauses.push(
      hWord
        ? `apply the tool length offset held in register H${trim(hWord.value)}`
        : "apply the tool length offset",
    );
  }
  if (gValues.has(49)) clauses.push("cancel the tool length offset");

  const spindleWord = has("S");
  if (mValues.has(3) || mValues.has(4)) {
    const direction = mValues.has(3) ? "clockwise" : "anticlockwise";
    if (after.spindleSpeed > 0) {
      clauses.push(`start the spindle ${direction} at ${trim(after.spindleSpeed)} rev/min`);
    } else {
      clauses.push(`start the spindle ${direction}, though no speed has been commanded`);
    }
  } else if (spindleWord) {
    clauses.push(`set the spindle speed to ${trim(after.spindleSpeed)} rev/min`);
  }
  if (mValues.has(5)) clauses.push("stop the spindle");
  if (mValues.has(7) || mValues.has(8)) clauses.push("turn the coolant on");
  if (mValues.has(9)) clauses.push("turn the coolant off");

  const motion = motionClause(ctx);
  if (motion) {
    clauses.push(motion);
  } else if (has("F") && !gValues.has(94) && !gValues.has(95)) {
    clauses.push(`set the feed rate to ${trim(after.feed)} mm/min for the moves that follow`);
  }

  if (gValues.has(4)) clauses.push("hold still for the time in the P word, without moving");
  if (gValues.has(28)) clauses.push("send the machine back to its own reference position");
  if (gValues.has(53)) clauses.push("read this line's coordinates as machine positions");
  if (mValues.has(0)) clauses.push("stop and wait for somebody to press cycle start");
  if (mValues.has(1)) clauses.push("stop here if optional stop is switched on at the control");
  if (mValues.has(2)) clauses.push("end the program");
  if (mValues.has(30)) clauses.push("end the program and rewind to the top, ready for the next part");

  if (clauses.length === 0) {
    return "Nothing on this line commands motion or changes a setting this model follows.";
  }

  const core = joinClauses(clauses);
  if (line.blockDelete) {
    return sentence(
      `${core} — though the slash at the start means the control skips the whole line when block delete is switched on`,
    );
  }
  return sentence(core);
}

/* ------------------------------------------------------------------ *
 * Inherited modal words                                               *
 * ------------------------------------------------------------------ */

/**
 * The modal words still in force on this line that the line did not set itself.
 * Derived from the state BEFORE the line, because that is what the line inherits.
 * This is the list that makes a bare `X10 Y10` legible.
 */
function collectInherited(line: ParsedLine, before: MachineState): string[] {
  const gValues = new Set(line.words.filter((w) => w.letter === "G").map((w) => w.value));
  const setsMotion = gValues.has(0) || gValues.has(1) || gValues.has(2) || gValues.has(3);
  const setsPlane = gValues.has(17) || gValues.has(18) || gValues.has(19);
  const setsUnits = gValues.has(20) || gValues.has(21);
  const setsDistance = gValues.has(90) || gValues.has(91);
  const setsOffset = [54, 55, 56, 57, 58, 59].some((code) => gValues.has(code));
  const setsToolLength = gValues.has(43) || gValues.has(49);
  const hasLetter = (letter: string) => line.words.some((w) => w.letter === letter);
  // Motion is only worth listing where it is doing work: on a line that names a
  // coordinate without naming a motion word, which is the case a beginner cannot
  // read at all until somebody points at the G1 three lines above.
  const hasAxis = line.words.some((w) => "XYZIJKR".includes(w.letter));

  const out: string[] = [];
  if (hasAxis && !setsMotion) out.push(MOTION_WORD[before.motion]);
  if (!setsDistance) out.push(before.distance === "absolute" ? "G90" : "G91");
  if (!setsUnits) out.push(before.units === "mm" ? "G21" : "G20");
  if (!setsPlane) out.push(PLANE_WORD[before.plane]);
  if (!setsOffset && before.workOffset !== "none") out.push(before.workOffset);
  if (!setsToolLength && before.toolLengthOffset) out.push("G43");
  if (!hasLetter("T") && before.tool > 0) out.push(`T${trim(before.tool)}`);
  if (!hasLetter("S") && before.spindleSpeed > 0) out.push(`S${trim(before.spindleSpeed)}`);
  if (!hasLetter("F") && before.feed > 0) out.push(`F${trim(before.feed)}`);
  return out;
}

export function explainLine(
  line: ParsedLine,
  before: MachineState,
  after: MachineState,
): LineExplanation {
  const ctx = buildContext(line, before, after);
  return {
    lineIndex: line.index,
    summary: buildSummary(ctx),
    words: line.words.map((word) => explainWord(word, ctx)),
    inheritedModals: line.empty ? [] : collectInherited(line, before),
  };
}
