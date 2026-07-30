import Link from "next/link";
import type { TermDefinition } from "@/content/types";
import { glossaryIndex } from "@/content/glossary";
import { Card } from "@/components/ui/Card";
import { TickedText } from "./blocks/ProseBlock";

/**
 * The lesson's terminology, defined before it is used. SPEC section 1: every
 * technical word is defined at the point it first appears, and a lesson opens by
 * naming the words it is about to lean on.
 *
 * Where a term also has a glossary entry, the term links to it — the lesson
 * gives the one-line version, the glossary gives both the plain and the precise
 * definitions.
 */

/**
 * Resolve an authored term to a glossary slug, using the same surface-form map
 * that drives auto-linking, so a term and its aliases resolve identically.
 *
 * Authored terms are often written as "Computer numerical control (CNC)", so the
 * whole string, the part before the bracket and the abbreviation inside it are
 * all tried before giving up.
 *
 * `LessonView` uses this to build the `skipSlugs` list, which stops a lesson
 * linking away to a definition it is itself giving.
 */
export function glossarySlugForTerm(term: string): string | undefined {
  const whole = term.trim();
  const candidates = [whole];
  const bracketed = whole.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (bracketed) candidates.push(bracketed[1], bracketed[2]);

  for (const candidate of candidates) {
    const slug = glossaryIndex.bySurface.get(candidate.trim().toLowerCase());
    if (slug) return slug;
  }
  return undefined;
}

export function TermList({ terms }: { terms: TermDefinition[] }) {
  if (terms.length === 0) return null;

  return (
    <Card tone="sunk">
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">
          Terminology · <span className="num">{terms.length}</span> words
        </p>
        <h2 className="mt-2 text-[19px] font-semibold sm:text-[21px]">
          The words this lesson uses
        </h2>
      </div>
      <dl className="grid gap-x-8 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
        {terms.map((term) => {
          const slug = glossarySlugForTerm(term.term);
          return (
            <div key={term.term}>
              <dt className="font-mono text-[14px] font-medium text-ink">
                {slug ? (
                  <Link
                    href={`/glossary#${slug}`}
                    className="underline decoration-blue/40 decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue motion-reduce:transition-none"
                  >
                    {term.term}
                    <span className="sr-only"> — full glossary entry</span>
                  </Link>
                ) : (
                  term.term
                )}
              </dt>
              <dd className="mt-1.5 text-[15px] leading-[1.6] text-ink-soft">
                <TickedText text={term.plain} />
              </dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}
