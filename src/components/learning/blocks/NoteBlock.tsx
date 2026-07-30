import { TickedText } from "./ProseBlock";

/**
 * The `note` block: an aside for the aside — the piece of context that would
 * derail a paragraph but is worth knowing.
 *
 * Drawn in the blue wash with a hairline rule down its left edge, the way a
 * marginal note sits beside a drawing. It is never amber: SPEC section 5 keeps
 * amber for safety content, and a note is not a warning.
 */
export function NoteBlock({ title, body }: { title: string; body: string }) {
  const paragraphs = body.split(/\n\n+/);

  return (
    <aside className="flex gap-4 rounded-sm border border-blue/20 bg-blue-wash px-4 py-4 sm:px-5">
      <span aria-hidden="true" className="w-0.5 shrink-0 rounded-sm bg-blue" />
      <div className="min-w-0">
        <p className="eyebrow">Worth knowing</p>
        <h3 className="mt-1.5 text-[17px] font-semibold">
          <TickedText text={title} />
        </h3>
        <div className="measure mt-2 space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-[1.65] text-ink-soft">
              <TickedText text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}
