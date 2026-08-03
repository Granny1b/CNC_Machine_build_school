/**
 * Two build shapes from one config.
 *
 * The default is an ordinary Next server build — what `npm run dev` and
 * `npm start` use, and what every check in `scripts/` runs against.
 *
 * Setting `STATIC_EXPORT=true` produces a fully static site instead, for GitHub
 * Pages. That is only possible because every route here is already prerendered:
 * there are no route handlers, no server actions and no request-time data, so
 * nothing is lost in the export. If a future feature needs a server, this is the
 * switch that will stop working — and that is the right place to find out.
 *
 * `PAGES_BASE_PATH` exists because a GitHub Pages project site is served from
 * `/<repo>/` rather than the domain root, so links and assets need the prefix
 * compiled in. It is empty everywhere else, which keeps local URLs unchanged.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";
const staticExport = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  ...(basePath ? { assetPrefix: basePath } : {}),
  ...(staticExport
    ? {
        output: "export",
        // Pages serves directories, so `/learn/` must resolve to an index.html.
        trailingSlash: true,
        // There is no image optimiser on a static host; the site ships no
        // raster images anyway, every diagram being inline SVG.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
