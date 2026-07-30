import type { Lesson } from "../types";

export const introToMachineArchitecture: Lesson = {
  slug: "intro-to-machine-architecture",
  level: 4,
  title: "Introduction to machine architecture",
  minutes: 24,
  intro:
    "A CNC machine is a structure that holds a spinning tool and a clamped workpiece a precise distance apart while the cut tries very hard to push them apart. This lesson is about that structure: the closed loop of parts that carries cutting force, why its length and stiffness decide what the machine can do, and how the common layouts trade access against rigidity. By the end you will look at a machine and see a load path rather than a lump of grey metal.",

  objectives: [
    "Trace the structural loop of a machine from the cutting edge back to the cutting edge, naming every part and joint it passes through",
    "Define static stiffness as force per unit deflection at the tool point, and explain why compliances add so the softest link decides the total",
    "Explain why overhang costs more than material choice, using the cantilever deflection relationship",
    "Distinguish damping from stiffness and say what each one actually protects you from",
    "Compare grey cast iron, welded steel, polymer concrete and granite honestly on stiffness, damping, thermal behaviour, cost and manufacture",
    "Judge the moving-table against the moving-gantry trade, and state what chip and coolant management demands of a structure before it is drawn",
  ],

  terms: [
    {
      term: "Structural loop",
      plain:
        "The closed path that cutting force travels: out of the cutting edge, through the workpiece and everything holding it, through the whole machine, and back into the tool.",
    },
    {
      term: "Compliance",
      plain:
        "How far something moves when you push it. It is the opposite of stiffness, and it is the useful word when you are adding up a chain of parts.",
    },
    {
      term: "Static stiffness",
      plain:
        "How hard you have to push at the tool point to move it a given distance, with a steady force rather than a vibrating one.",
    },
    {
      term: "Damping",
      plain:
        "A structure's ability to turn vibration into heat and so stop ringing quickly after it has been disturbed.",
    },
    {
      term: "Overhang",
      plain:
        "How far a part sticks out beyond whatever supports it — a tool out of its holder, a spindle head forward of its column.",
    },
    {
      term: "Rib",
      plain:
        "A thin internal wall cast or welded inside a hollow structure to stop its outer walls flexing, like the corrugations in cardboard.",
    },
    {
      term: "Grey cast iron",
      plain:
        "The traditional machine frame material: iron poured into a sand mould, containing flakes of graphite that make it damp vibration well.",
    },
    {
      term: "Polymer concrete",
      plain:
        "Crushed stone bound with resin and cast to shape at room temperature, also called mineral casting. Less rigid than iron, far better at absorbing vibration.",
    },
    {
      term: "C-frame",
      plain:
        "A layout shaped like the letter C seen from the side: a base, one column behind, and a head reaching forward over the work.",
    },
    {
      term: "Gantry",
      plain:
        "A beam carried on two legs that straddles the work, with the cutting head riding along the beam.",
    },
    {
      term: "Thermal drift",
      plain:
        "The slow change in a machine's geometry as parts of it warm up and grow, so a machine that was accurate this morning is not this afternoon.",
    },
    {
      term: "Finite element analysis (FEA)",
      plain:
        "Software that chops a structure into thousands of small pieces and calculates how the whole thing bends under a load you specify.",
    },
  ],

  blocks: [
    { kind: "heading", text: "The structure is the machine" },
    {
      kind: "prose",
      body: [
        "Look at a photograph of a machining centre and the eye reads a box with a spinning bit inside. But nothing in that box is packaging. Every casting, rib, machined face and bolt exists for one job: to hold the tool and the workpiece in a fixed relationship while the cut tries to shove them apart. Get that wrong and no amount of servo tuning or clever programming rescues the part.",
        "Hold a pen a hand's width above a sheet of paper and draw a straight line freehand. Now rest the heel of your hand on the desk and draw it again. Nothing about the pen changed; what changed is the path the force takes back to the paper — through your whole arm, or through the heel of your hand and `50 mm` of desk.",
        "That path is the structural loop. It runs from the cutting edge into the workpiece, through the workholding, into the table, through the saddle, down into the bed, up the column, along the spindle head, through the spindle bearings, into the tool holder and back to the cutting edge. It is closed because force cannot go anywhere else.",
        "The word to attach to it is compliance: how far something moves when you push it. Compliance is the reciprocal of stiffness, and it is the more useful word here because compliances add along the loop. Ten good links and one sloppy one give you a sloppy loop.",
      ],
    },
    {
      kind: "figure",
      figure: "architectures",
      caption:
        "The common machine layouts drawn from the same viewpoint, with the structural loop traced through each. Follow the loop rather than the outline: count how many separate parts and joints the force must pass through, and notice where the loop is long, asymmetric or cantilevered out over the work.",
    },
    {
      kind: "prose",
      body: [
        "Three properties of the loop matter, in this order. Short, because every extra millimetre is more material to bend. Stiff, meaning the sections and, far more importantly, the joints between them. Symmetric, because a loop that is the same on both sides bends and grows evenly, and evenly is much easier to predict and compensate than lopsidedly.",
        "Watching the loop change as an axis moves is the quickest way to understand a machine. Drive a C-frame mill's head to the top of its column and the loop lengthens and the machine softens. Run a gantry to the end of its rails and you change which part of the beam is loaded. A specification sheet gives one number; the loop tells you where it came from and where it stops being true.",
        "This is why a machine is judged at the tool point and nowhere else. It does not matter how rigid the column is if the spindle nose moves. Put a finger where the cut happens, then trace backwards until it comes home.",
      ],
    },
    {
      kind: "deeper",
      title: "How compliances add up, and why the softest link decides",
      body: [
        "Every link in the loop carries the same force — that is what being in series means — and each moves a little under it. The movements add, so the compliances add.",
        "Say three links matter, at `200`, `150` and `25 N/µm`. Adding compliances gives `1/200 + 1/150 + 1/25 = 0.0517 µm/N`, so the total is about `19.4 N/µm` — lower than any single link, including the softest.",
        "Now spend money. Double the stiffest link to `400 N/µm` and the total creeps up to about `20.3 N/µm`. Double the softest to `50 N/µm` instead and it jumps to about `31.6 N/µm`. Same effort, wildly different return — which is the whole argument for finding the softest link first.",
        "These are illustrative figures, not measurements from a real machine. Real link stiffnesses come from static load testing and analysis, and decisions taken on them need professional engineering validation.",
      ],
      formula: {
        expression: "1 / k_total = 1/k₁ + 1/k₂ + 1/k₃ + …",
        variables: [
          {
            symbol: "k_total",
            meaning: "stiffness of the whole loop, measured at the tool point",
            unit: "N/µm",
          },
          {
            symbol: "k₁, k₂, k₃ …",
            meaning: "stiffness of each individual link — a casting, a joint, a bearing, the tool",
            unit: "N/µm",
          },
        ],
        meaning:
          "Because compliances add rather than stiffnesses, the total is always lower than the worst single link. Improving anything but the softest link buys almost nothing, so find that link first.",
      },
    },

    { kind: "heading", text: "Static stiffness, and where the give hides" },
    {
      kind: "prose",
      body: [
        "Static stiffness is force per unit deflection measured at the tool point. Push the spindle nose sideways with a known force, measure how far it moved, and divide: `k = F / δ`. Static means the force is steady rather than vibrating — a real cut is not, which is why dynamic stiffness and chatter get a level of their own later.",
        "The definition forces you to measure in the right place and direction. Stiffness is never one number for a machine: a vertical machining centre is usually stiffest straight down, where the load path is short and well supported, and softest wherever a head cantilevers forward. It changes with position too — a gantry at mid-span is not the same machine as a gantry at the end of its beam.",
        "So where does the compliance live? Almost never in the big castings. A properly ribbed bed or column deflects strikingly little under cutting force. The give is in the joints — bolted interfaces where two machined faces meet, rail mounting faces, bearing seats, the spindle taper, the grip on the tool — and in the overhangs, wherever something sticks out.",
      ],
    },
    {
      kind: "example",
      title: "Reading a stiffness figure",
      body: [
        "A static load test is what it sounds like. Clamp an indicator so it reads movement at the spindle nose, press a known force sideways against the nose, and record how far it moves.",
        "Say a steady `1000 N` moves the nose `25 µm`. The stiffness in that direction, at that position, is `k = 1000 / 25 = 40 N/µm`, which in base SI units is `4 × 10⁷ N/m`.",
        "That is immediately useful. A cut generating about `800 N` of side force pushes the tool point roughly `800 / 40 = 20 µm` off the commanded path for as long as it lasts. The part comes out that much wrong, and accurate positioning cannot fix it, because the axis is exactly where it was told to be.",
        "Treat `40 N/µm` as an illustrative order of magnitude to make the arithmetic concrete, not a specification for any class of machine. It is also one direction at one position: repeat it in `X`, `Y` and `Z`, top and bottom of travel, and the same machine gives several answers.",
      ],
    },
    {
      kind: "note",
      title: "Stiffness units, and the SI relationship",
      body:
        "Stiffness is force divided by deflection, so its SI unit is newtons per metre (`N/m`). Machine-tool work almost always uses newtons per micrometre (`N/µm`), because tool-point deflections are micrometres rather than metres: `1 N/µm = 1 000 000 N/m`. Compliance is simply the reciprocal, `µm/N`, and it is the more convenient form whenever you are adding up a chain of links.",
    },
    {
      kind: "formula",
      formula: {
        expression: "δ = (F × L³) / (3 × E × I)",
        variables: [
          { symbol: "δ", meaning: "deflection at the free, loaded end", unit: "m" },
          { symbol: "F", meaning: "point load applied at the free end", unit: "N" },
          {
            symbol: "L",
            meaning: "length from the fixed support to the load — in other words, the overhang",
            unit: "m",
          },
          {
            symbol: "E",
            meaning: "elastic modulus of the material, also called Young's modulus",
            unit: "Pa (N/m²)",
          },
          {
            symbol: "I",
            meaning: "second moment of area of the cross-section about the bending axis",
            unit: "m⁴",
          },
        ],
        meaning:
          "Deflection rises with the cube of overhang, which makes length the most expensive dimension in a machine. Halve the stick-out of a tool or a spindle head and deflection falls to one eighth; double the material's stiffness and it only halves. This is an illustrative beam model showing why overhang dominates, not a design calculation — a machine is not a uniform cantilever and its supposedly fixed end is a joint that gives way too, so real sizing needs proper analysis and professional engineering validation.",
      },
    },
    {
      kind: "prose",
      body: [
        "That cube is the most useful fact in this lesson. A cutter sticking `60 mm` out of its holder deflects about eight times as far as the same cutter at `30 mm`. A head reaching `300 mm` in front of its column is a different machine from one reaching `150 mm`. Shortening a reach is free at the design stage and worth a factor of eight; changing to a material twice as stiff is expensive and worth a factor of two.",
        "Joints are the other hiding place, and they are less obvious because they look solid. Two machined iron faces bolted together are not one piece of iron: they touch only on their high spots, so the interface behaves as a comparatively soft, slightly non-linear spring that stiffens as you clamp it harder. That is why bolt size and spacing, the flatness of the mating faces, and dowels to carry shear all belong in a stiffness discussion.",
        "So removing joints beats adding material around them. Every interface you delete — casting two parts as one, mounting a rail straight onto a machined face rather than a bolted-on plate, replacing a slotted mounting with a dowelled one — takes a spring out of the chain permanently.",
      ],
    },

    { kind: "heading", text: "Damping is not stiffness" },
    {
      kind: "prose",
      body: [
        "Stiffness says how far a structure moves while you push it. Damping says how quickly it stops moving once you let go. They are separate properties, and a structure can have plenty of one and very little of the other.",
        "Strike a tuning fork and it rings: stiff, barely damped. Press modelling clay and it squashes silently: soft, heavily damped. A welded steel frame sits closer to the tuning fork than most designers would like, because steel converts very little vibration into heat — energy from the cut sloshes round the structure and comes back out as a pattern on your part.",
        "This is much of why grey cast iron survived into the twenty-first century. Its graphite flakes rub against the iron around them as the casting flexes, turning vibration into heat; those same flakes are why its modulus is lower than steel's. You are trading stiffness for damping inside the material. Polymer concrete goes further — much lower modulus, much higher damping — which is why it appears in grinding machines and precision platforms.",
        "Damping also comes from joints and from deliberate treatments: friction in a bolted interface, sand filling a hollow section, tuned mass dampers inside long boring bars. It is designed in rather than hoped for, and a machine can be perfectly rigid and still cut badly.",
      ],
    },

    { kind: "heading", text: "What the frame is made of" },
    {
      kind: "compare",
      title: "Machine structure materials compared",
      columns: [
        "Stiffness (elastic modulus)",
        "Damping",
        "Thermal behaviour",
        "Cost and lead time",
        "Shape freedom and manufacture",
      ],
      rows: [
        {
          label: "Grey cast iron",
          cells: [
            "Moderate: broadly `100–130 GPa`, about half that of steel. Take the figure for a grade from its data sheet.",
            "Good. The graphite flakes that lower its modulus also rub internally and turn vibration into heat.",
            "Predictable; expansion similar to steel, in the order of `10–12 µm` per metre per kelvin.",
            "High pattern and tooling cost, so it pays only across a production run. Long foundry lead times.",
            "Excellent once the pattern exists: curved walls, internal ribs and cored coolant passages come free.",
          ],
        },
        {
          label: "Welded and stress-relieved steel",
          cells: [
            "Highest of the four, around `200–210 GPa`, so a given section resists bending best.",
            "Poor as a material. A weldment leans on joint friction and added damping treatments instead.",
            "Expansion similar to cast iron. Welding leaves residual stress that must be relieved or the frame keeps moving.",
            "Low tooling cost, short lead time — the natural choice for one-offs and prototypes.",
            "Plate and tube only, so shapes stay prismatic. Every rib is another weld, and distortion must be machined out.",
          ],
        },
        {
          label: "Polymer (mineral) concrete",
          cells: [
            "Low: broadly `30–45 GPa`, so sections must be far bulkier for the same rigidity.",
            "Very high, and its main selling point. Vibration dies away quickly in the resin-bound aggregate.",
            "Low conductivity, so it responds slowly to swings. Expansion broadly comparable to cast iron, varying with the mix.",
            "Modest mould cost, cure measured in days, and cheap raw material.",
            "Cast to shape cold, so rails and inserts can be cast in place — but it cannot be welded or easily reworked.",
          ],
        },
        {
          label: "Granite",
          cells: [
            "Moderate: roughly `40–70 GPa` depending on the stone, and brittle in tension.",
            "Good, though generally below polymer concrete.",
            "Very stable: low expansion, in the order of half that of steel, and it neither corrodes nor ages.",
            "Cheap stone, expensive sawing and lapping. Long lead times for large pieces.",
            "Very limited: cut and lapped from a block. Holes and pockets are slow, and nothing can be welded on.",
          ],
        },
      ],
    },
    {
      kind: "prose",
      body: [
        "No material wins. Steel is the stiffest and cheapest to prototype in, and also the worst damped and the most likely to move after welding unless properly stress relieved — heated, soaked and cooled slowly so the stresses locked in by welding are released before the machining that sets the geometry. Cast iron is the historic default because it balances everything and a pattern lets you put material exactly where the ribs need it, but that pattern only pays across a batch.",
        "Real machines mix them: an iron base filled with polymer concrete, a steel weldment carrying a granite table, a mineral casting with steel inserts moulded in. Read every material figure above as an approximate range for orientation only — the number that matters is on the supplier's data sheet for the exact grade.",
      ],
    },

    { kind: "heading", text: "The common layouts" },
    {
      kind: "prose",
      body: [
        "These names are used loosely in industry and overlap freely — one builder's portal is another's gantry. Learn what each arrangement does to the loop and the naming sorts itself out.",
        "A C-frame is the shape of a bench drill seen from the side: a base, one column at the back, and a head reaching forward over the work. The letter C is the loop. It is wide open at the front and both sides, which is wonderful for loading work and unhelpful for stiffness, because the head is a cantilever and the column twists every time the tool cuts sideways.",
        "Add a second column and you get a bridge: two legs and a beam, with the spindle riding along it. If the bridge is bolted down and the work travels underneath on a table, that is a fixed-bridge, moving-table machine — the commonest small machining centre arrangement there is. If the work stays put and the whole bridge travels on long rails, that is a moving gantry, the standard answer for routers and large flat work.",
        "Box-in-box nests one frame inside another, each axis supported on both sides instead of cantilevered off one, so the loop stays short and central and the drive can push a mass through its centre of gravity rather than dragging it from one edge — which is what makes very high accelerations behave. Portal or double-column machines are the heavy end: two columns, a deep crossbeam and a head on the beam, for workpieces measured in tonnes.",
      ],
    },
    {
      kind: "compare",
      title: "Machine layouts compared",
      columns: ["What the loop looks like", "Good at", "Struggles with", "Where you see it"],
      rows: [
        {
          label: "C-frame",
          cells: [
            "Open on three sides: out along a cantilevered head and back down one column, so it is long and asymmetric.",
            "Access from the front and both sides, which suits loading, setting and manual work.",
            "The head deflects under side load and the column twists; asymmetry also makes thermal drift harder to predict.",
            "Knee mills, bench mills, drilling machines, many small vertical machining centres.",
          ],
        },
        {
          label: "Fixed bridge, moving table",
          cells: [
            "Short and closed: two legs, a beam, and the work travelling underneath, so the tool stays near its supports.",
            "Stiffness and accuracy for the money, with a heavy structure that never has to accelerate.",
            "Floor space — the bed runs to two or three times the travel — and moving mass that grows with every workpiece.",
            "Most small and medium vertical machining centres, precision grinders, coordinate measuring machines.",
          ],
        },
        {
          label: "Moving gantry",
          cells: [
            "Bridge-shaped, but the bridge itself rides two long rails, which adds joints and a twisting mode.",
            "Large envelopes without a large building; the workpiece stays still, so its mass costs the drives nothing.",
            "Racking if the two sides are not driven and measured together, and a moving structure that must be light yet stiff.",
            "Routers, plate and sheet cutting, large-part machining, gantry mills.",
          ],
        },
        {
          label: "Box-in-box",
          cells: [
            "Nested frames, each axis supported symmetrically inside the one below, so the loop stays short and central.",
            "High acceleration with low deflection, because the drive can push through the centre of mass.",
            "Manufacturing cost and complexity, and a smaller work envelope for a given footprint.",
            "High-speed and precision machining centres, laser and micro-machining platforms.",
          ],
        },
        {
          label: "Portal / double column",
          cells: [
            "Two columns and a heavy crossbeam, with the head on the beam; load splits between two symmetric paths.",
            "Very large and heavy workpieces, with symmetry that helps stiffness and thermal behaviour alike.",
            "Sheer size, cost, foundation requirements and beam sag over long spans.",
            "Large portal mills, die and mould machining, aerospace structural parts.",
          ],
        },
      ],
    },
    {
      kind: "prose",
      body: [
        "The choice between a moving table and a moving gantry is a mass-against-envelope trade, and it is one of the earliest decisions in a design because everything downstream depends on it.",
        "Move the table and the workpiece joins the moving mass. A `50 kg` casting must be accelerated and stopped on every move, so the drives and structure have to be sized for the heaviest part the machine will ever hold, and the bed ends up two to three times the travel long once the table's own length is counted. In exchange you get a short, closed, symmetric loop in which the heavy structure never moves.",
        "Move the gantry instead and the workpiece never accelerates, so a `5 m` sheet costs the drives nothing and the footprint is barely larger than the envelope. The price is a moving structure that must be light and stiff at once, two long rails that must stay parallel, and a racking mode: if one leg leads the other the gantry skews and the tool goes somewhere you did not ask for. Large gantries are therefore driven on both sides with a measuring system on each.",
      ],
    },
    {
      kind: "example",
      title: "What a heavier table costs the drive, in newtons",
      body: [
        "Take the axis-sizing example this course uses throughout. A horizontal `X` axis carries `m = 250 kg` of table, saddle, fixture and workpiece at `v = 30 m/min` (`0.5 m/s`) with `a = 3 m/s²` over `L = 600 mm` (`0.6 m`), against a process force of `F_ext = 800 N`, through a ball screw of lead `P = 10 mm` at efficiency `η = 0.90`, on guideways with `μ = 0.005`. Horizontal means `θ = 0`, and `g = 9.80665 m/s²`.",
        "The forces build up like this. `F_a = m × a = 750 N`. `F_f = μ × m × g × cos θ = 0.005 × 250 × 9.80665 = 12.3 N`. `F_g = m × g × sin 0° = 0 N`. Total `F = 750 + 12.3 + 0 + 800 = 1562 N`. Screw torque `T = (F × P) / (2π × η) = (1562 × 0.010) / (2π × 0.90) = 2.76 N·m`, at `n = (v × 1000) / P = 3000 rev/min`, with the move taking `t = (L / v) + (v / a) = 1.37 s`. In SI terms `3000 rev/min` is about `314 rad/s`, since `1 rev/min = 2π/60 rad/s`, about `0.105 rad/s`.",
        "Now change one structural decision and nothing else: put `400 kg` on that axis instead of `250 kg`. The acceleration force becomes `1200 N`, friction rises to `19.6 N`, gravity is still `0 N`, and the total becomes `2020 N`, needing `3.57 N·m` at the screw. Motor speed and move time do not change, because neither depends on mass.",
        "The table got `60 %` heavier but the thrust rose only `29 %`, because the `800 N` cutting force does not care how heavy the table is. On a machine that cuts hard and moves rarely, extra table mass is nearly free; on one that mostly rapids between short cuts it is charged on every move for the machine's whole life.",
        "All of this is an educational estimate. It ignores screw inertia, coupling and bearing losses, duty cycle, thermal limits, critical speed and buckling, and it does not replace manufacturer sizing software or professional engineering review.",
      ],
    },

    { kind: "heading", text: "Staying still when things get warm" },
    {
      kind: "prose",
      body: [
        "A machine is accurate at the temperature it was aligned at. Everything else is thermal drift: a slow change in the geometry of the loop as parts of it grow and shrink. Steel and cast iron expand in the order of `10` to `12 µm` per metre of length per kelvin of temperature rise — approximate orientation figures, with the coefficient for a given grade coming from its material data. A one-metre loop warming by `2 K` therefore moves something like `20 µm`, which is a great deal on a machine sold on micrometres.",
        "The heat comes from inside as much as outside: spindle bearings and motor, the servo motors, ball screws warming as their nuts run up and down them, the cut pouring heat into chips and workpiece, and the coolant carrying it all around the structure. Then add sun on one wall and a door that opens whenever a pallet arrives.",
        "Symmetry is the main structural defence, and it is an engineering decision rather than an aesthetic one. If a column is the same on both sides of the spindle centreline, warming makes it grow evenly and the tool stays roughly over the same point. If one side of the loop is a heavy casting and the other a thin plate, they grow at different rates and the loop tilts — and a small tilt at the top of a column is a large displacement at the tool point. The same argument says put heat sources outside the loop where you can: tanks off the machine, drives in their own cabinet, chilled spindles.",
      ],
    },
    {
      kind: "note",
      title: "Where this lesson stops",
      body:
        "Everything here is static: a steady push, and how far it moves the tool. A real cut is a rapidly varying force, so a structure also has natural frequencies, mode shapes and a dynamic stiffness that can be far lower than its static stiffness — that is Level 15, vibration and machine dynamics. Thermal behaviour gets a level of its own too, Level 14. Treat this lesson as the shape of the argument rather than the whole of it.",
    },

    { kind: "heading", text: "Chips have to fall somewhere" },
    {
      kind: "prose",
      body: [
        "Cutting produces swarf — the chips sheared away from the workpiece — usually hot, often razor-sharp, and in volumes that surprise beginners. The machining example used throughout this course removes material at `19.1 cm³/min`; keep that up for an hour and you have made more than a litre of aluminium chips mixed with coolant, all landing wherever the structure lets it land.",
        "So chip and coolant management is a structural design input, not a finishing touch. The designer decides early where chips fall and shapes the structure around it: internal surfaces sloped steeply enough that swarf slides instead of settling, a clear path to a tray or conveyor, guideways out of the fall line or protected by covers and wipers, and no horizontal ledges for chips to build up on. Coolant needs the same thought — where it collects, how it drains, and how it is kept out of screws, motors and seals.",
        "Chips left inside do three separate bad things. They carry heat into the castings, feeding exactly the thermal drift you just designed against. They get dragged into guideways and screws, destroying the rolling surfaces the feed drive depends on. And they pile up under the workpiece, so the next part sits on a chip and is machined in the wrong place. A stiff machine that is impossible to clear loses to a slightly softer one that clears itself.",
      ],
    },
    {
      kind: "safety",
      body:
        "Machine structures are heavy, and the two moments that hurt people are lifting them and standing inside them. Moving a bed, column or crossbeam casting is a planned lifting operation needing rated equipment, a checked route and nobody underneath; a moving gantry or table creates crushing and shearing zones that must be guarded and interlocked before the machine is ever powered. Enclosures are structure too — panels, windows and door retention exist to contain flying chips, coolant mist and a fragment of a broken tool, not merely to hide the process from view. ISO 12100 sets out how machinery hazards are identified and reduced, and ISO 16090-1 addresses safety requirements for milling machines and machining centres; consult those standards directly for what they actually require, and have the risk assessment, guarding, interlocking and verification specified and signed off by qualified personnel under the law that applies where the machine will run.",
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong:
            "Adding mass and calling it stiffness — pouring concrete into a hollow base, or bolting a steel slab onto the outside of a casting.",
          why: "Mass resists acceleration; stiffness resists deflection. A slab bolted to the outside of a casting is not on the path the cutting force takes, so the force never reaches it and it cannot resist the bending. All you have added is something to accelerate on every rapid. Mass earns its keep only inside the loop, where it stiffens a section, or where you genuinely want inertia to swamp a vibration.",
        },
        {
          wrong:
            "Assuming a thick wall must be stiffer than a thin ribbed one, and specifying `40 mm` walls everywhere to be safe.",
          why: "Bending stiffness depends on how far material sits from the neutral axis, not on how much of it there is. A thinner wall with well-placed ribs can beat a solid thick wall of the same mass. Thick sections also cast badly: they cool slowly, shrink unevenly and lock in stress that reappears as distortion after machining. The skill is section design, not thickness.",
        },
        {
          wrong:
            "Designing the structure first and discovering afterwards that the chips have nowhere to fall.",
          why: "Chips and coolant land wherever gravity takes them. Horizontal ledges, blind pockets and rails under the cut all collect swarf, which holds heat in the castings and grinds past the wipers into the guideways. Retro-fitting sloped covers, drains and a conveyor into a finished frame nearly always costs stiffness, because the cut-outs go through exactly the ribs you were relying on.",
        },
        {
          wrong: "Judging a design by the size of its largest casting, because that is what the eye is drawn to.",
          why: "The softest link sets the total, and it is almost never the column. Far more often it is a bolted joint with too few bolts, a spindle nose reaching too far forward, a rail on a shimmed plate rather than a machined face, or an undersized screw support. A modest, well-jointed structure will out-cut an impressive one with a soft interface in its loop.",
        },
        {
          wrong:
            "Treating a finite element result as a measurement — the model says `18 N/µm`, so the machine is `18 N/µm`.",
          why: "The solver faithfully answers the question you asked, and the joints are the part you guessed. Bolted interfaces and rail faces behave as softer, pressure-dependent springs than the bonded contacts most models use by default, so a first analysis usually reports a stiffer machine than the one you build. Use FEA to compare option A with option B, and measure real hardware before believing an absolute number.",
        },
      ],
    },

    { kind: "heading", text: "What FEA tells you, and what it assumes" },
    {
      kind: "prose",
      body: [
        "Finite element analysis, usually shortened to FEA, is the standard way of checking a structure before anyone commits to a pattern or a weldment. The software chops the structure into thousands of small elements, applies a stiffness relationship to each, applies the loads and constraints you specify, and solves for how everything moves. Out comes a coloured deflection picture and, far more usefully, a number for the movement at the tool point.",
        "What FEA does genuinely well is comparison. Move a rib, thicken a wall, add a third bearing, rerun. The relative answer — this option deflects `20 %` less than that one — is trustworthy, because the same assumptions apply to both. It is also good at finding twisting modes and load paths that quietly go somewhere you never intended.",
        "What it does not do is tell you the stiffness of the machine you will build, because the answer is only as good as the joint stiffness you fed it. Bolted interfaces, rail faces, bearing seats and tool tapers are soft, non-linear, pressure-dependent springs, and the convenient default in most models is to bond the parts as though they were one piece of metal. The practice is to build the model, measure a real structure under a known static load, correct the joint assumptions until the model agrees, and only then let it predict.",
      ],
    },
    {
      kind: "deeper",
      title: "What a finite element model quietly assumes",
      body: [
        "Three inputs do most of the damage when they are wrong, and none of them is the mesh.",
        "Constraints. The model has to be held somewhere. Fully fixing the underside of a base tells the solver the floor is infinitely rigid, which it is not — a machine on levelling pads on a concrete floor has a real foundation compliance, and on a large gantry it can be a meaningful share of the total.",
        "Contacts. Wherever two parts meet, someone chooses between bonded contact, frictional contact with a specified contact stiffness, or modelled bolt pretension. Bonded is quick and flattering; frictional contact with an honestly estimated stiffness is slower, fiddlier and much closer to the truth.",
        "Material data. A modulus taken from a textbook range rather than from the actual casting can be out by a fair margin, and grey cast iron's modulus varies with section thickness and cooling rate.",
        "Correlation closes the gap: load a physical structure with a known force, measure the deflection where the tool would be, and tune the joint stiffnesses until the model matches. Only then has it earned the right to predict. This description is educational — analysis anyone will rely on is engineering work needing competent professional review.",
      ],
    },
    {
      kind: "prose",
      body: [
        "You now have the vocabulary to interrogate any machine you meet. Where does the loop run, and how many joints are in it? What sticks out, and how far? Which direction is this machine soft in, and does that direction matter for the work it must do? What is it made of, and was that choice about stiffness, damping, thermal calm, chip clearance or cost?",
        "The next lesson turns those questions into a decision. Given a brief — a size of part, a material, an accuracy expectation, a floor plan and a budget — which architecture do you choose, and how do you defend it against the ones you rejected? Every architecture is a compromise; the skill is knowing which compromise your brief can afford. Nothing decided on paper makes a machine safe to build and run: that always needs professional engineering review, and this course is a concept exercise throughout.",
      ],
    },
  ],

  knowledgeCheck: [
    {
      id: "arch-loop-membership",
      prompt:
        "A vertical machining centre is cutting a part clamped in a vice. Which of these is inside the structural loop?",
      options: [
        {
          id: "a",
          text: "The vice bolted to the table.",
          correct: true,
          feedback:
            "Correct. Cutting force passes from the cutting edge into the workpiece, through the vice jaws and body, into the table and onward down through the machine. The vice is a link like any other, which is why a flexible vice or a loosely bolted one shows up directly as a dimensional error on the part.",
        },
        {
          id: "b",
          text: "The coolant tank at the back of the machine.",
          correct: false,
          feedback:
            "It is heavy and it is bolted to the machine, so it feels structural — and that is exactly the trap. No cutting force passes through it: force flows from tool to workpiece and back through the parts that hold them, and the tank is not on that path. It matters enormously for thermal drift, and not at all for stiffness at the tool point.",
        },
        {
          id: "c",
          text: "The electrical cabinet.",
          correct: false,
          feedback:
            "Same trap as the coolant tank, and on many machines the cabinet is even more solidly attached. Being attached is not the test; carrying cutting force is. The cabinet matters for heat, for electrical noise and for service access, but removing it would not change the machine's stiffness where the cutting happens.",
        },
        {
          id: "d",
          text: "The enclosure door.",
          correct: false,
          feedback:
            "Doors really do stiffen sheet-metal enclosures and they are certainly part of the machine, so this is not a silly answer. But the enclosure's job is containment and guarding, not carrying cutting force — unbolt the door and the stiffness at the tool point is unchanged, even though the machine is now unsafe to run.",
        },
      ],
      teaching:
        "The test for loop membership is one question: does cutting force pass through it? Everything on that path counts, including the workholding, which beginners routinely forget is part of the machine's stiffness.",
      reviewSlug: "what-is-a-cnc-machine",
    },
    {
      id: "arch-biggest-lever",
      prompt:
        "A small vertical machining centre deflects too much at the tool point when side-milling. Four changes are proposed, each costing roughly the same. Which one attacks the largest term?",
      options: [
        {
          id: "a",
          text: "Shorten the spindle head's forward overhang by `50 mm` by redesigning the head and the way it mounts to the column.",
          correct: true,
          feedback:
            "Correct. Deflection at the end of a cantilever rises with the cube of its length, so overhang is by far the most leveraged dimension in the loop. Taking `50 mm` off a forward reach is worth more than a large change in material or section anywhere else in the machine.",
        },
        {
          id: "b",
          text: "Bolt a `200 kg` steel plate to the outside of the base to add mass.",
          correct: false,
          feedback:
            "Tempting because heavy machines genuinely do cut better, so mass feels like the active ingredient. But the plate is not on the load path from cutting edge to base, so the cutting force never reaches it and it cannot resist the deflection. You have added something to accelerate and something for the floor to carry, and nothing else.",
        },
        {
          id: "c",
          text: "Recast the column in steel rather than grey cast iron, roughly doubling the elastic modulus.",
          correct: false,
          feedback:
            "A genuine improvement, and the reasoning is sound as far as it goes: deflection is inversely proportional to `E`, so doubling the modulus halves that contribution. It is simply a much smaller lever than geometry, it costs you the cast iron's damping, and the column was probably not the softest link in the loop to begin with.",
        },
        {
          id: "d",
          text: "Fit a larger servo motor to the axis so it holds position more firmly against the cut.",
          correct: false,
          feedback:
            "A very common instinct, and it comes from the true observation that the cut is winning. But the drive is holding its commanded position perfectly well — the structure between that position and the cutting edge is what bends. Torque decides whether an axis can move a load; stiffness decides how far the cut pushes the tool off the path.",
        },
      ],
      teaching:
        "In a structural loop, geometry beats material. Length enters bending deflection as a cube and section shape through the second moment of area, while material enters only as a simple proportion — so look at overhangs and sections before you look at the material list.",
      reviewSlug: "how-a-ball-screw-moves-an-axis",
    },
    {
      id: "arch-series-compliance",
      prompt:
        "A structural loop has three significant links, measured at `200`, `150` and `25 N/µm`. Which statement is sound?",
      options: [
        {
          id: "a",
          text: "The total is about `19 N/µm`, and doubling the `25 N/µm` link helps far more than doubling the `200 N/µm` one.",
          correct: true,
          feedback:
            "Correct. Compliances add: `1/200 + 1/150 + 1/25` gives about `19.4 N/µm`. Doubling the stiffest link takes the total to roughly `20.3`; doubling the softest takes it to roughly `31.6`. Same effort, several times the return, which is why finding the softest link comes before spending anything.",
        },
        {
          id: "b",
          text: "The total is `375 N/µm`, because the three links share the load between them.",
          correct: false,
          feedback:
            "That is what happens when springs sit in parallel, and parallel arrangements are real and useful — two bearing blocks sharing a load really do add up like this. But links in a structural loop are in series: the same force passes through every one of them in turn, so it is their movements that add, not their stiffnesses.",
        },
        {
          id: "c",
          text: "The total is `25 N/µm`, set entirely by the softest link.",
          correct: false,
          feedback:
            "Close enough to the truth to be a decent rule of thumb, which is exactly why it misleads. The softest link dominates but does not decide alone — the other two still contribute their share of movement and drag the total below `25`, to about `19.4`. The difference matters when you are judging whether a proposed fix is worth its cost.",
        },
        {
          id: "d",
          text: "The total cannot be worked out without knowing the applied force.",
          correct: false,
          feedback:
            "Careful thinking about whether you have enough information, aimed at the wrong quantity. Stiffness is a property of the structure rather than of the load — that is precisely why it is expressed as force per unit deflection, so the force cancels out of the sum.",
        },
      ],
      teaching:
        "Links in a structural loop all carry the same force and their deflections add, so compliances add and the total stiffness is always lower than the softest link. Find the softest link before choosing where to spend.",
    },
    {
      id: "arch-damping-vs-stiffness",
      prompt:
        "A precision grinder is being developed. The welded steel prototype is rigid under static load but leaves a faint repeating vibration pattern on ground surfaces. Which change addresses the symptom?",
      options: [
        {
          id: "a",
          text: "Move to polymer concrete, accepting a lower elastic modulus in exchange for much higher damping.",
          correct: true,
          feedback:
            "Correct for this symptom. A repeating mark says energy is going into the structure and not being dissipated, which is a damping problem rather than a rigidity one. Polymer concrete trades modulus for damping, so the sections get bulkier — an acceptable price on a grinder, where surface finish is the product.",
        },
        {
          id: "b",
          text: "Make the steel weldment thicker, since more steel means more stiffness and stiffness resists vibration.",
          correct: false,
          feedback:
            "Reasonable, because static stiffness genuinely does raise natural frequencies and reduce amplitude, so the effort is not wasted. But steel's internal damping stays poor whatever the thickness, so the structure keeps ringing — you are likely to move the problem to a different frequency rather than remove it.",
        },
        {
          id: "c",
          text: "Move to granite, because it is the most dimensionally stable material available.",
          correct: false,
          feedback:
            "Granite is a fine choice for measuring machines and it does damp better than steel, so this is far from foolish. Its real strength is thermal and long-term stability rather than damping, and its manufacturing limits — nothing welded on, no cast-in passages, brittle in tension — make it awkward for a machine needing coolant routes and mounting faces everywhere.",
        },
        {
          id: "d",
          text: "Keep the steel frame and fit a larger, stiffer spindle.",
          correct: false,
          feedback:
            "Worth considering in general, because the spindle is often the softest link and tool-side vibration is common. It does not fit the evidence here: the frame has been described as rigid under static load and the mark is a structural ringing, so a stiffer spindle leaves the least-damped part of the system exactly as it was.",
        },
      ],
      teaching:
        "Stiffness limits how far a structure moves under load; damping limits how long it keeps moving afterwards. Ringing, chatter marks and long settling times are damping symptoms, and the material and joint choices that cure them usually cost some rigidity.",
    },
    {
      id: "arch-table-vs-gantry",
      prompt:
        "A machine must cut `2.4 m × 1.2 m` aluminium sheet in a workshop with limited floor space. Which architecture argument is strongest?",
      options: [
        {
          id: "a",
          text: "A moving gantry, because the sheet stays still so its mass never has to be accelerated, and the footprint stays close to the work envelope.",
          correct: true,
          feedback:
            "Correct on both counts, and the floor space point often decides it on its own. A moving table would need a bed roughly two to three times the `2.4 m` travel, which the workshop has not got, and it would accelerate the sheet and its fixture on every move.",
        },
        {
          id: "b",
          text: "A moving table, because the structure then stays still, which always gives the shorter and stiffer loop.",
          correct: false,
          feedback:
            "The stiffness reasoning is genuinely correct and is exactly why moving tables dominate smaller machining centres. It simply loses this particular argument: at `2.4 m` of travel the floor space and moving mass penalties outweigh the loop advantage, and recognising when a good principle loses is what architecture selection is.",
        },
        {
          id: "c",
          text: "A C-frame, because the open front gives the best access for loading a large sheet.",
          correct: false,
          feedback:
            "Access is a real criterion and loading a big sheet is genuinely awkward, so the instinct is not wrong. But a C-frame reaching to the middle of a `1.2 m` width would be a cantilever of extraordinary length, and deflection rises with the cube of that reach. The loading would be a pleasure and the parts would be wrong.",
        },
        {
          id: "d",
          text: "A box-in-box, because nesting the axes gives the shortest possible loop at any size.",
          correct: false,
          feedback:
            "Box-in-box does give a short, symmetric loop, which is why it appears on high-acceleration precision machines — so the instinct is sound. It scales badly to large envelopes though: nesting means the outer frame must enclose the full travel of everything inside it, so a `2.4 m` version becomes enormous and expensive.",
        },
      ],
      teaching:
        "Architecture selection is a trade, not a ranking. Moving-table machines buy loop stiffness with floor space and moving mass; moving gantries buy envelope and low moving mass with a longer loop and a racking mode that must be controlled.",
    },
    {
      id: "arch-fea-correlation",
      prompt:
        "An FEA model predicts `18 N/µm` at the tool point. The machine, once built and measured, is noticeably softer. What is the most likely explanation?",
      options: [
        {
          id: "a",
          text: "The model treated bolted interfaces as bonded, so every joint in the real loop is softer than its counterpart in the model.",
          correct: true,
          feedback:
            "Correct, and it is the usual answer. Two bolted faces touch only on their high spots and behave as a comparatively soft, pressure-dependent spring, while a bonded contact tells the solver they are one piece of metal. Since compliances add, several optimistic joints move the total a long way.",
        },
        {
          id: "b",
          text: "The mesh was too coarse, so the solver underestimated the deflection.",
          correct: false,
          feedback:
            "Mesh quality is a real source of error and is the first thing many people check, so the guess is fair — and a coarse mesh does tend to make a structure look stiffer. It is rarely the dominant error next to joint assumptions, and it is also the easiest thing to rule out, by refining the mesh and rerunning.",
        },
        {
          id: "c",
          text: "The castings were made of weaker material than specified, so they bent more than the model expected.",
          correct: false,
          feedback:
            "Possible in principle and worth checking, particularly since grey cast iron's modulus varies with section thickness and cooling rate. It rarely explains a large gap on its own, because the castings are usually not where most of the compliance lives — the joints between them are.",
        },
        {
          id: "d",
          text: "FEA cannot predict stiffness, so the disagreement carries no useful information.",
          correct: false,
          feedback:
            "An understandable reaction to a model that let you down, but it throws away a good tool. FEA predicts stiffness well once its joint assumptions have been corrected against a measurement — the disagreement is the data you use to correct it, not a reason to stop modelling.",
        },
      ],
      teaching:
        "A structural model is only as good as its joint and constraint assumptions. Use FEA to compare designs, correlate it against a measured structure before believing any absolute number, and remember that analysis anyone will rely on needs competent engineering review.",
      reviewSlug: "accuracy-repeatability-resolution",
    },
  ],

  exercise: {
    title: "Trace a real structural loop and find its softest link",
    body:
      "Find a machine you can actually touch — a bench drill, a desktop 3D printer, a small router, a sewing machine, or a clear photograph of a machining centre if that is all you have — and treat it as an engineering subject rather than an appliance. The aim is not a number. It is the habit of seeing a load path where other people see a lump of metal. Nothing here needs the machine to be powered, and none of it should be attempted on a machine that is running or that someone else could start.",
    steps: [
      "Sketch the machine from the side and mark the point where the tool meets the work. From there draw the loop: follow the force through the workpiece, the workholding, the table, whatever the table sits on, down into the base, up the column or frame, out along the head, into the spindle, and back to the tool. Do not stop until your line closes on itself.",
      "Number every joint your loop crosses — every place where two separate parts are bolted, clamped, screwed, pinned or slid together. Count them and write the total down. Most people find more than they expected.",
      "Measure or estimate the longest overhang in the loop in millimetres, and write down what would have to change to halve it. Remember the cube: halving it would cut that part of the deflection to about one eighth.",
      "Rank your joints from softest to stiffest by eye, and give one sentence of reasoning for your top three. Look for small bolts, thin flanges, adjustable or slotted mountings, shimmed packing pieces, and anything relying on friction rather than a fitted dowel or a machined shoulder.",
      "With the machine switched off, unplugged and unable to be started by anyone else, test your ranking gently. Rest a dial indicator or a phone camera against a fixed part so it watches the tool point, then push sideways at the tool with steady hand pressure you could hold all day — not a shove. Watch which joint actually opens up.",
      "Write down in two sentences what this machine is soft in, and what kind of work that softness would spoil. Then say what you would change first in a version two, and why that change rather than a bigger motor.",
      "Finally, look at where chips, swarf or dust land on this machine. Name one horizontal surface inside it that collects debris, and describe how you would have shaped that surface differently at the design stage.",
    ],
    selfCheck: [
      "Your loop is closed. If the line starts at the cutting edge and stops at the base, you have drawn a load path rather than a loop — the force has to get back to the tool.",
      "The workholding appears in your loop. The vice, chuck, clamps or bed the part sits on carries every newton of cutting force, and it is the most commonly forgotten link of all.",
      "Your softest-link ranking gives reasons rather than an order. 'Four small bolts through a thin flange, tightened by feel' is a reason; 'it looks flimsy' is not.",
      "Your overhang figure is a measurement or a stated estimate with units, not an adjective.",
      "Your version-two change is a stiffness change — shorter reach, fewer joints, a better-supported section — and you can say in one sentence why extra motor torque would not have helped.",
      "Your chip observation names a specific surface and a specific reshaping, such as sloping it or deleting the ledge, rather than a general 'add better covers'.",
    ],
  },

  summary: [
    "The structural loop is the closed path cutting force takes from the cutting edge through workpiece, workholding, table, base, column, head and spindle, and back to the cutting edge; shorter, stiffer and more symmetric is better.",
    "Static stiffness is force per unit deflection at the tool point, usually in `N/µm`; compliance is its reciprocal, compliances add along the loop, and the total is always below the softest link.",
    "Compliance hides in joints, bolted interfaces and overhangs, and very rarely in the large castings that catch the eye.",
    "Deflection at the end of a cantilever rises with the cube of its length, so halving an overhang is worth about four times as much as doubling the material's modulus.",
    "Damping is a separate property from stiffness — it decides how quickly vibration dies away — which is why grey cast iron and polymer concrete are chosen despite their lower modulus.",
    "No frame material wins outright: steel is stiffest and cheapest to prototype, cast iron balances stiffness with damping and casts to shape, polymer concrete damps and stays thermally calm, granite is the most stable and the least workable.",
    "Layout is a trade — C-frames buy access with a cantilever, fixed-bridge moving-table machines buy loop stiffness with floor space and moving mass, moving gantries buy envelope with a racking mode, box-in-box buys acceleration with cost, and portals buy sheer size.",
    "Thermal symmetry, a designed-in chip and coolant route, and FEA results correlated against a measured structure are all part of architecture rather than finishing touches, and none of them replaces professional engineering review.",
  ],

  nextSlug: "selecting-an-architecture",
};
