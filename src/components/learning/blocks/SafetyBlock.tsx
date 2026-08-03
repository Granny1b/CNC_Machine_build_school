import { TickedText } from "./ProseBlock";

/**
 * The `safety` block — the only amber component in the whole site.
 *
 * SPEC section 5: amber is reserved exclusively for safety content so that it
 * never loses its meaning. Nothing else on any page may use it for emphasis,
 * hover, decoration or a generic warning.
 *
 * It is an `aside` with an accessible name, so a screen reader announces it as
 * safety information rather than as the next paragraph of the lesson. The name
 * is given with `aria-label` rather than `aria-labelledby` so that a lesson
 * carrying two safety blocks cannot produce a duplicate id.
 *
 * The amber pigment carries the panel — ground, border and the warning glyph.
 * The "Safety" label itself is set in `ink`: amber on the amber wash measures
 * about 3:1, which is sound for a graphical mark and short of the 4.5:1 SPEC 5.6
 * demands of text.
 */
export function SafetyBlock({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n+/);

  return (
    <aside
      aria-label="Safety"
      className="rounded-sm border border-amber/45 bg-amber-wash px-5 py-5 sm:px-6"
    >
      <div className="flex items-center gap-2.5">
        <svg
          aria-hidden="true"
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          className="shrink-0 text-amber-ink"
        >
          <path
            d="M9 1.4 17 14.6H1L9 1.4Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M9 5.7v4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="12.1" r="0.85" fill="currentColor" />
        </svg>
        <p className="eyebrow text-ink">Safety</p>
      </div>

      <div className="measure mt-3 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[16px] leading-[1.65] text-ink">
            <TickedText text={paragraph} />
          </p>
        ))}
      </div>
    </aside>
  );
}
