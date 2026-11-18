import assert from 'node:assert/strict';
import { rmSync, writeFileSync } from 'node:fs';
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
import { fakeGithub, type GithubDoubleOptions } from './merge-bot-retire-github-double';

/**
 * `merge-bot retire` against real git: failures around the delete. Each case
 * runs a merged branch present on the remote, in the cache and locally, with
 * GitHub or git failing, or another writer moving a name, at one step, and
 * checks exit 1 and where every name is afterwards. No local name may go
 * unless the remote reads back absent; a name that moved after its proof is
 * kept and reported at the sha it moved to; a local delete that fails is
 * reported as failed, never as moved.
 *
 * Run by the smoke runner against real git, outside the test suite.
 */

const BRANCH = 'feat/fail-me';

type Where = 'kept' | 'gone' | 'moved';

/** Where each name (remote, tracking, local) is: at its proven tip, gone, or moved. */
function names(rig: RetireRig, tip: string): readonly Where[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
  ].map((sha) => {
    if (sha === undefined) {
      return 'gone';
    }
    return sha === tip ? 'kept' : 'moved';
  });
}

/** A new commit on top of `tip` in the work clone, made without moving anything. */
function commitOnTop(rig: RetireRig, tip: string): string {
  return git(rig, rig.work, 'commit-tree', `${tip}^{tree}`, '-p', tip, '-m', 'moved');
}

interface Failure {
  readonly outcome: ReturnType<typeof outcomeOf>;
  /** Where each name is afterwards, by sha: remote, tracking, local. */
  readonly shas: readonly (string | undefined)[];
  readonly config: string;
}

/** Retire the branch under `options`; check exit 1, the outcome kind, and where each name is. */
async function expectFailure(
  options: (rig: RetireRig, tip: string) => GithubDoubleOptions,
  kind: 'failed' | 'partial',
  expected: readonly Where[],
): Promise<Failure> {
  return withRig(async (rig) => {
    const tip = mergedBranch(rig, BRANCH);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
    const run = await retire(rig, BRANCH, fakeGithub(rig, options(rig, tip)).fetchImpl);

    assert.equal(run.exit, 1, `expected a failure: ${run.out}${run.err}`);
    const outcome = outcomeOf(run);
    assert.equal(outcome.kind, kind);
    assert.deepEqual(names(rig, tip), expected, 'a name is not where the failure should leave it');
    const config = git(rig, rig.work, 'config', '--list', '--local');
    const shas = [
      refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
      refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
      refAt(rig, rig.work, `refs/heads/${BRANCH}`),
    ];
    return { outcome, shas, config };
  });
}

// GitHub answers success to the delete and changes nothing: the read-back decides.
await expectFailure(() => ({ updateRefs: 'accepts-without-deleting' }), 'failed', [
  'kept',
  'kept',
  'kept',
]);

// GitHub refuses the delete with an error and changes nothing: the read-back decides.
await expectFailure(() => ({ failGraphqlCall: 2 }), 'failed', ['kept', 'kept', 'kept']);

// The re-read at the mint fails: nothing is deleted.
await expectFailure(() => ({ failGraphqlCall: 1 }), 'failed', ['kept', 'kept', 'kept']);

// The remote is deleted but its read-back fails: its state is unknown, so no local name goes.
const unread = await expectFailure(() => ({ failGraphqlCall: 3 }), 'partial', [
  'gone',
  'kept',
  'kept',
]);
assert.deepEqual(
  [unread.outcome.names?.remote.state, unread.outcome.names?.local.state],
  ['unknown', 'not-reached'],
);

// Another writer re-creates the branch after the delete: it is kept, and no local name goes.
const replaced = await expectFailure(
  (rig) => ({ afterUpdate: () => commitAndPush(rig, BRANCH, 're-created') }),
  'partial',
  ['moved', 'kept', 'kept'],
);
assert.deepEqual(replaced.outcome.names?.remote, { state: 'kept', sha: replaced.shas[0] });

// GitHub deletes, answers an error, and another writer re-creates the branch before the read-back:
// whether this command deleted it is not known, so it is reported kept, never refused.
const unanswered = await expectFailure(
  (rig) => ({
    updateRefs: 'errors-after-deleting',
    afterUpdate: () => commitAndPush(rig, BRANCH, 're-created'),
  }),
  'partial',
  ['moved', 'kept', 'kept'],
);
assert.deepEqual(unanswered.outcome.names?.remote, { state: 'kept', sha: unanswered.shas[0] });

// The local branch moves after its proof: it is kept at the sha it moved to, with its config.
const localMoved = await expectFailure(
  (rig, tip) => ({
    onMint: () => git(rig, rig.work, 'update-ref', `refs/heads/${BRANCH}`, commitOnTop(rig, tip)),
  }),
  'partial',
  ['gone', 'gone', 'moved'],
);
assert.deepEqual(localMoved.outcome.names?.local, { state: 'kept', sha: localMoved.shas[2] });
assert.match(localMoved.config, new RegExp(String.raw`^branch\.${BRANCH}\.remote=`, 'mu'));

// The tracking ref moves after its proof: it is kept, and the local branch still goes.
const trackingMoved = await expectFailure(
  (rig, tip) => ({
    onMint: () =>
      git(rig, rig.work, 'update-ref', `refs/remotes/origin/${BRANCH}`, commitOnTop(rig, tip)),
  }),
  'partial',
  ['gone', 'moved', 'gone'],
);
assert.deepEqual(trackingMoved.outcome.names?.tracking, {
  state: 'kept',
  sha: trackingMoved.shas[1],
});

// A worktree checks the branch out after its proof: the in-use check is read again before the
// local deletes, so both local names are kept (the remote was proven and is gone).
const taken = await expectFailure(
  (rig) => ({
    onMint: () => git(rig, rig.work, 'worktree', 'add', '-q', join(rig.root, 'late'), BRANCH),
  }),
  'partial',
  ['gone', 'kept', 'kept'],
);
assert.match(taken.outcome.reason ?? '', /late/u);

// The local branch is locked when its delete runs: failed at its proven sha, never "moved".
const locked = await expectFailure(
  (rig) => ({
    onMint: () => writeFileSync(join(rig.work, '.git', 'refs', 'heads', `${BRANCH}.lock`), ''),
  }),
  'partial',
  ['gone', 'gone', 'kept'],
);
assert.match(locked.outcome.reason ?? '', /was not deleted/u);
// git's own words carry through to the report.
assert.match(locked.outcome.reason ?? '', /lock/u);
assert.doesNotMatch(locked.outcome.reason ?? '', /moved/u);

// The config is locked when its section is removed: the names go, and the section is reported left.
const configLeft = await expectFailure(
  (rig) => ({ onMint: () => writeFileSync(join(rig.work, '.git', 'config.lock'), '') }),
  'partial',
  ['gone', 'gone', 'gone'],
);
assert.match(configLeft.outcome.reason ?? '', /config was left/u);

// A re-run after the config was left finishes it: no name is left, and the section goes.
await withRig(async (rig) => {
  mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
  const lock = join(rig.work, '.git', 'config.lock');
  const first = await retire(
    rig,
    BRANCH,
    fakeGithub(rig, { onMint: () => writeFileSync(lock, '') }).fetchImpl,
  );
  const section = new RegExp(String.raw`^branch\.${BRANCH}\.`, 'mu');
  assert.equal(first.exit, 1, first.err);
  assert.match(
    git(rig, rig.work, 'config', '--list', '--local'),
    section,
    'the lock left no section',
  );
  rmSync(lock);
  const rerun = await retire(rig, BRANCH, fakeGithub(rig).fetchImpl);

  assert.equal(rerun.exit, 0, rerun.err);
  assert.equal(outcomeOf(rerun).kind, 'absent');
  assert.doesNotMatch(
    git(rig, rig.work, 'config', '--list', '--local'),
    section,
    'the section stayed',
  );
});

// The same unknown read-back in human output: the report goes to stderr, the token to neither stream.
await withRig(async (rig) => {
  mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
  const run = await retire(rig, BRANCH, fakeGithub(rig, { failGraphqlCall: 3 }).fetchImpl, false);

  assert.equal(run.exit, 1, run.err);
  assert.match(run.err, /partly retired/u);
});

process.stdout.write(
  'merge-bot retire failsafe smoke: OK (twelve failures, no name lost early, and a re-run that finishes)\n',
);
