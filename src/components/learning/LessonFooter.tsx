"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AxisScale } from "@/components/progress/AxisScale";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { TOTAL_LEVELS } from "@/content/curriculum";
import { getLesson } from "@/content/lessons";
import { pluralise } from "@/lib/format";

/**
 * The foot of a lesson: mark it complete, see where that puts you on the course
 * axis, and go to the next lesson.
 *
 * Progress is read and written through the context only, never `localStorage`
 * directly, so the future cloud store of SPEC section 6 drops in underneath
 * without this file changing.
 *
 * `setLastVisited` waits for `ready`. Writing before the store has been read
 * would be overwritten the moment the load resolves.
 */
function pad(n: number): string {
  return String(Math.max(0, Math.round(n))).padStart(2, "0");
}

export interface LessonFooterProps {
  slug: string;
  /** The lesson this one hands over to, from the content's own `nextSlug`. */
  nextSlug?: string;
}

export function LessonFooter({ slug, nextSlug }: LessonFooterProps) {
  const {
    ready,
    toggleLesson,
    isLessonComplete,
    setLastVisited,
    currentLevel,
    courseFraction,
    lessonsCompletedCount,
    publishedLessonCount,
  } = useProgress();

  useEffect(() => {
    if (ready) setLastVisited(slug);
  }, [ready, slug, setLastVisited]);

  const complete = ready && isLessonComplete(slug);
  const next = nextSlug ? getLesson(nextSlug) : undefined;
  const percent = Math.round(courseFraction * 100);

  return (
    <Card as="section" tone="raised">
      <CardBody className="grid gap-8 py-6 sm:py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:gap-10">
        <div>
          <p className="eyebrow">Finished reading?</p>
          <h2 className="mt-2 text-[20px] font-semibold sm:text-[22px]">
            {complete ? "Marked complete" : "Mark this lesson complete"}
          </h2>
          <p className="measure mt-2 text-[15px] leading-[1.65] text-ink-soft">
            Completion is yours to declare: it moves the carriage on the course axis and decides
            what the site suggests next. It is stored on this device only, and you can undo it at
            any time.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant={complete ? "secondary" : "primary"}
              aria-pressed={complete}
              disabled={!ready}
              onClick={() => toggleLesson(slug)}
            >
              {complete ? "Undo complete" : "Mark complete"}
            </Button>
            <span aria-live="polite" className="text-[14px] text-ink-soft">
              {!ready
                ? "Reading your saved progress…"
                : complete
                  ? "Saved on this device."
                  : "Nothing saved for this lesson yet."}
            </span>
          </div>

          <div className="mt-6 border-t border-rule pt-5">
            {next ? (
              <>
                <p className="eyebrow">Next lesson</p>
                <p className="mt-1.5">
                  <Link
                    href={`/learn/${next.slug}`}
                    className="font-display text-[19px] font-semibold tracking-tightest text-ink underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue motion-reduce:transition-none"
                  >
                    {next.title}
                  </Link>
                </p>
                <p className="measure mt-1.5 text-[14px] leading-snug text-ink-soft">
                  Level {pad(next.level)} · <span className="num">{next.minutes}</span> min
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ButtonLink href={`/learn/${next.slug}`}>Continue</ButtonLink>
                  <ButtonLink href="/learn" variant="secondary">
                    Learning path
                  </ButtonLink>
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow">End of the written sequence</p>
                <p className="measure mt-1.5 text-[15px] leading-[1.65] text-ink-soft">
                  This is the last lesson written so far. The learning path shows every level with
                  its topics, and the design project is where all of it is put to work.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ButtonLink href="/project">Open the design project</ButtonLink>
                  <ButtonLink href="/learn" variant="secondary">
                    Learning path
                  </ButtonLink>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="md:pt-1">
          <p className="eyebrow mb-3">Your position on the course</p>
          <AxisScale currentLevel={ready ? currentLevel : 0} totalLevels={TOTAL_LEVELS} />
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dt className="eyebrow">Lessons complete</dt>
              <dd className="num mt-1 text-[15px] font-medium text-ink">
                {pad(ready ? lessonsCompletedCount : 0)} / {pad(publishedLessonCount)}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Published course</dt>
              <dd className="num mt-1 text-[15px] font-medium text-ink">
                {ready ? percent : 0}%
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[13px] leading-snug text-ink-soft">
            <span className="num">{publishedLessonCount}</span>{" "}
            {pluralise(publishedLessonCount, "lesson")} written so far. The graduations are the
            twenty levels of the course; the carriage is where your completed work reaches.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
