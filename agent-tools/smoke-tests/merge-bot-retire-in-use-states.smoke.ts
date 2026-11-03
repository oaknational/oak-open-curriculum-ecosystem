import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  GIT,
  git,
  mergedBranch,
  outcomeOf,
  refAt,
  retire,
  withRig,
  type RetireRig,
} from './merge-bot-retire-fixture';
import { fakeGithub } from './merge-bot-retire-github-double';

/**
 * `merge-bot retire` against real git: the states that must stop a delete
 * which `merge-bot-retire-in-use.smoke.ts` does not hold. Every ref of the
 * branch reads as MERGED in every case, so a state the check missed would
 * delete it (exit 0), never refuse it as unmerged. A rebase that names the
 * branch, or a symbolic local or tracking ref (a dangling one included),
 * refuses (exit 3); a worktree whose
 * state cannot be read fails the run (exit 1). Each case checks every ref of
 * the branch where it was, no token minted, and no rig path in the output
 * (a report names worktrees by basename only).
 *
 * Run by the smoke runner against real git, outside the test suite.
 */

const BRANCH = 'feat/keep-me';

/** Where each ref of the branch is: the bare remote's, the work clone's local and tracking. */
function snapshot(rig: RetireRig): readonly (string | undefined)[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
  ];
}

/** Retire the branch; check the exit code, the reason, every ref where it was, no token minted, and no rig path printed. */
async function expectKept(rig: RetireRig, exit: 1 | 3, reason: RegExp): Promise<void> {
  const before = snapshot(rig);
  const github = fakeGithub(rig);
  const run = await retire(rig, BRANCH, github.fetchImpl);
  const output = `${run.out}${run.err}`;

  assert.equal(run.exit, exit, `expected exit ${exit}: ${output}`);
  assert.match(outcomeOf(run).reason ?? '', reason);
  assert.deepEqual(snapshot(rig), before, 'a ref of the branch moved');
  assert.equal(github.mints(), 0, 'a token was minted');
  assert.ok(!output.includes(rig.root), 'the output carries a rig path');
}

/** The absolute path of `name` in worktree `lane`'s own git directory. */
function gitPath(rig: RetireRig, lane: string, name: string): string {
  return git(rig, lane, 'rev-parse', '--path-format=absolute', '--git-path', name);
}

/** Whether worktree `lane` has no branch out, so only git's rebase state can name the branch. */
function isDetached(rig: RetireRig, lane: string): boolean {
  return spawnSync(GIT, ['symbolic-ref', '-q', 'HEAD'], { cwd: lane, env: rig.env }).status !== 0;
}

/** A merged branch with a local copy and a cached tracking ref in the work clone. */
function mergedAndTracked(rig: RetireRig): void {
  mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
}

/** Cut `branch` from the seed's main, give it `f.txt` holding `text`, and push it. */
function commitFile(rig: RetireRig, branch: string, text: string): void {
  git(rig, rig.seed, 'switch', '-q', '-c', branch, 'main');
  writeFileSync(join(rig.seed, 'f.txt'), `${text}\n`);
  git(rig, rig.seed, 'add', 'f.txt');
  git(rig, rig.seed, 'commit', '-q', '-m', text);
  git(rig, rig.seed, 'push', '-q', 'origin', `${branch}:${branch}`);
}

/** A linked worktree stopped mid-rebase of the branch (the merge backend): HEAD is detached, and git's state names the branch. */
async function refusesABranchMidRebase(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'rebasing');
    git(rig, rig.work, 'worktree', 'add', '-q', lane, BRANCH);
    spawnSync(GIT, ['rebase', '-q', '-x', 'false', 'HEAD~1'], { cwd: lane, env: rig.env });
    assert.ok(existsSync(gitPath(rig, lane, 'rebase-merge/head-name')), 'the rebase did not stop');
    assert.ok(isDetached(rig, lane), 'the lane has a branch out');
    await expectKept(rig, 3, /rebasing/u);
  });
}

/**
 * A linked worktree stopped mid-rebase of the branch under `--apply`, which
 * keeps its state in another directory. `--apply` takes no `-x`, so a file
 * conflict stops it: the branch and `other` each add `f.txt` from the same
 * base, and the branch is merged before the rebase starts.
 */
async function refusesABranchMidApplyRebase(): Promise<void> {
  await withRig(async (rig) => {
    commitFile(rig, BRANCH, 'from the branch');
    commitFile(rig, 'other', 'from other');
    git(rig, rig.seed, 'switch', '-q', 'main');
    git(rig, rig.seed, 'merge', '-q', '--no-ff', '-m', `merge ${BRANCH}`, BRANCH);
    git(rig, rig.seed, 'push', '-q', 'origin', 'main:main');
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
    const lane = join(rig.root, 'applying');
    git(rig, rig.work, 'worktree', 'add', '-q', lane, BRANCH);
    spawnSync(GIT, ['rebase', '-q', '--apply', 'origin/other'], { cwd: lane, env: rig.env });
    assert.ok(existsSync(gitPath(rig, lane, 'rebase-apply/head-name')), 'the rebase did not stop');
    assert.ok(isDetached(rig, lane), 'the lane has a branch out');
    await expectKept(rig, 3, /applying/u);
  });
}

/**
 * A linked worktree rebasing `top`, stacked on the branch, with
 * `--update-refs`: the branch's own commit is in the replayed range, so the
 * rebase will move the branch when it ends, though no worktree has it out.
 */
async function refusesABranchARebaseWillUpdate(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'stacked');
    git(rig, rig.work, 'worktree', 'add', '-q', '-b', 'top', lane, BRANCH);
    git(rig, lane, 'commit', '-q', '--allow-empty', '-m', 'on top');
    spawnSync(
      GIT,
      ['rebase', '-q', '--update-refs', '-x', 'false', '--onto', 'origin/main', `${BRANCH}~1`],
      { cwd: lane, env: rig.env },
    );
    const updates = readFileSync(gitPath(rig, lane, 'rebase-merge/update-refs'), 'utf8');
    assert.ok(updates.split('\n').includes(`refs/heads/${BRANCH}`), 'the rebase does not name it');
    assert.ok(isDetached(rig, lane), 'the lane has a branch out');
    await expectKept(rig, 3, /stacked/u);
  });
}

/** A worktree's `BISECT_START` exists and cannot be read (a directory): unanswered, never "not in use". */
async function failsOnAnUnreadableStateFile(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'unreadable');
    git(rig, rig.work, 'worktree', 'add', '-q', '--detach', lane, 'main');
    mkdirSync(gitPath(rig, lane, 'BISECT_START'));
    await expectKept(rig, 1, /BISECT_START/u);
  });
}

/** A state directory that is a regular file: git refuses the path itself, the question is unanswered, the run fails. */
async function failsOnAStateDirectoryThatIsAFile(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'notdir');
    git(rig, rig.work, 'worktree', 'add', '-q', '--detach', lane, 'main');
    writeFileSync(gitPath(rig, lane, 'rebase-merge'), '');
    await expectKept(rig, 1, /head-name.*Not a directory/u);
  });
}

/**
 * A detached linked worktree whose `.git` file is garbage: git does not mark
 * it prunable, but cannot answer where its state is. Detached, because a
 * worktree with the branch out is answered from the listing alone.
 */
async function failsOnAWorktreeThatCannotBeAsked(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'unaskable');
    git(rig, rig.work, 'worktree', 'add', '-q', '--detach', lane, 'main');
    writeFileSync(join(lane, '.git'), 'not a gitfile\n');
    await expectKept(rig, 1, /state of worktree unaskable/u);
  });
}

/**
 * The cached tracking ref is a symbolic ref to `origin/main`, with no local
 * branch and no remote one: this command does not retire a symbolic ref, so
 * it refuses, and both refs stay as they were.
 */
async function refusesASymbolicTrackingRef(): Promise<void> {
  await withRig(async (rig) => {
    const tracking = `refs/remotes/origin/${BRANCH}`;
    const main = refAt(rig, rig.work, 'refs/remotes/origin/main');
    git(rig, rig.work, 'symbolic-ref', tracking, 'refs/remotes/origin/main');
    await expectKept(rig, 3, /symbolic/u);
    assert.equal(refAt(rig, rig.work, 'refs/remotes/origin/main'), main, 'main moved');
    assert.equal(git(rig, rig.work, 'symbolic-ref', tracking), 'refs/remotes/origin/main');
  });
}

/**
 * The local branch's name is a DANGLING symbolic ref (its target gone),
 * which `for-each-ref` does not list, beside a merged remote and cached
 * tracking ref. Read raw, it is symbolic: the run refuses, and the dangling
 * ref stays, where a listing alone would retire the other two names.
 */
async function refusesADanglingSymbolicRef(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const local = `refs/heads/${BRANCH}`;
    git(rig, rig.work, 'update-ref', '-d', local);
    git(rig, rig.work, 'symbolic-ref', local, 'refs/heads/gone');
    await expectKept(rig, 3, /symbolic/u);
    assert.equal(git(rig, rig.work, 'symbolic-ref', local), 'refs/heads/gone');
  });
}

await refusesADanglingSymbolicRef();
await refusesABranchMidRebase();
await refusesABranchMidApplyRebase();
await refusesABranchARebaseWillUpdate();
await refusesASymbolicTrackingRef();
await failsOnAnUnreadableStateFile();
await failsOnAStateDirectoryThatIsAFile();
await failsOnAWorktreeThatCannotBeAsked();
process.stdout.write(
  'merge-bot retire in-use states smoke: OK (a dangling symbolic ref, three rebases that name the branch, a symbolic tracking ref, three worktrees that cannot be read)\n',
);
