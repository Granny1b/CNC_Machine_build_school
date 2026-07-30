import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { ScenarioPlayer } from "@/components/troubleshooting/ScenarioPlayer";
import { scenarios } from "@/content/scenarios";

export const metadata: Metadata = {
  title: "Troubleshooting",
  description:
    "Work real machine faults the way a good diagnostician does: symptom, hypothesis, cheapest decisive test. Every choice tells you what it would actually have found, and what it would have cost you.",
};

const GRADES = [
  {
    label: "Sound",
    accent: "bg-moss",
    body: "The cheapest decisive step available with the evidence you had. It moves you forward for the least time, money and disturbance.",
  },
  {
    label: "Wasteful",
    accent: "bg-blue-mid",
    body: "A real test that would tell you something true — it simply costs more than the situation needs right now. Each one explains when it would have been the right call.",
  },
  {
    label: "Wrong turn",
    accent: "bg-ink",
    body: "A step that misleads you, hides the fault, destroys the evidence or leaves a second fault behind. Each one explains why it is tempting and what evidence would have justified it.",
  },
];

export default function TroubleshootingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Troubleshooting"
        title="Finding faults by evidence, not by guesswork"
        intro="A machine tells you what is wrong with it, but only if you ask in the right order and are willing to pay for the answer. These scenarios put you in front of a real symptom described the way an operator would actually describe it, and make you choose what to measure next."
      />

      <Container as="section" className="py-10 sm:py-14">
        <div className="measure space-y-4 text-[17px] leading-[1.65] text-ink-soft">
          <p>
            Fault-finding is rarely a question of right against wrong. Almost every test you could
            run tells you something true. What separates a diagnostician from somebody taking a
            machine apart is knowing which test is the <em>cheapest decisive</em> one at this exact
            moment — the one that costs the least time, money and disturbance for the largest cut in
            the number of remaining explanations.
          </p>
          <p>
            So the choices here are not marked correct or incorrect. They are marked by what they
            cost you. Every option, including the ones that lead you astray, comes back with what
            that step would genuinely have found, because in a workshop you never get to see the
            path you did not take.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {GRADES.map((grade) => (
            <li key={grade.label}>
              <Card tone="sunk" className="h-full">
                <CardBody className="flex h-full gap-3">
                  <span aria-hidden="true" className={`w-0.5 shrink-0 rounded-sm ${grade.accent}`} />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink">
                      {grade.label}
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{grade.body}</p>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>

        <p className="measure mt-8 border-t border-rule pt-5 text-[15px] leading-[1.6] text-ink-soft">
          These are teaching exercises. The machines, the faults and every number in them are
          invented to make the reasoning visible, and none of the figures is a specification, a
          tolerance or an acceptance limit. Real diagnosis on a real machine is governed by the
          manufacturer&rsquo;s documentation, and any work inside a machine must be carried out by
          competent people with the machine safely isolated, under applicable law and standards.
        </p>
      </Container>

      <section aria-label="Scenarios">
        <Container className="space-y-10 pb-16 sm:pb-24">
          {scenarios.map((scenario, index) => (
            <ScenarioPlayer key={scenario.id} scenario={scenario} number={index + 1} />
          ))}
        </Container>
      </section>
    </>
  );
}
