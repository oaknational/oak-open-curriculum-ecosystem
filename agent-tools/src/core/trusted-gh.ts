/**
 * Shared hardening for invoking the `gh` (GitHub CLI) binary from agent tooling.
 *
 * @remarks
 * Resolving `gh` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"). {@link resolveTrustedGh}
 * returns the absolute path from a fixed, platform-partitioned allowlist of
 * complete binary paths through the one resolver in `trusted-binary.ts`,
 * which carries the full rationale. This is the FIX in code, not a Sonar
 * disposition, and the only pattern the spawn lane uses to locate `gh`. It
 * returns a `Result` (ADR-088) rather than throwing.
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';

import { type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';
import { resolveTrustedBinary, type TrustedBinarySpec } from './trusted-binary.js';

/**
 * The `gh` allowlist and remedy. POSIX: Homebrew first — `gh` is most often a
 * Homebrew install. Windows: the GitHub CLI installer's `Program Files`
 * location (admin-protected ACL), 64-bit then 32-bit.
 */
const TRUSTED_GH: TrustedBinarySpec = {
  name: 'gh',
  label: 'gh (GitHub CLI)',
  paths: {
    posix: ['/opt/homebrew/bin/gh', '/usr/local/bin/gh', '/usr/bin/gh', '/bin/gh'],
    win32: [
      String.raw`C:\Program Files\GitHub CLI\gh.exe`,
      String.raw`C:\Program Files (x86)\GitHub CLI\gh.exe`,
    ],
  },
  remedyFor: (platform) =>
    platform === 'win32'
      ? `If gh is installed per-user or portably, install the GitHub CLI system-wide instead ` +
        `(winget install GitHub.cli): per-user locations are writable without administrator ` +
        `rights, so they cannot be trusted here.`
      : `If gh is installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it at one of ` +
        `those paths.`,
};

/**
 * Resolve the absolute path to `gh` from the platform's fixed allowlist of
 * complete binary paths ({@link TRUSTED_GH}).
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @param platform - Platform selector; defaults to `process.platform`.
 * @returns `ok` with the absolute path to a trusted `gh` binary, or `err` when
 *   none exists at any trusted path for the platform.
 */
export function resolveTrustedGh(
  exists: PathExists = existsSync,
  platform: NodeJS.Platform = process.platform,
): Result<string, Error> {
  return resolveTrustedBinary(TRUSTED_GH, exists, platform);
}
