/**
 * Shared hardening for invoking the `git` binary from agent tooling.
 *
 * @remarks
 * Resolving `git` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"): a user-writable `PATH`
 * entry can shadow `git` with a malicious binary. The rule's documented
 * compliant fix is to execute git by its ABSOLUTE path. {@link resolveTrustedGit}
 * returns that absolute path from a fixed allowlist of well-known system
 * directories — this is the FIX in code, not a Sonar disposition, and the only
 * pattern agent tooling uses to locate `git`. The security property is the
 * *fixed absolute path* (resolution never consults `PATH`), not any guarantee
 * that the listed directories are non-writable — some (e.g. Homebrew's
 * `/opt/homebrew/bin` or `/usr/local/bin`) are commonly user-owned. (Pinning
 * `PATH` to a trusted directory does NOT clear S4036: the analyser flags the
 * by-name call regardless of any `env.PATH` override, so that approach was
 * replaced outright.)
 *
 * Only this fixed allowlist is searched; an arbitrary or non-standard git
 * location (asdf/mise shims, the Nix store, a custom prefix) is not — accepting
 * a caller-influenced path is the S4036 hole itself. When git lives only in such
 * a location, {@link resolveTrustedGit} fails loud with the remedy rather than
 * silently returning an unverified path.
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';

/** Fixed, well-known directories that may hold the `git` binary (searched by absolute path, never via `PATH`). */
const TRUSTED_GIT_DIRS = ['/usr/bin', '/bin', '/opt/homebrew/bin', '/usr/local/bin'] as const;

/** Existence-probe seam — injectable so {@link resolveTrustedGit} is testable without a real filesystem. */
export type PathExists = (candidate: string) => boolean;

/**
 * Resolve the absolute path to `git` from a fixed allowlist of well-known system
 * directories ({@link TRUSTED_GIT_DIRS}).
 *
 * @remarks
 * Executing git by absolute path — not by name via `PATH` — defeats
 * PATH-hijacking (SonarCloud S4036, the compliant fix). When no trusted git is
 * found this **throws** a clear, actionable error naming the searched
 * directories and the remedy: it never returns an unverified path (a silent
 * failure that would surface downstream as an opaque `ENOENT` from the caller's
 * `execFileSync`, in the commit-msg hook blocking every commit). Callers run
 * inside their own error handling, so the loud throw replaces a cryptic
 * downstream crash with a diagnosable one.
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @returns The absolute path to a trusted `git` binary.
 * @throws when no `git` exists in any trusted directory.
 */
export function resolveTrustedGit(exists: PathExists = existsSync): string {
  for (const dir of TRUSTED_GIT_DIRS) {
    const candidate = `${dir}/git`;
    if (exists(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `No trusted git binary found. Searched: ${TRUSTED_GIT_DIRS.join(', ')}. ` +
      `git is resolved by a fixed absolute path from these well-known directories (never via PATH) ` +
      `to defeat PATH-search hijacking (SonarCloud S4036). ` +
      `If git is installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it into one of ` +
      `those directories.`,
  );
}
