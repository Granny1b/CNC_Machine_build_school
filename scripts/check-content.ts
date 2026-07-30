/**
 * Content integrity check — the machine-readable half of SPEC.md section 15.
 *
 * Typecheck proves the content has the right SHAPE. This proves it has the right
 * CONTENT: that cross-references resolve, that every pedagogical section is
 * present, that no quiz hides behind a generic "incorrect", and that no
 * placeholder text survived.
 *
 * Run with: npm run check:content
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { curriculum, TOTAL_LEVELS, teachingOrder } from "../src/content/curriculum";
import { lessons, getLesson } from "../src/content/lessons";
import { glossary } from "../src/content/glossary";
import { machineComponents } from "../src/content/machine-components";
import { scenarios } from "../src/content/scenarios";
import { projectStages } from "../src/content/project";
import type { Lesson, LessonBlock } from "../src/content/types";

const problems: string[] = [];
const notes: string[] = [];

function fail(area: string, message: string) {
  problems.push(`${area}: ${message}`);
}

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

const levelNumbers = new Set(curriculum.map((l) => l.number));

if (curriculum.length !== 20) {
  fail("curriculum", `expected 20 levels, found ${curriculum.length}`);
}
if (TOTAL_LEVELS !== curriculum.length) {
  fail("curriculum", "TOTAL_LEVELS disagrees with the curriculum array");
}

const seenLevelNumbers = new Set<number>();
const seenLevelSlugs = new Set<string>();
for (const level of curriculum) {
  if (seenLevelNumbers.has(level.number)) fail("curriculum", `duplicate level number ${level.number}`);
  seenLevelNumbers.add(level.number);

  if (seenLevelSlugs.has(level.slug)) fail("curriculum", `duplicate level slug "${level.slug}"`);
  seenLevelSlugs.add(level.slug);

  if (level.number < 1 || level.number > 20) {
    fail("curriculum", `level number ${level.number} is outside 1-20`);
  }
  if (level.topics.length === 0) {
    fail("curriculum", `level ${level.number} has no topics; SPEC 7 requires full topic arrays`);
  }
  if (!level.summary.trim()) fail("curriculum", `level ${level.number} has no summary`);

  for (const req of level.requires) {
    if (!levelNumbers.has(req)) {
      fail("curriculum", `level ${level.number} requires level ${req}, which does not exist`);
    }
    if (req === level.number) fail("curriculum", `level ${level.number} requires itself`);
  }

  const expected = level.lessonSlugs.length > 0 ? "published" : "planned";
  if (level.status !== expected) {
    fail(
      "curriculum",
      `level ${level.number} is "${level.status}" but has ${level.lessonSlugs.length} lessons; expected "${expected}"`,
    );
  }
}

// Prerequisite graph must be acyclic, or the learning path can deadlock.
const requiresOf = new Map(curriculum.map((l) => [l.number, l.requires]));
const cycleState = new Map<number, "visiting" | "done">();
function walk(n: number, trail: number[]): void {
  const state = cycleState.get(n);
  if (state === "done") return;
  if (state === "visiting") {
    fail("curriculum", `prerequisite cycle: ${[...trail, n].join(" -> ")}`);
    return;
  }
  cycleState.set(n, "visiting");
  for (const req of requiresOf.get(n) ?? []) walk(req, [...trail, n]);
  cycleState.set(n, "done");
}
for (const level of curriculum) walk(level.number, []);

/* ------------------------------------------------------------------ */
/* Lessons                                                             */
/* ------------------------------------------------------------------ */

const lessonSlugs = new Set(lessons.map((l) => l.slug));
const REQUIRED_BLOCK_KINDS: LessonBlock["kind"][] = [
  "heading",
  "prose",
  "figure",
  "example",
  "deeper",
  "mistakes",
  "note",
  "compare",
  "formula",
];

if (lessons.length !== 7) {
  fail("lessons", `SPEC 7 specifies seven Phase 1 lessons, found ${lessons.length}`);
}

// The registry order is the teaching order the curriculum advertises.
const registryOrder = lessons.map((l) => l.slug).join(",");
if (registryOrder !== teachingOrder.join(",")) {
  fail("lessons", "registry order does not match curriculum.teachingOrder");
}

for (const level of curriculum) {
  for (const slug of level.lessonSlugs) {
    if (!lessonSlugs.has(slug)) {
      fail("lessons", `level ${level.number} lists lesson "${slug}", which is not registered`);
      continue;
    }
    const lesson = getLesson(slug)!;
    if (lesson.level !== level.number) {
      fail("lessons", `"${slug}" claims level ${lesson.level} but is listed under level ${level.number}`);
    }
  }
}

for (const lesson of lessons) {
  const where = `lesson "${lesson.slug}"`;

  if (!levelNumbers.has(lesson.level)) fail("lessons", `${where} sits on non-existent level ${lesson.level}`);

  const owning = curriculum.find((l) => l.number === lesson.level);
  if (owning && !owning.lessonSlugs.includes(lesson.slug)) {
    fail("lessons", `${where} is not listed in level ${lesson.level}'s lessonSlugs`);
  }

  // The eleven pedagogical sections of SPEC 7.
  if (!lesson.intro.trim()) fail("lessons", `${where} has no intro`);
  if (lesson.objectives.length < 3) fail("lessons", `${where} has ${lesson.objectives.length} objectives, expected 3+`);
  if (lesson.terms.length < 4) fail("lessons", `${where} defines only ${lesson.terms.length} terms`);
  if (lesson.blocks.length < 10) fail("lessons", `${where} has only ${lesson.blocks.length} blocks`);
  if (lesson.knowledgeCheck.length < 3) fail("lessons", `${where} has ${lesson.knowledgeCheck.length} quiz questions`);
  if (!lesson.exercise.title.trim() || lesson.exercise.steps.length < 3) {
    fail("lessons", `${where} has an incomplete exercise`);
  }
  if (lesson.exercise.selfCheck.length < 3) fail("lessons", `${where} exercise has too few selfCheck points`);
  if (lesson.summary.length < 3) fail("lessons", `${where} has ${lesson.summary.length} summary lines`);

  for (const term of lesson.terms) {
    if (!term.term.trim() || !term.plain.trim()) fail("lessons", `${where} has an empty term definition`);
  }

  const kinds = new Set(lesson.blocks.map((b) => b.kind));
  for (const required of REQUIRED_BLOCK_KINDS) {
    if (!kinds.has(required)) fail("lessons", `${where} is missing a "${required}" block`);
  }

  // nextSlug must resolve, and only the last lesson may omit it.
  const isLast = lessons[lessons.length - 1].slug === lesson.slug;
  if (lesson.nextSlug) {
    if (!lessonSlugs.has(lesson.nextSlug)) {
      fail("lessons", `${where} points nextSlug at "${lesson.nextSlug}", which is not registered`);
    }
    if (lesson.nextSlug === lesson.slug) fail("lessons", `${where} points nextSlug at itself`);
  } else if (!isLast) {
    fail("lessons", `${where} has no nextSlug but is not the last lesson`);
  }

  for (const block of lesson.blocks) {
    switch (block.kind) {
      case "prose":
        if (block.body.length === 0 || block.body.some((p) => !p.trim())) {
          fail("lessons", `${where} has an empty prose paragraph`);
        }
        break;
      case "compare": {
        if (block.columns.length === 0) fail("lessons", `${where} compare "${block.title}" has no columns`);
        for (const row of block.rows) {
          if (row.cells.length !== block.columns.length) {
            fail(
              "lessons",
              `${where} compare "${block.title}" row "${row.label}" has ${row.cells.length} cells for ${block.columns.length} columns`,
            );
          }
        }
        break;
      }
      case "formula":
      case "deeper": {
        const formula = block.kind === "formula" ? block.formula : block.formula;
        if (formula) {
          if (!formula.expression.trim()) fail("lessons", `${where} has a formula with no expression`);
          if (formula.variables.length === 0) fail("lessons", `${where} has a formula with no variables`);
          for (const v of formula.variables) {
            if (!v.symbol.trim() || !v.meaning.trim() || !v.unit.trim()) {
              fail("lessons", `${where} formula variable "${v.symbol}" is missing symbol, meaning or unit`);
            }
          }
          if (!formula.meaning.trim()) fail("lessons", `${where} has a formula with no meaning line`);
        }
        break;
      }
      case "mistakes":
        if (block.items.length < 2) fail("lessons", `${where} mistakes block has fewer than 2 items`);
        for (const item of block.items) {
          if (!item.wrong.trim() || !item.why.trim()) fail("lessons", `${where} has an incomplete mistake item`);
        }
        break;
      case "safety":
        if (!block.body.trim()) fail("lessons", `${where} has an empty safety block`);
        break;
      case "note":
        if (!block.title.trim() || !block.body.trim()) fail("lessons", `${where} has an incomplete note block`);
        break;
      case "example":
        if (!block.title.trim() || block.body.length === 0) fail("lessons", `${where} has an incomplete example`);
        break;
      case "heading":
        if (!block.text.trim()) fail("lessons", `${where} has an empty heading`);
        break;
      case "figure":
        if (!block.caption.trim()) fail("lessons", `${where} has a figure with no caption`);
        break;
      case "widget":
        break;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Quizzes — SPEC rule 8: wrong answers teach                          */
/* ------------------------------------------------------------------ */

const GENERIC_FEEDBACK = /^(that'?s )?(in)?correct\.?$|^wrong\.?$|^no\.?$|^yes\.?$|^right\.?$|^try again\.?$/i;

function checkQuiz(lesson: Lesson) {
  const seenIds = new Set<string>();
  for (const question of lesson.knowledgeCheck) {
    const where = `lesson "${lesson.slug}" question "${question.id}"`;

    if (seenIds.has(question.id)) fail("quiz", `${where} has a duplicate id`);
    seenIds.add(question.id);

    if (!question.prompt.trim()) fail("quiz", `${where} has no prompt`);
    if (!question.teaching.trim()) fail("quiz", `${where} has no teaching text`);
    if (question.options.length < 3) fail("quiz", `${where} has only ${question.options.length} options`);

    const correct = question.options.filter((o) => o.correct);
    if (correct.length !== 1) fail("quiz", `${where} has ${correct.length} correct options, expected exactly 1`);

    const optionIds = new Set<string>();
    for (const option of question.options) {
      if (optionIds.has(option.id)) fail("quiz", `${where} option id "${option.id}" is duplicated`);
      optionIds.add(option.id);

      if (!option.text.trim()) fail("quiz", `${where} option "${option.id}" has no text`);

      const feedback = option.feedback.trim();
      if (!feedback) {
        fail("quiz", `${where} option "${option.id}" has no feedback — SPEC rule 8`);
      } else if (GENERIC_FEEDBACK.test(feedback)) {
        fail("quiz", `${where} option "${option.id}" has generic feedback "${feedback}" — SPEC rule 8`);
      } else if (feedback.length < 40) {
        fail(
          "quiz",
          `${where} option "${option.id}" feedback is ${feedback.length} chars; too short to explain where the reasoning breaks`,
        );
      }
    }

    if (question.reviewSlug && !lessonSlugs.has(question.reviewSlug)) {
      fail("quiz", `${where} reviewSlug "${question.reviewSlug}" is not a registered lesson`);
    }
  }
}

for (const lesson of lessons) checkQuiz(lesson);

/* ------------------------------------------------------------------ */
/* Glossary                                                            */
/* ------------------------------------------------------------------ */

const glossarySlugs = new Set(glossary.map((t) => t.slug));

if (glossary.length < 40) {
  fail("glossary", `SPEC 15 requires at least 40 terms, found ${glossary.length}`);
}

const surfaceOwners = new Map<string, string>();
for (const term of glossary) {
  const where = `glossary "${term.slug}"`;

  if (!term.plain.trim()) fail("glossary", `${where} has no plain definition`);
  if (!term.technical.trim()) fail("glossary", `${where} has no technical definition`);
  if (term.plain.trim() === term.technical.trim()) {
    fail("glossary", `${where} has identical plain and technical text`);
  }
  if (term.tags.length === 0) fail("glossary", `${where} has no tags`);
  if (term.slug !== term.slug.toLowerCase() || /[^a-z0-9-]/.test(term.slug)) {
    fail("glossary", `${where} is not kebab-case`);
  }

  for (const related of term.related) {
    if (!glossarySlugs.has(related)) fail("glossary", `${where} relates to "${related}", which does not exist`);
    if (related === term.slug) fail("glossary", `${where} relates to itself`);
  }
  for (const slug of term.lessons) {
    if (!lessonSlugs.has(slug)) fail("glossary", `${where} cites lesson "${slug}", which is not registered`);
  }

  // Two entries claiming the same surface form makes auto-linking arbitrary.
  for (const surface of [term.term, ...(term.aliases ?? [])]) {
    const key = surface.trim().toLowerCase();
    const owner = surfaceOwners.get(key);
    if (owner && owner !== term.slug) {
      fail("glossary", `surface form "${surface}" is claimed by both "${owner}" and "${term.slug}"`);
    }
    surfaceOwners.set(key, term.slug);
  }
}

/* ------------------------------------------------------------------ */
/* Machine explorer                                                    */
/* ------------------------------------------------------------------ */

const REQUIRED_COMPONENT_IDS = [
  "base", "bed", "column", "gantry", "table", "saddle", "spindle", "tool-holder",
  "linear-rails", "bearing-blocks", "ball-screw", "ball-screw-supports", "servo-motor",
  "coupling", "encoder", "lubrication-system", "coolant-system", "tool-changer",
  "electrical-cabinet", "cnc-controller", "safety-enclosure", "doors", "sensors",
  "chip-conveyor",
];

const componentIds = new Set(machineComponents.map((c) => c.id));

if (machineComponents.length !== 24) {
  fail("explorer", `SPEC 10 requires 24 components, found ${machineComponents.length}`);
}
for (const id of REQUIRED_COMPONENT_IDS) {
  if (!componentIds.has(id)) fail("explorer", `required component "${id}" is missing`);
}

const hotspots: { id: string; x: number; y: number }[] = [];
for (const component of machineComponents) {
  const where = `component "${component.id}"`;

  if (!component.plain.trim()) fail("explorer", `${where} has no plain explanation`);
  if (!component.engineering.trim()) fail("explorer", `${where} has no engineering explanation`);
  if (component.parameters.length < 3) fail("explorer", `${where} has ${component.parameters.length} parameters`);
  if (component.failureModes.length < 3) fail("explorer", `${where} has ${component.failureModes.length} failure modes`);
  if (component.lessons.length === 0) fail("explorer", `${where} links to no lessons`);
  if (component.glossary.length === 0) fail("explorer", `${where} links to no glossary terms`);

  for (const p of component.parameters) {
    if (!p.label.trim() || !p.value.trim()) fail("explorer", `${where} has an empty parameter`);
  }
  for (const slug of component.lessons) {
    if (!lessonSlugs.has(slug)) fail("explorer", `${where} cites lesson "${slug}", which is not registered`);
  }
  for (const slug of component.glossary) {
    if (!glossarySlugs.has(slug)) fail("explorer", `${where} cites glossary "${slug}", which does not exist`);
  }

  const { x, y } = component.hotspot;
  if (x < 0 || x > 100 || y < 0 || y > 100) {
    fail("explorer", `${where} hotspot (${x}, ${y}) is outside 0-100%`);
  }
  hotspots.push({ id: component.id, x, y });
}

// Overlapping hotspots make the drawing unclickable, whatever the data says.
for (let i = 0; i < hotspots.length; i += 1) {
  for (let j = i + 1; j < hotspots.length; j += 1) {
    const a = hotspots[i];
    const b = hotspots[j];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (distance < 2.5) {
      fail("explorer", `hotspots "${a.id}" and "${b.id}" are ${distance.toFixed(1)}% apart and will overlap`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Scenarios                                                           */
/* ------------------------------------------------------------------ */

if (scenarios.length === 0) {
  fail("scenarios", "SPEC 11 requires at least one complete scenario");
}

for (const scenario of scenarios) {
  const where = `scenario "${scenario.id}"`;
  if (!scenario.symptom.trim()) fail("scenarios", `${where} has no symptom`);
  if (scenario.context.length === 0) fail("scenarios", `${where} has no context`);
  if (!scenario.resolution.trim()) fail("scenarios", `${where} has no resolution`);
  if (scenario.steps.length < 3) fail("scenarios", `${where} has only ${scenario.steps.length} steps`);

  const stepIds = new Set<string>();
  for (const step of scenario.steps) {
    if (stepIds.has(step.id)) fail("scenarios", `${where} step id "${step.id}" is duplicated`);
    stepIds.add(step.id);

    if (!step.question.trim()) fail("scenarios", `${where} step "${step.id}" has no question`);
    if (step.options.length < 2) fail("scenarios", `${where} step "${step.id}" has fewer than 2 options`);

    // SPEC 11: every option returns a response, including the wrong ones.
    for (const option of step.options) {
      if (!option.text.trim()) fail("scenarios", `${where} step "${step.id}" has an option with no text`);
      if (!option.response.trim()) {
        fail("scenarios", `${where} step "${step.id}" option "${option.id}" has no response`);
      } else if (option.response.trim().length < 40) {
        fail(
          "scenarios",
          `${where} step "${step.id}" option "${option.id}" response is too short to say what the step would have told you`,
        );
      }
    }

    const verdicts = new Set(step.options.map((o) => o.verdict));
    if (verdicts.size < 2) {
      notes.push(`${where} step "${step.id}" grades every option the same; the cost distinction is the point`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Design project                                                      */
/* ------------------------------------------------------------------ */

if (projectStages.length !== 20) {
  fail("project", `SPEC 12 requires 20 stages, found ${projectStages.length}`);
}

const stageIds = new Set<string>();
for (const stage of projectStages) {
  const where = `project stage ${stage.number} ("${stage.id}")`;

  if (stageIds.has(stage.id)) fail("project", `${where} has a duplicate id`);
  stageIds.add(stage.id);

  if (!stage.title.trim()) fail("project", `${where} has no title`);
  // SPEC 12: no stage may be empty.
  if (stage.brief.trim().length < 120) {
    fail("project", `${where} brief is ${stage.brief.trim().length} chars; no stage may be empty`);
  }

  if (stage.number <= 10 && !stage.decision) {
    fail("project", `${where} must carry complete decision data in Phase 1`);
  }

  if (stage.decision) {
    const decision = stage.decision;
    if (!decision.question.trim()) fail("project", `${where} decision has no question`);
    if (decision.options.length < 2) fail("project", `${where} decision has fewer than 2 options`);

    const recommended = decision.options.filter((o) => o.recommended);
    if (recommended.length > 1) {
      fail("project", `${where} marks ${recommended.length} options recommended; at most one`);
    }

    const optionIds = new Set<string>();
    for (const option of decision.options) {
      if (optionIds.has(option.id)) fail("project", `${where} option id "${option.id}" is duplicated`);
      optionIds.add(option.id);

      if (option.benefits.length < 2) fail("project", `${where} option "${option.id}" has too few benefits`);
      // A straw man has no drawbacks. Every real option costs something.
      if (option.drawbacks.length < 2) fail("project", `${where} option "${option.id}" has too few drawbacks`);

      for (const field of ["name", "cost", "performance", "safety", "maintenance", "fitForBrief"] as const) {
        if (!option[field].trim()) {
          fail("project", `${where} option "${option.id}" is missing ${field}`);
        }
      }
    }
  }
}

const stageNumbers = projectStages.map((s) => s.number).sort((a, b) => a - b);
for (let i = 0; i < stageNumbers.length; i += 1) {
  if (stageNumbers[i] !== i + 1) {
    fail("project", `stage numbers are not 1-20 without gaps (found ${stageNumbers.join(",")})`);
    break;
  }
}

/* ------------------------------------------------------------------ */
/* No placeholder text anywhere — SPEC 15                              */
/* ------------------------------------------------------------------ */

const PLACEHOLDER = [
  /lorem ipsum/i,
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bXXX\b/,
  /placeholder text/i,
  /coming soon/i,
  /tbd\b/i,
  /\bfoo bar\b/i,
];

/** /simulator is required by SPEC 8 to declare itself in development. */
const HONEST_EXCEPTIONS = ["src/app/simulator/page.tsx", "src/components/layout/nav.ts"];

function walkFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else if (/\.(ts|tsx|css|md)$/.test(entry)) out.push(full);
  }
  return out;
}

// npm run executes from the package root, so cwd is the repo root. Using cwd
// rather than import.meta keeps this file agnostic about ESM versus CJS.
const repoRoot = process.cwd();
for (const file of walkFiles(join(repoRoot, "src"))) {
  const rel = relative(repoRoot, file);
  if (HONEST_EXCEPTIONS.includes(rel)) continue;
  const text = readFileSync(file, "utf8");
  for (const pattern of PLACEHOLDER) {
    const match = text.match(pattern);
    if (match) fail("placeholder", `${rel} contains "${match[0]}"`);
  }
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const summary = [
  `levels            ${curriculum.length}`,
  `lessons           ${lessons.length}`,
  `lesson blocks     ${lessons.reduce((n, l) => n + l.blocks.length, 0)}`,
  `quiz questions    ${lessons.reduce((n, l) => n + l.knowledgeCheck.length, 0)}`,
  `quiz options      ${lessons.reduce((n, l) => n + l.knowledgeCheck.reduce((m, q) => m + q.options.length, 0), 0)}`,
  `glossary terms    ${glossary.length}`,
  `explorer parts    ${machineComponents.length}`,
  `scenarios         ${scenarios.length} (${scenarios.reduce((n, s) => n + s.steps.length, 0)} steps)`,
  `project stages    ${projectStages.length} (${projectStages.filter((s) => s.decision).length} with decisions)`,
];

console.log("\nCNC Academy content check\n");
for (const line of summary) console.log(`  ${line}`);

if (notes.length > 0) {
  console.log(`\n  ${notes.length} note(s):`);
  for (const note of notes) console.log(`    - ${note}`);
}

if (problems.length > 0) {
  console.error(`\n  ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`    x ${problem}`);
  console.error("");
  process.exit(1);
}

console.log("\n  All content checks passed.\n");
