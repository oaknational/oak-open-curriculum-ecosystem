import { err, ok, type Result } from '@oaknational/result';

import { parseThreadId } from '../../core/codex-thread-id.js';
import { hasTruncationMarker, isRecord, type JsonRecord } from './record-shapes.js';
import { activeTurnWithContext, type ReaderState, type TurnState } from './reader-state.js';
import { readContext, readThreadSettings } from './context-reader.js';
import {
  invalidRecord,
  invalidTurnOrder,
  unknownRecord,
  type RolloutReadError,
} from './rollout-types.js';
import { readResponse } from './response-reader.js';

function matchesThreadId(payload: JsonRecord, state: ReaderState): boolean {
  return typeof payload['thread_id'] === 'string' && payload['thread_id'] === state.threadId;
}

function readSession(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  if (typeof payload['id'] !== 'string' || payload['id'].length === 0) {
    return invalidRecord(line, 'session_meta.id is missing');
  }
  const threadId = parseThreadId(payload['id']);
  if (!threadId.ok) {
    return invalidRecord(line, 'session_meta.id is not a thread UUID');
  }
  state.sessionCount += 1;
  state.threadId = threadId.value;
  return ok(undefined);
}

function readItemCompleted(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const item = payload['item'];
  if (!isRecord(item) || typeof item['type'] !== 'string') {
    return invalidRecord(line, 'item_completed.item.type is missing');
  }
  if (item['type'] === 'CommandExecution') {
    return readCommandExecution(payload, item, state, line);
  }
  return ['UserMessage', 'AgentMessage', 'Reasoning'].includes(item['type'])
    ? ok(undefined)
    : unknownRecord(line, `event_msg.item_completed.${item['type']}`);
}

function readCommandExecution(
  payload: JsonRecord,
  item: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const output = item['aggregated_output'];
  if (typeof output !== 'string' || typeof payload['turn_id'] !== 'string') {
    return invalidRecord(line, 'CommandExecution output or turn id is missing');
  }
  if (hasTruncationMarker(output)) {
    return err({ kind: 'truncated-output', line });
  }
  if (!matchesThreadId(payload, state)) {
    return err({ kind: 'command-thread-id-mismatch', line });
  }
  if (activeTurnWithContext(state)?.turnId !== payload['turn_id']) {
    return invalidTurnOrder(line, 'CommandExecution has no matching active context');
  }
  if (state.turns.length === 2) {
    state.commandOutputs.push(output);
  }
  return ok(undefined);
}

function startTurn(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const turnId = payload['turn_id'];
  if (typeof turnId !== 'string' || turnId.length === 0) {
    return invalidRecord(line, 'task_started.turn_id is missing');
  }
  if (state.active !== undefined && !state.active.complete) {
    return invalidTurnOrder(line, 'a turn is already active');
  }
  if (state.turns.some((turn) => turn.turnId === turnId)) {
    return invalidTurnOrder(line, 'task_started repeats a turn id');
  }
  const turn: TurnState = { turnId, complete: false, pendingCallIds: new Set() };
  state.turns.push(turn);
  state.active = turn;
  return ok(undefined);
}

function completeTurn(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  if (typeof payload['turn_id'] !== 'string') {
    return invalidRecord(line, 'task_complete.turn_id is missing');
  }
  const active = activeTurnWithContext(state);
  if (active?.turnId !== payload['turn_id']) {
    return invalidTurnOrder(line, 'task_complete has no matching active context');
  }
  if (active.pendingCallIds.size > 0) {
    return invalidTurnOrder(line, 'task_complete has unanswered custom tool calls');
  }
  active.complete = true;
  return ok(undefined);
}

function readEvent(
  payload: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const type = payload['type'];
  if (typeof type !== 'string') {
    return invalidRecord(line, 'event_msg.type is missing');
  }
  if (type === 'task_started') {
    return startTurn(payload, state, line);
  }
  if (type === 'task_complete') {
    return completeTurn(payload, state, line);
  }
  if (type === 'item_completed') {
    return readItemCompleted(payload, state, line);
  }
  if (type === 'thread_settings_applied') {
    return readThreadSettings(payload, state, line);
  }
  if (type === 'token_count') {
    return ok(undefined);
  }
  return unknownRecord(line, `event_msg.${type}`);
}

type RecordHandler = (
  payload: JsonRecord,
  state: ReaderState,
  line: number,
) => Result<void, RolloutReadError>;

const RECORD_HANDLERS: ReadonlyMap<string, RecordHandler> = new Map([
  ['session_meta', readSession],
  ['turn_context', readContext],
  ['event_msg', readEvent],
  ['response_item', readResponse],
]);

function isUnknownRecordType(type: string, handler: RecordHandler | undefined): boolean {
  return handler === undefined && type !== 'world_state' && type !== 'token_usage_record';
}

/** Fold one validated JSON object into the private two-turn reader state. */
export function readRecord(
  record: JsonRecord,
  state: ReaderState,
  line: number,
): Result<void, RolloutReadError> {
  const type = record['type'];
  if (typeof type !== 'string') {
    return invalidRecord(line, 'record.type is missing');
  }
  if (state.threadId === undefined && type !== 'session_meta') {
    return invalidTurnOrder(line, 'record precedes session_meta');
  }
  const handler = RECORD_HANDLERS.get(type);
  if (isUnknownRecordType(type, handler)) {
    return unknownRecord(line, type);
  }
  const payload = record['payload'];
  if (!isRecord(payload)) {
    return invalidRecord(line, `${type}.payload is missing`);
  }
  if (handler !== undefined) {
    return handler(payload, state, line);
  }
  return ok(undefined);
}
