import type { Formula } from "@/content/types";
import { Card } from "@/components/ui/Card";

export interface FormulaCardProps {
  formula: Formula;
  /** Small mono label above the expression. */
  eyebrow?: string;
  className?: string;
}

/**
 * A `Formula` drawn the way a shop reference card is drawn: the expression in
 * mono at the top, every symbol listed underneath with its unit, and a closing
 * line on what the relationship tells you to do differently.
 *
 * Expressions may be several lines. They are set in `whitespace-pre` inside a
 * horizontally scrollable well so that column alignment survives at 360px
 * without the page itself ever scrolling sideways.
 */
export function FormulaCard({ formula, eyebrow = "The formula", className = "" }: FormulaCardProps) {
  return (
    <Card className={className}>
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">{eyebrow}</p>
        <div className="mt-2.5 overflow-x-auto">
          <pre className="whitespace-pre font-mono text-[13px] font-medium leading-[1.85] tabular-nums text-blue-deep sm:text-[14px]">
            {formula.expression}
          </pre>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <p className="eyebrow">Every symbol, with its unit</p>
        <dl className="mt-2.5 space-y-2">
          {formula.variables.map((variable) => (
            <div
              key={variable.symbol}
              className="grid grid-cols-[3.5rem_1fr] gap-x-3 border-b border-rule/60 pb-2 last:border-0 last:pb-0 sm:grid-cols-[4.5rem_1fr]"
            >
              <dt className="font-mono text-[13px] font-medium text-blue">{variable.symbol}</dt>
              <dd className="text-[14px] leading-snug text-ink-soft">
                {variable.meaning}
                <span className="ml-2 whitespace-nowrap font-mono text-[12px] text-ink-soft">
                  {variable.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-rule bg-paper-sunk px-5 py-4 sm:px-6">
        <p className="eyebrow">What it tells you to do differently</p>
        <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-soft">{formula.meaning}</p>
      </div>
    </Card>
  );
}
