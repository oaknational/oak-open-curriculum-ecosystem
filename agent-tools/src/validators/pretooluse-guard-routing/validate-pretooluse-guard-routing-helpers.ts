/**
 * Detect PreToolUse hook commands that invoke a dist-built guard directly
 * instead of routing through the verdict shim.
 *
 * The guards live in `agent-tools/dist` (gitignored, built on install). Invoking
 * them directly with `node <missing>.js` exits 1 — which Claude Code treats as a
 * non-blocking error, so a missing/broken guard would *silently* let the tool
 * call proceed unguarded. The shim `.claude/hooks/run-pretooluse-guard.mjs` takes
 * control of the verdict instead: fail closed (exit 2) for a built-but-broken
 * guard, deliberate loud-and-logged fail open for a not-yet-built one. This gate
 * prevents a silent revert to the direct-`node` form, which would reopen the
 * uncontrolled silent fail-open window.
 *
 * The helper is pure; the runtime that reads `.claude/settings.json` lives in
 * `validate-pretooluse-guard-routing.ts`.
 *
 * @packageDocumentation
 */

/** Substring identifying a command that runs a hook-policy guard artefact. */
export const GUARD_COMMAND_MARKER = 'hook-policy/check-blocked';

/** Substring identifying the shim a guard command must route through. */
export const GUARD_ROUTING_SHIM = '.claude/hooks/run-pretooluse-guard.mjs';

/**
 * Return the PreToolUse command strings that run a dist guard directly without
 * routing through the shim.
 *
 * @param commands - PreToolUse hook command strings from `.claude/settings.json`.
 * @returns The offending commands, in input order. Empty when every guard
 *   command routes through the shim.
 *
 * @example
 *
 * ```ts
 * findUnroutedGuardCommands(['node ".../hook-policy/check-blocked-patterns.js"']);
 * // ['node ".../hook-policy/check-blocked-patterns.js"']  (direct → flagged)
 * ```
 */
export function findUnroutedGuardCommands(commands: readonly string[]): string[] {
  return commands.filter(
    (command) => command.includes(GUARD_COMMAND_MARKER) && !command.includes(GUARD_ROUTING_SHIM),
  );
}
