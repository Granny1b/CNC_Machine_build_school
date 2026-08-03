# CNC Academy

An interactive course that takes a complete beginner from "what is CNC?" to
designing a custom CNC milling machine.

Twenty levels across four tiers, a machine explorer with every major component
annotated, two working engineering calculators, playable fault-finding scenarios,
and a twenty-stage design project that ends in a printable concept report built
from your own decisions.

**Who it is for.** Complete beginners; technical students; new mechanical and
automation engineering students; hobbyist machine builders; junior employees
entering the machine-tool industry. It assumes no prior knowledge of machining,
mechanical engineering, electrical systems, servos, machine control, engineering
drawings or machine safety. Plain language first, correct terminology second,
always in that order, and every technical word defined where it first appears.

---

## Commands

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # must pass before any phase is considered done
npm run typecheck      # tsc --noEmit, must be clean
npm run check:content  # content integrity: cross-references, depth, no placeholders
npm run check:gcode    # G-code engine: hand-computed arcs, units, diagnostics
npm run verify         # typecheck + check:content + check:gcode + build
npm run sweep          # drives a real browser; needs the site already running
```

`npm run check:content` is the machine-readable half of the definition of done.
It proves what the type system cannot: that every lesson has all eleven
pedagogical sections, that every quiz option carries specific feedback rather
than a generic "incorrect", that every cross-reference resolves, and that no
placeholder text exists anywhere in `src`.

`npm run sweep` is the other half — the SPEC section 15 items that only exist
once the CSS has been applied. It drives Chromium over every route and checks
layout at 360 / 768 / 1280, colour contrast against the computed background,
heading order, accessible names, a visible focus ring on every keyboard stop,
and that the hero holds still under `prefers-reduced-motion`. It needs a
running server and takes its address from `BASE`:

```bash
npm run build && npm start &
BASE=http://localhost:3000 npm run sweep
```

Both checks exit non-zero on failure, so either can gate a release.

### Static export

Every route is prerendered, so the site can also be built as plain files:

```bash
STATIC_EXPORT=true PAGES_BASE_PATH=/CNC_Machine_build_school npm run build
```

That writes `out/`, which is what `.github/workflows/pages.yml` publishes to
GitHub Pages on every push. `PAGES_BASE_PATH` compiles in the `/<repo>/` prefix a
Pages project site is served from; leave it unset to export for a domain root.
The export is only possible because there are no route handlers, no server
actions and no request-time data — if that ever changes, this build is where it
will show up first.

---

## Routes

| Route | What it is |
|---|---|
| `/` | Hero: a real G-code program running against its own toolpath and a live readout. Roadmap preview, featured tools, your position, project preview |
| `/learn` | The full learning path — all twenty levels, grouped by tier, with prerequisites and topic lists |
| `/learn/[slug]` | A lesson |
| `/explorer` | The machine explorer: an interactive cutaway of a vertical machining centre, 24 components |
| `/calculators` | Machining and axis-sizing calculators |
| `/troubleshooting` | Fault-finding scenarios, graded by what each step costs you |
| `/simulator` | The G-code simulator: load or write a program, step through it, and read what each block does and what is wrong with it |
| `/glossary` | Every term the course uses, searchable and tag-filtered |
| `/project` | Design your CNC: twenty stages and a printable concept report |
| `/progress` | Completion, quiz history, scenario results, saved decisions, reset |
| `/resources` | The standards a machine builder meets, described by purpose and scope only, and the sources a designer actually works from |

`/troubleshooting` and `/resources` are additions to the route map in `SPEC.md`
section 8; both are explained in `docs/architecture.md` section 8.

---

## Where the content lives

Everything a learner reads is typed data under `src/content`, never JSX. The
renderer decides appearance; the author decides meaning.

```
src/content/
├── types.ts               # the content contract — every interface
├── curriculum.ts          # all 20 levels, TIER_ORDER, teachingOrder, TOTAL_LEVELS
├── lessons/
│   ├── index.ts           # the registry: `lessons`, getLesson, lessonsForLevel, …
│   └── <slug>.ts          # one file per lesson
├── glossary.ts            # terms, aliases, tags, and the auto-link index
├── machine-components.ts  # the 24 explorer components
├── scenarios.ts           # troubleshooting scenarios
└── project.ts             # the brief and the 20 project stages
```

Pure logic lives in `src/lib` (`progress`, `autolink`, `format`, `machining`,
`axis-sizing`); components in `src/components`; routes in `src/app`. Two rules:
no page component exceeds about 150 lines, and content never lives in a component
file.

---

## Adding a lesson, in five lines

1. Create `src/content/lessons/<slug>.ts` exporting a `Lesson` (camelCase of the
   slug).
2. Register it in `src/content/lessons/index.ts` — array order is teaching order.
3. Add the slug to the owning level's `lessonSlugs` **and** to `teachingOrder` in
   `src/content/curriculum.ts`.
4. Set `nextSlug` on the preceding lesson.
5. Flip the level's `status` to `"published"` if it was `"planned"`.

Then run `npm run check:content`, which will name anything you missed. The full
guide — including glossary terms, calculators, explorer components, scenarios,
project stages and figures — is in `docs/authoring-content.md`.

---

## Status

The Phase 1 **content scope** of `SPEC.md` section 7 is what ships: seven complete
lessons across five of the twenty levels, with the remaining fifteen levels
present on the learning path as planned, topic lists and all. The **build phases**
of `SPEC.md` section 13 — scaffold, content model, app shell, lesson renderer, the
seven lessons, glossary and auto-linking, explorer, calculators, troubleshooting,
design project, and finally progress plus documentation — are implemented.

Shipped: 20 levels, 7 lessons, 118 glossary terms, 24 explorer components, 2
calculators, 2 troubleshooting scenarios, 20 project stages (10 carrying full
decision data), local progress tracking behind a store interface that a cloud
adapter can replace without touching a component, and the G-code simulator —
the first item of `SPEC.md` section 16.

Not built: the lessons for fifteen levels, declared as such on the site itself. `CLAUDE.md` holds the current phase pointer;
`docs/roadmap.md` holds the detail, level by level and stage by stage.

---

## Stack

Next.js 14 (App Router) · TypeScript `strict` · Tailwind CSS 3.4 with tokens in
`tailwind.config.ts` · hand-authored inline SVG for every technical diagram ·
Recharts for genuine engineering graphs only · `localStorage` behind a
`ProgressStore` interface · React context for progress. Fonts load through plain
`<link>` tags rather than `next/font`, deliberately, so builds work in restricted
or offline CI. The reasoning for each choice is in `docs/architecture.md`.

---

## Educational use, and its limits

CNC Academy is educational material. It teaches you to reason about machines; it
is not the authority on any specific number you will need.

- Every calculator applies textbook relationships, states plainly what it leaves
  out, and carries a visible note that it does not replace manufacturer
  calculations or professional engineering validation.
- Illustrative figures are orders of magnitude chosen to teach a method. None of
  them is a specification, a tolerance or an acceptance limit.
- Standards — ISO 230, ISO 10791, ISO 16090-1, ISO 12100, ISO 13849-1,
  IEC 60204-1 — are described by purpose and scope only. No numeric limit,
  tolerance class or clause content appears anywhere in this repo. The published
  standard is the only source of its actual requirements.
- The design project is a concept exercise. A concept produced from it would need
  structural, thermal, electrical and safety engineering review before anything
  was manufactured.
- Machine design decisions, electrical and pneumatic work, safety-function design,
  installation and commissioning must be carried out and verified by qualified
  personnel under the applicable law and standards for the place the machine is
  used. Nobody should build and operate an industrial machine tool on the strength
  of a course.

---

## Documentation

- [`SPEC.md`](SPEC.md) — the build specification and single source of truth
- [`docs/architecture.md`](docs/architecture.md) — the stack, the content model,
  the progress seam, the design system, and every deliberate deviation from spec
- [`docs/authoring-content.md`](docs/authoring-content.md) — how to add a lesson,
  a glossary term, a calculator, an explorer component, a scenario or a project
  stage, and the content rules an author must not break
- [`docs/roadmap.md`](docs/roadmap.md) — what shipped, the fifteen unwritten
  levels named individually, and the project stages still to gain decision data
