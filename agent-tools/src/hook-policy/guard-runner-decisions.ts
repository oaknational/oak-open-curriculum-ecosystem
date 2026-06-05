/**
 * Pure verdict logic for the PreToolUse guard shim
 * (`.claude/hooks/run-pretooluse-guard.mjs`).
 *
 * Extracted so the security-critical decisions are unit-tested in isolation; the
 * shim imports this committed source directly (Node strips the types at runtime)
 * and stays a thin IO orchestrator. Two verdicts live here:
 * {@link resolveGuardExitCode} (a present guard's outcome — fails closed) and
 * {@link decideMissingGuardArtifact} (an unbuilt guard — fails open, loudly).
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

/**
 * Rebuild hint embedded in the missing-artefact warning. The single source of
 * truth for the recovery command within this module; `.agent/hooks/README.md`
 * mirrors the same command in prose (Markdown cannot import this constant).
 */
export const GUARD_REBUILD_HINT =
  'pnpm install (postinstall builds dist) or pnpm agent-tools:build';

/** The shim's verdict when a guard artefact is not built. */
export interface MissingGuardArtifactDecision {
  /** Always `0` (allow): a not-built guard fails OPEN, not closed. */
  readonly exitCode: 0;
  /** Loud warning naming the missing artefact and the rebuild command. */
  readonly warning: string;
}

/**
 * Decide what the shim does when a PreToolUse guard artefact is **not built**.
 *
 * Fail OPEN (exit `0`) with a loud warning, so a fresh checkout or branch-switched
 * worktree can run the build instead of being bricked — blocking here would also
 * block the `pnpm install` / `pnpm agent-tools:build` needed to recover, an
 * unrecoverable catch-22. This is deliberately distinct from a *present-but-broken*
 * guard (crashed, killed, or a failed module load), which still fails closed via
 * {@link resolveGuardExitCode}: a built guard that misbehaves is a more suspicious
 * signal than one that simply is not built yet.
 *
 * The "loud" warning is the observability guarantee: on an exit-`0` allow the harness
 * does not surface the hook's stderr, so the caller persists this to a durable log.
 *
 * Takes only the artefact path — never the guarded command or edited content — so no
 * caller payload (and thus no PII) can leak into the warning or the log.
 *
 * @param guardRelative - The repo-relative path of the guard artefact that is missing.
 * @returns An allow verdict (`exitCode: 0`) plus the loud warning to emit.
 *
 * @example
 *
 * ```ts
 * decideMissingGuardArtifact('agent-tools/dist/src/hook-policy/check-blocked-patterns.js');
 * // { exitCode: 0, warning: 'PreToolUse guard not built: … ran UNGUARDED. Rebuild: …' }
 * ```
 */
export function decideMissingGuardArtifact(guardRelative: string): MissingGuardArtifactDecision {
  return {
    exitCode: 0,
    warning:
      `PreToolUse guard not built: ${guardRelative} — this tool call ran UNGUARDED. ` +
      `Rebuild: ${GUARD_REBUILD_HINT}.`,
  };
}
