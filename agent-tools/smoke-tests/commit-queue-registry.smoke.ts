import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { validateCollaborationJsonFileText } from '../src/collaboration-state/collaboration-json-validation';
import { readRegistry, updateRegistry } from '../src/commit-queue/registry';

/**
 * PDR-076a registry round-trip smoke — the identity boundary over the REAL
 * transaction.
 *
 * Proves against real files what unit tests structurally cannot see: the
 * parse → transform → write-back cycle preserves a legacy id-less claim row
 * unchanged (parse-time narrowing of claims would be destructive to other
 * agents' ownership rows), rejects an id-less intent row loudly naming the
 * intent, and round-trips a valid intent identity intact. Real filesystem
 * IO makes this a smoke; `test:e2e` gates it.
 */

const LEGACY_CLAIM = {
  claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  agent_id: {
    agent_name: 'Vintage Pre-Sunset Seat',
    platform: 'codex',
    model: 'gpt-4.9',
    session_id_prefix: '00aa11',
  },
  thread: 'legacy-thread',
  areas: [{ kind: 'files', patterns: ['notes/**'] }],
  claimed_at: '2026-04-27T07:00:00Z',
  intent: 'Pre-sunset legacy row exercising the write-back preservation contract.',
};

const VALID_INTENT_AGENT_ID = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
};

interface RawAgentIdRow {
  readonly agent_name: string;
  readonly platform: string;
  readonly model: string;
  readonly session_id_prefix: string;
  readonly id?: string;
}

interface RawIntentRow {
  readonly intent_id: string;
  readonly claim_id: string;
  readonly agent_id: RawAgentIdRow;
  readonly files: readonly string[];
  readonly commit_subject: string;
  readonly queued_at: string;
  readonly updated_at: string;
  readonly expires_at: string;
  readonly phase: string;
}

function validIntentRow(): RawIntentRow {
  return {
    intent_id: '33333333-3333-4333-8333-333333333333',
    claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    agent_id: VALID_INTENT_AGENT_ID,
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: 'feat(queue): exercise the registry round trip',
    queued_at: '2026-04-27T07:20:00Z',
    updated_at: '2026-04-27T07:20:00Z',
    expires_at: '2026-04-27T07:35:00Z',
    phase: 'queued',
  };
}

function fileRegistry(commitQueue: readonly unknown[]): string {
  return JSON.stringify(
    { schema_version: '1.3.0', commit_queue: commitQueue, claims: [LEGACY_CLAIM] },
    null,
    2,
  );
}

async function withTempRegistry(
  content: string,
  run: (registryPath: string) => Promise<void>,
): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'commit-queue-registry-'));
  try {
    const registryPath = join(dir, 'active-claims.json');
    await writeFile(registryPath, content, 'utf8');
    await run(registryPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function provePreservesLegacyIdlessClaimThroughWrite(): Promise<void> {
  await withTempRegistry(fileRegistry([validIntentRow()]), async (registryPath) => {
    await updateRegistry(registryPath, (current) => current);
    const after = await readRegistry(registryPath);
    assert.deepEqual(after.claims, [LEGACY_CLAIM]);
  });
}

async function proveIdlessIntentFailsLoudlyNamingTheIntent(): Promise<void> {
  const idlessIntent = { ...validIntentRow(), agent_id: LEGACY_CLAIM.agent_id };
  await withTempRegistry(fileRegistry([idlessIntent]), async (registryPath) => {
    await assert.rejects(
      readRegistry(registryPath),
      /commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
    );
  });
}

async function proveValidIntentRoundTripsWithRoutingId(): Promise<void> {
  await withTempRegistry(fileRegistry([validIntentRow()]), async (registryPath) => {
    const parsed = await readRegistry(registryPath);
    assert.equal(parsed.commit_queue.length, 1);
    assert.deepEqual(parsed.commit_queue[0].agent_id, VALID_INTENT_AGENT_ID);
  });
}

async function proveSchemaRejectsIdlessIntentRow(): Promise<void> {
  const idlessIntent = { ...validIntentRow(), agent_id: LEGACY_CLAIM.agent_id };
  await assert.rejects(
    validateCollaborationJsonFileText('active-claims.json', fileRegistry([idlessIntent])),
    /agent_id|required/,
  );
}

async function proveSchemaAcceptsIdlessClaimRow(): Promise<void> {
  await validateCollaborationJsonFileText('active-claims.json', fileRegistry([validIntentRow()]));
}

await provePreservesLegacyIdlessClaimThroughWrite();
await proveIdlessIntentFailsLoudlyNamingTheIntent();
await proveValidIntentRoundTripsWithRoutingId();
await proveSchemaRejectsIdlessIntentRow();
await proveSchemaAcceptsIdlessClaimRow();
process.stdout.write('commit-queue registry smoke: 5/5 proofs passed\n');
