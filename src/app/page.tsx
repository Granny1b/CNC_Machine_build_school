import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { curriculum, TIER_ORDER, levelsByTier } from "@/content/curriculum";
import { TIER_LABELS } from "@/lib/format";

/**
 * Phase 0/1 scaffold page. It doubles as the acceptance check for Phase 1:
 * all 20 levels with tier and prerequisites, rendered from `curriculum.ts`.
 * Phase 2 replaces this with the real homepage from SPEC.md section 5.4.
 */
export default function HomePage() {
  return (
    <>
      <section className="grid-wash border-b border-rule bg-paper-raised">
        <Container className="py-16">
          <p className="eyebrow">Scaffold · Phase 1</p>
          <h1 className="mt-3 text-[38px] font-bold sm:text-[48px]">
            From &ldquo;what is CNC?&rdquo; to designing your own machine
          </h1>
          <p className="measure mt-4 text-[17px] leading-[1.65] text-ink-soft">
            Twenty levels, four tiers. Every term is defined where it first appears, and
            every estimate says plainly that it is an estimate.
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <p className="eyebrow">Curriculum · {curriculum.length} levels</p>
        <div className="mt-8 space-y-12">
          {TIER_ORDER.map((tier) => (
            <section key={tier}>
              <h2 className="border-b border-rule pb-2 text-[22px] font-semibold">
                {TIER_LABELS[tier]}
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {levelsByTier(tier).map((level) => (
                  <Card as="li" key={level.slug} tone="raised">
                    <CardBody>
                      <div className="flex items-start justify-between gap-3">
                        <p className="num text-[12px] text-ink-faint">
                          LEVEL {String(level.number).padStart(2, "0")}
                        </p>
                        <Badge tone={level.status === "published" ? "moss" : "neutral"}>
                          {level.status}
                        </Badge>
                      </div>
                      <h3 className="mt-2 text-[18px] font-semibold">{level.title}</h3>
                      <p className="mt-2 text-[14px] leading-snug text-ink-soft">
                        {level.summary}
                      </p>
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
                        Requires:{" "}
                        {level.requires.length
                          ? level.requires.map((n) => `L${n}`).join(" · ")
                          : "nothing"}
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
                        {level.topics.length} topics
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 text-[14px] text-ink-soft">
          <Link href="/learn" className="text-blue underline underline-offset-4">
            Learning path
          </Link>{" "}
          arrives in Phase 2.
        </p>
      </Container>
    </>
  );
}
