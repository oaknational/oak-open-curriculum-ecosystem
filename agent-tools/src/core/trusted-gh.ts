/**
 * Shared hardening for invoking the `gh` (GitHub CLI) binary from agent tooling.
 *
 * @remarks
 * Resolving `gh` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"): a user-writable `PATH`
 * entry can shadow `gh` with a malicious binary. The documented compliant fix is
 * to execute gh by its ABSOLUTE path. {@link resolveTrustedGh} returns that
 * absolute path from a fixed allowlist of well-known directories — this is the FIX
 * in code, not a Sonar disposition, and the only pattern the spawn lane uses to
 * locate `gh`. The security property is the *fixed absolute path* (resolution
 * never consults `PATH`), not any guarantee that the listed directories are
 * non-writable — some (Homebrew's `/opt/homebrew/bin`, `/usr/local/bin`) are
 * commonly user-owned. This is the `gh` counterpart of the `git` resolver in
 * `trusted-git.ts`; it returns a `Result` (ADR-088) rather than throwing — the
 * shape `trusted-git.ts` is slated to adopt as it comes off the no-throw backlog.
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';

import { err, ok, type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';

/** Fixed, well-known directories that may hold the `gh` binary (searched by absolute path, never via PATH). Homebrew first — `gh` is most often a Homebrew install. */
const TRUSTED_GH_DIRS = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin'] as const;

/**
 * Resolve the absolute path to `gh` from a fixed allowlist of well-known
 * directories ({@link TRUSTED_GH_DIRS}).
 *
 * @remarks
 * Executing gh by absolute path — not by name via `PATH` — defeats PATH-hijacking
 * (SonarCloud S4036, the compliant fix). When no trusted gh is found this returns
 * an `err` (ADR-088, never a throw) naming the searched directories and the
 * remedy, rather than returning an unverified path (a silent failure that would
 * surface downstream as an opaque `ENOENT` from the caller's `execFileSync`).
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @returns `ok` with the absolute path to a trusted `gh` binary, or `err` when
 *   none exists in any trusted directory.
 */
export function resolveTrustedGh(exists: PathExists = existsSync): Result<string, Error> {
  for (const dir of TRUSTED_GH_DIRS) {
    const candidate = `${dir}/gh`;
    if (exists(candidate)) {
      return ok(candidate);
    }
  }
  return err(
    new Error(
      `No trusted gh (GitHub CLI) binary found. Searched: ${TRUSTED_GH_DIRS.join(', ')}. ` +
        `gh is resolved by a fixed absolute path from these well-known directories (never via PATH) ` +
        `to defeat PATH-search hijacking (SonarCloud S4036). ` +
        `If gh is installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it into one of ` +
        `those directories.`,
    ),
  );
}
