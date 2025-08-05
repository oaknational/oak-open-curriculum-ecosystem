/**
 * @fileoverview Tests for the zero-dependency Logger interface
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import { LOG_LEVELS, isLogLevel, getLogLevelName } from './logger-interface.js';
import type { LogContext } from './logger-interface.js';

describe('Logger Interface', () => {
  describe('LogLevel constants', () => {
    it('should define correct log levels in ascending order', () => {
      expect(LOG_LEVELS.TRACE.value).toBe(0);
      expect(LOG_LEVELS.DEBUG.value).toBe(10);
      expect(LOG_LEVELS.INFO.value).toBe(20);
      expect(LOG_LEVELS.WARN.value).toBe(30);
      expect(LOG_LEVELS.ERROR.value).toBe(40);
      expect(LOG_LEVELS.FATAL.value).toBe(50);
    });

    it('should allow numeric comparison for level hierarchy', () => {
      expect(LOG_LEVELS.ERROR.value).toBeGreaterThan(LOG_LEVELS.WARN.value);
      expect(LOG_LEVELS.DEBUG.value).toBeLessThan(LOG_LEVELS.INFO.value);
      expect(LOG_LEVELS.FATAL.value).toBeGreaterThan(LOG_LEVELS.ERROR.value);
    });

    it('should have correct level names', () => {
      expect(LOG_LEVELS.TRACE.name).toBe('TRACE');
      expect(LOG_LEVELS.DEBUG.name).toBe('DEBUG');
      expect(LOG_LEVELS.INFO.name).toBe('INFO');
      expect(LOG_LEVELS.WARN.name).toBe('WARN');
      expect(LOG_LEVELS.ERROR.name).toBe('ERROR');
      expect(LOG_LEVELS.FATAL.name).toBe('FATAL');
    });
  });

  describe('isLogLevel type guard', () => {
    it('should return true for valid log levels', () => {
      expect(isLogLevel(LOG_LEVELS.TRACE.value)).toBe(true);
      expect(isLogLevel(LOG_LEVELS.DEBUG.value)).toBe(true);
      expect(isLogLevel(LOG_LEVELS.INFO.value)).toBe(true);
      expect(isLogLevel(LOG_LEVELS.WARN.value)).toBe(true);
      expect(isLogLevel(LOG_LEVELS.ERROR.value)).toBe(true);
      expect(isLogLevel(LOG_LEVELS.FATAL.value)).toBe(true);
    });

    it('should return false for invalid values', () => {
      // Test invalid numbers
      const invalidNumbers: unknown[] = [-1, 5, 100, 3.14];
      invalidNumbers.forEach((value) => {
        expect(isLogLevel(value)).toBe(false);
      });

      // Test non-number types
      const nonNumbers: unknown[] = ['debug', null, undefined, {}, [], true];
      nonNumbers.forEach((value) => {
        expect(isLogLevel(value)).toBe(false);
      });
    });
  });

  describe('getLogLevelName utility', () => {
    it('should return correct names for valid levels', () => {
      expect(getLogLevelName(LOG_LEVELS.TRACE.value)).toBe('TRACE');
      expect(getLogLevelName(LOG_LEVELS.DEBUG.value)).toBe('DEBUG');
      expect(getLogLevelName(LOG_LEVELS.INFO.value)).toBe('INFO');
      expect(getLogLevelName(LOG_LEVELS.WARN.value)).toBe('WARN');
      expect(getLogLevelName(LOG_LEVELS.ERROR.value)).toBe('ERROR');
      expect(getLogLevelName(LOG_LEVELS.FATAL.value)).toBe('FATAL');
    });

    it('should throw error for invalid levels', () => {
      expect(() => getLogLevelName(-1)).toThrow(TypeError);
      expect(() => getLogLevelName(-1)).toThrow(
        'Invalid log level: -1. Valid levels are: TRACE=0, DEBUG=10, INFO=20, WARN=30, ERROR=40, FATAL=50',
      );
      expect(() => getLogLevelName(5)).toThrow('Invalid log level: 5');
      expect(() => getLogLevelName(100)).toThrow('Invalid log level: 100');
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

      // This test proves TypeScript compilation - interface is properly defined
      expect(context).toBeDefined();
      expect(typeof context).toBe('object');
    });

    it('should accept optional context', () => {
      const context: LogContext | undefined = undefined;
      expect(context).toBeUndefined();
    });

    it('should accept empty context', () => {
      const context: LogContext = {};
      expect(context).toEqual({});
    });
  });
});
