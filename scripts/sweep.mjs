/**
 * The SPEC section 13 Phase 10 sweep, and the half of section 15 that a
 * compiler cannot see: responsive layout at 360 / 768 / 1280, colour contrast,
 * heading order, accessible names and visible focus.
 *
 * Usage:
 *   npm run build && npm start &        # or: npm run dev
 *   npm run sweep                       # defaults to http://localhost:3000
 *   BASE=http://localhost:3131 npm run sweep
 *
 * Exits non-zero when anything fails, so it can gate a release.
 *
 * Chromium comes from Playwright. The font stylesheet is aborted deliberately:
 * it is an external request whose failure would otherwise fill the console
 * report with noise that says nothing about the site.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const WIDTHS = [360, 768, 1280];

const PAGES = [
  "/",
  "/learn",
  "/learn/what-is-a-cnc-machine",
  "/learn/cad-to-finished-component",
  "/learn/understanding-xyz",
  "/learn/how-a-ball-screw-moves-an-axis",
  "/learn/accuracy-repeatability-resolution",
  "/learn/intro-to-machine-architecture",
  "/learn/selecting-an-architecture",
  "/explorer",
  "/calculators",
  "/glossary",
  "/project",
  "/progress",
  "/troubleshooting",
  "/simulator",
  "/resources",
];

const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

/**
 * Relative luminance and contrast per WCAG 2.1. Runs in the page so it reads
 * computed styles rather than the source, which is the only way to catch a
 * colour that arrives through a utility class or a cascade.
 */
const CONTRAST_PROBE = `(() => {
  const lum = (r, g, b) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const a = m[1].split(",").map(Number);
    return { r: a[0], g: a[1], b: a[2], a: a[3] === undefined ? 1 : a[3] };
  };
  // Walk up for the first opaque background: a transparent element inherits
  // whatever is painted behind it.
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.95) return c;
      n = n.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const out = [];
  const sel = "p,li,a,span,h1,h2,h3,h4,h5,h6,td,th,dt,dd,button,label,figcaption";
  for (const el of document.querySelectorAll(sel)) {
    if (!el.textContent || !el.textContent.trim()) continue;
    if (el.offsetParent === null) continue;
    if (el.querySelector("p,li,h1,h2,h3,div")) continue;   // leaf text only
    const s = getComputedStyle(el);
    const fg = parse(s.color);
    if (!fg) continue;
    const bg = bgOf(el);
    const ratio = (Math.max(lum(fg.r, fg.g, fg.b), lum(bg.r, bg.g, bg.b)) + 0.05)
                / (Math.min(lum(fg.r, fg.g, fg.b), lum(bg.r, bg.g, bg.b)) + 0.05);
    const px = parseFloat(s.fontSize);
    const large = px >= 24 || (px >= 18.66 && parseInt(s.fontWeight, 10) >= 700);
    const need = large ? 3 : 4.5;   // SPEC 5.6
    if (ratio < need - 0.02) {
      out.push({ text: el.textContent.trim().slice(0, 40), tag: el.tagName.toLowerCase(),
                 px, ratio: Math.round(ratio * 100) / 100, need, fg: s.color,
                 bg: "rgb(" + bg.r + "," + bg.g + "," + bg.b + ")" });
    }
  }
  const seen = new Set();
  return out.filter((o) => { const k = o.fg + o.bg + o.px; if (seen.has(k)) return false; seen.add(k); return true; });
})()`;

/** Anything wider than the viewport that is not inside its own scroller. */
const OVERFLOW_PROBE = `(() => {
  const de = document.documentElement;
  if (de.scrollWidth <= de.clientWidth + 1) return null;
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= de.clientWidth + 1) continue;
    let anc = el.parentElement, contained = false;
    while (anc) {
      const ox = getComputedStyle(anc).overflowX;
      if (ox === "auto" || ox === "scroll" || ox === "hidden") { contained = true; break; }
      anc = anc.parentElement;
    }
    if (!contained && getComputedStyle(el).position !== "fixed") {
      bad.push(el.tagName.toLowerCase() + "." + String(el.className).slice(0, 50));
    }
  }
  return { sw: de.scrollWidth, cw: de.clientWidth, bad: bad.slice(0, 3) };
})()`;

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.route("**://fonts.googleapis.com/**", (r) => r.abort());
  await page.route("**://fonts.gstatic.com/**", (r) => r.abort());

  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));

  let contrastFails = 0;
  for (const path of PAGES) {
    consoleErrors.length = 0;
    const response = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    if (!response || !response.ok()) fail(`[${width}] ${path} responded ${response ? response.status() : "no response"}`);
    await page.waitForTimeout(650);

    const overflow = await page.evaluate(OVERFLOW_PROBE);
    if (overflow) fail(`[${width}] ${path} scrolls sideways ${overflow.sw}>${overflow.cw}: ${overflow.bad.join(" | ")}`);

    // Contrast and structure do not change with width, so check them once.
    if (width === WIDTHS[WIDTHS.length - 1]) {
      for (const c of await page.evaluate(CONTRAST_PROBE)) {
        contrastFails += 1;
        fail(`[contrast] ${path} ${c.ratio}:1 (needs ${c.need}) ${c.px}px <${c.tag}> "${c.text}" ${c.fg} on ${c.bg}`);
      }
      const structure = await page.evaluate(() => {
        const heads = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"))
          .filter((h) => h.offsetParent !== null).map((h) => Number(h.tagName[1]));
        const unnamed = [];
        for (const el of document.querySelectorAll("button,a[href]")) {
          if (el.offsetParent === null) continue;
          if (!(el.getAttribute("aria-label") || el.textContent || "").trim()) {
            unnamed.push(el.tagName.toLowerCase() + "." + String(el.className).slice(0, 30));
          }
        }
        for (const el of document.querySelectorAll('[role="img"], img')) {
          if (el.offsetParent === null) continue;
          if (!(el.getAttribute("aria-label") || el.getAttribute("alt") || "").trim()) {
            unnamed.push("role=img." + String(el.className).slice(0, 30));
          }
        }
        return { heads, unnamed };
      });
      const h1s = structure.heads.filter((n) => n === 1).length;
      if (h1s !== 1) fail(`[headings] ${path} has ${h1s} <h1>`);
      for (let i = 1; i < structure.heads.length; i += 1) {
        if (structure.heads[i] - structure.heads[i - 1] > 1) {
          fail(`[headings] ${path} jumps h${structure.heads[i - 1]} to h${structure.heads[i]}`);
          break;
        }
      }
      for (const u of structure.unnamed.slice(0, 3)) fail(`[name] ${path} unnamed ${u}`);
    }

    // Two classes of noise are this harness's own doing rather than site
    // defects: the font stylesheet we abort above, and an RSC prefetch that was
    // still in flight when the sweep navigated away — Next reports that one
    // while saying in the same breath that it has handled it. A genuine RSC
    // failure does not carry the fallback notice and still surfaces.
    const real = consoleErrors.filter(
      (e) =>
        !/net::ERR_|Failed to load resource/.test(e) &&
        !/Failed to fetch RSC payload[\s\S]*Falling back to browser navigation/.test(e),
    );
    if (real.length) fail(`[${width}] ${path} console: ${real.slice(0, 2).join(" || ")}`);
  }
  notes.push(`${width}px: ${PAGES.length} routes${width === WIDTHS[WIDTHS.length - 1] ? `, ${contrastFails} contrast failures` : ""}`);
  await context.close();
}

/* Every keyboard stop must show a focus ring. */
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.route("**://fonts.g*/**", (r) => r.abort());
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(650);
  let stops = 0, ringless = 0;
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        ring: (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none",
        tag: el.tagName.toLowerCase(),
        name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30),
      };
    });
    if (!info) continue;
    stops += 1;
    if (!info.ring) { ringless += 1; if (ringless <= 3) fail(`[focus] no visible ring on <${info.tag}> "${info.name}"`); }
  }
  notes.push(`keyboard: ${stops} tab stops on /, ${ringless} without a visible focus ring`);
  await context.close();
}

/* The hero must hold still when the visitor has asked for less motion. */
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("**://fonts.g*/**", (r) => r.abort());
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const clip = { x: 0, y: 150, width: 1000, height: 500 };
  const first = await page.screenshot({ clip });
  await page.waitForTimeout(2200);
  if (!first.equals(await page.screenshot({ clip }))) fail("[motion] the hero animates under prefers-reduced-motion");
  else notes.push("hero is static under prefers-reduced-motion");
  await context.close();
}

await browser.close();

console.log("\nCNC Academy sweep\n");
for (const n of notes) console.log(`  ${n}`);
if (problems.length === 0) {
  console.log("\n  All sweep checks passed.\n");
  process.exit(0);
}
console.log(`\n  ${problems.length} problem(s):\n`);
for (const p of problems.slice(0, 40)) console.log(`  x ${p}`);
if (problems.length > 40) console.log(`  ... and ${problems.length - 40} more`);
console.log("");
process.exit(1);
