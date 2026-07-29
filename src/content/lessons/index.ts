import type { Lesson } from "../types";

import { whatIsACncMachine } from "./what-is-a-cnc-machine";
import { cadToFinishedComponent } from "./cad-to-finished-component";
import { understandingXyz } from "./understanding-xyz";
import { howABallScrewMovesAnAxis } from "./how-a-ball-screw-moves-an-axis";
import { accuracyRepeatabilityResolution } from "./accuracy-repeatability-resolution";
import { introToMachineArchitecture } from "./intro-to-machine-architecture";
import { selectingAnArchitecture } from "./selecting-an-architecture";

/**
 * The lesson registry. SPEC.md section 14: adding a lesson means creating the
 * file, registering it here, adding the slug to the owning level's
 * `lessonSlugs`, and setting `nextSlug` on the preceding lesson.
 *
 * Order here is teaching order.
 */
export const lessons: Lesson[] = [
  whatIsACncMachine,
  cadToFinishedComponent,
  understandingXyz,
  howABallScrewMovesAnAxis,
  accuracyRepeatabilityResolution,
  introToMachineArchitecture,
  selectingAnArchitecture,
];

const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

export function getLesson(slug: string): Lesson | undefined {
  return bySlug.get(slug);
}

export function allLessonSlugs(): string[] {
  return lessons.map((lesson) => lesson.slug);
}

/** Lessons belonging to a level, in the order the level lists them. */
export function lessonsForLevel(levelNumber: number): Lesson[] {
  return lessons.filter((lesson) => lesson.level === levelNumber);
}

/** The lesson before `slug` in teaching order, if any. */
export function previousLesson(slug: string): Lesson | undefined {
  const i = lessons.findIndex((lesson) => lesson.slug === slug);
  return i > 0 ? lessons[i - 1] : undefined;
}

export function estimatedMinutes(): number {
  return lessons.reduce((total, lesson) => total + lesson.minutes, 0);
}
