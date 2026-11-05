import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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
import { recordingProcessStderr } from './process-stderr-recorder';

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

    const { value: result, written } = await recordingProcessStderr(() =>
      runAgentToolsCli({
        argv: ['commit-queue', 'record-staged', '--intent-id', INTENT_ID],
        env: {},
        cwd: outside,
        repoRoot: fixture.primary,
      }),
    );

    assert.equal(result.exitCode, 2, written);
    assert.match(result.stderr, /git could not resolve a working tree/);
    // The expected refusal prints only the tool's message: nothing reaches
    // this process's stderr stream, and git's own words travel on the
    // error's cause.
    assert.equal(written, '');

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

await proveRecordStagedUsesWorktreeIndex();
await proveVerifyStagedUsesWorktreeIndex();
await proveCommitLandsOnWorktreeBranch();
await proveMissingGitRootRefusesLoudly();
process.stdout.write('commit-queue worktree smoke: 4/4 proofs passed\n');
