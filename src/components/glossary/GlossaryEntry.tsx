import Link from "next/link";
import type { GlossaryTerm, GlossaryTag } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { GLOSSARY_TAG_LABELS } from "@/content/glossary";

export interface GlossaryEntryProps {
  entry: GlossaryTerm;
  /** slug → display name, so cross-references read as words rather than slugs. */
  termNames: Record<string, string>;
  /** slug → lesson title. Unknown slugs fall back to the slug itself. */
  lessonTitles?: Record<string, string>;
}

/**
 * One glossary entry, deep-linkable at `/glossary#<slug>`.
 *
 * `id` plus `scroll-mt-28` is what makes the anchor land below the sticky site
 * header instead of underneath it.
 *
 * Amber is used for exactly one thing here: the `safety` tag. That is genuine
 * safety content, which is the only permitted use of the colour (SPEC 5).
 */
export function GlossaryEntry({ entry, termNames, lessonTitles = {} }: GlossaryEntryProps) {
  const related = entry.related.filter((slug) => termNames[slug]);

  return (
    // `id` and the scroll margin sit on the wrapper, not on Card: Card owns its
    // own props and the anchor has to clear the sticky site header.
    <article id={entry.slug} className="scroll-mt-28">
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="text-[20px] font-semibold sm:text-[22px]">{entry.term}</h3>
            <ul className="flex flex-wrap items-center gap-1.5">
              {entry.tags.map((tag: GlossaryTag) => (
                <li key={tag}>
                  <Badge tone={tag === "safety" ? "amber" : "outline"}>
                    {GLOSSARY_TAG_LABELS[tag]}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={`#${entry.slug}`}
            className="mt-1 inline-block font-mono text-[11px] text-ink-soft transition-colors hover:text-blue motion-reduce:transition-none"
          >
            <span aria-hidden="true">#</span>
            {entry.slug}
            <span className="sr-only"> — link to this entry</span>
          </a>

          <p className="measure mt-3 text-[16px] leading-[1.65] text-ink">{entry.plain}</p>

          <div className="mt-4 border-l-2 border-rule-strong pl-4">
            <p className="eyebrow">In engineering terms</p>
            <p className="measure mt-1.5 text-[15px] leading-[1.65] text-ink-soft">
              {entry.technical}
            </p>
          </div>

          {entry.example ? (
            <div className="mt-4 rounded-sm border border-rule bg-paper-sunk px-4 py-3">
              <p className="eyebrow">On the shop floor</p>
              <p className="measure mt-1.5 text-[15px] leading-[1.6] text-ink-soft">
                {entry.example}
              </p>
            </div>
          ) : null}

          {entry.aliases && entry.aliases.length > 0 ? (
            <p className="mt-4 text-[13px] leading-snug text-ink-soft">
              <span className="eyebrow">Also written </span>
              {entry.aliases.join(", ")}
            </p>
          ) : null}

          {related.length > 0 || entry.lessons.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-rule pt-4 sm:grid-cols-2">
              {related.length > 0 ? (
                <div>
                  <p className="eyebrow">Related terms</p>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                    {related.map((slug) => (
                      <li key={slug}>
                        <a
                          href={`#${slug}`}
                          className="text-[14px] text-blue underline decoration-blue/30 underline-offset-4 transition-colors hover:decoration-blue motion-reduce:transition-none"
                        >
                          {termNames[slug]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {entry.lessons.length > 0 ? (
                <div>
                  <p className="eyebrow">Taught in</p>
                  <ul className="mt-2 space-y-1.5">
                    {entry.lessons.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/learn/${slug}`}
                          className="text-[14px] text-blue underline decoration-blue/30 underline-offset-4 transition-colors hover:decoration-blue motion-reduce:transition-none"
                        >
                          {lessonTitles[slug] ?? slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardBody>
      </Card>
    </article>
  );
}
