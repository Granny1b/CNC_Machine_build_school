import type { Lesson } from "../types";

export const understandingXyz: Lesson = {
  slug: "understanding-xyz",
  level: 2,
  title: "Understanding X, Y and Z",
  intro:
    "A CNC machine cannot be told to cut \"about there\". Every position it moves to is three numbers measured from an agreed starting point, and almost every beginner mistake in machining is really a disagreement about which starting point that is. This lesson builds the coordinate system from nothing, then shows the two systems every machine runs at once and the offsets that tie them together.",
  minutes: 20,
  objectives: [
    "Name the X, Y and Z axes on a vertical machining centre and give each one a positive direction using the right-hand rule.",
    "Explain why axis direction is defined by the motion of the tool relative to the workpiece, and apply that rule to a machine where only the table moves.",
    "Identify the rotary axes A, B and C and say which linear axis each one turns about.",
    "Distinguish the machine coordinate system from the work coordinate system, and say what a work offset stores.",
    "Explain why every tool needs its own length offset, and state in one sentence what cutter radius compensation does.",
    "Write the same four hole positions in absolute and in incremental form, and say which one survives a restart in the middle of a program.",
  ],
  terms: [
    {
      term: "Axis",
      plain:
        "One controlled direction of movement. A machine with three axes can place its tool anywhere inside a box-shaped working space.",
    },
    {
      term: "Right-hand rule",
      plain:
        "A hand gesture used as a memory aid: thumb, index and middle finger held at right angles give the positive directions of X, Y and Z in that order.",
    },
    {
      term: "Datum",
      plain:
        "The agreed point everything is measured from. On a part it is usually called part zero, and it is chosen by whoever writes the program.",
    },
    {
      term: "Machine coordinate system",
      plain:
        "The machine's own fixed set of numbers, with its zero built in by the builder. It never moves, and the machine finds it again every time it is switched on.",
    },
    {
      term: "Homing",
      plain:
        "The start-up routine where each axis drives slowly to a known reference so the control learns where it is. Also called referencing.",
    },
    {
      term: "Work coordinate system",
      plain:
        "A second set of numbers whose zero sits on the workpiece, so a program can be written about the part rather than about the machine.",
    },
    {
      term: "Work offset",
      plain:
        "The stored numbers that say where part zero sits in the machine's own coordinates. It is the bridge between the two systems.",
    },
    {
      term: "Tool length offset",
      plain:
        "A measured number for each tool saying how far its cutting tip sticks out below the spindle, so the control can work out where the tip really is.",
    },
    {
      term: "Cutter radius compensation",
      plain:
        "Letting the control push the tool centre sideways off the programmed line by a stored radius, so you can program the finished edge instead of the tool path.",
    },
    {
      term: "Absolute positioning",
      plain:
        "Every coordinate states where the point is, measured from part zero. It does not matter where the tool is at the time.",
    },
    {
      term: "Incremental positioning",
      plain:
        "Every coordinate states how far to move from wherever the tool is standing right now, and in which direction.",
    },
    {
      term: "Interpolation",
      plain:
        "The control working out, moment by moment, how fast each axis must run so that their combined motion draws the shape you asked for.",
    },
  ],
  blocks: [
    { kind: "heading", text: "Three numbers and a zero" },
    {
      kind: "prose",
      body: [
        "Ask somebody to point at a spot on a workbench and they will say \"about there, near the middle\". A machine cannot use that. It needs the spot named by numbers, and it needs those numbers measured from a point you and it agreed on beforehand.",
        "That agreed point is a zero, or a datum. Once a zero exists, any position in the machine's working space can be named by three numbers: how far along, how far across, and how far up. Those three directions are the axes, and they are called `X`, `Y` and `Z`.",
        "This is nothing more exotic than a map reference with a height added. What takes practice is not the arithmetic but the conventions — which direction counts as positive, which zero you are measuring from, and what the control quietly adds to your numbers before anything moves.",
      ],
    },
    {
      kind: "figure",
      figure: "axis-triad",
      caption:
        "The standard axis set on a vertical machining centre, drawn as the operator sees it. Look first at the three straight arrows: `+X` to the right, `+Y` away from you into the machine, `+Z` upwards along the spindle. Then look at the curved arrows — `A`, `B` and `C` turn about `X`, `Y` and `Z` in that order. Every arrow shows the motion of the tool relative to the workpiece, which on most machines is not the direction the table itself slides.",
    },
    {
      kind: "prose",
      body: [
        "On a vertical machining centre — a milling machine whose spindle points downwards — the naming is fixed by convention rather than by choice. `Z` runs along the spindle axis, so on this machine it is up and down. `X` is the longest side-to-side travel of the table as you stand at the door. `Y` is what is left: in and out, towards and away from you.",
        "The positive directions come from the right-hand rule. Hold your right hand out and set thumb, index finger and middle finger at right angles to each other, like the corner of a box. Thumb is `+X`, index finger is `+Y`, middle finger is `+Z`. Point the thumb to your right and the index finger away from you into the machine, and the middle finger points up. That is the standard set: `+X` right, `+Y` away from the operator, `+Z` up.",
        "This is not decoration. The same right-handed convention is used in physics, engineering drawing and CAD, so a model, a drawing and a machine all agree about which way round the world is. Get it wrong on one machine and mirrored parts come out of it.",
      ],
    },
    { kind: "heading", text: "The direction belongs to the tool, not the table" },
    {
      kind: "prose",
      body: [
        "Here is the convention that catches every beginner, and it is worth reading twice. The direction of an axis is defined by the movement of the tool relative to the workpiece — not by the movement of whichever lump of iron the builder chose to put on rails.",
        "On a great many machines the spindle does not move sideways at all. It stays where it is and the table slides underneath it, carrying the part. So when the tool appears to travel to the right, what physically happened is that the table went left.",
        "It is the illusion you get in a railway station. The train on the next platform pulls away and for a moment you are certain you are the one moving. Relative motion is what matters to the part being cut; who is doing the moving is a mechanical detail the programmer should never have to think about.",
        "That is why the convention exists. The same program should cut the same shape on a machine where the table moves, one where the gantry moves and one where the spindle head moves. Defining direction by tool-relative-to-work keeps the program portable and leaves the mechanical arrangement where it belongs, with the machine builder.",
      ],
    },
    {
      kind: "example",
      title: "Which way is +X when the table moves?",
      body: [
        "You are standing at the door of a vertical machining centre. A plate is clamped in a vice bolted to the table. You command a 10 mm move in the positive `X` direction.",
        "The table slides 10 mm to your left. Nothing else moves. Every instinct says the machine has done the opposite of what you asked.",
        "Now look at it from the plate's point of view. The plate travelled left with the table, so the cutter is now sitting 10 mm nearer the plate's right-hand end than it was. Relative to the workpiece, the tool moved 10 mm to the right. That is `+X`, and the machine did precisely what it was told.",
        "Check yourself against the part, not the hardware: if the feature you cut appears further along the part in the `+X` direction, the axis is behaving correctly, whatever the castings did to achieve it.",
      ],
    },
    {
      kind: "note",
      title: "Z is measured away from the workpiece",
      body: "`+Z` always points along the spindle axis, away from the workpiece. On a vertical machine that means upwards, out of the cut. So if part zero is the top face of your plate, `Z50.` puts the tool tip 50 mm clear in the air above it and `Z-5.` puts it 5 mm down inside the material. This is why nearly every cutting `Z` value in a milling program is negative, and why an unexpectedly positive one is worth a second look before you press start.",
    },
    { kind: "heading", text: "Rotary axes: A, B and C" },
    {
      kind: "prose",
      body: [
        "Three numbers fix where a point is, but they say nothing about which way the tool is pointing. To cut a face angled at 30 degrees, or to reach round the side of a part without re-clamping it, the machine also needs to turn something. Those turning directions are the rotary axes.",
        "The naming follows the alphabet in step with the linear axes. `A` is rotation about `X`, `B` is rotation about `Y`, and `C` is rotation about `Z`. A tilting cradle that swings a table about the side-to-side direction is an `A` axis; a turntable spinning about the vertical is a `C` axis.",
        "Positive rotation follows the right-hand rule as well. Point the thumb of your right hand along `+X` and curl your fingers: they curl in the direction of positive `A`. The same gesture along `+Y` gives `+B` and along `+Z` gives `+C`.",
        "This is where axis counts come from. A three-axis machine commands `X`, `Y` and `Z`; add a tilting trunnion and a rotary table on top of it and you have five, which lets the tool approach the work from many angles instead of only straight down. Every extra axis buys capability and costs stiffness, money and complication — a trade the machine architecture lessons take up properly.",
      ],
    },
    { kind: "heading", text: "Two coordinate systems, and the offset between them" },
    {
      kind: "prose",
      body: [
        "When a machine is switched on it often has no idea where it is. Many controls therefore begin with homing: each axis drives slowly towards a known reference — a switch, or a marked position on the feedback device — and stops there. From that moment the control holds a machine coordinate system, a fixed set of numbers whose zero is built into the machine by its maker.",
        "Machine zero is chosen for the builder's convenience, usually at an extreme of travel such as the very top of `Z` and one corner of the table. It is a fine reference for the machine and a useless one for you, because your part is not clamped to machine zero. It is clamped wherever the vice happens to sit today.",
        "So the setter creates a second system for the job: the work coordinate system. Its zero is part zero — the datum — and it goes wherever the programmer decided to measure from, typically a corner of the part and the top of a finished face. Every coordinate in the program is measured from there.",
        "The two systems are joined by the work offset: a stored set of numbers recording where part zero sits in the machine's own coordinates. The program says `X0. Y0.`; the control adds the offset and drives to the machine position that actually corresponds to it. Move the vice, and you change only the offset. The program never learns that anything happened.",
      ],
    },
    {
      kind: "compare",
      title: "Machine coordinates and work coordinates compared",
      columns: ["Machine coordinate system", "Work coordinate system"],
      rows: [
        {
          label: "Where its zero sits",
          cells: [
            "A fixed point built into the machine and found again by homing, usually at an extreme of travel such as the top of `Z`.",
            "Wherever the programmer chose on the part — commonly one corner and the top of a finished face.",
          ],
        },
        {
          label: "Who decides it",
          cells: [
            "The machine builder, through the placement of the reference positions. An operator does not move it in normal work.",
            "The setter, at the machine, by touching a real feature on the real part and storing what the machine reads.",
          ],
        },
        {
          label: "How often it changes",
          cells: [
            "Effectively never. It changes only if the machine is re-referenced or re-commissioned.",
            "Every job, sometimes every part. A new fixture or a different datum face means a new number.",
          ],
        },
        {
          label: "What the program uses",
          cells: [
            "Almost nothing — only housekeeping moves such as going to a tool-change or park position.",
            "Everything. Every cutting coordinate in a part program is measured from part zero.",
          ],
        },
        {
          label: "Where it is stored",
          cells: [
            "In the control's absolute position registers, maintained from the reference found at homing.",
            "In a numbered work offset register — `G54` to `G59` on one widely used control family, with extended sets beyond.",
          ],
        },
      ],
    },
    {
      kind: "example",
      title: "Setting a work offset on a plate in a vice",
      body: [
        "A plate is clamped in a vice. The programmer chose part zero as the bottom-left corner of the plate's top face, looking down at it from above.",
        "The setter finds the left-hand face of the plate with an edge finder and, allowing for the finder's own radius, reads the machine coordinate of that face as `X-320.000`. The front face comes out at `Y-190.000`. Touching the top face gives `Z-350.000`.",
        "Those three numbers go into the work offset register for this job. From then on, a program line saying `X0. Y0.` drives the machine to `X-320.000 Y-190.000` without the program containing either number.",
        "Tomorrow the vice is knocked and reset 3 mm further along the table. The setter measures again, changes one stored number, and the same program runs untouched. That separation is why a program written two years ago still cuts today's part.",
      ],
    },
    { kind: "heading", text: "Every tool needs its own length offset" },
    {
      kind: "prose",
      body: [
        "Tools stick out of the spindle by wildly different amounts. A stubby face mill projects a little; a long-series drill projects a lot. The control has no way of seeing any of it. What it knows precisely is where the spindle nose is — the flat reference face the tool holder pulls up against.",
        "So each tool carries a tool length offset: a measured number saying how far the cutting tip is below that reference face. When the program calls the tool, the control applies its offset and can finally work out where the tip is in space. Without one, a `Z` command means nothing physical at all.",
        "That number is measured, not calculated: by touching the tool onto a known surface, by a tool setter on the table, or in a presetter off the machine. However it is found, it belongs to that tool in that holder at that projection — regrind it, or reset it in the collet a few millimetres deeper, and the stored number is wrong.",
      ],
    },
    {
      kind: "example",
      title: "Two tools, one program",
      body: [
        "Part zero for `Z` is the top of the plate, measured at machine `Z-350.000`.",
        "Tool 1 is a 10 mm end mill whose tip sits `120.000 mm` below the spindle nose. Tool 2 is a spot drill whose tip sits only `95.500 mm` below it.",
        "For the program line `Z0.` — tool tip exactly on the plate top — tool 1 needs the spindle nose at `-350.000 + 120.000 = -230.000`. Tool 2 needs it at `-350.000 + 95.500 = -254.500`, some `24.5 mm` lower down.",
        "Same program, same commanded `Z0.`, two quite different machine positions. Now run tool 1 with tool 2's offset still active: the nose goes to `-254.500` and the long end mill drives `24.5 mm` below the surface of the part. Run tool 2 with tool 1's offset and it stops `24.5 mm` short, spinning in fresh air. Both mistakes are one wrong register, and only one of them is quiet.",
      ],
    },
    {
      kind: "deeper",
      title: "The arithmetic: how your Z number becomes a machine position",
      body: [
        "Every `Z` move is a short sum with three ingredients: where the part datum sits in machine coordinates, what the program asked for, and how long the tool is. The program supplies only the middle term.",
        "Work through the example above. The program says `Z-5.` for a 5 mm deep cut, the offset says the part top is at `-350.000`, and tool 1 is `120.000 mm` long. The nose is driven to `-350.000 + (-5.000) + 120.000 = -235.000`, putting the tip at `-235.000 - 120.000 = -355.000` — exactly 5 mm below a surface sitting at `-350.000`.",
        "Controls differ in how they store and sign these numbers: some hold tool length as a positive projection, some as a negative machine coordinate, some combine work and tool offsets in one register. The sum above is the shape of the idea and not a universal register layout — it is an educational simplification, and the manual for the machine in front of you is the authority on how its own registers behave.",
      ],
      formula: {
        expression: "Z_nose = Z_datum + Z_prog + L_tool",
        variables: [
          {
            symbol: "Z_nose",
            meaning: "Machine coordinate the spindle nose is actually driven to",
            unit: "mm",
          },
          {
            symbol: "Z_datum",
            meaning: "Machine coordinate of the part's zero surface, held in the work offset",
            unit: "mm",
          },
          {
            symbol: "Z_prog",
            meaning:
              "The Z value written in the program, measured from part zero — negative when the tool is in the cut",
            unit: "mm",
          },
          {
            symbol: "L_tool",
            meaning: "Tool length offset: distance from the spindle nose reference face down to the tool tip",
            unit: "mm",
          },
        ],
        meaning:
          "It shows that a part program only ever talks about the part. The work offset and the tool length are added by the control at the last moment, so a new datum or a new tool means editing a stored number — never editing the program.",
      },
    },
    { kind: "heading", text: "Cutter radius compensation, in one idea" },
    {
      kind: "prose",
      body: [
        "A milling cutter is not a point. To leave a wall in a particular place, the centre of the tool has to travel half a tool diameter away from that wall. Somebody has to do that offsetting, and there are only two candidates: the software that wrote the path, or the control that runs it.",
        "CAM usually does it in advance, which is why a posted program is normally already a tool-centre path. Cutter radius compensation is the other option: you program the finished edge itself and tell the control to hold the tool centre a stored radius to the left or to the right of the direction of travel. The control does the geometry as it goes, including the awkward parts where the path turns a corner.",
        "The gain is that tool size becomes a number rather than a rewrite: a cutter reground 0.2 mm smaller is handled by editing one register, and deliberately entering a slightly larger radius leaves a thin, even skin for a final spring pass. The cost is that the control needs a clean entry move to establish the offset, must look ahead to avoid gouging tight internal corners, and will misbehave predictably if the stored radius does not match the tool actually in the spindle. Compensation moves the tool; it never checks it. The codes themselves, with their entry and exit rules, belong to the programming level — here you only need the idea.",
      ],
    },
    { kind: "heading", text: "Absolute and incremental positioning" },
    {
      kind: "prose",
      body: [
        "There are two ways to write a coordinate, and mixing them up produces some of the most spectacular scrap in the trade. In absolute positioning, every number says where the point is, measured from part zero. In incremental positioning, every number says how far to move from wherever the tool is standing at that instant.",
        "Absolute is a street address; incremental is a set of walking directions. The address is true whether you approach from the north or the south. The directions only work if you start where the person giving them assumed you would.",
        "Both are modal, meaning the mode stays in force until something changes it. A program that switches to incremental for a repeated pattern and forgets to switch back will read the next absolute coordinate as a distance to travel — and a line meaning \"go to 250 mm along\" becomes \"move a further 250 mm\", which is usually straight into something solid.",
      ],
    },
    {
      kind: "example",
      title: "The same four holes, written twice",
      body: [
        "Four holes in a plate, with part zero at the bottom-left corner of the top face. Hole 1 is at 20 mm along and 20 mm across, hole 2 at 80 and 20, hole 3 at 80 and 60, hole 4 at 20 and 60. The tool starts above part zero.",
        "Written in absolute, each line states a place: `X20. Y20.` then `X80. Y20.` then `X80. Y60.` then `X20. Y60.`. Read any line on its own and you know exactly where the hole is.",
        "Written in incremental, each line states a journey: `X20. Y20.` then `X60. Y0.` then `X0. Y40.` then `X-60. Y0.`. Read the third line on its own and it tells you only \"go 40 mm across from here\" — useless without knowing where here was.",
        "Now move hole 2 to 85 mm along. In the absolute version you edit one line and the other three holes stay exactly where they were. In the incremental version you edit `X60.` to `X65.` and holes 3 and 4 both shift 5 mm as well, because they were measured from hole 2. To hold them still you must also change a later line, and it is precisely that second edit that gets forgotten.",
      ],
    },
    {
      kind: "compare",
      title: "Absolute and incremental positioning compared",
      columns: ["Absolute", "Incremental"],
      rows: [
        {
          label: "What each number means",
          cells: [
            "Where the point is, measured from part zero. `X80.` means 80 mm from the datum, whatever the tool is doing now.",
            "How far to travel from the current position. `X60.` means go a further 60 mm in `+X`, and the result depends entirely on the starting point.",
          ],
        },
        {
          label: "Restarting mid-program",
          cells: [
            "Recoverable: the next move goes to a stated place, so the tool comes back onto plan by itself. You must still restore tool, offsets and modal state first.",
            "Unsafe: the move is measured from wherever the tool was left, so jogging before a restart sends every remaining position out by that amount.",
          ],
        },
        {
          label: "Editing one position",
          cells: [
            "Change one line and only that feature moves; every other coordinate still states its own location.",
            "Change one line and everything downstream shifts with it, because each position is measured from the one before.",
          ],
        },
        {
          label: "How errors behave",
          cells: [
            "A typo spoils one point; the following move restates a position and the error stops there.",
            "A typo shifts all remaining positions by the same amount, and repeated errors accumulate through the program.",
          ],
        },
        {
          label: "Typical use",
          cells: [
            "The default for almost all cutting, and what most CAM systems write throughout a program.",
            "Repeated patterns, subprograms and macros, where the same relative shape is run at several places, and manual shifts at the control.",
          ],
        },
      ],
    },
    { kind: "heading", text: "The only two moves the control can make" },
    {
      kind: "prose",
      body: [
        "For all the shapes a machining centre can produce, its motion vocabulary is tiny. Linear interpolation draws a straight line from the current position to a commanded one, with every axis involved starting and finishing together. Circular interpolation draws an arc of a true circle in a chosen plane, with the control continuously trading speed between two axes so the tool stays exactly on the radius.",
        "That is the whole list. There is no command for a spline, the swoop of a mould surface or the curve of a turbine blade. Those shapes are approximated: CAM chops them into a great many short straight segments, each one an ordinary linear move, and the control runs them back to back so quickly that the result looks and feels continuous.",
        "It is the same trick as drawing a circle with a many-sided polygon. Eight sides and it looks like a stop sign; eight thousand and nobody can tell the difference — but the file is large, and the control now has to read, plan and blend thousands of blocks per second rather than a handful.",
        "That explains several things that otherwise look like magic: why three-dimensional programs are enormous compared with two-dimensional ones, why a control's look-ahead capability is a headline specification, and why faceting sometimes shows on a finished surface. The segments were simply too long for the shape being cut.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "L = sqrt(dX^2 + dY^2 + dZ^2)   and   v_X = v_f x (dX / L)",
        variables: [
          {
            symbol: "L",
            meaning: "Straight-line length of the programmed move — the distance the tool tip actually travels",
            unit: "mm",
          },
          {
            symbol: "dX, dY, dZ",
            meaning: "How far each axis must move during the block: end position minus start position",
            unit: "mm",
          },
          {
            symbol: "v_f",
            meaning: "Programmed feed rate — the speed of the tool tip along the path, not along any one axis",
            unit: "mm/min",
          },
          {
            symbol: "v_X",
            meaning: "Speed the X axis itself must run at to keep the tool on the path; Y and Z follow the same pattern",
            unit: "mm/min",
          },
        ],
        meaning:
          "It tells you the feed you program belongs to the path, not to any single axis: on a diagonal every axis runs slower than the number you typed. Check the axis with the longest travel when you want to know what limits a move, and never assume a rapid positioning move follows that straight line — many controls run each axis at its own maximum during a rapid, so the tool takes a dog-leg a straight-line assumption would not predict.",
      },
    },
    {
      kind: "deeper",
      title: "Why a smooth curve is really thousands of straight lines",
      body: [
        "When CAM converts a curved surface into segments it works to a chord tolerance: the largest gap it will allow between the true curve and the straight line standing in for it. Halve that tolerance and the segments get shorter, the file gets bigger and the control has more blocks to chew through in the same time.",
        "That is a real trade-off rather than a setting to max out. Segments too long, and you can see and feel the flats on a finished surface. Segments too short, and the control can starve: if a block takes less time to execute than the control takes to read and plan it, the machine slows to keep up, and feed rate collapses on exactly the curved surfaces you cared most about.",
        "Circular interpolation avoids all of this where the shape genuinely is an arc, which is why programmers prefer real arcs for holes, radii and pockets. The look-ahead buffer handles the rest: it reads well past the current block so it can plan how fast to enter each corner without overshooting. Treat any chord tolerance figure as an educational starting point only — the right value depends on the machine, the control and the finish required, and it is settled by cutting test pieces rather than by a rule of thumb.",
      ],
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong: "Deciding that because the table slides to the right, that direction must be `+X`.",
          why: "The convention defines direction by the motion of the tool relative to the workpiece. On a moving-table machine the table goes left for a `+X` command. Trust the direction the feature appears to move along the part, not the direction the castings travel, or you will mirror every program you write.",
        },
        {
          wrong: "Setting the work offset from whichever face was convenient to reach, rather than the face the program was written from.",
          why: "The program measures from one specific datum. Touching off a different face shifts every coordinate by the distance between the two faces, uniformly and silently. The machine executes perfectly and the part is wrong everywhere by the same amount — which is the signature of a datum error rather than a cutting problem.",
        },
        {
          wrong: "Setting `Z` zero on the top of the vice jaws, or on the table, instead of the top of the part.",
          why: "Whatever surface you touch becomes `Z0`, and the control believes you. If the part stands 6 mm proud of the jaws, every programmed depth ends up 6 mm deeper than intended: the finishing pass cuts through the floor of the pocket and the drill goes looking for the vice.",
        },
        {
          wrong: "Leaving the control in incremental mode after a repeated pattern and then reading absolute coordinates.",
          why: "Positioning mode is modal: it stays in force until something changes it, and nothing in an ordinary coordinate line looks wrong to the control. The cure is habit rather than vigilance — state the mode explicitly at the top of every program and again after every subprogram, so no block ever inherits a mode you cannot see.",
        },
        {
          wrong: "Assuming cutter radius compensation will save a part when the tool is not the size you told the control it was.",
          why: "Compensation offsets by the number stored in a register; it has no way of measuring the tool. Enter 5.000 mm for a cutter that is actually 4.940 mm after regrinding and every compensated wall sits 0.030 mm out. It is a control for tool size, not a check on it.",
        },
      ],
    },
    {
      kind: "safety",
      body: "Every idea in this lesson turns into real, powered movement. A machine that has just been homed will accept any coordinate you give it and travel there at rapid speed without checking whether a vice, a clamp, a probe or a hand is in the way, because it has no sense at all of what occupies its working space. Datum and offset errors are therefore not arithmetic slips but the most common cause of collisions, and a collision at rapid can throw tooling, break a spindle and injure people. Treat the first run of any new setup as a test rather than as production: keep the guards closed, stay within reach of feed hold, run in single block with the feed and rapid overrides turned right down, and watch the tool approach the metal rather than watching the screen. Never reach into the working envelope to check a datum or clear a chip while the control is live — isolate the machine following its documented procedure, and work to the safe systems of work your workplace and the machine's instructions require.",
    },
  ],
  knowledgeCheck: [
    {
      id: "xyz-q1",
      prompt:
        "You command a positive `X` move on a vertical machining centre. The table slides to your left and the spindle does not move sideways at all. What has happened?",
      options: [
        {
          id: "a",
          text: "The machine is correct: relative to the workpiece the tool has moved in `+X`, which is what the convention defines.",
          correct: true,
          feedback:
            "Correct. Axis direction is defined by the motion of the tool relative to the workpiece. The table going left puts the cutter nearer the right-hand end of the part, which is `+X` regardless of which casting moved.",
        },
        {
          id: "b",
          text: "The `X` axis motor is wired the wrong way round and the direction needs reversing in the machine parameters.",
          correct: false,
          feedback:
            "Tempting, because a reversed axis genuinely does exist as a commissioning fault and this looks exactly like one. It breaks because the observed behaviour is the standard, correct behaviour for a moving-table machine — reversing it would make every program cut a mirror image.",
        },
        {
          id: "c",
          text: "The control was in incremental mode, so it read the command as a distance rather than a position.",
          correct: false,
          feedback:
            "Tempting, because a forgotten incremental mode is a real and dangerous fault. It breaks because the mode affects how far the machine goes, never which way `+X` points — a wrong mode would give the wrong distance in the same direction.",
        },
        {
          id: "d",
          text: "`+X` is defined by the direction the table travels, so this was really a negative `X` move.",
          correct: false,
          feedback:
            "Tempting, and it is the single most common beginner misconception, because the table is the thing your eyes follow. It breaks because defining direction by the hardware would mean rewriting programs for every machine layout, which is precisely what the tool-relative convention exists to prevent.",
        },
      ],
      teaching:
        "Axis directions describe the motion of the tool relative to the workpiece. The mechanical arrangement that achieves that motion is the builder's business, and it is what keeps one program portable across differently built machines.",
    },
    {
      id: "xyz-q2",
      prompt:
        "A plate stands 6 mm proud of the vice jaws. The setter touches off `Z` on the top of the jaws instead of the top of the plate. What happens when the program runs?",
      options: [
        {
          id: "a",
          text: "Every `Z` depth is 6 mm deeper than intended, because the control believes the part surface is 6 mm lower than it really is.",
          correct: true,
          feedback:
            "Correct. Whatever surface you touch off becomes `Z0`. The real surface is 6 mm above it, so a commanded `Z-5.` puts the tip 11 mm below the actual top face — through the floor of a 5 mm pocket.",
        },
        {
          id: "b",
          text: "Every `Z` depth is 6 mm shallower than intended, so the features are simply left undersize and can be recut.",
          correct: false,
          feedback:
            "Tempting, because it feels like the forgiving version of the error and it is the outcome people hope for. It breaks on the sign: the datum was set below the true surface, so the tool travels further down, not less far. The forgiving version is the other mistake.",
        },
        {
          id: "c",
          text: "Nothing, because the machine senses the surface with the cutter as it makes the first contact.",
          correct: false,
          feedback:
            "Tempting, because probing cycles genuinely can find surfaces, and modern machines feel intelligent. It breaks because ordinary cutting moves have no sensing at all: the control drives to the commanded coordinate and finds out about the material only through what breaks.",
        },
        {
          id: "d",
          text: "Only the first plunge is wrong; subsequent passes reference the cut surface and correct themselves.",
          correct: false,
          feedback:
            "Tempting, because roughing followed by finishing sounds like a self-correcting sequence. It breaks because every pass is measured from the same stored offset, not from the previous cut, so the error is repeated identically on every one.",
        },
      ],
      teaching:
        "A datum is a claim about the physical world, and the control accepts it without question. Setting `Z` from the workholding rather than the part is the classic version, and it always makes the machine cut deeper.",
      reviewSlug: "cad-to-finished-component",
    },
    {
      id: "xyz-q3",
      prompt:
        "A four-hole pattern is written in incremental mode. After hole 2 the operator stops the program, jogs the table 30 mm to change a broken drill, then restarts from the hole-3 line. What happens?",
      options: [
        {
          id: "a",
          text: "The hole-3 increment is measured from wherever the jog left the table, so holes 3 and 4 are both drilled 30 mm out of position.",
          correct: true,
          feedback:
            "Correct. An incremental move says how far to travel from the current position, and the jog changed that position. The error carries into hole 4 as well, because it too is measured from the hole before it.",
        },
        {
          id: "b",
          text: "The control remembers the position before the jog and returns there automatically before continuing.",
          correct: false,
          feedback:
            "Tempting, because controls do track absolute machine position at all times and it feels like they should use it. It breaks because the control has no way of knowing the jog was a detour rather than a deliberate reposition — it obeys the increment from where it stands.",
        },
        {
          id: "c",
          text: "Hole 3 is out of position but hole 4 is correct, because the following increment cancels the error.",
          correct: false,
          feedback:
            "Tempting, because errors sometimes do cancel when a path returns to a start point. It breaks because each increment adds to the last: a shift applied once is carried by every position downstream until an absolute coordinate restates where the tool should be.",
        },
        {
          id: "d",
          text: "The control alarms and refuses the restart, because incremental blocks cannot be re-entered mid-program.",
          correct: false,
          feedback:
            "Tempting, because it would be a sensible protection and controls do block some mid-program restarts. It breaks because an incremental line is perfectly valid on its own terms; the control has no way to tell that this particular starting point is the wrong one.",
        },
      ],
      teaching:
        "Absolute coordinates are self-describing and incremental ones are not. That difference is exactly why absolute is the default for cutting and incremental is reserved for repeated patterns and subprograms.",
    },
    {
      id: "xyz-q4",
      prompt: "Why does every tool need its own length offset, when they all fit the same spindle?",
      options: [
        {
          id: "a",
          text: "The control knows where the spindle nose is, not where the tool tip is. The offset is the measured distance between them, and it differs for every tool and holder assembly.",
          correct: true,
          feedback:
            "Correct. The machine only ever positions its own structure. The offset is the one piece of information that converts a spindle nose position into a cutting edge position, and it must be measured for each assembled tool.",
        },
        {
          id: "b",
          text: "Because tools of different diameters remove different amounts of material and the offset compensates for that.",
          correct: false,
          feedback:
            "Tempting, because diameter genuinely does need compensating for — but that is cutter radius compensation, a sideways offset in `X` and `Y`. Length offset works along `Z` and answers a different question entirely: how far down is the tip.",
        },
        {
          id: "c",
          text: "Because a program is written for one particular tool and must be rescaled when a different one is used.",
          correct: false,
          feedback:
            "Tempting, because programs do name specific tools and CAM assumes particular geometry. It breaks because nothing is rescaled: the coordinates stay exactly as written, and only the stored offset changes when the tool changes.",
        },
        {
          id: "d",
          text: "Because the work offset only holds `X` and `Y`, so the `Z` datum has to live in the tool length register instead.",
          correct: false,
          feedback:
            "Tempting, because these two numbers are added together in the same sum and beginners often see only the total. It breaks because a work offset carries `Z` as well: it says where the part surface is, while the tool length says where the tip is. Both are needed, and they change for different reasons.",
        },
      ],
      teaching:
        "The control positions its own structure and nothing else. Offsets are the measured facts that connect that structure to the tool tip and to the part, which is why they are set at the machine rather than written into the program.",
    },
    {
      id: "xyz-q5",
      prompt:
        "A single move travels 60 mm in `X` and 40 mm in `Y` at the same time, programmed at a feed of `600 mm/min`. What is the `X` axis actually doing?",
      options: [
        {
          id: "a",
          text: "Running at about `499 mm/min`, because the programmed feed is the speed along the 72.111 mm path and each axis takes its share of it.",
          correct: true,
          feedback:
            "Correct. The path length is sqrt(60^2 + 40^2) = 72.111 mm, so the X share is 600 x 60 / 72.111 = 499 mm/min and the Y share is 600 x 40 / 72.111 = 333 mm/min. Both are below the programmed number.",
        },
        {
          id: "b",
          text: "Running at `600 mm/min`, because that is the feed rate that was commanded.",
          correct: false,
          feedback:
            "Tempting, because the feed word looks like a direct instruction to the axes, and on a single-axis move it is exactly that. It breaks on a diagonal: with X at 600 and Y at the 400 it needs in order to arrive at the same moment, the tool tip would sweep along the path at about 721 mm/min — well above the feed you asked for, and a heavier load on the cutting edge.",
        },
        {
          id: "c",
          text: "Running at `360 mm/min`, because 60 mm of the total 100 mm of axis travel is in `X`.",
          correct: false,
          feedback:
            "Tempting, and the proportional thinking is right — but adding 60 and 40 to get 100 measures two sides of a triangle rather than its hypotenuse. The tool travels 72.111 mm, not 100 mm, so the share is 60/72.111 and not 60/100.",
        },
        {
          id: "d",
          text: "Running at `300 mm/min`, because the feed is shared out between the two axes that are moving.",
          correct: false,
          feedback:
            "Tempting, because sharing the feed is exactly the right instinct and halving is the obvious way to share it. It breaks because the share is proportional to how far each axis must travel, not equal: X has the longer journey at 60 mm against 40 mm, so it must run faster than Y, and 300 sits below both correct values.",
        },
      ],
      teaching:
        "Feed rate is a property of the path, not of an axis. The control continuously divides it between axes, which is the whole job of interpolation and the reason a diagonal move is not simply two moves at once.",
    },
    {
      id: "xyz-q6",
      prompt:
        "A machining centre has a cradle that tilts the table about the side-to-side direction, and mounted on that cradle a plate that rotates about its own vertical direction. What are those two rotary axes called?",
      options: [
        {
          id: "a",
          text: "`A` and `C`.",
          correct: true,
          feedback:
            "Correct. `A` is rotation about `X`, which is the side-to-side direction, and `C` is rotation about `Z`, which is vertical. Together with `X`, `Y` and `Z` this is the common five-axis trunnion arrangement.",
        },
        {
          id: "b",
          text: "`B` and `C`.",
          correct: false,
          feedback:
            "Tempting, because `B` and `C` is a genuinely common pairing — it is what you get when the head swivels about `Y` instead of the table tilting about `X`. It breaks here because the tilt described is about the side-to-side direction, which is `X`, and rotation about `X` is `A`.",
        },
        {
          id: "c",
          text: "`A` and `B`.",
          correct: false,
          feedback:
            "Tempting, because taking the first two letters looks like the natural pairing when a machine has exactly two rotary axes. It breaks because the letters are not a counting sequence: each is tied to a specific linear axis, and nothing here rotates about `Y`.",
        },
        {
          id: "d",
          text: "`U` and `W`.",
          correct: false,
          feedback:
            "Tempting if you have seen those letters on a machine, since they are real axis addresses. It breaks because they denote secondary linear axes running parallel to `X` and `Z`, such as a quill or a sub-slide — they are straight-line motions, not rotations.",
        },
      ],
      teaching:
        "Rotary axis letters map onto linear ones in alphabetical step: `A` about `X`, `B` about `Y`, `C` about `Z`. Reading a machine's axis list therefore tells you how the tool can be oriented, not just how far it can travel.",
    },
  ],
  exercise: {
    title: "Map one machine and one part, both ways",
    body: "Work this on paper; no machine is needed. The machine is a small vertical machining centre: the spindle points downwards and does not move sideways, the table slides side to side and in and out, and the spindle head moves up and down. The part is an aluminium plate 100 mm x 80 mm x 12 mm, clamped in a vice with 6 mm of its thickness standing proud of the jaws. Four 5.5 mm holes are wanted, at 20 mm and 80 mm along the plate and at 20 mm and 60 mm across it, measured from the bottom-left corner of the top face as you look down on it.",
    steps: [
      "Sketch the machine as you face it and draw the three axis arrows, labelling each `+X`, `+Y` and `+Z`. Beside every arrow write which physical part of this machine actually moves, then write one sentence confirming that your arrow shows the tool's motion relative to the plate rather than the table's own motion.",
      "Add three curved arrows for `A`, `B` and `C`, saying which linear axis each turns about, and name a plausible mechanism a machine would need in order to command each one.",
      "Choose the part datum. State exactly which physical faces set `X0`, `Y0` and `Z0`, and write one sentence per face describing how a setter would find it on the real part at the machine.",
      "Write the four hole positions as absolute coordinates from your datum, then rewrite the identical sequence as incremental moves starting from `X0 Y0`. Check the incremental version by adding the moves up: they must land on the absolute coordinate of the last hole.",
      "Suppose the program stops after hole 2, somebody jogs the table 30 mm to change a broken drill, and the program is restarted from the hole-3 line. Write down where the tool goes in each version and explain the difference in one sentence.",
      "Two tools are used: a spot drill whose tip sits `95.500 mm` below the spindle nose, and a 5.5 mm drill whose tip sits `132.000 mm` below it. The plate top has been measured at machine `Z-350.000`. Work out the machine `Z` the spindle nose must reach for each tool to place its tip exactly on the plate top, then state what happens if the drill is run with the spot drill's offset still active.",
      "The move from hole 1 to hole 3 is a diagonal. At a programmed feed of `600 mm/min`, work out the length of that move and the speed `X` and `Y` must each run at to hold the tool tip at the programmed feed.",
    ],
    selfCheck: [
      "Your `+X` arrow points to your right and your `+Y` arrow points away from you into the machine, even though on this machine it is the table that slides — and you have written that contradiction down explicitly rather than letting it slide past.",
      "`A`, `B` and `C` are shown turning about `X`, `Y` and `Z` respectively, each with a plausible mechanism named, such as a tilting trunnion for `A` or a rotary table for `C`.",
      "Your `Z0` is the top face of the plate — not the top of the vice jaws and not the table — and the method you name for finding it is a real physical one, such as touching off with a setter or a piece of paper.",
      "Your absolute list reads `X20. Y20.`, `X80. Y20.`, `X80. Y60.`, `X20. Y60.`; your incremental list contains at least one negative number and sums to the same finishing point. You have said that an absolute restart drives to a stated place while an incremental restart measures from wherever the jog left the tool, putting holes 3 and 4 out by 30 mm.",
      "You have `-254.500` for the spot drill and `-218.000` for the drill, and you have spotted that running the drill on the spot drill's offset drives its tip `36.5 mm` below the plate top instead of onto it.",
      "Your diagonal is `72.111 mm` long and your axis speeds are about `499 mm/min` in `X` and `333 mm/min` in `Y` — both below the programmed `600 mm/min`, because the feed belongs to the path and not to any one axis.",
    ],
  },
  summary: [
    "A position is three numbers measured from an agreed zero; `Z` runs along the spindle axis, `X` is the long table travel, and `Y` is what remains, with positive directions given by the right-hand rule.",
    "Axis direction is defined by the motion of the tool relative to the workpiece, so a `+X` command sends a moving table to the operator's left; likewise `+Z` points away from the work, which is why almost every cutting `Z` value is negative.",
    "Rotary axes follow the alphabet: `A` turns about `X`, `B` about `Y` and `C` about `Z`, and they orient the tool rather than position it.",
    "The machine coordinate system is fixed and found by homing; the work coordinate system is placed on the part by the setter, and a work offset stores where part zero sits in machine coordinates.",
    "Every tool needs a measured length offset because the control knows where the spindle nose is, never where the tool tip is — a 120.000 mm tool and a 95.500 mm tool put the nose 24.5 mm apart for the same programmed `Z0.`.",
    "Cutter radius compensation lets you program the finished edge and have the control hold the tool centre a stored radius to one side; it offsets by that number and never checks the tool.",
    "Absolute coordinates state where a point is and survive a restart; incremental coordinates state how far to go and carry any error forward, which is why absolute is the default for cutting.",
    "A control can only interpolate straight lines and circular arcs; every other shape is approximated by many short segments, and the programmed feed is the speed along that path, shared between the axes.",
  ],
  nextSlug: "how-a-ball-screw-moves-an-axis",
};
