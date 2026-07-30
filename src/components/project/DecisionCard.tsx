"use client";

import { Fragment, type ReactNode } from "react";
import type { ProjectDecision, ProjectOption } from "@/content/types";
import { Badge } from "@/components/ui/Badge";

/**
 * Project content is authored with backticks around measured values so every
 * number lands in mono tabular figures without the author writing markup, the
 * same convention the lessons and scenarios use. SPEC section 5.2.
 *
 * Exported because `DesignProject` and `ConceptReport` render the same content.
 */
export function ticks(text: string, keyPrefix: string): ReactNode[] {
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

/** The same content with its backtick markers removed, for accessible names. */
function plain(text: string): string {
  return text.split("`").join("");
}

const LETTERS = ["A", "B", "C", "D", "E"];

export interface DecisionCardProps {
  stageId: string;
  decision: ProjectDecision;
  /** From `state.projectDecisions[stageId]`, so a reload restores the choice. */
  selectedOptionId?: string;
  onSelect(optionId: string): void;
}

/** One of the four implication fields, laid out identically for every option. */
function Implication({
  label,
  body,
  keyPrefix,
  tone = "neutral",
}: {
  label: string;
  body: string;
  keyPrefix: string;
  /** `safety` is the only amber use in this component, and only for safety text. */
  tone?: "neutral" | "safety";
}) {
  const isSafety = tone === "safety";
  return (
    <div
      className={`rounded-sm border px-4 py-3 ${
        isSafety ? "border-amber/30 bg-amber-wash" : "border-rule bg-paper-sunk"
      }`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-eyebrow ${
          isSafety ? "text-amber" : "text-ink-faint"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{ticks(body, keyPrefix)}</p>
    </div>
  );
}

function PointList({
  label,
  items,
  keyPrefix,
  marker,
}: {
  label: string;
  items: string[];
  keyPrefix: string;
  marker: string;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <ul className="mt-2.5 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2.5 text-[15px] leading-[1.6] text-ink-soft">
            <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono text-[12px] text-ink-faint">
              {marker}
            </span>
            <span>{ticks(item, `${keyPrefix}-${index}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OptionPanel({
  option,
  index,
  stageId,
  selected,
  onSelect,
}: {
  option: ProjectOption;
  index: number;
  stageId: string;
  selected: boolean;
  onSelect(optionId: string): void;
}) {
  const keyPrefix = `${stageId}-${option.id}`;
  return (
    <li>
      <div
        className={`rounded-sm border transition-shadow duration-200 motion-reduce:transition-none ${
          selected
            ? "border-blue bg-paper-raised shadow-lift ring-1 ring-blue"
            : "border-rule bg-paper-raised shadow-panel"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-rule px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="eyebrow">Option {LETTERS[index] || String(index + 1)}</p>
            <h4 className="mt-1.5 font-display text-[18px] font-semibold tracking-tightest text-ink">
              {ticks(option.name, `${keyPrefix}-name`)}
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {option.recommended ? (
                <Badge tone="blue">Recommended for this brief</Badge>
              ) : null}
              {selected ? <Badge tone="moss">Your choice</Badge> : null}
            </div>
          </div>

          <button
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-sm border px-4 py-2 font-mono text-[12px] uppercase tracking-eyebrow transition-colors duration-150 motion-reduce:transition-none ${
              selected
                ? "border-blue bg-blue text-paper-raised"
                : "border-rule-strong bg-paper-raised text-blue hover:border-blue hover:bg-blue-wash"
            }`}
          >
            <span aria-hidden="true" className="text-[13px] leading-none">
              {selected ? "■" : "□"}
            </span>
            Choose
            <span className="sr-only"> {plain(option.name)}</span>
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <PointList
              label="Benefits"
              items={option.benefits}
              keyPrefix={`${keyPrefix}-ben`}
              marker="+"
            />
            <PointList
              label="Drawbacks"
              items={option.drawbacks}
              keyPrefix={`${keyPrefix}-dra`}
              marker="−"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Implication label="Cost" body={option.cost} keyPrefix={`${keyPrefix}-cost`} />
            <Implication
              label="Performance"
              body={option.performance}
              keyPrefix={`${keyPrefix}-perf`}
            />
            <Implication
              label="Safety"
              body={option.safety}
              keyPrefix={`${keyPrefix}-safe`}
              tone="safety"
            />
            <Implication
              label="Maintenance"
              body={option.maintenance}
              keyPrefix={`${keyPrefix}-maint`}
            />
          </div>

          <div className="rounded-sm border border-blue/20 bg-blue-wash px-4 py-4">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-blue">
              Fit for the Northgate brief
            </p>
            <p className="measure mt-2 text-[15px] leading-[1.65] text-ink">
              {ticks(option.fitForBrief, `${keyPrefix}-fit`)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * The decision panel for one project stage. Selection is owned by the caller so
 * it can be persisted through `ProgressStore`; this component only reports it.
 */
export function DecisionCard({
  stageId,
  decision,
  selectedOptionId,
  onSelect,
}: DecisionCardProps) {
  const chosen = decision.options.find((option) => option.id === selectedOptionId);

  return (
    <section aria-label="Decision" className="mt-10">
      <div className="border-t border-rule-strong pt-6">
        <p className="eyebrow">The decision</p>
        <h3 className="measure mt-2 text-[20px] font-semibold sm:text-[24px]">
          {ticks(decision.question, `${stageId}-question`)}
        </h3>
        <p
          aria-live="polite"
          className="mt-3 font-mono text-[12px] uppercase tracking-eyebrow text-ink-soft"
        >
          {chosen
            ? `Saved: ${plain(chosen.name)}`
            : "Nothing chosen yet — your choice is saved as soon as you make it"}
        </p>
        <p className="measure mt-3 text-[15px] leading-[1.6] text-ink-soft">
          Every option here is genuinely defensible; none is a trick. Where one is marked as
          recommended, the recommendation is argued from a sentence in the brief, and you are free to
          disagree with it provided you can say which sentence you are arguing from instead.
        </p>
      </div>

      <ul className="mt-6 space-y-5">
        {decision.options.map((option, index) => (
          <OptionPanel
            key={option.id}
            option={option}
            index={index}
            stageId={stageId}
            selected={option.id === selectedOptionId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </section>
  );
}
