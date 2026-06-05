/**
 * Pure decision logic for the fail-closed PreToolUse guard shim
 * (`.claude/hooks/run-pretooluse-guard.mjs`).
 *
 * Extracted so the security-critical exit-code mapping is unit-tested in
 * isolation; the shim imports this committed source directly (Node strips the
 * types at runtime) and stays a thin IO orchestrator.
 *
 * @packageDocumentation
 */

/**
 * Map a spawned guard's outcome to the hook exit code, failing closed.
 *
 * Claude Code blocks a tool call only on exit 2; exit 1 (and any other non-zero)
 * is non-blocking and lets the tool proceed. The guards only ever exit `0`
 * (allow, or a stdout deny-payload) or `2` (fail closed). Treat those as a
 * closed set: a signal kill (`status === null`), a broken module load
 * (`status === 1`), or any other value is an unavailable guard and must block.
 *
 * The signature takes only the child's `code` and `signal` — never the
 * break-glass env — so a present-but-broken guard cannot be bypassed.
 *
 * @param code - The child process exit code, or `null` when killed by a signal.
 * @param signal - The terminating signal, or `null` on a normal exit.
 * @returns `0` only for a clean allow; `2` (block) for every other outcome.
 *
 * @example
 *
 * ```ts
 * resolveGuardExitCode(null, 'SIGKILL'); // 2 — killed, fail closed
 * resolveGuardExitCode(1, null);         // 2 — broken build, fail closed
 * resolveGuardExitCode(0, null);         // 0 — allow
 * ```
 */
export function resolveGuardExitCode(code: number | null, signal: NodeJS.Signals | null): number {
  if (signal !== null) {
    return 2;
  }
  if (code === 0 || code === 2) {
    return code;
  }
  return 2;
}
