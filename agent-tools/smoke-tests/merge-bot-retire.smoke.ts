import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
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
 * `merge-bot retire` against real git: the paths that retire. Each case
 * reads the refs git holds afterwards, in the bare remote and the work
 * clone. The refusals are `merge-bot-retire-refusals.smoke.ts` and
 * `merge-bot-retire-in-use.smoke.ts`; the failures around the delete are
 * `merge-bot-retire-failsafe.smoke.ts`.
 *
 * Run by the smoke runner against real git, outside the test suite.
 */

const BRANCH = 'feat/retire-me';

/** Give the work clone a local branch tracking the remote one, with its config. */
function trackLocally(rig: RetireRig, branch: string): void {
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', branch, `origin/${branch}`);
}

/** Every name of the branch, in the bare remote and the work clone. */
function names(rig: RetireRig): readonly (string | undefined)[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
  ];
}

function configKeys(rig: RetireRig): readonly string[] {
  return git(rig, rig.work, 'config', '--list', '--local').split('\n');
}

async function retiresEveryName(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    trackLocally(rig, BRANCH);
    // Tags made after the clone, on the default's new tip and on the branch's
    // tip, with the clone set to fetch every tag (tagOpt --tags, which even a
    // fetch that stores no ref obeys): neither fetch may bring one.
    git(rig, rig.work, 'config', 'remote.origin.tagOpt', '--tags');
    git(rig, rig.seed, 'tag', 'v1', 'main');
    git(rig, rig.seed, 'tag', 'v0', BRANCH);
    git(rig, rig.seed, 'push', '-q', 'origin', 'v1', 'v0');
    const run = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(outcomeOf(run).kind, 'retired');
    assert.deepEqual(names(rig), [undefined, undefined, undefined], 'a name survived');
    assert.ok(
      !configKeys(rig).some((line) => line.startsWith(`branch.${BRANCH}.`)),
      'the branch config section survived',
    );
    assert.equal(refAt(rig, rig.work, 'refs/tags/v1'), undefined, 'a fetch followed a tag');
    assert.equal(refAt(rig, rig.work, 'refs/tags/v0'), undefined, 'a fetch followed a tag');
  });
}

async function retiresLocalNamesWhenTheRemoteIsGone(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    trackLocally(rig, BRANCH);
    git(rig, rig.origin, 'update-ref', '-d', `refs/heads/${BRANCH}`);
    const github = fakeGithub(rig);
    const run = await retire(rig, BRANCH, github.fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(github.mints(), 0, 'a token was minted with no remote delete due');
    assert.deepEqual(names(rig), [undefined, undefined, undefined], 'a name survived');
  });
}

/** Retiring `a` leaves the config of a branch named `a.v2`, and is not failed by it. */
async function leavesASiblingBranchsConfig(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--no-track', BRANCH, `origin/${BRANCH}`);
    git(rig, rig.work, 'config', `branch.${BRANCH}.v2.remote`, 'origin');
    const run = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.ok(
      configKeys(rig).includes(`branch.${BRANCH}.v2.remote=origin`),
      "the sibling's config went",
    );
  });
}

async function followsADefaultBranchThatChanged(): Promise<void> {
  await withRig(async (rig) => {
    // The work clone was made while the default was main; the remote's default
    // then becomes engraph, which the work clone has never fetched.
    git(rig, rig.seed, 'branch', 'engraph', 'main');
    git(rig, rig.seed, 'push', '-q', 'origin', 'engraph:engraph');
    git(rig, rig.origin, 'symbolic-ref', 'HEAD', 'refs/heads/engraph');
    mergedBranch(rig, BRANCH, 'engraph');
    const run = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(outcomeOf(run).base?.name, 'engraph');
    assert.equal(
      git(rig, rig.work, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD'),
      'origin/engraph',
    );
    assert.equal(refAt(rig, rig.origin, `refs/heads/${BRANCH}`), undefined);
  });
}

/** Someone else removes a name while the command runs: absent, never a problem. */
async function retiresWhenNamesVanishAtTheMint(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    trackLocally(rig, BRANCH);
    const github = fakeGithub(rig, {
      onMint: () => {
        git(rig, rig.origin, 'update-ref', '-d', `refs/heads/${BRANCH}`);
        git(rig, rig.work, 'update-ref', '-d', `refs/remotes/origin/${BRANCH}`);
      },
    });
    const run = await retire(rig, BRANCH, github.fetchImpl);

    assert.equal(run.exit, 0, run.err);
    const reported = outcomeOf(run).names;
    assert.deepEqual([reported?.remote.state, reported?.tracking.state], ['absent', 'absent']);
    assert.deepEqual(names(rig), [undefined, undefined, undefined], 'a name survived');
  });
}

/** GitHub deletes and then answers an error: the read-back shows the remote gone, not by an accepted delete. */
async function readsTheRemoteBackWhenTheDeleteErrs(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    trackLocally(rig, BRANCH);
    const github = fakeGithub(rig, { updateRefs: 'errors-after-deleting' });
    const run = await retire(rig, BRANCH, github.fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(outcomeOf(run).names?.remote.state, 'absent');
    assert.deepEqual(names(rig), [undefined, undefined, undefined], 'a name survived');
  });
}

/** The local branch is already gone and its config section stayed: the section goes with the other names. */
async function removesALeftConfigSection(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    trackLocally(rig, BRANCH);
    git(rig, rig.work, 'update-ref', '-d', `refs/heads/${BRANCH}`);
    const run = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.ok(
      !configKeys(rig).some((key) => key.startsWith(`branch.${BRANCH}.`)),
      'the section stayed',
    );
  });
}

/** A section of the branch's in a config file the repository includes is not the repository's to remove. */
async function leavesASectionInAnIncludedFile(): Promise<void> {
  await withRig(async (rig) => {
    const included = join(rig.root, 'included.gitconfig');
    writeFileSync(included, `[branch "${BRANCH}"]\n\tremote = origin\n`);
    git(rig, rig.work, 'config', 'include.path', included);
    const run = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(outcomeOf(run).kind, 'absent');
  });
}

/**
 * The local branch goes, and a branch named under it appears, while the
 * command runs: the compare-and-swap fails, and its re-read, which also lists
 * the longer ref, reads the branch absent, never kept at the longer ref's sha.
 */
async function ignoresALongerRefTheReReadLists(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    trackLocally(rig, BRANCH);
    const main = git(rig, rig.work, 'rev-parse', 'refs/remotes/origin/main');
    const longer = `refs/heads/${BRANCH}/y`;
    const github = fakeGithub(rig, {
      afterUpdate: () => {
        git(rig, rig.work, 'update-ref', '-d', `refs/heads/${BRANCH}`);
        git(rig, rig.work, 'update-ref', longer, main);
      },
    });
    const run = await retire(rig, BRANCH, github.fetchImpl);

    assert.equal(run.exit, 0, run.err);
    const outcome = outcomeOf(run);
    assert.equal(outcome.kind, 'retired');
    assert.equal(outcome.names?.local.state, 'absent');
    assert.equal(refAt(rig, rig.work, longer), main, 'the longer ref went');
  });
}

async function reportsNothingToRetire(): Promise<void> {
  await withRig(async (rig) => {
    const github = fakeGithub(rig);
    const run = await retire(rig, 'feat/never-made', github.fetchImpl);

    assert.equal(run.exit, 0, run.err);
    assert.equal(outcomeOf(run).kind, 'absent');
    assert.equal(github.mints(), 0, 'a token was minted with nothing to retire');
  });
}

await retiresEveryName();
await retiresLocalNamesWhenTheRemoteIsGone();
await leavesASiblingBranchsConfig();
await followsADefaultBranchThatChanged();
await retiresWhenNamesVanishAtTheMint();
await readsTheRemoteBackWhenTheDeleteErrs();
await removesALeftConfigSection();
await leavesASectionInAnIncludedFile();
await ignoresALongerRefTheReReadLists();
await reportsNothingToRetire();
process.stdout.write('merge-bot retire smoke: OK (ten retire paths)\n');
