import { describe, expect, it } from 'vitest';

import {
  createOwnedProcessController,
  type OwnedChildProcess,
  type OwnedProcessRuntime,
} from '../../src/codex-hook-review/owned-process.js';

type OwnedEvent = 'exit' | 'SIGINT' | 'SIGTERM';

class InMemoryProcessRuntime implements OwnedProcessRuntime {
  readonly platform = 'darwin';
  readonly pid = 900;
  readonly kills: { readonly pid: number; readonly signal: NodeJS.Signals }[] = [];
  readonly #listeners = new Map<OwnedEvent, Set<() => void>>();
  groupKillSucceeds = true;

  once(event: OwnedEvent, listener: () => void): void {
    const listeners = this.#listeners.get(event) ?? new Set<() => void>();
    listeners.add(listener);
    this.#listeners.set(event, listeners);
  }

  off(event: OwnedEvent, listener: () => void): void {
    this.#listeners.get(event)?.delete(listener);
  }

  kill(pid: number, signal: NodeJS.Signals): boolean {
    this.kills.push({ pid, signal });
    return pid >= 0 || this.groupKillSucceeds;
  }

  emit(event: OwnedEvent): void {
    for (const listener of [...(this.#listeners.get(event) ?? [])]) {
      listener();
    }
  }

  listenerCount(event: OwnedEvent): number {
    return this.#listeners.get(event)?.size ?? 0;
  }
}

function createChild(pid: number): OwnedChildProcess & { readonly signals: NodeJS.Signals[] } {
  const signals: NodeJS.Signals[] = [];
  return { pid, signals, kill: (signal) => (signals.push(signal), true) };
}

describe('createOwnedProcessController', () => {
  it('uses one outer listener set for every concurrently owned child', () => {
    const runtime = new InMemoryProcessRuntime();
    const controller = createOwnedProcessController(runtime);
    const unregisterFirst = controller.register(createChild(101));
    const unregisterSecond = controller.register(createChild(102));

    expect(runtime.listenerCount('exit')).toBe(1);
    expect(runtime.listenerCount('SIGINT')).toBe(1);
    expect(runtime.listenerCount('SIGTERM')).toBe(1);

    unregisterFirst();
    expect(runtime.listenerCount('SIGTERM')).toBe(1);
    unregisterSecond();
    expect(runtime.listenerCount('exit')).toBe(0);
    expect(runtime.listenerCount('SIGINT')).toBe(0);
    expect(runtime.listenerCount('SIGTERM')).toBe(0);
  });

  it('kills every owned process group before re-delivering one termination signal', () => {
    const runtime = new InMemoryProcessRuntime();
    const controller = createOwnedProcessController(runtime);
    controller.register(createChild(101));
    controller.register(createChild(102));

    runtime.emit('SIGTERM');

    expect(runtime.kills).toEqual([
      { pid: -101, signal: 'SIGKILL' },
      { pid: -102, signal: 'SIGKILL' },
      { pid: 900, signal: 'SIGTERM' },
    ]);
    expect(runtime.listenerCount('SIGTERM')).toBe(0);
  });

  it('reaps every owned group on exit without attempting to signal the exiting parent', () => {
    const runtime = new InMemoryProcessRuntime();
    const controller = createOwnedProcessController(runtime);
    controller.register(createChild(101));
    controller.register(createChild(102));

    runtime.emit('exit');

    expect(runtime.kills).toEqual([
      { pid: -101, signal: 'SIGKILL' },
      { pid: -102, signal: 'SIGKILL' },
    ]);
  });

  it('falls back to killing the direct child when process-group termination fails', () => {
    const runtime = new InMemoryProcessRuntime();
    runtime.groupKillSucceeds = false;
    const controller = createOwnedProcessController(runtime);
    const child = createChild(101);

    controller.terminate(child);

    expect(runtime.kills).toEqual([{ pid: -101, signal: 'SIGKILL' }]);
    expect(child.signals).toEqual(['SIGKILL']);
  });
});
