"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AxisScale } from "@/components/progress/AxisScale";
import { useProgress } from "@/components/progress/ProgressProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { TOTAL_LEVELS, teachingOrder } from "@/content/curriculum";
import { getLesson } from "@/content/lessons";
import { pluralise } from "@/lib/format";

/**
 * The "current progress" panel of SPEC.md section 8, built on the axis scale of
 * section 5.3. It reads the progress context only — never `localStorage` — so a
 * future cloud store drops in without touching this file.
 *
 * The store is read in an effect, so the first paint has no progress to show.
 * Rather than flashing an empty scale, the panel renders a skeleton of exactly
 * the same height until `ready`, which is why every branch shares one shell.
 */

function pad(n: number): string {
  return String(Math.max(0, Math.round(n))).padStart(2, "0");
}

export function ResumeCard() {
  const {
    ready,
    state,
    currentLevel,
    courseFraction,
    lessonsCompletedCount,
    publishedLessonCount,
    isLessonComplete,
  } = useProgress();

  if (!ready) {
    return (
      <Shell>
        <div>
          <p className="sr-only">Loading your saved progress.</p>
          <div aria-hidden="true">
            <div className="h-[11px] w-24 rounded-sm bg-paper-sunk" />
            <div className="mt-3 h-[28px] w-4/5 max-w-[22rem] rounded-sm bg-paper-sunk" />
            <div className="mt-3 h-[15px] w-full max-w-[30rem] rounded-sm bg-paper-sunk" />
            <div className="mt-2 h-[15px] w-2/3 max-w-[20rem] rounded-sm bg-paper-sunk" />
            <div className="mt-5 h-[38px] w-44 rounded-sm bg-paper-sunk" />
          </div>
        </div>
        <div aria-hidden="true" className="md:pt-1">
          <div className="h-[4px] w-full rounded-full bg-paper-sunk" />
          <div className="mt-6 h-[15px] w-40 rounded-sm bg-paper-sunk" />
        </div>
      </Shell>
    );
  }

  const lastVisited = state.lastVisitedSlug ? getLesson(state.lastVisitedSlug) : undefined;
  const nextSlug = teachingOrder.find((slug) => !isLessonComplete(slug));
  const nextLesson = nextSlug ? getLesson(nextSlug) : undefined;
  const resumeLesson = lastVisited ?? nextLesson;
  const started = lessonsCompletedCount > 0 || Boolean(lastVisited);
  const percent = Math.round(courseFraction * 100);

  return (
    <Shell>
      <div>
        <p className="eyebrow">Your position</p>
        <h2 className="mt-2 text-[24px] font-semibold sm:text-[27px]">
          {started ? "Pick up where you left off" : "Start at the beginning"}
        </h2>

        <div className="measure mt-3 space-y-2 text-[15px] leading-[1.65] text-ink-soft">
          {started ? (
            <>
              <p>
                {lastVisited ? (
                  <>
                    You were last reading{" "}
                    <Link
                      href={`/learn/${lastVisited.slug}`}
                      className="font-medium text-blue underline underline-offset-4"
                    >
                      {lastVisited.title}
                    </Link>
                    .{" "}
                  </>
                ) : null}
                {resumeLesson
                  ? "The scale beside this shows where that sits along the twenty levels of the course."
                  : "Every published lesson is complete — the design project is where the whole course comes together."}
              </p>
              {nextLesson && nextLesson.slug !== lastVisited?.slug ? (
                <p>
                  Next in teaching order: <span className="text-ink">{nextLesson.title}</span>.
                </p>
              ) : null}
            </>
          ) : (
            <p>
              Nothing recorded on this device yet. Lesson one assumes you have never stood in
              front of a machine tool: it explains what the three letters mean, which parts do
              what, and where a machine&rsquo;s accuracy actually comes from.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink
            href={resumeLesson ? `/learn/${resumeLesson.slug}` : "/project"}
            size="md"
          >
            {started
              ? resumeLesson
                ? "Continue the course"
                : "Open the design project"
              : "Start lesson one"}
          </ButtonLink>
          <ButtonLink href={started ? "/progress" : "/learn"} variant="secondary" size="md">
            {started ? "Full progress" : "See the learning path"}
          </ButtonLink>
        </div>
      </div>

      <div className="md:pt-1">
        <AxisScale currentLevel={currentLevel} totalLevels={TOTAL_LEVELS} />
        <dl className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <dt className="eyebrow">Lessons complete</dt>
            <dd className="num mt-1 text-[15px] font-medium text-ink">
              {pad(lessonsCompletedCount)} / {pad(publishedLessonCount)}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Published course</dt>
            <dd className="num mt-1 text-[15px] font-medium text-ink">{percent}%</dd>
          </div>
        </dl>
        <p className="mt-3 text-[13px] leading-snug text-ink-faint">
          <span className="num">{publishedLessonCount}</span>{" "}
          {pluralise(publishedLessonCount, "lesson")} are written so far; the remaining levels are
          on the roadmap with their topics listed.
        </p>
      </div>
    </Shell>
  );
}

/**
 * One shell for every branch, with a floor on its height so the panel cannot
 * resize when the stored progress arrives.
 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <Card tone="raised">
      <CardBody className="grid min-h-[19rem] gap-7 py-6 sm:py-7 md:min-h-[12.5rem] md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:gap-10">
        {children}
      </CardBody>
    </Card>
  );
}
