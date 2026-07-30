import Link from "next/link";
import type { LessonHeading } from "./blocks/HeadingBlock";
import { TickedText } from "./blocks/ProseBlock";

/**
 * In-lesson navigation: where you are in the sequence, and a jump list of the
 * lesson's own sections.
 *
 * The section ids come from `lessonHeadings`, the same helper the renderer uses
 * to write the anchors, so a jump can never point at a heading that is not there.
 * The links are plain fragment links: no JavaScript, and the global smooth-scroll
 * rule in `globals.css` already switches itself off under
 * `prefers-reduced-motion`.
 */
export interface LessonNavProps {
  headings: LessonHeading[];
  previous?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

const LINK = [
  "text-ink underline decoration-rule-strong decoration-1 underline-offset-4",
  "transition-colors duration-150 hover:text-blue hover:decoration-blue",
  "motion-reduce:transition-none",
].join(" ");

export function LessonNav({ headings, previous, next }: LessonNavProps) {
  if (headings.length === 0 && !previous && !next) return null;

  return (
    <nav
      aria-label="This lesson"
      className="rounded-sm border border-rule bg-paper-sunk px-5 py-4 sm:px-6"
    >
      {previous || next ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {previous ? (
            <p className="text-[14px] leading-snug">
              <span className="eyebrow block">Previous lesson</span>
              <Link href={`/learn/${previous.slug}`} className={`mt-1 inline-block ${LINK}`}>
                {previous.title}
              </Link>
            </p>
          ) : (
            <p className="text-[14px] leading-snug">
              <span className="eyebrow block">Starting point</span>
              <span className="mt-1 inline-block text-ink-soft">
                This is the first lesson of the course.
              </span>
            </p>
          )}
          {next ? (
            <p className="text-[14px] leading-snug sm:text-right">
              <span className="eyebrow block">Next lesson</span>
              <Link href={`/learn/${next.slug}`} className={`mt-1 inline-block ${LINK}`}>
                {next.title}
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {headings.length > 0 ? (
        <div className={previous || next ? "mt-4 border-t border-rule pt-4" : ""}>
          <p className="eyebrow">
            Sections · <span className="num">{headings.length}</span>
          </p>
          <ol className="mt-2.5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {headings.map((heading, index) => (
              <li key={heading.id} className="flex gap-3 text-[14px] leading-snug">
                <span aria-hidden="true" className="num shrink-0 text-[12px] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <a href={`#${heading.id}`} className={LINK}>
                  <TickedText text={heading.text} />
                </a>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </nav>
  );
}
