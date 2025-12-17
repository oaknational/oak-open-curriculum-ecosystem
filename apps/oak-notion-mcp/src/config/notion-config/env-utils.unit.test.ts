/**
 * Unit tests for environment utilities
 *
 * Tests parseLogLevel as a pure function with explicit inputs.
 * No process.env manipulation - values are passed directly.
 */

import { describe, it, expect } from 'vitest';
import { parseLogLevel, type LogLevel } from '@oaknational/mcp-logger';

describe('env-utils', () => {
  describe('parseLogLevel', () => {
    it('returns default value when input is undefined', () => {
      const result = parseLogLevel(undefined, 'WARN');
      expect(result).toBe('WARN');
    });

    it('returns INFO as default when no default provided and input is undefined', () => {
      const result = parseLogLevel(undefined);
      expect(result).toBe('INFO');
    });

    it('parses DEBUG level correctly', () => {
      const result = parseLogLevel('debug');
      expect(result).toBe('DEBUG');
    });

    it('parses INFO level correctly', () => {
      const result = parseLogLevel('info');
      expect(result).toBe('INFO');
    });

    it('parses WARN level correctly', () => {
      const result = parseLogLevel('warn');
      expect(result).toBe('WARN');
    });

    it('parses ERROR level correctly', () => {
      const result = parseLogLevel('error');
      expect(result).toBe('ERROR');
    });

    it('handles uppercase input', () => {
      const result = parseLogLevel('ERROR');
      expect(result).toBe('ERROR');
    });

    it('handles mixed case input', () => {
      const result = parseLogLevel('WaRn');
      expect(result).toBe('WARN');
    });

    it('throws error for invalid log level', () => {
      expect(() => parseLogLevel('INVALID')).toThrow(
        'Log level must be one of: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, got: INVALID',
      );
    });

    it('throws error for empty string', () => {
      expect(() => parseLogLevel('')).toThrow(
        'Log level must be one of: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, got: ',
      );
    });

    it('maintains type safety without type assertions', () => {
      const result: LogLevel = parseLogLevel('debug');
      const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
      expect(levels).toContain(result);
    });
  });
});
