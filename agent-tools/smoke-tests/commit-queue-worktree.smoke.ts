import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  BIN,
  COMMIT_SUBJECT,
  INTENT_ID,
  REGISTRY_REL,
  RENAME_DESTINATION,
  RENAME_SOURCE,
  git,
  makeFixture,
  readPrimaryIntent,
  runCommitQueue,
  runCommitQueueInProcess,
  streams,
  type WorktreeFixture,
} from './commit-queue-worktree-fixture';
import { assertAdvisoryReplayed } from './commit-queue-advisory-stub-fixture';

/**
 * F-138 regression smoke — the commit-queue two-root split and
 * changed-endpoint identity. Real scratch primary + linked worktree: a
 * rename traverses both changed endpoints, registry state stays at the
 * coordination home, an underivable git root refuses loudly. Each proof runs
 * the built CLI as a child with every stream captured and pinned, so what the
 * command prints is asserted and never reaches the gate log. `test:e2e` gates
 * it.
 */

async function proveRecordStagedUsesWorktreeIndex(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);

    const result = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);

    assert.equal(result.status, 0, streams(result));
    assert.equal(result.stdout, '');
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

    const recorded = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);
    assert.equal(recorded.status, 0, streams(recorded));
    const recordedIntent = await readPrimaryIntent(fixture);
    assert.ok(
      recordedIntent?.staged_bundle_fingerprint,
      `the record step wrote no intent with a staged fingerprint:\n${streams(recorded)}`,
    );

    const verified = runCommitQueue(fixture.linked, [
      'verify-staged',
      '--intent-id',
      INTENT_ID,
      '--commit-subject',
      COMMIT_SUBJECT,
    ]);

    assert.equal(verified.status, 0, streams(verified));
    // Verification reads the same worktree index the record step fingerprinted.
    assert.equal(verified.stdout, `${recordedIntent.staged_bundle_fingerprint}\n`);
    assert.equal(verified.stderr, '');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

/**
 * Both streams of a commit whose advisory pass failed. The scratch repository's
 * advisory stub fails on purpose, and the failure never gates the commit
 * (PDR-053 / ADR-176 advisory polarity). The command replays the banner, both
 * children's output and the landed notice to its own stderr, in the run's
 * order, so stdout carries the sha alone.
 */
function assertAdvisoryFailureStreams(
  committed: { readonly stdout: string; readonly stderr: string },
  head: string,
): void {
  assert.equal(committed.stdout, `${head}\n`, `stdout is the sha alone:\n${streams(committed)}`);
  assertAdvisoryReplayed(committed.stderr, COMMIT_SUBJECT);
  assert.match(
    committed.stderr,
    new RegExp(
      String.raw`commit landed at ${head} \(intent ${INTENT_ID}\); advisory orchestrator exit [1-9]\d* — [^\n]*\n$`,
    ),
    `stderr ends with the landed notice:\n${streams(committed)}`,
  );
}

/** Stage the rename in the linked worktree, record it, and return the commit's arguments. */
async function recordRename(fixture: WorktreeFixture): Promise<readonly string[]> {
  git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);
  const recorded = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);
  assert.equal(recorded.status, 0, streams(recorded));
  const messageFilePath = join(fixture.root, 'commit-message.txt');
  await writeFile(messageFilePath, COMMIT_SUBJECT + '\n');
  return ['commit', '--intent-id', INTENT_ID, '--message-file', messageFilePath];
}

async function proveCommitLandsOnWorktreeBranch(): Promise<void> {
  const fixture = await makeFixture();
  try {
    const primaryHeadBefore = git(fixture.primary, 'rev-parse', 'HEAD').trim();

    const committed = runCommitQueue(fixture.linked, await recordRename(fixture));

    assert.equal(committed.status, 0, streams(committed));
    const head = git(fixture.linked, 'rev-parse', 'HEAD').trim();
    assertAdvisoryFailureStreams(committed, head);
    const committedPaths = new Set(
      git(fixture.linked, 'ls-tree', '-r', '--name-only', 'HEAD').split('\n'),
    );
    assert.ok(committedPaths.has(RENAME_DESTINATION));
    assert.equal(committedPaths.has(RENAME_SOURCE), false);
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

/**
 * The same commit through the in-process entry: the replay reaches the
 * command's own stderr writer and nothing reaches the process's stderr,
 * which a run of the built CLI as a child cannot tell apart.
 */
async function proveCommitReplaysToItsOwnStderr(): Promise<void> {
  const fixture = await makeFixture();
  try {
    const committed = runCommitQueueInProcess(fixture.linked, await recordRename(fixture));

    assert.equal(
      committed.driver.stderr,
      '',
      `the process's stderr stays empty:\n${streams(committed.driver)}`,
    );
    assert.equal(committed.result.exitCode, 0, streams(committed.result));
    assertAdvisoryFailureStreams(committed.result, git(fixture.linked, 'rev-parse', 'HEAD').trim());
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

async function proveMissingGitRootRefusesLoudly(): Promise<void> {
  const fixture = await makeFixture();
  try {
    // The primary's git directory is inside the repository, so the
    // coordination home still resolves through git, but it is not inside a
    // working tree, so no invoking git root is derivable. The built CLI takes
    // no registry-root flag, and from a directory outside every repository the
    // command would refuse earlier, at the coordination home, never reaching
    // the guard this proof exists for.
    const gitDir = join(fixture.primary, '.git');

    const result = runCommitQueue(gitDir, ['record-staged', '--intent-id', INTENT_ID]);

    assert.equal(result.status, 2, streams(result));
    assert.equal(result.stdout, '');
    // The whole of stderr is the guard's one line: git's own words travel
    // inside it, never echoed ahead of it, since the shared git runner
    // captures git's stderr.
    assert.match(
      result.stderr,
      /^Unable to resolve the invoking git worktree root: [^\n]*no fallback to the coordination home[^\n]*\n$/,
    );
    assert.ok(
      result.stderr.includes(`git could not resolve a working tree from '${gitDir}'`),
      streams(result),
    );

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

assert.equal(existsSync(BIN), true, `built CLI missing at ${BIN}; build agent-tools first`);
await proveRecordStagedUsesWorktreeIndex();
await proveVerifyStagedUsesWorktreeIndex();
await proveCommitLandsOnWorktreeBranch();
await proveCommitReplaysToItsOwnStderr();
await proveMissingGitRootRefusesLoudly();
process.stdout.write('commit-queue worktree smoke: 5/5 proofs passed\n');
