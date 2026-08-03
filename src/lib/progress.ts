/**
 * Progress persistence. SPEC.md section 6.
 *
 * Components never touch `localStorage`. They consume `ProgressProvider`
 * context, which talks to a `ProgressStore`. A future `SupabaseProgressStore`
 * implements the same three methods and drops in without component changes.
 */

export interface ProgressState {
  lessonsCompleted: string[];
  quizScores: Record<string, { correct: number; total: number }>;
  scenarioResults: Record<string, "solved" | "attempted">;
  projectDecisions: Record<string, string>; // stageId -> optionId
  lastVisitedSlug?: string;
  updatedAt: string;
}

export interface ProgressStore {
  load(): Promise<ProgressState>;
  save(next: ProgressState): Promise<void>;
  clear(): Promise<void>;
}

export const STORAGE_KEY = "cnc-academy.progress.v1";

/** The zero state. `updatedAt` is empty until something is actually written. */
export function emptyProgress(): ProgressState {
  return {
    lessonsCompleted: [],
    quizScores: {},
    scenarioResults: {},
    projectDecisions: {},
    updatedAt: "",
  };
}

/**
 * Anything read back from storage is untrusted: it may come from an older
 * schema, a hand-edited value, or a different app on the same origin. Coerce
 * it into a valid `ProgressState` rather than trusting the parse.
 */
export function normalizeProgress(input: unknown): ProgressState {
  const base = emptyProgress();
  if (typeof input !== "object" || input === null) return base;
  const raw = input as Record<string, unknown>;

  if (Array.isArray(raw.lessonsCompleted)) {
    base.lessonsCompleted = Array.from(
      new Set(raw.lessonsCompleted.filter((s): s is string => typeof s === "string")),
    );
  }

  if (typeof raw.quizScores === "object" && raw.quizScores !== null) {
    for (const [key, value] of Object.entries(raw.quizScores as Record<string, unknown>)) {
      if (typeof value !== "object" || value === null) continue;
      const score = value as Record<string, unknown>;
      if (typeof score.correct === "number" && typeof score.total === "number") {
        base.quizScores[key] = { correct: score.correct, total: score.total };
      }
    }
  }

  if (typeof raw.scenarioResults === "object" && raw.scenarioResults !== null) {
    for (const [key, value] of Object.entries(
      raw.scenarioResults as Record<string, unknown>,
    )) {
      if (value === "solved" || value === "attempted") base.scenarioResults[key] = value;
    }
  }

  if (typeof raw.projectDecisions === "object" && raw.projectDecisions !== null) {
    for (const [key, value] of Object.entries(
      raw.projectDecisions as Record<string, unknown>,
    )) {
      if (typeof value === "string") base.projectDecisions[key] = value;
    }
  }

  if (typeof raw.lastVisitedSlug === "string") base.lastVisitedSlug = raw.lastVisitedSlug;
  if (typeof raw.updatedAt === "string") base.updatedAt = raw.updatedAt;

  return base;
}

/**
 * Browser-local adapter. Every method resolves rather than throwing: a learner
 * with storage disabled should still be able to read the whole course, they
 * just will not keep a record of it.
 */
export class LocalProgressStore implements ProgressStore {
  private readonly key: string;

  constructor(key: string = STORAGE_KEY) {
    this.key = key;
  }

  private storage(): Storage | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage;
    } catch {
      // Storage can be blocked entirely by browser settings.
      return null;
    }
  }

  async load(): Promise<ProgressState> {
    const store = this.storage();
    if (!store) return emptyProgress();
    try {
      const raw = store.getItem(this.key);
      if (!raw) return emptyProgress();
      return normalizeProgress(JSON.parse(raw));
    } catch {
      return emptyProgress();
    }
  }

  async save(next: ProgressState): Promise<void> {
    const store = this.storage();
    if (!store) return;
    try {
      store.setItem(this.key, JSON.stringify(next));
    } catch {
      // Quota exceeded or storage blocked. Progress is a convenience, not a
      // prerequisite for reading the course, so this stays silent.
    }
  }

  async clear(): Promise<void> {
    const store = this.storage();
    if (!store) return;
    try {
      store.removeItem(this.key);
    } catch {
      // As above.
    }
  }
}
