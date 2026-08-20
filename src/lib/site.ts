/**
 * Where this build of the site is going to live.
 *
 * The course is deployed twice from one codebase: to Azure Static Web Apps,
 * which is the real site, and to GitHub Pages, which is kept online only so
 * existing links and bookmarks do not break. Both builds are the same static
 * export — the difference is entirely in these two build-time variables, set
 * per workflow, the same way `STATIC_EXPORT` and `PAGES_BASE_PATH` are set in
 * `next.config.mjs`.
 *
 * These are read in server components only, so they are resolved when the page
 * is prerendered and never reach the browser as configuration. That is why they
 * carry no `NEXT_PUBLIC_` prefix: nothing on the client needs to ask where it
 * is running.
 */

/**
 * Absolute origin of the canonical site, no trailing slash — for example
 * `https://cnc-academy.azurestaticapps.net`. Empty on the canonical build
 * itself, which has no other site to point at.
 */
function readPrimaryUrl(): string {
  const raw = process.env.PRIMARY_SITE_URL?.trim();
  if (!raw) return "";
  // A trailing slash here would produce `https://host//learn/` once joined.
  return raw.replace(/\/+$/, "");
}

export const primarySiteUrl = readPrimaryUrl();

/**
 * True on the GitHub Pages build. Turns on the notice bar and the canonical
 * link that hands search ranking to the Azure site.
 *
 * A deprecated build without somewhere to send people would be a dead end, so
 * the flag only takes effect once `PRIMARY_SITE_URL` is also set. Getting that
 * wrong should degrade to an ordinary site, not a banner pointing nowhere.
 */
export const isDeprecatedBuild =
  process.env.SITE_DEPRECATED === "true" && primarySiteUrl !== "";
