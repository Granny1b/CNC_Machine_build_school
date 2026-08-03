"use client";

import Link from "next/link";
import { getLesson } from "@/content/lessons";
import { teachingOrder } from "@/content/curriculum";
import type { ProgressState } from "@/lib/progress";
import { pluralise } from "@/lib/format";

/**
 * Knowledge-check results, read from `state.quizScores` rather than recomputed.
 *
 * A score is stored per lesson slug by `recordQuiz`, so the history is exactly
 * as long as the number of quizzes the learner has actually answered. Rows are
 * ordered by teaching order so the list reads as a route through the course,
 * not as an arbitrary object key order.
 *
 * A score that cannot be resolved to a registered lesson is still shown, with
 * its raw slug: silently dropping a stored result would be a lie about the
 * learner's own record. That case arises if a lesson is renamed or retired.
 */
export interface QuizHistoryProps {
  scores: ProgressState["quizScores"];
}

function percentage(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function QuizHistory({ scores }: QuizHistoryProps) {
  const slugs = Object.keys(scores);
  const ordered = [
    ...teachingOrder.filter((slug) => slug in scores),
    ...slugs.filter((slug) => !teachingOrder.includes(slug)),
  ];

  if (ordered.length === 0) {
    return (
      <p className="measure text-[15px] leading-[1.65] text-ink-soft">
        No knowledge check has been answered on this device yet. Every lesson ends with one, and
        each wrong option explains why it was tempting and where the reasoning breaks &mdash; so
        the useful thing to do with a question you are unsure of is to answer it, not to skip it.
      </p>
    );
  }

  const totals = ordered.reduce(
    (sum, slug) => {
      const score = scores[slug];
      return { correct: sum.correct + score.correct, total: sum.total + score.total };
    },
    { correct: 0, total: 0 },
  );

  return (
    <div>
      <ul className="divide-y divide-rule border-y border-rule">
        {ordered.map((slug) => {
          const lesson = getLesson(slug);
          const score = scores[slug];
          const percent = percentage(score.correct, score.total);
          return (
            <li
              key={slug}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
            >
              <span className="min-w-0 flex-1 basis-48 text-[15px] leading-[1.5]">
                {lesson ? (
                  <Link
                    href={`/learn/${lesson.slug}`}
                    className="text-ink underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue motion-reduce:transition-none"
                  >
                    {lesson.title}
                  </Link>
                ) : (
                  <span className="num text-[14px] text-ink-soft">{slug}</span>
                )}
                {lesson ? (
                  <span className="ml-2 whitespace-nowrap text-[13px] text-ink-soft">
                    Level <span className="num">{String(lesson.level).padStart(2, "0")}</span>
                  </span>
                ) : (
                  <span className="ml-2 text-[13px] text-ink-soft">lesson no longer published</span>
                )}
              </span>
              <span className="flex items-baseline gap-4">
                <span className="num text-[15px] font-medium text-ink">
                  {score.correct} / {score.total}
                </span>
                <span className="num w-12 text-right text-[14px] text-ink-soft">{percent}%</span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
        <span className="num text-ink">{totals.correct}</span> of{" "}
        <span className="num text-ink">{totals.total}</span>{" "}
        {pluralise(totals.total, "question")} answered correctly across{" "}
        <span className="num text-ink">{ordered.length}</span>{" "}
        {pluralise(ordered.length, "quiz", "quizzes")}. A score is a record of one attempt, not a
        verdict on you: re-answering a quiz overwrites it.
      </p>
    </div>
  );
}
