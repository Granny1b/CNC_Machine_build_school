"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  className?: string;
  ariaLabel: string;
}

/**
 * Roving-tabindex tab list per the WAI-ARIA authoring practices: arrow keys
 * move focus, Home/End jump to the ends, and only the active tab is in the
 * document tab order.
 */
export function Tabs({ items, className = "", ariaLabel }: TabsProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex flex-wrap gap-1 border-b border-rule"
      >
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  focusTab(i + 1);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  focusTab(i - 1);
                } else if (e.key === "Home") {
                  e.preventDefault();
                  focusTab(0);
                } else if (e.key === "End") {
                  e.preventDefault();
                  focusTab(items.length - 1);
                }
              }}
              className={`-mb-px border-b-2 px-3 py-2 font-mono text-[12px] uppercase tracking-eyebrow transition-colors motion-reduce:transition-none ${
                selected
                  ? "border-blue text-blue"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-5 focus-visible:outline-none"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
