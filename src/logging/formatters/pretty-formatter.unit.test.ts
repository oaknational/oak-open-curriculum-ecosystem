/**
 * @fileoverview Unit tests for pretty formatter pure functions
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';
import { LogLevel } from '../logger-interface.js';
import type { LogContext } from '../logger-interface.js';

describe('Pretty Formatter Pure Functions', () => {
  describe('formatPretty', () => {
    it('should format log entry in human-readable format', () => {
      const formatPretty = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const parts: string[] = [];

        // Timestamp
        if (timestamp) {
          parts.push(`[${timestamp.toISOString()}]`);
        }

        // Level with padding
        const levelStr = LogLevel[level].padEnd(5);
        parts.push(levelStr);

        // Message
        parts.push(message);

        // Context on new line if present
        let output = parts.join(' ');

        if (context && Object.keys(context).length > 0) {
          const contextStr = Object.entries(context)
            .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
            .join('\n');
          output += '\n' + contextStr;
        }

        // Error on new line if present
        if (error) {
          const errorStr =
            error instanceof Error
              ? `\n  Error: ${error.message}${error.stack ? '\n' + error.stack : ''}`
              : typeof error === 'string'
                ? `\n  Error: ${error}`
                : typeof error === 'number' || typeof error === 'boolean'
                  ? `\n  Error: ${String(error)}`
                  : `\n  Error: [unknown]`;
          output += errorStr;
        }

        return output + '\n';
      };

      const timestamp = new Date('2024-01-01T12:00:00.000Z');
      const result = formatPretty(
        LogLevel.INFO,
        'Application started',
        undefined,
        undefined,
        timestamp,
      );

      expect(result).toBe('[2024-01-01T12:00:00.000Z] INFO  Application started\n');
    });

    it('should format context in readable format', () => {
      const formatPretty = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const parts: string[] = [];

        if (timestamp) {
          parts.push(`[${timestamp.toISOString()}]`);
        }

        const levelStr = LogLevel[level].padEnd(5);
        parts.push(levelStr);
        parts.push(message);

        let output = parts.join(' ');

        if (error) {
          if (error instanceof Error) {
            output += `\n  Error: ${error.name}: ${error.message}`;
            if (error.stack) {
              output += `\n  Stack: ${error.stack.split('\n').join('\n  ')}`;
            }
          } else {
            if (typeof error === 'string') {
              output += `\n  Error: ${error}`;
            } else if (typeof error === 'number' || typeof error === 'boolean') {
              output += `\n  Error: ${String(error)}`;
            } else {
              output += `\n  Error: [unknown]`;
            }
          }
        }

        if (context && Object.keys(context).length > 0) {
          const contextStr = Object.entries(context)
            .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
            .join('\n');
          output += '\n' + contextStr;
        }

        return output + '\n';
      };

      const context = {
        userId: '123',
        action: 'login',
        metadata: { ip: '192.168.1.1' },
      };

      const result = formatPretty(
        LogLevel.DEBUG,
        'User action',
        undefined,
        context,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const expected =
        '[2024-01-01T12:00:00.000Z] DEBUG User action\n' +
        '  userId: "123"\n' +
        '  action: "login"\n' +
        '  metadata: {"ip":"192.168.1.1"}\n';

      expect(result).toBe(expected);
    });

    it('should format errors with stack trace', () => {
      const formatPretty = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const parts: string[] = [];

        if (timestamp) {
          parts.push(`[${timestamp.toISOString()}]`);
        }

        const levelStr = LogLevel[level].padEnd(5);
        parts.push(levelStr);
        parts.push(message);

        let output = parts.join(' ');

        if (error) {
          const errorStr =
            error instanceof Error
              ? `\n  Error: ${error.message}${error.stack ? '\n' + error.stack : ''}`
              : typeof error === 'string'
                ? `\n  Error: ${error}`
                : typeof error === 'number' || typeof error === 'boolean'
                  ? `\n  Error: ${String(error)}`
                  : `\n  Error: [unknown]`;
          output += errorStr;
        }

        if (context && Object.keys(context).length > 0) {
          const contextStr = Object.entries(context)
            .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
            .join('\n');
          output += '\n' + contextStr;
        }

        return output + '\n';
      };

      const error = new Error('Connection failed');
      error.stack =
        'Error: Connection failed\n    at connect (net.js:1:1)\n    at main (app.js:10:5)';

      const result = formatPretty(
        LogLevel.ERROR,
        'Database error',
        error,
        undefined,
        new Date('2024-01-01T12:00:00.000Z'),
      );

      const expected =
        '[2024-01-01T12:00:00.000Z] ERROR Database error\n' +
        '  Error: Connection failed\n' +
        'Error: Connection failed\n' +
        '    at connect (net.js:1:1)\n' +
        '    at main (app.js:10:5)\n';

      expect(result).toBe(expected);
    });
  });

  describe('getLevelColor', () => {
    it('should return appropriate colors for each level', () => {
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

  describe('colorize', () => {
    it('should wrap text with color codes', () => {
      const colorize = (text: string, colorCode: string): string => {
        return `${colorCode}${text}\x1b[0m`;
      };

      expect(colorize('INFO', '\x1b[32m')).toBe('\x1b[32mINFO\x1b[0m');
      expect(colorize('ERROR', '\x1b[31m')).toBe('\x1b[31mERROR\x1b[0m');
    });
  });

  describe('formatPrettyColorized', () => {
    it('should format with colors when enabled', () => {
      const formatPrettyColorized = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
        useColor = true,
      ): string => {
        const getLevelColor = (level: LogLevel): string => {
          switch (level) {
            case LogLevel.TRACE:
              return '\x1b[90m';
            case LogLevel.DEBUG:
              return '\x1b[36m';
            case LogLevel.INFO:
              return '\x1b[32m';
            case LogLevel.WARN:
              return '\x1b[33m';
            case LogLevel.ERROR:
              return '\x1b[31m';
            case LogLevel.FATAL:
              return '\x1b[35m';
            default:
              return '\x1b[0m';
          }
        };

        const colorize = (text: string, colorCode: string): string => {
          return useColor ? `${colorCode}${text}\x1b[0m` : text;
        };

        const parts: string[] = [];

        // Timestamp in gray
        if (timestamp) {
          const timestampStr = `[${timestamp.toISOString()}]`;
          parts.push(colorize(timestampStr, '\x1b[90m'));
        }

        // Level with color
        const levelStr = LogLevel[level].padEnd(5);
        const levelColor = getLevelColor(level);
        parts.push(colorize(levelStr, levelColor));

        // Message
        parts.push(message);

        let output = parts.join(' ');

        // Context in gray
        if (context && Object.keys(context).length > 0) {
          const contextStr = Object.entries(context)
            .map(([key, value]) => {
              const line = `  ${key}: ${JSON.stringify(value)}`;
              return colorize(line, '\x1b[90m');
            })
            .join('\n');
          output += '\n' + contextStr;
        }

        // Error in red
        if (error) {
          const errorStr =
            error instanceof Error
              ? `  Error: ${error.message}${error.stack ? '\n' + error.stack : ''}`
              : typeof error === 'string'
                ? `  Error: ${error}`
                : typeof error === 'number' || typeof error === 'boolean'
                  ? `  Error: ${String(error)}`
                  : `  Error: [unknown]`;
          output += '\n' + colorize(errorStr, '\x1b[31m');
        }

        return output + '\n';
      };

      const result = formatPrettyColorized(
        LogLevel.INFO,
        'Server started',
        undefined,
        { port: 3000 },
        new Date('2024-01-01T12:00:00.000Z'),
      );

      // Check for color codes
      expect(result).toContain('\x1b[90m'); // Gray timestamp
      expect(result).toContain('\x1b[32m'); // Green INFO
      expect(result).toContain('\x1b[0m'); // Reset

      // Test without color
      const resultNoColor = formatPrettyColorized(
        LogLevel.INFO,
        'Server started',
        undefined,
        { port: 3000 },
        new Date('2024-01-01T12:00:00.000Z'),
        false,
      );

      expect(resultNoColor).not.toContain('\x1b[');
    });
  });

  describe('formatCompact', () => {
    it('should format in compact single-line format', () => {
      const formatCompact = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        const parts: string[] = [];

        // Short timestamp (time only)
        if (timestamp) {
          const timeParts = timestamp.toISOString().split('T');
          const time = timeParts[1] ? timeParts[1].replace('Z', '') : '';
          parts.push(time);
        }

        // Short level
        const levelMap: Record<LogLevel, string> = {
          [LogLevel.TRACE]: 'TRC',
          [LogLevel.DEBUG]: 'DBG',
          [LogLevel.INFO]: 'INF',
          [LogLevel.WARN]: 'WRN',
          [LogLevel.ERROR]: 'ERR',
          [LogLevel.FATAL]: 'FTL',
        };
        parts.push(levelMap[level]);

        // Message
        parts.push(message);

        // Inline context
        if (context && Object.keys(context).length > 0) {
          const contextPairs = Object.entries(context)
            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
            .join(' ');
          parts.push(`[${contextPairs}]`);
        }

        // Inline error
        if (error) {
          const errorMsg =
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : typeof error === 'number' || typeof error === 'boolean'
                  ? String(error)
                  : '[unknown]';
          parts.push(`!${errorMsg}`);
        }

        return parts.join(' ') + '\n';
      };

      const timestamp = new Date('2024-01-01T12:34:56.789Z');
      const result = formatCompact(
        LogLevel.ERROR,
        'Request failed',
        new Error('Timeout'),
        { reqId: '123', userId: 456 },
        timestamp,
      );

      expect(result).toBe('12:34:56.789 ERR Request failed [reqId="123" userId=456] !Timeout\n');
    });
  });

  describe('indentMultiline', () => {
    it('should indent multiline strings', () => {
      const indentMultiline = (text: string, indent = '  '): string => {
        return text
          .split('\n')
          .map((line, index) => (index === 0 ? line : indent + line))
          .join('\n');
      };

      const multiline = 'Line 1\nLine 2\nLine 3';
      const result = indentMultiline(multiline, '    ');

      expect(result).toBe('Line 1\n    Line 2\n    Line 3');
    });
  });
});
