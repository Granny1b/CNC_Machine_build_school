import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressDashboard } from "@/components/progress/ProgressDashboard";

export const metadata: Metadata = {
  title: "Progress",
  description:
    "What you have completed, how each knowledge check went, which troubleshooting scenarios you have worked and every design decision you have saved — held in this browser only, and erasable in two clicks.",
};

/**
 * The progress route. SPEC.md section 8: completion, quiz history, saved project
 * decisions, reset.
 *
 * The page composes. `ProgressDashboard` is a client component because the
 * record lives in the browser, and everything it needs comes from the progress
 * context and the content registries.
 */
export default function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Your record of the course"
        intro="Everything you have marked complete, every knowledge check you have answered, every fault you have worked and every design decision you have saved — in one place, with nothing rounded up in your favour."
      >
        <div className="measure space-y-3 text-[15px] leading-[1.65] text-ink-soft">
          <p>
            This record is stored in this browser on this device, and nowhere else. There is no
            account to create and nothing is sent anywhere, which is why it does not follow you to
            another computer and why clearing your browser data clears it.
          </p>
          <p>
            The numbers here describe the course as it exists today, not as it will exist when it is
            finished. Five of the twenty levels carry written lessons; the rest are on the roadmap
            with their topics visible, and the percentages below say so rather than quietly counting
            unwritten levels as work you still owe.
          </p>
        </div>
      </PageHeader>

      <Container className="py-10 sm:py-14">
        <ProgressDashboard />
      </Container>
    </>
  );
}
