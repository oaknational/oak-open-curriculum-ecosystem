import { EventEmitter } from 'node:events';

import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { spawnAndAwaitReady, type DevChild } from './dev-server-spawn';

/**
 * The spawn path's ready-wait over injected fakes: no process is spawned or
 * signalled and no socket is opened.
 */

const DEMO_DIR = '/apps/demo';
const BASE = 'http://localhost:3999';

/** A spawned child with `pid` whose leader exits with `code` straight after creation. */
function exitingChild(pid: number, code: number): DevChild {
  const child = Object.assign(new EventEmitter(), { pid, unref: () => undefined });
  queueMicrotask(() => child.emit('exit', code, null));
  return child;
}

/** A ready-wait that never settles, so only the leader's exit can end the wait. */
function neverReady(): Promise<boolean> {
  return new Promise<boolean>(() => undefined);
}

describe('spawnAndAwaitReady', () => {
  it('fails at once when the pnpm leader exits first, stopping the wait and reaping the group', async () => {
    const pid = 4242;
    const code = 1;
    const seen: { stop?: AbortSignal; reaped: number[] } = { reaped: [] };
    const result = await spawnAndAwaitReady(DEMO_DIR, BASE, {
      spawnDev: () => exitingChild(pid, code),
      untilReady: (stop) => {
        seen.stop = stop;
        return neverReady();
      },
      reap: (reapedPid) => {
        seen.reaped.push(reapedPid);
        return Promise.resolve(ok(undefined));
      },
    });
    expect(result.ok).toBe(false);
    const message = result.ok ? undefined : result.error;
    expect(message).toContain(`exit code ${String(code)}`);
    expect(message).toContain('shell-and-tooling-gotchas.md');
    expect(seen.stop?.aborted).toBe(true);
    expect(seen.reaped).toStrictEqual([pid]);
  });

  it('keeps a failed teardown in the error, beside the exit code', async () => {
    const code = 3;
    const teardownFailure = 'dev-server: SIGTERM failed — EPERM';
    const result = await spawnAndAwaitReady(DEMO_DIR, BASE, {
      spawnDev: () => exitingChild(4242, code),
      untilReady: neverReady,
      reap: () => Promise.resolve(err(teardownFailure)),
    });
    expect(result.ok).toBe(false);
    const message = result.ok ? undefined : result.error;
    expect(message).toContain(`exit code ${String(code)}`);
    expect(message).toContain(teardownFailure);
  });
});
