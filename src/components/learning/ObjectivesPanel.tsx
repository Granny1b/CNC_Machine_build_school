import { TickedText } from "./blocks/ProseBlock";

/**
 * The learning objectives, stated as things the learner will be able to do
 * rather than things the lesson will cover. They double as the self-check at the
 * end: anything you cannot do yet tells you which section to re-read.
 */
export function ObjectivesPanel({ objectives }: { objectives: string[] }) {
  if (objectives.length === 0) return null;

  return (
    <section
      aria-labelledby="lesson-objectives"
      className="rounded-sm border border-rule bg-paper-raised px-5 py-5 sm:px-6"
    >
      <p className="eyebrow">Learning objectives</p>
      <h2 id="lesson-objectives" className="mt-2 text-[19px] font-semibold sm:text-[21px]">
        By the end of this lesson you will be able to
      </h2>
      <ol className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {objectives.map((objective, index) => (
          <li key={index} className="flex gap-3 text-[15px] leading-[1.6] text-ink">
            <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[12px] text-blue">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <TickedText text={objective} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
