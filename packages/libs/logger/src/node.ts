/**
 * Node.js entry point for `@oaknational/logger`.
 *
 * @remarks
 * Use this subpath export when running inside a Node.js environment that has
 * access to the filesystem. It re-exports the browser-safe API and augments it
 * with file-sink capable utilities that rely on Node.js built-ins.
 */
import { mkdirSync, createWriteStream, type WriteStream as NodeWriteStream } from 'node:fs';
import process from 'node:process';
import {
  createFileSink,
  type FileSinkInterface,
  type FileSystem,
  type SimpleWriteStream,
} from './file-sink.js';
import type { FileSinkConfig } from './sink-config.js';
import type { LogEvent, LogSink } from './types.js';

export { mergeLogContext } from './context-merging.js';
export { buildNormalizedError, isNormalizedError, normalizeError } from './error-normalisation.js';
export { sanitiseForJson, isJsonValue, sanitiseObject } from './json-sanitisation.js';
export {
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
} from './express-middleware.js';
export {
  LOG_LEVEL_VALUES,
  LOG_LEVEL_KEY,
  ENABLE_DEBUG_LOGGING_KEY,
  isLogLevel,
  getDefaultLogLevel,
  parseLogLevel,
  compareLogLevels,
  shouldLog,
} from './log-levels.js';
export {
  DEFAULT_HTTP_SINK_CONFIG,
  DEFAULT_STDIO_SINK_CONFIG,
  parseSinkConfigFromEnv,
} from './sink-config.js';
export { createFileSink } from './file-sink.js';
export { UnifiedLogger } from './unified-logger.js';
export { buildResourceAttributes, getDeploymentEnvironment } from './resource-attributes.js';

/**
 * Adapt Node.js WriteStream to SimpleWriteStream interface
 */
function adaptWriteStream(stream: NodeWriteStream): SimpleWriteStream {
  return {
    write: (chunk: string, encoding?: string, cb?: (error?: Error | null) => void): boolean => {
      const bufferEncoding = encoding === 'utf8' || encoding === 'utf-8' ? 'utf8' : 'utf8';
      if (cb) {
        return stream.write(chunk, bufferEncoding, cb);
      }
      return stream.write(chunk, bufferEncoding);
    },
    end: (cb?: () => void): SimpleWriteStream => {
      stream.end(cb);
      return adaptWriteStream(stream);
    },
  };
}

/**
 * Node.js file system implementation for file sink
 */
export const NODE_FILE_SYSTEM: FileSystem = {
  mkdirSync,
  createWriteStream: (path: string, options?: { flags?: string }) =>
    adaptWriteStream(createWriteStream(path, options)),
};

/**
 * Create a stdout sink that writes to process.stdout (Node.js only)
 *
 * This function provides the ONLY access to process.stdout in the logger package.
 * The sink writes pre-formatted strings directly to stdout without any
 * additional processing. The caller is responsible for formatting and
 * adding newlines.
 *
 * @returns Log sink instance
 *
 * @example
 * ```typescript
 * const sink = createNodeStdoutSink();
 * sink.write({
 *   level: 'INFO',
 *   message: 'message',
 *   context: {},
 *   otelRecord: { ... },
 *   line: '{"Timestamp":"2025-11-09T10:00:00.000Z","Body":"message"}\n',
 * });
 * ```
 */
export function createNodeStdoutSink(): LogSink {
  return {
    write(event: LogEvent): void {
      process.stdout.write(event.line);
    },
  };
}

/**
 * Create a file sink using Node.js file system (Node.js only)
 *
 * This is a convenience wrapper around createFileSink that provides the
 * Node.js file system implementation.
 *
 * @param config - File sink configuration (path and append mode)
 * @returns File sink interface or null if initialization fails
 *
 * @example
 * ```typescript
 * const sink = createNodeFileSink({ path: '/tmp/app.log', append: true });
 * if (sink) {
 *   sink.write({
 *     level: 'INFO',
 *     message: 'message',
 *     context: {},
 *     otelRecord: { ... },
 *     line: '{"Timestamp":"2025-11-09T10:00:00.000Z","Body":"message"}\n',
 *   });
 * }
 * ```
 */
export function createNodeFileSink(config: FileSinkConfig): FileSinkInterface | null {
  return createFileSink(config, NODE_FILE_SYSTEM);
}

export type {
  ErrorLoggerOptions,
  HeaderRedactor,
  RequestLoggerOptions,
} from './express-middleware.js';
export type {
  JsonObject,
  JsonValue,
  LogContext,
  LogContextInput,
  LogContextInputValue,
  LogEvent,
  LogSink,
  Logger,
  LoggerOptions,
  NormalizedError,
} from './types.js';
export type { FileSinkConfig, LoggerSinkConfig, LoggerSinkEnvironment } from './sink-config.js';
export type { LogLevel, BaseLoggingEnvironment } from './log-levels.js';
export type { FileSinkInterface, FileSystem, SimpleWriteStream } from './file-sink.js';
export { startTimer, createPhasedTimer } from './timing.js';
export type { Duration, Timer, PhaseHandle, PhasedTimer, PhaseResult } from './timing.js';
export { enrichError } from './error-context.js';
export type { ErrorContext } from './error-context.js';
export type { ResourceAttributes } from './resource-attributes.js';
export type { OtelLogRecord } from './otel-format.js';
