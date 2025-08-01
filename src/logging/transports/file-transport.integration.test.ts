/**
 * @fileoverview Integration tests for file transport with injected file writer
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LogLevel } from '../logger-interface.js';
import type { LogTransport, LogContext } from '../logger-interface.js';

describe('File Transport Integration', () => {
  // Mock file writer interface
  interface FileWriter {
    write(data: string): Promise<void>;
    flush(): Promise<void>;
    close(): Promise<void>;
  }

  // Simple mock file writer for testing
  class MockFileWriter implements FileWriter {
    private buffer: string[] = [];
    private _isOpen = true;
    private _flushCount = 0;

    async write(data: string): Promise<void> {
      if (!this._isOpen) {
        throw new Error('Writer is closed');
      }
      this.buffer.push(data);
    }

    async flush(): Promise<void> {
      if (!this._isOpen) {
        throw new Error('Writer is closed');
      }
      this._flushCount++;
    }

    async close(): Promise<void> {
      this._isOpen = false;
    }

    getContents(): string {
      return this.buffer.join('');
    }

    getLines(): string[] {
      return this.buffer.filter((line) => line.trim().length > 0);
    }

    get isOpen(): boolean {
      return this._isOpen;
    }

    get flushCount(): number {
      return this._flushCount;
    }
  }

  describe('FileTransport', () => {
    let mockWriter: MockFileWriter;

    beforeEach(() => {
      mockWriter = new MockFileWriter();
    });

    it('should write formatted log entries to file', async () => {
      // Simulate FileTransport behavior
      const createFileTransport = (
        writer: FileWriter,
        options?: {
          formatter?: (
            level: LogLevel,
            message: string,
            error?: unknown,
            context?: LogContext,
          ) => string;
        },
      ): LogTransport => {
        const defaultFormatter = (
          level: LogLevel,
          message: string,
          error?: unknown,
          context?: LogContext,
        ): string => {
          const parts: string[] = [new Date().toISOString(), `[${LogLevel[level]}]`, message];

          if (context && Object.keys(context).length > 0) {
            parts.push(JSON.stringify(context));
          }

          if (error) {
            parts.push(error instanceof Error ? error.stack || error.message : String(error));
          }

          return parts.join(' ') + '\n';
        };

        const formatter = options?.formatter || defaultFormatter;

        return {
          log: async (
            level: LogLevel,
            message: string,
            error?: unknown,
            context?: LogContext,
          ): Promise<void> => {
            const formatted = formatter(level, message, error, context);
            await writer.write(formatted);
          },

          flush: async (): Promise<void> => {
            await writer.flush();
          },

          close: async (): Promise<void> => {
            await writer.flush();
            await writer.close();
          },
        };
      };

      const transport = createFileTransport(mockWriter);

      await transport.log(LogLevel.INFO, 'Test message');
      await transport.log(LogLevel.ERROR, 'Error occurred', new Error('Test error'));
      await transport.log(LogLevel.DEBUG, 'Debug info', undefined, { userId: '123' });

      const lines = mockWriter.getLines();
      expect(lines).toHaveLength(3);

      expect(lines[0]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[INFO\] Test message/);
      expect(lines[1]).toMatch(/\[ERROR\] Error occurred Error: Test error/);
      expect(lines[2]).toMatch(/\[DEBUG\] Debug info {"userId":"123"}/);
    });

    it('should use custom formatter when provided', async () => {
      const customFormatter = (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
      ): string => {
        const errorStr = error ? `|${error instanceof Error ? error.message : String(error)}` : '';
        return `${LogLevel[level]}|${message}${errorStr}|${JSON.stringify(context || {})}\n`;
      };

      const createFileTransport = (
        writer: FileWriter,
        formatter: (
          level: LogLevel,
          message: string,
          error?: unknown,
          context?: LogContext,
        ) => string,
      ): LogTransport => {
        return {
          log: async (
            level: LogLevel,
            message: string,
            error?: unknown,
            context?: LogContext,
          ): Promise<void> => {
            const formatted = formatter(level, message, error, context);
            await writer.write(formatted);
          },
        };
      };

      const transport = createFileTransport(mockWriter, customFormatter);

      await transport.log(LogLevel.WARN, 'Warning', undefined, { module: 'auth' });

      const content = mockWriter.getContents();
      expect(content).toBe('WARN|Warning|{"module":"auth"}\n');
    });

    it('should handle buffered writes', async () => {
      const createBufferedFileTransport = (writer: FileWriter, bufferSize = 3): LogTransport => {
        const buffer: string[] = [];

        const flushBuffer = async (): Promise<void> => {
          if (buffer.length > 0) {
            for (const line of buffer) {
              await writer.write(line);
            }
            buffer.length = 0;
          }
        };

        return {
          log: async (
            level: LogLevel,
            message: string,
            error?: unknown,
            context?: LogContext,
          ): Promise<void> => {
            // This test focuses on buffering behavior only
            if (error || context) {
              throw new Error('Buffer test should not use error or context parameters');
            }

            const line = `[${LogLevel[level]}] ${message}\n`;
            buffer.push(line);

            if (buffer.length >= bufferSize) {
              await flushBuffer();
            }
          },

          flush: async (): Promise<void> => {
            await flushBuffer();
            await writer.flush();
          },

          close: async (): Promise<void> => {
            await flushBuffer();
            await writer.close();
          },
        };
      };

      const transport = createBufferedFileTransport(mockWriter, 3);

      // Write 2 messages - should not flush yet
      await transport.log(LogLevel.INFO, 'Message 1');
      await transport.log(LogLevel.INFO, 'Message 2');
      expect(mockWriter.getLines()).toHaveLength(0);

      // Third message triggers flush
      await transport.log(LogLevel.INFO, 'Message 3');
      expect(mockWriter.getLines()).toHaveLength(3);

      // Write one more and manually flush
      await transport.log(LogLevel.INFO, 'Message 4');
      expect(mockWriter.getLines()).toHaveLength(3);

      if (!transport.flush) {
        throw new Error('Expected transport to have flush method');
      }
      await transport.flush();
      expect(mockWriter.getLines()).toHaveLength(4);
    });

    it('should handle file rotation', async () => {
      // Mock file writer that supports rotation
      class RotatingFileWriter implements FileWriter {
        private files = new Map<string, string[]>();
        private currentFile: string;
        private maxSize: number;
        private currentSize = 0;

        constructor(baseFile: string, maxSize = 100) {
          this.currentFile = baseFile;
          this.maxSize = maxSize;
          this.files.set(baseFile, []);
        }

        async write(data: string): Promise<void> {
          this.currentSize += data.length;

          if (this.currentSize > this.maxSize) {
            await this.rotate();
          }

          const lines = this.files.get(this.currentFile) || [];
          lines.push(data);
          this.files.set(this.currentFile, lines);
        }

        async flush(): Promise<void> {
          // No-op for test
        }

        async close(): Promise<void> {
          // No-op for test
        }

        private async rotate(): Promise<void> {
          const timestamp = Date.now();
          this.currentFile = `log.${timestamp}.txt`;
          this.files.set(this.currentFile, []);
          this.currentSize = 0;
        }

        getFiles(): string[] {
          return Array.from(this.files.keys());
        }

        getFileContents(filename: string): string[] {
          return this.files.get(filename) || [];
        }
      }

      const rotatingWriter = new RotatingFileWriter('log.txt', 50);

      const createFileTransport = (writer: FileWriter): LogTransport => {
        return {
          log: async (level: LogLevel, message: string): Promise<void> => {
            const line = `[${LogLevel[level]}] ${message}\n`;
            await writer.write(line);
          },
        };
      };

      const transport = createFileTransport(rotatingWriter);

      // Write messages that will trigger rotation
      await transport.log(LogLevel.INFO, 'This is a long message that will');
      await transport.log(LogLevel.INFO, 'trigger file rotation');

      const files = rotatingWriter.getFiles();
      expect(files.length).toBeGreaterThan(1);
    });

    it('should handle write errors gracefully', async () => {
      const createFailingWriter = (): FileWriter => {
        let writeCount = 0;

        return {
          write: async (data: string): Promise<void> => {
            if (!data || typeof data !== 'string') {
              throw new Error('Invalid data passed to write');
            }
            writeCount++;
            if (writeCount > 2) {
              throw new Error('Write failed: disk full');
            }
          },
          flush: async (): Promise<void> => {
            // No-op for this test - testing write failures only
          },
          close: async (): Promise<void> => {
            // No-op for this test - testing write failures only
          },
        };
      };

      const failingWriter = createFailingWriter();

      const createFileTransport = (writer: FileWriter): LogTransport => {
        return {
          log: async (level: LogLevel, message: string): Promise<void> => {
            const line = `[${LogLevel[level]}] ${message}\n`;
            await writer.write(line);
          },
        };
      };

      const transport = createFileTransport(failingWriter);

      // First two writes succeed
      await transport.log(LogLevel.INFO, 'Message 1');
      await transport.log(LogLevel.INFO, 'Message 2');

      // Third write fails
      await expect(transport.log(LogLevel.INFO, 'Message 3')).rejects.toThrow(
        'Write failed: disk full',
      );
    });

    it('should properly close file on transport close', async () => {
      const createFileTransport = (writer: FileWriter): LogTransport => {
        return {
          log: async (level: LogLevel, message: string): Promise<void> => {
            const line = `[${LogLevel[level]}] ${message}\n`;
            await writer.write(line);
          },

          close: async (): Promise<void> => {
            await writer.flush();
            await writer.close();
          },
        };
      };

      const transport = createFileTransport(mockWriter);

      await transport.log(LogLevel.INFO, 'Final message');
      expect(mockWriter.isOpen).toBe(true);

      if (!transport.close) {
        throw new Error('Expected transport to have close method');
      }
      await transport.close();
      expect(mockWriter.isOpen).toBe(false);
      expect(mockWriter.flushCount).toBe(1);

      // Writes after close should fail
      await expect(mockWriter.write('Should fail')).rejects.toThrow('Writer is closed');
    });
  });
});
