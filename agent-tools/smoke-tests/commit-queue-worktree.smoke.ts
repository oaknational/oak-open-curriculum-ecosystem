import assert from 'node:assert/strict';
import type { SpawnSyncReturns } from 'node:child_process';
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
  streams,
} from './commit-queue-worktree-fixture';
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
 * The whole of a commit's stderr when the advisory pass failed: the advisory
 * banner, then whatever the advisory child and the inner `git commit` wrote to
 * stderr (the `children` group, zero or more lines), then the notice that the
 * commit landed at `head` with a non-zero advisory exit recorded. The wording
 * after the dash is free.
 */
function advisoryFailureStderr(head: string): RegExp {
  return new RegExp(
    String.raw`^\[ADVISORY ONLY — NOT A COMMIT GATE\]\n` +
      String.raw`(?<children>(?:[^\n]*\n)*)` +
      String.raw`commit landed at ${head} \(intent ${INTENT_ID}\); ` +
      String.raw`advisory orchestrator exit [1-9]\d* — [^\n]*\n$`,
  );
}

/**
 * Both streams of a commit whose advisory pass failed, every line accounted
 * for. This repository's own lines are pinned by their own text: the banner
 * whole, the notice up to its dash with any non-zero exit, and the sha as the
 * last stdout line. The advisory child is the host's pnpm, which can only
 * fail in the scratch repository, and how it fails belongs to its version:
 * pnpm 11 prints one line on stdout, pnpm 12 prints a block on stderr. Its
 * text is pinned by where it may sit and by its presence, never by its
 * wording: on stdout only before git's commit summary, on stderr only between
 * the banner and the notice (where the inner `git commit`'s own stderr also
 * lands), and at least one non-empty line across the two. git's summary is
 * pinned the same way: a first line naming the commit subject, then only
 * git's indented detail lines before the sha. This does not prove the
 * advisory child's working directory or arguments.
 */
function assertAdvisoryFailureStreams(committed: SpawnSyncReturns<string>, head: string): void {
  const stderr = advisoryFailureStderr(head).exec(committed.stderr);
  assert.ok(
    stderr?.groups,
    `stderr is the banner, the children's stderr, the notice:\n${streams(committed)}`,
  );
  const lines = committed.stdout.split('\n');
  assert.deepEqual(lines.slice(-2), [head, ''], `the sha ends stdout:\n${streams(committed)}`);
  const summaryAt = lines.findIndex((line) => line.includes(COMMIT_SUBJECT));
  assert.ok(summaryAt >= 0, `git's commit summary names the subject:\n${streams(committed)}`);
  assert.deepEqual(
    lines.slice(summaryAt + 1, -2).filter((line) => !/^ \S/.test(line)),
    [],
    `only git's indented detail lines sit between its summary and the sha:\n${streams(committed)}`,
  );
  const childLines = [...lines.slice(0, summaryAt), ...stderr.groups.children.split('\n')];
  assert.ok(
    childLines.some((line) => line.trim().length > 0),
    `the advisory child wrote at least one line; none means no pnpm ran:\n${streams(committed)}`,
  );
}

async function proveCommitLandsOnWorktreeBranch(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);
    const primaryHeadBefore = git(fixture.primary, 'rev-parse', 'HEAD').trim();

    const recorded = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);
    assert.equal(recorded.status, 0, streams(recorded));

    const messageFilePath = join(fixture.root, 'commit-message.txt');
    await writeFile(messageFilePath, COMMIT_SUBJECT + '\n');

    const committed = runCommitQueue(fixture.linked, [
      'commit',
      '--intent-id',
      INTENT_ID,
      '--message-file',
      messageFilePath,
    ]);

    assert.equal(committed.status, 0, streams(committed));
    const head = git(fixture.linked, 'rev-parse', 'HEAD').trim();
    // The scratch repo has no package manifest, so the host's pnpm fails the
    // advisory pass — and that MUST NOT gate the commit (PDR-053 / ADR-176
    // advisory polarity).
    assertAdvisoryFailureStreams(committed, head);
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
    // The whole of stderr: git's own refusal (git's words, which a localised
    // git translates), then the guard's own line, last.
    assert.match(
      result.stderr,
      /^(?:[^\n]*\n)*Unable to resolve the invoking git worktree root: [^\n]*no fallback to the coordination home[^\n]*\n$/,
    );
    assert.ok(
      result.stderr.includes(`'${gitDir}' is not inside a git working tree`),
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
await proveMissingGitRootRefusesLoudly();
process.stdout.write('commit-queue worktree smoke: 4/4 proofs passed\n');
