import { interpretSpawnOutcome, type TscSpawnOutcome } from './bootstrap-helpers.js';

/**
 * The install-time shellcheck step's pure verdicts. The root `postinstall`
 * bootstrap runs `.agent/setup/install-shellcheck.sh` so that every checkout
 * that installs has the pinned shellcheck the shell lint gate runs, whatever
 * setup path its reader followed. The installer is a no-op on the present pin
 * and checks the download's sha256 before it extracts anything. A failed
 * install warns and the install goes on: the gate itself still refuses, naming
 * the installer, so nothing lints without the pin.
 *
 * @packageDocumentation
 */

const INSTALLER = 'install-shellcheck.sh';

/**
 * Why the bootstrap leaves the shellcheck install to another surface, or null
 * when it provisions here: a developer's checkout, a linked worktree, a cloud
 * session. A Vercel build runs no shell lint; CI's static-checks job installs
 * the pin itself before the gate, so the other CI jobs make no download.
 *
 * @param env - The install's environment; an empty value counts as unset.
 */
export function shellcheckProvisionSkip(
  env: Readonly<Record<string, string | undefined>>,
): string | null {
  if ((env.VERCEL ?? '') !== '') {
    return 'a Vercel build, which runs no shell lint';
  }
  if ((env.CI ?? '') !== '') {
    return 'CI, where the static-checks job installs it before the gate';
  }
  return null;
}

/**
 * The environment the installer runs under: the install's own, with every
 * directory inside a node_modules tree taken off PATH. pnpm puts dependency
 * bin directories first on a lifecycle script's PATH, so a dependency bin
 * named like a tool the installer calls (uname, mktemp, curl, tar, sed,
 * shasum) would otherwise run in its place; and pnpm's shim for a bin named
 * uname calls uname, which resolves to the shim itself there and forks without
 * end. The installer's hosts are Linux and macOS, so PATH is colon-separated.
 *
 * @param env - The install's environment.
 */
export function shellcheckInstallerEnv(
  env: Readonly<Record<string, string | undefined>>,
): Record<string, string | undefined> {
  if (env.PATH === undefined) {
    return { ...env };
  }
  const path = env.PATH.split(':')
    .filter((entry) => !entry.split('/').includes('node_modules'))
    .join(':');
  return { ...env, PATH: path };
}

/**
 * The warning for an installer run that did not end in the pin, or null when
 * it did.
 *
 * @param outcome - How the installer's process ended.
 */
export function shellcheckProvisionWarning(outcome: TscSpawnOutcome): string | null {
  const verdict = interpretSpawnOutcome(INSTALLER, outcome);
  return verdict.failed
    ? `[bootstrap-agent-tools] the pinned shellcheck was not installed (${verdict.reason ?? `${INSTALLER} failed`}); ` +
        'the install goes on, and the shell lint gate asks for it at the first commit: ' +
        'run .agent/setup/install-shellcheck.sh'
    : null;
}
