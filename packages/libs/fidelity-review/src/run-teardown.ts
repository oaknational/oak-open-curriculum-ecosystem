/*
 * Interrupted-run teardown (assurance LC-1's signal leg): SIGINT/SIGTERM
 * must reap what the run spawned — the dev-server child is deliberately
 * detached for group-kill semantics, so the shell will not reap it and
 * an interrupt would orphan the group. Pure over an injected
 * process-like, so registration, teardown-once, and unregistration all
 * prove with a plain fake.
 *
 * LC-1's bracket obligation is otherwise discharged where the resources
 * live: captureAndReport is the proven server teardown bracket (every
 * exit path, including throw), and each capture arm brackets its
 * browser with try/finally at the IO-composition tier. A second generic
 * bracket abstraction had no consumer and was deliberately not kept
 * (closed-shape: no dead exports).
 */
import { type Result } from '@oaknational/result';

/** The process surface the reaper drives — structural over the Node
 *  process global so a plain fake proves registration, teardown-once,
 *  and unregistration. */
export interface SignalProcess {
  readonly on: (signal: 'SIGINT' | 'SIGTERM', handler: () => void) => unknown;
  readonly off: (signal: 'SIGINT' | 'SIGTERM', handler: () => void) => unknown;
  readonly exit: (code: number) => void;
}

/**
 * Reap a spawned server on SIGINT/SIGTERM: without this, interrupting
 * the CLI orphans the detached dev-server group (it is deliberately
 * detached for group-kill semantics, so the shell will not reap it).
 * Returns the unregister function the run's finally calls; the
 * teardown itself runs at most once even under a double signal.
 */
export function registerRunTeardown(
  stop: () => Promise<Result<void, string>>,
  proc: SignalProcess,
): () => void {
  let fired = false;
  const handler = (): void => {
    if (fired) {
      return;
    }
    fired = true;
    void stop().finally(() => {
      proc.exit(130);
    });
  };
  proc.on('SIGINT', handler);
  proc.on('SIGTERM', handler);
  return () => {
    proc.off('SIGINT', handler);
    proc.off('SIGTERM', handler);
  };
}
