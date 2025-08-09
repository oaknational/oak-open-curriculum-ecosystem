import { describe, it, expect } from 'vitest';
import { createAdaptiveLogger } from '../src/adaptive';

describe('createAdaptiveLogger - Integration Tests', () => {
  describe('logger interface', () => {
    it('should create a logger that implements all required methods', () => {
      const logger = createAdaptiveLogger();

      // Verify all required Logger interface methods exist
      expect(typeof logger.trace).toBe('function');
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.fatal).toBe('function');
    });

    it('should support optional methods', () => {
      const logger = createAdaptiveLogger();

      // Optional methods may or may not exist
      if (logger.isLevelEnabled) {
        expect(typeof logger.isLevelEnabled).toBe('function');
      }

      if (logger.child) {
        expect(typeof logger.child).toBe('function');
      }
    });
  });

  describe('configuration', () => {
    it('should accept various configuration options', () => {
      // Test that different configurations don't throw
      expect(() => createAdaptiveLogger()).not.toThrow();
      expect(() => createAdaptiveLogger({ level: 'DEBUG' })).not.toThrow();
      expect(() => createAdaptiveLogger({ level: 10 })).not.toThrow();
      expect(() => createAdaptiveLogger({ name: 'test' })).not.toThrow();
      expect(() => createAdaptiveLogger({ context: { app: 'test' } })).not.toThrow();
    });

    it('should create multiple independent instances', () => {
      const logger1 = createAdaptiveLogger({ name: 'logger1' });
      const logger2 = createAdaptiveLogger({ name: 'logger2' });

      expect(logger1).not.toBe(logger2);
      // Instance methods may be the same (bound methods), but loggers are different
      expect(typeof logger1.info).toBe('function');
      expect(typeof logger2.info).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should accept an injected console instance', () => {
      // Create a simple mock that implements minimal ConsolaInstance interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockConsola: any = {
        level: 2,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        trace: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        debug: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        info: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        warn: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        error: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        fatal: () => {},
        withTag: function () {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this;
        },
      }; // Type as any only for this test injection

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const logger = createAdaptiveLogger({ context: { test: true } }, mockConsola);

      // Verify logger was created with injected instance
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
    });
  });

  describe('child logger creation', () => {
    it('should support creating child loggers', () => {
      const parentLogger = createAdaptiveLogger({ context: { parent: true } });

      if (parentLogger.child) {
        const childLogger = parentLogger.child({ child: true });

        expect(childLogger).toBeDefined();
        expect(typeof childLogger.info).toBe('function');
        expect(childLogger).not.toBe(parentLogger);
      }
    });
  });
});
