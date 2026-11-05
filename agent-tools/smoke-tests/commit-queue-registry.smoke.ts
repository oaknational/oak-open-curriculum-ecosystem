import assert from 'node:assert/strict';
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { unwrapOrThrow } from '@oaknational/result';
import { typeSafeEntries } from '@oaknational/type-helpers';

import { uuidV5Schema } from '../src/collaboration-state/agent-id';
import {
  commitQueueDirForActivePath,
  readCommitQueueEntries,
} from '../src/collaboration-state/commit-queue-store';
import { updateActiveClaimsFile } from '../src/collaboration-state/state-io';
import { enqueueCommitIntent } from '../src/commit-queue/enqueue';
import { readRegistry, updateRegistry } from '../src/commit-queue/registry';
import { type CommitIntentDraft } from '../src/commit-queue/types';
import {
  INTENT_ID,
  LEGACY_CLAIM,
  VALID_INTENT_AGENT_ID,
  claimsFileText,
  validIntentRow,
  withTempRegistry,
} from './commit-queue-registry-fixture';

/**
 * PDR-076a registry round-trip smoke — the identity boundary over BOTH real
 * transactions that read-modify-write the shared active-claims surface
 * (`commit-queue/registry.ts` updateRegistry; `state-io.ts`
 * updateActiveClaimsFile, the path behind every claim write), spanning the
 * 1.4.0 split: claims in the file, intents in the per-intent store. Proves
 * against real files what unit tests structurally cannot: legacy id-less
 * claim rows survive write-back unchanged, valid intent identities
 * round-trip through the store, an id-less intent file rejects loudly
 * with every surface proven byte-identical, the legacy migration judges
 * liveness on the wall clock whatever view clock a read carries, and an
 * enqueue whose store write dies leaves the claims file byte-unchanged.
 * Schema-gate and migration proofs live in commit-queue-store.smoke.ts.
 * Real filesystem IO (and a read-only directory the crash-window proof
 * needs, which only a host-coupled tier may assume) makes this a smoke;
 * `test:e2e` gates it.
 */

async function provePreservesLegacyIdlessClaimThroughWrite(): Promise<void> {
  await withTempRegistry([validIntentRow()], async ({ registryPath }) => {
    await updateRegistry(registryPath, (current) => current);
    const after = unwrapOrThrow(await readRegistry(registryPath));
    assert.deepEqual(after.claims, [LEGACY_CLAIM]);
  });
}

async function proveIdlessIntentFailsLoudlyNamingTheIntent(): Promise<void> {
  const idlessIntent = { ...validIntentRow(), agent_id: LEGACY_CLAIM.agent_id };
  await withTempRegistry([idlessIntent], async ({ registryPath }) => {
    // The store read crashes loudly (the comms-store convention: a corrupt
    // event file fails the whole read naming the file). Anchored on the
    // parser's own message: an identity-losing wrap would PREFIX it.
    await assert.rejects(
      readRegistry(registryPath),
      /commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
    );
  });
}

async function proveUpdateRegistryRefusesCorruptStoreByteIdentical(): Promise<void> {
  const idlessIntent = { ...validIntentRow(), agent_id: LEGACY_CLAIM.agent_id };
  await withTempRegistry([idlessIntent], async ({ registryPath, queueDir }) => {
    await assert.rejects(
      updateRegistry(registryPath, (registry) => registry),
      /commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
    );
    // The rejection fires in the pre-transaction read, before any write:
    // both surfaces must be byte-identical afterwards.
    assert.equal(await readFile(registryPath, 'utf8'), claimsFileText());
    assert.equal(
      await readFile(join(queueDir, `${INTENT_ID}.json`), 'utf8'),
      `${JSON.stringify(idlessIntent, null, 2)}\n`,
    );
  });
}

async function proveUpdateRegistryFreshCheckoutSurfacesSeedInstructions(): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'commit-queue-registry-'));
  try {
    // First write command on a fresh checkout: the pre-transaction read
    // surfaces the verify-then-seed instructions (mirrors state-io.ts
    // updateActiveClaimsFile) instead of the transaction's bare ENOENT.
    await assert.rejects(
      updateRegistry(join(dir, 'active-claims.json'), (registry) => registry),
      /^Error: active-claims registry not found/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function proveValidIntentRoundTripsWithRoutingId(): Promise<void> {
  await withTempRegistry([validIntentRow()], async ({ registryPath }) => {
    const parsed = unwrapOrThrow(await readRegistry(registryPath));
    assert.equal(parsed.commit_queue.length, 1);
    assert.deepEqual(parsed.commit_queue[0].agent_id, VALID_INTENT_AGENT_ID);
  });
}

async function proveActiveClaimsTransactionPreservesRowsInRawJson(): Promise<void> {
  await withTempRegistry([], async ({ registryPath }) => {
    await updateActiveClaimsFile({ activePath: registryPath, transform: (registry) => registry });
    const raw: unknown = JSON.parse(await readFile(registryPath, 'utf8'));
    // Whole-document raw comparison: any field the write-back reconstructs
    // away (legacy claim content above all) reddens this proof.
    assert.deepEqual(raw, JSON.parse(claimsFileText()));
  });
}

async function proveActiveClaimsTransactionRejectsForeignSchemaVersionLoudly(): Promise<void> {
  const foreign = claimsFileText().replace(
    '"schema_version": "1.4.0"',
    '"schema_version": "1.2.0"',
  );
  await withTempRegistry([], async ({ registryPath }) => {
    await writeFile(registryPath, foreign, 'utf8');
    // Pins the version-pin arm END-TO-END: only the 1.3.0 flat-queue shape
    // takes the migration path; every OTHER foreign version keeps the loud
    // rejection, and the file stays byte-identical.
    await assert.rejects(
      updateActiveClaimsFile({ activePath: registryPath, transform: (registry) => registry }),
      /^Error: active claims registry must use schema_version 1\.4\.0$/,
    );
    assert.equal(await readFile(registryPath, 'utf8'), foreign);
  });
}

async function proveLegacyMigrationJudgesLivenessOnTheWallClock(): Promise<void> {
  // `--now` is a READ-command view clock. Routing it into the one-time
  // migration would let a read-only invocation judge every live legacy row
  // expired and DELETE it — the destructive twin of a view. Live against the
  // real clock: the row's last write is one minute ago.
  const dir = await mkdtemp(join(tmpdir(), 'commit-queue-migration-clock-'));
  try {
    const activePath = join(dir, 'active-claims.json');
    const liveUpdatedAt = new Date(Date.now() - 60 * 1000).toISOString();
    // A 1.3.0 row carries no queued_seq (its array position is the order
    // key), and the migration refuses one that does.
    const legacyRow = {
      ...Object.fromEntries(
        typeSafeEntries(validIntentRow()).filter(([key]) => key !== 'queued_seq'),
      ),
      queued_at: liveUpdatedAt,
      updated_at: liveUpdatedAt,
    };
    await writeFile(
      activePath,
      `${JSON.stringify(
        { schema_version: '1.3.0', claims: [LEGACY_CLAIM], commit_queue: [legacyRow] },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await readRegistry(activePath, { nowIso: '2099-01-01T00:00:00.000Z' });

    const stored = await readCommitQueueEntries({
      queueDir: commitQueueDirForActivePath(activePath),
      nowIso: new Date().toISOString(),
    });
    assert.deepEqual(
      stored.map((entry) => entry.intent_id),
      [INTENT_ID],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function proveFailedStoreWriteLeavesClaimsFileByteUnchanged(): Promise<void> {
  await withTempRegistry([], async ({ registryPath, queueDir }) => {
    // A real but READ-ONLY store directory: every store READ succeeds (the
    // pre-transaction composed read must pass) and only the intent-file
    // WRITE fails, landing the failure inside the split-write window.
    await mkdir(queueDir, { recursive: true });
    await chmod(queueDir, 0o555);
    try {
      const draft: CommitIntentDraft = {
        intent_id: INTENT_ID,
        claim_id: LEGACY_CLAIM.claim_id,
        agent_id: {
          ...VALID_INTENT_AGENT_ID,
          id: uuidV5Schema.parse(VALID_INTENT_AGENT_ID.id),
        },
        files: ['agent-tools/src/commit-queue/index.ts'],
        commit_subject: 'feat(queue): crash-window fixture',
        queued_at: '2026-08-18T12:00:00.000Z',
        updated_at: '2026-08-18T12:00:00.000Z',
        expires_at: '2026-08-18T13:00:00.000Z',
        phase: 'queued',
      };
      await assert.rejects(
        updateRegistry(registryPath, (registry) => enqueueCommitIntent({ registry, draft })),
        /EACCES.*commit-queue/,
      );
      // No claims-file residue may reference the intent whose store file was
      // never created: the enqueue either lands whole or leaves no trace.
      assert.equal(await readFile(registryPath, 'utf8'), claimsFileText());
    } finally {
      await chmod(queueDir, 0o755);
    }
  });
}

await provePreservesLegacyIdlessClaimThroughWrite();
await proveIdlessIntentFailsLoudlyNamingTheIntent();
await proveUpdateRegistryRefusesCorruptStoreByteIdentical();
await proveUpdateRegistryFreshCheckoutSurfacesSeedInstructions();
await proveValidIntentRoundTripsWithRoutingId();
await proveActiveClaimsTransactionPreservesRowsInRawJson();
await proveActiveClaimsTransactionRejectsForeignSchemaVersionLoudly();
await proveLegacyMigrationJudgesLivenessOnTheWallClock();
await proveFailedStoreWriteLeavesClaimsFileByteUnchanged();
process.stdout.write('commit-queue registry smoke: 9/9 proofs passed\n');
