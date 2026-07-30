import type { Lesson } from "../types";

export const selectingAnArchitecture: Lesson = {
  slug: "selecting-an-architecture",
  level: 20,
  title: "Selecting an architecture for a brief",
  minutes: 26,
  intro:
    "This is the lesson where the course stops explaining machines and starts designing one. You will learn a repeatable method for turning a customer's description of their work into a shortlist of machine layouts, a defensible choice between them, and a written record a reviewer can argue with. There is no right answer at the end — there is a method, an owned judgement, and a list of the risks you accepted.",

  objectives: [
    "Read a design brief and separate the constraints that genuinely bind the design from the ones that are preferences",
    "Derive a candidate set of axis travels from a workpiece envelope, its fixture, the tool assembly and clearance",
    "State what the workpiece materials and the intended cuts demand of stiffness and of the spindle",
    "Shortlist three or four machine architectures against a brief instead of ranking every layout ever built",
    "Build a weighted decision matrix, and explain honestly why the weights — not the scores — carry the argument",
    "Write a decision record that names the assumption, the evidence, the rejected alternative and the residual risk",
  ],

  terms: [
    {
      term: "Design brief",
      plain:
        "A short written statement of what a machine must do, for whom, in what space, at what cost — written before any design decision is made, so decisions can be checked against it.",
    },
    {
      term: "Binding constraint",
      plain:
        "A requirement that actually limits your choices. If relaxing it would change the design, it binds; if relaxing it changes nothing, it is background information.",
    },
    {
      term: "Work envelope",
      plain:
        "The block of space inside the machine that the tool tip can physically reach — roughly the X, Y and Z travels multiplied together, minus whatever the structure blocks.",
    },
    {
      term: "Axis travel",
      plain:
        "How far one axis can move from end to end, measured at the moving part, in millimetres. It is a property of the machine, not of the part.",
    },
    {
      term: "Daylight",
      plain:
        "The vertical gap between the spindle nose and the table surface. It sets how tall a stack of fixture, workpiece and tool assembly will fit, which is a different question from how far Z can move.",
    },
    {
      term: "Structural loop",
      plain:
        "The closed chain of parts joining the cutting edge to the workpiece — tool, spindle, head, column, base, table, fixture and back. Everything in that chain can bend, and every bend shows up in the part.",
    },
    {
      term: "Machine architecture",
      plain:
        "The overall arrangement of the machine's structure and axes: which member carries which axis, what moves and what stays still. Also called the layout or the configuration.",
    },
    {
      term: "Weighted decision matrix",
      plain:
        "A table that scores each candidate against each criterion, multiplies each score by how much that criterion matters, and adds up the result to give one number per candidate.",
    },
    {
      term: "Criterion weight",
      plain:
        "The number saying how much one criterion matters relative to the others. Weights are a judgement about priorities, never a measurement.",
    },
    {
      term: "Decision record",
      plain:
        "A short written note capturing one decision: what was assumed, what evidence supported it, what alternative was rejected and why, and what could still go wrong.",
    },
    {
      term: "Risk register",
      plain:
        "A running list of the things that could make the design fail, each with a note on how likely it is, how bad it would be, and what you plan to do about it.",
    },
    {
      term: "Concept design",
      plain:
        "An early design that fixes the big choices — layout, travels, rough sizes — without the detail, calculation and validation needed before anything is manufactured.",
    },
  ],

  blocks: [
    { kind: "heading", text: "Choosing is a method, not a hunch" },
    {
      kind: "prose",
      body: [
        "Ask an experienced machine designer why a particular machine is a C-frame rather than a gantry and you will rarely get a rule. You will get a story: this is what the parts looked like, this is the floor they had, this is what they could afford, and this is the compromise we took. That story is the design. The layout is only its conclusion.",
        "The trouble for a beginner is that the story is invisible in the finished machine. You see a shape and assume someone knew a shape was correct. Nobody did. Somebody read a brief, extracted the numbers that could not be moved, worked out what the parts demanded, put three or four layouts side by side, argued about which criteria mattered most, and wrote down what they gave up.",
        "This lesson teaches that sequence as six steps: read the brief, extract what binds, derive the travels, establish what the cutting demands, shortlist and score, then write the decision down so somebody else can disagree with it. Work the steps and you will produce a defensible concept. Skip to the shortlist and you will produce a preference dressed up as engineering.",
      ],
    },
    {
      kind: "note",
      title: "What this lesson gives you, and what it does not",
      body:
        "It gives you a method and one worked example. It does not give you a correct architecture for your own machine, because that depends on a brief only you have. Every number worked here is an educational estimate for teaching the method — it is not a specification, and it does not replace manufacturer calculations or professional engineering validation.",
    },

    { kind: "heading", text: "Step one — read the brief, twice" },
    {
      kind: "prose",
      body: [
        "A design brief is a short written statement of what the machine must do, for whom, in what space and at what cost. Read it once for the shape of the problem. Read it again with a pencil, marking every sentence that contains a number, a limit or a preference, because those three kinds of sentence behave completely differently in a design.",
        "Numbers and limits constrain you. Preferences rank your options when the numbers leave you a choice. Confusing the two is the fastest way to over-design a machine: you end up treating 'they would like it to be quick' as though it were 'it must fit through a 2.0 m door'.",
      ],
    },
    {
      kind: "example",
      title: "The brief we will work: Northgate Prototyping",
      body: [
        "Northgate Prototyping is a six-person workshop making prototype and short-run parts. They want a compact three-axis vertical milling machine of their own specification.",
        "Workpieces: up to `400 × 300 × 150 mm`, mostly 6082 aluminium and mild steel, occasionally stainless. Floor space limited to about `2.0 × 2.0 m` with a `2.4 m` ceiling. Three-phase supply is available. Budget is modest.",
        "They value repeatable results, easy setup and serviceability far above maximum metal removal rate. Expected use is one to two shifts a day, operated by competent machinists who are not machine builders. They have a surface plate, a height gauge and dial indicators, but no laser interferometer.",
        "That is the whole brief. Every decision from here has to be argued against those sentences and nothing else — not against what would be impressive, and not against what a catalogue happens to offer.",
      ],
    },

    { kind: "heading", text: "Step two — separate what binds from what is background" },
    {
      kind: "prose",
      body: [
        "A binding constraint is one where relaxing it would change your design. Test each line by asking: if this were twice as generous, would I choose differently? If yes, it binds. If no, it is background — true, useful, but not driving anything.",
        "Work the Northgate lines that way and the picture sharpens quickly. The `2.0 × 2.0 m` footprint binds hard: it will eliminate layouts before you have costed them. 'Three-phase supply is available' does not bind at all at concept stage — it removes a constraint rather than imposing one. And the sentence about valuing repeatability and serviceability over removal rate does not constrain anything directly; it sets the weights you will use later, which makes it arguably the most powerful sentence in the brief.",
      ],
    },
    {
      kind: "compare",
      title: "Sorting the Northgate brief line by line",
      columns: ["What it controls", "Does it bind?", "What it rules out"],
      rows: [
        {
          label: "Workpieces up to `400 × 300 × 150 mm`",
          cells: [
            "Axis travels, table size, daylight, table load rating.",
            "Binds hard — it is the origin of every dimension downstream.",
            "Anything with under about `450 mm` of X travel, and any table too small to clamp the part safely.",
          ],
        },
        {
          label: "Mostly 6082 aluminium and mild steel, occasionally stainless",
          cells: [
            "Spindle speed and torque range, structural stiffness, chip and coolant handling.",
            "Binds — aluminium wants speed, steel and stainless want torque and stiffness at low speed.",
            "A high-speed router-style spindle with little low-speed torque; a light structure sized only for aluminium.",
          ],
        },
        {
          label: "Floor space about `2.0 × 2.0 m`, ceiling `2.4 m`",
          cells: [
            "Overall machine envelope including doors open, chip access and service access.",
            "Binds hard — many layouts need far more floor than their travels suggest.",
            "Long-bed moving-table layouts whose table sweeps well beyond the machine body.",
          ],
        },
        {
          label: "Three-phase supply available",
          cells: [
            "Available spindle and drive power.",
            "Does not bind — it removes a limit rather than imposing one.",
            "Nothing at concept stage. It becomes a real constraint only when the electrical design is done by a qualified engineer.",
          ],
        },
        {
          label: "Budget is modest",
          cells: [
            "Component grades, structural material, build hours, degree of in-house manufacture.",
            "Binds — but softly, because 'modest' is not a number. Ask for one.",
            "Nothing yet. Until it is quantified it can only be used to break ties.",
          ],
        },
        {
          label: "Values repeatability, setup and serviceability over removal rate",
          cells: [
            "The criterion weights in your decision matrix.",
            "Does not constrain, but decides — it tells you what to optimise when the numbers allow a choice.",
            "Any argument that begins 'but this layout removes more metal per minute'.",
          ],
        },
        {
          label: "Competent machinists, not machine builders; no interferometer",
          cells: [
            "Setup ergonomics, serviceability, and how the machine's geometry can be proven and re-proven.",
            "Binds — a design that can only be aligned with instruments the owner does not have is not usable by the owner.",
            "Layouts whose alignment depends on measurements Northgate cannot make or buy in regularly.",
          ],
        },
      ],
    },

    { kind: "heading", text: "Step three — derive the travels from the parts" },
    {
      kind: "prose",
      body: [
        "Axis travel is how far one axis can move from end to end. It is a property of the machine, and beginners almost always set it by copying a machine they admire. Derive it instead. The workpiece is only the innermost layer of a stack: around it sits the fixture that holds it, around that the clearance the cutter needs to run fully on and off the part, and above it the whole tool assembly hanging out of the spindle.",
        "So the derivation for a horizontal axis is: the part, plus whatever the fixture adds in that direction, plus clearance at each end. For the vertical axis it is different, and this is where most first attempts go wrong, so it gets its own treatment below.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression:
          "X = w + 2c     Y = d + 2c     Daylight = f + h + L_tool + c",
        variables: [
          { symbol: "X", meaning: "required travel along the long horizontal axis", unit: "mm" },
          { symbol: "Y", meaning: "required travel along the cross horizontal axis", unit: "mm" },
          { symbol: "w", meaning: "largest workpiece dimension in the X direction", unit: "mm" },
          { symbol: "d", meaning: "largest workpiece dimension in the Y direction", unit: "mm" },
          { symbol: "h", meaning: "largest workpiece height", unit: "mm" },
          { symbol: "f", meaning: "height the fixture adds under the workpiece", unit: "mm" },
          {
            symbol: "L_tool",
            meaning: "length of the longest tool and holder measured from the spindle nose",
            unit: "mm",
          },
          {
            symbol: "c",
            meaning: "clearance so the cutter runs fully on and off the part, and so tools can be changed",
            unit: "mm",
          },
        ],
        meaning:
          "It tells you to stop copying travels off a competitor's brochure and to build them up from the largest part you have actually agreed to make, plus the hardware around it. It also separates daylight from Z travel: daylight is how tall a stack fits under the spindle, Z travel is how far the head can move — they are different numbers and sizing one from the other is a classic error.",
      },
    },
    {
      kind: "example",
      title: "Working Northgate's travels",
      body: [
        "Start with X. The part is `400 mm` long. A cutter must be able to start clear of the material and finish clear of it, so allow about `25 mm` at each end: `X = 400 + 2 × 25 = 450 mm`. Round up to `500 mm` so the part does not have to be centred perfectly and a fixture can overhang a little.",
        "Y is the same reasoning: `Y = 300 + 2 × 25 = 350 mm`, rounded up to `400 mm`. The extra `50 mm` is not decoration — it is what lets a vice sit slightly off-centre without losing reach.",
        "Now the vertical stack. A typical machine vice adds about `150 mm` under the part. The part is `150 mm` tall. The longest tool and holder projecting from the spindle nose might be `150 mm`. Add `50 mm` of clearance so a tool can be changed with the part in place: daylight `= 150 + 150 + 150 + 50 = 500 mm` from spindle nose to table.",
        "Z travel is the separate question of how far the head must move. It has to cover the `150 mm` part depth, plus the difference in length between the shortest and longest tools — say `120 mm` — plus about `30 mm` of retract clearance: `150 + 120 + 30 = 300 mm`, rounded to `350 mm`.",
        "Finally, mass. A steel workpiece at `400 × 300 × 150 mm` is `0.018 m³`; at roughly `7850 kg/m³` that is about `141 kg`. Add a vice of about `40 kg` and the table and saddle themselves, and a moving mass of about `250 kg` on the X axis is a sensible first estimate. Hold that number — it is exactly the mass used in the axis-sizing calculator's worked example.",
        "Candidate travel set, then: `X = 500 mm`, `Y = 400 mm`, `Z = 350 mm`, daylight `500 mm`, table rated for at least `250 kg`. Every one of those numbers is traceable to a sentence in the brief. That is the whole point of deriving rather than copying.",
        "One warning about the rounding. Going from `450 mm` to `500 mm` of X travel costs money, floor space and stiffness, because a longer axis is a longer structural loop. Record each rounding as a decision with a reason — 'to allow off-centre clamping and fixture overhang' — rather than as tidiness. A reviewer is entitled to ask why you spent `50 mm`.",
      ],
    },

    { kind: "heading", text: "Step four — what the material and the cut demand" },
    {
      kind: "prose",
      body: [
        "Travels tell you how big the machine is. The materials and the cuts tell you how strong and how fast it has to be. Northgate names three materials, and they pull in opposite directions: aluminium rewards high spindle speed and generous feed, while steel and stainless want lower speed, more torque, and above all a structure that does not flex when the cutting force pushes back.",
        "You cannot resolve that conflict by picking a middle value. You resolve it by working the numbers at both ends and then stating which end you protected and which you compromised.",
      ],
    },
    {
      kind: "example",
      title: "The two ends of Northgate's spindle requirement",
      body: [
        "Take a `10 mm` four-flute carbide end mill in aluminium at a cutting speed of `vc = 200 m/min`, with a feed per tooth of `fz = 0.05 mm/tooth`, an axial depth `ap = 5 mm` and a radial width `ae = 3 mm` over a `250 mm` pass.",
        "Spindle speed: `n = (vc × 1000) / (π × D) = (200 × 1000) / (π × 10) = 6366 rev/min`. Feed rate: `vf = n × z × fz = 6366 × 4 × 0.05 = 1273 mm/min`. Metal removal rate: `Q = (ap × ae × vf) / 1000 = (5 × 3 × 1273) / 1000 = 19.1 cm³/min`. Pass time: `t = L / vf = 250 / 1273 = 0.196 min`, about `11.8 s`.",
        "Now the other end. The same `10 mm` cutter in mild steel might run at `vc = 80 m/min`, giving `n = (80 × 1000) / (π × 10) = 2546 rev/min` — an illustrative order of magnitude, not a recommendation. The spindle therefore has to be useful from roughly `2500` to well over `6000 rev/min`, and it must still deliver torque at the bottom of that band, because that is where the steel and stainless work lives.",
        "The structural consequence follows immediately. Aluminium at `19.1 cm³/min` is a light load on the frame. Steel at a fraction of that removal rate is a much heavier one, because the force per cubic centimetre removed is far higher. Northgate's structure is sized by the steel and stainless work, not by the aluminium — even though most of the parts are aluminium.",
      ],
    },
    {
      kind: "note",
      title: "Shop units and their SI relationship",
      body:
        "Spindle speed is quoted in rev/min, cutting speed in m/min and feed in mm/min, because that is what shop-floor tooling data uses. In SI, `1 rev/min = 2π / 60 rad/s ≈ 0.105 rad/s`, so `6366 rev/min` is about `667 rad/s`. Feed `1273 mm/min` is about `0.0212 m/s`. Use the shop units to talk to machinists; use SI when you do physics.",
    },
    {
      kind: "prose",
      body: [
        "One more sanity check before the layouts. With the moving mass of about `250 kg` from the travel derivation, a rapid speed of `30 m/min` (`0.5 m/s`), an acceleration of `3 m/s²`, a process force of `800 N` and a `10 mm` lead ball screw at `0.90` efficiency, the X axis needs roughly `1562 N` of thrust and about `2.76 N·m` at the screw, spinning at `3000 rev/min`. Those are not final numbers — they ignore screw inertia, bearing and coupling losses, duty cycle, thermal limits and critical speed — but they confirm the concept is drivable by ordinary components rather than something exotic. Run them yourself on the axis-sizing calculator.",
        "That is the useful discipline: before you argue about architecture, prove that the size of machine your brief implies is buildable at all. If the sums had come back demanding an enormous motor, the brief itself would need renegotiating, not the layout.",
      ],
    },

    { kind: "heading", text: "Step five — shortlist, then score" },
    {
      kind: "prose",
      body: [
        "Machine architecture means the overall arrangement of structure and axes: which member carries which axis, what moves and what stays still. There are many named layouts, and it is tempting to rank them all. Do not. A shortlist of three or four candidates that plausibly satisfy the binding constraints is a design tool; a league table of nine is a distraction that hides the real argument.",
        "For Northgate, three survive first contact with the brief. A C-frame with a moving table is the classic small vertical mill: a fixed column, the head moving in Z, and the workpiece carried on a table that moves in X and Y. A moving-column machine leaves the table fixed to the base and moves the column instead. A bridge — sometimes called a gantry — spans a fixed table on two legs, with the head travelling along the bridge.",
        "Each brings a different relationship between the cutting edge and the workpiece: a different structural loop, that closed chain of parts from tool tip through spindle, head, structure, table and fixture back to the cut. Everything in that chain can bend, and everything that bends shows up in the part. Shorter, stiffer, more symmetric loops are better — but they cost floor space, money or access, which is where the argument starts.",
      ],
    },
    {
      kind: "figure",
      figure: "architectures",
      caption:
        "The shortlisted layouts side by side. Look at two things in each: how long the path is from the cutting edge back to the workpiece through the structure, and how much floor the machine sweeps as its axes travel. The first governs stiffness at the tool point, the second governs whether it fits Northgate's `2.0 × 2.0 m` bay.",
    },
    {
      kind: "prose",
      body: [
        "Now score them. Pick criteria that come from the brief rather than from general good taste — for Northgate: stiffness at the tool point, footprint, cost, serviceability, chip clearance and setup ergonomics. Score each candidate `1` to `5` on each criterion, weight the criteria by how much the brief says they matter, multiply and add.",
        "Two rules keep the exercise honest. Write a reason beside every score, so a reviewer can attack the reason rather than the digit. And declare the weights before you score, because it is remarkably easy to nudge weights afterwards until your favourite wins.",
      ],
    },
    {
      kind: "compare",
      title: "Weighted decision matrix — Northgate architecture choice (educational example)",
      columns: ["C-frame, moving table", "Moving column, fixed table", "Bridge over fixed table"],
      rows: [
        {
          label: "Stiffness at the tool point (weight `0.25`)",
          cells: [
            "`4` — short loop, head close to a deep column, table sitting low over the base.",
            "`3` — the column is the moving member, so its guideways carry the whole overturning moment.",
            "`4` — symmetric two-legged span resists the cutting force evenly, but Z reaches down through the bridge.",
          ],
        },
        {
          label: "Footprint for these travels (weight `0.20`)",
          cells: [
            "`2` — a table with `500 mm` of X travel sweeps roughly `1 m` across, so the bay must be far wider than the machine.",
            "`4` — the table never moves, so the floor needed is close to the machine's own width.",
            "`4` — the fixed table keeps the footprint compact for the travel offered.",
          ],
        },
        {
          label: "Cost to design, build and buy (weight `0.20`)",
          cells: [
            "`5` — the most conventional layout, best served by off-the-shelf castings, components and know-how.",
            "`3` — fewer standard parts, and the moving column needs larger, stiffer guideways.",
            "`3` — two legs and a bridge mean more machined joints and more alignment work.",
          ],
        },
        {
          label: "Serviceability (weight `0.15`)",
          cells: [
            "`4` — screws and rails are reachable once way covers are off; a familiar layout to any fitter.",
            "`3` — services must travel with the column, so cable and hose management is harder.",
            "`3` — the Z assembly sits inside the span, which is awkward to reach and to lift out.",
          ],
        },
        {
          label: "Chip clearance (weight `0.10`)",
          cells: [
            "`3` — chips land on a moving table and ride into the way covers.",
            "`4` — a fixed table can be sloped and drained straight into a tray.",
            "`4` — chips fall clear of the moving structure into the space under the bridge.",
          ],
        },
        {
          label: "Setup ergonomics (weight `0.10`)",
          cells: [
            "`4` — the table can be driven towards the door for loading.",
            "`5` — the workpiece never moves, so datums, clamps and indicators stay where you set them.",
            "`3` — loading means reaching in between two legs, which is awkward for a `141 kg` steel block.",
          ],
        },
        {
          label: "Weighted total — brief's own weights",
          cells: ["`3.70`", "`3.50`", "`3.55`"],
        },
        {
          label: "Weighted total — footprint `0.30`, cost `0.10`",
          cells: ["`3.40`", "`3.60`", "`3.65`"],
        },
      ],
    },
    {
      kind: "prose",
      body: [
        "Look hard at those last two rows. On the first weighting the C-frame wins by `0.15` — about four per cent. Move two weights, giving footprint `0.30` instead of `0.20` and cost `0.10` instead of `0.20`, and the ranking inverts completely: the bridge leads at `3.65`, the moving column takes second, and the C-frame drops to last. No score changed. Not one judgement about any machine changed. Only the statement of what matters changed.",
        "That is the honest lesson of a decision matrix. It is not a machine for discovering the right answer; it is a machine for making your priorities explicit and checking that your conclusion follows from them. When the totals are that close, the correct thing to write is not 'the C-frame scored highest' but 'these three are within the resolution of the method, so the choice rests on the weights, and here is why we weighted them this way'.",
        "For Northgate the defensible line is roughly this. The footprint constraint is real but survivable if the machine is placed with its table sweep along the length of the bay. The budget is modest and the buyers are machinists, not machine builders, so conventionality has genuine value: parts are available, fitters recognise it, and alignment can be checked with a surface plate, a height gauge and dial indicators — which is exactly what Northgate owns. The C-frame is chosen not because it scored `3.70` but because its weakest criterion, footprint, can be managed by layout, whereas the bridge's weakest criteria — cost and setup ergonomics for a `141 kg` block — cannot.",
      ],
    },
    {
      kind: "deeper",
      title: "How the weighted sum actually works, and three ways it misleads",
      body: [
        "The arithmetic is a weighted sum: each candidate's total is every criterion's weight multiplied by that candidate's score on it, all added together. With weights that add to `1.00` and scores from `1` to `5`, every total also lands between `1` and `5`, which makes candidates directly comparable.",
        "First failure mode: false precision. Scores are judgements on a coarse scale, so a total is worth at most two significant figures. Treating a `3.70` as meaningfully better than a `3.55` is reading a difference the method cannot resolve. If the gap is smaller than one score point times the largest weight, call it a tie and decide on other grounds.",
        "Second failure mode: compensation. A weighted sum lets a brilliant score on one criterion cancel a disastrous score on another. Real designs do not work that way — a machine that does not fit the building is not rescued by being cheap. Handle genuine limits as pass/fail gates applied before scoring, and score only the candidates that pass.",
        "Third failure mode: correlated criteria. If you list 'stiffness', 'rigidity' and 'chatter resistance' as three criteria, you have effectively tripled the weight on one property without saying so. Keep criteria as independent as you can, and be suspicious when two of them always move together.",
      ],
      formula: {
        expression: "S_j = Σ (w_i × s_ij)     with Σ w_i = 1",
        variables: [
          { symbol: "S_j", meaning: "weighted total for candidate j", unit: "dimensionless, 1 to 5" },
          { symbol: "w_i", meaning: "weight of criterion i — how much it matters", unit: "dimensionless, sums to 1" },
          { symbol: "s_ij", meaning: "score of candidate j against criterion i", unit: "dimensionless, 1 to 5" },
        ],
        meaning:
          "It tells you where to spend your review effort. The scores are the easy part and get argued about most; the weights carry the conclusion and usually get set in thirty seconds. Rerun the sum with your weights moved by a quarter — if the winner changes, you have not made a decision yet, you have made an assumption.",
      },
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong:
            "Choosing the architecture first — 'we're building a gantry' — and then working out what parts it will make.",
          why:
            "The layout is the conclusion of the argument, so choosing it first means every later decision has to be bent to justify it. You discover the mismatch when the travels come out wrong or the machine will not fit, by which time the structure is drawn and nobody wants to start again.",
        },
        {
          wrong:
            "Sizing the travels for the biggest part anyone can imagine ever making, rather than the parts in the brief.",
          why:
            "Every extra millimetre of travel lengthens the structural loop, adds moving mass and costs money and floor space — so you pay for that imaginary part on every real part, in reduced stiffness and slower moves. If a bigger part genuinely matters, it belongs in the brief where it can be argued about, not smuggled in as a safety margin.",
        },
        {
          wrong:
            "Presenting the weighted matrix as an objective result, because it contains arithmetic.",
          why:
            "The arithmetic is objective; the weights are the argument, and they are pure judgement. Two competent engineers with the same scores and different weights reach different machines, both correctly. A matrix presented without its weights defended is a decision hidden inside a table.",
        },
        {
          wrong:
            "Confusing daylight with Z travel and sizing the column from the wrong one.",
          why:
            "Daylight is the static gap between spindle nose and table that a fixture, part and tool assembly must fit inside. Z travel is how far the head can move. Size the column from Z travel alone and long tools will not clear the part; size it from daylight alone and you buy an unnecessarily tall, less stiff machine.",
        },
        {
          wrong:
            "Treating a near-tie in the matrix as a win and moving straight on to detail design.",
          why:
            "Differences smaller than the method's resolution are noise. Recording 'the C-frame won' when three candidates sat within four per cent hides the fact that the decision actually rested on weights, and it robs a later reviewer of the chance to challenge the only thing that mattered.",
        },
      ],
    },

    { kind: "heading", text: "Step six — write it down so someone can disagree" },
    {
      kind: "prose",
      body: [
        "A decision that lives only in your head cannot be reviewed, and an unreviewable decision is worth very little in engineering. The remedy is a decision record: a short written note with four parts. The assumption you made. The evidence that supported it. The alternative you rejected and the specific reason. The risk you accepted by choosing this way.",
        "Four parts, a few sentences each. The discipline is in being specific enough that a reviewer can attack one part without demolishing the whole document. 'We chose a C-frame because it is stiffer' is not attackable — stiffer than what, under what load, measured how? 'We chose a C-frame because its structural loop is shortest of the three and Northgate's steel work loads the frame hardest' can be argued with, which is what makes it useful.",
        "The fourth part deserves special attention, because it is the one beginners leave out. A risk register is a running list of what could make the design fail, with how likely it is, how serious it would be, and what you intend to do about it. Every decision record should push at least one line into it — a decision with no accepted risk almost always means the trade-off has not been found yet.",
      ],
    },
    {
      kind: "example",
      title: "Decision record DR-04: machine architecture",
      body: [
        "Decision: a C-frame with a fixed column, head moving in Z, and a cross-slide table carrying X and Y. Travels `X = 500 mm`, `Y = 400 mm`, `Z = 350 mm`, daylight `500 mm`, table rated for at least `250 kg`.",
        "Assumption: the largest workpiece stays at `400 × 300 × 150 mm` and fixtures add no more than about `150 mm` beneath it. If either grows, the travel derivation must be rerun before anything is manufactured.",
        "Evidence: travels derived from the workpiece envelope plus fixture, tool projection and clearance; the shortlist scored against six criteria weighted from the brief's own stated priorities; totals of `3.70`, `3.55` and `3.50` are within the method's resolution, so the choice rests on the weights, which we set from the sentence about valuing repeatable results, easy setup and serviceability above removal rate.",
        "Alternative rejected: the bridge layout, which scored comparably and is more compact for its travels. Rejected because loading a `141 kg` steel block between two legs is poor ergonomics for a six-person shop with no crane specified, and because the extra machined joints raise cost against a modest budget. This rejection reverses if Northgate adds a hoist or relaxes the budget.",
        "Risk accepted: the moving table sweeps about `1 m`, so the machine must be sited with its X axis along the length of the `2.0 × 2.0 m` bay. If the bay layout changes, this decision must be reopened. Recorded in the risk register as R-07, with 'confirm bay orientation with Northgate' as the action.",
      ],
    },

    { kind: "heading", text: "The limit of a concept" },
    {
      kind: "safety",
      body:
        "Everything you have just produced is a concept: layout, travels and reasoning. It is not a machine, and it is not close to one. Before any part of such a design is manufactured or operated it must go through professional engineering review — structural analysis of the frame and its loads, electrical design and installation by qualified personnel under the applicable law and standards, and a documented safety and risk assessment covering guarding, interlocks, emergency stop and the safety-related control system. Standards such as ISO 12100, ISO 13849-1, IEC 60204-1 and ISO 16090-1 exist to frame that work: consult the official published documents for their actual requirements, which are not reproduced anywhere in this course. Nothing here substitutes for that review, and no beginner should build and operate an industrial machine tool without it.",
    },
    {
      kind: "prose",
      body: [
        "That warning is not a disclaimer bolted on at the end — it is part of the method. A concept designer's job is to make the big choices clearly and to hand a reviewer everything needed to challenge them. The decision records and the risk register are how you do that handover. They are the deliverable, as much as any drawing.",
        "You now have the whole sequence: read the brief, mark what binds, derive the travels from the parts, establish what the material and the cut demand, shortlist and score with weights you are willing to defend, and write each decision down with its rejected alternative and its accepted risk. That method does not change when the machine gets bigger or the brief gets stranger. Only the numbers do.",
        "The twenty-stage design project at `/project` is where you run it for real. It walks the same Northgate brief through intended use, workpiece and materials, travels, architecture, cutting forces, spindle, structure, guideways, axis drives, motor estimates, electrical and control architecture, auxiliary systems, safety concept, manufacturing, alignment, validation, maintenance and risk — and assembles your choices into a concept report you can hand to a reviewer. This lesson taught you stage four. Go and do the other nineteen.",
      ],
    },
  ],

  knowledgeCheck: [
    {
      id: "arch-travel-derivation",
      prompt:
        "A brief specifies workpieces up to `400 mm` long in X. You allow `25 mm` of clearance at each end so the cutter runs fully on and off the part. What is the minimum X travel, and what else should you check before writing it down?",
      options: [
        {
          id: "a",
          text: "`400 mm` — the travel only has to cover the part; the cutter overhangs the end anyway.",
          correct: false,
          feedback:
            "Tempting because the tool does physically hang past the material at the end of a pass. But travel is measured at the axis, and the tool centre still has to reach beyond the part edge for a full-width cut, plus the fixture usually extends past the workpiece. Specify `400 mm` and you will find you cannot machine the last few millimetres of your largest part.",
        },
        {
          id: "b",
          text: "`450 mm` minimum, and you should also check the fixture footprint, whether the part may sit off-centre, and what the extra travel costs in loop length.",
          correct: true,
          feedback:
            "Correct: `400 + 2 × 25 = 450 mm`. The second half matters just as much — rounding up to `500 mm` buys practical tolerance for clamping, but it lengthens the structural loop and adds cost and floor space, so it is a decision to record rather than a tidy-up.",
        },
        {
          id: "c",
          text: "`800 mm` — double the part length, so the table can move fully clear of the spindle in both directions.",
          correct: false,
          feedback:
            "This confuses travel with table sweep. The table does sweep roughly twice the travel across the floor on a moving-table layout, which is a real footprint concern — but that is a reason to check the bay, not to double the specified travel and pay for a much longer, less stiff axis.",
        },
        {
          id: "d",
          text: "It cannot be determined without knowing the cutter diameter.",
          correct: false,
          feedback:
            "A sensible instinct, since the cutter radius does affect exactly how far past the edge the centre must go. But at concept stage the clearance allowance already covers a range of cutter sizes; waiting for a tool list before fixing a travel stalls the design on a detail that the allowance was created to absorb.",
        },
      ],
      teaching:
        "Travels are derived, not copied: workpiece, plus fixture, plus clearance, plus a recorded decision about how much headroom you are buying and why.",
      reviewSlug: "understanding-xyz",
    },
    {
      id: "arch-daylight-vs-z",
      prompt:
        "A learner sizes a column so that Z travel equals the required daylight of `500 mm`, reasoning that this is 'safest'. What is wrong with that reasoning?",
      options: [
        {
          id: "a",
          text: "Nothing — extra Z travel is always useful and costs nothing.",
          correct: false,
          feedback:
            "Attractive because unused travel feels harmless. It is not: a taller column has a longer structural loop, more overhang and lower stiffness at the tool point, plus more mass to accelerate and more cost. Travel you never use still degrades every cut you do make.",
        },
        {
          id: "b",
          text: "They are answers to different questions — daylight is the static stack that must fit under the spindle, Z travel is how far the head moves — and equating them buys an unnecessarily tall, less stiff machine.",
          correct: true,
          feedback:
            "Correct. Daylight covers fixture plus workpiece plus tool assembly plus tool-change clearance. Z travel only has to cover part depth, tool length variation and retract. Sizing one from the other is a common and expensive confusion.",
        },
        {
          id: "c",
          text: "Z travel should always be larger than daylight, so `500 mm` is too small.",
          correct: false,
          feedback:
            "This inverts the relationship. Z travel is normally the smaller number, because the head does not need to descend through the whole stack — the fixture and part occupy most of it. Reversing the rule produces an even taller machine for no benefit.",
        },
      ],
      teaching:
        "Daylight and Z travel are separate specifications derived from separate stacks. Every millimetre of unnecessary height lengthens the structural loop and costs stiffness where it matters most — at the tool point.",
      reviewSlug: "understanding-xyz",
    },
    {
      id: "arch-matrix-weights",
      prompt:
        "Three architectures score `3.70`, `3.55` and `3.50` on a weighted matrix. Changing two weights, without changing any score, reverses the order. What should the design report say?",
      options: [
        {
          id: "a",
          text: "That the first architecture won, since it scored highest under the weights that were chosen.",
          correct: false,
          feedback:
            "It is factually true and it is what most reports say, which is exactly the problem. Stating only the winner conceals that the result hangs on the weights, so a reviewer cannot see — and therefore cannot challenge — the one judgement that actually decided the machine.",
        },
        {
          id: "b",
          text: "That the matrix was inconclusive and a different, more objective method is needed.",
          correct: false,
          feedback:
            "Tempting, because instability feels like a broken tool. But no method removes the judgement about priorities; a 'more objective' method would only bury the same weights deeper. The matrix did its job — it revealed that the candidates are close and that priorities decide.",
        },
        {
          id: "c",
          text: "That the candidates are within the method's resolution, so the decision rests on the weights, and then defend those weights from the brief.",
          correct: true,
          feedback:
            "Correct, and this is the whole point of building the matrix. Reporting the near-tie plus the weight justification tells a reviewer precisely where to push, which is what makes the decision reviewable rather than merely stated.",
        },
        {
          id: "d",
          text: "That the weights should be made equal, since equal weights are neutral.",
          correct: false,
          feedback:
            "Equal weights sound impartial but are simply another judgement — the claim that footprint matters exactly as much as stiffness, which this brief flatly contradicts. Refusing to prioritise is not neutrality; it is declining to use the information the client gave you.",
        },
      ],
      teaching:
        "A weighted matrix makes priorities explicit and checks that the conclusion follows from them. Scores get argued about; weights decide. Always test the result by moving the weights, and report what happens when you do.",
    },
    {
      id: "arch-stiffness-loop",
      prompt:
        "Two candidate layouts offer the same travels in the same footprint. One routes the cutting force from tool to workpiece through four joints; the other through seven. What does that suggest, and what would you still need to check?",
      options: [
        {
          id: "a",
          text: "The seven-joint layout is stiffer, because more joints spread the load over more members.",
          correct: false,
          feedback:
            "Spreading load is a real idea in some structures, but not here. Each joint in a structural loop is a place where parts can move relative to each other under load, so joints tend to subtract stiffness rather than add it. More interfaces means more compliance to find and control.",
        },
        {
          id: "b",
          text: "The four-joint layout is likely stiffer at the tool point, but joint design, member sections and materials could still reverse it.",
          correct: true,
          feedback:
            "Correct, and the caveat is essential. Counting joints is a fast comparison for a shortlist, not a calculation. A short loop made from thin, poorly ribbed sections can easily be more compliant than a longer loop of well-designed ones.",
        },
        {
          id: "c",
          text: "Joint count is irrelevant; only the total mass of the structure matters.",
          correct: false,
          feedback:
            "Mass correlates loosely with stiffness because heavy structures are often thick ones, which is why the shortcut feels reasonable. But stiffness comes from geometry, section and joint quality — you can add hundreds of kilograms in the wrong place and change deflection at the tool point hardly at all.",
        },
      ],
      teaching:
        "The structural loop is the chain from cutting edge through the machine and back to the workpiece. Shorter, stiffer, more symmetric loops deflect less under cutting force — but joint count is a screening heuristic for a shortlist, never a substitute for analysis.",
      reviewSlug: "intro-to-machine-architecture",
    },
    {
      id: "arch-brief-repeatability",
      prompt:
        "The brief says the workshop 'values repeatable results' above maximum metal removal rate, and that it owns a surface plate, a height gauge and dial indicators but no laser interferometer. How should that shape the architecture decision?",
      options: [
        {
          id: "a",
          text: "It means the machine must be specified to a stated positioning accuracy figure, which becomes the deciding criterion.",
          correct: false,
          feedback:
            "It sounds rigorous, and accuracy figures do belong in a specification eventually. But the brief asked for repeatable results, and repeatability — getting back to the same place — is a different property from accuracy, which is getting to the commanded place. Quoting an accuracy figure the buyer cannot measure or verify also promises something they cannot hold you to.",
        },
        {
          id: "b",
          text: "It favours layouts whose geometry can be set and re-proven with the instruments the shop actually owns, and it sets a high weight on serviceability and setup consistency.",
          correct: true,
          feedback:
            "Correct on both counts. A design whose alignment can only be verified with equipment the owner does not have will drift out of true and stay that way. The sentence also tells you which weights to raise, which is how a preference legitimately enters the decision.",
        },
        {
          id: "c",
          text: "It means the machine can be built to loose tolerances, since they are not chasing maximum performance.",
          correct: false,
          feedback:
            "This misreads which performance they gave up. They deprioritised removal rate, not precision — they explicitly asked for repeatable results. Loose tolerances in the guideways and screws attack precisely the property they said they cared most about.",
        },
        {
          id: "d",
          text: "It is a preference, not a constraint, so it should be noted and set aside during the architecture choice.",
          correct: false,
          feedback:
            "Half right, and the half that is wrong matters. It is indeed not a numerical constraint — but preferences are exactly what set the criterion weights, and the weights decide the outcome when candidates score closely. Setting it aside discards the client's clearest statement of what good looks like.",
        },
      ],
      teaching:
        "Constraints eliminate options; stated priorities weight the ones that survive. A brief's sentences about values and available instruments are engineering inputs, not politeness.",
      reviewSlug: "accuracy-repeatability-resolution",
    },
  ],

  exercise: {
    title: "Run the method on a brief of your own",
    body:
      "Write a one-paragraph brief for a machine you would genuinely like to exist — for a workshop you know, a club, a school, or your own bench — then work the six steps on it. The point is not to design well on your first attempt. It is to notice how much of the design is already decided by the time you finish step two, and to catch yourself reaching for a layout before you have earned it. Keep everything on two sides of paper.",
    steps: [
      "Write the brief in one paragraph. It must contain a largest workpiece with three dimensions, at least two materials, a space limit, something about who will operate and maintain it, and one sentence saying what they value most.",
      "Go through it line by line and mark each as binding, background, or a priority that will become a weight. For anything vague — 'modest budget', 'not too big' — write the question you would ask the client to turn it into a number.",
      "Derive your travels. Show the arithmetic: part, plus fixture, plus clearance for each horizontal axis, and a separate stack for daylight. Then decide your rounding and write one sentence justifying each rounded number.",
      "State what the materials and cuts demand. Work a spindle speed at the top and bottom of your material range using `n = (vc × 1000) / (π × D)`, and say in one sentence which material sizes the structure and why.",
      "Shortlist exactly three architectures. For each, write one sentence on its structural loop and one on its footprint for your travels. Resist adding a fourth.",
      "Build the matrix: your criteria from your brief, weights declared before you score, scores `1` to `5` with a written reason beside every one. Total it, then rerun it with your two largest weights swapped and record whether the winner changes.",
      "Write one decision record for the architecture, with all four parts — assumption, evidence, rejected alternative and why, accepted risk — and push at least one line into a risk register.",
    ],
    selfCheck: [
      "Every travel number traces back to a sentence in your brief through visible arithmetic. If you cannot say which sentence produced a number, it came from a machine you admire rather than from your brief.",
      "Daylight and Z travel are two different numbers with two different derivations, and you can say what each stack contains.",
      "Your weights were written down before any score was, and you can defend each one by quoting the brief rather than by explaining what good machines are generally like.",
      "You ran the matrix a second time with weights moved. Whether or not the winner changed, the result is recorded — a stable winner is evidence, and an unstable one is a finding.",
      "Your decision record names a specific rejected alternative and a specific reason, states the condition under which the rejection would reverse, and pushes at least one honest risk into the register.",
      "Nowhere have you claimed an accuracy, a tolerance or a standard requirement you cannot support. Concept work states what it assumed, not what it achieved.",
    ],
  },

  summary: [
    "An architecture is the conclusion of an argument about a brief, never a starting preference.",
    "Test each line of a brief by asking whether relaxing it would change the design; only then does it bind.",
    "Derive travels from the workpiece plus fixture plus clearance, and treat every rounding-up as a recorded decision.",
    "Daylight is the static stack under the spindle; Z travel is how far the head moves. They are different numbers.",
    "The hardest material sizes the structure even when the commonest material is softer, and a shortlist of three or four layouts beats a league table.",
    "In a weighted matrix the scores get debated but the weights decide; always rerun it with the weights moved.",
    "A decision is only engineering when it is written down with its assumption, evidence, rejected alternative and accepted risk.",
    "A concept is a handover to reviewers: structural, electrical and safety review must precede any manufacture or operation.",
  ],
};
