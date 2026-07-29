"use client";

import { useId, useState, type ReactNode } from "react";

export interface DisclosureProps {
  title: string;
  /** Small mono label above the title, e.g. "GOING DEEPER". */
  eyebrow?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Progressive disclosure for optional technical depth. The summary always
 * states what is inside so a beginner can make an informed choice to skip it.
 */
export function Disclosure({
  title,
  eyebrow,
  children,
  defaultOpen = false,
  className = "",
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={`rounded-sm border border-rule bg-paper-raised ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span
          aria-hidden="true"
          className={`mt-0.5 shrink-0 text-blue transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-90" : ""
          }`}
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <path d="M1 1L8 6L1 11" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <span className="min-w-0">
          {eyebrow ? <span className="eyebrow block">{eyebrow}</span> : null}
          <span className="block font-display text-[17px] font-semibold tracking-tightest text-ink">
            {title}
          </span>
        </span>
      </button>
      <div id={panelId} hidden={!open} className="border-t border-rule px-5 py-5">
        {children}
      </div>
    </div>
  );
}
