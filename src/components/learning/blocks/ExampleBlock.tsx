import { Card } from "@/components/ui/Card";
import { TickedText } from "./ProseBlock";

/**
 * The `example` block: a worked example, raised off the page because it is the
 * part a learner comes back to. Numbers inside backticks are set in mono by
 * `TickedText`, per SPEC 5.2.
 */
export function ExampleBlock({ title, body }: { title: string; body: string[] }) {
  return (
    <Card>
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <p className="eyebrow">Worked example</p>
        <h3 className="mt-2 text-[19px] font-semibold sm:text-[21px]">
          <TickedText text={title} />
        </h3>
      </div>
      <div className="px-5 py-5 sm:px-6">
        <div className="measure space-y-4">
          {body.map((paragraph, index) => (
            <p key={index} className="text-[16px] leading-[1.65] text-ink">
              <TickedText text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
}
