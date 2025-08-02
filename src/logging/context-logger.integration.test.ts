/**
 * @fileoverview Integration tests for context logger with AsyncLocalStorage
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { Logger, LogContext } from './logger-interface.js';
import { LogLevel } from './logger-interface.js';

describe('Context Logger Integration', () => {
  describe('ContextLogger with AsyncLocalStorage', () => {
    // Simple mock logger for testing
    class MockLogger implements Logger {
      logs: {
        level: string;
        message: string;
        error?: unknown;
        context?: LogContext;
      }[] = [];
      private currentLevel: LogLevel = LogLevel.TRACE;
      private baseContext: LogContext = {};

      trace(message: string, context?: LogContext): void {
        this.logs.push({ level: 'trace', message, context });
      }

      debug(message: string, context?: LogContext): void {
        this.logs.push({ level: 'debug', message, context });
      }

      info(message: string, context?: LogContext): void {
        this.logs.push({ level: 'info', message, context });
      }

      warn(message: string, context?: LogContext): void {
        this.logs.push({ level: 'warn', message, context });
      }

      error(message: string, error?: unknown, context?: LogContext): void {
        this.logs.push({ level: 'error', message, error, context });
      }

      fatal(message: string, error?: unknown, context?: LogContext): void {
        this.logs.push({ level: 'fatal', message, error, context });
      }

      child(context: LogContext): Logger {
        const child = new MockLogger();
        child.logs = this.logs; // Share logs for testing
        child.currentLevel = this.currentLevel;
        child.baseContext = { ...this.baseContext, ...context };
        return child;
      }

      isLevelEnabled(level: LogLevel): boolean {
        return level >= this.currentLevel;
      }

      setLevel(level: LogLevel): void {
        this.currentLevel = level;
      }

      getLevel(): LogLevel {
        return this.currentLevel;
      }
    }

    let mockLogger: MockLogger;

    beforeEach(() => {
      mockLogger = new MockLogger();
    });

    it('should merge AsyncLocalStorage context with log context', () => {
      // This tests the integration between AsyncLocalStorage and the logger
      const storage = new AsyncLocalStorage<LogContext>();

      // Simulate the ContextLogger behavior
      const logWithContext = (
        logger: Logger,
        storage: AsyncLocalStorage<LogContext>,
        level: 'info' | 'error',
        message: string,
        logContext?: LogContext,
      ) => {
        const asyncContext = storage.getStore() ?? {};
        const mergedContext = { ...asyncContext, ...logContext };

        if (level === 'info') {
          logger.info(message, mergedContext);
        } else {
          logger.error(message, undefined, mergedContext);
        }
      };

      const result = storage.run({ requestId: '123', userId: 'user1' }, () => {
        logWithContext(mockLogger, storage, 'info', 'Test message', { action: 'test' });
        return true;
      });
      expect(result).toBe(true);

      expect(mockLogger.logs).toHaveLength(1);
      expect(mockLogger.logs[0]).toEqual({
        level: 'info',
        message: 'Test message',
        context: {
          requestId: '123',
          userId: 'user1',
          action: 'test',
        },
      });
    });

    it('should handle nested async contexts', () => {
      const storage = new AsyncLocalStorage<LogContext>();

      const logWithContext = (
        logger: Logger,
        storage: AsyncLocalStorage<LogContext>,
        message: string,
        logContext?: LogContext,
      ) => {
        const asyncContext = storage.getStore() ?? {};
        const mergedContext = { ...asyncContext, ...logContext };
        logger.info(message, mergedContext);
      };

      storage.run({ requestId: '123' }, () => {
        logWithContext(mockLogger, storage, 'Outer context');

        const nestedResult = storage.run({ requestId: '456', operation: 'nested' }, () => {
          logWithContext(mockLogger, storage, 'Inner context');
          return true;
        });
        expect(nestedResult).toBe(true);

        logWithContext(mockLogger, storage, 'Back to outer');
      });

      expect(mockLogger.logs).toHaveLength(3);
      expect(mockLogger.logs[0]?.context).toEqual({ requestId: '123' });
      expect(mockLogger.logs[1]?.context).toEqual({ requestId: '456', operation: 'nested' });
      expect(mockLogger.logs[2]?.context).toEqual({ requestId: '123' });
    });

    it('should maintain context across async operations', async () => {
      const storage = new AsyncLocalStorage<LogContext>();

      const logWithContext = (
        logger: Logger,
        storage: AsyncLocalStorage<LogContext>,
        message: string,
      ) => {
        const asyncContext = storage.getStore() ?? {};
        logger.info(message, asyncContext);
      };

      await storage.run({ correlationId: 'test-123' }, async () => {
        logWithContext(mockLogger, storage, 'Before async');

        await new Promise((resolve) => setTimeout(resolve, 10));

        logWithContext(mockLogger, storage, 'After async');

        await Promise.all([
          new Promise((resolve) => {
            setTimeout(() => {
              logWithContext(mockLogger, storage, 'Async task 1');
              resolve(void 0);
            }, 5);
          }),
          new Promise((resolve) => {
            setTimeout(() => {
              logWithContext(mockLogger, storage, 'Async task 2');
              resolve(void 0);
            }, 5);
          }),
        ]);
      });

      expect(mockLogger.logs).toHaveLength(4);
      expect(mockLogger.logs.every((log) => log.context?.['correlationId'] === 'test-123')).toBe(
        true,
      );
    });

    it('should handle missing async context gracefully', () => {
      const storage = new AsyncLocalStorage<LogContext>();

      const logWithContext = (
        logger: Logger,
        storage: AsyncLocalStorage<LogContext>,
        message: string,
        logContext?: LogContext,
      ) => {
        const asyncContext = storage.getStore() ?? {};
        const mergedContext = { ...asyncContext, ...logContext };
        logger.info(message, Object.keys(mergedContext).length > 0 ? mergedContext : undefined);
      };

      // Log outside of any async context
      logWithContext(mockLogger, storage, 'No async context', { manual: 'context' });

      expect(mockLogger.logs).toHaveLength(1);
      expect(mockLogger.logs[0]?.context).toEqual({ manual: 'context' });
    });

    it('should allow context updates within same async scope', () => {
      const storage = new AsyncLocalStorage<LogContext>();

      storage.run({ requestId: '123', step: 1 }, () => {
        const context1 = storage.getStore();
        expect(context1).toEqual({ requestId: '123', step: 1 });

        // Simulate context update
        const result = storage.run({ ...context1, step: 2 }, () => {
          const context2 = storage.getStore();
          expect(context2).toEqual({ requestId: '123', step: 2 });
          return true;
        });
        expect(result).toBe(true);
      });
    });
  });
});
