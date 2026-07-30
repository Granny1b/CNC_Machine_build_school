"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MachineComponent } from "@/content/types";
import { machineComponents } from "@/content/machine-components";
import { Container } from "@/components/layout/Container";
import { MachineDrawing, SYSTEM_LABEL } from "./MachineDrawing";
import { ComponentPanel } from "./ComponentPanel";

/**
 * The CNC Machine Explorer of SPEC.md section 10.
 *
 * Holds the two pieces of state the whole feature needs — the system filter and
 * the selected component — and hands them to the drawing and the panel. The
 * drawing owns its own roving tabindex; everything else lives here.
 */

type SystemFilter = "all" | MachineComponent["system"];

const FILTERS: { id: SystemFilter; label: string }[] = [
  { id: "all", label: "All systems" },
  { id: "structure", label: "Structure" },
  { id: "motion", label: "Motion" },
  { id: "spindle", label: "Spindle" },
  { id: "control", label: "Control" },
  { id: "auxiliary", label: "Auxiliary" },
  { id: "safety", label: "Safety" },
];

function countFor(filter: SystemFilter): number {
  return filter === "all"
    ? machineComponents.length
    : machineComponents.filter((component) => component.system === filter).length;
}

export interface MachineExplorerProps {
  /**
   * slug → lesson title. Supplied by the page so that the 350 kB lesson
   * registry never has to be pulled into this client bundle.
   */
  lessonTitles?: Record<string, string>;
}

export function MachineExplorer({ lessonTitles = {} }: MachineExplorerProps) {
  const [filter, setFilter] = useState<SystemFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const enabledIds = useMemo(
    () =>
      machineComponents
        .filter((component) => filter === "all" || component.system === filter)
        .map((component) => component.id),
    [filter],
  );

  const selected = selectedId
    ? (machineComponents.find((component) => component.id === selectedId) ?? null)
    : null;
  const selectedNumber = selected
    ? machineComponents.findIndex((component) => component.id === selected.id) + 1
    : 0;

  useEffect(() => {
    if (!selectedId) return undefined;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setSelectedId(null);
      returnFocusRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  function select(id: string) {
    const active = document.activeElement;
    if (active instanceof HTMLElement && !active.closest('[role="dialog"]')) {
      returnFocusRef.current = active;
    }
    setSelectedId(id);
  }

  function close() {
    setSelectedId(null);
    returnFocusRef.current?.focus();
  }

  function applyFilter(next: SystemFilter) {
    setFilter(next);
    if (selectedId) {
      const stillVisible = machineComponents.some(
        (component) =>
          component.id === selectedId && (next === "all" || component.system === next),
      );
      if (!stillVisible) setSelectedId(null);
    }
  }

  return (
    <Container
      width="wide"
      className={[
        "py-10 transition-[margin] duration-200 motion-reduce:transition-none",
        selected ? "lg:mr-[min(460px,92vw)]" : "",
      ].join(" ")}
    >
      {/* ---- filter chips ---- */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter components by system">
        <span className="eyebrow mr-1">Filter</span>
        {FILTERS.map((option) => {
          const active = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => applyFilter(option.id)}
              className={[
                "inline-flex items-center gap-2 rounded-sm border px-3 py-1.5",
                "font-mono text-[11px] uppercase tracking-eyebrow",
                "transition-colors duration-150 motion-reduce:transition-none",
                active
                  ? "border-blue bg-blue text-paper-raised"
                  : "border-rule-strong bg-paper-raised text-ink-soft hover:border-blue hover:text-blue",
              ].join(" ")}
            >
              {option.label}
              <span className={`num text-[10px] ${active ? "opacity-80" : "text-ink-faint"}`}>
                {countFor(option.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- drawing ---- */}
      <figure className="mt-6">
        <div className="grid-wash rounded-sm border border-rule bg-paper-raised p-3 shadow-panel sm:p-5">
          <MachineDrawing
            components={machineComponents}
            enabledIds={enabledIds}
            selectedId={selectedId}
            onSelect={select}
          />
        </div>
        <figcaption className="measure mt-3 text-[14px] leading-[1.6] text-ink-soft">
          A cutaway of a vertical machining centre in bridge form, drawn to show every
          component in one view. It is an illustrative arrangement and is not to scale, and it
          is not a design. Choose a numbered balloon, or an entry in the parts list, to open
          that component. On a narrow screen the drawing scrolls sideways.
        </figcaption>
      </figure>

      {/* ---- parts list, numbered to match the balloons ---- */}
      <section className="mt-10" aria-labelledby="parts-list-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule-strong pb-2">
          <h2 id="parts-list-heading" className="text-[20px] font-semibold">
            Parts list
          </h2>
          <p className="eyebrow">
            <span className="num">{enabledIds.length}</span> of{" "}
            <span className="num">{machineComponents.length}</span> shown
          </p>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {machineComponents.map((component, index) => {
            const isEnabled = enabledIds.includes(component.id);
            const isSelected = selectedId === component.id;
            return (
              <li key={component.id}>
                <button
                  type="button"
                  disabled={!isEnabled}
                  aria-pressed={isSelected}
                  onClick={() => select(component.id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-sm border px-3 py-2.5 text-left",
                    "transition-colors duration-150 motion-reduce:transition-none",
                    "disabled:cursor-default disabled:opacity-45",
                    isSelected
                      ? "border-blue-bright bg-blue-wash"
                      : "border-rule bg-paper-raised hover:border-blue-bright",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "num flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      isSelected
                        ? "border-blue-bright bg-blue-bright text-paper-raised"
                        : "border-rule-strong text-ink-soft",
                    ].join(" ")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium text-ink">
                      {component.name}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
                      {SYSTEM_LABEL[component.system]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {selected ? (
        <ComponentPanel
          component={selected}
          number={selectedNumber}
          lessonTitles={lessonTitles}
          onClose={close}
        />
      ) : null}
    </Container>
  );
}
