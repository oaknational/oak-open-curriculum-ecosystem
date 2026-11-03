/**
 * The POSIX shell a smoke or fixture spawns, resolved by ABSOLUTE path.
 *
 * @remarks
 * Spawning `sh` by name lets the OS search `PATH` (SonarCloud S4036, "OS
 * commands should not rely on PATH resolution"), and pinning the child's
 * `PATH` does not clear the finding: the analyser flags the by-name call
 * whatever `env.PATH` holds (the `git` history of this is in
 * `trusted-git.ts`). This resolver returns the shell from a fixed,
 * platform-partitioned allowlist of complete paths, drawn from the same
 * directories `smoke-tests/trusted-shell-directories.ts` hands children as
 * their whole `PATH`: `/usr/bin` and `/bin` on POSIX; Git for Windows'
 * `usr\bin` and `bin` on win32, where the shell is `sh.exe`. When none
 * exists it returns `err` naming every searched path, so a missing shell
 * reads as itself and not as a downstream `ENOENT` (the `Result` shape of
 * its `gh` sibling, `resolveTrustedGh`).
 *
 * `platform` is injected (defaulting to `process.platform`) so both
 * branches are provable from any host.
 *
 * @packageDocumentation
 */
import { existsSync } from 'node:fs';

import { err, ok, type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';

/** Fixed, complete paths that may hold `sh`, partitioned by platform (each probed as-is, never via `PATH`). */
const TRUSTED_SHELL_PATHS = {
  posix: ['/usr/bin/sh', '/bin/sh'],
  win32: [
    String.raw`C:\Program Files\Git\usr\bin\sh.exe`,
    String.raw`C:\Program Files\Git\bin\sh.exe`,
  ],
} as const;

/** The platform's candidate shells, in probe order. */
function trustedShellCandidates(platform: NodeJS.Platform): readonly string[] {
  return platform === 'win32' ? TRUSTED_SHELL_PATHS.win32 : TRUSTED_SHELL_PATHS.posix;
}

/**
 * Resolve the absolute path to a POSIX `sh` from the platform's fixed allowlist.
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @param platform - Platform selector; defaults to `process.platform`.
 * @returns `ok` with the absolute path to a trusted shell, or `err` naming
 *   every searched path when none exists for the platform.
 */
export function resolveTrustedShell(
  exists: PathExists = existsSync,
  platform: NodeJS.Platform = process.platform,
): Result<string, Error> {
  const candidates = trustedShellCandidates(platform);
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return ok(candidate);
    }
  }
  return err(
    new Error(
      `No trusted sh found. Searched: ${candidates.join(', ')}. ` +
        `The shell is resolved by a fixed absolute path from these locations (never via PATH) ` +
        `to defeat PATH-search hijacking (SonarCloud S4036); on win32 install Git for Windows.`,
    ),
  );
}
