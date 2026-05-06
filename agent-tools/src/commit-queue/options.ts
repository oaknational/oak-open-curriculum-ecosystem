import { type CommitQueueCliOptions } from './types.js';

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
  if (command === 'enqueue') {
    return new Set([
      'claim-id',
      'agent-name',
      'platform',
      'model',
      'session-id-prefix',
      'commit-subject',
      'file',
      'intent-id',
      'now',
      'ttl-seconds',
      'registry',
    ]);
  }
  if (command === 'phase') {
    return new Set(['intent-id', 'phase', 'notes', 'now', 'registry']);
  }
  if (command === 'record-staged') {
    return new Set(['intent-id', 'now', 'registry']);
  }
  if (command === 'verify-staged') {
    return new Set(['intent-id', 'commit-subject', 'now', 'registry']);
  }
  if (command === 'complete') {
    return new Set(['intent-id', 'now', 'registry']);
  }
  if (command === 'status') {
    return new Set(['now', 'registry']);
  }

  return undefined;
}
