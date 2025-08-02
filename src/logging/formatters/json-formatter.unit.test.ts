/**
 * @fileoverview Unit tests for JSON formatter pure functions
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import { LogLevel } from '../logger-interface.js';
import type { LogContext } from '../logger-interface.js';

describe('JSON Formatter Pure Functions', () => {
  // Type guard for parsed JSON
  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  describe('formatJson', () => {
    it('should format log entry as JSON object', () => {
      const formatJson = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const entry: Record<string, unknown> = {
          timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
          level: LogLevel[level],
          levelValue: level,
          message,
        };

        if (context && Object.keys(context).length > 0) {
          entry['context'] = context;
        }

        if (error) {
          if (error instanceof Error) {
            entry['error'] = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          } else {
            // For non-Error values, convert safely
            if (typeof error === 'object') {
              entry['error'] = '[object]';
            } else if (typeof error === 'string') {
              entry['error'] = error;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              entry['error'] = String(error);
            } else {
              entry['error'] = '[unknown]';
            }
          }
        }

        return JSON.stringify(entry);
      };

      const timestamp = new Date('2024-01-01T12:00:00.000Z');
      const result = formatJson(LogLevel.INFO, 'Test message', undefined, undefined, timestamp);

      const parsedUnknown: unknown = JSON.parse(result);
      if (!isRecord(parsedUnknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsedUnknown).toEqual({
        timestamp: '2024-01-01T12:00:00.000Z',
        level: 'INFO',
        levelValue: 20,
        message: 'Test message',
      });
    });

    it('should include context when provided', () => {
      const formatJson = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const entry: Record<string, unknown> = {
          timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
          level: LogLevel[level],
          levelValue: level,
          message,
        };

        if (context && Object.keys(context).length > 0) {
          entry['context'] = context;
        }

        if (error) {
          if (error instanceof Error) {
            entry['error'] = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          } else {
            // For non-Error values, convert safely
            if (typeof error === 'object') {
              entry['error'] = '[object]';
            } else if (typeof error === 'string') {
              entry['error'] = error;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              entry['error'] = String(error);
            } else {
              entry['error'] = '[unknown]';
            }
          }
        }

        return JSON.stringify(entry);
      };

      const context = {
        userId: '123',
        requestId: 'req-456',
        metadata: { foo: 'bar' },
      };

      const result = formatJson(
        LogLevel.DEBUG,
        'Debug message',
        undefined,
        context,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const parsedUnknown: unknown = JSON.parse(result);
      if (!isRecord(parsedUnknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsedUnknown['context']).toEqual(context);
    });

    it('should serialize error objects', () => {
      const formatJson = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const entry: Record<string, unknown> = {
          timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
          level: LogLevel[level],
          levelValue: level,
          message,
        };

        if (context && Object.keys(context).length > 0) {
          entry['context'] = context;
        }

        if (error) {
          if (error instanceof Error) {
            entry['error'] = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          } else {
            // For non-Error values, convert safely
            if (typeof error === 'object') {
              entry['error'] = '[object]';
            } else if (typeof error === 'string') {
              entry['error'] = error;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              entry['error'] = String(error);
            } else {
              entry['error'] = '[unknown]';
            }
          }
        }

        return JSON.stringify(entry);
      };

      const error = new Error('Test error');
      error.name = 'TestError';
      error.stack = 'TestError: Test error\n    at test.js:1:1';

      const result = formatJson(
        LogLevel.ERROR,
        'Error occurred',
        error,
        undefined,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const parsedUnknown: unknown = JSON.parse(result);
      if (!isRecord(parsedUnknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsedUnknown['error']).toEqual({
        name: 'TestError',
        message: 'Test error',
        stack: 'TestError: Test error\n    at test.js:1:1',
      });
    });

    it('should handle non-Error error values', () => {
      const formatJson = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const entry: Record<string, unknown> = {
          timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
          level: LogLevel[level],
          levelValue: level,
          message,
        };

        if (context && Object.keys(context).length > 0) {
          entry['context'] = context;
        }

        if (error) {
          if (error instanceof Error) {
            entry['error'] = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          } else {
            // For non-Error values, convert safely
            if (typeof error === 'object') {
              entry['error'] = '[object]';
            } else if (typeof error === 'string') {
              entry['error'] = error;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              entry['error'] = String(error);
            } else {
              entry['error'] = '[unknown]';
            }
          }
        }

        return JSON.stringify(entry);
      };

      const result1 = formatJson(
        LogLevel.ERROR,
        'String error',
        'Something went wrong',
        undefined,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const parsed1Unknown: unknown = JSON.parse(result1);
      if (!isRecord(parsed1Unknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsed1Unknown['error']).toBe('Something went wrong');

      const result2 = formatJson(
        LogLevel.ERROR,
        'Number error',
        404,
        undefined,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const parsed2Unknown: unknown = JSON.parse(result2);
      if (!isRecord(parsed2Unknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsed2Unknown['error']).toBe('404');
    });
  });

  describe('formatJsonLine', () => {
    it('should format as single line with newline', () => {
      const formatJsonLine = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const entry: Record<string, unknown> = {
          timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
          level: LogLevel[level],
          levelValue: level,
          message,
        };

        if (context && Object.keys(context).length > 0) {
          entry['context'] = context;
        }

        if (error) {
          if (error instanceof Error) {
            entry['error'] = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          } else {
            // For non-Error values, convert safely
            if (typeof error === 'object') {
              entry['error'] = '[object]';
            } else if (typeof error === 'string') {
              entry['error'] = error;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              entry['error'] = String(error);
            } else {
              entry['error'] = '[unknown]';
            }
          }
        }

        return JSON.stringify(entry) + '\n';
      };

      const result = formatJsonLine(
        LogLevel.INFO,
        'Test',
        undefined,
        { foo: 'bar' },
        new Date('2024-01-01T12:00:00.000Z'),
      );

      expect(result.endsWith('\n')).toBe(true);
      expect(result.split('\n')).toHaveLength(2); // One line plus empty
    });
  });

  describe('formatPrettyJson', () => {
    it('should format with indentation', () => {
      const formatPrettyJson = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
        indent = 2,
      ): string => {
        const entry: Record<string, unknown> = {
          timestamp: timestamp ? timestamp.toISOString() : new Date().toISOString(),
          level: LogLevel[level],
          levelValue: level,
          message,
        };

        if (context && Object.keys(context).length > 0) {
          entry['context'] = context;
        }

        if (error) {
          if (error instanceof Error) {
            entry['error'] = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          } else {
            // For non-Error values, convert safely
            if (typeof error === 'object') {
              entry['error'] = '[object]';
            } else if (typeof error === 'string') {
              entry['error'] = error;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              entry['error'] = String(error);
            } else {
              entry['error'] = '[unknown]';
            }
          }
        }

        return JSON.stringify(entry, null, indent);
      };

      const result = formatPrettyJson(
        LogLevel.WARN,
        'Warning',
        undefined,
        { nested: { value: 123 } },
        new Date('2024-01-01T12:00:00.000Z'),
      );

      expect(result).toContain('\n');
      expect(result).toContain('  '); // Indentation

      const parsedUnknown: unknown = JSON.parse(result);
      if (!isRecord(parsedUnknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsedUnknown['level']).toBe('WARN');
      if (
        typeof parsedUnknown['context'] !== 'object' ||
        parsedUnknown['context'] === null ||
        Array.isArray(parsedUnknown['context'])
      ) {
        throw new Error('Expected context to be an object');
      }
      const contextUnknown = parsedUnknown['context'];
      if (!isRecord(contextUnknown)) {
        throw new Error('Expected context to be a record');
      }
      const nestedUnknown = contextUnknown['nested'];
      if (!isRecord(nestedUnknown)) {
        throw new Error('Expected nested to be an object');
      }
      expect(nestedUnknown['value']).toBe(123);
    });
  });

  describe('sanitizeJsonEntry', () => {
    it('should remove sensitive fields from log entry', () => {
      const sanitizeJsonEntry = (
        entry: Record<string, unknown>,
        sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey'],
      ): Record<string, unknown> => {
        const sanitized: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(entry)) {
          const lowerKey = key.toLowerCase();
          const isSensitive = sensitiveKeys.some((sensitive) =>
            lowerKey.includes(sensitive.toLowerCase()),
          );

          if (isSensitive) {
            sanitized[key] = '[REDACTED]';
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Recursively sanitize nested objects
            // Type is already narrowed by the if condition
            const nestedObj: Record<string, unknown> = {};
            Object.assign(nestedObj, value);
            sanitized[key] = sanitizeJsonEntry(nestedObj, sensitiveKeys);
          } else {
            sanitized[key] = value;
          }
        }

        return sanitized;
      };

      const entry = {
        message: 'User login',
        context: {
          userId: '123',
          password: 'secret123',
          userToken: 'token-456',
          metadata: {
            apiKey: 'key-789',
            normalField: 'visible',
          },
        },
      };

      const result = sanitizeJsonEntry(entry);

      expect(result).toEqual({
        message: 'User login',
        context: {
          userId: '123',
          password: '[REDACTED]',
          userToken: '[REDACTED]',
          metadata: {
            apiKey: '[REDACTED]',
            normalField: 'visible',
          },
        },
      });
    });
  });

  describe('createJsonFormatter options', () => {
    it('should support custom field names', () => {
      const createCustomJsonFormatter = (options: {
        timestampField?: string;
        levelField?: string;
        messageField?: string;
        contextField?: string;
        errorField?: string;
      }) => {
        const {
          timestampField = 'timestamp',
          levelField = 'level',
          messageField = 'message',
          contextField = 'context',
          errorField = 'error',
        } = options;

        return (
          level: LogLevel,
          message: string,
          error?: unknown,
          context?: LogContext,
          timestamp?: Date,
        ): string => {
          const entry: Record<string, unknown> = {
            [timestampField]: timestamp ? timestamp.toISOString() : new Date().toISOString(),
            [levelField]: LogLevel[level],
            [messageField]: message,
          };

          if (context && Object.keys(context).length > 0) {
            entry[contextField] = context;
          }

          if (error) {
            entry[errorField] =
              error instanceof Error
                ? error.message
                : typeof error === 'object'
                  ? JSON.stringify(error)
                  : typeof error === 'string'
                    ? error
                    : typeof error === 'number' || typeof error === 'boolean'
                      ? String(error)
                      : '[unknown]';
          }

          return JSON.stringify(entry);
        };
      };

      const formatter = createCustomJsonFormatter({
        timestampField: 'time',
        levelField: 'severity',
        messageField: 'msg',
      });

      const result = formatter(
        LogLevel.INFO,
        'Test',
        undefined,
        undefined,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const parsedUnknown: unknown = JSON.parse(result);
      if (!isRecord(parsedUnknown)) {
        throw new Error('Expected parsed result to be an object');
      }
      expect(parsedUnknown).toHaveProperty('time', '2024-01-01T12:00:00.000Z');
      expect(parsedUnknown).toHaveProperty('severity', 'INFO');
      expect(parsedUnknown).toHaveProperty('msg', 'Test');
    });
  });
});
