# Roadmap

What exists, what does not, and what comes next. The point of this file is that
nothing on the site pretends: the learning path shows all twenty levels with
their full topic lists whether or not their lessons are written, the simulator
page says plainly that it is not built, and the concept report names the stages a
learner left undecided instead of quietly filling them in.

Two vocabularies overlap in this repo and it is worth separating them once:

- **Build phases** — `SPEC.md` section 13, Phase 0 to Phase 10. These are
  engineering milestones: scaffold, content model, app shell, lesson renderer,
  the seven lessons, glossary, explorer, calculators, troubleshooting, project,
  and finally progress plus documentation.
- **Roadmap phases** — `SPEC.md` section 16, the seven items of work *beyond*
  the Phase 1 content scope. The G-code simulator is roadmap item 1, which is why
  the nav calls it "in development" rather than broken.

---

## 1. What Phase 1 actually shipped

| Area | Shipped |
|---|---|
| Curriculum | All 20 levels, each with a summary, tier, prerequisites and a full topic list. 5 levels carry lessons; 15 are marked `planned` |
| Lessons | 7 complete lessons, roughly two and a half hours of reading, each with all eleven pedagogical sections |
| Figures | 6 hand-authored SVG figures, all referenced from lessons |
| Glossary | 118 terms with plain and technical definitions, aliases, tags, cross-references, search and tag filters, auto-linked on first occurrence in lesson prose |
| Machine explorer | All 24 components with complete six-section panels, keyboard-reachable hotspots, system filters |
| Calculators | Machining and axis-sizing, both with formula, variables, units, worked example, meaning and estimate note; one Recharts motion profile |
| Troubleshooting | 2 fully playable scenarios, every option graded and answered, results persisted |
| Design project | 20 stages against one fictional brief; stages 1–10 with full decision data; a printable concept report assembled from actual choices |
| Progress | `LocalProgressStore` behind the `ProgressStore` interface, the axis-scale readout, and `/progress` with completion, quiz history, scenario results, saved decisions and reset |
| G-code simulator | Roadmap item 1, built: parser, interpreter, 19 lint rules, 7 sample programs, and no route to hardware |

`npm run check:content` prints the current tallies for all of the above. Trust it
over this table.

---

## 2. The thirteen-versus-fifteen levels

`SPEC.md` section 16 item 2 lists "remaining 13 levels of lesson content". That
figure does not reconcile with section 7, which marks five levels — 1, 2, 4, 13
and 20 — as shipping Phase 1 lessons. The seven Phase 1 lessons sit *inside*
those five levels, so the number of levels still to be written is fifteen, not
thirteen. `curriculum.ts` is the authoritative version: five `published`, fifteen
`planned`, and every surface on the site derives its counts from the data rather
than repeating the spec's arithmetic.

### The fifteen levels still to be written

Each already has its summary, tier, prerequisites and full topic list in
`src/content/curriculum.ts`, and each appears on `/learn` marked "on the
roadmap". Writing one means writing its lessons and following the five registry
steps in `authoring-content.md`.

**Foundations**

- **Level 3 — Cutting and machining fundamentals.** Chip formation, cutting
  forces, heat, tool wear and materials. The most-missed level, because Levels 5,
  6 and 15 all lean on it.

**Mechanical design**

- **Level 5 — Linear motion and axis design.** Rails, screws, preload, critical
  speed, buckling, drive comparison. Pays off the axis-sizing calculator directly.
- **Level 6 — Spindle systems.** Types, torque and power curves, bearings, tool
  interfaces, thermal growth.
- **Level 11 — Pneumatics, hydraulics and auxiliary systems.** Architecture and
  principle only, per content rule 6.
- **Level 12 — Tool changing and workholding.** Magazines, chip-to-chip time,
  locating principles, clamping force against cutting force.

**Drives and control**

- **Level 7 — Motors, servos and motion control.** Loop structure, encoders,
  inertia matching, sizing workflow.
- **Level 8 — Electrical machine design.** Architecture and principle only, and
  explicit about the work belonging to qualified personnel.
- **Level 9 — CNC control and software.** Interpreter, interpolator, look-ahead,
  compensation tables, probing.
- **Level 10 — G-code and programming.** The level the homepage hero program is
  written against: every line in that strip is a line this level explains. It is
  the natural companion to the simulator, and the two should probably be built
  together.

**Proving and building**

- **Level 14 — Thermal behaviour.** Heat sources, drift of the structural loop,
  compensation, warm-up cycles.
- **Level 15 — Vibration and machine dynamics.** Chatter from first principles,
  stability lobes, tap testing, dynamic stiffness.
- **Level 16 — Machine safety and compliance.** Risk assessment as a process, the
  hierarchy of risk reduction, and the standards by purpose and scope only.
- **Level 17 — Manufacturing and assembly.** Stress relief before machining,
  datum strategy, scraping, tolerance stack-up.
- **Level 18 — Commissioning and validation.** First power-up, homing, servo
  tuning, geometric measurement, acceptance tests.
- **Level 19 — Maintenance and troubleshooting.** Structured fault-finding, which
  is the level the troubleshooting scenarios are waiting for.

---

## 3. Project stages 11–20

All twenty stages exist and none is empty. Stages 1–10 carry complete decision
data: a question, three or four genuinely defensible options, and for each option
its benefits, drawbacks, cost, performance, safety and maintenance implications
plus an argument about this specific brief.

Stages 11–19 carry the brief, the inputs they need from earlier stages, the
trade-offs in play and a five-question self-check, but no options to choose
between yet. They are, in order:

| Stage | Id | Still needs |
|---|---|---|
| 11 | `electrical` | Decision data: cabinet position, cooling approach, cable management |
| 12 | `control-architecture` | Decision data: controller family, and where the position loop closes |
| 13 | `auxiliary-systems` | Decision data: lubrication approach, coolant strategy, chip handling |
| 14 | `safety-concept` | Decision data framed so that it never reads as a substitute for a risk assessment |
| 15 | `manufacturing-and-assembly` | Decision data: make-or-buy, machining sequence, adjustment provision |
| 16 | `alignment-strategy` | Decision data: how much adjustment, and what targets the shop can actually measure |
| 17 | `validation-plan` | Decision data: test order and acceptance criteria |
| 18 | `maintenance-plan` | Decision data: intervals, spares policy, who does the work |
| 19 | `risks-and-trade-offs` | Decision data, or possibly a different interaction — a register is a list, not a choice |

Stage 20, `final-concept-report`, deliberately has no decision. It assembles the
choices already made and names every gap, which is exactly what it should do
whether nine stages are missing decisions or none are.

Two cautions for whoever writes stages 11–14. First, every option must be
genuinely defensible; the check rejects an option with fewer than two drawbacks
because a straw man teaches nothing. Second, stages 11, 12 and 14 sit on ground
where the honest answer is "qualified personnel do this work" — the decision data
must teach how to *specify* and *brief*, never how to implement.

---

## 4. Beyond Phase 1 — `SPEC.md` section 16

### 1. G-code simulator

Parser, toolpath rendering, coordinate readout, active-line highlight,
per-command explanation, beginner-mistake detection. **Built.** The engine is
`src/lib/gcode/`, pure functions over data with `simulate()` as the single entry
point; `npm run check:gcode` holds it to a hundred hand-computed assertions.

**The non-negotiable constraint: browser only. It must never be capable of
driving hardware** — no serial output, no network output, no route by which a
program could reach a control. That is a safety rule, not a scoping decision, and
it does not relax in a later version. A program that simulates correctly can
still be wrong on a machine, because the simulator knows nothing about the
fixture, the clamps, the tool lengths, the offsets or what is on the table.
Proving out a program is a skilled, hazardous operation done on the machine by
competent people using its own verification features.

Build notes for whoever picks this up: the homepage hero
(`components/home/gcode-program.ts`) already models a real sixteen-line program
as data — position, modal state and a plain-language explanation per line — but
it is *pre-computed*, not parsed. That module is a useful specification of the
output shape a real parser has to produce, and a useful fixture to test one
against. Level 10 should be written alongside it.

### 2. The remaining lesson content

Fifteen levels, listed in section 2 above.

### 3. Interactive torque and power curves, and closed-loop animations

For Level 6 and Level 7 respectively. Recharts is already a dependency and
`SPEC.md` section 9.3 restricts it to genuine engineering graphs, which these are.

### 4. Drag-and-drop component identification

An assessment built on the existing 24 explorer components. Needs a keyboard
equivalent from the start, not bolted on: the quality floor requires it.

### 5. Accounts and cloud sync

Implement `SupabaseProgressStore` against the existing `ProgressStore` interface.
No component changes are required — `ProgressProvider` takes a `store` prop.
`docs/architecture.md` section 5 lists exactly what such a store must honour,
including the `updatedAt` reconciliation rule that multi-device sync forces you to
choose deliberately.

### 6. Content localisation

The block model is already language-agnostic, so a locale is a different content
registry rather than a fork of the renderer. The work is in the registries and the
route structure, not in the components. Note that the auto-linker's word
boundaries are hand-written for English orthography and would need revisiting.

### 7. Printable lesson and project exports

The concept report already prints: `components/project/ConceptReport.tsx` carries
the `@media print` rules, and the project's teaching furniture is marked
`no-print` so it drops out of the printed document. Lessons would need the same
treatment, and the two should share one print stylesheet rather than growing a
second copy.

---

## 5. Known gaps and things to watch

- **`CLAUDE.md` carries the current phase number.** Update it when a phase lands,
  or the next developer starts from a stale picture.
- **Level 19 and the scenarios are waiting for each other.** The troubleshooting
  scenarios teach structured fault-finding; Level 19 is where that method should
  be taught explicitly. Whoever writes Level 19 should link the scenarios from it.
- **The glossary is far past its floor** (118 terms against a required 40), which
  makes the auto-linker's first-occurrence rule load-bearing. If prose starts
  looking peppered with links, tighten `skipSlugs` in the lesson rather than
  weakening the rule.
- **Nothing enforces prose quality.** The content check enforces structure and
  cross-references. Whether a beginner recognises their own confusion in a lesson
  is still a human judgement, and it is the one that decides whether any of this
  works.
