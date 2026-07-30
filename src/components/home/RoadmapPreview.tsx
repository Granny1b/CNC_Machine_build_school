import { StatusBadge } from "@/components/progress/LevelBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TIER_ORDER, curriculum, levelsByTier } from "@/content/curriculum";
import { estimatedMinutes, lessons } from "@/content/lessons";
import { TIER_LABELS, pluralise } from "@/lib/format";

/**
 * The roadmap preview of SPEC.md section 8: the four tiers, the levels inside
 * each of them, and an honest published-versus-planned distinction.
 *
 * Every level appears, including the planned ones. `status` says whether lessons
 * exist yet — it is never used to hide part of the route, because a learner
 * deciding whether to start deserves to see where the road goes.
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function RoadmapPreview() {
  const publishedLevels = curriculum.filter((level) => level.status === "published").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <p className="eyebrow">The route · four tiers</p>
          <h2 className="mt-2 text-[26px] font-semibold sm:text-[30px]">
            Twenty levels, in the order they build on each other
          </h2>
          <p className="measure mt-3 text-[16px] leading-[1.65] text-ink-soft">
            You start with what a CNC machine is and finish by specifying one. The tiers are
            simply the four kinds of thinking involved: understanding the machine, designing its
            mechanics, driving and controlling it, then proving and looking after it.
          </p>
        </div>
        <ButtonLink href="/learn" variant="secondary" size="md">
          See the full learning path
        </ButtonLink>
      </div>

      <ol className="mt-8 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TIER_ORDER.map((tier, index) => {
          const levels = levelsByTier(tier);
          const ready = levels.filter((level) => level.status === "published").length;

          return (
            <Card as="li" key={tier} tone="raised">
              <CardHeader>
                <p className="eyebrow">
                  Tier {pad(index + 1)} of {pad(TIER_ORDER.length)}
                </p>
                <h3 className="mt-1.5 text-[18px] font-semibold">{TIER_LABELS[tier]}</h3>
                <p className="eyebrow mt-2">
                  {pad(levels.length)} levels · {pad(ready)} with lessons
                </p>
              </CardHeader>
              <CardBody className="py-1">
                <ul>
                  {levels.map((level) => (
                    <li
                      key={level.slug}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 border-t border-rule py-2.5 first:border-t-0"
                    >
                      <span className="num shrink-0 text-[11px] text-ink-faint">
                        L{pad(level.number)}
                      </span>
                      {/* A floor on the title's width makes the badge wrap to
                          its own line rather than squeezing the title. */}
                      <span className="min-w-[8rem] flex-1 text-[14px] font-medium leading-snug">
                        {level.title}
                      </span>
                      <StatusBadge status={level.status} />
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          );
        })}
      </ol>

      <p className="measure mt-6 text-[14px] leading-[1.65] text-ink-soft">
        <span className="num">{lessons.length}</span>{" "}
        {pluralise(lessons.length, "lesson")} are written, across{" "}
        <span className="num">{publishedLevels}</span> of the{" "}
        <span className="num">{curriculum.length}</span> levels, adding up to about{" "}
        <span className="num">{estimatedMinutes()}</span> minutes of reading. Every other level
        already carries its full topic list on the learning path, so the whole route is legible
        from the first day rather than hidden behind a promise.
      </p>
    </div>
  );
}
