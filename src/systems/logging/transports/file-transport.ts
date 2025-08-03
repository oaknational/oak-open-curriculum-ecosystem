/**
 * @fileoverview Main file transport implementation
 * @module @oak-mcp-core/logging/transports
 *
 * Core file transport class that handles buffered writing of formatted
 * log entries to files using injected writer dependencies.
 */

// =============================================================================
// IMPORTS
// =============================================================================
import type {
  LogLevel,
  LogContext,
  LogFormatter,
  FileWriter,
  FileTransportOptions,
} from '../types/index.js';
import type { FileLogTransport } from './file-types.js';
import { createDefaultFormatter } from './file-formatters.js';

// =============================================================================
// TRANSPORT IMPLEMENTATION
// =============================================================================

/**
 * File transport implementation
 * Writes formatted logs to file using injected writer
 */
export class FileTransport implements FileLogTransport {
  private readonly writer: FileWriter;
  private readonly formatter: LogFormatter;
  private readonly bufferSize: number;

  private buffer: string[] = [];
  private isClosed = false;

  constructor(options: FileTransportOptions) {
    this.writer = options.writer;
    this.formatter =
      options.formatter ??
      createDefaultFormatter({
        includeTimestamp: options.includeTimestamp ?? true,
        includeStackTrace: options.includeStackTrace ?? true,
      });
    this.bufferSize = options.bufferSize ?? 0;
  }

  async log(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
  ): Promise<void> {
    if (this.isClosed) {
      throw new Error('Transport is closed');
    }

    const formatted = this.formatter.format(level, message, error, context, new Date());

    if (this.bufferSize > 0) {
      this.buffer.push(formatted);

      if (this.buffer.length >= this.bufferSize) {
        await this.flushBuffer();
      }
    } else {
      // Write immediately if no buffering
      await this.writer.write(formatted);
    }
  }

  /**
   * Flush buffer to file
   */
  private async flushBuffer(): Promise<void> {
    if (this.buffer.length > 0) {
      const data = this.buffer.join('');
      this.buffer = [];
      await this.writer.write(data);
    }
  }

  async flush(): Promise<void> {
    if (this.isClosed) {
      return;
    }

    await this.flushBuffer();
    await this.writer.flush();
  }

  async close(): Promise<void> {
    if (this.isClosed) {
      return;
    }

    try {
      await this.flush();
      await this.writer.close();
    } finally {
      this.isClosed = true;
    }
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Factory function for creating file transport
 * Enables easy dependency injection
 */
export function createFileTransport(options: FileTransportOptions): FileTransport {
  return new FileTransport(options);
}
