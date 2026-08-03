import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { glossary } from "@/content/glossary";
import { lessons } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Every term the course uses, defined twice: once in plain words for a complete beginner, and once as the precise engineering statement. Searchable by term, alias or definition.",
};

/**
 * The glossary route. SPEC.md section 8 and Phase 5.
 *
 * The page composes only. Lesson titles are resolved here, on the server, so
 * the browser never has to ship the full lesson content just to label a link.
 */
export default function GlossaryPage() {
  const lessonTitles: Record<string, string> = Object.fromEntries(
    lessons.map((lesson) => [lesson.slug, lesson.title]),
  );

  return (
    <>
      <PageHeader
        eyebrow={`Reference · ${glossary.length} terms`}
        title="Glossary"
        intro="Every term this course uses, defined twice over: first in plain words that assume no prior knowledge, then as the precise engineering statement you will meet on a datasheet, a drawing or a machine specification."
      >
        <p className="measure text-[15px] leading-[1.65] text-ink-soft">
          Search matches the term, any alias and the whole of both definitions, so
          &ldquo;ballscrew&rdquo; and &ldquo;rolling friction&rdquo; both find the same entry.
          Each entry has its own address — <span className="font-mono">/glossary#ball-screw</span>{" "}
          — which is where the lessons link when a term first appears in their prose.
        </p>
      </PageHeader>

      <GlossaryBrowser lessonTitles={lessonTitles} />
    </>
  );
}
