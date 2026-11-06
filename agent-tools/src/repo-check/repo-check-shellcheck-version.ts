import { err, ok, type Result } from '@oaknational/result';

import type { RepoCheckCommandResult } from './repo-check-types.js';

/**
 * Which shellcheck the gate runs, and the verdict on its version. shellcheck
 * versions differ in what they report, so the gate runs only the version the
 * installer pins. The installer puts that binary in the repository's own
 * `.tools/bin`, locally, in CI and in a cloud session alike, so a checkout
 * never shares a binary with another repository's pin; the gate runs it when
 * it is there and the shellcheck on PATH otherwise, and checks the version of
 * whichever it runs. The pin lives once, in the installer, and is read from
 * its text.
 *
 * @packageDocumentation
 */

/** The installer holding the pin, relative to the repository root. */
export const SHELLCHECK_INSTALLER = '.agent/setup/install-shellcheck.sh';

/** Where the installer puts the pinned binary, relative to the repository root. */
export const REPO_SHELLCHECK = '.tools/bin/shellcheck';

const PIN_LINE = /^SHELLCHECK_VERSION=(\S+)$/mu;

const VERSION_LINE = /^version:\s*(\S+)\s*$/mu;

/** The remedy for every host the installer pins an asset for. */
const INSTALL_ROUTE = `run ${SHELLCHECK_INSTALLER}, which installs it into .tools/bin, where the gate looks before PATH`;

const INSTALL_HINT = `${INSTALL_ROUTE}. The gate never skips a missing linter`;

/**
 * The shellcheck version the installer pins.
 *
 * @param installerText - The installer script's text.
 * @returns The pinned version, or a failure line when no `SHELLCHECK_VERSION=` line pins one.
 */
export function pinnedShellcheckVersion(installerText: string): Result<string, string> {
  const pinned = PIN_LINE.exec(installerText)?.[1];
  return pinned === undefined
    ? err(`${SHELLCHECK_INSTALLER} has no SHELLCHECK_VERSION= line pinning a version`)
    : ok(pinned);
}

/**
 * The shellcheck to run: the repository's own when the installer has put it
 * in `.tools/bin`, the one on PATH otherwise.
 *
 * @param repoShellcheckInstalled - Whether `.tools/bin/shellcheck` exists.
 * @returns The command to run and how a message names it.
 */
export function resolveShellcheck(repoShellcheckInstalled: boolean): {
  readonly command: string;
  readonly source: string;
} {
  return repoShellcheckInstalled
    ? { command: REPO_SHELLCHECK, source: REPO_SHELLCHECK }
    : { command: 'shellcheck', source: 'the shellcheck on PATH' };
}

/**
 * The verdict on `<shellcheck> --version`: the version when the pinned
 * shellcheck ran, or the failure line when it is missing, is not shellcheck,
 * or is another version.
 *
 * @param probe - The captured `--version` run.
 * @param pinned - The version the installer pins.
 * @param source - How a message names the shellcheck that was probed.
 * @returns The version, or a failure line naming the binary, the cause and the remedy.
 */
export function shellcheckVersion(
  probe: RepoCheckCommandResult,
  pinned: string,
  source: string,
): Result<string, string> {
  if (probe.status !== 0) {
    const ended =
      probe.status === null
        ? `killed by ${probe.signal ?? 'a signal'}`
        : `exit ${String(probe.status)}`;
    const cause = probe.stderr.trim() || ended;
    return err(`${source} could not run (${cause}): ${INSTALL_HINT}`);
  }
  const version = VERSION_LINE.exec(probe.stdout)?.[1];
  if (version === undefined) {
    return err(`${source} printed no version line: ${INSTALL_HINT}`);
  }
  if (version !== pinned) {
    return err(
      `${source} is shellcheck ${version}, and ${SHELLCHECK_INSTALLER} pins ${pinned}: ` +
        `${INSTALL_ROUTE}; or move the pin (its version and every digest together) and fix ` +
        'what the new version reports',
    );
  }
  return ok(version);
}
