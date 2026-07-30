import type { LessonBlock } from "@/content/types";
import { ProseBlock } from "./blocks/ProseBlock";
import { HeadingBlock, lessonHeadings } from "./blocks/HeadingBlock";
import { DeeperBlock } from "./blocks/DeeperBlock";
import { ExampleBlock } from "./blocks/ExampleBlock";
import { FigureBlock } from "./blocks/FigureBlock";
import { MistakesBlock } from "./blocks/MistakesBlock";
import { SafetyBlock } from "./blocks/SafetyBlock";
import { NoteBlock } from "./blocks/NoteBlock";
import { CompareBlock } from "./blocks/CompareBlock";
import { FormulaBlock } from "./blocks/FormulaBlock";
import { WidgetBlock } from "./blocks/WidgetBlock";

/**
 * The block switch: one component per `LessonBlock` kind, and nothing else.
 *
 * The switch is exhaustive by construction. Adding a kind to the union in
 * `content/types.ts` without a case here fails to compile on `impossible`, so a
 * new kind can never render as a silent blank.
 *
 * Two things are precomputed here rather than inside the blocks:
 *   - heading ids, from the same `lessonHeadings` helper `LessonNav` uses, so the
 *     jump list and the anchors cannot drift apart;
 *   - figure numbers, so a caption can say "Figure 02" without a figure knowing
 *     anything about the lesson it sits in.
 *
 * `used` is the lesson-wide set of glossary slugs already linked. It is created
 * once per lesson in `LessonView` and mutated as prose blocks render, which is
 * what makes auto-linking first-occurrence-only. Blocks render in document
 * order, so "first" means first as read.
 */
export interface LessonBlocksProps {
  blocks: LessonBlock[];
  used: Set<string>;
  /** Glossary slugs this lesson defines in its own terminology list. */
  skipSlugs: string[];
}

export function LessonBlocks({ blocks, used, skipSlugs }: LessonBlocksProps) {
  const headingIds = new Map(
    lessonHeadings(blocks).map((heading) => [heading.blockIndex, heading.id]),
  );

  const figureNumbers = new Map<number, number>();
  blocks.forEach((block, index) => {
    if (block.kind === "figure") figureNumbers.set(index, figureNumbers.size + 1);
  });

  function render(block: LessonBlock, index: number) {
    switch (block.kind) {
      case "prose":
        return <ProseBlock body={block.body} used={used} skipSlugs={skipSlugs} />;
      case "heading":
        return (
          <HeadingBlock text={block.text} id={headingIds.get(index) ?? `section-${index}`} />
        );
      case "deeper":
        return <DeeperBlock title={block.title} body={block.body} formula={block.formula} />;
      case "example":
        return <ExampleBlock title={block.title} body={block.body} />;
      case "figure":
        return (
          <FigureBlock
            figure={block.figure}
            caption={block.caption}
            number={figureNumbers.get(index) ?? 1}
          />
        );
      case "mistakes":
        return <MistakesBlock items={block.items} />;
      case "safety":
        return <SafetyBlock body={block.body} />;
      case "note":
        return <NoteBlock title={block.title} body={block.body} />;
      case "compare":
        return (
          <CompareBlock title={block.title} columns={block.columns} rows={block.rows} />
        );
      case "formula":
        return <FormulaBlock formula={block.formula} />;
      case "widget":
        return <WidgetBlock widget={block.widget} />;
      default: {
        const impossible: never = block;
        throw new Error(`Unhandled lesson block: ${JSON.stringify(impossible)}`);
      }
    }
  }

  return (
    <div className="space-y-7">
      {blocks.map((block, index) => (
        <div key={index}>{render(block, index)}</div>
      ))}
    </div>
  );
}
