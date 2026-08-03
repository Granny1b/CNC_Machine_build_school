import type { Lesson } from "@/content/types";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { LevelBadge } from "@/components/progress/LevelBadge";
import { getLevel } from "@/content/curriculum";
import { getLesson, previousLesson } from "@/content/lessons";
import { pluralise } from "@/lib/format";
import { LessonBlocks } from "./LessonBlocks";
import { lessonHeadings } from "./blocks/HeadingBlock";
import { ObjectivesPanel } from "./ObjectivesPanel";
import { TermList, glossarySlugForTerm } from "./TermList";
import { LessonNav } from "./LessonNav";
import { KnowledgeCheck } from "./KnowledgeCheck";
import { ExercisePanel } from "./ExercisePanel";
import { LessonSummary } from "./LessonSummary";
import { LessonFooter } from "./LessonFooter";

/**
 * The lesson page, composed. SPEC section 7 requires every lesson to carry the
 * same eleven sections, and they are assembled here in the order they are meant
 * to be read: promise, objectives, terminology, the material itself, a check, an
 * exercise, a summary, and the handover to the next lesson.
 *
 * Two things are set up here and threaded down:
 *
 *   `used`      the set of glossary slugs already linked in this lesson. It is
 *               created per render — a module-level set would leak links between
 *               pages — and mutated as the prose blocks render in document order,
 *               which is what makes auto-linking first-occurrence-only.
 *
 *   `skipSlugs` the glossary slugs this lesson defines in its own terminology
 *               list. A lesson that is defining a word should not send the reader
 *               away to read the same word elsewhere.
 *
 * The intro is deliberately not auto-linked. It is the lesson's promise rather
 * than its material, and threading links through the page header would spend the
 * first-occurrence link of half a dozen terms before the reader has met any of
 * them in context.
 */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const used = new Set<string>();
  const skipSlugs = lesson.terms
    .map((term) => glossarySlugForTerm(term.term))
    .filter((slug): slug is string => Boolean(slug));

  const level = getLevel(lesson.level);
  const headings = lessonHeadings(lesson.blocks);
  const previous = previousLesson(lesson.slug);
  const next = lesson.nextSlug ? getLesson(lesson.nextSlug) : undefined;
  const questionCount = lesson.knowledgeCheck.length;

  return (
    <article>
      <PageHeader
        eyebrow={`Lesson · ${level ? level.title : `Level ${lesson.level}`}`}
        title={lesson.title}
        intro={lesson.intro}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <LevelBadge level={lesson.level} />
          <span className="inline-flex items-baseline gap-2 rounded-sm border border-rule bg-paper-sunk px-2.5 py-1">
            <span className="eyebrow">Reading time</span>
            <span className="num text-[13px] font-medium text-ink">{lesson.minutes} min</span>
          </span>
          <Badge tone="outline">
            <span className="num">{questionCount}</span>{" "}
            {pluralise(questionCount, "question")}
          </Badge>
          <Badge tone="outline">
            <span className="num">{lesson.terms.length}</span> terms defined
          </Badge>
        </div>
      </PageHeader>

      <Container className="py-10 sm:py-14">
        <div className="space-y-10">
          <ObjectivesPanel objectives={lesson.objectives} />
          <TermList terms={lesson.terms} />
          <LessonNav
            headings={headings}
            previous={previous ? { slug: previous.slug, title: previous.title } : undefined}
            next={next ? { slug: next.slug, title: next.title } : undefined}
          />

          <LessonBlocks blocks={lesson.blocks} used={used} skipSlugs={skipSlugs} />

          <KnowledgeCheck lessonSlug={lesson.slug} questions={lesson.knowledgeCheck} />
          <ExercisePanel exercise={lesson.exercise} />
          <LessonSummary summary={lesson.summary} />
          <LessonFooter slug={lesson.slug} nextSlug={lesson.nextSlug} />
        </div>
      </Container>
    </article>
  );
}
