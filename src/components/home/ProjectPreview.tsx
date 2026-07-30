import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { projectBrief, projectStages } from "@/content/project";
import type { ProjectStage } from "@/content/types";
import { pluralise } from "@/lib/format";

/**
 * The project preview of SPEC.md section 8, pointing at the twenty-stage design
 * project of section 12.
 *
 * SPEC content rule 7 is not optional and not small print: the project is a
 * concept exercise, and this panel says so in full sentences before it invites
 * anybody in. The statement sits in blue, not amber — amber is reserved for
 * safety content alone, and this is a statement of scope.
 */

/** Intended use, architecture, axis drives, and the report that ends it. */
const HIGHLIGHT_NUMBERS = [1, 4, 9, 20];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function ProjectPreview() {
  const highlights = HIGHLIGHT_NUMBERS.map((number) =>
    projectStages.find((stage) => stage.number === number),
  ).filter((stage): stage is ProjectStage => Boolean(stage));

  const constraints = projectBrief.constraints.slice(0, 3);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:gap-12">
      <div>
        <p className="eyebrow">Level 20 · the design project</p>
        <h2 className="mt-2 text-[26px] font-semibold sm:text-[30px]">{projectBrief.title}</h2>
        <div className="measure mt-3 space-y-3 text-[16px] leading-[1.65] text-ink-soft">
          {projectBrief.paragraphs.slice(0, 2).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="measure mt-4 text-[15px] leading-[1.65] text-ink-soft">
          Every decision stage lays out its options with the benefits, the drawbacks, and the cost,
          performance, safety and maintenance implications of each — then asks why that option does
          or does not suit this particular brief. Your choices are saved as you go, and the last
          stage assembles them into a concept report you can print.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/project" size="md">
            Open the design project
          </ButtonLink>
          <ButtonLink href="/learn/selecting-an-architecture" variant="secondary" size="md">
            Read the architecture lesson first
          </ButtonLink>
        </div>

        <Card tone="wash" className="measure mt-7">
          <CardBody>
            <p className="eyebrow">Before you start</p>
            <p className="mt-2 text-[15px] leading-[1.65] text-ink">
              This is an educational concept exercise. It puts you through the same decisions a
              machine-tool designer makes and produces a concept report at the end — but a concept
              is not a design. Nothing worked out here should be manufactured, wired, guarded or
              operated without professional engineering review, a proper risk assessment, and
              verification against the standards and law that apply where the machine would be
              used.
            </p>
          </CardBody>
        </Card>
      </div>

      <Card tone="sunk" className="self-start">
        <CardBody>
          <p className="eyebrow">The brief · fixed constraints</p>
          <dl className="mt-3 divide-y divide-rule border-y border-rule">
            {constraints.map((constraint) => (
              <div
                key={constraint.label}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
              >
                <dt className="text-[14px] leading-snug text-ink-soft">{constraint.label}</dt>
                <dd className="num text-[13px] font-medium text-ink">{constraint.value}</dd>
              </div>
            ))}
          </dl>

          <p className="eyebrow mt-6">
            {pad(projectStages.length)} {pluralise(projectStages.length, "stage")} ·{" "}
            {pad(highlights.length)} shown
          </p>
          <ol className="mt-3 space-y-2.5">
            {highlights.map((stage) => (
              <li key={stage.id} className="flex gap-3">
                <span className="num shrink-0 text-[11px] leading-[1.5] text-ink-faint">
                  {pad(stage.number)}
                </span>
                <span className="text-[14px] font-medium leading-snug">{stage.title}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[13px] leading-snug text-ink-faint">
            The stages follow the syllabus order, from intended use through to the final concept
            report, so the project doubles as a checklist for the whole course.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
