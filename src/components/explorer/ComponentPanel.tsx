"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type ReactNode } from "react";
import type { MachineComponent } from "@/content/types";
import {
  machineComponents,
  PARAMETER_NOTE,
  QUALIFIED_WORK_IDS,
  QUALIFIED_WORK_NOTE,
} from "@/content/machine-components";
import { Badge } from "@/components/ui/Badge";
import { SYSTEM_LABEL } from "./MachineDrawing";

/**
 * The component panel. A side sheet from `lg` up, a bottom sheet below it.
 *
 * Section order is fixed by SPEC.md section 10: simple explanation, engineering
 * explanation, main design parameters, common failure modes, related lessons,
 * related glossary terms.
 */

/** Glossary slugs whose display form the generic rule would get wrong. */
const GLOSSARY_LABELS: Record<string, string> = {
  cnc: "CNC",
  cad: "CAD",
  cam: "CAM",
  plc: "PLC",
  dro: "DRO",
  "g-code": "G-code",
  "m-code": "M-code",
  "c-frame": "C-frame",
  "look-ahead": "Look-ahead",
};

function glossaryLabel(slug: string): string {
  const known = GLOSSARY_LABELS[slug];
  if (known) return known;
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function lessonLabel(slug: string, titles: Record<string, string>): string {
  const known = titles[slug];
  if (known) return known;
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * SPEC.md section 5.2: a number that represents a measured or calculated value
 * is never set in anything but mono. Parameter values are the one place in this
 * panel where such figures appear, so every numeral in them is wrapped.
 */
function withNumerals(text: string): ReactNode[] {
  return text.split(/(\d+(?:[.,]\d+)?)/g).map((part, index) =>
    /^\d/.test(part) ? (
      <span key={index} className="num">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-rule px-5 py-5 first:border-t-0 sm:px-6">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-1.5 text-[17px] font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export interface ComponentPanelProps {
  component: MachineComponent;
  /** Balloon number, so the panel and the drawing agree. */
  number: number;
  /** slug → lesson title, supplied by the page so lesson data stays server-side. */
  lessonTitles: Record<string, string>;
  onClose: () => void;
}

export function ComponentPanel({
  component,
  number,
  lessonTitles,
  onClose,
}: ComponentPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId();

  useEffect(() => {
    panelRef.current?.focus();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [component.id]);

  const showQualifiedNote = QUALIFIED_WORK_IDS.includes(component.id);

  return (
    <>
      {/* Below lg the sheet covers the drawing, so it gets a dismissable scrim. */}
      <div
        className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-labelledby={headingId}
        tabIndex={-1}
        className={[
          "fixed inset-x-0 bottom-0 z-40 flex max-h-[82vh] flex-col",
          "rounded-t-sm border-t border-rule-strong bg-paper-raised shadow-lift",
          "lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[min(460px,92vw)] lg:max-h-none",
          "lg:rounded-none lg:border-l lg:border-t-0",
        ].join(" ")}
      >
        <header className="flex items-start gap-3 border-b border-rule-strong px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">
              Callout <span className="num">{String(number).padStart(2, "0")}</span> of{" "}
              <span className="num">{machineComponents.length}</span>
            </p>
            <h2 id={headingId} className="mt-1.5 text-[22px] font-bold">
              {component.name}
            </h2>
            <div className="mt-2">
              <Badge tone={component.system === "safety" ? "amber" : "blue"}>
                {SYSTEM_LABEL[component.system]}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm border border-rule-strong bg-paper-raised px-3 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft transition-colors duration-150 hover:border-blue hover:text-blue motion-reduce:transition-none"
          >
            Close
          </button>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <Section eyebrow="In plain words" title="What it is and what it does">
            <p className="measure text-[16px] leading-[1.65] text-ink">{component.plain}</p>
          </Section>

          <Section eyebrow="The engineering" title="How it is designed and why">
            <p className="measure text-[16px] leading-[1.65] text-ink-soft">
              {component.engineering}
            </p>
          </Section>

          <Section eyebrow="Design parameters" title="What a designer actually decides">
            <p className="measure rounded-sm border border-blue/20 bg-blue-wash px-4 py-3 text-[14px] leading-[1.6] text-blue">
              {PARAMETER_NOTE}
            </p>
            <dl className="mt-4 divide-y divide-rule border-y border-rule">
              {component.parameters.map((parameter) => (
                <div key={parameter.label} className="py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
                    {parameter.label}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-[1.6] text-ink">
                    {withNumerals(parameter.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section eyebrow="Common failure modes" title="How it goes wrong in service">
            <ul className="space-y-3">
              {component.failureModes.map((mode) => (
                <li key={mode} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-mid"
                  />
                  <span className="text-[15px] leading-[1.6] text-ink-soft">{mode}</span>
                </li>
              ))}
            </ul>
            {/* Amber is the design system's safety colour, and this is safety
                content. The body copy stays in ink so the contrast holds. */}
            {showQualifiedNote ? (
              <div className="mt-5 rounded-sm border border-amber/40 border-l-2 border-l-amber bg-amber-wash px-4 py-3">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink">
                  Safety
                </p>
                <p className="measure mt-1.5 text-[14px] leading-[1.6] text-ink">
                  {QUALIFIED_WORK_NOTE}
                </p>
              </div>
            ) : null}
          </Section>

          <Section eyebrow="Related lessons" title="Where this is taught">
            <ul className="space-y-2">
              {component.lessons.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/learn/${slug}`}
                    className="group flex items-baseline gap-2 text-[15px] text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
                  >
                    <span aria-hidden="true" className="font-mono text-[11px] text-ink-faint">
                      →
                    </span>
                    {lessonLabel(slug, lessonTitles)}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <Section eyebrow="Related glossary terms" title="Words used on this panel">
            <ul className="flex flex-wrap gap-2">
              {component.glossary.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/glossary#${slug}`}
                    className="inline-flex rounded-sm border border-rule bg-paper-sunk px-2.5 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft transition-colors duration-150 hover:border-blue hover:text-blue motion-reduce:transition-none"
                  >
                    {glossaryLabel(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <div className="px-5 py-5 sm:px-6">
            <p className="measure text-[13px] leading-[1.6] text-ink-faint">
              Press <kbd className="font-mono text-[12px] text-ink-soft">Esc</kbd> to close this
              panel, or use the arrow keys on the drawing to move between callouts.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
