import { Card } from "@/components/ui/Card";
import { TickedText } from "./blocks/ProseBlock";

/**
 * The summary: the sentences worth keeping, in the order they were argued.
 *
 * It is deliberately a list of claims rather than a paragraph, so it can be read
 * as a checklist — anything here that does not yet feel obvious points back at a
 * section to re-read.
 */
export function LessonSummary({ summary }: { summary: string[] }) {
  if (summary.length === 0) return null;

  return (
    <Card as="section" tone="wash">
      <div className="border-b border-blue/15 px-5 py-4 sm:px-6">
        <p className="eyebrow">Summary</p>
        <h2 className="mt-2 text-[20px] font-semibold sm:text-[22px]">
          What to take away from this lesson
        </h2>
      </div>
      <ul className="divide-y divide-blue/10">
        {summary.map((line, index) => (
          <li key={index} className="flex gap-3 px-5 py-3.5 sm:px-6">
            <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[12px] text-blue">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="measure text-[16px] leading-[1.6] text-ink">
              <TickedText text={line} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
