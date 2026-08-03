/**
 * The content contract. SPEC.md section 6.
 *
 * Everything a learner reads is data, not JSX. A lesson is an array of typed
 * blocks; the renderer decides appearance. Authoring stays separate from
 * presentation, and a CMS can be dropped in later without touching components.
 */

/* ---------------- Curriculum skeleton ---------------- */

export type LevelTier = "foundation" | "mechanical" | "control" | "practice";

export interface Level {
  number: number; // 1–20
  slug: string;
  title: string;
  summary: string; // one line a beginner understands cold
  tier: LevelTier;
  lessonSlugs: string[]; // teaching order
  requires: number[]; // prerequisite level numbers
  topics: string[]; // shown on roadmap before lessons exist
  status: "published" | "planned";
}

/* ---------------- Lessons ---------------- */

export interface Lesson {
  slug: string;
  level: number;
  title: string;
  intro: string; // plain-language promise
  minutes: number;
  objectives: string[];
  terms: TermDefinition[];
  blocks: LessonBlock[];
  knowledgeCheck: QuizQuestion[];
  exercise: Exercise;
  summary: string[];
  nextSlug?: string;
}

export interface TermDefinition {
  term: string;
  plain: string;
}

export type LessonBlock =
  | { kind: "prose"; body: string[] }
  | { kind: "heading"; text: string }
  | { kind: "deeper"; title: string; body: string[]; formula?: Formula }
  | { kind: "example"; title: string; body: string[] }
  | { kind: "figure"; figure: FigureId; caption: string }
  | { kind: "mistakes"; items: { wrong: string; why: string }[] }
  | { kind: "safety"; body: string }
  | { kind: "note"; title: string; body: string }
  | { kind: "compare"; title: string; columns: string[]; rows: CompareRow[] }
  | { kind: "formula"; formula: Formula }
  | { kind: "widget"; widget: WidgetId };

export interface CompareRow {
  label: string;
  cells: string[];
}

export interface Formula {
  expression: string; // as it appears on a shop reference card
  variables: { symbol: string; meaning: string; unit: string }[];
  meaning: string; // what it tells you to do differently
}

export type FigureId =
  | "cad-to-part"
  | "axis-triad"
  | "ballscrew"
  | "accuracy-targets"
  | "architectures"
  | "machine-anatomy";

export type WidgetId = "machining-calculator" | "axis-sizing" | "explorer-teaser";

/* ---------------- Assessment ---------------- */

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  teaching: string; // shown once answered, right or wrong
  reviewSlug?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string; // why THIS answer is tempting and where it breaks
}

export interface Exercise {
  title: string;
  body: string;
  steps: string[];
  selfCheck: string[]; // what a good answer contains
}

/* ---------------- Glossary ---------------- */

export interface GlossaryTerm {
  slug: string;
  term: string;
  aliases?: string[]; // e.g. "ballscrew" for "ball screw"
  plain: string;
  technical: string;
  example?: string;
  related: string[];
  lessons: string[];
  tags: GlossaryTag[];
}

export type GlossaryTag =
  | "motion"
  | "cutting"
  | "structure"
  | "control"
  | "electrical"
  | "metrology"
  | "safety"
  | "process";

/* ---------------- Machine explorer ---------------- */

export interface MachineComponent {
  id: string;
  name: string;
  system: "structure" | "motion" | "spindle" | "control" | "auxiliary" | "safety";
  hotspot: { x: number; y: number }; // % coords on the illustration
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
  symptom: string; // the operator's words, not the diagnosis
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
  fitForBrief: string; // why it suits THIS fictional brief or not
  recommended?: boolean;
}
