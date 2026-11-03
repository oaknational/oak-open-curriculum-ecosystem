/**
 * The scratch primary + linked worktree fixture the F-138 regression smoke
 * runs its proofs against, split out as this directory's other smokes do
 * (see `commit-queue-registry-fixture.ts`) so the smoke file itself is
 * proofs only.
 */
import { execFileSync, spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { unwrapOrThrow } from '@oaknational/result';
import { typeSafeEntries } from '@oaknational/type-helpers';

import { uuidV5Schema } from '../src/collaboration-state/agent-id';
import { readRegistry } from '../src/commit-queue/registry';
import type { CommitIntent, CommitQueueClaimsFile } from '../src/commit-queue/types';
import { resolveTrustedGit } from '../src/core/trusted-git';

const CLAIM_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
export const INTENT_ID = '11111111-1111-4111-8111-111111111111';
export const RENAME_SOURCE = 'notes/current.md';
export const RENAME_DESTINATION = 'notes/active.md';
export const COMMIT_SUBJECT = 'feat(f138): stage from the linked worktree';
export const REGISTRY_REL = '.agent/state/collaboration/active-claims.json';

const agentId = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'claude-code',
  model: 'test-model',
  session_id_prefix: '019f00',
  id: uuidV5Schema.parse('e2e793c7-923e-5baa-97f0-2bedfb9b6b50'),
};

const seedClaimsFile: CommitQueueClaimsFile = {
  schema_version: '1.4.0',
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
};

// Store-live timestamps: the per-intent store expires entries one hour
// after updated_at, so the fixture anchors to the wall clock.
const SEED_QUEUED_AT = new Date(Date.now() - 60 * 1000).toISOString();

const seedIntent: CommitIntent = {
  intent_id: INTENT_ID,
  claim_id: CLAIM_ID,
  agent_id: agentId,
  files: [RENAME_SOURCE, RENAME_DESTINATION],
  commit_subject: COMMIT_SUBJECT,
  queued_at: SEED_QUEUED_AT,
  updated_at: SEED_QUEUED_AT,
  expires_at: new Date(Date.parse(SEED_QUEUED_AT) + 3600 * 1000).toISOString(),
  phase: 'staging',
  queued_seq: 0,
};

/**
 * The built CLI entry the smoke invokes, as production does: plain `node`, no
 * loader. `test:e2e` builds before the smoke runner runs it; run alone, it
 * needs a build first.
 */
export const BIN = join(
  fileURLToPath(new URL('..', import.meta.url)),
  'dist',
  'src',
  'bin',
  'agent-tools.js',
);

/**
 * git for fixture set-up, with its output captured: set-up chatter such as
 * `git worktree add`'s progress line stays out of the gate log, and a failing
 * call still throws with git's stderr in the message.
 */
export function git(cwd: string, ...args: readonly string[]): string {
  return execFileSync(resolveTrustedGit(), [...args], {
    cwd,
    env: smokeEnvironment(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: CHILD_TIMEOUT_MS,
  });
}

/** How long one git or CLI child may run before the smoke fails instead of hanging. */
const CHILD_TIMEOUT_MS = 120_000;

/**
 * Whether a variable would steer the fixture's git or the CLI's registry:
 * every `GIT_*` variable (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, and the
 * `GIT_CONFIG_PARAMETERS` that `git -c` exports, among others) and a declared
 * coordination home.
 */
function steers(name: string): boolean {
  return name.startsWith('GIT_') || name === 'PRACTICE_COORDINATION_HOME';
}

/**
 * The environment the fixture's git and the built CLI run with: the caller's
 * own, read here at the smoke's spawn composition root, less every variable
 * that steers git or the registry, and with the machine's git configuration
 * silenced as `hermeticGitEnv` does. A standalone run with `GIT_DIR` exported
 * would otherwise write the fixture into the outer repository. `HOME` and
 * `PATH` stay, because the CLI's advisory child resolves pnpm through them.
 * The commit-queue topic resolves its home through git today; removing
 * `PRACTICE_COORDINATION_HOME` keeps an ambient declared home from ever
 * redirecting the fixture's registry if the topic comes to honour it.
 */
function smokeEnvironment(): NodeJS.ProcessEnv {
  return {
    ...Object.fromEntries(typeSafeEntries(process.env).filter(([name]) => !steers(name))),
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null',
  };
}

/**
 * Run `agent-tools commit-queue <args>` from the built CLI with every stream
 * captured, so what the command prints is asserted rather than written to the
 * gate log.
 */
export function runCommitQueue(cwd: string, args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [BIN, 'commit-queue', ...args], {
    cwd,
    env: smokeEnvironment(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: CHILD_TIMEOUT_MS,
  });
}

/** A captured run's streams, for an assertion message that shows why it failed. */
export function streams(result: SpawnSyncReturns<string>): string {
  return `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`;
}

export interface WorktreeFixture {
  /** Temp parent dir (removed after each test); primary is the coordination home. */
  readonly root: string;
  readonly primary: string;
  readonly linked: string;
}

export async function makeFixture(): Promise<WorktreeFixture> {
  const root = realpathSync(await mkdtemp(join(tmpdir(), 'oak-f138-')));
  try {
    return await populateFixture(root);
  } catch (error) {
    // The callers' `finally` removes the root only once a fixture is returned.
    await rm(root, { recursive: true, force: true });
    throw error;
  }
}

async function populateFixture(root: string): Promise<WorktreeFixture> {
  const primary = join(root, 'primary');
  await mkdir(primary, { recursive: true });
  git(primary, 'init', '--initial-branch=main');
  git(primary, 'config', 'user.email', 'f138-regression@test.invalid');
  git(primary, 'config', 'user.name', 'F138 Regression');
  git(primary, 'config', 'commit.gpgsign', 'false');
  await mkdir(join(primary, 'notes'), { recursive: true });
  await writeFile(join(primary, 'README.md'), 'seed\n');
  await writeFile(join(primary, RENAME_SOURCE), '# move me atomically\n');
  git(primary, 'add', 'README.md', RENAME_SOURCE);
  git(primary, 'commit', '-m', 'chore: seed');

  const linked = join(root, 'linked');
  git(primary, 'worktree', 'add', linked, '-b', 'lane/f138');

  const collaborationDir = join(primary, '.agent/state/collaboration');
  await mkdir(join(collaborationDir, 'commit-queue'), { recursive: true });
  await writeFile(join(primary, REGISTRY_REL), `${JSON.stringify(seedClaimsFile, null, 2)}\n`);
  await writeFile(
    join(collaborationDir, 'commit-queue', `${INTENT_ID}.json`),
    `${JSON.stringify(seedIntent, null, 2)}\n`,
  );

  return { root, primary, linked };
}

export async function readPrimaryIntent(
  fixture: WorktreeFixture,
): Promise<CommitIntent | undefined> {
  const registry = unwrapOrThrow(await readRegistry(join(fixture.primary, REGISTRY_REL)));
  return registry.commit_queue.find((entry) => entry.intent_id === INTENT_ID);
}
