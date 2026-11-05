import { EventEmitter } from 'node:events';

import { err, ok, type Result } from '@oaknational/result';
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

/** A spawned child with `pid` whose leader stays running. */
function runningChild(pid: number): DevChild {
  return Object.assign(new EventEmitter(), { pid, unref: () => undefined });
}

/** A ready-wait that never settles, so only the leader's exit can end the wait. */
function neverReady(): Promise<boolean> {
  return new Promise<boolean>(() => undefined);
}

/** An identity probe that finds the answering server is ours. */
function provesOurs(): Promise<Result<void, string>> {
  return Promise.resolve(ok(undefined));
}

describe('spawnAndAwaitReady', () => {
  it('returns the pid of a ready server that proves ours, and leaves it running', async () => {
    const pid = 4242;
    const reaped: number[] = [];
    const result = await spawnAndAwaitReady(DEMO_DIR, BASE, {
      spawnDev: () => runningChild(pid),
      untilReady: () => Promise.resolve(true),
      confirmOurs: provesOurs,
      reap: (reapedPid) => {
        reaped.push(reapedPid);
        return Promise.resolve(ok(undefined));
      },
    });
    expect(result).toStrictEqual(ok(pid));
    expect(reaped).toStrictEqual([]);
  });

  it('reaps a ready server that is not ours, keeping the identity refusal and a failed teardown', async () => {
    const pid = 4242;
    const refusal = 'dev-server: the server on the port is not the demo app';
    const teardownFailure = 'dev-server: SIGTERM failed — EPERM';
    const reaped: number[] = [];
    const result = await spawnAndAwaitReady(DEMO_DIR, BASE, {
      spawnDev: () => runningChild(pid),
      untilReady: () => Promise.resolve(true),
      confirmOurs: () => Promise.resolve(err(refusal)),
      reap: (reapedPid) => {
        reaped.push(reapedPid);
        return Promise.resolve(err(teardownFailure));
      },
    });
    expect(result.ok).toBe(false);
    const message = result.ok ? undefined : result.error;
    expect(message).toContain(refusal);
    expect(message).toContain(teardownFailure);
    expect(reaped).toStrictEqual([pid]);
  });

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
      confirmOurs: provesOurs,
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
      confirmOurs: provesOurs,
      reap: () => Promise.resolve(err(teardownFailure)),
    });
    expect(result.ok).toBe(false);
    const message = result.ok ? undefined : result.error;
    expect(message).toContain(`exit code ${String(code)}`);
    expect(message).toContain(teardownFailure);
  });
});
