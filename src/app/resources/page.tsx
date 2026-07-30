import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "The standards a machine builder meets, described by purpose and scope only; the kinds of source a designer actually works from; and a plain statement of what this site is not.",
};

/**
 * The resources route. "Resources" closes the SPEC section 8 nav order but has no
 * entry in that section's route map, so the route is added here.
 *
 * SPEC rules 1 and 2: standards are described by purpose and scope only. No
 * numeric limit, tolerance class or clause content appears on this page, and the
 * reader is sent to the published document every time. The lists live in the page
 * because they are page furniture, not curriculum content.
 */
const ONLY_SOURCE =
  "Its actual requirements are in the published standard and nowhere else. Nothing from it is quoted, paraphrased as a requirement, or reduced to a number anywhere on this site.";

const STANDARDS = [
  { code: "ISO 230", title: "Test code for machine tools", purpose: "A series concerned with how the geometric accuracy and performance of a machine tool are tested and reported. Its subject is method and vocabulary: it exists so that two people measuring the same machine mean the same thing, and so that a claim about a machine can be checked rather than believed.", when: "When you specify, measure, verify or argue about machine geometry and positioning performance — including writing an acceptance test, and re-testing the same machine years later." },
  { code: "ISO 10791", title: "Test conditions for machining centres", purpose: "A series concerned specifically with test conditions for machining centres: the kinds of test used to characterise them, and the conditions under which those tests are carried out.", when: "When the machine in question is a machining centre and you are drafting, running or accepting the results of its tests." },
  { code: "ISO 16090-1", title: "Machine tools safety — Machining centres, milling machines, transfer machines — Part 1: Safety requirements", purpose: "Concerned with safety requirements for this family of machines. It is the machine-specific safety document a milling machine designer works with, sitting alongside the general machinery standards rather than replacing them.", when: "From the first concept sketch onwards, and throughout the design of enclosures, access, guarding and interlocking — by the qualified people responsible for that work." },
  { code: "ISO 12100", title: "Safety of machinery — General principles for design — Risk assessment and risk reduction", purpose: "The framework document for machinery safety: how hazards are identified, how risk is assessed, and the order in which risk is reduced. It is the standard behind the principle that designing a hazard out beats guarding it, and that guarding beats a warning label.", when: "At the very start of a design and continuously afterwards, because the cheapest risk reductions are layout and geometry decisions that become impossible later." },
  { code: "ISO 13849-1", title: "Safety of machinery — Safety-related parts of control systems — Part 1: General principles for design", purpose: "Concerned with the design of the parts of a control system that perform safety functions — the difference between a circuit that usually works and one whose failure behaviour has been analysed, verified and documented.", when: "Whenever a safety function is implemented by control means: guard interlocking, emergency stop, safe standstill, safely limited speed, brake control on a vertical axis." },
  { code: "IEC 60204-1", title: "Safety of machinery — Electrical equipment of machines — Part 1: General requirements", purpose: "Concerned with the electrical equipment of machines. It stands behind the shape of a machine's electrical design: supply and isolation, protective devices, control circuits, marking and documentation.", when: "Whenever electrical design, installation, modification or verification is in question — work reserved for qualified personnel under applicable law." },
];

const SOURCES = [
  { title: "Manufacturer catalogues and sizing software", authority: "For screws, rails, bearings, spindles, motors and drives, the manufacturer is the only authority on their own product: load ratings, life models, accuracy grades, speed and duty limits, and the calculation method that belongs with each. Their sizing tools encode assumptions their catalogues explain.", limit: "They cannot tell you whether a product suits your machine. That is your engineering judgement plus their applications engineers, who will ask for the duty cycle, orientation, environment and service life you actually need." },
  { title: "Machinery handbooks and engineering reference works", authority: "For established practice, general formulas, material properties, threads, fits and tolerancing conventions. A good handbook is the fastest route to a defensible number and to the vocabulary needed to discuss it.", limit: "A handbook is neither a standard nor a datasheet. It will not give you a specific bearing's rating, and it is never the source of a regulatory requirement." },
  { title: "Tooling manufacturers' cutting-data references", authority: "For starting cutting speeds and feeds for a named tool in a named material group, together with the correction factors for engagement, coolant, stability and tool condition.", limit: "Published data assumes a rigid setup. Your machine, fixture and tool overhang are yours, so treat every figure as a starting value to be adjusted from what the cut actually sounds and looks like." },
  { title: "Control vendors' programming and parameter manuals", authority: "For what a specific control does with a specific command on a specific machine: the dialect it accepts, its canned cycles, its alarm meanings, and the effect of each machine parameter.", limit: "Dialects differ between controls, and between two machines carrying the same control. Machine parameters are safety-relevant, and changing them is not a beginner's task." },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Where the real answers come from"
        intro="This course teaches you to reason about machines. It is not, and cannot be, the authority on the specific numbers you will need. This page names the documents that are — what each one is for, when you would reach for it, and what it will not tell you."
      />

      <Container as="section" className="py-10 sm:py-14">
        <h2 className="text-[22px] font-semibold sm:text-[26px]">Standards you will meet</h2>
        <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
          Standards are described here by purpose and scope only. That is a deliberate rule of this
          site rather than a gap: quoting a requirement second-hand is how people end up confidently
          building to a clause that says something else. Each of these is a published document,
          bought or read through a library. Which of them apply to a given machine depends on where
          it is built, sold and used — a question for the qualified people responsible for the design
          and its compliance, not for a course.
        </p>

        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {STANDARDS.map((standard) => (
            <li key={standard.code}>
              <Card tone="raised" className="h-full">
                <CardBody>
                  <Badge tone="blue">{standard.code}</Badge>
                  <h3 className="mt-3 font-display text-[17px] font-semibold tracking-tightest text-ink">
                    {standard.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{standard.purpose}</p>
                  <p className="eyebrow mt-3">When you reach for it</p>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">{standard.when}</p>
                  <p className="mt-3 border-t border-rule pt-3 text-[14px] leading-[1.55] text-ink">
                    {ONLY_SOURCE}
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Container>

      <Container as="section" className="border-t border-rule py-10 sm:py-14">
        <h2 className="text-[22px] font-semibold sm:text-[26px]">
          The sources a designer works from
        </h2>
        <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
          Design work is largely the disciplined use of other people&rsquo;s data. Knowing which
          document is authoritative for which question is a large part of being useful.
        </p>
        <ul className="mt-6 space-y-4">
          {SOURCES.map((source) => (
            <li key={source.title}>
              <Card tone="sunk">
                <CardBody className="grid gap-x-8 gap-y-3 md:grid-cols-2">
                  <h3 className="font-display text-[17px] font-semibold tracking-tightest text-ink md:col-span-2">
                    {source.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    <span className="eyebrow block">Authoritative for</span>
                    {source.authority}
                  </p>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    <span className="eyebrow block">Not a source for</span>
                    {source.limit}
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Container>

      <Container as="section" className="border-t border-rule pb-16 pt-10 sm:pb-24">
        <h2 className="text-[22px] font-semibold sm:text-[26px]">Elsewhere on this site</h2>
        <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
          The scenarios put a symptom in front of you and make you choose the cheapest decisive test.
          The glossary defines every term this course uses, plain words first, and links each one back
          to the lessons that use it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/troubleshooting" variant="secondary">
            Troubleshooting scenarios
          </ButtonLink>
          <ButtonLink href="/glossary" variant="secondary">
            Glossary
          </ButtonLink>
        </div>

        <div className="mt-10 rounded-sm border border-amber/30 bg-amber-wash px-5 py-5">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber">
            The limits of this site
          </p>
          <p className="measure mt-2 text-[16px] leading-[1.65] text-ink">
            CNC Academy is educational. Its calculators apply textbook relationships and state what
            they leave out, and every illustrative figure is an order of magnitude chosen to teach a
            method. None of it replaces a manufacturer&rsquo;s data and calculations or professional
            engineering validation of a real design. The design project is a concept exercise, and a
            concept produced from it would need structural, thermal, electrical and safety
            engineering review before anything was manufactured. Machine design decisions,
            electrical and pneumatic work, safety-function design, installation and commissioning
            must be carried out and verified by qualified personnel under the applicable law and
            standards for the place the machine is used. Nobody should build and operate an
            industrial machine tool on the strength of a course.
          </p>
        </div>
      </Container>
    </>
  );
}
