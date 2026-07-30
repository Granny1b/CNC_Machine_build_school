import { Container } from "@/components/layout/Container";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { GcodeHero } from "@/components/home/GcodeHero";
import { ProjectPreview } from "@/components/home/ProjectPreview";
import { ResumeCard } from "@/components/home/ResumeCard";
import { RoadmapPreview } from "@/components/home/RoadmapPreview";
import { ButtonLink } from "@/components/ui/Button";
import { TOTAL_LEVELS, teachingOrder } from "@/content/curriculum";

/**
 * The homepage. SPEC.md section 8: hero, roadmap preview, featured tools,
 * current progress and project preview.
 *
 * The page only composes. The hero is the thesis of SPEC 5.4 — a live
 * G-code-to-motion strip rather than a sentence claiming the course is practical
 * — and every band below it is a self-contained component reading its own
 * content registry, so nothing here can drift out of step with the course.
 */
export default function HomePage() {
  return (
    <>
      <section className="grid-wash border-b border-rule bg-paper-raised">
        <Container className="py-10 sm:py-14">
          <div className="measure">
            <p className="eyebrow">
              CNC Academy · <span className="num">{TOTAL_LEVELS}</span> levels
            </p>
            <h1 className="mt-3 text-[34px] font-bold sm:text-[44px]">
              From &ldquo;what is CNC?&rdquo; to designing your own machine
            </h1>
            <p className="mt-4 text-[17px] leading-[1.65] text-ink-soft">
              A course for people starting from nothing. It begins with what the three letters mean
              and ends with you specifying a milling machine of your own — structure, guideways,
              drives, control and safety concept. Every technical word is defined where it first
              appears, and every estimate says plainly that it is an estimate.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={`/learn/${teachingOrder[0]}`} size="lg">
              Start with lesson one
            </ButtonLink>
            <ButtonLink href="/learn" variant="secondary" size="lg">
              See the learning path
            </ButtonLink>
          </div>

          <div className="mt-10 sm:mt-12">
            <p className="eyebrow">The whole idea, in one strip</p>
            <p className="measure mt-2 text-[15px] leading-[1.65] text-ink-soft">
              A CNC machine reads instructions one line at a time and turns each one into motion.
              Watch it happen: the highlighted line is the one being executed, the toolpath draws
              itself as the cut progresses, and the readout tracks the tool tip while it moves. By
              Level 10 you will be writing these lines yourself.
            </p>
            <div className="mt-5">
              <GcodeHero />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container className="py-10 sm:py-12">
          <ResumeCard />
        </Container>
      </section>

      <section className="border-b border-rule bg-paper-raised">
        <Container className="py-12 sm:py-16">
          <RoadmapPreview />
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container className="py-12 sm:py-16">
          <FeaturedTools />
        </Container>
      </section>

      <section className="grid-wash bg-paper-raised">
        <Container className="py-12 sm:py-16">
          <ProjectPreview />
        </Container>
      </section>
    </>
  );
}
