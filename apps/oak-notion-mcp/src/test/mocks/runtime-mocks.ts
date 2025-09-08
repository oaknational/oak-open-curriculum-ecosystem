import { vi } from 'vitest';
import type { CoreRuntime, Logger } from '@oaknational/mcp-core';

export function createMockRuntime(logger: Logger): CoreRuntime {
  return {
    logger,
    clock: { now: () => 0 },
    storage: {
      get: vi.fn(async () => {
        await Promise.resolve();
        return null;
      }),
      set: vi.fn(async () => {
        await Promise.resolve();
      }),
      delete: vi.fn(async () => {
        await Promise.resolve();
      }),
    },
  };
}
