import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isErr } from '@oaknational/result';
import { z } from 'zod';

import { resolvePnpm } from '../src/spawn/pnpm-path.js';

/**
 * Prove the root pnpm preinstall hook blocks a mismatched pnpm before it can
 * rewrite an incompatible lockfile.
 *
 * The fixture copies the guard source and wires it as a real `pnpm:devPreinstall`
 * hook, then runs the installed pnpm binary against a lockfile pnpm would
 * rewrite. The guard must be the process that refuses the install, and the
 * lockfile bytes must remain identical. The guard's refusal is read from its
 * own stderr log (the hook redirects it), never from pnpm's stream, because
 * pnpm's forwarding of lifecycle output differs by runner and by major.
 *
 * The fixture lockfile is in the current format (`lockfileVersion: '9.0'`), so
 * every supported pnpm parses it and reaches the preinstall hook — pnpm refuses
 * a format it does not support before any hook runs, which would leave the
 * guard unexercised. Its recorded `autoInstallPeers: false` differs from
 * pnpm's default, so without the guard pnpm re-resolves and rewrites it
 * (observed on pnpm 11.20.0, 12.16.1 and 12.17.0, 2026-11-03); byte-identity
 * therefore proves the guard refused before pnpm wrote.
 *
 * Fixture layout — why the mismatched pin is NOT at the install root. The guard
 * fires when the `packageManager` pin differs from the running pnpm. But a
 * mismatched `packageManager` at the INSTALL ROOT makes a self-managing pnpm
 * (the standalone pnpm executable that CI's `pnpm/action-setup` installs) try to
 * download that exact version FIRST — before any lifecycle script — and abort
 * the install for the wrong reason (a registry fetch of a pnpm version that does
 * not exist). That self-download cannot be disabled by config
 * (`manage-package-manager-versions`, `.npmrc`, `pnpm-workspace.yaml`,
 * `COREPACK_*` were all verified ineffective against the standalone). A local
 * pnpm that does not self-manage masks this, so the failure is clean-runner-only.
 *
 * So the install root carries NO `packageManager` (pnpm has nothing to switch to
 * and runs the real install), while the mismatched pin lives in a nested
 * directory that IS the guard's own root — the guard resolves its manifest as
 * `dirname(script)/../package.json`, so it reads the nested pin and compares it
 * to the running pnpm. This exercises the guard's real mismatch branch on any
 * pnpm, self-managing or not.
 */

// `fail` exits the process, which skips any `finally`, so it removes the
// fixture itself; until the fixture exists there is nothing to remove.
let removeFixture = (): void => undefined;

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const rootPackageJson = z
  .object({
    // The nested fixture supplies its own pin, so also assert the REAL root the
    // production guard resolves still carries a valid `pnpm@<version>` pin —
    // otherwise a removed/corrupted pin (guard emits "must pin pnpm" instead of
    // the mismatch) would slip past this smoke.
    packageManager: z.string().regex(/^pnpm@[^+\s]+/u),
    scripts: z.object({ 'pnpm:devPreinstall': z.string() }),
  })
  .safeParse(JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')));
if (!rootPackageJson.success) {
  fail(
    `root package.json must pin pnpm and wire pnpm:devPreinstall: ${rootPackageJson.error.message}`,
  );
}
const devPreinstall = rootPackageJson.data.scripts['pnpm:devPreinstall'];
const guardRelativePath = 'runtime-only-scripts/validate-package-manager-version.mjs';

if (devPreinstall !== `node ${guardRelativePath}`) {
  fail(`root pnpm:devPreinstall must invoke the version guard, got: ${devPreinstall}`);
}

const fixtureRoot = mkdtempSync(join(tmpdir(), 'oak-install-version-guard-'));
removeFixture = (): void => {
  rmSync(fixtureRoot, { recursive: true, force: true });
};
// The guard and the mismatched pin live in a nested dir (see docstring); the
// install root deliberately carries no `packageManager`.
const pinnedRoot = join(fixtureRoot, 'pinned');
const fixtureGuardPath = join(pinnedRoot, guardRelativePath);
// The guard's own stderr goes to a file the smoke reads back, because whether
// pnpm forwards a lifecycle script's output depends on the runner: the macOS
// standalone forwards it under --reporter=silent, the Linux pnpm 12 executor
// reports only "lifecycle script failed" and drops the script's lines. The
// log is the guard's testimony; pnpm's exit status is the install's.
const guardLogName = 'guard-stderr.log';
const fixtureDevPreinstall = `node pinned/${guardRelativePath} 2>>${guardLogName}`;
const originalLockfile = [
  "lockfileVersion: '9.0'",
  '',
  'settings:',
  '  autoInstallPeers: false',
  '  excludeLinksFromLockfile: false',
  '',
  'importers:',
  '',
  '  .: {}',
  '',
].join('\n');

try {
  mkdirSync(dirname(fixtureGuardPath), { recursive: true });
  copyFileSync(join(repoRoot, guardRelativePath), fixtureGuardPath);
  // Install-root manifest: NO `packageManager`, so a self-managing pnpm has
  // nothing to switch to and runs the real install (firing the hook below).
  writeFileSync(
    join(fixtureRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'install-version-guard-smoke',
        private: true,
        type: 'module',
        scripts: { 'pnpm:devPreinstall': fixtureDevPreinstall },
      },
      undefined,
      2,
    )}\n`,
  );
  // The manifest the guard reads (its `dirname(script)/..`): the mismatched pin.
  writeFileSync(
    join(pinnedRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'install-version-guard-smoke-pinned',
        private: true,
        packageManager: 'pnpm@99.1.2+sha512.fixture',
      },
      undefined,
      2,
    )}\n`,
  );
  writeFileSync(join(fixtureRoot, 'pnpm-lock.yaml'), originalLockfile);

  const pnpm = resolvePnpm(process.env);
  if (isErr(pnpm)) {
    fail(pnpm.error.message);
  }

  // The fixture root has no `packageManager`, so whichever pnpm `resolvePnpm`
  // finds runs the install itself, and the proof has to hold on every
  // supported major; the guard's words come from its own log, so pnpm's
  // reporter can stay silent.
  const install = spawnSync(
    pnpm.value.file,
    [
      ...pnpm.value.leadingArgs,
      'install',
      '--offline',
      '--ignore-workspace',
      '--reporter=silent',
      // pnpm defaults `frozen-lockfile` to on when it detects a CI runner, and
      // that mode checks the lockfile against the configuration BEFORE any
      // lifecycle script runs: the fixture's recorded settings differ from
      // pnpm's defaults (the difference that makes pnpm rewrite it), so a
      // frozen install would refuse it there and the guard would never fire,
      // proving pnpm's lockfile check rather than the guard. Off, explicitly,
      // on every runner, so the guard is the process that refuses the install.
      '--no-frozen-lockfile',
    ],
    {
      cwd: fixtureRoot,
      encoding: 'utf8',
      // Every PnpmInvocation carries the environment it must be spawned with
      // (`pnpm.value.env`, already scrubbed of COREPACK_ROOT/HOME and auto-pin
      // settings that could redirect the launcher); the test-specific override
      // overlays it. The install root has no `packageManager`, so there is
      // nothing for corepack to resolve either; `COREPACK_ENABLE_PROJECT_SPEC=0`
      // keeps that path inert regardless of the ambient corepack state.
      env: { ...pnpm.value.env, COREPACK_ENABLE_PROJECT_SPEC: '0' },
    },
  );

  if (install.error !== undefined) {
    fail(`could not start pnpm: ${install.error.message}`);
  }
  if (install.status !== 1) {
    fail(
      `mismatched install must exit 1, got ${String(install.status)}\n${install.stdout}${install.stderr}`,
    );
  }
  let guardLog: string;
  try {
    guardLog = readFileSync(join(fixtureRoot, guardLogName), 'utf8');
  } catch (error) {
    fail(
      `the preinstall guard left no readable ${guardLogName} ` +
        `(${error instanceof Error ? error.message : String(error)}):\n${install.stdout}${install.stderr}`,
    );
  }
  if (!guardLog.includes('does not match the pinned pnpm 99.1.2')) {
    fail(`mismatched install did not report the version mismatch:\n${guardLog}`);
  }
  if (!guardLog.includes('corepack enable')) {
    fail(`mismatched install did not report the Corepack remedy:\n${guardLog}`);
  }

  const finalLockfile = readFileSync(join(fixtureRoot, 'pnpm-lock.yaml'), 'utf8');
  if (finalLockfile !== originalLockfile) {
    fail('mismatched install changed pnpm-lock.yaml before the preinstall guard refused it');
  }

  process.stdout.write(
    'install-version-guard smoke OK: mismatch refused and lockfile remained byte-identical\n',
  );
} finally {
  removeFixture();
}

function fail(message: string): never {
  removeFixture();
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
