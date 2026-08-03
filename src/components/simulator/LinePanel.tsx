import { Badge } from "@/components/ui/Badge";
import type { LineExplanation, ParsedLine } from "@/lib/gcode";

/**
 * What the active line means, word by word.
 *
 * Plain language first and terminology second, and the modal words marked,
 * because "this one stays in force until something changes it" is the single
 * idea a beginner most often misses — and the reason a program that reads
 * correctly line by line can still do something entirely unexpected.
 */

export interface LinePanelProps {
  /** The active line as parsed, or undefined when the program is empty. */
  line?: ParsedLine;
  /** The explanation for that line, or undefined when there is nothing to say. */
  explanation?: LineExplanation;
  /** 1-based number of the line, as the listing shows it. */
  lineNumber: number;
}

export function LinePanel({ line, explanation, lineNumber }: LinePanelProps) {
  const raw = line ? line.raw.trim() : "";
  const words = explanation ? explanation.words : [];
  const inherited = explanation ? explanation.inheritedModals : [];

  return (
    <section
      aria-labelledby="line-panel-heading"
      className="flex h-full flex-col rounded-sm border border-rule bg-paper-raised shadow-panel"
    >
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">Line {String(lineNumber).padStart(2, "0")}</p>
        <h2 id="line-panel-heading" className="mt-1 text-[18px] font-semibold sm:text-[20px]">
          What this line asks for
        </h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-rule bg-paper-sunk px-3 py-2">
          <p className="whitespace-pre font-mono text-[13px] text-ink">
            {raw === "" ? "(blank line)" : raw}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 sm:px-6">
        <p className="measure text-[16px] leading-[1.6] text-ink">
          {explanation
            ? explanation.summary
            : "There is nothing on this line for the machine to act on."}
        </p>

        {line && line.comments.length > 0 ? (
          <div className="mt-4">
            <p className="eyebrow">Comment on this line</p>
            <ul className="mt-1.5 space-y-1">
              {line.comments.map((comment, index) => (
                <li key={index} className="font-mono text-[13px] leading-snug text-ink-soft">
                  {comment}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">
              A comment is for whoever reads the program next. The machine ignores it entirely.
            </p>
          </div>
        ) : null}

        {words.length > 0 ? (
          <>
            <h3 className="mt-6 text-[15px] font-semibold">Word by word</h3>
            <p className="measure mt-1 text-[13px] leading-snug text-ink-soft">
              A word is one letter and one value. Words marked modal stay in force on every line
              that follows until something changes them.
            </p>
            <ul className="mt-3 space-y-3">
              {words.map((word, index) => (
                <li
                  key={`${word.word}-${index}`}
                  className="rounded-sm border border-rule bg-paper-sunk px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[14px] font-medium tabular-nums text-blue">
                      {word.word}
                    </span>
                    <span className="font-display text-[15px] font-semibold tracking-tightest text-ink">
                      {word.title}
                    </span>
                    {word.modal ? (
                      <Badge tone="blue">modal · stays in force</Badge>
                    ) : (
                      <Badge tone="outline">this line only</Badge>
                    )}
                  </div>
                  <p className="measure mt-2 text-[14px] leading-[1.55] text-ink-soft">
                    {word.body}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h3 className="mt-6 text-[15px] font-semibold">Still in force here</h3>
        <p className="measure mt-1 text-[13px] leading-snug text-ink-soft">
          These modes were set on earlier lines and this line did not change them, so the machine is
          still obeying them. They are the part of the program you cannot see by reading one line.
        </p>
        {inherited.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {inherited.map((modal) => (
              <li key={modal}>
                <span className="inline-flex rounded-sm border border-rule-strong bg-paper-sunk px-2 py-0.5 font-mono text-[12px] tabular-nums text-ink">
                  {modal}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[14px] leading-snug text-ink-soft">
            Nothing yet. Every mode is still whatever the control powered up in — which is why a
            program that never states its units, its plane and its positioning mode is a program
            you cannot read on its own.
          </p>
        )}
      </div>
    </section>
  );
}
