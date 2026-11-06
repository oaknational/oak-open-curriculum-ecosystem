import { randomUUID } from 'node:crypto';

import { z } from 'zod';

import { commitQueueEntryExpiresAt } from '../collaboration-state/commit-queue-store.js';
import { collaborationAgentIdWriteSchema } from '../collaboration-state/types.js';

import { nowIso, requireOption } from './args.js';
import { normalizeRepoPath } from './path-list.js';
import { type CommitIntentDraft, type CommitQueueCliOptions } from './types.js';

/**
 * Create a queued commit intent from validated CLI options.
 *
 * A DRAFT, not a finished entry: the queue's order key (`queued_seq`) is
 * derived from the live queue and can only be assigned under the claims-file
 * transaction lock, which this boundary does not hold. `enqueueCommitIntent`
 * completes the draft inside the transform.
 *
 * The agent_id block is parsed through `collaborationAgentIdWriteSchema`
 * (Cycle 5 — Commandment 12 fix). This guarantees every commit-queue entry
 * carries the four legacy identity fields AND a UUID v5 `id` from the
 * caller's stable session seed. The caller supplies the derived id via
 * `--id`; createIntent does not re-derive (PDR-076a single-derivation-site
 * invariant — v5 derivation lives in `collaboration-state/identity.ts`).
 */
export function createIntent(options: CommitQueueCliOptions): CommitIntentDraft {
  const now = nowIso(options);
  if (options.file.length === 0) {
    throw new Error('at least one --file entry is required');
  }

  const agentId = collaborationAgentIdWriteSchema.parse({
    agent_name: requireOption(options, 'agent-name'),
    platform: requireOption(options, 'platform'),
    model: requireOption(options, 'model'),
    session_id_prefix: requireOption(options, 'session-id-prefix'),
    id: requireOption(options, 'id'),
  });

  return {
    intent_id: optionOrRandomId(options),
    claim_id: requireOption(options, 'claim-id'),
    agent_id: agentId,
    files: options.file.map(normalizeRepoPath),
    commit_subject: requireOption(options, 'commit-subject'),
    queued_at: now,
    updated_at: now,
    // The fixed 1-hour TTL from the last write (owner ruling QUEUE-LOCAL);
    // the store re-derives this on every rewrite.
    expires_at: commitQueueEntryExpiresAt(now),
    phase: 'queued',
  };
}

// The intent_id becomes the per-intent store FILENAME, so a caller-supplied
// value validates at this boundary (strict-validation-at-boundary): the
// store-write validator's uuid format check also refuses, but only by step
// order — an invalid id must never reach path construction at all.
const intentIdSchema = z.uuid();

function optionOrRandomId(options: CommitQueueCliOptions): string {
  const intentId = options['intent-id'];
  // randomUUID emits lowercase, so the generated arm is canonical already.
  return typeof intentId === 'string'
    ? requireLowercaseIntentId(intentIdSchema.parse(intentId))
    : randomUUID();
}

/**
 * Refuse a non-lowercase intent id. Uppercase hex is a valid UUID, so
 * nothing upstream catches it, and `<ID>.json` and `<id>.json` are ONE file
 * on a case-insensitive filesystem: two live intents would alias, and every
 * subsequent read of the store would fail its filename/id equality check.
 *
 * Refusing rather than canonicalising is deliberate. Every downstream
 * command (`phase`, `complete`, `show`) matches the id the caller holds
 * EXACTLY, so silently lowercasing here would hand back an id addressing
 * nothing and surface much later as an unrelated `unknown intent_id`. The
 * error names the canonical form so the caller can simply retry with it.
 */
function requireLowercaseIntentId(intentId: string): string {
  const canonical = intentId.toLowerCase();
  if (intentId !== canonical) {
    throw new Error(
      `--intent-id must be lowercase (it becomes the store filename, and every ` +
        `later lookup matches it exactly): use ${canonical}`,
    );
  }

  return intentId;
}
