import { ok, type Result } from '@oaknational/result';

import { checkCodeModeOutput } from './code-mode-output.js';
import type { JsonRecord } from './record-shapes.js';
import { activeTurnWithContext, type ReaderState } from './reader-state.js';
import {
  invalidRecord,
  invalidTurnOrder,
  unknownRecord,
  type RolloutReadError,
} from './rollout-types.js';

function readCustomToolOutput(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const callId = payload['call_id'];
  if (typeof callId !== 'string' || callId.length === 0) {
    return invalidRecord(line, 'custom_tool_call_output.call_id is missing');
  }
  const active = activeTurnWithContext(state);
  if (active === undefined) {
    return invalidTurnOrder(line, 'tool output has no active context');
  }
  if (!active.pendingCallIds.has(callId)) {
    return invalidTurnOrder(line, 'tool output has no matching custom tool call');
  }
  const wrapper = checkCodeModeOutput(payload['output']);
  if (!wrapper.ok) {
    return invalidRecord(line, wrapper.error);
  }
  active.pendingCallIds.delete(callId);
  return ok(undefined);
}

function readCustomToolCall(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const callId = payload['call_id'];
  if (
    typeof payload['input'] !== 'string' ||
    payload['name'] !== 'exec' ||
    payload['status'] !== 'completed' ||
    typeof callId !== 'string' ||
    callId.length === 0
  ) {
    return invalidRecord(line, 'custom_tool_call is not a completed exec call');
  }
  const active = activeTurnWithContext(state);
  if (active === undefined) {
    return invalidTurnOrder(line, 'custom tool call has no active context');
  }
  if (active.pendingCallIds.has(callId)) {
    return invalidTurnOrder(line, 'custom tool call repeats a pending call id');
  }
  active.pendingCallIds.add(callId);
  return ok(undefined);
}

/** Fold one response item while matching completed tool calls to their output. */
export function readResponse(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const type = payload['type'];
  if (typeof type !== 'string') {
    return invalidRecord(line, 'response_item.type is missing');
  }
  if (type === 'custom_tool_call_output') {
    return readCustomToolOutput(payload, state, line);
  }
  if (type === 'custom_tool_call') {
    return readCustomToolCall(payload, state, line);
  }
  if (['message', 'reasoning'].includes(type)) {
    return ok(undefined);
  }
  return unknownRecord(line, `response_item.${type}`);
}
