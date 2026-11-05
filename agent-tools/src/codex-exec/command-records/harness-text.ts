import { z } from 'zod';

import { readPreamble, type Preamble, type PreambleStatus } from '../rollout/code-mode-output.js';
import { hasTruncationMarker } from '../rollout/record-shapes.js';

/**
 * The harness's own text in an exec tool output, read for what the harness
 * says happened to the call: the code-mode wrapper's status, a refusal by the
 * exec policy, or a truncation that leaves the outcome inconclusive.
 *
 * The output arrives in one of two carriers, both observed on codex-cli
 * 0.157.1: a string, or an array of `{ type, text }` parts (also as a JSON
 * string holding that array). In a code-mode output the program's own text
 * comes first and, when the script failed, the harness appends
 * `Script error:\n…` last, so a refusal or a truncation is read only after the
 * LAST `Script error:` line of a failed script; text before it, and every
 * character under a completed, terminated or running wrapper, is the
 * program's and is never matched. In a function-tool output (`exec_command`,
 * `write_stdin`) the harness's text is the whole text, read from offset 0 with
 * no wrapper: a code-mode preamble at its start is read as text, never as a
 * status, so a function tool's output can neither complete a call nor hide a
 * refusal behind a `Script error:` line. The output's carrier comes from its
 * record type (`custom_tool_call_output` or `function_call_output`). A
 * refusal keeps the judged command line alone; the policy's justification is
 * not read, since the rule a shape matches names its own.
 *
 * After the last `Script error:` line of a failure that is no refusal stands
 * the program's own exception text; the refusal patterns are anchored at its
 * start, and that anchor alone keeps such text unmatched. A judged command
 * line that itself contains a backtick never matches the policy's pattern and
 * reads as unaccounted, failing closed: a residual of this reader.
 */

/** The harness's parts carrier as observed on codex-cli 0.157.1: every part an `input_text` part; any other part shape is malformed. */
const partsSchema = z.array(z.object({ type: z.literal('input_text'), text: z.string() }));

/** Which tool wrote an exec output: the code-mode `exec` tool, which wraps its script, or a function tool, which does not. */
export type OutputCarrier = 'code-mode' | 'function-tool';

/** A command the exec policy refused before any process spawned. */
export interface Refusal {
  /** The judged command line as the policy rendered it; empty for a refused `write_stdin`. */
  readonly commandLine: string;
}

export type HarnessText =
  | { readonly kind: 'malformed'; readonly reason: string }
  | {
      readonly kind: 'text';
      readonly status: PreambleStatus;
      readonly refusal: Refusal | undefined;
      readonly truncated: boolean;
    };

const SCRIPT_ERROR = 'Script error:\n';
/** The router's `Debug` rendering of a rejected exec: the message is a quoted, escaped string. */
const DEBUG_REJECTED =
  /^exec_command failed: CreateProcess \{ message: "Rejected\((.*)\)" \}\s*$/su;
/** The exec policy's own message: the judged command in backticks, then a justification that is not read. */
const REJECTED = /^`([^`]*)` rejected: /u;
const STDIN_REJECTED = 'write_stdin rejected: ';

/** The text of an output, whichever carrier holds it. */
function textOf(output: unknown): string | undefined {
  if (typeof output !== 'string') {
    const parts = partsSchema.safeParse(output);
    return parts.success ? parts.data.map((part) => part.text).join('') : undefined;
  }
  if (!output.startsWith('[')) {
    return output;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(output);
  } catch {
    return output;
  }
  const parts = partsSchema.safeParse(parsed);
  return parts.success ? parts.data.map((part) => part.text).join('') : output;
}

/**
 * One level of `Debug` escaping undone: the backslash-escaped quotes,
 * backslashes and newlines of a string literal, then the literal's own quotes.
 */
function unescapeOnce(literal: string): string {
  const unescaped = literal.replaceAll(/\\(["\\n])/gu, (_match, escaped: string) =>
    escaped === 'n' ? '\n' : escaped,
  );
  return unescaped.startsWith('"') && unescaped.endsWith('"') ? unescaped.slice(1, -1) : unescaped;
}

/** The refusal the anchored text opens with, in any of its carriers, or none. */
function refusalIn(anchored: string): Refusal | undefined {
  const debug = DEBUG_REJECTED.exec(anchored);
  const message = debug === null ? anchored : unescapeOnce(debug[1] ?? '');
  const rejected = REJECTED.exec(message);
  if (rejected !== null) {
    return { commandLine: rejected[1] ?? '' };
  }
  return message.startsWith(STDIN_REJECTED) ? { commandLine: '' } : undefined;
}

/** The harness's text after the last `Script error:` line; empty when the script wrote no error. */
function afterLastScriptError(rest: string): string {
  const at = rest.lastIndexOf(SCRIPT_ERROR);
  return at === -1 ? '' : rest.slice(at + SCRIPT_ERROR.length);
}

/**
 * The harness's own text in an output: the whole text of a function-tool
 * output, the text after the last `Script error:` line of a failed script,
 * and nothing under any other wrapper, where the text after the preamble is
 * the program's.
 */
function harnessTextOf(text: string, preamble: Preamble): string {
  if (preamble.status === 'none') {
    return text;
  }
  return preamble.status === 'failed' ? afterLastScriptError(preamble.rest) : '';
}

/**
 * Read an exec tool output's harness text. A carrier that is neither text nor
 * the harness's parts is malformed; otherwise the wrapper status (always
 * `none` for a function tool, which writes no wrapper), the refusal the
 * anchored text opens with, and whether the anchored text is truncated.
 */
export function readHarnessText(output: unknown, carrier: OutputCarrier): HarnessText {
  const text = textOf(output);
  if (text === undefined) {
    return { kind: 'malformed', reason: "exec output is neither text nor the harness's parts" };
  }
  const preamble: Preamble =
    carrier === 'code-mode' ? readPreamble(text) : { status: 'none', rest: text };
  const anchored = harnessTextOf(text, preamble);
  return {
    kind: 'text',
    status: preamble.status,
    refusal: refusalIn(anchored),
    truncated: hasTruncationMarker(anchored),
  };
}
