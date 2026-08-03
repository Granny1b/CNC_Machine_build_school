"use client";

import { pluralise } from "@/lib/format";
import type { Diagnostic, IssueSeverity } from "@/lib/gcode";

/**
 * Everything the parser, the interpreter and the linter had to say, grouped by
 * how much it matters and each one carrying all three parts: what is wrong,
 * what that would actually do, and what to write instead. A bare "syntax error"
 * teaches nothing.
 *
 * These are programming mistakes, not safety content, so nothing here is amber.
 * Amber on this page belongs to the one machine-safety statement it carries.
 */

export interface DiagnosticsPanelProps {
  diagnostics: Diagnostic[];
  /** Index of the line the simulation is sitting on, for the current marker. */
  activeLineIndex: number;
  onSelectLine: (lineIndex: number) => void;
}

const GROUPS: {
  severity: IssueSeverity;
  marker: string;
  title: string;
  spoken: string;
  blurb: string;
}[] = [
  {
    severity: "error",
    marker: "!",
    title: "Errors",
    spoken: "error",
    blurb:
      "Something is wrong with the block itself. A control would either refuse it or act on something other than what you wrote.",
  },
  {
    severity: "warning",
    marker: "?",
    title: "Warnings",
    spoken: "warning",
    blurb:
      "The block is valid G-code. It is also one of the mistakes that spoils parts and breaks tools.",
  },
  {
    severity: "note",
    marker: "·",
    title: "Notes",
    spoken: "note",
    blurb: "Nothing here is wrong. Each one is a habit worth forming while the program is small.",
  },
];

export function DiagnosticsPanel({
  diagnostics,
  activeLineIndex,
  onSelectLine,
}: DiagnosticsPanelProps) {
  const groups = GROUPS.map((group) => ({
    ...group,
    items: diagnostics.filter((issue) => issue.severity === group.severity),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="diagnostics-heading"
      className="flex h-full flex-col rounded-sm border border-rule bg-paper-raised shadow-panel"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule px-5 py-4 sm:px-6">
        <h2 id="diagnostics-heading" className="text-[18px] font-semibold sm:text-[20px]">
          What the checks found
        </h2>
        <p className="eyebrow">
          {diagnostics.length} {pluralise(diagnostics.length, "finding")}
        </p>
      </div>

      <div className="flex-1 px-5 py-5 sm:px-6">
        {groups.length === 0 ? (
          <div>
            <p className="text-[16px] leading-[1.6] text-ink">
              Nothing was flagged. Every block was readable, and none of them matched the beginner
              mistakes this model looks for.
            </p>
            <div className="mt-4 rounded-sm border border-rule bg-paper-sunk px-4 py-4">
              <p className="eyebrow">What a clean result does not mean</p>
              <p className="measure mt-2 text-[15px] leading-[1.6] text-ink">
                It does not mean the program is safe to run. This model knows nothing about your
                fixture, your clamps, your real tool lengths, your work offsets, your machine&rsquo;s
                travels or what is sitting on the table. It has checked what you wrote against
                itself, and that is all it can ever do.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            {groups.map((group) => (
              <div key={group.severity}>
                <h3 className="text-[15px] font-semibold">
                  {group.title} · <span className="num">{group.items.length}</span>
                </h3>
                <p className="measure mt-1 text-[13px] leading-snug text-ink-soft">{group.blurb}</p>
                <ul className="mt-3 space-y-3">
                  {group.items.map((issue, index) => {
                    const current = issue.lineIndex === activeLineIndex;
                    return (
                      <li key={`${issue.code}-${issue.lineIndex}-${index}`}>
                        <button
                          type="button"
                          onClick={() => onSelectLine(issue.lineIndex)}
                          aria-current={current ? "true" : undefined}
                          className={`block w-full rounded-sm border px-4 py-3 text-left transition-colors duration-150 motion-reduce:transition-none ${
                            current
                              ? "border-blue/30 bg-blue-wash"
                              : "border-rule bg-paper-sunk hover:border-rule-strong"
                          }`}
                        >
                          <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span
                              aria-hidden="true"
                              className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-sm border border-rule-strong bg-paper-raised text-[11px] text-ink"
                            >
                              {group.marker}
                            </span>
                            <span className="sr-only">{group.spoken} on </span>
                            <span>Line {String(issue.lineIndex + 1).padStart(2, "0")}</span>
                            <span aria-hidden="true">·</span>
                            <span>{issue.code}</span>
                          </p>
                          <p className="measure mt-2 text-[15px] leading-[1.55] text-ink">
                            {issue.message}
                          </p>
                          <p className="eyebrow mt-3">On a machine</p>
                          <p className="measure mt-1 text-[14px] leading-[1.55] text-ink-soft">
                            {issue.consequence}
                          </p>
                          <p className="eyebrow mt-2.5">Write this instead</p>
                          <p className="measure mt-1 text-[14px] leading-[1.55] text-ink-soft">
                            {issue.fix}
                          </p>
                          <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow text-blue">
                            Go to line {String(issue.lineIndex + 1).padStart(2, "0")}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <p className="border-t border-rule pt-4 text-[13px] leading-snug text-ink-soft">
              Clearing every finding here does not make a program safe to run. These checks compare
              what you wrote against itself; they know nothing about your fixture, your tool lengths
              or your machine&rsquo;s travels.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
