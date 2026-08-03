import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/learning/LessonView";
import { allLessonSlugs, getLesson } from "@/content/lessons";

/**
 * The lesson route. SPEC.md section 8.
 *
 * Every published lesson is generated statically from the content registry, so
 * the route list and the lessons can never disagree. The page composes and
 * nothing else: `LessonView` assembles the sections and the block renderer draws
 * them.
 */
export function generateStaticParams(): { slug: string }[] {
  return allLessonSlugs().map((slug) => ({ slug }));
}

/** Trim the lesson's promise to a sentence, which is what a description wants. */
function firstSentence(text: string, limit = 200): string {
  if (text.length <= limit) return text;
  const stop = text.indexOf(". ");
  if (stop > 0 && stop < limit) return text.slice(0, stop + 1);
  const cut = text.lastIndexOf(" ", limit);
  return `${text.slice(0, cut > 0 ? cut : limit).trimEnd()}…`;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found" };

  return {
    title: lesson.title,
    description: firstSentence(lesson.intro),
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();

  return <LessonView lesson={lesson} />;
}
