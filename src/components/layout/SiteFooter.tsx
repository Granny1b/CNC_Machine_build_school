import Link from "next/link";
import { Container } from "./Container";
import { primaryNav } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule bg-paper-raised">
      <Container width="wide" className="py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow">CNC Academy</p>
            <p className="measure mt-3 text-[15px] leading-[1.6] text-ink-soft">
              A structured course that takes a complete beginner from &ldquo;what is
              CNC?&rdquo; to designing a custom CNC milling machine — one level at a
              time, with every term defined where it first appears.
            </p>

            <div className="mt-6 rounded-sm border border-amber/30 bg-amber-wash px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-amber">
                Educational use only
              </p>
              <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
                Everything here is teaching material. Calculators give order-of-magnitude
                estimates, not engineering results. Machine design, electrical work and
                commissioning must be carried out and verified by qualified personnel
                under the standards and law that apply to you. Where a standard is
                mentioned, consult the published standard for its actual requirements.
              </p>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Sections</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-ink-soft transition-colors hover:text-blue motion-reduce:transition-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
            Built to SPEC.md · Phase 1
          </p>
          <p className="font-mono text-[11px] text-ink-faint">
            SI units throughout · Shop units shown where conventional
          </p>
        </div>
      </Container>
    </footer>
  );
}
