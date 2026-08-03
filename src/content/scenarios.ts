import type { Scenario } from "./types";

/**
 * Troubleshooting scenarios. SPEC.md section 11.
 *
 * The grading is deliberately not right-versus-wrong. In fault-finding almost
 * every test tells you something; what separates a good diagnostician from a
 * slow one is knowing which test is the *cheapest decisive* one at that moment.
 * So options are graded:
 *
 *   sound     — the cheapest decisive step available with the evidence in hand
 *   wasteful  — a legitimate test that costs more than it needs to right now,
 *               and whose response says what it would have told you and when it
 *               would have been the right call
 *   wrong     — a step that would mislead, hide the fault or create a new one,
 *               whose response says why it is tempting, where the reasoning
 *               breaks, and what evidence would have made it reasonable
 *
 * Every figure in these scenarios is an illustrative teaching value chosen to
 * make the reasoning visible. None of them is a specification, a tolerance or
 * an acceptance limit for any real machine, cutter or material.
 */
export const scenarios: Scenario[] = [
  {
    id: "quadrant-step",
    title: "A step at the quadrant change on a circular test",

    symptom:
      "I bored the test circle in the aluminium block this morning — eighty millimetres, the same program we always use — and you can catch a fingernail on the wall at four places round it. Twelve o'clock, three, six and nine. It isn't chatter; there's no pattern of marks, it's a step. The wall jumps out and comes straight back in. The setter put the ballbar on afterwards and said the trace doesn't close: it kinks at those same four places. Everything else the machine does looks fine to me. Straight cuts are on size, faces come out clean, and I haven't had a single alarm all week.",

    context: [
      "The machine is a three-axis vertical machining centre, about four years old and in daily production. X and Y are each driven by a ball screw, coupled to a servo motor, running on profile rail guides. Position feedback is a rotary encoder on each motor shaft, so the control knows where each motor is, not where each table actually is. That arrangement is called semi-closed loop and it is by far the most common one.",
      "The test is the shop's routine circular check: an `80 mm` diameter circle interpolated in an aluminium test block, followed by a ballbar test at a `150 mm` radius run clockwise and then anticlockwise. Both ballbar runs put a kink at the same four points.",
      "Two weeks ago the X-axis servo motor and the bearing housing behind it were removed so that a leaking way-lubrication line could be replaced, and refitted by the maintenance team the same afternoon. The machine went straight back into production and nobody re-ran the circular test.",
      "Nothing in the control has been changed. The backlash compensation values and the screw error compensation tables are as they were at the last verification nine months ago, when the ballbar plot was inside the shop's own internal acceptance band.",
      "Everything else reads normally. No alarms, no following-error warnings, the spindle sounds and loads as usual, long straight moves in X and Y measure on size, and a second machine running the same program produces a clean circle.",
      "Every figure in this scenario is an illustrative teaching value chosen to make the reasoning visible. None of them is a specification or an acceptance limit for a real machine.",
    ],

    steps: [
      {
        id: "first-move",
        question:
          "Nothing has been dismantled yet. The circle is cut, the ballbar plot is on the screen and the machine is standing idle in production time. What is the first move?",
        options: [
          {
            id: "history-and-repeat",
            verdict: "sound",
            text: "Read the maintenance log, talk to whoever did the way-lubrication repair, and re-run the same test circle in a fresh block to confirm the fault repeats in the same four places.",
            response:
              "This is the cheapest decisive move available and it costs about twenty minutes of machine time. It does two jobs at once. Repeating the cut tells you whether you are chasing a repeatable fault or a one-off: a repeatable fault has a mechanical or control cause that is present on every cycle and can be hunted down, whereas a fault that will not repeat is telling you about something intermittent and needs a completely different approach. Asking what changed tells you where to look first, because a fault that appears shortly after a specific assembly was disturbed is pointing straight at that assembly — and here the X drive was opened up a fortnight ago. Evidence before spanners, every time.",
          },
          {
            id: "laser-positioning",
            verdict: "wasteful",
            text: "Book the laser interferometer and measure positioning accuracy along the full X travel.",
            response:
              "A legitimate measurement, and one you would want at an annual verification, but it is half a day of setup and analysis and it answers a different question. A laser positioning test characterises deviation along the length of a travel — the errors that accumulate over hundreds of millimetres. Your symptom lives in a fraction of a millimetre at the instant an axis turns round, in one small patch of the working volume. The test would very likely come back looking acceptable, and you would have spent half a day proving that the fault is not where you already knew it was not.",
          },
          {
            id: "new-tool",
            verdict: "wasteful",
            text: "Fit a new cutter in a different holder and re-cut the circle, in case the tool or the holder is at fault.",
            response:
              "Ten minutes, and ruling the tool out is never silly — a chipped edge or a holder running out of true does leave marks on a bored wall. The ballbar has already done it for you, though. A ballbar test does not cut anything: there is no tool, no chip and no cutting force, and it produced the same four kinks in the same four places. Whatever is wrong lives in the machine rather than in the cutting. Notice what the ballbar just bought you, and spend the ten minutes elsewhere.",
          },
          {
            id: "crank-compensation",
            verdict: "wrong",
            text: "Increase the backlash compensation values on X and Y until the circle comes out clean.",
            response:
              "This is the most tempting wrong answer in the trade, because it takes two minutes, it usually does make the plot look better, and backlash compensation exists precisely to correct lost motion. It breaks in three places. First, you do not yet know which axis is at fault, so you would be adding a correction to an axis that may be perfectly healthy and introducing a brand-new error there. Second, compensation is meant to trim the small, stable residual of a correctly assembled drive; used to hide a mechanical fault it also hides the fact that the fault is growing, and it will keep hiding it until something breaks. Third, once a compensation value has been changed, every measurement you take afterwards is contaminated — you can no longer separate what the machine does from what the correction does. Compensation is a finishing step after a mechanical repair, never a substitute for one.",
          },
        ],
      },

      {
        id: "which-axis",
        question:
          "The fault repeats exactly, and the maintenance log confirms the X drive was opened up two weeks ago. The ballbar plot shows a step at all four quadrant points. Which axis is at fault, and how do you tell from what is already on the screen?",
        options: [
          {
            id: "other-planes",
            verdict: "wasteful",
            text: "Run the ballbar again in the ZX and YZ planes to see how the Z axis behaves.",
            response:
              "Worth doing eventually, and a machine that is only ever tested in one plane is only ever a third proven. But it is another setup and another hour for each plane, and nothing you have implicates Z: the symptom is in a circle cut in the XY plane, with Z standing still throughout. Put the two vertical planes on the next scheduled verification — or do them immediately if you had reason to believe the fault was common to all three drives, which would be the case if, say, a shared supply or a shared parameter set had been changed.",
          },
          {
            id: "compare-quadrant-pairs",
            verdict: "sound",
            text: "Compare the size of the step at three and nine o'clock against the size of the step at twelve and six o'clock.",
            response:
              "Right, and it costs nothing, because the evidence is already on the screen. Think about what each axis is doing as the circle is drawn. At three and nine o'clock the bar is at its furthest in X, which means X has slowed to a stop and is turning round while Y runs at full speed. At twelve and six o'clock it is the other way about. Lost motion in a drive is exposed at exactly the moment that drive reverses, so a step at three and nine belongs to X and a step at twelve and six belongs to Y. On this plot the steps at the X reversal points are around `0.03 mm` and those at the Y reversal points around `0.005 mm`. The figures are illustrative, but the ratio is the point: X is the axis to chase, and that agrees with the maintenance history.",
          },
          {
            id: "blame-both",
            verdict: "wrong",
            text: "Treat it as both axes, since there is a step at all four quadrant points, and plan to strip both drives.",
            response:
              "The reasoning is understandable: four steps, two axes, so both must be at fault. Where it breaks is that the four quadrant points are not four independent pieces of evidence. They are two pieces, each seen twice, because each axis reverses twice per circle. Reading the sizes rather than counting the kinks separates them, and here the two pairs are very different sizes. Stripping both drives would double the downtime, double the chance of disturbing something that was correctly set, and destroy the evidence on the healthy axis. The evidence that would justify opening both is two pairs of steps of similar size, together with a history that implicates both drives.",
          },
          {
            id: "slow-ballbar",
            verdict: "wasteful",
            text: "Run the XY ballbar again at a much lower feed rate and compare the two plots.",
            response:
              "A genuinely informative test that takes about fifteen minutes, and it separates two different families of quadrant fault. True lost motion — actual free play in the drive train — is a distance, so it comes out roughly the same size however slowly you go round. Friction at reversal, where a stationary joint has to break away before it will slide, and servo effects, where a control loop cannot reverse instantly, both shrink as the speed comes down. So this test would tell you which family you are in. It simply is not yet the cheapest thing on the table, because comparing the two pairs of quadrant points costs nothing at all and narrows the search to a single axis first.",
          },
        ],
      },

      {
        id: "lash-or-spike",
        question:
          "X is the suspect. On the plot the X steps are square-edged: the trace jumps outwards and stays out until the axis is well clear of the reversal, rather than spiking and decaying. What test separates real mechanical lost motion from a friction or tuning effect — and does it at the table, where the part is?",
        options: [
          {
            id: "laser-bidirectional",
            verdict: "wasteful",
            text: "Set up a laser interferometer for a bidirectional positioning test along the X travel.",
            response:
              "This is the proper, traceable way to quantify positioning deviation and reversal at many points along a travel, and standardised methods for machine tool geometric and positioning tests are the subject of ISO 230 — go to the standard itself for how the tests are defined and what they require, because that is the only place the actual requirements live. It is still half a day of setup and analysis for a fault you can localise with an indicator and a magnetic base in ten minutes. Reach for it when you need a number you can put in a report and defend, or when you need to know how reversal varies along the travel rather than at one point. Right now you need a direction to walk in, not a certificate.",
          },
          {
            id: "raise-gain",
            verdict: "wrong",
            text: "Raise the position loop gain on the X axis so that it follows the commanded path more tightly.",
            response:
              "The temptation is real, because a stiffer loop does reduce following error and a badly tuned machine does cut poor circles. Where it breaks is that gain cannot command motion the mechanism will not transmit. If there is free play between motor and table, the motor turns and the table does not; raising the gain makes the motor chase harder into that free play, and the usual result is buzz, overshoot at each reversal and a worse plot rather than a better one. There is a governance point too: loop gains are protected machine data, set by the builder for that specific combination of motor, screw and moving mass, and changing them outside the builder's procedure leaves a change nobody can unwind later. The evidence that would justify a tuning change is a fault that shrinks as the feed rate comes down, plus a following-error trace showing the axis lagging its command. You have neither.",
          },
          {
            id: "indicator-lost-motion",
            verdict: "sound",
            text: "Set a dial indicator against the table with its stem parallel to X and the servos on, jog X well clear in one direction, zero the indicator, then command small steps back the other way and note how far the control has commanded before the needle first moves.",
            response:
              "This is the classic lost-motion test and it is decisive. It measures the distance the control commands before the table actually starts to move, at the table itself — which is exactly what a motor-mounted encoder cannot see. Two details matter. Approach the zero point from one direction and settle there first, so that every joint in the drive is loaded up that way; otherwise you are measuring a random state and will get a random answer. And leave the servos on, so the motor is holding position and the free play you find is in the mechanism rather than in a motor that is free to rotate. On this machine the test shows about `0.03 mm` of commanded motion before the table moves, which matches the ballbar step. Two independent measurements agreeing is what turns a suspicion into a finding.",
          },
          {
            id: "swap-drives",
            verdict: "wasteful",
            text: "Swap the X and Y servo drive modules over and re-run the ballbar to see whether the fault follows the drive.",
            response:
              "Substituting a suspect part for a known-good one is a sound technique, and it is the right move when you genuinely cannot tell an electrical fault from a mechanical one. Here it costs a couple of hours of work by a qualified person — drive modules live in the control cabinet, which is not territory to improvise in and not work for anyone without the training and the authority to do it — and the evidence already points away from the electronics. A square-edged step that stays out through the reversal is the signature of a fixed distance, not of a control response. Keep the swap in reserve for a fault that changes with speed or with load.",
          },
        ],
      },

      {
        id: "bracket-the-train",
        question:
          "There is about `0.03 mm` of lost motion between the X command and the table. The drive train runs motor, coupling, screw shaft, support bearings, ball nut, nut bracket, table. Where in that chain is the motion being lost?",
        options: [
          {
            id: "strip-the-nut",
            verdict: "wasteful",
            text: "Remove the ball nut and inspect the ball tracks and the recirculation path for damage and missing balls.",
            response:
              "A worn or damaged ball nut is a genuine cause of lost motion and somebody may eventually have to look inside this one. It is most of a day's work, it needs the axis stripped and re-set afterwards, and it destroys the very measurement you would want to repeat. Inspecting a nut is what you do once bracketing has pointed at the nut — for instance if the lost motion had vanished the moment the indicator moved from the table to the screw shaft, or if the amount varied strongly with position along the travel because the middle of the screw is where the wear lives. Neither of those is established yet.",
          },
          {
            id: "walk-the-indicator",
            verdict: "sound",
            text: "Repeat the same reversal test with the indicator moved progressively closer to the motor — on the table, then on the nut bracket, then reading the end of the screw shaft axially, then on the coupling hub — and note where the lost motion disappears.",
            response:
              "This is bracketing, and it is the single most useful habit in fault-finding: instead of guessing which part has failed, you halve the search space with each measurement until one joint is left inside it. Each reading tells you whether the lost motion is upstream or downstream of that point. Here the `0.03 mm` is still there at the table, still there at the nut bracket, and still there when you read the end of the screw shaft axially — but reading the coupling hub against the motor shaft shows almost nothing. So the motor turns the screw faithfully and the screw turns the nut faithfully, yet the whole screw shifts along its own axis before the table will move. The fault is in whatever is supposed to hold that screw axially.",
          },
          {
            id: "quote-a-screw",
            verdict: "wrong",
            text: "Conclude the ball screw is worn out after four years of production, and quote for a new screw and nut assembly.",
            response:
              "It is the component people name first, because it is the part that visibly does the work and because screws genuinely do wear. The reasoning breaks on the evidence you have and, just as much, on the evidence you have not gathered. Wear in a screw and nut concentrates where the machine spends its life, so it shows up as lost motion that varies along the travel, usually largest in the middle of the working stroke and smaller at the ends — and nobody has checked whether this `0.03 mm` varies with position at all. A replacement screw is among the most expensive parts on the machine, plus days of downtime and a full realignment, and if the true fault sits upstream of the nut you will fit it and find the step exactly where it was. The evidence that would justify the quote is a bracketing test placing the lost motion between screw and nut, together with measurements showing it varying with position along the travel.",
          },
          {
            id: "fit-a-scale",
            verdict: "wasteful",
            text: "Fit a linear scale to the X axis so the control can read the table directly and close the loop around the fault.",
            response:
              "A linear scale mounted along the axis does report the table's true position, and a fully closed loop does correct errors that a motor encoder is blind to. It is a real upgrade with real benefits, and on a machine specified for it, it can be a sensible capital decision. It is the wrong answer to this problem. A control cannot correct free play in the instant it is happening: at reversal the motor turns while the table does not, and now the control watches its own scale reporting no movement and pushes harder, which tends to produce a dwell and then an overshoot at each quadrant. You would have spent a great deal of money to measure a fault instead of removing it.",
          },
        ],
      },

      {
        id: "screw-float",
        question:
          "The whole screw shaft is moving along its own axis before the table moves. The screw's fixed end — the bearing housing whose entire job is to stop it doing that — is the assembly the maintenance team disturbed two weeks ago. What next?",
        options: [
          {
            id: "open-the-housing",
            verdict: "sound",
            text: "With the machine isolated and locked off by a competent person, take the cover off the fixed bearing housing at the motor end and check the bearing retaining nut and the housing fixings against the machine builder's assembly procedure.",
            response:
              "This is the cheapest decisive step and it is aimed squarely at the assembly the history implicates. The fixed end of a ball screw is normally a preloaded pair of angular contact bearings clamped by a retaining nut, and their whole purpose is to take the axial thrust so that the screw turns without travelling along its own axis. If that clamp is slack, the screw floats, and every reversal has to take up the float before the table will move — which is precisely the measurement you took. Two conditions before the cover comes off, not one. The machine must be electrically isolated and locked off, because an axis that can move while somebody has their hands in the drive train is a crushing hazard and the guarding exists to prevent exactly that. And the work must be done by someone competent to do it, following the builder's documented procedure, because bearing preload is a specified value rather than a feel.",
          },
          {
            id: "float-along-travel",
            verdict: "wasteful",
            text: "Measure the axial lost motion at three positions along the X travel to see whether it varies.",
            response:
              "A good test, and in a different order of events it would be the right one. Lost motion that stays the same size everywhere along the travel points at something fixed, such as end float; lost motion that grows towards the middle of the stroke points at wear in the screw and nut, where the machine spends its time. It costs about twenty minutes. The reason it is not the next step here is that bracketing has already put the motion in the screw's axial constraint rather than in the nut, and the maintenance log has already named the assembly that was opened. Keep this test for the case where there is no useful history — which is most of the time, and precisely why recording what you changed matters so much.",
          },
          {
            id: "accelerometer",
            verdict: "wasteful",
            text: "Fit an accelerometer to the axis and record the vibration signature through a reversal.",
            response:
              "Condition monitoring by vibration is a real and valuable discipline, and a loose bearing housing may well produce a signature you could learn to recognise. But this is an indirect measurement of something you can already measure directly: you have `0.03 mm` of axial movement in a component designed to have effectively none, read off a dial indicator. Interpreting a vibration trace also needs a healthy baseline for this machine to compare against, and nobody has recorded one. Reach for the indirect method when the direct one is impossible, not when it is sitting on the bench.",
          },
          {
            id: "compensate-and-run",
            verdict: "wrong",
            text: "Enter a backlash compensation value of `0.03 mm` on the X axis and put the machine back into production while parts are on order.",
            response:
              "This is the pragmatic-sounding answer that ends careers quietly, and it deserves a fair hearing: production is waiting, compensation exists for lost motion, and it would very likely make today's parts acceptable. It breaks on three counts. The value is only correct for the conditions you measured it in — one feed rate, one load, one pattern of reversal — and a circle cut at production feed is none of those. A retaining nut that has already backed off will carry on backing off, so a value that is right today is wrong next week, and the plot will look reassuring while the fault grows underneath it. And a screw free to float axially is loading its bearings in a way they were never designed for, which is how a half-hour repair turns into a bearing, a housing and possibly a screw. Compensation trims the small, stable residual of a correctly assembled drive. It is not a repair, and using it as one destroys the evidence that a repair is needed.",
          },
        ],
      },

      {
        id: "the-repair",
        question:
          "The cover is off. The bearing retaining nut at the fixed end is finger-slack and its locking feature is not engaged. How is the repair carried out?",
        options: [
          {
            id: "overtighten",
            verdict: "wrong",
            text: "Tighten the retaining nut as hard as it will go, so that it cannot possibly work loose again.",
            response:
              "The logic is intuitive — the nut came loose, so more tightness must mean more safety — and it is the commonest way a good repair becomes a new fault. On a preloaded bearing pair, that nut is not merely holding a part on: it sets how hard the bearings are pressed against one another, and that setting governs both the axial stiffness you want and the friction, heat and service life you have to live with. Over-tightening pushes the internal loading far past what the arrangement was designed for. The axis becomes stiffer to turn, the bearings run hot, the screw grows thermally and drags the axis out of position over the course of a shift, and bearing life collapses. Tightness here is a specified value, not a virtue. Follow the procedure and engage the specified locking feature.",
          },
          {
            id: "replace-bearings",
            verdict: "wasteful",
            text: "Replace the fixed-end bearing pair while the housing is open, since it has been running loose.",
            response:
              "Not an unreasonable instinct. A bearing that has been running with a slack clamp may have been carrying load in a way it was not designed for, and if inspection shows marking on the races, discoloration, roughness when it is turned by hand or anything that sounds wrong, then replacing it is the right call and doing it now saves a second strip-down. Replacing it as a reflex costs parts and downtime, and fitting a fresh preloaded pair introduces a new opportunity to get the preload wrong. Inspect first, decide on what you actually see, and record what you found either way.",
          },
          {
            id: "builder-procedure",
            verdict: "sound",
            text: "Have the maintenance technician reset the bearing preload and retention to the machine builder's documented procedure, machine isolated, and re-measure the lost motion at the table before the covers go back on.",
            response:
              "Right on both halves, and the second half is the one people skip. Preload on an angular contact pair is a designed value: it is what makes the screw axially stiff, and it is set by a specified tightening procedure with a specified locking arrangement, not by judgement or by feel. Only the builder's documentation, or the bearing manufacturer's, can tell you what that value and that procedure are for this machine. Re-measuring before the covers go on costs five minutes and can save a second strip-down: if the lost motion at the table has not collapsed to a small figure, something else is loose as well, and you want to discover that while the assembly is still open in front of you.",
          },
          {
            id: "realign-everything",
            verdict: "wasteful",
            text: "Strip and realign the whole X axis — rails, screw and bearing blocks — to the builder's alignment procedure while it is apart.",
            response:
              "A full realignment is exactly right when a drive train has been running misaligned, because a screw that is not concentric and parallel with the rails is pulled sideways on every stroke and eats its own nut and bearings for a living. It is also two or three days of skilled work. Here a single identified fastener explains the whole measured symptom, and the axis cut clean circles until one specific piece of maintenance disturbed one housing. Do the smallest repair the evidence supports, prove it, and escalate only if the proof fails. Hold on to the counter-case, though: if the re-measured lost motion does not collapse once the retention is reset, alignment becomes a serious candidate and this becomes the right answer.",
          },
        ],
      },

      {
        id: "prove-it",
        question:
          "The retention is reset to the builder's procedure and the covers are back on. How do you prove the fix, and what do you leave behind for the next person?",
        options: [
          {
            id: "cmm-a-part",
            verdict: "wasteful",
            text: "Run the next production job and inspect the first part on the coordinate measuring machine.",
            response:
              "This is the proof that matters commercially, and you should do it — after the machine tests rather than instead of them. On its own it is a poor diagnostic, because a production part carries the tool, the holder, the fixture, the program and the material all at once. If it comes out right you have learned that everything together is acceptable today. If it comes out wrong you have learned nothing about which of six things is responsible. Machine tests first, because they hold everything else still; the part last, as confirmation.",
          },
          {
            id: "feels-fine",
            verdict: "wrong",
            text: "Sign the machine off — the noise at reversal has gone and the operator says the circle feels smooth now.",
            response:
              "The pull here is honest, because the person who reported the fault is now satisfied and that is genuine evidence. It fails as proof for a plain reason: there is no number. You cannot show that the lost motion is smaller than it was, because you never wrote down what it became; you cannot show anybody else that the repair worked; and when the same symptom reappears in eight months the next person starts from nothing. A fingernail also has a floor. It finds a step of a few hundredths of a millimetre, so a fault reduced from `0.03 mm` to `0.01 mm` can feel entirely fixed while still showing on a ballbar and still growing. Measure it, write it down, and the machine has a history instead of a rumour.",
          },
          {
            id: "same-tests-same-order",
            verdict: "sound",
            text: "Repeat the same three tests in the same order — indicator lost-motion at the table, ballbar clockwise and anticlockwise, then the same test circle in the same material — and record the before and after values with the date, the machine temperature and who did the work.",
            response:
              "This is what closes a fault properly. Repeating the same tests in the same order is what makes before and after comparable; a different test, or the same test at a different feed rate, proves nothing about what you changed. Working outwards from the most direct measurement to the most representative one is what shows the fix worked for the reason you think it did: the indicator says the mechanism is tight, the ballbar says the machine draws a closed circle at speed in both directions, and the cut circle says the part is right, which is the only thing the customer ever sees. Recording the temperature matters because a machine measured cold and the same machine measured after four hours of production are, for measurement purposes, two different machines. And the record is what lets somebody in a year's time see that this axis has a history.",
          },
          {
            id: "full-survey",
            verdict: "wasteful",
            text: "Book a full laser positioning test and a volumetric survey of the machine.",
            response:
              "Thorough, and the right thing to do at a scheduled verification or after major structural work. For this repair it is half a day spent on a question you have already answered by cheaper means, and the fault never involved positioning along the travel. There is one honest argument for it: if the screw was floating, the existing screw error compensation table was measured against a drive train that is no longer in the same state, so its baseline is arguably suspect. That is a good reason to bring the next scheduled verification forward — not a reason to do it this afternoon while the machine is needed.",
          },
        ],
      },
    ],

    resolution:
      "The finding. The retaining nut on the fixed-end bearing pair of the X-axis ball screw was left slack when the motor and its bearing housing were refitted after the way-lubrication repair. Those bearings exist to stop the screw travelling along its own axis; with the clamp slack, the screw could shift axially by roughly `0.03 mm` — an illustrative figure — before it would push or pull the table. Every time X reversed, that float had to be taken up before the table moved at all, so the table stood still while the program said it was moving. On a circle, X reverses at three and nine o'clock, which is exactly where the step appeared in the bore and where the ballbar trace kinked.\n\nThe fix. With the machine isolated and locked off, the maintenance technician reset the bearing preload and retention to the machine builder's documented procedure, having first confirmed that the bearings themselves were undamaged. No compensation value was changed, because once the mechanism was right there was nothing left to compensate.\n\nThe proof. The same three tests, in the same order, before and after. The indicator lost-motion test at the table fell from about `0.03 mm` to a few microns. The ballbar, run clockwise and then anticlockwise, closed at the quadrants both ways round. The same test circle cut in the same material came out with no step a fingernail could find. All three results went into the machine's record with the date, the temperature and the name of the person who did the work, alongside the values measured before the repair.\n\nThe lesson underneath. Nothing was wrong with this machine's resolution: the control could still command steps of a micron and the readout reported the motor's position perfectly honestly throughout. Nothing was wrong with its repeatability either, in the sense that it produced the same error on every single circle. What was wrong was accuracy, in one very specific place — the feedback device sat on the motor, so the coupling, the screw, the bearings, the nut and the table were all invisible to it. That is what semi-closed loop means, and it is the whole reason a machine has to be measured at the table rather than believed at the screen. Level 13, accuracy, repeatability and resolution, sets that argument out in full.",
  },

  {
    id: "wall-taper",
    title: "A finished wall that comes out fat at the bottom",

    symptom:
      "I'm side-finishing the walls of a boss on a mild steel part — thirty millimetres deep, ten millimetre four-flute carbide cutter, about forty-five millimetres of it hanging out of the holder so it clears the clamps. At the top the wall measures bang on. At the bottom it's six hundredths fat, on every part, and both walls of the boss do the same thing: both fat at the bottom by roughly the same amount. It doesn't even look bad. The finish is fine, there's no chatter noise, nothing squeals. And I ran the same program on the other machine last week and got near enough the same numbers.",

    context: [
      "The machine is a three-axis vertical machining centre that was ballbar-checked last month with a plot the shop was happy with, and it is cutting its other jobs to size without complaint.",
      "The feature is a rectangular boss standing `30 mm` proud of the part, finished on all four sides with a single full-depth side-milling pass at a radial width of about `0.4 mm`. The cutter is a `10 mm` diameter four-flute solid carbide end mill in a collet chuck, projecting roughly `45 mm` from the holder face so that it clears the clamps.",
      "The wall is measured with a height gauge and an indicator at `5 mm`, `15 mm` and `25 mm` below the top face. The error grows smoothly with depth: near zero at the top, about `0.06 mm` of excess material left at the bottom.",
      "Nothing on the machine has been changed. The finishing pass used to be programmed as two axial steps of `15 mm` each; a new program written last month does it in one full-depth pass to save cycle time.",
      "Everything else on the part is right. Flat faces are on size and parallel, drilled holes are on position, and the same cutter finishes an aluminium part on another job without complaint.",
      "Every figure in this scenario is an illustrative teaching value chosen to make the reasoning visible. None of them is a specification, a cutting recommendation or a tolerance for any real cutter, material or machine.",
    ],

    steps: [
      {
        id: "characterise",
        question:
          "You have one measured part and a complaint. Before changing anything, what do you establish?",
        options: [
          {
            id: "measure-both-walls",
            verdict: "sound",
            text: "Measure both walls at several heights on three consecutive parts, and write the numbers down.",
            response:
              "This is the step that decides which half of the problem you are in, and it costs fifteen minutes at the bench with no machine time at all. Two facts come out of it. Does the error repeat from part to part? A repeatable error has a cause present on every cycle — geometry, deflection, a program or an offset — whereas a scattered one is telling you about something that changes, such as clamping, chips trapped under the part, or a tool creeping in its holder. And does the error have the same sign on opposite walls? That single question separates two whole families of cause, and you cannot answer it from one measurement on one wall. Here it repeats to within a few microns, and both walls are fat at the bottom.",
          },
          {
            id: "cmm-report",
            verdict: "wasteful",
            text: "Send the part out for a full coordinate measuring machine report.",
            response:
              "You would get a beautiful document and it would arrive after the shift. A CMM is the right instrument when you need a traceable record of many features at once, or when the geometry is too awkward to reach with hand instruments. Here you already know which feature is wrong and roughly by how much, you can reach it with an indicator, and what you actually need is a shape — how the error varies with depth — rather than a certificate. Keep the CMM for the sign-off, where it earns its keep.",
          },
          {
            id: "granite-square",
            verdict: "wasteful",
            text: "Set up a granite square and an indicator and check the spindle axis for squareness to the table.",
            response:
              "A completely legitimate machine check, and it is where you would end up if the part evidence pointed at geometry, because a spindle that is not perpendicular to the table does tilt walls. It costs an hour or two of machine time and it takes care to do meaningfully. The reason to hold it back is that the part is about to rule geometry out for nothing. A tilted spindle leans both walls of a boss the same way in space, so one wall comes out fat at the bottom and the opposite wall thin at the bottom. Measure the second wall before you lift a granite square onto the table.",
          },
          {
            id: "dial-in-offset",
            verdict: "wrong",
            text: "Add `0.06 mm` to the cutter's diameter compensation so that the bottom of the wall comes to size.",
            response:
              "It is quick, it is reversible, and on the shop floor it happens more often than anyone admits. Look at what it actually does, though. The wall is not the wrong size, it is the wrong shape: it is tapered. A diameter offset moves the whole wall in or out by the same amount at every depth, so setting the bottom right sets the top `0.06 mm` undersize instead. You have not removed the error, you have moved it — onto the part of the wall that was previously correct. The offset is also silently tied to this exact depth, this stick-out, this material and this feed; change any one of them and the next job is scrap for a reason nobody will remember. The evidence that would justify an offset is a wall that is the wrong size by the same amount at every height, which is a genuinely different symptom.",
          },
        ],
      },

      {
        id: "spring-pass",
        question:
          "The error repeats to within a few microns, and both walls of the boss are fat at the bottom. Something is either putting the tool in the wrong place or pushing it out of place. What is the cheapest test that tells you which?",
        options: [
          {
            id: "dry-run",
            verdict: "wasteful",
            text: "Dry-run the program above the part in single block and read every line, checking the tool number, the offsets and the work coordinate system.",
            response:
              "Five minutes, and it is a habit worth keeping, because it catches a stale offset, the wrong tool number, a mode left active from the last job, a mirrored coordinate system. None of those produce an error that grows smoothly with depth and comes out the same on both walls, though. Program faults produce steps, shifts and whole features in the wrong place, not a gentle taper. Reading the program is cheap enough that there is no harm in it; it simply is not the test that answers this question.",
          },
          {
            id: "run-a-spring-pass",
            verdict: "sound",
            text: "Run the finishing pass a second time with exactly the same offset — a spring pass, cutting only what the first pass left behind — and measure the wall again.",
            response:
              "Ten minutes of machine time, and it is decisive. Think about what each cause predicts. If the machine had put the tool in the wrong place, the second pass would take the tool along the same wrong path and remove nothing, so the wall would measure exactly as before. If something is bending under the cutting force, the second pass starts with far less material to remove, so the force is smaller, so the tool bends less and cuts closer to where it was told to go. Here the taper falls from about `0.06 mm` to about `0.02 mm`. That is not a positioning error: something in the loop from the cutting edge, through the part and the machine and back to the edge, is deflecting elastically under load. Note that the spring pass is also a standard practical remedy, not only a test.",
          },
          {
            id: "halve-the-speed",
            verdict: "wrong",
            text: "Halve the spindle speed to lower the cutting force.",
            response:
              "This feels gentler, and gentleness is the right instinct — but the arithmetic does not do what people expect. The force on each cutting edge is governed mainly by how thick a chip that edge takes, which is set by the feed per tooth, not by the spindle speed. Halve the speed and leave the feed rate alone and each tooth now takes twice the chip it did before: the force goes up, the tool pushes off further and the taper gets worse. Halve both together to keep the chip thickness the same and the forces are broadly unchanged, so you have simply doubled the cycle time. The evidence that would make a speed change the right move is chatter — a noise and a wavy witness pattern that appear and disappear with spindle speed — which is a dynamic problem and a different lesson. This wall is quiet, smooth and steadily tapered.",
          },
        ],
      },

      {
        id: "find-the-flexible-part",
        question:
          "Something is bending. The structural loop runs from the cutting edge through the workpiece, the fixture, the table, the machine structure, the spindle and the holder, and back to the edge. Which element is it, and how do you find out in one cut?",
        options: [
          {
            id: "new-cutter",
            verdict: "wrong",
            text: "Fit a new cutter, on the assumption that the edges are worn and pushing off.",
            response:
              "There is real physics behind the suspicion: a worn edge rubs as much as it cuts, the force rises, and a blunt cutter genuinely does deflect further. It fails as a first move because a new cutter of the same diameter at the same overhang has exactly the same stiffness, and stiffness is the dominant term here; the force difference between a fresh edge and a slightly worn one is a modest fraction of a force that would still be there with a perfect tool. You would spend a cutter and a setup to shave a little off the taper, then conclude wrongly that the problem was tooling condition. The evidence that would justify it is a visible wear land on the flank of the teeth under a loupe, a rising spindle load across the batch, or a taper that grows as the batch goes on. This taper is the same on part one and part three.",
          },
          {
            id: "try-aluminium",
            verdict: "wasteful",
            text: "Machine a test cut in aluminium with the same tool and the same pass, to see whether the taper changes.",
            response:
              "Not a silly idea. A softer material needs less force for the same chip, so the taper should shrink, and that would confirm the error is force-driven rather than geometric. The spring pass has effectively run that experiment for you already, though: it changed the force and the error changed with it. Cutting a second material costs a block of aluminium, a setup and half an hour to re-confirm something you know — and it still would not tell you which element in the loop is bending, which is the question actually in front of you.",
          },
          {
            id: "shorten-the-stickout",
            verdict: "sound",
            text: "Re-fit the cutter with the shortest stick-out that still reaches the bottom of the wall, cut one part, and measure the taper again.",
            response:
              "This is the cheapest and by far the most sensitive test available, because of how bending works. A cutter held in a holder behaves like a cantilever: for a given sideways force, the deflection at its tip grows with roughly the cube of how far it sticks out, and falls with roughly the fourth power of its diameter. That is an educational simplification — it treats the tool as a plain bar and ignores the flutes, the holder and the clamping — but the exponents are the useful part. Cube is brutal in your favour here: taking the stick-out from `45 mm` down to `35 mm` should cut the deflection to a little under half, and no other ten-minute change has anything like that leverage. Here the taper drops from about `0.06 mm` to about `0.02 mm`. The tool is the flexible element, which is the usual answer, because it is by a wide margin the most slender thing in the loop.",
          },
          {
            id: "check-the-fixture",
            verdict: "wasteful",
            text: "Clamp an indicator against the side of the workpiece and against the vice, and push the part by hand to see how far part and fixture move.",
            response:
              "This is the other half of the loop, and it is the right test the moment the tool is cleared — a part standing tall out of a vice, a thin wall, a fixture with a long unsupported reach or a clamp bearing in the wrong place will all deflect and produce exactly this kind of taper. It costs twenty minutes. It stays in second place only because the tool here is a `10 mm` bar hanging `45 mm` out of its holder, which is the most slender item in the loop by a long way, and because the stick-out test changes one thing and answers the question outright. Do this next if shortening the tool had made no difference.",
          },
        ],
      },

      {
        id: "the-fix",
        question: "The tool is the flexible element. What actually removes the taper?",
        options: [
          {
            id: "buy-tooling",
            verdict: "wasteful",
            text: "Order a cutter with a larger shank and a reduced neck, or a holder marketed for long-reach work.",
            response:
              "Tooling of this kind exists for precisely this problem, and the reasoning behind it is sound: bending stiffness rises steeply with diameter, so a thicker shank with only the cutting end reduced really is stiffer than a plain cutter of the same reach. If long-reach work is a regular part of this shop's business it is a sensible purchase — and check what the manufacturer's own data says it will do for your geometry rather than trusting a brochure. It is in second place today because it carries a cost and a lead time, while the pass can be re-planned this afternoon for nothing and may well solve the problem outright.",
          },
          {
            id: "tap-test",
            verdict: "wrong",
            text: "Do a tap test on the tool and spindle to find the natural frequencies, then choose a spindle speed from a stability chart.",
            response:
              "This is a genuinely valuable technique aimed at a genuinely different problem. A tap test, and the stability chart that comes out of it, deal with chatter: self-excited vibration, where the tool and the cut feed energy into one another until the machine sings. Chatter is dynamic. It produces a distinctive noise, a wavy witness pattern on the wall, and behaviour that changes sharply with spindle speed. What you have is static: a steady sideways force, a steady bend, a smooth taper and a quiet cut with an acceptable finish. Choosing a better speed does nothing at all to a steady force. The evidence that would send you to a tap test is the noise and the wavy finish — and if the wall had shown those, this would have been the right answer rather than the wrong one.",
          },
          {
            id: "cut-the-feed",
            verdict: "wasteful",
            text: "Reduce the feed per tooth so that each edge takes a thinner chip.",
            response:
              "This does reduce the cutting force and it will reduce the taper, so it is a real lever rather than a wrong turn. Two things keep it out of first place. It costs cycle time across the whole pass rather than only where the tool is weak. And pushed too far it reverses on you: below a certain chip thickness the edge stops cutting cleanly and begins to rub, which drives the force back up, wears the tool and can spoil the finish. Use it to trim the result after the geometry of the pass is right, not as the main remedy for what is a stiffness problem.",
          },
          {
            id: "replan-the-pass",
            verdict: "sound",
            text: "Re-plan the pass: keep the stick-out at the minimum that clears the work, take the wall in two or three axial steps instead of one full-depth pass, reduce the finishing radial width, and end with a spring pass.",
            response:
              "Every part of this attacks the same equation from a different side, and none of it costs a penny. The shortest workable stick-out attacks the term that matters most, because length enters the deflection as a cube. Taking the depth in steps means less of the cutter is engaged at once, so there is less force and it acts nearer the holder where the tool is stiff. A lighter radial width reduces the force directly. The spring pass mops up what is left, because a second cut starts with less material and therefore deflects less. Be honest about what it costs: cycle time. The previous programmer removed the axial steps to save exactly that, which is why this fault appeared last month rather than last year — a legitimate trade that was made without measuring what it cost in accuracy.",
          },
        ],
      },

      {
        id: "prove-and-record",
        question:
          "The re-planned pass brings both walls inside tolerance at every height. What closes the job?",
        options: [
          {
            id: "ballbar-anyway",
            verdict: "wasteful",
            text: "Put the ballbar on the machine to confirm that it was never the machine's fault.",
            response:
              "There is a nagging urge to prove the negative, and the ballbar is the instrument that would do it. The part has already proved it three times over, and more directly. The error mirrored on opposite walls, which a geometric error cannot do. A second machine produced the same result, and two machines do not share a geometric error. And the error changed when the cutting force changed, which a geometric error also cannot do. An hour of machine time to re-prove that is an hour not cutting. Run the ballbar on its own schedule, so that it stays a baseline rather than a reaction.",
          },
          {
            id: "measure-and-write-it-down",
            verdict: "sound",
            text: "Measure both walls at the same three heights on the first three parts of the new pass, record the before and after numbers, and write the reason for the axial steps into the setup sheet next to the cycle time they cost.",
            response:
              "The measuring half is obvious; the writing half decides whether the fault comes back. Somebody will open this program in six months, see a finishing pass split into three axial steps, and see an obvious minute to save — which is precisely what happened last month. A note saying that a single full-depth pass leaves about `0.06 mm` of taper at the bottom of the wall with this tool at this reach turns a mysterious inefficiency into a documented engineering decision, and lets the next programmer improve it deliberately, by buying a stiffer cutter for instance, instead of by accident.",
          },
          {
            id: "keep-the-offset",
            verdict: "wrong",
            text: "Leave the diameter compensation offset in as well, as belt and braces.",
            response:
              "It sounds like prudence — two corrections must be safer than one — and it is how machines acquire the layers of mysterious adjustment that make them impossible to work on. The offset was compensating for a taper that no longer exists, so with the pass corrected it now pushes the whole wall undersize by the amount it used to hide. Worse, it is invisible: it lives in an offset table, it carries no note, and the next person finds a wall that is uniformly small and starts hunting a machine fault. When you fix a cause, remove the corrections you put in for the symptom — and write down that you removed them.",
          },
        ],
      },
    ],

    resolution:
      "The finding. Nothing was wrong with the machine. The cutter — a `10 mm` bar hanging about `45 mm` out of its holder — was being pushed sideways by the cutting force, and the further from the holder, the more it bent. Because the deflection of a cantilever grows with roughly the cube of its overhang, a tool barely deflected near the top of the cut is deflected several times as much at the bottom, so it leaves material behind and the wall comes out fat at the bottom. The change that triggered it was a program edit: the finishing pass was re-written from two axial steps into one full-depth pass to save cycle time, which put the whole `30 mm` of engagement onto the tool at once.\n\nThe fix. The pass was re-planned. The stick-out was shortened to the minimum that clears the clamps, the wall was taken in two axial steps, the finishing radial width was reduced and a spring pass was added. Cycle time went up, and that trade was written into the setup sheet together with the reason for it.\n\nThe proof. Both walls measured at three heights on the first three parts of the new pass, compared against the same three heights recorded before the change: the taper fell from roughly `0.06 mm` to a few microns. The diameter compensation offset that had been tried early on was removed, and its removal recorded, so that nothing is left correcting an error that no longer exists.\n\nThe lesson underneath. The structural loop runs from the cutting edge, through the workpiece, the fixture, the table, the machine's structure, the spindle and the holder, and back to the edge — and the whole loop is only as stiff as its weakest element. On a well-built machine cutting a small part, that element is almost always the tool. Level 4, mechanical machine design, makes the general argument: length enters bending deflection as a cube while material properties enter only in proportion, which is why an overhang is the first thing to look at and the last thing to accept. The two clues that pointed away from the machine were free ones. The error mirrored on opposite walls, and it changed when the cutting force changed — and a geometric error can do neither.",
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}
