import { err, ok, type Result } from '@oaknational/result';

import { readRecord } from './record-reader.js';
import { isRecord, type RecordedTurnContext } from './record-shapes.js';
export type { RecordedTurnContext } from './record-shapes.js';
import type { ReaderState, TurnState } from './reader-state.js';
import type { RolloutEvidence, RolloutReadError } from './rollout-types.js';

export type { RolloutEvidence, RolloutReadError } from './rollout-types.js';

function readLine(text: string, state: ReaderState, line: number): Result<void, RolloutReadError> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return err({ kind: 'invalid-json', line });
  }
  if (!isRecord(parsed)) {
    return err({ kind: 'invalid-record', line, reason: 'record is not an object' });
  }
  return readRecord(parsed, state, line);
}

function isCompleteTurn(
  turn: TurnState | undefined,
): turn is TurnState & { readonly context: RecordedTurnContext } {
  return turn?.complete === true && turn.context !== undefined;
}

function finishRollout(
  state: ReaderState,
  line: number,
): Result<RolloutEvidence, RolloutReadError> {
  if (state.sessionCount !== 1 || state.threadId === undefined) {
    return err({ kind: 'invalid-session-count', count: state.sessionCount });
  }
  if (state.turns.length !== 2) {
    return err({ kind: 'invalid-turn-count', count: state.turns.length });
  }
  const first = state.turns[0];
  const second = state.turns[1];
  if (!isCompleteTurn(first) || !isCompleteTurn(second)) {
    return err({ kind: 'invalid-turn-order', line, reason: 'a turn is incomplete' });
  }
  return ok({
    threadId: state.threadId,
    turns: [first.context, second.context],
    resumedCommandOutputs: state.commandOutputs,
  });
}

/**
 * Read a whole two-turn thread rollout supplied as JSONL lines. The IO edge
 * owns file access; this reader fails closed when Codex changes a record
 * shape. It validates the shapes the harness writes and never parses text the
 * model's own program printed.
 */
export function readRollout(lines: readonly string[]): Result<RolloutEvidence, RolloutReadError> {
  const state: ReaderState = {
    sessionCount: 0,
    turns: [],
    commandOutputs: [],
    resumedSettings: [],
  };
  for (const [index, line] of lines.entries()) {
    if (line.trim().length === 0) {
      continue;
    }
    const read = readLine(line, state, index + 1);
    if (!read.ok) {
      return err(read.error);
    }
  }
  return finishRollout(state, lines.length);
}
