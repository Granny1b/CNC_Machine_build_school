import type { Lesson } from "../types";

export const howABallScrewMovesAnAxis: Lesson = {
  slug: "how-a-ball-screw-moves-an-axis",
  level: 2,
  title: "How a ball screw moves an axis",
  minutes: 24,
  intro:
    "The last lesson gave you the coordinate system. This one gives you the hardware that obeys it: the chain of parts that turns a spinning motor shaft into a table sliding in a perfectly straight line. By the end you will be able to trace that chain part by part, say what backlash is and why it matters, and work out roughly how much force and torque an axis actually needs.",

  objectives: [
    "Trace the mechanical chain from motor to moving table and say what each link contributes",
    "Explain why a ball screw replaces sliding friction with rolling friction, and what that buys you",
    "Tell lead from pitch, and convert between screw turns, axis travel and motor speed",
    "Describe backlash in plain terms, say where it comes from, and explain what preload costs",
    "Compare ball screw, rack and pinion and linear motor drives against travel, stiffness, speed, backlash, cost and maintenance",
    "Build up the thrust force an axis needs, turn it into a screw torque and a motor speed, and state what that simplified model leaves out",
  ],

  terms: [
    {
      term: "Feed drive",
      plain:
        "The complete set of parts that moves one axis — motor, coupling, screw, nut, bearings and the guideways the moving part rides on.",
    },
    {
      term: "Servo motor",
      plain:
        "A motor with a built-in position sensor, so the control can check where the shaft actually is instead of hoping it went where it was told.",
    },
    {
      term: "Coupling",
      plain:
        "The short connector between motor shaft and screw shaft that passes rotation across while tolerating a tiny misalignment between them.",
    },
    {
      term: "Ball screw",
      plain:
        "A screw with smooth hardened grooves instead of sharp threads, in which small steel balls roll between the screw and its nut.",
    },
    {
      term: "Ball nut",
      plain:
        "The block that rides along the screw and is bolted to the moving part; it contains the balls and the tunnel that returns them to the start.",
    },
    {
      term: "Recirculation",
      plain:
        "The loop that catches balls as they run off the end of the loaded groove and feeds them back to the beginning, so the same balls circulate forever.",
    },
    {
      term: "Lead",
      plain:
        "How far the nut travels along the screw in one complete turn — the exchange rate between rotation and straight-line movement.",
    },
    {
      term: "Pitch",
      plain:
        "The distance from one groove to the next along the screw. It equals the lead only when the screw has a single continuous groove.",
    },
    {
      term: "Backlash",
      plain:
        "The small dead movement you get when a drive reverses direction: the motor turns but the table has not started moving yet.",
    },
    {
      term: "Preload",
      plain:
        "A deliberate built-in squeeze that holds all the rolling parts in permanent contact so there is no slack for the drive to take up on reversal.",
    },
    {
      term: "Guideway",
      plain:
        "The precision rail or flat surface that lets the moving part travel freely along one direction while being held rigidly in every other.",
    },
    {
      term: "Stiffness",
      plain:
        "How much force it takes to push something out of position by a given amount — a stiff axis barely moves when the cutter pushes on it.",
    },
  ],

  blocks: [
    { kind: "heading", text: "The chain from a number to a moving table" },
    {
      kind: "prose",
      body: [
        "When a program asks for `X100.0`, five physical things happen in a row. A servo motor turns. A coupling passes that rotation on to a screw. The screw turns inside a nut. The nut, unable to spin because it is bolted to the moving part, is forced to travel along the screw. And the moving part — a table, or the saddle it sits on — slides along its guideways in a straight line because the guideways will not let it do anything else.",
        "That is the whole feed drive: motor, coupling, screw, nut, guideways. A servo motor is simply a motor with a position sensor built into it, so the control can check where the shaft really is rather than assume. A coupling is the short connector between two shafts that passes rotation across while forgiving the fraction of a millimetre by which the motor and the screw will never be perfectly in line. Every machine tool axis you will meet is a variation on that chain: something makes force, something converts it, and something constrains the result to one direction.",
      ],
    },
    {
      kind: "figure",
      figure: "ballscrew",
      caption:
        "Follow the chain left to right: motor, coupling, screw shaft supported in its end bearings, the nut bolted to the saddle, and the profile rails the saddle rides on. Look particularly at the return tube on the nut — that is the path the balls take back to the start of the loaded groove.",
    },
    {
      kind: "prose",
      body: [
        "It pays to read the chain backwards as well. Push sideways on the table and the force travels the other way: through the guideways into the base, and through the nut into the screw, the bearings and the motor shaft. Everything in that path stretches, twists or squashes a little under load.",
        "The cutting tool pushes on the workpiece with real force, so this is not a thought experiment. If the chain gives way by `0.02 mm` under cutting load, the part is `0.02 mm` wrong, and no amount of clever programming recovers it. That is why a feed drive is judged on stiffness — how much force it takes to push it out of position — at least as much as on speed.",
      ],
    },

    { kind: "heading", text: "Why a ball screw rather than a plain screw" },
    {
      kind: "prose",
      body: [
        "Start with the screw you already know. A bolt and nut have sharp V-shaped threads, and turning the bolt slides metal against metal along the whole thread flank. That sliding is the point — it makes a bolt hard to turn, which is what you want from a fastener. A plain lead screw, the sort in a workshop vice or an old manual machine, works the same way with a squarer thread and a bronze nut.",
        "Sliding is a poor way to move a machine axis, though. Much of the motor's effort goes into rubbing rather than pushing; the friction drifts as the surfaces warm and the oil film thins; and it drops sharply the moment motion starts, so fine slow moves lurch instead of creeping. The nut wears steadily too, loosening the fit over its life.",
        "A ball screw solves this the way a bearing does. The screw carries a smooth, hardened, roughly semicircular groove rather than a sharp thread, and so does the bore of the nut, with a train of small steel balls running between them. Turning the screw makes those balls roll rather than slide, and rolling costs a small fraction of what sliding costs — a well-made ball screw converts something like nine-tenths of the motor's work into useful thrust, against perhaps a third to a half for a plain lead screw. Treat those as illustrative orders of magnitude; real figures come from the manufacturer's data for the specific screw.",
        "There is one complication. The balls travel with the nut, so after a turn or two they would run out of the end of it. The nut therefore contains a return path — an external tube arching over the nut body, or an internal deflector lifting each ball across one groove — that catches balls leaving the loaded zone and feeds them back to the start. That loop is recirculation, and it is why a ball screw runs for years on the same handful of balls. It also explains the steady rushing hiss a ball screw makes at speed: a rhythmic knock instead means something is wrong in the return path.",
      ],
    },

    { kind: "heading", text: "Lead, pitch, and the exchange rate" },
    {
      kind: "prose",
      body: [
        "Lead is the single most useful number on a screw: the distance the nut travels in one complete turn. A screw of `10 mm` lead moves its nut `10 mm` per revolution, always, however fast you turn it or how hard it is pushing. It is geometry, not a performance figure.",
        "Pitch is a different measurement, easy to confuse with lead. Pitch is the distance from one groove to the next along the screw. On a single-start screw — one continuous groove winding along the shaft — pitch and lead are the same number, which is why most people use the words interchangeably. On a multi-start screw, where two or four separate grooves wind side by side like the strands of a rope, one turn carries the nut past all of them, so the lead is two or four times the pitch.",
        "Lead is the design lever that trades force against speed. A short lead of `5 mm` turns motor torque into a lot of thrust but needs many revolutions to cover ground, so the axis is strong and slow. A long lead of `20 mm` covers ground quickly at the same motor speed but multiplies torque less, so the axis is fast and weaker. It is the trade a bicycle's gears make, for the same reason.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "s = N × P     and     N = s / P",
        variables: [
          { symbol: "s", meaning: "Distance the axis travels", unit: "mm" },
          { symbol: "N", meaning: "Number of complete turns of the screw", unit: "rev" },
          { symbol: "P", meaning: "Screw lead — travel per revolution", unit: "mm/rev" },
        ],
        meaning:
          "This is the exchange rate between the rotary world and the linear one, and it runs in both directions. Before you argue about motors, work out how many revolutions the job actually demands — it is often the number that decides whether a lead is sensible.",
      },
    },
    {
      kind: "example",
      title: "Reading the exchange rate both ways",
      body: [
        "Take an axis with `600 mm` of travel driven by a screw of `10 mm` lead, and suppose the motor is bolted straight to the screw with no gearbox between them.",
        "How many turns from one end of the travel to the other? `N = s / P = 600 / 10 = 60` revolutions. Sixty turns is the entire working life of that axis in one direction, which puts the whole travel in perspective.",
        "Now run it the other way. If you want the axis to move at `30 m/min`, that is `30 000 mm/min`, and at `10 mm` per revolution the screw must turn at `30 000 / 10 = 3000 rev/min`. In SI terms, `1 rev/min` is `2π / 60` rad/s, about `0.105 rad/s`, so `3000 rev/min` is roughly `314 rad/s`.",
        "Notice what just happened: a rapid traverse speed and a screw lead together fixed the motor speed, with no choice left in the matter. Halve the lead to `5 mm` and the same `30 m/min` demands `6000 rev/min`, which is a different and more expensive motor. Lead selection is a decision about the motor as much as about the screw.",
      ],
    },

    { kind: "heading", text: "Backlash: the dead zone on reversal" },
    {
      kind: "prose",
      body: [
        "Hold a spanner on a bolt head and rock it gently. Before the bolt starts to turn you feel a small free movement — the clearance between the spanner and the flats. That free movement is backlash, and every drive that transmits force through touching parts has some.",
        "In a feed drive it shows up on reversal. Driving in the positive direction, the balls are pressed against one side of the groove. Ask for a move in the negative direction and the screw must first turn far enough to push the balls across the groove clearance and load the other side. During that turn, the motor is moving and the table is not. If the motor's own sensor is the only feedback, the control does not even know: it believes the axis has moved.",
        "The clearance comes from several places at once: the gap designed into the groove so the balls fit, wear opening that gap over the years, flex in the coupling and the screw's end bearings, and looseness where the nut bolts to the saddle. Its signature is a step or flat spot exactly where an axis changes direction, which is why a circular test cut so often reveals it — on a circle each axis reverses at a quadrant, so the defect appears at three o'clock, six, nine and twelve.",
      ],
    },
    {
      kind: "deeper",
      title: "How preload removes backlash, and what it costs you",
      body: [
        "Preload means deliberately building a permanent squeeze into the assembly so there is never slack to take up. In a ball screw it is done in one of three ways: two nuts pushed apart by a spacer or spring so each is loaded in the opposite direction; a single nut with a small deliberate shift in the groove part-way along, achieving the same opposition inside one body; or slightly oversized balls that are a firm fit from the outset.",
        "The result is that some rolling elements are always carrying load in each direction, so a reversal transmits immediately. Preload also raises the drive's axial stiffness, because the contact patches between ball and groove start out flattened rather than needing load before they touch properly.",
        "It is not free. Preloaded parts are always working, so friction and heat rise even with no cutting load, and that heat expands the screw and moves the axis. The rolling contacts carry permanent stress on top of the working load, shortening calculated service life, and heavier preload usually means a lower speed rating. Manufacturers therefore offer preload as graded classes, and choosing one is a real trade between stiffness now and life, heat and speed later. Take the classes and their consequences from the catalogue for the exact screw you are considering.",
      ],
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong:
            "Assuming a bigger motor will fix an axis that flexes under cutting load.",
          why:
            "Torque and stiffness are different quantities. If the cutter is pushing the axis out of position, the give is in the screw, the nut, the bearings, the coupling, the bolted joints and the structure — none of which a larger motor touches. You get a heavier, dearer axis that deflects exactly as much as before, with extra rotor inertia making it harder to control.",
        },
        {
          wrong:
            "Believing that backlash compensation in the control makes mechanical lash harmless.",
          why:
            "Compensation adds a fixed extra movement on reversal, so it can only correct lash that is the same size at every position, speed and temperature. Real lash varies with all three, and with wear. Compensation therefore turns a large repeatable error into a smaller, less predictable one — useful, but a plaster over a mechanical fault rather than a repair.",
        },
        {
          wrong:
            "Choosing a screw lead purely from the rapid traverse speed you want.",
          why:
            "Speed and thrust pull opposite ways on the same lever. A long lead reaches the target speed at a comfortable motor speed but multiplies torque less, so the same motor produces less thrust. Lead has to be chosen against the whole duty — accelerate, cut, position — not against one headline number.",
        },
        {
          wrong:
            "Assuming a long screw can be spun as fast as a short one of the same diameter.",
          why:
            "A rotating shaft has a speed at which it whips like a skipping rope, and that speed falls roughly with the square of the unsupported length. Long axes therefore hit a rotational speed limit that has nothing to do with the motor. The levers are a fatter screw, a longer lead so fewer revolutions are needed, spinning the nut instead of the screw, or abandoning screws for a rack or linear motor.",
        },
      ],
    },

    { kind: "heading", text: "Guideways: what the moving part rides on" },
    {
      kind: "prose",
      body: [
        "The screw only pushes. What decides that the table goes in a straight line, stays level, and does not twist when the cutter leans on it, is the guideway. Get this wrong and a perfect screw simply pushes the workpiece along a curve very accurately.",
        "Two families dominate. A profile rail guide is a hardened steel rail with precision-ground grooves down its sides and carriage blocks that ride on it with recirculating balls or rollers inside — the same trick as the ball screw, applied to a straight line. A box way is the older approach: two large flat or dovetailed surfaces sliding directly on each other, traditionally cast iron on cast iron with a bearing material and an oil film between, and hand-scraped flat by a skilled fitter.",
      ],
    },
    {
      kind: "compare",
      title: "Profile rail guides and box ways compared",
      columns: ["Profile rail guides", "Box ways"],
      rows: [
        {
          label: "Friction",
          cells: [
            "Low and nearly constant from standstill, so slow fine moves are smooth.",
            "Higher, and it drops as motion starts, so very slow moves can stick then jump.",
          ],
        },
        {
          label: "Damping",
          cells: [
            "Low — small contact patches, little to absorb vibration energy.",
            "High — a large oil-filmed contact area soaks up vibration well.",
          ],
        },
        {
          label: "Load capacity for a given size",
          cells: [
            "Good, but concentrated through a few small contact patches.",
            "Very high, spread over a broad surface.",
          ],
        },
        {
          label: "Speed and acceleration",
          cells: ["Suits fast, highly dynamic axes.", "Better suited to steady, heavy cutting."],
        },
        {
          label: "Manufacture and assembly",
          cells: [
            "Bought as a catalogue item and bolted to a machined reference edge.",
            "Machined and hand-scraped into the structure itself — skilled, slow work.",
          ],
        },
        {
          label: "Typical use",
          cells: [
            "Most modern machining centres, routers and fast positioning axes.",
            "Heavy roughing machines and large boring mills where damping wins.",
          ],
        },
      ],
    },

    { kind: "heading", text: "Screw, rack, or no screw at all" },
    {
      kind: "prose",
      body: [
        "A ball screw is the default for machine tool axes up to a few metres, but it is not the only way to make a straight line. A rack and pinion replaces the screw with a long toothed bar bolted to the machine and a small gear on the motor that walks along it. A linear motor deletes the mechanical converter completely: it is an electric motor unrolled flat, with magnets laid along the machine and coils in the moving part, pushing directly with no rotating part anywhere in the chain.",
        "Read the table below as a set of trades rather than a ranking, and watch the travel row in particular. Rack and pinion wins where travel is long — a `12 m` gantry mill, a plasma table — because a screw that long would whip before it reached a useful speed. Linear motors win where acceleration and reversal quality matter more than raw cutting force. For a general-purpose milling axis of a metre or less the ball screw is usually still right, because it gives the most stiffness for the money and it holds position when the power is off — which, as the safety note below explains, is not a small thing.",
      ],
    },
    {
      kind: "compare",
      title: "Three ways to drive a linear axis",
      columns: ["Ball screw", "Rack and pinion", "Linear motor"],
      rows: [
        {
          label: "Practical travel length",
          cells: [
            "Good to a few metres; beyond that whip and buckling dominate.",
            "Effectively unlimited — the rack is simply joined section by section.",
            "Long, but every metre must be paved with magnets, so cost rises with travel.",
          ],
        },
        {
          label: "Stiffness at the tool",
          cells: [
            "High, especially preloaded — the usual choice for cutting force.",
            "Moderate; gear teeth and the gearbox add compliance.",
            "Depends entirely on control gains, since nothing mechanical holds position.",
          ],
        },
        {
          label: "Speed and acceleration",
          cells: [
            "Limited by screw whip and by motor speed at the chosen lead.",
            "High speed over long travels; acceleration limited by gearbox inertia.",
            "Highest of the three — no rotating mass to accelerate.",
          ],
        },
        {
          label: "Backlash",
          cells: [
            "Removable by preload, at a cost in friction, heat and life.",
            "Present at the tooth mesh; usually beaten with two opposed pinions.",
            "None — there is no mechanical contact in the drive path at all.",
          ],
        },
        {
          label: "Cost",
          cells: [
            "Lowest for the stiffness delivered over short and medium travels.",
            "Cheap per extra metre, so it wins as travel grows.",
            "Highest to buy, and it needs a bigger drive and often cooling.",
          ],
        },
        {
          label: "Maintenance",
          cells: [
            "Lubrication, seals, and periodic lash checks as it wears.",
            "Open rack needs cleaning and lubrication; it collects swarf.",
            "Little wear, but exposed magnets attract steel chips and need protection.",
          ],
        },
      ],
    },

    { kind: "heading", text: "Sizing the axis: what force does it actually need?" },
    {
      kind: "prose",
      body: [
        "Sooner or later somebody has to choose a motor, and the honest way in is to ask what force the axis must produce. Four things want feeding, and they simply add up. First, force to accelerate the moving mass — often the largest single demand on a fast machine, and it appears twice per move, once to speed up and once to slow down. Second, force to overcome friction in the guideways and seals. Third, on a vertical axis, force to hold the weight up: nothing to do with motion, present even at standstill. Fourth, the external process force, which is the cutter pushing back on the workpiece.",
        "Which term dominates tells you what kind of axis you are designing. If acceleration dominates, you have a light-and-fast machine and the argument is about mass and inertia. If the process force dominates, you have a heavy cutting machine and the argument is about stiffness. Both are legitimate; they just want different screws.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression:
          "F = F_a + F_f + F_g + F_ext     where  F_a = m × a,   F_f = μ × m × g × cos θ,   F_g = m × g × sin θ",
        variables: [
          { symbol: "F", meaning: "Total thrust the drive must produce", unit: "N" },
          { symbol: "F_a", meaning: "Force to accelerate the moving mass", unit: "N" },
          { symbol: "F_f", meaning: "Force to overcome guideway friction", unit: "N" },
          { symbol: "F_g", meaning: "Force to support weight along the axis of travel", unit: "N" },
          { symbol: "F_ext", meaning: "External process force from the cut", unit: "N" },
          { symbol: "m", meaning: "Total moving mass, including workpiece and fixture", unit: "kg" },
          { symbol: "a", meaning: "Required acceleration", unit: "m/s²" },
          { symbol: "μ", meaning: "Guideway friction coefficient", unit: "dimensionless" },
          { symbol: "g", meaning: "Standard gravity, 9.80665", unit: "m/s²" },
          { symbol: "θ", meaning: "Angle of the axis from horizontal — 0° horizontal, 90° vertical", unit: "degrees" },
        ],
        meaning:
          "Add the four demands before choosing anything. The build-up tells you which term is in charge, and that changes the design: an acceleration-dominated axis is a mass problem, a process-force-dominated axis is a stiffness problem.",
      },
    },
    {
      kind: "example",
      title: "Sizing a horizontal X axis, step by step",
      body: [
        "A small vertical machining centre. The X axis carries a moving mass of `m = 250 kg` — table, saddle, fixture and workpiece together. It must reach `v = 30 m/min`, which is `0.5 m/s`, and accelerate at `a = 3 m/s²` over a travel of `L = 600 mm` (`0.6 m`). The heaviest cut is expected to push back with `F_ext = 800 N`. The drive is a ball screw of lead `P = 10 mm` (`0.010 m`) with efficiency `η = 0.90`, on profile rails with a friction coefficient `μ = 0.005`. The axis is horizontal, so `θ = 0`.",
        "Acceleration force: `F_a = m × a = 250 × 3 = 750 N`.",
        "Friction force: `F_f = μ × m × g × cos θ = 0.005 × 250 × 9.80665 × 1 = 12.3 N`.",
        "Gravity force along the travel: `F_g = m × g × sin θ = 0 N`, because `sin 0° = 0`. The weight has not vanished — the guideways carry all `2452 N` of it, which is precisely why it turns up inside the friction term.",
        "Total thrust: `F = 750 + 12.3 + 0 + 800 = 1562 N`.",
        "Screw torque: `T = (F × P) / (2π × η) = (1562.3 × 0.010) / (2π × 0.90) = 2.76 N·m`.",
        "Motor speed at full rapid: `n = (v × 1000) / P = (30 × 1000) / 10 = 3000 rev/min`, about `314 rad/s`.",
        "Reflected load inertia: `J_load = m × (P / 2π)² = 250 × (0.010 / 2π)² = 6.33 × 10⁻⁴ kg·m²`. This is the moving mass seen by the motor as if it were a flywheel on the shaft, and it is the number a drive engineer compares against the motor's own rotor inertia.",
        "Move time end to end: `t = (L / v) + (v / a) = (0.6 / 0.5) + (0.5 / 3) = 1.37 s`.",
        "Read the result rather than filing it. The thrust is dominated by the cut and the acceleration in almost equal measure — `800 N` against `750 N` — while friction contributes about `12 N`, under one per cent. And the whole axis needs under `3 N·m` at the screw, which is a modest motor. The demanding number here is `3000 rev/min`, not the torque.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "T = (F × P) / (2π × η)",
        variables: [
          { symbol: "T", meaning: "Torque required at the screw shaft", unit: "N·m" },
          { symbol: "F", meaning: "Total thrust from the force build-up", unit: "N" },
          { symbol: "P", meaning: "Screw lead, in metres for this equation", unit: "m" },
          { symbol: "η", meaning: "Mechanical efficiency of the screw and nut", unit: "dimensionless" },
        ],
        meaning:
          "This is where lead does its work: torque needed is proportional to lead, so halving the lead halves the torque demand and doubles the motor speed needed for the same axis speed. Watch the units — `P` is in metres here while the same lead is quoted in millimetres in the speed equation, and mixing them up is the most common arithmetic slip in axis sizing.",
      },
    },
    {
      kind: "prose",
      body: [
        "Those four outputs — thrust, torque, speed and reflected inertia — are what a motor is actually selected against. Torque and speed together say whether a candidate motor can do the job at all. Reflected inertia says whether it can do it smoothly: a motor whose rotor inertia is wildly smaller than the load it is dragging is difficult to tune, and the axis ends up either sluggish or prone to overshoot. The move time, meanwhile, is a business number rather than an engineering one — shaving a fraction of a second off a rapid matters once you multiply it by every rapid in a program and every part in a year, and that argument is worth making honestly rather than dressing it up as accuracy.",
      ],
    },
    {
      kind: "note",
      title: "What this simplified model leaves out",
      body:
        "These equations are an educational first estimate, not a selection. They ignore the inertia of the screw itself, which on a long or fat screw can exceed the reflected load inertia; losses in the coupling, the support bearings and the seals; duty cycle, so nothing here distinguishes a peak from a continuous rating; thermal limits in the motor, drive and screw; the screw's critical speed, above which it whips; and column buckling of a screw loaded in compression. A real axis selection is done with the screw and motor manufacturers' own sizing software against the full duty cycle, and reviewed by a qualified engineer before anything is ordered or built.",
    },
    { kind: "widget", widget: "axis-sizing" },
    {
      kind: "safety",
      body:
        "A ball screw is efficient in both directions, which means a vertical axis can drive itself backwards: remove the motor's holding torque and the head can descend under its own weight, gathering speed, with anything below it — hands, tools, the workpiece — in the way. Real machines therefore fit a mechanical brake that engages when power is lost, and often a counterbalance as well, and the brake is a safety function that has to be specified, verified and periodically tested rather than assumed. Treat any vertical axis as a suspended load whenever a guard is open or the machine is being serviced, and never rely on a drive holding position electrically while you work underneath it. Work on the drives, brakes and interlocks themselves must be carried out and verified by qualified personnel under the applicable standards and law.",
    },
    {
      kind: "deeper",
      title: "Why long screws have a speed limit of their own",
      body: [
        "Spin a length of string and it bows outward and whips. A screw shaft does the same: it has a natural bending frequency, and as the rotational speed approaches it the shaft goes unstable, deflects sideways and quickly destroys itself. This is the critical speed, and it is a property of the shaft rather than of the motor driving it.",
        "The shape of the relationship is what matters for design. Critical speed rises with the root diameter and falls with the square of the unsupported length between bearings, so doubling a screw's length cuts its critical speed to roughly a quarter while doubling its diameter roughly doubles it. End fixing matters too: a screw clamped rigidly at both ends tolerates far more than one clamped at one end and merely supported at the other. Take the coefficients, end-fixity factors and recommended margin from the manufacturer's catalogue — the proportionality below tells you which way to move, not what to buy.",
        "A related limit works the other way. A screw pushing a heavy axis is a slender column in compression, and slender columns buckle — and buckling load also falls with the square of the unsupported length, so the same geometry that caps speed caps thrust. Together these two are why long-travel machines drift towards rack and pinion: past a few metres, a screw fat enough to behave is heavier, slower and dearer than the alternative.",
      ],
      formula: {
        expression: "n_crit ∝ d_root / L²     (proportionality only — take real coefficients from the manufacturer)",
        variables: [
          { symbol: "n_crit", meaning: "Critical rotational speed of the screw shaft", unit: "rev/min" },
          { symbol: "d_root", meaning: "Root diameter of the screw — the thin part, not the outside", unit: "mm" },
          { symbol: "L", meaning: "Unsupported length between the end bearings", unit: "mm" },
        ],
        meaning:
          "This shows the direction of the trade, not a number to design to. If an axis is too long to spin fast enough, the effective levers are a bigger root diameter, a shorter unsupported span, stiffer end fixing, a longer lead so fewer revolutions are needed, or a different drive type altogether.",
      },
    },
  ],

  knowledgeCheck: [
    {
      id: "bs-lead-vs-pitch",
      prompt:
        "A screw is described as having two separate grooves winding along it side by side, with `5 mm` from one groove to the next. How far does the nut travel in one turn?",
      options: [
        {
          id: "a",
          text: "`2.5 mm` — the `5 mm` is shared between the two grooves.",
          correct: false,
          feedback:
            "This treats the two starts as dividing the travel rather than multiplying it, which is a natural instinct if you think of the grooves as sharing the work. They do share the load, but each turn still carries the nut past both grooves, so travel goes up rather than down.",
        },
        {
          id: "b",
          text: "`5 mm` — the groove-to-groove distance is what the nut travels per turn.",
          correct: false,
          feedback:
            "Tempting because on the single-start screws you meet most often, pitch and lead genuinely are the same number, and the words get used interchangeably. The equality only holds for one groove. Here `5 mm` is the pitch, and lead is what governs travel.",
        },
        {
          id: "c",
          text: "`10 mm` — two starts, so the lead is twice the pitch.",
          correct: true,
          feedback:
            "Correct. Lead equals pitch multiplied by the number of starts, so one turn carries the nut past both grooves: `2 × 5 = 10 mm`. Multi-start screws exist precisely to buy travel per turn without cutting a coarser, weaker groove.",
        },
        {
          id: "d",
          text: "It depends on the screw diameter as well as the groove spacing.",
          correct: false,
          feedback:
            "Diameter is a real and important quantity — it drives load capacity, stiffness and critical speed — so reaching for it is not unreasonable. It simply does not enter this calculation: travel per turn is fixed by the groove geometry along the shaft, not around it.",
        },
      ],
      teaching:
        "Lead is travel per revolution and is the only figure that converts turns into distance. Pitch is groove-to-groove spacing, and lead = pitch × number of starts.",
    },
    {
      id: "bs-backlash-compensation",
      prompt:
        "An older machine cuts a slight step at each quadrant of a test circle. The operator proposes entering a backlash compensation value in the control. What is the sound assessment?",
      options: [
        {
          id: "a",
          text: "It will help, but only to the extent that the lash is the same size every time — so measure it at several positions and loads before trusting it.",
          correct: true,
          feedback:
            "Correct, and the caveat is the whole point. Compensation adds a fixed extra movement on reversal, so it corrects the repeatable part of the lash and leaves the rest. Measuring at several points along the travel tells you how much of the error is actually repeatable.",
        },
        {
          id: "b",
          text: "It will fully cure it, because the control now knows exactly how much slack there is.",
          correct: false,
          feedback:
            "Tempting because the number you enter comes from a real measurement, so it feels like knowledge rather than a guess. But one number cannot describe lash that changes with position along the screw, with load direction and with temperature — you would be correcting a moving target with a constant.",
        },
        {
          id: "c",
          text: "It will make matters worse, because compensation always overshoots.",
          correct: false,
          feedback:
            "A healthy suspicion of software fixes, overapplied. Compensation is a legitimate and widely used tool; it becomes harmful only when it hides a mechanical fault that is still getting worse, or when the entered value is far larger than the true lash.",
        },
        {
          id: "d",
          text: "Backlash cannot cause quadrant errors, so the fault must be elsewhere.",
          correct: false,
          feedback:
            "This confuses backlash with other reversal effects such as friction reversal and servo tuning, which genuinely do cause similar marks. Those are real alternative causes worth testing, but mechanical lash is the classic quadrant-error mechanism, not an excluded one.",
        },
      ],
      teaching:
        "Software can only compensate for errors that are measured, repeatable and stable. Compensation converts a large repeatable error into a smaller, less predictable one — worth doing, never a substitute for a sound drive.",
      reviewSlug: "accuracy-repeatability-resolution",
    },
    {
      id: "bs-force-buildup",
      prompt:
        "In the worked example — `m = 250 kg`, `a = 3 m/s²`, `μ = 0.005`, `F_ext = 800 N`, horizontal — which reading of the force build-up is sound?",
      options: [
        {
          id: "a",
          text: "Friction dominates, because rolling elements are always the main resistance in a feed drive.",
          correct: false,
          feedback:
            "Plausible if you picture friction as the thing a motor mainly fights, which is true of a plain lead screw. On rolling guideways with `μ = 0.005`, friction came to about `12 N` out of `1562 N` — under one per cent. Rolling elements were chosen precisely to make this term small.",
        },
        {
          id: "b",
          text: "The cut and the acceleration are of similar size — `800 N` against `750 N` — and together they are essentially the whole `1562 N`.",
          correct: true,
          feedback:
            "Correct, and that balance is the useful diagnosis. Neither term dominates, so neither reducing mass nor easing the cut alone would transform this axis: it sits between a dynamic machine and a heavy-cutting one.",
        },
        {
          id: "c",
          text: "Gravity was ignored as a simplification because the axis is horizontal.",
          correct: false,
          feedback:
            "A reasonable reading of a term that came out as zero, but the model did not ignore it — `F_g = m × g × sin 0° = 0` exactly, because none of the weight acts along the direction of travel. The weight is still fully present: all `2452 N` of it presses on the guideways, which is exactly why it appears in the friction term.",
        },
      ],
      teaching:
        "Always look at which term dominates before drawing conclusions. The relative sizes of acceleration, friction, gravity and process force tell you what kind of axis you have and therefore which design lever will actually move the result.",
    },
    {
      id: "bs-bigger-motor",
      prompt:
        "A prototype axis holds position well when idle but pushes `0.05 mm` off course during a heavy cut. Which action addresses the cause?",
      options: [
        {
          id: "a",
          text: "Fit a motor with roughly twice the torque, since the axis is clearly being overpowered by the cut.",
          correct: false,
          feedback:
            "The most common instinct, and it comes from a real observation: the cut is winning. But the axis is not stalling — it is being deflected while the motor happily holds its commanded position. Torque is not what resists deflection, so you would add cost, mass and rotor inertia and measure the same `0.05 mm`.",
        },
        {
          id: "b",
          text: "Find and stiffen the compliance — screw size and support bearings, nut mounting, coupling, bolted joints and the structure carrying the rails.",
          correct: true,
          feedback:
            "Correct. Deflection under load is a stiffness problem, and stiffness lives in the whole force path from cutting edge back to the base. The productive next step is finding which link gives way most, usually by loading the axis with a known force and indicating each joint in turn.",
        },
        {
          id: "c",
          text: "Increase the servo position gain until the axis resists the cutting force.",
          correct: false,
          feedback:
            "Partly right in principle — higher gain does make the drive push back harder against a following error — which is why it is tempting. But gain is limited by the mechanics themselves: raise it against a compliant axis and you reach instability and chatter long before you reach the stiffness you wanted.",
        },
        {
          id: "d",
          text: "Reduce the acceleration setting, so less of the motor's capability is spent on getting up to speed.",
          correct: false,
          feedback:
            "Sensible-sounding housekeeping, and it does free up motor capacity. It changes nothing here though: the error appears during the cut, at constant feed, when the acceleration term is zero anyway.",
        },
      ],
      teaching:
        "Separate torque from stiffness. Torque decides whether an axis can move a load at all; stiffness decides how far the cut pushes it off the commanded path. Only stiffness fixes a deflection error.",
      reviewSlug: "intro-to-machine-architecture",
    },
    {
      id: "bs-long-travel-drive",
      prompt:
        "A gantry machine needs `12 m` of travel at `40 m/min` rapid, cutting aluminium sheet. The first proposal is one long ball screw. What is the strongest objection?",
      options: [
        {
          id: "a",
          text: "Ball screws cannot be manufactured longer than about a metre.",
          correct: false,
          feedback:
            "It is true that very long screws are specialist items, so the instinct that length is a problem is right. The objection is wrong in detail though — long screws are made and sold. The limit is what happens when you spin one, not whether it exists.",
        },
        {
          id: "b",
          text: "Over that span the screw's critical speed and buckling limits arrive long before the required rotational speed, so the whole drive concept is wrong for the travel — a rack and pinion suits it far better.",
          correct: true,
          feedback:
            "Correct. Both limits fall roughly with the square of unsupported length, so at `12 m` a screw would whip well below the speed this rapid demands. Rack and pinion is the standard answer for long-travel gantries because adding travel means adding rack sections, with no new dynamic penalty.",
        },
        {
          id: "c",
          text: "Aluminium cuts with high force, so a screw would not produce enough thrust.",
          correct: false,
          feedback:
            "This mixes up two things. Aluminium is generally a free-cutting material and, more to the point, thrust is a matter of lead and motor torque, both of which are independent of length. Thrust is one of the few things a long screw is still perfectly good at.",
        },
        {
          id: "d",
          text: "Backlash over `12 m` would be unacceptable, and preload cannot be applied to a long screw.",
          correct: false,
          feedback:
            "Half true, which is what makes it tempting: lash does matter on a big machine. But preload is a property of the nut, not of the screw's length, so it can be applied perfectly well. The disqualifying problems are rotational speed and buckling.",
        },
      ],
      teaching:
        "Drive selection is set by travel length as much as by force. Screws suit short and medium travels where stiffness matters; racks suit long travels; linear motors suit high acceleration and reversal quality.",
    },
  ],

  exercise: {
    title: "Size an axis, then break your own answer",
    body:
      "Work through a feed drive on paper, then deliberately attack it. The aim is not a motor part number — it is a feel for which numbers move the result and which barely matter. Use the axis-sizing calculator on this page or the Calculators section to do the arithmetic, so your attention stays on the reasoning rather than on the sums.",
    steps: [
      "Reproduce the worked example exactly: `m = 250 kg`, `v = 30 m/min`, `a = 3 m/s²`, `L = 600 mm`, `F_ext = 800 N`, `P = 10 mm`, `η = 0.90`, `μ = 0.005`, horizontal. Confirm you get `F = 1562 N`, `T = 2.76 N·m`, `n = 3000 rev/min` and `t = 1.37 s`. If you do not, check whether you used the lead in metres for the torque and millimetres for the speed.",
      "Change the lead from `10 mm` to `5 mm`, leaving everything else alone. Write down what happened to the torque and to the motor speed, then state in one sentence what you have traded for what.",
      "Put the axis vertical (`θ = 90°`). Write down what happens to the gravity term and to the friction term, and explain in your own words why one grew while the other collapsed to zero.",
      "Go back to horizontal and double the acceleration to `6 m/s²`. Note the new thrust and the new move time, then judge honestly whether the time saved justifies the extra force the axis must now carry every single move.",
      "Halve the moving mass to `125 kg` and observe which of the four force terms changed and which did not. Say in one sentence why a lighter table helps a fast machine much more than it helps a heavy-cutting one.",
      "Now write down three reasons your sized axis could still be wrong in reality, drawn from the scope note: pick from screw inertia, coupling and bearing losses, duty cycle, thermal limits, critical speed and buckling. For each, say what you would need in order to check it properly.",
      "Finally, sketch the force path from cutting edge to machine base — tool, spindle, head, column, base, rails, saddle, nut, screw, bearings — and mark the three places you would most expect to find give. That sketch is where a stiffness problem actually lives.",
    ],
    selfCheck: [
      "Your lead comparison names both sides of the trade: shorter lead means lower torque needed but higher motor speed for the same axis speed. A one-sided answer means you only read one output.",
      "Your vertical-axis explanation says that gravity now acts along the direction of travel while the guideways carry almost none of the weight, so `F_g` grows and `F_f` falls away — not merely that the numbers changed.",
      "Your acceleration judgement quotes both figures: the extra thrust and the time saved per move. A verdict without both numbers is an opinion, not an engineering decision.",
      "Your three limitations each come with a concrete way of checking them — manufacturer's data, a duty cycle, a thermal test — rather than just naming the risk.",
      "Your force-path sketch reaches all the way back to the base and includes at least one bolted joint, because joints are where compliance usually hides.",
      "You can state, without looking, why a bigger motor would not cure an axis that deflects under cutting load.",
    ],
  },

  summary: [
    "A feed drive is a chain: servo motor, coupling, ball screw, nut, and the guideways that constrain the moving part to one direction.",
    "Ball screws replace sliding contact with rolling contact, which cuts friction sharply and makes slow, fine moves smooth instead of sticky.",
    "Recirculation returns balls from the end of the loaded groove to the start, so a handful of balls serves the whole travel indefinitely.",
    "Lead is travel per revolution and converts turns into distance; pitch is groove spacing, and lead = pitch × number of starts.",
    "Backlash is the dead movement on reversal; preload removes it by building in a permanent squeeze, at a cost in friction, heat and service life.",
    "Profile rails give low friction and speed, box ways give damping and load capacity — the choice follows the cutting duty.",
    "Ball screws suit short and medium travels, rack and pinion suits long travels, and linear motors suit the highest acceleration and cleanest reversals.",
    "Thrust builds from acceleration, friction, gravity and process force; torque follows from `T = (F × P) / (2π × η)`, and any such estimate needs manufacturer sizing software and engineering review before it becomes a purchase.",
  ],

  nextSlug: "accuracy-repeatability-resolution",
};
