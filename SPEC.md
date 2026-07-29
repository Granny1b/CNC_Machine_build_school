# CNC Academy — Build Specification

> **What this is.** The single source of truth for building an interactive
> course that takes a complete beginner from "what is CNC?" to designing a
> custom CNC milling machine. Written to be executed phase by phase.
>
> **How to use it.** Work one phase at a time. Each phase has a goal, the files
> it touches, and acceptance criteria. Do not start a phase until the previous
> one builds and its criteria pass.
>
> **Companion file.** Add a short `CLAUDE.md` at repo root containing only:
> project one-liner, "read `SPEC.md` before making architectural decisions",
> the current phase number, and the commands (`npm run dev`, `build`,
> `typecheck`). Keep the bulk here so it isn't reloaded on every prompt.

---

## 1. Purpose and audience

**Learning goal.** Help a complete beginner understand CNC fundamentals and
progressively develop enough knowledge to design a complete custom CNC machine.

**Audience.** Complete beginners, technical students, new mechanical and
automation engineering students, hobbyist machine builders, and junior
employees entering the machine-tool industry.

**Assume no prior knowledge** of machining, mechanical engineering, electrical
systems, servos, machine control, engineering drawings or machine safety.

**Tone.** Plain language first, correct terminology second, always in that
order. Every technical word is defined at the point it first appears. The site
should read as one structured course, not a pile of articles.

**The success sentence.** A learner finishing Phase 1 content should be able to
say: *"I finally understand how a CNC machine works, and I can see how all of
its systems fit together."*

---

## 2. Non-negotiable content rules

These outrank convenience, aesthetics and delivery speed. Violating one is a
defect, not a style disagreement.

1. **Never fabricate standard requirements.** ISO 230, ISO 10791, ISO 16090-1,
   ISO 12100, ISO 13849-1 and IEC 60204-1 may be described by *purpose and
   scope only*. Never state a numeric limit, tolerance class or clause
   requirement as if quoted. Always direct the learner to the official
   standard for exact requirements.
2. **Never reproduce copyrighted standard text.** Paraphrase the intent.
3. **Label every simplification.** Any calculator, rule of thumb or estimate
   carries a visible note that it is educational and does not replace
   manufacturer calculations or professional engineering validation.
4. **No unsupported performance claims.** No invented accuracy figures, no
   "typical machines achieve X" without framing it as an illustrative order of
   magnitude.
5. **SI units by default.** Where a non-SI unit is genuinely standard on the
   shop floor (rpm, m/min for cutting speed, mm/min for feed), show it and
   state the SI relationship.
6. **No unsafe electrical, hydraulic or pneumatic instructions.** Describe
   architecture and principles. State plainly that this work must be performed
   and verified by qualified personnel under applicable law and standards.
7. **The design project is a concept exercise.** Never imply a beginner should
   build and operate an industrial machine without professional engineering
   review.
8. **Wrong answers teach.** A quiz never says only "incorrect". It explains why
   that specific answer was tempting, where the reasoning breaks, and links
   back to the concept.

---

## 3. Technical stack and decisions

| Choice | Decision | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Static-friendly, file routing, RSC for content pages |
| Language | TypeScript, `strict: true` | Content model correctness matters more than speed here |
| Styling | Tailwind CSS 3.4, tokens in `tailwind.config.ts` | One place to retune the visual language |
| Charts | Recharts | Only for genuine engineering graphs (motion profile, torque/power). All technical *diagrams* are hand-authored SVG |
| Diagrams | Hand-authored inline SVG components | Crisp at any size, themeable via `currentColor`, matches the drawing aesthetic |
| Persistence | `localStorage` behind a `ProgressStore` interface | Phase 1 is local-only, but the interface is written so a Supabase/Postgres adapter drops in without touching components |
| State | React context for progress; local state elsewhere | No global state library needed at this size |
| Fonts | Google Fonts via `<link>` in `layout.tsx`, **not** `next/font/google` | `next/font` fetches at build time; a link tag keeps builds working in restricted/offline CI. Always declare full fallback stacks |

### Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # must pass before any phase is considered done
npm run typecheck  # tsc --noEmit, must be clean
```

---

## 4. Folder structure

```
cnc-academy/
├── CLAUDE.md                  # short pointer file for Claude Code
├── SPEC.md                    # this document
├── README.md
├── docs/
│   ├── architecture.md
│   ├── authoring-content.md   # how to add lessons, terms, calculators
│   └── roadmap.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx                    # Home
│   │   ├── learn/page.tsx              # Learning path / roadmap
│   │   ├── learn/[slug]/page.tsx       # Lesson
│   │   ├── explorer/page.tsx           # CNC Machine Explorer
│   │   ├── calculators/page.tsx
│   │   ├── simulator/page.tsx          # G-code simulator (Phase 2 of roadmap)
│   │   ├── glossary/page.tsx
│   │   ├── project/page.tsx            # Design Your CNC
│   │   └── progress/page.tsx
│   ├── components/
│   │   ├── layout/      # SiteHeader, SiteFooter, Container, PageHeader
│   │   ├── ui/          # Card, Badge, Button, Disclosure, Field, Tabs
│   │   ├── learning/    # LessonView + one component per block kind, figures
│   │   ├── explorer/    # MachineExplorer, MachineDrawing, ComponentPanel
│   │   ├── calculators/ # MachiningCalculator, AxisSizingCalculator, CalcField
│   │   ├── troubleshooting/  # ScenarioPlayer
│   │   ├── project/     # DesignProject, DecisionCard, ConceptReport
│   │   └── progress/    # AxisScale (signature), ProgressProvider, LevelBadge
│   ├── content/
│   │   ├── types.ts            # the content contract — section 6
│   │   ├── curriculum.ts       # all 20 levels
│   │   ├── lessons/            # one file per lesson + index.ts registry
│   │   ├── glossary.ts
│   │   ├── machine-components.ts
│   │   ├── scenarios.ts
│   │   └── project.ts
│   └── lib/
│       ├── progress.ts   # ProgressStore interface + localStorage adapter
│       ├── autolink.ts   # glossary auto-linking for prose
│       └── format.ts     # unit formatting, significant figures
```

**Rule:** no page component exceeds ~150 lines. Pages compose; components do
the work. Content never lives inside a component file.

---

## 5. Design system

The palette is taken from the machine-tool workshop rather than a generic tech
template. The primary is **engineer's spotting blue** — the pigment used when
scraping ways flat, and the colour of a blueprint. Amber is reserved
*exclusively* for safety content so it never loses its meaning.

### 5.1 Tokens — `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F1F3F2",   // surface-plate grey, the page ground
          raised:  "#FFFFFF",   // cards and panels
          sunk:    "#E7EAE8",   // wells, inactive tracks
        },
        ink: { DEFAULT: "#0F141A", soft: "#54626E", faint: "#8B979F" },
        rule: { DEFAULT: "#D2D8D5", strong: "#B4BDB8" },
        blue: {
          DEFAULT: "#17395B",   // Prussian / engineer's blue — primary
          deep:    "#0E2439",
          mid:     "#2E6C99",
          bright:  "#2E90C4",   // measurement cyan: live values, active states
          wash:    "#E4EDF3",
        },
        amber: { DEFAULT: "#B8801A", wash: "#FBF2DE" },  // SAFETY ONLY
        moss:  { DEFAULT: "#3F6B4A", wash: "#E4EDE6" },  // pass / complete
      },
      fontFamily: {
        display: ["Archivo", "Helvetica Neue", "Arial", "sans-serif"],
        sans:    ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono:    ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.035em", eyebrow: "0.14em" },
      backgroundImage: {
        grid: `linear-gradient(to right, rgba(23,57,91,0.055) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(23,57,91,0.055) 1px, transparent 1px)`,
      },
      backgroundSize: { grid: "32px 32px" },
      boxShadow: {
        panel: "0 1px 2px rgba(15,20,26,0.04), 0 8px 24px -16px rgba(15,20,26,0.18)",
        lift:  "0 2px 4px rgba(15,20,26,0.05), 0 18px 40px -22px rgba(15,20,26,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 5.2 Typography rules

| Role | Face | Treatment |
|---|---|---|
| Display / headings | Archivo | 600–800 weight, `tracking-tightest`, sentence case |
| Body | IBM Plex Sans | 400/500, 17px base, `leading-[1.65]`, max 68ch measure |
| Data, coordinates, G-code, part callouts | IBM Plex Mono | 500, tabular where numeric |
| Eyebrows / labels | IBM Plex Mono | 11px, uppercase, `tracking-eyebrow`, `text-ink-faint` |

**Never** set body copy in mono, and **never** set a number that represents a
measured or calculated value in anything but mono. That contrast is the main
carrier of the technical feel.

### 5.3 Signature element — the axis scale

Progress is rendered as a **linear scale with a carriage**, not a progress bar
or a ring. Levels are graduation marks along a travel axis; the learner's
position is a saddle riding the rail; a mono readout shows `LEVEL 04 / 20`
alongside it, in the manner of a digital readout (DRO).

- Component: `components/progress/AxisScale.tsx`
- Used on: homepage hero, learning path header, progress page, lesson footer
- Major graduations at each level; minor ticks between them for lessons
- Completed span drawn in `blue`, remaining in `rule`, carriage in `ink`
- Must degrade to a simple labelled bar under 480px and respect
  `prefers-reduced-motion`

### 5.4 Homepage hero — the thesis

The hero shows the course's central idea rather than describing it: a **live
G-code-to-motion strip**. A short program listing in mono on one side, the
active line highlighted; a toolpath drawing itself in SVG on the other; a DRO
ticking X/Y/Z values in sync.

- Loops on a ~9 s cycle, `stroke-dasharray` trace animation
- Pauses entirely under `prefers-reduced-motion`, showing the completed path
- The program is a real, valid, trivially simple contour — not decorative
  gibberish. Every line shown must be a line explained later in Level 10

### 5.5 Drawing vernacular

Reuse across figures and the explorer so the site reads as one document:

- Hairline rules at 1px in `rule`, section dividers in `rule-strong`
- Dimension lines with proper extension lines and arrowheads for callouts
- Leader lines with a filled dot at the feature end
- 8mm graph grid (`bg-grid`) as a background wash, never above 6% opacity
- Balloon callouts numbered in mono, matching an adjacent parts list

### 5.6 Quality floor

Responsive to 360px. Visible keyboard focus (`focus-visible` ring in
`blue-bright`). All interactive SVG hotspots reachable by keyboard with
accessible names. Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and
graphical boundaries. No autoplaying motion beyond the hero trace.

**Avoid:** decorative animation, cluttered dashboards, dark-mode-first, stock
photography, walls of unbroken text, unexplained abbreviations.

---

## 6. Data model — `src/content/types.ts`

Everything a learner reads is data, not JSX. A lesson is an array of typed
blocks; the renderer decides appearance. This keeps authoring separate from
presentation and leaves the door open to a CMS later without touching
components.

```ts
/* ---------------- Curriculum skeleton ---------------- */

export type LevelTier = "foundation" | "mechanical" | "control" | "practice";

export interface Level {
  number: number;              // 1–20
  slug: string;
  title: string;
  summary: string;             // one line a beginner understands cold
  tier: LevelTier;
  lessonSlugs: string[];       // teaching order
  requires: number[];          // prerequisite level numbers
  topics: string[];            // shown on roadmap before lessons exist
  status: "published" | "planned";
}

/* ---------------- Lessons ---------------- */

export interface Lesson {
  slug: string;
  level: number;
  title: string;
  intro: string;               // plain-language promise
  minutes: number;
  objectives: string[];
  terms: TermDefinition[];
  blocks: LessonBlock[];
  knowledgeCheck: QuizQuestion[];
  exercise: Exercise;
  summary: string[];
  nextSlug?: string;
}

export interface TermDefinition { term: string; plain: string; }

export type LessonBlock =
  | { kind: "prose";   body: string[] }
  | { kind: "heading"; text: string }
  | { kind: "deeper";  title: string; body: string[]; formula?: Formula }
  | { kind: "example"; title: string; body: string[] }
  | { kind: "figure";  figure: FigureId; caption: string }
  | { kind: "mistakes"; items: { wrong: string; why: string }[] }
  | { kind: "safety";  body: string }
  | { kind: "note";    title: string; body: string }
  | { kind: "compare"; title: string; columns: string[]; rows: CompareRow[] }
  | { kind: "formula"; formula: Formula }
  | { kind: "widget";  widget: WidgetId };

export interface CompareRow { label: string; cells: string[]; }

export interface Formula {
  expression: string;          // as it appears on a shop reference card
  variables: { symbol: string; meaning: string; unit: string }[];
  meaning: string;             // what it tells you to do differently
}

export type FigureId =
  | "cad-to-part" | "axis-triad" | "ballscrew"
  | "accuracy-targets" | "architectures" | "machine-anatomy";

export type WidgetId = "machining-calculator" | "axis-sizing" | "explorer-teaser";

/* ---------------- Assessment ---------------- */

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  teaching: string;            // shown once answered, right or wrong
  reviewSlug?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;            // why THIS answer is tempting and where it breaks
}

export interface Exercise {
  title: string;
  body: string;
  steps: string[];
  selfCheck: string[];         // what a good answer contains
}

/* ---------------- Glossary ---------------- */

export interface GlossaryTerm {
  slug: string;
  term: string;
  aliases?: string[];          // e.g. "ballscrew" for "ball screw"
  plain: string;
  technical: string;
  example?: string;
  related: string[];
  lessons: string[];
  tags: GlossaryTag[];
}

export type GlossaryTag =
  | "motion" | "cutting" | "structure" | "control"
  | "electrical" | "metrology" | "safety" | "process";

/* ---------------- Machine explorer ---------------- */

export interface MachineComponent {
  id: string;
  name: string;
  system: "structure" | "motion" | "spindle" | "control" | "auxiliary" | "safety";
  hotspot: { x: number; y: number };   // % coords on the illustration
  plain: string;
  engineering: string;
  parameters: { label: string; value: string }[];
  failureModes: string[];
  lessons: string[];
  glossary: string[];
}

/* ---------------- Troubleshooting ---------------- */

export interface Scenario {
  id: string;
  title: string;
  symptom: string;             // the operator's words, not the diagnosis
  context: string[];
  steps: ScenarioStep[];
  resolution: string;
}

export interface ScenarioStep {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    verdict: "sound" | "wasteful" | "wrong";
    response: string;
  }[];
}

/* ---------------- Final design project ---------------- */

export interface ProjectStage {
  id: string;
  number: number;
  title: string;
  brief: string;
  decision?: ProjectDecision;
}

export interface ProjectDecision {
  question: string;
  options: ProjectOption[];
}

export interface ProjectOption {
  id: string;
  name: string;
  benefits: string[];
  drawbacks: string[];
  cost: string;
  performance: string;
  safety: string;
  maintenance: string;
  fitForBrief: string;         // why it suits THIS fictional brief or not
  recommended?: boolean;
}
```

### Progress store

```ts
// src/lib/progress.ts
export interface ProgressState {
  lessonsCompleted: string[];
  quizScores: Record<string, { correct: number; total: number }>;
  scenarioResults: Record<string, "solved" | "attempted">;
  projectDecisions: Record<string, string>;   // stageId -> optionId
  lastVisitedSlug?: string;
  updatedAt: string;
}

export interface ProgressStore {
  load(): Promise<ProgressState>;
  save(next: ProgressState): Promise<void>;
  clear(): Promise<void>;
}
```

Ship `LocalProgressStore`. Do not let components import `localStorage`
directly — they consume `ProgressProvider` context only. A future
`SupabaseProgressStore` must be a drop-in.

---

## 7. Curriculum map

Four tiers. Levels marked **P1** ship content in Phase 1; the rest appear on
the roadmap as planned, with topic lists visible so the whole route is legible
from day one.

**Foundations**
1. **CNC overview** — P1 — what CNC is, machine types, CAD→part, major parts
2. **How movement works** — P1 — coordinates, axes, offsets, interpolation, guideways and screws
3. Cutting and machining fundamentals — speeds, feeds, chips, forces, wear, materials

**Mechanical design**
4. **Mechanical machine design** — P1 — architectures, stiffness, damping, thermal stability, materials
5. Linear motion and axis design — rails, screws, preload, critical speed, drive comparison
6. Spindle systems — types, torque/power curves, bearings, tool interfaces
11. Pneumatics, hydraulics and auxiliary systems
12. Tool changing and workholding

**Drives and control**
7. Motors, servos and motion control
8. Electrical machine design
9. CNC control and software
10. G-code and programming

**Proving and building**
13. **Accuracy, geometry and metrology** — P1 — accuracy vs repeatability vs resolution, instruments, testing
14. Thermal behaviour
15. Vibration and machine dynamics
16. Machine safety and compliance
17. Manufacturing and assembly
18. Commissioning and validation
19. Maintenance and troubleshooting
20. **Complete CNC design project** — P1 — 20-stage guided design

The authoritative machine-readable version is `src/content/curriculum.ts`,
which must contain all 20 levels with full `topics` arrays from Phase 1.

### The seven Phase 1 lessons

| # | Slug | Level |
|---|---|---|
| 1 | `what-is-a-cnc-machine` | 1 |
| 2 | `cad-to-finished-component` | 1 |
| 3 | `understanding-xyz` | 2 |
| 4 | `how-a-ball-screw-moves-an-axis` | 2 |
| 5 | `accuracy-repeatability-resolution` | 13 |
| 6 | `intro-to-machine-architecture` | 4 |
| 7 | `selecting-an-architecture` | 20 |

Each must contain: introduction, learning objectives, terminology, a visual
explanation, a practical example, a deeper technical section behind a
disclosure, common mistakes, a knowledge check, a practical exercise, a
summary, and a suggested next lesson. Real content throughout — no placeholder
text anywhere in the repo.

---

## 8. Route map

| Route | Purpose |
|---|---|
| `/` | Hero, roadmap preview, featured tools, current progress, project preview |
| `/learn` | Full learning path, all 20 levels, tier grouping, prerequisites |
| `/learn/[slug]` | Lesson |
| `/explorer` | CNC Machine Explorer |
| `/calculators` | Machining and axis-sizing calculators |
| `/simulator` | G-code simulator (roadmap Phase 2 — stub with honest "in development" state, not fake output) |
| `/glossary` | Searchable glossary |
| `/project` | Design Your CNC |
| `/progress` | Completion, quiz history, saved project decisions, reset |

Primary nav order: Home · Start Learning · Learning Path · Machine Explorer ·
Calculators · G-code Simulator · Design Your CNC · Glossary · Progress ·
Resources.

---

## 9. Calculators — formulas to implement

Every calculator shows: the formula, each variable with its unit, a worked
example, what the number means in practice, and the educational-estimate note.

### 9.1 Machining calculator

| Quantity | Formula | Units |
|---|---|---|
| Spindle speed from cutting speed | `n = (vc × 1000) / (π × D)` | n rev/min, vc m/min, D mm |
| Cutting speed from spindle speed | `vc = (π × D × n) / 1000` | as above |
| Feed rate | `vf = n × z × fz` | vf mm/min, z teeth, fz mm/tooth |
| Material removal rate | `Q = (ap × ae × vf) / 1000` | Q cm³/min, ap and ae mm |
| Machining time (single pass) | `t = L / vf` | t min, L mm |

`D` = tool diameter, `ap` = axial depth of cut, `ae` = radial width of cut.
Show rev/min alongside the SI note that 1 rev/min ≈ 0.105 rad/s.

Guard rails: warn when `fz` is outside a plausible range for the entered tool
diameter, when `ae > D`, or when `n` exceeds a user-entered spindle maximum.
Warnings explain the physical consequence — they never block input.

### 9.2 Axis-sizing calculator

Inputs: moving mass, desired speed, desired acceleration, travel, external
process force, screw lead, mechanical efficiency, guideway friction
coefficient, orientation (horizontal/vertical).

| Quantity | Formula |
|---|---|
| Acceleration force | `F_a = m × a` |
| Friction force | `F_f = μ × m × g × cos θ` |
| Gravity force (vertical axes) | `F_g = m × g × sin θ` |
| Total thrust | `F = F_a + F_f + F_g + F_ext` |
| Screw torque | `T = (F × P) / (2π × η)` — P in metres |
| Motor speed | `n = (v × 1000) / P` — v m/min, P mm, n rev/min |
| Reflected load inertia | `J_load = m × (P / 2π)²` — P in metres |
| Move time (trapezoidal) | `t = (L / v) + (v / a)` |

State explicitly in the UI that this ignores screw inertia, coupling and
bearing losses, duty cycle, thermal limits, critical speed and buckling — and
that a real selection requires the manufacturer's sizing software and
engineering review.

### 9.3 Chart usage

The axis calculator renders a trapezoidal velocity profile (Recharts, line
chart, mono axis labels, `blue` stroke, no gridline clutter). This is the only
Phase 1 use of the charting library.

---

## 10. CNC Machine Explorer

An interactive cutaway of a vertical machining centre. Learners click or
keyboard-navigate hotspots to inspect components.

**Required components** (each needs all fields in `MachineComponent`): base,
bed, column, gantry, table, saddle, spindle, tool holder, linear rails, bearing
blocks, ball screw, ball-screw supports, servo motor, coupling, encoder,
lubrication system, coolant system, tool changer, electrical cabinet, CNC
controller, safety enclosure, doors, sensors, chip conveyor.

**Panel contents per component:** simple explanation → engineering explanation
→ main design parameters → common failure modes → related lessons → related
glossary terms.

**Interaction:** filter chips by `system`; hotspots are `<button>` elements
inside the SVG with accessible names; selected component highlights in
`blue-bright`; panel is a side sheet on desktop, a bottom sheet on mobile;
Escape closes; arrow keys move between hotspots.

---

## 11. Troubleshooting scenarios

Phase 1 ships at least one complete scenario. Suggested first: **"Circular
interpolation test shows a step at the quadrant change"** — a symptom that
leads through backlash, reversal spikes, servo tuning and mechanical lash, and
which pays off the Level 13 lesson.

The player presents a symptom, then a sequence of diagnostic choices. Options
are graded `sound` / `wasteful` / `wrong` — because in fault-finding the real
distinction is not right versus wrong but *what it costs you*. Every option
returns a response explaining what that step would actually have told you.

---

## 12. Design project — `/project`

Twenty stages, following the syllabus order: intended use → workpiece size and
material → required travels → architecture → cutting forces → spindle
requirements → structure → guideways → axis drives → motor estimates →
electrical → control architecture → auxiliary systems → safety concept →
manufacturing and assembly → alignment strategy → validation plan →
maintenance plan → risks and trade-offs → final concept report.

Each decision stage shows, for every option: benefits, disadvantages, cost
implication, performance implication, safety implication, maintenance
implication, and why it may or may not suit this fictional brief.

Decisions persist through `ProgressStore`. The final stage assembles the
learner's choices into a printable concept report, opening with a clear
statement that it is an educational concept requiring professional engineering
review before any manufacture.

**Phase 1 scope:** full flow with stages 1–10 carrying complete decision data;
stages 11–20 present the brief and self-check prompts with decision data added
in a later phase. No stage may be empty.

---

## 13. Phase plan

Each phase ends with `npm run build` and `npm run typecheck` clean.

### Phase 0 — Scaffold and design system
Config files, `globals.css` with base type and focus styles, font link tags,
`Container`, `SiteHeader`, `SiteFooter`, `Card`, `Badge`, `Button`,
`Disclosure`.
**Done when:** a placeholder page renders with correct type, palette and grid
wash; nav works on desktop and mobile; keyboard focus is visible everywhere.

### Phase 1 — Content model and curriculum data
`types.ts` verbatim from section 6, `curriculum.ts` with all 20 levels,
`lib/progress.ts` with `LocalProgressStore` and `ProgressProvider`.
**Done when:** typecheck clean; a temporary debug page lists 20 levels with
tiers and prerequisites.

### Phase 2 — App shell, navigation, homepage
`AxisScale`, the G-code hero, roadmap preview, featured tools, project preview.
**Done when:** homepage matches section 5.4; hero pauses under
`prefers-reduced-motion`; `AxisScale` reads correctly at 0%, mid and 100%.

### Phase 3 — Lesson renderer
`LessonView` plus one component per `LessonBlock` kind, the six SVG figures,
`KnowledgeCheck` with per-option feedback, `Exercise`, lesson footer with
next-lesson link and completion toggle.
**Done when:** a fixture lesson exercising every block kind renders correctly
and the quiz gives distinct feedback for each wrong option.

### Phase 4 — The seven lessons
Real content per section 7. This is the largest writing phase — do it one
lesson per commit.
**Done when:** all seven render, cross-link correctly, and contain no
placeholder text.

### Phase 5 — Glossary and auto-linking
`glossary.ts` with a minimum of 40 terms, search and tag filters,
`lib/autolink.ts` wiring first-occurrence term links inside prose blocks.
**Done when:** search matches term, aliases and definition text; auto-linking
never double-links within a paragraph and never links inside headings or code.

### Phase 6 — Machine Explorer
Per section 10, all 24 components.
**Done when:** every hotspot is keyboard reachable and named; panels are
complete for all 24; mobile bottom sheet works.

### Phase 7 — Calculators
Both calculators per section 9, with the motion-profile chart.
**Done when:** worked examples in the lessons reproduce exactly; guard-rail
warnings fire correctly; the educational-estimate note is visible without
scrolling.

### Phase 8 — Troubleshooting
`ScenarioPlayer` and the first complete scenario.
**Done when:** all paths return a response; results persist to progress.

### Phase 9 — Design project
Per section 12, including the concept report.
**Done when:** decisions persist across reload; report reflects actual choices;
the review disclaimer appears at the top of the report.

### Phase 10 — Progress, docs and quality pass
`/progress`, `README.md`, `docs/architecture.md`,
`docs/authoring-content.md`, `docs/roadmap.md`. Accessibility and responsive
sweep at 360 / 768 / 1280 px.
**Done when:** the checklist in section 15 passes.

---

## 14. Authoring guide (goes into `docs/authoring-content.md`)

**Add a lesson**
1. Create `src/content/lessons/<slug>.ts` exporting a `Lesson`.
2. Register it in `src/content/lessons/index.ts`.
3. Add the slug to the owning level's `lessonSlugs` in `curriculum.ts`.
4. Set `nextSlug` on the preceding lesson.
5. Flip the level's `status` to `published` if it was planned.

**Add a glossary term** — append a `GlossaryTerm` to `glossary.ts`. Include
`aliases` for plural and compound spellings so auto-linking catches them. Every
term needs both `plain` and `technical`.

**Add a calculator** — create the component under `components/calculators/`,
express each output through a pure function in `lib/`, register a `WidgetId` in
`types.ts` so it can be embedded in lessons, and include formula, variables,
units, meaning and the estimate note.

**Add a machine component** — append a `MachineComponent` to
`machine-components.ts` with hotspot percentages measured against the
illustration's viewBox. All six panel sections are mandatory.

---

## 15. Definition of done

- [ ] `npm run build` and `npm run typecheck` clean
- [ ] No placeholder or lorem text anywhere in the repo
- [ ] Seven lessons complete with all eleven pedagogical sections
- [ ] Both calculators show formula, variables, units, meaning, estimate note
- [ ] All 24 explorer components have complete panels
- [ ] Glossary ≥ 40 terms, searchable, auto-linked in prose
- [ ] One troubleshooting scenario fully playable
- [ ] Design project persists decisions and produces a report
- [ ] Every quiz option has specific feedback, not a generic "incorrect"
- [ ] No fabricated standard requirements, tolerances or legal claims
- [ ] SI units throughout, shop units shown alongside where conventional
- [ ] Layouts sound at 360 / 768 / 1280 px
- [ ] Keyboard navigable end to end with visible focus
- [ ] `prefers-reduced-motion` respected

---

## 16. Roadmap beyond Phase 1

1. **G-code simulator** — parser, toolpath rendering, coordinate readout,
   active-line highlight, per-command explanation, beginner-mistake detection.
   Browser only; it must never be capable of driving hardware.
2. **Remaining 13 levels** of lesson content.
3. **Interactive torque/power curves** for Level 6 and closed-loop control
   animations for Level 7.
4. **Drag-and-drop component identification** assessment.
5. **Accounts and cloud sync** — implement `SupabaseProgressStore` against the
   existing `ProgressStore` interface; no component changes required.
6. **Content localisation** — the block model is already language-agnostic;
   swap the content registry per locale.
7. **Printable lesson and project exports.**
