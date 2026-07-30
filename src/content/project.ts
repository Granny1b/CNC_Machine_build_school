/**
 * The twenty-stage design project. SPEC.md section 12.
 *
 * The brief is fictional and fixed: every stage argues against the same
 * sentences, and the numbers quoted here agree with the worked example in the
 * lesson `selecting-an-architecture`. Stages 1-10 carry full decision data.
 * Stages 11-20 set out what the stage decides, what it needs from earlier
 * stages, the trade-offs, and self-check questions.
 *
 * Authoring convention, shared with the lesson and scenario content: measured
 * or calculated values are wrapped in backticks so the renderer can set them in
 * mono tabular figures without the author writing markup. See SPEC 5.2.
 *
 * Every number in this file is an educational estimate for teaching a method.
 * None of it is a specification, and nothing here replaces manufacturer
 * calculations or professional engineering validation.
 */

import type { ProjectStage } from "./types";

export const projectBrief: {
  title: string;
  paragraphs: string[];
  constraints: { label: string; value: string }[];
} = {
  title: "Northgate Prototyping — a compact three-axis vertical milling machine",
  paragraphs: [
    "Northgate Prototyping is a six-person workshop making prototype and short-run parts. They want a compact three-axis vertical milling machine of their own specification.",
    "Workpieces: up to `400 × 300 × 150 mm`, mostly 6082 aluminium and mild steel, occasionally stainless. Floor space limited to about `2.0 × 2.0 m` with a `2.4 m` ceiling. Three-phase supply is available. Budget is modest.",
    "They value repeatable results, easy setup and serviceability far above maximum metal removal rate. Expected use is one to two shifts a day, operated by competent machinists who are not machine builders. They have a surface plate, a height gauge and dial indicators, but no laser interferometer.",
    "That is the whole brief. Every decision you make in the twenty stages below has to be argued against those sentences and nothing else — not against what would be impressive, and not against what a catalogue happens to offer. Where a sentence is vague, the honest move is to name the question you would ask Northgate rather than to invent an answer.",
  ],
  constraints: [
    { label: "Workshop", value: "six people, prototype and short-run parts" },
    { label: "Machine type wanted", value: "compact three-axis vertical mill" },
    { label: "Largest workpiece", value: "`400 × 300 × 150 mm`" },
    { label: "Materials", value: "6082 aluminium, mild steel, occasionally stainless" },
    { label: "Floor space", value: "about `2.0 × 2.0 m`, ceiling `2.4 m`" },
    { label: "Electrical supply", value: "three-phase available" },
    { label: "Budget", value: "modest — not yet a number, so ask for one" },
    { label: "Duty", value: "one to two shifts a day" },
    { label: "Operators", value: "competent machinists, not machine builders" },
    {
      label: "Metrology owned",
      value: "surface plate, height gauge, dial indicators; no laser interferometer",
    },
    {
      label: "Stated priorities",
      value: "repeatable results, easy setup, serviceability — above removal rate",
    },
  ],
};

export const projectStages: ProjectStage[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    id: "intended-use",
    number: 1,
    title: "Intended use",
    brief:
      "Every later decision in this project answers a question this stage asks: what is this machine actually for? A brief describes a workshop's work. It does not describe their machine. Turning one into the other is the first act of design, and it is the one beginners skip fastest — usually by reaching for a machine they admire and working backwards.\n\nA statement of intended use is a short sentence you can hold every later choice against. It names the kind of work, the mix of materials, the pattern of use and the thing the machine is being optimised for. It is useful precisely because it excludes things: a machine optimised for fast setup is not the same machine as one optimised for cycle time, even when both are compact three-axis mills with the same travels.\n\nNorthgate gave you the raw material for that sentence. They make prototype and short-run parts in mixed materials, they run one to two shifts, their operators are machinists rather than machine builders, and they said in plain words that they value repeatable results, easy setup and serviceability far above maximum metal removal rate. That last sentence is the most powerful one in the brief, because it tells you what to do whenever the numbers leave you a genuine choice.\n\nChoose the statement of intended use you will design against. Every stage that follows will quote it back at you.",
    decision: {
      question:
        "Northgate's brief describes their work, not their machine. Which statement of intended use should this concept be designed against?",
      options: [
        {
          id: "general-prototype",
          name: "A general-purpose prototype and short-run mill",
          recommended: true,
          benefits: [
            "It is the brief restated as an engineering statement rather than a new ambition bolted on to it.",
            "It stays useful when the work mix changes — and in a prototype shop the work mix always changes.",
            "It puts setup time, repeatability and serviceability at the centre, which is exactly what Northgate said they value.",
            "It leaves room to add capability later, such as probing or a fourth axis on the table, without redesigning the structure.",
          ],
          drawbacks: [
            "Nothing is optimised, so a machine built for one job will always beat it on that job.",
            "'General purpose' is vague enough to hide requirements, so every later stage has to name its own worst case explicitly.",
            "It invites a long feature list instead of a short, defensible specification.",
            "It makes the spindle and the structure fight each other: one has to serve aluminium speed and steel torque at once.",
          ],
          cost:
            "Middle of the road, and hard to reduce. A mixed-material machine needs both low-speed torque and high spindle speed, and it needs a structure sized by the hardest material rather than the commonest one. Neither can be stripped out without changing the intended use.",
          performance:
            "Competent everywhere, outstanding nowhere. Aluminium removal rate is capped by a structure sized for steel; steel removal rate is capped by a spindle that also has to reach aluminium speeds. That compromise is the price of the flexibility, and it should be stated in the report rather than hidden.",
          safety:
            "No unusual hazards beyond those any milling machine carries, but frequent new setups is itself the thing to design around: guarding, interlocks and access have to suit an operator who changes the job several times a day rather than once a week. The full safety concept still requires a documented risk assessment carried out by qualified personnel.",
          maintenance:
            "Predictable. Conventional subsystems mean spares are available, service information exists, and a fitter recognises what they are looking at — which matters when the owners are machinists rather than machine builders.",
          fitForBrief:
            "This is the brief with the adjectives removed. Northgate make prototype and short-run parts in three materials, run one to two shifts, and said outright that repeatability, setup and serviceability outrank removal rate. A general-purpose mill is the only statement of intended use that all of those sentences support at once.",
        },
        {
          id: "batch-production",
          name: "A short-run production machine optimised for cycle time",
          benefits: [
            "Gives every later stage a hard number to optimise: seconds per part.",
            "Justifies real productivity features — higher rapids, an automatic tool changer, through-spindle coolant, a more powerful spindle.",
            "Short runs do repeat in a prototype shop, and when they do, cycle time turns directly into capacity.",
            "Makes the business case easy to argue, because saved seconds multiply by quantity.",
          ],
          drawbacks: [
            "It optimises the one thing the brief explicitly deprioritised.",
            "Cycle-time features cost money against a budget described only as modest.",
            "Higher rapids and heavier cuts push moving mass, drive sizing, structure and guarding upwards together.",
            "Short-run work is dominated by setup time, so shaving cutting time often moves the total very little.",
          ],
          cost:
            "The highest of the four for the same work envelope. Cycle time is bought with spindle power, drive capacity, tool changing and chip clearing, and each of those raises both the purchase cost and the electrical installation behind it.",
          performance:
            "Genuinely faster in the cut, and genuinely better when the same part comes back in tens. But in a shop where most jobs are new, the machine spends much of its life waiting for a setup, and the extra capability idles.",
          safety:
            "Higher speeds and heavier cuts raise the energy in the working zone, so guarding, interlocking and chip and coolant containment all have to be designed for more. That is achievable, but it enlarges the risk assessment that qualified personnel must carry out and verify.",
          maintenance:
            "More subsystems means more to maintain: a tool changer, a coolant system under pressure, and drives working closer to their limits. Each is well understood, but each adds a line to the maintenance schedule and a spare to the shelf.",
          fitForBrief:
            "It is a defensible machine for a different customer. Northgate said they value repeatable results, easy setup and serviceability far above maximum metal removal rate — this statement of intended use inverts that sentence. Choose it only if you also record that you have overruled the client's stated priority, and why.",
        },
        {
          id: "aluminium-specialist",
          name: "A light, fast aluminium specialist",
          benefits: [
            "Most of Northgate's parts are 6082 aluminium, so it optimises for the commonest case.",
            "A lighter structure and lighter axes mean faster acceleration, smaller motors and a smaller footprint — all helpful in a `2.0 × 2.0 m` bay.",
            "High spindle speed with modest torque is the cheapest kind of spindle capability to buy.",
            "Less mass to move means lower installed power and a simpler electrical installation.",
          ],
          drawbacks: [
            "The brief names mild steel and stainless as well, and a light structure will chatter or deflect in them.",
            "Structure is sized by the hardest cut, not the most frequent one, so 'mostly aluminium' is not the design case.",
            "Turning down a steel job is a capability loss the shop notices immediately.",
            "A high-speed spindle typically gives up exactly the low-speed torque the steel work needs.",
          ],
          cost:
            "The lowest of the four to build, and that is real money against a modest budget. The saving is genuine — smaller motors, lighter members, less installed power — but it is bought by removing a capability the brief asked for.",
          performance:
            "Excellent in aluminium: high spindle speed, high feed, quick acceleration. Poor in steel and stainless, where lack of stiffness shows up as chatter, poor finish and short tool life long before the motors run out of thrust.",
          safety:
            "High spindle speeds demand attention to tool balance, holder condition and containment — a broken cutter at high speed carries more energy. Guarding and interlocks are still mandatory and still need a documented risk assessment by qualified personnel.",
          maintenance:
            "Simple and light, with fewer heavy assemblies to lift. The risk is a hidden one: if the shop machines steel on it anyway, the machine wears and loses geometry faster than the maintenance plan assumes.",
          fitForBrief:
            "It reads the brief selectively. 'Mostly 6082 aluminium and mild steel, occasionally stainless' is a three-material requirement, and the last two size the structure. Optimising for the first while ignoring the others produces a machine that will disappoint on the jobs Northgate finds hardest.",
        },
        {
          id: "precision-toolroom",
          name: "A precision toolroom machine, accuracy above everything",
          benefits: [
            "Directly serves the brief's stated wish for repeatable results.",
            "Pushes every later stage towards good practice: short structural loops, careful thermal design, high-quality guideways and screws.",
            "A precise machine can always cut roughly; a rough machine can never cut precisely.",
            "Makes the alignment and validation stages central rather than an afterthought.",
          ],
          drawbacks: [
            "Precision is the most expensive property to buy, and the budget is described only as modest.",
            "The brief asked for repeatability, which is not the same property as accuracy, and conflating them buys the wrong thing.",
            "Northgate has no laser interferometer, so accuracy claims could not be verified or re-proven by the owner.",
            "Chasing precision usually slows the machine and complicates setup — the two other things Northgate said they cared about.",
          ],
          cost:
            "The highest per millimetre of travel. Ground screws, higher-grade guideways, careful thermal management and extensive acceptance testing all cost, and the testing needs instruments the shop does not own.",
          performance:
            "The best geometry and the most repeatable results of the four, at the cost of removal rate and of setup speed. Whether the extra precision is usable depends entirely on whether it can be verified and maintained, which for Northgate is doubtful.",
          safety:
            "No special hazards. There is one honest safety-adjacent risk: promising an accuracy the owner cannot measure invites disputes and encourages ad-hoc adjustment of a machine nobody can properly check.",
          maintenance:
            "Demanding. Precision has to be re-proven periodically, and a machine whose alignment can only be checked with a laser interferometer will quietly drift out of true in a shop that does not own one.",
          fitForBrief:
            "Half right, and the wrong half matters. Repeatability — returning to the same place — is what Northgate asked for, and it is achievable with the instruments they own. Absolute accuracy is a different, dearer property they neither asked for nor could verify. Design for repeatability, and record accuracy as an assumption to be tested.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 02 */
  {
    id: "workpiece-size-and-material",
    number: 2,
    title: "Workpiece size and material",
    brief:
      "The workpiece is the origin of the machine. Its size sets the travels, the table and the daylight; its mass sets the table rating and the moving mass on the axes; its material sets the spindle range, the cutting forces and, through them, the stiffness the structure must have. Get this stage wrong and every number downstream is wrong in the same direction.\n\nTwo traps sit here. The first is generosity: adding margin 'just in case' feels prudent, but every extra millimetre lengthens the structural loop, adds mass to accelerate and costs floor space you do not have. The second is optimism: sizing for the commonest material rather than the hardest one. Northgate's parts are mostly aluminium, but the steel and stainless work loads the frame hardest, and a frame that flexes in steel does not stop flexing because most jobs are aluminium.\n\nThere is also a mass to establish, because it drives later stages. A mild steel block at `400 × 300 × 150 mm` is `0.018 m³`; at roughly `7850 kg/m³` that is about `141 kg`. Add a machine vice at perhaps `40 kg` and the table and saddle themselves, and a moving mass of about `250 kg` on the X axis is a sensible first estimate. That is the figure the motor-sizing stage will use, so decide it here deliberately rather than discovering it later.\n\nChoose the envelope every later calculation will be sized against, and say which material sizes the structure.",
    decision: {
      question:
        "Which workpiece and material envelope should every later calculation in this concept be sized against?",
      options: [
        {
          id: "brief-envelope",
          name: "The brief exactly: `400 × 300 × 150 mm`, structure sized by the steel",
          recommended: true,
          benefits: [
            "Every downstream number traces to a sentence a customer actually wrote, which is what makes the design reviewable.",
            "Sizing the structure by the hardest material and the spindle by the full range handles all three materials honestly.",
            "It keeps the machine as small as the work allows, which directly helps the `2.0 × 2.0 m` footprint constraint.",
            "It gives a clean assumption to record: if the largest part grows, the derivation is rerun rather than quietly stretched.",
          ],
          drawbacks: [
            "No margin, so a part `20 mm` longer than promised means a fixture rethink or a refused job.",
            "It relies on the brief being accurate about the largest part, which briefs often are not.",
            "The stainless work is 'occasional' but still sizes some of the design, which can feel like paying for a rare case.",
            "It requires discipline later, because rounding travels up is the easy way to smuggle margin back in.",
          ],
          cost:
            "The lowest cost consistent with doing the job asked for. Nothing is bought for imaginary parts, and the saving shows up in structure, drives, floor space and installed power together.",
          performance:
            "Right-sized. The shortest structural loop of the realistic options, which means the best stiffness at the tool point for the money, and the least mass to accelerate.",
          safety:
            "Establishing the real workpiece mass of about `141 kg` plus fixture is a safety input, not just an engineering one: it sets the table load rating and tells you that manual handling of the largest parts needs planning. Lifting provisions belong in the risk assessment that qualified personnel must complete.",
          maintenance:
            "Neutral. A right-sized machine is not easier or harder to maintain, but a table loaded within its rating wears its guideways and screws at the rate the maintenance plan assumes.",
          fitForBrief:
            "It is the brief. Northgate named a largest part, three materials and a tight bay. Taking the envelope at face value, sizing the structure by the steel and the spindle by the whole material range satisfies all three sentences, and records the growth question as an assumption instead of pretending to answer it.",
        },
        {
          id: "growth-margin",
          name: "The brief plus a growth margin: `500 × 400 × 200 mm`",
          benefits: [
            "Absorbs the near-certain moment when a customer asks for something slightly bigger.",
            "Gives room for larger fixtures, tombstones or two parts side by side.",
            "Avoids a redesign if Northgate's work drifts towards bigger prototypes.",
            "Margin declared openly in the specification is far better engineering than margin hidden inside rounding.",
          ],
          drawbacks: [
            "Longer travels mean a longer structural loop and lower stiffness at the tool point for the same money.",
            "More moving mass in every axis, so larger motors and drives for the same acceleration.",
            "A bigger machine and a bigger table sweep in a bay that is only about `2.0 × 2.0 m`.",
            "The margin is a guess, so it may still be the wrong size when the bigger part finally arrives.",
          ],
          cost:
            "Noticeably higher across the board: more material in the castings or weldments, longer rails and screws, larger motors, a bigger enclosure. Against a modest budget this is the option most likely to break it.",
          performance:
            "Slightly worse where it matters. Roughly `25 %` more travel in X and Y buys capability the brief did not ask for, and pays for it with reduced stiffness and slower moves on every part the shop actually makes.",
          safety:
            "A larger work envelope means a larger guarded volume, longer reaches for the operator and heavier parts to handle. All manageable, but all of it enlarges the guarding and handling questions rather than reducing them.",
          maintenance:
            "Longer axes take longer to align and re-prove, and the extra travel gives the way covers, screws and rails more distance over which to wear unevenly.",
          fitForBrief:
            "Defensible if Northgate confirms that bigger parts are coming — but that is a question, not an assumption. As things stand the brief names a largest part and a tight bay, and this option spends stiffness, money and floor space on a part nobody has ordered.",
        },
        {
          id: "aluminium-first",
          name: "Size for aluminium; treat steel as light finishing only",
          benefits: [
            "Optimises for the material most of the work is actually in.",
            "Lighter structure, smaller drives, less installed power, smaller footprint.",
            "Leaves the shop able to take a light steel job, which covers many real jobs.",
            "The cheapest option to build, which matters against an unquantified budget.",
          ],
          drawbacks: [
            "The brief names mild steel and stainless as ordinary work, not as an exception.",
            "'Light finishing only' is a restriction on the operator that will be forgotten within a month of commissioning.",
            "Cutting force in steel is far higher per cubic centimetre removed, so a light frame chatters long before the motors struggle.",
            "It converts an engineering decision into a discipline problem, which is the least reliable kind of solution.",
          ],
          cost:
            "The lowest to build of the four. The saving is real, but it is the price of a capability the brief asked for, so it is a reduction in scope rather than an efficiency.",
          performance:
            "Very good in aluminium and poor in steel. The failure is not dramatic — no motor stalls — it shows up as chatter, poor surface finish, short tool life and dimensional variation on exactly the jobs the shop already finds hardest.",
          safety:
            "Chatter and unexpected deflection are process risks: they break tools and throw chips. Designing a machine whose safe use depends on operators self-limiting depth of cut is a weak control, and a risk assessment by qualified personnel would say so.",
          maintenance:
            "Deceptive. If steel is machined on it regardless — and it will be — bearings, screws and guideways see loads above the design case, and the machine loses geometry faster than the maintenance plan predicts.",
          fitForBrief:
            "It contradicts a plain sentence of the brief. Structure is sized by the hardest cut, not the commonest one. Choosing this means telling Northgate they cannot do the steel work they asked for, which is a conversation to have openly rather than a decision to bury in a specification.",
        },
        {
          id: "stainless-worst-case",
          name: "Size everything for continuous stainless machining",
          benefits: [
            "Guarantees the machine copes with the hardest material named in the brief.",
            "Maximum stiffness and spindle torque also improve finish and tool life in the easier materials.",
            "Removes the risk of discovering the frame is too light after it is welded and machined.",
            "Simplifies the argument: design for the worst case and every lighter case is covered.",
          ],
          drawbacks: [
            "Stainless is 'occasional', so most of the extra structure and power is idle most of the time.",
            "The heaviest, most expensive structure of the four against a modest budget.",
            "A heavy machine with a big spindle is harder to fit in the bay and to get through the door.",
            "Sizing for continuous stainless work also implies coolant and chip handling capability the shop may not need.",
          ],
          cost:
            "The highest of the four. Continuous stainless work implies more spindle torque, stiffer guideways, a heavier frame and better coolant delivery — several expensive decisions at once, all justified by the rarest job in the shop.",
          performance:
            "Excellent, and largely unused. There is a genuine benefit that is easy to overlook: a machine sized for the hardest cut is quieter, better-finishing and kinder to tools in every easier cut. The question is whether that benefit is worth the money here.",
          safety:
            "Heavier cutting means more energy in the working zone and more attention needed on chip and coolant containment. There is also a handling consequence: a heavier machine needs more careful installation and lifting planning.",
          maintenance:
            "Components running well inside their ratings last longer, which is a real maintenance win. Against that, a heavier machine is harder to work on, and larger assemblies need proper lifting equipment to service.",
          fitForBrief:
            "Over-reads one word. 'Occasionally stainless' is a reason to make sure stainless is possible, not a reason to make it the design case. The proportionate answer is to size the structure by the steel work, check that occasional stainless is feasible at reduced depth of cut, and record that limitation in the report.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 03 */
  {
    id: "required-travels",
    number: 3,
    title: "Required travels",
    brief:
      "Axis travel is how far one axis moves from end to end, measured at the moving part. Beginners set travels by copying a machine they admire. Derive them instead, from the part outwards: the workpiece, plus whatever the fixture adds in that direction, plus clearance at each end so the cutter can run fully on and off the material.\n\nFor the horizontal axes that gives `X = w + 2c` and `Y = d + 2c`. Working Northgate's numbers with about `25 mm` of clearance each end: `X = 400 + 2 × 25 = 450 mm` and `Y = 300 + 2 × 25 = 350 mm`.\n\nThe vertical axis needs two separate numbers, and confusing them is the classic error. Daylight is the static gap between the spindle nose and the table that a fixture, workpiece and tool assembly must all fit inside: `daylight = f + h + L_tool + c`, which for a vice adding about `150 mm`, a `150 mm` part, a `150 mm` tool assembly and `50 mm` of tool-change clearance gives about `500 mm`. Z travel is a different question — how far the head must move — and only has to cover the part depth, the difference between the shortest and longest tools and a retract allowance: `150 + 120 + 30 = 300 mm`.\n\nThen there is rounding, which is where honesty is tested. Going from `450 mm` to `500 mm` of X travel buys practical tolerance for off-centre clamping and fixture overhang, and it costs money, floor space and stiffness, because a longer axis is a longer structural loop. Record each rounding as a decision with a reason, not as tidiness. A reviewer is entitled to ask why you spent `50 mm`.",
    decision: {
      question:
        "Which travel set should the concept carry forward — and can you justify every millimetre of it?",
      options: [
        {
          id: "bare-derivation",
          name: "The bare derivation: `X 450`, `Y 350`, `Z 300 mm`, daylight `450 mm`",
          benefits: [
            "Every number is the arithmetic and nothing else, so it is trivially defensible.",
            "The shortest structural loop of the options, which means the best stiffness at the tool point.",
            "The smallest footprint and the least table sweep, which is precious in a `2.0 × 2.0 m` bay.",
            "The least moving mass, so the smallest motors and drives for the same acceleration.",
          ],
          drawbacks: [
            "Zero tolerance for clamping the largest part slightly off-centre.",
            "A fixture that overhangs the part by even a little eats into the clearance allowance.",
            "Daylight of `450 mm` assumes the tool and fixture estimates are right first time.",
            "Real fixtures are rarely as compact as the estimate, so the shop hits the limit on day one.",
          ],
          cost:
            "The cheapest of the four to build, and the saving is genuine: shorter rails, shorter screws, less structure, smaller enclosure. Whether it is a good saving depends on whether the shop can live with no slack at all.",
          performance:
            "The best stiffness-per-pound of the set, because stiffness falls as the loop lengthens. Against that, the operator loses time fighting setups that only just fit, and setup time is what dominates short-run work.",
          safety:
            "Tight clearances are an ergonomic and handling risk: awkward reaches, fingers between fixture and cutter, and the temptation to work with a guard open. That belongs in the risk assessment qualified personnel will carry out, and it is a reason to be careful with clearance rather than to be generous with travel.",
          maintenance:
            "Shorter axes are quicker to align and re-prove with dial indicators, which suits a shop with no interferometer. Less travel also means less distance over which uneven wear can develop.",
          fitForBrief:
            "It honours the footprint and the budget, and it contradicts the sentence about easy setup. A machine where the largest part must be centred perfectly is not an easy machine to set up, and setup is one of Northgate's three stated priorities.",
        },
        {
          id: "rounded-derivation",
          name: "The rounded derivation: `X 500`, `Y 400`, `Z 350 mm`, daylight `500 mm`, table rated `250 kg`",
          recommended: true,
          benefits: [
            "Every number still traces to the derivation, with each rounding recorded as a decision and a reason.",
            "The extra `50 mm` in X and Y is what lets a vice sit off-centre without losing reach — a direct answer to 'easy setup'.",
            "Daylight of `500 mm` allows a tool change with the part still clamped, which saves a re-datum every time.",
            "A table rated for at least `250 kg` covers the `141 kg` steel block plus a `40 kg` vice with margin for clamping hardware.",
          ],
          drawbacks: [
            "About `50 mm` of extra travel per horizontal axis lengthens the structural loop and costs stiffness.",
            "A moving table with `500 mm` of X travel sweeps roughly `1 m` across the floor, which the bay layout must accommodate.",
            "More travel means more mass, so slightly larger motors than the bare derivation needs.",
            "Rounding is a judgement, and a reviewer may reasonably argue the money was better spent elsewhere.",
          ],
          cost:
            "Modestly more than the bare derivation and far less than the generous options. The premium buys usability rather than capability, which is the right thing to buy given the brief's priorities.",
          performance:
            "A deliberate small trade: slightly lower stiffness and slightly more mass in exchange for setups that work first time. With a moving mass of about `250 kg`, a rapid of `30 m/min` and `3 m/s²`, the axes remain drivable by ordinary components — the motor-estimates stage works exactly these numbers.",
          safety:
            "Better clearance around the fixture means fewer awkward reaches and less temptation to defeat a guard. The `250 kg` table rating is a stated limit an operator can be trained to respect, which is a stronger control than hoping nobody overloads it.",
          maintenance:
            "Still short enough to align and re-prove with a surface plate, height gauge and dial indicators — the instruments Northgate owns — which is the practical test of whether a travel set is maintainable by its owner.",
          fitForBrief:
            "This is the set the capstone lesson derives, and it is defensible line by line: travels from the part plus fixture plus clearance, roundings justified by off-centre clamping and tool-change clearance, table rating from the calculated `141 kg` part plus fixture. It serves 'easy setup' without abandoning the footprint constraint, and its one real risk — about `1 m` of table sweep — is manageable by siting the machine with its X axis along the length of the bay.",
        },
        {
          id: "two-fixture-x",
          name: "Long X for two fixtures: `X 800`, `Y 400`, `Z 350 mm`",
          benefits: [
            "Two vices side by side means loading one part while the other is cutting, which attacks setup time directly.",
            "Short runs become much more productive without any tool changer or automation.",
            "Long X suits plate work and multiple small parts in one program.",
            "It is a genuine answer to 'easy setup', just a different one from extra clearance.",
          ],
          drawbacks: [
            "On a moving-table layout the table would sweep about `1.6 m`, which will not fit sensibly in a `2.0 m` bay with access.",
            "A much longer X axis means a much longer structural loop, with real stiffness consequences.",
            "Longer screws bring critical-speed and support questions that a `500 mm` axis avoids entirely.",
            "It only pays when the same part repeats, which is not the dominant case in a prototype shop.",
          ],
          cost:
            "Substantially more: longer rails, longer screws with more supports, more structure, a wider enclosure, and a larger installation. It is the option most likely to exceed a modest budget for capability the brief did not request.",
          performance:
            "Higher throughput on repeat work, lower stiffness on everything. There is a subtler cost too: a long, relatively narrow table is less stiff in torsion, which shows up as geometry that changes with table position.",
          safety:
            "A larger swept volume and a longer enclosure to guard. Loading one fixture while the machine cuts in the other is exactly the situation where guarding and interlocking must be designed properly, and that design has to be done and verified by qualified personnel.",
          maintenance:
            "A longer axis takes longer to align, and proving straightness over `800 mm` with a surface plate and indicators is harder than over `500 mm`. Way covers and screw supports also see more duty.",
          fitForBrief:
            "Good engineering for a workshop with the floor for it. Northgate's bay is about `2.0 × 2.0 m`, and a table sweeping `1.6 m` leaves nowhere to stand, load or service. The footprint sentence binds hard, and this option fails it.",
        },
        {
          id: "generous-envelope",
          name: "A generous envelope: `X 700`, `Y 500`, `Z 450 mm`, daylight `650 mm`",
          benefits: [
            "Comfortable for larger fixtures, angle plates, tombstones and long tool assemblies.",
            "Absorbs future growth without a redesign, and covers optimistic estimates in the derivation.",
            "Extra daylight makes tool changes and setup measurement genuinely easier.",
            "Reduces the chance of refusing work because a part is slightly too big.",
          ],
          drawbacks: [
            "It buys capability the brief did not ask for, and pays with stiffness on every part the shop does make.",
            "A `700 mm` moving table sweeps about `1.4 m`, which crowds a `2.0 m` bay.",
            "A taller column for `650 mm` of daylight is less stiff at the tool point and closer to the `2.4 m` ceiling once way covers and the enclosure are added.",
            "More mass everywhere: larger motors, larger drives, more installed power.",
          ],
          cost:
            "High, and diffuse — the increase appears in structure, rails, screws, motors, enclosure and installation at once, which makes it hard to argue for line by line against an unquantified budget.",
          performance:
            "Lower stiffness at the tool point and more mass to accelerate. The daylight increase is the most defensible part of the option; the travel increase is the least, because it costs stiffness on every cut for the benefit of parts nobody has ordered.",
          safety:
            "A larger guarded volume, longer reaches into the machine and a taller assembly to install under a `2.4 m` ceiling. None of it is prohibitive, all of it is more to get right.",
          maintenance:
            "The tallest and largest of the four to align, re-prove and service, with the least chance of being properly checked using only a surface plate, a height gauge and dial indicators.",
          fitForBrief:
            "It is the 'just in case' option, and the brief argues against it twice: the bay is small and the budget is modest. If Northgate genuinely expects bigger parts, that changes the brief and the derivation should be rerun openly — not absorbed as silent margin.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 04 */
  {
    id: "architecture",
    number: 4,
    title: "Architecture",
    brief:
      "Machine architecture is the overall arrangement of structure and axes: which member carries which axis, what moves and what stays still. It is the conclusion of an argument about the brief, never a starting preference — and it is the stage where the structural loop becomes visible.\n\nThe structural loop is the closed chain of parts joining the cutting edge to the workpiece: tool, spindle, head, column, base, table, fixture and back to the cut. Everything in that chain can bend, and everything that bends shows up in the part. Shorter, stiffer, more symmetric loops deflect less — but they cost floor space, money or access, which is exactly where the argument starts.\n\nThree layouts survive first contact with Northgate's brief. A C-frame with a moving table is the classic small vertical mill: a fixed column, the head moving in Z, the workpiece on a cross-slide table moving in X and Y. A moving-column machine leaves the table fixed to the base and moves the column instead. A bridge, sometimes called a gantry, spans a fixed table on two legs with the head travelling along the bridge. Resist adding a fourth candidate: a shortlist of three is a design tool, a league table of nine hides the real argument.\n\nWhen you score them, remember what the capstone lesson demonstrated. With criteria weighted from Northgate's own priorities the three candidates land within about four per cent of each other, and moving two weights inverts the ranking without changing a single score. That means the decision rests on the weights, and your job is to defend the weights from the brief rather than to present arithmetic as a result.",
    decision: {
      question:
        "Which architecture should the concept adopt for `X 500`, `Y 400`, `Z 350 mm` in a bay of about `2.0 × 2.0 m`?",
      options: [
        {
          id: "c-frame-moving-table",
          name: "C-frame, fixed column, moving cross-slide table",
          recommended: true,
          benefits: [
            "Short structural loop: the head sits close to a deep column and the table sits low over the base.",
            "The most conventional layout, so components, castings, know-how and fitters are all readily available.",
            "Its geometry can be set and re-proven with a surface plate, a height gauge and dial indicators — exactly what Northgate owns.",
            "The table can be driven towards the door for loading, which helps with a `141 kg` block.",
          ],
          drawbacks: [
            "A table with `500 mm` of X travel sweeps roughly `1 m` across, so the bay must be wider than the machine.",
            "Chips land on a moving table and ride into the way covers.",
            "Moving mass includes the workpiece, so the X and Y axes carry a load that changes from job to job.",
            "Stacking Y on X means the lower axis carries the upper one, which is inherently less stiff than a fixed table.",
          ],
          cost:
            "The lowest of the three for the same travels. It is the layout best served by standard parts and familiar manufacturing, which is where most of the saving comes from — and against a modest budget that saving is the argument, not a detail.",
          performance:
            "Good stiffness at the tool point for the money, with the honest caveat that stiffness varies with table position because the loop changes as the table moves off centre. Removal rate is adequate for the steel work and generous for the aluminium.",
          safety:
            "A well-understood layout with well-understood guarding. The swept table is the hazard to design around: the guarded volume must cover the full sweep, and trapping points between table and enclosure need attention in the risk assessment qualified personnel will carry out.",
          maintenance:
            "The most serviceable of the three. Screws and rails are reachable once way covers are removed, nothing is buried inside a span, and any fitter recognises the arrangement — which matters when the owners are machinists rather than machine builders.",
          fitForBrief:
            "Chosen not because it scores highest but because its weakest criterion can be managed. Footprint is its weak point, and siting the machine with its X axis along the length of the bay solves that. The bridge's weak points — cost and loading a `141 kg` block between two legs — cannot be solved by siting. Add the conventionality argument, which is worth real money against a modest budget and real confidence to a shop that must align the machine with dial indicators, and the C-frame is defensible. Record the near-tie and the weights honestly: this is a decision made on priorities, not on arithmetic.",
        },
        {
          id: "moving-column-fixed-table",
          name: "Moving column over a fixed table",
          benefits: [
            "The table never moves, so the floor space needed is close to the machine's own width — a direct answer to the footprint constraint.",
            "The workpiece stays put, so datums, clamps and indicators stay where the machinist set them.",
            "A fixed table can be sloped and drained straight into a chip tray.",
            "Moving mass is constant and independent of workpiece mass, which makes drive sizing and tuning easier.",
          ],
          drawbacks: [
            "The column is the moving member, so its guideways carry the whole overturning moment from the cutting force.",
            "Fewer standard parts, and the moving column needs larger, stiffer guideways than a comparable C-frame.",
            "All services — power, coolant, air, feedback — must travel with the column, so cable and hose management is harder.",
            "Less familiar to fitters and to the owners, which raises the effort of both build and maintenance.",
          ],
          cost:
            "Higher than the C-frame. The saving in floor space is bought with bigger guideways, more careful structural design and more bespoke fabrication, and the cable and hose management adds cost that is easy to underestimate.",
          performance:
            "Excellent setup ergonomics and a compact footprint, with stiffness at the tool point the main question: a moving column loaded by cutting force is working its guideways in the least favourable direction. It can be made stiff, but stiffness has to be designed in rather than inherited from a conventional layout.",
          safety:
            "A smaller swept volume than a moving table is genuinely helpful for guarding. Against that, moving cables and hoses are a wear item and a fault source, and their routing and protection need proper design and periodic inspection.",
          maintenance:
            "Middling. Fixed-table loading is kind to the operator, but services that flex thousands of times a shift are the thing most likely to need attention, and reaching the column's own guideways is harder than reaching a table's.",
          fitForBrief:
            "Genuinely competitive, and the strongest option on two of the brief's own priorities — easy setup and footprint. It loses on cost and familiarity, and against a modest budget in a shop of machinists rather than machine builders those two matter. Reconsider it immediately if the bay layout turns out to be tighter than assumed, or if the budget is confirmed as generous.",
        },
        {
          id: "bridge-fixed-table",
          name: "Bridge (gantry) over a fixed table",
          benefits: [
            "A symmetric two-legged span resists the cutting force evenly, and symmetry is kind to thermal behaviour.",
            "The fixed table keeps the footprint compact for the travel offered.",
            "Chips fall clear of the moving structure into the space under the bridge.",
            "Scales well: the same architecture works if Northgate later wants much larger travels.",
          ],
          drawbacks: [
            "Loading a `141 kg` steel block between two legs is awkward, and the brief specifies no crane or hoist.",
            "Two legs and a bridge mean more machined joints and more alignment work.",
            "Z reaches down through the bridge, so the Z assembly sits inside the span where it is awkward to reach and to lift out.",
            "More interfaces in the structural loop, each of which can contribute compliance if the joints are not excellent.",
          ],
          cost:
            "The highest of the three at this size. Machined joints, alignment effort and a more bespoke structure all cost, and none of that is offset by volume at a batch size of one.",
          performance:
            "Strong on paper and strong in practice at larger sizes, where the symmetry and the fixed table pay off most. At `500 × 400 × 350 mm` the advantages are smaller than the extra joint count and build effort, which is the honest reason it loses here.",
          safety:
            "Good chip behaviour and a compact swept volume, spoiled by manual handling: lifting a heavy block in between two legs is the kind of operation a risk assessment will flag, and solving it properly means a hoist and the guarding to go with it.",
          maintenance:
            "The hardest of the three to service. A Z assembly inside the span needs access, lifting and often partial dismantling, and re-proving squareness across a bridge with dial indicators alone is demanding work.",
          fitForBrief:
            "Rejected, but not dismissed — it scored comparably and it is more compact for its travels. It is rejected because loading `141 kg` between two legs is poor ergonomics for a six-person shop with no lifting equipment specified, and because the extra machined joints raise cost against a modest budget. That rejection reverses if Northgate adds a hoist or relaxes the budget, and it should be recorded in exactly those terms.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 05 */
  {
    id: "cutting-forces",
    number: 5,
    title: "Cutting forces",
    brief:
      "Cutting force is the load the process applies to the machine, and it is the input that sizes almost everything mechanical: the stiffness of the structure, the load rating of the guideways, the thrust from the drives and the torque at the spindle. Get it roughly right and the rest of the design is proportionate. Guess it, and you will either build something floppy or something needlessly heavy.\n\nThe force is not one number. It varies with the material, the cutter, the depth and width of cut, the feed per tooth, the tool wear and the rigidity of the setup. What a concept needs is a defensible worst case: the hardest material at the heaviest cut you intend to allow. For Northgate that is a steel or stainless roughing pass, not the aluminium work — even though aluminium is most of the work.\n\nThe capstone lesson used a process force of about `800 N` in the axis-sizing example, and this project keeps that figure so the numbers stay consistent. It is an illustrative order of magnitude for a modest roughing cut in steel on a machine of this size, not a specification and not a measurement. What matters at concept stage is the method you use to arrive at such a figure, and how honestly you record its uncertainty.\n\nChoose how the force will be established, and remember that the answer belongs in the report with its assumptions attached.",
    decision: {
      question:
        "How should the cutting force that sizes the structure and the drives be established at concept stage?",
      options: [
        {
          id: "chip-load-estimate",
          name: "Estimate from chip cross-section and the tool maker's cutting force data",
          recommended: true,
          benefits: [
            "It connects the force to things you have already decided: the cutter, the depth and width of cut and the feed per tooth.",
            "The tool manufacturer's material data is the best evidence available without a machine to test on.",
            "It scales sensibly: change the intended cut and the force estimate changes with it, so the design case stays honest.",
            "The assumptions are all visible, which makes the estimate reviewable rather than merely plausible.",
          ],
          drawbacks: [
            "It depends on published material data whose conditions may not match your cut.",
            "It gives an average force, while the machine feels a fluctuating one — and fluctuation is what excites chatter.",
            "Tool wear raises the force substantially, and by an amount that is hard to predict.",
            "It says nothing directly about the dynamic behaviour of the structure, which is often the real limit.",
          ],
          cost:
            "Almost free — engineering time only, and it is time you must spend anyway to define the intended cuts. No instruments and no test machine are needed.",
          performance:
            "Good enough to size a concept and to check that ordinary components will do the job. It is not good enough to predict surface finish or chatter, both of which need dynamic analysis and, ultimately, cutting trials.",
          safety:
            "Underestimating force is a real hazard, because it leads to under-rated fixtures, clamping and guarding. Treat the estimate as a lower bound for those purposes and have the whole design reviewed by qualified engineers before anything is manufactured.",
          maintenance:
            "Indirect but important: a force estimate that is too low leads to bearings, screws and rails running above their intended duty, which shortens life and quietly invalidates the maintenance intervals.",
          fitForBrief:
            "It is the only option that costs nothing, uses evidence Northgate can obtain, and produces a number traceable to the cuts the brief implies. Pair it with a spindle-power bound as a sanity check, state the assumed cut and material explicitly, and record that a real design requires validation by cutting trials and professional review.",
        },
        {
          id: "power-bound",
          name: "Bound the force from the spindle power you intend to install",
          benefits: [
            "It produces a ceiling the process physically cannot exceed, whatever the material data says.",
            "It needs no material data at all, only the intended spindle power and speed.",
            "It is an excellent independent cross-check on a chip-load estimate — two methods that disagree tell you something useful.",
            "It links the mechanical design directly to the electrical installation, which has to be sized anyway.",
          ],
          drawbacks: [
            "A ceiling is not a design case: sizing everything to the absolute maximum the spindle could deliver is wasteful.",
            "It says nothing about the direction of the force, which is what determines guideway loading and deflection.",
            "It is circular if the spindle power was itself chosen from a force estimate.",
            "It ignores the fact that most cuts, and most of the machine's life, happen well below full power.",
          ],
          cost:
            "Free as an analysis. Used as the design case it becomes expensive, because it sizes the structure for a condition the machine will rarely see.",
          performance:
            "Very useful as a bound and weak as a target. A machine sized to its power ceiling in every direction is heavy and dear; a machine sized without knowing that ceiling can be surprised by it.",
          safety:
            "Knowing the maximum force the drive train can produce is genuinely valuable for fixture and guarding decisions, because it tells you the worst the machine can do if a program goes wrong.",
          maintenance:
            "Components chosen against the ceiling run well within their ratings, which is kind to their life — at a cost in mass and money that has to be justified against the brief.",
          fitForBrief:
            "Worth doing here, but as the second method rather than the first. Use it to check that the chip-load estimate is not physically impossible and to bound the fixture and guarding decisions. Using it alone would size Northgate's modest machine for a cut they never intend to take.",
        },
        {
          id: "instrumented-test-cuts",
          name: "Measure it: instrumented test cuts on a comparable machine",
          benefits: [
            "Measurement beats estimation: it captures the real fluctuating force including tool wear effects.",
            "It also reveals dynamic behaviour and chatter thresholds, which no static estimate can.",
            "It produces evidence a reviewer can trust, tied to the actual materials and tooling the shop uses.",
            "It gives a baseline against which the finished machine can later be compared.",
          ],
          drawbacks: [
            "It needs a comparable machine, a dynamometer or reliable spindle-load logging, and someone who can interpret the data.",
            "Northgate owns a surface plate, a height gauge and dial indicators — none of which measure cutting force.",
            "The comparable machine's stiffness affects the measurement, so results do not transfer cleanly to a different structure.",
            "It takes time and money at the stage of the project with the least budget and the most uncertainty.",
          ],
          cost:
            "The highest of the four at concept stage: instruments, machine time, tooling and material, plus the expertise to make the results meaningful. Later in the project, on the finished machine, the same work is far cheaper and far more valuable.",
          performance:
            "The best information available, if you can get it. There is a real argument for doing a reduced version of this — logging spindle load during representative cuts on a machine the shop already uses — which costs very little and still calibrates the estimate.",
          safety:
            "Test cutting is machining, with all of machining's hazards, and instrumenting a machine may involve working near moving parts. It must be done on a properly guarded machine by competent people, under the machine manufacturer's instructions.",
          maintenance:
            "No direct effect, but the data is genuinely useful later: knowing what a healthy cut looks like makes deteriorating spindle or drive condition much easier to spot.",
          fitForBrief:
            "The strongest evidence and the weakest fit for this stage. Northgate has neither the instruments nor a reference machine specified, and the concept does not yet justify the expense. Note it as the right way to validate the force assumption once a machine exists, and put it in the validation plan rather than the concept.",
        },
        {
          id: "round-figure-factor",
          name: "Assume a generous round figure with a large factor of safety",
          benefits: [
            "Fast, and it never stalls the design waiting for data.",
            "A large factor of safety does genuinely cover a lot of estimation error.",
            "Conservative sizing means the machine is unlikely to be under-built structurally.",
            "It is honest about its own crudeness, provided the assumption is written down as such.",
          ],
          drawbacks: [
            "It hides the physics, so nobody learns which parameter actually drives the load.",
            "The factor multiplies mass and cost everywhere, including places where the load was never the limit.",
            "It is not conservative in every direction: an oversized motor can drive a machine harder than its structure or fixtures can take.",
            "It cannot be scaled — change the intended cut and the number carries no information about what should change.",
          ],
          cost:
            "Cheap to decide and expensive to build. Every safety factor applied to a guessed force appears as extra material, larger components and more installed power.",
          performance:
            "Usually adequate and never informative. The machine may well work, but no one can say why, and when a problem appears there is no chain of reasoning to check.",
          safety:
            "The dangerous failure mode is subtle: a machine with generous drive capacity and a guessed force estimate can exceed the assumptions behind its own fixtures and guarding. Safety comes from understood loads, not from large multipliers.",
          maintenance:
            "Components running far inside their ratings last well. Against that, when something does wear out unexpectedly there is no baseline duty figure to compare against, so diagnosis starts from nothing.",
          fitForBrief:
            "It is the option that spends Northgate's modest budget on ignorance. The brief's priorities — repeatability, setup, serviceability — all depend on a machine whose behaviour is understood. Use a factor of safety on top of a reasoned estimate, never instead of one.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 06 */
  {
    id: "spindle-requirements",
    number: 6,
    title: "Spindle requirements",
    brief:
      "The spindle is where the machine meets the cut, and it is the subsystem where Northgate's material mix bites hardest. Aluminium rewards high rotational speed and generous feed; steel and stainless want lower speed, more torque, and above all a structure that does not flex. One spindle has to serve both, and no single arrangement is comfortable across the whole range.\n\nWork both ends of the range before choosing. Using `n = (vc × 1000) / (π × D)`, a `10 mm` cutter in aluminium at a cutting speed of `vc = 200 m/min` needs about `6366 rev/min`, while the same cutter in mild steel at an illustrative `vc = 80 m/min` needs about `2546 rev/min`. So the spindle must be genuinely useful from roughly `2500` to well over `6000 rev/min` — and it must still deliver torque at the bottom of that band, because that is where the steel and stainless work lives. In SI terms `1 rev/min = 2π / 60 rad/s`, about `0.105 rad/s`, so `6366 rev/min` is around `667 rad/s`.\n\nAlso decide what you are not asking for. Northgate did not ask for high-speed machining, through-spindle coolant or an automatic tool changer. Every capability you add has to be argued for against a modest budget, and the tool interface you choose will constrain tooling costs for the life of the machine.\n\nChoose the spindle arrangement, and be explicit about which end of the speed range you protected and which you compromised.",
    decision: {
      question:
        "Which spindle arrangement best serves a range from roughly `2500` to over `6000 rev/min` with usable torque at the bottom?",
      options: [
        {
          id: "two-range-belt",
          name: "Inverter-fed motor with a two-range belt drive",
          recommended: true,
          benefits: [
            "The low range multiplies torque for steel and stainless; the high range reaches aluminium speeds.",
            "The belt isolates the spindle bearings from motor vibration and from motor heat, which helps thermal stability.",
            "Standard, well-understood components with good availability and modest cost.",
            "Belts and pulleys are serviceable by an ordinary fitter with ordinary tools.",
          ],
          drawbacks: [
            "Changing range is an intervention — manual on the cheapest arrangements, or an added actuator if automatic.",
            "Belt drives introduce a small amount of compliance and can transmit their own vibration signature.",
            "Belt tension is a maintenance item, and tension affects both bearing load and drive behaviour.",
            "Two ranges add width or height to the head, which competes with the compact envelope.",
          ],
          cost:
            "Mid-range and predictable. More than a direct-coupled motor and much less than either an integral high-speed spindle or a geared head, which is the right place to be against a modest budget.",
          performance:
            "The best coverage of the required band of the four. It is a compromise in the honest sense: neither range is as good as a dedicated spindle would be at that end, but both ends are genuinely usable, which is what the brief needs.",
          safety:
            "Rotating belts and pulleys must be fully enclosed, and any range change has to be impossible while the spindle turns. Those interlocks are part of the safety-related control system, which must be specified and verified by qualified personnel.",
          maintenance:
            "Good. Belts are consumables with a known life, tension checks are a simple scheduled task, and nothing needs specialist equipment. Northgate's fitters can do all of it.",
          fitForBrief:
            "It is the arrangement that takes the material mix seriously. Aluminium speed and steel torque are both reachable, the components are conventional and available, and the maintenance is within the shop's competence. Record the compromise plainly: peak performance at each end is traded for usable performance at both.",
        },
        {
          id: "direct-coupled-inverter",
          name: "Inverter-fed motor coupled directly to the spindle shaft",
          benefits: [
            "The simplest possible drive train: no belts, no pulleys, nothing to tension or replace.",
            "No belt compliance, so the spindle responds directly to the motor.",
            "Compact and light, which helps a moving head on a compact machine.",
            "Cheapest to build and to install of the four.",
          ],
          drawbacks: [
            "Below base speed an inverter-fed motor produces roughly constant torque, and that torque is whatever the motor gives — there is no gearing to multiply it.",
            "Reaching aluminium speeds and steel torque with one motor and no ratio usually means an oversized motor.",
            "Motor heat conducts straight into the spindle housing, with thermal growth consequences.",
            "Motor vibration and cogging reach the tool directly.",
          ],
          cost:
            "The lowest capital cost, though the saving shrinks if a much larger motor and drive are needed to cover the whole range. Simplicity is worth real money in build hours too.",
          performance:
            "Clean and predictable in the middle of the band, weak at the extremes. The usual outcome is adequate aluminium speed with disappointing steel torque, which is precisely the wrong compromise for Northgate.",
          safety:
            "Fewer moving parts to guard is a genuine advantage. The electrical installation, motor protection, isolation and emergency stop arrangements still have to be designed and verified by qualified personnel under the applicable standards.",
          maintenance:
            "The least to maintain of the four: no belts, no gears, no range change. Spindle bearings remain the main wear item and their condition monitoring is unchanged.",
          fitForBrief:
            "Attractive for the budget and honest about simplicity, but it puts the compromise in the wrong place. The brief's steel and stainless work needs torque at `2500 rev/min`, and a single direct ratio makes that expensive to provide. Reconsider if Northgate confirms the steel work is light finishing only.",
        },
        {
          id: "integral-high-speed",
          name: "Integral motorised high-speed spindle (electro-spindle)",
          benefits: [
            "Very high speeds, excellent for small cutters in aluminium and for fine finishing.",
            "No belts, gears or couplings, so very low vibration and a compact head.",
            "Usually supplied as a sealed, balanced assembly with known characteristics.",
            "High speed can substitute for depth of cut in aluminium: light, fast passes remove metal with low force.",
          ],
          drawbacks: [
            "Little usable torque at the low speeds the steel and stainless work needs.",
            "Expensive to buy and expensive to repair, usually as an exchange unit rather than a rebuild.",
            "Needs its own cooling, and often its own conditioned air and specialist drive.",
            "Its tool interface is typically small, which limits the cutters that can be used in steel.",
          ],
          cost:
            "The highest of the four, and the highest through-life cost too, because failure means replacing an assembly rather than changing a bearing. That is hard to justify against a modest budget.",
          performance:
            "Outstanding at one end of the range and poor at the other. For a shop whose hardest work is steel and stainless, choosing the spindle that is weakest exactly there is the wrong optimisation.",
          safety:
            "High speed raises the consequences of tool or holder failure, so containment, holder inspection and balance discipline all matter more. Speed limits must be enforced by the control system, and that enforcement is safety-related work for qualified personnel.",
          maintenance:
            "Low routine maintenance, high consequence when it does fail: exchange units are costly and the machine is down until one arrives. Cooling systems add their own service tasks.",
          fitForBrief:
            "A good spindle for the wrong brief. It optimises the material Northgate already finds easy and gives up capability in the materials they find hard, at the highest cost of the four. It would become interesting only if the work moved decisively towards small aluminium parts.",
        },
        {
          id: "geared-head",
          name: "Geared spindle head with multiple ratios",
          benefits: [
            "The most low-speed torque of the four, which is what heavy steel and stainless cutting wants.",
            "Several ratios give good coverage across a wide speed range.",
            "A rugged, long-lived arrangement with a long industrial track record.",
            "Gear ratios protect the motor from the worst of the low-speed thermal duty.",
          ],
          drawbacks: [
            "Gears add noise, vibration and a distinct forcing frequency that can show in surface finish.",
            "Complex and heavy in the head, which is the worst place to add mass on a moving-Z machine.",
            "More expensive to design and build than a belt drive for the same range.",
            "Gearbox lubrication and heat generation become design and maintenance problems in their own right.",
          ],
          cost:
            "Higher than a belt drive and lower than an integral high-speed spindle. For a one-off machine the design and build effort is the dominant cost, and it is substantial.",
          performance:
            "The strongest low-speed capability of the four and the least refined at high speed. It suits a machine whose main work is steel — which is not quite Northgate, whose main work is aluminium with steel as the sizing case.",
          safety:
            "Gear changes must be impossible while the spindle rotates, and the gear train must be fully enclosed. Both are ordinary requirements, and both belong in the interlock design that qualified personnel must verify.",
          maintenance:
            "The most demanding of the four: oil changes, seal condition, backlash and heat all need attention, and a gearbox repair in a machine head is a significant job requiring lifting equipment.",
          fitForBrief:
            "Over-provides torque and under-provides simplicity. Northgate values serviceability and has a modest budget; a geared head is heavier, dearer and more demanding to maintain than a two-range belt drive that covers the same required band adequately.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 07 */
  {
    id: "structure",
    number: 7,
    title: "Structure",
    brief:
      "The structure is everything that holds the cutting edge and the workpiece in a known relationship while the cut tries to push them apart. Its job is stiffness, damping and dimensional stability — in that order for this brief, because Northgate asked for repeatable results.\n\nStiffness is how little the structure deflects under load. Damping is how quickly vibration in it dies away, which is what decides whether a cut chatters. Dimensional stability is whether the structure holds its shape over hours, seasons and years, against temperature changes and against the internal stresses left by its own manufacture. A stiff structure that moves as the workshop warms up will not give repeatable results.\n\nThe inputs come from earlier stages: the travels fix the sizes, the architecture fixes the arrangement, and the cutting force estimate of about `800 N` fixes the load case. What remains is material and method — and for a single machine, method matters as much as material, because pattern costs, weld distortion, stress relief and the availability of machining capacity often decide what is actually buildable.\n\nChoose the structural material and manufacturing route, then record which of stiffness, damping and stability you protected most.",
    decision: {
      question:
        "What should the base, column and saddle be made of, and how should they be made, for a batch size of one?",
      options: [
        {
          id: "welded-steel-stress-relieved",
          name: "Welded steel fabrication, stress-relieved, then machined",
          recommended: true,
          benefits: [
            "No pattern or tooling cost, which is decisive at a batch size of one.",
            "Steel has a higher elastic modulus than cast iron, so a well-designed weldment can be stiffer for the same mass.",
            "Ribs, webs and wall thicknesses can be put exactly where the load case wants them, and changed during design.",
            "Fabrication and welding capacity is widely available and quick to schedule.",
          ],
          drawbacks: [
            "Steel has markedly less internal damping than cast iron, so chatter resistance depends more on design and joints.",
            "Welding leaves residual stress that must be relieved, or the structure will move after machining.",
            "Distortion during welding means datum surfaces have to be machined after stress relief, needing a large enough machine.",
            "Weld quality is a variable, and a poor weld in a structural joint is hard to detect and worse to fix.",
          ],
          cost:
            "The best value for one machine. No patterns, no foundry minimum, and material that is easy to buy in standard sections. The costs to watch are stress relief and the final machining of datum surfaces, both of which are easy to underestimate.",
          performance:
            "Good stiffness for the mass, with damping as the honest weak point. Damping can be improved by design — filled sections, well-designed joints, avoiding thin unsupported panels — and any such measure should be recorded as an assumption to be validated by cutting trials.",
          safety:
            "Structural welds carry the machine's loads, so weld procedures, competence and inspection are not optional. Any lifting points must be designed and proven for the loads involved, and the whole structure needs professional engineering review before manufacture.",
          maintenance:
            "Robust and repairable: a damaged weldment can usually be repaired in place, which is not true of a cracked casting. Surfaces need protection from coolant and corrosion, which is a coating decision rather than a structural one.",
          fitForBrief:
            "It matches the brief's economics precisely. One machine, modest budget, no pattern cost to amortise, and a shop that values serviceability. The damping deficit relative to cast iron is real and should be stated in the report as a residual risk, with cutting trials as the way to close it.",
        },
        {
          id: "grey-cast-iron",
          name: "Grey cast-iron castings",
          benefits: [
            "The traditional machine-tool material, with internal damping that helps suppress chatter.",
            "Complex ribbed shapes are natural to cast, so stiffness can be put where it is wanted.",
            "Well-understood behaviour, well-understood machining, and a long track record in machine tools.",
            "Dimensionally stable once properly aged and stress-relieved.",
          ],
          drawbacks: [
            "Pattern and tooling costs are significant and cannot be spread over a batch of one.",
            "Longer lead times, and foundry availability is not a given for small orders.",
            "Lower elastic modulus than steel, so more mass is usually needed for the same stiffness.",
            "Castings can hide defects, and a cracked casting is effectively unrepairable.",
          ],
          cost:
            "The pattern cost dominates and is hard to justify for one machine. Per-machine cost would be attractive at volume, which is exactly the situation Northgate is not in.",
          performance:
            "Excellent damping, good stability, adequate stiffness at the cost of mass. In a machine that will do steel and stainless work, the damping is a genuine performance advantage — which is why this option is a real contender rather than a straw man.",
          safety:
            "A heavy, stable structure with no welded joints to inspect. Handling is the main concern: castings are heavy, awkward and need proper lifting arrangements during build and any later service.",
          maintenance:
            "Very low maintenance in itself. The risk is catastrophic rather than gradual: a cracked casting means a new casting, with a pattern and a lead time behind it.",
          fitForBrief:
            "Technically strong and economically wrong for a batch of one. If Northgate were building several machines, or if a suitable existing casting could be bought and adapted, this would move to the front — and that is worth writing down, because it names the condition under which the decision reverses.",
        },
        {
          id: "mineral-casting",
          name: "Mineral casting (polymer concrete / epoxy granite)",
          benefits: [
            "Damping is substantially better than steel or cast iron, which directly attacks chatter.",
            "Cast into a mould at room temperature, so no welding distortion and low residual stress.",
            "Low thermal conductivity and high thermal mass, so it responds slowly to workshop temperature swings.",
            "Inserts, ways and mounting faces can be cast in place, saving machining.",
          ],
          drawbacks: [
            "Low elastic modulus compared with steel, so sections must be much bulkier for the same stiffness.",
            "Requires a mould, a mix specification and process know-how the shop does not have.",
            "Not readily repairable or modifiable once cured, so mistakes are expensive.",
            "Fewer suppliers, and less accessible engineering data for a first-time designer.",
          ],
          cost:
            "Moderate materials cost with a significant process risk premium for a first attempt. Mould making replaces pattern making, so the batch-of-one problem is reduced but not removed.",
          performance:
            "The best damping and thermal behaviour of the four, and the weakest stiffness per unit volume. For a machine whose stated priority is repeatable results the thermal stability is genuinely attractive.",
          safety:
            "Mixing and casting involves resins and hardeners with real handling requirements, which must be managed under the supplier's safety data and applicable law. Cast-in inserts carry structural loads and need proper design and verification.",
          maintenance:
            "Very stable and effectively maintenance-free in service, but unforgiving: damage or a misplaced insert cannot be welded or re-machined the way steel can.",
          fitForBrief:
            "Genuinely interesting for the repeatability priority, and hard to recommend for a first machine built by a shop with no experience of the process. The honest position is to record it as the option most likely to improve chatter and thermal drift, rejected on process risk rather than on merit.",
        },
        {
          id: "bolted-plate",
          name: "Bolted and dowelled steel plate assembly",
          benefits: [
            "No welding, so no weld distortion and no stress-relief operation.",
            "Plate can be cut and machined flat before assembly, on modest equipment.",
            "Can be dismantled, adjusted and reassembled during build and alignment.",
            "The most accessible route for a workshop building its own machine.",
          ],
          drawbacks: [
            "Every bolted joint is a potential source of compliance and micro-slip under load.",
            "Achieving stiffness comparable with a weldment needs many well-designed, well-preloaded joints.",
            "Joints can loosen or shift over time, which attacks exactly the repeatability the brief asks for.",
            "Damping depends on joint condition, which is variable and hard to verify.",
          ],
          cost:
            "Low material and process cost, high assembly labour. Dowelling, reaming, fitting and preloading many joints takes hours, and hours are a cost even in one's own workshop.",
          performance:
            "Adequate if the joints are excellent and disappointing if they are not, with performance that is harder to predict than any of the other three. Joint slip also tends to show up as a repeatability problem rather than an obvious fault.",
          safety:
            "Bolted structural joints must be designed, torqued and checked properly, and preload has to be maintained. A structure whose integrity depends on many fasteners needs a documented inspection regime and professional engineering review.",
          maintenance:
            "Easy to dismantle, and that cuts both ways: fasteners need periodic checking, and re-tightening a critical joint can shift the alignment the machine was proven with.",
          fitForBrief:
            "The most accessible option and the one most at odds with the brief's first priority. Northgate wants repeatable results, and a structure whose stiffness lives in dozens of bolted interfaces is the hardest kind to keep repeatable. Reasonable for a light aluminium machine; weak for one sized by steel.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 08 */
  {
    id: "guideways",
    number: 8,
    title: "Guideways",
    brief:
      "Guideways constrain each axis to move along one straight line and resist everything else. They carry the cutting force, the weight of whatever they support and the moments those loads create, and their straightness becomes the machine's straightness. On a repeatability-led brief they are one of the two or three decisions that matter most.\n\nFour properties compete. Stiffness under load decides how much the axis deflects. Friction decides how smoothly the axis creeps at low feed and how much thrust the drive needs. Damping decides how well the axis resists chatter. And preload, the deliberate internal load that removes clearance, trades stiffness against friction and life — more preload gives a stiffer, tighter axis that runs hotter and wears faster.\n\nThe inputs are already fixed: `500`, `400` and `350 mm` of travel, a moving mass of about `250 kg` on X, the C-frame arrangement and a cutting force estimate of about `800 N`. One brief sentence matters more than any of them: Northgate has a surface plate, a height gauge and dial indicators, and no interferometer. A guideway system that can only be installed and proven with instruments the owner does not have is not a good choice for that owner.\n\nChoose the guideway type, and say which of stiffness, friction, damping and installability you protected.",
    decision: {
      question:
        "Which guideway type should carry the three axes, given the loads, the budget and the metrology Northgate owns?",
      options: [
        {
          id: "profiled-ball-rail",
          name: "Profiled linear rails with recirculating ball bearing blocks",
          recommended: true,
          benefits: [
            "High stiffness and load capacity in all four directions from a compact, standard component.",
            "Very low friction, so low drive thrust, no stick-slip at fine feeds and easy fine positioning.",
            "Supplied to a known accuracy class, and installable against a machined datum edge using a dial indicator.",
            "Widely available with published load and life data, and interchangeable between suppliers on standard sizes.",
          ],
          drawbacks: [
            "Low friction also means low damping, so chatter resistance comes from the structure rather than the ways.",
            "Point contact makes them sensitive to the flatness and straightness of the mounting surfaces.",
            "Contaminated lubricant or a damaged seal destroys a block quickly, and chips are the usual culprit.",
            "Preload class is chosen once and cannot be adjusted afterwards.",
          ],
          cost:
            "Moderate and predictable, with the great advantage of being a bought item with a catalogue price rather than a fitting operation with an open-ended labour bill.",
          performance:
            "Good stiffness, excellent smoothness and good positioning behaviour. The damping deficit is real, and it is why the structure decision and the guideway decision have to be read together.",
          safety:
            "Low friction means a vertical axis will back-drive if the drive is de-energised, so the Z axis needs a holding brake and a properly designed safe state. That is safety-related control work for qualified personnel, and it must be specified rather than assumed.",
          maintenance:
            "Straightforward: scheduled lubrication, seal and wiper inspection, and replaceable blocks. Keeping chips and coolant out with good way covers is the single most effective maintenance measure.",
          fitForBrief:
            "It fits every constraint the brief actually imposes. Cost is known, availability is good, the drive thrust stays modest, and installation can be proven with a surface plate, a height gauge and dial indicators. The damping weakness is a genuine residual risk against the steel work — record it, and plan cutting trials to test it.",
        },
        {
          id: "profiled-roller-rail",
          name: "Profiled rails with roller bearing blocks",
          benefits: [
            "Line contact instead of point contact gives markedly higher stiffness and load capacity.",
            "Better suited to heavier interrupted cuts in steel and stainless.",
            "Less sensitive to local deformation under high load than ball blocks of the same size.",
            "Same installation method and datum-based alignment as ball rails, so nothing new to learn.",
          ],
          drawbacks: [
            "More expensive than ball rails, sometimes substantially.",
            "Higher friction than ball blocks, so a little more drive thrust and more heat.",
            "Even more demanding of mounting surface flatness and straightness.",
            "Availability and lead time are less good in smaller sizes.",
          ],
          cost:
            "The highest of the four bought-in options. The premium is real and the benefit is real, so the question is whether Northgate's cuts need it — and at about `800 N` of estimated process force on a modest machine, probably not.",
          performance:
            "The stiffest of the four for a given size, which shows up as better finish and better tool life in heavy steel cutting. On this machine the structure and the spindle are more likely to be the limit first.",
          safety:
            "Same considerations as ball rails, including the need for a Z-axis brake and a defined safe state designed and verified by qualified personnel.",
          maintenance:
            "Similar routine to ball rails, with the same absolute dependence on keeping chips and coolant out. Replacement blocks cost more.",
          fitForBrief:
            "Defensible, and the right answer if the steel and stainless work turns out heavier than assumed. Against a modest budget and a `800 N` estimate it spends money on stiffness the rest of the machine cannot yet exploit. Note it as the natural upgrade path.",
        },
        {
          id: "box-ways",
          name: "Hand-fitted box ways with a low-friction facing",
          benefits: [
            "Large sliding contact area gives excellent damping, which suppresses chatter in heavy cuts.",
            "Very high load capacity and stiffness, distributed over a broad contact rather than concentrated.",
            "Tolerant of chips and abuse compared with a recirculating ball block.",
            "Wear can be taken up by adjustment and re-fitting rather than replacement.",
          ],
          drawbacks: [
            "Requires hand scraping and fitting — a skilled craft that Northgate does not have and cannot easily buy in.",
            "High friction means much greater drive thrust, and stick-slip that limits fine positioning.",
            "Heat from friction is a thermal drift source on a machine whose priority is repeatability.",
            "Build hours are high and unpredictable, which is hard to plan against a modest budget.",
          ],
          cost:
            "Low material cost, high and uncertain labour cost. Buying in scraping expertise for a one-off machine is expensive when it is available at all.",
          performance:
            "The best damping of the four, and the worst friction. For heavy steel roughing that trade can be right; for a mixed shop that also wants fine finishing passes in aluminium it is much less attractive.",
          safety:
            "High friction means a vertical axis is far less likely to back-drive, which is a genuine safety advantage — but it is not a substitute for a designed and verified safe state and brake arrangement.",
          maintenance:
            "Adjustable and long-lived in skilled hands, and effectively unmaintainable without those hands. A shop that cannot scrape cannot restore a worn way.",
          fitForBrief:
            "Strong on damping, wrong on skills. The brief says the operators are competent machinists who are not machine builders, and the shop's metrology is a surface plate and indicators. Choosing a guideway that depends on a craft nobody in the building has is choosing a machine that cannot be maintained by its owner.",
        },
        {
          id: "round-shaft-bushings",
          name: "Hardened round shafting with recirculating ball bushings",
          benefits: [
            "The cheapest and most widely available linear motion components.",
            "Tolerant of small misalignments between mounting surfaces, so easier to install on an imperfect structure.",
            "Simple to design around, with straightforward supports and mountings.",
            "Very low friction, so modest drive thrust.",
          ],
          drawbacks: [
            "Much lower stiffness and moment capacity than profiled rails of comparable size.",
            "Shaft deflection between supports adds directly to the machine's straightness error.",
            "Poor resistance to the overturning moments a milling cut produces.",
            "Bushings wear into the shaft over time, and wear shows up as lost repeatability.",
          ],
          cost:
            "The lowest capital cost of the four, and the reason it is genuinely tempting for a self-built machine on a tight budget.",
          performance:
            "Adequate for light aluminium work and clearly insufficient for a machine sized by steel and stainless at about `800 N` of cutting force. Deflection under moment load is the limiting weakness.",
          safety:
            "Low friction means the same back-driving considerations as ball rails on a vertical axis, with the added concern that a compliant axis is more likely to be pushed off path by a heavy cut.",
          maintenance:
            "Cheap to replace and easy to work on. Against that, wear is continuous rather than sudden, so the machine loses accuracy gradually and the loss is easy to miss without regular checks.",
          fitForBrief:
            "Honest about being the budget option, and it fails the brief's first priority. Repeatable results in steel need moment stiffness that round shafting does not provide at this size. It would be a reasonable choice only if the intended use were reduced to light aluminium work.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 09 */
  {
    id: "axis-drives",
    number: 9,
    title: "Axis drives",
    brief:
      "The axis drive turns motor rotation into linear motion, and its characteristics decide how the machine feels and how well it holds position. Four properties matter: stiffness in the drive train, backlash or lost motion at reversal, efficiency, and whether the axis holds position when power is removed.\n\nReversal behaviour deserves special attention on this brief. Any lost motion in the drive train appears in the part at every direction change — most visibly as a step at the quadrant change of a circular interpolation test. Northgate asked for repeatable results, so reversal behaviour is close to being the headline requirement for this stage.\n\nInputs are already fixed: `500`, `400` and `350 mm` of travel, a moving mass of about `250 kg` on X, an estimated process force of about `800 N`, and an intention to reach a rapid of about `30 m/min` (`0.5 m/s`) at about `3 m/s²`. Those numbers make the ball-screw arithmetic simple: with a `10 mm` lead, motor speed at rapid is `n = (v × 1000) / P = 30000 / 10 = 3000 rev/min`.\n\nThe vertical axis has a safety dimension the horizontal axes do not. A low-friction, high-efficiency drive will back-drive under gravity when de-energised, so the Z axis needs a designed holding arrangement and a defined safe state. Choose the drive type, then say what happens to Z when the power fails.",
    decision: {
      question:
        "How should each linear axis be driven, given `500 mm` maximum travel, about `250 kg` moving mass and a repeatability-led brief?",
      options: [
        {
          id: "ground-ballscrew-direct",
          name: "Ground ball screw, direct-coupled to the motor",
          recommended: true,
          benefits: [
            "High efficiency and high stiffness, with preloaded nuts giving very little lost motion at reversal.",
            "Direct coupling removes belt compliance and one more thing to tension and replace.",
            "A `10 mm` lead gives `3000 rev/min` at a `30 m/min` rapid — comfortable for an ordinary servo motor.",
            "Well-supported by manufacturer sizing data covering life, critical speed and buckling.",
          ],
          drawbacks: [
            "Ground screws cost significantly more than rolled ones.",
            "The screw's own inertia and any misalignment go straight into the motor, with no belt to absorb them.",
            "High efficiency means the axis back-drives, so a vertical axis needs a brake.",
            "Screw length is limited by critical speed, which constrains how fast a long axis can run.",
          ],
          cost:
            "Mid to high on components and low on complication. There is only one drive element per axis, no reduction stage and no belt, which keeps build hours and later maintenance down.",
          performance:
            "The best combination of stiffness, low lost motion and efficiency for travels of this order. At `500 mm` critical speed is not a constraint at `3000 rev/min`, so the arithmetic is comfortable rather than marginal.",
          safety:
            "The efficiency that makes it good makes the Z axis back-drivable, so a holding brake and a defined safe state on power loss or emergency stop are mandatory. That is safety-related control design and must be specified, implemented and verified by qualified personnel.",
          maintenance:
            "Scheduled lubrication and periodic backlash and end-float checks, all of which can be done with a dial indicator. No belts to tension. A worn screw is a replacement rather than a repair.",
          fitForBrief:
            "It answers the brief's first priority directly: a preloaded ground screw with a direct coupling is the option with the least lost motion at reversal, and reversal is where repeatability is won or lost. The cost is the honest objection, and it should be weighed against a rolled screw with a written note about the reversal consequence.",
        },
        {
          id: "rolled-ballscrew-belt",
          name: "Rolled ball screw with a toothed-belt reduction",
          benefits: [
            "Rolled screws cost far less than ground screws for similar mechanics.",
            "A belt reduction lets a smaller, faster motor drive the screw, cutting motor cost.",
            "The belt absorbs misalignment and isolates the motor from screw vibration.",
            "The motor can be moved out of the way, which helps package a compact machine.",
          ],
          drawbacks: [
            "Rolled screws have looser lead accuracy than ground screws, so positioning error is larger.",
            "A belt adds compliance in the drive train, which lowers achievable servo stiffness and bandwidth.",
            "Belt tension is a maintenance item, and tension affects both position error and bearing load.",
            "Two stages instead of one means two places for lost motion to hide.",
          ],
          cost:
            "The lowest of the four, and the saving is genuinely useful against a modest budget: cheaper screws and a smaller motor per axis.",
          performance:
            "Perfectly serviceable for general work, with measurably poorer reversal and positioning behaviour than a ground screw and direct coupling. On a brief led by repeatability that is the wrong place to save.",
          safety:
            "Belts must be fully guarded, and belt failure is a hazard on a vertical axis — a Z axis relying on a belt needs a brake that acts on the load side of it. All such arrangements need design and verification by qualified personnel.",
          maintenance:
            "More routine tasks: belt inspection and tension, pulley condition, plus the usual screw lubrication. All of it is within an ordinary fitter's competence.",
          fitForBrief:
            "The best value option and a real candidate given the budget. It loses on the brief's stated first priority. If cost forces this choice, record the reversal and lead-accuracy consequences explicitly, and put a circular interpolation test in the validation plan to quantify what was given up.",
        },
        {
          id: "rack-and-pinion",
          name: "Rack and pinion with a planetary gearbox",
          benefits: [
            "Travel length is unlimited in principle, since the rack can be extended in sections.",
            "No critical-speed limit, so high rapids are available on long axes.",
            "Low inertia contribution from the drive element itself.",
            "Robust and tolerant of dirt compared with a screw and nut.",
          ],
          drawbacks: [
            "Gear backlash is inherent unless a preloaded twin-pinion arrangement is used, which is expensive.",
            "Lower drive stiffness than a ball screw of similar capacity.",
            "Rack alignment and joints between rack sections introduce position error.",
            "Needs open lubrication of the gear mesh, which invites contamination in a milling environment.",
          ],
          cost:
            "Moderate for the mechanics and high for the anti-backlash arrangement that a precision application needs. At `500 mm` of travel it buys nothing a screw does not already provide.",
          performance:
            "Excellent for long travels and unremarkable at short ones. The backlash and stiffness disadvantages are exactly the properties this brief cares about most.",
          safety:
            "Not self-locking, so the same vertical-axis holding requirements apply. An exposed gear mesh needs guarding and disciplined lubrication.",
          maintenance:
            "Rack and pinion wear is gradual and visible, and adjustment is possible. Against that, keeping an open mesh clean and lubricated in a chip-filled machine is a persistent chore.",
          fitForBrief:
            "A solution to a problem Northgate does not have. Their longest travel is `500 mm`, well within ball-screw territory, so the one real advantage of rack and pinion never applies while its backlash disadvantage attacks the brief's first priority.",
        },
        {
          id: "linear-motor",
          name: "Direct-drive linear motors",
          benefits: [
            "No mechanical transmission at all, so no backlash, no screw wind-up and no lost motion.",
            "Very high acceleration and very high velocity available.",
            "Position is measured directly on the axis, closing the loop on the thing that actually matters.",
            "Almost nothing to wear in the drive itself.",
          ],
          drawbacks: [
            "The highest cost of the four by a wide margin, in motors, drives and linear encoders.",
            "Zero holding force when de-energised: the axis is completely free, which is a serious matter on Z.",
            "Substantial heat generated right next to the structure, working directly against thermal stability.",
            "Requires a linear scale for feedback and expertise to tune, neither of which the shop has.",
          ],
          cost:
            "Far beyond a modest budget for a machine of this size, and the cost is not only capital: it brings drives, scales, cooling and commissioning expertise with it.",
          performance:
            "Outstanding dynamics and outstanding positioning, in a machine whose limits are set by structure, spindle and material long before the drives. Buying performance the rest of the machine cannot use is not an upgrade.",
          safety:
            "The loss of holding force when de-energised is the decisive concern. A vertical linear-motor axis must have an engineered mechanical brake and a defined safe state, designed and verified by qualified personnel under the applicable standards.",
          maintenance:
            "Very little to wear mechanically, and much harder to diagnose and repair when something does go wrong. Scales are delicate and contamination-sensitive in a milling environment.",
          fitForBrief:
            "Wrong on cost, wrong on skills, wrong on thermal stability for a repeatability-led brief. It belongs in the report as the option considered and rejected with a specific reason, which is more useful to a reviewer than not mentioning it at all.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: "motor-estimates",
    number: 10,
    title: "Motor estimates",
    brief:
      "This stage turns the mechanical concept into numbers a supplier can quote against: thrust, torque, speed and inertia per axis. It is also the stage where the difference between an estimate and a selection has to be stated plainly, because the arithmetic is easy and the responsibility is not.\n\nWork the X axis with the numbers this project has already fixed: moving mass about `250 kg`, rapid `30 m/min` (`0.5 m/s`), acceleration `3 m/s²`, process force about `800 N`, a `10 mm` lead ball screw at about `0.90` efficiency, and a guideway friction coefficient of about `0.005`. Then `F_a = m × a = 750 N`, `F_f = μ × m × g = 0.005 × 250 × 9.80665 = 12.3 N`, and with the process force the total thrust is about `1562 N`. Screw torque follows from `T = (F × P) / (2π × η) = (1562 × 0.01) / (2π × 0.90)`, about `2.76 N·m`, at `n = (v × 1000) / P = 3000 rev/min`. Reflected load inertia is `J_load = m × (P / 2π)²`, about `6.3 × 10⁻⁴ kg·m²`. A `500 mm` trapezoidal move takes `t = (L / v) + (v / a) = 1.0 + 0.17 = 1.17 s`.\n\nThose figures deliberately ignore screw inertia, coupling and bearing losses, duty cycle, thermal limits, critical speed and buckling. They are enough to confirm the concept is drivable by ordinary components rather than something exotic. They are not enough to buy a motor.\n\nChoose how the motor sizes will be established, and be honest about where your responsibility ends and the supplier's engineering begins.",
    decision: {
      question:
        "How should the axis motor sizes be established, given a hand calculation of about `1562 N` thrust and `2.76 N·m` at `3000 rev/min` on X?",
      options: [
        {
          id: "hand-calculation-then-vendor",
          name: "Hand calculation now, manufacturer sizing software before purchase",
          recommended: true,
          benefits: [
            "The hand calculation proves the concept is feasible and shows exactly which assumption drives each number.",
            "It gives a duty specification a supplier can check, rather than asking them to guess the application.",
            "The vendor's software covers what the hand calculation omits: duty cycle, thermal limits, screw inertia, critical speed.",
            "It keeps the engineering reasoning inside the project instead of outsourcing the understanding along with the sizing.",
          ],
          drawbacks: [
            "Two steps take longer than one, and the second step depends on a supplier's cooperation.",
            "Different vendors' tools give different answers, which has to be reconciled rather than averaged.",
            "It is tempting to treat the hand figure as final once it is written down.",
            "The hand calculation needs assumptions — efficiency, friction — that are themselves estimates.",
          ],
          cost:
            "No cost beyond engineering time, and it usually saves money by catching an oversized selection before an order is placed.",
          performance:
            "The best-founded sizing available at concept stage. Knowing that X needs roughly `2.76 N·m` at `3000 rev/min` is enough to see that a common servo frame size will serve, which is the question a concept actually has to answer.",
          safety:
            "Motor sizing interacts with safety in ways a spreadsheet does not show: holding torque on a vertical axis, brake selection, behaviour on power loss and following-error limits are all safety-related. They must be specified and verified by qualified personnel as part of the safety-related control system.",
          maintenance:
            "Correctly sized motors run cooler and last longer, and a documented duty calculation gives maintenance a baseline: if an axis starts drawing more current than the calculation predicts, something mechanical has changed.",
          fitForBrief:
            "It matches the brief's economics and its honesty requirement. Nothing is bought on a guess, nothing is oversized to cover ignorance, and the report can state exactly what the estimate covers and what it does not. Record plainly that the hand figures ignore screw inertia, losses, duty cycle, thermal limits, critical speed and buckling, and that final selection requires the manufacturer's sizing tools and engineering review.",
        },
        {
          id: "vendor-package",
          name: "Give the duty data to a drive supplier and buy their matched package",
          benefits: [
            "The supplier owns the sizing calculation and stands behind it commercially.",
            "Motor, drive, cable and feedback are matched and known to work together.",
            "Commissioning is faster, and support is a single phone call rather than a three-way argument.",
            "Their software includes duty-cycle and thermal analysis that a hand calculation omits.",
          ],
          drawbacks: [
            "The answer is only as good as the duty data you supply, so the responsibility does not really transfer.",
            "Vendor lock-in on spares and replacements, which matters over a machine's life.",
            "Suppliers tend towards conservative selections, which costs money and adds inertia.",
            "The project loses the understanding, which makes later troubleshooting harder.",
          ],
          cost:
            "Often higher than sourcing components separately, sometimes offset by a package discount and by shorter commissioning. Spares pricing over the machine's life is the part most often overlooked.",
          performance:
            "Reliable and well-matched, and no better than the duty data behind it. This is the point most beginners miss: the supplier cannot know your friction, your duty cycle or your worst-case cut unless you tell them.",
          safety:
            "A matched package usually makes the brake, feedback and safe-state options coherent, which is helpful. It does not remove the need for the safety-related control system to be designed and verified by qualified personnel.",
          maintenance:
            "Simple and well-documented while the supplier supports the range. Obsolescence is the risk, and it is a real one over a fifteen-year machine life.",
          fitForBrief:
            "A sound commercial route, best used after the hand calculation rather than instead of it. Northgate's shop needs to understand its own machine to maintain it, and the duty data has to come from this project either way.",
        },
        {
          id: "copy-comparable-machine",
          name: "Copy the motor sizes from a comparable commercial machine",
          benefits: [
            "Fast, free and grounded in something that demonstrably works.",
            "Implicitly includes real-world margins that a textbook calculation may miss.",
            "Useful as a sanity check: a wildly different answer means one of you is wrong.",
            "Published specifications for machines of this class are easy to find.",
          ],
          drawbacks: [
            "You do not know their moving mass, their guideway friction, their screw lead or their duty assumptions.",
            "Their design decisions came from their brief, not Northgate's.",
            "Copying a number teaches nothing about which parameter to change when something does not work.",
            "It can be wrong in both directions — oversized for their marketing or undersized for a different duty.",
          ],
          cost:
            "Free to do, potentially expensive to get wrong. An oversized motor costs money and inertia; an undersized one costs a redesign after commissioning.",
          performance:
            "Often approximately right, and never traceable. Approximately right is genuinely useful as a cross-check and genuinely inadequate as a design record.",
          safety:
            "Copying drive sizing without copying the safety concept behind it is a real hazard: brakes, safe states and following-error limits are specific to the machine and must be engineered for this one by qualified personnel.",
          maintenance:
            "No particular effect, except that without a duty calculation there is no baseline to compare against when an axis starts behaving differently.",
          fitForBrief:
            "Fine as a second opinion, unacceptable as the primary method. A concept report whose motor sizes trace to 'a similar machine has these' gives a reviewer nothing to check, which defeats the purpose of writing the report.",
        },
        {
          id: "oversize-one-frame",
          name: "Size from the calculation, then step up one motor frame size",
          benefits: [
            "Covers estimation error in friction, efficiency and process force with one simple decision.",
            "Leaves headroom if the intended cuts turn out heavier than assumed.",
            "Reduces the chance of a thermal limit being reached in continuous duty.",
            "Simple to explain and simple to apply consistently across three axes.",
          ],
          drawbacks: [
            "A larger motor has more rotor inertia, which can actually worsen dynamic response and tuning.",
            "It costs money and cabinet space against a modest budget.",
            "It can let the drive exceed the structure's or the fixture's capacity, moving the weak point somewhere less visible.",
            "It substitutes a margin for the analysis that would have told you whether a margin was needed.",
          ],
          cost:
            "A predictable increase per axis in motor, drive and sometimes cable, plus the electrical installation behind it. Modest per axis, noticeable across three.",
          performance:
            "More thrust and more thermal headroom, at the price of higher inertia ratio and often a less crisp axis. Bigger is not automatically better in a servo system — inertia matching matters.",
          safety:
            "Genuinely worth thinking about: a more powerful drive can push harder into a crash or a mis-clamped part. Following-error limits, torque limits and the safe state must be set deliberately, by qualified personnel, rather than left at defaults.",
          maintenance:
            "Motors running well within their ratings run cooler and last longer, which is a real benefit. Larger frames may need more cabinet cooling.",
          fitForBrief:
            "Reasonable engineering caution that becomes a habit of hiding uncertainty. The better answer here is to keep the calculation honest, put the uncertainty in the risk register, and let the manufacturer's sizing software decide whether headroom is needed — then record why.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ 11 */
  {
    id: "electrical",
    number: 11,
    title: "Electrical design",
    brief:
      "This stage decides the electrical architecture of the machine: how power arrives, how it is distributed to the spindle drive and the three axis drives, how everything is isolated for maintenance, where the control cabinet sits, how it is kept cool and clean, and how cables and hoses reach moving parts without failing.\n\nBefore reading any further, be clear about the boundary. Designing, building, installing, modifying and verifying the electrical equipment of a machine tool is work for qualified personnel, carried out and certified under the applicable law and standards for the country of installation. This stage teaches architecture and principle so that you can specify a machine, brief an electrical engineer and understand their answers. It does not teach you to wire a machine, and nothing in this course should be used as an installation instruction. The standard that frames this subject is IEC 60204-1, which addresses the safety of the electrical equipment of machines; consult the official published document for its actual requirements, which are not reproduced anywhere in this course.\n\nThe inputs come from earlier stages. The spindle arrangement sets the spindle drive rating and its speed control requirements. The axis drive and motor decisions set the number of drives, their ratings, their feedback type and whether any axis needs a holding brake. The intended use sets the duty: Northgate's one to two shifts a day is a different thermal problem in a cabinet from continuous three-shift running. And the brief's three-phase supply removes a constraint rather than imposing one — it means the spindle and drive power available is a design choice rather than a limit, up to whatever the building's supply and protection actually allow, which is a question for the installer, not an assumption for the designer.\n\nThe trade-offs are mostly about heat, dirt, distance and access. A single cabinet is cheaper and simpler than two, but it puts drive heat and control electronics in one enclosure and often forces long motor cables. Mounting the cabinet on the machine saves floor space in a `2.0 × 2.0 m` bay and shortens cables, but couples machine vibration and coolant mist to the electronics and makes the cabinet harder to reach. Filtered forced-air cooling is cheap and needs its filters cleaned; a sealed cabinet with a heat exchanger keeps contamination out and costs more. Long motor cables raise cost and can affect drive behaviour, so cabinet position and cable routing are an electrical decision as much as a layout one.\n\nCables and hoses to moving parts are the most common source of nuisance faults on a machine of this kind. The design questions are how they are supported, what bend radius they are given, how power, feedback and signal circuits are separated so that switching noise does not corrupt measurement, and how the whole bundle is protected from chips and coolant. On a moving-table C-frame the Z head and the table both move, so both need managed routing, and every flexing cable is a wear item with a finite life.\n\nFinally, maintenance and isolation. The machine must be capable of being isolated so that maintenance can be carried out safely, with a means of locking the isolation in the off position, and the design should make the parts a fitter needs to reach reachable without dismantling the machine. Northgate's operators are competent machinists rather than machine builders, so labelling, documentation and a clear circuit description are part of the deliverable, not an optional extra. How that isolation is implemented and verified is a matter for the qualified personnel doing the work.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhat electrical information does this stage need from the spindle, axis-drive and motor-estimate stages, and what would you have to ask a supplier for?\n\nWhat are the arguments for and against mounting the control cabinet on the machine rather than standing it beside the machine, in a bay of about `2.0 × 2.0 m`?\n\nWhy are power, feedback and signal circuits routed and screened separately, and what symptom would you expect if they were not?\n\nWhich parts of this stage may you specify as a designer, and which must be carried out and verified by qualified personnel under applicable standards?\n\nWhat would you write in the concept report about isolation, labelling and documentation so that a competent machinist can maintain this machine safely?",
  },

  /* ------------------------------------------------------------------ 12 */
  {
    id: "control-architecture",
    number: 12,
    title: "Control architecture",
    brief:
      "Control architecture is the decision about what actually commands the machine: the controller and its software, how position is measured and fed back, how the three axes are coordinated so that a programmed path becomes a real one, and how the operator interacts with all of it. It is where the mechanical machine becomes a CNC machine.\n\nAs with the electrical stage, be clear about the boundary first. The parts of the control system that perform safety functions — emergency stop, guard interlocking, safely limited speed, safe torque off, brake control on a vertical axis — are safety-related control systems, and they must be specified, implemented, validated and documented by qualified personnel under the applicable standards. ISO 13849-1 is the standard that frames the design of safety-related parts of control systems; consult the official published document for its actual requirements, which are not reproduced in this course. This stage teaches architecture and principle, so that you can specify a control system and understand what a controls engineer tells you.\n\nThe inputs are the motion requirements from earlier stages and the physical machine you have designed. Three axes, travels of `500`, `400` and `350 mm`, a rapid of about `30 m/min` at about `3 m/s²`, and a spindle that must be commanded across a wide speed range. The guideway and drive decisions determine what feedback is possible and what a brake must do. The intended use — prototype and short-run work with frequent new setups — sets what the operator interface has to be good at, which is not the same thing as what looks impressive in a demonstration.\n\nThe first architectural choice is the controller family. An industrial CNC from an established supplier brings mature motion control, documented interfaces, spare parts and training, at higher cost and with less freedom to modify. A PC-based or open control platform is cheaper, more flexible and easier to extend, but the integration work, the documentation and the long-term support become the project's own responsibility. A hybrid — an industrial motion controller with a custom operator interface — sits between the two. For a six-person shop whose operators are machinists rather than machine builders, the availability of documentation, training and support is a heavier criterion than it first appears.\n\nThe second choice is where position is measured. Closing the loop on a rotary encoder at the motor is cheaper and simpler, and it measures the motor rather than the machine: anything that happens between the motor and the tool — screw lead error, thermal growth, backlash, deflection — is invisible to it. Closing the loop on a linear scale attached to the axis measures much closer to the thing you care about, at higher cost and with a scale to protect from chips and coolant. Because Northgate asked for repeatable results and has no interferometer, this decision interacts directly with the alignment and validation stages: feedback you cannot verify independently is feedback you have to trust.\n\nThe third area is coordination and the practical behaviour that follows from it: how the controller interpolates between axes so that a circular path is round, how it looks ahead to keep corner speeds sensible, and how following error is limited so a fault stops the machine rather than gouging the part. A step at the quadrant change of a circular test is the classic symptom that ties this stage back to backlash, servo tuning and mechanical lash, and it is worth designing the machine so that test can be run easily and repeatedly.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhat does closing the position loop at the motor fail to see, and which earlier decisions in this project make that omission more or less serious?\n\nWhy might a six-person shop of machinists prefer a mature industrial control over a cheaper open platform, even though the open platform is more capable on paper?\n\nWhich control functions in this machine are safety functions, and who must design, validate and document them?\n\nWhat would you specify about following-error limits and the safe state of the Z axis, and why does the axis-drive decision make that necessary?\n\nHow would you design the machine and its control so that a circular interpolation test can be run as routine maintenance rather than as a special event?",
  },

  /* ------------------------------------------------------------------ 13 */
  {
    id: "auxiliary-systems",
    number: 13,
    title: "Auxiliary systems",
    brief:
      "Auxiliary systems are everything that keeps the machine working that is not structure, drive or control: lubrication, coolant, chip handling, compressed air, way protection, enclosure sealing and waste management. They are the systems most often left until last and the systems most likely to make an otherwise good machine unpleasant to own.\n\nThe brief points straight at this stage. Northgate values easy setup and serviceability, runs one to two shifts a day, and machines aluminium, mild steel and occasionally stainless — three materials with quite different chip and coolant behaviour. Aluminium makes light, clinging chips in large volume; steel makes heavier chips that fall; stainless makes work-hardening chips that demand reliable coolant delivery at the cutting edge. A single machine has to cope with all three, and the chips have to end up somewhere a person can empty without a struggle.\n\nBefore going further, one boundary. Any compressed-air, hydraulic or high-pressure coolant system stores energy and must be designed, installed, commissioned and maintained by qualified personnel under the applicable law and standards, with a defined means of isolating and safely releasing that stored energy before maintenance. This stage describes architecture and principle only, and it is not an installation instruction.\n\nLubrication is the first real decision. Manual greasing of rails and screws is cheap and needs nothing but discipline, which is exactly the thing that fails in a busy shop. A centralised system with a pump and metering units costs more and removes the discipline problem, and it introduces its own failure mode: a blocked line that nobody notices until a bearing block is ruined. The design questions are which points need lubricating, how a person can tell that lubricant actually arrived, and how a failure becomes visible rather than silent.\n\nCoolant and chip handling are the next. Flood coolant is effective and brings a tank, a pump, filtration, mist containment and a maintenance regime with it; mist or through-tool air is simpler and much less capable in stainless. Whatever is chosen, the chips must be guided somewhere: on a moving-table C-frame the table carries chips into the way covers unless the enclosure and covers are designed to shed them. Sloped surfaces, generous drainage, accessible trays and way covers that a fitter can remove without dismantling half the machine are the difference between a machine that is easy to own and one that is not. Coolant also has hygiene and disposal obligations that are the owner's legal responsibility.\n\nWay protection deserves its own sentence because it protects the two most expensive mechanical decisions in the project. Profiled rails and ball screws fail quickly when contaminated. Bellows, telescopic covers and wipers each have a cost, a footprint and a life, and each takes some travel away from the axis it protects, which loops back to the travel derivation. Compressed air, if used, brings positive pressure for sealing, air blast for chip clearing and possibly a spindle air seal — all useful, all requiring a properly designed and maintained supply.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhich earlier decisions in this project make way protection critical rather than optional, and what would failure look like?\n\nWhat are the honest arguments for and against a centralised lubrication system for a six-person shop running one to two shifts?\n\nHow do the three materials in the brief differ in what they demand of coolant and chip handling, and how would you cope with all three in one machine?\n\nWhich auxiliary systems store energy, and what must be true before anyone works on them?\n\nWhere on the moving-table C-frame will chips actually accumulate, and what would you change in the enclosure design to make emptying it a two-minute job?",
  },

  /* ------------------------------------------------------------------ 14 */
  {
    id: "safety-concept",
    number: 14,
    title: "Safety concept",
    brief:
      "The safety concept is the part of this project where the honest answer is the most important one. A machine tool concentrates enough energy in a small space to injure or kill, and the design work that prevents that is a formal engineering discipline with legal force behind it. It must be carried out, documented and verified by qualified personnel under the applicable law and standards for the place where the machine will be used. Nothing in this course substitutes for that work, and no beginner should build and operate an industrial machine tool without it.\n\nWhat you can learn here is the shape of the work and the vocabulary, so that you can specify a machine, brief a competent engineer, read what they produce and understand what they are protecting against. Several standards frame this subject and are worth knowing by purpose and scope. ISO 12100 addresses the general principles of risk assessment and risk reduction in machinery design. ISO 13849-1 addresses the design of safety-related parts of control systems. IEC 60204-1 addresses the safety of the electrical equipment of machines. ISO 16090-1 addresses safety requirements specifically for machining centres, milling machines and transfer machines. Their actual requirements — every limit, category, level and clause — are in the official published documents and are deliberately not reproduced anywhere in this course. Consult them, or the engineer who works with them daily.\n\nThe inputs to this stage are the whole machine as designed so far. The architecture and travels define the swept volume that must be guarded and the reaches an operator makes. The spindle decision defines the rotating energy and the consequences of a tool or holder failure. The axis-drive decision defines what happens to the Z axis when power is removed. The auxiliary systems bring stored energy, mist and hot surfaces. The intended use defines who is exposed and how often: Northgate's operators change setups several times a day, which means they interact with the working zone far more than a production operator would.\n\nThe principle that runs through all of it is that risk is reduced by design first, by safeguarding and protective measures second, and by information and training last — and that the earlier in that order a risk is dealt with, the more reliably it is dealt with. A trapping point removed by moving a component is gone; the same trapping point covered by a warning label is still there. That is why safety belongs in a concept stage at all: many of the cheapest and most effective measures are decisions about layout, geometry and access that become expensive or impossible later.\n\nThe architecture of the safety concept for a machine like this covers, at minimum: an enclosure that contains chips, coolant and the consequences of a tool failure; interlocked access doors that make the hazardous motion impossible while they are open; an emergency stop arrangement that brings the machine to a safe state; a defined safe state for the vertical axis, including brake behaviour on power loss; safe handling of stored energy in air, coolant and electrical systems for maintenance; and clear information for the operator. Every one of those is a specification a competent engineer turns into a verified design, and every one of them has to be validated on the finished machine rather than assumed from the drawing.\n\nOne further honesty requirement belongs in the report. This project is a concept exercise. The machine described in it has not been analysed structurally, has no electrical design, has no risk assessment and has not been validated. Writing that plainly is not a disclaimer bolted on at the end; it is the accurate description of what a concept is, and it is what allows a reviewer to see what still has to be done.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhy does the order — design out, then safeguard, then inform — matter, and what does it imply about doing safety work at concept stage?\n\nWhich decisions taken earlier in this project have already created or removed hazards, and can you name three specific examples?\n\nWhat is the defined safe state of the Z axis on power loss, and which earlier decision made that question unavoidable?\n\nWhich parts of the safety concept can you legitimately specify, and which must be designed, verified and documented by qualified personnel?\n\nWhat exactly would you write at the top of the concept report so that nobody could mistake it for a machine that is ready to build and operate?",
  },

  /* ------------------------------------------------------------------ 15 */
  {
    id: "manufacturing-and-assembly",
    number: 15,
    title: "Manufacturing and assembly",
    brief:
      "This stage asks how the concept becomes metal: what is made in-house, what is bought, what is subcontracted, in what order the work happens, and how the parts come together into a machine whose geometry can then be aligned. It is the stage where a design that looks fine on a screen meets the limits of real machines, real material sizes and real lifting equipment.\n\nThe inputs are the structural decision and the architecture. A welded steel structure implies a specific and non-negotiable sequence: fabricate, stress-relieve, then machine the datum and mounting surfaces — because machining before stress relief means the surfaces move afterwards. That single ordering constraint drives much of the plan, including a hard question the project has to answer early: which machine will machine the base and column, and does one exist locally with the capacity to do it? A `500 × 400 mm` travel machine has a base too large for many small workshops to machine themselves.\n\nMake-or-buy is the next decision, and it is mostly about where the risk sits. Rails, screws, bearings, motors, drives and the controller are bought — designing them would be absurd. The structure, the spindle head assembly, the table and the enclosure are candidates for in-house work or subcontracting, and each has a different risk profile: in-house keeps cost and knowledge inside the shop and consumes capacity it needs for paying work; subcontracting buys capability and schedule certainty and requires drawings good enough for someone else to work from.\n\nTolerances and datums are where manufacturing meets the alignment stage that follows. The machine needs a small number of well-defined datum surfaces from which everything else is set, and those surfaces need to be machined in as few setups as possible so that squareness comes from the machine that cut them rather than from the fitter's patience. Designing in adjustment — shim faces, jacking screws, dowel provision, access to fasteners — is far cheaper than discovering during assembly that a critical surface cannot be corrected. Equally, designing in too much adjustment turns a machine into something that must be re-adjusted forever.\n\nThe assembly sequence itself needs planning, not improvisation. Heavy sub-assemblies must be liftable, and lifting means designed lifting points, appropriate equipment and a plan — for a six-person shop this is a genuine constraint, not a detail. Access matters too: fasteners you cannot reach with the machine assembled become fasteners nobody checks. Any lifting or handling operation must be planned and carried out by competent people with suitable equipment under the applicable law and standards, and any pressure or electrical system commissioned by qualified personnel.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhy must a welded structure be stress-relieved before its datum surfaces are machined, and what happens if that order is reversed?\n\nWhich parts of this machine would you buy rather than make, and what is the reasoning that separates the two lists?\n\nWhich datum surfaces does this design depend on, and how would you machine them in as few setups as possible?\n\nWhere have you designed in adjustment, and how did you decide that each adjustment was worth having?\n\nWhat are the heaviest sub-assemblies, and what does a six-person workshop need in place before lifting them?",
  },

  /* ------------------------------------------------------------------ 16 */
  {
    id: "alignment-strategy",
    number: 16,
    title: "Alignment strategy",
    brief:
      "Alignment is how the machine is brought into geometric truth after assembly, and — just as importantly — how that truth is re-established later. This is the stage where one sentence of Northgate's brief becomes decisive: they have a surface plate, a height gauge and dial indicators, and no laser interferometer. A machine whose geometry can only be set and verified with instruments the owner does not have is not a machine the owner can keep.\n\nThe geometric properties that matter are straightness of each axis, squareness between the axes, parallelism of the table to the X and Y motion, and the perpendicularity of the spindle axis to the table. Each is a physical relationship that can be checked with the right fixture and a good indicator; each has an achievable target that depends on the structure, the guideways and the care taken in assembly; and each will drift with wear, temperature and any disturbance to the structure. The standard that frames this subject is ISO 230, a test code for machine tools covering the determination of geometric accuracy — consult the official published document for its actual test methods and requirements, which are not reproduced in this course.\n\nThe inputs come from the manufacturing stage: the datum surfaces you defined, the adjustment you designed in, and the accuracy of the machined mounting faces for the guideways. Alignment cannot rescue a structure with no adjustment provision, and it cannot make a poorly machined rail seat straight. The order of operations matters as well — base level and stable first, then the guideway mounting faces, then each axis in turn, then squareness between axes, then the spindle to the table — because each step is measured from something the previous step established.\n\nThe trade-offs are about how much adjustment to provide, how tightly to aim, and how repeatably the checks can be made. Generous adjustment makes assembly forgiving and makes it possible for the machine to be knocked out of true; minimal adjustment forces the manufacturing to be right and makes the machine hard to correct after wear. Aiming tighter than the shop can measure produces a number nobody can verify and an argument nobody can settle. The useful target is a set of checks that a competent machinist can perform with the shop's own instruments, in an hour or two, with results repeatable enough that a change means something real.\n\nThat last point is the design requirement hiding in this stage. If a geometry check needs the enclosure dismantled, a special fixture that does not exist, or a reference surface nobody can reach, it will be done once at commissioning and never again. Designing accessible reference surfaces, indicator mounting points and a documented procedure into the machine is what converts alignment from a one-off ceremony into ordinary maintenance — which is exactly what a brief asking for repeatable results requires.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhich geometric relationships would you check on this machine, and in what order, and why does the order matter?\n\nHow would you check squareness between two axes using only a surface plate, a height gauge and dial indicators?\n\nWhat design features must exist on the machine for those checks to be repeatable by a competent machinist a year later?\n\nWhy is it a mistake to specify a geometric target tighter than the shop can measure?\n\nWhat would you record at commissioning so that a later check can tell you whether anything has changed?",
  },

  /* ------------------------------------------------------------------ 17 */
  {
    id: "validation-plan",
    number: 17,
    title: "Validation plan",
    brief:
      "Validation is how you find out whether the machine you built is the machine you designed. It is the stage that converts assumptions into evidence, and it is written before the machine is finished — because a test you invent after a disappointing result is not a test, it is a negotiation.\n\nA validation plan has four parts for each thing being tested: what property is being checked, how it will be measured and with what, what result would be acceptable, and what happens if the result is not acceptable. That last part is the one most often missing, and it is what makes a plan usable: a test with no defined consequence is a measurement, not a validation.\n\nThe inputs are every assumption made earlier in this project. The cutting force estimate of about `800 N` was an estimate — cutting trials test it. The motor sizing ignored duty cycle and thermal limits — running the axes through representative cycles and watching temperature and current tests it. The guideway choice traded damping for friction — a cut that chatters or does not chatter tests it. The alignment strategy claimed the geometry could be proven with the shop's own instruments — carrying out the checks tests that claim too. Two standards frame the formal side of this work and are worth knowing by purpose and scope: ISO 230 as a test code for the geometric accuracy of machine tools, and ISO 10791 as a series covering test conditions for machining centres. Their actual test conditions and requirements are in the official published documents and are not reproduced in this course.\n\nA sensible plan for a machine like this moves from the least destructive tests to the most demanding. Geometry first, cold and unloaded, using the checks from the alignment stage. Then motion without cutting: repeatability of returning to a position, behaviour at low feed, and a circular interpolation test — the test whose quadrant-change step exposes backlash, lash and servo tuning together. Then thermal behaviour: run the machine and watch what moves as it warms, because a repeatability-led brief lives or dies on this. Then cutting trials in each of the three materials, starting light, recording finish, sound, tool life and dimensions. Then the auxiliary systems under real conditions, because chip handling only reveals itself when there are chips.\n\nSafety validation sits alongside all of this and is not the designer's to sign off. Verification and validation of the safety functions — interlocks, emergency stop, safe states, brake behaviour — must be carried out and documented by qualified personnel under the applicable standards before the machine is used for production. The same is true of the electrical installation. A validation plan should say who is responsible for each part and what evidence they will produce, because a machine with no documented safety validation is not a machine that may be put to work.\n\nFinally, record a baseline. Every number measured at commissioning becomes the reference against which every later check is judged, and a machine with no baseline can only be assessed against opinion. That baseline is also the most valuable maintenance document the machine will ever have.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhich three assumptions made earlier in this project would you most want to test first, and what test would test each?\n\nWhat does a step at the quadrant change of a circular interpolation test tell you, and what would you check next?\n\nWhy does a validation plan need an acceptance criterion and a defined consequence for each test, not just a measurement method?\n\nWho validates the safety functions and the electrical installation, and what evidence should exist before the machine is used?\n\nWhat baseline measurements would you record at commissioning, and how would they be used two years later?",
  },

  /* ------------------------------------------------------------------ 18 */
  {
    id: "maintenance-plan",
    number: 18,
    title: "Maintenance plan",
    brief:
      "A maintenance plan is a design output, not an afterthought. Northgate put serviceability among their three stated priorities, which means the plan and the machine have to be designed together: a task nobody can reach is a task nobody does, and a check that needs an instrument the shop does not own is a check that never happens.\n\nThe plan has three layers. Routine tasks are what the operator does daily or weekly: clear chips, check coolant level and condition, look at way covers and wipers, listen to the machine. Scheduled tasks are what a fitter does monthly, quarterly or annually: lubrication service, belt tension and condition, fastener checks on critical joints, backlash and end-float checks on the screws, filter cleaning, coolant system service. Condition-based tasks are triggered by evidence rather than by the calendar: a geometry re-check when a result drifts, a spindle inspection when noise or vibration changes, a drive investigation when current draw moves away from the commissioning baseline.\n\nThe inputs are every earlier decision that created a wear item or a consumable. The guideway choice created lubrication points and seals whose condition decides bearing life. The two-range belt drive created a belt to tension and replace. The ball screws created lubrication and a backlash check. The structural decision created fasteners or welds to inspect. The auxiliary systems created filters, coolant and possibly an air supply with its own service needs. Each of those should appear in the plan with an interval, a method, and — crucially — a statement of what a bad result looks like.\n\nThe trade-offs are about intervals, spares and who does the work. Frequent intervals cost time and catch problems early; long intervals save time and let damage accumulate. Holding spares costs money and avoids downtime; not holding them saves money and gambles on lead time — and for a six-person shop with one machine of this kind, a week of downtime is a serious event, which argues for holding the cheap, high-consequence items such as belts, wipers, seals and filters. Doing work in-house builds knowledge and consumes capacity; buying it in costs money and brings expertise. Northgate's operators are competent machinists rather than machine builders, which is an argument for a plan that is mostly straightforward tasks with clear instructions, plus a small number of jobs done by someone qualified.\n\nTwo constraints run through the whole plan. First, the machine must be safely isolated and any stored energy in air, coolant or electrical systems safely released before maintenance work begins, and work on electrical or pressure systems must be carried out by qualified personnel under the applicable law and standards. Second, anything that disturbs the machine's geometry — moving a critical joint, replacing a rail, re-tensioning a structural fastener — must be followed by the relevant geometry check from the alignment stage, and the result recorded against the commissioning baseline. A maintenance action that quietly changes the machine's geometry is worse than no maintenance at all.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhich earlier decisions in this project created wear items or consumables, and what interval would you give each?\n\nWhich spares would you hold for a six-person shop with one machine, and what is the reasoning?\n\nWhich maintenance tasks must trigger a geometry re-check afterwards, and why?\n\nWhat must be true before any maintenance work starts, and which tasks require qualified personnel?\n\nHow would you write the plan so that a competent machinist can follow it without having designed the machine?",
  },

  /* ------------------------------------------------------------------ 19 */
  {
    id: "risks-and-trade-offs",
    number: 19,
    title: "Risks and trade-offs",
    brief:
      "This stage collects what the concept gave up and what could still go wrong. A design with no listed trade-offs has not been examined, and a decision with no accepted risk almost always means the trade-off has not been found yet. Writing both down is what turns a set of choices into an engineering document a reviewer can attack.\n\nA risk register is a running list of things that could make the design fail, each with a note on how likely it is, how serious it would be, and what you intend to do about it. The 'what you intend to do' column is the one that matters: a risk with no owner and no action is a worry, not a risk. Alongside it belongs a trade-off list, which is different — a trade-off is something you chose to give up, not something that might go wrong, and a reviewer needs to see the difference.\n\nThe inputs are your own decisions. Every stage in this project made a choice with a stated cost, and each of those costs is either an accepted trade-off or an open risk. The travel roundings bought usability and spent stiffness. The architecture bought conventionality and accepted about `1 m` of table sweep in a `2.0 m` bay. The structural decision bought affordability and accepted less damping than cast iron would have given. The guideway decision bought smoothness and availability and accepted low damping again — the same weakness twice, which is exactly the kind of correlation a risk register is meant to expose. The cutting force figure of about `800 N` is an estimate carrying real uncertainty, and everything sized from it inherits that uncertainty.\n\nSome risks in this concept are specific and worth naming. Table sweep against the bay dimensions depends on an assumption about how the machine is sited, and it should be confirmed with the client rather than assumed. A welded structure can move after machining if stress relief is inadequate, and the consequence is a geometry problem discovered late. Thermal drift from the spindle, the drives and the workshop itself attacks the brief's first priority directly and has not been analysed at all. The spindle speed range is a compromise, so both ends of the material range may disappoint. The budget is still not a number, which means the whole cost argument rests on a word. And the machine has had no structural analysis, no electrical design and no risk assessment — the largest risk of all, and the reason the concept report has to say so at the top.\n\nThe honest way to close this stage is to separate the three kinds of statement. Things you decided and can defend. Things you gave up deliberately, with the condition under which you would revisit them. And things you do not know, with the specific work that would resolve each. A reviewer can act on all three. What a reviewer cannot act on is a report that presents a concept as finished.\n\nSelf-check — you should be able to answer all of these before moving on:\n\nWhat is the difference between a trade-off and a risk, and can you give one example of each from your own decisions?\n\nWhich two of your decisions weakened the same property, and what would you do about that correlation?\n\nWhich of your risks depends on an assumption that only the client can confirm, and what question would you ask them?\n\nFor your three most serious risks, what specific work would reduce each one, and who would do it?\n\nWhich decisions would you reverse if the budget were confirmed as generous, and which would you keep regardless?",
  },

  /* ------------------------------------------------------------------ 20 */
  {
    id: "final-concept-report",
    number: 20,
    title: "Final concept report",
    brief:
      "The concept report is the deliverable. Everything before this stage was thinking; this is the handover. Its purpose is not to persuade anybody that the design is good — it is to give a reviewer everything they need to find out whether it is, and to disagree with you efficiently where it is not.\n\nA good concept report opens by saying exactly what it is. This one is an educational concept exercise. The machine it describes has not been analysed structurally, has no electrical design, has no safety risk assessment and has not been validated in any way. It requires professional engineering review before any part of it is manufactured, and it must never be built and operated by a beginner on the strength of this document. That statement goes first, not last, because a reader who does not know the status of a document cannot read it correctly.\n\nAfter that, the report needs the brief it was designed against — because a decision can only be judged against the requirement that produced it. Then the decisions themselves, each with the reasoning that supported it, the alternative that was rejected and the risk that was accepted. Then, and this is the part beginners omit, the stages left undecided, named honestly as gaps rather than quietly skipped. A gap you have named is a piece of information; a gap you have hidden is a defect.\n\nThe report below is assembled from your actual saved choices. Stages you have decided appear with the option you selected and the reasoning that goes with it. Stages you have not decided appear as gaps, listed by name. That is deliberate: an incomplete report that is honest about being incomplete is more useful to a reviewer than a complete-looking one that quietly invented the missing decisions. Work back through the earlier stages if you want to close the gaps, then print the report and read it as a reviewer would.\n\nSelf-check — you should be able to answer all of these before you print:\n\nWhy does the statement about professional engineering review belong at the top of the report rather than at the end?\n\nFor each decision you made, can a reviewer see the reasoning, the rejected alternative and the accepted risk?\n\nWhich stages did you leave undecided, and is each one named in the report as a gap?\n\nWhich single decision in your report is the most vulnerable to challenge, and what evidence would settle it?\n\nWhat would you have to add to this report before anyone could responsibly begin detail design?",
  },
];

export function getProjectStage(id: string): ProjectStage | undefined {
  return projectStages.find((stage) => stage.id === id);
}
