import type { WidgetId } from "@/content/types";
import { MachiningCalculator } from "@/components/calculators/MachiningCalculator";
import { AxisSizingCalculator } from "@/components/calculators/AxisSizingCalculator";
import { ExplorerTeaser } from "@/components/explorer/ExplorerTeaser";

/**
 * The `widget` block: an interactive tool embedded in the reading.
 *
 * Calculators are dropped in `compact`, which suppresses the page-level
 * introduction they carry on `/calculators` while keeping the formula, the
 * guard rails and the educational-estimate note — none of those are optional.
 *
 * The switch is exhaustive by construction: adding a `WidgetId` to
 * `content/types.ts` without handling it here is a type error on `impossible`.
 */
export function WidgetBlock({ widget }: { widget: WidgetId }) {
  switch (widget) {
    case "machining-calculator":
      return <MachiningCalculator compact />;
    case "axis-sizing":
      return <AxisSizingCalculator compact />;
    case "explorer-teaser":
      return <ExplorerTeaser />;
    default: {
      const impossible: never = widget;
      throw new Error(`Unhandled widget: ${String(impossible)}`);
    }
  }
}
