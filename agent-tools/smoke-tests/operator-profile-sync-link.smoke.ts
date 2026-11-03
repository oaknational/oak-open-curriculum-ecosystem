import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { lstatSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeErrorLine, writeLine } from '../src/core/terminal-output.js';
import { resolveTrustedGit } from '../src/core/trusted-git.js';
import {
  VALID_INDEX_DOCUMENT,
  VALID_SCOPE_DOCUMENT,
} from '../src/validators/operator-profile/operator-profile-fixtures.js';
import { hermeticGitEnv } from './hermetic-git-env.js';

/**
 * Sync smoke for the built `operator-profile-sync` entry against a temporary
 * profile repository under the OS temp dir (never the home directory): a
 * pull that delivers a symbolic link never writes a link into the profile
 * tree, the one behaviour only real git can show.
 *
 * A remote's second commit replaces `repos/` with a link to a directory
 * outside the root, written into the index with git's plumbing, so the
 * fixture needs no symlink privilege on any host (native Windows grants one
 * only in Developer Mode or elevated). After `pull`, `repos` in the root is
 * a plain file
 * holding the link's text (the runner checks out with `core.symlinks=false`
 * on every call), and the profile check refuses that entry by name. The
 * fixture's git and both entries run in a hermetic environment, so no
 * machine's git configuration (a global `core.symlinks`, signing, hooks)
 * can pass or fail this smoke.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const entry = (name: string) =>
  resolve(repoRoot, `agent-tools/dist/src/validators/operator-profile/${name}.js`);
const GIT = resolveTrustedGit();

const failures: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) {
    failures.push(message);
  }
}

const base = mkdtempSync(join(tmpdir(), 'operator-profile-sync-link-smoke-'));
const env = hermeticGitEnv(base);

/** Git for the fixture: the trusted binary, a fixed identity, the hermetic environment. */
function git(cwd: string, args: readonly string[], input?: string): string {
  const run = spawnSync(
    GIT,
    ['-c', 'user.name=Profile Smoke', '-c', 'user.email=profile-smoke@example.invalid', ...args],
    { cwd, env, encoding: 'utf8', input },
  );
  if (run.status !== 0) {
    throw new Error(`fixture git ${args.join(' ')} failed: ${run.stderr}`);
  }
  return run.stdout.trim();
}

function runEntry(name: string, args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [entry(name), ...args], {
    cwd: repoRoot,
    env,
    encoding: 'utf8',
  });
}

try {
  const remote = join(base, 'remote.git');
  const seed = join(base, 'seed');
  const root = join(base, 'profile');
  const outside = join(base, 'outside');
  mkdirSync(join(seed, 'repos'), { recursive: true });
  mkdirSync(outside, { recursive: true });
  writeFileSync(join(outside, 'owner--outside.md'), VALID_SCOPE_DOCUMENT, 'utf8');

  git(base, ['init', '-q', '--bare', '-b', 'main', remote]);
  git(base, ['init', '-q', '-b', 'main', seed]);
  writeFileSync(join(seed, 'index.md'), VALID_INDEX_DOCUMENT, 'utf8');
  writeFileSync(join(seed, 'repos', 'owner--repo.md'), VALID_SCOPE_DOCUMENT, 'utf8');
  git(seed, ['add', '--', 'index.md', 'repos']);
  git(seed, ['commit', '-q', '-m', 'one: a conforming profile']);
  git(seed, ['remote', 'add', 'origin', remote]);
  git(seed, ['push', '-q', '-u', 'origin', 'main']);
  git(base, ['clone', '-q', remote, root]);

  git(seed, ['rm', '-q', '-r', '--cached', '--', 'repos']);
  const linkBlob = git(seed, ['hash-object', '-w', '--stdin'], outside);
  git(seed, ['update-index', '--add', '--cacheinfo', `120000,${linkBlob},repos`]);
  git(seed, ['commit', '-q', '-m', 'two: repos becomes a link outside the root']);
  git(seed, ['push', '-q', 'origin', 'main']);

  const pulled = runEntry('operator-profile-sync', ['pull', '--root', root]);
  check(
    pulled.status === 0,
    `pull expected exit 0, got ${String(pulled.status)}\n${pulled.stdout}${pulled.stderr}`,
  );
  const reposEntry = lstatSync(join(root, 'repos'), { throwIfNoEntry: false });
  check(reposEntry !== undefined, 'the pull left no repos entry at all');
  check(
    reposEntry !== undefined && !reposEntry.isSymbolicLink() && reposEntry.isFile(),
    'the pull wrote repos as a symbolic link: the runner checked out a link into the profile tree',
  );

  // The check prints each refused entry's own path on a line of its own, so
  // the exact line names this entry, never a `repos/<scope-key>.md` in the
  // text of some other refusal.
  const checked = runEntry('validate-operator-profile', ['--root', root]);
  check(
    checked.status === 1 &&
      checked.stdout.split('\n').some((line) => line.trim() === 'repos') &&
      checked.stdout.includes('not part of the profile layout'),
    `the check expected to refuse the stray repos file by name, got ${String(checked.status)}\n${checked.stdout}${checked.stderr}`,
  );
} finally {
  rmSync(base, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) {
    writeErrorLine(`operator-profile sync-link smoke: ${failure}`);
  }
  process.exitCode = 1;
} else {
  writeLine(
    'operator-profile sync-link smoke OK: a pulled link arrived as a plain file, never a link, and the check refused that entry by name',
  );
}
