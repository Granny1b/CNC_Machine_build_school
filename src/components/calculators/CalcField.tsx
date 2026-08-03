"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { parseNumeric } from "@/lib/format";
import type { CalcWarning, WorkedGiven, WorkedStep } from "@/lib/machining";

/**
 * The shared furniture both calculators are built from: a numeric field that
 * parses and validates as you type, the guard-rail well, the
 * educational-estimate note, and the worked-example card.
 *
 * Nothing here blocks input. A field that cannot be read says so and the
 * results fall back to a dash — the learner is never prevented from typing, and
 * never shown a number derived from something the calculator could not parse.
 */

/**
 * SPEC 5.2: a number that represents a measured or calculated value is never
 * set in anything but mono. Guard-rail messages are generated prose, so their
 * numerals are picked out here rather than in the string itself.
 */
const NUMERAL = /(\d+(?:[.,]\d+)*)/g;

function withMonoNumerals(text: string): ReactNode {
  return text.split(NUMERAL).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="num text-ink">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export interface CalcFieldProps {
  label: string;
  /**
   * The algebraic symbol, e.g. "fz", "μ". It is shown in mono at the head of
   * the hint rather than in the label, because labels are set in the uppercase
   * eyebrow style, which would turn `fz` into `FZ` and `μ` into `Μ`.
   */
  symbol?: string;
  /** Unit shown in the field's own gutter, e.g. "mm", "m/min". */
  unit?: string;
  /** What this input physically means, in one line. */
  hint?: ReactNode;
  /** The raw text of the field. The calculator owns it, not this component. */
  value: string;
  onChange: (raw: string) => void;
  min?: number;
  max?: number;
  step?: number | string;
  /** Zero is meaningful for some quantities — a frictionless axis, no cut. */
  allowZero?: boolean;
  /** Replaces the generic message when the value falls outside min/max. */
  outOfRangeMessage?: string;
  className?: string;
}

function validate(
  raw: string,
  { min, max, allowZero, outOfRangeMessage }: Pick<
    CalcFieldProps,
    "min" | "max" | "allowZero" | "outOfRangeMessage"
  >,
): string | null {
  const parsed = parseNumeric(raw);
  if (parsed === null) {
    return raw.trim() === ""
      ? "Enter a number to see the result."
      : "That is not a number the calculator can read.";
  }
  if (allowZero ? parsed < 0 : parsed <= 0) {
    return allowZero
      ? "This quantity cannot be negative."
      : "This quantity has to be greater than zero.";
  }
  if ((min !== undefined && parsed < min) || (max !== undefined && parsed > max)) {
    return outOfRangeMessage ?? "That value is outside the range this calculator can use.";
  }
  return null;
}

/**
 * A `Field` with numeric parsing and an invalid state.
 *
 * The message is passed through `Field`'s own `hint`, so it is announced by the
 * input's `aria-describedby` rather than floating unattached beside it. The
 * invalid marker is a rule in `blue-bright`: the palette reserves amber for
 * safety content, and a mistyped number is not a safety matter.
 */
export function CalcField({
  label,
  symbol,
  unit,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  allowZero = false,
  outOfRangeMessage,
  className = "",
}: CalcFieldProps) {
  const error = validate(value, { min, max, allowZero, outOfRangeMessage });

  const described =
    error || hint || symbol ? (
      <>
        {error ? <span className="block font-medium text-blue-deep">{error}</span> : null}
        {symbol ? (
          <>
            <span className="font-mono font-medium text-ink">{symbol}</span>
            {hint ? <span aria-hidden="true"> · </span> : null}
          </>
        ) : null}
        {hint}
      </>
    ) : undefined;

  return (
    <div
      className={`border-l-2 pl-3 ${error ? "border-blue-bright" : "border-transparent"} ${className}`}
    >
      <Field
        label={label}
        unit={unit}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        hint={described}
      />
    </div>
  );
}

/**
 * The guard-rail well. Warnings explain the physical consequence of the numbers
 * as entered and never block anything, so they are drawn in the blue wash
 * rather than amber — amber means safety and nothing else.
 */
export function CalcWarnings({
  warnings,
  quietMessage,
}: {
  warnings: CalcWarning[];
  quietMessage: string;
}) {
  return (
    <div role="status" aria-live="polite">
      {warnings.length === 0 ? (
        <div className="rounded-sm border border-rule bg-paper-sunk px-4 py-3">
          <p className="eyebrow">Guard rails · all clear</p>
          <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-soft">{quietMessage}</p>
        </div>
      ) : (
        <div className="rounded-sm border border-blue/20 bg-blue-wash px-4 py-3">
          <p className="eyebrow text-blue">
            Guard rails · {warnings.length} to read
          </p>
          <ul className="mt-2.5 space-y-3.5">
            {warnings.map((warning) => (
              <li key={warning.id}>
                <p className="font-display text-[15px] font-semibold leading-snug tracking-tightest text-blue-deep">
                  {withMonoNumerals(warning.title)}
                </p>
                <p className="mt-1 text-[14px] leading-[1.55] text-ink-soft">
                  {withMonoNumerals(warning.detail)}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-blue/20 pt-2.5 text-[13px] leading-snug text-ink-soft">
            Nothing here is blocked or corrected for you. These are sanity checks on the arithmetic
            and what it would physically do — they are not a safety system.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * SPEC rule 3: every calculator carries a visible note that it is educational.
 * It sits with the results, not at the foot of the page, so it cannot be missed
 * by anyone who reads the number and stops.
 */
export function EstimateNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-sm border border-rule-strong bg-paper-sunk px-4 py-3">
      <p className="eyebrow">Educational estimate — read this before using a number</p>
      <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-soft">{children}</p>
    </div>
  );
}

export interface WorkedExampleProps {
  title: string;
  intro: string;
  givens: WorkedGiven[];
  steps: WorkedStep[];
  siNote: string;
}

/**
 * The worked example, laid out as a shop reference card: what you were given,
 * then each step with its arithmetic and its answer in mono and the reason it
 * matters in sans.
 *
 * The calculator's default inputs are these givens, so the results panel above
 * reproduces every answer here exactly — which is the point of showing it.
 */
export function WorkedExample({ title, intro, givens, steps, siNote }: WorkedExampleProps) {
  return (
    <Card>
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">Worked example — reproduced by the default inputs</p>
        <h3 className="mt-2 text-[20px] font-semibold sm:text-[22px]">{title}</h3>
        <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">{intro}</p>
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
          {givens.map((given) => (
            <div key={given.symbol} className="flex items-baseline gap-1.5">
              <dt className="font-mono text-[12px] font-medium text-blue">{given.symbol}</dt>
              <dd className="num text-[12px] text-ink-soft">{given.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ol className="divide-y divide-rule">
        {steps.map((step, index) => (
          <li key={step.label} className="px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num text-[11px] text-ink-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[15px] font-semibold tracking-tightest text-ink">
                {step.label}
              </span>
            </div>
            <div className="mt-2 overflow-x-auto">
              <p className="whitespace-nowrap font-mono text-[13px] tabular-nums text-ink-soft">
                {step.expression}
                <span className="mx-2 text-ink-soft">=</span>
                <span className="font-medium text-blue-deep">{step.result}</span>
              </p>
            </div>
            <p className="measure mt-2 text-[14px] leading-[1.6] text-ink-soft">{step.note}</p>
          </li>
        ))}
      </ol>

      <div className="border-t border-rule bg-paper-sunk px-5 py-4 sm:px-6">
        <p className="eyebrow">Shop units and their SI relations</p>
        <p className="measure mt-1.5 text-[14px] leading-[1.55] text-ink-soft">{siNote}</p>
      </div>
    </Card>
  );
}
