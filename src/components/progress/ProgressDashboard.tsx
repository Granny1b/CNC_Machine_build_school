"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AxisScale } from "@/components/progress/AxisScale";
import { LevelBadge } from "@/components/progress/LevelBadge";
import { QuizHistory } from "@/components/progress/QuizHistory";
import { ResetProgress } from "@/components/progress/ResetProgress";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { TOTAL_LEVELS, curriculum, teachingOrder } from "@/content/curriculum";
import { getLesson } from "@/content/lessons";
import { getScenario, scenarios } from "@/content/scenarios";
import { projectStages } from "@/content/project";
import { TIER_LABELS, pluralise } from "@/lib/format";

/**
 * The progress page's working parts. SPEC.md section 8.
 *
 * Everything here comes from `useProgress()` and from the content registries.
 * The component never touches `localStorage`, so the cloud store of SPEC
 * section 6 drops in underneath without this file changing.
 *
 * The store is read in an effect, so the first paint has nothing saved to show.
 * Rather than flashing an empty record — which reads as "you have done nothing"
 * rather than "we have not looked yet" — every progress-derived region renders a
 * fixed-height skeleton until `ready`. The static half of the page (which
 * lessons exist, what they cost in minutes, which levels are written) is known
 * without the store and is rendered immediately, with its controls disabled.
 */

const PUBLISHED_LEVELS = curriculum.filter((level) => level.status === "published");
const PLANNED_LEVELS = curriculum.filter((level) => level.status === "planned");
const DECISION_STAGES = projectStages.filter((stage) => stage.decision);

function pad(n: number): string {
  return String(Math.max(0, Math.round(n))).padStart(2, "0");
}

/** A section with a mono eyebrow, a heading and a hairline rule above it. */
function Section({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-rule-strong pt-8">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-[22px] font-semibold sm:text-[26px]">{title}</h2>
      {intro ? (
        <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">{intro}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Fixed-height stand-in for a region that cannot be drawn until the store is read. */
function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div>
      <p className="sr-only">Reading your saved progress.</p>
      <div aria-hidden="true" className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-[19px] rounded-sm bg-paper-sunk" style={{ width: `${88 - i * 11}%` }} />
        ))}
      </div>
    </div>
  );
}

/**
 * `pending` is not the same as zero. Until the store has been read, the figure is
 * unknown, and printing "00 / 07" would be a statement about the learner rather
 * than about the load.
 */
function Stat({
  label,
  value,
  note,
  pending = false,
}: {
  label: string;
  value: string;
  note?: string;
  pending?: boolean;
}) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      {pending ? (
        <dd className="mt-1">
          <span aria-hidden="true" className="block h-[19px] w-16 rounded-sm bg-paper-sunk" />
        </dd>
      ) : (
        <dd className="num mt-1 text-[19px] font-medium text-ink">{value}</dd>
      )}
      {note ? <p className="mt-1 text-[13px] leading-snug text-ink-faint">{note}</p> : null}
    </div>
  );
}

export function ProgressDashboard() {
  const {
    state,
    ready,
    toggleLesson,
    isLessonComplete,
    currentLevel,
    courseFraction,
    lessonsCompletedCount,
    publishedLessonCount,
  } = useProgress();

  const percent = Math.round(courseFraction * 100);
  const lastVisited = state.lastVisitedSlug ? getLesson(state.lastVisitedSlug) : undefined;
  const quizCount = Object.keys(state.quizScores).length;
  const scenarioIds = Object.keys(state.scenarioResults);
  const solvedCount = scenarioIds.filter((id) => state.scenarioResults[id] === "solved").length;
  const decided = DECISION_STAGES.filter((stage) => {
    const saved = state.projectDecisions[stage.id];
    return saved && stage.decision?.options.some((option) => option.id === saved);
  });

  return (
    <div className="space-y-10">
      {/* ---------------------------------------------- position on the course */}
      <Card tone="raised">
        <CardBody className="grid min-h-[16rem] gap-8 py-6 sm:py-7 md:min-h-[11rem] md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-10">
          <div>
            <p className="eyebrow mb-3">Your position on the course</p>
            {ready ? (
              <AxisScale currentLevel={currentLevel} totalLevels={TOTAL_LEVELS} />
            ) : (
              <div className="py-4">
                <p className="sr-only">Reading your saved progress.</p>
                <div aria-hidden="true">
                  <div className="h-[4px] w-full rounded-full bg-paper-sunk" />
                  <div className="mt-6 h-[13px] w-40 rounded-sm bg-paper-sunk" />
                </div>
              </div>
            )}
            <p className="mt-4 text-[13px] leading-snug text-ink-soft">
              The graduations are the twenty levels of the course. The carriage sits at the furthest
              level where you have completed a lesson.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat
              pending={!ready}
              label="Lessons complete"
              value={`${pad(lessonsCompletedCount)} / ${pad(publishedLessonCount)}`}
              note="Of the lessons written so far"
            />
            <Stat pending={!ready} label="Published course" value={`${percent}%`} note="By lesson count" />
            <Stat
              pending={!ready}
              label="Furthest level"
              value={`${pad(currentLevel)} / ${pad(TOTAL_LEVELS)}`}
              note="Highest level with a completed lesson"
            />
            <Stat
              pending={!ready}
              label="Quizzes answered"
              value={pad(quizCount)}
              note="One score kept per lesson"
            />
          </dl>
        </CardBody>
      </Card>

      {lastVisited ? (
        <p className="text-[15px] leading-[1.65] text-ink-soft">
          Last open on this device:{" "}
          <Link
            href={`/learn/${lastVisited.slug}`}
            className="font-medium text-blue underline underline-offset-4"
          >
            {lastVisited.title}
          </Link>{" "}
          <span className="text-ink-faint">
            (Level <span className="num">{pad(lastVisited.level)}</span>)
          </span>
        </p>
      ) : null}

      {/* ---------------------------------------------------------- lesson list */}
      <Section
        eyebrow="Lessons"
        title="Every lesson written so far"
        intro="Completion is yours to declare — it is a note to yourself about what you have read, not a test result. Toggle a row either way at any time."
      >
        <ul className="divide-y divide-rule border-y border-rule">
          {teachingOrder.map((slug) => {
            const lesson = getLesson(slug);
            if (!lesson) return null;
            const complete = ready && isLessonComplete(slug);
            return (
              <li
                key={slug}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
              >
                <div className="flex min-w-0 flex-1 basis-64 items-baseline gap-3">
                  <LevelBadge level={lesson.level} complete={complete} className="shrink-0" />
                  <div className="min-w-0">
                    <Link
                      href={`/learn/${lesson.slug}`}
                      className="text-[16px] font-medium text-ink underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue motion-reduce:transition-none"
                    >
                      {lesson.title}
                    </Link>
                    <p className="mt-0.5 text-[13px] text-ink-faint">
                      <span className="num">{lesson.minutes}</span> min ·{" "}
                      {ready ? (complete ? "Complete" : "Not marked complete") : "Reading your record…"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={complete ? "secondary" : "primary"}
                  aria-pressed={complete}
                  disabled={!ready}
                  aria-label={
                    complete
                      ? `Mark ${lesson.title} as not complete`
                      : `Mark ${lesson.title} complete`
                  }
                  onClick={() => toggleLesson(slug)}
                >
                  {complete ? "Undo" : "Mark complete"}
                </Button>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ------------------------------------------------------ the twenty levels */}
      <Section
        eyebrow="The whole course"
        title="Where the twenty levels stand"
        intro={`${PUBLISHED_LEVELS.length} of the ${TOTAL_LEVELS} levels carry written lessons. The other ${PLANNED_LEVELS.length} are on the roadmap: their topics are listed in full on the learning path, so the whole route is legible, but the lessons themselves are not written yet. Nothing here is hidden from you and nothing is pretending to exist.`}
      >
        <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {curriculum.map((level) => {
            const written = level.status === "published";
            const done =
              ready && level.lessonSlugs.length > 0 && level.lessonSlugs.every(isLessonComplete);
            return (
              <li
                key={level.number}
                className="flex items-baseline gap-3 border-b border-rule py-1.5 text-[15px] leading-[1.5]"
              >
                <span className="num w-6 shrink-0 text-[12px] text-ink-faint">
                  {pad(level.number)}
                </span>
                <span className={`min-w-0 flex-1 ${written ? "text-ink" : "text-ink-soft"}`}>
                  {level.title}
                  <span className="ml-2 whitespace-nowrap text-[12px] text-ink-faint">
                    {TIER_LABELS[level.tier]}
                  </span>
                </span>
                <span className="shrink-0">
                  {done ? (
                    <Badge tone="moss">Complete</Badge>
                  ) : written ? (
                    <Badge tone="blue">Lessons ready</Badge>
                  ) : (
                    <Badge tone="outline">On the roadmap</Badge>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
          <Link href="/learn" className="font-medium text-blue underline underline-offset-4">
            The learning path
          </Link>{" "}
          lists every level with its prerequisites and its full topic list, written or not.
        </p>
      </Section>

      {/* -------------------------------------------------------- quiz history */}
      <Section
        eyebrow="Knowledge checks"
        title="Quiz history"
        intro="One score is kept per lesson: the most recent attempt. Scores are a record of what you knew at the time, and answering again replaces the old figure."
      >
        {ready ? <QuizHistory scores={state.quizScores} /> : <Skeleton rows={3} />}
      </Section>

      {/* ----------------------------------------------------- troubleshooting */}
      <Section
        eyebrow="Troubleshooting"
        title="Fault-finding scenarios"
        intro="A scenario counts as solved when you reach its resolution. Attempted means you started it and stopped, or took a route that cost more than it needed to — which is worth as much to read back as a clean run."
      >
        {!ready ? (
          <Skeleton rows={2} />
        ) : scenarioIds.length === 0 ? (
          <p className="measure text-[15px] leading-[1.65] text-ink-soft">
            No scenario attempted yet.{" "}
            <Link
              href="/troubleshooting"
              className="font-medium text-blue underline underline-offset-4"
            >
              Troubleshooting
            </Link>{" "}
            puts a symptom in front of you in an operator&rsquo;s own words and makes you choose
            what to measure next.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-rule border-y border-rule">
              {scenarioIds.map((id) => {
                const scenario = getScenario(id);
                const result = state.scenarioResults[id];
                return (
                  <li
                    key={id}
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3"
                  >
                    <span className="min-w-0 flex-1 basis-48 text-[15px] leading-[1.5] text-ink">
                      {scenario ? (
                        <Link
                          href="/troubleshooting"
                          className="underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue motion-reduce:transition-none"
                        >
                          {scenario.title}
                        </Link>
                      ) : (
                        <span className="num text-[14px] text-ink-soft">{id}</span>
                      )}
                    </span>
                    <Badge tone={result === "solved" ? "moss" : "outline"}>
                      {result === "solved" ? "Solved" : "Attempted"}
                    </Badge>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
              <span className="num text-ink">{solvedCount}</span> solved of{" "}
              <span className="num text-ink">{scenarioIds.length}</span>{" "}
              {pluralise(scenarioIds.length, "scenario")} attempted.{" "}
              <span className="num text-ink">{scenarios.length}</span>{" "}
              {pluralise(scenarios.length, "scenario", "scenarios")} published so far.
            </p>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------- project decisions */}
      <Section
        eyebrow="Design project"
        title="Your saved design decisions"
        intro={`Stages 01 to ${pad(DECISION_STAGES.length)} carry decisions. The remaining stages set out what has to be decided and close with self-check questions, so there is nothing to record against them yet.`}
      >
        {!ready ? (
          <Skeleton rows={4} />
        ) : decided.length === 0 ? (
          <p className="measure text-[15px] leading-[1.65] text-ink-soft">
            No decision recorded yet.{" "}
            <Link href="/project" className="font-medium text-blue underline underline-offset-4">
              The design project
            </Link>{" "}
            works one fictional brief from intended use to a printable concept report. Choices are
            saved as you make them, and the report is assembled from the ones you actually made.
          </p>
        ) : (
          <>
            <ol className="divide-y divide-rule border-y border-rule">
              {decided.map((stage) => {
                const chosen = stage.decision?.options.find(
                  (option) => option.id === state.projectDecisions[stage.id],
                );
                return (
                  <li key={stage.id} className="flex items-baseline gap-3 py-3">
                    <span className="num w-6 shrink-0 text-[12px] text-ink-faint">
                      {pad(stage.number)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium leading-[1.5] text-ink">
                        {stage.title}
                      </p>
                      <p className="mt-0.5 text-[15px] leading-[1.5] text-ink-soft">
                        {chosen ? chosen.name : "Saved choice no longer offered at this stage"}
                        {chosen?.recommended ? (
                          <span className="ml-2 text-[13px] text-ink-faint">
                            (the option recommended for this brief)
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
              <span className="num text-ink">{decided.length}</span> of{" "}
              <span className="num text-ink">{DECISION_STAGES.length}</span> decisions recorded.{" "}
              <Link href="/project" className="font-medium text-blue underline underline-offset-4">
                Open the project
              </Link>{" "}
              to change any of them or to print the concept report, which names every stage you have
              left undecided rather than quietly filling it in.
            </p>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------------------ reset */}
      <Section
        eyebrow="Stored data"
        title="Where this record lives"
        intro="This page is assembled from a single record in this browser's local storage. There is no account and nothing is transmitted, so the record follows the browser rather than you: a different device, a different browser or a cleared cache starts from zero."
      >
        <ResetProgress />
      </Section>
    </div>
  );
}
