import { err, ok, type Result } from '@oaknational/result';

import { parseThreadId, type ThreadId } from '../core/codex-thread-id.js';
import { readTurnEvents } from './turn-events.js';
import type { CodexRun } from './turn-verdict.js';

declare const dialogueIdBrand: unique symbol;

/**
 * A dialogue's own id, known to be a lowercase slug of 1 to 64 characters.
 *
 * It names the dialogue in the cleanup map; it never reaches Codex's argv.
 * The slug admits no path separator, whitespace or option syntax.
 */
export type DialogueId = string & { readonly [dialogueIdBrand]: true };

const DIALOGUE_ID_MAX_LENGTH = 64;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isDialogueId(value: string): value is DialogueId {
  return value.length <= DIALOGUE_ID_MAX_LENGTH && SLUG_PATTERN.test(value);
}

/**
 * Accept a dialogue id only when it is a lowercase slug of 1 to 64
 * characters: lowercase letters and digits, in groups joined by single
 * hyphens.
 */
export function parseDialogueId(raw: string): Result<DialogueId, string> {
  return isDialogueId(raw)
    ? ok(raw)
    : err('a dialogue id must be a lowercase slug of 1 to 64 characters');
}

/**
 * The threads a run's output names: each distinct id a `thread.started` event
 * names that parses as a thread id, in the order they started, whatever the
 * turn's verdict. A killed run's partial output counts. A run that never
 * launched names none. A thread whose event never reached the output, or
 * whose id does not parse, is not among them.
 *
 * Read this only for an opening turn. In codex-cli 0.156.1 a resume by thread
 * id never creates a thread: the CLI passes the id through as given, and the
 * app server refuses a resume whose stored thread it cannot find.
 */
export function threadsCreated(run: CodexRun): readonly ThreadId[] {
  if (run.kind === 'unlaunchable') {
    return [];
  }
  const threadIds = readTurnEvents(run.stdout.split('\n')).threadIds.flatMap((raw) => {
    const parsed = parseThreadId(raw);
    return parsed.ok ? [parsed.value] : [];
  });
  return [...new Set(threadIds)];
}

/**
 * One line of the dialogues' cleanup map: a thread an opening turn started,
 * the dialogue it belongs to, and when the turn started, as an ISO 8601 UTC
 * instant read before Codex was spawned, so the thread was created at or
 * after it. The map is the owner's record of which threads to delete.
 */
export interface CleanupRow {
  readonly dialogue_id: DialogueId;
  readonly thread_id: ThreadId;
  readonly created_at: string;
}

/**
 * What appending one thread's row did.
 */
export interface RowOutcome {
  readonly threadId: ThreadId;
  readonly appended: Result<void, string>;
}

/**
 * The threads whose cleanup rows could not be written.
 */
export interface UnwrittenRows {
  /** Only the threads whose rows were refused, in order. */
  readonly threadIds: readonly [ThreadId, ...ThreadId[]];
  /** Why the first refused row was refused. */
  readonly reason: string;
}

/**
 * Find the rows that were not written among one turn's append outcomes.
 */
export function unwrittenRows(outcomes: readonly RowOutcome[]): Result<void, UnwrittenRows> {
  const refused = outcomes.flatMap(({ threadId, appended }) =>
    appended.ok ? [] : [{ threadId, reason: appended.error }],
  );
  const [first, ...rest] = refused;
  if (first === undefined) {
    return ok(undefined);
  }
  return err({
    threadIds: [first.threadId, ...rest.map((row) => row.threadId)],
    reason: first.reason,
  });
}

/**
 * Append one row per thread to the cleanup map, trying every row even after
 * one is refused.
 *
 * @param dialogueId - The dialogue the threads belong to.
 * @param threadIds - The threads the turn's output names.
 * @param createdAt - When the turn started, as an ISO 8601 UTC instant.
 * @param appendCleanupRow - Appends one row to the cleanup map, or says why not.
 */
export function appendCleanupRows(
  dialogueId: DialogueId,
  threadIds: readonly ThreadId[],
  createdAt: string,
  appendCleanupRow: (row: CleanupRow) => Result<void, string>,
): Result<void, UnwrittenRows> {
  return unwrittenRows(
    threadIds.map((threadId) => ({
      threadId,
      appended: appendCleanupRow({
        dialogue_id: dialogueId,
        thread_id: threadId,
        created_at: createdAt,
      }),
    })),
  );
}
