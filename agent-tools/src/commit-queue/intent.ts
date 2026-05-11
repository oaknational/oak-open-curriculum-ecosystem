import { randomUUID } from 'node:crypto';

import { nowIso, requireOption } from './args.js';
import { normalizeRepoPath } from './path-list.js';
import { type CommitIntent, type CommitQueueCliOptions } from './types.js';

const DEFAULT_TTL_SECONDS = 900;

/**
 * Create a queued commit intent from validated CLI options.
 */
export function createIntent(options: CommitQueueCliOptions): CommitIntent {
  const now = nowIso(options);
  if (options.file.length === 0) {
    throw new Error('at least one --file entry is required');
  }

  return {
    intent_id: optionOrRandomId(options),
    claim_id: requireOption(options, 'claim-id'),
    agent_id: {
      agent_name: requireOption(options, 'agent-name'),
      platform: requireOption(options, 'platform'),
      model: requireOption(options, 'model'),
      session_id_prefix: requireOption(options, 'session-id-prefix'),
    },
    files: options.file.map(normalizeRepoPath),
    commit_subject: requireOption(options, 'commit-subject'),
    queued_at: now,
    updated_at: now,
    expires_at: expiresAtIso(now, Number(options['ttl-seconds'] ?? DEFAULT_TTL_SECONDS)),
    phase: 'queued',
  };
}

function optionOrRandomId(options: CommitQueueCliOptions): string {
  const intentId = options['intent-id'];
  return typeof intentId === 'string' ? intentId : randomUUID();
}

function expiresAtIso(startIso: string, ttlSeconds: number): string {
  return new Date(Date.parse(startIso) + ttlSeconds * 1000).toISOString();
}
