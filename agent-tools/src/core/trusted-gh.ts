/**
 * Shared hardening for invoking the `gh` (GitHub CLI) binary from agent tooling.
 *
 * @remarks
 * Resolving `gh` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"): a user-writable `PATH`
 * entry can shadow `gh` with a malicious binary. The documented compliant fix is
 * to execute gh by its ABSOLUTE path. {@link resolveTrustedGh} returns that
 * absolute path from a fixed, platform-partitioned allowlist of complete binary
 * paths — this is the FIX in code, not a Sonar disposition, and the only pattern
 * the spawn lane uses to locate `gh`. The security property is the *fixed
 * absolute path* (resolution never consults `PATH`), not any guarantee that
 * every listed location is non-writable — some POSIX entries (Homebrew's
 * `/opt/homebrew/bin`, `/usr/local/bin`) are commonly user-owned. This is the
 * `gh` counterpart of the `git` resolver in `trusted-git.ts`; it returns a
 * `Result` (ADR-088) rather than throwing — the shape `trusted-git.ts` is
 * slated to adopt as it comes off the no-throw backlog.
 *
 * The allowlist is partitioned by platform (see `trusted-git.ts` for the full
 * rationale): rooted POSIX paths are drive-relative on win32 and a `C:\...`
 * literal is a legal relative filename on POSIX, so each family is only ever
 * consulted on its own platform, and the Windows literals are hard-coded
 * rather than derived from `%ProgramFiles%` (an environment-influenced path is
 * the S4036 hole restated).
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';

import { err, ok, type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';

/**
 * Fixed, complete paths that may hold the `gh` binary, partitioned by platform
 * (each probed as-is, never via `PATH`). POSIX: Homebrew first — `gh` is most
 * often a Homebrew install. Windows: the GitHub CLI installer's `Program Files`
 * location (admin-protected ACL), 64-bit then 32-bit.
 */
const TRUSTED_GH_PATHS = {
  posix: ['/opt/homebrew/bin/gh', '/usr/local/bin/gh', '/usr/bin/gh', '/bin/gh'],
  win32: [
    String.raw`C:\Program Files\GitHub CLI\gh.exe`,
    String.raw`C:\Program Files (x86)\GitHub CLI\gh.exe`,
  ],
} as const;

/** The platform family's candidate list — win32 gets the Windows entries, every other platform the POSIX entries. */
function trustedGhCandidates(platform: NodeJS.Platform): readonly string[] {
  return platform === 'win32' ? TRUSTED_GH_PATHS.win32 : TRUSTED_GH_PATHS.posix;
}

/** The platform-correct remedy for a refusal — actionable advice differs by OS. */
function remedyFor(platform: NodeJS.Platform): string {
  return platform === 'win32'
    ? `If gh is installed per-user or portably, install the GitHub CLI system-wide instead ` +
        `(winget install GitHub.cli): per-user locations are writable without administrator ` +
        `rights, so they cannot be trusted here.`
    : `If gh is installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it at one of ` +
        `those paths.`;
}

/**
 * Resolve the absolute path to `gh` from the platform's fixed allowlist of
 * complete binary paths ({@link TRUSTED_GH_PATHS}).
 *
 * @remarks
 * Executing gh by absolute path — not by name via `PATH` — defeats
 * PATH-hijacking (SonarCloud S4036, the compliant fix). When no trusted gh is
 * found this returns an `err` (ADR-088, never a throw) naming the searched
 * paths and the platform's remedy, rather than returning an unverified path (a
 * silent failure that would surface downstream as an opaque `ENOENT` from the
 * caller's `execFileSync`). `platform` is injected (defaulting to
 * `process.platform`) so each platform branch is provable from any host.
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
  const candidates = trustedGhCandidates(platform);
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return ok(candidate);
    }
  }
  return err(
    new Error(
      `No trusted gh (GitHub CLI) binary found. Searched: ${candidates.join(', ')}. ` +
        `gh is resolved by a fixed absolute path from these well-known locations (never via PATH) ` +
        `to defeat PATH-search hijacking (SonarCloud S4036). ${remedyFor(platform)}`,
    ),
  );
}
