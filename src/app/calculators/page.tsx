import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { AxisSizingCalculator } from "@/components/calculators/AxisSizingCalculator";
import { MachiningCalculator } from "@/components/calculators/MachiningCalculator";

export const metadata: Metadata = {
  title: "Calculators",
  description:
    "Two educational calculators: speeds, feeds, removal rate and cutting time for a milling pass, and a first estimate of the thrust, torque, speed and inertia a feed drive has to produce. Each shows its formula, its units, a worked example and what the answer means.",
};

/**
 * The calculators route. SPEC.md section 8 and section 9.
 *
 * The page composes only: both calculators are self-contained client
 * components, and every equation behind them is a pure function in
 * `@/lib/machining` and `@/lib/axis-sizing`.
 */
export default function CalculatorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools · Two calculators"
        title="Calculators"
        intro="Two working tools for the two questions that come up first when you design a cut and then design the axis that has to make it: how fast should this tool turn and travel, and how hard does this drive have to push?"
      >
        <div className="measure space-y-3 text-[15px] leading-[1.65] text-ink-soft">
          <p>
            Both open on the worked example the lessons use, so the numbers on screen are the
            numbers you have already read. Change one input at a time and watch which answers move
            — that is where the understanding is, far more than in any single result.
          </p>
          <p>
            Both are educational tools. They apply the textbook relationships and nothing else, and
            each carries a note saying exactly what it leaves out. Neither replaces the tool or
            drive manufacturer&rsquo;s own data and sizing software, and neither replaces
            professional engineering validation of a real machine.
          </p>
        </div>
      </PageHeader>

      <Container className="py-10 sm:py-14">
        <MachiningCalculator />
        <hr className="my-12 border-rule-strong sm:my-16" />
        <AxisSizingCalculator />
      </Container>
    </>
  );
}
