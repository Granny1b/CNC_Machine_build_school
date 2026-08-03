import type { ReactNode } from "react";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export interface ContainerProps {
  children: ReactNode;
  width?: keyof typeof widths;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main" | "article" | "nav";
}

export function Container({
  children,
  width = "default",
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full ${widths[width]} px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
