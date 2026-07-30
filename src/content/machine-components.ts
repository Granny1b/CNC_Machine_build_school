import type { MachineComponent } from "./types";

/**
 * The CNC Machine Explorer data. SPEC.md section 10.
 *
 * The illustration these hotspots sit on is a cutaway of a vertical machining
 * centre drawn in bridge (double-column) form, so that every part named below
 * has somewhere real to live: a base and bed at the bottom, two columns
 * carrying a cross-beam over the work, a saddle and table stacked on the bed,
 * and the auxiliary, control and safety systems arranged around them.
 *
 * `hotspot` values are percentages measured against the drawing's viewBox
 * (960 × 640 units) as described in SPEC.md section 14. They are balloon
 * positions, not feature positions: the drawing runs a leader line from each
 * balloon to the feature it names, which is what keeps every hotspot clear of
 * its neighbours.
 *
 * Content rules that bind every entry here (SPEC.md section 2):
 *  - no figure is presented as a specification. Where a number appears at all
 *    it is labelled as an illustrative order of magnitude or as a qualitative
 *    range, and the reader is sent to the manufacturer's data;
 *  - standards are described by purpose and scope only, never quoted, and the
 *    reader is always told to consult the standard itself;
 *  - electrical, hydraulic and pneumatic content describes architecture and
 *    principle, and says plainly that the work belongs to qualified people.
 */

/** Shown once, visibly, above the parameter list in every component panel. */
export const PARAMETER_NOTE =
  "These design parameters are teaching material. Values are given as qualitative ranges or as illustrative orders of magnitude, never as specifications. Real selection needs the manufacturer's data and sizing software, the applicable standards, and engineering review.";

/**
 * SPEC.md rule 6. Shown in the panel for every component whose real-world work
 * involves electrical, hydraulic, pneumatic or safety-function engineering.
 */
export const QUALIFIED_WORK_NOTE =
  "This part of a machine is described here by architecture and principle only. Designing, building, modifying, commissioning, testing and maintaining it — including its electrical, hydraulic, pneumatic and safety-related circuits — must be carried out and verified by qualified personnel under the applicable law and standards.";

/** Components whose panels carry the qualified-personnel note. */
export const QUALIFIED_WORK_IDS: string[] = [
  "servo-motor",
  "tool-changer",
  "electrical-cabinet",
  "lubrication-system",
  "coolant-system",
  "chip-conveyor",
  "safety-enclosure",
  "doors",
  "sensors",
];

export const machineComponents: MachineComponent[] = [
  /* ---------------- Structure ---------------- */
  {
    id: "base",
    name: "Base",
    system: "structure",
    hotspot: { x: 39.58, y: 85.31 },
    plain:
      "The base is the big, heavy casting the whole machine stands on. The bed, the columns, the cabinet and every moving part are bolted to it, so anything the base does, the rest of the machine does too. Its job is to be boring: to sit still, to soak up vibration, and to hand the cutting forces down into the floor without flinching.",
    engineering:
      "The base closes the bottom of the structural loop — the chain of parts that runs from the cutting edge, up the tool, through the spindle, along the structure and back to the workpiece. Everything in that chain that bends, twists or moves shows up in the finished part. The base carries the static weight of every axis plus the reaction to cutting forces and to the acceleration of the moving masses above it. Designers chase torsional stiffness and material damping rather than raw strength, because a base almost never breaks; it deflects, it rings, or it slowly relaxes. It also sets the machine's geometry at installation through its levelling elements, which is why a machine is levelled and its geometry checked before it is accepted. ISO 230 exists to define how such geometric and positioning tests are carried out; consult the standard itself for what it actually requires.",
    parameters: [
      {
        label: "Material",
        value:
          "Grey cast iron, welded and stress-relieved steel fabrication, or polymer concrete. The choice is made for damping and thermal behaviour as much as for stiffness.",
      },
      {
        label: "Share of machine mass",
        value:
          "Illustrative order of magnitude only: the base is commonly the single heaviest item in the machine, and a large fraction of the total mass sits in it and the bed.",
      },
      {
        label: "Support arrangement",
        value:
          "Three-point support avoids twisting the machine on an uneven floor; multi-point support on levelling elements, sometimes grouted, spreads the load. Which one suits depends on the machine and the floor.",
      },
      {
        label: "Torsional stiffness target",
        value:
          "Qualitative: high enough that twist under the worst credible cutting load stays small compared with the position tolerance allowed for that axis in the error budget.",
      },
      {
        label: "Section design",
        value:
          "Closed box sections with internal ribbing. Wall thickness is usually set by what can be cast or welded reliably rather than by stress.",
      },
      {
        label: "Thermal layout",
        value:
          "Heat sources and cooling paths placed as symmetrically as the layout allows, so that warming moves the geometry predictably instead of unpredictably.",
      },
    ],
    failureModes: [
      "The machine is installed on an uneven or under-specified floor, the base takes up the twist, and the axes lose their squareness to one another. No amount of servo tuning corrects a geometry fault.",
      "Levelling elements settle or work loose over months. Repeatability still looks fine on a test, while positioning accuracy quietly drifts away from the commissioning record.",
      "Coolant and swarf collect in an unsealed base cavity, adding an uneven heat load on one side of the machine and starting corrosion where nobody looks.",
      "Casting or welding stresses were never properly relieved, so the base relaxes over the first months of its life and the geometry moves with it.",
      "Anchor bolts are torqued unevenly at installation, pulling the base into a strained shape that it holds for the rest of its service life.",
    ],
    lessons: [
      "intro-to-machine-architecture",
      "selecting-an-architecture",
      "accuracy-repeatability-resolution",
    ],
    glossary: [
      "machine-bed",
      "structural-loop",
      "stiffness",
      "damping",
      "cast-iron",
      "polymer-concrete",
      "thermal-drift",
    ],
  },
  {
    id: "bed",
    name: "Bed",
    system: "structure",
    hotspot: { x: 19.27, y: 79.38 },
    plain:
      "The bed is the ribbed casting on top of the base that carries the axis moving underneath the workpiece. Its top faces are machined flat and true, because those faces are what the linear rails are bolted to. Whatever shape those faces are in, the axis will faithfully copy.",
    engineering:
      "The bed provides the mounting datums for one axis of the feed drive: the rail seats, the screw support seats, and the reference edges used to align them. Flatness and parallelism of those machined faces translate almost directly into straightness error of the axis, because a profile rail is far less stiff than the casting it is bolted to and will follow the surface it is pulled down onto. Beds are therefore ground, and on higher-accuracy machines hand-scraped, and the rails are aligned against a reference edge or an optical straightedge during assembly. The bed also has to shed chips and coolant rather than pond them, since a pool of hot coolant on one side is a thermal load in exactly the place where it does most harm.",
    parameters: [
      {
        label: "Rail mounting faces",
        value:
          "Ground or scraped, with parallelism and flatness held to a small fraction of the axis straightness target. The actual figures come from the machine's own error budget.",
      },
      {
        label: "Rail spacing",
        value:
          "Qualitative trade-off: the wider the two rails are spaced, the better the resistance to pitch and roll moments — limited by the machine footprint and by the width of the casting.",
      },
      {
        label: "Support under travel",
        value:
          "The bed should be continuously supported under the whole stroke. An unsupported overhang at the ends of travel produces a position-dependent sag.",
      },
      {
        label: "Swarf and coolant drainage",
        value:
          "Sloped surfaces and drain paths to the chip trough. Treated as a structural requirement, not as a detail added afterwards.",
      },
      {
        label: "Way protection",
        value:
          "Bellows or telescopic covers over the exposed guideways, with wipers, so that abrasive chips never reach the rolling elements.",
      },
    ],
    failureModes: [
      "A rail seat is not flat, the rail is bolted down and takes up the error, and the axis then travels along a gentle curve that shows as straightness error in every part.",
      "A chip is trapped under a rail during assembly or a rebuild. The local high spot is invisible from outside and produces a repeatable bump in the axis geometry.",
      "Drain paths block with fine swarf, coolant ponds on one side of the bed, and a thermal gradient develops across the casting.",
      "Way covers are damaged and not replaced, so chips and coolant reach the rails and bearings and wear accelerates sharply.",
      "The bed deflects locally as the saddle approaches the ends of travel, giving an error that changes with position and is easily mistaken for screw pitch error.",
    ],
    lessons: [
      "intro-to-machine-architecture",
      "how-a-ball-screw-moves-an-axis",
      "accuracy-repeatability-resolution",
    ],
    glossary: [
      "machine-bed",
      "straightness",
      "structural-loop",
      "linear-guide",
      "stiffness",
      "box-way",
      "way-cover",
    ],
  },
  {
    id: "column",
    name: "Column",
    system: "structure",
    hotspot: { x: 58.23, y: 46.88 },
    plain:
      "The columns are the uprights that stand on the base and hold everything up over the work. On this machine there are two, one each side, with a beam bridging them. On a more common desktop-style or C-frame machine there is a single column at the back. Either way, the column is what decides how far the tool can be pushed sideways before it starts to give.",
    engineering:
      "The column carries the vertical axis and the reaction to every horizontal cutting force, and it does so at the longest lever arm in the whole structural loop. A force at the tool tip becomes a bending moment at the column base, and the resulting tilt is multiplied by the height at which it acts. That is why column section, wall thickness and ribbing matter far more than the material's strength, and why a single-column C-frame layout has an open loop that a two-column bridge closes. Columns are also thermally awkward: warm air rises up one face, spindle and drive heat enters at the top, and a column that heats unevenly leans. Symmetric layouts and separated heat sources are the usual defences.",
    parameters: [
      {
        label: "Height versus reach",
        value:
          "Qualitative: every millimetre of extra height buys work envelope and costs stiffness, because deflection at the tool grows faster than height does.",
      },
      {
        label: "Section and ribbing",
        value:
          "Closed box section with diagonal internal ribbing. The aim is torsional stiffness, since twist about the vertical axis is usually the softest direction.",
      },
      {
        label: "Material and damping",
        value:
          "Cast iron for material damping, fabricated steel for stiffness per unit cost, polymer concrete where damping is the priority. Each is a different compromise.",
      },
      {
        label: "Interface to the base",
        value:
          "A large, flat, well-dowelled and heavily bolted joint. Joint stiffness at this interface is frequently the weakest link in an otherwise stiff structure.",
      },
      {
        label: "Thermal symmetry",
        value:
          "Qualitative: heat entering one face of a tall column makes it lean. Symmetric construction and separated heat sources keep that lean small and predictable.",
      },
    ],
    failureModes: [
      "The column is sized for static load rather than stiffness, so the tool deflects under cut and the machine cannot hold a straight wall square to the table.",
      "Warm air or a drive mounted on one face heats the column asymmetrically, it leans by a small angle, and the tool point moves far more than the angle suggests.",
      "The bolted joint at the base slips microscopically under repeated load reversal, giving an error that appears and disappears with the direction of cut.",
      "A column resonance sits inside the machine's usable spindle speed range, so certain speeds always chatter regardless of tooling.",
      "A retrofit adds mass high on the column — an extra head or a large magazine — and moves the natural frequency down into the working range.",
    ],
    lessons: ["intro-to-machine-architecture", "selecting-an-architecture"],
    glossary: [
      "column",
      "structural-loop",
      "stiffness",
      "chatter",
      "natural-frequency",
      "thermal-drift",
      "c-frame",
    ],
  },
  {
    id: "gantry",
    name: "Gantry cross-beam",
    system: "structure",
    hotspot: { x: 36.46, y: 20.0 },
    plain:
      "The gantry is the beam that bridges the two columns and carries the spindle head over the work. Because it is supported at both ends rather than sticking out from one side, the load path is closed and the head is held much more firmly than a single-sided arm could manage.",
    engineering:
      "A gantry, portal or bridge layout closes the structural loop symmetrically. The beam is loaded in bending by the weight of the head and the vertical cutting force, and in torsion by any force acting away from its shear centre — which is what a side-cutting load does. Stiffness at the tool is worst with the head at mid-span and best near the columns, so the machine's compliance changes with position; a well-designed beam keeps that variation small enough to ignore. Gantries come in fixed-bridge form, where the work moves underneath, and moving-bridge form, where the bridge itself travels. Fixed bridges are stiffer and thermally calmer; moving bridges give long travel without a very long bed and a very heavy table.",
    parameters: [
      {
        label: "Span",
        value:
          "Qualitative: bending deflection grows very rapidly with span for a given section, so beam depth has to grow faster than the span does.",
      },
      {
        label: "Section depth",
        value:
          "The single most effective variable available. Depth buys bending stiffness cheaply; adding wall thickness does far less for the mass it costs.",
      },
      {
        label: "Stiffness variation along the beam",
        value:
          "Qualitative target: the difference between mid-span and end-of-span compliance should be small enough that the machine behaves the same across the table.",
      },
      {
        label: "Fixed or moving bridge",
        value:
          "Fixed bridge with a moving table for stiffness and thermal calm; moving bridge for long travels and a smaller footprint per unit of work envelope.",
      },
      {
        label: "Column interface",
        value:
          "Large machined joint faces, dowelled and bolted. A slipping or soft joint here undoes the whole point of choosing a bridge layout.",
      },
    ],
    failureModes: [
      "The beam sags at mid-span under the head's own weight, so the tool sits lower in the middle of the table than at the ends and flat faces come out dished.",
      "Side loads act away from the beam's shear centre, wind it up in torsion, and tilt the spindle — an error that reverses when the cut direction reverses.",
      "One face of the beam is warmed by the spindle drive or by sunlight through a roof light, the beam bows, and the geometry drifts through the day.",
      "The column-to-beam joint slips under repeated reversal, giving a small hysteresis that shows up in a ballbar or circular test.",
      "A moving bridge is driven from one side only, so it yaws slightly under acceleration and the two ends do not arrive together.",
    ],
    lessons: ["intro-to-machine-architecture", "selecting-an-architecture"],
    glossary: [
      "gantry",
      "column",
      "structural-loop",
      "stiffness",
      "damping",
      "chatter",
      "c-frame",
    ],
  },
  {
    id: "saddle",
    name: "Saddle",
    system: "structure",
    hotspot: { x: 24.17, y: 72.34 },
    plain:
      "The saddle is the sliding casting in the middle of the sandwich. It rides on the rails fixed to the bed, and it carries the rails that the table rides on. That is how a machine gets two straight-line movements at right angles out of two identical sets of parts stacked on top of each other.",
    engineering:
      "Stacking axes has a cost: the lower axis has to carry the mass, the inertia and the tipping moments of everything above it, including the workpiece and its fixture. The saddle is where those moments are reacted, so its rail spacing, its own bending stiffness and the overhang at the ends of travel all matter. Designers face a genuine conflict here. A light saddle accelerates well and asks less of the motor; a heavy one damps better and deflects less. Over-constraint is the other trap: bolting a stiff casting to four carriages on two rails means the casting will take on any misalignment between those rails, so alignment during assembly is not optional.",
    parameters: [
      {
        label: "Rail spacing on both faces",
        value:
          "Qualitative: as wide as the casting allows, on both the face it rides on and the face it carries, because moment stiffness improves with the square of the spacing.",
      },
      {
        label: "Overhang at travel limits",
        value:
          "The proportion of the saddle still supported at full stroke. Large overhang gives a pitch error that changes with position.",
      },
      {
        label: "Moving mass",
        value:
          "A direct trade-off: lower mass improves acceleration and reduces motor size; higher mass adds damping and inertia stability. Neither answer is universally right.",
      },
      {
        label: "Carriage layout",
        value:
          "Usually four carriages on two rails. More carriages raise stiffness and load capacity but tighten the alignment requirement.",
      },
      {
        label: "Sealing and covers",
        value:
          "Wipers on every carriage and covers over the exposed rail, since the saddle sits directly under the cutting zone and the chips fall on it.",
      },
    ],
    failureModes: [
      "The saddle overhangs the bed at the ends of travel, pitches by a small angle, and the tool point moves by much more than the angle alone would suggest.",
      "The two rails it rides on are not parallel, the saddle is stiff enough to bridge the error, and the carriages run permanently over-preloaded on one side.",
      "The casting is made light to save motor size, and the axis then chatters in a mode nobody predicted because damping went with the mass.",
      "Wipers wear, chips get into the carriages, and the axis develops a rough, position-dependent friction that the servo has to fight.",
      "A bolted interface between saddle and table rails is not doweled, so a crash shifts it slightly and squareness is lost without anything looking broken.",
    ],
    lessons: [
      "understanding-xyz",
      "intro-to-machine-architecture",
      "how-a-ball-screw-moves-an-axis",
    ],
    glossary: [
      "saddle",
      "linear-guide",
      "bearing-block",
      "stiffness",
      "positioning-error",
      "moving-table",
      "linear-axis",
    ],
  },
  {
    id: "table",
    name: "Table",
    system: "structure",
    hotspot: { x: 22.29, y: 62.97 },
    plain:
      "The table is the flat surface you clamp the workpiece to. It has slots or a grid of tapped holes so that vices, clamps and fixtures can be bolted down anywhere on it. Everything the machine knows about where the part is starts from a datum you set on or near this surface.",
    engineering:
      "The table is both a structural member and a metrology reference. Its flatness, and its parallelism to the plane of travel, become part of the machine's geometric error; its T-slot pattern determines what fixtures can be used and where clamping forces can be applied. The workpiece and fixture add to the moving mass, so a heavy fixture changes the axis dynamics that the drive was sized for. Clamping is a distortion source in its own right: a thin plate pulled flat against a table that is not flat will spring back when the clamps come off. In practice the table is also the surface on which the work coordinate system is established, whether by an edge finder, a probe or a fixture with a known datum.",
    parameters: [
      {
        label: "Working surface versus travels",
        value:
          "Qualitative rule of thumb: the table is usually somewhat larger than the X and Y travels so that fixtures and clamps have somewhere to sit outside the cut.",
      },
      {
        label: "T-slot size and pitch",
        value:
          "Set by the clamping hardware standard the builder chooses. Pitch determines how finely a fixture can be positioned without an adapter plate.",
      },
      {
        label: "Maximum load",
        value:
          "Illustrative only: a limit exists and is set by the carriages, the screw and the deflection of the table, not by the strength of the casting. Take the figure from the machine's own data.",
      },
      {
        label: "Flatness and parallelism",
        value:
          "Qualitative: held to a small fraction of the machine's positioning tolerance. ISO 230 covers how such geometric tests are performed — consult the standard for what it requires.",
      },
      {
        label: "Coolant drainage",
        value:
          "Slots and drains that carry coolant away rather than trapping it under fixtures, where it becomes a corrosion and thermal problem.",
      },
    ],
    failureModes: [
      "A heavy fixture is clamped at one end of the table, the table deflects, and parts machined at that end differ from parts machined in the middle.",
      "Clamping distorts a thin workpiece against the table; the machining is perfect and the part springs out of tolerance the moment the clamps are released.",
      "A swarf chip is left under a fixture. Setup repeatability collapses and the fault moves with the fixture, not with the machine.",
      "T-slots are damaged by a crash or by over-tightened clamps, and fixtures no longer sit down flat.",
      "Hot chips pile on the table and warm it locally, so the datum set at the start of a long job is no longer where the control thinks it is.",
    ],
    lessons: ["understanding-xyz", "what-is-a-cnc-machine", "cad-to-finished-component"],
    glossary: [
      "workholding",
      "fixture",
      "datum",
      "work-coordinate-system",
      "work-offset",
      "moving-table",
      "work-envelope",
    ],
  },

  /* ---------------- Motion ---------------- */
  {
    id: "linear-rails",
    name: "Linear rails",
    system: "motion",
    hotspot: { x: 20.83, y: 94.06 },
    plain:
      "Linear rails are the hardened steel tracks the moving parts run along. Blocks full of small rolling balls or rollers grip each rail and slide along it with very little friction. They are what makes an axis move in a straight line instead of wherever the load pushes it.",
    engineering:
      "A profile linear guide constrains five degrees of freedom and leaves one — the direction of travel. Rolling elements recirculate through the carriage, so friction is low and almost independent of speed, which makes the servo's job far easier than a sliding way would. The rail itself is not stiff enough to define its own straightness: it is pulled down onto the machined seat and copies it, so the mounting face and the alignment procedure are what actually determine axis straightness. Preload — a deliberate interference between rolling elements and raceways — removes clearance and raises stiffness, at the price of friction and heat. Box ways, the older sliding alternative, give far more damping and load capacity for the same envelope but higher and more variable friction.",
    parameters: [
      {
        label: "Rail size and series",
        value:
          "Chosen from the supplier's load and moment ratings against the actual duty, not from the size of the machine. Use the manufacturer's selection data.",
      },
      {
        label: "Preload class",
        value:
          "Light preload for smooth low-friction motion, heavy preload for stiffness under load. Heavier preload also means more heat and shorter life for the same load.",
      },
      {
        label: "Rolling element type",
        value:
          "Ball guides for lower cost, lower friction and adequate stiffness; roller guides for markedly higher stiffness and load capacity at higher cost.",
      },
      {
        label: "Mounting face quality",
        value:
          "Qualitative: flatness and straightness of the seat should be a small fraction of the axis straightness target, because the rail will copy whatever it is bolted to.",
      },
      {
        label: "Lubrication and sealing",
        value:
          "Interval and dose come from the guide manufacturer's data and depend on stroke, speed and contamination. Wipers and covers are part of the specification, not an accessory.",
      },
    ],
    failureModes: [
      "Abrasive swarf gets past a worn wiper, the raceways pit, and the axis develops a rough patch that the servo reports as a varying following error.",
      "The rail is bolted onto an uneven seat and copies the error, so the axis is straight in the drawing and curved in reality.",
      "Preload is chosen too heavy for the duty; the guides run hot, the lubricant thins, and life is a fraction of what the catalogue calculation promised.",
      "The machine sits unused next to a press or a forklift route and the rolling elements false-brinell the raceways without ever having moved.",
      "Lubrication is interrupted at one point of a centralised system, and only one carriage of four fails — long before anyone suspects lubrication.",
    ],
    lessons: [
      "how-a-ball-screw-moves-an-axis",
      "intro-to-machine-architecture",
      "accuracy-repeatability-resolution",
    ],
    glossary: [
      "linear-guide",
      "bearing-block",
      "preload",
      "stiffness",
      "straightness",
      "box-way",
      "linear-axis",
    ],
  },
  {
    id: "bearing-blocks",
    name: "Bearing blocks",
    system: "motion",
    hotspot: { x: 29.17, y: 94.06 },
    plain:
      "The bearing blocks — usually called carriages — are the parts that grip the rail and slide along it. The moving casting is bolted to them. Inside each one, balls or rollers circulate around a loop so the block can travel any distance without running out of rolling elements.",
    engineering:
      "Carriages are selected on four ratings at once: dynamic load, static load, and the three moment ratings about the roll, pitch and yaw directions. In machine tools the moment ratings usually decide the selection, because a milling machine spends its life reacting overturning loads rather than pure downward ones. Life calculations follow the manufacturer's model and depend strongly on the load exponent, so a modest overload has a large effect. Carriage spacing along and across the rails is the designer's most powerful lever: moment stiffness improves rapidly as the carriages are moved apart, and it costs nothing but space. Alignment matters as much as selection — four carriages bolted to a stiff casting will fight each other for the life of the machine if the rails are not parallel.",
    parameters: [
      {
        label: "Number and spacing",
        value:
          "Qualitative: usually four per axis, spaced as widely as the casting allows. Moment stiffness improves sharply with spacing, at no cost in mass.",
      },
      {
        label: "Load and moment ratings",
        value:
          "Taken from the manufacturer's catalogue and compared with the calculated duty, including the worst-case cutting load and the heaviest fixture.",
      },
      {
        label: "Preload class",
        value:
          "Must match the rail. Mixing preload classes on one axis, or replacing one carriage from a different batch, gives an axis that behaves differently along its length.",
      },
      {
        label: "Seals and scrapers",
        value:
          "End seals, side seals and a metal scraper where chips are present. This is the single most effective life-extending option on a machining centre.",
      },
      {
        label: "Lubrication ports",
        value:
          "Port position and fitting type chosen so that lines route without strain and can actually be reached for service.",
      },
    ],
    failureModes: [
      "Selection is made on downward load alone, the real duty is a large overturning moment, and the carriages wear out early with no obvious cause.",
      "A pair of rails is not parallel; the carriages run permanently loaded against each other and the axis draws far more motor current in one direction.",
      "Seals wear and fine cast-iron dust enters the recirculation path, where it behaves like grinding paste.",
      "One carriage runs dry because its lubrication line is blocked, and it fails while its three neighbours look perfect.",
      "A crash overloads one carriage past its static rating. Nothing visibly breaks, but the raceway is dented and the axis is never quite smooth again.",
    ],
    lessons: ["how-a-ball-screw-moves-an-axis", "intro-to-machine-architecture"],
    glossary: [
      "bearing-block",
      "linear-guide",
      "preload",
      "stiffness",
      "backlash",
      "positioning-error",
      "linear-axis",
    ],
  },
  {
    id: "ball-screw",
    name: "Ball screw",
    system: "motion",
    hotspot: { x: 37.5, y: 94.06 },
    plain:
      "The ball screw turns the motor's rotation into straight-line movement. It is a long threaded shaft with a nut on it, and between the two run dozens of small steel balls that circulate around a return path. The balls roll instead of sliding, so the screw is efficient and does not wear the way an ordinary threaded rod would.",
    engineering:
      "The screw's lead — the distance the nut advances per revolution of the shaft — sets the gearing of the whole feed drive. A large lead gives high speed for a given motor speed but less thrust for a given motor torque, and it makes the drive stiffer in torsion but softer in the sense that any motor position error is multiplied by the lead. Thrust and torque are related by the educational relation T = F × P / (2π × η), where P is the lead in metres and η the efficiency; that expression ignores screw inertia, bearing drag and duty cycle, so it estimates rather than specifies. Two limits catch designers out: critical speed, where a long slender screw whips like a skipping rope, and column buckling under compressive thrust. Both depend on the end-fixity arrangement, which is why the support bearings are part of the screw's specification and not an afterthought.",
    parameters: [
      {
        label: "Lead",
        value:
          "Millimetres of travel per revolution. A larger lead buys speed and costs thrust for the same motor torque; the choice is made together with the motor, not before it.",
      },
      {
        label: "Nominal diameter",
        value:
          "Sets axial stiffness, critical speed and buckling strength. Long axes usually need a larger diameter than the load alone would suggest.",
      },
      {
        label: "Accuracy grade",
        value:
          "Manufacturers publish graded lead accuracy classes. Which grade is appropriate follows from the machine's error budget — take the classes and their meaning from the supplier's data.",
      },
      {
        label: "Preload arrangement",
        value:
          "A preloaded double nut or an oversized-ball single nut removes axial clearance. Preload raises stiffness and reduces lost motion, and costs friction, heat and life.",
      },
      {
        label: "End fixity",
        value:
          "Fixed-fixed, fixed-supported or fixed-free. This choice changes both the critical speed and the buckling limit substantially for the same screw.",
      },
      {
        label: "Cooling",
        value:
          "Some machines circulate coolant through a hollow screw. Illustrative reason: a screw that warms along its length grows, and the growth appears directly as a positioning error.",
      },
    ],
    failureModes: [
      "A long screw is run near or above its critical speed during rapid moves, whips, and both noise and wear rise sharply.",
      "Preload is gradually lost through wear, axial clearance opens up, and the machine develops a reversal error that shows as a step at the quadrant changes of a circular test.",
      "Contamination reaches the ball return path, balls skid instead of rolling, and the screw wears in one region of its length — usually the region used by the most common job.",
      "The screw heats up during a long production run and grows in length, so parts machined at the end of a shift are a different size from those machined at the start.",
      "A screw is mounted so tightly at both ends that it cannot grow thermally, and the thermal expansion turns into an axial load on the support bearings.",
    ],
    lessons: [
      "how-a-ball-screw-moves-an-axis",
      "understanding-xyz",
      "accuracy-repeatability-resolution",
    ],
    glossary: [
      "ball-screw",
      "screw-lead",
      "backlash",
      "preload",
      "critical-speed",
      "lead-screw",
      "positioning-error",
    ],
  },
  {
    id: "ball-screw-supports",
    name: "Ball-screw supports",
    system: "motion",
    hotspot: { x: 45.83, y: 94.06 },
    plain:
      "At each end of the ball screw is a bearing housing that holds the shaft in place. These have to stop the screw moving along its own axis while still letting it spin freely — a harder job than it sounds, because the whole thrust of the axis passes through them.",
    engineering:
      "Support units usually contain a preloaded pair of angular contact bearings at the driven end, and a simpler radial or floating arrangement at the far end. Their axial stiffness sits in series with the screw's own axial stiffness and with the nut, so the softest of the three governs the drive. A common design error is to specify an excellent screw and then hang it in bearings that deflect more than the screw does. End fixity also determines critical speed and buckling limits. The floating end matters for a different reason: a screw that heats up must be free to grow at one end, or the growth becomes an axial preload that overloads the bearings and distorts the lead. Alignment of the support seats to the rail plane is checked during assembly, because a misaligned screw is bent once per revolution for the rest of its life.",
    parameters: [
      {
        label: "End fixity arrangement",
        value:
          "Fixed at the drive end, supported or floating at the other, or fixed at both ends where critical speed demands it. Each option changes the speed and buckling limits.",
      },
      {
        label: "Bearing type",
        value:
          "Preloaded angular contact pairs at the fixed end, selected from the manufacturer's data for axial stiffness and speed capability rather than by shaft diameter alone.",
      },
      {
        label: "Axial stiffness",
        value:
          "Qualitative target: the support should be markedly stiffer than the screw it holds, so that the screw governs the drive stiffness rather than the housing.",
      },
      {
        label: "Alignment to the rail plane",
        value:
          "Set during assembly with an indicator, so that the screw axis stays parallel to the direction of travel through the whole stroke.",
      },
      {
        label: "Thermal freedom",
        value:
          "One end able to move axially, or a designed pre-tension that accounts for growth. A screw fixed rigidly at both ends fights its own expansion.",
      },
    ],
    failureModes: [
      "Bearing preload is lost through wear or an incorrectly torqued locknut, and lost motion appears at every direction reversal.",
      "The support housing is misaligned with the rails, the screw is bent slightly once per revolution, and the axis produces a periodic error at the screw's rotational frequency.",
      "Both ends are rigidly fixed with no allowance for thermal growth, so a warm screw loads its own bearings and the lead changes with temperature.",
      "Contaminated or dried-out grease in the fixed-end bearings raises drag and heat, which then warms the screw and adds a thermal error to a mechanical one.",
      "The housing bolts are undersized, the joint slips under peak thrust, and the axis loses its home reference after a heavy cut.",
    ],
    lessons: ["how-a-ball-screw-moves-an-axis", "accuracy-repeatability-resolution"],
    glossary: [
      "bearing-block",
      "ball-screw",
      "preload",
      "backlash",
      "critical-speed",
      "stiffness",
      "positioning-error",
    ],
  },
  {
    id: "servo-motor",
    name: "Servo motor",
    system: "motion",
    hotspot: { x: 54.17, y: 94.06 },
    plain:
      "The servo motor turns the ball screw. What makes it a servo rather than just a motor is that it is watched constantly: a sensor reports where it actually is, the drive compares that with where it was told to be, and it corrects the difference hundreds or thousands of times a second.",
    engineering:
      "A machine-tool feed axis is normally driven by a permanent-magnet AC servo motor under cascaded control: an outer position loop, a velocity loop inside it, and a current (torque) loop inside that. Sizing is dominated not by the steady cutting force but by acceleration, and specifically by the ratio between the load inertia reflected through the screw and the motor's own rotor inertia. A poorly matched ratio makes the velocity loop hard or impossible to tune, no matter how much torque is available. Motors have separate continuous and peak torque ratings, and the peak is only usable for a short, defined time — a duty-cycle calculation, not a headline figure. Vertical axes need a holding brake so the head does not fall when power is removed, and the specification, installation and testing of that brake and its circuit is work for qualified personnel under the applicable standards.",
    parameters: [
      {
        label: "Continuous torque",
        value:
          "The torque available indefinitely at rated conditions. It must cover friction, gravity on a vertical axis and process force, with margin.",
      },
      {
        label: "Peak torque",
        value:
          "Available only briefly, for acceleration. Usable duration and derating come from the manufacturer's curves, not from a rule of thumb.",
      },
      {
        label: "Rated speed",
        value:
          "In rev/min, the shop unit; one rev/min is about 0.105 rad/s in SI. Rated speed with the screw lead sets the maximum feed rate the axis can reach.",
      },
      {
        label: "Inertia ratio",
        value:
          "Reflected load inertia divided by rotor inertia. The ratio matters more than either number alone; drive suppliers publish the range their tuning tolerates.",
      },
      {
        label: "Holding brake",
        value:
          "Required on vertical axes. Its selection, wiring and functional testing are part of the machine's safety design and belong to qualified personnel.",
      },
      {
        label: "Thermal duty",
        value:
          "Root-mean-square torque over the real duty cycle, compared with the continuous rating. A motor sized on peak alone will overheat in production.",
      },
    ],
    failureModes: [
      "The motor is sized for cutting force and not for acceleration, so the axis cannot follow rapid moves and following error rises at every corner.",
      "The inertia ratio is far outside the drive's comfortable range; gains cannot be raised without instability, and the axis is either sloppy or buzzing.",
      "The duty cycle is heavier than the sizing assumed, the motor runs hot, and the drive trips intermittently in the middle of long programs.",
      "A vertical-axis brake fails or is wired so it releases before the drive has control, letting the head drop. This is a safety-critical circuit and must be designed, installed and verified by qualified personnel.",
      "The motor cable in a moving cable chain is not rated for continuous flexing, the shield fractures inside the sheath, and intermittent encoder faults appear months later.",
    ],
    lessons: [
      "how-a-ball-screw-moves-an-axis",
      "what-is-a-cnc-machine",
      "accuracy-repeatability-resolution",
    ],
    glossary: [
      "servo-motor",
      "closed-loop-control",
      "following-error",
      "inertia-matching",
      "encoder",
      "stepper-motor",
      "jerk",
    ],
  },
  {
    id: "coupling",
    name: "Coupling",
    system: "motion",
    hotspot: { x: 53.75, y: 62.81 },
    plain:
      "The coupling is the short connector between the motor shaft and the ball screw. It has to transmit the turning force without any slack, while tolerating the tiny misalignment that always exists between two separately mounted shafts.",
    engineering:
      "In a feed drive the coupling is a spring in the middle of the control loop, and its torsional stiffness helps set the drive's first torsional natural frequency together with the reflected load inertia. That frequency puts a ceiling on the servo gains, so a compliant coupling limits how tightly the axis can be controlled — regardless of how good the motor and screw are. Backlash-free types are therefore mandatory: metal bellows couplings for high torsional stiffness and generous misalignment capacity, disc or beam couplings as alternatives with different compromises. Elastomer-insert jaw couplings are common in general machinery but a poor choice here, because the insert creeps and adds hysteresis that appears directly as lost motion at the tool.",
    parameters: [
      {
        label: "Type",
        value:
          "Metal bellows, disc or beam. All are backlash-free. Elastomer-insert types are avoided on feed drives because they creep and add hysteresis.",
      },
      {
        label: "Torsional stiffness",
        value:
          "Qualitative: as high as the misalignment capacity allows. It combines with reflected inertia to set the drive's torsional resonance, which caps the servo gains.",
      },
      {
        label: "Misalignment capacity",
        value:
          "Angular, parallel and axial allowances from the manufacturer's data. Working near the limits shortens life and raises reaction forces on the bearings.",
      },
      {
        label: "Clamping method",
        value:
          "Clamping hubs or shrink discs rather than grub screws, tightened to the manufacturer's specified torque. A slipping hub loses machine position silently.",
      },
      {
        label: "Added inertia",
        value:
          "The coupling's own inertia adds to the reflected load and must be included when checking the inertia ratio, particularly on small axes.",
      },
    ],
    failureModes: [
      "A clamping hub is under-tightened, slips a fraction of a turn under peak torque, and the axis loses position with no alarm and no visible damage.",
      "Misalignment beyond the coupling's rating fatigues a bellows, which fails suddenly and leaves an axis that spins the motor and moves nothing.",
      "A compliant coupling drops the drive's torsional resonance into the control bandwidth, so the axis can never be tuned tightly and always overshoots.",
      "An elastomer insert is fitted as a cheap replacement; it creeps under load and adds a lost motion that looks exactly like screw backlash.",
      "The coupling is used to correct a misalignment that should have been fixed mechanically, so bearings at both ends carry a permanent side load.",
    ],
    lessons: ["how-a-ball-screw-moves-an-axis", "accuracy-repeatability-resolution"],
    glossary: [
      "ball-screw",
      "servo-motor",
      "backlash",
      "stiffness",
      "natural-frequency",
      "following-error",
      "inertia-matching",
    ],
  },
  {
    id: "encoder",
    name: "Encoder",
    system: "motion",
    hotspot: { x: 53.75, y: 54.69 },
    plain:
      "The encoder is the sensor that tells the control where things actually are. Without it the machine would be guessing. It either sits on the back of the motor and counts shaft rotation, or it runs along the axis as a scale and measures the moving part directly.",
    engineering:
      "There is a real distinction between the two arrangements. A rotary encoder on the motor measures the motor, so everything between motor and tool — coupling wind-up, screw lead error, screw thermal growth, nut lost motion — is invisible to the control; this is a semi-closed loop. A linear scale mounted along the axis measures the moving element itself, closing the loop around the mechanics; that is a full-closed loop, and it removes screw errors at the cost of exposing the servo to any mechanical resonance between the drive and the scale. The most important idea to keep straight is that resolution is not accuracy. Resolution is the smallest change the system can report; accuracy is how close a reported position is to the true one. A machine can have a very fine resolution and poor accuracy, and frequently does.",
    parameters: [
      {
        label: "Type",
        value:
          "Rotary on the motor for a semi-closed loop, or a linear scale on the axis for a full-closed loop. The choice changes what errors the control can and cannot see.",
      },
      {
        label: "Resolution",
        value:
          "The smallest reportable change of position. It is not the machine's accuracy and should never be quoted as if it were.",
      },
      {
        label: "Incremental or absolute",
        value:
          "Incremental devices need a homing move after power-up to establish the machine coordinate system; absolute devices know their position immediately.",
      },
      {
        label: "Signal and interface",
        value:
          "Analogue sine-cosine or a digital serial protocol. Cable type, shielding and routing are part of the specification, not installation details.",
      },
      {
        label: "Environmental protection",
        value:
          "Sealed or air-purged scales where coolant and swarf are present. A scale is a precision optical or magnetic device sitting in the dirtiest part of the machine.",
      },
      {
        label: "Thermal behaviour",
        value:
          "A linear scale's expansion coefficient relative to the structure it is mounted on. A mismatch turns a temperature change into a position error.",
      },
    ],
    failureModes: [
      "Coolant or fine swarf reaches a linear scale, readings drop out intermittently, and the control alarms on a position error with no mechanical cause.",
      "The coupling between the encoder and the thing it is supposed to measure has slack, so the measurement is honest about the encoder and wrong about the machine.",
      "An unshielded or badly routed motor cable induces noise into the feedback line, producing phantom faults that move around the machine as cables are disturbed.",
      "Resolution is read as accuracy on a datasheet, and the machine is bought or sold on a figure that describes only the smallest step it can report.",
      "A scale is mounted rigidly to a structure with a different expansion coefficient, so temperature change puts the scale in tension and shifts the reported position.",
    ],
    lessons: [
      "accuracy-repeatability-resolution",
      "how-a-ball-screw-moves-an-axis",
      "understanding-xyz",
    ],
    glossary: [
      "encoder",
      "resolution",
      "accuracy",
      "repeatability",
      "closed-loop-control",
      "following-error",
      "dro",
    ],
  },

  /* ---------------- Spindle and tooling ---------------- */
  {
    id: "spindle",
    name: "Spindle",
    system: "spindle",
    hotspot: { x: 34.58, y: 41.88 },
    plain:
      "The spindle is the rotating shaft that holds the cutting tool and turns it. It is the part of the machine that actually does the cutting work, and almost everything else exists to hold it in the right place and feed it through the metal at the right rate.",
    engineering:
      "A spindle is a shaft in precision bearings, driven by a belt, a coupling or an integral motor built into the housing. Its performance is described by a torque and power curve rather than a single number: below the base speed the drive can hold constant torque, above it the power ceiling takes over and available torque falls with speed. That is why a small cutter at high speed and a large cutter at low speed are two entirely different demands on the same spindle. Bearing arrangement and preload set the nose stiffness, which — combined with the tool's overhang — governs how much the tool deflects and where chatter begins. Spindles also grow: bearing friction and motor losses heat the shaft, it lengthens, and the tool moves in Z. Chillers, oil-air lubrication and warm-up cycles all exist to make that growth predictable.",
    parameters: [
      {
        label: "Maximum speed",
        value:
          "Quoted in rev/min, the shop unit; one rev/min is about 0.105 rad/s in SI. The limit comes from the bearing arrangement and lubrication method.",
      },
      {
        label: "Torque and power curve",
        value:
          "A constant-torque region below base speed and a constant-power region above it. Read the whole curve, never the peak power figure alone.",
      },
      {
        label: "Tool interface",
        value:
          "A steep taper or a hollow-shank type, chosen for the speed range, the rigidity needed and what tooling the workshop already owns.",
      },
      {
        label: "Bearing arrangement and preload",
        value:
          "Angular contact sets, arranged and preloaded for either speed or stiffness. The two pull in opposite directions and the arrangement is a deliberate compromise.",
      },
      {
        label: "Nose stiffness",
        value:
          "Qualitative: stiffness measured at the spindle nose is what the tool actually experiences. It falls quickly as tool overhang grows.",
      },
      {
        label: "Cooling",
        value:
          "Air, circulated oil or a chiller on the housing. The purpose is a stable temperature, not a low one — predictable growth beats small but erratic growth.",
      },
    ],
    failureModes: [
      "A crash or a heavy tool-change impact dents a bearing raceway. The spindle still turns, but runout rises and surface finish never fully recovers.",
      "Preload is lost as the bearings wear, nose stiffness falls, and the machine starts chattering at cuts it used to take comfortably.",
      "The taper bore is damaged or left dirty, so every tool sits slightly off-axis and the whole machine appears less accurate than it is.",
      "An out-of-balance tool assembly is run at high speed; the resulting rotating force shortens bearing life and prints a pattern into the surface finish.",
      "Spindle growth during warm-up is not allowed for, so the first parts of the morning are a different size from the rest.",
    ],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    glossary: [
      "spindle",
      "spindle-speed",
      "runout",
      "taper",
      "tool-holder",
      "cutting-speed",
      "through-spindle-coolant",
      "chatter",
    ],
  },
  {
    id: "tool-holder",
    name: "Tool holder",
    system: "spindle",
    hotspot: { x: 42.71, y: 51.56 },
    plain:
      "A cutting tool is not put straight into the spindle. It goes into a holder, and the holder goes into the spindle. The holder has a precisely made tapered shank that pulls up into a matching taper in the spindle nose, so the tool ends up on the spindle's centreline every time.",
    engineering:
      "The holder is a joint that must locate the tool repeatably, transmit torque, and be released and re-clamped thousands of times without losing either quality. Steep tapers locate on the cone alone and are pulled in by a drawbar acting on a pull stud; hollow-shank types locate on both the taper and a flange face simultaneously, which raises stiffness and repeatability at high speed. Runout at the cutting edge is a stack: spindle bore, holder taper, collet or chuck, and the tool itself all contribute, and the errors do not politely cancel. Tool length offset is measured from a defined gauge line on the holder, so a holder that does not seat properly moves the whole offset. At high speed the assembly's balance grade becomes as important as its runout, because unbalance produces a force that grows with the square of speed.",
    parameters: [
      {
        label: "Interface type",
        value:
          "Steep taper or hollow-shank. The steeper the speed and accuracy demands, the stronger the case for a face-and-taper interface.",
      },
      {
        label: "Clamping force",
        value:
          "Set by the spindle's drawbar system, not by the operator. Take the figure and its check interval from the machine manufacturer's data.",
      },
      {
        label: "Runout at the tool tip",
        value:
          "A stack-up of spindle, holder, collet and tool. Measured with a dial indicator at the tool tip, and reduced by improving whichever contributor dominates.",
      },
      {
        label: "Gauge length and stick-out",
        value:
          "Qualitative and decisive: tool deflection grows roughly with the cube of overhang, so the shortest tool that reaches the feature is nearly always the right one.",
      },
      {
        label: "Balance grade",
        value:
          "Specified for high-speed work using the balance-grade system the tooling supplier quotes. Unbalance force grows with the square of rotational speed.",
      },
    ],
    failureModes: [
      "Coolant film or a single chip in the taper stops the holder seating. Runout jumps, tool life collapses, and the machine gets blamed.",
      "A collet nut is over-tightened, distorting the collet, so it grips on three points instead of all round and the tool runs out.",
      "The tool is set with far more stick-out than the job needs, and the resulting deflection produces tapered walls and chatter marks.",
      "An unbalanced assembly is run near the spindle's top speed, loading the bearings continuously in one rotating direction.",
      "The wrong pull stud is fitted for the spindle's drawbar. It may appear to clamp normally while the retention force is well below what the design intended.",
    ],
    lessons: ["cad-to-finished-component", "what-is-a-cnc-machine"],
    glossary: [
      "tool-holder",
      "taper",
      "runout",
      "tool-length-offset",
      "spindle",
      "chatter",
      "tool-wear",
    ],
  },
  {
    id: "tool-changer",
    name: "Tool changer",
    system: "spindle",
    hotspot: { x: 21.46, y: 38.44 },
    plain:
      "The tool changer is the mechanism that swaps tools automatically. It holds a magazine of ready-set tools, and on command it takes the tool out of the spindle, puts it away and fits the next one — usually in a few seconds. It is what lets one machine drill, mill and bore a part without anybody touching it.",
    engineering:
      "Changers range from simple carousels that swing into position and use the Z axis to do the changing, through umbrella types, to chain magazines with a twin-arm changer that removes one tool and inserts another in a single motion. The performance figure is chip-to-chip time — the interval from the end of one cut to the start of the next — because that time is repeated hundreds of times a day. The changer depends on a tool table in the control that must match reality: if the control believes a long boring bar is in a pocket that actually holds a short drill, the result is a collision. A tool changer is also a powerful moving mechanism inside the working area, usually with pneumatic or hydraulic clamping. It is guarded and interlocked for that reason, and the design, installation, adjustment and testing of those power circuits and safety functions is work for qualified personnel under the applicable law and standards.",
    parameters: [
      {
        label: "Magazine capacity",
        value:
          "Set by how many tools the intended family of jobs needs, plus spares for tool life. More pockets cost space and mass, not just money.",
      },
      {
        label: "Tool size and mass limits",
        value:
          "Maximum diameter, length and mass, and the rule about neighbouring empty pockets for oversized tools. These come from the machine manufacturer's data.",
      },
      {
        label: "Chip-to-chip time",
        value:
          "Illustrative order of magnitude: a few seconds on a modern machining centre. It is a design outcome of the mechanism type, not a figure to be assumed.",
      },
      {
        label: "Tool identification",
        value:
          "Fixed-pocket addressing or random access with the pocket recorded in the control. Random access is faster but relies entirely on data integrity.",
      },
      {
        label: "Safety design",
        value:
          "Guarded and interlocked as a moving hazard, with its pneumatic or hydraulic circuits designed and verified by qualified personnel under the applicable standards.",
      },
    ],
    failureModes: [
      "Clamping air pressure falls below the design value and a tool is not gripped properly during transfer. This is a serious hazard and a reason such systems are monitored and interlocked.",
      "The magazine indexes to the wrong pocket after a power interruption, and the control's tool table no longer matches the tools physically present.",
      "Tool length or diameter data is entered wrongly, the change succeeds, and the collision happens on the first move afterwards.",
      "Grippers wear, hold the taper slightly off centre during transfer, and the taper faces are gradually damaged by repeated poor engagement.",
      "Swarf or coolant is carried into pockets and then onto the taper, so runout worsens gradually across the whole tool set.",
    ],
    lessons: ["what-is-a-cnc-machine", "cad-to-finished-component"],
    glossary: [
      "tool-changer",
      "tool-holder",
      "taper",
      "spindle",
      "m-code",
      "interlock",
      "guarding",
    ],
  },

  /* ---------------- Control ---------------- */
  {
    id: "cnc-controller",
    name: "CNC controller",
    system: "control",
    hotspot: { x: 71.04, y: 35.16 },
    plain:
      "The controller is the computer that reads the program and decides, thousands of times a second, exactly where each axis should be. The screen and keys you stand in front of are only its face. The real work is turning lines of code into a stream of position commands that the drives follow.",
    engineering:
      "A CNC control is several cooperating parts: an interpreter that reads the program, a look-ahead buffer that reads far ahead of the current block so the machine can slow for a corner before it arrives, a trajectory planner that limits acceleration and jerk, an interpolator that produces position commands at a fixed cycle time, and an integrated PLC that handles machine functions such as coolant, the changer and the door. It also holds the data that makes the machine accurate rather than merely repeatable: work offsets, tool offsets, and compensation tables for screw pitch error, backlash and in some cases volumetric error. Those tables are why a machine's accuracy can be improved without touching the mechanics, and why an undocumented parameter change can quietly ruin it.",
    parameters: [
      {
        label: "Interpolation cycle time",
        value:
          "Illustrative order of magnitude: a fraction of a millisecond to a few milliseconds. A shorter cycle allows smoother, faster contouring for a given path tolerance.",
      },
      {
        label: "Look-ahead depth",
        value:
          "How many blocks the planner reads ahead. Deep look-ahead is what lets a machine run a fine-stepped surface program at anything like the programmed feed.",
      },
      {
        label: "Path tolerance setting",
        value:
          "The permitted deviation from the programmed path when corners are smoothed. Tight settings give accuracy and slow the machine; loose settings do the opposite.",
      },
      {
        label: "Compensation tables",
        value:
          "Pitch error, backlash and, on some machines, volumetric compensation. They are measured at commissioning and must be re-verified periodically.",
      },
      {
        label: "Integrated PLC",
        value:
          "Handles machine logic and sequencing. Safety-related functions are implemented in a separate, dedicated architecture, not in ordinary machine logic.",
      },
      {
        label: "Backup and version control",
        value:
          "Machine parameters, PLC program and compensation data, backed up and dated. Without them, a control failure is also a loss of the machine's accuracy record.",
      },
    ],
    failureModes: [
      "Path tolerance is left too loose from a roughing job, and the following finishing pass rounds every corner in the part.",
      "A surface program made of very short blocks starves the look-ahead buffer, so the machine crawls and the finish shows the resulting speed changes.",
      "A parameter is altered to cure a symptom, nobody records it, and six months later the cause of a geometry problem is untraceable.",
      "Work offsets or tool offsets are entered against the wrong number, and the first move of the program is a collision.",
      "Compensation tables are lost during a control replacement and never re-measured, so the machine returns to service repeatable but no longer accurate.",
    ],
    lessons: ["what-is-a-cnc-machine", "understanding-xyz", "cad-to-finished-component"],
    glossary: [
      "cnc",
      "g-code",
      "m-code",
      "plc",
      "look-ahead",
      "jerk",
      "interpolation",
      "work-offset",
    ],
  },
  {
    id: "electrical-cabinet",
    name: "Electrical cabinet",
    system: "control",
    hotspot: { x: 86.04, y: 46.88 },
    plain:
      "The electrical cabinet is the metal cupboard that holds the machine's electrical equipment: the incoming supply and its isolator, the drives that power the motors, the low-voltage supplies, the control's own hardware and the wiring that joins them. It is described here as an architecture, because working inside one is a job for qualified people only.",
    engineering:
      "The cabinet organises the machine's electrical architecture into layers. A supply disconnecting device isolates the machine for maintenance. Protective devices guard the circuits downstream. Servo drives convert supply power into controlled motor current and share a common bus so that a decelerating axis can return energy to the bus rather than waste it. A low-voltage control supply — twenty-four volts DC is the widespread convention — feeds the control hardware and the input and output modules that read sensors and command valves. Safety-related circuits are deliberately kept as a separate architecture rather than being mixed into ordinary machine logic. Physical layout follows the same logic: power and signal cabling segregated and screened, heat-generating components placed where the cooling scheme can deal with them, and everything recorded in schematics, terminal plans and cable schedules. IEC 60204-1 exists to address the electrical equipment of machines; consult the standard for what it actually requires. Design, construction, modification, inspection and maintenance of this equipment must be carried out and verified by qualified personnel under the applicable law and standards.",
    parameters: [
      {
        label: "Enclosure protection",
        value:
          "Rated against the ingress-protection classification used in the applicable standard, chosen for the workshop environment. Take the required class from the standard and the risk assessment.",
      },
      {
        label: "Control voltage",
        value:
          "Twenty-four volts DC is the common convention for control circuits, chosen for safety, availability of components and noise behaviour.",
      },
      {
        label: "Heat load and cooling",
        value:
          "Calculated from the losses of the drives and supplies, then handled by filtered fans, an air-to-air exchanger or an air conditioner. Sizing is an engineering calculation, not a guess.",
      },
      {
        label: "Segregation and routing",
        value:
          "Power, motor, encoder and signal cabling separated and screened, with defined crossing rules. This is what keeps feedback signals clean.",
      },
      {
        label: "Documentation set",
        value:
          "Schematics, terminal plans, cable schedules and parameter records, kept current. An undocumented cabinet is unmaintainable and unsafe to work on.",
      },
    ],
    failureModes: [
      "Cooling filters block with workshop dust, cabinet temperature rises, and the drives derate or trip intermittently in a pattern that looks like a program fault.",
      "Motor cables are run alongside encoder cables or their screens are not terminated properly, and phantom feedback faults appear that no mechanical inspection explains.",
      "A modification is made and never drawn up, so the next person to work on the machine is working from a document that no longer describes it.",
      "Condensation forms in an unheated cabinet on a cold morning and tracks across a terminal block.",
      "The door is left open in a dusty shop for convenience, defeating the protection the enclosure was chosen to provide.",
    ],
    lessons: ["what-is-a-cnc-machine", "selecting-an-architecture"],
    glossary: [
      "plc",
      "fieldbus",
      "servo-motor",
      "encoder",
      "emergency-stop",
      "interlock",
      "cnc",
    ],
  },

  /* ---------------- Auxiliary ---------------- */
  {
    id: "lubrication-system",
    name: "Lubrication system",
    system: "auxiliary",
    hotspot: { x: 52.6, y: 35.0 },
    plain:
      "The lubrication system is the machine's oiling arrangement: a small reservoir, a pump, and thin pipes that carry oil to every rail carriage, ball nut and screw bearing. It runs automatically, usually a short dose every so often, and it is the cheapest maintenance on the machine and the most commonly neglected.",
    engineering:
      "Centralised lubrication distributes a metered dose to many points from one pump. Single-line resistance systems rely on calibrated restrictors and depend on all points seeing similar back-pressure; progressive systems use metering blocks that cycle mechanically and will stall visibly if any outlet blocks, which makes fault detection much easier. The dose and the interval come from the guide and screw manufacturers' data and depend on stroke length, speed, orientation and contamination — a machine doing many short strokes needs different treatment from one doing full-length traverses, because short strokes never redistribute the film. Over-lubrication is a real fault too: excess oil ends up in the coolant, where it degrades the coolant and creates a disposal problem.",
    parameters: [
      {
        label: "System type",
        value:
          "Single-line resistance, progressive with metering blocks, or individual grease points. Progressive systems make a blockage visible; resistance systems are simpler and cheaper.",
      },
      {
        label: "Dose per point",
        value:
          "Metered by restrictor or metering block, sized from the guide and screw manufacturers' data for the actual stroke and speed.",
      },
      {
        label: "Interval",
        value:
          "Usually a short dose at intervals during operation. The interval is taken from the component data, not chosen for convenience.",
      },
      {
        label: "Lubricant grade",
        value:
          "Way oil, bearing oil or grease as specified by each component's manufacturer. Way oil and bearing oil are not interchangeable.",
      },
      {
        label: "Monitoring",
        value:
          "Level and pressure or cycle monitoring, alarmed to the control. Without monitoring, a lubrication failure is silent until wear appears months later.",
      },
    ],
    failureModes: [
      "One metering unit blocks. Three carriages are lubricated perfectly and the fourth runs dry, so a single carriage fails and the fault is diagnosed as a bearing defect.",
      "The reservoir is allowed to run empty because the low-level alarm was acknowledged and ignored during a busy shift.",
      "The wrong oil grade is topped up, so the film does not carry the load and wear accelerates without any visible symptom.",
      "Over-lubrication puts oil into the coolant, degrading it, encouraging bacterial growth and creating a fluid-disposal problem.",
      "A lubrication line running through a moving cable chain fatigues and splits, and the leak is hidden behind a way cover.",
    ],
    lessons: ["how-a-ball-screw-moves-an-axis", "intro-to-machine-architecture"],
    glossary: [
      "linear-guide",
      "bearing-block",
      "ball-screw",
      "way-cover",
      "box-way",
      "backlash",
      "preload",
    ],
  },
  {
    id: "coolant-system",
    name: "Coolant system",
    system: "auxiliary",
    hotspot: { x: 53.33, y: 85.31 },
    plain:
      "The coolant system pumps fluid at the cutting zone. It does three jobs at once: it carries heat away, it washes chips out of the cut so they are not cut a second time, and it lubricates the contact between chip and tool. The tank, the pump and the filtration sit in or beside the machine base.",
    engineering:
      "Coolant delivery ranges from flood nozzles at modest pressure to through-spindle delivery at pressures an order of magnitude higher, which is what makes deep-hole drilling practical because it flushes chips back out of the flute. Higher pressure demands finer filtration, since the same small passages that make it effective are the ones that block. Coolant is also a thermal input to the machine: flooding a structure with fluid at a different temperature from the room moves the geometry, which is why some machines chill or temperature-control the coolant. Concentration, pH and contamination need routine management for tool life and for the health of the people working with it — follow the fluid supplier's safety data sheet and your local rules for handling, exposure control and disposal, and treat mist extraction as part of the machine, not an accessory.",
    parameters: [
      {
        label: "Delivery pressure",
        value:
          "Flood nozzles work at modest pressure; through-spindle delivery is an order of magnitude higher. The figure follows from the tooling and the depth of hole being drilled.",
      },
      {
        label: "Filtration level",
        value:
          "Matched to the finest passage in the system. Through-spindle tooling needs much finer filtration than flood nozzles do.",
      },
      {
        label: "Tank capacity",
        value:
          "Qualitative: large enough that the fluid has time to settle and cool between passes through the machine, and to hold the volume of a full system.",
      },
      {
        label: "Concentration control",
        value:
          "Monitored with a refractometer against the supplier's recommended range. Concentration drift affects tool life, corrosion and skin exposure.",
      },
      {
        label: "Temperature control",
        value:
          "Chilled or temperature-controlled coolant where thermal stability matters, because coolant is one of the largest heat inputs to the structure.",
      },
      {
        label: "Mist extraction",
        value:
          "Extraction and filtration of coolant mist from the enclosure, specified as part of the machine and required by the workplace risk assessment.",
      },
    ],
    failureModes: [
      "Filtration is inadequate for through-spindle use, the small passages in the tooling block, and a drill burns up in the hole.",
      "Concentration drifts below the recommended range; tool life falls, corrosion appears on the table, and bacterial growth makes the coolant smell and become a health concern.",
      "Warm coolant flooding a cold machine, or the reverse, moves the structure during a long job and the parts drift in size.",
      "Coolant finds its way past a worn wiper into the guideway system, where it displaces the way oil.",
      "Chips carried back to the tank are not screened out and abrade the pump, which then fails at the worst possible moment.",
    ],
    lessons: ["cad-to-finished-component", "what-is-a-cnc-machine"],
    glossary: [
      "coolant",
      "through-spindle-coolant",
      "chip-conveyor",
      "chip-formation",
      "tool-wear",
      "thermal-drift",
      "spindle",
    ],
  },
  {
    id: "chip-conveyor",
    name: "Chip conveyor",
    system: "auxiliary",
    hotspot: { x: 6.46, y: 86.41 },
    plain:
      "The chip conveyor carries swarf out of the machine and drops it into a bin. It sounds like housekeeping, and it is not: chips carry most of the heat generated by cutting, and a machine that cannot get rid of them heats up, jams and eventually stops.",
    engineering:
      "The conveyor type is chosen for the chip form the machine will actually produce. Hinged-belt conveyors suit long, stringy chips from steel; scraper and drag types suit short, fine chips from cast iron; augers suit confined spaces. Getting this wrong is the commonest auxiliary-system mistake, because a hinged belt jams on fine chips and a scraper struggles with a bird's nest of stringy ones. The conveyor is also part of the coolant circuit — the fluid drains back through it — and part of the thermal design, because chips left inside the machine deposit their heat into the bed. It is a moving mechanism with trap points, so it is guarded, its access panels are interlocked, and any work on it belongs to competent people following the machine's isolation procedure.",
    parameters: [
      {
        label: "Conveyor type",
        value:
          "Hinged belt, scraper, drag or auger, matched to the chip form the machine will actually make. This is the decision that determines whether it works at all.",
      },
      {
        label: "Capacity",
        value:
          "Sized against the peak volumetric removal rate of the machine, with margin, not against its average.",
      },
      {
        label: "Coolant return and screening",
        value:
          "Fluid drains back through the conveyor and is screened before returning to the tank, so fines do not reach the pump.",
      },
      {
        label: "Discharge height",
        value:
          "Set by the chip bin or trolley the shop uses. A mismatch here makes an otherwise good installation a daily nuisance.",
      },
      {
        label: "Guarding and interlocking",
        value:
          "Trap points guarded and access panels interlocked, with an isolation procedure for clearing jams. This work belongs to competent, authorised people.",
      },
    ],
    failureModes: [
      "Long stringy chips wrap around the drive shaft of a hinged belt and jam it, and the jam is cleared by hand without proper isolation — a serious hazard.",
      "Fine chips pass the screening and reach the coolant pump, wearing it out and eventually blocking the through-spindle circuit.",
      "The conveyor overloads and trips, chips build up in the base trough, and their heat warms the bed unevenly through the shift.",
      "The chip bin fills unnoticed, the discharge backs up into the machine, and swarf ends up on the ways.",
      "An access guard is removed for a quick clear-out and not refitted, leaving an open trap point on a machine that is still live.",
    ],
    lessons: ["what-is-a-cnc-machine", "selecting-an-architecture"],
    glossary: [
      "chip-conveyor",
      "chip-formation",
      "coolant",
      "machine-bed",
      "guarding",
      "interlock",
      "material-removal-rate",
    ],
  },

  /* ---------------- Safety ---------------- */
  {
    id: "safety-enclosure",
    name: "Safety enclosure",
    system: "safety",
    hotspot: { x: 13.54, y: 11.88 },
    plain:
      "The safety enclosure is the box around the working area. It keeps people out of the cutting zone while the machine is running, and it keeps chips, coolant mist and — in the worst case — pieces of a broken tool or workpiece inside. Everything about it is a designed feature, not a screen.",
    engineering:
      "Enclosure design starts from a risk assessment, not from a catalogue. The hazards are mechanical (rotating tools, moving axes, the tool changer), material ejection (fragments of tool or workpiece, and unclamped parts), and fluid and mist. Guards are classified by whether they are fixed, movable or interlocking, and by whether they need locking to hold the person out until the hazard has stopped. Containment capability is a property that has to be established for the energies actually present in the machine — it is not a claim that can be made by inspection, and window materials in particular lose capability with age and with exposure to coolant, which is why they carry replacement guidance. ISO 12100 sets out general principles for risk assessment and risk reduction, and ISO 16090-1 addresses the safety of machining centres, milling machines and transfer machines; both describe purpose and scope here only, and the actual requirements must be taken from the standards themselves. Specification, construction and verification of guarding is work for competent persons under the applicable law and standards.",
    parameters: [
      {
        label: "Containment capability",
        value:
          "Established against the energies actually present in the machine, by assessment or test. It cannot be judged by eye and must not be assumed from panel thickness.",
      },
      {
        label: "Window material and ageing",
        value:
          "Vision panels lose capability with age and with exposure to coolant. Manufacturers state a replacement regime; it is a maintenance item, not a fitting.",
      },
      {
        label: "Access openings",
        value:
          "Size and position of any permanent opening, and the distances that keep a person from reaching a hazard through it, follow from the risk assessment and the relevant standards.",
      },
      {
        label: "Ventilation and mist extraction",
        value:
          "Designed so mist is extracted and filtered rather than escaping into the workshop, and so extraction does not create a new opening into the hazard zone.",
      },
      {
        label: "Fixing method",
        value:
          "Panel fixings and frame designed to stay in place under impact. A panel that meets the containment requirement in isolation is worthless if its fixings do not.",
      },
    ],
    failureModes: [
      "A polycarbonate window is attacked by coolant over years, becomes brittle, and can no longer do the job it was fitted to do — while looking only slightly cloudy.",
      "Guard panels are removed for a difficult setup and never refitted, leaving a permanent opening nobody has assessed.",
      "A retrofit — a bar feeder, an extraction duct, a robot cell interface — puts a new hole in the enclosure without a fresh risk assessment.",
      "The enclosure was specified for the machine as originally sold and is not reassessed after a spindle or tooling upgrade that raises the energies present.",
      "Extraction is undersized, mist escapes into the workshop, and the guard's containment role is met while its health role is not.",
    ],
    lessons: ["what-is-a-cnc-machine", "selecting-an-architecture"],
    glossary: [
      "guarding",
      "risk-assessment",
      "interlock",
      "emergency-stop",
      "machining-centre",
      "work-envelope",
    ],
  },
  {
    id: "doors",
    name: "Doors and interlocks",
    system: "safety",
    hotspot: { x: 18.33, y: 54.69 },
    plain:
      "The door is how you get to the workpiece, and it is the biggest deliberate hole in the guard. That is why it is not just a door: it carries an interlock, a device that tells the control the door is closed and, on many machines, keeps it locked until the dangerous movement has actually stopped.",
    engineering:
      "A machine door is an interlocking movable guard. The interlocking device may simply prevent hazardous operation while the guard is open, or it may additionally lock the guard closed until the hazard has ceased — guard locking, which is the appropriate choice when run-down time is longer than the time it takes a person to reach the hazard. That comparison, between access time and stopping time, is the engineering heart of the decision, and it is made in the risk assessment. Related concepts include safely limited speed for setting operations and safe standstill monitoring before unlocking. ISO 12100 covers risk assessment principles, ISO 13849-1 addresses safety-related parts of control systems, and ISO 16090-1 addresses machining centres; they are described here by purpose and scope only. The selection, integration, wiring and validation of an interlocking safety function, including its architecture and diagnostics, must be carried out and verified by competent persons under the applicable law and standards.",
    parameters: [
      {
        label: "Guard type",
        value:
          "Sliding or hinged, manual or power-operated. Power operation removes effort and introduces a new hazard that must itself be assessed.",
      },
      {
        label: "Interlocking with or without locking",
        value:
          "Decided by comparing the time it takes to reach the hazard with the time the hazard takes to stop. The comparison is made in the risk assessment.",
      },
      {
        label: "Containment continuity",
        value:
          "The door must maintain the enclosure's containment, including at the frame, the runners and the seals. A door is not a weaker part of the guard by permission.",
      },
      {
        label: "Operating effort",
        value:
          "Light enough to be used every cycle without strain. A heavy door is left open, which defeats the guard entirely.",
      },
      {
        label: "Runners, seals and drainage",
        value:
          "Kept clear of swarf so the door closes fully, and drained so coolant does not sit in the track.",
      },
    ],
    failureModes: [
      "The interlock is defeated with a spare actuator taped to the frame so the machine can run with the door open. This is a serious and well-documented misuse; interlock selection is expected to take deliberate defeat into account.",
      "Swarf collects in the runner, the door does not close fully, and intermittent interlock faults are cured by adjusting the switch rather than by cleaning the track.",
      "Guard locking is not applied on a machine whose spindle takes a long time to stop, so the door can be opened while the tool is still turning.",
      "The door's window degrades with coolant exposure while the rest of the enclosure is renewed, so the weakest point is the one nobody inspects.",
      "A heavy manual door is left open during setting and the machine is jogged in that state out of habit.",
    ],
    lessons: ["what-is-a-cnc-machine", "selecting-an-architecture"],
    glossary: [
      "interlock",
      "guarding",
      "risk-assessment",
      "emergency-stop",
      "work-envelope",
      "machining-centre",
    ],
  },
  {
    id: "sensors",
    name: "Sensors and switches",
    system: "safety",
    hotspot: { x: 48.54, y: 26.88 },
    plain:
      "Sensors are the machine's senses. Some tell it where an axis is when it first powers up, some stop it before an axis runs off the end of its travel, some check that the door is shut or that air pressure is present. Small, cheap, easy to ignore — and the machine cannot be trusted without them.",
    engineering:
      "It helps to separate two families. Process sensing includes home reference switches that establish the machine coordinate system after power-up, over-travel limits, pressure and level switches, temperature sensors and touch probes; these make the machine work correctly. Safety-related sensing includes interlocking devices and monitored position or speed, and these are part of a safety function with requirements on architecture, diagnostic coverage and validation. The two families are not interchangeable: an ordinary limit switch is not a safety device simply because it is wired into a stop circuit. ISO 13849-1 addresses safety-related parts of control systems and IEC 60204-1 addresses the electrical equipment of machines; both are named here by purpose and scope only, and the requirements must come from the standards. Specification, installation, wiring and validation of safety-related sensing is work for competent persons under the applicable law and standards.",
    parameters: [
      {
        label: "Function",
        value:
          "Home reference, over-travel limit, guard interlocking, or process monitoring such as pressure, level and temperature. The function decides everything else.",
      },
      {
        label: "Technology",
        value:
          "Mechanical, inductive, magnetic or coded devices. Coded devices resist deliberate defeat far better than simple magnetic switches.",
      },
      {
        label: "Redundancy and diagnostics",
        value:
          "Required for safety functions to the extent the risk assessment and the applicable standard determine. Not a free choice, and not something to add by intuition.",
      },
      {
        label: "Repeatability of a reference switch",
        value:
          "Qualitative: the home switch's repeatability sets how consistently the machine coordinate system is re-established after every power-up.",
      },
      {
        label: "Environmental protection",
        value:
          "Sealed against coolant and swarf, and mounted where it will not be struck by chips or by a fixture. Most sensor faults on machine tools are environmental.",
      },
    ],
    failureModes: [
      "A worn or contaminated home switch shifts slightly, the machine coordinate system moves with it, and every stored work offset is wrong by the same amount.",
      "Coolant enters a switch body, the contact becomes intermittent, and the resulting alarms appear random enough to be blamed on the control.",
      "A simple magnetic interlock sensor is defeated with a magnet. Sensor technology is expected to be chosen with reasonably foreseeable defeat in mind.",
      "A hard over-travel is reached because a limit failed or was bypassed, and the axis is driven into its mechanical stop.",
      "A single ordinary sensor is relied upon for a safety function without the architecture and diagnostics the risk assessment demands.",
    ],
    lessons: [
      "understanding-xyz",
      "accuracy-repeatability-resolution",
      "what-is-a-cnc-machine",
    ],
    glossary: [
      "interlock",
      "emergency-stop",
      "risk-assessment",
      "machine-coordinate-system",
      "encoder",
      "dro",
      "guarding",
    ],
  },
];

const byId = new Map(machineComponents.map((component) => [component.id, component]));

export function getMachineComponent(id: string): MachineComponent | undefined {
  return byId.get(id);
}
