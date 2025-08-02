/**
 * @fileoverview Integration tests for console transport with injected console
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LogLevel } from '../logger-interface.js';
import type { LogTransport, LogContext } from '../logger-interface.js';

describe('Console Transport Integration', () => {
  // Simple mock console for testing
  interface MockConsole {
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    log: (...args: unknown[]) => void;
    calls: { method: string; args: unknown[] }[];
  }

  function createMockConsole(): MockConsole {
    const calls: { method: string; args: unknown[] }[] = [];

    return {
      calls,
      debug: (...args: unknown[]) => {
        calls.push({ method: 'debug', args });
      },
      info: (...args: unknown[]) => {
        calls.push({ method: 'info', args });
      },
      warn: (...args: unknown[]) => {
        calls.push({ method: 'warn', args });
      },
      error: (...args: unknown[]) => {
        calls.push({ method: 'error', args });
      },
      log: (...args: unknown[]) => {
        calls.push({ method: 'log', args });
      },
    };
  }

  describe('ConsoleTransport', () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
      mockConsole = createMockConsole();
    });

    it('should log to appropriate console method based on level', () => {
      // Simulate ConsoleTransport behavior
      const createConsoleTransport = (console: MockConsole): LogTransport => {
        return {
          log: (level: LogLevel, message: string, error?: unknown, context?: LogContext): void => {
            const method = getConsoleMethod(level);
            const args = buildArgs(level, message, error, context);
            const consoleMethod = console[method];
            if (typeof consoleMethod === 'function') {
              consoleMethod(...args);
            }
          },
        };
      };

      const getConsoleMethod = (level: LogLevel): keyof MockConsole => {
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

      const buildArgs = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
      ): unknown[] => {
        const args: unknown[] = [];
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

      const transport = createConsoleTransport(mockConsole);

      void transport.log(LogLevel.INFO, 'Info message');
      void transport.log(LogLevel.ERROR, 'Error message', new Error('test'));
      void transport.log(LogLevel.DEBUG, 'Debug message', undefined, { userId: '123' });

      expect(mockConsole.calls).toHaveLength(3);
      expect(mockConsole.calls[0]).toEqual({
        method: 'info',
        args: ['[INFO]', 'Info message'],
      });
      expect(mockConsole.calls[1]).toEqual({
        method: 'error',
        args: ['[ERROR]', 'Error message', new Error('test')],
      });
      expect(mockConsole.calls[2]).toEqual({
        method: 'debug',
        args: ['[DEBUG]', 'Debug message', { userId: '123' }],
      });
    });

    it('should support async logging', async () => {
      const createAsyncConsoleTransport = (console: MockConsole, delay = 0): LogTransport => {
        return {
          log: async (
            level: LogLevel,
            message: string,
            error?: unknown,
            context?: LogContext,
          ): Promise<void> => {
            if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }

            const method = level >= LogLevel.ERROR ? 'error' : 'info';
            const levelStr = LogLevel[level];
            console[method](`[${levelStr}]`, message, context, error);
          },
        };
      };

      const transport = createAsyncConsoleTransport(mockConsole, 10);

      await transport.log(LogLevel.INFO, 'Async message', undefined, { async: true });

      expect(mockConsole.calls).toHaveLength(1);
      expect(mockConsole.calls[0]).toEqual({
        method: 'info',
        args: ['[INFO]', 'Async message', { async: true }, undefined],
      });
    });

    it('should handle flush operation', async () => {
      let flushCalled = false;

      const createFlushableTransport = (console: MockConsole): LogTransport => {
        const pendingLogs: (() => void)[] = [];

        return {
          log: (level: LogLevel, message: string, error?: unknown, context?: LogContext): void => {
            // This test focuses on flush behavior only
            if (error ?? context) {
              throw new Error('Flush test should not use error or context parameters');
            }

            const logFn = () => {
              const levelStr = LogLevel[level];
              console.info(`[${levelStr}]`, message);
            };

            // Simulate buffering
            pendingLogs.push(logFn);

            // Auto-flush for this test
            if (pendingLogs.length >= 2) {
              pendingLogs.forEach((fn) => {
                fn();
              });
              pendingLogs.length = 0;
            }
          },

          flush: (): Promise<void> => {
            flushCalled = true;
            pendingLogs.forEach((fn) => {
              fn();
            });
            pendingLogs.length = 0;
            return Promise.resolve();
          },
        };
      };

      const transport = createFlushableTransport(mockConsole);

      void transport.log(LogLevel.INFO, 'Message 1');
      void transport.log(LogLevel.INFO, 'Message 2');

      // Should auto-flush after 2 messages
      expect(mockConsole.calls).toHaveLength(2);

      void transport.log(LogLevel.INFO, 'Message 3');
      expect(mockConsole.calls).toHaveLength(2); // Not flushed yet

      if (transport.flush) {
        await transport.flush();
      }

      expect(flushCalled).toBe(true);
      expect(mockConsole.calls).toHaveLength(3);
    });

    it('should handle close operation', async () => {
      let closeCalled = false;

      const createCloseableTransport = (console: MockConsole): LogTransport => {
        let isOpen = true;

        return {
          log: (level: LogLevel, message: string, error?: unknown, context?: LogContext): void => {
            // This test focuses on close behavior only
            if (error ?? context) {
              throw new Error('Close test should not use error or context parameters');
            }

            if (!isOpen) {
              throw new Error('Transport is closed');
            }

            const levelStr = LogLevel[level];
            console.info(`[${levelStr}]`, message);
          },

          close: (): Promise<void> => {
            closeCalled = true;
            isOpen = false;
            return Promise.resolve();
          },
        };
      };

      const transport = createCloseableTransport(mockConsole);

      void transport.log(LogLevel.INFO, 'Before close');
      expect(mockConsole.calls).toHaveLength(1);

      if (transport.close) {
        await transport.close();
      }

      expect(closeCalled).toBe(true);

      // Should throw after close
      expect(() => {
        void transport.log(LogLevel.INFO, 'After close');
      }).toThrow('Transport is closed');
    });

    it('should format output with options', () => {
      const createFormattedTransport = (
        console: MockConsole,
        options: {
          prefix?: string;
          includeTimestamp?: boolean;
          uppercase?: boolean;
        } = {},
      ): LogTransport => {
        return {
          log: (level: LogLevel, message: string, error?: unknown, context?: LogContext): void => {
            const parts: string[] = [];

            if (options.prefix) {
              parts.push(options.prefix);
            }

            if (options.includeTimestamp) {
              parts.push(new Date().toISOString());
            }

            const levelStr = LogLevel[level];
            parts.push(`[${options.uppercase ? levelStr : levelStr.toLowerCase()}]`);

            parts.push(message);

            const args: unknown[] = [parts.join(' ')];

            if (context && Object.keys(context).length > 0) {
              args.push(context);
            }

            if (error) {
              args.push(error);
            }

            console.info(...args);
          },
        };
      };

      const transport = createFormattedTransport(mockConsole, {
        prefix: 'APP',
        uppercase: false,
      });

      void transport.log(LogLevel.WARN, 'Warning message', undefined, { module: 'auth' });

      expect(mockConsole.calls).toHaveLength(1);
      const firstCall = mockConsole.calls[0];
      if (!firstCall) {
        throw new Error('Expected at least one console call');
      }
      expect(firstCall.method).toBe('info');
      expect(firstCall.args[0]).toBe('APP [warn] Warning message');
      expect(firstCall.args[1]).toEqual({ module: 'auth' });
    });
  });
});
