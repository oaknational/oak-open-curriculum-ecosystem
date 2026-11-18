import { err, type Result } from '@oaknational/result';

import type { ThreadId } from '../../core/codex-thread-id.js';
import type { RecordedTurnContext } from './record-shapes.js';

/** Harness evidence needed by the probe's policy and output verdicts. */
export interface RolloutEvidence {
  readonly threadId: ThreadId;
  readonly turns: readonly [RecordedTurnContext, RecordedTurnContext];
  /**
   * The aggregated output of each command whose `CommandExecution` item the
   * resumed turn recorded, in completion order. Text the model's own
   * code-mode program printed is never evidence.
   */
  readonly resumedCommandOutputs: readonly string[];
}

/** Closed reasons a rollout cannot support a pass verdict. */
export type RolloutReadError =
  | { readonly kind: 'invalid-json'; readonly line: number }
  | { readonly kind: 'unknown-record-type'; readonly line: number; readonly recordType: string }
  | { readonly kind: 'invalid-record'; readonly line: number; readonly reason: string }
  | { readonly kind: 'truncated-output'; readonly line: number }
  | { readonly kind: 'invalid-turn-order'; readonly line: number; readonly reason: string }
  | { readonly kind: 'settings-thread-id-mismatch'; readonly line: number }
  | { readonly kind: 'command-thread-id-mismatch'; readonly line: number }
  | { readonly kind: 'applied-settings-mismatch'; readonly line: number }
  | { readonly kind: 'invalid-turn-count'; readonly count: number }
  | { readonly kind: 'invalid-session-count'; readonly count: number };

/** Reject a recognised record whose required content is malformed. */
export function invalidRecord(line: number, reason: string): Result<void, RolloutReadError> {
  return err({ kind: 'invalid-record', line, reason });
}

/** Reject a record that cannot occur at this point in a two-turn rollout. */
export function invalidTurnOrder(line: number, reason: string): Result<void, RolloutReadError> {
  return err({ kind: 'invalid-turn-order', line, reason });
}

/** Reject a record type outside the observed, closed reader vocabulary. */
export function unknownRecord(line: number, recordType: string): Result<void, RolloutReadError> {
  return err({ kind: 'unknown-record-type', line, recordType });
}
