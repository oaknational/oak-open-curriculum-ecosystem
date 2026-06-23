/**
 * Shared hardening constant for invoking the `git` binary from agent tooling.
 *
 * @remarks
 * Resolving `git` through an inherited `PATH` is flagged by SonarCloud S4036
 * because `PATH` can contain user-writable directories (on a dev machine it
 * routinely does — Homebrew, `~/.local/bin`, …), so a shadowing `git` could be
 * executed. The cure is to pin `PATH` to fixed, non-writable system directories
 * when spawning git. This is the single source of that value; each call site sets
 * `env: { ...process.env, PATH: TRUSTED_GIT_PATH }` inline (so the hardening stays
 * visible to static analysis). See `docs/governance/sonar-disposition-policy.md`
 * §S4036 — the FIX path, not a disposition.
 *
 * @packageDocumentation
 */

/** Fixed, non-user-writable directories that hold the system `git`. */
export const TRUSTED_GIT_PATH = '/usr/bin:/bin';
