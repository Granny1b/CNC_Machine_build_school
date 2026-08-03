# Architecture

This document explains how CNC Academy is put together and, more importantly,
*why* each part is the way it is. `SPEC.md` at the repo root is the source of
truth for what the site must be; this is the explanation of what was built and
the reasoning a new developer needs before changing it.

Read this first, then `authoring-content.md` if you are here to write content, or
`roadmap.md` if you are here to extend the site.

---

## 1. The stack, and why

**Next.js 14, App Router.** Almost every page on this site is content that never
changes between requests: lessons, the glossary, the curriculum map, the
resources page. The App Router renders those as server components with no
client JavaScript at all, and file-based routing means the route map in `SPEC.md`
section 8 is literally the folder structure under `src/app`. Interactivity is
opt-in per component with `"use client"`, which keeps the interactive surface
small and visible: if a file does not carry the directive, it ships no
JavaScript.

**TypeScript, `strict: true`.** The content model is the product here. A lesson
is a discriminated union of block kinds, and strictness is what makes that union
enforce itself: add a block kind and the renderer fails to compile until it is
handled. Correctness of the content contract matters far more on this project
than the few minutes strictness costs.

**Tailwind CSS 3.4 with tokens in `tailwind.config.ts`.** The visual language is
a small, deliberate palette taken from a machine shop, and it needs to be
retunable in one place. Tokens (`paper`, `ink`, `rule`, `blue`, `amber`, `moss`)
are named for what they *mean* rather than what they look like, which is what
makes the amber-is-safety-only rule enforceable by reading a diff.

**Recharts, for engineering graphs only.** The single Phase 1 chart is the
trapezoidal velocity profile in the axis-sizing calculator, which is a genuine
engineering plot. Every *diagram* — the figures in lessons, the machine cutaway,
the toolpath in the homepage hero — is hand-authored inline SVG. Hand-authored
SVG is crisp at any size, themeable through `currentColor`, keyboard-focusable
where hotspots need to be, and it lets the whole site share one drawing
vernacular (hairlines, dimension lines with arrowheads, leader lines with a
filled dot, balloon callouts in mono). No charting library produces drawings that
look like a workshop drawing.

**`localStorage` behind a `ProgressStore` interface.** Phase 1 has no accounts,
so progress is local. But the persistence *seam* is designed for the cloud store
that section 16 of the spec promises. See section 5 below.

**React context for progress; local state everywhere else.** Progress is the
only genuinely global state, and it is one small object. A state library would be
weight without benefit.

**Fonts via `<link>` tags in `layout.tsx`, not `next/font/google`.**
`next/font` fetches font files at build time, which turns a restricted or offline
CI environment into a failed build. Plain link tags degrade to the fallback
stacks declared in `tailwind.config.ts` instead. This is a deliberate deviation
from the Next.js default recommendation and it is commented in `layout.tsx` so
nobody "fixes" it.

---

## 2. Folder structure as built

```
├── CLAUDE.md                  # short pointer file: read SPEC.md, current phase, commands
├── SPEC.md                    # the source of truth
├── README.md
├── docs/                      # this file, authoring-content.md, roadmap.md
├── scripts/
│   ├── check-content.ts       # content integrity check; `npm run check:content`
│   └── sweep.mjs              # browser sweep; `npm run sweep`
└── src/
    ├── app/
    │   ├── layout.tsx         # font links, ProgressProvider, header, footer, skip link
    │   ├── globals.css        # base type, focus styles, .eyebrow/.measure/.num/.grid-wash
    │   ├── page.tsx                    # home: G-code hero, roadmap preview, tools, project
    │   ├── learn/page.tsx              # the twenty levels, grouped by tier
    │   ├── learn/[slug]/page.tsx       # a lesson
    │   ├── explorer/page.tsx           # machine explorer
    │   ├── calculators/page.tsx
    │   ├── troubleshooting/page.tsx    # added route, see section 8
    │   ├── simulator/page.tsx          # honest in-development stub, no fake output
    │   ├── glossary/page.tsx
    │   ├── project/page.tsx
    │   ├── progress/page.tsx
    │   └── resources/page.tsx          # added route, see section 8
    ├── components/
    │   ├── layout/       # Container, PageHeader, SiteHeader, SiteFooter, nav.ts
    │   ├── ui/           # Card, Badge, Button, Disclosure, Field, Tabs
    │   ├── home/         # GcodeHero + its program data, RoadmapPreview, FeaturedTools, …
    │   ├── learning/     # LessonView, LessonBlocks, blocks/*, figures/*, KnowledgeCheck, …
    │   ├── explorer/     # MachineExplorer, MachineDrawing, ComponentPanel, ExplorerTeaser
    │   ├── calculators/  # MachiningCalculator, AxisSizingCalculator, CalcField, chart
    │   ├── troubleshooting/  # ScenarioPlayer
    │   ├── project/      # DesignProject, DecisionCard, ConceptReport
    │   └── progress/     # ProgressProvider, AxisScale, LevelBadge, ProgressDashboard,
    │                     # QuizHistory, ResetProgress
    ├── content/          # every word the learner reads — see section 3
    │   ├── types.ts, curriculum.ts, glossary.ts, machine-components.ts,
    │   ├── scenarios.ts, project.ts
    │   └── lessons/      # one file per lesson plus index.ts registry
    └── lib/              # pure logic: progress, autolink, format, machining, axis-sizing
```

Two rules hold this shape together, both from `SPEC.md` section 4:

- **No page component exceeds about 150 lines.** Pages compose; components do the
  work. If a page is growing, the answer is a component, not a longer page.
- **Content never lives in a component file.** It lives under `src/content`. The
  one intentional exception is *page furniture* — the standards descriptions and
  source-type lists on `/resources` — which is prose about the site rather than
  curriculum, and is declared as arrays at the top of that page.

---

## 3. Content as data, not JSX

Everything a learner reads is a typed object. A lesson is an array of blocks:

```ts
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
```

**Why not JSX?** Four reasons, in order of how much they matter here.

1. *Presentation stays consistent.* An author cannot accidentally style a safety
   note differently from every other safety note, because they do not choose the
   styling at all. The renderer owns appearance; the author owns meaning.
2. *The content is checkable.* Because a lesson is data, `scripts/check-content.ts`
   can assert that every lesson has the eleven pedagogical sections `SPEC.md`
   section 7 requires, that every quiz option has specific feedback rather than a
   generic "incorrect", that `nextSlug` resolves, that no figure lacks a caption.
   None of that is possible against arbitrary JSX.
3. *A CMS can be dropped in later* without touching a single component: the
   registries would return the same shapes from a different source.
4. *Localisation stays open.* The block model is language-agnostic, so a locale
   is a different content registry rather than a fork of the renderer.

**How the block renderer stays exhaustive.** `components/learning/LessonBlocks.tsx`
switches on `block.kind` and ends with:

```ts
default: {
  const impossible: never = block;
  throw new Error(`Unhandled lesson block: ${JSON.stringify(impossible)}`);
}
```

If a new kind is added to the union in `content/types.ts` and not handled, the
assignment to `never` fails to compile. A new block kind therefore *cannot* ship
as a silent blank space in a lesson. The same pattern guards `WidgetBlock.tsx`
for `WidgetId`, and the figure registry uses the type system differently to reach
the same end: `figures` is declared `Record<FigureId, ComponentType>`, so adding
a `FigureId` without drawing it is a compile error.

Two details are precomputed in `LessonBlocks` rather than inside blocks: heading
ids (from the same helper the lesson jump-list uses, so anchors and the nav
cannot drift apart) and figure numbers (so a caption can say "Figure 02" without
a figure knowing what lesson it is in).

**The content check is part of the definition of done.** `npm run typecheck`
proves the content has the right *shape*; `npm run check:content` proves it has
the right *content* — cross-references resolve, minimum depth is met, no
placeholder text survives anywhere in `src`. `npm run verify` runs typecheck,
the content check and the build in that order.

**The browser sweep is the other half.** `scripts/sweep.mjs` (`npm run sweep`)
covers the SPEC section 15 items that do not exist until the CSS has been
applied, because they are properties of the rendered page rather than of the
source: horizontal overflow at 360 / 768 / 1280, contrast measured against each
element's *computed* background, heading order, accessible names, a visible
focus ring on every keyboard stop, and a hero that holds still under
`prefers-reduced-motion`. It needs a running server and reads `BASE`.

This split matters because the two failure modes look nothing alike. A missing
quiz explanation is a fact about the data and the content check finds it. A
paragraph at 2.5:1, or a table that pushes the page sideways at 360px, is a
fact about the cascade — invisible in the source, and caught only by measuring
the real thing. Both defects found during Phase 10 were of the second kind.

---

## 4. Units, numbers and the honesty rules in code

`SPEC.md` section 2 is not advisory, and several of its rules are enforced
structurally rather than by good intentions:

- **Numbers are mono.** `lib/format.ts` owns significant figures, fixed decimals
  and parsing; `.num` in `globals.css` is the mono tabular class. Content is
  authored with measured values between backticks (`` `80 mm` ``) and the
  renderers turn those segments into mono spans. That convention is why no author
  has to write markup, and why a number can never end up set in body face.
- **Estimates are labelled where they are used.** Each calculator library exports
  its own note constants (`MACHINING_ESTIMATE_NOTE`, `AXIS_EXCLUSIONS`, and so
  on) beside the pure functions, so the caveat travels with the maths instead of
  being a paragraph someone might forget to include.
- **Standards are described by purpose and scope only.** No numeric limit,
  tolerance class or clause content appears anywhere in the repo. Where a
  standard is named — in lessons, in project stages, on `/resources` — the reader
  is told that the published document is the only source of its requirements.
- **Qualified-personnel statements are content, not decoration.**
  `machine-components.ts` exports `QUALIFIED_WORK_NOTE` and `QUALIFIED_WORK_IDS`
  so that the components whose real-world work is electrical, pneumatic or
  safety-related always carry the statement.

---

## 5. The `ProgressStore` seam

The whole persistence surface is three methods:

```ts
export interface ProgressStore {
  load(): Promise<ProgressState>;
  save(next: ProgressState): Promise<void>;
  clear(): Promise<void>;
}
```

`LocalProgressStore` in `lib/progress.ts` implements it against
`window.localStorage` under the key `cnc-academy.progress.v1`. Three properties
of that implementation are deliberate and any replacement must keep them:

1. **Nothing throws.** Storage can be blocked outright by browser settings, and
   quota can be exceeded. A learner with storage disabled should still be able to
   read the entire course; they just will not keep a record of it. Every method
   swallows its failure and resolves.
2. **Everything read back is untrusted.** `normalizeProgress()` coerces whatever
   was parsed into a valid `ProgressState`, field by field, discarding anything
   of the wrong type. The stored value may come from an older schema, another app
   on the same origin, or a hand edit in devtools.
3. **Components never see the store.** They consume `ProgressProvider` context
   only. Nothing outside `lib/progress.ts` mentions `localStorage`.

`ProgressProvider` owns the write path. Every mutation goes through one `commit`
helper that stamps `updatedAt`, never mutates in place, and calls `save()`. It
also exposes `ready`, which is false until the first `load()` resolves — the
reason every progress-derived surface renders a skeleton rather than flashing
zeroes on first paint.

### What a `SupabaseProgressStore` would have to implement

It is a drop-in by construction: `ProgressProvider` accepts a `store` prop, so
swapping stores is one line in `app/layout.tsx` and no component changes.

```ts
export class SupabaseProgressStore implements ProgressStore {
  async load(): Promise<ProgressState> { /* select row, normalizeProgress(row.state) */ }
  async save(next: ProgressState): Promise<void> { /* upsert row */ }
  async clear(): Promise<void> { /* delete row */ }
}
```

The contract it has to honour:

- **Same three methods, same promise semantics, and the same refusal to throw.**
  A network failure must degrade to "your progress is not being saved", never to
  a broken lesson page.
- **Coerce the server payload.** Run `normalizeProgress()` on whatever comes back.
  A row is no more trustworthy than a `localStorage` string.
- **Identity is the store's problem, not the provider's.** The provider knows
  nothing about users. A cloud store resolves the current session itself and
  returns `emptyProgress()` when there is no session.
- **Reconcile with `updatedAt`.** `ProgressState.updatedAt` exists for exactly
  this: the same learner on two devices needs a defined merge rule. Last-write
  wins per record is the simplest defensible choice; a smarter store can union
  `lessonsCompleted` and take the better of two quiz scores. Whatever it does
  must be a written-down rule, because the alternative is silently losing a
  learner's work.
- **Expect chatty writes and debounce inside the store.** `save()` is called on
  every toggle. `localStorage` does not care; a database does. Debouncing belongs
  in the store, not in components — otherwise every caller has to remember.
- **Consider a local write-through cache** so that first paint is instant offline
  and the network result reconciles afterwards. That is a store-internal decision
  and needs no component changes, which is the point of the seam.

---

## 6. Auto-linking design

`lib/autolink.ts` turns prose strings into segments, some of which are glossary
links. Four properties, each a deliberate constraint:

**Pure and glossary-agnostic.** The module never imports the glossary. The caller
passes `AutolinkTerm[]`, so the matcher has no content dependency and is
trivially testable. `content/glossary.ts` builds the index once at module load
(`glossaryIndex`) from surface forms the glossary already declares — nothing is
authored twice.

**First occurrence only.** `autolinkParagraph(text, index, used)` takes a mutable
`used` set of slugs already linked. `LessonView` creates one set per lesson and
`LessonBlocks` renders blocks in document order, so "first" means first as read,
across the whole lesson rather than per paragraph. A paragraph peppered with the
same link nine times is noise, not navigation.

**Code-safe.** Text between backticks is emitted as a `code` segment and is
skipped by the matcher entirely. Measured values and G-code words therefore
render in mono and never become links. Headings are not run through the
autolinker at all.

**Longest surface form wins.** The alternation is built with surfaces sorted by
length, so "ball screw" matches before "screw", and aliases can never steal a
canonical term's slug (first writer wins when building the surface map). Word
boundaries are hand-written rather than `\b`, so hyphenated forms such as
"G-code" match correctly and do not match inside longer words.

Lessons pass `skipSlugs` for the terms they define in their own terminology list:
linking a term to the glossary in the same lesson that defines it three
paragraphs above is a distraction, not a help.

---

## 7. Design system notes

Tokens, type roles and the drawing vernacular are specified in `SPEC.md`
section 5 and implemented in `tailwind.config.ts` and `globals.css`. The rules
worth restating because they are easy to break:

- **Amber is safety content only.** Never for emphasis, hover, decoration or
  generic warnings. It appears on lesson safety blocks, the qualified-work notes
  in explorer panels, the vertical-axis safety note in the axis calculator, the
  project's review disclaimer, the hardware constraint on `/simulator` and the
  limits statement on `/resources`. Two places it is deliberately *not* used are
  worth knowing, because both look like candidates: calculator guard-rail
  warnings (drawn in the blue wash — a feed rate outside a plausible range is a
  process warning, and `CalcWarnings` says so in a comment) and the destructive
  reset control on `/progress` (erasing your own notes is not a machine hazard).
  Every borrowed use dilutes the one meaning the colour has.
- **`blue-bright` is the measurement cyan** — live values and active states.
  `moss` means pass or complete. `blue` is the primary.
- **Mono carries the technical feel.** All data, coordinates, G-code, part
  callouts and labels are mono; body copy never is; and a measured or calculated
  number is never set in anything else.
- **Utilities:** `.eyebrow` (mono 11px uppercase, `tracking-eyebrow`,
  `text-ink-faint`), `.measure` (68ch), `.num` (mono tabular), `.grid-wash` (the
  graph-paper background).
- **Hairlines** in `border-rule`, section dividers in `border-rule-strong`,
  corners `rounded-sm`, elevation `shadow-panel` / `shadow-lift`.

### The `.grid-wash` workaround

`SPEC.md` section 5.1 defines both `backgroundImage.grid` and
`backgroundSize.grid`. Tailwind generates a class from the *key* under each
theme section, so both entries produce a utility called `bg-grid`. Whichever
Tailwind emits second wins, and the graph-paper image would be shadowed by the
size rule (or vice versa) depending on ordering — a genuinely confusing failure,
because the class name looks right in the markup.

Rather than rename a token the spec fixes, `globals.css` composes the two tokens
into a single usable class:

```css
.grid-wash {
  background-image: theme("backgroundImage.grid");
  background-size: theme("backgroundSize.grid");
}
```

Use `grid-wash`. Do not use `bg-grid`.

---

## 8. Deliberate deviations from SPEC

Each of these is a decision, not an oversight, and each is commented at the
place it happens.

**Added route: `/troubleshooting`.** `SPEC.md` section 11 requires a
troubleshooting scenario player, and section 15 requires one fully playable
scenario. Section 8's route map has no home for it — the scenarios belong to no
lesson and to no calculator. Rather than bury the player inside a lesson that
does not exist yet (the payoff level, 19, is unwritten), it gained a route of its
own, and an entry in the primary nav next to the calculators. `ScenarioPlayer`
persists results through `ProgressProvider`, which is what section 8's brief for
`/progress` needs.

**Added route: `/resources`.** Section 8's *nav order* ends with "Resources" but
its route table has no such route. Something had to give: either drop a nav item
the spec lists, or add the page. The page is the honest choice, because the
content it holds — the standards described by purpose and scope, the kinds of
source a designer actually works from, and the statement of this site's limits —
is content the spec's own content rules demand exist somewhere.

**Nav collapses to a drawer below 1280px, not below 768px.** The primary nav has
eleven items with real words in them. Fitting eleven items on one line needs
roughly a desktop viewport, and abbreviating them would violate the spec's own
"no unexplained abbreviations". So `SiteHeader` shows the horizontal nav at `xl`
and above and uses the drawer everywhere below, including on tablets in
landscape. The alternative — cramming or wrapping to two rows at 1024px — read
worse at every width we checked.

**Added Tailwind breakpoint `xs` at 480px.** `SPEC.md` section 5.3 requires the
axis scale to degrade to a simple labelled bar under 480px, and Tailwind's
smallest default stop is 640px. Rather than hard-code a media query in one
component, the breakpoint is a token in `tailwind.config.ts`, so anything else
that needs the same threshold can use it. `AxisScale` renders the graduated rail
in `hidden xs:block` and the labelled bar in `xs:hidden`.

**Added `scripts/check-content.ts` and the `check:content` / `verify` npm
scripts.** The spec lists three commands. The definition of done in section 15
contains a dozen assertions that no type system can check — "every quiz option
has specific feedback, not a generic 'incorrect'", "no placeholder text anywhere
in the repo", "all 24 explorer components have complete panels". Those are now a
script, so they are checked on every run rather than by eye at the end.

**Level counts.** `SPEC.md` section 16 item 2 refers to "remaining 13 levels" of
lesson content, but section 7 marks five levels (1, 2, 4, 13, 20) as shipping
Phase 1 lessons — the seven lessons sit inside those five levels. Fifteen levels
are therefore unwritten, and `curriculum.ts` says so: five `published`, fifteen
`planned`. The site derives both numbers from the data rather than repeating the
spec's figure. See `roadmap.md`.

---

## 9. Accessibility and motion

The quality floor is `SPEC.md` section 5.6, and it is a floor, not an aspiration.

- Layouts are sound at 360, 768 and 1280px. Nothing horizontally scrolls at
  360px.
- Focus is always visible. The global `:focus-visible` rule in `globals.css`
  paints a `blue-bright` ring; `:focus:not(:focus-visible)` removes it for
  pointer interaction only. Never remove an outline.
- Every interactive SVG hotspot is a real `<button>` with an accessible name, and
  the explorer supports arrow-key movement between hotspots and Escape to close.
- Contrast is at least 4.5:1 for body text and 3:1 for large text and graphical
  boundaries.
- Every transition carries `motion-reduce:transition-none`, and the only
  autoplaying motion on the site — the homepage hero trace — pauses entirely
  under `prefers-reduced-motion`, showing the completed toolpath instead. It also
  offers a play control so the choice stays the learner's.
- Progress-derived UI renders a fixed-height skeleton until the store has been
  read, so nothing reflows under a reader and nobody is told they have completed
  nothing when the truth is that we have not looked yet.
