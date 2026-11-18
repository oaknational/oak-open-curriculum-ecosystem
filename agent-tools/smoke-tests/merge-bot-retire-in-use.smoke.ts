import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { renameSync } from 'node:fs';
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
 * `merge-bot retire` against real git: the states that refuse whatever the
 * tips are (a branch in use in a worktree, a symbolic ref, a case collision,
 * the default branch named directly), so it deletes NOTHING. Each case
 * checks exit 3, the refs it names unchanged in the bare remote and the work
 * clone, and no token minted. The tip refusals are
 * `merge-bot-retire-refusals.smoke.ts`.
 *
 * Run by the smoke runner against real git, outside the test suite.
 */

const BRANCH = 'feat/keep-me';

/** Where each named ref is, in the bare remote and the work clone. */
function snapshot(rig: RetireRig, refs: readonly string[]): readonly (string | undefined)[] {
  return refs.flatMap((ref) => [refAt(rig, rig.origin, ref), refAt(rig, rig.work, ref)]);
}

/** Retire `branch`, and check exit 3, `refs` unchanged, no token minted, the reason, and no rig path printed. */
async function expectRefused(
  rig: RetireRig,
  branch: string,
  refs: readonly string[],
  reason: RegExp,
): Promise<{ readonly out: string; readonly err: string }> {
  const before = snapshot(rig, refs);
  const github = fakeGithub(rig);
  const run = await retire(rig, branch, github.fetchImpl);

  assert.equal(run.exit, 3, `expected a refusal: ${run.out}${run.err}`);
  assert.deepEqual(snapshot(rig, refs), before, 'a ref moved');
  assert.equal(github.mints(), 0, 'a token was minted for a refusal');
  // Under --json the refusal is the outcome object on stdout.
  assert.match(run.out, reason);
  // A worktree is named by its basename: a report can be pasted into a tracked record.
  assert.ok(!`${run.out}${run.err}`.includes(rig.root), 'the output carries a rig path');
  return run;
}

const OWN_REFS = [`refs/heads/${BRANCH}`, `refs/remotes/origin/${BRANCH}`];

/** A merged branch with a local copy and a cached tracking ref in the work clone. */
function mergedAndTracked(rig: RetireRig): void {
  mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
}

async function refusesABranchCheckedOutInAWorktree(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    git(rig, rig.work, 'worktree', 'add', '-q', join(rig.root, 'lane'), BRANCH);
    await expectRefused(rig, BRANCH, OWN_REFS, /lane/u);
  });
}

/** A worktree whose directory name carries a control character: the refusal names it with none. */
async function namesAWorktreeWithNoControlCharacters(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    git(rig, rig.work, 'worktree', 'add', '-q', join(rig.root, 'lane\u001b[31mred'), BRANCH);
    const run = await expectRefused(rig, BRANCH, OWN_REFS, /lane\[31mred/u);

    assert.ok(!`${run.out}${run.err}`.includes('\u001b'), 'the output carries the escape');
  });
}

/** A bisect started on the branch detaches HEAD; git's own state still names the branch. */
async function refusesABranchUnderBisect(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'bisecting');
    git(rig, rig.work, 'worktree', 'add', '-q', lane, BRANCH);
    git(rig, lane, 'commit', '-q', '--allow-empty', '-m', 'second');
    git(rig, lane, 'commit', '-q', '--allow-empty', '-m', 'third');
    git(rig, lane, 'bisect', 'start', 'HEAD', 'HEAD~2');
    await expectRefused(rig, BRANCH, OWN_REFS, /bisecting/u);
  });
}

/**
 * A tracking ref whose name equals the branch's when case is ignored. The
 * fetch writes only the local branch (`--refmap=`): on a case-insensitive
 * filesystem a lowercase tracking directory would absorb the collision's
 * path, and git would list one ref where two names were written.
 */
async function refusesACaseCollision(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    git(
      rig,
      rig.work,
      'fetch',
      '-q',
      '--refmap=',
      'origin',
      `refs/heads/${BRANCH}:refs/heads/${BRANCH}`,
    );
    const main = git(rig, rig.work, 'rev-parse', 'refs/heads/main');
    git(rig, rig.work, 'update-ref', 'refs/remotes/origin/Feat/Keep-Me', main);
    await expectRefused(
      rig,
      BRANCH,
      [...OWN_REFS, 'refs/remotes/origin/Feat/Keep-Me'],
      /case is ignored/u,
    );
  });
}

/** A local branch that is a symbolic ref to main: a delete through it would delete main. */
async function refusesASymbolicRefToTheDefault(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.work, 'symbolic-ref', 'refs/heads/alias', 'refs/heads/main');
    await expectRefused(rig, 'alias', ['refs/heads/main'], /symbolic/u);
    assert.equal(git(rig, rig.work, 'symbolic-ref', 'refs/heads/alias'), 'refs/heads/main');
  });
}

/** The remote's default branch, named directly, when it is not main. */
async function refusesTheDefaultByName(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.seed, 'branch', 'engraph', 'main');
    git(rig, rig.seed, 'push', '-q', 'origin', 'engraph:engraph');
    git(rig, rig.origin, 'symbolic-ref', 'HEAD', 'refs/heads/engraph');
    await expectRefused(rig, 'engraph', ['refs/heads/engraph'], /default branch/u);
  });
}

/**
 * A worktree stopped mid-rebase of the branch, then moved: git lists it as
 * prunable, but its rebase state still names the branch until it is pruned.
 * The question is unanswered, so the run fails (exit 1) and keeps the branch.
 */
async function failsOnAMovedWorktreeMidRebase(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'rebasing');
    git(rig, rig.work, 'worktree', 'add', '-q', lane, BRANCH);
    spawnSync(GIT, ['rebase', '-q', '-x', 'false', 'HEAD~1'], { cwd: lane, env: rig.env });
    renameSync(lane, join(rig.root, 'rebasing-moved'));
    const before = snapshot(rig, OWN_REFS);
    const github = fakeGithub(rig);
    const run = await retire(rig, BRANCH, github.fetchImpl);

    assert.equal(run.exit, 1, `expected a failure: ${run.out}${run.err}`);
    assert.match(run.out, /prunable/u);
    assert.deepEqual(snapshot(rig, OWN_REFS), before, 'a ref moved');
    assert.equal(github.mints(), 0, 'a token was minted for a failure');
  });
}

/**
 * A bisect started on the branch in the checkout the command runs from:
 * git's state paths there are relative unless asked for absolute ones, so
 * the check must still find `BISECT_START` naming the branch.
 */
async function refusesABranchUnderBisectInThisCheckout(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.seed, 'switch', '-q', '-c', BRANCH, 'main');
    for (const message of ['first', 'second', 'third']) {
      git(rig, rig.seed, 'commit', '-q', '--allow-empty', '-m', message);
    }
    git(rig, rig.seed, 'push', '-q', 'origin', `${BRANCH}:${BRANCH}`);
    git(rig, rig.seed, 'switch', '-q', 'main');
    git(rig, rig.seed, 'merge', '-q', '--no-ff', '-m', `merge ${BRANCH}`, BRANCH);
    git(rig, rig.seed, 'push', '-q', 'origin', 'main:main');
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'switch', '-q', '--track', `origin/${BRANCH}`);
    git(rig, rig.work, 'bisect', 'start', 'HEAD', 'HEAD~3');
    await expectRefused(rig, BRANCH, OWN_REFS, /work/u);
  });
}

/** The branch becomes a symbolic ref to main after its proof: its delete must not follow it. */
async function keepsMainWhenTheBranchTurnsSymbolic(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.seed, 'switch', '-q', '-c', BRANCH, 'main');
    git(rig, rig.seed, 'push', '-q', 'origin', `${BRANCH}:${BRANCH}`);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
    const main = refAt(rig, rig.work, 'refs/heads/main');
    const turn = (): string =>
      git(rig, rig.work, 'symbolic-ref', `refs/heads/${BRANCH}`, 'refs/heads/main');
    await retire(rig, BRANCH, fakeGithub(rig, { onMint: turn }).fetchImpl);

    assert.equal(
      refAt(rig, rig.work, 'refs/heads/main'),
      main,
      'the delete followed a symbolic ref',
    );
  });
}

/**
 * The local name turns into a symbolic ref whose target is gone after the
 * proof: `for-each-ref` lists no object for it, so the failed swap is never
 * read as absent; the name is kept and reported unknown, with the remote
 * already gone.
 */
async function keepsALateDanglingSymbolicRef(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const target = 'refs/heads/gone-after-the-proof';
    const dangle = (): string => git(rig, rig.work, 'symbolic-ref', `refs/heads/${BRANCH}`, target);
    const run = await retire(rig, BRANCH, fakeGithub(rig, { onMint: dangle }).fetchImpl);

    assert.equal(run.exit, 1, run.err);
    const outcome = outcomeOf(run);
    assert.equal(outcome.kind, 'partial');
    assert.equal(outcome.names?.local.state, 'unknown');
    assert.match(outcome.reason ?? '', /symbolic ref whose target is gone/u);
    assert.equal(
      git(rig, rig.work, 'symbolic-ref', `refs/heads/${BRANCH}`),
      target,
      'the dangling symbolic name was deleted or followed',
    );
    assert.equal(refAt(rig, rig.origin, `refs/heads/${BRANCH}`), undefined, 'the remote stayed');
  });
}

await refusesABranchCheckedOutInAWorktree();
await namesAWorktreeWithNoControlCharacters();
await refusesABranchUnderBisectInThisCheckout();
await keepsMainWhenTheBranchTurnsSymbolic();
await keepsALateDanglingSymbolicRef();
await failsOnAMovedWorktreeMidRebase();
await refusesABranchUnderBisect();
await refusesACaseCollision();
await refusesASymbolicRefToTheDefault();
await refusesTheDefaultByName();
process.stdout.write(
  'merge-bot retire in-use smoke: OK (seven refusing states, a moved worktree, main kept past a late symbolic ref, and a late dangling one kept)\n',
);
