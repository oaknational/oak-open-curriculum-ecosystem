import { vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';

interface CoreRuntime {
  logger: {
    debug: (message: string, context?: unknown) => void;
    info: (message: string, context?: unknown) => void;
    warn: (message: string, context?: unknown) => void;
    error: (message: string, context?: unknown) => void;
  };
  clock: { now: () => number };
  storage: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };
}

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
