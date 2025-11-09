/**
 * Node.js entry point for `@oaknational/mcp-logger`.
 *
 * @remarks
 * Use this subpath export when running inside a Node.js environment that has
 * access to the filesystem. It re-exports the browser-safe API and augments it
 * with file-sink capable utilities that rely on Node.js built-ins.
 */
export { mergeLogContext } from './context-merging.js';
export { normalizeError } from './error-normalisation.js';
export { sanitiseForJson, isJsonValue, sanitiseObject } from './json-sanitisation.js';
export {
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
} from './express-middleware.js';
export { isLevelEnabled } from './pure-functions.js';
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

// Import the StdoutSink interface
import type { StdoutSink } from './stdout-sink.js';

/**
 * Create a stdout sink that writes to process.stdout (Node.js only)
 *
 * The sink writes pre-formatted strings directly to stdout without any
 * additional processing. The caller is responsible for formatting and
 * adding newlines.
 *
 * @returns Stdout sink instance
 */
export function createNodeStdoutSink(): StdoutSink {
  return {
    write(line: string): void {
      process.stdout.write(line);
    },
  };
}

export type { LoggerOptions, Logger, JsonObject } from './types.js';
export type { RequestLoggerOptions } from './express-middleware.js';
export type { FileSinkConfig, LoggerSinkConfig, LoggerSinkEnvironment } from './sink-config.js';
export type { LogLevel, BaseLoggingEnvironment } from './log-levels.js';
export type { FileSinkInterface, FileSystem, SimpleWriteStream } from './file-sink.js';
export type { StdoutSink } from './stdout-sink.js';
export { startTimer } from './timing.js';
export type { Duration, Timer } from './timing.js';
export { enrichError } from './error-context.js';
export type { ErrorContext } from './error-context.js';
export type { ResourceAttributes } from './resource-attributes.js';
export type { OtelLogRecord } from './otel-format.js';
