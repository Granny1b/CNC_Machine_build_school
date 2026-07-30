"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProjectStage } from "@/content/types";
import { projectStages } from "@/content/project";
import { useProgress } from "@/components/progress/ProgressProvider";
import { AxisScale } from "@/components/progress/AxisScale";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { pluralise } from "@/lib/format";
import { DecisionCard, ticks } from "./DecisionCard";
import { ConceptReport } from "./ConceptReport";

const TOTAL_STAGES = projectStages.length;

/** Split an authored brief into prose, the self-check lead and its questions. */
function splitBrief(brief: string) {
  const paragraphs = brief.split("\n\n").filter((p) => p.trim() !== "");
  const marker = paragraphs.findIndex((p) => p.startsWith("Self-check"));
  if (marker === -1) return { prose: paragraphs, selfCheckLead: null, questions: [] as string[] };
  return {
    prose: paragraphs.slice(0, marker),
    selfCheckLead: paragraphs[marker],
    questions: paragraphs.slice(marker + 1),
  };
}

function StageRail({
  activeId,
  decidedIds,
  onSelect,
}: {
  activeId: string;
  decidedIds: Set<string>;
  onSelect(id: string): void;
}) {
  return (
    <ol className="max-h-72 space-y-0.5 overflow-y-auto rounded-sm border border-rule bg-paper-raised p-2 lg:max-h-none lg:overflow-visible">
      {projectStages.map((stage) => {
        const active = stage.id === activeId;
        const decided = decidedIds.has(stage.id);
        const decidable = Boolean(stage.decision);
        return (
          <li key={stage.id}>
            <button
              type="button"
              onClick={() => onSelect(stage.id)}
              aria-current={active ? "step" : undefined}
              className={`flex w-full items-start gap-2.5 rounded-sm px-2.5 py-2 text-left transition-colors duration-150 motion-reduce:transition-none ${
                active ? "bg-blue text-paper-raised" : "text-ink hover:bg-blue-wash"
              }`}
            >
              <span
                className={`num mt-px shrink-0 text-[11px] ${
                  active ? "text-paper-raised" : "text-ink-faint"
                }`}
              >
                {String(stage.number).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-[14px] leading-[1.4]">{stage.title}</span>
              <span
                aria-hidden="true"
                className={`mt-px shrink-0 font-mono text-[12px] leading-[1.4] ${
                  active ? "text-paper-raised" : decided ? "text-moss" : "text-ink-faint"
                }`}
              >
                {decided ? "✓" : decidable ? "○" : "·"}
              </span>
              <span className="sr-only">
                {decided
                  ? " — decision recorded"
                  : decidable
                    ? " — decision available, not yet made"
                    : " — discussion stage, no decision recorded"}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StageBody({ stage }: { stage: ProjectStage }) {
  const { prose, selfCheckLead, questions } = useMemo(() => splitBrief(stage.brief), [stage.brief]);

  return (
    <>
      <div className="measure mt-5 space-y-4 text-[17px] leading-[1.65] text-ink-soft">
        {prose.map((paragraph, index) => (
          <p key={index}>{ticks(paragraph, `${stage.id}-p-${index}`)}</p>
        ))}
      </div>

      {selfCheckLead ? (
        <div className="mt-8 rounded-sm border border-rule bg-paper-sunk px-5 py-5">
          <p className="eyebrow">Self-check</p>
          <p className="measure mt-2 text-[16px] leading-[1.6] text-ink">
            {ticks(selfCheckLead, `${stage.id}-sc-lead`)}
          </p>
          <ol className="measure mt-4 space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="flex gap-3 text-[16px] leading-[1.6] text-ink-soft">
                <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[12px] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{ticks(question, `${stage.id}-sc-${index}`)}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </>
  );
}

/**
 * The twenty-stage design project. SPEC.md section 12.
 *
 * Choices are written straight through `ProgressProvider` to the progress store
 * and read back from `state.projectDecisions`, so a reload restores every one.
 */
export function DesignProject() {
  const { state, ready, setProjectDecision } = useProgress();
  const [activeId, setActiveId] = useState(projectStages[0].id);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // Move focus to the new stage heading on navigation, but not on first paint.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [activeId]);

  const index = Math.max(
    0,
    projectStages.findIndex((s) => s.id === activeId),
  );
  const stage = projectStages[index];
  const previous = index > 0 ? projectStages[index - 1] : null;
  const next = index < TOTAL_STAGES - 1 ? projectStages[index + 1] : null;

  const decisionStageCount = projectStages.filter((s) => s.decision).length;
  const decidedIds = useMemo(() => {
    const set = new Set<string>();
    for (const s of projectStages) {
      const saved = state.projectDecisions[s.id];
      if (saved && s.decision?.options.some((o) => o.id === saved)) set.add(s.id);
    }
    return set;
  }, [state.projectDecisions]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <aside aria-label="Project stages" className="no-print lg:sticky lg:top-6 lg:self-start">
        <p className="eyebrow">Stage {String(stage.number).padStart(2, "0")} of {TOTAL_STAGES}</p>
        <AxisScale
          className="mt-3"
          currentLevel={stage.number}
          totalLevels={TOTAL_STAGES}
          label="Stage"
          minorPerMajor={1}
          size="sm"
        />
        <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow tabular-nums text-ink-soft">
          {ready
            ? `${decidedIds.size} / ${decisionStageCount} ${pluralise(
                decidedIds.size,
                "decision",
              )} recorded`
            : "Reading saved decisions"}
        </p>
        <div className="mt-4">
          <StageRail activeId={activeId} decidedIds={decidedIds} onSelect={setActiveId} />
        </div>
        <p className="mt-3 text-[13px] leading-[1.5] text-ink-faint">
          Choices are saved in this browser as soon as you make them, and restored when you come
          back. Nothing is sent anywhere.
        </p>
      </aside>

      <div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <Badge tone="outline">
            Stage {String(stage.number).padStart(2, "0")} / {TOTAL_STAGES}
          </Badge>
          {stage.decision ? (
            <Badge tone="blue">Decision stage</Badge>
          ) : (
            <Badge tone="neutral">Discussion stage</Badge>
          )}
          {decidedIds.has(stage.id) ? <Badge tone="moss">Recorded</Badge> : null}
        </div>

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="no-print mt-4 text-[26px] font-bold sm:text-[32px]"
        >
          {stage.title}
        </h2>

        {/* `no-print` keeps the teaching text out of the printed concept report. */}
        <div className="no-print">
          <StageBody stage={stage} />
        </div>

        {stage.decision ? (
          <DecisionCard
            stageId={stage.id}
            decision={stage.decision}
            selectedOptionId={state.projectDecisions[stage.id]}
            onSelect={(optionId) => setProjectDecision(stage.id, optionId)}
          />
        ) : null}

        {stage.id === "final-concept-report" ? <ConceptReport /> : null}

        <nav
          aria-label="Stage navigation"
          className="no-print mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6"
        >
          <div className="min-w-0">
            {previous ? (
              <Button variant="secondary" onClick={() => setActiveId(previous.id)}>
                <span aria-hidden="true">←</span>
                Stage {String(previous.number).padStart(2, "0")}
                <span className="sr-only">, {previous.title}</span>
              </Button>
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
                First stage
              </p>
            )}
            {previous ? (
              <p className="mt-2 text-[13px] text-ink-faint">{previous.title}</p>
            ) : null}
          </div>

          <div className="min-w-0 text-right">
            {next ? (
              <Button onClick={() => setActiveId(next.id)}>
                Stage {String(next.number).padStart(2, "0")}
                <span className="sr-only">, {next.title}</span>
                <span aria-hidden="true">→</span>
              </Button>
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
                Last stage
              </p>
            )}
            {next ? <p className="mt-2 text-[13px] text-ink-faint">{next.title}</p> : null}
          </div>
        </nav>
      </div>
    </div>
  );
}
