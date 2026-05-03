/**
 * Pure boot-outcome classification for the canonical smoke harness.
 *
 * @remarks
 * The harness's boot phase resolves to a {@link BootOutcome}. Three of
 * the four variants are produced by translating an observed condition
 * (env-resolution diagnostic, thrown error, abort signal) into the
 * discriminated-union value. This module owns those translations as
 * pure functions so the boot pipeline can be reasoned about and tested
 * without I/O.
 *
 * **Classification rules** (architecture-reviewer-betty 2026-05-03):
 *
 * - `env-error`: produced ONLY when `loadRuntimeConfig` returns an
 *   `Err<ConfigError>` or `createHttpObservability` returns an error.
 *   Indicates the env passed to the boot pipeline is missing or
 *   invalid.
 * - `crashed`: any synchronous or asynchronous throw during
 *   `createApp` or `app.listen` (including `EADDRINUSE` port
 *   conflicts, Node-level listen errors, and any unexpected exception
 *   from the bootstrap chain). Errno-level details live inside the
 *   wrapped `Error` instance; callers needing programmatic
 *   port-conflict detection should inspect `error.code === 'EADDRINUSE'`.
 * - `timeout`: produced when the boot phase exceeds the mode's
 *   `bootTimeoutMs` and the orchestrator's `AbortSignal` fires. The
 *   harness aborts an in-flight `app.listen` and tears down any
 *   partially-bound server.
 * - `listening`: the only success variant. Carries the bound base
 *   URL and the cleanup callback that tears the server down.
 *
 * @packageDocumentation
 */

import type { BootOutcome } from './types.js';

/**
 * Translates an env-resolution diagnostic message into the
 * `'env-error'` boot outcome.
 *
 * @remarks
 * Used when `loadRuntimeConfig` returns an `Err<ConfigError>` — the
 * server cannot bind because the env is not valid. The harness
 * surfaces the diagnostic message verbatim to aid debugging.
 */
export function envErrorOutcome(message: string): BootOutcome {
  return { kind: 'env-error', message };
}

/**
 * Translates an unexpected thrown error during boot into the
 * `'crashed'` boot outcome.
 *
 * @remarks
 * Used when `createHttpObservability`, `createApp`, or `app.listen`
 * throws synchronously or asynchronously. The original error is
 * preserved (per the no-error-loss rule in `principles.md`).
 */
export function crashedOutcome(error: unknown): BootOutcome {
  if (error instanceof Error) {
    return { kind: 'crashed', error };
  }
  return {
    kind: 'crashed',
    error: new Error(`Non-Error value thrown during boot: ${String(error)}`),
  };
}

/**
 * Builds the `'timeout'` boot outcome.
 *
 * @remarks
 * Produced when the boot phase exceeds {@link SmokeModeConfig.bootTimeoutMs}.
 * The elapsed milliseconds are recorded so test reports can attribute
 * timeouts to specific modes and tune their thresholds.
 */
export function timeoutOutcome(elapsedMs: number): BootOutcome {
  return { kind: 'timeout', elapsedMs };
}

/**
 * Builds the `'listening'` boot outcome.
 *
 * @remarks
 * Produced when `app.listen` resolves with a bound port. The cleanup
 * callback is the harness's only path to graceful server shutdown; it
 * MUST be invoked exactly once on every termination path.
 */
export function listeningOutcome(baseUrl: string, cleanup: () => Promise<void>): BootOutcome {
  return { kind: 'listening', baseUrl, cleanup };
}

/**
 * Type predicate — narrows {@link BootOutcome} to the listening
 * variant. The harness orchestrator uses this to gate the test-phase
 * spawn on a successful boot.
 */
export function isListening(
  outcome: BootOutcome,
): outcome is Extract<BootOutcome, { kind: 'listening' }> {
  return outcome.kind === 'listening';
}
