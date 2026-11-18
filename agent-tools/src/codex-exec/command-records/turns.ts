import type { JsonRecord } from '../rollout/record-shapes.js';

import { isExecuted } from './command-item.js';
import type { OutputCarrier } from './harness-text.js';
import type { CommandRecord, FlaggedCommand, Malformed, TurnAccount } from './summary.js';

/**
 * The turns of a seat's rollout while it is folded: a turn opens on
 * `task_started` and completes on `task_complete`. An exec request or output
 * that follows its turn's completion, which the harness never writes, is
 * malformed and still read, so a shape in it is still flagged and `--strict`
 * fails. A `CommandExecution` item names its own turn and may report a
 * process that ended after the turn did, so it is read as that turn's
 * evidence whenever it arrives.
 */

/** One turn while the stream is folded. */
export interface TurnState {
  readonly turnId: string;
  readonly commands: CommandRecord[];
  /** Exec requests awaiting their output: the tool each named, by call id. */
  readonly pending: Map<string, OutputCarrier>;
  calls: number;
  accounted: number;
  refused: number;
  unaccounted: number;
  complete: boolean;
}

/** Internal accumulation; only the summary crosses the module boundary. */
export interface ReaderState {
  readonly turns: TurnState[];
  readonly flagged: FlaggedCommand[];
  readonly recordTypes: Map<string, number>;
  readonly malformed: Malformed[];
  readonly invalidLines: number[];
}

/** A turn id as the summary may print it: word characters and dashes, bounded; anything else is untrusted text. */
const TURN_ID = /^[\w-]{1,64}$/u;

/** Open a turn on `task_started`; a repeated, missing or ill-formed id is malformed and opens nothing. */
export function startTurn(payload: JsonRecord, state: ReaderState, line: number): void {
  const turnId = payload.turn_id;
  if (typeof turnId !== 'string' || !TURN_ID.test(turnId)) {
    state.malformed.push({ line, reason: 'task_started has no well-formed turn id' });
    return;
  }
  if (state.turns.some((turn) => turn.turnId === turnId)) {
    state.malformed.push({ line, reason: 'task_started repeats a turn id' });
    return;
  }
  state.turns.push({
    turnId,
    commands: [],
    pending: new Map(),
    calls: 0,
    accounted: 0,
    refused: 0,
    unaccounted: 0,
    complete: false,
  });
}

/** Complete the open turn on `task_complete`; one naming no open turn is malformed. */
export function completeTurn(payload: JsonRecord, state: ReaderState, line: number): void {
  const turn = state.turns.at(-1);
  if (turn === undefined || turn.complete || payload.turn_id !== turn.turnId) {
    state.malformed.push({ line, reason: 'task_complete names no open turn' });
    return;
  }
  turn.complete = true;
}

/** Record an exec request or output that follows its turn's completion as malformed; it is still read. */
export function noteAfterCompletion(
  turn: TurnState,
  state: ReaderState,
  line: number,
  evidence: 'exec request' | 'exec output',
): void {
  if (turn.complete) {
    state.malformed.push({ line, reason: `${evidence} follows its turn completing` });
  }
}

/** A turn's counts once the rollout ends; a request still pending is unaccounted. */
export function accountOf(turn: TurnState): TurnAccount {
  return {
    turnId: turn.turnId,
    calls: turn.calls,
    accounted: turn.accounted,
    refused: turn.refused,
    unaccounted: turn.unaccounted + turn.pending.size,
    executed: turn.commands.filter(isExecuted).length,
    declined: turn.commands.filter((command) => command.status === 'declined').length,
  };
}
