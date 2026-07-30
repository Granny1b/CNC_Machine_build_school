import type { LessonBlock } from "@/content/types";
import { TickedText } from "./ProseBlock";

/**
 * The `heading` block: an h2 carrying a stable id so `LessonNav` can jump to it.
 *
 * Headings are never auto-linked (SPEC Phase 5), so the text goes through
 * `TickedText`, which only picks backticked values out into mono.
 */

export interface LessonHeading {
  id: string;
  text: string;
  /** Index in the lesson's block array, so the renderer can match ids up. */
  blockIndex: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Every heading in a lesson with its final id, in document order.
 *
 * Ids are derived from the heading text so that a link to a section stays
 * readable, with a numeric suffix only where a lesson repeats a heading. Both
 * `LessonBlocks` and `LessonNav` read this one function, so the anchors and the
 * jump list cannot drift apart.
 */
export function lessonHeadings(blocks: LessonBlock[]): LessonHeading[] {
  const seen = new Map<string, number>();
  const headings: LessonHeading[] = [];

  blocks.forEach((block, blockIndex) => {
    if (block.kind !== "heading") return;
    const base = slugify(block.text) || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    headings.push({
      id: count === 1 ? base : `${base}-${count}`,
      text: block.text,
      blockIndex,
    });
  });

  return headings;
}

export function HeadingBlock({ text, id }: { text: string; id: string }) {
  return (
    <h2
      id={id}
      className="measure scroll-mt-28 border-t border-rule-strong pt-7 text-[24px] font-semibold sm:text-[28px]"
    >
      <TickedText text={text} />
    </h2>
  );
}
