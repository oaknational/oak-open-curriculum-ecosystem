import { describe, it, expect, vi } from 'vitest';
// Remove core testing dependency - use local test helpers
import { createConsoleLogger, createInMemoryStorage, createNodeClock } from './index';

function defineProviderContract(factory: {
  createLogger: () => ReturnType<typeof createConsoleLogger>;
  createClock: () => ReturnType<typeof createNodeClock>;
  createStorage: () => ReturnType<typeof createInMemoryStorage>;
}) {
  const logger = factory.createLogger();
  const clock = factory.createClock();
  const storage = factory.createStorage();
  return {
    clockBehavesMonotonically(): void {
      const a = clock.now();
      const b = clock.now();
      expect(b).toBeGreaterThanOrEqual(a);
    },
    loggerAcceptsMessages(): void {
      expect(() => {
        logger.debug('test', { ok: true });
      }).not.toThrow();
      expect(() => {
        logger.info('test');
      }).not.toThrow();
      expect(() => {
        logger.warn('test');
      }).not.toThrow();
      expect(() => {
        logger.error('test');
      }).not.toThrow();
    },
    async storageRoundtrip(): Promise<void> {
      await storage.set('k', 'v');
      const v = await storage.get('k');
      expect(v).toBe('v');
    },
  } as const;
}

describe('providers-node contract', () => {
  it('satisfies the core provider contract', async () => {
    const spyDebug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const spyInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const spyError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const contract = defineProviderContract({
      createLogger: () => createConsoleLogger('test'),
      createClock: () => createNodeClock(),
      createStorage: () => createInMemoryStorage(),
    });

    // Behaviour checks (no IO/network)
    {
      (contract.clockBehavesMonotonically as () => void)();
    }
    {
      (contract.loggerAcceptsMessages as () => void)();
    }
    await (contract.storageRoundtrip as () => Promise<void>)();

    expect(spyDebug).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
    expect(spyWarn).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();

    spyDebug.mockRestore();
    spyInfo.mockRestore();
    spyWarn.mockRestore();
    spyError.mockRestore();
  });
});
