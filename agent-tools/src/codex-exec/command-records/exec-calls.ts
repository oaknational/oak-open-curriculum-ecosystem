import type { JsonRecord } from '../rollout/record-shapes.js';

import { flagSegments } from './command-item.js';
import {
  readHarnessText,
  type HarnessText,
  type OutputCarrier,
  type Refusal,
} from './harness-text.js';
import { commandsOfText } from './shell-commands.js';
import type { FlaggedCommand } from './summary.js';

/**
 * The exec family of tool calls and what their outputs say happened. A
 * request is `response_item.custom_tool_call` named `exec` (code mode) or
 * `response_item.function_call` named `exec_command`, `write_stdin` or
 * `shell_command` (a legacy alias, source-read on codex-cli 0.157.1). Outputs
 * carry no name, so each `custom_tool_call_output` or `function_call_output`
 * joins its request by `call_id` within the turn; its record type names the
 * tool that wrote it (code mode or a function tool). Per call the classes are
 * exclusive and decided in this order: an output written by the other tool
 * than its request's is unaccounted, read no further; an output that is
 * neither text nor the harness's parts is malformed and unaccounted; a
 * truncated output is unaccounted; a refusal is refused; a completed
 * code-mode wrapper is accounted; a failed, terminated, running or absent
 * wrapper is unaccounted, and a function tool writes no wrapper, so its
 * output that is no refusal is unaccounted; a request unanswered when the
 * rollout ends is unaccounted.
 * Every turn satisfies `calls === accounted + refused + unaccounted`.
 */

/** The request record types of the exec family: the tool each names, and the names that are exec calls. */
const REQUESTS: ReadonlyMap<
  string,
  { readonly carrier: OutputCarrier; readonly names: ReadonlySet<string> }
> = new Map([
  ['custom_tool_call', { carrier: 'code-mode', names: new Set(['exec']) }],
  [
    'function_call',
    { carrier: 'function-tool', names: new Set(['exec_command', 'write_stdin', 'shell_command']) },
  ],
]);
/** The output record types of the exec family, each with the tool that writes it. */
const OUTPUT_CARRIERS: ReadonlyMap<string, OutputCarrier> = new Map([
  ['custom_tool_call_output', 'code-mode'],
  ['function_call_output', 'function-tool'],
]);

/** How an output accounts for its call. */
export type OutputClass =
  | { readonly kind: 'accounted' }
  | { readonly kind: 'unaccounted' }
  | { readonly kind: 'refused'; readonly refusal: Refusal }
  | { readonly kind: 'malformed'; readonly reason: string };

/** An exec-family request: its call id (undefined when it carries no usable one) and the tool it names. */
export interface ExecRequest {
  readonly callId: string | undefined;
  readonly carrier: OutputCarrier;
}

/** The exec-family request a payload is, or undefined when it is no such request. */
export function execRequest(payload: JsonRecord): ExecRequest | undefined {
  const type = typeof payload.type === 'string' ? payload.type : '';
  const request = REQUESTS.get(type);
  if (
    request === undefined ||
    typeof payload.name !== 'string' ||
    !request.names.has(payload.name)
  ) {
    return undefined;
  }
  const callId = payload.call_id;
  return {
    callId: typeof callId === 'string' && callId.length > 0 ? callId : undefined,
    carrier: request.carrier,
  };
}

/** An exec-family output: the call it answers, the tool that wrote it, and its body as recorded. */
export interface ExecOutput {
  readonly callId: string;
  readonly carrier: OutputCarrier;
  readonly body: unknown;
}

/** The exec-family output a payload is, or undefined when it is no tool output with a call id. */
export function execOutput(payload: JsonRecord): ExecOutput | undefined {
  const carrier = typeof payload.type === 'string' ? OUTPUT_CARRIERS.get(payload.type) : undefined;
  if (carrier === undefined || typeof payload.call_id !== 'string') {
    return undefined;
  }
  return { callId: payload.call_id, carrier, body: payload.output };
}

/** Classify an exec output against the tool its request named, in the exclusive order the module documents. */
export function classifyOutput(output: ExecOutput, requested: OutputCarrier): OutputClass {
  if (output.carrier !== requested) {
    return { kind: 'unaccounted' };
  }
  const text: HarnessText = readHarnessText(output.body, output.carrier);
  if (text.kind === 'malformed') {
    return { kind: 'malformed', reason: text.reason };
  }
  if (text.truncated) {
    return { kind: 'unaccounted' };
  }
  if (text.refusal !== undefined) {
    return { kind: 'refused', refusal: text.refusal };
  }
  return { kind: text.status === 'completed' ? 'accounted' : 'unaccounted' };
}

/** The refused command as a flagged entry when it carried a forbidden shape, or none. */
export function flagRefusal(
  refusal: Refusal,
  line: number,
  turnId: string,
): FlaggedCommand | undefined {
  if (refusal.commandLine.length === 0) {
    return undefined;
  }
  return flagSegments(commandsOfText(refusal.commandLine), {
    kind: 'refused',
    line,
    turnId,
  });
}
