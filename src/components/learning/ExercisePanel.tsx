import type { Exercise } from "@/content/types";
import { Card } from "@/components/ui/Card";
import { Disclosure } from "@/components/ui/Disclosure";
import { TickedText } from "./blocks/ProseBlock";

/**
 * The practical exercise. Every lesson ends with something to do away from the
 * screen, because recognising a part in a drawing and finding it on a machine are
 * different skills.
 *
 * The self-check sits behind a disclosure titled so the learner knows exactly
 * what is inside it: what a good answer contains, not the answer itself. Opening
 * it before attempting the exercise would give away the thinking, so it is a
 * deliberate choice rather than the default.
 */
export function ExercisePanel({ exercise }: { exercise: Exercise }) {
  return (
    <Card as="section">
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">Practical exercise</p>
        <h2 className="mt-2 text-[20px] font-semibold sm:text-[22px]">
          <TickedText text={exercise.title} />
        </h2>
        <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
          <TickedText text={exercise.body} />
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <p className="eyebrow">
          Steps · <span className="num">{exercise.steps.length}</span>
        </p>
        <ol className="mt-3 space-y-3">
          {exercise.steps.map((step, index) => (
            <li key={index} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="num mt-0.5 shrink-0 text-[12px] text-ink-soft"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="measure text-[16px] leading-[1.6] text-ink">
                <TickedText text={step} />
              </span>
            </li>
          ))}
        </ol>

        <Disclosure
          className="mt-6"
          eyebrow="Marking your own work"
          title="What a good answer contains"
        >
          <ul className="space-y-3">
            {exercise.selfCheck.map((check, index) => (
              <li key={index} className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 shrink-0 text-moss">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5.2 4.2 8.4 11 1.6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="measure text-[15px] leading-[1.6] text-ink-soft">
                  <TickedText text={check} />
                </span>
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </Card>
  );
}
