import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DesignProject } from "@/components/project/DesignProject";
import { projectBrief, projectStages } from "@/content/project";

export const metadata: Metadata = {
  title: "Design your CNC",
  description:
    "A twenty-stage guided design project. Work a real brief from intended use to a printable concept report, choosing between genuinely defensible options and recording what each one costs you.",
};

/**
 * Server-side twin of the client `ticks` helper: content is authored with
 * backticks around measured values so every number lands in mono tabular
 * figures. Duplicated deliberately rather than imported from a `"use client"`
 * module, which would drag this page across the boundary.
 */
function withTicks(text: string, keyPrefix: string): ReactNode[] {
  return text.split("`").map((segment, index) =>
    index % 2 === 1 ? (
      <span key={`${keyPrefix}-${index}`} className="num">
        {segment}
      </span>
    ) : (
      <Fragment key={`${keyPrefix}-${index}`}>{segment}</Fragment>
    ),
  );
}

const decisionStageCount = projectStages.filter((stage) => stage.decision).length;

export default function ProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="Design your CNC"
        title="Design a machine, one defensible decision at a time"
        intro="Twenty stages, one fictional customer and a method you can reuse on any brief. At each stage you read what the stage has to decide, weigh options that are all genuinely defensible, and record a choice. The last stage assembles your actual choices into a printable concept report — including an honest list of everything you left undecided."
      />

      <Container as="section" className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
          <div>
            <h2 className="text-[22px] font-semibold sm:text-[26px]">
              How the project works
            </h2>
            <div className="measure mt-4 space-y-4 text-[17px] leading-[1.65] text-ink-soft">
              <p>
                A machine is the conclusion of an argument about a brief. So the project is not a
                configurator and there is no score at the end. Each stage gives you the question, the
                inputs it needs from the stages before it, and the trade-offs in play. Where a
                decision is available you choose between three or four options, each with its
                benefits, drawbacks, and cost, performance, safety and maintenance implications, plus
                a note on why it does or does not suit this particular customer.
              </p>
              <p>
                Stages{" "}
                <span className="num">01</span>&ndash;<span className="num">{decisionStageCount}</span>{" "}
                carry those decisions. The remaining stages set out what has to be decided, what they
                need from earlier work and the trade-offs involved, and close with self-check
                questions &mdash; because electrical design, control architecture and the safety
                concept are work for qualified people, and pretending otherwise would be the worst
                lesson this course could teach.
              </p>
              <p>
                At most one option per stage is marked as recommended, and where it is, the
                recommendation is argued from a specific sentence in the brief. Disagreeing with it is
                perfectly legitimate &mdash; provided you can say which sentence you are arguing from
                instead.
              </p>
            </div>

            <div className="mt-8 rounded-sm border border-amber/30 bg-amber-wash px-5 py-5">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber">
                What this project is, and what it is not
              </p>
              <p className="measure mt-2 text-[16px] leading-[1.65] text-ink">
                This is a concept exercise for learning. Every figure in it is an educational estimate
                used to teach a method, not a specification, and none of it replaces manufacturer
                calculations or professional engineering validation. A concept produced here would
                need structural, thermal, electrical and safety engineering review before any part of
                it was manufactured, and the electrical, pneumatic and safety-related work must be
                designed, carried out and verified by qualified personnel under the applicable law and
                standards. Where standards are named in this course they are described by purpose and
                scope only. Nobody should build and operate an industrial machine tool on the strength
                of a concept.
              </p>
            </div>
          </div>

          <Card tone="raised" className="h-fit">
            <CardHeader>
              <p className="eyebrow">The brief</p>
              <h2 className="mt-2 font-display text-[19px] font-semibold tracking-tightest text-ink">
                {projectBrief.title}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-[15px] leading-[1.6] text-ink-soft">
                {projectBrief.paragraphs.map((paragraph, index) => (
                  <p key={index}>{withTicks(paragraph, `brief-${index}`)}</p>
                ))}
              </div>
              <dl className="mt-5 space-y-2.5 border-t border-rule pt-5">
                {projectBrief.constraints.map((constraint) => (
                  <div key={constraint.label}>
                    <dt className="eyebrow">{constraint.label}</dt>
                    <dd className="mt-0.5 text-[14px] leading-[1.5] text-ink">
                      {withTicks(constraint.value, `con-${constraint.label}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>
        </div>
      </Container>

      <Container as="section" className="border-t border-rule pb-16 pt-10 sm:pb-24">
        <DesignProject />
      </Container>
    </>
  );
}
