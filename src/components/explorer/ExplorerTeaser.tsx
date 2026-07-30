import { machineComponents } from "@/content/machine-components";
import { Card, CardBody } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

/**
 * The `explorer-teaser` widget of SPEC.md section 6, embedded in lessons by the
 * lesson renderer. Self-contained and prop-free so any block renderer can drop
 * it in without knowing anything about the explorer.
 */

const SAMPLE_IDS = ["ball-screw", "tool-changer", "safety-enclosure"];

export function ExplorerTeaser() {
  const samples = machineComponents.filter((component) => SAMPLE_IDS.includes(component.id));

  return (
    <Card tone="wash">
      <CardBody>
        <p className="eyebrow">Interactive · Machine Explorer</p>
        <h3 className="mt-2 text-[19px] font-semibold">
          See where this part actually sits in the machine
        </h3>
        <p className="measure mt-2 text-[15px] leading-[1.65] text-ink-soft">
          The explorer is a cutaway of a vertical machining centre with{" "}
          <span className="num">{machineComponents.length}</span> numbered callouts. Open any one
          for a plain explanation, the engineering behind it, the parameters a designer chooses
          and the ways it fails in service.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {samples.map((component) => (
            <li
              key={component.id}
              className="rounded-sm border border-blue/20 bg-paper-raised px-2.5 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-blue"
            >
              {component.name}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <ButtonLink href="/explorer" variant="primary" size="md">
            Open the machine explorer
          </ButtonLink>
        </div>
      </CardBody>
    </Card>
  );
}
