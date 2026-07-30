import type { Formula } from "@/content/types";
import { FormulaCard } from "@/components/calculators/FormulaCard";
import { EstimateNote } from "@/components/calculators/CalcField";

/**
 * The `formula` block, given the shop-reference-card treatment: the expression
 * large in mono, every symbol with its meaning and unit, then the line saying
 * what the relationship tells you to do differently.
 *
 * The drawing is `FormulaCard`, the same card the calculators use, so a formula
 * met in a lesson and the same formula met on `/calculators` are visibly the
 * same object. What is added here is SPEC rule 3: a formula in a lesson is a
 * teaching simplification and says so, on the page, next to the expression.
 */

const FORMULA_ESTIMATE_NOTE =
  "A formula is a model, not a machine. This one holds the textbook relationship between the quantities listed above and accounts for nothing else — not stiffness, wear, temperature, duty cycle or the tolerances of the parts involved. Use it to understand which way a number moves and roughly how far, then use manufacturer data and professional engineering validation for anything that will be built, bought or cut.";

export interface FormulaBlockProps {
  formula: Formula;
  /** Overridden by `DeeperBlock`, where the formula sits inside a disclosure. */
  eyebrow?: string;
  className?: string;
}

export function FormulaBlock({ formula, eyebrow, className = "" }: FormulaBlockProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <FormulaCard formula={formula} eyebrow={eyebrow} />
      <EstimateNote>{FORMULA_ESTIMATE_NOTE}</EstimateNote>
    </div>
  );
}
