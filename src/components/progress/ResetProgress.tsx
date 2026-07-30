"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useProgress } from "./ProgressProvider";

/**
 * The destructive action of SPEC.md section 8, behind an explicit confirm step.
 *
 * Three deliberate decisions:
 *
 *  - It is never one click. The first press only opens the confirmation, which
 *    is where the consequence is spelled out. Nothing is written until the
 *    second, differently-worded press.
 *  - The safe choice comes first in the tab order, so the keyboard path of least
 *    resistance out of the confirmation is the one that keeps the data.
 *  - No amber. Amber is reserved for machine-safety content (SPEC 5), and
 *    erasing your own notes is not a safety hazard. The weight here comes from
 *    the rule, the wording and the two-step, not from borrowing a colour that
 *    means something else on this site.
 *
 * Focus returns to the button the learner pressed, and a status line says what
 * actually happened. `Button` is part of the frozen foundation and does not
 * forward a ref, so the trigger is found by its generated id rather than by
 * modifying that component.
 */
type Phase = "idle" | "confirming" | "erased" | "kept";

export function ResetProgress() {
  const { reset, ready } = useProgress();
  const [phase, setPhase] = useState<Phase>("idle");
  const triggerId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (phase === "confirming") {
      panelRef.current?.focus();
      return;
    }
    if (phase === "erased" || phase === "kept") {
      document.getElementById(triggerId)?.focus();
    }
  }, [phase, triggerId]);

  const status =
    phase === "erased"
      ? "Progress erased. Nothing is left on this device to restore."
      : phase === "kept"
        ? "Nothing was erased. Your saved progress is untouched."
        : "";

  return (
    <Card tone="sunk">
      <CardBody>
        <h3 className="font-display text-[19px] font-semibold tracking-tightest text-ink">
          Erase everything saved on this device
        </h3>
        <div className="measure mt-3 space-y-3 text-[15px] leading-[1.65] text-ink-soft">
          <p>
            Everything on this page &mdash; completed lessons, knowledge-check scores,
            troubleshooting results and every saved project decision &mdash; is stored in this
            browser on this device and nowhere else. There is no account, no server copy and no
            export. Nothing was ever sent anywhere, which also means there is nothing to send back.
          </p>
          <p className="text-ink">
            Erasing it cannot be undone. If you want to keep a record of your project decisions,
            print the concept report from the last stage of the design project first.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            id={triggerId}
            variant="secondary"
            disabled={!ready || phase === "confirming"}
            aria-expanded={phase === "confirming"}
            onClick={() => setPhase("confirming")}
          >
            Reset my progress
          </Button>
          <p role="status" aria-live="polite" className="text-[14px] leading-snug text-ink-soft">
            {ready ? status : "Reading your saved progress…"}
          </p>
        </div>

        {phase === "confirming" ? (
          <div
            ref={panelRef}
            tabIndex={-1}
            role="group"
            aria-labelledby={headingId}
            className="mt-5 rounded-sm border border-rule-strong bg-paper-raised px-5 py-5"
          >
            <p id={headingId} className="font-mono text-[11px] uppercase tracking-eyebrow text-ink">
              Confirm: this cannot be undone
            </p>
            <p className="measure mt-2 text-[15px] leading-[1.65] text-ink">
              This will delete your completed lessons, your quiz scores, your troubleshooting
              results and all of your saved design-project decisions from this browser. There is no
              copy anywhere, so they cannot be recovered afterwards.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {/* The safe choice is first, so it is the first thing Tab reaches. */}
              <Button variant="secondary" onClick={() => setPhase("kept")}>
                Keep my progress
              </Button>
              <Button
                onClick={() => {
                  reset();
                  setPhase("erased");
                }}
              >
                Yes, erase everything
              </Button>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
