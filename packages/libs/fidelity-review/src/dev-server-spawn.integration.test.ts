import { EventEmitter } from 'node:events';

import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { spawnAndAwaitReady, type DevChild } from './dev-server-spawn';

/**
 * The spawn path's ready-wait over injected fakes: no process is spawned or
 * signalled and no socket is opened.
 */

/** A spawned child with a pid whose leader exits with `code` straight after creation. */
function exitingChild(code: number): DevChild {
  const child = Object.assign(new EventEmitter(), { pid: 4242, unref: () => undefined });
  queueMicrotask(() => child.emit('exit', code, null));
  return child;
}

describe('spawnAndAwaitReady', () => {
  it('fails at once when the pnpm leader exits before the server is ready', async () => {
    const code = 1;
    const result = await spawnAndAwaitReady('/apps/demo', 'http://localhost:3999', {
      spawnDev: () => exitingChild(code),
      // Never ready and never timed out: only the leader's exit can settle the wait.
      untilReady: () => new Promise<boolean>(() => undefined),
      reap: () => Promise.resolve(ok(undefined)),
    });
    expect(result.ok).toBe(false);
    const message = result.ok ? undefined : result.error;
    expect(message).toContain(`exit code ${String(code)}`);
    expect(message).toContain('shell-and-tooling-gotchas.md');
  });
});
