/**
 * The programs the G-code simulator ships with. SPEC.md section 16 item 1.
 *
 * Every program here is real, valid G-code, written out by hand and checked by
 * hand: every coordinate closes the shape it claims to cut, every arc end point
 * sits exactly one radius from the centre the line gives, and every comment says
 * something true about the line it sits on. SPEC 5.4 asks the same of the
 * homepage hero — nothing decorative, nothing that is not explained.
 *
 * The set is deliberately narrow. It uses only the words the simulator models:
 * G0 to G4, G17 to G19, G20/G21, G28, G43/G49, G54 to G59, G90/G91, and the M
 * codes for spindle, coolant, tool change and program end. There are no canned
 * cycles, because the model does not run them — the drilling sample writes the
 * retract, position, plunge and retract out in full instead, which is also how a
 * beginner learns what a cycle is doing on their behalf.
 *
 * Two of the programs are broken on purpose. They are marked `faulty` and carry a
 * list of what is wrong with them, so the page can say so before the learner
 * reads a line. They are syntactically perfect: they would load, and they would
 * run, and that is exactly the lesson.
 *
 * Speeds and feeds are illustrative teaching figures, chosen so the arithmetic is
 * visible, and they are labelled as such inside the programs themselves. They are
 * not cutting recommendations. None of these programs has been proved out on a
 * machine, and this model knows nothing about fixtures, clamps, real tool lengths
 * or machine travels — a clean simulation is not a proven program.
 */

export interface GcodeSample {
  id: string;
  title: string;
  blurb: string;
  /** What this program is for teaching. */
  teaches: string[];
  source: string;
  /** True when the program deliberately contains mistakes. */
  faulty?: boolean;
  /** For faulty samples: what is wrong, so the page can say so up front. */
  faults?: string[];
}

/**
 * The caveat that belongs beside any of these programs, wherever one is shown.
 * SPEC rules 3 and 4: every teaching figure says out loud that it is one.
 */
export const GCODE_SAMPLE_NOTE =
  "These are teaching programs. The speeds, feeds and depths in them are illustrative figures chosen to make the arithmetic visible, not cutting recommendations — real values come from the tool manufacturer's data for your tool, material, machine and fixture. Nothing here has been proved out on a machine, and this simulator knows nothing about your fixture, your clamps, your tool lengths or your machine's travels.";

export const gcodeSamples: GcodeSample[] = [
  {
    id: "rectangular-contour",
    title: "Rectangular contour",
    blurb:
      "The shortest program that does something real: set the machine up, get the tool clear, feed down to depth and cut a closed rectangle. It is the program on the home page, written out with a comment on every line, and it is the one to read first.",
    teaches: [
      "What every line of a program header is for",
      "Rapid against feed, and why the rapid always comes first",
      "Plunging in Z at a slower feed than the sideways cut",
      "Modal words: after the first G01 F1273, the lines only say what changed",
      "Retracting in Z before anything else moves",
    ],
    source: `(RECTANGULAR CONTOUR - 60 MM BY 40 MM, CUT 2 MM DEEP)
(PART ZERO AT THE BOTTOM LEFT CORNER, ON THE TOP FACE)
(THE PATH IS THE CENTRE OF THE TOOL - NO CUTTER COMPENSATION HERE)
(SPEED AND FEED ARE ILLUSTRATIVE TEACHING FIGURES, NOT A RECOMMENDATION)
G21 G90 G17 (millimetres, absolute positions, arcs in the XY plane)
G54 (the stored offset that says where this part is clamped)
T1 M06 (select tool 1, a 10 mm four-flute end mill, and change to it)
S6366 M03 (spindle clockwise at 6366 rev/min)
G43 H01 Z25.0 (apply the tool 1 length offset, rapid to a safe height)
G00 X0 Y0 (rapid across to part zero)
G00 Z2.0 (rapid down to 2 mm above the top face)
G01 Z-2.0 F200 (feed down to depth - plunging is the hardest cut there is)
G01 X60.0 F1273 (cut the bottom edge at the cutting feed)
G01 Y40.0 (up the right-hand side - G01 and F1273 are still in force)
G01 X0 (back along the top edge)
G01 Y0 (down the left-hand side, closing the contour where it started)
G00 Z25.0 (retract in Z before anything else moves)
M05 (spindle off)
M30 (end of program, rewind ready for the next part)`,
  },
  {
    id: "arcs-rounded-frame",
    title: "Arcs: centre format and radius format",
    blurb:
      "Two rounded rectangles, one inside the other. The outer one is cut clockwise with the arc centres given as I and J offsets; the inner one is cut anticlockwise with the same kind of corner written as a radius. Watch which words change and which stay.",
    teaches: [
      "G02 and G03, and which way round each one turns",
      "I and J are offsets from the start of the arc, never positions from part zero",
      "R as the shorter way round, and where it stops being safe",
      "Why the plane word G17 has to agree with the centre words",
      "Entering a profile on a straight rather than on a corner",
    ],
    source: `(ENGRAVED FRAME - TWO ROUNDED RECTANGLES, EACH 1.5 MM DEEP)
(6 MM CUTTER - THE SPEED AND FEED ARE ILLUSTRATIVE TEACHING FIGURES)
(OUTER PROFILE CLOCKWISE - I AND J MEASURED FROM THE START OF EACH ARC)
(INNER PROFILE ANTICLOCKWISE - THE SAME KIND OF CORNER WRITTEN AS R)
G21 G90 G17
G54
T4 M06
S9000 M03
G43 H04 Z25.0
G00 X0 Y10.0 (start on the left-hand straight, clear of every corner)
G00 Z2.0
G01 Z-1.5 F150 (plunge feed well below the cutting feed)
G01 Y40.0 F900 (up the left-hand side)
G02 X10.0 Y50.0 I10.0 J0 (top left corner: centre 10 mm along +X from here)
G01 X70.0 (across the top)
G02 X80.0 Y40.0 I0 J-10.0 (top right corner: centre 10 mm along -Y)
G01 Y10.0 (down the right-hand side)
G02 X70.0 Y0 I-10.0 J0 (bottom right corner)
G01 X10.0 (back along the bottom)
G02 X0 Y10.0 I0 J10.0 (bottom left corner, closing the frame)
G00 Z25.0 (retract to clearance before crossing the part)
G00 X18.0 Y10.0 (inner profile, starting on the bottom straight)
G00 Z2.0
G01 Z-1.5 F150
G01 X62.0 F900 (along the bottom)
G03 X70.0 Y18.0 R8.0 (a quarter turn, so R is unambiguous here)
G01 Y32.0
G03 X62.0 Y40.0 R8.0
G01 X18.0
G03 X10.0 Y32.0 R8.0
G01 Y18.0
G03 X18.0 Y10.0 R8.0 (closing the inner frame)
G00 Z25.0
M05
M30`,
  },
  {
    id: "drill-pattern",
    title: "Four holes, written out in full",
    blurb:
      "A four-hole pattern with no canned cycle: retract, position, plunge, retract, four times over. Written this way you can see every move a G81 cycle would have made for you, which is the point — and this model does not run canned cycles anyway.",
    teaches: [
      "The retract, position, plunge, retract shape of every hole",
      "Why the traverse between holes happens at a clearance height",
      "Feeding in Z rather than rapiding into the material",
      "Modal F: it is written once and does all four holes",
      "What a canned cycle such as G81 is doing on your behalf",
    ],
    source: `(FOUR-HOLE PATTERN WITH EXPLICIT BLOCKS - NO CANNED CYCLE)
(6 MM DRILL, FOUR BLIND HOLES 4 MM DEEP - ILLUSTRATIVE FIGURES)
(RETRACT, POSITION, PLUNGE, RETRACT - WRITTEN OUT FOUR TIMES)
G21 G90 G17
G54
T3 M06
S3000 M03
G43 H03 Z25.0
G00 X10.0 Y10.0 (hole 1)
G00 Z1.0 (rapid down to just above the face)
G01 Z-4.0 F150 (drill at the plunge feed)
G00 Z10.0 (back to the clearance plane before moving across)
G00 X50.0 Y10.0 (hole 2)
G00 Z1.0
G01 Z-4.0 (F150 is still in force - the line says only what changed)
G00 Z10.0
G00 X50.0 Y40.0 (hole 3)
G00 Z1.0
G01 Z-4.0
G00 Z10.0
G00 X10.0 Y40.0 (hole 4)
G00 Z1.0
G01 Z-4.0
G00 Z25.0 (fully clear before the program ends)
M05
M30`,
  },
  {
    id: "absolute-versus-incremental",
    title: "The same square, absolute and incremental",
    blurb:
      "One square written twice. The first is in G90, where every number is a place measured from part zero; the second is in G91, where every number is a step from wherever the tool already is. The two blocks cut identical shapes and share not one coordinate.",
    teaches: [
      "G90 reads a coordinate as a place, G91 reads it as a distance",
      "The same shape written both ways, so the numbers can be compared line by line",
      "Why an incremental block closes only if the steps sum to zero",
      "Switching back to G90 the moment the incremental block ends",
      "Positioning in absolute even when the cutting is incremental",
    ],
    source: `(THE SAME SQUARE WRITTEN TWICE - ONCE ABSOLUTE, ONCE INCREMENTAL)
(SQUARE A SITS AT PART ZERO; SQUARE B IS THE SAME SIZE, 50 MM ALONG X)
(10 MM CUTTER, 1 MM DEEP - SPEED AND FEED ARE ILLUSTRATIVE FIGURES)
G21 G90 G17
G54
T1 M06
S6366 M03
G43 H01 Z25.0
(SQUARE A - G90: EVERY NUMBER IS A PLACE)
G00 X0 Y0
G00 Z2.0
G01 Z-1.0 F200
G01 X30.0 F1273
G01 Y30.0
G01 X0
G01 Y0
G00 Z25.0
(SQUARE B - G91: EVERY NUMBER IS A STEP FROM THE LAST POINT)
G00 X50.0 Y0 (still absolute - positioning to the corner)
G00 Z2.0
G01 Z-1.0 F200
G91 (from here on, every coordinate is a distance)
G01 X30.0 F1273
G01 Y30.0
G01 X-30.0
G01 Y-30.0
G90 (back to absolute before anything else happens)
G00 Z25.0
M05
M30`,
  },
  {
    id: "facing-pass",
    title: "Facing pass with a stepover",
    blurb:
      "Six passes across the top of a block, cutting one way and stepping over at the end of each. After the first cutting line the program stops repeating itself: the blocks carry a single coordinate each, and everything else is still in force from earlier.",
    teaches: [
      "What a stepover is, and why it is smaller than the cutter",
      "Modal G01 and F doing the work: bare X and Y lines are complete blocks",
      "Running the cutter off both ends so it never stops inside the cut",
      "Reading a toolpath as a back-and-forth raster rather than a single line",
      "Taking depth off the top face in one shallow pass",
    ],
    source: `(FACING PASS - 100 MM BY 60 MM STOCK, 20 MM FACE MILL)
(0.5 MM OFF THE TOP FACE IN SIX PASSES AT A 12 MM STEPOVER)
(THE CUTTER RUNS OFF BOTH ENDS SO IT NEVER DWELLS IN THE CUT)
(SPEED AND FEED ARE ILLUSTRATIVE TEACHING FIGURES, NOT A RECOMMENDATION)
G21 G90 G17
G54
T2 M06
S2400 M03
G43 H02 Z25.0
G00 X-15.0 Y0
G00 Z2.0
G01 Z-0.5 F300 (down to depth clear of the end of the stock)
G01 X115.0 F1200 (first pass - G01 and F1200 are modal from here on)
Y12.0 (step over: the block says only what changed)
X-15.0 (second pass, back the other way)
Y24.0
X115.0
Y36.0
X-15.0
Y48.0
X115.0
Y60.0
X-15.0
G00 Z25.0
M05
M30`,
  },
  {
    id: "faulty-contour-and-slots",
    title: "Broken on purpose: the contour that breaks the tool",
    blurb:
      "This program is wrong on purpose, and it is here to be diagnosed rather than copied. Every line of it is valid G-code — it would load and it would run — and that is the lesson: nothing in the syntax tells you that it plunges at the cutting feed, rapids through the part it has just cut, and changes tools without getting clear first.",
    faulty: true,
    faults: [
      "The spindle is never started: there is an S word but no M3",
      "No G43, so no tool length offset is ever applied",
      "The plunge into the material runs at the full cutting feed rate",
      "The feed rate is far too high for the spindle speed commanded",
      "A rapid crosses the part it has just cut, 3 mm below the top face",
      "A rapid drives straight down into the material instead of feeding in",
      "The tool repositions in X and Y before the tool change, still down low",
      "The second tool change happens without retracting in Z first",
    ],
    teaches: [
      "Valid G-code and a sound program are two different things",
      "Reading a toolpath for rapids that pass through material",
      "Why a plunge needs its own feed rate",
      "Checking the feed and the spindle speed against each other",
      "Getting clear in Z before a tool change, every time",
    ],
    source: `(BROKEN ON PURPOSE - THIS PROGRAM IS HERE TO BE DIAGNOSED, NOT COPIED)
(EVERY LINE IS VALID G-CODE; THE MISTAKES ARE IN WHAT IT ASKS FOR)
G21 G90 G17
G54
T1 M06
S600
G00 Z25.0
G00 X0 Y0
G01 Z-3.0 F2500
G01 X40.0
G01 Y25.0
G01 X0
G01 Y0
G00 X90.0 Y5.0
G01 Y20.0
G00 Z10.0
G00 X50.0 Y12.0
G00 Z-2.0
G01 X70.0
G00 Z2.0
G00 X0 Y0
T2 M06
M05
M30`,
  },
  {
    id: "faulty-no-header-no-end",
    title: "Broken on purpose: no header, no feed, no end",
    blurb:
      "A second program written wrong on purpose. This one starts cutting before it has said what units it is working in, what part zero it is using or how fast to feed, loses track of absolute against incremental halfway through, and never tells the control it has finished. Work out what each fault would do before you read the list.",
    faulty: true,
    faults: [
      "No G21 or G20: the program never says whether it is working in millimetres or inches",
      "No G90 or G91 before the first move, so it inherits whatever the last job left",
      "No work offset: nothing selects G54, so part zero is whatever was already active",
      "A G01 cutting move before any F word has set a feed rate",
      "The spindle is started with M3 but no speed is ever commanded",
      "An arc whose end point does not sit one radius from the centre I and J give",
      "A traverse between two features only 1 mm above the top face",
      "A plunge at the same feed rate as the cutting that follows it",
      "A G91 move of 85 mm that reads much more like an absolute position",
      "No M5 and no M30: the program runs off the end with the spindle turning",
    ],
    teaches: [
      "What the header of a program is actually protecting you from",
      "How a missing F, a missing S or a missing offset each fail differently",
      "Checking an arc by measuring both ends from the centre",
      "How an absolute coordinate written in G91 sends the tool somewhere else",
      "Ending a program properly: retract, spindle off, M30",
    ],
    source: `(BROKEN ON PURPOSE - A SECOND ONE TO DIAGNOSE)
(NO HEADER, NO FEED RATE, A CONFUSED G91 AND NO END)
T1 M06
M03
G43 H01 Z25.0
G00 X0 Y0
G00 Z1.0
G01 Z-2.0
G01 X30.0 F500
G02 X45.0 Y10.0 I10.0 J0
G01 Y30.0
G00 Z1.0
G00 X70.0 Y30.0
G01 Z-2.0
G91
G01 X85.0
G01 Y5.0
G01 X-5.0
G90
G00 Z25.0`,
  },
];

/** Lookup by id, used by the simulator page and by the sample picker. */
const byId = new Map(gcodeSamples.map((sample) => [sample.id, sample]));

export function getGcodeSample(id: string): GcodeSample | undefined {
  return byId.get(id);
}
