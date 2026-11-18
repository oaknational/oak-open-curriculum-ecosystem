/**
 * Every agent-tools launcher that runs pnpm by name launches it on this
 * platform.
 *
 * Tooling invokes pnpm by name, with `PATH` as the trust root (§S4036 in
 * `docs/governance/sonar-disposition-policy.md`). On native Windows, pnpm is
 * commonly a `pnpm.cmd` shim (Corepack, an npm-installed pnpm), and a
 * shell-less `spawn` cannot launch one: libuv tries only `.com` and `.exe`,
 * and Node refuses `.cmd` without a shell. The unit suite injects fakes, so
 * only a real launch proves the launchers; `windows-basic` runs this smoke so
 * the Windows case is gated in CI.
 *
 * Each proof runs `pnpm --version`, which needs no workspace state. The
 * control, a plain shell-less `spawnSync('pnpm')`, is reported and not
 * asserted: where it fails and the launchers pass, the run shows the proofs
 * discriminate.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { runPnpmGate } from '../src/bin/claude-agent-ops-process';
import { runFileBackedChild, textReplaySinks } from '../src/core/file-backed-child';
import { realPnpmRunner } from '../src/spawn/build-runner';

const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHECK_COMMIT_MESSAGE = fileURLToPath(
  new URL('../src/commit-advisories/check-commit-message.ts', import.meta.url),
);
const VERSION_LINE = /^\d+\.\d+\.\d+/mu;

const control = spawnSync('pnpm', ['--version'], { cwd: PACKAGE_ROOT, stdio: 'ignore' });
const controlFailure = control.error?.message ?? 'status ' + String(control.status);
const controlOutcome =
  control.status === 0 ? 'launched' : 'did not launch (' + controlFailure + ')';
process.stdout.write(
  `pnpm-by-name smoke: control, a plain spawnSync('pnpm') on ${process.platform}, ${controlOutcome}\n`,
);

assert.equal(runPnpmGate('--version', PACKAGE_ROOT), true, 'claude-agent-ops runPnpmGate');

const built = realPnpmRunner(['--version'], PACKAGE_ROOT);
assert.ok(built.ok, `build-runner realPnpmRunner: ${built.ok ? '' : built.error.message}`);

let captured = '';
const child = await runFileBackedChild({
  command: 'pnpm',
  args: ['--version'],
  cwd: PACKAGE_ROOT,
  replaySinks: textReplaySinks({ write: (chunk: string) => (captured += chunk) }),
});
assert.equal(child.exitCode, 0, `file-backed child (the commit workflow's runner):\n${captured}`);
assert.match(captured, VERSION_LINE, 'file-backed child replays the pnpm version');

const commitlint = spawnSync(
  process.execPath,
  [
    '--import',
    'tsx',
    CHECK_COMMIT_MESSAGE,
    '-m',
    'test(agent-tools): launch commitlint through pnpm by name',
  ],
  { cwd: PACKAGE_ROOT, encoding: 'utf8' },
);
assert.equal(
  commitlint.status,
  0,
  `check-commit-message:\nstdout:\n${commitlint.stdout}\nstderr:\n${commitlint.stderr}`,
);

process.stdout.write('pnpm-by-name smoke: 4/4 launchers launched pnpm\n');
