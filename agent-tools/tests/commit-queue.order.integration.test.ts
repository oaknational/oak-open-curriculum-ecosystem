/**
 * Queue ORDER through the real store. The flat registry expressed order as
 * array position; the per-intent store has no array, so order is carried by
 * an explicit `queued_seq` assigned under the claims-file transaction lock.
 * These proofs pin the two properties a timestamp cannot give: arrival
 * order survives a same-millisecond tie, and it survives a rewrite.
 */
import { join } from 'node:path';

import { unwrapOrThrow } from '@oaknational/result';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { uuidV5Schema } from '../src/collaboration-state/agent-id';
import { updateCommitIntentPhase } from '../src/commit-queue/core';
import { enqueueCommitIntent } from '../src/commit-queue/enqueue';
import { readRegistry, updateRegistry } from '../src/commit-queue/registry';
import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../src/collaboration-state/types';
import { type CommitIntentDraft } from '../src/commit-queue/types';
import {
  makeTempDirectory,
  removeDirectory,
  writeText,
} from './test-helpers/temp-collaboration-state';

const NOW = new Date(Date.now() - 60 * 1000).toISOString();

const AGENT_ID = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: uuidV5Schema.parse('e2e793c7-923e-5baa-97f0-2bedfb9b6b50'),
};

const CLAIM = {
  claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  agent_id: AGENT_ID,
  thread: 'queue-ephemera',
  areas: [{ kind: 'git', patterns: ['index/head'] }],
  claimed_at: NOW,
  intent: 'Queue-order fixture claim.',
};

// Enqueued FIRST but sorting LAST by intent_id: any fallback to a UUID tie-break
// inverts the pair, so the proofs below cannot pass by coincidence.
const FIRST_ID = '99999999-9999-4999-8999-999999999999';
const SECOND_ID = '22222222-2222-4222-8222-222222222222';

function draft(intentId: string): CommitIntentDraft {
  return {
    intent_id: intentId,
    claim_id: CLAIM.claim_id,
    agent_id: AGENT_ID,
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: `feat(queue): intent ${intentId.slice(0, 4)}`,
    // The SAME millisecond for both: the tie a wall-clock ordering cannot break.
    queued_at: NOW,
    updated_at: NOW,
    expires_at: new Date(Date.parse(NOW) + 3600 * 1000).toISOString(),
    phase: 'queued',
  };
}

describe('commit-queue order key', () => {
  let root: string;
  let activePath: string;

  beforeEach(async () => {
    root = await makeTempDirectory('oak-commit-queue-order-');
    activePath = join(root, 'active-claims.json');
    await writeText(
      activePath,
      `${JSON.stringify(
        { schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION, claims: [CLAIM] },
        null,
        2,
      )}\n`,
    );
  });

  afterEach(async () => {
    await removeDirectory(root);
  });

  async function enqueue(intentId: string): Promise<void> {
    await updateRegistry(
      activePath,
      (registry) => enqueueCommitIntent({ registry, draft: draft(intentId) }),
      NOW,
    );
  }

  async function queuedIds(): Promise<readonly string[]> {
    const registry = unwrapOrThrow(await readRegistry(activePath, { nowIso: NOW }));
    return registry.commit_queue.map((entry) => entry.intent_id);
  }

  it('orders two same-millisecond enqueues by arrival, not by intent_id', async () => {
    await enqueue(FIRST_ID);
    await enqueue(SECOND_ID);

    // Two agents enqueueing inside one millisecond is ordinary at machine
    // speed. Breaking that tie on intent_id hands the queue to whoever drew
    // the lower random UUID, which is not a queue.
    expect(await queuedIds()).toStrictEqual([FIRST_ID, SECOND_ID]);
  });

  it('assigns the order key densely from the live entries, never from a global counter', async () => {
    await enqueue(FIRST_ID);
    await enqueue(SECOND_ID);

    const registry = unwrapOrThrow(await readRegistry(activePath, { nowIso: NOW }));
    expect(registry.commit_queue.map((entry) => entry.queued_seq)).toStrictEqual([0, 1]);
  });

  it('preserves the order key across a phase rewrite', async () => {
    // Store entries reconstruct field-by-field on every rewrite, so a field
    // without a parser leg is dropped silently — and the queue would
    // re-order itself the moment anyone advanced a phase.
    await enqueue(FIRST_ID);
    await enqueue(SECOND_ID);

    await updateRegistry(
      activePath,
      (registry) =>
        updateCommitIntentPhase({
          registry,
          intentId: FIRST_ID,
          phase: 'staging',
          nowIso: NOW,
        }),
      NOW,
    );

    const registry = unwrapOrThrow(await readRegistry(activePath, { nowIso: NOW }));
    expect(registry.commit_queue.map((entry) => [entry.intent_id, entry.queued_seq])).toStrictEqual(
      [
        [FIRST_ID, 0],
        [SECOND_ID, 1],
      ],
    );
  });

  it('reuses a drained order key rather than growing a counter', async () => {
    // `queued_seq` is max-over-LIVE-entries + 1, so values are reused as the
    // queue drains. That is correct for RELATIVE order and is why the field
    // is never an identity: a second intent behind an empty queue is 0 again.
    await enqueue(FIRST_ID);
    await updateRegistry(
      activePath,
      (registry) => ({
        ...registry,
        commit_queue: registry.commit_queue.filter((entry) => entry.intent_id !== FIRST_ID),
      }),
      NOW,
    );
    await enqueue(SECOND_ID);

    const registry = unwrapOrThrow(await readRegistry(activePath, { nowIso: NOW }));
    expect(registry.commit_queue.map((entry) => entry.queued_seq)).toStrictEqual([0]);
  });
});
