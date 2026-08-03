"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "./Container";
import { primaryNav } from "./nav";

/** The wordmark: a datum triangle and the course name, set like a title block. */
function Wordmark() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5"
      aria-label="CNC Academy, home"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
        <rect x="0.5" y="0.5" width="21" height="21" fill="none" stroke="#B4BDB8" />
        <path d="M11 5.5L16 14.5H6L11 5.5Z" fill="#17395B" />
        <path d="M4 17.5H18" stroke="#17395B" strokeWidth="1.25" />
      </svg>
      <span className="whitespace-nowrap font-display text-[17px] font-bold tracking-tightest text-ink">
        CNC Academy
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // A navigation should never leave the drawer hanging open behind the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // "Start Learning" points at a lesson, so it would otherwise light up on every
  // lesson page alongside "Learning Path". Desktop nav is trimmed to the routes
  // that read as sections.
  const desktopNav = primaryNav.filter((item) => item.href !== "/start" && item.label !== "Home");

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper-raised/95 backdrop-blur supports-[backdrop-filter]:bg-paper-raised/80">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          <Wordmark />

          {/* Eleven destinations do not fit a 1024px bar at this type size, so
              the drawer carries the nav up to 1280px, and the bar uses each
              item's concise `short` label — the full labels need about 1100px
              of a 1216px content box, leaving nothing for the wordmark. */}
          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {desktopNav.map((item) => {
                const active = isActive(item.href) && item.label !== "Start Learning";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow transition-colors motion-reduce:transition-none ${
                        active
                          ? "bg-blue-wash text-blue"
                          : "text-ink-soft hover:bg-paper-sunk hover:text-ink"
                      }`}
                    >
                      {item.short ?? item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-sm border border-rule-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft xl:hidden"
          >
            {open ? "Close" : "Menu"}
            <svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true">
              {open ? (
                <path d="M1 1L11 9M11 1L1 9" stroke="currentColor" strokeWidth="1.4" />
              ) : (
                <path d="M0 1h12M0 5h12M0 9h12" stroke="currentColor" strokeWidth="1.4" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-rule bg-paper-raised xl:hidden"
      >
        <Container width="wide">
          <nav aria-label="Primary, mobile">
            <ul className="divide-y divide-rule py-1">
              {primaryNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <span
                        className={`font-display text-[16px] font-semibold tracking-tightest ${
                          active ? "text-blue" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="text-right font-mono text-[11px] text-ink-soft">
                        {item.blurb}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
