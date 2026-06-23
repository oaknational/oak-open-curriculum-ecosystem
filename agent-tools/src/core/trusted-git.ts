/**
 * Shared hardening for invoking the `git` binary from agent tooling.
 *
 * @remarks
 * Resolving `git` through an inherited `PATH` is flagged by SonarCloud S4036
 * because `PATH` can contain user-writable directories (on a dev machine it
 * routinely does — Homebrew, `~/.local/bin`, …), so a shadowing `git` could be
 * executed. The cure is to pin `PATH` to fixed, non-writable system directories
 * when spawning git. This module is the single source of that constant and the
 * env it produces, so every git invocation hardens identically rather than each
 * site re-deciding (or omitting it). See `docs/governance/sonar-disposition-policy.md`
 * §S4036 — the FIX path, not a disposition.
 *
 * @packageDocumentation
 */

/** Fixed, non-user-writable directories that hold the system `git`. */
export const TRUSTED_GIT_PATH = '/usr/bin:/bin';

/**
 * An environment for spawning `git` with `PATH` pinned to {@link TRUSTED_GIT_PATH},
 * so the resolved binary cannot be shadowed via a writable PATH entry.
 *
 * @param baseEnv - The environment to derive from (injected for testability;
 *   defaults to `process.env`).
 * @returns A copy of `baseEnv` with `PATH` replaced by the trusted path.
 */
export function trustedGitEnv(baseEnv: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  return { ...baseEnv, PATH: TRUSTED_GIT_PATH };
}
