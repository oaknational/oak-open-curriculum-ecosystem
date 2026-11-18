/**
 * The two answers the PreCompact observer gives the harness.
 *
 * @remarks
 * Claude Code validates a `PreCompact` answer on its top-level fields only
 * and rejects `hookSpecificOutput` outright, because that union has no
 * `PreCompact` variant. So both answers carry `continue` and `systemMessage`
 * and no other key, and both say `continue: true`: the observer never blocks
 * a compaction. The prefix lets a transcript reader find the answer, and the
 * probe's marker pairs it with its line in the observation log.
 *
 * Each answer is returned as the exact line the entry writes to stdout: one
 * JSON object and its terminating newline. `JSON.stringify` escapes any
 * newline inside the message, so the answer stays one line whatever the
 * reason says.
 *
 * @packageDocumentation
 */

/** The prefix on every `systemMessage` the observer answers with. */
const ANSWER_PREFIX = '[pre-compact-observe]';

/**
 * The longest failure reason an answer carries, in UTF-16 code units, the cut
 * mark included. A cut can split a surrogate pair; `JSON.stringify` escapes
 * the lone half, so the line stays valid JSON.
 */
const REASON_CAP = 200;

/** Marks a reason cut at the cap. */
const CUT_MARK = '\u2026';

/**
 * The answer given when the observation was recorded.
 *
 * @param marker - The observation's marker, as written to the log line.
 * @returns The stdout line: `continue: true` and the prefixed marker as
 *   `systemMessage`.
 */
export function probeAnswer(marker: string): string {
  return answerLine(`${ANSWER_PREFIX} ${marker}`);
}

/**
 * The answer given when the observation could not be recorded.
 *
 * @remarks
 * A failure to record is evidence, not silence: the reason reaches the
 * transcript, and the compaction still goes ahead. A reason longer than 200
 * characters is cut to 200, ending in an ellipsis, so an error that quotes a
 * large input cannot flood the transcript.
 *
 * @param reason - Why the observation failed.
 * @returns The stdout line: `continue: true` and the prefixed reason as
 *   `systemMessage`.
 */
export function failOpenAnswer(reason: string): string {
  return answerLine(`${ANSWER_PREFIX} observation failed: ${capped(reason)}`);
}

/** The reason as given, or cut to the cap and ending in the cut mark. */
function capped(reason: string): string {
  if (reason.length <= REASON_CAP) {
    return reason;
  }
  return `${reason.slice(0, REASON_CAP - CUT_MARK.length)}${CUT_MARK}`;
}

/** Serialise an answer carrying only `continue: true` and the message. */
function answerLine(systemMessage: string): string {
  return `${JSON.stringify({ continue: true, systemMessage })}\n`;
}
