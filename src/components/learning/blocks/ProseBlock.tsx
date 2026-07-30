import Link from "next/link";
import { Fragment } from "react";
import { autolinkParagraphs, plainSegments, type AutolinkSegment } from "@/lib/autolink";
import { glossaryIndex } from "@/content/glossary";

/**
 * The `prose` block, and the two text renderers every other block reuses.
 *
 * Auto-linking rules, from SPEC Phase 5 and `lib/autolink.ts`:
 *   - a term is linked on its first occurrence in the lesson and never again,
 *     which is why `used` is threaded down from `LessonView` rather than being
 *     created here (a module-level set would leak between pages);
 *   - text written between backticks is a `code` segment: it is set in mono and
 *     is never linked;
 *   - `skipSlugs` carries the lesson's own terminology, so a lesson never links
 *     away to a definition it is itself giving.
 */

const LINK_CLASSES = [
  "text-ink underline decoration-blue/40 decoration-1 underline-offset-4",
  "transition-colors duration-150 hover:text-blue hover:decoration-blue",
  "motion-reduce:transition-none",
].join(" ");

/** Mono, tabular, and a shade smaller so mono's x-height matches the body. */
const CODE_CLASSES = "num text-[0.94em]";

/** Render autolinked segments. Only `slug` segments become links. */
export function ProseSegments({ segments }: { segments: AutolinkSegment[] }) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.code) {
          return (
            <span key={index} className={CODE_CLASSES}>
              {segment.text}
            </span>
          );
        }
        if (segment.slug) {
          return (
            <Link key={index} href={`/glossary#${segment.slug}`} className={LINK_CLASSES}>
              {segment.text}
            </Link>
          );
        }
        return <Fragment key={index}>{segment.text}</Fragment>;
      })}
    </>
  );
}

/**
 * Authored text with backticked values, set without any links at all. Used by
 * headings, captions, quiz options, summaries and every block that is not
 * running prose.
 */
export function TickedText({ text }: { text: string }) {
  return <ProseSegments segments={plainSegments(text)} />;
}

export interface ProseBlockProps {
  body: string[];
  /** Shared across the whole lesson: first occurrence only. */
  used: Set<string>;
  /** Glossary slugs this lesson defines itself. */
  skipSlugs?: string[];
}

export function ProseBlock({ body, used, skipSlugs }: ProseBlockProps) {
  const paragraphs = autolinkParagraphs(body, glossaryIndex, { skipSlugs, used });

  return (
    <div className="measure space-y-4">
      {paragraphs.map((segments, index) => (
        <p key={index} className="text-[17px] leading-[1.65] text-ink">
          <ProseSegments segments={segments} />
        </p>
      ))}
    </div>
  );
}
