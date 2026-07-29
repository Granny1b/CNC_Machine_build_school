/**
 * Glossary auto-linking for prose. SPEC.md section 4 and Phase 5.
 *
 * Pure and glossary-agnostic: the caller supplies the term list, so this module
 * has no content dependency and stays trivially testable. The renderer turns
 * segments into elements.
 *
 * Two rules the spec is explicit about:
 *   - first occurrence only, so a paragraph is never double-linked;
 *   - never link inside code. Text between backticks is emitted as a `code`
 *     segment and is skipped entirely by the matcher.
 */

export interface AutolinkTerm {
  slug: string;
  term: string;
  aliases?: string[];
}

export interface AutolinkSegment {
  text: string;
  /** Present when this segment is a glossary link. */
  slug?: string;
  /** True for text that was written between backticks: render it in mono. */
  code?: boolean;
}

export interface AutolinkIndex {
  /** Combined matcher, longest surface form first so "ball screw" beats "screw". */
  pattern: RegExp | null;
  /** Lower-cased surface form -> glossary slug. */
  bySurface: Map<string, string>;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build the matcher once per term list. Surface forms are sorted by length so
 * that alternation prefers the most specific match.
 */
export function buildAutolinkIndex(terms: AutolinkTerm[]): AutolinkIndex {
  const bySurface = new Map<string, string>();

  for (const entry of terms) {
    for (const surface of [entry.term, ...(entry.aliases ?? [])]) {
      const key = surface.trim().toLowerCase();
      // First writer wins, so an alias never steals a canonical term's slug.
      if (key && !bySurface.has(key)) bySurface.set(key, entry.slug);
    }
  }

  const surfaces = Array.from(bySurface.keys()).sort((a, b) => b.length - a.length);
  if (surfaces.length === 0) return { pattern: null, bySurface };

  // Boundaries are hand-written rather than \b so that hyphenated forms such as
  // "G-code" do not match inside "G-code-ish" and do not require the preceding
  // character to be a word character.
  const pattern = new RegExp(
    `(?<![A-Za-z0-9-])(${surfaces.map(escapeRegExp).join("|")})(?![A-Za-z0-9-])`,
    "gi",
  );

  return { pattern, bySurface };
}

/** Split a string on backtick spans, marking the inner text as code. */
function splitCode(text: string): AutolinkSegment[] {
  const out: AutolinkSegment[] = [];
  const re = /`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push({ text: text.slice(last, match.index) });
    out.push({ text: match[1], code: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

function linkPlain(
  text: string,
  index: AutolinkIndex,
  used: Set<string>,
): AutolinkSegment[] {
  if (!index.pattern) return text ? [{ text }] : [];

  const out: AutolinkSegment[] = [];
  const re = new RegExp(index.pattern.source, index.pattern.flags);
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const slug = index.bySurface.get(match[1].toLowerCase());
    // Already linked once: leave the later occurrences as plain text.
    if (!slug || used.has(slug)) continue;
    used.add(slug);

    if (match.index > last) out.push({ text: text.slice(last, match.index) });
    out.push({ text: match[1], slug });
    last = match.index + match[0].length;
  }

  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/**
 * Link one paragraph. `used` is shared across a whole prose sequence by
 * `autolinkParagraphs`, which is what makes it first-occurrence-only.
 */
export function autolinkParagraph(
  text: string,
  index: AutolinkIndex,
  used: Set<string> = new Set(),
): AutolinkSegment[] {
  return splitCode(text).flatMap((segment) =>
    segment.code ? [segment] : linkPlain(segment.text, index, used),
  );
}

/**
 * Link a run of paragraphs, sharing one `used` set so each glossary term is
 * linked at most once across the run.
 *
 * `skipSlugs` suppresses links a page would send back to itself — a glossary
 * entry should not link to itself, and a lesson need not link a term it is
 * currently defining.
 */
export function autolinkParagraphs(
  paragraphs: string[],
  index: AutolinkIndex,
  options: { skipSlugs?: string[]; used?: Set<string> } = {},
): AutolinkSegment[][] {
  const used = options.used ?? new Set<string>();
  for (const slug of options.skipSlugs ?? []) used.add(slug);
  return paragraphs.map((p) => autolinkParagraph(p, index, used));
}

/** Headings and code never take links; this is the explicit no-op path. */
export function plainSegments(text: string): AutolinkSegment[] {
  return splitCode(text);
}
