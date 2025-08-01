/**
 * @fileoverview File transport implementation for logging
 * @module @oak-mcp-core/logging
 *
 * This transport will be extracted to oak-mcp-core.
 * Uses dependency injection for file writing operations.
 * Edge-compatible through abstracted file operations.
 */

import {
  LogLevel,
  type LogTransport,
  type LogContext,
  type LogFormatter,
} from '../logger-interface.js';

/**
 * File writer interface for dependency injection
 * Implementations handle actual file I/O
 */
export interface FileWriter {
  /**
   * Write data to file
   * Should handle buffering internally if needed
   */
  write(data: string): Promise<void>;

  /**
   * Flush any buffered data
   */
  flush(): Promise<void>;

  /**
   * Close the file and release resources
   */
  close(): Promise<void>;
}

/**
 * Options for file transport
 */
export interface FileTransportOptions {
  /**
   * File writer instance (required)
   */
  writer: FileWriter;

  /**
   * Custom formatter for log entries
   */
  formatter?: LogFormatter;

  /**
   * Buffer size before auto-flush (0 = no buffering)
   */
  bufferSize?: number;

  /**
   * Include timestamp in default format
   */
  includeTimestamp?: boolean;

  /**
   * Include stack traces for errors
   */
  includeStackTrace?: boolean;
}

/**
 * Default formatter for file output
 * Pure function - no side effects
 */
export function defaultFileFormatter(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
): string {
  const parts: string[] = [];

  // Add timestamp
  if (timestamp) {
    parts.push(timestamp.toISOString());
  }

  // Add level
  parts.push(`[${LogLevel[level] || 'UNKNOWN'}]`);

  // Add message
  parts.push(message);

  // Add context if present
  if (context && Object.keys(context).length > 0) {
    parts.push(JSON.stringify(context));
  }

  // Add error if present
  if (error) {
    if (error instanceof Error) {
      parts.push(error.stack || error.message);
    } else {
      parts.push(String(error));
    }
  }

  return parts.join(' ') + '\n';
}

/**
 * File transport implementation
 * Writes formatted logs to file using injected writer
 */
export class FileTransport implements LogTransport {
  private readonly writer: FileWriter;
  private readonly formatter: LogFormatter;
  private readonly bufferSize: number;
  private readonly includeTimestamp: boolean;
  private readonly includeStackTrace: boolean;

  private buffer: string[] = [];
  private isClosed = false;

  constructor(options: FileTransportOptions) {
    if (!options.writer) {
      throw new Error('FileTransport requires a writer');
    }

    this.writer = options.writer;
    this.formatter = options.formatter || this.createDefaultFormatter();
    this.bufferSize = options.bufferSize ?? 0;
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.includeStackTrace = options.includeStackTrace ?? true;
  }

  /**
   * Create default formatter with options
   */
  private createDefaultFormatter(): LogFormatter {
    return {
      format: (
        level: LogLevel,
        message: string,
        error?: unknown,
        context?: LogContext,
        timestamp?: Date,
      ): string => {
        // Use timestamp if includeTimestamp is true
        const ts = this.includeTimestamp ? timestamp || new Date() : undefined;

        // Process error based on includeStackTrace option
        let processedError = error;
        if (error instanceof Error && !this.includeStackTrace) {
          processedError = error.message;
        }

        return defaultFileFormatter(level, message, processedError, context, ts);
      },
    };
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

/**
 * Factory function for creating file transport
 * Enables easy dependency injection
 */
export function createFileTransport(options: FileTransportOptions): FileTransport {
  return new FileTransport(options);
}

/**
 * Helper to create a simple file formatter
 * Pure function factory
 */
export function createSimpleFileFormatter(
  options: {
    delimiter?: string;
    includeLevel?: boolean;
    includeTimestamp?: boolean;
    dateFormat?: (date: Date) => string;
  } = {},
): LogFormatter {
  const {
    delimiter = ' | ',
    includeLevel = true,
    includeTimestamp = true,
    dateFormat = (d) => d.toISOString(),
  } = options;

  return {
    format: (
      level: LogLevel,
      message: string,
      error?: unknown,
      context?: LogContext,
      timestamp?: Date,
    ): string => {
      const parts: string[] = [];

      if (includeTimestamp && timestamp) {
        parts.push(dateFormat(timestamp));
      }

      if (includeLevel) {
        parts.push(LogLevel[level] || 'UNKNOWN');
      }

      parts.push(message);

      if (context && Object.keys(context).length > 0) {
        parts.push(JSON.stringify(context));
      }

      if (error) {
        parts.push(error instanceof Error ? error.message : String(error));
      }

      return parts.join(delimiter) + '\n';
    },
  };
}
