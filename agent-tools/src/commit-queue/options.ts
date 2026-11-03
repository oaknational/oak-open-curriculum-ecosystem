import { type CommitQueueCliOptions } from './types.js';

/**
 * The per-command option allowlist.
 *
 * `--now` is a READ-command view clock and this table is what keeps it one:
 * it appears only on `guard`, `status`, `list`, and `show`. The write
 * commands take their clock from the CLI's own wall-clock default, so a
 * caller cannot date a store write. `registry.ts` closes the same leak
 * structurally on the read path (the legacy migration takes the wall clock
 * inline), and these two are the whole defence — adding `now` to a write
 * command's set reopens it.
 */
const ALLOWED_OPTIONS: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  [
    'enqueue',
    new Set([
      'claim-id',
      'agent-name',
      'platform',
      'model',
      'session-id-prefix',
      'id',
      'commit-subject',
      'file',
      'intent-id',
      'registry',
    ]),
  ],
  ['phase', new Set(['intent-id', 'phase', 'notes', 'registry'])],
  [
    'guard',
    new Set([
      'agent-name',
      'platform',
      'model',
      'session-id-prefix',
      'id',
      'file',
      'now',
      'registry',
    ]),
  ],
  ['record-staged', new Set(['intent-id', 'registry'])],
  ['verify-staged', new Set(['intent-id', 'commit-subject', 'registry'])],
  ['complete', new Set(['intent-id', 'registry'])],
  ['commit', new Set(['intent-id', 'message-file', 'registry'])],
  ['status', new Set(['now', 'registry'])],
  ['list', new Set(['now', 'registry', 'prefix', 'phase', 'agent-name', 'queue-status'])],
  ['show', new Set(['now', 'registry', 'intent-id'])],
]);

export function validateCommandOptions(
  command: string | undefined,
  options: CommitQueueCliOptions,
): void {
  const allowed = allowedOptions(command);
  if (allowed === undefined) {
    return;
  }
  if (options.file.length > 0 && !allowed.has('file')) {
    throw new Error(`unknown option for commit-queue ${command}: --file`);
  }
  for (const key in options) {
    if (key !== 'file' && !allowed.has(key)) {
      throw new Error(`unknown option for commit-queue ${command}: --${key}`);
    }
  }
}

function allowedOptions(command: string | undefined): ReadonlySet<string> | undefined {
  return command === undefined ? undefined : ALLOWED_OPTIONS.get(command);
}
