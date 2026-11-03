import { err, ok, type Result } from '@oaknational/result';

import { parseThreadId, type ThreadId } from '../core/codex-thread-id.js';
import { readTurnEvents } from './turn-events.js';
import type { CommandExecution, TurnEvents } from './types.js';

/**
 * Why a run was killed before it exited by itself.
 */
type KillReason = 'timeout' | 'signal' | 'overflow';

/**
 * What one `codex` process did, as plain data: the runner maps the process
 * result into this shape, so the verdict never touches a process handle.
 *
 * A killed run keeps the partial output the process wrote before it was
 * killed, because a thread it started still needs its cleanup row. An
 * unlaunchable run means no process started, so it has no output at all.
 */
export type CodexRun =
  | {
      readonly kind: 'exited';
      readonly code: number;
      readonly stdout: string;
      readonly stderr: string;
    }
  | {
      readonly kind: 'killed';
      readonly reason: KillReason;
      readonly stdout: string;
      readonly stderr: string;
    }
  | { readonly kind: 'unlaunchable'; readonly message: string };

/**
 * A turn that completed on the expected thread with a reply.
 */
export interface TurnOutcome {
  readonly threadId: ThreadId;
  /** The last agent message: the reply. */
  readonly message: string;
  /** Every agent message of the turn, in order, for the record. */
  readonly messages: readonly string[];
  readonly commandExecutions: readonly CommandExecution[];
}

/**
 * Why a turn did not count. Each reason is distinct so the CLI can report it
 * and the probe can judge it.
 */
export type TurnFailure =
  | { readonly kind: 'unlaunchable'; readonly message: string }
  | { readonly kind: 'killed'; readonly reason: KillReason; readonly stderrTail: string }
  | { readonly kind: 'nonzero-exit'; readonly code: number; readonly stderrTail: string }
  | { readonly kind: 'turn-failed'; readonly code: number; readonly messages: readonly string[] }
  | { readonly kind: 'unrecognised-output'; readonly lines: number }
  | { readonly kind: 'unexpected-item'; readonly itemTypes: readonly string[] }
  | {
      readonly kind: 'malformed-turn';
      readonly turnStarts: number;
      readonly turnCompletions: number;
      readonly endsWithCompletion: boolean;
    }
  | { readonly kind: 'no-thread-id' }
  | { readonly kind: 'multiple-thread-ids'; readonly count: number }
  | { readonly kind: 'invalid-thread-id' }
  | { readonly kind: 'thread-mismatch'; readonly expected: ThreadId; readonly actual: ThreadId }
  | { readonly kind: 'no-agent-message' };

/**
 * A turn that counts, or the one reason it does not.
 */
export type TurnVerdict = Result<TurnOutcome, TurnFailure>;

const STDERR_TAIL_LENGTH = 500;

/**
 * Judge one run of `codex exec` or `codex exec resume`.
 *
 * A failed turn's own reason, from its event stream, is reported ahead of a
 * bare non-zero exit code, because under `--json` the stderr carries almost
 * nothing. Otherwise the stream must be exactly one turn, of recognised
 * events only, completed last, with no item the envelope should make
 * impossible.
 *
 * @param run - What the process did.
 * @param requested - The thread a resumed turn must continue; undefined when opening.
 */
export function judgeTurn(run: CodexRun, requested: ThreadId | undefined): TurnVerdict {
  if (run.kind === 'unlaunchable') {
    return err({ kind: 'unlaunchable', message: run.message });
  }
  if (run.kind === 'killed') {
    return err({ kind: 'killed', reason: run.reason, stderrTail: tail(run.stderr) });
  }
  const events = readTurnEvents(run.stdout.split('\n'));
  if (events.failures.length > 0) {
    return err({ kind: 'turn-failed', code: run.code, messages: events.failures });
  }
  if (run.code !== 0) {
    return err({ kind: 'nonzero-exit', code: run.code, stderrTail: tail(run.stderr) });
  }
  return judgeEvents(events, requested);
}

function judgeEvents(events: TurnEvents, requested: ThreadId | undefined): TurnVerdict {
  const shape = judgeShape(events);
  if (!shape.ok) {
    return shape;
  }
  const thread = judgeThread(events.threadIds, requested);
  if (!thread.ok) {
    return thread;
  }
  const message = events.agentMessages.at(-1);
  if (!message?.trim()) {
    return err({ kind: 'no-agent-message' });
  }
  return ok({
    threadId: thread.value,
    message,
    messages: events.agentMessages,
    commandExecutions: events.commandExecutions,
  });
}

/**
 * The stream holds only recognised events and no unexpected item, and is
 * exactly one turn, completed last.
 */
function judgeShape(events: TurnEvents): Result<void, TurnFailure> {
  if (events.unrecognisedLines > 0) {
    return err({ kind: 'unrecognised-output', lines: events.unrecognisedLines });
  }
  if (events.unexpectedItems.length > 0) {
    return err({ kind: 'unexpected-item', itemTypes: events.unexpectedItems });
  }
  const { turnStarts, turnCompletions, endsWithCompletion } = events;
  if (turnStarts !== 1 || turnCompletions !== 1 || !endsWithCompletion) {
    return err({ kind: 'malformed-turn', turnStarts, turnCompletions, endsWithCompletion });
  }
  return ok(undefined);
}

/**
 * A turn starts exactly one thread, whose id is a UUID; a resumed turn
 * starts the requested one.
 */
function judgeThread(
  threadIds: readonly string[],
  requested: ThreadId | undefined,
): Result<ThreadId, TurnFailure> {
  const only = threadIds.at(0);
  if (only === undefined) {
    return err({ kind: 'no-thread-id' });
  }
  if (threadIds.length > 1) {
    return err({ kind: 'multiple-thread-ids', count: threadIds.length });
  }
  const parsed = parseThreadId(only);
  if (!parsed.ok) {
    return err({ kind: 'invalid-thread-id' });
  }
  if (requested !== undefined && parsed.value !== requested) {
    return err({ kind: 'thread-mismatch', expected: requested, actual: parsed.value });
  }
  return ok(parsed.value);
}

function tail(text: string): string {
  return text.slice(-STDERR_TAIL_LENGTH);
}
