"use client";

import { useId, type ReactNode } from "react";

export interface FieldProps {
  label: string;
  /** Unit shown to the right of the input, e.g. "mm", "m/min". */
  unit?: string;
  /** One-line explanation of what this input physically means. */
  hint?: ReactNode;
  value: number | string;
  onChange: (value: string) => void;
  type?: "number" | "text";
  min?: number;
  max?: number;
  step?: number | string;
  disabled?: boolean;
  className?: string;
}

export function Field({
  label,
  unit,
  hint,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
  disabled = false,
  className = "",
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-1.5 block">
        {label}
      </label>
      <div className="flex items-stretch rounded-sm border border-rule-strong bg-paper-raised focus-within:border-blue-bright">
        <input
          id={id}
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-describedby={hint ? hintId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-[15px] tabular-nums text-ink outline-none disabled:text-ink-faint"
        />
        {unit ? (
          <span className="flex shrink-0 items-center border-l border-rule bg-paper-sunk px-2.5 font-mono text-[12px] text-ink-soft">
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[13px] leading-snug text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: ReactNode;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  className = "",
}: SelectFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-1.5 block">
        {label}
      </label>
      <select
        id={id}
        value={value}
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-rule-strong bg-paper-raised px-3 py-2 font-mono text-[14px] text-ink focus-within:border-blue-bright"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[13px] leading-snug text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** A read-only computed output, always mono and tabular. */
export function Readout({
  label,
  value,
  unit,
  meaning,
  emphasis = false,
}: {
  label: string;
  value: string;
  unit?: string;
  meaning?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-sm border px-4 py-3 ${
        emphasis ? "border-blue/25 bg-blue-wash" : "border-rule bg-paper-sunk"
      }`}
    >
      <p className="eyebrow">{label}</p>
      <p className="mt-1 font-mono text-[20px] font-medium tabular-nums text-blue-deep">
        {value}
        {unit ? (
          <span className="ml-1 text-[13px] font-normal text-ink-soft">{unit}</span>
        ) : null}
      </p>
      {meaning ? (
        <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{meaning}</p>
      ) : null}
    </div>
  );
}
