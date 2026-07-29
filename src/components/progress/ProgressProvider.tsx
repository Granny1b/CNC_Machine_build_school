"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  LocalProgressStore,
  emptyProgress,
  type ProgressState,
  type ProgressStore,
} from "@/lib/progress";
import { curriculum, teachingOrder } from "@/content/curriculum";

export interface ProgressContextValue {
  state: ProgressState;
  /** False until the store has been read, so the UI can avoid a flash of "0%". */
  ready: boolean;
  toggleLesson(slug: string, complete?: boolean): void;
  isLessonComplete(slug: string): boolean;
  recordQuiz(lessonSlug: string, correct: number, total: number): void;
  recordScenario(id: string, result: "solved" | "attempted"): void;
  setProjectDecision(stageId: string, optionId: string): void;
  setLastVisited(slug: string): void;
  reset(): void;
  /** 0–1 across all published lessons. */
  courseFraction: number;
  /** Highest level number with at least one completed lesson, else 0. */
  currentLevel: number;
  lessonsCompletedCount: number;
  publishedLessonCount: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const defaultStore = new LocalProgressStore();

export function ProgressProvider({
  children,
  store = defaultStore,
}: {
  children: ReactNode;
  store?: ProgressStore;
}) {
  const [state, setState] = useState<ProgressState>(emptyProgress);
  const [ready, setReady] = useState(false);
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    let cancelled = false;
    storeRef.current.load().then((loaded) => {
      if (!cancelled) {
        setState(loaded);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Single write path: stamp `updatedAt` and persist, never mutating in place. */
  const commit = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = { ...updater(prev), updatedAt: new Date().toISOString() };
      void storeRef.current.save(next);
      return next;
    });
  }, []);

  const toggleLesson = useCallback(
    (slug: string, complete?: boolean) => {
      commit((prev) => {
        const has = prev.lessonsCompleted.includes(slug);
        const shouldHave = complete ?? !has;
        if (has === shouldHave) return prev;
        return {
          ...prev,
          lessonsCompleted: shouldHave
            ? [...prev.lessonsCompleted, slug]
            : prev.lessonsCompleted.filter((s) => s !== slug),
        };
      });
    },
    [commit],
  );

  const recordQuiz = useCallback(
    (lessonSlug: string, correct: number, total: number) => {
      commit((prev) => ({
        ...prev,
        quizScores: { ...prev.quizScores, [lessonSlug]: { correct, total } },
      }));
    },
    [commit],
  );

  const recordScenario = useCallback(
    (id: string, result: "solved" | "attempted") => {
      commit((prev) => {
        // Never downgrade a solved scenario back to merely attempted.
        if (prev.scenarioResults[id] === "solved" && result === "attempted") return prev;
        return { ...prev, scenarioResults: { ...prev.scenarioResults, [id]: result } };
      });
    },
    [commit],
  );

  const setProjectDecision = useCallback(
    (stageId: string, optionId: string) => {
      commit((prev) => ({
        ...prev,
        projectDecisions: { ...prev.projectDecisions, [stageId]: optionId },
      }));
    },
    [commit],
  );

  const setLastVisited = useCallback(
    (slug: string) => {
      commit((prev) => (prev.lastVisitedSlug === slug ? prev : { ...prev, lastVisitedSlug: slug }));
    },
    [commit],
  );

  const reset = useCallback(() => {
    const fresh = emptyProgress();
    setState(fresh);
    void storeRef.current.clear();
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const publishedLessonCount = teachingOrder.length;
    const completed = state.lessonsCompleted.filter((s) => teachingOrder.includes(s));
    const levelOf = new Map<string, number>();
    for (const level of curriculum) {
      for (const slug of level.lessonSlugs) levelOf.set(slug, level.number);
    }
    const currentLevel = completed.reduce((max, slug) => {
      const n = levelOf.get(slug);
      return n && n > max ? n : max;
    }, 0);

    return {
      state,
      ready,
      toggleLesson,
      isLessonComplete: (slug: string) => state.lessonsCompleted.includes(slug),
      recordQuiz,
      recordScenario,
      setProjectDecision,
      setLastVisited,
      reset,
      courseFraction: publishedLessonCount === 0 ? 0 : completed.length / publishedLessonCount,
      currentLevel,
      lessonsCompletedCount: completed.length,
      publishedLessonCount,
    };
  }, [
    state,
    ready,
    toggleLesson,
    recordQuiz,
    recordScenario,
    setProjectDecision,
    setLastVisited,
    reset,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
