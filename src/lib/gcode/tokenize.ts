/**
 * The lexer: one line of G-code in, one `ParsedLine` out.
 *
 * G-code has almost no syntax. A block is a bag of address-and-value words, and
 * the whole of the tokeniser's job is to say which words are there, exactly as
 * the learner wrote them, and to complain clearly about anything it cannot read
 * rather than quietly dropping it. Nothing here knows what a word *means* —
 * `interpret.ts` does that — so a program full of codes this model does not
 * implement still produces a complete, highlightable listing.
 *
 * Everything in this module is pure. It reads a string and returns data.
 */

import type { GcodeWord, IssueSeverity, ParsedLine } from "./types";

/**
 * A lexical problem found while reading one line. `parse.ts` turns these into
 * `Diagnostic`s; they are kept separate here so that `tokenizeLine` can keep the
 * simple signature the rest of the simulator is written against.
 */
export interface TokenIssue {
  code: string;
  severity: IssueSeverity;
  message: string;
  consequence: string;
  fix: string;
  /** 0-based column the problem starts at, so a listing can point at it. */
  column: number;
}

export interface TokenizedLine {
  line: ParsedLine;
  issues: TokenIssue[];
}

const DIGIT = /[0-9]/;
const LETTER = /[A-Za-z]/;

function isSpace(character: string): boolean {
  return (
    character === " " ||
    character === "\t" ||
    character === "\r" ||
    character === "\v" ||
    character === "\f"
  );
}

/**
 * Read a signed decimal starting at `start`. Accepts `12`, `-12.5`, `+.5` and
 * `5.` — controls are generous about which of those they will take, and a
 * beginner has no reason to know which spelling their machine prefers.
 * Returns `null` when there is no number there at all.
 */
function readNumber(raw: string, start: number): { end: number; text: string } | null {
  let index = start;
  if (index < raw.length && (raw[index] === "+" || raw[index] === "-")) index += 1;

  let digits = 0;
  while (index < raw.length && DIGIT.test(raw[index])) {
    index += 1;
    digits += 1;
  }
  if (index < raw.length && raw[index] === ".") {
    index += 1;
    while (index < raw.length && DIGIT.test(raw[index])) {
      index += 1;
      digits += 1;
    }
  }

  if (digits === 0) return null;
  return { end: index, text: raw.slice(start, index) };
}

function unexpectedCharacter(character: string, column: number): TokenIssue {
  return {
    code: "unexpected-character",
    severity: "error",
    column,
    message: `The character “${character}” is not part of a G-code word here.`,
    consequence:
      "A control reads a block as address letters and their values. A character it cannot place is a format error, and the block does not run.",
    fix: "Delete the character, or put the text it belongs to inside a comment — round brackets, or everything after a semicolon.",
  };
}

/**
 * Tokenise one line and report anything unreadable. `index` is the 0-based
 * source line number and is carried straight through onto the result.
 */
export function tokenizeLineDetailed(raw: string, index: number): TokenizedLine {
  const words: GcodeWord[] = [];
  const comments: string[] = [];
  const issues: TokenIssue[] = [];

  let blockDelete = false;
  let lineNumber: number | undefined;
  /** True once anything other than whitespace has been read on this line. */
  let started = false;
  let cursor = 0;

  while (cursor < raw.length) {
    const character = raw[cursor];

    if (isSpace(character)) {
      cursor += 1;
      continue;
    }

    // The block-delete character, and only where it means anything: first.
    if (character === "/") {
      if (!started) {
        blockDelete = true;
        started = true;
        cursor += 1;
        // Some controls allow a level digit, as in `/2`. Consume it so it is
        // not mistaken for a value that has lost its address letter.
        while (cursor < raw.length && DIGIT.test(raw[cursor])) cursor += 1;
        continue;
      }
      issues.push(unexpectedCharacter("/", cursor));
      started = true;
      cursor += 1;
      continue;
    }

    // `%` delimits the program in a file. It is not a command.
    if (character === "%") {
      if (!started) {
        started = true;
        const rest = raw.slice(cursor + 1).trim();
        if (rest.length > 0) {
          issues.push({
            code: "text-after-percent",
            severity: "note",
            column: cursor + 1,
            message: `“%” marks the start or the end of the program, and “${rest}” is written on the same line.`,
            consequence:
              "The delimiter is normally alone on its line. Text sharing the line with it may be read as part of the program or ignored, depending on the control.",
            fix: "Put the “%” on a line of its own and move anything else onto the next line.",
          });
        }
        cursor = raw.length;
        continue;
      }
      issues.push(unexpectedCharacter("%", cursor));
      started = true;
      cursor += 1;
      continue;
    }

    // `( ... )` — a comment that can sit anywhere in the block.
    if (character === "(") {
      started = true;
      const close = raw.indexOf(")", cursor + 1);
      if (close === -1) {
        comments.push(raw.slice(cursor + 1).trim());
        issues.push({
          code: "unclosed-comment",
          severity: "error",
          column: cursor,
          message: "This comment opens with “(” and is never closed with “)”.",
          consequence:
            "A control keeps reading the comment past the end of the block. Depending on the machine it either alarms on the format, or swallows the commands that follow — which is worse, because the program then does less than it says.",
          fix: "Close the comment with “)” at the end of the text, or start it with a semicolon instead so that it runs to the end of the line by design.",
        });
        cursor = raw.length;
      } else {
        comments.push(raw.slice(cursor + 1, close).trim());
        cursor = close + 1;
      }
      continue;
    }

    if (character === ")") {
      started = true;
      issues.push({
        code: "stray-comment-close",
        severity: "error",
        column: cursor,
        message: "There is a closing “)” here with no “(” opening a comment before it.",
        consequence:
          "Comments do not nest on a control, so a closing bracket with nothing to close is a format error and the block does not run.",
        fix: "Add the opening “(”, or delete this bracket. If the comment text itself contains brackets, rewrite it without them.",
      });
      cursor += 1;
      continue;
    }

    // `;` — comment to the end of the line.
    if (character === ";") {
      started = true;
      comments.push(raw.slice(cursor + 1).trim());
      cursor = raw.length;
      continue;
    }

    if (LETTER.test(character)) {
      started = true;
      const start = cursor;
      const letter = character.toUpperCase();
      cursor += 1;

      // Whitespace is allowed between an address letter and its value, so
      // `X 12.5` and `X12.5` are the same word.
      let valueStart = cursor;
      while (valueStart < raw.length && isSpace(raw[valueStart])) valueStart += 1;

      const number = readNumber(raw, valueStart);
      if (!number) {
        issues.push({
          code: "address-without-value",
          severity: "error",
          column: start,
          message: `The address letter “${letter}” has no number after it.`,
          consequence:
            "Every address letter carries a value; on its own it means nothing, and the control stops the block rather than guessing what was meant.",
          fix: `Give “${letter}” a value, or delete it. If the number was meant to be zero, write it: “${letter}0”.`,
        });
        continue;
      }

      const value = Number(number.text);
      if (!Number.isFinite(value)) {
        issues.push({
          code: "unreadable-value",
          severity: "error",
          column: valueStart,
          message: `“${number.text}” could not be read as a number.`,
          consequence: "The control cannot act on a value it cannot read, so the block does not run.",
          fix: "Rewrite the value as a plain signed decimal, for example “-12.5”.",
        });
        cursor = number.end;
        continue;
      }

      words.push({
        letter,
        value,
        // Exactly as written, whitespace and all, so the listing can echo the
        // learner's own text back at them rather than a tidied-up version.
        text: raw.slice(start, number.end),
        column: start,
      });

      if (letter === "N" && lineNumber === undefined) lineNumber = value;
      cursor = number.end;
      continue;
    }

    if (DIGIT.test(character) || character === "-" || character === "+" || character === ".") {
      started = true;
      const number = readNumber(raw, cursor);
      if (!number) {
        issues.push(unexpectedCharacter(character, cursor));
        cursor += 1;
        continue;
      }
      issues.push({
        code: "value-without-address",
        severity: "error",
        column: cursor,
        message: `The value “${number.text}” has no address letter in front of it.`,
        consequence:
          "A number on its own does not say which axis or which setting it belongs to, so the control has nothing to apply it to and stops the block.",
        fix: `Put the address letter in front of it — “X${number.text}” to move in X, “F${number.text}” to set a feed rate, and so on.`,
      });
      cursor = number.end;
      continue;
    }

    started = true;
    issues.push(unexpectedCharacter(character, cursor));
    cursor += 1;
  }

  const line: ParsedLine = {
    index,
    raw,
    words,
    comments,
    blockDelete,
    empty: words.length === 0,
  };
  if (lineNumber !== undefined) line.lineNumber = lineNumber;

  return { line, issues };
}

/**
 * Tokenise one line. Anything unreadable is still reported — call
 * `tokenizeLineDetailed` when you need those issues; `parseProgram` does.
 */
export function tokenizeLine(raw: string, index: number): ParsedLine {
  return tokenizeLineDetailed(raw, index).line;
}
