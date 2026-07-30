import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "G-code simulator",
  description:
    "The G-code simulator is in development and this page says so plainly rather than showing you a mock-up. Here is what it will do, why it will never be able to drive a machine, and what you can use in the meantime.",
};

/**
 * The simulator route. SPEC.md section 8 requires an honest "in development"
 * state and explicitly forbids fake output, so this page renders no toolpath, no
 * coordinate readout and no disabled imitation of a tool that does not exist.
 * A greyed-out fake interface is still a claim that something is nearly there.
 */

const PLANNED = [
  {
    title: "Parse a real program",
    body: "Read a program you type or paste, block by block, and build the machine state each line leaves behind: units, absolute or incremental mode, plane, work offset, tool, spindle, feed. Parsing is the whole job — everything else is a view onto it.",
  },
  {
    title: "Draw the toolpath",
    body: "Render the path the program actually describes, in the same drawing language as the rest of this site: rapids and cutting moves distinguished, dimensions where they help, and the part outline for reference.",
  },
  {
    title: "Show a coordinate readout",
    body: "A digital-readout-style display of the commanded position as the program runs, in millimetres, so the numbers on the screen and the shape being drawn are visibly the same thing.",
  },
  {
    title: "Highlight the active line",
    body: "Keep the listing and the drawing locked together, so you can always see which line produced which piece of the path — the single most useful thing a simulator does for a beginner.",
  },
  {
    title: "Explain every command",
    body: "For each block, a plain-language sentence first and the correct terminology second: what the machine was asked to do, and which words are modal and therefore still in force on the next line.",
  },
  {
    title: "Catch the classic beginner mistakes",
    body: "Flag the errors that spoil parts and break tools: a rapid that passes through the material, a missing retract before a move across the part, a plunge at the cutting feed rate, an incremental move written as though it were absolute, a missing tool length offset, a feed with no spindle speed.",
  },
];

const AVAILABLE = [
  {
    href: "/",
    label: "The G-code strip on the home page",
    body: "A real, valid sixteen-line contour program running against its own toolpath drawing and a live readout, with a plain-language explanation of every line. It is not a simulator: the program is fixed and pre-computed rather than parsed, so you cannot edit it. What it does show is exactly the relationship the simulator will make interactive.",
  },
  {
    href: "/learn/understanding-xyz",
    label: "The lessons on coordinates and motion",
    body: "Where the ideas a simulator relies on are taught: axis conventions, part zero, work and tool offsets, absolute against incremental positioning, and how a controlled path is produced at all. Level 10 covers G-code itself and its topic list is published on the learning path, though its lessons are still to be written.",
  },
  {
    href: "/calculators",
    label: "The calculators",
    body: "The speeds, feeds and removal-rate figures a program embeds in its F and S words, worked from the formulas with the units stated — plus a first estimate of the thrust and torque an axis needs to produce those moves.",
  },
];

export default function SimulatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="G-code simulator · In development"
        title="The simulator is not built yet"
        intro="This page would normally show a program listing, a toolpath and a coordinate readout. It does not, because none of that exists yet, and a mock-up of a tool that cannot run would teach you something false about your own program."
      >
        <p className="measure text-[15px] leading-[1.65] text-ink-soft">
          The simulator is the first item on the roadmap beyond the current phase, and it is real
          engineering: a parser, a motion model and a renderer. Below is what it will do, the one
          constraint that will always bound it, and the parts of the site that already teach what it
          is for.
        </p>
      </PageHeader>

      <Container as="section" className="py-10 sm:py-14">
        <h2 className="text-[22px] font-semibold sm:text-[26px]">What it will do</h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANNED.map((item) => (
            <li key={item.title}>
              <Card tone="raised" className="h-full">
                <CardBody>
                  <h3 className="font-display text-[17px] font-semibold tracking-tightest text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{item.body}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>

        {/* Amber, because this is a machine-safety constraint and nothing else. */}
        <div className="mt-10 rounded-sm border border-amber/30 bg-amber-wash px-5 py-5">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber">
            A constraint on the design, not a limitation of the first version
          </p>
          <div className="measure mt-2 space-y-3 text-[16px] leading-[1.65] text-ink">
            <p>
              The simulator will run entirely in your browser, and it must never be capable of
              driving hardware. It will have no connection to a machine, no serial or network output
              and no route by which a program could be sent to a control. That is a deliberate
              design rule, and it will not be relaxed later.
            </p>
            <p>
              The reason is simple. A program that looks correct in a simulation can still be wrong
              on a machine: the simulator does not know your fixture, your clamps, your tool
              lengths, your work offsets, your machine&rsquo;s travels or what is actually sitting on
              the table. Proving out a program on a real machine is a skilled, hazardous operation
              carried out by competent people using the machine&rsquo;s own verification features, at
              reduced rapid and feed, under the applicable law and standards. A teaching tool has no
              business standing anywhere near that, so it is built without the ability to try.
            </p>
          </div>
        </div>
      </Container>

      <Container as="section" className="border-t border-rule pb-16 pt-10 sm:pb-24">
        <h2 className="text-[22px] font-semibold sm:text-[26px]">What you can use today</h2>
        <ul className="mt-6 space-y-4">
          {AVAILABLE.map((item) => (
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
