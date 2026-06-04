/**
 * Pure decision logic for the agent-tools install bootstrap.
 *
 * The runtime that resolves `tsc`, spawns it, and sets executable bits lives in
 * `bootstrap.ts`; this module isolates the part that must never get the
 * fail-open semantics wrong, so it can be unit-tested in isolation.
 *
 * @packageDocumentation
 */

/** The relevant fields of a `child_process.spawnSync` result for the tsc run. */
export interface TscSpawnOutcome {
  /** A spawn-level error (e.g. the binary could not be started). */
  readonly error: Error | undefined;
  /** The signal that terminated the process, or `null` if it exited normally. */
  readonly signal: NodeJS.Signals | null;
  /** The exit code, or `null` when the process was killed by a signal. */
  readonly status: number | null;
}

/** The verdict on whether the tsc build succeeded and the code to exit with. */
export interface TscOutcomeVerdict {
  /** True when the build did not complete cleanly. */
  readonly failed: boolean;
  /** The process exit code to use. Never `0` when `failed` is true. */
  readonly exitCode: number;
  /** A human-readable failure reason, or `undefined` on success. */
  readonly reason: string | undefined;
}

/**
 * Interpret a spawnSync outcome into a pass/fail verdict with a safe exit code.
 *
 * Critically, a signal kill returns `status === null`; this must map to a
 * non-zero exit code. Coercing a `null` status to `process.exit(null)` would
 * exit `0`, leaving `dist` unbuilt and the fail-open PreToolUse guards without
 * their artefact.
 *
 * @param outcome - The spawnSync error/signal/status triple.
 * @returns The verdict; `exitCode` is always non-zero when `failed` is true.
 *
 * @example
 *
 * ```ts
 * interpretTscOutcome({ error: undefined, signal: 'SIGKILL', status: null });
 * // { failed: true, exitCode: 1, reason: 'tsc was killed by signal SIGKILL' }
 * ```
 */
export function interpretTscOutcome(outcome: TscSpawnOutcome): TscOutcomeVerdict {
  if (outcome.error !== undefined) {
    return { failed: true, exitCode: 1, reason: `failed to start tsc: ${outcome.error.message}` };
  }
  if (outcome.signal !== null) {
    return {
      failed: true,
      exitCode: outcome.status ?? 1,
      reason: `tsc was killed by signal ${outcome.signal}`,
    };
  }
  if (outcome.status !== 0) {
    return {
      failed: true,
      exitCode: outcome.status ?? 1,
      reason: `tsc exited with code ${outcome.status ?? 'null'}`,
    };
  }
  return { failed: false, exitCode: 0, reason: undefined };
}
