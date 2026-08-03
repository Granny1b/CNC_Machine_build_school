import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LearningPath } from "@/components/learning/LearningPath";
import { TOTAL_LEVELS, curriculum } from "@/content/curriculum";
import { estimatedMinutes, lessons } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Learning path",
  description:
    "All twenty levels of the course in teaching order, grouped into four tiers, with each level's summary, prerequisites and full topic list. Written lessons are linked; planned levels show their topics so the whole route is visible from the start.",
};

/**
 * The learning path route. SPEC.md section 8.
 *
 * The page resolves lesson titles and reading times on the server and composes
 * `LearningPath`, which needs to be a client component only because the axis
 * scale and the completion ticks read the progress context.
 */
export default function LearnPage() {
  const lessonTitles: Record<string, string> = Object.fromEntries(
    lessons.map((lesson) => [lesson.slug, lesson.title]),
  );
  const lessonMinutes: Record<string, number> = Object.fromEntries(
    lessons.map((lesson) => [lesson.slug, lesson.minutes]),
  );
  const publishedLevels = curriculum.filter((level) => level.status === "published").length;

  return (
    <>
      <PageHeader
        eyebrow={`Curriculum · ${TOTAL_LEVELS} levels`}
        title="The learning path"
        intro="Twenty levels, in the order they are meant to be learnt: what a CNC machine is, how it moves, how it is built, how it is driven and controlled, and finally how a machine of your own would be designed and proven."
      >
        <div className="measure space-y-3 text-[15px] leading-[1.65] text-ink-soft">
          <p>
            The route is laid out in full from the first day, because knowing where a subject sits
            is part of understanding it. Levels with lessons written are linked;{" "}
            <span className="num">{TOTAL_LEVELS - publishedLevels}</span> levels are still on the
            roadmap and show their topic lists instead, so nothing here is a promise you cannot
            inspect.
          </p>
          <p>
            Prerequisites are advice rather than locks. Nothing is hidden and nothing is gated — but
            a level that says it comes after two others really does assume you have read them.
          </p>
        </div>
      </PageHeader>

      <LearningPath
        lessonTitles={lessonTitles}
        lessonMinutes={lessonMinutes}
        totalMinutes={estimatedMinutes()}
      />
    </>
  );
}
