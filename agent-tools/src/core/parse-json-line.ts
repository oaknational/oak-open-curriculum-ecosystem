/**
 * One-line JSON parse for the vendor transcript readers.
 *
 * @remarks
 * A vendor transcript (Claude Code JSONL) carries one JSON object per line, and
 * an unparseable line is ordinary rather than exceptional: a file still being
 * written ends in a partial line, and a reader skips it and keeps going. Two
 * readers had each grown a private copy of this parse — the session-metadata
 * usage parser and the agent-event reader — differing only in whether they
 * returned `undefined` or `null`. Both guard the result before use, so one
 * helper returning `undefined` serves both, and a third reader has one to call
 * instead of a third copy.
 *
 * @packageDocumentation
 */

/**
 * Parse a single JSONL line.
 *
 * @param line - One line of a JSONL file.
 * @returns The parsed value, or `undefined` when the line is not valid JSON.
 */
export function parseJsonLine(line: string): unknown {
  try {
    const value: unknown = JSON.parse(line);
    return value;
  } catch {
    return undefined;
  }
}
