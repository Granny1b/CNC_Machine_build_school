import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Simulator } from "@/components/simulator/Simulator";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "G-code simulator",
  description:
    "Read a G-code program the way a control does: step through it block by block, watch the toolpath draw itself, see the modal state it leaves behind, and find the beginner mistakes. It runs entirely in your browser and cannot drive a machine.",
};

/**
 * The simulator route. SPEC.md section 16 item 1.
 *
 * The page composes; `Simulator` does the work. What the page owns is the
 * framing: what this model is, what it is not, and the one constraint that
 * bounds it — which stays in amber, because it is a machine-safety statement
 * and not a note about software.
 */

const RELATED = [
  {
    href: "/learn/understanding-xyz",
    label: "Coordinates, part zero and offsets",
    body: "The ideas the simulator assumes you have met: axis conventions, where zero is, work and tool offsets, and absolute against incremental positioning.",
  },
  {
    href: "/calculators",
    label: "Speeds, feeds and removal rate",
    body: "Where the numbers behind an F and an S word come from, worked from the formulas with the units stated rather than copied off a chart.",
  },
  {
    href: "/",
    label: "The G-code strip on the home page",
    body: "The same relationship as a fixed, pre-computed figure: one real contour program, its path and its readout, running on a loop.",
  },
];

export default function SimulatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="G-code simulator"
        title="Read a program the way the machine reads it"
        intro="Step through a program one block at a time and watch what each line does: where the tool goes, what modes it leaves in force, and which of the classic beginner mistakes it has just made."
      >
        <p className="measure text-[15px] leading-[1.65] text-ink-soft">
          Everything here is a teaching model of a control, working in millimetres and millimetres
          per minute, running in your browser. Load a sample or paste your own program; the listing,
          the drawing and the readout are three views of the same simulated run, so clicking a line
          moves the drawing and clicking a move in the drawing moves the listing.
        </p>
      </PageHeader>

      <Container as="section" className="pt-10 sm:pt-14">
        {/* Amber, because this is a machine-safety statement and nothing else. */}
        <div className="rounded-sm border border-amber/30 bg-amber-wash px-5 py-5">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber-ink">
            A constraint on the design, not a limitation of this version
          </p>
          <div className="measure mt-2 space-y-3 text-[16px] leading-[1.65] text-ink">
            <p>
              This simulator runs entirely in your browser, and it is not capable of driving
              hardware. It has no connection to a machine, no serial or network output, and no route
              by which a program could be sent to a control. That is a deliberate design rule, and
              it will not be relaxed later.
            </p>
            <p>
              The reason is simple. A program that looks correct in a simulation can still be wrong
              on a machine: this model does not know your fixture, your clamps, your tool lengths,
              your work offsets, your machine&rsquo;s travels or what is actually sitting on the
              table. Proving out a program on a real machine is a skilled, hazardous operation
              carried out by competent people using the machine&rsquo;s own verification features, at
              reduced rapid and feed, under the applicable law and standards. A teaching tool has no
              business standing anywhere near that, so it is built without the ability to try.
            </p>
            <p>
              So a clean run here means the program says what you think it says. It does not mean
              the program is safe to cut.
            </p>
          </div>
        </div>
      </Container>

      <Container as="section" width="wide" className="py-8 sm:py-10">
        <Simulator />
      </Container>

      <Container as="section" className="border-t border-rule pb-16 pt-10 sm:pb-24">
        <h2 className="text-[22px] font-semibold sm:text-[26px]">Where this fits</h2>
        <ul className="mt-6 space-y-4">
          {RELATED.map((item) => (
            <li key={item.href}>
              <Card tone="sunk">
                <CardBody className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                  <div className="min-w-0 flex-1 basis-72">
                    <h3 className="font-display text-[17px] font-semibold tracking-tightest text-ink">
                      {item.label}
                    </h3>
                    <p className="measure mt-2 text-[15px] leading-[1.6] text-ink-soft">
                      {item.body}
                    </p>
                  </div>
                  <ButtonLink href={item.href} variant="secondary" size="sm">
                    <span>
                      Open<span className="sr-only"> {item.label}</span>
                    </span>
                  </ButtonLink>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
