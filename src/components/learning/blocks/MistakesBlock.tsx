import { Card } from "@/components/ui/Card";
import { TickedText } from "./ProseBlock";

/**
 * The `mistakes` block: the belief, then why it breaks.
 *
 * The wrong statement has to be unmistakably marked as the wrong one, or a
 * skim-reader takes it away as fact. It carries a cross glyph, a rule-strong
 * left border, a "the belief" eyebrow and a screen-reader prefix — four signals,
 * none of them colour alone.
 *
 * Amber is deliberately absent. SPEC section 5 reserves it for safety content,
 * and a misconception is not a hazard.
 */
export function MistakesBlock({ items }: { items: { wrong: string; why: string }[] }) {
  return (
    <Card tone="sunk">
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">Common mistakes</p>
        <h3 className="mt-2 text-[19px] font-semibold sm:text-[21px]">
          What people get wrong here, and why it breaks
        </h3>
      </div>

      <ol className="divide-y divide-rule">
        {items.map((item, index) => (
          <li key={index} className="px-5 py-5 sm:px-6">
            <div className="flex gap-3 border-l-2 border-rule-strong pl-3.5">
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 font-mono text-[15px] leading-none text-ink-soft"
              >
                &times;
              </span>
              <div className="min-w-0">
                <p className="eyebrow">
                  The belief · <span className="normal-case tracking-normal">not true</span>
                </p>
                <p className="measure mt-1.5 text-[16px] leading-[1.6] text-ink">
                  <span className="sr-only">Mistaken belief: </span>
                  <TickedText text={item.wrong} />
                </p>
              </div>
            </div>

            <div className="mt-3.5 pl-[1.6rem]">
              <p className="eyebrow">Why it breaks</p>
              <p className="measure mt-1.5 text-[16px] leading-[1.65] text-ink-soft">
                <TickedText text={item.why} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
