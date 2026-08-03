import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { MachineExplorer } from "@/components/explorer/MachineExplorer";
import { machineComponents } from "@/content/machine-components";
import { lessons } from "@/content/lessons";
import type { MachineComponent } from "@/content/types";

export const metadata: Metadata = {
  title: "Machine Explorer",
  description:
    "An interactive cutaway of a vertical machining centre. Open any of the twenty-four components for a plain explanation, the engineering behind it, the parameters a designer chooses and how it fails in service.",
};

const SYSTEM_ORDER: { system: MachineComponent["system"]; label: string }[] = [
  { system: "structure", label: "Structure" },
  { system: "motion", label: "Motion" },
  { system: "spindle", label: "Spindle" },
  { system: "control", label: "Control" },
  { system: "auxiliary", label: "Auxiliary" },
  { system: "safety", label: "Safety" },
];

export default function ExplorerPage() {
  // Lesson titles are resolved here, on the server, so that the lesson registry
  // never reaches the explorer's client bundle.
  const lessonTitles: Record<string, string> = Object.fromEntries(
    lessons.map((lesson) => [lesson.slug, lesson.title]),
  );

  return (
    <>
      <PageHeader
        eyebrow="Machine Explorer"
        title="Every part of a CNC machine, and why it is there"
        intro="A vertical machining centre drawn in cutaway, with a numbered callout on each of its twenty-four major components. Open one and you get the same six things every time: what it is in plain words, the engineering explanation, the parameters a designer actually decides, the ways it fails in service, the lessons that teach it, and the glossary terms it uses."
        width="wide"
      >
        <div className="flex flex-wrap items-center gap-2">
          {SYSTEM_ORDER.map(({ system, label }) => (
            <Badge key={system} tone={system === "safety" ? "amber" : "neutral"}>
              {label}{" "}
              <span className="num">
                {machineComponents.filter((component) => component.system === system).length}
              </span>
            </Badge>
          ))}
        </div>
      </PageHeader>

      <MachineExplorer lessonTitles={lessonTitles} />
    </>
  );
}
