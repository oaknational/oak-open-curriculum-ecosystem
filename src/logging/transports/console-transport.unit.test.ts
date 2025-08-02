/**
 * @fileoverview Unit tests for pure functions in console transport
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import { LogLevel } from '../logger-interface.js';
import type { LogContext } from '../logger-interface.js';

describe('Console Transport Pure Functions', () => {
  describe('formatLogLevel', () => {
    it('should format log levels to readable strings', () => {
      const formatLogLevel = (level: LogLevel): string => {
        switch (level) {
          case LogLevel.TRACE:
            return 'TRACE';
          case LogLevel.DEBUG:
            return 'DEBUG';
          case LogLevel.INFO:
            return 'INFO';
          case LogLevel.WARN:
            return 'WARN';
          case LogLevel.ERROR:
            return 'ERROR';
          case LogLevel.FATAL:
            return 'FATAL';
          default:
            return 'UNKNOWN';
        }
      };

      expect(formatLogLevel(LogLevel.TRACE)).toBe('TRACE');
      expect(formatLogLevel(LogLevel.DEBUG)).toBe('DEBUG');
      expect(formatLogLevel(LogLevel.INFO)).toBe('INFO');
      expect(formatLogLevel(LogLevel.WARN)).toBe('WARN');
      expect(formatLogLevel(LogLevel.ERROR)).toBe('ERROR');
      expect(formatLogLevel(LogLevel.FATAL)).toBe('FATAL');
    });
  });

  describe('getConsoleMethod', () => {
    it('should map log levels to console methods', () => {
      const getConsoleMethod = (level: LogLevel): keyof Console => {
        switch (level) {
          case LogLevel.TRACE:
          case LogLevel.DEBUG:
            return 'debug';
          case LogLevel.INFO:
            return 'info';
          case LogLevel.WARN:
            return 'warn';
          case LogLevel.ERROR:
          case LogLevel.FATAL:
            return 'error';
          default:
            return 'log';
        }
      };

      expect(getConsoleMethod(LogLevel.TRACE)).toBe('debug');
      expect(getConsoleMethod(LogLevel.DEBUG)).toBe('debug');
      expect(getConsoleMethod(LogLevel.INFO)).toBe('info');
      expect(getConsoleMethod(LogLevel.WARN)).toBe('warn');
      expect(getConsoleMethod(LogLevel.ERROR)).toBe('error');
      expect(getConsoleMethod(LogLevel.FATAL)).toBe('error');
    });
  });

  describe('formatTimestamp', () => {
    it('should format date to ISO string', () => {
      const formatTimestamp = (date: Date): string => {
        return date.toISOString();
      };

      const date = new Date('2024-01-01T12:00:00.000Z');
      expect(formatTimestamp(date)).toBe('2024-01-01T12:00:00.000Z');
    });
  });

  describe('buildConsoleArgs', () => {
    it('should build arguments array for console methods', () => {
      const buildConsoleArgs = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): unknown[] => {
        const args: unknown[] = [];

        // Add timestamp if provided
        if (timestamp) {
          args.push(`[${timestamp.toISOString()}]`);
        }

        // Add level
        const levelStr = LogLevel[level];
        args.push(`[${levelStr}]`);

        // Add message
        args.push(message);

        // Add context if provided
        if (context && Object.keys(context).length > 0) {
          args.push(context);
        }

        // Add error if provided
        if (error) {
          args.push(error);
        }

        return args;
      };

      const timestamp = new Date('2024-01-01T12:00:00.000Z');
      const context = { userId: '123', action: 'login' };
      const error = new Error('Test error');

      // Test with all parameters
      const args1 = buildConsoleArgs(LogLevel.ERROR, 'Test message', error, context, timestamp);

      expect(args1).toEqual([
        '[2024-01-01T12:00:00.000Z]',
        '[ERROR]',
        'Test message',
        { userId: '123', action: 'login' },
        error,
      ]);

      // Test without optional parameters
      const args2 = buildConsoleArgs(LogLevel.INFO, 'Simple message');
      expect(args2).toEqual(['[INFO]', 'Simple message']);

      // Test with context but no error
      const args3 = buildConsoleArgs(LogLevel.DEBUG, 'Debug message', undefined, context);
      expect(args3).toEqual(['[DEBUG]', 'Debug message', context]);
    });

    it('should handle empty context', () => {
      const buildConsoleArgs = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): unknown[] => {
        const args: unknown[] = [];

        if (timestamp) {
          args.push(`[${timestamp.toISOString()}]`);
        }

        const levelStr = LogLevel[level];
        args.push(`[${levelStr}]`);
        args.push(message);

        if (context && Object.keys(context).length > 0) {
          args.push(context);
        }

        if (error) {
          args.push(error);
        }

        return args;
      };

      const args = buildConsoleArgs(LogLevel.INFO, 'Test', undefined, {});
      expect(args).toEqual(['[INFO]', 'Test']);
    });
  });

  describe('shouldColorize', () => {
    it('should determine if output should be colorized', () => {
      const shouldColorize = (forceColor?: boolean, noColor?: boolean, isTTY = true): boolean => {
        if (forceColor === true) return true;
        if (noColor === true) return false;
        return isTTY;
      };

      // Force color takes precedence
      expect(shouldColorize(true, true, false)).toBe(true);

      // No color takes precedence over TTY
      expect(shouldColorize(false, true, true)).toBe(false);

      // Default to TTY detection
      expect(shouldColorize(undefined, undefined, true)).toBe(true);
      expect(shouldColorize(undefined, undefined, false)).toBe(false);
    });
  });

  describe('getLevelColor', () => {
    it('should return ANSI color codes for each level', () => {
      const getLevelColor = (level: LogLevel): string => {
        switch (level) {
          case LogLevel.TRACE:
            return '\x1b[90m'; // gray
          case LogLevel.DEBUG:
            return '\x1b[36m'; // cyan
          case LogLevel.INFO:
            return '\x1b[32m'; // green
          case LogLevel.WARN:
            return '\x1b[33m'; // yellow
          case LogLevel.ERROR:
            return '\x1b[31m'; // red
          case LogLevel.FATAL:
            return '\x1b[35m'; // magenta
          default:
            return '\x1b[0m'; // reset
        }
      };

      expect(getLevelColor(LogLevel.TRACE)).toBe('\x1b[90m');
      expect(getLevelColor(LogLevel.DEBUG)).toBe('\x1b[36m');
      expect(getLevelColor(LogLevel.INFO)).toBe('\x1b[32m');
      expect(getLevelColor(LogLevel.WARN)).toBe('\x1b[33m');
      expect(getLevelColor(LogLevel.ERROR)).toBe('\x1b[31m');
      expect(getLevelColor(LogLevel.FATAL)).toBe('\x1b[35m');
    });
  });

  describe('colorizeLevel', () => {
    it('should wrap level string with color codes', () => {
      const colorizeLevel = (level: LogLevel, text: string): string => {
        const colorCode = {
          [LogLevel.TRACE]: '\x1b[90m',
          [LogLevel.DEBUG]: '\x1b[36m',
          [LogLevel.INFO]: '\x1b[32m',
          [LogLevel.WARN]: '\x1b[33m',
          [LogLevel.ERROR]: '\x1b[31m',
          [LogLevel.FATAL]: '\x1b[35m',
        }[level];

        return `${colorCode}${text}\x1b[0m`;
      };

      expect(colorizeLevel(LogLevel.INFO, '[INFO]')).toBe('\x1b[32m[INFO]\x1b[0m');
      expect(colorizeLevel(LogLevel.ERROR, '[ERROR]')).toBe('\x1b[31m[ERROR]\x1b[0m');
    });
  });
});
