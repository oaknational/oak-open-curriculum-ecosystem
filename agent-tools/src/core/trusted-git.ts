/**
 * Shared hardening for invoking the `git` binary from agent tooling.
 *
 * @remarks
 * Resolving `git` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"): a user-writable `PATH`
 * entry can shadow `git` with a malicious binary. The rule's documented
 * compliant fix is to execute git by its ABSOLUTE path. {@link resolveTrustedGit}
 * returns that absolute path from a fixed allowlist of system directories — this
 * is the FIX in code, not a Sonar disposition, and the only pattern agent
 * tooling uses to locate `git`. (Pinning `PATH` to a trusted directory does NOT
 * clear S4036: the analyser flags the by-name call regardless of any `env.PATH`
 * override, so that approach was replaced outright rather than retained.)
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';

/** Fixed, non-user-writable directories that may hold the system `git`. */
const TRUSTED_GIT_DIRS = ['/usr/bin', '/bin', '/opt/homebrew/bin', '/usr/local/bin'] as const;

/**
 * Resolve the absolute path to `git` from a fixed allowlist of system
 * directories ({@link TRUSTED_GIT_DIRS}).
 *
 * @remarks
 * Executing git by absolute path — not by name via `PATH` — defeats
 * PATH-hijacking (SonarCloud S4036, the compliant fix). Returns the first
 * existing candidate, falling back to `/usr/bin/git` so a genuinely missing git
 * surfaces through the caller's own error handling (e.g. `execFileSync`
 * throwing, caught at the call boundary) rather than this resolver throwing.
 *
 * @returns The absolute path to a trusted `git` binary.
 */
export function resolveTrustedGit(): string {
  for (const dir of TRUSTED_GIT_DIRS) {
    const candidate = `${dir}/git`;
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return '/usr/bin/git';
}
