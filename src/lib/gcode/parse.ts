/**
 * The parser: a whole program in, one `ParsedLine` per source line out, plus
 * every problem that can be seen without executing anything.
 *
 * The split between this file and `interpret.ts` is deliberate. Everything here
 * is about what the learner *wrote* — a bracket that never closes, a value with
 * no address letter, the same axis named twice in one block. Everything about
 * what the program would *do* belongs to the interpreter, and everything about
 * whether it is a good idea belongs to the linter. Keeping them apart is what
 * lets the listing render even when the program is badly broken.
 */

import { tokenizeLineDetailed } from "./tokenize";
import type { Diagnostic, ParsedLine } from "./types";

/**
 * A ceiling on how much this browser-only teaching model will read. A real
 * program from a CAM system can run to hundreds of thousands of blocks, and
 * this is not the tool for those — it is the tool for the fifty lines you are
 * trying to understand.
 */
export const MAX_PROGRAM_LINES = 20000;

/**
 * Address letters that may legitimately appear more than once in one block.
 * A block can set several modes at once — `G21 G90 G17` is three G words and
 * perfectly ordinary — but naming X twice is a mistake in any dialect.
 */
const REPEATABLE_ADDRESSES = new Set(["G", "M"]);

function splitLines(source: string): string[] {
  return source.split(/\r\n|\n|\r/);
}

/**
 * The same axis or setting written twice in one block. Controls differ on what
 * they do about it, and that is exactly why it is worth flagging: you cannot
 * tell by reading the line which value the machine will use.
 */
function duplicateAddressDiagnostics(line: ParsedLine): Diagnostic[] {
  const seen = new Map<string, number>();
  const reported = new Set<string>();
  const diagnostics: Diagnostic[] = [];

  for (const word of line.words) {
    if (REPEATABLE_ADDRESSES.has(word.letter)) continue;
    const count = (seen.get(word.letter) ?? 0) + 1;
    seen.set(word.letter, count);
    if (count < 2 || reported.has(word.letter)) continue;
    reported.add(word.letter);

    const written = line.words
      .filter((candidate) => candidate.letter === word.letter)
      .map((candidate) => candidate.text.replace(/\s+/g, ""))
      .join(" and ");

    diagnostics.push({
      lineIndex: line.index,
      severity: "error",
      code: "duplicate-address",
      message: `“${word.letter}” is written more than once in this block — ${written}.`,
      consequence:
        "A block can only carry one value for an address. Controls differ: some stop with a format alarm, and one that accepts the block uses a single value without telling you which. Reading the line does not tell you what the machine will do.",
      fix: "Decide which value you meant and delete the other, or split the block into two lines so the order is written down rather than assumed.",
    });
  }

  return diagnostics;
}

/**
 * Read a program. Always returns one `ParsedLine` per source line, in order and
 * with matching indices, so a listing can render every line of what was typed
 * even when much of it is unreadable.
 */
export function parseProgram(source: string): { lines: ParsedLine[]; diagnostics: Diagnostic[] } {
  const rawLines = splitLines(source);
  const diagnostics: Diagnostic[] = [];

  const truncated = rawLines.length > MAX_PROGRAM_LINES;
  const kept = truncated ? rawLines.slice(0, MAX_PROGRAM_LINES) : rawLines;

  const lines: ParsedLine[] = [];

  kept.forEach((raw, index) => {
    const { line, issues } = tokenizeLineDetailed(raw, index);
    lines.push(line);

    for (const issue of issues) {
      diagnostics.push({
        lineIndex: index,
        severity: issue.severity,
        code: issue.code,
        message: issue.message,
        consequence: issue.consequence,
        fix: issue.fix,
      });
    }

    diagnostics.push(...duplicateAddressDiagnostics(line));
  });

  if (truncated) {
    diagnostics.push({
      lineIndex: Math.max(0, kept.length - 1),
      severity: "warning",
      code: "program-truncated",
      message: `This program is longer than the ${MAX_PROGRAM_LINES} lines this simulator reads, so everything after line ${MAX_PROGRAM_LINES} has been ignored.`,
      consequence:
        "The toolpath, the extents and the time estimate below describe only the part that was read, so they describe a different program from the one you pasted.",
      fix: "Paste the section you are trying to understand on its own. This is a tool for reading a program, not for handling a full CAM output.",
    });
  }

  return { lines, diagnostics };
}
