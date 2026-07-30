import type { Lesson } from "../types";

export const whatIsACncMachine: Lesson = {
  slug: "what-is-a-cnc-machine",
  level: 1,
  title: "What is a CNC machine?",
  minutes: 18,
  intro:
    "By the end of this lesson you will know what the three letters in CNC stand for, what any CNC machine is built from, and what the common types are good at. You will also know the honest difference between a manual machine and a numerically controlled one, which is smaller than most people expect in one respect and far larger in another. Nothing here assumes you have ever stood next to a machine tool.",

  objectives: [
    "Explain what each letter of CNC stands for and what it means in practice",
    "Describe the real difference between manual and CNC machining without overstating it",
    "Name the five subsystems every CNC machine has and say what each one is for",
    "Recognise the common machine families and say what work each suits",
    "Tell a vertical machining centre from a horizontal one, and say why a shop would choose either",
    "Explain why the accuracy of a part comes from the machine rather than from the software",
  ],

  terms: [
    {
      term: "Computer numerical control (CNC)",
      plain:
        "Commanding a machine with stored numerical instructions run by a small dedicated computer, instead of with an operator's hands on handwheels.",
    },
    {
      term: "Numerical control (NC)",
      plain:
        "The older name for the same idea, from the era when the instructions arrived on punched paper tape and there was no computer on the machine.",
    },
    {
      term: "Machine tool",
      plain:
        "A powered machine that gives a solid workpiece its final shape by cutting material away from it.",
    },
    {
      term: "Axis",
      plain:
        "One controlled direction of movement on a machine, driven by its own motor and reported by its own feedback device.",
    },
    {
      term: "Spindle",
      plain:
        "The rotating shaft that holds and turns the cutting tool — or, on a lathe, that turns the workpiece.",
    },
    {
      term: "G-code",
      plain:
        "The plain-text language of numbered commands that a machine control actually executes, one line at a time.",
    },
    {
      term: "Machine control unit",
      plain:
        "The computer and drive electronics that read the program, plan the path and command each motor. Almost everyone just calls it the control.",
    },
    {
      term: "Guideway",
      plain:
        "The precision rail or surface that lets a moving part travel freely in one direction while being held rigidly in every other.",
    },
    {
      term: "Ball screw",
      plain:
        "A screw with hardened grooves and recirculating steel balls between screw and nut, used to turn motor rotation into smooth straight-line movement.",
    },
    {
      term: "Lead",
      plain:
        "The distance a screw's nut advances in one complete turn — the exchange rate between rotation and travel.",
    },
    {
      term: "Fixture",
      plain:
        "The purpose-made arrangement of clamps and locators that holds a workpiece in a known position while it is machined.",
    },
    {
      term: "Machining centre",
      plain:
        "A milling machine with an automatic tool changer, a magazine of tools and usually an enclosure, so it can run a whole sequence of operations without anyone opening the door.",
    },
  ],

  blocks: [
    { kind: "heading", text: "Three letters, and what each one means" },
    {
      kind: "prose",
      body: [
        "CNC stands for computer numerical control, and reading it backwards is the quickest way in. Control means something decides where a cutting tool goes and how fast it gets there. Numerical means those decisions are numbers — coordinates, distances, speeds — rather than the feel of a handle under someone's palm. Computer means a small dedicated computer reads the numbers and issues the orders.",
        "Notice that none of that mentions metal. Numerical control is a way of commanding a machine, and it has been fitted to mills, lathes, grinders, punch presses, water-jet cutters and surgical robots. Hold the distinction: CNC is the commanding, not the cutting.",
        "What is being commanded here is a machine tool — a powered machine that shapes a solid piece of material by cutting material away from it. That piece is called the workpiece, and it stays a workpiece until it becomes a finished component.",
      ],
    },
    {
      kind: "note",
      title: "Numerical control came first",
      body:
        "NC machines arrived in the 1950s and read their instructions from punched paper tape: no computer on board, and the tape was the program. When computers became small enough to sit on the machine, the C went on the front — but people still call a program 'the tape' and the start button 'cycle start'.",
    },

    { kind: "heading", text: "The same cutting, a very different commander" },
    {
      kind: "prose",
      body: [
        "Here is the honest version of the difference. Stand a manual milling machine beside a CNC machining centre, give both the same `10 mm` cutter and the same block of aluminium, and the physics at the cutting edge is identical: the same chip forms, the same forces push back on the tool, the same heat goes into the chip. Numerical control changes nothing where metal meets carbide.",
        "What changes is who gives the orders. On a manual machine an operator turns handwheels; each drives a screw, each screw moves a slide, and the operator watches a dial and decides when to stop. On a CNC machine those handwheels are motors, and a program tells the control where to go, how far each motor must turn and how fast.",
        "That one change is why the rest of this course exists. Once a machine will do exactly what it is told, everything depends on telling it the right thing — and on the machine being stiff and true enough to obey.",
      ],
    },
    {
      kind: "example",
      title: "The same slot, cut two ways",
      body: [
        "Say you need a straight slot `120 mm` long, `10 mm` wide and `5 mm` deep in an aluminium plate.",
        "Manually: clamp, find the edge, wind the table to the start counting turns on the dial, set the depth, engage the feed, watch, stop, wind back, repeat for a second pass. Perhaps twenty minutes, most of it positioning rather than cutting — and the second plate takes nearly as long as the first.",
        "On the CNC machine the clamping and edge finding still happen, but the movement is four lines of program. The first plate might take twenty-five minutes including writing and proving it; the second takes under a minute, and so does the two-hundredth. These figures are illustrative orders of magnitude, not specifications. CNC did not buy a faster cut — it bought doing the thinking once.",
      ],
    },
    {
      kind: "compare",
      title: "Manual machining and CNC machining compared",
      columns: ["Manual machine", "CNC machine"],
      rows: [
        {
          label: "Setup time for a new job",
          cells: [
            "Short: clamp, find the edge, start turning handles.",
            "Longer: clamp, find the edge, load and prove a program, measure and enter tool offsets.",
          ],
        },
        {
          label: "Repeatability part to part",
          cells: [
            "Rests on the operator's attention for every part.",
            "The same numbers run the same way, so variation comes from machine and setup.",
          ],
        },
        {
          label: "Part complexity",
          cells: [
            "Straight lines and simple circles.",
            "Any path the control can interpolate, including curved surfaces in three axes.",
          ],
        },
        {
          label: "Skill demanded at the machine",
          cells: [
            "High and continuous: the part is made in real time.",
            "High but different: setting, measuring, judging the cut, knowing when to stop.",
          ],
        },
        {
          label: "Cost per part, one-off",
          cells: [
            "Usually lower — nothing to program or prove.",
            "Usually higher — all preparation lands on one part.",
          ],
        },
        {
          label: "Cost per part, batch of 200",
          cells: [
            "High and flat: every part costs what the first did.",
            "Low: preparation is shared, then each part costs its cycle time.",
          ],
        },
      ],
    },

    { kind: "heading", text: "The five subsystems every CNC machine has" },
    {
      kind: "prose",
      body: [
        "Every CNC machine tool, from a desktop router to a forty-tonne machining centre, is built from the same five subsystems. Seeing them turns an intimidating steel box into five understandable problems.",
      ],
    },
    {
      kind: "figure",
      figure: "machine-anatomy",
      caption:
        "A vertical machining centre with its main parts named. Look for the closed chain of metal running from the cutting edge up through the spindle and head, down the column, along the base and back through the table to the workpiece — and for how much of the machine is not cutting at all.",
    },
    {
      kind: "prose",
      body: [
        "Structure is the metal holding tool and workpiece apart: base, bed, column, and the head carrying the spindle. It looks passive and it is not. Cutting pushes tool and workpiece apart with forces that are, as an order of magnitude, hundreds to thousands of newtons, and every part of that path flexes under load. The chain from cutting edge back round to the workpiece is the structural loop, and its stiffness quietly sets what the machine can do.",
        "Motion is everything producing controlled movement: guideways that let a slide travel one way while resisting every other, ball screws or linear motors pushing it along, the motors driving them, and the feedback devices reporting where it got to. One controlled direction of movement is an axis; a milling machine typically has three, named X, Y and Z.",
        "The spindle is the rotating shaft holding and turning the cutting tool. It must spin fast, hold the tool truly centred, resist being pushed sideways, and survive the heat it makes in its own bearings. On a lathe the spindle turns the workpiece instead, which is what makes a lathe a lathe.",
        "The control is the computer and drive electronics: it reads the program, plans the path, commands every motor, and runs the machine's internal logic — doors, coolant, tool changes, alarms. People call the whole cabinet 'the CNC', which is where much beginner confusion starts. It is one subsystem out of five.",
        "Auxiliary systems let a machine run a shift rather than a demonstration: coolant, lubrication, compressed air, chip removal, the tool changer, the enclosure and its doors. They absorb most maintenance time. A machine with a failed lubrication pump is a scrap machine with a very good control bolted to it.",
      ],
    },
    {
      kind: "deeper",
      title: "Optional depth: what the control does between reading a line and moving an axis",
      body: [
        "A line saying 'move in a straight line to X `100.0` Y `50.0` at `1273 mm/min`' is not something a motor can obey — motors take current, not coordinates. An interpreter establishes the geometry; an interpolator chops the path into tiny target positions, one per axis, issued together thousands of times per second. Each drive compares its target with where its feedback device says the axis really is and adjusts current to close the gap. Because the targets are issued in step, the axes arrive together and the motion is a straight line, not a staircase.",
        "The control also reads ahead. Planning moves in isolation would mean stopping dead at every corner, since changing direction instantly demands infinite acceleration. Instead it buffers upcoming moves and blends them within a tolerance you can set — which is why one program leaves slightly different corners on two different controls.",
        "One consequence matters from day one: the smallest movement a control can command is not the smallest movement the machine can make, and neither is accuracy.",
      ],
      formula: {
        expression: "Δ = P / C",
        variables: [
          {
            symbol: "Δ",
            meaning: "smallest movement the control can command along the axis",
            unit: "mm",
          },
          {
            symbol: "P",
            meaning: "lead of the screw — how far the nut advances in one full turn",
            unit: "mm",
          },
          {
            symbol: "C",
            meaning: "position feedback counts, or motor steps, per revolution",
            unit: "counts/rev",
          },
        ],
        meaning:
          "It gives the size of the steps the control thinks in. Finer steps do not make a machine more accurate: a finer ruler does not straighten a bent rail. An educational simplification — it ignores gearing, electronic interpolation of the feedback signal, screw error, backlash and everything thermal — and never a substitute for manufacturer data or measurement on the actual machine.",
      },
    },

    { kind: "heading", text: "One turn of a screw, one lead of travel" },
    {
      kind: "prose",
      body: [
        "The simplest idea in the course deserves its own section, because everything mechanical later is built on it. On most machines an axis is moved by a long screw: the motor turns the screw and a nut fixed to the moving part is driven along it. The distance the nut travels in one complete turn is the lead of the screw.",
        "A commanded distance therefore becomes motor revolutions by simple division. Longer move, more turns; coarser screw, fewer turns. That is the bridge between coordinates on a screen and things rotating in metal.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "N = L / P",
        variables: [
          { symbol: "N", meaning: "number of screw revolutions the move requires", unit: "rev" },
          { symbol: "L", meaning: "commanded distance of travel along the axis", unit: "mm" },
          { symbol: "P", meaning: "lead of the screw — travel per complete turn", unit: "mm" },
        ],
        meaning:
          "This is the whole translation from 'go here' to 'turn this much'. The lead tells you how many turns a move demands, which tells you what motor speed it needs and, later, how much torque. Educational relationship only: it assumes the motor is coupled straight to the screw, and ignores backlash, screw error and control compensation.",
      },
    },
    {
      kind: "example",
      title: "Sixty turns to cross the table",
      body: [
        "Take an X axis carrying a table, driven by a ball screw of lead `P = 10 mm`, so one full turn moves the table `10 mm`.",
        "Command the full travel of that axis, `L = 600 mm`. Then `N = L / P = 600 / 10 = 60` revolutions: sixty turns and the table has crossed the machine. Command a fine adjustment of `L = 0.5 mm` and `N = 0.05` revolutions, one twentieth of a turn, about `18` degrees. The same mechanism must be trustworthy at both ends of that range, which is a mechanical problem, not a software one.",
        "Run the axis at `30 m/min` — that is `30 000 mm/min`, or `0.5 m/s` in SI — and the motor must turn at `30 000 / 10 = 3000 rev/min`. Since one rev/min is 2π/60 rad/s, about `0.105 rad/s`, that is roughly `314 rad/s`. You will meet this axis again when you size its motor.",
      ],
    },
    {
      kind: "note",
      title: "Units on this course",
      body:
        "SI units are the default, and the millimetre used everywhere in machining is one thousandth of a metre. Shop units that are genuinely standard appear alongside — spindle speed in rev/min, cutting speed in m/min, feed in mm/min — always with the SI relationship stated, as above. Where a number is an estimate rather than a specification, it says so.",
    },

    { kind: "heading", text: "The family of machines" },
    {
      kind: "prose",
      body: [
        "'CNC machine' is a family name, not a machine, and the quickest way to sort the family is to ask what is spinning. If the tool spins while the workpiece is clamped still, you have a milling machine, a machining centre, a router or a grinder. If the workpiece spins while the tool is held still, you have a lathe.",
        "A milling machine cuts with a rotating multi-toothed tool while the workpiece is fed past it. Add an automatic tool changer, a magazine of tools and an enclosure and the same machine is called a machining centre: it can run a whole sequence of operations without anyone opening the door. A lathe rotates the workpiece and feeds a single-point tool along it, producing shapes round about one axis — shafts, bores, threads. Give it driven tools that spin and mill and it becomes a turning centre, finishing a part complete in one setup.",
        "A CNC router is built for large, light, flat work in wood, plastic and composite; it buys working area at the cost of stiffness, so heavy cuts in steel are not its job. A CNC grinder sits at the other extreme, removing very little material with an abrasive wheel for fine finish, hard materials and close size control.",
      ],
    },

    { kind: "heading", text: "Vertical or horizontal" },
    {
      kind: "prose",
      body: [
        "Machining centres come in two orientations, named after the way the spindle points. On a vertical machining centre, a VMC, the spindle axis is vertical and the tool points down at a table like a bench. It is cheaper, easier to set, easy to see into, and the natural choice for plates, panels and one face of a block.",
        "On a horizontal machining centre, an HMC, the spindle points sideways at work held on a vertical face or a rotating pallet. It costs more and hides the cut from view, but it wins twice: chips fall away under their own weight instead of piling into the pocket you are cutting, and a rotary pallet reaches several faces in one clamping — and every re-clamping is another chance to introduce error.",
        "Neither is better. A jobbing shop making a few of everything usually buys a VMC; a plant machining the same gearbox housing all day usually buys an HMC.",
      ],
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong: "Thinking the CNC is the computer, so a faster computer makes a better machine.",
          why: "The control issues commands; metal obeys them imperfectly. Processing power does nothing about a column that flexes under load or a screw with wear in it. Control and structure are two subsystems out of five, and the weakest one sets what you measure on the part.",
        },
        {
          wrong: "Assuming CNC is always faster and cheaper than manual machining.",
          why: "For one simple part, programming and proving can take longer than the whole manual job. CNC wins on repetition and on shapes nobody can wind by hand. For one bracket with two holes, a manual machine and a competent machinist is often quicker.",
        },
        {
          wrong: "Believing the machine knows where the workpiece is.",
          why: "It knows only what it was told. Nothing on a standard machine senses that you clamped the plate `3 mm` further left than last time. Somebody must relate machine coordinates to the actual part, and if that is wrong the machine cuts a perfect shape in precisely the wrong place.",
        },
        {
          wrong: "Reading a control resolution figure as an accuracy figure.",
          why: "A control commanding in steps of `0.001 mm` is telling you the size of the numbers it thinks in, not the error you will find on the part. Accuracy, repeatability and resolution are three separate quantities, and keeping them apart from day one saves much confusion later.",
        },
      ],
    },
    {
      kind: "safety",
      body:
        "A CNC machine does exactly what it is told, at full commanded speed, without hesitation and without looking. If a program sends the spindle through the vice, the machine drives it through the vice: it has no sense of what should be there, and a moving axis does not stop because a hand is in the way. That is why machine tools are built with fixed and interlocked guards, enclosures able to contain a tool that breaks up at speed, emergency stops, and controlled ways of moving with a door open — and why those systems are designed in from the start rather than added later. Standards including ISO 12100, ISO 13849-1, IEC 60204-1 and ISO 16090-1 exist to structure how hazards are identified and how machine tools and their control systems are made safe; consult the standards themselves for any actual requirement, because nothing written here substitutes for them. This course never asks you to work on live electrical, hydraulic or pneumatic systems: that work must be carried out and verified by qualified personnel under the law and standards applying where you are.",
    },

    { kind: "heading", text: "Who does what, and why the roles exist" },
    {
      kind: "prose",
      body: [
        "In a small workshop one person does all of this. In a large one it is four jobs, because each stage demands a different kind of attention.",
        "The designer decides what the part must be — shape, dimensions, tolerances, material, finish — working in CAD, computer-aided design. Tolerances tighter than the function needs are paid for by everyone downstream.",
        "The programmer decides how it will be made: which tools, in what order, along what paths, at what speeds. They work in CAM, computer-aided manufacturing, which generates toolpaths from the model and converts them into G-code.",
        "The setter prepares the machine: fits the fixture, loads and measures the tools, tells the control where the workpiece sits, then proves the program cautiously. Much of what separates a good part from a scrapped one happens here.",
        "The operator runs the job: loads, watches, listens, measures, adjusts offsets as tools wear, and decides when something is wrong. On a machine willing to make two hundred identical wrong parts, the person who notices at part three is the most valuable in the building.",
      ],
    },

    { kind: "heading", text: "Where accuracy actually comes from" },
    {
      kind: "prose",
      body: [
        "This is the most important paragraph in the lesson, so it is put plainly. The accuracy of a machined part comes from the machine's geometry, stiffness and thermal behaviour, and from the setup. It does not come from the software.",
        "A control can command a position far finer than the machine can deliver; typing more decimal places costs nothing and changes nothing. What decides whether a surface is flat is whether the guideways are straight, whether the axes are square to one another, whether the structure deflects under load, whether the machine has warmed since the first part of the morning, and whether the workpiece is truly where the control believes it is.",
        "Software helps in one way: it compensates for errors that have been measured and are repeatable and stable. A screw consistently short over its travel can be corrected in a compensation table; a machine that behaves differently depending on how warm it is cannot be fixed by typing. Compensation uses a measurement — it never substitutes for a sound machine.",
        "Every mechanical chapter that follows exists because accuracy is physical. Now take a machine apart at your own pace: the Machine Explorer below opens a vertical machining centre, and any part you click gives a plain explanation, the engineering behind it, the parameters a designer chooses and how it fails in service. Find all five subsystems before moving on.",
      ],
    },
    { kind: "widget", widget: "explorer-teaser" },
  ],

  knowledgeCheck: [
    {
      id: "cnc-what-decides",
      prompt: "A colleague says 'the CNC decides how to cut the part'. What is wrong with that sentence?",
      options: [
        {
          id: "a",
          text: "Nothing — working out how to cut the part is exactly what a CNC control does.",
          correct: false,
          feedback:
            "Tempting, because the control is the part of the machine that looks like it is thinking, and it is where the program lives. But it executes decisions rather than making them: tools, order, depths and paths were chosen by a person long before the control saw them.",
        },
        {
          id: "b",
          text: "The control executes a program; the decisions about tools, order and paths were made by people beforehand.",
          correct: true,
          feedback:
            "Right, and it is worth being precise about why. The control interprets, interpolates and drives. Every choice it appears to make was made upstream by a designer, a programmer and a setter — which is also why a machine will cheerfully execute a bad decision at full speed.",
        },
        {
          id: "c",
          text: "Only lathes need telling how to cut; milling machines work it out from the 3D model.",
          correct: false,
          feedback:
            "Plausible, because CAM software really does generate milling paths from a 3D model, which feels automatic. But that happens on a desktop computer under a programmer's control. A standard machine tool never sees the model — it receives a finished path either way.",
        },
      ],
      teaching:
        "CNC is a way of commanding a machine. Everything the machine does was decided by a person and expressed as numbers; the control's job is faithful execution, not judgement.",
    },
    {
      id: "cnc-one-off-cost",
      prompt:
        "A shop needs one aluminium bracket today, with two holes and one milled edge. Why might the manual mill be the cheaper choice than the machining centre next to it?",
      options: [
        {
          id: "a",
          text: "Because manual machines cut aluminium faster than CNC machines do.",
          correct: false,
          feedback:
            "Tempting because manual work feels immediate, with no waiting about. But the cut itself is the same event on either machine — same cutter, same speed, same chip. Numerical control does not slow metal removal down, so this cannot be the reason.",
        },
        {
          id: "b",
          text: "Because the programming and proving time is charged to a single part, with no second part to share it with.",
          correct: true,
          feedback:
            "Exactly. CNC converts a per-part cost into a per-job preparation cost. With a batch of one, that preparation has nowhere to spread, so all of it lands on the only part you are making.",
        },
        {
          id: "c",
          text: "Because CNC machines cannot hold tolerances as tight as a skilled manual machinist can.",
          correct: false,
          feedback:
            "This gets the trade-off backwards, and it tempts because a skilled machinist genuinely can work to fine tolerances by measurement and feel. But repeating a position exactly is where numerical control is strongest. The reason to pick manual here is economics, not capability.",
        },
        {
          id: "d",
          text: "Because a CNC machine needs a CAD model and a manual machine does not.",
          correct: false,
          feedback:
            "Half true and still the wrong reason. Simple programs are often typed straight into the control with no CAD model anywhere. The dominant cost for one part is the time spent preparing and proving the job, not whether a model exists.",
        },
      ],
      teaching:
        "CNC pays for itself through repetition and through complexity nobody can produce by hand. For a one-off simple part the preparation cost dominates, which is why well-equipped shops still keep manual machines.",
      reviewSlug: "cad-to-finished-component",
    },
    {
      id: "cnc-subsystem-sort",
      prompt:
        "A machine's guideway lubrication pump has failed. Which subsystem has failed, and why should the other four care?",
      options: [
        {
          id: "a",
          text: "Motion — the pump is what makes the axes move.",
          correct: false,
          feedback:
            "Tempting because the pump serves the moving parts, and its failure will eventually show up as an axis problem. But the pump produces no motion; motors, screws and guideways do. Sorting parts by what they do, not by what they sit next to, is what makes the five-subsystem map useful.",
        },
        {
          id: "b",
          text: "Auxiliary — it supports the machine, and starved guideways wear, destroying the geometry that structure and motion were bought to provide.",
          correct: true,
          feedback:
            "Correct, and the second half is the real point. Auxiliary systems look optional right up until their neglect quietly ruins the accuracy that expensive structural and motion components were specified to deliver.",
        },
        {
          id: "c",
          text: "Control — the pump is switched by the machine's internal logic, so it belongs to the control.",
          correct: false,
          feedback:
            "True that the control switches the pump and will probably raise the alarm about it. But the control switches almost everything, so classifying by what commands a part would sweep the whole machine into one subsystem and tell you nothing.",
        },
      ],
      teaching:
        "Classify subsystems by function, not by proximity or by what switches them. Auxiliary systems absorb most maintenance effort, and their failures surface as accuracy problems somewhere else entirely.",
    },
    {
      id: "cnc-lead-turns",
      prompt:
        "An axis is driven by a screw of lead `10 mm`, with the motor coupled directly to it. The control is asked to move `600 mm`. How many revolutions must the screw turn?",
      options: [
        {
          id: "a",
          text: "6 revolutions",
          correct: false,
          feedback:
            "This comes from dividing by 100 instead of 10, or a slipped decimal point. Worth catching now: six turns would move this table only `60 mm`, a tenth of what was asked, which on a real machine is the difference between a part and a collision.",
        },
        {
          id: "b",
          text: "60 revolutions",
          correct: true,
          feedback:
            "Right: `N = L / P = 600 / 10 = 60`. One turn buys exactly one lead of travel, so the number of turns is the distance divided by the lead.",
        },
        {
          id: "c",
          text: "600 revolutions",
          correct: false,
          feedback:
            "Tempting if you assume one revolution equals one millimetre, perhaps because millimetres are the unit on the screen. The lead is a physical property of the screw and must be looked up, not inferred from the units the coordinates happen to use.",
        },
        {
          id: "d",
          text: "It cannot be worked out without knowing the motor speed.",
          correct: false,
          feedback:
            "Motor speed is a real and necessary quantity, but it answers a different question — how long the move takes, not how far it goes. Distance per turn is fixed by the screw's geometry however fast you turn it.",
        },
      ],
      teaching:
        "Lead is the bridge between rotation and translation: one turn of the screw advances the nut by exactly one lead. Every feed-drive calculation in this course starts from that fact.",
      reviewSlug: "how-a-ball-screw-moves-an-axis",
    },
    {
      id: "cnc-resolution-vs-accuracy",
      prompt:
        "A machine's specification sheet quotes a control resolution of `0.001 mm`. A batch of parts measures about `0.04 mm` out of position. Which statement is sound?",
      options: [
        {
          id: "a",
          text: "The parts should be within `0.001 mm`, so the control must be faulty.",
          correct: false,
          feedback:
            "This is the most common misreading in the industry, which is why it is better made here than in front of a customer. Resolution is the size of the increments the control thinks in; it says nothing about whether the machine physically arrives where it was told.",
        },
        {
          id: "b",
          text: "Resolution describes command granularity only; the error could come from geometry, deflection, thermal growth or the setup.",
          correct: true,
          feedback:
            "Correct — and notice how many candidate causes are still standing. Narrowing them down is a measurement problem rather than an argument, which is what the accuracy and metrology level is for.",
        },
        {
          id: "c",
          text: "Quoting resolution on a specification sheet is meaningless, so the figure tells you nothing.",
          correct: false,
          feedback:
            "An understandable reaction to a constantly misused figure, but it overcorrects. Resolution is a genuine specification: it bounds how finely a position can be commanded. The error is reading it as accuracy, not the figure existing.",
        },
      ],
      teaching:
        "Resolution, repeatability and accuracy are three separate quantities. Accuracy is delivered by the physical machine and its setup; software can only compensate for errors that are measured, repeatable and stable.",
      reviewSlug: "accuracy-repeatability-resolution",
    },
  ],

  exercise: {
    title: "Take a machine apart on paper",
    body:
      "You do not need access to a machine. Find a photograph, a manufacturer's brochure or a factory walkthrough video of a vertical machining centre, and work alongside the Machine Explorer on this site. The aim is to stop seeing 'a machine' and start seeing five subsystems, because every remaining level of this course lives inside one of them.",
    steps: [
      "Write the five subsystem names down the left of a page: structure, motion, spindle, control, auxiliary.",
      "From your picture, list at least twelve parts you can see or that are clearly implied — table, column, spindle head, doors, coolant nozzle, control panel, chip conveyor, way covers (the concertina covers keeping chips off the guideways).",
      "Assign every part to exactly one subsystem. Where you are unsure, write the question down instead of guessing: 'way covers protect the guideways, so are they motion or auxiliary?' is more useful than a confident wrong tick.",
      "For each subsystem, write one sentence on what would happen to the finished part if it degraded — a softer structure, a worn screw, a hotter spindle, a control blending corners loosely, a starved lubricator.",
      "Open the Machine Explorer and check your assignments. Note every part you placed differently and read why it sits where it does.",
      "Decide whether your machine is vertical or horizontal, and write two sentences on the work it suits and why its orientation helps.",
      "Trace the structural loop with a finger: cutting edge, spindle, head, column, base, table, workpiece, back to the cutting edge. Count the joints it crosses.",
    ],
    selfCheck: [
      "Your list has parts in all five subsystems, not just structure and spindle. An empty auxiliary row means you have not looked at the back of the machine or at the floor.",
      "Each consequence sentence names an effect on the part or the process — 'the surface finish gets worse', rather than 'the spindle gets hot'.",
      "You can point out the structural loop and say roughly how many joints it passes through, because every joint is somewhere it can flex.",
      "At least one honest uncertainty is written down. Parts sitting awkwardly between subsystems are usually the interesting ones.",
      "Your vertical-or-horizontal judgement rests on which way the spindle points, not on the machine's overall shape.",
      "You could explain what each subsystem is for, in one sentence each, without reading from the page.",
    ],
  },

  summary: [
    "CNC means computer numerical control: commanding a machine with numbers rather than hands, applied here to machine tools.",
    "The cutting physics is identical on manual and CNC machines; what changes is who gives the orders and how exactly they repeat.",
    "Every CNC machine tool has five subsystems — structure, motion, spindle, control, auxiliary — and the weakest one sets the result.",
    "Mills, machining centres, routers and grinders spin the tool; lathes spin the workpiece. That one question sorts the family.",
    "A VMC is cheaper and easier to set; an HMC sheds chips and reaches several faces of a part in one clamping.",
    "One turn of a screw moves an axis by one lead, so `N = L / P` turns any commanded distance into motor revolutions.",
    "Designer, programmer, setter and operator exist as separate roles because deciding what, deciding how, preparing and watching need different attention.",
    "Accuracy comes from geometry, stiffness, thermal behaviour and setup; software compensates for measured, repeatable errors but never replaces a sound machine.",
  ],

  nextSlug: "cad-to-finished-component",
};
