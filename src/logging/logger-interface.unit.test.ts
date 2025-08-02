/**
 * @fileoverview Tests for the zero-dependency Logger interface
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import type { Logger, LogContext } from './logger-interface.js';
import { LogLevel } from './logger-interface.js';

describe('Logger Interface', () => {
  describe('LogLevel enum', () => {
    it('should define correct log levels in order', async () => {
      const { LogLevel } = await import('./logger-interface.js');

      expect(LogLevel.TRACE).toBe(0);
      expect(LogLevel.DEBUG).toBe(10);
      expect(LogLevel.INFO).toBe(20);
      expect(LogLevel.WARN).toBe(30);
      expect(LogLevel.ERROR).toBe(40);
      expect(LogLevel.FATAL).toBe(50);
    });

    it('should allow numeric comparison of levels', async () => {
      const { LogLevel } = await import('./logger-interface.js');

      // Verify that numeric values allow proper level comparison
      expect(LogLevel.ERROR).toBeGreaterThan(LogLevel.WARN);
      expect(LogLevel.DEBUG).toBeLessThan(LogLevel.INFO);
    });
  });

  describe('Logger implementation contract', () => {
    // Create a minimal test implementation to verify the interface
    class TestLogger implements Logger {
      calls: { method: string; args: unknown[] }[] = [];
      currentLevel = LogLevel.INFO;

      trace(message: string, context?: LogContext): void {
        this.calls.push({ method: 'trace', args: [message, context] });
      }

      debug(message: string, context?: LogContext): void {
        this.calls.push({ method: 'debug', args: [message, context] });
      }

      info(message: string, context?: LogContext): void {
        this.calls.push({ method: 'info', args: [message, context] });
      }

      warn(message: string, context?: LogContext): void {
        this.calls.push({ method: 'warn', args: [message, context] });
      }

      error(message: string, error?: unknown, context?: LogContext): void {
        this.calls.push({ method: 'error', args: [message, error, context] });
      }

      fatal(message: string, error?: unknown, context?: LogContext): void {
        this.calls.push({ method: 'fatal', args: [message, error, context] });
      }

      child(context: LogContext): Logger {
        const childLogger = new TestLogger();
        childLogger.calls.push({ method: 'child', args: [context] });
        return childLogger;
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

    it('should support all log methods', () => {
      const logger = new TestLogger();
      const context = { requestId: '123' };

      logger.trace('trace message', context);
      logger.debug('debug message', context);
      logger.info('info message', context);
      logger.warn('warn message', context);
      logger.error('error message', new Error('test'), context);
      logger.fatal('fatal message', new Error('fatal'), context);

      expect(logger.calls).toHaveLength(6);
      expect(logger.calls[0]).toEqual({ method: 'trace', args: ['trace message', context] });
      expect(logger.calls[4]).toEqual({
        method: 'error',
        args: ['error message', new Error('test'), context],
      });
    });

    it('should support child logger creation', () => {
      const logger = new TestLogger();
      const childContext = { service: 'auth' };

      const child = logger.child(childContext);

      expect(child).toBeInstanceOf(TestLogger);
      expect(child).not.toBe(logger);
      // Type guard: we know child is TestLogger from instanceof check
      if (child instanceof TestLogger) {
        expect(child.calls[0]).toEqual({
          method: 'child',
          args: [childContext],
        });
      }
    });

    it('should check if log level is enabled', async () => {
      const { LogLevel } = await import('./logger-interface.js');
      const logger = new TestLogger();

      logger.setLevel(LogLevel.WARN);

      expect(logger.isLevelEnabled(LogLevel.TRACE)).toBe(false);
      expect(logger.isLevelEnabled(LogLevel.DEBUG)).toBe(false);
      expect(logger.isLevelEnabled(LogLevel.INFO)).toBe(false);
      expect(logger.isLevelEnabled(LogLevel.WARN)).toBe(true);
      expect(logger.isLevelEnabled(LogLevel.ERROR)).toBe(true);
      expect(logger.isLevelEnabled(LogLevel.FATAL)).toBe(true);
    });

    it('should get and set log level', async () => {
      const { LogLevel } = await import('./logger-interface.js');
      const logger = new TestLogger();

      expect(logger.getLevel()).toBe(LogLevel.INFO);

      logger.setLevel(LogLevel.DEBUG);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });
  });

  describe('LogContext type', () => {
    it('should accept arbitrary key-value pairs', () => {
      const context: LogContext = {
        requestId: '123',
        userId: 456,
        timestamp: new Date(),
        metadata: { foo: 'bar' },
        tags: ['api', 'v2'],
      };

      // This test passes if TypeScript compiles it
      expect(context).toBeDefined();
    });
  });
});
