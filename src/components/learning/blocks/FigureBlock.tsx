import type { FigureId } from "@/content/types";
import { getFigure } from "../figures";
import { TickedText } from "./ProseBlock";

/**
 * The `figure` block: a hand-authored SVG drawing with its caption.
 *
 * The drawing is not decorative, so each SVG carries `role="img"` and an
 * `aria-label` describing what it shows. The caption carries the teaching — what
 * to look for — and is authored with the lesson, not with the drawing.
 *
 * The 8mm graph-paper wash of SPEC 5.5 sits behind every figure, which is what
 * makes the drawings read as one set. Each figure owns its own horizontal
 * scroller, so a dense drawing keeps its lettering legible at 360px instead of
 * shrinking into illegibility, and the page body still never scrolls sideways.
 */
export function FigureBlock({
  figure,
  caption,
  number,
}: {
  figure: FigureId;
  caption: string;
  /** Position among the lesson's figures, for the mono figure number. */
  number: number;
}) {
  const Figure = getFigure(figure);

  return (
    <figure className="max-w-full">
      <div className="grid-wash rounded-sm border border-rule bg-paper-raised px-4 py-5 sm:px-6">
        <Figure />
      </div>
      <figcaption className="mt-3">
        <span className="eyebrow">
          Figure <span className="num">{String(number).padStart(2, "0")}</span>
        </span>
        <span className="measure mt-1.5 block text-[15px] leading-[1.6] text-ink-soft">
          <TickedText text={caption} />
        </span>
      </figcaption>
    </figure>
  );
}
