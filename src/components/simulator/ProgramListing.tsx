"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { pluralise } from "@/lib/format";
import type { Diagnostic, IssueSeverity, ParsedLine } from "@/lib/gcode";

/**
 * The program, line-numbered, with the active line marked by a background *and*
 * a mono marker glyph — colour is never the only carrier — and with a gutter
 * mark on any line something was said about.
 *
 * Two views of the same text: a listing you can click through, and a textarea
 * you can type into. The textarea is live, so the toolpath, the readout and the
 * findings all change as you type; the toggle only decides which view of the
 * program you are looking at.
 */

export interface ProgramListingProps {
  source: string;
  lines: ParsedLine[];
  /** Index of the line the simulation is sitting on. */
  activeLineIndex: number;
  diagnostics: Diagnostic[];
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onSourceChange: (source: string) => void;
  onSelectLine: (lineIndex: number) => void;
}

/**
 * Deliberately not letters. The gutter sits immediately left of G-code set in
 * the same mono face, and E, W and N are all address letters — N is the line
 * number, W is an axis word — so a letter here reads as part of the program.
 * The severity is also announced in words for screen readers just below.
 */
const SEVERITY_MARKERS: Record<IssueSeverity, string> = { error: "!", warning: "?", note: "·" };
const SEVERITY_RANK: Record<IssueSeverity, number> = { error: 0, warning: 1, note: 2 };

/** The worst thing said about each line, which is what its gutter shows. */
function worstBySeverity(diagnostics: Diagnostic[]): Map<number, IssueSeverity> {
  const worst = new Map<number, IssueSeverity>();
  for (const issue of diagnostics) {
    const held = worst.get(issue.lineIndex);
    if (!held || SEVERITY_RANK[issue.severity] < SEVERITY_RANK[held]) {
      worst.set(issue.lineIndex, issue.severity);
    }
  }
  return worst;
}

/** Read once and then watched: nothing here scrolls smoothly against your wishes. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return reduced;
}

export function ProgramListing({
  source,
  lines,
  activeLineIndex,
  diagnostics,
  editing,
  onEditingChange,
  onSourceChange,
  onSelectLine,
}: ProgramListingProps) {
  const markers = worstBySeverity(diagnostics);
  const reducedMotion = usePrefersReducedMotion();
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const editorId = useId();

  // Keep the active line in view without ever taking the page with it.
  useEffect(() => {
    if (editing) return;
    const element = activeRef.current;
    if (!element) return;
    element.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeLineIndex, editing, reducedMotion]);

  const gutterWidth = `${Math.max(2, String(lines.length).length)}ch`;

  return (
    <section
      aria-labelledby="listing-heading"
      className="flex h-full flex-col rounded-sm border border-rule bg-paper-raised shadow-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-rule px-5 py-4 sm:px-6">
        <div>
          <h2 id="listing-heading" className="text-[18px] font-semibold sm:text-[20px]">
            The program
          </h2>
          <p className="eyebrow mt-1">
            {lines.length} {pluralise(lines.length, "line")} · {diagnostics.length}{" "}
            {pluralise(diagnostics.length, "finding")}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Listing view">
          <Button
            size="sm"
            variant={editing ? "secondary" : "primary"}
            aria-pressed={!editing}
            onClick={() => onEditingChange(false)}
          >
            Follow
          </Button>
          <Button
            size="sm"
            variant={editing ? "primary" : "secondary"}
            aria-pressed={editing}
            onClick={() => onEditingChange(true)}
          >
            Edit
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-1 flex-col px-5 py-4 sm:px-6">
          <label htmlFor={editorId} className="eyebrow">
            Type or paste a program
          </label>
          <textarea
            id={editorId}
            value={source}
            onChange={(event) => onSourceChange(event.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            aria-describedby={`${editorId}-hint`}
            className="mt-2 h-[24rem] w-full resize-y overflow-auto rounded-sm border border-rule-strong bg-paper-sunk px-3 py-2 font-mono text-[13px] leading-[1.55] tabular-nums text-ink outline-none focus-visible:border-blue-bright"
          />
          <p id={`${editorId}-hint`} className="mt-2 text-[13px] leading-snug text-ink-soft">
            The drawing, the readout and the findings update as you type. Switch back to Follow to
            step through what you have written.
          </p>
        </div>
      ) : (
        <div className="max-h-[27rem] flex-1 overflow-auto px-2 py-2">
          <ol className="w-max min-w-full">
            {lines.map((line, index) => {
              const active = index === activeLineIndex;
              const severity = markers.get(index);
              return (
                <li key={index}>
                  <button
                    type="button"
                    ref={active ? activeRef : undefined}
                    onClick={() => onSelectLine(index)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-start gap-2 rounded-sm px-2 py-[3px] text-left font-mono text-[12px] leading-[1.55] tabular-nums transition-colors duration-150 motion-reduce:transition-none ${
                      active
                        ? "bg-blue-wash font-medium text-blue"
                        : "text-ink-soft hover:bg-paper-sunk"
                    }`}
                  >
                    <span aria-hidden="true" className="w-[1ch] shrink-0 text-blue">
                      {active ? ">" : " "}
                    </span>
                    <span className="sr-only">Line </span>
                    <span
                      className="shrink-0 text-right text-ink-soft"
                      style={{ width: gutterWidth }}
                    >
                      {index + 1}
                    </span>
                    <span aria-hidden="true" className="w-[1ch] shrink-0 text-ink">
                      {severity ? SEVERITY_MARKERS[severity] : " "}
                    </span>
                    {severity ? <span className="sr-only">has a {severity}. </span> : null}
                    <span className="whitespace-pre">{line.raw === "" ? " " : line.raw}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <p className="border-t border-rule px-5 py-3 text-[13px] leading-snug text-ink-soft sm:px-6">
        {editing ? (
          "Nothing you type leaves your browser, and nothing here has any route to a machine."
        ) : (
          <>
            Click any line to jump the simulation to it. <span className="font-mono">!</span>,{" "}
            <span className="font-mono">?</span> and <span className="font-mono">·</span> in the
            gutter mark a line with an error, a warning or a note against it.
          </>
        )}
      </p>
    </section>
  );
}
