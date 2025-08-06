/**
 * @fileoverview Tests for the zero-dependency Logger interface
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import { LOG_LEVELS, isLogLevel, getLogLevelName } from './logger-interface.js';

describe('Logger Interface', () => {
  describe('LogLevel constants', () => {
    it('should maintain correct hierarchy for filtering', () => {
      // Test that levels are properly ordered for filtering
      expect(LOG_LEVELS.TRACE.value).toBeLessThan(LOG_LEVELS.DEBUG.value);
      expect(LOG_LEVELS.DEBUG.value).toBeLessThan(LOG_LEVELS.INFO.value);
      expect(LOG_LEVELS.INFO.value).toBeLessThan(LOG_LEVELS.WARN.value);
      expect(LOG_LEVELS.WARN.value).toBeLessThan(LOG_LEVELS.ERROR.value);
      expect(LOG_LEVELS.ERROR.value).toBeLessThan(LOG_LEVELS.FATAL.value);
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
});
