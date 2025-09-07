/**
 * Unit tests for environment utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseLogLevel, type LogLevel, LOG_LEVEL_KEY } from '@oaknational/mcp-logger';

describe('env-utils', () => {
  describe('parseLogLevel', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset process.env for each test
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      // Restore original env
      process.env = originalEnv;
    });

    it('should return default value when env var is not set', () => {
      process.env.LOG_LEVEL = undefined as unknown as string;
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY], 'WARN');
      expect(result).toBe('WARN');
    });

    it('should return INFO as default when no default provided and env var not set', () => {
      process.env.LOG_LEVEL = undefined as unknown as string;
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('INFO');
    });

    it('should parse DEBUG level correctly', () => {
      process.env[LOG_LEVEL_KEY] = 'debug';
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('DEBUG');
    });

    it('should parse INFO level correctly', () => {
      process.env[LOG_LEVEL_KEY] = 'info';
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('INFO');
    });

    it('should parse WARN level correctly', () => {
      process.env[LOG_LEVEL_KEY] = 'warn';
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('WARN');
    });

    it('should parse ERROR level correctly', () => {
      process.env[LOG_LEVEL_KEY] = 'error';
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('ERROR');
    });

    it('should handle uppercase input', () => {
      process.env[LOG_LEVEL_KEY] = 'ERROR';
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('ERROR');
    });

    it('should handle mixed case input', () => {
      process.env[LOG_LEVEL_KEY] = 'WaRn';
      const result = parseLogLevel(process.env[LOG_LEVEL_KEY]);
      expect(result).toBe('WARN');
    });

    it('should throw error for invalid log level', () => {
      process.env[LOG_LEVEL_KEY] = 'INVALID';
      expect(() => parseLogLevel(process.env[LOG_LEVEL_KEY])).toThrow(
        'Log level must be one of: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, got: INVALID',
      );
    });

    it('should throw error for empty string', () => {
      process.env[LOG_LEVEL_KEY] = '';
      expect(() => parseLogLevel(process.env[LOG_LEVEL_KEY])).toThrow(
        'Log level must be one of: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, got: ',
      );
    });

    it('should maintain type safety without type assertions', () => {
      // This test ensures the return type is correctly inferred as LogLevel
      process.env[LOG_LEVEL_KEY] = 'debug';
      const result: LogLevel = parseLogLevel(process.env[LOG_LEVEL_KEY]);

      // TypeScript should allow this assignment without errors
      const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
      expect(levels).toContain(result);
    });
  });
});
