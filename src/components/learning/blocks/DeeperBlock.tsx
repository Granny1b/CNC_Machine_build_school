import type { Formula } from "@/content/types";
import { Disclosure } from "@/components/ui/Disclosure";
import { FormulaBlock } from "./FormulaBlock";
import { TickedText } from "./ProseBlock";

/**
 * The `deeper` block: optional technical depth behind a disclosure, so a
 * beginner can read a whole lesson without it and come back later.
 *
 * The title authored in the content always states what is inside, which is what
 * makes skipping it an informed choice rather than a guess.
 *
 * Prose here is not auto-linked. A glossary link is a first-occurrence signal in
 * the main thread of the lesson, and a term first met inside a collapsed panel
 * would be silently used later without ever having been introduced.
 */
export function DeeperBlock({
  title,
  body,
  formula,
}: {
  title: string;
  body: string[];
  formula?: Formula;
}) {
  return (
    <Disclosure eyebrow="Going deeper" title={title}>
      <div className="measure space-y-4">
        {body.map((paragraph, index) => (
          <p key={index} className="text-[16px] leading-[1.65] text-ink-soft">
            <TickedText text={paragraph} />
          </p>
        ))}
      </div>
      {formula ? <FormulaBlock className="mt-6" formula={formula} eyebrow="The relationship" /> : null}
    </Disclosure>
  );
}
