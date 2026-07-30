"use client";

import type { ProjectOption, ProjectStage } from "@/content/types";
import { projectBrief, projectStages } from "@/content/project";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { pluralise } from "@/lib/format";
import { ticks } from "./DecisionCard";

/** Print rules live with the report, because the report is the only printable page. */
const PRINT_CSS = `
@media print {
  header, nav, footer, .no-print { display: none !important; }
  body { background: #fff !important; font-size: 10.5pt; }
  .concept-report { border: 0 !important; box-shadow: none !important; padding: 0 !important; }
  .report-block {
    break-inside: avoid;
    page-break-inside: avoid;
    box-shadow: none !important;
  }
  .report-block, .report-panel { background: #fff !important; }
  .report-panel { border: 1px solid #B4BDB8 !important; }
  a[href]::after { content: ""; }
}
`;

function ReportHeading({ children, count }: { children: string; count?: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule-strong pb-2">
      <h4 className="font-display text-[18px] font-semibold tracking-tightest text-ink sm:text-[20px]">
        {children}
      </h4>
      {count ? (
        <span className="font-mono text-[11px] uppercase tracking-eyebrow tabular-nums text-ink-faint">
          {count}
        </span>
      ) : null}
    </div>
  );
}

function DecisionEntry({ stage, option }: { stage: ProjectStage; option: ProjectOption }) {
  const key = `report-${stage.id}`;
  return (
    <li className="report-block rounded-sm border border-rule bg-paper-raised px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="num text-[12px] text-ink-faint">
          {String(stage.number).padStart(2, "0")}
        </span>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft">
          {stage.title}
        </p>
        {option.recommended ? <Badge tone="blue">Matched the recommendation</Badge> : null}
      </div>

      <p className="measure mt-3 text-[15px] leading-[1.6] text-ink-soft">
        {ticks(stage.decision?.question ?? "", `${key}-q`)}
      </p>

      <p className="mt-3 font-display text-[18px] font-semibold tracking-tightest text-ink">
        {ticks(option.name, `${key}-name`)}
      </p>

      <p className="measure mt-3 text-[16px] leading-[1.65] text-ink">
        {ticks(option.fitForBrief, `${key}-fit`)}
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {(
          [
            ["Cost", option.cost],
            ["Performance", option.performance],
            ["Safety", option.safety],
            ["Maintenance", option.maintenance],
          ] as const
        ).map(([label, body]) => (
          <div key={label}>
            <dt className="eyebrow">{label}</dt>
            <dd className="mt-1 text-[14px] leading-[1.55] text-ink-soft">
              {ticks(body, `${key}-${label}`)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="report-panel mt-4 rounded-sm border border-rule bg-paper-sunk px-4 py-3">
        <p className="eyebrow">Trade-offs accepted by choosing this</p>
        <ul className="mt-2 space-y-1.5">
          {option.drawbacks.map((item, index) => (
            <li key={index} className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-soft">
              <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono text-[12px] text-ink-faint">
                −
              </span>
              <span>{ticks(item, `${key}-d-${index}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/**
 * Stage 20. Assembles the learner's actual saved decisions into a printable
 * concept report — and names every stage still undecided as a gap, because a
 * report that quietly invents the missing decisions is worse than a short one.
 */
export function ConceptReport() {
  const { state, ready } = useProgress();

  const decisionStages = projectStages.filter((stage) => stage.decision);
  const decided: { stage: ProjectStage; option: ProjectOption }[] = [];
  const undecided: ProjectStage[] = [];

  for (const stage of decisionStages) {
    const savedId = state.projectDecisions[stage.id];
    const option = stage.decision?.options.find((o) => o.id === savedId);
    if (option) decided.push({ stage, option });
    else undecided.push(stage);
  }

  // Stages 11-19 set out the questions and self-checks but record no selection.
  const notYetDecidable = projectStages.filter(
    (stage) => !stage.decision && stage.id !== "final-concept-report",
  );

  // `updatedAt` is read back from storage, so it may be anything at all.
  const savedDate = state.updatedAt === "" ? null : new Date(state.updatedAt);
  const savedAt =
    savedDate && !Number.isNaN(savedDate.getTime())
      ? savedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <section aria-label="Concept report" className="mt-10">
      <style>{PRINT_CSS}</style>

      <div className="concept-report rounded-sm border border-rule bg-paper-raised px-5 py-6 shadow-panel sm:px-8 sm:py-8">
        {/* Status first. A reader who does not know what a document is cannot read it. */}
        <div className="report-panel rounded-sm border border-amber/30 bg-amber-wash px-4 py-4 sm:px-5">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber">
            Status of this document — read first
          </p>
          <div className="measure mt-2 space-y-3 text-[15px] leading-[1.65] text-ink">
            <p>
              This is an <strong>educational concept exercise</strong>, produced by a learner working
              a teaching brief. It is not a machine design. The machine it describes has had no
              structural analysis, no electrical design, no thermal analysis, no safety risk
              assessment and no validation of any kind, and every number in it is an illustrative
              estimate rather than a specification.
            </p>
            <p>
              It requires <strong>professional engineering review</strong> before any part of it is
              manufactured, and the electrical, pneumatic and safety-related work it implies must be
              designed, carried out and verified by qualified personnel under the applicable law and
              standards for the place of installation.
            </p>
            <p>
              Nobody should build and operate an industrial machine tool on the strength of this
              document. A concept is a handover to reviewers, not a permission to start cutting
              metal.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Concept report</p>
            <h3 className="mt-2 text-[24px] font-bold sm:text-[30px]">{projectBrief.title}</h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-eyebrow tabular-nums text-ink-faint">
              {ready
                ? `${decided.length} of ${decisionStages.length} recorded decisions${
                    savedAt ? ` · saved ${savedAt}` : ""
                  }`
                : "Loading your saved decisions"}
            </p>
          </div>
          <Button
            className="no-print"
            variant="secondary"
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
          >
            Print this report
          </Button>
        </div>

        <ReportHeading>1 · The brief this concept answers</ReportHeading>
        <div className="measure mt-4 space-y-3 text-[16px] leading-[1.65] text-ink-soft">
          {projectBrief.paragraphs.map((paragraph, index) => (
            <p key={index}>{ticks(paragraph, `report-brief-${index}`)}</p>
          ))}
        </div>
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-rule pt-5 sm:grid-cols-2">
          {projectBrief.constraints.map((constraint) => (
            <div key={constraint.label} className="flex flex-wrap items-baseline gap-x-3">
              <dt className="eyebrow">{constraint.label}</dt>
              <dd className="text-[14px] leading-[1.5] text-ink">
                {ticks(constraint.value, `report-c-${constraint.label}`)}
              </dd>
            </div>
          ))}
        </dl>

        <ReportHeading
          count={`${decided.length} ${pluralise(decided.length, "decision")} recorded`}
        >
          2 · Decisions taken
        </ReportHeading>
        {decided.length === 0 ? (
          <p className="measure mt-4 text-[16px] leading-[1.65] text-ink-soft">
            No decisions are recorded yet, so this report has nothing to hand a reviewer. Work back
            through stages one to ten, choose an option in each and say why, then return here. An
            empty report is an honest report — it is simply not a useful one.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {decided.map(({ stage, option }) => (
              <DecisionEntry key={stage.id} stage={stage} option={option} />
            ))}
          </ul>
        )}

        <ReportHeading count={`${undecided.length + notYetDecidable.length} open`}>
          3 · Gaps — what this concept does not yet decide
        </ReportHeading>
        <p className="measure mt-4 text-[16px] leading-[1.65] text-ink-soft">
          A gap you have named is information. A gap you have hidden is a defect. These stages carry
          no recorded decision, and a reviewer needs to see them listed rather than discover them
          missing.
        </p>

        {undecided.length > 0 ? (
          <div className="report-block mt-4 rounded-sm border border-rule bg-paper-sunk px-5 py-4">
            <p className="eyebrow">Decisions available but not made</p>
            <ul className="mt-3 space-y-2">
              {undecided.map((stage) => (
                <li key={stage.id} className="flex gap-3 text-[15px] leading-[1.6] text-ink">
                  <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[12px] text-ink-faint">
                    {String(stage.number).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-semibold">{stage.title}</span>
                    <span className="text-ink-soft"> — no option chosen, so the concept has no position on this and nothing downstream of it can be checked.</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="report-block mt-4 rounded-sm border border-rule bg-paper-sunk px-5 py-4">
          <p className="eyebrow">Stages worked as questions, with no recorded selection</p>
          <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">
            These stages set out what has to be decided, what they need from the earlier stages and
            the trade-offs in play, and they close with self-check questions. They record no choice,
            so every one of them is an open item for the detail design that follows this concept.
          </p>
          <ul className="mt-3 space-y-2">
            {notYetDecidable.map((stage) => (
              <li key={stage.id} className="flex gap-3 text-[15px] leading-[1.6] text-ink">
                <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[12px] text-ink-faint">
                  {String(stage.number).padStart(2, "0")}
                </span>
                <span className="font-semibold">{stage.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <ReportHeading>4 · What has to happen before detail design</ReportHeading>
        <ol className="measure mt-4 space-y-3 text-[16px] leading-[1.65] text-ink-soft">
          {[
            "Structural analysis of the base, column and moving members against the assumed cutting load, by a competent engineer, with the load case itself validated by cutting trials rather than assumed.",
            "A thermal assessment, because the brief's first priority is repeatable results and no part of this concept has examined how the machine moves as it warms up.",
            "Electrical design and installation by qualified personnel under the applicable standards, including protection, isolation and the safe state of every axis on power loss.",
            "A documented risk assessment and a safety-related control system designed, verified and validated by qualified personnel, covering guarding, interlocks, emergency stop and stored energy.",
            "A validation plan with acceptance criteria and a defined consequence for each test, plus a recorded commissioning baseline the machine can be judged against later.",
            "A quantified budget, since every cost argument in this report rests on the single word 'modest'.",
          ].map((item, index) => (
            <li key={index} className="flex gap-3">
              <span aria-hidden="true" className="num mt-0.5 shrink-0 text-[12px] text-ink-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <p className="measure mt-8 border-t border-rule pt-5 text-[15px] leading-[1.6] text-ink-soft">
          Every figure quoted in this report is an educational estimate used to teach a method. None
          of it is a specification, a tolerance or an acceptance limit, and none of it replaces
          manufacturer calculations or professional engineering validation. Where standards are named
          anywhere in this course they are described by purpose and scope only; consult the official
          published documents for their actual requirements.
        </p>
      </div>
    </section>
  );
}
