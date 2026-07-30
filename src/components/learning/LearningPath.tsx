"use client";

import Link from "next/link";
import type { Level } from "@/content/types";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Disclosure } from "@/components/ui/Disclosure";
import { AxisScale } from "@/components/progress/AxisScale";
import { LevelBadge, StatusBadge } from "@/components/progress/LevelBadge";
import { useProgress } from "@/components/progress/ProgressProvider";
import { TIER_ORDER, TOTAL_LEVELS, getLevel, levelsByTier } from "@/content/curriculum";
import { TIER_LABELS, pluralise } from "@/lib/format";

/**
 * The whole route, all twenty levels, grouped by tier. SPEC section 7 and 8.
 *
 * Two rules this page exists to honour:
 *   - the entire route is legible from day one, so a level with no lessons yet
 *     still shows its summary, its prerequisites and its full topic list;
 *   - planned levels read as a roadmap, never as a broken link. A level only
 *     offers lesson links for lessons that actually exist in the registry.
 *
 * It is a client component for one reason: the axis scale and the completion
 * ticks come from the progress context. Lesson titles and minutes are resolved on
 * the server and passed in, so the browser never receives the lesson content just
 * to label a link.
 */

export interface LearningPathProps {
  /** slug → lesson title, for every lesson that exists. */
  lessonTitles: Record<string, string>;
  /** slug → reading time in minutes. */
  lessonMinutes: Record<string, number>;
  /** Total reading time across every written lesson. */
  totalMinutes: number;
}

function pad(n: number): string {
  return String(Math.max(0, Math.round(n))).padStart(2, "0");
}

export function LearningPath({ lessonTitles, lessonMinutes, totalMinutes }: LearningPathProps) {
  const {
    ready,
    currentLevel,
    isLessonComplete,
    lessonsCompletedCount,
    publishedLessonCount,
  } = useProgress();

  return (
    <Container className="py-10 sm:py-14">
      {/* Course position, and the honest size of what is written. */}
      <Card tone="raised">
        <div className="grid gap-8 px-5 py-6 sm:px-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10">
          <div>
            <p className="eyebrow mb-3">Your position on the course</p>
            <AxisScale currentLevel={ready ? currentLevel : 0} totalLevels={TOTAL_LEVELS} />
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 md:pt-1">
            <div>
              <dt className="eyebrow">Levels</dt>
              <dd className="num mt-1 text-[15px] font-medium text-ink">{pad(TOTAL_LEVELS)}</dd>
            </div>
            <div>
              <dt className="eyebrow">Lessons written</dt>
              <dd className="num mt-1 text-[15px] font-medium text-ink">
                {pad(publishedLessonCount)}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Lessons complete</dt>
              <dd className="num mt-1 text-[15px] font-medium text-ink">
                {pad(ready ? lessonsCompletedCount : 0)}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Reading time</dt>
              <dd className="num mt-1 text-[15px] font-medium text-ink">{totalMinutes} min</dd>
            </div>
          </dl>
        </div>
      </Card>

      {TIER_ORDER.map((tier, tierIndex) => {
        const levels = levelsByTier(tier);
        return (
          <section key={tier} className="mt-12 sm:mt-16" aria-labelledby={`tier-${tier}`}>
            <div className="border-b border-rule-strong pb-3">
              <p className="eyebrow">
                Tier <span className="num">{pad(tierIndex + 1)}</span> ·{" "}
                <span className="num">{levels.length}</span> levels
              </p>
              <h2 id={`tier-${tier}`} className="mt-2 text-[24px] font-semibold sm:text-[27px]">
                {TIER_LABELS[tier]}
              </h2>
            </div>

            <ol className="mt-6 space-y-5">
              {levels.map((level) => (
                <LevelCard
                  key={level.number}
                  level={level}
                  lessonTitles={lessonTitles}
                  lessonMinutes={lessonMinutes}
                  isLessonComplete={ready ? isLessonComplete : () => false}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </Container>
  );
}

function LevelCard({
  level,
  lessonTitles,
  lessonMinutes,
  isLessonComplete,
}: {
  level: Level;
  lessonTitles: Record<string, string>;
  lessonMinutes: Record<string, number>;
  isLessonComplete: (slug: string) => boolean;
}) {
  // Only lessons that exist in the registry may become links.
  const lessons = level.lessonSlugs.filter((slug) => lessonTitles[slug]);
  const allComplete = lessons.length > 0 && lessons.every((slug) => isLessonComplete(slug));
  const prerequisites = level.requires
    .map((number) => getLevel(number))
    .filter((required): required is Level => Boolean(required));

  return (
    <Card as="li" tone="raised">
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <LevelBadge level={level.number} complete={allComplete} />
          <StatusBadge status={level.status} />
          {allComplete ? <Badge tone="moss">All lessons complete</Badge> : null}
        </div>

        <h3 className="mt-3 text-[20px] font-semibold sm:text-[22px]">{level.title}</h3>
        <p className="measure mt-2 text-[16px] leading-[1.65] text-ink-soft">{level.summary}</p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Comes after</p>
            {prerequisites.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {prerequisites.map((required) => (
                  <li key={required.number} className="text-[14px] leading-snug text-ink-soft">
                    <span className="num text-[12px] text-ink">
                      Level {pad(required.number)}
                    </span>{" "}
                    · {required.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[14px] leading-snug text-ink-soft">
                Nothing. This is a starting point — it assumes no prior knowledge.
              </p>
            )}
          </div>

          <div>
            <p className="eyebrow">
              {lessons.length > 0 ? "Lessons" : "Lessons for this level"}
            </p>
            {lessons.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {lessons.map((slug) => {
                  const complete = isLessonComplete(slug);
                  return (
                    <li key={slug} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 shrink-0 ${complete ? "text-moss" : "text-rule-strong"}`}
                      >
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path
                            d="M1 5.2 4.2 8.4 11 1.6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="min-w-0 text-[14px] leading-snug">
                        <Link
                          href={`/learn/${slug}`}
                          className="text-ink underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue motion-reduce:transition-none"
                        >
                          {lessonTitles[slug]}
                        </Link>
                        {lessonMinutes[slug] ? (
                          <span className="ml-2 whitespace-nowrap text-ink-soft">
                            <span className="num text-[12px]">{lessonMinutes[slug]}</span> min
                          </span>
                        ) : null}
                        {complete ? <span className="sr-only"> — completed</span> : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
                Not written yet. The topics below are the plan for this level, published here so the
                whole route is visible from the start.
              </p>
            )}
          </div>
        </div>

        <Disclosure
          className="mt-5"
          eyebrow="What this level covers"
          title={`${level.topics.length} ${pluralise(level.topics.length, "topic")} in this level`}
        >
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {level.topics.map((topic, index) => (
              <li key={topic} className="flex gap-3 text-[14px] leading-snug text-ink-soft">
                <span aria-hidden="true" className="num shrink-0 text-[12px] text-ink-faint">
                  {pad(index + 1)}
                </span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </Card>
  );
}
