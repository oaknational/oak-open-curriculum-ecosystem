import type { CoreClock, CoreLogger, CoreStorage } from '@oaknational/mcp-core';

export function createNodeClock(): CoreClock {
  return {
    now: () => Date.now(),
  };
}

export function createConsoleLogger(name = 'node-logger'): CoreLogger {
  return {
    debug: (message, context) => {
      console.debug(`[${name}] DEBUG: ${message}`, context ?? '');
    },
    info: (message, context) => {
      console.info(`[${name}] INFO: ${message}`, context ?? '');
    },
    warn: (message, context) => {
      console.warn(`[${name}] WARN: ${message}`, context ?? '');
    },
    error: (message, context) => {
      console.error(`[${name}] ERROR: ${message}`, context ?? '');
    },
  };
}

export function createInMemoryStorage(): CoreStorage {
  const store = new Map<string, unknown>();
  return {
    get(key) {
      return Promise.resolve(store.get(key));
    },
    set(key, value) {
      store.set(key, value);
      return Promise.resolve();
    },
    delete(key) {
      store.delete(key);
      return Promise.resolve();
    },
  };
}
