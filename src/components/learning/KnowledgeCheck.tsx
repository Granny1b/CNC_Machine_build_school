"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Readout } from "@/components/ui/Field";
import { useProgress } from "@/components/progress/ProgressProvider";
import { plainSegments } from "@/lib/autolink";
import { pluralise } from "@/lib/format";

/**
 * The knowledge check. SPEC rule 8: wrong answers teach.
 *
 * How that is honoured here:
 *   - every option carries its own authored feedback, shown when it is the one
 *     chosen. There is no generic "incorrect" anywhere in this component;
 *   - the question's `teaching` text is shown once answered, right or wrong,
 *     because the point being taught is the same either way;
 *   - the sound answer is always identified, so nobody leaves holding the wrong
 *     model quietly;
 *   - `reviewSlug` becomes a link to the lesson that covers the idea properly.
 *
 * An answer can be changed freely until it is checked, and checking is per
 * question — that keeps the feedback next to the thinking that earned it. The
 * score is written to progress once every question has been checked.
 */

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Authored text carries backticked values; they are set in mono, never linked. */
function Ticked({ text }: { text: string }) {
  return (
    <>
      {plainSegments(text).map((segment, index) =>
        segment.code ? (
          <span key={index} className="num text-[0.94em]">
            {segment.text}
          </span>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

export interface KnowledgeCheckProps {
  lessonSlug: string;
  questions: QuizQuestion[];
}

export function KnowledgeCheck({ lessonSlug, questions }: KnowledgeCheckProps) {
  const { recordQuiz, ready } = useProgress();
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = questions.length;
  const checkedCount = questions.filter((question) => checked[question.id]).length;
  const correctCount = questions.filter((question) => {
    if (!checked[question.id]) return false;
    const option = question.options.find((candidate) => candidate.id === chosen[question.id]);
    return option?.correct === true;
  }).length;
  const finished = total > 0 && checkedCount === total;

  useEffect(() => {
    if (!ready || !finished) return;
    recordQuiz(lessonSlug, correctCount, total);
  }, [ready, finished, correctCount, total, lessonSlug, recordQuiz]);

  if (total === 0) return null;

  function restart() {
    setChosen({});
    setChecked({});
  }

  return (
    <Card as="section">
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">
          Knowledge check · <span className="num">{total}</span>{" "}
          {pluralise(total, "question")}
        </p>
        <h2 className="mt-2 text-[20px] font-semibold sm:text-[22px]">
          Check what you have just read
        </h2>
        <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">
          Every answer, right or wrong, explains itself: why it is tempting, where the reasoning
          breaks, and what the question was really about. Change your mind as often as you like
          before you check.
        </p>
      </div>

      <ol className="divide-y divide-rule">
        {questions.map((question, questionIndex) => {
          const selectedId = chosen[question.id];
          const isChecked = Boolean(checked[question.id]);
          const selected = question.options.find((option) => option.id === selectedId);
          const answer = question.options.find((option) => option.correct);
          const gotItRight = isChecked && selected?.correct === true;

          return (
            <li key={question.id} className="px-5 py-6 sm:px-6">
              <fieldset>
                <legend className="measure">
                  <span className="eyebrow block">
                    Question <span className="num">{String(questionIndex + 1).padStart(2, "0")}</span>{" "}
                    / <span className="num">{String(total).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-2 block font-display text-[18px] font-semibold tracking-tightest text-ink sm:text-[19px]">
                    <Ticked text={question.prompt} />
                  </span>
                </legend>

                <div className="mt-4 space-y-2.5">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedId === option.id;
                    const tone = !isChecked
                      ? isSelected
                        ? "border-blue bg-blue-wash"
                        : "border-rule bg-paper-raised hover:border-blue hover:bg-blue-wash"
                      : option.correct
                        ? "border-moss bg-moss-wash"
                        : isSelected
                          ? "border-rule-strong bg-paper-sunk"
                          : "border-rule bg-paper-raised opacity-70";

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer gap-3 rounded-sm border px-4 py-3 transition-colors duration-150 motion-reduce:transition-none ${tone} ${
                          isChecked ? "cursor-default" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${question.id}`}
                          value={option.id}
                          checked={isSelected}
                          disabled={isChecked}
                          onChange={() =>
                            setChosen((previous) => ({ ...previous, [question.id]: option.id }))
                          }
                          className="mt-1.5 h-4 w-4 shrink-0 accent-blue"
                        />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                            <span aria-hidden="true" className="num text-[12px] text-ink-soft">
                              {LETTERS[optionIndex] ?? String(optionIndex + 1)}
                            </span>
                            <span className="text-[16px] leading-[1.55] text-ink">
                              <Ticked text={option.text} />
                            </span>
                          </span>
                          {isChecked && option.correct ? (
                            <span className="mt-2 block">
                              <Badge tone="moss">The sound answer</Badge>
                            </span>
                          ) : null}
                          {isChecked && isSelected && !option.correct ? (
                            <span className="mt-2 block">
                              <Badge tone="neutral">The answer you gave</Badge>
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {!isChecked ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      size="sm"
                      disabled={!selectedId}
                      onClick={() =>
                        setChecked((previous) => ({ ...previous, [question.id]: true }))
                      }
                    >
                      Check this answer
                    </Button>
                    {!selectedId ? (
                      <span className="text-[14px] text-ink-soft">
                        Pick the answer you think is sound.
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {/* One live region per question: it holds whatever the check
                    revealed, so it is announced without hunting for it. */}
                <div aria-live="polite">
                  {isChecked && selected ? (
                    <div className="mt-4 space-y-3">
                      <div
                        className={`rounded-sm border px-4 py-3.5 ${
                          gotItRight ? "border-moss/35 bg-moss-wash" : "border-rule-strong bg-paper-sunk"
                        }`}
                      >
                        <p className="eyebrow">
                          {gotItRight
                            ? "Your answer — sound"
                            : "Your answer — where the reasoning breaks"}
                        </p>
                        <p className="measure mt-2 text-[15px] leading-[1.65] text-ink">
                          <Ticked text={selected.feedback} />
                        </p>
                      </div>

                      {!gotItRight && answer ? (
                        <div className="rounded-sm border border-moss/35 bg-moss-wash px-4 py-3.5">
                          <p className="eyebrow">The sound answer, and why</p>
                          <p className="measure mt-2 text-[15px] leading-[1.65] text-ink">
                            <span className="font-medium">
                              <Ticked text={answer.text} />
                            </span>{" "}
                            <span className="text-ink-soft">
                              <Ticked text={answer.feedback} />
                            </span>
                          </p>
                        </div>
                      ) : null}

                      <div className="border-l-2 border-blue pl-4">
                        <p className="eyebrow">What this question is really about</p>
                        <p className="measure mt-1.5 text-[15px] leading-[1.65] text-ink-soft">
                          <Ticked text={question.teaching} />
                        </p>
                        {question.reviewSlug ? (
                          <p className="mt-2.5 text-[14px]">
                            <Link
                              href={`/learn/${question.reviewSlug}`}
                              className="text-blue underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:decoration-blue motion-reduce:transition-none"
                            >
                              Read the lesson that covers this
                            </Link>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-rule bg-paper-sunk px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 sm:max-w-sm sm:flex-1">
            <Readout
              label="Score"
              value={`${correctCount} / ${total}`}
              meaning={
                finished
                  ? correctCount === total
                    ? "Every question sound. The exercise below is where it becomes yours."
                    : "Reread the feedback on anything you missed — the score matters far less than the reason."
                  : `${checkedCount} of ${total} checked so far. The score is saved once every question is checked.`
              }
              emphasis={finished}
            />
          </div>
          {checkedCount > 0 ? (
            <Button variant="secondary" size="sm" onClick={restart}>
              Answer them again
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
