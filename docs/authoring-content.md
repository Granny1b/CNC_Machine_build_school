# Authoring content

Everything a learner reads on this site is typed data under `src/content`. This
is the working guide to adding to it: the real files, the real export names, the
real registry edits, and the checks that will catch you if you miss one.

`SPEC.md` section 14 is the short version. This is the version you can work from.

Before writing anything, read the checklist in section 1. It is not a style
guide — breaking one of those rules is a defect.

---

## 1. The rules you must not break

From `SPEC.md` section 2. Every one of these outranks convenience, aesthetics and
delivery speed.

- [ ] **No fabricated standard requirements.** ISO 230, ISO 10791, ISO 16090-1,
      ISO 12100, ISO 13849-1 and IEC 60204-1 may be described by *purpose and
      scope only*. Never state a numeric limit, tolerance class or clause
      requirement as though quoting it. Always send the reader to the published
      standard for the actual requirements.
- [ ] **No copyrighted standard text.** Paraphrase intent. Never reproduce.
- [ ] **Every simplification is labelled.** Any calculator, rule of thumb or
      estimate carries a visible note that it is educational and does not replace
      manufacturer calculations or professional engineering validation.
- [ ] **No unsupported performance claims.** No invented accuracy figures. An
      illustrative number is framed as an order of magnitude and said to be one.
- [ ] **SI units by default.** Where a shop unit is genuinely conventional
      (rev/min, m/min, mm/min), show it *and* state the SI relationship.
- [ ] **No unsafe electrical, hydraulic or pneumatic instructions.** Architecture
      and principle only, plus a plain statement that the work must be carried out
      and verified by qualified personnel under applicable law and standards.
- [ ] **The design project is a concept exercise.** Never imply a beginner should
      build and operate an industrial machine without professional engineering
      review.
- [ ] **Wrong answers teach.** A quiz option never says only "incorrect". It
      explains why *that* answer was tempting, where the reasoning breaks, and
      points back at the concept.

Two conventions that carry those rules into the prose:

**Measured values go between backticks.** Write ``a travel of `500 mm` `` and the
renderers set `500 mm` in mono tabular figures. This is why no author writes
markup, why numbers never end up in body face, and why the auto-linker never
turns a G-code word into a glossary link.

**Define a term where it first appears.** Plain language first, correct
terminology second, in that order, every time.

---

## 2. Add a lesson

Five steps, all of them mechanical, and the content check will name any you skip.

**1. Create the file.** `src/content/lessons/<slug>.ts`, exporting a `Lesson`
named as the camelCase of the slug:

```ts
// src/content/lessons/how-a-spindle-makes-torque.ts
import type { Lesson } from "../types";

export const howASpindleMakesTorque: Lesson = {
  slug: "how-a-spindle-makes-torque",
  level: 6,
  title: "How a spindle makes torque",
  intro: "…a plain-language promise of what the reader will be able to do.",
  minutes: 22,
  objectives: [/* 3 or more */],
  terms: [/* 4 or more { term, plain } */],
  blocks: [/* 10 or more, see below */],
  knowledgeCheck: [/* 3 or more questions */],
  exercise: { title: "", body: "", steps: [/* 3+ */], selfCheck: [/* 3+ */] },
  summary: [/* 3 or more */],
  nextSlug: "the-next-lesson-slug",
};
```

**2. Register it** in `src/content/lessons/index.ts` — add the import and put the
lesson in the `lessons` array. **Array order is teaching order**, and the content
check asserts it matches `teachingOrder` in `curriculum.ts` exactly.

**3. Add the slug** to the owning level's `lessonSlugs` in
`src/content/curriculum.ts`, and to the `teachingOrder` array in the same file.

**4. Set `nextSlug`** on the lesson that now precedes it, and on your new lesson
unless it is last. Only the last lesson in the registry may omit it.

**5. Flip the level's `status`** to `"published"` if it was `"planned"`. The check
enforces this both ways: a level with lessons must be published, a level without
them must be planned.

### What the lesson must contain

`SPEC.md` section 7 requires eleven pedagogical sections, and
`scripts/check-content.ts` enforces the floor for each:

| Field | Floor enforced |
|---|---|
| `intro` | non-empty |
| `objectives` | 3 or more |
| `terms` | 4 or more, each with `term` and `plain` |
| `blocks` | 10 or more, and must include at least one each of `heading`, `prose`, `figure`, `example`, `deeper`, `mistakes`, `note`, `compare`, `formula` |
| `knowledgeCheck` | 3 or more questions; each with 3+ options, exactly one correct, `teaching` text, and per-option `feedback` of 40+ characters that is not a generic verdict |
| `exercise` | title, body, 3+ `steps`, 3+ `selfCheck` points |
| `summary` | 3 or more lines |
| `nextSlug` | resolves to a registered lesson, and is not itself |

The block kinds are the union in `src/content/types.ts`. `safety` and `widget`
are optional; use `safety` whenever the subject has a real hazard, and `widget`
to embed `machining-calculator`, `axis-sizing` or `explorer-teaser` in the
reading.

`compare` rows must have exactly as many `cells` as the block has `columns`.
`formula` needs an expression, at least one variable with symbol, meaning *and*
unit, and a `meaning` line saying what the number tells you to do differently.

### If you need a figure that does not exist

Figures are hand-authored SVG, registered by id:

1. Add the id to the `FigureId` union in `src/content/types.ts`.
2. Draw it in `src/components/learning/figures/<Name>Figure.tsx`. Prop-free: a
   block names a figure, and the figure knows how to draw itself.
3. Register it in `src/components/learning/figures/index.tsx`, which is typed
   `Record<FigureId, ComponentType>` — so step 1 without step 3 is a compile
   error, not a blank space.

Follow the drawing vernacular of `SPEC.md` section 5.5: 1px hairlines in `rule`,
dividers in `rule-strong`, dimension lines with extension lines and arrowheads,
leader lines with a filled dot at the feature end, the graph wash never above 6%
opacity, and balloon callouts numbered in mono against an adjacent parts list.
Use `currentColor` wherever a stroke should theme with its container.

---

## 3. Add a glossary term

Append a `GlossaryTerm` to the `glossary` array in `src/content/glossary.ts`:

```ts
{
  slug: "critical-speed",              // kebab-case, unique
  term: "Critical speed",
  aliases: ["critical speeds"],        // plurals and compound spellings
  plain: "…what it is, in words a beginner already knows.",
  technical: "…the same idea stated properly, for someone who needs precision.",
  example: "…optional, but a concrete case is worth a paragraph of definition.",
  related: ["ball-screw", "resonance"],   // must be existing slugs
  lessons: ["how-a-ball-screw-moves-an-axis"], // must be registered slugs
  tags: ["motion"],                    // from the GlossaryTag union
}
```

Things the check will reject: a slug that is not kebab-case, `plain` identical to
`technical`, an empty tag list, a `related` slug that does not exist, a `lessons`
slug that is not registered, and any surface form (term or alias) claimed by two
entries — because that would make auto-linking arbitrary.

**Aliases matter more than they look.** Auto-linking matches surface forms, so
`aliases` is how "ballscrew", "ball screws" and "ball-screw" all reach the same
entry. Nothing else needs doing: `glossaryAutolinkTerms` and `glossaryIndex` are
derived from the array at module load, and the tag filters on `/glossary` come
from `GLOSSARY_TAGS` and `GLOSSARY_TAG_LABELS` in the same file.

---

## 4. Add a calculator

Four steps, in this order, because each one depends on the last.

**1. Put the maths in `src/lib/` as pure functions.** No React, no formatting, no
component imports. Existing examples: `lib/machining.ts` and `lib/axis-sizing.ts`.
Export the notes and the worked example alongside the functions
(`MACHINING_FORMULA`, `MACHINING_WORKED_EXAMPLE`, `MACHINING_SI_NOTE`,
`MACHINING_ESTIMATE_NOTE`, `AXIS_EXCLUSIONS`, and so on) so the caveats travel
with the maths rather than depending on a component remembering them.

**2. Build the component** in `src/components/calculators/`. It needs
`"use client"`, and it must accept `compact?: boolean` if it is to be embeddable
in a lesson. Use `Field`, `SelectField` and `Readout` from `components/ui/Field`
so every calculator on the site reads the same way.

**3. Show all five things `SPEC.md` section 9 requires**: the formula as it
appears on a shop reference card, every variable with its unit, a worked example,
what the number means in practice, and the educational-estimate note — the last
of these visible without scrolling.

**4. Register a `WidgetId`** in `src/content/types.ts` and handle it in
`src/components/learning/blocks/WidgetBlock.tsx`. That switch ends in a `never`
assignment, so a new id without a case is a compile error. Then a lesson can
embed the tool with `{ kind: "widget", widget: "your-id" }`, and add it to
`src/app/calculators/page.tsx` if it deserves top billing.

**Guard rails, not blocks.** Warnings explain the physical consequence of an
input and never prevent the learner entering it. Somebody exploring what happens
when radial engagement exceeds tool diameter is learning; a disabled field
teaches nothing.

---

## 5. Add a machine component

Append a `MachineComponent` to `src/content/machine-components.ts`. All six panel
sections are mandatory, and each has a floor:

```ts
{
  id: "way-covers",
  name: "Way covers",
  system: "structure",            // structure | motion | spindle | control | auxiliary | safety
  hotspot: { x: 44.5, y: 61 },    // % of the illustration's viewBox
  plain: "…the simple explanation.",
  engineering: "…the engineering explanation.",
  parameters: [/* 3 or more { label, value } */],
  failureModes: [/* 3 or more */],
  lessons: ["intro-to-machine-architecture"],   // registered slugs
  glossary: ["guideway"],                       // existing slugs
}
```

Measure `hotspot` percentages against the viewBox of the drawing in
`src/components/explorer/MachineDrawing.tsx`. The check rejects coordinates
outside 0–100 and any pair of hotspots closer than 2.5% apart, because
overlapping hotspots are unclickable however good the data is.

Parameter *values* are qualitative ranges or illustrative orders of magnitude,
never specifications — `PARAMETER_NOTE` is shown above every parameter list to
say so. If the real-world work on this component is electrical, hydraulic,
pneumatic or safety-related, add its id to `QUALIFIED_WORK_IDS` in the same file
so the panel carries `QUALIFIED_WORK_NOTE`.

---

## 6. Add a troubleshooting scenario

Append a `Scenario` to `src/content/scenarios.ts`. The grading is the whole point
and it is deliberately not right-versus-wrong:

| Verdict | Meaning |
|---|---|
| `sound` | The cheapest decisive step available with the evidence in hand |
| `wasteful` | A legitimate test that costs more than the situation needs; the response says what it would have told you and when it *would* have been right |
| `wrong` | A step that misleads, hides the fault, destroys evidence or creates a second fault; the response says why it is tempting and what evidence would have justified it |

Requirements: a `symptom` written in the operator's own words rather than as a
diagnosis, a `context` array, three or more `steps`, at least two options per
step, and a `response` on **every** option of 40 characters or more — including
the good ones, because in a workshop you never get to see the path you did not
take. A step whose options all share one verdict is reported as a note: the cost
distinction is the lesson.

Every figure in a scenario is an illustrative teaching value. Say so in the
`context`, as the existing scenarios do.

Results persist automatically: `ScenarioPlayer` calls `recordScenario(id, …)`, and
`/progress` resolves the id back to a title through `getScenario`.

---

## 7. Add or complete a project stage

`src/content/project.ts` holds `projectBrief`, the twenty `projectStages` and
`getProjectStage`. The stage numbers must run 1–20 with no gaps, ids must be
unique, and no stage may be empty (the check enforces a minimum brief length).

**Brief format.** Paragraphs are separated by `\n\n`. The paragraph beginning
`Self-check` is a marker: `DesignProject` splits the brief there and renders
everything after it as a numbered self-check list. Keep that word at the start of
that paragraph or the split silently stops working.

**Adding decision data to a stage** — this is what stages 11–20 still need:

```ts
decision: {
  question: "…the question this stage actually answers.",
  options: [
    {
      id: "welded-steel",
      name: "Welded steel structure",
      recommended: true,          // at most one option per stage
      benefits: [/* 2 or more */],
      drawbacks: [/* 2 or more — a straw man has no drawbacks */],
      cost: "…", performance: "…", safety: "…", maintenance: "…",
      fitForBrief: "…why it suits THIS brief, or does not.",
    },
    /* at least one more genuinely defensible option */
  ],
}
```

Every option needs all six implication fields (`cost`, `performance`, `safety`,
`maintenance`, plus `benefits` and `drawbacks`) and a `fitForBrief` argued from a
specific sentence of `projectBrief` — not from what would be impressive. If an
option has no drawbacks it is not an option, it is a straw man, and the check
will reject it.

A stage may legitimately have no `decision` (stages 11–20 today), but stages 1–10
must carry one. Decisions persist through `setProjectDecision(stageId, optionId)`
and are read back by `ConceptReport` and by `/progress`, both of which name
undecided stages as gaps rather than filling them in.

---

## 8. Before you commit

```bash
npm run typecheck      # tsc --noEmit — shape
npm run check:content  # cross-references, depth, no placeholder text — content
npm run build          # must pass before any phase is considered done
npm run verify         # all three, in that order
```

`check:content` prints a summary (levels, lessons, blocks, quiz questions,
glossary terms, explorer parts, scenarios, project stages) and then either a list
of problems or "All content checks passed". Read the summary even when it passes:
a count that moved when you did not expect it to is usually a registry edit
landing in the wrong array.

Two things the tooling cannot check for you, so check them yourself:

- Does every technical word get defined where it first appears?
- Would a complete beginner recognise their own confusion in what you wrote, and
  find it answered?
