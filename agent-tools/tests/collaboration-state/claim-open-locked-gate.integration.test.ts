import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { uuidV5Schema } from '../../src/collaboration-state/agent-id';
import { runLockedClaimOpen } from '../../src/collaboration-state/cli-claim-open-gate';
import { commitQueueDirForActivePath } from '../../src/collaboration-state/commit-queue-store';
import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../../src/collaboration-state/types';
import {
  ensureDirectory,
  makeTempDirectory,
  readText,
  removeDirectory,
  writeText,
} from '../test-helpers/temp-collaboration-state';

const NOW = '2026-08-18T13:00:00.000Z';

const SELF = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: uuidV5Schema.parse('e2e793c7-923e-5baa-97f0-2bedfb9b6b50'),
};

const PEER = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
  id: uuidV5Schema.parse('88bb5b62-3508-5f5c-9e6d-207577b6c4d9'),
};

const OPENED_CLAIM = {
  claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  agent_id: SELF,
  thread: 'queue-ephemera',
  areas: [{ kind: 'files' as const, patterns: ['agent-tools/**'] }],
  claimed_at: NOW,
  intent: 'Locked-gate fixture claim.',
};

// A live queue-only peer entry, as the locked store read returns it.
const PEER_QUEUE_ENTRY = {
  intent_id: '33333333-3333-4333-8333-333333333333',
  claim_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  agent_id: PEER,
  files: ['packages/core/result/src/index.ts'],
  commit_subject: 'feat(core): peer entry',
  queued_at: NOW,
  updated_at: NOW,
  expires_at: '2026-08-18T14:00:00.000Z',
  phase: 'queued' as const,
  queued_seq: 0,
};

describe('runLockedClaimOpen — the gates decide on what the locked window reads', () => {
  let root: string;
  let activePath: string;
  let seededText: string;

  beforeEach(async () => {
    root = await makeTempDirectory('oak-claim-open-locked-gate-');
    activePath = join(root, 'active-claims.json');
    seededText = `${JSON.stringify(
      { schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION, claims: [] },
      null,
      2,
    )}\n`;
    await writeText(activePath, seededText);
  });

  afterEach(async () => {
    await removeDirectory(root);
  });

  it('refuses a blind open when the locked read returns a queue-only peer', async () => {
    // The peer's entry exists only at the locked read — the caller resolved
    // its inputs over a world with no peer, which is exactly the window the
    // pre-lock snapshot used to leave open.
    await expect(
      runLockedClaimOpen({
        activePath,
        openedClaim: OPENED_CLAIM,
        nowIso: NOW,
        identity: SELF,
        watcherVerdict: { kind: 'blind', reason: 'no watcher heartbeat found' },
        readQueueEntries: () => Promise.resolve([PEER_QUEUE_ENTRY]),
      }),
    ).rejects.toThrow('refusing to open a claim while blind to comms');

    expect(await readText(activePath)).toBe(seededText);
  });

  it('admits a blind open when the locked read shows no other live agent', async () => {
    await runLockedClaimOpen({
      activePath,
      openedClaim: OPENED_CLAIM,
      nowIso: NOW,
      identity: SELF,
      watcherVerdict: { kind: 'blind', reason: 'no watcher heartbeat found' },
      readQueueEntries: () => Promise.resolve([]),
    });

    const written: unknown = JSON.parse(await readText(activePath));
    expect(written).toStrictEqual({
      schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
      claims: [OPENED_CLAIM],
    });
  });

  it('reads the live store when no seam is injected, refusing on a real peer entry', async () => {
    // Same state expressed through the real store: the peer's intent file on
    // disk beside the claims file (the default read path), no seam.
    const queueDir = commitQueueDirForActivePath(activePath);
    await ensureDirectory(queueDir);
    await writeText(
      join(queueDir, `${PEER_QUEUE_ENTRY.intent_id}.json`),
      `${JSON.stringify(PEER_QUEUE_ENTRY, null, 2)}\n`,
    );

    await expect(
      runLockedClaimOpen({
        activePath,
        openedClaim: OPENED_CLAIM,
        nowIso: NOW,
        identity: SELF,
        watcherVerdict: { kind: 'blind', reason: 'no watcher heartbeat found' },
      }),
    ).rejects.toThrow('refusing to open a claim while blind to comms');

    expect(await readText(activePath)).toBe(seededText);
  });
});
