"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { GlossaryTag, GlossaryTerm } from "@/content/types";
import { glossary, GLOSSARY_TAGS, GLOSSARY_TAG_LABELS } from "@/content/glossary";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { pluralise } from "@/lib/format";
import { GlossaryEntry } from "./GlossaryEntry";

/* Built once at module load: none of this depends on component state. */

const SORTED: GlossaryTerm[] = [...glossary].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
);

const TERM_NAMES: Record<string, string> = Object.fromEntries(
  glossary.map((entry) => [entry.slug, entry.term]),
);

const ALL_SLUGS = new Set(glossary.map((entry) => entry.slug));

/** Term, every alias, both definitions and the example, lower-cased for search. */
const HAYSTACK = new Map<string, string>(
  glossary.map((entry) => [
    entry.slug,
    [
      entry.term,
      entry.slug.replace(/-/g, " "),
      ...(entry.aliases ?? []),
      entry.plain,
      entry.technical,
      entry.example ?? "",
    ]
      .join("  ")
      .toLowerCase(),
  ]),
);

function letterOf(term: string): string {
  const first = term.charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
}

export interface GlossaryBrowserProps {
  /** lesson slug → title, supplied by the page so lesson content stays server-side. */
  lessonTitles?: Record<string, string>;
}

export function GlossaryBrowser({ lessonTitles = {} }: GlossaryBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<GlossaryTag[]>([]);
  const searchId = useId();

  const clearAll = useCallback(() => {
    setQuery("");
    setActiveTags([]);
  }, []);

  /* A cross-reference such as /glossary#ball-screw must land on its entry even
     when a search or a filter would otherwise have hidden it. */
  useEffect(() => {
    const jump = () => {
      const slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!slug || !ALL_SLUGS.has(slug)) return;
      clearAll();
      window.requestAnimationFrame(() => {
        // No behaviour option: globals.css sets smooth scrolling and turns it
        // off again under prefers-reduced-motion.
        document.getElementById(slug)?.scrollIntoView({ block: "start" });
      });
    };
    jump();
    window.addEventListener("hashchange", jump);
    return () => window.removeEventListener("hashchange", jump);
  }, [clearAll]);

  const toggleTag = (tag: GlossaryTag) =>
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  const tokens = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );

  const results = useMemo(
    () =>
      SORTED.filter((entry) => {
        if (activeTags.length > 0 && !entry.tags.some((tag) => activeTags.includes(tag))) {
          return false;
        }
        if (tokens.length === 0) return true;
        const hay = HAYSTACK.get(entry.slug) ?? "";
        return tokens.every((token) => hay.includes(token));
      }),
    [activeTags, tokens],
  );

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const entry of results) {
      const letter = letterOf(entry.term);
      const bucket = map.get(letter);
      if (bucket) bucket.push(entry);
      else map.set(letter, [entry]);
    }
    return Array.from(map.entries());
  }, [results]);

  const filtered = tokens.length > 0 || activeTags.length > 0;
  const tagNames = activeTags.map((tag) => GLOSSARY_TAG_LABELS[tag]).join(", ");

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div role="search">
          <label htmlFor={searchId} className="eyebrow mb-1.5 block">
            Search every term, alias and definition
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ball screw, backlash, ISO, chatter…"
            className="w-full rounded-sm border border-rule-strong bg-paper-raised px-3 py-2.5 text-[16px] text-ink placeholder:text-ink-faint focus:border-blue-bright"
          />
        </div>
        <p
          role="status"
          aria-live="polite"
          className="num text-[13px] text-ink-soft lg:pb-2.5 lg:text-right"
        >
          {results.length} of {glossary.length} {pluralise(glossary.length, "term")}
        </p>
      </div>

      <div className="mt-5">
        <p className="eyebrow" id="glossary-filter-label">
          Filter by subject — matches any selected
        </p>
        <div
          role="group"
          aria-labelledby="glossary-filter-label"
          className="mt-2 flex flex-wrap items-center gap-2"
        >
          {GLOSSARY_TAGS.map((tag) => {
            const on = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(tag)}
                className={[
                  "rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase tracking-eyebrow",
                  "transition-colors duration-150 motion-reduce:transition-none",
                  on
                    ? "border-blue bg-blue text-paper-raised"
                    : "border-rule-strong bg-paper-raised text-ink-soft hover:border-blue hover:text-blue",
                ].join(" ")}
              >
                {GLOSSARY_TAG_LABELS[tag]}
              </button>
            );
          })}
          {filtered ? (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          ) : null}
        </div>
      </div>

      {groups.length > 1 ? (
        <nav aria-label="Jump to letter" className="mt-6 border-t border-rule pt-4">
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
            {groups.map(([letter]) => (
              <li key={letter}>
                <a
                  href={`#glossary-letter-${letter}`}
                  className="font-mono text-[13px] text-blue transition-colors hover:text-blue-bright motion-reduce:transition-none"
                >
                  {letter}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {results.length === 0 ? (
        <Card tone="sunk" className="mt-8">
          <CardBody>
            <p className="eyebrow">Nothing found</p>
            {tokens.length > 0 ? (
              <p className="measure mt-2 text-[16px] leading-[1.65] text-ink">
                No term, alias or definition contains{" "}
                <span className="font-mono text-ink-soft">&ldquo;{query.trim()}&rdquo;</span>
                {activeTags.length > 0 ? (
                  <>
                    {" "}
                    within the {tagNames} {pluralise(activeTags.length, "filter")}
                  </>
                ) : null}
                . Try a shorter word, a different spelling, or a term you would expect it to
                sit under.
              </p>
            ) : (
              <p className="measure mt-2 text-[16px] leading-[1.65] text-ink">
                No term carries the {tagNames} {pluralise(activeTags.length, "tag")}. Clear the
                filters to see the whole glossary again.
              </p>
            )}
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={clearAll}>
                Clear search and filters
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map(([letter, entries]) => (
            <section key={letter} aria-labelledby={`glossary-letter-${letter}`}>
              <h2
                id={`glossary-letter-${letter}`}
                className="scroll-mt-24 border-b border-rule-strong pb-2 font-mono text-[13px] uppercase tracking-eyebrow text-ink-faint"
              >
                {letter}
                <span className="sr-only">
                  {" "}
                  — {entries.length} {pluralise(entries.length, "term")}
                </span>
              </h2>
              <div className="mt-5 space-y-5">
                {entries.map((entry) => (
                  <GlossaryEntry
                    key={entry.slug}
                    entry={entry}
                    termNames={TERM_NAMES}
                    lessonTitles={lessonTitles}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
