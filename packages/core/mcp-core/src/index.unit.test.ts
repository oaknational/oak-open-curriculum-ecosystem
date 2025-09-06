import { describe, it, expect, vi } from 'vitest';
import { createRuntime, type CoreClock, type CoreLogger, type CoreStorage } from './index';

describe('createRuntime', () => {
  it('should return the provided providers unchanged', () => {
    const logger: CoreLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const clock: CoreClock = {
      now: vi.fn(),
    };

    const storage: CoreStorage = {
      async get() {
        return Promise.resolve(undefined);
      },
      async set() {
        return Promise.resolve(undefined);
      },
      async delete() {
        return Promise.resolve(undefined);
      },
    };

    const providers = { logger, clock, storage };
    const runtime = createRuntime(providers);

    // Behaviour: the runtime is a simple composition of provided providers
    expect(runtime.logger).toBe(logger);
    expect(runtime.clock).toBe(clock);
    expect(runtime.storage).toBe(storage);
  });
});
