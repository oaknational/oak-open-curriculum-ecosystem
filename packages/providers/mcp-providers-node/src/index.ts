// Removed unused imports

interface CoreClock {
  now(): number;
}

interface CoreLogger {
  debug: (message: string, context?: unknown) => void;
  info: (message: string, context?: unknown) => void;
  warn: (message: string, context?: unknown) => void;
  error: (message: string, context?: unknown) => void;
}

interface CoreStorage {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

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
  const store = new Map<string, string>();
  return {
    get(key: string) {
      return Promise.resolve(store.get(key) ?? null);
    },
    set(key: string, value: string) {
      store.set(key, value);
      return Promise.resolve();
    },
    delete(key: string) {
      store.delete(key);
      return Promise.resolve();
    },
  };
}
