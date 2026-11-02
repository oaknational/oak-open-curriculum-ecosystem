/**
 * The `gitleaks` binary the push secret scan runs, resolved by ABSOLUTE path.
 *
 * @remarks
 * Spawning `gitleaks` by name lets the OS search `PATH` (SonarCloud S4036);
 * this resolver returns it from a fixed, platform-partitioned allowlist of
 * complete paths through the one resolver in `trusted-binary.ts`. POSIX
 * holds the three places the estate installs it: Homebrew (the documented
 * macOS route, `brew install gitleaks`), `/usr/local/bin` (where the CI
 * workflow unpacks the checksum-pinned release), and the distribution's
 * `/usr/bin`. Windows has no administrator-protected install location for
 * gitleaks (the release is a bare archive, and the package managers place
 * it in user-writable space), so the win32 family is empty and the scan is
 * refused there loudly, as `docs/governance/sonar-disposition-policy.md`
 * §S4036 directs, never served from user-writable space.
 *
 * @packageDocumentation
 */
import { existsSync } from 'node:fs';

import { type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';
import { resolveTrustedBinary, type TrustedBinarySpec } from './trusted-binary.js';

/** The `gitleaks` allowlist and remedy. */
const TRUSTED_GITLEAKS: TrustedBinarySpec = {
  name: 'gitleaks',
  paths: {
    posix: ['/opt/homebrew/bin/gitleaks', '/usr/local/bin/gitleaks', '/usr/bin/gitleaks'],
    win32: [],
  },
  remedyFor: (platform) =>
    platform === 'win32'
      ? 'gitleaks has no administrator-protected install location on Windows, so the push ' +
        'secret scan runs only on a POSIX host or in CI.'
      : 'Install it with brew install gitleaks, or symlink an installed gitleaks at one of those paths.',
};

/**
 * Resolve the absolute path to `gitleaks` from the platform's fixed allowlist.
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @param platform - Platform selector; defaults to `process.platform`.
 * @returns `ok` with the absolute path to a trusted `gitleaks`, or `err`
 *   naming every searched path (and the refusal on win32).
 */
export function resolveTrustedGitleaks(
  exists: PathExists = existsSync,
  platform: NodeJS.Platform = process.platform,
): Result<string, Error> {
  return resolveTrustedBinary(TRUSTED_GITLEAKS, exists, platform);
}
