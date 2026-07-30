import type { CompareRow } from "@/content/types";
import { Card } from "@/components/ui/Card";
import { TickedText } from "./ProseBlock";

/**
 * The `compare` block: a real table, because a comparison is tabular data and
 * anything else would hide that from assistive technology.
 *
 * Accessibility and layout notes:
 *   - the row-label column is a `th scope="row"`, the column headings are
 *     `th scope="col"`, so a screen reader can announce "Cost per part, batch of
 *     200 — CNC machine — low" instead of reading a grid of loose cells;
 *   - the visible title sits outside the scrolling region so it stays readable
 *     at 360px, and the table keeps a `caption` of its own for the accessible
 *     name. The caption is the same words, marked `sr-only` so it is not printed
 *     twice;
 *   - the table has a minimum width and scrolls INSIDE its own container, so the
 *     page body never scrolls sideways on a narrow screen.
 */

/**
 * A cell is set in mono when it is a value rather than a sentence: short, has a
 * digit in it, and no word long enough to be prose. SPEC 5.2 requires every
 * measured or calculated number to be mono; cells that are prose still get their
 * backticked values picked out by `TickedText`.
 */
function isValueCell(text: string): boolean {
  const trimmed = text.trim().replace(/`/g, "");
  if (trimmed.length === 0 || trimmed.length > 24) return false;
  if (!/\d/.test(trimmed)) return false;
  return !/[A-Za-z]{4,}/.test(trimmed);
}

export function CompareBlock({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: CompareRow[];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">Side by side</p>
        <h3 className="mt-2 text-[19px] font-semibold sm:text-[21px]">
          <TickedText text={title} />
        </h3>
      </div>

      <div className="overflow-x-auto">
        {/* The minimum width grows with the number of columns: four columns of
            prose need room to breathe, and it scrolls inside this container
            rather than pushing the page sideways. */}
        <table
          className="w-full border-collapse text-left align-top"
          style={{ minWidth: `${Math.min(64, 12 + columns.length * 13)}rem` }}
        >
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="border-b border-rule-strong">
              <th scope="col" className="eyebrow px-5 py-3 align-bottom sm:px-6">
                Aspect
              </th>
              {columns.map((column) => (
                <th
                  scope="col"
                  key={column}
                  className="px-5 py-3 align-bottom font-display text-[15px] font-semibold tracking-tightest text-ink sm:px-6"
                >
                  <TickedText text={column} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-rule last:border-0">
                <th
                  scope="row"
                  className="w-[11rem] px-5 py-4 align-top text-[15px] font-semibold leading-snug text-ink sm:px-6"
                >
                  <TickedText text={row.label} />
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={index}
                    className={
                      isValueCell(cell)
                        ? "num px-5 py-4 align-top text-[14px] text-ink sm:px-6"
                        : "px-5 py-4 align-top text-[15px] leading-[1.55] text-ink-soft sm:px-6"
                    }
                  >
                    <TickedText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
