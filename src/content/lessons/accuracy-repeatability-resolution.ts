import type { Lesson } from "../types";

export const accuracyRepeatabilityResolution: Lesson = {
  slug: "accuracy-repeatability-resolution",
  level: 13,
  title: "Accuracy, repeatability and resolution",
  minutes: 22,
  intro:
    "Accuracy, repeatability and resolution are three different properties of a machine, and beginners — along with a good deal of sales literature — treat them as one. This lesson separates them with a dartboard, shows why only one kind of error can ever be corrected in software, and then walks out into the three dimensions a real part actually lives in. By the end you will read a specification sheet sceptically, know what each measuring instrument can and cannot see, and be able to say what a ballbar plot is telling you.",

  objectives: [
    "Define accuracy, repeatability and resolution separately, and demonstrate with examples that a machine can be strong in one and weak in another",
    "Tell systematic error from random error, and explain why only the systematic part can be compensated",
    "Describe how positioning error along an axis is measured, and say why approaching a target from one direction only is a trap",
    "Name the six error components of a single linear axis and explain how a three-axis machine ends up with twenty-one",
    "State what a dial indicator and test bar, a granite square, a precision level, a ballbar and a laser interferometer each measure — and what each is blind to",
    "Read a ballbar plot qualitatively for backlash, squareness error and servo mismatch, and explain why a measurement without a stated temperature and uncertainty is not a result",
  ],

  terms: [
    {
      term: "Accuracy",
      plain:
        "How close the machine actually gets to the position it was told to go to — the distance from the middle of its attempts to the right answer.",
    },
    {
      term: "Repeatability",
      plain:
        "How tightly the machine groups when it is sent back to the same position over and over — how consistent it is, whether or not it is right.",
    },
    {
      term: "Resolution",
      plain:
        "The smallest step the control can command or the feedback can report. It is a property of the numbers, not a promise about the metal.",
    },
    {
      term: "Systematic error",
      plain:
        "An error that turns up the same size and the same direction every time, so it can be measured once and corrected afterwards.",
    },
    {
      term: "Random error",
      plain:
        "An error that comes out differently on every attempt, so there is no rule to apply and nothing to correct — it can only be engineered smaller.",
    },
    {
      term: "Positioning deviation",
      plain:
        "The difference between the position the control commanded and the position an independent instrument says the axis actually reached.",
    },
    {
      term: "Reversal value",
      plain:
        "The extra error you see when you arrive at a point from one direction rather than the other — the measurable footprint of backlash and lost motion.",
    },
    {
      term: "Straightness error",
      plain:
        "How far a moving carriage wanders sideways or up and down while it is supposed to be travelling in a perfectly straight line.",
    },
    {
      term: "Angular error",
      plain:
        "The tiny tilting of a moving carriage as it travels — nose up and down (pitch), swinging side to side (yaw), twisting about its direction of travel (roll).",
    },
    {
      term: "Squareness error",
      plain:
        "The small amount by which two axes fail to meet at a true right angle, which skews every part they cut together.",
    },
    {
      term: "Volumetric accuracy",
      plain:
        "How far the tool point really is from where it should be at any location inside the machine's working space, with every error acting at once.",
    },
    {
      term: "Measurement uncertainty",
      plain:
        "The honest band of doubt that belongs to any measured value, stating how much the true value could differ from the number you wrote down.",
    },
  ],

  blocks: [
    { kind: "heading", text: "Three words that are not synonyms" },
    {
      kind: "prose",
      body: [
        "Ask three people how good a machine is and you will often get three different numbers, all copied off the same specification sheet. Accuracy, repeatability and resolution sound like polite variations on the same question, and they are used that way in a great deal of marketing. They are three separate properties, they are measured by three different tests, and a machine can be excellent at one while being genuinely poor at another.",
        "The picture that unlocks them is a dartboard. Accuracy is how close your darts land to the bullseye. Repeatability is how tightly they group, wherever that group happens to sit. Resolution is not about the darts at all — it is the fineness of the ruler you use to describe where they landed. A ruler marked in tenths of a millimetre does not improve your throwing.",
        "Hold on to the idea that the first two are independent. A player who lands all five darts inside a coin, but a hand's width left of the bull, is a superb thrower with an aiming fault. A player whose darts are scattered across the board but average out on the bull is not a good thrower who happens to be unlucky; they are inconsistent, and no correction exists that fixes inconsistency.",
      ],
    },
    {
      kind: "figure",
      figure: "accuracy-targets",
      caption:
        "Four targets, four machines. Left to right: a tight group on the bull (accurate and repeatable); a tight group away from the bull (repeatable but inaccurate — a systematic error that can be measured and corrected); a scattered group whose centre sits on the bull (accurate on average, not repeatable — random error, with nothing to correct); and a scattered group off the bull (both problems at once). Study the second target hardest. That is a good machine wearing a fixable fault, and it is the one people wrongly condemn.",
    },
    {
      kind: "prose",
      body: [
        "Now put the definitions in machine terms. Accuracy is how close the axis gets to the position it was commanded to reach, judged against an independent measurement rather than against the machine's own opinion of itself. It is a statement about the centre of the group relative to the truth.",
        "Repeatability is the spread you get when the same command is issued again and again under the same conditions. It says nothing about being right — only about being consistent. Repeatability is the ceiling on the accuracy you can ever reach by correction, because correction is just a rule that shifts the whole group. If the group is `0.05 mm` wide, no rule on earth will place every point within `0.01 mm`.",
        "Resolution is the smallest increment the control can command, or the smallest change the feedback device can report. Both are counting problems, decided by encoder lines, electronics and the arithmetic inside the control. A machine can be built to command steps of `0.0001 mm` and still be `0.05 mm` out at the end of a move, and there is no contradiction in that sentence at all: it asked for a very small step, then failed to deliver it.",
      ],
    },
    {
      kind: "compare",
      title: "The three ideas side by side",
      columns: ["Accuracy", "Repeatability", "Resolution"],
      rows: [
        {
          label: "What it means",
          cells: [
            "How close the machine gets to the position it was told to go to.",
            "How tightly it groups when it returns to the same position again and again.",
            "The smallest increment the control can command or the feedback can report.",
          ],
        },
        {
          label: "What causes it",
          cells: [
            "Screw lead error, geometric error, squareness, thermal growth, deflection under load — plus everything in the next column.",
            "Backlash, stick-slip friction, loose or fretting joints, contamination, servo noise, changing oil film.",
            "Encoder line count and electronic interpolation, screw lead, the control's least input increment, display rounding.",
          ],
        },
        {
          label: "Can it be compensated?",
          cells: [
            "The repeatable part of it, yes — measured and entered as a compensation table in the control.",
            "No. There is no rule to apply, because the error differs on every attempt. It can only be engineered out.",
            "The question does not apply. Resolution is a design choice, not an error, and making it finer corrects nothing.",
          ],
        },
        {
          label: "How it is measured",
          cells: [
            "An independent instrument, usually a laser interferometer, over many target positions across the whole travel.",
            "Repeated approaches to the same target, from both directions, with the spread reported rather than the average.",
            "Read from the feedback specification and the drive arithmetic, then confirmed against the control's least input increment.",
          ],
        },
        {
          label: "What it means for your part",
          cells: [
            "Whether a `100 mm` feature actually comes out `100 mm`, and whether holes land where the drawing says.",
            "Whether the tenth part matches the first, and whether a feature returns to its datum after the axis reverses.",
            "On its own, nothing. It is the granularity of the conversation, not the quality of the result.",
          ],
        },
      ],
    },

    { kind: "heading", text: "Systematic error, random error, and which one you can fix" },
    {
      kind: "prose",
      body: [
        "Split every error a machine makes into two families. A systematic error repeats: the same size, the same direction, under the same conditions. If a ball screw's lead is very slightly short, then every commanded `100 mm` comes out a little under `100 mm`, on every part, on every shift, in the same direction. That predictability is not a nuisance — it is a gift, because anything predictable can be measured once and cancelled afterwards.",
        "A random error is different on every attempt. The guideway sticks and then breaks free by a slightly different amount each time. A speck of swarf changes the seating of a clamp. Electrical noise nudges the servo loop. Nothing about these has a fixed size or a fixed sign, so there is no correction to enter. You reduce random error by changing the machine — better lubrication, cleaner sealing, tighter joints, better servo tuning — or you live with it.",
        "This is the single most useful sentence in machine metrology: you can correct the past only if the future resembles it. Compensation is a bet that tomorrow's error will look like today's measurement, so it works beautifully on lead error and geometry, and not at all on stick-slip. It also explains why repeatability is prized above accuracy by people who build machines. A repeatable machine with a known error is a machine you can fix. An unrepeatable one is not.",
      ],
    },
    {
      kind: "example",
      title: "What a positioning run actually tells you",
      body: [
        "Take an `X` axis with `600 mm` of travel. You choose target positions every `50 mm`, and at each one the axis is driven up to the target five times from the negative direction and five times from the positive direction, with an interferometer measuring where it really arrived. Every number below is invented for teaching. Treat them as orders of magnitude that show how a result is read, never as a specification for any machine.",
        "At the `300 mm` target the five approaches from below average `299.988 mm`, and the five from above average `300.004 mm`. Within each of those two sets, the five readings sit inside a band about `0.004 mm` wide — roughly `±0.002 mm` about their own mean.",
        "Read it in three parts. The deviations are `-0.012 mm` approaching from below and `+0.004 mm` approaching from above, so the machine has a real positioning error at this point. The gap between the two means, about `0.016 mm`, is the reversal value: the footprint of lost motion in the drive, exposed only because you bothered to arrive from both sides. The `0.004 mm` band inside each direction is the repeatability, and it is tight.",
        "The diagnosis follows immediately. Most of this error is systematic — it has a consistent size and a consistent sign — so a compensation table plus a backlash value could remove the bulk of it. What cannot be removed is that `0.004 mm` of scatter. Whatever you do in software, this axis will keep it, and it therefore sets the floor for anything you promise about the parts.",
      ],
    },
    {
      kind: "prose",
      body: [
        "Compensation in a modern control comes in two common forms. A screw error compensation table stores a correction for a series of positions along the travel and interpolates between them, so the control quietly adds a few microns here and subtracts a few there. A backlash compensation value adds a small extra movement whenever an axis reverses, to take up lost motion before the table is expected to move.",
        "Both share the same three limits, and all three matter. They correct only the repeatable part, so a machine with poor repeatability gains almost nothing. They are valid only for the conditions under which they were measured, so a machine compensated cold behaves differently hot. And they have a shelf life, because wear, re-levelling, a crash or a rebuilt nut all invalidate the table that was true last year.",
        "There is also a professional obligation attached. Compensation makes a machine measure well; it does not make it mechanically sound. Dialling in more and more compensation to keep a test looking acceptable hides a fault that is still growing, and the day it exceeds what the table can absorb, it does so during a production run.",
      ],
    },

    { kind: "heading", text: "Resolution is a promise about numbers, not about metal" },
    {
      kind: "prose",
      body: [
        "Three different quantities get quoted as resolution, and confusing them is routine. The least input increment is the smallest number you are allowed to program — often `0.001 mm`. The feedback resolution is the smallest change of position the encoder or scale can report. The display resolution is simply how many digits the readout shows, which is a decision about a screen.",
        "None of the three is accuracy, and the third is not even a measurement. A digital readout showing `100.000` is reporting what the feedback device told it, faithfully. If the feedback device is a rotary encoder on the motor shaft, it is reporting where the motor is — and everything downstream of that motor, the coupling wind-up, the screw lead error, the backlash in the nut and the deflection of the table, is invisible to it. This arrangement is called semi-closed loop, and it is by far the most common.",
        "The alternative is a linear scale mounted along the axis itself, reading the position of the moving part directly. That is a full closed loop, and it puts the screw and the nut inside the loop, so their errors are seen and corrected rather than assumed away. It costs more, it needs protecting from swarf and coolant, and it changes the servo tuning problem — but it is the honest answer to the question of where the table actually is.",
        "Finally, do not conclude that fine resolution is pointless. A resolution far finer than the repeatability is normal and desirable, because coarse position steps inside a servo loop produce rough, noisy motion and audible stepping at low feed rates. Fine resolution buys smooth control. It simply does not buy accuracy, and quoting it as though it does is the oldest trick on a specification sheet.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "r = P / N",
        variables: [
          { symbol: "r", meaning: "Feedback resolution — smallest linear step the feedback can report", unit: "mm" },
          { symbol: "P", meaning: "Screw lead — axis travel produced by one screw revolution", unit: "mm/rev" },
          { symbol: "N", meaning: "Feedback counts reported per screw revolution, after electronic interpolation", unit: "counts/rev" },
        ],
        meaning:
          "Work the number out yourself before you are impressed by it. A `10 mm` lead with `10 000` counts per revolution gives `0.001 mm` per count; add a hundredfold electronic interpolation and the same drive reports `0.00001 mm`, which is `10 nm`, a figure no machine tool of this kind obeys mechanically. If a gearbox or belt sits between motor and screw, divide by the ratio as well. This formula tells you when a quoted resolution is arithmetic rather than evidence — and it is an educational simplification, not a substitute for the drive and encoder manufacturers' data.",
      },
    },
    {
      kind: "note",
      title: "Three different numbers all called resolution",
      body:
        "Least input increment is what you may program, for example `0.001 mm`. Feedback resolution is what the encoder can report, from the formula above. Display resolution is how many digits appear on the readout. They are frequently three different values on the same machine, and a specification sheet that does not say which one it means has told you nothing. In SI terms `0.001 mm` is `1 µm`, which is `1 × 10⁻⁶ m`; shop practice says microns, the unit is the micrometre.",
    },

    { kind: "heading", text: "Measuring position along one axis" },
    {
      kind: "prose",
      body: [
        "A positioning test is the most basic axis measurement there is, and its design carries all the traps. You choose a set of target positions spread across the travel, drive the axis to each one many times while an independent instrument records where it truly arrived, and then read four things out of the data: the deviation at each target, the spread at each target, the difference between the two approach directions, and the overall behaviour across the whole travel.",
        "The one decision that separates a real test from a flattering one is arriving from both directions. Approach every target from the negative side only and the result will look impressive, because you have carefully never asked the axis to do the thing it is worst at. Every circle, every corner and every contour reverses an axis, so a test that never reverses is testing a machine that does not exist.",
        "One more piece of good practice: do not space the targets so that they all land at the same point in the screw's rotation. A screw with a small error that repeats once per revolution — from the nut, the bearings or the shaft — will hide perfectly if every target position happens to be a whole number of screw turns apart. Choosing target spacing that deliberately walks around the screw's rotation exposes that cyclic error instead of concealing it.",
      ],
    },
    {
      kind: "note",
      title: "A result needs a temperature and an uncertainty",
      body:
        "Common steels expand by roughly `11` to `13 µm` per metre for every kelvin of temperature rise — an approximate material property, not a specification. So a one-metre axis measured `2 K` warmer than reference reads about `0.02 mm` longer, which is larger than many of the errors you are hunting. The internationally agreed reference temperature for dimensional measurement is `20 °C`, and a measurement made elsewhere must state its temperature and any correction applied. Add to that the uncertainty of the instrument, the setup and the operator: a number with no stated uncertainty is a claim about how confident someone felt. State both, or you have an anecdote rather than a result.",
    },

    { kind: "heading", text: "An axis is not a perfect line" },
    {
      kind: "prose",
      body: [
        "So far the axis has been treated as a line, with a single error along it. Real hardware is not so obliging. A carriage travelling along `X` also drifts a little sideways in `Y` and a little up and down in `Z`, because no rail is perfectly straight and no mounting surface perfectly flat. Those are the two straightness errors, and they are errors of position at right angles to the travel.",
        "The carriage also tilts as it goes. Borrow the aeroplane words: pitch is the nose lifting and dropping, yaw is the nose swinging left and right, and roll is the whole body twisting about its direction of travel. Those are the three angular errors. Together with the one positioning error along the travel and the two straightness errors, every linear axis carries six error components — and it carries them at every point along its length.",
        "Then the axes have to meet each other. Squareness error is the amount by which two axes fail to cross at a true right angle, and there are three such pairs on a three-axis machine: `X` to `Y`, `Y` to `Z` and `Z` to `X`. Six components on each of three axes, plus three squareness errors between them, is twenty-one error components — the number quoted for a standard three-axis machine tool.",
        "Parallelism belongs in the same family and appears wherever two things are supposed to run together: the two rails of one axis, the two screws driving opposite ends of a gantry, or a spindle axis that should be parallel to a travel. A gantry whose two drives are not perfectly matched will rack slightly, which arrives at the part as yaw plus positioning error, dressed up as something else entirely.",
      ],
    },
    {
      kind: "deeper",
      title: "Deeper: why a tiny angle becomes a large error — the Abbe offset",
      body: [
        "The twenty-one components are not independent in their effect on your part, and angular errors are the reason. An angular error only shows up as a position error when the point you care about is offset from the point where the position is measured. That distance is the Abbe offset, named after Ernst Abbe, who set out the principle that the measuring scale should lie in line with the dimension being measured.",
        "Feed an angle and an offset into the formula below and the arithmetic is unforgiving. An angular error of `10 arcsec` is about `4.85 × 10⁻⁵ rad` — one arcsecond is `1/3600` of a degree, roughly `4.85 µrad`. Multiply that by an Abbe offset of `300 mm`, which is a perfectly ordinary distance from a linear scale down to a tool tip, and you get about `0.015 mm` of position error at the cutting edge. Nothing about the axis reading changed; the tool simply swung.",
        "Now shorten the offset to `50 mm` and the same angle produces about `0.0024 mm`. That is the design lever: attack the offset before you attack the angle, because a shorter tool, a lower workpiece and a scale mounted close to the work plane are usually far cheaper than making a carriage six times more angularly stiff. It is also the reason a long, slender tool turns a machine's small angular errors into visible part errors, and why the same machine measures well and cuts badly when someone fits a tool with a long overhang.",
      ],
      formula: {
        expression: "e = h × θ",
        variables: [
          { symbol: "e", meaning: "Position error appearing at the point you care about", unit: "mm" },
          { symbol: "h", meaning: "Abbe offset — distance from the measuring scale to that point", unit: "mm" },
          { symbol: "θ", meaning: "Angular error of the moving carriage (pitch, yaw or roll)", unit: "rad" },
        ],
        meaning:
          "Keep the offset small and the angle stops mattering so much. Before spending money on a stiffer carriage, ask whether the tool can be shorter, the fixture lower or the scale closer to the work plane. The formula is a small-angle approximation for teaching and does not replace a proper error analysis or engineering review.",
      },
    },
    {
      kind: "prose",
      body: [
        "Your part is not cut by one axis. It is cut at a point in space reached by three axes acting together, so what it experiences is the combined effect of all twenty-one components at that particular location. That is volumetric accuracy: how far the tool point really is from where it should be, anywhere inside the working volume. It is the only accuracy figure that describes what the part will be, and it is always worse than the best single-axis number.",
        "The thinking tool that keeps this manageable is an error budget. List every contributor you can name, put an estimated size against each, mark it systematic or random, and add them up. There are two ways to add. Worst case is the plain arithmetic sum and assumes every error lines up against you at once — conservative, and usually pessimistic. Root-sum-square treats the contributors as independent and random, which is more realistic for scatter but wrong for errors that always push the same way.",
        "Suppose four contributors of `8`, `5`, `3` and `2 µm` — again, illustrative teaching figures rather than any machine's specification. Worst case gives `18 µm`; root-sum-square gives about `10.1 µm`. The gap between those two numbers is itself informative, and so is the ranking: the `8 µm` term is most of the answer, and an afternoon spent halving the `2 µm` term would change essentially nothing. An error budget's real value is not the total. It is that it stops you polishing the smallest contributor while the largest sits untouched.",
      ],
    },
    {
      kind: "formula",
      formula: {
        expression: "E_rss = √(e1² + e2² + ... + en²)        E_max = e1 + e2 + ... + en",
        variables: [
          { symbol: "E_rss", meaning: "Combined error estimate, root-sum-square", unit: "µm" },
          { symbol: "E_max", meaning: "Combined error estimate, worst case", unit: "µm" },
          { symbol: "en", meaning: "Each individual error contribution in the budget", unit: "µm" },
        ],
        meaning:
          "Add the budget both ways and compare the two totals. If they are close, many contributors are of similar size and there is no quick win; if they are far apart, one term dominates and that is where the next effort goes. Root-sum-square assumes the contributors are independent, so errors that always push in the same direction — thermal growth, an uncompensated lead error — must be added arithmetically instead. This is an educational estimating method and does not replace a formal uncertainty analysis or professional engineering validation.",
      },
    },

    { kind: "heading", text: "The instruments, and what each one cannot see" },
    {
      kind: "prose",
      body: [
        "A dial indicator is a plunger or lever driving a needle, showing displacement against whatever the indicator's stand is clamped to. Paired with a test bar — a precision ground cylinder held in the spindle taper — it is the workhorse of alignment: sweep it round to check the spindle against the table, or run it along the bar to check an axis. It is cheap, immediate and tactile. What it cannot do is tell you an absolute position, and it is only ever as good as the thing it is clamped to. Its answer is always a difference, never a length.",
        "A granite square or straightedge is a lapped lump of stone whose faces are reference geometry. With an indicator riding against it you can check squareness between axes or the straightness of a travel, with no power, no batteries and no calibration drift. Its limits are physical: it cannot measure anything longer than itself, its own certified errors set the floor of your result, and if it is badly supported it sags under its own weight and you measure that instead.",
        "A precision level, whether spirit or electronic, measures angle against gravity, and it does so extraordinarily finely. Step it along a travel and you map pitch and roll directly; it is the instrument that levels a machine base and finds a twisted foundation. Gravity is also its blind spot: it cannot see yaw, because rotation about the vertical does not change anything about gravity, and it says nothing about straightness in the horizontal plane.",
        "A laser interferometer splits a beam of light, sends one part to a moving reflector, and counts the interference fringes as the two paths change length. Because the wavelength of light is the ruler, it is the reference instrument for positioning accuracy, and with different optics it also measures straightness, angular errors and squareness. Its weaknesses are practical: one setup measures one thing, misalignment introduces a cosine error that always reads short, and the result depends on air temperature, pressure and humidity, which must be measured and compensated.",
        "A ballbar is a telescoping bar with a precision ball at each end, one sitting in a magnetic cup on the table and the other in a cup held in the spindle. The machine runs a circular path; the bar measures the tiny changes in radius while it does. In minutes it produces a picture that fingers several faults at once, which is why it is the standard health check. What it cannot give you is absolute position: it measures a small circle at one place in the working volume, in one plane, and it knows nothing about lead error over a full travel.",
      ],
    },
    {
      kind: "compare",
      title: "What each instrument sees, and what it misses",
      columns: ["What it actually measures", "Blind to", "Where it earns its keep"],
      rows: [
        {
          label: "Dial indicator and test bar",
          cells: [
            "Displacement relative to whatever the stand is clamped to.",
            "Absolute position, anything longer than the setup, and errors in its own reference.",
            "Quick alignment checks, spindle-to-table geometry, tramming, finding a loose joint.",
          ],
        },
        {
          label: "Granite square or straightedge",
          cells: [
            "Departure of a surface or a travel from a certified reference face.",
            "Distances longer than the stone, and its own uncertainty if uncertified or badly supported.",
            "Squareness between axes and straightness of medium travels, with no power supply.",
          ],
        },
        {
          label: "Precision level",
          cells: [
            "Angle relative to gravity, in very fine increments.",
            "Yaw, and all straightness in the horizontal plane.",
            "Levelling and aligning a machine base; mapping pitch and roll along a travel.",
          ],
        },
        {
          label: "Ballbar",
          cells: [
            "Change in radius while the machine runs a circular path in one plane.",
            "Absolute position, lead error over full travel, and anything outside the small test circle.",
            "Fast periodic health check and diagnosis of backlash, squareness and servo faults.",
          ],
        },
        {
          label: "Laser interferometer",
          cells: [
            "Displacement measured against the wavelength of light, plus straightness and angles with extra optics.",
            "Whatever this particular setup was not configured to see; misalignment and uncompensated air conditions corrupt it.",
            "Reference measurement of positioning accuracy and repeatability, and generating compensation tables.",
          ],
        },
      ],
    },
    {
      kind: "safety",
      body:
        "Measuring a machine means standing close to it while it can still move, which is exactly the condition that guarding exists to prevent. Run ballbar and positioning tests with the guards closed and the machine in its normal automatic mode wherever the setup allows it, and never place hands or instruments inside the working envelope while the axes are able to move under program control. A test bar left in the spindle is a heavy projectile if somebody presses cycle start, and a granite square is heavy, slippery and unforgiving of fingers; plan how each one is supported and carried before you lift it. Where a measurement genuinely cannot be made with the machine in a safe state, that is not a problem to improvise around — it is a task for trained personnel working to the machine manufacturer's documented procedure and to applicable law and standards.",
    },

    { kind: "heading", text: "Reading a ballbar plot" },
    {
      kind: "prose",
      body: [
        "The ballbar plot draws the measured radius around the circle at enormous magnification, so a perfect machine produces a perfect circle and every fault appears as a change of shape. That is the beauty of the test: you are not reading a number, you are recognising a signature. What follows is qualitative, which is how a beginner should use it — the analysis software separates and quantifies the causes properly.",
        "Backlash announces itself at the quadrant points. At the top, bottom, left and right of the circle, one axis is momentarily stationary and reversing while the other is running at full speed, so any lost motion in the reversing drive is exposed at precisely that instant. It appears as a sudden step or an outward spike at each of the four quadrant changes, and it is the same fault that leaves a witness mark on a bored circle. A short spike that recovers immediately suggests friction and stick-slip at reversal rather than mechanical lash; a squarer step suggests true lost motion.",
        "A squareness error turns the circle into an oval whose long axis lies on a diagonal, at `45°` to the machine axes. If `X` and `Y` do not meet at a true right angle, a commanded circle is physically traced as an ellipse stretched along one diagonal and squeezed along the other.",
        "Servo mismatch — one axis's control loop responding faster than the other's, so one lags the commanded path more than its partner — also produces a diagonal oval, which is why it is so often confused with squareness. The way to separate them is to run the test in both directions. A squareness error is built into the metal, so it stays on the same diagonal whichever way you go round. A servo mismatch is a lag, so reversing the direction of travel flips the oval onto the other diagonal. Run clockwise, run anticlockwise, compare: that single habit tells you whether you are looking at geometry or at tuning.",
      ],
    },
    {
      kind: "example",
      title: "Two faults on one plot",
      body: [
        "An operator reports a visible step in a bored circle, always at the same four places around it. A ballbar test is run clockwise and then anticlockwise. The clockwise plot shows a clear outward step of roughly `0.02 mm` at each of the four quadrant changes, and an overall oval in which one diagonal is about `0.015 mm` longer than the other. The anticlockwise plot shows the same four steps, and an oval on the same diagonal as before. These figures are illustrative teaching values, not a specification.",
        "Read it in two parts. The steps at the quadrants are lost motion, exposed each time an axis reverses — mechanical backlash, or lost motion in a coupling or nut mounting. The oval is a squareness error between the two axes, and the fact that it did not swap diagonals when the direction reversed is the evidence that it is geometric rather than a servo tuning mismatch.",
        "The order of the repairs matters. Fix the mechanical lost motion first, because a loose drive train changes the geometry you would otherwise be measuring, and any squareness number taken beforehand is contaminated. Then re-run the ballbar, and only if the oval survives is it worth correcting squareness — which on most machines means physical realignment, not a value typed into a control. Then re-run it a third time to confirm you improved what you meant to improve and broke nothing else.",
      ],
    },
    {
      kind: "note",
      title: "What ISO 230 and ISO 10791 are for",
      body:
        "ISO 230 is the international series that sets out standardised test methods for machine tools — how geometric accuracy, positioning behaviour and related characteristics are to be measured, what the terms mean, and how results are to be handled and presented. ISO 10791 addresses test conditions for machining centres in particular. Their purpose is comparability: without an agreed method, a claimed accuracy figure is a sentence rather than a measurement, because a value obtained one way cannot be set against a value obtained another. This course names these standards by purpose and scope only and states no numeric limit, tolerance class or clause requirement from them. For any actual requirement, test procedure or acceptance criterion, obtain the published standard from a national standards body and work from the document itself.",
    },
    {
      kind: "mistakes",
      items: [
        {
          wrong:
            "Quoting the control's resolution as the machine's accuracy: 'it is a one-micron machine, the display reads 0.001 mm'.",
          why: "Resolution is the granularity of the numbers, not evidence about metal. A control can command `0.001 mm` steps on an axis with `0.05 mm` of backlash, and the readout will report the position it commanded — faithfully, and wrongly, because it is reading the motor rather than the table.",
        },
        {
          wrong:
            "Measuring each target position by always approaching it from the same direction, on the grounds that it makes the test consistent.",
          why: "A unidirectional test cannot reveal reversal error, because it never reverses. The result looks excellent and then collapses the first time the part demands a corner or a circle, both of which reverse an axis. You did not measure a good machine; you measured half a machine.",
        },
        {
          wrong:
            "Measuring geometry on a machine that has been cutting all morning and recording the answer as the machine's geometry.",
          why: "What you measured was geometry plus thermal state, and nothing in the result separates them. Measure it cold and you get a different answer, so neither number is the machine's geometry until the temperature is recorded and controlled. Thermal drift on a metre of steel over a few kelvin is larger than most geometric errors you are chasing.",
        },
        {
          wrong: "Taking five readings, averaging them, and reporting the mean as the machine's performance.",
          why: "The mean describes the systematic error; the spread describes the repeatability, and your part is cut by one single movement rather than by the average of five. Reporting only the mean discards the number that decides whether the tenth part matches the first.",
        },
        {
          wrong: "Increasing the backlash compensation value until the test circle looks acceptable.",
          why: "Compensation is only valid where it matches a measured, repeatable amount of lost motion. Tuning it by eye against one test masks a mechanical fault that is still growing, and over-compensation creates a fresh error in the opposite direction that shows up at a different position, load or temperature.",
        },
      ],
    },
  ],

  knowledgeCheck: [
    {
      id: "arr-tight-group-off-target",
      prompt:
        "A machine drills a hole pattern ten times. Every pattern sits about `0.04 mm` to the left of where the drawing puts it, and the ten patterns agree with each other to within `0.003 mm`. How should this machine be described?",
      options: [
        {
          id: "a",
          text: "It has poor repeatability and needs mechanical work before it is usable.",
          correct: false,
          feedback:
            "Tempting because `0.04 mm` is a real error and 'the machine is bad' feels like a repeatability verdict. But repeatability is the spread, and the spread here is `0.003 mm` — excellent. The fault is in where the group sits, not in how tightly it groups.",
        },
        {
          id: "b",
          text: "It is repeatable but inaccurate: a systematic error, which can be measured and corrected.",
          correct: true,
          feedback:
            "Correct, and the second half is the valuable part. Because the offset is the same size and direction every time, it can be measured once and cancelled — through a work offset, a compensation value or an alignment correction. This is the good machine wearing a fixable fault.",
        },
        {
          id: "c",
          text: "Its resolution is too coarse, at roughly `0.04 mm` per step.",
          correct: false,
          feedback:
            "A reasonable guess, since a coarse step size would indeed push positions off target. It does not survive the second number: a machine quantised to `0.04 mm` could not possibly group ten patterns inside `0.003 mm`, because every result would land on one of those coarse steps.",
        },
        {
          id: "d",
          text: "It is accurate but not repeatable.",
          correct: false,
          feedback:
            "This is the two definitions swapped over, which happens easily under exam pressure. Accuracy is the distance from the group's centre to the target — poor here. Repeatability is the tightness of the group — excellent here. Fix the words in that order and the sentence corrects itself.",
        },
      ],
      teaching:
        "Distance from the group's centre to the target is accuracy; the width of the group is repeatability. A tight group in the wrong place is systematic error, and systematic error is the correctable kind.",
    },
    {
      id: "arr-resolution-claim",
      prompt:
        "A specification sheet states a resolution of `0.0005 mm`. What can you legitimately conclude about the parts this machine will produce?",
      options: [
        {
          id: "a",
          text: "It can hold `0.0005 mm` on a feature, since that is what it resolves.",
          correct: false,
          feedback:
            "Tempting because the figure is genuine and stated in the right units, and specification sheets are written to encourage exactly this reading. Resolution describes the smallest increment that can be commanded or reported; nothing in it says the axis arrives there, or stays there while a tool pushes on it.",
        },
        {
          id: "b",
          text: "Almost nothing on its own — it describes the smallest increment that can be commanded or reported, not whether the axis actually goes there.",
          correct: true,
          feedback:
            "Correct. To say anything about parts you need repeatability and accuracy figures, together with the test conditions and temperature under which they were obtained. Resolution alone is the granularity of the conversation, not the quality of the outcome.",
        },
        {
          id: "c",
          text: "Its repeatability must be at least as good as `0.0005 mm`, because a machine cannot resolve better than it repeats.",
          correct: false,
          feedback:
            "The logic is appealing and runs the wrong way round. Resolution is set by counting electronics; repeatability is set by friction, lash and joint quality. Nothing stops a builder fitting a very finely interpolated encoder to an axis with sticky ways, and plenty have.",
        },
        {
          id: "d",
          text: "It must use a linear scale rather than a rotary encoder on the motor.",
          correct: false,
          feedback:
            "A fair association, since scales are the usual route to fine feedback on the table itself. But electronic interpolation produces very fine counts from either kind of device, so the resolution figure alone does not reveal where the feedback is mounted — which is the thing you actually wanted to know.",
        },
      ],
      teaching:
        "Resolution is arithmetic; accuracy and repeatability are measurements. Always ask what was measured, how many approaches, from which directions and at what temperature.",
      reviewSlug: "how-a-ball-screw-moves-an-axis",
    },
    {
      id: "arr-unidirectional-trap",
      prompt:
        "An axis is tested by approaching every target position from the negative direction only, and the results look excellent. The same machine then cuts circles with a visible step at each quadrant. What went wrong with the test?",
      options: [
        {
          id: "a",
          text: "The laser was misaligned, so a cosine error corrupted the readings.",
          correct: false,
          feedback:
            "A real and common setup fault, which is why it comes to mind. But cosine error makes every reading consistently short by a small proportion of the distance travelled; it produces a gently scaled result, not a hidden reversal step.",
        },
        {
          id: "b",
          text: "The test never reversed the axis, so it could not reveal reversal error — while a circle reverses each axis twice per revolution.",
          correct: true,
          feedback:
            "Correct, and it generalises: a test only reveals what it exercises. Approaching from both directions is what exposes lost motion, and the quadrant points of a circle are precisely where each axis stops and turns round.",
        },
        {
          id: "c",
          text: "Positioning tests and circular tests measure different quantities, so disagreement between them is normal.",
          correct: false,
          feedback:
            "Half true, and that is what makes it comfortable — the two tests do reveal different things. It stops short of the actual cause, though. A positioning test run in both directions would have shown this reversal value clearly, so the tests need not have disagreed at all.",
        },
        {
          id: "d",
          text: "Repeatability was measured when accuracy was needed.",
          correct: false,
          feedback:
            "It correctly senses that the wrong property was captured, which is good instinct. But repeated approaches from one direction measure unidirectional repeatability and unidirectional accuracy both, and each looks fine here. The missing quantity is the reversal value, which needs the other direction.",
        },
      ],
      teaching:
        "A measurement can only reveal what it provokes. Design the test around the thing you are afraid of — for a feed drive, that is reversal.",
      reviewSlug: "how-a-ball-screw-moves-an-axis",
    },
    {
      id: "arr-volumetric-squareness",
      prompt:
        "The `X` axis of a machine has been measured over its full travel and its positioning accuracy is excellent. A large rectangular plate machined on it nevertheless comes out with a visibly skewed corner. What is the most likely explanation?",
      options: [
        {
          id: "a",
          text: "A squareness error between `X` and `Y` — a geometric component that a single-axis positioning test cannot see.",
          correct: true,
          feedback:
            "Correct. Squareness lives between axes, not within one, so a perfect `X` measurement says nothing about it. This is exactly why volumetric accuracy exists as a separate idea from single-axis accuracy.",
        },
        {
          id: "b",
          text: "Coarse resolution on the `Y` axis.",
          correct: false,
          feedback:
            "It is good instinct to suspect the axis that was not measured. Coarse resolution would show up as fine stepping or a poor surface on a slow contour, though, not as a consistent skew of an entire plate — a skew is an angle, and angles come from geometry.",
        },
        {
          id: "c",
          text: "The `X` positioning measurement must have been performed incorrectly.",
          correct: false,
          feedback:
            "Distrusting an earlier result is healthy, but here it points the wrong way. The `X` test is not wrong — it is incomplete. It measured motion along `X`, which is one of twenty-one error components, and the fault lies in one of the other twenty.",
        },
        {
          id: "d",
          text: "Backlash on the `X` axis, taken up differently on each side of the plate.",
          correct: false,
          feedback:
            "Lash is the usual villain, so this is a natural first thought. Its signature is different, though: lost motion produces steps and mismatched dimensions where an axis reverses, not a consistent angular skew of the whole part.",
        },
      ],
      teaching:
        "Six error components per linear axis plus three squareness errors gives twenty-one for a three-axis machine. A part experiences the combination — volumetric accuracy — not any single axis figure.",
      reviewSlug: "understanding-xyz",
    },
    {
      id: "arr-ballbar-direction-test",
      prompt:
        "A ballbar plot shows an oval whose long axis lies on one diagonal. The test is repeated in the opposite direction and the oval now lies on the other diagonal. What does that indicate?",
      options: [
        {
          id: "a",
          text: "A squareness error between the two axes.",
          correct: false,
          feedback:
            "Tempting because the shape is right — squareness genuinely does produce a diagonal oval. The direction test rules it out: squareness is built into the metal, so it cannot change which diagonal it favours just because you drove round the circle the other way.",
        },
        {
          id: "b",
          text: "Servo mismatch — one axis's loop responds faster than the other, so the lag swaps sides when the direction of travel reverses.",
          correct: true,
          feedback:
            "Correct, and the reversal is the whole proof. A lag is a dynamic effect tied to the direction of motion, so flipping the direction flips the distortion. Running both directions is the cheapest way to separate tuning problems from geometry.",
        },
        {
          id: "c",
          text: "Backlash on both axes.",
          correct: false,
          feedback:
            "Lash is direction-dependent, so it is reasonable to reach for it when a result changes with direction. But lash appears at the four quadrant points where an axis actually reverses, as steps or spikes, rather than as a smooth oval spread around the whole circle.",
        },
        {
          id: "d",
          text: "The ballbar length was set incorrectly before the test.",
          correct: false,
          feedback:
            "A genuine setup error worth eliminating, and it does move the trace. It moves it uniformly, though — the whole circle reads larger or smaller in radius. It cannot create a distortion that favours one diagonal, let alone one that swaps diagonals with direction.",
        },
      ],
      teaching:
        "The shape of a ballbar plot suggests the fault; running the circle in both directions separates geometric causes, which stay put, from dynamic ones, which flip. Treat the reading as qualitative and confirm it with the analysis software and a follow-up measurement.",
    },
    {
      id: "arr-temperature-uncertainty",
      prompt:
        "A supplier offers a positioning accuracy figure measured, in their words, on the shop floor straight after a production run. What is the sound response?",
      options: [
        {
          id: "a",
          text: "Accept it, since measuring under real working conditions is more representative than measuring a cold machine.",
          correct: false,
          feedback:
            "There is a genuine argument buried here — behaviour in service does matter, and a cold machine is not the one you will run. But without a recorded temperature the figure cannot be repeated or compared with anyone else's, so it fails as a measurement even if the intention was honest.",
        },
        {
          id: "b",
          text: "Ask for the temperature during the test and the measurement uncertainty, because without them the number cannot be compared or repeated.",
          correct: true,
          feedback:
            "Correct. Those two pieces of information turn a number into a result: one says what state the machine was in, the other says how much the number could be wrong. Ask also what test method was used and how many approaches were made in each direction.",
        },
        {
          id: "c",
          text: "Reject it outright, since positioning accuracy can only be measured at `20 °C`.",
          correct: false,
          feedback:
            "It correctly remembers that `20 °C` is the agreed reference temperature for dimensional measurement, which is why it feels rigorous. It is stricter than metrology actually requires: measuring away from reference is routine and legitimate, provided the temperature is recorded and any correction is stated.",
        },
        {
          id: "d",
          text: "Ask which control resolution was used, since that sets the limit on the result.",
          correct: false,
          feedback:
            "Resolution is a fair thing to be curious about, but it is the wrong lever here. The measurement came from an external instrument rather than from the control's own count, and thermal state will dominate the answer far more than any counting increment.",
        },
      ],
      teaching:
        "A number without a temperature and an uncertainty is an anecdote. Steel moves by roughly `11` to `13 µm` per metre per kelvin, which is larger than most of the errors being argued about.",
    },
  ],

  exercise: {
    title: "Separate the three, then build an error budget",
    body:
      "This is a paper exercise, and it works just as well on a machine you have never touched. The aim is to make the three words behave like three different questions in your head, and then to practise the habit that keeps metrology honest: writing down where the error actually comes from before deciding what to change.",
    steps: [
      "Find any machine specification sheet you can — a manufacturer's brochure, a hobby machine listing, or the illustrative figures in this lesson. Copy out every performance number on it and label each one accuracy, repeatability or resolution. Where the sheet does not make it clear, write 'not stated'. Count how many entries ended up in that third category; that count is the finding.",
      "Redraw the four dart targets from memory. Beside each, name a machine fault that would produce it, and say in one sentence whether software could correct it and why.",
      "Design a positioning test for a `600 mm` axis. Decide your target positions and their spacing, how many approaches you will make at each, in which directions, and exactly what you will record. Then write one sentence naming something your test would still fail to reveal.",
      "List the six error components of a single linear axis in your own words, and for each name an instrument from this lesson that could measure it. Then state why squareness is not on your list of six.",
      "Build an error budget for one dimension on an imaginary part. List at least four contributors with an estimated size in micrometres, mark each systematic or random, then total them both worst case and root-sum-square. Name the dominant contributor and say what you would change first.",
      "A machine cuts a good first part and a poor tenth part. Decide which single instrument you would reach for first, and defend the choice in two sentences on the grounds of what it would tell you fastest.",
      "Finally, write the one-line statement that must accompany any result you produce: the temperature at which it was measured, and the uncertainty you would attach to it. Keep that line as a template.",
    ],
    selfCheck: [
      "Your labels distinguish a number describing the centre of a group from a number describing its width, and you did not file resolution under either.",
      "Your positioning test approaches every target from both directions, and you can state plainly what a one-direction test would have hidden.",
      "Your six components are one positioning, two straightness and three angular — and squareness is absent, because squareness is between axes rather than within one.",
      "Your error budget names the dominant contributor, and your first proposed action attacks that one rather than the smallest.",
      "Your worst-case and root-sum-square totals differ, you can explain why, and you can say which of the two you would quote to a customer and on what grounds.",
      "Your closing line contains both a temperature and an uncertainty. Without both, what you wrote is an anecdote rather than a measurement.",
    ],
  },

  summary: [
    "Accuracy is how close the machine gets to the commanded position; repeatability is how tightly it groups; resolution is only the smallest increment that can be commanded or reported.",
    "The three are independent: a machine can group beautifully in the wrong place, scatter around the right one, or display far more digits than it can honour.",
    "Systematic error repeats and can therefore be measured and compensated; random error differs every time and can only be engineered smaller.",
    "Compensation can never make a machine better than its repeatability, and it is valid only for the conditions in which it was measured.",
    "A positioning test must approach every target from both directions, or it hides the reversal value entirely.",
    "Each linear axis carries six error components — one positioning, two straightness, three angular — and three squareness errors between the pairs make twenty-one on a three-axis machine.",
    "Volumetric accuracy is what the part experiences; an error budget ranks the contributors so effort goes where it changes the answer.",
    "Every instrument is blind to something: indicators to absolute position, levels to yaw, ballbars to full-travel error, interferometers to whatever they were not set up to measure — and every result needs a stated temperature and uncertainty.",
  ],

  nextSlug: "intro-to-machine-architecture",
};
