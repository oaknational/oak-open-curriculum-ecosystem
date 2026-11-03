import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { registerRunTeardown, type SignalProcess } from './run-teardown';

/**
 * A `SignalProcess` fake: the handlers it holds and the exit codes it was
 * asked for are read as values, so a test fires a signal by calling its
 * handler and reads what the teardown did.
 */
function createSignalProcessFake(): {
  proc: SignalProcess;
  handlers: Map<string, () => void>;
  exits: number[];
} {
  const handlers = new Map<string, () => void>();
  const exits: number[] = [];
  return {
    proc: {
      on: (signal, handler) => handlers.set(signal, handler),
      off: (signal) => handlers.delete(signal),
      exit: (code) => {
        exits.push(code);
      },
    },
    handlers,
    exits,
  };
}

describe('registerRunTeardown', () => {
  it('registers both signals and stops the server once even under a double signal', async () => {
    const { proc, handlers, exits } = createSignalProcessFake();
    let stops = 0;

    registerRunTeardown(async () => {
      stops += 1;
      return ok(undefined);
    }, proc);
    handlers.get('SIGINT')?.();
    handlers.get('SIGTERM')?.();
    await new Promise((resolve) => {
      setImmediate(resolve);
    });

    expect(stops).toBe(1);
    expect(exits).toEqual([130]);
  });

  it('unregisters both handlers when the run ends normally', () => {
    const { proc, handlers } = createSignalProcessFake();

    const unregister = registerRunTeardown(async () => ok(undefined), proc);
    unregister();

    expect(handlers.size).toBe(0);
  });
});
