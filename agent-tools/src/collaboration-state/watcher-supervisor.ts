/**
 * Supervisor-death detection for the comms watcher (F-101 refined-(i)
 * kill-tree). A watcher is spawned by an agent session and runs in its OWN
 * process group (GNU `timeout` isolates it), so a CLEAN teardown
 * (Monitor `TaskStop`, SIGTERM, timeout expiry) group-kills the whole tree —
 * but a HARSH agent death (crash / SIGKILL) signals nothing, leaving the
 * watcher orphaned and writing a false-liveness heartbeat until the timeout
 * backstop fires (≤ 3600 s).
 *
 * This module cures the harsh path WITHOUT a host `Stop`-hook lease (which it
 * supersedes): the watcher is given the supervising session's pid via
 * `comms watch --supervisor-pid <pid>`, probes it once per poll cycle, and
 * self-exits within one cycle of that pid disappearing. The probe is a
 * signal-0 `process.kill`, injected through {@link SupervisorLivenessRuntime.processIsAlive}
 * so the behaviour is unit-testable without a real process.
 */

import { optionalPositiveInteger, type Options } from './cli-options.js';

/**
 * The narrow supervisor-liveness capability this module consumes — a
 * structural subset of `CliRuntime`. Depending on this slice rather than the
 * whole `CliRuntime` keeps the dependency direction one-way (cli-runtime →
 * watcher-supervisor for the production probe) with no import cycle, and
 * follows interface-segregation: a `CliRuntime` is assignable wherever this is
 * expected.
 */
export interface SupervisorLivenessRuntime {
  readonly processIsAlive?: (pid: number) => boolean;
}

/**
 * Production supervisor-liveness probe: a signal-0 `process.kill`, which sends
 * no signal but performs the existence + permission check. `ESRCH` (no such
 * process) → dead; `EPERM` (exists but not signalable by this user) → alive;
 * any other failure is unexpected and treated as dead so the watcher self-exits
 * rather than lingering on an unclassifiable probe. `kill` is injected for
 * tests so the three error-classification branches are unit-describable without
 * a real process.
 */
export function processIsAliveBySignalZero(
  pid: number,
  kill: (pid: number, signal: 0) => void = process.kill,
): boolean {
  try {
    kill(pid, 0);
    return true;
  } catch (error) {
    return error instanceof Error && 'code' in error && error.code === 'EPERM';
  }
}

/**
 * Resolve the runtime's supervisor-liveness probe for `pid`. Throws when the
 * composition layer did not provide the seam — the same strict fail-fast
 * contract as the other runtime resolvers, so a missing probe surfaces loudly
 * rather than silently disabling the watcher's self-exit.
 */
function processIsAlive(runtime: SupervisorLivenessRuntime, pid: number): boolean {
  if (runtime.processIsAlive === undefined) {
    throw new Error(
      'collaboration-state process-liveness probe must be provided by the composition layer',
    );
  }

  return runtime.processIsAlive(pid);
}

/**
 * Build the watcher's supervisor-liveness probe from `--supervisor-pid`.
 * Optional and graceful-when-absent: no flag → `undefined` (the watcher's
 * lifetime is bounded only by the composing `timeout` backstop, today's
 * behaviour). `optionalPositiveInteger` rejects a malformed pid loudly, so the
 * present-path is strict — no silent fallback masks a bad pid.
 */
export function resolveSupervisorAlive(
  options: Options,
  runtime: SupervisorLivenessRuntime,
): (() => boolean) | undefined {
  const supervisorPid = optionalPositiveInteger(options, 'supervisor-pid');
  if (supervisorPid === undefined) {
    return undefined;
  }

  return (): boolean => processIsAlive(runtime, supervisorPid);
}

/**
 * True when a supervisor-liveness probe is configured AND reports the
 * supervising process gone. Absent probe → always false (the legacy shape:
 * the watcher's lifetime is bounded only by `maxEvents`, a fatal step, or the
 * composing `timeout`). Invoked at the top of each watch-loop iteration so a
 * `true` result short-circuits BEFORE the next drain / emit / wait — the
 * watcher self-exits within one poll cycle of the supervisor's death.
 */
export async function supervisorIsGone(
  supervisorAlive: (() => boolean | Promise<boolean>) | undefined,
): Promise<boolean> {
  if (supervisorAlive === undefined) {
    return false;
  }

  return !(await supervisorAlive());
}
