import assert from 'node:assert/strict';
import { unlinkSync } from 'node:fs';
import { join } from 'node:path';

import {
  commitAndPush,
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
 * `merge-bot retire` against real git: its reads. Each tip is read by its
 * own name and proven at its own sha. A read git cannot answer fails the run
 * (exit 1) before anything is minted or deleted: never a refusal, and never
 * a guess that would let a delete through. Each failing case holds a branch
 * a delete would otherwise take, and checks that every ref of it is where it
 * was. The worktree states that refuse or fail are
 * `merge-bot-retire-in-use-states.smoke.ts`.
 *
 * Run by the smoke runner against real git, outside the test suite.
 */

const BRANCH = 'feat/read-me';

/** Where each ref of the branch is: the bare remote's, the work clone's local and tracking. */
function snapshot(rig: RetireRig): readonly (string | undefined)[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
  ];
}

/** Retire the branch; check exit 1, a failed outcome for `reason`, every ref where it was, and no token minted. */
async function expectFailed(rig: RetireRig, reason: RegExp): Promise<void> {
  const before = snapshot(rig);
  const github = fakeGithub(rig);
  const run = await retire(rig, BRANCH, github.fetchImpl);

  assert.equal(run.exit, 1, `expected a failure: ${run.out}${run.err}`);
  const outcome = outcomeOf(run);
  assert.equal(outcome.kind, 'failed');
  assert.match(outcome.reason ?? '', reason);
  assert.deepEqual(snapshot(rig), before, 'a ref of the branch moved');
  assert.equal(github.mints(), 0, 'a token was minted for a failure');
}

/** A merged branch with a local copy and a cached tracking ref in the work clone; returns its tip. */
function mergedAndTracked(rig: RetireRig): string {
  const tip = mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
  return tip;
}

/**
 * The local branch and the cached tracking ref sit at different commits of
 * the merged branch (the cache is a push behind): each is proven, and
 * deleted, at its own sha.
 */
async function retiresEachTipAtItsOwnSha(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.seed, 'switch', '-q', '-c', BRANCH, 'main');
    const parent = commitAndPush(rig, BRANCH, 'first');
    const tip = commitAndPush(rig, BRANCH, 'second');
    git(rig, rig.seed, 'switch', '-q', 'main');
    git(rig, rig.seed, 'merge', '-q', '--no-ff', '-m', `merge ${BRANCH}`, BRANCH);
    git(rig, rig.seed, 'push', '-q', 'origin', 'main:main');
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
    git(rig, rig.work, 'update-ref', `refs/remotes/origin/${BRANCH}`, parent, tip);
    const run = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    const outcome = outcomeOf(run);
    assert.equal(outcome.kind, 'retired');
    assert.deepEqual(outcome.names?.local, { state: 'deleted', sha: tip });
    assert.deepEqual(outcome.names?.tracking, { state: 'deleted', sha: parent });
    assert.deepEqual(snapshot(rig), [undefined, undefined, undefined], 'a name survived');
  });
}

/**
 * No local branch at the proof; a writer checks one out, with its upstream,
 * while the remote delete runs. The config section is read again just
 * before its removal, as `git branch -d` reads the branch before its own:
 * the new branch keeps its section, and the other names still go. The
 * outcome reports each name as proven: the local name was absent at the
 * proof, and a name another writer makes after it is not this run's.
 */
async function keepsTheSectionOfABranchMadeMidRun(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    const github = fakeGithub(rig, {
      onMint: () => git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`),
    });
    const run = await retire(rig, BRANCH, github.fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(outcomeOf(run).names?.local.state, 'absent');
    assert.ok(
      git(rig, rig.work, 'config', '--list', '--local').includes(`branch.${BRANCH}.remote=origin`),
      "the new branch's section went",
    );
    assert.ok(refAt(rig, rig.work, `refs/heads/${BRANCH}`) !== undefined, 'the new branch went');
    assert.deepEqual(
      [
        refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
        refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
      ],
      [undefined, undefined],
      'the remote or tracking name survived',
    );
  });
}

/**
 * A section left by an earlier run, and no local name at the proof; a writer
 * makes the name a dangling symbolic ref during the remote delete, which the
 * listing omits. The raw read finds it, so the section stays with it.
 */
async function keepsTheSectionOfADanglingNameMadeMidRun(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'config', `branch.${BRANCH}.remote`, 'origin');
    const local = `refs/heads/${BRANCH}`;
    const onMint = () => git(rig, rig.work, 'symbolic-ref', local, 'refs/heads/gone');
    const run = await retire(rig, BRANCH, fakeGithub(rig, { onMint }).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(git(rig, rig.work, 'config', '--get', `branch.${BRANCH}.remote`), 'origin');
    assert.equal(git(rig, rig.work, 'symbolic-ref', local), 'refs/heads/gone');
  });
}

/**
 * The local branch's name is a symbolic ref in a loop with another, which
 * `for-each-ref` does not list and git cannot say is symbolic (it exits 128,
 * not 0 or 1): the run fails rather than read the name as not symbolic and
 * retire the other two, and the loop stays.
 */
async function failsOnASymbolicLoop(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const local = `refs/heads/${BRANCH}`;
    git(rig, rig.work, 'update-ref', '-d', local);
    git(rig, rig.work, 'symbolic-ref', local, 'refs/heads/loop');
    git(rig, rig.work, 'symbolic-ref', 'refs/heads/loop', local);
    await expectFailed(rig, /is a symbolic ref/u);
    assert.equal(git(rig, rig.work, 'symbolic-ref', '--no-recurse', local), 'refs/heads/loop');
  });
}

/**
 * The local branch holds two commits never pushed, and the first one's
 * object is gone: git cannot say whether the tip is on the default (it
 * exits 128, not 0 or 1), so the run fails rather than read an answer.
 * The tip's own object stays, so the fetches before the question succeed.
 */
async function failsOnAMissingCommitObject(): Promise<void> {
  await withRig(async (rig) => {
    const tip = mergedAndTracked(rig);
    const first = git(rig, rig.work, 'commit-tree', `${tip}^{tree}`, '-p', tip, '-m', 'one');
    const second = git(rig, rig.work, 'commit-tree', `${tip}^{tree}`, '-p', first, '-m', 'two');
    git(rig, rig.work, 'update-ref', `refs/heads/${BRANCH}`, second, tip);
    unlinkSync(join(rig.work, '.git', 'objects', first.slice(0, 2), first.slice(2)));
    await expectFailed(rig, /asking whether/u);
  });
}

/**
 * `origin/HEAD` cannot be written: a ref under `origin/HEAD/` holds its
 * path as a directory, so `remote set-head --auto` fails, and the run
 * fails with it rather than proving on a default it could not record.
 */
async function failsWhenOriginHeadCannotBeRefreshed(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const main = git(rig, rig.work, 'rev-parse', 'refs/remotes/origin/main');
    git(rig, rig.work, 'symbolic-ref', '--delete', 'refs/remotes/origin/HEAD');
    git(rig, rig.work, 'update-ref', 'refs/remotes/origin/HEAD/x', main);
    await expectFailed(rig, /refreshing origin\/HEAD/u);
  });
}

/**
 * `origin` has a second URL. Both name the bot's repository, so a check of
 * one alone would pass and the run would delete; but fetch reads the first
 * and a single config read the last, so a check of one would not bind the
 * other: the run fails before any read.
 */
async function failsOnAnOriginWithTwoUrls(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    git(rig, rig.work, 'remote', 'set-url', '--add', 'origin', 'git@github.com:acme/widgets.git');
    await expectFailed(rig, /2 URLs/u);
  });
}

/**
 * A name with a dot: its config section is matched exactly, so a look-alike
 * section (`feat/v1x2`, which an unescaped dot would match) is not taken for
 * the branch's own, and the run retires with the look-alike left.
 */
async function leavesALookAlikeSection(): Promise<void> {
  await withRig(async (rig) => {
    const dotted = 'feat/v1.2';
    mergedBranch(rig, dotted);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--no-track', dotted, `origin/${dotted}`);
    git(rig, rig.work, 'config', 'branch.feat/v1x2.remote', 'origin');
    const run = await retire(rig, dotted, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, `${run.out}${run.err}`);
    assert.equal(git(rig, rig.work, 'config', '--get', 'branch.feat/v1x2.remote'), 'origin');
  });
}

/** `origin` has no URL: the run fails before any read, never reading the unset key as a URL. */
async function failsOnAnOriginWithNoUrl(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    git(rig, rig.work, 'config', '--unset-all', 'remote.origin.url');
    await expectFailed(rig, /no origin URL/u);
  });
}

await retiresEachTipAtItsOwnSha();
await leavesALookAlikeSection();
await keepsTheSectionOfABranchMadeMidRun();
await keepsTheSectionOfADanglingNameMadeMidRun();
await failsOnASymbolicLoop();
await failsOnAMissingCommitObject();
await failsWhenOriginHeadCannotBeRefreshed();
await failsOnAnOriginWithTwoUrls();
await failsOnAnOriginWithNoUrl();
process.stdout.write(
  'merge-bot retire reads smoke: OK (two tips at their own shas, three config sections kept, five failed reads)\n',
);
