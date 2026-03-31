/**
 * File sink implementation for logger output
 *
 * Provides safe file logging with automatic directory creation and error handling.
 * Uses dependency injection for testability.
 *
 * The sink writes pre-formatted log strings directly to files without any
 * additional formatting. The caller is responsible for formatting and adding newlines.
 */

import { dirname } from 'node:path';
import type { FileSinkConfig } from './sink-config';
import type { LogEvent, LogSink } from './types.js';

/**
 * Minimal write stream interface for file sink
 */
export interface SimpleWriteStream {
  readonly write: (
    chunk: string,
    encoding?: string,
    cb?: (error?: Error | null) => void,
  ) => boolean;
  readonly end: (cb?: () => void) => SimpleWriteStream;
}

/**
 * File system interface for dependency injection
 */
export interface FileSystem {
  readonly mkdirSync: (path: string, options?: { recursive?: boolean }) => void;
  readonly createWriteStream: (path: string, options?: { flags?: string }) => SimpleWriteStream;
}

/**
 * Interface for file sink operations
 */
export interface FileSinkInterface extends LogSink {
  /**
   * Writes a logger event to the file.
   *
   * @param event - Immutable logger event
   */
  write(event: LogEvent): void;
  /**
   * Closes the file sink
   */
  end(): void;
}

/**
 * Creates a file sink with safe initialization and error handling
 *
 * @param config - File sink configuration (path and append mode)
 * @param fs - File system dependency (for testability)
 * @returns File sink interface or null if initialization fails
 *
 * @example
 * ```typescript
 * const fs = require('fs');
 * const sink = createFileSink({ path: '/tmp/app.log', append: true }, fs);
 * if (sink) {
 *   // Write pre-formatted log line (with newline)
 *   sink.write('{"Timestamp":"2025-11-08T12:00:00.000Z","Body":"App started"}\n');
 * }
 * ```
 */
export function createFileSink(config: FileSinkConfig, fs: FileSystem): FileSinkInterface | null {
  const { path: filePath, append = true } = config;
  const flags = append ? 'a' : 'w';

  try {
    // Ensure parent directory exists
    const parentDir = dirname(filePath);
    fs.mkdirSync(parentDir, { recursive: true });

    // Create write stream
    const stream = fs.createWriteStream(filePath, { flags });

    return {
      write(event: LogEvent): void {
        try {
          stream.write(event.line, 'utf8', (error?: Error | null) => {
            if (error) {
              console.error('Failed to write log line to file', {
                path: filePath,
                error: error instanceof Error ? error.message : String(error),
              });
            }
          });
        } catch (writeError) {
          console.error('Failed to write log line to file', {
            path: filePath,
            error: writeError instanceof Error ? writeError.message : String(writeError),
          });
        }
      },
      end(): void {
        stream.end();
      },
    };
  } catch (error) {
    console.error('Failed to initialise file sink', {
      path: filePath,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
