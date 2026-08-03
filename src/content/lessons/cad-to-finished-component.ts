import type { Lesson } from "../types";

export const cadToFinishedComponent: Lesson = {
  slug: "cad-to-finished-component",
  level: 1,
  title: "From CAD model to finished component",
  intro:
    "A shape on a screen does not become a metal part by magic. It travels through a chain of handovers — design, programming, translation, setup, cutting and measuring — and each one changes what the information is and who is responsible for it. This lesson walks the whole chain once, slowly, so every later lesson has somewhere to hang.",
  minutes: 22,
  objectives: [
    "Describe every stage from design intent to an inspected component, and say what each stage adds.",
    "Explain what a CAM system decides that a CAD model does not.",
    "Explain what a post-processor does and why one CAM file becomes different code for different machines.",
    "Distinguish a roughing pass from a finishing pass by what each one protects.",
    "Calculate spindle speed, feed rate, material removal rate and cutting time from a cutting speed and a feed per tooth.",
    "List what must still happen at the machine after the program is written, and why a clean simulation does not prove a setup is safe.",
  ],
  terms: [
    {
      term: "Design intent",
      plain:
        "What the part actually has to achieve — which faces must be flat, which holes must line up, which dimensions matter and which merely close the shape.",
    },
    {
      term: "CAD model",
      plain:
        "A three-dimensional description of the finished part, held as exact geometry rather than as a drawing you measure with a ruler.",
    },
    {
      term: "CAM",
      plain:
        "Computer-aided manufacturing: the software where you decide which tools cut which surfaces, in what order, and along what routes.",
    },
    {
      term: "Toolpath",
      plain:
        "The route the cutting tool takes through space, including how it enters the material, how it moves while cutting and how it leaves.",
    },
    {
      term: "Stepdown",
      plain:
        "How deep the tool cuts on each pass, measured along the tool's axis. Written as ap and called the axial depth of cut.",
    },
    {
      term: "Stepover",
      plain:
        "How far sideways the tool shifts between neighbouring passes, measured across its diameter. Written as ae and called the radial width of cut.",
    },
    {
      term: "Post-processor",
      plain:
        "A translator that turns a CAM toolpath into the exact code one particular machine and control will accept, in the order and format they expect.",
    },
    {
      term: "Cutting speed",
      plain:
        "How fast the cutting edge sweeps past the metal, in metres per minute. It belongs to the material and the tool, not to the machine.",
    },
    {
      term: "Feed per tooth",
      plain:
        "How thick a slice each cutting edge takes as it passes through the metal, in millimetres per tooth. It decides how heavily the tool is loaded.",
    },
    {
      term: "Feed rate",
      plain:
        "How fast the tool travels through the workpiece, in millimetres per minute. This is the number the machine is actually given.",
    },
    {
      term: "Stock",
      plain:
        "The raw lump you start from, and also the thin layer of extra material a rough cut deliberately leaves for the finishing cut to remove.",
    },
    {
      term: "Work offset",
      plain:
        "The stored numbers telling the machine where, in its own world, you have decided the zero point of the part is. Often called the part datum.",
    },
  ],
  blocks: [
    { kind: "heading", text: "From an idea to a piece of metal" },
    {
      kind: "prose",
      body: [
        "Somebody needs a bracket. The need becomes a shape, the shape becomes a set of machining decisions, those decisions become instructions for one specific machine, and finally a person clamps a lump of metal down and presses a green button. Nothing in that chain is automatic.",
        "Think of it as a series of handovers. At each one the information becomes more specific and, at the same time, less portable. A CAD model can be sent to any workshop on earth; the finished program usually runs on one machine, in one fixture, with one set of tools.",
        "That trade — specificity bought at the cost of portability — explains why every stage exists. Once you see it, the post-processor stops being a mysterious button and becomes an obvious necessity.",
      ],
    },
    {
      kind: "figure",
      figure: "cad-to-part",
      caption:
        "The chain, left to right. Look at what each arrow adds rather than at the boxes: geometry gains a cutting strategy, the strategy gains a machine-specific dialect, the code gains a real physical setup, and the part gains evidence that it is correct. Note that the only backward arrow comes from inspection — that loop is what makes the second part better than the first.",
    },
    { kind: "heading", text: "Design intent and the CAD model" },
    {
      kind: "prose",
      body: [
        "A CAD model is exact geometry. Ask it for the distance between two hole centres and it answers to more decimal places than any machine could hold. That exactness is useful but misleading, because it says nothing about which dimensions actually matter.",
        "Design intent is the missing half. A bracket may have twenty dimensions, of which three decide whether it works: the bore that takes a bearing, the two mounting holes that must line up with a plate, and the face those holes are measured from. The rest simply close the shape.",
        "Intent is carried by a drawing or by annotations on the model, using tolerances — the permitted amount by which a real feature may differ from the nominal number. A programmer who cannot see the intent treats all twenty dimensions as critical, which is slow and expensive, or all twenty as casual, which makes scrap.",
      ],
    },
    {
      kind: "note",
      title: "The model is nominal; the metal is not",
      body: "A CAD model describes a perfect part made from perfect stock. The bar you are about to cut may be a few tenths of a millimetre oversize, sawn out of square, bowed from rolling, or covered in a hard oxidised skin. How much material the first pass meets, where the datum surface really is, and whether the part springs when the vice is released all depend on that difference between nominal and real.",
    },
    { kind: "heading", text: "CAM: choosing how the metal comes off" },
    {
      kind: "prose",
      body: [
        "CAM is where a shape becomes a plan. You bring in the CAD model, describe the starting stock, and then make a long series of decisions: which tool cuts which surface, in what order, from which direction, and how deep and how wide each pass will be.",
        "Two of those decisions have names. Stepdown is how deep the tool goes on each pass, along the tool's axis; stepover is how far sideways it shifts between neighbouring passes. Together they set how much metal the tool is fighting at any instant, and therefore the cutting force, the heat, the noise and whether the tool survives.",
        "The third decision beginners overlook is the entry move — how the tool gets from fresh air into solid metal. Dropping a milling cutter straight down is the worst option, because most end mills barely cut at their exact centre; that small region scrapes rather than slices. CAM therefore offers ramping and helical entries, which slide the tool in at a shallow angle so the side edges do the work.",
      ],
    },
    { kind: "heading", text: "Roughing and finishing are strategies, not buttons" },
    {
      kind: "prose",
      body: [
        "Almost every milled part is cut at least twice. Roughing exists to remove the bulk of the material as fast as the machine, tool and fixture can stand. It is not trying to be accurate, and it deliberately leaves a thin, even layer of stock behind.",
        "Finishing then cuts that layer away to make the real surface. Because it removes little, cutting force is low and steady, the tool barely deflects, and the surface is predictable. Had roughing left 0.1 mm in one place and 0.9 mm in another, the finishing tool would deflect by different amounts along the wall and the accuracy would evaporate.",
        "So they are strategies, not settings. Roughing protects cycle time and the tool; finishing protects the geometry. Knowing which one you are doing tells you what to change when something goes wrong.",
      ],
    },
    {
      kind: "compare",
      title: "Roughing and finishing compared",
      columns: ["Roughing pass", "Finishing pass"],
      rows: [
        {
          label: "Depth of cut (ap, stepdown)",
          cells: [
            "As deep as tool, spindle and fixture will tolerate, sometimes the full flute length. This is where removal rate comes from.",
            "Light and consistent — often just the stock layer roughing left, so cutting force stays low and steady.",
          ],
        },
        {
          label: "Width of cut (ae, stepover)",
          cells: [
            "Wide and shallow, or narrow and deep in a high-feed trochoidal strategy. Chosen to keep the load on the tool constant.",
            "Small and even. Any variation in engagement shows up directly as a mark or a dimensional wobble on the finished surface.",
          ],
        },
        {
          label: "Feed per tooth (fz)",
          cells: [
            "High. Thick chips carry heat away in the swarf instead of leaving it in the tool and the workpiece.",
            "Lower, but never so low that the edge rubs instead of slicing. Rubbing burnishes the surface and wears the tool faster than cutting does.",
          ],
        },
        {
          label: "Tool choice",
          cells: [
            "Short, stiff, often fewer flutes with large gullets so chips escape. Cosmetic condition of the edge hardly matters.",
            "More flutes and a sharp, true-running edge — often a tool reserved for finishing so it stays keen.",
          ],
        },
        {
          label: "Surface finish produced",
          cells: [
            "Stepped, irregular and irrelevant, because all of it is about to be cut away.",
            "The surface the customer sees and the inspector measures. Set by feed per tooth, runout, deflection and machine stiffness.",
          ],
        },
        {
          label: "What the pass protects",
          cells: [
            "Cycle time and tool life. It shifts the most metal per minute while staying inside the machine's power and stiffness limits.",
            "Accuracy and surface quality, protecting the geometry from deflection and from whatever variation roughing left.",
          ],
        },
      ],
    },
    { kind: "heading", text: "The four numbers every programmer sets" },
    {
      kind: "prose",
      body: [
        "Whatever CAM software you use, four numbers sit underneath every cutting move. Two belong to the physics of cutting; two belong to the machine.",
        "Cutting speed, written `vc`, is how fast the cutting edge sweeps past the metal, in metres per minute. It is set by what you are cutting and what the tool is made of: carbide in aluminium tolerates a far higher cutting speed than the same cutter in stainless steel. Feed per tooth, `fz`, is how thick a slice each individual edge takes, in millimetres per tooth, and is set by the tool's size and strength and by how rigid the setup is.",
        "The machine cannot be told either of those. A spindle is commanded in revolutions per minute and an axis in millimetres per minute. So the last job before a toolpath is worth anything is converting the two cutting numbers into the two machine numbers: spindle speed `n` and feed rate `vf`.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "n = (vc × 1000) / (π × D)",
        variables: [
          { symbol: "n", meaning: "Spindle speed — how fast the tool turns", unit: "rev/min" },
          { symbol: "vc", meaning: "Cutting speed — how fast the edge sweeps past the metal", unit: "m/min" },
          { symbol: "D", meaning: "Tool diameter", unit: "mm" },
          { symbol: "1000", meaning: "Converts the cutting speed from metres to millimetres so the units agree", unit: "mm/m" },
        ],
        meaning:
          "Cutting speed belongs to the material and the tool; spindle speed is only what falls out once you choose a diameter. Fit a smaller cutter for the same material and the spindle speed must rise to keep the edge sweeping past the metal at the same rate.",
      },
    },
    {
      kind: "formula",
      formula: {
        expression: "vf = n × z × fz",
        variables: [
          { symbol: "vf", meaning: "Feed rate — how fast the tool travels", unit: "mm/min" },
          { symbol: "n", meaning: "Spindle speed, from the formula above", unit: "rev/min" },
          { symbol: "z", meaning: "Number of cutting edges, or flutes, on the tool", unit: "teeth" },
          { symbol: "fz", meaning: "Feed per tooth — thickness of the slice each edge takes", unit: "mm/tooth" },
        ],
        meaning:
          "Feed rate is a consequence, never a starting point. Swap a four-flute cutter for a three-flute one and leave the feed rate alone, and every remaining edge now takes a thicker slice than intended — the tool is overloaded without a single number on the screen changing.",
      },
    },
    {
      kind: "example",
      title: "Worked example: a 10 mm four-flute cutter in aluminium",
      body: [
        "A 10 mm carbide end mill with four flutes is cutting an aluminium alloy. The supplier's data suggests `vc = 200 m/min` and `fz = 0.05 mm/tooth`. The pass is `ap = 5 mm` deep and `ae = 3 mm` wide, and runs `L = 250 mm` along the part.",
        "Spindle speed first: `n = (200 × 1000) / (π × 10) = 6366 rev/min` (6366.2 before rounding). That number exists only because the tool happens to be 10 mm across.",
        "Feed rate next: `vf = 6366.2 × 4 × 0.05 = 1273 mm/min` (1273.2). Note how much the tooth count matters — with three flutes the same feed per tooth would give about `955 mm/min`.",
        "Material removal rate follows: `Q = (5 × 3 × 1273.2) / 1000 = 19.1 cm³/min` (19.099). That single number is the honest measure of how productive the pass is, and it is what you compare when judging one strategy against another.",
        "Finally the time for one pass: `t = 250 / 1273.2 = 0.196 min`, about `11.8 s`. Multiply by the number of passes and you have a cycle-time estimate long before going near the machine.",
      ],
    },
    {
      kind: "note",
      title: "Shop units and their SI relations",
      body: "Rev/min and mm/min are what the shop floor and the control actually use, so this course uses them too — but they are not SI. One revolution is 2π radians, so 1 rev/min = 2π/60 rad/s ≈ 0.105 rad/s, making 6366 rev/min about 667 rad/s. Likewise 200 m/min is 200/60 ≈ 3.33 m/s, and 1273 mm/min is about 0.0212 m/s. Whenever a formula mixes units, check the conversion factors — like the 1000 above — are doing their job.",
    },
    { kind: "widget", widget: "machining-calculator" },
    {
      kind: "note",
      title: "What this calculator is and is not",
      body: "This is an educational tool. It applies the textbook relationships above and nothing else: it knows nothing about your alloy, tool coating, machine stiffness, coolant, tool overhang or fixture. It does not replace the tool manufacturer's cutting data or professional engineering validation, and no number it produces should be typed into a machine without checking it against the supplier's recommendations and the judgement of someone experienced on that machine.",
    },
    {
      kind: "deeper",
      title: "Deeper: turning removal rate into a power check (optional maths)",
      body: [
        "Removal rate is also the doorway to asking whether the spindle can do what you have programmed. Cutting metal takes energy, and the energy per unit volume is captured by a material property called the specific cutting force, kc — roughly, the force needed per square millimetre of chip cross-section.",
        "kc is not a constant. It rises sharply as the chip gets thinner, which is one reason very light finishing cuts are less efficient per cubic centimetre than heavy roughing cuts. You take kc from the tool or material supplier's data for the chip thickness you are actually working at; it is never something to guess.",
        "Suppose, purely as an order-of-magnitude illustration, the supplier's figure here were around 800 N/mm². With Q = 19.1 cm³/min the cutting power comes out near 0.25 kW — a small fraction of a typical machining-centre spindle, saying this cut is limited by tool strength and rigidity rather than power. A heavy cut in steel would answer very differently. Treat the figure as illustrative only: a real check must also account for spindle efficiency, torque available at the speed you are running, duty cycle, and the fact that rated power is rarely available across the whole speed range.",
      ],
      formula: {
        expression: "P_c = (k_c × Q) / 60000",
        variables: [
          { symbol: "P_c", meaning: "Cutting power required at the tool", unit: "kW" },
          { symbol: "k_c", meaning: "Specific cutting force for that material at that chip thickness, from supplier data", unit: "N/mm²" },
          { symbol: "Q", meaning: "Material removal rate", unit: "cm³/min" },
          { symbol: "60000", meaning: "Combined conversion for cm³ to mm³ and minutes to seconds, giving kilowatts", unit: "—" },
        ],
        meaning:
          "It turns a productivity number into a demand on the machine. If the answer approaches the spindle's rated power at the speed you intend to run, the strategy has to change — shallower, narrower, or a different tool — rather than being pushed and hoped for.",
      },
    },
    { kind: "heading", text: "The post-processor: why CAM output is not yet a program" },
    {
      kind: "prose",
      body: [
        "Inside CAM, a toolpath is pure geometry with attached intentions: move to this point, at this feed, with the spindle at this speed, coolant on. It is deliberately machine-agnostic, because the value of CAM is that you model a job once and make it on whichever machine is free.",
        "Machines are the opposite of agnostic. They differ in how a tool change is commanded, in how many work offsets they hold and what those are called, in whether an arc is described by its centre or its radius, in which codes turn coolant on, and in how a program must be safely started and ended. G-code — the numeric instruction language the machine executes — is a family of dialects rather than one language.",
        "The post-processor translates between the two worlds. It takes the machine-agnostic toolpath and writes it in the exact dialect, order and formatting one control on one machine expects, including the safety and housekeeping lines CAM never modelled. That is why the same CAM file legitimately produces different code for different machines, and why a post is configured per machine rather than per part.",
      ],
    },
    {
      kind: "example",
      title: "One toolpath, two controls",
      body: [
        "Picture the same pocketing toolpath posted for two machines in one workshop. On the first, a tool change might be one line that selects and loads the tool; on the second, the control may need it selected on one line and swapped on another, with a retract in between. Arcs might come out with the centre given as offsets from the start point on one and as a plain radius on the other.",
        "None of that moves the geometry by a micrometre — the tool follows the same route through the same metal. What changes is everything around the geometry, and that layer is what the post-processor owns. These differences are illustrative; the authoritative description of any dialect is the control manufacturer's programming manual for your machine and software version.",
      ],
    },
    { kind: "heading", text: "Setup: the part of the chain no file can do for you" },
    {
      kind: "prose",
      body: [
        "A finished program still describes a coordinate system that does not yet exist in the real world. Three physical jobs turn it into something that can cut. The first is workholding: clamping the stock so it cannot move under cutting force, cannot be pulled out by a climbing cutter, and does not distort when the clamps are tightened. Where those clamps sit also decides which parts of the toolpath are now lethal.",
        "The second is setting the datum. You physically find a chosen feature on the real workpiece — an edge, a corner, a bore centre, the top face — and store its position in the machine's own coordinate system as a work offset. Every coordinate in the program is then measured from that stored point. Get it wrong by two millimetres and the machine executes a perfect program in exactly the wrong place.",
        "The third is tool measurement. Every tool sticks out of the spindle by a different amount, so each length is measured and stored, and the control subtracts it when positioning in `Z`. Diameters are stored too, so the control can compensate when a replacement cutter is a few hundredths undersize. No software upstream can do these three jobs, because all three concern the physical world rather than the model.",
      ],
    },
    {
      kind: "safety",
      body: "A new program is proven out, never simply run. Proving out means walking the program at reduced risk before anyone trusts it: dry running above the part or with the workpiece removed, executing one line at a time in single block so you see each move before it happens, and holding the feed and rapid overrides low so the machine crawls and can be stopped by feed hold or emergency stop before contact. Keep your hand near the stop control and your eyes on the tool, not the screen. Understand clearly that a CAM simulation cannot know where your clamps, vice jaws, fixture bolts, probe or coolant nozzles really are — it knows only what somebody modelled, and will happily animate a clean pass straight through unmodelled solid steel. Prove out under supervision if you are new to the machine, and follow the machine builder's instructions and your workplace's rules, which take precedence over any general guidance here.",
    },
    { kind: "heading", text: "First part, inspection and iteration" },
    {
      kind: "prose",
      body: [
        "The first part off a new program is evidence, not production. It is measured against the design intent — the dimensions that actually matter — using whatever suits: calipers and micrometers for simple sizes, a bore or height gauge for harder features, a coordinate measuring machine when tolerances are tight.",
        "What you find feeds back to different places, and knowing which one saves hours. Wrong everywhere by the same amount usually points at an offset — a tool diameter or a datum — not at the program. Right size but poor surface points at speeds, feeds, tool condition or rigidity. Wrong position points at the program or the setup, and correct when clamped but wrong when released points at the workholding distorting the part.",
        "This backward arrow turns a chain into a process. The programmer learns which strategies suit that machine, the tool library gains real numbers instead of catalogue starting points, and the fixture improves. The second part is better than the first because somebody measured the first and acted on it.",
      ],
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong: "The CAM simulation ran clean, so the setup must be safe.",
          why: "A simulation checks the toolpath against the world it was given. Unmodelled clamps, a vice sitting differently from the model, a longer tool than the library says, or a datum set on the wrong face are all invisible to it. It catches programming errors, but never errors in things it was never told about.",
        },
        {
          wrong: "The model is the part, so the stock must be the model plus a neat, even skin.",
          why: "Real stock is sawn oversize by an uncertain amount, may be bowed or out of square, and often carries a hard abrasive surface layer. The first cut therefore meets a depth you did not program for, and a strategy assuming an even 1 mm all round can bury the tool in 3 mm at one corner.",
        },
        {
          wrong: "Finishing is just roughing with smaller numbers typed in.",
          why: "They have different goals and fail differently. Cutting feed per tooth too far in the name of a nicer finish makes the edge rub rather than slice, generating heat and wearing the tool faster. A finishing pass is defined by having a small, even, predictable amount of stock left for it — a decision made back in the roughing strategy.",
        },
        {
          wrong: "If I fit a smaller cutter I can leave the spindle speed alone.",
          why: "Spindle speed is not what matters to the metal; cutting speed is. Halving the diameter at the same spindle speed halves the cutting speed, so the edge now sweeps past the metal at half the recommended rate. The tool rubs, heats and wears early, and the cut sounds wrong long before anyone checks the arithmetic.",
        },
        {
          wrong: "A post-processor is just a file converter, so any post will do.",
          why: "A post encodes one machine's personality: its tool-change sequence, offset scheme, arc format, safe start and end blocks, and limits. Running code posted for a different machine is a reliable way to crash one, because the code is often perfectly valid and simply means something else. Posts are configured, tested and owned per machine.",
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "cad-to-part-q1",
      prompt: "A CAM system has produced a finished toolpath. Why can it not simply be sent to the machine as it stands?",
      options: [
        {
          id: "a",
          text: "Because the toolpath is deliberately machine-agnostic geometry, and a post-processor must still write it in the dialect, order and formatting one specific control expects.",
          correct: true,
          feedback:
            "Correct, and the word to hold on to is agnostic. CAM's value is refusing to commit to a machine; the cost is that something downstream must commit for it.",
        },
        {
          id: "b",
          text: "Because CAM systems withhold usable code until the file is licensed for that machine.",
          correct: false,
          feedback:
            "Tempting, because posts really are bought or configured per machine, which can look like a commercial gate. It breaks because the difference is technical: two machines genuinely need different text to perform the same cut.",
        },
        {
          id: "c",
          text: "Because the toolpath is stored as a picture on screen and has to be traced back into numbers.",
          correct: false,
          feedback:
            "Tempting, because what you look at in CAM is a picture. But that picture only renders geometry that was numeric all along; what is missing is machine-specific formatting, not numbers.",
        },
        {
          id: "d",
          text: "Because CAM works in inches internally and machines need millimetres.",
          correct: false,
          feedback:
            "Tempting, because unit mix-ups are a real and expensive class of error. It breaks because CAM works in whatever units the model uses, and units are one small item on the post-processor's long list.",
        },
      ],
      teaching:
        "Every stage in the chain trades portability for specificity. The post-processor is exactly where that trade is made: geometry that could have gone anywhere becomes a program that goes to one machine.",
    },
    {
      id: "cad-to-part-q2",
      prompt: "What is a roughing pass actually for?",
      options: [
        {
          id: "a",
          text: "To remove the bulk of the material as fast as the machine, tool and fixture will stand, while deliberately leaving a thin and even layer of stock for finishing.",
          correct: true,
          feedback:
            "Correct, and even matters as much as thin. Uneven leftover stock makes the finishing tool deflect by differing amounts along the wall, destroying the accuracy that pass existed to provide.",
        },
        {
          id: "b",
          text: "To cut the feature to final size, so finishing only polishes out the marks left behind.",
          correct: false,
          feedback:
            "Tempting, because reaching size once and tidying up sounds efficient. It breaks because a heavy cut deflects the tool, and a deflected tool leaves the wall somewhere other than where you commanded it.",
        },
        {
          id: "c",
          text: "To take one very light pass over everything first, so the tool warms up and deflects less later.",
          correct: false,
          feedback:
            "Tempting, because thermal effects on machines are real and appear later in this course. It breaks because a light pass removes almost nothing; roughing is defined by removal rate, not by conditioning the tool.",
        },
        {
          id: "d",
          text: "To use the same tool and numbers as finishing, but at a lower feed to protect the spindle.",
          correct: false,
          feedback:
            "Tempting, because one tool for everything is simpler and saves a tool change. It fails twice: lower feed reduces removal rate, the opposite of roughing's purpose, and it drops feed per tooth until the edge rubs.",
        },
      ],
      teaching:
        "Ask what a pass is protecting. Roughing protects cycle time and the tool by controlling how much metal is engaged; finishing protects geometry by keeping cutting force low, steady and predictable.",
    },
    {
      id: "cad-to-part-q3",
      prompt:
        "A 10 mm four-flute end mill runs at a cutting speed of 200 m/min with a feed per tooth of 0.05 mm/tooth. What feed rate should be programmed, to the nearest 10 mm/min?",
      options: [
        {
          id: "a",
          text: "1270 mm/min",
          correct: true,
          feedback:
            "Correct. n = (200 × 1000) / (π × 10) = 6366 rev/min, then vf = 6366.2 × 4 × 0.05 = 1273 mm/min. Both steps are needed, because neither cutting speed nor feed per tooth can be commanded directly.",
        },
        {
          id: "b",
          text: "320 mm/min",
          correct: false,
          feedback:
            "Tempting, and it comes from a specific slip: stopping at 6366 × 0.05 ≈ 318. The name feed per tooth is the warning — there are four teeth, each taking its own slice every revolution.",
        },
        {
          id: "c",
          text: "5090 mm/min",
          correct: false,
          feedback:
            "Tempting, because it looks like a confident high-productivity number. It comes from applying the four flutes twice (6366 × 4 × 4 × 0.05), which would put four times the intended chip thickness on every edge.",
        },
        {
          id: "d",
          text: "200 mm/min",
          correct: false,
          feedback:
            "Tempting, because 200 is the number you were handed and it is already a speed. But 200 m/min is how fast the edge sweeps past the metal, not how fast the tool advances — different quantities, different units.",
        },
      ],
      teaching:
        "Cutting speed and feed per tooth describe the physics at the edge; spindle speed and feed rate are what the machine understands. Every move has all four, and two are always derived from the other two.",
    },
    {
      id: "cad-to-part-q4",
      prompt: "The CAM simulation of a new program shows no collisions. What has that actually proven?",
      options: [
        {
          id: "a",
          text: "That the toolpath does not collide with the geometry somebody modelled — which says nothing about clamps, fixtures, real tool lengths or the true datum unless every one of those was modelled correctly.",
          correct: true,
          feedback:
            "Correct. A simulation checks the model of the world, not the world. That is precisely why proving out on the machine, in single block and at low override, is a separate and non-optional step.",
        },
        {
          id: "b",
          text: "That the program is safe to run at full feed and rapid on the first part.",
          correct: false,
          feedback:
            "Tempting, because a clean simulation feels like a pass certificate and there is real pressure to save time. It breaks because most crashes come from setup errors the simulation never saw.",
        },
        {
          id: "c",
          text: "That the tool is long enough to reach the bottom of every feature without the holder touching the part.",
          correct: false,
          feedback:
            "Tempting, because you watch the holder sweep past in the animation. It breaks because the tool and holder shown have exactly the length somebody typed into the library; a real tool set 8 mm shorter makes that a picture of a different tool.",
        },
        {
          id: "d",
          text: "Nothing at all — simulation is decorative and adds no real safety value.",
          correct: false,
          feedback:
            "Tempting as a corrective to over-trusting software, but it swings too far. Simulation reliably catches gouges and rapid moves through stock. The fault is treating its output as proof about physical things it was never told.",
        },
      ],
      teaching:
        "Verification and validation are different jobs. Simulation verifies the program against the model; only proving out on the machine, with the real fixture and real tools, validates the setup.",
    },
    {
      id: "cad-to-part-q5",
      prompt: "A program simulates cleanly, but the first part comes out 0.4 mm too deep on every milled feature. What should you suspect first?",
      options: [
        {
          id: "a",
          text: "The `Z` datum stored in the work offset does not match the surface the program was written from.",
          correct: true,
          feedback:
            "Correct. A uniform error in one axis across every feature is the signature of a reference problem: the machine executed the program faithfully, but measured it from a point 0.4 mm away from the assumed one.",
        },
        {
          id: "b",
          text: "The CAD model has the pocket depths wrong.",
          correct: false,
          feedback:
            "Tempting, because a model error would indeed give wrong depths. It breaks on the word every: the mistake would have to be repeated identically on all features, and you would have seen it in the simulation.",
        },
        {
          id: "c",
          text: "The cutting speed is too high, so the tool cuts deeper than commanded.",
          correct: false,
          feedback:
            "Tempting, because excessive speed causes real, visible problems. It breaks because speed does not set depth — depth comes from commanded position, and excess speed would burn the finish and kill the tool first.",
        },
        {
          id: "d",
          text: "The post-processor has written the arcs in the wrong format.",
          correct: false,
          feedback:
            "Tempting, because arc format is a classic post-processor failure. It breaks because that fault gives distorted or wrongly sized curves, or an alarm — a shape error, not an identical depth offset on flat features too.",
        },
      ],
      teaching:
        "Read the pattern of an error before its size. Uniform in one axis points at a datum or offset; uniform on one feature points at a tool diameter; random points at the setup moving.",
      reviewSlug: "understanding-xyz",
    },
    {
      id: "cad-to-part-q6",
      prompt: "Why does CAM offer ramping and helical entries into a pocket rather than plunging the tool straight down?",
      options: [
        {
          id: "a",
          text: "Because most end mills cut poorly or not at all at their exact centre, so a ramp or helix lets the side and corner edges, which are designed to cut, do the work.",
          correct: true,
          feedback:
            "Correct. The cutting speed at the very centre of a rotating tool is zero, so material there is pushed and scraped rather than sliced. Entering at a shallow angle keeps the real cutting edges engaged.",
        },
        {
          id: "b",
          text: "Because a straight plunge would exceed the machine's maximum feed rate.",
          correct: false,
          feedback:
            "Tempting, because feed limits are a genuine constraint and plunging feels aggressive. It breaks because a plunge is normally programmed slower than the cut, not faster; the limit reached is the tool's geometry.",
        },
        {
          id: "c",
          text: "Because a helical entry produces a rounder hole than a plunge does.",
          correct: false,
          feedback:
            "Tempting, and a helix genuinely does bore a decent round hole. But you are opening a pocket that is about to be cut away, so the reason is how the tool is loaded, not the quality of the opening.",
        },
        {
          id: "d",
          text: "Because a CNC control cannot execute a downward move in `Z` at cutting feed.",
          correct: false,
          feedback:
            "Tempting, because CAM shows entry moves separately as if they were special. It breaks because a straight feed move in `Z` is ordinary and is exactly what a drilling cycle does. The constraint is in the cutter, not the control.",
        },
      ],
      teaching:
        "Toolpath strategies are mostly answers to how the tool is loaded. Whenever a path looks needlessly elaborate, ask which load it is smoothing out or avoiding.",
      reviewSlug: "what-is-a-cnc-machine",
    },
  ],
  exercise: {
    title: "Trace one part through the whole chain",
    body: "Follow a simple component from intent to inspection on paper. The part is an aluminium mounting plate, 60 mm × 40 mm × 12 mm, with a square pocket 30 mm × 30 mm and 5 mm deep in the middle of the top face, and four 5.5 mm clearance holes near the corners. The stock is a sawn billet roughly 65 mm × 45 mm × 14 mm with a rough skin. You are not writing code — you are writing down the decisions somebody must make, and where each one belongs.",
    steps: [
      "Write the design intent in three lines. Which dimensions genuinely matter, and why? Assume the plate bolts to a fixed panel through the four corner holes, and that something sits in the pocket and must not rock.",
      "List the operations in cutting order and mark each as roughing or finishing. Decide which face is machined first and what that means for how the part is held afterwards.",
      "Choose a roughing tool diameter, then use the calculator above to find spindle speed, feed rate, removal rate and time for one pass. Reproduce the worked example first (10 mm, four flutes, 200 m/min, 0.05 mm/tooth) to confirm you are driving it correctly, then vary the diameter and watch what must change to hold cutting speed constant.",
      "Decide how the stock is held, sketch the clamps, and mark every place the toolpath would now be a collision. State which of those a CAM simulation would catch and which it would not.",
      "Write down the three pieces of information the machine still needs once the program is loaded, and exactly how a person would obtain each one at the machine.",
      "Write a five-line prove-out plan for the first run, naming the specific machine controls you would use and what you would watch at each stage.",
      "List three measurements you would take on the first part, and for each say where you would go to fix it: the model, the CAM strategy, the speeds and feeds, an offset, or the workholding.",
    ],
    selfCheck: [
      "Your design intent separates the few dimensions that control function — corner hole positions relative to each other, pocket size and depth — from those that merely close the shape, such as the outside length of the plate.",
      "Your operation list leaves an even, deliberate stock allowance on the pocket walls and floor before finishing, rather than cutting to size in one go, and you can say roughly how much and why.",
      "Your speeds and feeds were derived, not guessed: spindle speed from cutting speed and diameter, feed rate from spindle speed, tooth count and feed per tooth — and the worked example reproduced 6366 rev/min and 1273 mm/min.",
      "Your list of what the machine still needs covers workholding, a work offset set from a real feature on the real part, and a measured length for every tool, with a practical method named for each.",
      "Your prove-out plan names single block, a dry run and reduced feed and rapid overrides, and states explicitly that a clean simulation says nothing about where the clamps actually are.",
      "Each measurement is matched to a plausible place to fix it, and you can explain why a uniform offset points somewhere different from a poor surface finish.",
    ],
  },
  summary: [
    "The chain runs design intent → CAD model → CAM strategy → post-processor → program → setup → first part → inspection, and each handover trades portability for specificity.",
    "A CAD model carries exact geometry but not intent; tolerances and drawings say which dimensions actually matter.",
    "CAM decides tools, order, stepdown, stepover and entry moves — the how, which the model never contained.",
    "Roughing protects cycle time and the tool by moving metal fast; finishing protects geometry by keeping cutting force low and even.",
    "Cutting speed and feed per tooth describe the cutting edge; n = (vc × 1000) / (π × D) and vf = n × z × fz are what the machine is told.",
    "The canonical example — 10 mm, four flutes, 200 m/min, 0.05 mm/tooth — gives 6366 rev/min, 1273 mm/min, 19.1 cm³/min and 11.8 s over 250 mm.",
    "The post-processor exists because CAM is machine-agnostic and machines are not; it writes one toolpath into one control's dialect and is owned per machine.",
    "Workholding, datum setting and tool measurement happen only at the machine, and a clean simulation proves nothing about any of them — which is why new programs are proved out, not just run.",
  ],
  nextSlug: "understanding-xyz",
};
