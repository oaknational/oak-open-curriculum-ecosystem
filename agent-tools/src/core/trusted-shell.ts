/**
 * The POSIX shell a smoke or fixture spawns, resolved by ABSOLUTE path.
 *
 * @remarks
 * Spawning `sh` by name lets the OS search `PATH` (SonarCloud S4036, "OS
 * commands should not rely on PATH resolution"), and pinning the child's
 * `PATH` does not clear the finding. This resolver returns the shell from a
 * fixed, platform-partitioned allowlist of complete paths through the one
 * resolver in `trusted-binary.ts`, drawn from the same directories
 * `smoke-tests/trusted-shell-directories.ts` hands children as their whole
 * `PATH`: `/usr/bin` and `/bin` on POSIX; Git for Windows' `usr\bin` and
 * `bin` on win32, where the shell is `sh.exe`. When none exists it returns
 * `err` naming every searched path, so a missing shell reads as itself and
 * not as a downstream `ENOENT`.
 *
 * @packageDocumentation
 */
import { existsSync } from 'node:fs';

import { type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';
import { resolveTrustedBinary, type TrustedBinarySpec } from './trusted-binary.js';

/** The `sh` allowlist and remedy. */
const TRUSTED_SHELL: TrustedBinarySpec = {
  name: 'sh',
  paths: {
    posix: ['/usr/bin/sh', '/bin/sh'],
    win32: [
      String.raw`C:\Program Files\Git\usr\bin\sh.exe`,
      String.raw`C:\Program Files\Git\bin\sh.exe`,
    ],
  },
  remedyFor: (platform) =>
    platform === 'win32'
      ? String.raw`Install Git for Windows system-wide (winget install Git.Git); its usr\bin\sh.exe is the trusted shell.`
      : 'If sh is installed elsewhere, symlink it at one of those paths.',
};

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
  return resolveTrustedBinary(TRUSTED_SHELL, exists, platform);
}
