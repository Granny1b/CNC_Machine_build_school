import type { ReactNode } from "react";
import { Container } from "./Container";

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  width?: "narrow" | "default" | "wide";
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
  width = "default",
}: PageHeaderProps) {
  return (
    <header className="grid-wash border-b border-rule bg-paper-raised">
      <Container width={width} className="py-10 sm:py-14">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-[32px] font-bold sm:text-[42px]">{title}</h1>
        {intro ? (
          <p className="measure mt-4 text-[17px] leading-[1.65] text-ink-soft">{intro}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </header>
  );
}
