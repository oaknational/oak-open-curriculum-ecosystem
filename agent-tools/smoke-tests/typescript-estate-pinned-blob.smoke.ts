import { spawnSync } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';

import { resolveTrustedGit } from '../dist/src/core/trusted-git.js';
import { gitEnvironment } from '../dist/src/typescript-estate/git-snapshot-process.js';
import { createPinnedGitBlobPort } from '../dist/src/typescript-estate/git-snapshot-pinned-blob.js';
import type { GitContext } from '../dist/src/typescript-estate/git-snapshot-model.js';
import type {
  ProcessInvocation,
  ProcessPort,
  ProcessResult,
} from '../dist/src/typescript-estate/ports.js';

import { trustedShellPath } from './trusted-shell-directories';

/**
 * Built-form smoke for the commit-bound pinned-blob adapter (handoff step 4):
 * a real Git repository, the real `git` binary, and a real spawn-backed
 * process port (this smoke's own composition root). Proves the adapter reads
 * the PINNED commit's bytes — never the working tree — refuses a missing
 * path with a typed failure, and enforces the caller's byte bound.
 */

function fail(message: string): never {
  process.stderr.write(`SMOKE FAIL: ${message}\n`);
  process.exit(1);
}

/**
 * Every child process this smoke starts runs with a fixed, root-owned
 * directory list as its entire PATH, so no writable directory on the ambient
 * PATH can shadow the executables the smoke means to exercise.
 */
const PINNED_PATH = trustedShellPath();

/**
 * `git` comes from the estate's own platform-partitioned allowlist rather
 * than a second list maintained here: the resolver already refuses anything
 * outside fixed absolute locations, and a duplicate list is a second thing to
 * keep true (its POSIX-only predecessor made this smoke unrunnable on
 * Windows).
 */
const GIT_EXECUTABLE = resolveTrustedGit();

const realProcessPort: ProcessPort = {
  run(input: ProcessInvocation): ProcessResult {
    const outcome = spawnSync(input.executable, input.args, {
      cwd: input.cwd,
      env: input.env,
      maxBuffer: input.maxStdoutBytes + 65536,
    });
    return {
      status: outcome.status,
      signal: outcome.signal,
      stdout: Uint8Array.from(outcome.stdout ?? Buffer.alloc(0)),
      stderr: Uint8Array.from(outcome.stderr ?? Buffer.alloc(0)),
      error: outcome.error,
    };
  },
};

function git(root: string, ...args: readonly string[]): string {
  const outcome = spawnSync(GIT_EXECUTABLE, ['-C', root, ...args], {
    encoding: 'utf8',
    env: { ...process.env, PATH: PINNED_PATH },
  });
  if (outcome.status !== 0) {
    fail(`git ${args.join(' ')} failed: ${outcome.stderr}`);
  }
  return outcome.stdout.trim();
}

const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'pinned-blob-smoke-')));

try {
  git(root, 'init', '--quiet');
  git(root, 'config', 'user.email', 'smoke@example.invalid');
  git(root, 'config', 'user.name', 'Pinned Blob Smoke');
  const pinnedPath = path.join(root, 'pinned.txt');
  writeFileSync(pinnedPath, 'pinned-bytes\n');
  git(root, 'add', 'pinned.txt');
  git(root, 'commit', '--quiet', '--no-verify', '-m', 'pin');
  const commit = git(root, 'rev-parse', 'HEAD');

  // The working tree drifts after the commit; the pinned read must not see it.
  writeFileSync(pinnedPath, 'drifted-bytes\n');

  const context: GitContext = {
    executable: GIT_EXECUTABLE,
    cwd: root,
    root,
    env: gitEnvironment({ ...process.env, PATH: PINNED_PATH }),
    stderrLimit: 4096,
    process: realProcessPort,
  };
  const port = createPinnedGitBlobPort(context, commit);

  const pinned = unwrapOrThrow(port.read('pinned.txt', 1024));
  if (Buffer.from(pinned).toString() !== 'pinned-bytes\n') {
    fail(`pinned read returned '${Buffer.from(pinned).toString()}', not the committed bytes`);
  }

  const missing = unwrapErr(port.read('absent.txt', 1024));
  if (missing.code !== 'SOURCE_READ_FAILED') {
    fail(`missing path produced '${missing.code}', expected SOURCE_READ_FAILED`);
  }

  const bounded = unwrapErr(port.read('pinned.txt', 4));
  if (bounded.code !== 'RESOURCE_LIMIT') {
    fail(`byte bound produced '${bounded.code}', expected RESOURCE_LIMIT`);
  }

  process.stdout.write('typescript-estate pinned-blob smoke: PASS\n');
} finally {
  rmSync(root, { recursive: true, force: true });
}
