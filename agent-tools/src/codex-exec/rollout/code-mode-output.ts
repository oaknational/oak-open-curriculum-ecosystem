/**
 * @packageDocumentation
 *
 * A code-mode tool output, as the rollout records it: the harness's preamble
 * for the script's status, then whatever the model's own program printed. The
 * program chooses what it prints (such as a result object, one field of it,
 * or nothing), so its printed output is authored by the model and is never
 * evidence; the harness's `CommandExecution` item carries each command's
 * output instead. The reader checks only the preamble item the harness writes.
 */

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/** The harness's preamble item first; the program's items after it are not parsed. */
const outputSchema = z
  .tuple([z.strictObject({ type: z.literal('input_text'), text: z.string() })])
  .rest(z.unknown());

/**
 * The harness's preamble for a script that completed, failed or was
 * terminated (codex-cli 0.156.1 to 0.157.1): the status line, the wall time
 * and `Output:`. The variant written under
 * `code_mode.experimental_show_cell_overhead` adds the code-mode and overhead
 * times and reads as no preamble, failing closed.
 */
const finishedPreamble =
  /^Script (completed|failed|terminated)\nWall time \d+(?:\.\d+)? seconds\nOutput:\n/u;
/** The preamble of a script still running in a cell: the cell line, the wall time and `Output:`; its output so far follows. */
const runningPreamble =
  /^Script running with cell ID [^\n]*\nWall time \d+(?:\.\d+)? seconds\nOutput:\n/u;

/** How the harness's preamble reports the script, or `none` when the text opens with no preamble. */
export type PreambleStatus = 'completed' | 'failed' | 'terminated' | 'running' | 'none';

/** The preamble read off the front of a code-mode output's text, and the text after it. */
export interface Preamble {
  readonly status: PreambleStatus;
  /** The text after the preamble; the whole text when there is none. */
  readonly rest: string;
}

/** The closed set of statuses a finished script's preamble names. */
function isFinishedStatus(
  group: string | undefined,
): group is 'completed' | 'failed' | 'terminated' {
  return group === 'completed' || group === 'failed' || group === 'terminated';
}

/**
 * Read the harness's preamble off the front of a code-mode output's text. The
 * text after it is the program's, or the harness's error text when the script
 * failed; the caller decides what to make of it.
 */
export function readPreamble(text: string): Preamble {
  const finished = finishedPreamble.exec(text);
  if (finished !== null) {
    const status = finished[1];
    if (isFinishedStatus(status)) {
      return { status, rest: text.slice(finished[0].length) };
    }
  }
  const running = runningPreamble.exec(text);
  if (running !== null) {
    return { status: 'running', rest: text.slice(running[0].length) };
  }
  return { status: 'none', rest: text };
}

/** Why a code-mode output's wrapper is not the one the harness writes. */
export type CodeModeOutputRefusal =
  | "custom_tool_call_output.output does not open with the harness's input_text item"
  | 'custom_tool_call_output.output has no completed-script preamble';

/**
 * Check a code-mode output's wrapper: the first item is the harness's input
 * text item, with no other field, holding the completed-script preamble and
 * nothing after it.
 *
 * @param value - The output record's `output` field.
 * @returns ok when the wrapper is the harness's, else the refusal.
 */
export function checkCodeModeOutput(value: unknown): Result<void, CodeModeOutputRefusal> {
  const parsed = outputSchema.safeParse(value);
  if (!parsed.success) {
    return err("custom_tool_call_output.output does not open with the harness's input_text item");
  }
  const [item] = parsed.data;
  const preamble = readPreamble(item.text);
  return preamble.status === 'completed' && preamble.rest === ''
    ? ok(undefined)
    : err('custom_tool_call_output.output has no completed-script preamble');
}
