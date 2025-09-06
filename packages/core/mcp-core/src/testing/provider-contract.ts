import type { CoreClock, CoreLogger, CoreStorage } from '../index';

export interface ProviderFactory {
  createLogger: () => CoreLogger;
  createClock: () => CoreClock;
  createStorage: () => CoreStorage;
}

export interface ProviderContract {
  clockBehavesMonotonically(): void;
  loggerAcceptsMessages(): void;
  storageRoundtrip(): Promise<void>;
}

export function defineProviderContract(factory: ProviderFactory): ProviderContract {
  return {
    clockBehavesMonotonically(): void {
      const clock = factory.createClock();
      const a = clock.now();
      const b = clock.now();
      if (!(typeof a === 'number' && typeof b === 'number')) {
        throw new Error('Clock must return numbers');
      }
      if (b < a) {
        throw new Error('Clock must be monotonic (non-decreasing)');
      }
    },
    loggerAcceptsMessages(): void {
      const logger = factory.createLogger();
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
    },
    async storageRoundtrip(): Promise<void> {
      const storage = factory.createStorage();
      const key = 'k';
      const value = { x: 1 } as const;
      await storage.set(key, value);
      const got = await storage.get(key);
      if (JSON.stringify(got) !== JSON.stringify(value)) {
        throw new Error('Storage roundtrip failed');
      }
      await storage.delete(key);
      const missing = await storage.get(key);
      if (typeof missing !== 'undefined') {
        throw new Error('Storage delete failed');
      }
    },
  };
}
