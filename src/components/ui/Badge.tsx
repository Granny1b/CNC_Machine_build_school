import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "blue" | "moss" | "amber" | "outline";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-paper-sunk text-ink-soft border-rule",
  blue: "bg-blue-wash text-blue border-blue/20",
  moss: "bg-moss-wash text-moss border-moss/25",
  // Amber is reserved for safety content only. See SPEC section 5.
  amber: "bg-amber-wash text-amber border-amber/30",
  outline: "bg-transparent text-ink-soft border-rule-strong",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-eyebrow ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
