import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { resolveTrustedGit } from '../src/core/trusted-git';
import { realGitExecutor } from '../src/merge-bot/git-executor';
import { pushHead, resolveGitContext } from '../src/merge-bot/push-git';

import { trustedShellPath } from './trusted-shell-directories';

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
 * Two legs. The first drives twice the measured corpus through the executor
 * itself; the second is the live fire (R8): a real repository, a real bare
 * remote, a real `pre-push` hook that out-talks every buffer, and the landed
 * ref read back off the remote afterwards. Seven static instruments passed a
 * push command that could not push; one execution found it in minutes.
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

/**
 * A literal child environment. `PATH` is here because git's hook runner needs
 * a shell on it; everything else is addressed absolutely. `HOME` points into
 * the throwaway root and the two `GIT_CONFIG_*` variables silence the
 * machine's real git configuration, so this smoke cannot be steered — or
 * broken — by whoever is running it.
 */
function hermeticEnv(home: string): Record<string, string> {
  return {
    PATH: trustedShellPath(),
    HOME: home,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null',
  };
}

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
      env: hermeticEnv(cwd),
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
  const env = hermeticEnv(root);
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
  // because `C:\Program Files\...` contains spaces, and forward-slashed,
  // because a backslash is an escape character to `sh` — Windows accepts
  // either separator. Unquoted, `sh` reads `C:\Program` as the command, the
  // hook emits an error instead of its payload, and the smoke reports the
  // silence as the output loss it exists to detect.
  const shellSafeNode = JSON.stringify(process.execPath.replaceAll('\\', '/'));
  writeFileSync(
    hook,
    ['#!/bin/sh', `${shellSafeNode} -e ${JSON.stringify(EMITTER)}`, 'exit 0', ''].join('\n'),
  );
  chmodSync(hook, 0o755);
  return { work, remote };
}

/** Leg 2 (R8): the real command, the real repository, the real hook. */
async function landsARealPushThroughALoudHook(): Promise<void> {
  const outcome = await withTempDir(async (root) => {
    const { work, remote } = makeRepoWithLoudHook(root);
    const git = resolveGitContext({});
    assert.ok(git.ok, 'no trusted git binary to run the live fire against');
    let received = 0;
    const pushed = await pushHead(git.value, {
      remote,
      branch: 'lane',
      cwd: work,
      token: 'unused-for-a-local-remote',
      baseEnv: hermeticEnv(root),
      onOutput: (chunk) => {
        received += Buffer.byteLength(chunk);
      },
    });
    const landed = execFileSync(GIT, ['rev-parse', 'lane'], {
      cwd: remote,
      encoding: 'utf8',
      env: hermeticEnv(root),
    }).trim();
    return { pushed, received, landed };
  });

  assert.ok(outcome.pushed.ok, 'the push seam refused before reaching git');
  assert.equal(
    outcome.pushed.value.status,
    0,
    `git push exited ${outcome.pushed.value.status}: ${outcome.pushed.value.stderr}`,
  );
  // The push LANDED — the state a buffer death silently failed to produce.
  assert.match(outcome.landed, /^[0-9a-f]{40}$/u, 'the ref never reached the remote');
  assert.ok(
    outcome.received >= DRIVE_BYTES,
    `expected the hook's ${DRIVE_BYTES} bytes to reach the sink, saw ${outcome.received}`,
  );
}

await drivesTwiceTheMeasuredCorpus();
await landsARealPushThroughALoudHook();
process.stdout.write(
  `merge-bot push output smoke: OK (streamed ≥ ${DRIVE_BYTES} bytes on both legs)\n`,
);
