import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { GLOSSARY_TAGS, glossary } from "@/content/glossary";
import { machineComponents } from "@/content/machine-components";
import { scenarios } from "@/content/scenarios";
import { pluralise } from "@/lib/format";

/**
 * The featured tools of SPEC.md section 8.
 *
 * Descriptions say what the tool does for the learner rather than what it is
 * called, and carry no numerals: counts belong in the mono `meta` line, and they
 * are read from the content registries so this list cannot drift out of date.
 *
 * `inDevelopment` sets nothing today — the simulator was the last card using it,
 * and SPEC section 16 item 1 is now built. It stays because the roadmap has six
 * more items and the next one to land will want exactly this: a card that links
 * to an honest "not built yet" page rather than being quietly absent.
 */

interface Tool {
  tag: string;
  title: string;
  description: string;
  /** Facts about the tool, set in mono. */
  meta: string;
  href: string;
  inDevelopment?: boolean;
}

const tools: Tool[] = [
  {
    tag: "Interactive",
    title: "CNC Machine Explorer",
    description:
      "A cutaway of a vertical machining centre. Open any part for a plain explanation, the engineering behind it, the parameters a designer actually chooses, and the ways it fails once the machine is in service.",
    meta: `${machineComponents.length} components · six systems · keyboard navigable`,
    href: "/explorer",
  },
  {
    tag: "Calculator",
    title: "Machining calculator",
    description:
      "Turn a cutting speed and a feed per tooth into the spindle speed, feed rate, removal rate and cutting time you would really programme — with the formula, every unit and a worked example beside the answers.",
    meta: "5 relationships · guard-rail warnings that explain, never block",
    href: "/calculators",
  },
  {
    tag: "Calculator",
    title: "Axis-sizing calculator",
    description:
      "A first estimate of the thrust, screw torque, motor speed and reflected inertia a feed axis has to produce, with its trapezoidal motion profile drawn out and a plain list of everything the estimate leaves out.",
    meta: "8 relationships · motion-profile chart · educational estimate",
    href: "/calculators",
  },
  {
    tag: "Interactive",
    title: "Troubleshooting scenarios",
    description:
      "Diagnose a fault the way a service engineer does: the operator's own words first, then a sequence of choices graded by what each one would actually cost you in time, parts and certainty.",
    meta: `${scenarios.length} ${pluralise(scenarios.length, "scenario")} · every choice graded sound, wasteful or wrong`,
    href: "/troubleshooting",
  },
  {
    tag: "Reference",
    title: "Glossary",
    description:
      "Every term the course uses, in plain words first and engineering language second, searchable by term, alias or definition, and linked from the first place a lesson uses it.",
    meta: `${glossary.length} terms · ${GLOSSARY_TAGS.length} subject tags · auto-linked in lessons`,
    href: "/glossary",
  },
  {
    tag: "Interactive",
    title: "G-code simulator",
    description:
      "Load a sample or write your own, then step through it a block at a time. The listing, the toolpath and the coordinate readout are three views of the same run, every command is explained in plain language, and the mistakes that spoil parts are flagged with what they would actually do.",
    meta: "7 sample programs · browser only · never able to drive hardware",
    href: "/simulator",
  },
];

export function FeaturedTools() {
  return (
    <div>
      <p className="eyebrow">Tools · learn by doing</p>
      <h2 className="mt-2 text-[26px] font-semibold sm:text-[30px]">
        Where the reading turns into doing
      </h2>
      <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
        Reading about a machine only gets you so far. Each of these takes one idea from the lessons
        and lets you push on it: inspect a real component, change an input and watch which answers
        move, or work a fault to its cause.
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card as="li" key={tool.title} tone="raised" interactive className="relative">
            <CardBody className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">{tool.tag}</p>
                {tool.inDevelopment ? <Badge tone="outline">Not built yet</Badge> : null}
              </div>
              <h3 className="mt-2 text-[19px] font-semibold">
                {/* The link covers the card, so the whole panel is clickable
                    while the accessible name stays just the tool's name. */}
                <Link
                  href={tool.href}
                  className="text-ink after:absolute after:inset-0 after:content-[''] hover:text-blue"
                >
                  {tool.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-ink-soft">
                {tool.description}
              </p>
              <p className="eyebrow mt-4">{tool.meta}</p>
            </CardBody>
          </Card>
        ))}
      </ul>
    </div>
  );
}
