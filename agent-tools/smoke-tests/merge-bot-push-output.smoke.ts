import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { resolveTrustedGit } from '../src/core/trusted-git';
import { realGitExecutor } from '../src/merge-bot/git-executor';
import { gitReadsFrom, pushCommit, resolveGitContext } from '../src/merge-bot/push-git';
import { settleTargetBranch } from '../src/merge-bot/push-target-branch';

import { hermeticGitEnv } from './hermetic-git-env';
import { shellSafePath } from './trusted-shell-directories';

/**
 * The `merge-bot push` output seam under real volume, against real binaries.
 *
 * git runs the repository's whole pre-push gate chain, and that chain's
 * output flows back through this seam. Its volume is the gates' to decide,
 * never this command's (R1), so it is conserved in files and replayed in
 * full — never buffered in a size this command chose, never carried on a
 * Node pipe (F-112) — and the only way to know that is to put more than a
 * buffer's worth through it and watch.
 *
 * Three legs. The first drives twice the measured corpus through the executor
 * itself; the second is the live fire (R8): a real repository, a real bare
 * remote, a real `pre-push` hook that out-talks every buffer, and the landed
 * ref read back off the remote afterwards. Seven static instruments passed a
 * push command that could not push; one execution found it in minutes. The
 * third asks the real git binary the questions the push settles its target
 * with, in a repository where a tag shares the branch's name.
 *
 * Real IO makes this a smoke; `test:e2e` gates it.
 */

/**
 * The repository's own pre-push gate chain on a GREEN run, measured
 * 2026-08-06 — turbo leg only, so a LOWER bound on what a real push carries.
 * Node's `spawnSync` default is 1 MiB; this is 1.77× that, which is why an
 * ordinary push died ENOBUFS and never landed.
 *
 * Re-measure with:
 *   `git push 2>&1 | wc -c`
 */
const MEASURED_GATE_OUTPUT_BYTES = 1_852_962;

/** R1's proof bar: at least twice the recorded measured corpus. */
const DRIVE_BYTES = MEASURED_GATE_OUTPUT_BYTES * 2;

const CHUNK = 64 * 1024;
const CHUNK_COUNT = Math.ceil(DRIVE_BYTES / CHUNK);

/** A child that emits `DRIVE_BYTES` on stdout and a closing line on stderr. */
const EMITTER = [
  `const c = 'x'.repeat(${CHUNK});`,
  `for (let i = 0; i < ${CHUNK_COUNT}; i += 1) { process.stdout.write(c); }`,
  `process.stderr.write('emitter done' + String.fromCharCode(10));`,
].join(' ');

const GIT = resolveTrustedGit();

/** Awaits the work BEFORE removing the directory. */
async function withTempDir<T>(run: (dir: string) => Promise<T>): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), 'merge-bot-push-output-'));
  try {
    return await run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Leg 1: twice the measured corpus, straight through the real executor. */
async function drivesTwiceTheMeasuredCorpus(): Promise<void> {
  let received = 0;
  let sawStderr = false;
  const result = await withTempDir(async (cwd) =>
    realGitExecutor()(process.execPath, ['-e', EMITTER], {
      cwd,
      env: hermeticGitEnv(cwd),
      onOutput: (chunk) => {
        received += Buffer.byteLength(chunk);
        sawStderr ||= chunk.includes('emitter done');
      },
    }),
  );

  // Survival is the claim: a run that dies ENOBUFS reports a negative status
  // and a "cannot run git" stderr — the shape a never-landed push had.
  assert.equal(result.status, 0, `expected a clean exit, got ${result.status}: ${result.stderr}`);
  assert.ok(
    received >= DRIVE_BYTES,
    `expected at least ${DRIVE_BYTES} bytes through the seam, saw ${received}`,
  );
  // The stderr line is emitted LAST; a truncating consumer drops the tail first.
  assert.ok(sawStderr, 'the trailing stderr line never arrived');
}

/** A throwaway repository with a bare remote and a loud pre-push hook. */
function makeRepoWithLoudHook(root: string): { work: string; remote: string } {
  const remote = join(root, 'remote.git');
  const work = join(root, 'work');
  const env = hermeticGitEnv(root);
  const git = (cwd: string, args: readonly string[]): void => {
    execFileSync(GIT, [...args], { cwd, env, stdio: 'ignore' });
  };
  execFileSync(GIT, ['init', '--bare', '-b', 'lane', remote], { env, stdio: 'ignore' });
  execFileSync(GIT, ['init', '-b', 'lane', work], { env, stdio: 'ignore' });
  git(work, ['config', 'user.email', 'bot@example.invalid']);
  git(work, ['config', 'user.name', 'bot']);
  writeFileSync(join(work, 'file.txt'), 'content\n');
  git(work, ['add', 'file.txt']);
  git(work, ['commit', '-m', 'seed', '--no-verify']);
  // A gate chain in miniature: it prints far more than any single buffer and
  // exits 0, exactly like a green run of the real one.
  const hook = join(work, '.git', 'hooks', 'pre-push');
  // git runs hooks through a shell on every platform (Git for Windows ships
  // its own). The interpreter path must therefore be shell-safe: quoted,
  // because `C:\Program Files\...` contains spaces, and forward-slashed
  // (`shellSafePath`). Unquoted, `sh` reads `C:\Program` as the command, the
  // hook emits an error instead of its payload, and the smoke reports the
  // silence as the output loss it exists to detect.
  const shellSafeNode = JSON.stringify(shellSafePath(process.execPath));
  writeFileSync(
    hook,
    ['#!/bin/sh', `${shellSafeNode} -e ${JSON.stringify(EMITTER)}`, 'exit 0', ''].join('\n'),
  );
  chmodSync(hook, 0o755);
  return { work, remote };
}

/** A git read's trimmed output, run hermetically in `cwd`. */
function gitOutput(cwd: string, args: readonly string[], root: string): string {
  return execFileSync(GIT, args, { cwd, encoding: 'utf8', env: hermeticGitEnv(root) }).trim();
}

/** Leg 2 (R8): the real command, the real repository, the real hook. */
async function landsARealPushThroughALoudHook(): Promise<void> {
  const outcome = await withTempDir(async (root) => {
    const { work, remote } = makeRepoWithLoudHook(root);
    // A configuration that would carry an annotated tag along with any push:
    // the push must still write exactly one ref, the branch.
    execFileSync(GIT, ['config', 'push.followTags', 'true'], {
      cwd: work,
      env: hermeticGitEnv(root),
    });
    execFileSync(GIT, ['tag', '-a', 'v1', '-m', 'v1'], { cwd: work, env: hermeticGitEnv(root) });
    const git = resolveGitContext({});
    assert.ok(git.ok, 'no trusted git binary to run the live fire against');
    let received = 0;
    const commit = gitOutput(work, ['rev-parse', 'HEAD'], root);
    const pushed = await pushCommit(git.value, {
      remote,
      branch: 'lane',
      commit,
      cwd: work,
      token: 'unused-for-a-local-remote',
      baseEnv: hermeticGitEnv(root),
      onOutput: (chunk) => {
        received += Buffer.byteLength(chunk);
      },
    });
    const landed = gitOutput(remote, ['rev-parse', 'lane'], root);
    const remoteTags = gitOutput(remote, ['tag', '--list'], root);
    return { pushed, received, commit, landed, remoteTags };
  });

  assert.ok(outcome.pushed.ok, 'the push seam refused before reaching git');
  assert.equal(
    outcome.pushed.value.status,
    0,
    `git push exited ${outcome.pushed.value.status}: ${outcome.pushed.value.stderr}`,
  );
  // The push LANDED the settled commit — the state a buffer death silently
  // failed to produce, reached through the `<commit>^{commit}` source.
  assert.equal(outcome.landed, outcome.commit, 'the settled commit never reached the remote');
  assert.equal(outcome.remoteTags, '', 'a tag rode along with the branch push');
  assert.ok(
    outcome.received >= DRIVE_BYTES,
    `expected the hook's ${DRIVE_BYTES} bytes to reach the sink, saw ${outcome.received}`,
  );
}

/**
 * Leg 3: the reads the push settles its target with, answered by real git. A
 * tag named like the branch makes `rev-parse --abbrev-ref HEAD` print
 * `heads/<name>`; the read must still name the branch whole, so the default
 * branch origin names is refused, the branch HEAD is on is the target once
 * origin names another default, and a name that is not HEAD's refuses.
 */
async function settlesTheTargetFromRealGitAnswers(): Promise<void> {
  const settled = await withTempDir(async (root) => {
    const { work } = makeRepoWithLoudHook(root);
    const env = hermeticGitEnv(root);
    const git = (args: readonly string[]): void => {
      execFileSync(GIT, [...args], { cwd: work, env, stdio: 'ignore' });
    };
    git(['tag', 'lane']);
    git(['remote', 'add', 'origin', 'https://github.com/acme/widgets.git']);
    git(['update-ref', 'refs/remotes/origin/lane', 'HEAD']);
    git(['remote', 'set-head', 'origin', 'lane']);
    const context = resolveGitContext({});
    assert.ok(context.ok, 'no trusted git binary to read against');
    const reads = gitReadsFrom(context.value, { cwd: work, env });
    const repository = { owner: 'acme', repoName: 'widgets' };
    const current = (await reads.currentBranch()).stdout.trim();
    const onDefault = await settleTargetBranch(undefined, reads, repository);
    git(['update-ref', 'refs/remotes/origin/trunk', 'HEAD']);
    git(['remote', 'set-head', 'origin', 'trunk']);
    return {
      current,
      onDefault,
      onHeadNamed: await settleTargetBranch('lane', reads, repository),
      onOther: await settleTargetBranch('feat/example', reads, repository),
    };
  });

  assert.equal(settled.current, 'lane', 'the current-branch read did not name the branch whole');
  assert.ok(
    settled.onDefault.ok && settled.onDefault.value.kind === 'refused',
    'HEAD on the default branch origin names was not refused',
  );
  assert.deepEqual(settled.onHeadNamed, { ok: true, value: { kind: 'target', branch: 'lane' } });
  assert.ok(
    settled.onOther.ok &&
      settled.onOther.value.kind === 'refused' &&
      settled.onOther.value.reason.includes('"feat/example"') &&
      settled.onOther.value.reason.includes('"lane"'),
    'a named branch that is not the one HEAD is on was not refused naming both',
  );
}

await drivesTwiceTheMeasuredCorpus();
await landsARealPushThroughALoudHook();
await settlesTheTargetFromRealGitAnswers();
process.stdout.write(
  `merge-bot push output smoke: OK (streamed ≥ ${DRIVE_BYTES} bytes on both output legs; the target settled from real git)\n`,
);
