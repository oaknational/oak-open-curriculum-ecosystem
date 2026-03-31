/**
 * Unit tests for log levels
 */

import { describe, it, expect } from 'vitest';
import {
  LOG_LEVEL_VALUES,
  type LogLevel,
  LOG_LEVEL_KEY,
  ENABLE_DEBUG_LOGGING_KEY,
  isLogLevel,
  getDefaultLogLevel,
  parseLogLevel,
  compareLogLevels,
  shouldLog,
} from './log-levels';

const LOG_LEVEL_DETAILS = [
  LOG_LEVEL_VALUES.TRACE,
  LOG_LEVEL_VALUES.DEBUG,
  LOG_LEVEL_VALUES.INFO,
  LOG_LEVEL_VALUES.WARN,
  LOG_LEVEL_VALUES.ERROR,
  LOG_LEVEL_VALUES.FATAL,
] as const;

describe('log-levels', () => {
  describe('LOG_LEVEL_VALUES', () => {
    it('should have exactly one default level', () => {
      const defaults = LOG_LEVEL_DETAILS.filter((level) => level.default);
      expect(defaults).toHaveLength(1);
    });

    it('should have INFO as the default level', () => {
      expect(LOG_LEVEL_VALUES.INFO.default).toBe(true);
    });

    it('should have correct numeric ordering', () => {
      expect(LOG_LEVEL_VALUES.TRACE.value).toBeLessThan(LOG_LEVEL_VALUES.DEBUG.value);
      expect(LOG_LEVEL_VALUES.DEBUG.value).toBeLessThan(LOG_LEVEL_VALUES.INFO.value);
      expect(LOG_LEVEL_VALUES.INFO.value).toBeLessThan(LOG_LEVEL_VALUES.WARN.value);
      expect(LOG_LEVEL_VALUES.WARN.value).toBeLessThan(LOG_LEVEL_VALUES.ERROR.value);
      expect(LOG_LEVEL_VALUES.ERROR.value).toBeLessThan(LOG_LEVEL_VALUES.FATAL.value);
    });
  });

  describe('isLogLevel', () => {
    it('should return true for valid log levels', () => {
      expect(isLogLevel('TRACE')).toBe(true);
      expect(isLogLevel('DEBUG')).toBe(true);
      expect(isLogLevel('INFO')).toBe(true);
      expect(isLogLevel('WARN')).toBe(true);
      expect(isLogLevel('ERROR')).toBe(true);
      expect(isLogLevel('FATAL')).toBe(true);
    });

    it('should return false for invalid log levels', () => {
      expect(isLogLevel('INVALID')).toBe(false);
      expect(isLogLevel('debug')).toBe(false); // lowercase not valid
      expect(isLogLevel('')).toBe(false);
      expect(isLogLevel(null)).toBe(false);
      expect(isLogLevel(undefined)).toBe(false);
      expect(isLogLevel(123)).toBe(false);
      expect(isLogLevel({})).toBe(false);
    });
  });

  describe('getDefaultLogLevel', () => {
    it('should return INFO as the default level', () => {
      expect(getDefaultLogLevel()).toBe('INFO');
    });
  });

  describe('parseLogLevel', () => {
    it('should return default value when env var is undefined', () => {
      const result = parseLogLevel(undefined, 'WARN');
      expect(result).toBe('WARN');
    });

    it('should return INFO as default when no default provided and env var undefined', () => {
      const result = parseLogLevel(undefined);
      expect(result).toBe('INFO');
    });

    it('should parse DEBUG level correctly', () => {
      const result = parseLogLevel('debug');
      expect(result).toBe('DEBUG');
    });

    it('should parse INFO level correctly', () => {
      const result = parseLogLevel('info');
      expect(result).toBe('INFO');
    });

    it('should parse WARN level correctly', () => {
      const result = parseLogLevel('warn');
      expect(result).toBe('WARN');
    });

    it('should parse ERROR level correctly', () => {
      const result = parseLogLevel('error');
      expect(result).toBe('ERROR');
    });

    it('should handle uppercase input', () => {
      const result = parseLogLevel('ERROR');
      expect(result).toBe('ERROR');
    });

    it('should handle mixed case input', () => {
      const result = parseLogLevel('WaRn');
      expect(result).toBe('WARN');
    });

    it('should throw error for invalid log level', () => {
      expect(() => parseLogLevel('INVALID')).toThrow(
        'Log level must be one of: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, got: INVALID',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => parseLogLevel('')).toThrow(
        'Log level must be one of: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, got: ',
      );
    });

    it('should maintain type safety without type assertions', () => {
      // This test ensures the return type is correctly inferred as LogLevel
      const result: LogLevel = parseLogLevel('debug');

      // TypeScript should allow this assignment without errors
      const levels: LogLevel[] = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
      expect(levels).toContain(result);
    });
  });

  describe('compareLogLevels', () => {
    it('should return negative when first level is more verbose', () => {
      expect(compareLogLevels('DEBUG', 'INFO')).toBeLessThan(0);
      expect(compareLogLevels('INFO', 'WARN')).toBeLessThan(0);
      expect(compareLogLevels('WARN', 'ERROR')).toBeLessThan(0);
    });

    it('should return positive when first level is less verbose', () => {
      expect(compareLogLevels('ERROR', 'WARN')).toBeGreaterThan(0);
      expect(compareLogLevels('WARN', 'INFO')).toBeGreaterThan(0);
      expect(compareLogLevels('INFO', 'DEBUG')).toBeGreaterThan(0);
    });

    it('should return zero when levels are equal', () => {
      expect(compareLogLevels('DEBUG', 'DEBUG')).toBe(0);
      expect(compareLogLevels('INFO', 'INFO')).toBe(0);
      expect(compareLogLevels('WARN', 'WARN')).toBe(0);
      expect(compareLogLevels('ERROR', 'ERROR')).toBe(0);
    });
  });

  describe('shouldLog', () => {
    it('should log when message level equals threshold', () => {
      expect(shouldLog('INFO', 'INFO')).toBe(true);
      expect(shouldLog('DEBUG', 'DEBUG')).toBe(true);
      expect(shouldLog('ERROR', 'ERROR')).toBe(true);
    });

    it('should log when message level is higher than threshold', () => {
      expect(shouldLog('ERROR', 'DEBUG')).toBe(true);
      expect(shouldLog('ERROR', 'INFO')).toBe(true);
      expect(shouldLog('WARN', 'DEBUG')).toBe(true);
      expect(shouldLog('INFO', 'DEBUG')).toBe(true);
    });

    it('should not log when message level is lower than threshold', () => {
      expect(shouldLog('DEBUG', 'INFO')).toBe(false);
      expect(shouldLog('DEBUG', 'WARN')).toBe(false);
      expect(shouldLog('INFO', 'WARN')).toBe(false);
      expect(shouldLog('WARN', 'ERROR')).toBe(false);
    });
  });

  describe('constants', () => {
    it('should export correct environment variable keys', () => {
      expect(LOG_LEVEL_KEY).toBe('LOG_LEVEL');
      expect(ENABLE_DEBUG_LOGGING_KEY).toBe('ENABLE_DEBUG_LOGGING');
    });
  });
});
