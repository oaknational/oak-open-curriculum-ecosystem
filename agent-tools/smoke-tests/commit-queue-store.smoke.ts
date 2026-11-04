import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { unwrapOrThrow } from '@oaknational/result';

import { validateCollaborationJsonFileText } from '../src/collaboration-state/collaboration-json-validation';
import { COMMIT_QUEUE_TTL_SECONDS } from '../src/collaboration-state/commit-queue-store';
import { readRegistry } from '../src/commit-queue/registry';
import {
  INTENT_ID,
  LEGACY_CLAIM,
  claimsFileText,
  legacyIntentRow,
  validIntentRow,
} from './commit-queue-registry-fixture';

/**
 * Schema-gate, ignore-gate and legacy-migration smoke for the per-intent
 * commit-queue store (registry schema 1.4.0 split, owner ruling
 * QUEUE-LOCAL): the Ajv gates hold on both surfaces, the store directory is
 * untrackable by git, and a legacy flat-queue file migrates once on first
 * read — live entries to per-intent files, expired dropped, the claims file
 * rewritten new-shape with its claims text byte-identical. The
 * transaction-boundary proofs live in commit-queue-registry.smoke.ts. Real
 * filesystem IO and a spawned git make this a smoke; `test:e2e` gates it.
 */

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

async function proveSchemaRejectsIdlessIntentFile(): Promise<void> {
  const idlessIntent = { ...validIntentRow(), agent_id: LEGACY_CLAIM.agent_id };
  const result = await validateCollaborationJsonFileText(
    `commit-queue/${INTENT_ID}.json`,
    JSON.stringify(idlessIntent, null, 2),
  );
  if (result.ok) {
    assert.fail('expected schema validation to reject the id-less intent file');
  }
  assert.match(result.error.message, /agent_id|required|id/);
}

async function proveSchemaAcceptsIdlessClaimRow(): Promise<void> {
  unwrapOrThrow(await validateCollaborationJsonFileText('active-claims.json', claimsFileText()));
}

async function proveSchemaRejectsClaimsFileCarryingQueue(): Promise<void> {
  const withQueue = JSON.stringify(
    { schema_version: '1.4.0', claims: [LEGACY_CLAIM], commit_queue: [] },
    null,
    2,
  );
  const result = await validateCollaborationJsonFileText('active-claims.json', withQueue);
  if (result.ok) {
    assert.fail('expected schema validation to reject a 1.4.0 file carrying commit_queue');
  }
}

/**
 * `git check-ignore` recomputes the live ignore decision rather than
 * asserting on .gitignore text, which would record intent and not effect.
 * It exits non-zero when the path is NOT ignored, so the rejected promise
 * fails this smoke loudly. Spawning git is why the proof lives here rather
 * than in the vitest suite.
 */
async function proveStoreDirectoryIsUntrackableByGit(): Promise<void> {
  const storePath = '.agent/state/collaboration/commit-queue/some-intent.json';
  const { stdout } = await promisify(execFile)('git', ['check-ignore', '--no-index', storePath], {
    cwd: repoRoot,
  });
  assert.equal(stdout.trim(), storePath);
}

async function proveLegacyFlatQueueFileMigratesOnceOnRead(): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'commit-queue-store-'));
  try {
    const registryPath = join(dir, 'active-claims.json');
    // A 1.3.0 row carries no order key — the field did not exist before the
    // split — so the migration must DERIVE it from the array position, which
    // is what that schema declared the queue order to be.
    const legacy = {
      schema_version: '1.3.0',
      commit_queue: [legacyIntentRow()],
      claims: [LEGACY_CLAIM],
    };
    await writeFile(registryPath, `${JSON.stringify(legacy, null, 2)}\n`, 'utf8');

    const registry = unwrapOrThrow(await readRegistry(registryPath));

    assert.deepEqual(registry.claims, [LEGACY_CLAIM]);
    assert.equal(registry.commit_queue.length, 1);
    assert.equal(registry.commit_queue[0].intent_id, INTENT_ID);
    // Raw text, not a parsed deepEqual: the rewritten file is byte-identical
    // to the new-shape serialisation of the legacy claims, so a migration
    // that reordered or reformatted the rows it does not own reddens here.
    assert.equal(await readFile(registryPath, 'utf8'), claimsFileText());
    const storedIntent: unknown = JSON.parse(
      await readFile(join(dir, 'commit-queue', `${INTENT_ID}.json`), 'utf8'),
    );
    // Derived from the entry's OWN updated_at: the fixture's queued_at is
    // earlier, so an expiry computed from queued_at reddens this proof.
    assert.deepEqual(storedIntent, {
      ...validIntentRow(),
      expires_at: new Date(
        Date.parse(validIntentRow().updated_at) + COMMIT_QUEUE_TTL_SECONDS * 1000,
      ).toISOString(),
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

await proveSchemaRejectsIdlessIntentFile();
await proveSchemaAcceptsIdlessClaimRow();
await proveSchemaRejectsClaimsFileCarryingQueue();
await proveStoreDirectoryIsUntrackableByGit();
await proveLegacyFlatQueueFileMigratesOnceOnRead();
process.stdout.write('commit-queue store smoke: 5/5 proofs passed\n');
