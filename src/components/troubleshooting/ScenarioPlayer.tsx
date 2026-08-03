"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import type { Scenario } from "@/content/types";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { useProgress } from "@/components/progress/ProgressProvider";
import { pluralise } from "@/lib/format";

type ScenarioOption = Scenario["steps"][number]["options"][number];
type Verdict = ScenarioOption["verdict"];

/**
 * Verdict presentation. Sound is moss, wasteful is blue, a wrong turn is ink on
 * a sunk ground. Amber is never used here: SPEC section 5 reserves it for safety
 * content, and a diagnostic detour is not a safety warning.
 */
const VERDICTS: Record<
  Verdict,
  { label: string; meaning: string; badge: string; panel: string; accent: string }
> = {
  sound: {
    label: "Sound",
    meaning: "The cheapest decisive step available with the evidence you had.",
    badge: "border-moss/30 bg-moss-wash text-moss",
    panel: "border-moss/30 bg-moss-wash",
    accent: "bg-moss",
  },
  wasteful: {
    label: "Wasteful",
    meaning: "A real test. It simply costs more than it needs to at this point.",
    badge: "border-blue/25 bg-blue-wash text-blue",
    panel: "border-blue/25 bg-blue-wash",
    accent: "bg-blue-mid",
  },
  wrong: {
    label: "Wrong turn",
    meaning: "This one misleads you, hides the fault, or creates a second one.",
    badge: "border-ink/25 bg-paper-sunk text-ink",
    panel: "border-rule-strong bg-paper-sunk",
    accent: "bg-ink",
  },
};

const LETTERS = ["A", "B", "C", "D", "E"];

/**
 * Content is authored with backticks around measured values so that every
 * number lands in mono tabular figures, as SPEC section 5.2 requires, without
 * the author having to write markup.
 */
function ticks(text: string, keyPrefix: string): ReactNode[] {
  return text.split("`").map((segment, index) =>
    index % 2 === 1 ? (
      <span key={`${keyPrefix}-${index}`} className="num">
        {segment}
      </span>
    ) : (
      <Fragment key={`${keyPrefix}-${index}`}>{segment}</Fragment>
    ),
  );
}

function costLine(answered: number, wasteful: number, wrong: number): string {
  if (answered === 0) {
    return "Nothing spent yet. Every choice below is a decision about what the next piece of evidence costs you.";
  }
  if (wrong === 0 && wasteful === 0) {
    return `${answered} ${pluralise(answered, "call")} made, nothing wasted. You have taken the cheapest decisive step at every branch so far.`;
  }
  const parts: string[] = [];
  if (wrong > 0) parts.push(`${wrong} wrong ${pluralise(wrong, "turn")}`);
  if (wasteful > 0) parts.push(`${wasteful} ${pluralise(wasteful, "detour")}`);
  const tail =
    wrong > 0
      ? "A wrong turn does not just cost time — it costs you evidence, or leaves a new fault behind."
      : "Nothing you chose was wrong. Each detour was a real test that simply cost more than the situation needed.";
  return `${answered} ${pluralise(answered, "call")} made: ${parts.join(" and ")}. ${tail}`;
}

export interface ScenarioPlayerProps {
  scenario: Scenario;
  /** Position in the list on the page, used only for the mono label. */
  number?: number;
}

export function ScenarioPlayer({ scenario, number }: ScenarioPlayerProps) {
  const { recordScenario, ready, state } = useProgress();
  const [started, setStarted] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = scenario.steps;
  const finished = stepIndex >= steps.length;
  const step = finished ? undefined : steps[stepIndex];
  const chosenId = choices[stepIndex];
  const chosen = step?.options.find((option) => option.id === chosenId);

  const takenVerdicts: Verdict[] = choices.flatMap((id, index) => {
    const option = steps[index]?.options.find((candidate) => candidate.id === id);
    return option ? [option.verdict] : [];
  });
  const wastefulCount = takenVerdicts.filter((v) => v === "wasteful").length;
  const wrongCount = takenVerdicts.filter((v) => v === "wrong").length;

  const outcome: "solved" | "attempted" | null = finished
    ? wrongCount === 0
      ? "solved"
      : "attempted"
    : null;

  useEffect(() => {
    if (!outcome || !ready) return;
    recordScenario(scenario.id, outcome);
  }, [outcome, ready, recordScenario, scenario.id]);

  const saved = ready ? state.scenarioResults[scenario.id] : undefined;

  function choose(optionId: string) {
    if (chosen) return;
    setChoices((previous) => {
      if (previous.length !== stepIndex) return previous;
      return [...previous, optionId];
    });
  }

  function restart() {
    setChoices([]);
    setStepIndex(0);
  }

  return (
    <Card as="article" tone="raised" className="overflow-hidden">
      <CardHeader className="grid-wash">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">
            Scenario <span className="num">{String(number ?? 1).padStart(2, "0")}</span> ·{" "}
            <span className="num">{steps.length}</span> decisions
          </p>
          {saved ? (
            <Badge tone={saved === "solved" ? "moss" : "neutral"}>
              {saved === "solved" ? "Solved" : "Attempted"}
            </Badge>
          ) : null}
        </div>
        <h2 className="mt-2 text-[22px] font-semibold sm:text-[26px]">{scenario.title}</h2>
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="flex gap-4 rounded-sm border border-rule bg-paper-sunk px-4 py-4 sm:px-5">
          <span aria-hidden="true" className="w-0.5 shrink-0 rounded-sm bg-blue" />
          <div className="min-w-0">
            <p className="eyebrow">In the operator&rsquo;s words</p>
            <p className="measure mt-2 text-[16px] leading-[1.65] text-ink">
              {ticks(scenario.symptom, `${scenario.id}-symptom`)}
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow">The situation</p>
          <ul className="measure mt-3 space-y-2.5">
            {scenario.context.map((line, index) => (
              <li key={index} className="flex gap-3 text-[16px] leading-[1.6] text-ink-soft">
                <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[11px] text-ink-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{ticks(line, `${scenario.id}-ctx-${index}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {!started ? (
          <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-5">
            <Button onClick={() => setStarted(true)}>Work the fault</Button>
            <p className="text-[15px] text-ink-soft">
              {steps.length} decisions. Every option tells you what it would actually have found.
            </p>
          </div>
        ) : (
          <div className="border-t border-rule pt-5">
            {/* Running cost of the route taken so far. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="eyebrow shrink-0">
                Step{" "}
                <span className="num">
                  {String(Math.min(stepIndex + 1, steps.length)).padStart(2, "0")}
                </span>{" "}
                / <span className="num">{String(steps.length).padStart(2, "0")}</span>
              </p>
              <ol aria-hidden="true" className="flex flex-wrap items-center gap-1.5">
                {steps.map((s, index) => {
                  const verdict: Verdict | undefined = takenVerdicts[index];
                  return (
                    <li
                      key={s.id}
                      className={[
                        "h-1.5 w-6 rounded-sm",
                        verdict
                          ? VERDICTS[verdict].accent
                          : index === stepIndex && !finished
                            ? "bg-rule-strong"
                            : "bg-rule",
                      ].join(" ")}
                    />
                  );
                })}
              </ol>
            </div>
            <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">
              {costLine(takenVerdicts.length, wastefulCount, wrongCount)}
            </p>

            {step ? (
              <div className="mt-6">
                <h3 className="measure text-[18px] font-semibold sm:text-[20px]">
                  {ticks(step.question, `${scenario.id}-q-${step.id}`)}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {step.options.map((option, index) => {
                    const isChosen = chosen?.id === option.id;
                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => choose(option.id)}
                          aria-disabled={chosen ? true : undefined}
                          className={[
                            "flex w-full gap-3 rounded-sm border px-4 py-3 text-left",
                            "transition-colors duration-150 motion-reduce:transition-none",
                            isChosen
                              ? VERDICTS[option.verdict].panel
                              : chosen
                                ? "border-rule bg-paper-raised opacity-60"
                                : "border-rule bg-paper-raised hover:border-blue hover:bg-blue-wash",
                          ].join(" ")}
                        >
                          <span
                            aria-hidden="true"
                            className="num mt-0.5 shrink-0 text-[12px] text-ink-soft"
                          >
                            {LETTERS[index] || String(index + 1)}
                          </span>
                          <span className="min-w-0 text-[16px] leading-[1.55] text-ink">
                            {ticks(option.text, `${scenario.id}-${step.id}-${option.id}`)}
                            {isChosen ? (
                              <span className="mt-2 block font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft">
                                Your call
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {/* The one live region for the whole player: it holds whatever was
                just revealed, so a screen reader hears the response or the
                resolution without the learner having to hunt for it. */}
            <div aria-live="polite">
              {step && chosen ? (
                <div
                  className={`mt-5 rounded-sm border px-4 py-4 sm:px-5 ${VERDICTS[chosen.verdict].panel}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-eyebrow ${VERDICTS[chosen.verdict].badge}`}
                    >
                      {VERDICTS[chosen.verdict].label}
                    </span>
                    <span className="text-[14px] text-ink-soft">
                      {VERDICTS[chosen.verdict].meaning}
                    </span>
                  </div>
                  <p className="measure mt-3 text-[16px] leading-[1.65] text-ink">
                    {ticks(chosen.response, `${scenario.id}-${step.id}-resp`)}
                  </p>
                </div>
              ) : null}

              {finished ? (
                <div className="mt-5 space-y-4">
                  <div
                    className={`rounded-sm border px-4 py-4 sm:px-5 ${
                      outcome === "solved"
                        ? VERDICTS.sound.panel
                        : "border-rule-strong bg-paper-sunk"
                    }`}
                  >
                    <p className="eyebrow">
                      {outcome === "solved" ? "Solved" : "Reached, the long way round"}
                    </p>
                    <p className="measure mt-2 text-[16px] leading-[1.65] text-ink">
                      {outcome === "solved"
                        ? `You reached the finding without a single wrong turn${
                            wastefulCount > 0
                              ? `, taking ${wastefulCount} ${pluralise(wastefulCount, "detour")} on the way. A detour costs time; it does not cost you the fault.`
                              : ", and without a detour. That is what a structured route looks like: symptom, hypothesis, cheapest decisive test, repeat."
                          }`
                        : `You got to the finding, which is what matters in the end — but ${wrongCount} ${pluralise(wrongCount, "choice")} along the way would have hidden the fault, destroyed evidence or introduced a second problem. Play it again and watch where the cheap evidence was sitting unused.`}
                    </p>
                  </div>

                  <div className="rounded-sm border border-rule bg-paper-raised px-4 py-4 sm:px-5">
                    <p className="eyebrow">Resolution</p>
                    <div className="measure mt-2 space-y-4">
                      {scenario.resolution.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="text-[16px] leading-[1.65] text-ink">
                          {ticks(paragraph, `${scenario.id}-res-${index}`)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {step && chosen ? (
              <Disclosure
                className="mt-4"
                eyebrow="The roads not taken"
                title="What the other choices would have told you"
              >
                <ul className="space-y-4">
                  {step.options
                    .filter((option) => option.id !== chosen.id)
                    .map((option) => (
                      <li key={option.id}>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span
                            className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-eyebrow ${VERDICTS[option.verdict].badge}`}
                          >
                            {VERDICTS[option.verdict].label}
                          </span>
                          <span className="text-[15px] font-semibold text-ink">
                            {ticks(option.text, `${scenario.id}-${step.id}-alt-${option.id}`)}
                          </span>
                        </div>
                        <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">
                          {ticks(option.response, `${scenario.id}-${step.id}-altr-${option.id}`)}
                        </p>
                      </li>
                    ))}
                </ul>
              </Disclosure>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {chosen && !finished ? (
                <Button onClick={() => setStepIndex((index) => index + 1)}>
                  {stepIndex === steps.length - 1 ? "See the resolution" : "Next step"}
                </Button>
              ) : null}
              {takenVerdicts.length > 0 ? (
                <Button variant="secondary" onClick={restart}>
                  {finished ? "Work it again" : "Start over"}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
