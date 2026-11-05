import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { unwrapOrThrow } from '@oaknational/result';

import type { CommitIntent, CommitQueueRegistry } from '../src/commit-queue';
import { readRegistry } from '../src/commit-queue/registry';
import { uuidV5Schema } from '../src/collaboration-state/agent-id';
import { writeAdvisoryStub } from './commit-queue-advisory-stub-fixture';

/**
 * The F-138 regression smoke's fixture: a real scratch primary checkout with
 * a seeded commit-queue registry, a linked worktree cut from it, and the
 * reader the smoke's proofs share.
 *
 * @packageDocumentation
 */

const CLAIM_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
/** The one queued intent the registry seeds, in its staging phase. */
export const INTENT_ID = '11111111-1111-4111-8111-111111111111';
/** The file the proofs rename from the linked worktree. */
export const RENAME_SOURCE = 'notes/current.md';
/** Where the proofs rename it to. */
export const RENAME_DESTINATION = 'notes/active.md';
/** The seeded intent's commit subject. */
export const COMMIT_SUBJECT = 'feat(f138): stage from the linked worktree';
/** The registry's path inside the primary checkout (the coordination home). */
export const REGISTRY_REL = '.agent/state/collaboration/active-claims.json';

const agentId = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'claude-code',
  model: 'test-model',
  session_id_prefix: '019f00',
  id: uuidV5Schema.parse('e2e793c7-923e-5baa-97f0-2bedfb9b6b50'),
};

function seedRegistry(): CommitQueueRegistry {
  return {
    schema_version: '1.3.0',
    claims: [
      {
        claim_id: CLAIM_ID,
        agent_id: agentId,
        thread: 'agent-tooling',
        areas: [{ kind: 'files', patterns: ['notes/**'] }],
        claimed_at: '2026-07-14T00:00:00Z',
        intent: 'F-138 linked-worktree regression fixture.',
        intent_to_commit: INTENT_ID,
      },
    ],
    commit_queue: [
      {
        intent_id: INTENT_ID,
        claim_id: CLAIM_ID,
        agent_id: agentId,
        files: [RENAME_SOURCE, RENAME_DESTINATION],
        commit_subject: COMMIT_SUBJECT,
        queued_at: '2026-07-14T00:00:00Z',
        updated_at: '2026-07-14T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
        phase: 'staging',
      },
    ],
  };
}

/** Run git by name in `cwd`, returning its stdout. */
export function git(cwd: string, ...args: readonly string[]): string {
  return execFileSync('git', [...args], { cwd, encoding: 'utf8' });
}

export interface WorktreeFixture {
  /** Temp parent directory holding both checkouts; removed after each test. */
  readonly root: string;
  /** The primary checkout — the coordination home holding the registry. */
  readonly primary: string;
  /** The linked worktree the ceremony is invoked from. */
  readonly linked: string;
}

/** Build the primary checkout, its seeded registry, and the linked worktree. */
export async function makeFixture(): Promise<WorktreeFixture> {
  const root = realpathSync(await mkdtemp(join(tmpdir(), 'oak-f138-')));
  const primary = join(root, 'primary');
  await mkdir(primary, { recursive: true });
  git(primary, 'init', '--initial-branch=main');
  git(primary, 'config', 'user.email', 'f138-regression@test.invalid');
  git(primary, 'config', 'user.name', 'F138 Regression');
  git(primary, 'config', 'commit.gpgsign', 'false');
  await mkdir(join(primary, 'notes'), { recursive: true });
  await writeFile(join(primary, 'README.md'), 'seed\n');
  await writeFile(join(primary, RENAME_SOURCE), '# move me atomically\n');
  const advisoryStubPaths = await writeAdvisoryStub(primary);
  git(primary, 'add', 'README.md', RENAME_SOURCE, ...advisoryStubPaths);
  git(primary, 'commit', '-m', 'chore: seed');

  const linked = join(root, 'linked');
  git(primary, 'worktree', 'add', linked, '-b', 'lane/f138');

  const collaborationDir = join(primary, '.agent/state/collaboration');
  await mkdir(collaborationDir, { recursive: true });
  await writeFile(join(primary, REGISTRY_REL), `${JSON.stringify(seedRegistry(), null, 2)}\n`);

  return { root, primary, linked };
}

/** The seeded intent as the coordination-home registry now holds it. */
export async function readPrimaryIntent(
  fixture: WorktreeFixture,
): Promise<CommitIntent | undefined> {
  const registry = unwrapOrThrow(await readRegistry(join(fixture.primary, REGISTRY_REL)));
  return registry.commit_queue.find((entry) => entry.intent_id === INTENT_ID);
}
