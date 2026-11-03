import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveTrustedGit } from '../src/core/trusted-git';

import { gitWithoutShowCurrent } from './git-without-show-current';
import { hermeticGitEnv } from './hermetic-git-env';
import { shellSafePath, trustedShell } from './trusted-shell-directories';

/**
 * The shared branch guard, `.husky/refuse-commit-on-main.sh`, against real
 * git.
 *
 * Every commit-creating hook sources the guard. It refuses `main` and
 * `master` by name, in any case, and the default branch that
 * `refs/remotes/origin/HEAD` names; any other branch, and a detached HEAD,
 * pass, and a git that cannot name the current branch is refused. The guard
 * is driven here the way the hooks drive it, sourced from the working-tree
 * top by the trusted shell (an absolute path, never a PATH search; `sh.exe`
 * from Git for Windows on win32), and once through a real `git commit`. It
 * is sourced under plain `sh`, not `sh -e`: husky's runner adds `-e`, and
 * the guard must refuse without it.
 *
 * Real IO makes this a smoke; `test:e2e` gates it.
 */

const GIT = resolveTrustedGit();
const SH = trustedShell();
// Forward-slashed for the shell that sources it, as an argument and inside
// the hook script below: see `shellSafePath`.
const GUARD = shellSafePath(
  fileURLToPath(new URL('../../.husky/refuse-commit-on-main.sh', import.meta.url)),
);

function withTempDir(run: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'branch-guard-'));
  try {
    run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

interface Repository {
  readonly work: string;
  readonly env: Record<string, string>;
  readonly git: (args: readonly string[]) => string;
}

/** A repository with one commit on `trunk`, and `origin/HEAD` naming `defaultBranch` when given. */
function makeRepository(root: string, defaultBranch?: string): Repository {
  const work = join(root, 'work');
  const env = hermeticGitEnv(root);
  execFileSync(GIT, ['init', '-q', '-b', 'trunk', work], { env, stdio: 'ignore' });
  const git = (args: readonly string[]): string =>
    execFileSync(GIT, [...args], { cwd: work, env, encoding: 'utf8' });
  git(['config', 'user.email', 'bot@example.invalid']);
  git(['config', 'user.name', 'bot']);
  writeFileSync(join(work, 'file.txt'), 'seed\n');
  git(['add', 'file.txt']);
  git(['commit', '-q', '-m', 'seed', '--no-verify']);
  if (defaultBranch !== undefined) {
    git(['update-ref', `refs/remotes/origin/${defaultBranch}`, 'HEAD']);
    git(['symbolic-ref', 'refs/remotes/origin/HEAD', `refs/remotes/origin/${defaultBranch}`]);
  }
  return { work, env, git };
}

/** Put HEAD on a branch by name, born or not, as a checkout would. */
function onBranch(repository: Repository, branch: string): void {
  repository.git(['symbolic-ref', 'HEAD', `refs/heads/${branch}`]);
}

/**
 * Source the guard as a hook does; the exit status and the guard's own output.
 * `pathPrefix`, when given, is searched before the trusted PATH, so a test
 * can put its own `git` in front of the real one.
 */
function runGuard(
  repository: Repository,
  guardBranch = '',
  pathPrefix?: string,
): { status: number; out: string } {
  const path =
    pathPrefix === undefined
      ? repository.env.PATH
      : `${pathPrefix}${delimiter}${repository.env.PATH}`;
  const run = spawnSync(SH, ['-c', '. "$1"', 'guard', GUARD], {
    cwd: repository.work,
    env: { ...repository.env, PATH: path, GUARD_BRANCH: guardBranch, GUARD_HINT: '' },
    encoding: 'utf8',
  });
  return { status: run.status ?? -1, out: `${run.stdout}${run.stderr}` };
}

function refusesMainAndMasterByNameInAnyCase(): void {
  withTempDir((root) => {
    const repository = makeRepository(root);
    for (const branch of ['main', 'master', 'Main', 'MASTER']) {
      onBranch(repository, branch);
      const guarded = runGuard(repository);
      assert.equal(guarded.status, 1, `a commit on ${branch} was not refused`);
      assert.ok(guarded.out.includes(`'${branch}'`), `the refusal did not name ${branch}`);
    }
  });
}

function refusesTheBranchOriginHeadNames(): void {
  withTempDir((root) => {
    const repository = makeRepository(root, 'trunk');
    assert.equal(runGuard(repository).status, 1, 'a commit on the default branch was not refused');
    repository.git(['tag', 'trunk']);
    assert.equal(
      runGuard(repository).status,
      1,
      'a tag named like the default branch let a commit on it through',
    );
    onBranch(repository, 'TRUNK');
    assert.equal(
      runGuard(repository).status,
      1,
      'the default branch in another case was not refused',
    );
    onBranch(repository, 'feat/example');
    assert.equal(runGuard(repository).status, 0, 'a commit on a feature branch was refused');
  });
}

function guardsTheBranchARebaseNames(): void {
  withTempDir((root) => {
    const repository = makeRepository(root, 'trunk');
    onBranch(repository, 'feat/example');
    assert.equal(
      runGuard(repository, 'trunk').status,
      1,
      'a rebase of the default branch, named through GUARD_BRANCH, was not refused',
    );
    onBranch(repository, 'main');
    assert.equal(
      runGuard(repository, 'feat/example').status,
      0,
      'a rebase of a feature branch was refused because main is checked out',
    );
  });
}

function refusesANestedDefaultBranchWholeInAnyCase(): void {
  withTempDir((root) => {
    const repository = makeRepository(root, 'Line/Trunk');
    onBranch(repository, 'line/trunk');
    assert.equal(
      runGuard(repository).status,
      1,
      'a nested default branch, in another case, was not refused',
    );
    onBranch(repository, 'Trunk');
    assert.equal(
      runGuard(repository).status,
      0,
      'the last segment of a nested default branch was refused as if it were the default',
    );
  });
}

function passesWhatIsNotADefaultBranch(): void {
  withTempDir((root) => {
    const repository = makeRepository(root);
    assert.equal(
      runGuard(repository).status,
      0,
      'with no origin HEAD, a branch other than main or master was refused',
    );
    repository.git(['checkout', '-q', '--detach']);
    assert.equal(runGuard(repository).status, 0, 'a detached HEAD was refused');
  });
}

function refusesWhenGitCannotNameTheBranch(): void {
  withTempDir((root) => {
    const repository = makeRepository(root);
    onBranch(repository, 'feat/example');
    const shims = gitWithoutShowCurrent(root, GIT);
    const guarded = runGuard(repository, '', shims);
    assert.equal(
      guarded.status,
      1,
      'a git that cannot name the current branch let a commit through',
    );
    assert.ok(
      guarded.out.includes('could not name the current branch'),
      'the refusal did not say that git could not name the branch',
    );
    assert.equal(
      runGuard(repository, 'feat/example', shims).status,
      0,
      'a branch named through GUARD_BRANCH was refused although git was never asked for it',
    );
  });
}

function refusesARealCommitOnTheDefaultBranch(): void {
  withTempDir((root) => {
    const repository = makeRepository(root, 'trunk');
    const hook = join(repository.work, '.git', 'hooks', 'pre-commit');
    writeFileSync(
      hook,
      ['#!/bin/sh', 'GUARD_BRANCH=""', `. ${JSON.stringify(GUARD)}`, ''].join('\n'),
    );
    chmodSync(hook, 0o755);
    const seed = repository.git(['rev-parse', 'HEAD']);
    writeFileSync(join(repository.work, 'file.txt'), 'changed\n');
    repository.git(['add', 'file.txt']);
    const commit = spawnSync(GIT, ['commit', '-q', '-m', 'on the default branch'], {
      cwd: repository.work,
      env: repository.env,
      encoding: 'utf8',
    });
    assert.notEqual(commit.status, 0, 'git committed on the default branch');
    assert.equal(repository.git(['rev-parse', 'HEAD']), seed, 'HEAD moved on the default branch');
  });
}

refusesMainAndMasterByNameInAnyCase();
refusesTheBranchOriginHeadNames();
guardsTheBranchARebaseNames();
refusesANestedDefaultBranchWholeInAnyCase();
passesWhatIsNotADefaultBranch();
refusesWhenGitCannotNameTheBranch();
refusesARealCommitOnTheDefaultBranch();
process.stdout.write(
  'branch guard smoke: OK (main and master by name in any case, and the branch origin HEAD names, are refused; other branches and a detached HEAD pass; a git that cannot name the branch is refused)\n',
);
