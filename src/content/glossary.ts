import type { GlossaryTerm } from "./types";
import { buildAutolinkIndex, type AutolinkTerm } from "@/lib/autolink";

/**
 * The glossary. SPEC.md section 6 (`GlossaryTerm`) and Phase 5.
 *
 * Two definitions per term, always:
 *   - `plain`     one or two sentences that need no other knowledge;
 *   - `technical` the precise engineering statement, for the second reading.
 *
 * `aliases` exist for auto-linking, not for decoration. Every plural, compound,
 * hyphenation variant and shop synonym a learner might meet in prose belongs
 * here, because `lib/autolink.ts` links prose by surface form. Surfaces are
 * matched longest-first, so "ball screw" always beats "screw".
 *
 * Rules that bind this file (SPEC section 2): standards are described by
 * purpose and scope only, never by numeric requirement; any rule of thumb says
 * out loud that it is educational; illustrative magnitudes are labelled as
 * such and never presented as specifications.
 *
 * `lessons` may only contain slugs of published lessons — see
 * `src/content/lessons/index.ts`.
 */
export const glossary: GlossaryTerm[] = [
  /* ------------------------------------------------------------------ *
   * Machines, process chain and programming
   * ------------------------------------------------------------------ */
  {
    slug: "cnc",
    term: "CNC",
    aliases: [
      "computer numerical control",
      "computer numerically controlled",
      "numerical control",
      "CNCs",
      "NC",
    ],
    plain:
      "CNC means a machine that is driven by numbers instead of by hand. Instead of an operator turning handwheels, a small computer reads a list of coordinates and drives the motors to them.",
    technical:
      "Computer numerical control is the use of a stored, editable program of coordinates and machine functions, executed by a dedicated controller that closes position loops around each axis. It separates the geometry of a part from the skill of moving the machine, so the same program produces the same motion on every run. The letters describe the control method only — they say nothing about the size, rigidity or accuracy of the machine underneath.",
    example:
      "A hand-operated milling machine becomes a CNC machine when its handwheels are replaced by motors, its slides by ball screws, and its operator's judgement by a program the control reads line by line.",
    related: ["g-code", "machine-control-unit", "machining-centre", "axis", "cam"],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    tags: ["control", "process"],
  },
  {
    slug: "machine-tool",
    term: "Machine tool",
    aliases: ["machine tools", "machine-tool", "machine-tools"],
    plain:
      "A powered machine that shapes metal or other solid material by cutting bits off it. A mill, a lathe and a grinder are all machine tools.",
    technical:
      "A machine tool holds a cutting tool and a workpiece in a controlled spatial relationship and moves one relative to the other along guided paths while material is removed. Its whole job is to keep that relationship stable against cutting force, heat and vibration, which is why the structure matters as much as the motors.",
    example:
      "A pillar drill guides one motion only and is usually not called a machine tool in this sense; a milling machine, which controls three independent directions under load, is.",
    related: ["cnc", "machining-centre", "spindle", "structural-loop"],
    lessons: ["what-is-a-cnc-machine"],
    tags: ["structure", "process"],
  },
  {
    slug: "machining-centre",
    term: "Machining centre",
    aliases: ["machining centres", "machining center", "machining centers"],
    plain:
      "A milling machine that can change its own tools and run a whole job without an operator touching it. It is the machine most people picture when they hear the word CNC.",
    technical:
      "A machining centre is a CNC milling machine with an automatic tool changer and, usually, an enclosure, coolant system and chip handling. The distinction from a plain CNC mill is the tool magazine: one program can carry out facing, drilling, boring and tapping in one setup, which removes the repositioning errors that come with moving the part between machines.",
    example:
      "One program on a machining centre might face a block, drill four holes, tap them and mill a pocket, calling five different tools without the door opening once.",
    related: [
      "vertical-machining-centre",
      "tool-changer",
      "spindle",
      "work-envelope",
      "machine-tool",
    ],
    lessons: [
      "what-is-a-cnc-machine",
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "accuracy-repeatability-resolution",
    ],
    tags: ["structure", "process"],
  },
  {
    slug: "vertical-machining-centre",
    term: "Vertical machining centre",
    aliases: [
      "vertical machining centres",
      "vertical machining center",
      "vertical machining centers",
      "VMC",
      "VMCs",
      "vertical mill",
      "vertical mills",
    ],
    plain:
      "A machining centre whose spindle points straight down at the table, like a drill. It is the most common shape of CNC mill in small and medium workshops.",
    technical:
      "In a vertical machining centre the spindle axis is vertical and parallel to Z, with the tool approaching the top face of the workpiece. The layout gives good visibility and easy setup on the table, at the cost of chips falling into the work area rather than clearing themselves — which is the main practical argument for the horizontal arrangement.",
    example:
      "Vertical machining centres suit plate and prismatic parts clamped to the table; deep pockets in them need chip evacuation help, usually air blast or through-spindle coolant.",
    related: ["machining-centre", "spindle", "c-frame", "chip-conveyor", "axis"],
    lessons: [
      "what-is-a-cnc-machine",
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
    ],
    tags: ["structure", "process"],
  },
  {
    slug: "machine-control-unit",
    term: "Machine control unit",
    aliases: [
      "machine control units",
      "control unit",
      "machine control",
      "CNC control",
      "CNC controller",
      "controller",
      "controllers",
      "MCU",
    ],
    plain:
      "The computer that reads the program and tells every motor what to do, thousands of times a second. It is the part of the machine that turns a line of text into movement.",
    technical:
      "The machine control unit interprets the part program, plans a trajectory from it, breaks that trajectory into position commands at a fixed cycle rate, and issues those commands to the drives while monitoring feedback. Alongside it runs machine logic — usually a PLC — that handles doors, coolant, the tool changer and every interlock that is not part of path motion.",
    example:
      "When a program line says to move in a straight line to a corner, the interpreter reads it, the interpolator splits it into a stream of small position steps, and the drives follow that stream.",
    related: ["cnc", "plc", "look-ahead", "closed-loop-control", "g-code"],
    lessons: ["what-is-a-cnc-machine", "understanding-xyz"],
    tags: ["control", "electrical"],
  },
  {
    slug: "g-code",
    term: "G-code",
    aliases: [
      "g code",
      "gcode",
      "g-codes",
      "g codes",
      "gcodes",
      "part program",
      "part programs",
      "NC program",
      "NC programs",
      "preparatory code",
    ],
    plain:
      "The plain-text language a CNC machine actually reads. Each line is one instruction, such as go to this position at this speed.",
    technical:
      "G-code is a block-structured language in which each block contains words made of an address letter and a number. G addresses set preparatory functions — the motion mode, the plane, the units, the offset in force — while coordinate words give the target and F and S give feed and spindle speed. Dialects differ between control manufacturers, which is why a program is posted for a specific machine rather than written once for all.",
    example:
      "A block such as `G01 X100.0 Y50.0 F250` means: move in a straight line to that coordinate at 250 mm/min.",
    related: ["m-code", "post-processor", "machine-control-unit", "interpolation", "feed-rate"],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    tags: ["control", "process"],
  },
  {
    slug: "m-code",
    term: "M-code",
    aliases: [
      "m code",
      "mcode",
      "m-codes",
      "m codes",
      "miscellaneous function",
      "auxiliary function",
      "machine function code",
    ],
    plain:
      "The commands that switch machine hardware on and off — spindle, coolant, tool change, program end — rather than moving anything along a path.",
    technical:
      "M addresses request machine functions that are handled by the control's logic rather than by the interpolator. They are typically executed by the PLC, which acknowledges completion before motion resumes, so an M-code that starts the spindle can hold the program until the spindle reports it is up to speed. The assignment of numbers beyond a small common core is manufacturer specific.",
    example:
      "Programs conventionally start the spindle, then coolant, then cut; the tool change and the program end are also M-codes rather than motion commands.",
    related: ["g-code", "plc", "coolant", "tool-changer", "machine-control-unit"],
    lessons: ["what-is-a-cnc-machine"],
    tags: ["control", "process"],
  },
  {
    slug: "cad",
    term: "CAD",
    aliases: [
      "computer-aided design",
      "computer aided design",
      "CAD model",
      "CAD models",
      "CAD file",
      "CAD files",
    ],
    plain:
      "The software where the part is drawn as an exact three-dimensional shape. The CAD model is the statement of what the finished component should be.",
    technical:
      "Computer-aided design produces a geometric model — usually a boundary representation solid — carrying dimensions, tolerances and datum references. The model defines nominal geometry; the tolerances and datums attached to it define what variation is acceptable, and those are what the machining process is actually held to.",
    example:
      "A CAD model that shows a 20 mm hole says nothing about how it is made; the tolerance and surface finish called out beside it decide whether it is drilled, bored or reamed.",
    related: ["cam", "toolpath", "tolerance", "datum", "post-processor"],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    tags: ["process"],
  },
  {
    slug: "cam",
    term: "CAM",
    aliases: [
      "computer-aided manufacturing",
      "computer aided manufacturing",
      "CAM software",
      "CAM system",
      "CAM package",
    ],
    plain:
      "The software that decides how the part will actually be cut: which tools, in which order, along which paths.",
    technical:
      "Computer-aided manufacturing converts model geometry into toolpaths by applying an operation strategy, a tool definition and cutting parameters, then simulates the result against stock and fixtures. Its output is machine-independent toolpath data; the post-processor turns that into code for one specific control. CAM makes the manufacturing decisions, so the quality of a program is set here, not at the machine.",
    example:
      "The same pocket can be cleared by a spiral path, a zig-zag or a trochoidal path — the CAM choice changes cycle time, tool life and the load history the machine sees.",
    related: ["cad", "toolpath", "post-processor", "climb-milling", "depth-of-cut"],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    tags: ["process", "cutting"],
  },
  {
    slug: "post-processor",
    term: "Post-processor",
    aliases: [
      "post processor",
      "postprocessor",
      "post-processors",
      "post processors",
      "postprocessors",
      "posting",
      "posted program",
    ],
    plain:
      "The translator that turns the toolpath from CAM into the exact dialect of G-code your particular machine understands.",
    technical:
      "A post-processor maps generic toolpath output onto one control's syntax, its canned cycles, its offset conventions and its safety sequence. Because dialects differ in ways that are not always visible in the code, a program posted for one machine may run differently or dangerously on another. Posts are configured and proven per machine, and a new post is verified by dry running before it cuts.",
    example:
      "Two controls may both accept a circular move but disagree on how the arc centre is specified; the post-processor is where that difference is absorbed.",
    related: ["cam", "g-code", "machine-control-unit", "toolpath", "circular-interpolation"],
    lessons: ["cad-to-finished-component"],
    tags: ["process", "control"],
  },
  {
    slug: "toolpath",
    term: "Toolpath",
    aliases: ["tool path", "toolpaths", "tool paths", "cutter path", "cutter paths"],
    plain:
      "The route the centre of the cutting tool travels through space to make the shape. Everything the machine does is a sequence of these routes.",
    technical:
      "A toolpath is the ordered set of positions, feed rates and mode changes for one operation, defined at the tool centre point rather than at the finished surface. The offset between the two is taken either in CAM, by computing the path already compensated for tool radius, or at the control through cutter compensation.",
    example:
      "Roughing a pocket may be one long continuous toolpath with a constant engagement angle, followed by a separate finishing path that only touches the wall.",
    related: ["cam", "cutter-compensation", "climb-milling", "width-of-cut", "feed-rate"],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    tags: ["process", "cutting"],
  },
  {
    slug: "dro",
    term: "Digital readout (DRO)",
    aliases: [
      "DRO",
      "DROs",
      "digital readout",
      "digital readouts",
      "position readout",
      "position display",
    ],
    plain:
      "The screen that shows where each axis is right now, in numbers. On a CNC machine it is a window onto the control's position registers.",
    technical:
      "A digital readout displays current axis position, usually switchable between machine and work coordinates, and often alongside distance-to-go and following error. The number shown is the control's belief about position, derived from its feedback device — it is not an independent measurement, so it cannot reveal an error that the feedback itself does not see.",
    example:
      "If a screw has thermally grown and the machine measures position at the motor rather than at the table, the readout will show the commanded value while the table is somewhere slightly different.",
    related: [
      "machine-coordinate-system",
      "work-coordinate-system",
      "encoder",
      "following-error",
      "resolution",
    ],
    lessons: ["understanding-xyz", "accuracy-repeatability-resolution"],
    tags: ["control", "metrology"],
  },
  {
    slug: "work-envelope",
    term: "Work envelope",
    aliases: [
      "working envelope",
      "work envelopes",
      "working volume",
      "work volume",
      "working space",
    ],
    plain:
      "The block of space inside the machine that the tool can actually reach. Anything bigger than it cannot be machined in one setup.",
    technical:
      "The work envelope is the volume swept by the tool tip within the travel limits of all axes, reduced in practice by the fixture height, the tool length, the spindle nose clearance and any interference with covers or the enclosure. Usable envelope is therefore always smaller than the sum of the axis travels quoted on a datasheet.",
    example:
      "A machine with generous X and Y travel can still be unable to machine a tall part, because the distance between spindle nose and table — the daylight — runs out first.",
    related: ["axis", "machine-coordinate-system", "machining-centre", "fixture", "column"],
    lessons: ["intro-to-machine-architecture", "selecting-an-architecture"],
    tags: ["structure", "process"],
  },
  {
    slug: "rapid-traverse",
    term: "Rapid traverse",
    aliases: [
      "rapid traverses",
      "rapid move",
      "rapid moves",
      "rapids",
      "rapid",
      "traverse rate",
      "positioning move",
    ],
    plain:
      "A move at the machine's top speed, made when the tool is not cutting. It exists to waste as little time as possible getting from one place to the next.",
    technical:
      "A rapid positioning move runs at the axis maximum traverse rate rather than a programmed feed. Multi-axis rapids are not guaranteed to be straight on every control: axes may move at their own maximum rates and arrive at different times, so the actual path can be dog-legged. That is why rapids are programmed at a safe height rather than close to the work.",
    example:
      "Rapid traverse rates are quoted in m/min on datasheets; expressed in SI they are simply that value divided by 60 in metres per second.",
    related: ["feed-rate", "linear-interpolation", "jerk", "look-ahead", "axis"],
    lessons: ["cad-to-finished-component", "understanding-xyz"],
    tags: ["motion", "control"],
  },
  {
    slug: "plc",
    term: "Programmable logic controller (PLC)",
    aliases: [
      "PLC",
      "PLCs",
      "programmable logic controller",
      "programmable logic controllers",
      "machine logic",
      "integrated PLC",
    ],
    plain:
      "The part of the control that handles everything which is not path motion: doors, coolant, the tool changer, the lights, the interlocks.",
    technical:
      "A programmable logic controller executes machine logic on a repeating scan: read inputs, evaluate logic, write outputs. In a machine tool it is usually integrated with the CNC kernel and exchanges handshakes with it, so an M-code requesting coolant becomes a PLC output and the program waits for the acknowledgement. Safety-related functions are implemented in a separate, rated architecture rather than in ordinary machine logic.",
    example:
      "The sequence that unclamps a tool, blows the taper clean, swings the arm and re-clamps is PLC logic, stepped through with condition checks between each stage.",
    related: ["machine-control-unit", "m-code", "interlock", "fieldbus", "tool-changer"],
    lessons: [],
    tags: ["control", "electrical"],
  },
  {
    slug: "fieldbus",
    term: "Fieldbus",
    aliases: [
      "field bus",
      "fieldbuses",
      "industrial network",
      "industrial networks",
      "industrial ethernet",
      "EtherCAT",
      "PROFINET",
    ],
    plain:
      "The digital network that carries commands and readings between the control, the drives and the sensors, instead of one wire per signal.",
    technical:
      "A fieldbus is a deterministic serial network for industrial devices, characterised by a fixed cycle time and bounded jitter rather than by raw bandwidth. Motion control requires that determinism: position commands and feedback must arrive on a known schedule, because a late packet is indistinguishable from a position error. Many buses also carry a certified safety protocol on the same physical medium, kept logically separate from ordinary traffic.",
    example:
      "Replacing a bundle of analogue command wires with one bus cable removes drift and noise pickup, but makes the network cycle time part of the servo loop's design.",
    related: ["plc", "machine-control-unit", "servo-motor", "encoder", "closed-loop-control"],
    lessons: [],
    tags: ["electrical", "control"],
  },
  {
    slug: "look-ahead",
    term: "Look-ahead",
    aliases: ["look ahead", "lookahead", "look-ahead buffer", "block look-ahead"],
    plain:
      "The control reading many program lines in advance, so it can slow down before a corner instead of arriving at it too fast.",
    technical:
      "Look-ahead buffers a window of upcoming blocks and plans the velocity profile across them as one problem, limiting speed at direction changes so that the resulting acceleration and jerk stay within axis limits. Without it, a program made of thousands of very short blocks either overshoots the geometry or is throttled to a crawl by the block processing rate.",
    example:
      "A finely tessellated three-dimensional surface path can contain tens of thousands of tiny straight moves; look-ahead is what lets them be run as a smooth contour rather than a stutter.",
    related: ["jerk", "machine-control-unit", "feed-rate", "linear-interpolation", "following-error"],
    lessons: ["understanding-xyz"],
    tags: ["control", "motion"],
  },
  {
    slug: "jerk",
    term: "Jerk",
    aliases: ["jerk limiting", "jerk limit", "jerk-limited", "rate of change of acceleration"],
    plain:
      "How abruptly the acceleration itself changes. High jerk is what makes a machine bang and shudder when it starts and stops.",
    technical:
      "Jerk is the time derivative of acceleration, in SI units of metres per second cubed. Limiting it forces the control to ramp acceleration in rather than apply it as a step, which reduces the excitation of the structure's natural frequencies and the resulting following error and surface marking. The cost is a slightly longer move time for every acceleration and deceleration.",
    example:
      "The witness marks left at a direction reversal often come from the structure ringing after an abrupt acceleration change, not from the cutting tool.",
    related: ["look-ahead", "natural-frequency", "following-error", "chatter", "rapid-traverse"],
    lessons: [],
    tags: ["motion", "control"],
  },
  /* ------------------------------------------------------------------ *
   * Coordinates, axes and offsets
   * ------------------------------------------------------------------ */
  {
    slug: "axis",
    term: "Axis",
    aliases: ["axes", "machine axis", "machine axes", "axis of motion", "controlled axis"],
    plain:
      "One direction the machine can move in, under its own control. A typical mill has three: left-right, front-back and up-down.",
    technical:
      "An axis is a single controlled degree of freedom: a commanded coordinate, a drive that moves it, and feedback that reports it. Axis letters are assigned by convention relative to the spindle, and the positive direction is always defined as the direction that increases the distance between tool and workpiece — which is why a moving table travels the opposite way to the axis letter that describes it.",
    example:
      "On a vertical machining centre the table moves left when a program asks for positive X, because the convention describes tool motion relative to the workpiece, not the metal that actually moves.",
    related: [
      "linear-axis",
      "rotary-axis",
      "right-hand-rule",
      "machine-coordinate-system",
      "feed-drive",
    ],
    lessons: [
      "what-is-a-cnc-machine",
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
    ],
    tags: ["motion", "control"],
  },
  {
    slug: "linear-axis",
    term: "Linear axis",
    aliases: ["linear axes", "linear-axis", "translational axis", "sliding axis"],
    plain:
      "An axis that slides in a straight line, like the table moving left and right. X, Y and Z are the three linear axes.",
    technical:
      "A linear axis converts drive motion into straight-line travel along a guided path, and its position is expressed as a distance in millimetres. Its errors are described by one positioning deviation along the direction of travel plus five geometric components — two straightnesses and three angular errors — which is the basis of the twenty-one error components of a three-axis machine.",
    example:
      "The Z axis of a vertical mill is a linear axis carrying the spindle head up and down the column, and its weight has to be held by the drive or by a counterbalance.",
    related: ["axis", "rotary-axis", "linear-guide", "ball-screw", "straightness"],
    lessons: [
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "accuracy-repeatability-resolution",
    ],
    tags: ["motion", "structure"],
  },
  {
    slug: "rotary-axis",
    term: "Rotary axis",
    aliases: [
      "rotary axes",
      "rotary table",
      "rotary tables",
      "A axis",
      "B axis",
      "C axis",
      "fourth axis",
      "4th axis",
      "tilting axis",
    ],
    plain:
      "An axis that turns instead of sliding, so the part or the head can be swung to a new angle under program control.",
    technical:
      "A rotary axis is a controlled angular degree of freedom, lettered A, B or C for rotation about X, Y and Z respectively, with positive sense given by the right-hand rule. Its position is an angle, so its resolution and accuracy are angular quantities whose effect at the cutting point grows with radius — an angular error matters far more on a large part than a small one.",
    example:
      "Adding a rotary axis lets four faces of a part be machined in one setup, removing the repositioning error that three separate setups would introduce.",
    related: ["axis", "right-hand-rule", "linear-axis", "encoder", "repeatability"],
    lessons: ["understanding-xyz"],
    tags: ["motion", "control"],
  },
  {
    slug: "right-hand-rule",
    term: "Right-hand rule",
    aliases: ["right hand rule", "right-hand rules", "right hand grip rule", "right-hand grip rule"],
    plain:
      "A trick with your right hand for remembering which way X, Y and Z point, and which way counts as a positive turn.",
    technical:
      "Holding thumb, index and middle finger mutually perpendicular gives the positive senses of X, Y and Z in that order, defining a right-handed coordinate frame. Curling the right hand around an axis with the thumb along its positive direction gives the positive rotation sense for the corresponding rotary axis. The convention is what allows a program written for one machine to describe the same geometry on another.",
    example:
      "Point the thumb along positive Z — up, away from the work, on a vertical mill — and the fingers curl in the positive C direction.",
    related: ["axis", "rotary-axis", "machine-coordinate-system", "linear-axis"],
    lessons: ["understanding-xyz"],
    tags: ["motion"],
  },
  {
    slug: "machine-coordinate-system",
    term: "Machine coordinate system",
    aliases: [
      "machine coordinate systems",
      "machine co-ordinate system",
      "machine coordinates",
      "machine zero",
      "machine origin",
      "machine datum",
    ],
    plain:
      "The machine's own fixed set of coordinates, measured from a point built into the machine itself. It never moves, whatever job is on the table.",
    technical:
      "The machine coordinate system has its origin at a fixed reference established at homing, and all travel limits, tool changer positions and compensation tables are expressed in it. It is the frame the machine trusts about itself; every work coordinate system is defined as an offset from it, which is why homing must succeed before any offset means anything.",
    example:
      "Software travel limits are held in machine coordinates, so they protect the machine regardless of where the operator has set the part zero.",
    related: [
      "work-coordinate-system",
      "work-offset",
      "homing",
      "dro",
      "absolute-positioning",
    ],
    lessons: ["understanding-xyz", "accuracy-repeatability-resolution"],
    tags: ["control", "motion"],
  },
  {
    slug: "work-coordinate-system",
    term: "Work coordinate system",
    aliases: [
      "work coordinate systems",
      "workpiece coordinate system",
      "part coordinate system",
      "work coordinates",
      "program zero",
      "part zero",
      "work zero",
      "G54",
    ],
    plain:
      "A second set of coordinates whose zero point sits on the workpiece, so the program can use the same numbers as the drawing.",
    technical:
      "A work coordinate system is a named frame offset from machine zero, chosen to coincide with the part's datum so that program coordinates equal drawing coordinates. Several are available at once, which is how a machine runs multiple fixtures or a repositioned part without re-editing the program. Choosing the datum to match the drawing's datum is what keeps tolerance stack-up honest.",
    example:
      "Setting the work zero on the corner of a plate means a hole dimensioned 40 mm from that corner is programmed as 40 mm, with no arithmetic in between.",
    related: [
      "work-offset",
      "machine-coordinate-system",
      "datum",
      "tool-length-offset",
      "fixture",
    ],
    lessons: ["understanding-xyz", "cad-to-finished-component"],
    tags: ["control", "process"],
  },
  {
    slug: "work-offset",
    term: "Work offset",
    aliases: [
      "work offsets",
      "workpiece offset",
      "workpiece offsets",
      "fixture offset",
      "fixture offsets",
      "datum shift",
      "zero offset",
    ],
    plain:
      "The stored distance from the machine's own zero to the zero point you set on the workpiece. Setting it is how you tell the machine where the part is.",
    technical:
      "A work offset is a vector held in a control register that shifts the active coordinate frame from machine zero to the part datum. It is measured during setup with an edge finder, a probe or a dial indicator, and its uncertainty adds directly to the position of every feature in the program. An offset entered with the wrong sign or into the wrong register is one of the most common causes of a crash.",
    example:
      "Probing the top face and storing the result as the Z work offset means the program's Z0 is the finished top surface, so depths read straight off the drawing.",
    related: [
      "work-coordinate-system",
      "machine-coordinate-system",
      "tool-length-offset",
      "datum",
      "dial-indicator",
    ],
    lessons: [
      "understanding-xyz",
      "cad-to-finished-component",
      "accuracy-repeatability-resolution",
    ],
    tags: ["control", "process"],
  },
  {
    slug: "tool-length-offset",
    term: "Tool length offset",
    aliases: [
      "tool length offsets",
      "tool length compensation",
      "length offset",
      "length offsets",
      "tool offset",
      "tool offsets",
      "TLO",
    ],
    plain:
      "A stored number for each tool saying how far it sticks out, so the control knows where the tip is even though every tool is a different length.",
    technical:
      "The tool length offset is the distance from a common reference — usually the spindle gauge line — to the tool tip, applied to the Z axis when the tool is called. It lets one program run tools of any length without editing coordinates. Because it is measured, its error enters depth directly, and it must be re-measured whenever a tool is reground or reset in its holder.",
    example:
      "A tool set 0.1 mm short leaves 0.1 mm of stock on every face it was supposed to finish, and no amount of correct programming will remove it.",
    related: ["work-offset", "tool-holder", "cutter-compensation", "runout", "depth-of-cut"],
    lessons: ["understanding-xyz"],
    tags: ["control", "process"],
  },
  {
    slug: "cutter-compensation",
    term: "Cutter compensation",
    aliases: [
      "cutter radius compensation",
      "tool radius compensation",
      "cutter comp",
      "radius compensation",
      "diameter compensation",
      "cutter radius offset",
    ],
    plain:
      "The control steering the tool half a tool-width away from the line you programmed, so the finished edge lands where the drawing says.",
    technical:
      "Cutter compensation offsets the programmed path perpendicular to the direction of travel by a radius held in an offset register, on the commanded side of the contour. Because the register is editable at the machine, an operator can correct a size deviation by changing one number rather than re-posting the program. It has to be engaged and cancelled on lead-in and lead-out moves clear of the part, and it cannot negotiate an inside corner smaller than the tool radius.",
    example:
      "If a finished wall measures 0.04 mm oversize, reducing the compensation value by 0.02 mm brings the next part to size without touching the toolpath.",
    related: ["toolpath", "tool-length-offset", "tolerance", "runout", "cam"],
    lessons: ["understanding-xyz", "selecting-an-architecture"],
    tags: ["control", "process"],
  },
  {
    slug: "absolute-positioning",
    term: "Absolute positioning",
    aliases: ["absolute mode", "absolute coordinates", "absolute position", "G90"],
    plain:
      "Giving every position as a distance from one fixed zero point, the way an address gives a house number on a street.",
    technical:
      "In absolute mode every coordinate word is measured from the origin of the active coordinate system. Errors do not accumulate, because each block is independent of the last, and a program can safely be restarted mid-way. It is the default choice for almost all part programming for exactly those reasons.",
    example:
      "Three holes at 10, 20 and 30 mm are programmed with those three numbers; if one line is mistyped, the other two are still in the right place.",
    related: [
      "incremental-positioning",
      "work-coordinate-system",
      "g-code",
      "machine-coordinate-system",
    ],
    lessons: ["understanding-xyz"],
    tags: ["control"],
  },
  {
    slug: "incremental-positioning",
    term: "Incremental positioning",
    aliases: ["incremental mode", "incremental coordinates", "relative positioning", "G91"],
    plain:
      "Giving each move as a step from wherever the tool is now, like saying take three paces forward rather than stand at position twelve.",
    technical:
      "In incremental mode each coordinate word is a signed displacement from the current position. It suits repeated patterns and subprograms, where the same relative sequence is executed at several locations. Its weakness is that any error, or any restart from the wrong block, propagates through every subsequent move because there is no absolute reference to recover from.",
    example:
      "A bolt-circle subprogram written incrementally can be called at any location, but if it is entered mid-way the whole pattern lands in the wrong place.",
    related: ["absolute-positioning", "g-code", "work-coordinate-system", "toolpath"],
    lessons: ["understanding-xyz"],
    tags: ["control"],
  },
  {
    slug: "interpolation",
    term: "Interpolation",
    aliases: ["interpolate", "interpolates", "interpolated", "interpolator"],
    plain:
      "The control working out all the in-between positions of a move, so that several axes act together and the tool follows the shape you asked for.",
    technical:
      "Interpolation generates a stream of intermediate position set-points along the commanded geometry at the control's cycle rate, coordinating axes so that the resultant tool velocity equals the programmed feed. The geometry the machine actually produces is the combination of that mathematics with the mechanics that follow it, which is why a perfectly interpolated circle can still be cut oval.",
    example:
      "A 45-degree line needs X and Y to move at the same rate; a shallow line needs one to crawl while the other runs, and the interpolator is what divides the feed between them.",
    related: [
      "linear-interpolation",
      "circular-interpolation",
      "machine-control-unit",
      "feed-rate",
      "following-error",
    ],
    lessons: [
      "what-is-a-cnc-machine",
      "understanding-xyz",
      "accuracy-repeatability-resolution",
    ],
    tags: ["control", "motion"],
  },
  {
    slug: "linear-interpolation",
    term: "Linear interpolation",
    aliases: ["straight-line interpolation", "straight line interpolation", "linear move", "G01"],
    plain:
      "A straight-line move at a programmed feed, with every axis involved starting and finishing together.",
    technical:
      "Linear interpolation drives all commanded axes so that their motion is proportional to their respective distances, producing a straight resultant path at the programmed vector feed rate. It is the workhorse of machining: nearly all CAM output, including apparently curved surfaces, arrives as a very large number of short linear moves.",
    example:
      "A surface finishing path may be tens of thousands of linear moves a few hundredths of a millimetre long, run as a smooth contour by the look-ahead planner.",
    related: ["interpolation", "circular-interpolation", "feed-rate", "look-ahead", "rapid-traverse"],
    lessons: ["understanding-xyz"],
    tags: ["control", "motion"],
  },
  {
    slug: "circular-interpolation",
    term: "Circular interpolation",
    aliases: ["arc interpolation", "circular move", "circular moves", "arc move", "G02", "G03"],
    plain:
      "A move along a true arc, commanded in one line, with the control coordinating the axes so the result is round.",
    technical:
      "Circular interpolation commands an arc in a selected plane by an end point plus either a radius or a vector to the centre, with the sense set by the code chosen. It is also a diagnostic: cutting or tracing a circle forces every axis through a full reversal, so backlash, servo mismatch and squareness error all leave characteristic signatures on the resulting shape.",
    example:
      "A step at the quadrant change of a test circle points at reversal behaviour on the axis that is changing direction there, not at the interpolator.",
    related: ["interpolation", "ballbar-test", "backlash", "squareness", "linear-interpolation"],
    lessons: ["understanding-xyz", "accuracy-repeatability-resolution"],
    tags: ["control", "metrology"],
  },
  {
    slug: "homing",
    term: "Homing",
    aliases: ["home", "homing cycle", "reference run", "referencing", "home position", "datum run"],
    plain:
      "The start-up routine where each axis drives slowly to a known switch or mark so the machine can work out where it is.",
    technical:
      "Homing establishes the machine coordinate origin by driving to a reference signal, typically a coarse switch refined by an encoder reference mark, so that the control's position registers correspond to physical position. Machines with absolute feedback know their position at power-up and do not need it. Until homing succeeds, travel limits and stored offsets have no meaning, which is why controls refuse most motion beforehand.",
    example:
      "If a machine is homed with a fixture bolted where the axis needs to travel, the reference move is exactly where a crash happens — hence the slow, single-axis sequence.",
    related: ["machine-coordinate-system", "encoder", "work-offset", "axis", "dro"],
    lessons: ["understanding-xyz"],
    tags: ["control", "motion"],
  },
  {
    slug: "feed-drive",
    term: "Feed drive",
    aliases: ["feed drives", "axis drive", "axis drives", "drive train", "drivetrain"],
    plain:
      "The whole set of parts that moves one axis: motor, coupling, screw, nut, bearings and the guideways the moving part rides on.",
    technical:
      "A feed drive is the mechanical and electrical chain from the control's position command to the physical motion of a slide. Its behaviour is governed by the series stiffness of every element, the reflected inertia of the moving mass, and the friction and backlash in between — so the weakest link, not the motor, usually sets what the axis can do.",
    example:
      "A powerful motor bolted to a slender screw gives a fast but soft axis: it accelerates well and still deflects under cutting force.",
    related: ["ball-screw", "servo-motor", "coupling", "linear-guide", "stiffness"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "structure"],
  },
  /* ------------------------------------------------------------------ *
   * Drive hardware and guideways
   * ------------------------------------------------------------------ */
  {
    slug: "ball-screw",
    term: "Ball screw",
    aliases: [
      "ball screws",
      "ballscrew",
      "ballscrews",
      "ball-screws",
      "recirculating ball screw",
      "recirculating ball screws",
    ],
    plain:
      "A screw with smooth rounded grooves instead of sharp threads, with small steel balls rolling between the screw and its nut. Turning it pushes the nut, and whatever is bolted to the nut, along a straight line.",
    technical:
      "A ball screw transmits rotation to translation through recirculating balls in matched gothic-arch or circular-arc grooves, replacing sliding friction with rolling friction. The consequences are high mechanical efficiency, low and stable friction, and a drive that can be preloaded to remove axial play. Its limits are set by lead accuracy, permissible axial load, critical speed on long spans, and the heat it generates at high duty.",
    example:
      "With a 10 mm lead, one motor revolution moves the axis 10 mm, so a positioning resolution of 0.001 mm asks the feedback to resolve one ten-thousandth of a turn.",
    related: ["ball-nut", "screw-lead", "backlash", "preload", "critical-speed", "feed-drive"],
    lessons: ["what-is-a-cnc-machine", "how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "structure"],
  },
  {
    slug: "ball-nut",
    term: "Ball nut",
    aliases: ["ball nuts", "ballnut", "ballnuts", "screw nut", "recirculating nut"],
    plain:
      "The block that rides along a ball screw and is bolted to the moving part. It holds the balls and the tunnel that returns them to the start.",
    technical:
      "The ball nut carries the load through the balls in the loaded groove and recirculates them through a return channel — an internal deflector or an external tube. Its internal geometry sets the load rating, the stiffness contribution of the nut itself and the noise at speed, and double-nut or offset-lead arrangements are how axial preload is applied.",
    example:
      "Bolting the nut to the table through a soft or poorly faced mounting throws away stiffness that was paid for in the screw specification.",
    related: ["ball-screw", "preload", "backlash", "stiffness", "feed-drive"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "structure"],
  },
  {
    slug: "lead-screw",
    term: "Lead screw",
    aliases: [
      "lead screws",
      "leadscrew",
      "leadscrews",
      "lead-screws",
      "acme screw",
      "trapezoidal screw",
      "power screw",
    ],
    plain:
      "A plain screw and nut with no balls, where the surfaces simply slide over one another. Cheaper than a ball screw, and much less efficient.",
    technical:
      "A lead screw transmits motion through sliding contact between screw and nut flanks. Efficiency is markedly lower than a ball screw's and friction varies with load, speed and lubrication, so the drive both wastes power and is harder to control smoothly. Wear opens up axial play over time; the compensating advantage is that a low-efficiency screw can be self-locking, which is occasionally useful on a vertical axis.",
    example:
      "Lead screws remain common on hand-operated machines and light equipment, where cost and self-locking matter more than efficiency or a stable friction level.",
    related: ["ball-screw", "screw-lead", "backlash", "feed-drive", "stiffness"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion"],
  },
  {
    slug: "screw-lead",
    term: "Screw lead",
    aliases: ["screw leads", "lead per revolution", "screw pitch", "helix lead"],
    plain:
      "How far the nut travels along the screw in one complete turn. It is the exchange rate between turning and sliding.",
    technical:
      "Lead is the axial advance per revolution, in millimetres per revolution. It sets three things at once: the axis speed for a given motor speed, the thrust obtained from a given motor torque, and the reflected inertia of the moving mass. Lead equals pitch only on a single-start screw; a multi-start screw advances by the pitch multiplied by the number of starts.",
    example:
      "Halving the lead roughly doubles the available thrust for the same motor torque and halves the top speed — the same trade every gearbox makes.",
    related: ["ball-screw", "lead-screw", "inertia-matching", "servo-motor", "resolution"],
    lessons: ["what-is-a-cnc-machine", "how-a-ball-screw-moves-an-axis"],
    tags: ["motion"],
  },
  {
    slug: "backlash",
    term: "Backlash",
    aliases: ["lost motion", "lash", "backlash error", "axial play", "reversal error"],
    plain:
      "The small dead movement when a drive changes direction: the motor turns but the table has not started moving yet.",
    technical:
      "Backlash is clearance in a transmission that must be taken up before motion reverses, arising from screw–nut play, bearing float, coupling clearance and compliant mountings. It appears in measurement as a reversal value and in cutting as a step at direction changes — most visibly at the quadrant changes of a circular path. It can be partially compensated in the control, but compensation corrects a number, not a mechanical looseness, and it cannot help when the lost motion varies with load.",
    example:
      "A circle cut on an axis with reversal play shows a small step where each axis reverses, at the four quadrant points of the arc.",
    related: ["preload", "ball-screw", "circular-interpolation", "ballbar-test", "positioning-error"],
    lessons: [
      "what-is-a-cnc-machine",
      "how-a-ball-screw-moves-an-axis",
      "accuracy-repeatability-resolution",
    ],
    tags: ["motion", "metrology"],
  },
  {
    slug: "preload",
    term: "Preload",
    aliases: ["preloaded", "preloading", "preloads", "pre-load", "pre-loaded"],
    plain:
      "A deliberate built-in squeeze that keeps all the rolling parts in permanent contact, so there is no slack for the drive to take up when it reverses.",
    technical:
      "Preload applies an internal force that removes clearance and moves the rolling elements onto the stiff part of their load–deflection curve. It buys axial and moment stiffness and near-zero lost motion, and it costs friction, heat and bearing life. Preload classes are selected against the actual load case rather than maximised, because an over-preloaded assembly runs hot and wears quickly.",
    example:
      "Two nuts pushed apart on the same screw, or a rail carriage fitted with oversized balls, both remove play by permanently loading the contact.",
    related: ["backlash", "ball-nut", "linear-guide", "bearing-block", "stiffness"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "structure"],
  },
  {
    slug: "linear-guide",
    term: "Linear guide",
    aliases: [
      "linear guides",
      "linear guideway",
      "linear guideways",
      "guideway",
      "guideways",
      "profile rail",
      "profile rails",
      "profile rail guide",
      "linear rail",
      "linear rails",
      "guide rail",
      "rail",
      "rails",
    ],
    plain:
      "The precision rail that lets a moving part travel freely in one direction while holding it rigidly in every other.",
    technical:
      "A profile linear guide comprises a hardened ground rail and recirculating rolling carriages that constrain five degrees of freedom while leaving one free. Rolling elements give low friction that barely changes with speed, so motion is smooth at very low feeds; roller versions carry more load and are stiffer than ball versions of the same size. The guide's stiffness and moment capacity are as much a design input as its load rating, and both depend on how flat and true the mounting surfaces are.",
    example:
      "Two rails set on a surface that is not flat will fight each other for the whole travel, converting a mounting error into friction, wear and a straightness error.",
    related: ["bearing-block", "box-way", "preload", "straightness", "feed-drive"],
    lessons: [
      "what-is-a-cnc-machine",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
    ],
    tags: ["motion", "structure"],
  },
  {
    slug: "box-way",
    term: "Box way",
    aliases: [
      "box ways",
      "boxway",
      "boxways",
      "box-ways",
      "sliding way",
      "sliding ways",
      "flat ways",
      "hardened and ground ways",
      "dovetail way",
    ],
    plain:
      "The older style of guideway: large flat sliding surfaces, hand-finished and oiled, instead of rails with rolling balls.",
    technical:
      "Box ways guide a slide on wide sliding contact surfaces, usually with a low-friction liner and forced lubrication. The large contact area gives high damping and excellent resistance to shock and heavy interrupted cuts, at the price of higher and speed-dependent friction, stick-slip at very low feeds, and slower rapids. They remain the choice where heavy roughing and vibration resistance outrank speed.",
    example:
      "A heavy roughing machine on box ways will absorb an interrupted cut that would make a lighter profile-rail machine chatter.",
    related: ["linear-guide", "damping", "chatter", "way-cover", "stiffness"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "structure"],
  },
  {
    slug: "bearing-block",
    term: "Bearing block",
    aliases: [
      "bearing blocks",
      "runner block",
      "runner blocks",
      "guide carriage",
      "carriage",
      "carriages",
      "linear bearing",
      "linear bearings",
    ],
    plain:
      "The sliding block that rides on a linear rail and carries the moving part. Most axes use four of them, two on each of two rails.",
    technical:
      "A bearing block houses the recirculating rolling elements that engage the rail profile and transfers load and moments into the moving structure. Spacing matters more than rating: widening the block spacing along the rail and the rail spacing across the axis both reduce the moment load per block for the same overhang, which is why layout drawings are argued over before catalogue sizes are chosen.",
    example:
      "A long tool overhang loads the leading blocks in tension and the trailing blocks in compression, so an axis that looks lightly loaded on paper can still be moment limited.",
    related: ["linear-guide", "preload", "stiffness", "structural-loop", "linear-axis"],
    lessons: ["intro-to-machine-architecture"],
    tags: ["motion", "structure"],
  },
  {
    slug: "critical-speed",
    term: "Critical speed",
    aliases: ["critical speeds", "screw whip", "whip", "first critical speed", "whirl speed"],
    plain:
      "The rotation speed at which a long screw starts to whip like a skipping rope. Running near it is noisy, damaging and useless for accuracy.",
    technical:
      "Critical speed is the rotational speed at which the shaft's bending natural frequency is excited by its own rotation. It falls sharply as unsupported length grows and rises with diameter and with stiffer end fixing, so long axes are limited either by fitting a larger screw, by supporting it differently, by choosing a larger lead to turn more slowly, or by driving the nut instead of the screw. Manufacturers publish the calculation for their own products, and their figures govern.",
    example:
      "A long gantry axis is a classic case where a bigger lead, or a rotating-nut drive, is chosen purely to keep screw speed well below the critical value.",
    related: ["ball-screw", "natural-frequency", "gantry", "rack-and-pinion", "screw-lead"],
    lessons: ["how-a-ball-screw-moves-an-axis", "selecting-an-architecture"],
    tags: ["motion", "structure"],
  },
  {
    slug: "coupling",
    term: "Coupling",
    aliases: ["couplings", "shaft coupling", "flexible coupling", "bellows coupling"],
    plain:
      "The short connector between the motor shaft and the screw shaft. It passes the turning across while forgiving the tiny misalignment between them.",
    technical:
      "A servo coupling transmits torque with high torsional stiffness and near-zero backlash while accommodating small parallel, angular and axial misalignment. Torsional compliance here sits directly inside the position loop, so a soft coupling lowers the achievable servo bandwidth; equally, a rigid coupling on a misaligned pair forces a cyclic side load into the screw bearings.",
    example:
      "A bellows coupling is chosen for stiffness with tolerance to misalignment; alignment is still set at assembly, because the coupling forgives error rather than removing it.",
    related: ["servo-motor", "ball-screw", "feed-drive", "stiffness", "following-error"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "electrical"],
  },
  {
    slug: "way-cover",
    term: "Way cover",
    aliases: [
      "way covers",
      "slideway cover",
      "telescopic cover",
      "telescopic covers",
      "bellows cover",
      "guard bellows",
    ],
    plain:
      "The folding or telescopic metal sheets that keep hot chips and coolant off the rails and screws underneath.",
    technical:
      "Way covers seal the guideways and screws against swarf and coolant while following full axis travel. They add mass and friction to the axis, occupy travel length, and are a routine maintenance item because a damaged cover admits exactly the contamination it exists to exclude. Their space envelope has to be designed in at layout stage, since retrofitting them costs travel.",
    example:
      "Contamination that gets past a split cover grinds the rail and the screw and shows up months later as a positioning error that no compensation fixes.",
    related: ["linear-guide", "chip-conveyor", "coolant", "box-way", "work-envelope"],
    lessons: ["what-is-a-cnc-machine", "selecting-an-architecture"],
    tags: ["structure", "process"],
  },
  {
    slug: "rack-and-pinion",
    term: "Rack and pinion",
    aliases: ["rack-and-pinion", "rack drive", "pinion drive", "rack and pinion drive", "rack"],
    plain:
      "A toothed bar bolted along the machine with a gear rolling along it. Used where an axis is far too long for a screw.",
    technical:
      "A rack and pinion drive transmits force through gear teeth, so travel length is limited only by how many rack segments are joined, and the driven inertia does not grow with travel as a screw's does. Against that, stiffness is lower than a well-supported screw, the tooth mesh introduces backlash unless two pinions are electrically preloaded against one another, and a reduction gearbox is normally required.",
    example:
      "Long gantry routers and laser cutters are usually rack driven, because a screw of that length would be limited by whip long before it reached working speed.",
    related: ["ball-screw", "critical-speed", "gantry", "backlash", "feed-drive"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["motion"],
  },
  {
    slug: "linear-motor",
    term: "Linear motor",
    aliases: ["linear motors", "direct drive linear motor", "linear direct drive", "iron-core motor"],
    plain:
      "A motor unrolled flat: magnets along the machine, coils on the moving part, and no screw or gear in between.",
    technical:
      "A linear motor applies thrust directly to the moving mass, eliminating the screw, coupling and their compliance, wear and backlash. That allows high acceleration and stiff servo response with linear feedback closing the loop on the load itself. The costs are that all cutting force must be held by the motor and its control rather than by a mechanical element, heat is generated in the moving assembly next to the structure, and there is no self-locking on a vertical axis.",
    example:
      "Linear motors suit high-acceleration, light-cutting duty; a heavy roughing axis usually stays on a screw, where the mechanics hold the load rather than the current loop.",
    related: ["feed-drive", "ball-screw", "encoder", "closed-loop-control", "thermal-drift"],
    lessons: ["what-is-a-cnc-machine", "how-a-ball-screw-moves-an-axis"],
    tags: ["motion", "electrical"],
  },

  /* ------------------------------------------------------------------ *
   * Motors, feedback and control loops
   * ------------------------------------------------------------------ */
  {
    slug: "servo-motor",
    term: "Servo motor",
    aliases: [
      "servo motors",
      "servomotor",
      "servomotors",
      "servo",
      "servos",
      "AC servo",
      "servo drive",
      "servo drives",
    ],
    plain:
      "A motor with a position sensor built in, so the control can check where the shaft actually is instead of hoping it went where it was told.",
    technical:
      "A servo motor operates inside a closed loop: its amplifier regulates current to produce torque, an outer velocity loop regulates speed, and the control's position loop commands both from the feedback. Sizing is governed by continuous torque against the duty cycle, peak torque for acceleration, and the inertia ratio between load and rotor — not by peak power alone.",
    example:
      "Because it is closed loop, a servo axis that is obstructed reports a growing following error and faults, rather than silently losing position.",
    related: [
      "closed-loop-control",
      "encoder",
      "following-error",
      "inertia-matching",
      "stepper-motor",
    ],
    lessons: [
      "how-a-ball-screw-moves-an-axis",
      "accuracy-repeatability-resolution",
      "intro-to-machine-architecture",
    ],
    tags: ["electrical", "motion"],
  },
  {
    slug: "stepper-motor",
    term: "Stepper motor",
    aliases: ["stepper motors", "stepper", "steppers", "step motor", "stepping motor"],
    plain:
      "A motor that moves in fixed small steps when it is pulsed. Cheap and simple, but it does not report back whether it actually moved.",
    technical:
      "A stepper motor advances by a fixed angular increment per commanded step, holding position by magnetic detent between steps. Run open loop, it has no way of reporting a missed step, so an overload silently becomes a permanent position error for the rest of the program. Available torque falls with speed, and resonance regions can cause stalling; closed-loop stepper systems add feedback and remove the silent-failure mode.",
    example:
      "An open-loop stepper machine that stalls mid-program will happily continue cutting the rest of the part in the wrong place, because nothing in the system knows.",
    related: ["servo-motor", "closed-loop-control", "encoder", "positioning-error", "feed-drive"],
    lessons: [],
    tags: ["electrical", "motion"],
  },
  {
    slug: "encoder",
    term: "Encoder",
    aliases: [
      "encoders",
      "rotary encoder",
      "rotary encoders",
      "linear encoder",
      "linear encoders",
      "linear scale",
      "glass scale",
      "position feedback",
      "feedback device",
    ],
    plain:
      "The sensor that tells the control where something is. A rotary one counts turns of the motor; a linear one reads a ruler fixed along the axis.",
    technical:
      "An encoder converts position into a signal the control can count, incrementally from a reference or absolutely from a coded track. Its position in the loop decides what the loop can see: feedback taken at the motor cannot detect screw wear, thermal growth or backlash downstream, whereas a linear scale reading the slide includes them. Resolution and accuracy are separate properties — a fine count says nothing about the correctness of the scale.",
    example:
      "A machine with motor-mounted feedback shows a perfect readout while the table sits a little short of position, because the error lives beyond the sensor.",
    related: ["closed-loop-control", "resolution", "dro", "servo-motor", "accuracy"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["electrical", "metrology", "control"],
  },
  {
    slug: "closed-loop-control",
    term: "Closed-loop control",
    aliases: [
      "closed loop control",
      "closed loop",
      "closed-loop",
      "feedback control",
      "servo loop",
      "position loop",
    ],
    plain:
      "The control constantly comparing where the axis should be with where the sensor says it is, and correcting the difference many times a second.",
    technical:
      "Closed-loop motion control is normally cascaded: an outer position loop feeds a velocity loop, which feeds a current loop, each running faster than the one outside it. The loop can only correct what its feedback can observe, and its achievable gain is limited by the mechanical resonances between motor and load — which is why control tuning and mechanical stiffness are the same engineering problem seen twice.",
    example:
      "Raising position gain to reduce following error works only until the drive starts exciting the axis's first resonance, at which point the axis buzzes instead of settling.",
    related: ["servo-motor", "encoder", "following-error", "natural-frequency", "inertia-matching"],
    lessons: [],
    tags: ["control", "electrical"],
  },
  {
    slug: "following-error",
    term: "Following error",
    aliases: ["following errors", "servo lag", "lag error", "tracking error"],
    plain:
      "The gap between where the control asked the axis to be right now and where it actually is while moving. It is never quite zero.",
    technical:
      "Following error is the instantaneous difference between commanded and actual position within a proportional position loop, and at constant velocity it is proportional to feed and inversely proportional to loop gain. Its practical importance is that mismatched following errors between axes distort the path — a circle becomes an ellipse, a corner rounds — even though each axis is individually within tolerance. Feedforward reduces it without raising gain.",
    example:
      "Two axes with different loop gains cut a 45-degree line as a line, but a circle as an ellipse tilted towards the slower axis.",
    related: [
      "closed-loop-control",
      "servo-motor",
      "ballbar-test",
      "circular-interpolation",
      "positioning-error",
    ],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["control", "metrology"],
  },
  {
    slug: "inertia-matching",
    term: "Inertia matching",
    aliases: ["inertia match", "inertia ratio", "reflected inertia", "load inertia", "inertia mismatch"],
    plain:
      "Choosing a motor whose own spinning mass is a sensible fraction of the load it has to accelerate, so the pair behaves predictably.",
    technical:
      "The load inertia reflected to the motor shaft through a screw of lead P is the moving mass multiplied by the square of P divided by 2π, plus the screw's own inertia. A large ratio of load to rotor inertia makes the loop sensitive to transmission compliance and hard to tune; a very small one wastes motor. Any ratio quoted as a target is a rule of thumb for teaching, not a specification: the manufacturer's sizing software and an engineering review govern the real selection.",
    example:
      "Doubling the screw lead quadruples the reflected inertia, which is why a lead chosen for speed can quietly make the axis untunable.",
    related: ["servo-motor", "screw-lead", "closed-loop-control", "feed-drive", "jerk"],
    lessons: ["how-a-ball-screw-moves-an-axis"],
    tags: ["electrical", "motion"],
  },
  /* ------------------------------------------------------------------ *
   * Cutting: the process where tool meets metal
   * ------------------------------------------------------------------ */
  {
    slug: "spindle",
    term: "Spindle",
    aliases: ["spindles", "main spindle", "spindle unit", "spindle nose", "spindle assembly"],
    plain:
      "The part that grips the cutting tool and spins it. Everything else on the machine exists to hold it steady and move it about.",
    technical:
      "The spindle is a precision shaft on preloaded bearings, driven by a belt, a coupled motor or an integral motor, carrying a standardised tool interface at its nose. Its bearing arrangement sets nose stiffness and speed capability, and it is the machine's largest concentrated heat source, so its thermal behaviour drives much of the machine's drift during a shift.",
    example:
      "Spindle nose stiffness is the last link in the structural loop: whatever the rest of the machine achieves, deflection at the nose is added to it.",
    related: [
      "spindle-speed",
      "tool-holder",
      "taper",
      "runout",
      "thermal-drift",
      "structural-loop",
    ],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "intro-to-machine-architecture",
    ],
    tags: ["cutting", "structure"],
  },
  {
    slug: "spindle-speed",
    term: "Spindle speed",
    aliases: [
      "spindle speeds",
      "rotational speed",
      "spindle rpm",
      "rpm",
      "revolutions per minute",
      "rev/min",
    ],
    plain:
      "How fast the tool turns, counted in revolutions per minute. It is chosen from the cutting speed the material wants and the diameter of the tool.",
    technical:
      "Spindle speed n follows from cutting speed and tool diameter as n = (vc × 1000) / (π × D), with vc in m/min, D in mm and n in rev/min. Rev/min is the shop unit; in SI, 1 rev/min is 2π/60 rad/s, about 0.105 rad/s. Available torque falls once a spindle passes its base speed, so a high top speed is not the same as usable cutting capability there.",
    example:
      "The same cutting speed needs roughly twice the rev/min on a 6 mm cutter as on a 12 mm one, because the small tool covers less distance per turn.",
    related: ["cutting-speed", "spindle", "feed-rate", "material-removal-rate", "chatter"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "selecting-an-architecture",
    ],
    tags: ["cutting", "process"],
  },
  {
    slug: "cutting-speed",
    term: "Cutting speed",
    aliases: ["cutting speeds", "surface speed", "peripheral speed"],
    plain:
      "How fast the cutting edge sweeps past the metal, measured along the surface rather than in turns per minute. Each material has a range it likes.",
    technical:
      "Cutting speed vc is the tangential speed at the cutting edge, vc = (π × D × n) / 1000 in m/min with D in mm and n in rev/min; in SI it is that value divided by 60 in m/s. It largely governs cutting-zone temperature and therefore tool life, which is why it is chosen from the workpiece and tool material pair rather than from the machine. Published starting values are manufacturers' recommendations for their own tools and are the figures that govern in practice.",
    example:
      "Aluminium tolerates a far higher cutting speed than stainless steel; running stainless at aluminium's speed destroys the edge in seconds through heat, not force.",
    related: ["spindle-speed", "feed-per-tooth", "tool-wear", "chip-formation", "material-removal-rate"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "selecting-an-architecture",
    ],
    tags: ["cutting", "process"],
  },
  {
    slug: "feed-rate",
    term: "Feed rate",
    aliases: ["feed rates", "feedrate", "feedrates", "feed-rates", "table feed", "programmed feed"],
    plain:
      "How fast the tool travels through the material, in millimetres per minute. It is the number the F word in a program sets.",
    technical:
      "Feed rate vf is the resultant tool-centre velocity along the path, vf = n × z × fz with n in rev/min, z the number of teeth and fz the feed per tooth in mm. It is a consequence of the per-tooth load, not an independent choice: changing tools or spindle speed without recomputing it changes the chip thickness the edge actually sees. Shop practice states it in mm/min; in SI that is the value divided by 60 000 in m/s.",
    example:
      "Halving spindle speed while leaving feed rate untouched doubles the load on every tooth, which is a common way to break a small cutter.",
    related: ["feed-per-tooth", "spindle-speed", "material-removal-rate", "toolpath", "rapid-traverse"],
    lessons: ["cad-to-finished-component", "what-is-a-cnc-machine"],
    tags: ["cutting", "process"],
  },
  {
    slug: "feed-per-tooth",
    term: "Feed per tooth",
    aliases: ["feed/tooth", "chip load", "chipload", "chip per tooth", "fz"],
    plain:
      "How thick a slice each cutting edge takes as it passes through the metal. It is the number that decides whether a tool cuts or rubs.",
    technical:
      "Feed per tooth fz is the advance of the tool per tooth engagement, in mm, and it sets the undeformed chip thickness with the radial engagement. Too small a value makes the edge rub and work-harden the surface instead of shearing it; too large overloads the edge. Radial chip thinning means the actual chip is thinner than fz at light radial engagement, so the compensating feed increase is part of any serious calculation.",
    example:
      "Finishing at a very light stepover with an unchanged feed per tooth produces a chip far thinner than intended, which rubs, heats the edge and shortens tool life.",
    related: ["feed-rate", "chip-formation", "width-of-cut", "tool-wear", "cutting-speed"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting"],
  },
  {
    slug: "depth-of-cut",
    term: "Depth of cut",
    aliases: [
      "axial depth of cut",
      "axial depth",
      "depths of cut",
      "stepdown",
      "step-down",
      "step down",
      "ap",
    ],
    plain:
      "How deep the tool is buried in the material along its own axis — how far down it is taking material in one pass.",
    technical:
      "Axial depth of cut ap is the engagement measured parallel to the tool axis, in mm. With radial width it sets the engaged cutting-edge length, the removal rate and the force the machine must resist. It also drives the stability question, because chatter limits are usually expressed as a permissible axial depth at a given spindle speed.",
    example:
      "Roughing deep and narrow keeps the same removal rate as shallow and wide while using more of the flute length, which spreads wear and can be far more stable.",
    related: ["width-of-cut", "material-removal-rate", "cutting-force", "chatter", "toolpath"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting"],
  },
  {
    slug: "width-of-cut",
    term: "Width of cut",
    aliases: [
      "radial depth of cut",
      "radial width of cut",
      "radial engagement",
      "widths of cut",
      "stepover",
      "step-over",
      "step over",
      "ae",
    ],
    plain:
      "How far the tool is stepped sideways into the material — how wide a bite it takes across its diameter.",
    technical:
      "Radial width of cut ae is the engagement measured perpendicular to the tool axis, in mm, and it sets the engagement angle and therefore how long each tooth is cutting per revolution. A width greater than the tool diameter is physically impossible and signals an input error. Light radial engagement thins the chip, which is the basis of high-feed and trochoidal strategies.",
    example:
      "A full-diameter slot keeps a tooth in the cut for half a revolution; a 10 per cent stepover keeps it in for a small fraction of that, letting the edge cool between passes.",
    related: ["depth-of-cut", "feed-per-tooth", "climb-milling", "material-removal-rate", "cutting-force"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting"],
  },
  {
    slug: "material-removal-rate",
    term: "Material removal rate",
    aliases: ["MRR", "metal removal rate", "removal rate", "material removal rates"],
    plain:
      "How much material the machine takes off per minute. It is the honest measure of how productive a cut is.",
    technical:
      "Material removal rate Q = (ap × ae × vf) / 1000 gives cm³/min from mm and mm/min inputs; in SI that is 10⁻⁶ m³ per minute. It is directly proportional to the cutting power required, so it is the quantity that connects a programming decision to spindle power, drive thrust and structural load. Any figure produced this way is an educational estimate and does not replace tooling manufacturers' data or engineering validation.",
    example:
      "Two very different strategies — deep and narrow, or shallow and wide — can give the same removal rate while loading the tool and the machine in completely different ways.",
    related: ["depth-of-cut", "width-of-cut", "feed-rate", "cutting-force", "spindle"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting", "process"],
  },
  {
    slug: "climb-milling",
    term: "Climb milling",
    aliases: ["climb mill", "climb cut", "down milling", "down-cut milling", "climb"],
    plain:
      "Milling so that each tooth enters the metal at full thickness and leaves at nothing. It is the normal choice on a rigid machine with no play.",
    technical:
      "In climb milling the cutter rotation and feed direction are such that chip thickness starts at maximum and decreases to zero. The cutting force tends to pull the work into the cutter, which demands a drive without backlash, but the edge enters clean rather than rubbing, giving better finish and longer tool life. On a worn manual machine the same force direction can snatch the table, which is why the older convention was the reverse.",
    example:
      "On a CNC machine with preloaded ball screws, climb milling is the default; on a machine with visible table play, it is a way to break cutters.",
    related: ["conventional-milling", "backlash", "tool-wear", "surface-finish", "toolpath"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting", "process"],
  },
  {
    slug: "conventional-milling",
    term: "Conventional milling",
    aliases: ["up milling", "up-cut milling", "conventional cut", "conventional milled"],
    plain:
      "Milling the other way round, so each tooth starts at zero thickness and rubs before it bites. It is kinder to a machine with slack in it.",
    technical:
      "In conventional milling chip thickness rises from zero to maximum through the engagement, so the edge slides at entry before it shears. The resulting rubbing work-hardens some materials and shortens tool life, and the cutting force tends to lift the workpiece rather than seat it. Its virtue is that the force direction opposes feed, which keeps a backlash-prone drive loaded on one flank.",
    example:
      "It remains a sensible choice on hard, scaled or flame-cut surfaces, where entering under the abrasive skin protects the edge.",
    related: ["climb-milling", "backlash", "chip-formation", "tool-wear", "surface-finish"],
    lessons: [],
    tags: ["cutting", "process"],
  },
  {
    slug: "chip-formation",
    term: "Chip formation",
    aliases: ["chip", "chips", "swarf", "chip forming", "built-up edge", "chip thickness"],
    plain:
      "How the metal is actually cut: it is sheared off ahead of the edge as a chip, not scraped away. The chip carries most of the heat with it.",
    technical:
      "Material is deformed to failure in a narrow shear zone ahead of the rake face and flows away as a chip, with further friction on the rake face itself. Most of the energy becomes heat, and a healthy process exports the majority of it in the chip rather than into the tool or the workpiece. Chip colour, shape and size are therefore direct evidence about the process, which is why experienced machinists read the swarf before they read the part.",
    example:
      "Small welded lumps on a finished aluminium surface are a built-up edge tearing away — a sign that the speed or the coolant strategy is wrong, not the program.",
    related: ["cutting-speed", "feed-per-tooth", "tool-wear", "coolant", "surface-finish"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting"],
  },
  {
    slug: "tool-wear",
    term: "Tool wear",
    aliases: ["worn tool", "flank wear", "crater wear", "tool life", "edge wear", "tool wear rate"],
    plain:
      "The gradual wearing away of the cutting edge as it works. A worn tool cuts less accurately, pushes harder and eventually fails.",
    technical:
      "Wear proceeds by several competing mechanisms — abrasion on the flank, diffusion and cratering on the rake face, adhesion, and chipping under interrupted cuts — with temperature accelerating most of them. Because cutting speed dominates temperature, it is usually the strongest lever on tool life. Progressive flank wear is predictable and is what tool-life management plans for; sudden chipping is not.",
    example:
      "Rising spindle load, deteriorating finish and growing size drift on the same program are the usual evidence that an edge has worn rather than that the machine has moved.",
    related: ["cutting-speed", "chip-formation", "surface-finish", "coolant", "runout"],
    lessons: [],
    tags: ["cutting", "process"],
  },
  {
    slug: "coolant",
    term: "Coolant",
    aliases: ["coolants", "cutting fluid", "cutting fluids", "flood coolant", "metalworking fluid"],
    plain:
      "The fluid pumped at the cutting zone to cool it, lubricate it and wash the chips away.",
    technical:
      "Cutting fluid performs three jobs in different proportions depending on the operation: cooling, lubrication of the rake and flank contact, and chip evacuation. It also has consequences beyond cutting — thermal shock on carbide in interrupted cuts, thermal loading of the machine structure, and health, disposal and maintenance duties around mist, concentration and biological control. Handling requirements come from the supplier's safety data sheet and applicable regulations.",
    example:
      "Flooding a deep pocket does more for the process by flushing chips out of the slot than by cooling the tool, because re-cutting chips destroys edges.",
    related: ["through-spindle-coolant", "chip-conveyor", "chip-formation", "tool-wear", "thermal-drift"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "intro-to-machine-architecture",
    ],
    tags: ["process", "safety"],
  },
  {
    slug: "through-spindle-coolant",
    term: "Through-spindle coolant",
    aliases: [
      "through spindle coolant",
      "through-tool coolant",
      "through tool coolant",
      "TSC",
      "high-pressure coolant",
    ],
    plain:
      "Coolant pumped down the middle of the spindle and out through holes in the tool, so it arrives exactly where the cutting happens.",
    technical:
      "Through-spindle coolant delivers fluid at pressure through the spindle and tool holder to ports in the tool, reaching the cutting zone even in deep holes and pockets where flood coolant cannot penetrate. It transforms deep drilling and deep pocketing by evacuating chips from the bottom of the hole. It requires a rotary union, filtration fine enough to protect the small passages, and tooling designed for it.",
    example:
      "Deep drilling without it relies on peck cycles to clear chips; with it, the same hole is often drilled in one continuous plunge.",
    related: ["coolant", "spindle", "tool-holder", "chip-formation", "chip-conveyor"],
    lessons: ["what-is-a-cnc-machine"],
    tags: ["process", "cutting"],
  },
  {
    slug: "cutting-force",
    term: "Cutting force",
    aliases: ["cutting forces", "process force", "process forces", "tangential force"],
    plain:
      "The push the tool gives the metal, and the equal push the metal gives back to the machine. It is what bends everything slightly.",
    technical:
      "The resultant cutting force is conventionally resolved into tangential, radial and axial components; the tangential component multiplied by cutting speed gives the cutting power. Its magnitude scales with the chip cross-section and the material's specific cutting force, and it acts on the machine as a load applied at the tool tip, which the structural loop must resist. Any force figure estimated from a simple model is educational and requires validation by test or by engineering calculation before it sizes hardware.",
    example:
      "The same force that pushes the tool away from the wall also deflects the spindle and the column, so the wall is left thick even though every commanded coordinate was correct.",
    related: ["structural-loop", "stiffness", "depth-of-cut", "material-removal-rate", "chatter"],
    lessons: [
      "cad-to-finished-component",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["cutting", "structure"],
  },
  {
    slug: "surface-finish",
    term: "Surface finish",
    aliases: ["surface finishes", "surface roughness", "finish quality", "surface texture"],
    plain:
      "How smooth the machined surface is when you run a fingernail across it. It is a requirement in its own right, not a by-product.",
    technical:
      "Surface finish is the fine-scale texture left by the process, quantified by roughness parameters measured with a profilometer. In milling it is set by the geometric feed marks, by the dynamic behaviour of tool and machine, and by tool condition — so a finish problem may be a programming issue, a vibration issue or a worn edge, and the pattern on the surface distinguishes them.",
    example:
      "Evenly spaced marks matching the feed per tooth are geometric; an irregular chattered pattern that changes with spindle speed is a dynamics problem.",
    related: ["chatter", "tool-wear", "feed-per-tooth", "climb-milling", "runout"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "intro-to-machine-architecture",
    ],
    tags: ["cutting", "metrology"],
  },
  {
    slug: "stock",
    term: "Stock",
    aliases: ["raw stock", "stock material", "billet", "blank", "stock allowance"],
    plain:
      "The lump of material you start from, and also the extra material deliberately left on a surface for a later finishing pass.",
    technical:
      "Stock is both the raw workpiece — its size, form and condition before machining — and the machining allowance left by one operation for the next. Leaving a controlled finishing allowance decouples the finishing pass from the heavy forces and heat of roughing, which is how consistent size and finish are achieved.",
    example:
      "Leaving a small, even allowance for the finishing pass matters more than its exact value, because an uneven allowance makes the finishing cutter deflect by a varying amount.",
    related: ["workpiece", "depth-of-cut", "cam", "tolerance", "surface-finish"],
    lessons: ["cad-to-finished-component"],
    tags: ["process", "cutting"],
  },
  {
    slug: "workpiece",
    term: "Workpiece",
    aliases: ["workpieces", "work piece", "work-piece", "the workpiece"],
    plain:
      "The part being made — the piece of material held on the machine while the tool cuts it.",
    technical:
      "The workpiece is one half of the structural loop: its stiffness, how it is supported and how it is clamped decide how much of the machine's accuracy actually reaches the finished feature. Its material dictates cutting data, its geometry dictates the fixture, and residual stress released during machining can move it after the cut is finished.",
    example:
      "A thin-walled part can be machined perfectly and still be out of tolerance once unclamped, because releasing the clamping force lets it spring back.",
    related: ["workholding", "fixture", "stock", "datum", "structural-loop"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "understanding-xyz",
    ],
    tags: ["process"],
  },

  /* ------------------------------------------------------------------ *
   * Tooling and the tool interface
   * ------------------------------------------------------------------ */
  {
    slug: "tool-holder",
    term: "Tool holder",
    aliases: [
      "tool holders",
      "toolholder",
      "toolholders",
      "holder",
      "holders",
      "collet chuck",
      "collet",
      "collets",
      "shrink-fit holder",
    ],
    plain:
      "The adaptor between the cutting tool and the spindle. The tool clamps into it, and it clamps into the spindle taper.",
    technical:
      "A tool holder provides the standardised taper and drive features on one end and a clamping system — collet, side-lock, hydraulic or shrink fit — on the other. It sits inside the structural loop at its most flexible point, so its stiffness, balance and clamping concentricity affect runout, tool life and achievable finish as much as the cutter itself.",
    example:
      "A cutter with excellent geometry held in a worn collet inherits that collet's runout, so one tooth does most of the work and wears first.",
    related: ["taper", "runout", "spindle", "tool-changer", "tool-length-offset"],
    lessons: ["understanding-xyz", "intro-to-machine-architecture"],
    tags: ["cutting", "structure"],
  },
  {
    slug: "taper",
    term: "Taper",
    aliases: ["tapers", "spindle taper", "tool taper", "steep taper", "tapered interface"],
    plain:
      "The precision cone at the top of a tool holder that pulls tight into a matching cone in the spindle. It centres the tool and holds it.",
    technical:
      "A tapered tool interface locates by conical contact, drawn in by a drawbar; hollow-taper designs add simultaneous face contact for greater bending stiffness and better repeatability at high speed. Cleanliness of both cone surfaces is not a housekeeping detail — a single chip trapped in the taper tilts the tool and destroys concentricity for the whole cut.",
    example:
      "A chip in the taper can throw the tool tip out by far more than the chip's own thickness, because the taper amplifies the tilt along the tool's length.",
    related: ["tool-holder", "spindle", "runout", "tool-changer", "repeatability"],
    lessons: ["accuracy-repeatability-resolution", "intro-to-machine-architecture"],
    tags: ["cutting", "structure"],
  },
  {
    slug: "runout",
    term: "Runout",
    aliases: ["run-out", "run out", "TIR", "total indicator reading", "eccentricity"],
    plain:
      "How far off-centre a spinning tool is. If the tool wobbles, one cutting edge does more work than the others.",
    technical:
      "Runout is the total indicated movement of a rotating feature measured perpendicular to its axis, accumulating contributions from spindle bearings, taper condition, holder concentricity and the tool's own seating. Its practical effect is unequal load sharing between teeth: with significant runout, one edge takes an oversized chip and wears out ahead of the rest, degrading finish and life.",
    example:
      "Indicating a tool in the holder before a long finishing pass is quicker than discovering afterwards that one flute did all the cutting.",
    related: ["tool-holder", "taper", "spindle", "dial-indicator", "surface-finish"],
    lessons: ["cad-to-finished-component"],
    tags: ["metrology", "cutting"],
  },
  {
    slug: "tool-changer",
    term: "Tool changer",
    aliases: [
      "tool changers",
      "automatic tool changer",
      "ATC",
      "tool magazine",
      "tool carousel",
      "toolchanger",
    ],
    plain:
      "The mechanism that swaps tools in and out of the spindle automatically, so one program can use many different cutters.",
    technical:
      "An automatic tool changer stores tools in a magazine — carousel, umbrella or chain — and transfers them to the spindle by a swing arm or by a direct spindle move. Its performance is measured as chip-to-chip time, and its reliability depends on tool identification, correct offsets and clean tapers. Every change is also a repeatability event: the tool must seat identically each time, or its length offset stops being true.",
    example:
      "A twin-arm changer swaps the used and the next tool in one rotation, which is why it is much faster than a spindle that must travel to the magazine and back.",
    related: ["tool-holder", "taper", "machining-centre", "plc", "repeatability"],
    lessons: ["what-is-a-cnc-machine"],
    tags: ["process", "control"],
  },
  {
    slug: "end-mill",
    term: "End mill",
    aliases: [
      "end mills",
      "endmill",
      "endmills",
      "milling cutter",
      "milling cutters",
      "cutter",
      "cutters",
      "slot drill",
    ],
    plain:
      "The most common milling tool: a rotating cutter with edges on its side and its end, so it can cut sideways and downwards.",
    technical:
      "An end mill removes material with peripheral flutes and end teeth, characterised by diameter, flute count, helix angle, corner geometry, substrate and coating. Flute count trades chip space against the number of edges in the cut, so a low count suits aluminium and deep slotting while a high count suits light finishing passes in steel. Overhang from the holder dominates its deflection and its dynamic behaviour.",
    example:
      "Doubling the stick-out of an end mill increases its deflection under the same side force by roughly eightfold, because bending goes with the cube of length.",
    related: ["tool-holder", "feed-per-tooth", "chatter", "depth-of-cut", "tool-wear"],
    lessons: ["cad-to-finished-component"],
    tags: ["cutting"],
  },
  /* ------------------------------------------------------------------ *
   * Structure, materials and dynamics
   * ------------------------------------------------------------------ */
  {
    slug: "structural-loop",
    term: "Structural loop",
    aliases: ["structural loops", "force loop", "load loop", "structural chain"],
    plain:
      "The complete path of metal from the cutting edge, back through the machine, and round to the workpiece. Every part of that path is holding the cut.",
    technical:
      "The structural loop is the closed chain — tool, holder, spindle, head, column, base, table, fixture, workpiece — through which cutting force is reacted. Its total compliance is the sum of every element's compliance and every joint's, so the softest link governs. Shortening and closing the loop is the single most effective structural design decision, because deflection at the tool point is what the finished part records.",
    example:
      "Adding a long tool extension lengthens the loop at its weakest point, and no amount of stiffness in the base can compensate for it.",
    related: ["stiffness", "compliance", "cutting-force", "column", "workpiece"],
    lessons: [
      "what-is-a-cnc-machine",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["structure"],
  },
  {
    slug: "stiffness",
    term: "Stiffness",
    aliases: ["static stiffness", "rigidity", "rigid", "stiff", "stiffnesses"],
    plain:
      "How much force it takes to push something out of position by a given amount. A stiff axis barely moves when the cutter pushes on it.",
    technical:
      "Stiffness is force divided by resulting deflection, in newtons per metre or the practical N/µm. Static stiffness governs steady-state deflection under cutting force and therefore dimensional error; dynamic stiffness — stiffness combined with damping at the frequencies that matter — governs whether the machine chatters. A machine can be statically stiff and dynamically poor, which is why both are quoted in serious design work.",
    example:
      "If a side force of a few hundred newtons deflects the tool point by a few hundredths of a millimetre, that deflection appears directly as a wall left thick.",
    related: ["compliance", "damping", "structural-loop", "cutting-force", "chatter"],
    lessons: [
      "what-is-a-cnc-machine",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["structure"],
  },
  {
    slug: "compliance",
    term: "Compliance",
    aliases: ["compliant", "compliances", "springiness", "flexibility"],
    plain:
      "The opposite of stiffness: how much something springs out of the way when it is pushed.",
    technical:
      "Compliance is deflection per unit force, the reciprocal of stiffness. It is the more convenient quantity when combining a chain of elements, because compliances in series simply add — which is the mathematical statement of why the softest element in a structural loop dominates the total.",
    example:
      "A very stiff bed bolted to a compliant tool holder gives a compliant machine, because the two add and the larger term wins.",
    related: ["stiffness", "structural-loop", "damping", "cutting-force", "chatter"],
    lessons: ["intro-to-machine-architecture"],
    tags: ["structure"],
  },
  {
    slug: "damping",
    term: "Damping",
    aliases: ["damped", "damping ratio", "material damping", "damping capacity", "damp out"],
    plain:
      "How quickly a vibration dies away after something is knocked. Good damping turns a ringing structure into a dull thud.",
    technical:
      "Damping is the dissipation of vibrational energy, expressed as a damping ratio or loss factor. In a machine tool it comes mostly from joints, guideway contact and lubricant films rather than from bulk material, with cast iron and mineral castings offering more material damping than welded steel. Together with stiffness it sets dynamic stiffness, which is the actual limit on stable depth of cut.",
    example:
      "Two machines with equal static stiffness can behave completely differently in a heavy cut, because the better-damped one absorbs the vibration that starts chatter.",
    related: ["chatter", "stiffness", "natural-frequency", "cast-iron", "polymer-concrete"],
    lessons: ["how-a-ball-screw-moves-an-axis", "intro-to-machine-architecture"],
    tags: ["structure"],
  },
  {
    slug: "chatter",
    term: "Chatter",
    aliases: ["chattering", "chatter marks", "regenerative chatter", "self-excited vibration"],
    plain:
      "The loud, unstable vibration that suddenly starts in a cut and leaves a wavy, screeching surface behind it.",
    technical:
      "Regenerative chatter is self-excited vibration: a tooth cuts a wavy surface, the next tooth meets that waviness, and the resulting variable chip thickness feeds energy back into the vibration. Whether it grows or decays depends on the dynamic stiffness of the tool–machine system, the axial depth of cut and the spindle speed, which is why stability lobe diagrams plot the stable depth against speed. Changing speed is often more effective than reducing depth.",
    example:
      "The same tool and depth can cut silently at one spindle speed and scream at another, because the tooth-passing frequency has moved relative to a natural frequency.",
    related: ["damping", "natural-frequency", "stiffness", "depth-of-cut", "surface-finish"],
    lessons: [
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["structure", "cutting"],
  },
  {
    slug: "natural-frequency",
    term: "Natural frequency",
    aliases: ["natural frequencies", "resonance", "resonant frequency", "mode shape", "eigenfrequency"],
    plain:
      "The frequency at which a structure prefers to vibrate when you tap it, like the note of a struck bell.",
    technical:
      "A natural frequency is a frequency at which a structure vibrates freely, each one accompanied by a mode shape describing how it deforms. Excitation near one produces a large response for a small input, so tooth-passing frequencies, drive resonances and servo bandwidth are all chosen with the machine's modes in mind. They are measured by tap testing and estimated in design by finite element analysis.",
    example:
      "A long unsupported tool has a low natural frequency and is easy to excite; the same tool held short is much harder to provoke.",
    related: ["chatter", "damping", "stiffness", "finite-element-analysis", "jerk"],
    lessons: [],
    tags: ["structure"],
  },
  {
    slug: "thermal-drift",
    term: "Thermal drift",
    aliases: [
      "thermal growth",
      "thermal expansion",
      "thermal movement",
      "thermal error",
      "warm-up drift",
      "thermal distortion",
    ],
    plain:
      "The slow change in a machine's geometry as it warms up during the day. A machine that was right at eight in the morning may not be at two in the afternoon.",
    technical:
      "Thermal drift is dimensional and geometric change caused by temperature gradients across the structure, driven by spindle and drive losses, cutting heat, coolant and the ambient environment. Because it is a gradient effect rather than a uniform expansion, it can tilt a column or bend a bed rather than simply lengthen it. It is managed by symmetric design, by removing heat at source, by warm-up cycles and by compensation models — and any measurement quoted without a stated temperature is incomplete.",
    example:
      "A machine measured cold and again after two hours of running will often show a different result, and neither number is wrong — the temperature is part of the result.",
    related: ["column", "spindle", "cast-iron", "accuracy", "error-budget"],
    lessons: [
      "intro-to-machine-architecture",
      "accuracy-repeatability-resolution",
      "selecting-an-architecture",
    ],
    tags: ["structure", "metrology"],
  },
  {
    slug: "cast-iron",
    term: "Cast iron",
    aliases: ["grey cast iron", "gray cast iron", "cast irons", "iron casting", "grey iron"],
    plain:
      "The traditional material for machine beds and columns. It is heavy, easy to cast into complicated ribbed shapes, and it absorbs vibration well.",
    technical:
      "Grey cast iron owes its damping to graphite flakes in the matrix, which also make it easy to machine and to cast into ribbed hollow sections. Its stiffness per unit mass is lower than steel's, so designs exploit section shape rather than material modulus, and large castings are stress relieved before final machining so that residual stress does not release later as distortion.",
    example:
      "A ribbed cast-iron bed can be stiffer in practice than a welded steel one of the same mass, because the casting process allows sections the fabrication cannot.",
    related: ["polymer-concrete", "damping", "machine-bed", "stiffness", "thermal-drift"],
    lessons: ["how-a-ball-screw-moves-an-axis", "intro-to-machine-architecture"],
    tags: ["structure"],
  },
  {
    slug: "polymer-concrete",
    term: "Polymer concrete",
    aliases: ["mineral casting", "mineral cast", "epoxy granite", "polymer concretes"],
    plain:
      "A structural material made of stone aggregate bound with resin, cast into a mould. It is very good at soaking up vibration.",
    technical:
      "Polymer concrete combines graded mineral aggregate with a polymer binder, giving high material damping and low thermal conductivity relative to metals, cast at room temperature into moulds that can include inserts and cooling channels. Its elastic modulus is well below cast iron's, so sections are made thicker, and steel inserts are cast in wherever bolted joints or bearing seats are needed.",
    example:
      "Precision grinding machines often use mineral castings for their damping and slow thermal response, accepting the bulkier sections that follow.",
    related: ["cast-iron", "damping", "machine-bed", "stiffness", "thermal-drift"],
    lessons: ["intro-to-machine-architecture"],
    tags: ["structure"],
  },
  {
    slug: "gantry",
    term: "Gantry",
    aliases: ["gantries", "moving gantry", "gantry machine", "portal", "bridge structure"],
    plain:
      "A bridge that spans across the machine on two legs, carrying the spindle. Either the bridge moves along the bed, or the table moves under a fixed bridge.",
    technical:
      "A gantry or portal layout carries the tool on a beam supported at both ends, which closes the structural loop symmetrically and scales far better to long travels than a cantilever. The design questions are torsional stiffness of the beam, whether both legs are driven — and if so how they are kept square — and the mass that must be accelerated when the gantry itself moves.",
    example:
      "Large routers and plate machines are almost always gantries, because a C-frame long enough to reach the far side of the table would be hopelessly flexible.",
    related: ["c-frame", "moving-table", "structural-loop", "stiffness", "critical-speed"],
    lessons: [
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
      "accuracy-repeatability-resolution",
    ],
    tags: ["structure"],
  },
  {
    slug: "c-frame",
    term: "C-frame",
    aliases: ["C frame", "C-frames", "c frame layout", "open frame"],
    plain:
      "The common layout where a column at the back carries the spindle head out over the table, making the shape of a letter C.",
    technical:
      "In a C-frame the loop from tool to table runs up an overhanging head, back along the column and down into the base, so the cutting force is reacted partly by bending a cantilever. That gives excellent access to the work at the cost of an overhang that grows more compliant with reach, which is why C-frames dominate small and medium vertical machines but not large ones.",
    example:
      "Open access at the front of a C-frame machine makes loading and fixturing easy, which is exactly the trade being made against the overhang.",
    related: ["gantry", "column", "structural-loop", "vertical-machining-centre", "stiffness"],
    lessons: ["intro-to-machine-architecture", "selecting-an-architecture"],
    tags: ["structure"],
  },
  {
    slug: "moving-table",
    term: "Moving table",
    aliases: ["moving-table", "moving tables", "moving-table design", "travelling table"],
    plain:
      "A layout where the workpiece moves under a spindle that stays put in one or two directions.",
    technical:
      "In a moving-table design the workpiece and fixture are part of the accelerated mass, so drive sizing depends on how heavy the job is and dynamic performance changes with the part. It also demands floor space of roughly twice the travel in each moving direction. Against that, the tool point stays in one place, which keeps the spindle's structural loop short and simple.",
    example:
      "A machine that performs beautifully with a small part can feel sluggish with a heavy fixture bolted on, because the moving mass has changed.",
    related: ["machine-table", "gantry", "saddle", "structural-loop", "work-envelope"],
    lessons: [
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["structure", "motion"],
  },
  {
    slug: "column",
    term: "Column",
    aliases: ["columns", "machine column", "upright", "uprights"],
    plain:
      "The tall part of the machine that stands up from the base and carries the spindle head.",
    technical:
      "The column carries the vertical axis and reacts the bending and torsional loads passed back from the tool point, so its section, ribbing and the stiffness of its joint to the base dominate the loop's compliance. It is also a thermal member: heat entering one face makes it bow, tilting the spindle and producing an error that grows with the distance from the joint.",
    example:
      "A column that bows by a small angle tilts the spindle, and that angle multiplied by the distance to the tool tip becomes the error the part records.",
    related: ["c-frame", "machine-bed", "structural-loop", "thermal-drift", "saddle"],
    lessons: [
      "what-is-a-cnc-machine",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["structure"],
  },
  {
    slug: "saddle",
    term: "Saddle",
    aliases: ["saddles", "cross slide", "cross-slide", "intermediate slide"],
    plain:
      "The middle slide in a stack of two: it rides on the bed in one direction and carries the table moving in the other.",
    technical:
      "The saddle is the intermediate member of a stacked-axis arrangement, guided on the bed and guiding the member above it. It has to be stiff in bending and torsion despite being pierced for the screw and lightened for acceleration, and any compliance in it appears twice in the loop, once for each axis it separates.",
    example:
      "In a stacked X-on-Y arrangement the lower axis carries the mass and the drive of the upper one, so its guideways are sized for a larger load than its own.",
    related: ["machine-table", "machine-bed", "moving-table", "linear-guide", "column"],
    lessons: [
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["structure", "motion"],
  },
  {
    slug: "machine-bed",
    term: "Machine bed",
    aliases: ["bed", "beds", "machine beds", "base casting", "machine base"],
    plain:
      "The big heavy part at the bottom that everything else is bolted to. It ties the moving parts together and passes their loads into the floor.",
    technical:
      "The bed closes the structural loop between the column and the workholding side of the machine and provides the reference surfaces from which alignment is established. Its stiffness, its damping and the way it is supported on its feet determine how much the rest of the design can achieve — a bed that twists on an uneven floor takes squareness with it.",
    example:
      "Levelling a machine is not cosmetic: a bed supported unevenly is a bed that has been twisted, and every geometric check afterwards is measuring that twist.",
    related: ["column", "cast-iron", "structural-loop", "squareness", "machine-table"],
    lessons: [
      "intro-to-machine-architecture",
      "selecting-an-architecture",
      "accuracy-repeatability-resolution",
    ],
    tags: ["structure"],
  },
  {
    slug: "machine-table",
    term: "Machine table",
    aliases: ["table", "tables", "worktable", "work table", "machine tables", "T-slot table"],
    plain:
      "The flat top surface with slots in it that the workpiece or the vice is bolted to.",
    technical:
      "The table provides the mounting reference for workholding, usually through T-slots or a zero-point grid, and its flatness and the parallelism of its slots to the axes are geometric characteristics in their own right. It is the last structural element before the workpiece, so its stiffness and the clamping arrangement on it decide how much of the machine's accuracy survives to the cut.",
    example:
      "Clamping a large fixture on the outer edge of a table loads it as a cantilever, and any resulting sag is added straight into the part.",
    related: ["workholding", "fixture", "moving-table", "saddle", "machine-bed"],
    lessons: [
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
    ],
    tags: ["structure", "process"],
  },
  {
    slug: "chip-conveyor",
    term: "Chip conveyor",
    aliases: ["chip conveyors", "swarf conveyor", "chip auger", "chip management", "swarf handling"],
    plain:
      "The belt or screw in the bottom of the machine that carries chips out into a bin, so they do not pile up in the work area.",
    technical:
      "A chip conveyor removes swarf from the enclosure continuously, which matters for more than tidiness: accumulated hot chips heat the structure, re-cut chips destroy tool edges and finish, and buried chips obstruct fixtures and covers. Conveyor type — hinged belt, scraper or auger — is chosen for the chip form the machine will actually produce, so it is a design decision that follows from the intended workpiece materials.",
    example:
      "Long stringy chips from a ductile material can bridge and jam a conveyor built for the short broken chips of cast iron.",
    related: ["coolant", "way-cover", "chip-formation", "machine-bed", "workholding"],
    lessons: ["what-is-a-cnc-machine"],
    tags: ["process", "structure"],
  },
  {
    slug: "finite-element-analysis",
    term: "Finite element analysis",
    aliases: ["FEA", "finite element model", "FE analysis", "finite element method"],
    plain:
      "Computer analysis that splits a structure into thousands of small pieces to predict how it will bend and vibrate before it is built.",
    technical:
      "Finite element analysis approximates a continuum by a mesh of elements with assumed shape functions, solving for deflection, stress and modal behaviour under defined loads and constraints. It is excellent at comparing design variants and locating compliance, and much weaker at absolute prediction of joints, bolted interfaces and damping — the very things that dominate a real machine. Results are engineering evidence to be validated by measurement, not a substitute for it.",
    example:
      "Comparing two rib layouts by analysis is reliable enough to choose between them; predicting the finished machine's exact stiffness from the same model is not.",
    related: ["stiffness", "natural-frequency", "structural-loop", "damping", "error-budget"],
    lessons: ["intro-to-machine-architecture"],
    tags: ["structure", "process"],
  },
  /* ------------------------------------------------------------------ *
   * Holding the work, and the language of drawings
   * ------------------------------------------------------------------ */
  {
    slug: "workholding",
    term: "Workholding",
    aliases: [
      "work holding",
      "work-holding",
      "clamping",
      "vice",
      "vices",
      "vise",
      "chuck",
      "chucks",
    ],
    plain:
      "Everything used to hold the workpiece still while it is cut: vices, clamps, chucks and purpose-made fixtures.",
    technical:
      "Workholding must resist the cutting force with a margin, locate the part repeatably against defined datums, and avoid over-constraining or distorting it — three requirements that often pull in different directions. It sits inside the structural loop, so its stiffness matters as much as its grip, and it must also leave chips somewhere to go and the tool somewhere to run out.",
    example:
      "Clamping a thin plate flat against a bowed surface machines a flat top that springs back into a bow the moment the clamps come off.",
    related: ["fixture", "datum", "workpiece", "machine-table", "structural-loop"],
    lessons: [
      "cad-to-finished-component",
      "understanding-xyz",
      "intro-to-machine-architecture",
    ],
    tags: ["process", "structure"],
  },
  {
    slug: "fixture",
    term: "Fixture",
    aliases: ["fixtures", "fixturing", "jig", "jigs", "soft jaws"],
    plain:
      "A purpose-made holder that puts every workpiece in exactly the same place, so the same program fits every part.",
    technical:
      "A fixture locates a part against a defined set of datums — classically the 3-2-1 scheme of six contact points removing six degrees of freedom — then clamps against those locators without deforming the part or fighting them. Repeatable location is what allows one proven work offset to serve a whole batch, so fixture repeatability enters the part's tolerance stack directly.",
    example:
      "If a fixture repeats to within a few hundredths of a millimetre, that variation is added to every feature the program cuts, however accurate the machine is.",
    related: ["workholding", "datum", "work-offset", "repeatability", "tolerance"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "understanding-xyz",
      "selecting-an-architecture",
    ],
    tags: ["process", "metrology"],
  },
  {
    slug: "datum",
    term: "Datum",
    aliases: ["datums", "datum surface", "datum feature", "datum reference", "reference surface"],
    plain:
      "The agreed starting point that measurements are taken from — a face, an edge or a hole that everything else is described relative to.",
    technical:
      "A datum is a theoretically exact reference established from a real feature, used on the drawing to state where dimensions and geometric tolerances are measured from. Machining, inspection and fixturing should all use the same datums as the drawing; when they do not, parts can be rejected for a stack of measurement references rather than for anything actually wrong with the geometry.",
    example:
      "Setting the work offset on a face the drawing does not use as a datum quietly shifts every dimension by whatever the relationship between the two faces happens to be.",
    related: ["tolerance", "work-offset", "work-coordinate-system", "fixture", "accuracy"],
    lessons: [
      "understanding-xyz",
      "cad-to-finished-component",
      "accuracy-repeatability-resolution",
      "selecting-an-architecture",
    ],
    tags: ["metrology", "process"],
  },
  {
    slug: "tolerance",
    term: "Tolerance",
    aliases: ["tolerances", "tolerance band", "dimensional tolerance", "toleranced", "tolerancing"],
    plain:
      "The amount a dimension is allowed to vary and still be acceptable. Nothing is ever made exactly, so every dimension needs one.",
    technical:
      "A tolerance is the permissible variation on a size or a geometric characteristic, and it is a cost decision as much as a functional one: halving a tolerance can multiply process cost, because it demands better machines, better fixtures and more measurement. Tolerances stack, so the combination of fixture repeatability, machine accuracy, tool setting and thermal state must fit inside the drawing's allowance.",
    example:
      "A hole toleranced far tighter than the assembly needs adds cost to every part made for the life of the product, and buys nothing.",
    related: ["accuracy", "datum", "error-budget", "fixture", "measurement-uncertainty"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "understanding-xyz",
      "accuracy-repeatability-resolution",
      "selecting-an-architecture",
    ],
    tags: ["metrology", "process"],
  },

  /* ------------------------------------------------------------------ *
   * Accuracy and metrology
   * ------------------------------------------------------------------ */
  {
    slug: "accuracy",
    term: "Accuracy",
    aliases: ["accurate", "accuracies", "inaccuracy", "accuracy of a machine"],
    plain:
      "How close the machine actually gets to the position it was told to go to — the distance from the middle of its attempts to the right answer.",
    technical:
      "Accuracy describes agreement between commanded and true position, and it is meaningful only with a stated measurement method, temperature and measurement uncertainty. It combines a systematic part, which can be measured once and compensated, and a random part, which cannot. A single accuracy figure quoted without its test conditions is marketing, not metrology; the internationally recognised test methods for machine tools are set out in standards such as ISO 230, which should be consulted directly for their scope and requirements.",
    example:
      "Two machines quoting the same accuracy figure may have been tested along different lengths, at different temperatures, with different instruments, and are not comparable.",
    related: [
      "repeatability",
      "resolution",
      "positioning-error",
      "measurement-uncertainty",
      "error-budget",
    ],
    lessons: ["accuracy-repeatability-resolution", "what-is-a-cnc-machine"],
    tags: ["metrology"],
  },
  {
    slug: "repeatability",
    term: "Repeatability",
    aliases: ["repeatable", "repeat accuracy", "repeatabilities", "repeatably"],
    plain:
      "How tightly the machine groups when it is sent back to the same position over and over — how consistent it is, whether or not it is right.",
    technical:
      "Repeatability is the spread of positions reached on repeated approaches to the same target, usually reported as a statistical band from a defined number of approaches in both directions. It is the more fundamental property, because a repeatable machine with a known systematic error can be compensated, while a machine that scatters cannot be. Its enemies are clearance, friction variation, thermal instability and anything that changes between approaches.",
    example:
      "A machine that lands the same small amount short every single time is easy to correct; one that lands anywhere within a cloud of that same size cannot be corrected at all, only improved mechanically.",
    related: ["accuracy", "resolution", "backlash", "reversal-value", "fixture"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "resolution",
    term: "Resolution",
    aliases: ["resolutions", "least input increment", "display resolution", "step size"],
    plain:
      "The smallest step the control can command or the feedback can report. It is a property of the numbers, not a promise about the metal.",
    technical:
      "Resolution is the smallest discernible increment in a system's command or measurement chain, set by the feedback device and the control's internal units. It bounds accuracy from below but never guarantees it: a system can resolve a fine increment and still be wrong by many times that amount through geometric error, backlash or thermal drift. Confusing the two is the most common misreading of a machine specification.",
    example:
      "A readout showing three decimal places says the control counts in microns; it does not say the table arrives within a micron of anything.",
    related: ["accuracy", "repeatability", "encoder", "dro", "positioning-error"],
    lessons: ["accuracy-repeatability-resolution", "what-is-a-cnc-machine"],
    tags: ["metrology", "control"],
  },
  {
    slug: "positioning-error",
    term: "Positioning error",
    aliases: [
      "positioning errors",
      "positioning deviation",
      "position error",
      "positional error",
      "positioning accuracy",
    ],
    plain:
      "The difference between where the control said the axis would be and where an independent instrument says it actually is.",
    technical:
      "Positioning deviation is measured along the axis of travel against an independent length standard, typically a laser interferometer, at a series of target positions approached from both directions. The resulting curve separates a systematic component — screw lead error, thermal growth — from scatter, and its bidirectional character exposes reversal behaviour. Compensation tables in the control correct the systematic part only.",
    example:
      "A deviation curve that drifts steadily along the travel usually points to lead error or thermal growth in the screw, not to the servo.",
    related: [
      "accuracy",
      "laser-interferometer",
      "systematic-error",
      "reversal-value",
      "backlash",
    ],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "straightness",
    term: "Straightness",
    aliases: ["straightness error", "straightness errors", "straightness deviation", "straight line error"],
    plain:
      "How far a moving carriage wanders sideways or up and down while it is supposed to be travelling in a perfectly straight line.",
    technical:
      "Straightness error comprises the two translational deviations perpendicular to the direction of travel, arising from guideway form, mounting-surface flatness and load-induced deflection. It is measured with a straightedge and indicator, a taut wire or a laser, and it is a machine geometry characteristic rather than a control one — no compensation table for positioning along the axis touches it.",
    example:
      "An axis can position perfectly along its length and still cut a curved wall, because the carriage bows sideways as it travels.",
    related: ["squareness", "linear-guide", "volumetric-accuracy", "linear-axis", "dial-indicator"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology", "structure"],
  },
  {
    slug: "squareness",
    term: "Squareness",
    aliases: [
      "squareness error",
      "squareness errors",
      "out of square",
      "out-of-square",
      "perpendicularity",
    ],
    plain:
      "How truly two axes meet at a right angle. If they do not, everything cut with both of them comes out slightly skewed.",
    technical:
      "Squareness error is the angular deviation from 90 degrees between the mean lines of two axes, measured with a granite square and indicator, by a ballbar, or by machining and inspecting a test piece. It produces a parallelogram distortion whose magnitude grows with the size of the feature, so it is often invisible on small parts and obvious on large ones.",
    example:
      "A rectangular pocket cut on a machine with an XY squareness error comes out as a parallelogram — its sides are the right length, but its corners are not right angles.",
    related: ["straightness", "volumetric-accuracy", "ballbar-test", "machine-bed", "accuracy"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology", "structure"],
  },
  {
    slug: "volumetric-accuracy",
    term: "Volumetric accuracy",
    aliases: ["volumetric error", "volumetric performance", "volumetric errors"],
    plain:
      "How far the tool point really is from where it should be at any location inside the machine's working space, with every error acting at once.",
    technical:
      "Volumetric accuracy is the combined effect of all error components across the work envelope: for a three-axis machine, six components per linear axis plus three squareness errors, twenty-one in total, superimposed. It is what the workpiece actually experiences, which is why single-axis figures flatter a machine, and it is the quantity volumetric compensation and error-budget work address.",
    example:
      "A machine with excellent single-axis numbers can still cut a poor large part, because the errors that were separately small combine at the far corner of the envelope.",
    related: ["error-budget", "straightness", "squareness", "accuracy", "work-envelope"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "error-budget",
    term: "Error budget",
    aliases: ["error budgets", "error budgeting", "accuracy budget"],
    plain:
      "A list of every source of error in a machine or a process, with a size against each, added up to see whether the total fits the requirement.",
    technical:
      "An error budget allocates the permitted total deviation among contributors — geometry, thermal effects, feedback, workholding, tool setting, cutting deflection — so design effort goes where it changes the answer. Independent random contributions are commonly combined in quadrature and systematic ones added directly. Treat any budget worked through for teaching as an educational estimate: real allocation needs measured data and engineering review.",
    example:
      "If one contributor accounts for most of the total, tightening any other by a factor of two barely moves the result — which is the whole point of writing the budget down.",
    related: [
      "volumetric-accuracy",
      "accuracy",
      "measurement-uncertainty",
      "thermal-drift",
      "tolerance",
    ],
    lessons: ["accuracy-repeatability-resolution", "selecting-an-architecture"],
    tags: ["metrology", "process"],
  },
  {
    slug: "ballbar-test",
    term: "Ballbar test",
    aliases: ["ballbar", "ballbars", "ball bar", "ballbar plot", "circular test", "double ballbar"],
    plain:
      "A quick diagnostic where a telescoping bar between two magnetic seats measures a circle the machine traces, and the shape of the plot names the fault.",
    technical:
      "A ballbar measures small radial deviations while two axes interpolate a circle, and because the resulting polar plot has characteristic signatures — steps at the quadrants, an oval tilted at 45 degrees, a lobed trace — it separates backlash, squareness error, servo mismatch and cyclic error faster than any other single test. It is a diagnostic and comparative instrument rather than a substitute for full positioning measurement; the standardised test procedures for machine tools live in standards such as ISO 230, which must be consulted for their actual requirements.",
    example:
      "Running the same ballbar test monthly and keeping the plots turns it into a trend record, which catches a developing fault long before parts go out of tolerance.",
    related: ["circular-interpolation", "backlash", "squareness", "following-error", "accuracy"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "laser-interferometer",
    term: "Laser interferometer",
    aliases: ["laser interferometry", "interferometer", "laser measurement system", "laser calibration"],
    plain:
      "A measuring instrument that uses the wavelength of light as its ruler, giving an extremely precise independent reading of how far an axis really moved.",
    technical:
      "A laser interferometer measures displacement by counting interference fringes between a reference and a moving retro-reflector, giving an independent length reference traceable to the definition of the metre. Because the wavelength in air depends on temperature, pressure and humidity, environmental compensation is part of the measurement, and the results are only as good as those sensor readings and the alignment of the beam to the axis.",
    example:
      "It is the standard instrument for positioning measurement and for generating the compensation table a control then applies along the axis.",
    related: [
      "positioning-error",
      "measurement-uncertainty",
      "accuracy",
      "dial-indicator",
      "ballbar-test",
    ],
    lessons: ["accuracy-repeatability-resolution", "selecting-an-architecture"],
    tags: ["metrology"],
  },
  {
    slug: "dial-indicator",
    term: "Dial indicator",
    aliases: [
      "dial indicators",
      "dial test indicator",
      "DTI",
      "test indicator",
      "indicator",
      "indicators",
      "plunger indicator",
    ],
    plain:
      "A small mechanical gauge with a needle that shows how far its tip has been pushed in. The everyday instrument for comparing and aligning.",
    technical:
      "A dial indicator is a comparator: it measures change relative to a set position rather than absolute size, which makes it ideal for alignment, run-out and geometry checks against a reference such as a test bar or a granite square. Its reading is only as trustworthy as its mounting — a flexible stand contributes its own deflection, and the measured value then belongs partly to the setup.",
    example:
      "Sweeping a dial indicator around a bore in the spindle shows how far the bore is from being concentric with the spindle axis, without measuring either absolutely.",
    related: ["runout", "straightness", "squareness", "work-offset", "laser-interferometer"],
    lessons: [
      "accuracy-repeatability-resolution",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["metrology"],
  },
  {
    slug: "systematic-error",
    term: "Systematic error",
    aliases: ["systematic errors", "bias", "systematic deviation"],
    plain:
      "An error that turns up the same size and the same direction every time, so it can be measured once and corrected afterwards.",
    technical:
      "A systematic error is a repeatable deviation with a deterministic cause — screw lead error, squareness, a constant thermal offset — and it is therefore compensable, either in a control table or by adjusting the process. Correcting it changes the mean without changing the scatter, which is why measuring the systematic part is the cheapest accuracy improvement available.",
    example:
      "A pitch-error compensation table stores the measured deviation at points along the travel and subtracts it from every subsequent command.",
    related: ["random-error", "positioning-error", "accuracy", "error-budget", "thermal-drift"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "random-error",
    term: "Random error",
    aliases: ["random errors", "scatter", "non-repeatable error", "random deviation"],
    plain:
      "An error that comes out differently every attempt, so there is no rule to apply and nothing to correct — it can only be engineered smaller.",
    technical:
      "Random error is the non-repeatable component of deviation, arising from friction variation, clearance, vibration, temperature fluctuation and measurement noise. It sets the floor on repeatability and therefore on what compensation can achieve, since only the mean can be corrected. Reducing it is mechanical and environmental work — preload, lubrication, thermal control — not a control-parameter exercise.",
    example:
      "Averaging many approaches reveals a systematic error clearly, but averaging never removes the scatter that is still there on any individual part.",
    related: ["systematic-error", "repeatability", "measurement-uncertainty", "accuracy", "backlash"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "measurement-uncertainty",
    term: "Measurement uncertainty",
    aliases: ["uncertainty", "measurement uncertainties", "uncertainty budget", "uncertainties"],
    plain:
      "The honest band of doubt around any measured value, saying how much the true value could differ from the number you wrote down.",
    technical:
      "Uncertainty quantifies the dispersion reasonably attributable to a measurand, combining contributions from the instrument, the setup, the environment and the operator. A result without it cannot be compared with a tolerance or with another result, and where the uncertainty is a significant fraction of the tolerance, the decision rule for conformity has to be stated as well.",
    example:
      "Claiming a part is within a tolerance of a few microns with an instrument whose uncertainty is of the same order is not a measurement, it is an opinion.",
    related: ["accuracy", "random-error", "tolerance", "laser-interferometer", "error-budget"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology"],
  },
  {
    slug: "reversal-value",
    term: "Reversal value",
    aliases: ["reversal values", "reversal spike", "reversal spikes", "bidirectional deviation"],
    plain:
      "The extra error you see when you arrive at a point from one direction rather than the other — the measurable footprint of lost motion.",
    technical:
      "The reversal value is the difference between the mean positions reached approaching a target from opposite directions, and it captures clearance, elastic deformation at the drive reversal and friction effects together. Measuring bidirectionally is what exposes it; a unidirectional test can look excellent on a machine that steps visibly at every direction change.",
    example:
      "On a ballbar plot the reversal value shows as a small step exactly where one axis stops and turns round, at the quadrant crossings.",
    related: ["backlash", "positioning-error", "repeatability", "ballbar-test", "preload"],
    lessons: ["accuracy-repeatability-resolution"],
    tags: ["metrology", "motion"],
  },

  /* ------------------------------------------------------------------ *
   * Safety
   * ------------------------------------------------------------------ */
  {
    slug: "guarding",
    term: "Guarding",
    aliases: [
      "guard",
      "guards",
      "guarded",
      "fixed guard",
      "movable guard",
      "enclosure",
      "enclosures",
      "safety enclosure",
    ],
    plain:
      "The physical barriers that keep people out of the dangerous parts of a machine, and keep chips and coolant inside it.",
    technical:
      "Guarding is a protective measure applied after inherently safe design has been exhausted, following the hierarchy of risk reduction: eliminate the hazard, then guard against it, then inform about the residual risk. Fixed guards need a tool to remove; movable guards are interlocked so that opening them removes the hazard. The purpose and scope of machine safety are addressed by standards including ISO 12100 and, for machining centres, ISO 16090-1 — consult them directly for their actual requirements, and treat the applicable law in your jurisdiction as governing.",
    example:
      "An enclosure on a machining centre serves two purposes at once: it contains a broken tool or a thrown part, and it keeps coolant mist and chips inside.",
    related: ["interlock", "emergency-stop", "risk-assessment", "coolant", "chip-conveyor"],
    lessons: [
      "what-is-a-cnc-machine",
      "understanding-xyz",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["safety"],
  },
  {
    slug: "interlock",
    term: "Interlock",
    aliases: [
      "interlocks",
      "interlocked",
      "door interlock",
      "guard interlock",
      "interlocking device",
      "guard locking",
    ],
    plain:
      "The arrangement that makes opening a door stop the dangerous motion, and stops the motion starting while the door is open.",
    technical:
      "An interlocking device links the position of a movable guard to the machine's control system so that hazardous functions cannot run while the guard is open, and it may add guard locking where run-down time means the hazard persists after a stop command. Such safety functions are implemented in rated architecture with defined reliability, and the standards that set out how to specify and verify them — ISO 13849-1 and IEC 60204-1 among them — must be consulted directly; the design and verification are work for qualified personnel under applicable law.",
    example:
      "On a machine whose spindle takes time to run down, the door stays locked until the control confirms standstill rather than merely that a stop was commanded.",
    related: ["guarding", "emergency-stop", "risk-assessment", "plc", "spindle"],
    lessons: [
      "what-is-a-cnc-machine",
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "selecting-an-architecture",
    ],
    tags: ["safety", "control"],
  },
  {
    slug: "emergency-stop",
    term: "Emergency stop",
    aliases: ["emergency stops", "E-stop", "estop", "e stop", "emergency stop button"],
    plain:
      "The red mushroom button that brings everything to a halt. It is a last resort for when something has already gone wrong, not a way of making a machine safe.",
    technical:
      "Emergency stop is a complementary protective measure: it does not remove a hazard, it interrupts an emerging hazardous situation once a person has recognised it and acted. Because it depends on human reaction, it never substitutes for inherently safe design, guarding and interlocks. Its actuators, its stop category and its reset behaviour are the subject of standards including IEC 60204-1 and ISO 13849-1, which must be consulted for the actual requirements.",
    example:
      "A machine that relies on an operator hitting a button to be safe is not a safe machine; the button exists for the situation nobody designed for.",
    related: ["guarding", "interlock", "risk-assessment", "plc", "machine-control-unit"],
    lessons: [
      "what-is-a-cnc-machine",
      "cad-to-finished-component",
      "selecting-an-architecture",
    ],
    tags: ["safety"],
  },
  {
    slug: "risk-assessment",
    term: "Risk assessment",
    aliases: [
      "risk assessments",
      "hazard identification",
      "hazard assessment",
      "risk analysis",
      "risk reduction",
    ],
    plain:
      "The structured process of listing what could hurt someone, judging how bad and how likely it is, and deciding what to do about it before building anything.",
    technical:
      "Risk assessment identifies hazards across every phase of a machine's life — transport, installation, setting, operation, maintenance, fault-finding, decommissioning — estimates the risk from severity, exposure and avoidability, and drives risk reduction in a defined order of priority, iterating until the residual risk is acceptable and documented. ISO 12100 addresses the general principles for design and risk assessment; consult it and the relevant sector standards directly, and treat the legal duties of your jurisdiction as governing.",
    example:
      "Assessing a machine only in normal operation misses the phases where most injuries happen — setting, clearing a jam and maintenance, when guards are most likely to be open.",
    related: ["guarding", "interlock", "emergency-stop", "workholding", "chip-conveyor"],
    lessons: ["intro-to-machine-architecture", "selecting-an-architecture"],
    tags: ["safety", "process"],
  },
];

/** Lookup by slug, used by the glossary page and by cross-references. */
const bySlug = new Map(glossary.map((entry) => [entry.slug, entry]));

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return bySlug.get(slug);
}

/**
 * The glossary reshaped for `lib/autolink.ts`. Nothing here is authored twice:
 * the matcher is fed exactly the surface forms the glossary already declares.
 */
export const glossaryAutolinkTerms: AutolinkTerm[] = glossary.map((entry) => ({
  slug: entry.slug,
  term: entry.term,
  aliases: entry.aliases,
}));

/** Built once at module load; the matcher is pure, so it is safe to share. */
export const glossaryIndex = buildAutolinkIndex(glossaryAutolinkTerms);

/** Every tag actually used, in the order the browser presents its filters. */
export const GLOSSARY_TAGS = [
  "motion",
  "cutting",
  "structure",
  "control",
  "electrical",
  "metrology",
  "safety",
  "process",
] as const;

export const GLOSSARY_TAG_LABELS: Record<(typeof GLOSSARY_TAGS)[number], string> = {
  motion: "Motion",
  cutting: "Cutting",
  structure: "Structure",
  control: "Control",
  electrical: "Electrical",
  metrology: "Metrology",
  safety: "Safety",
  process: "Process",
};
