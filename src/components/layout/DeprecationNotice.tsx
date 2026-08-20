import { Container } from "./Container";
import { isDeprecatedBuild, primarySiteUrl } from "@/lib/site";

/**
 * The "this copy has moved" bar, rendered above the header on the GitHub Pages
 * build only. On the Azure build `isDeprecatedBuild` is false and this returns
 * nothing, so the canonical site carries no trace of it.
 *
 * Deliberately not amber. SPEC section 5 reserves amber exclusively for safety
 * content so it never loses its meaning, and a site move is an administrative
 * notice, not a hazard. Deep blue reads as a system bar and keeps white text
 * far above the 4.5:1 that SPEC 5.6 requires.
 *
 * The eyebrow is `paper`, not the `blue-bright` accent it wants to be: bright
 * on deep measures 4.44:1, which `npm run sweep` fails at 11px. It separates
 * from the sentence by case, tracking and family instead of by hue, which is
 * the pattern the palette comment in `tailwind.config.ts` already sets out for
 * eyebrows.
 *
 * It is a server component and a plain link: no state, no effects, and it
 * survives with JavaScript switched off, which matters because a stale
 * bookmark is exactly the situation this bar exists for.
 */
export function DeprecationNotice() {
  if (!isDeprecatedBuild) return null;

  return (
    <div className="border-b border-blue-deep bg-blue-deep text-paper-raised">
      <Container width="wide">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2.5 text-[14px] leading-snug">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-paper">
            Archived copy
          </span>
          <span>
            CNC Academy has moved. This copy is no longer updated —
          </span>
          {/*
            An absolute URL to the other origin, so it must not pick up the
            `/<repo>/` base path Next prefixes onto internal `Link` hrefs.
            A plain anchor is the whole point here.
          */}
          <a
            href={primarySiteUrl}
            className="font-semibold text-paper-raised underline decoration-blue-bright decoration-2 underline-offset-4 hover:decoration-paper-raised"
          >
            continue on the current site
          </a>
        </p>
      </Container>
    </div>
  );
}
