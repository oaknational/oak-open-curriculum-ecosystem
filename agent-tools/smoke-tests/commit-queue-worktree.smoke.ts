import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runAgentToolsCli } from '../src/bin/agent-tools-cli';
import { assertAdvisoryReplayed } from './commit-queue-advisory-stub-fixture';
import {
  COMMIT_SUBJECT,
  git,
  INTENT_ID,
  makeFixture,
  readPrimaryIntent,
  REGISTRY_REL,
  RENAME_DESTINATION,
  RENAME_SOURCE,
} from './commit-queue-worktree-fixture';

/**
 * F-138 regression smoke — the commit-queue two-root split and changed-endpoint identity.
 *
 * Real scratch primary + linked worktree: a rename traverses both changed
 * endpoints, registry state stays at the coordination home, an underivable
 * git root refuses loudly. Real IO makes this a smoke; `test:e2e` gates it.
 */

async function proveRecordStagedUsesWorktreeIndex(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);

    const result = await runAgentToolsCli({
      argv: ['commit-queue', 'record-staged', '--intent-id', INTENT_ID],
      env: {},
      cwd: fixture.linked,
    });

    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, '');

    const intent = await readPrimaryIntent(fixture);
    const expectedStatus = `A\t${RENAME_DESTINATION}\nD\t${RENAME_SOURCE}\n`;
    assert.equal(intent?.staged_name_status, expectedStatus);
    assert.match(intent?.staged_bundle_fingerprint ?? '', /^[0-9a-f]{64}$/);

    // The registry write must land in the coordination home ONLY — the
    // linked worktree never grows its own registry copy.
    assert.equal(existsSync(join(fixture.linked, REGISTRY_REL)), false);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

async function proveVerifyStagedUsesWorktreeIndex(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);

    const recorded = await runAgentToolsCli({
      argv: ['commit-queue', 'record-staged', '--intent-id', INTENT_ID],
      env: {},
      cwd: fixture.linked,
    });
    assert.equal(recorded.exitCode, 0);

    const verified = await runAgentToolsCli({
      argv: [
        'commit-queue',
        'verify-staged',
        '--intent-id',
        INTENT_ID,
        '--commit-subject',
        COMMIT_SUBJECT,
      ],
      env: {},
      cwd: fixture.linked,
    });

    assert.equal(verified.exitCode, 0);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

async function proveCommitLandsOnWorktreeBranch(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);
    const primaryHeadBefore = git(fixture.primary, 'rev-parse', 'HEAD').trim();

    const recorded = await runAgentToolsCli({
      argv: ['commit-queue', 'record-staged', '--intent-id', INTENT_ID],
      env: {},
      cwd: fixture.linked,
    });
    assert.equal(recorded.exitCode, 0);

    const messageFilePath = join(fixture.root, 'commit-message.txt');
    await writeFile(messageFilePath, COMMIT_SUBJECT + '\n');

    const committed = await runAgentToolsCli({
      argv: ['commit-queue', 'commit', '--intent-id', INTENT_ID, '--message-file', messageFilePath],
      env: {},
      cwd: fixture.linked,
    });

    assert.equal(committed.exitCode, 0);
    // The scratch repo's advisory stub fails on purpose, and the failure
    // MUST NOT gate the commit (PDR-053 / ADR-176 advisory polarity). The
    // banner and both children's output reach the command's own stderr.
    assertAdvisoryReplayed(committed.stderr, COMMIT_SUBJECT);
    const reportedSha = committed.stdout.trim();
    assert.equal(git(fixture.linked, 'rev-parse', 'HEAD').trim(), reportedSha);
    const committedPaths = git(fixture.linked, 'ls-tree', '-r', '--name-only', 'HEAD').split('\n');
    assert.ok(committedPaths.includes(RENAME_DESTINATION));
    assert.equal(committedPaths.includes(RENAME_SOURCE), false);
    assert.equal(git(fixture.linked, 'status', '--short'), '');

    // The primary checkout's HEAD is untouched — the inner commit landed
    // on the invoking worktree's branch.
    assert.equal(git(fixture.primary, 'rev-parse', 'HEAD').trim(), primaryHeadBefore);

    // The completed intent is removed from the coordination-home registry.
    assert.equal(await readPrimaryIntent(fixture), undefined);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

async function proveMissingGitRootRefusesLoudly(): Promise<void> {
  const fixture = await makeFixture();
  try {
    const outside = join(fixture.root, 'outside');
    await mkdir(outside, { recursive: true });

    const result = await runAgentToolsCli({
      argv: ['commit-queue', 'record-staged', '--intent-id', INTENT_ID],
      env: {},
      cwd: outside,
      repoRoot: fixture.primary,
    });

    assert.equal(result.exitCode, 2);
    assert.match(result.stderr, /git could not resolve a working tree/);

    // No silent fallback: the intent survives untouched — neither
    // fingerprinted against the coordination home's own index nor
    // abandoned by the refused invocation.
    const intent = await readPrimaryIntent(fixture);
    assert.equal(intent?.intent_id, INTENT_ID);
    assert.equal(intent?.phase, 'staging');
    assert.equal(intent?.staged_name_status, undefined);
    assert.equal(intent?.staged_bundle_fingerprint, undefined);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

/** The CLI's source entry, run in a child process under the smoke's own tsx. */
const CLI_SOURCE = fileURLToPath(new URL('../src/bin/agent-tools.ts', import.meta.url));

/** The smoke's own PATH, read once at this composition root, so git resolves by name. */
function requiredPath(): string {
  const value = process.env.PATH;
  assert.ok(
    value !== undefined,
    'the commit-queue worktree smoke needs PATH so git resolves by name',
  );
  return value;
}

/**
 * Outside any git working tree, the CLI's refusal is the only thing on its
 * stderr, captured at the spawn boundary of a child process: git's own
 * words travel inside the tool's message, never echoed ahead of it. The
 * child gets PATH and a throwaway HOME and nothing else, so no declared
 * coordination home can reach a real registry.
 */
async function proveRefusalPrintsOnlyTheToolsMessage(): Promise<void> {
  const outside = realpathSync(await mkdtemp(join(tmpdir(), 'oak-f138-outside-')));
  try {
    const refusal = spawnSync(
      process.execPath,
      [
        '--import',
        import.meta.resolve('tsx'),
        CLI_SOURCE,
        'commit-queue',
        'record-staged',
        '--intent-id',
        INTENT_ID,
      ],
      { cwd: outside, encoding: 'utf8', env: { PATH: requiredPath(), HOME: outside } },
    );

    assert.equal(refusal.status, 2, refusal.stderr);
    // git writes before the tool catches its failure, so an echoed git line
    // would come first, in whatever language git speaks.
    assert.match(
      refusal.stderr,
      /^Unable to resolve the collaboration home: git could not resolve a working tree/,
    );
  } finally {
    await rm(outside, { recursive: true, force: true });
  }
}

await proveRecordStagedUsesWorktreeIndex();
await proveVerifyStagedUsesWorktreeIndex();
await proveCommitLandsOnWorktreeBranch();
await proveMissingGitRootRefusesLoudly();
await proveRefusalPrintsOnlyTheToolsMessage();
process.stdout.write('commit-queue worktree smoke: 5/5 proofs passed\n');
