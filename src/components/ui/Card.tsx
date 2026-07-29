import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** `sunk` for wells and inactive tracks, `raised` for panels and cards. */
  tone?: "raised" | "sunk" | "wash";
  interactive?: boolean;
  as?: "div" | "article" | "li" | "section";
}

const tones = {
  raised: "bg-paper-raised border-rule shadow-panel",
  sunk: "bg-paper-sunk border-rule",
  wash: "bg-blue-wash border-blue/15",
} as const;

export function Card({
  children,
  className = "",
  tone = "raised",
  interactive = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={[
        "rounded-sm border",
        tones[tone],
        interactive
          ? "transition-shadow duration-200 hover:shadow-lift motion-reduce:transition-none"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-b border-rule px-5 py-4 sm:px-6 ${className}`}>{children}</div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 py-5 sm:px-6 ${className}`}>{children}</div>;
}
