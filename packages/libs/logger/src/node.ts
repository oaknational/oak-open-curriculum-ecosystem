/**
 * Node.js entry point for `@oaknational/mcp-logger`.
 *
 * @remarks
 * Use this subpath export when running inside a Node.js environment that has
 * access to the filesystem. It re-exports the browser-safe API and augments it
 * with file-sink capable utilities that rely on Node.js built-ins.
 */
export { createAdaptiveLogger } from './adaptive-node.js';
export { ConsolaLogger } from './consola-logger.js';
export { mergeLogContext } from './context-merging.js';
export { normalizeError } from './error-normalisation.js';
export { sanitiseForJson, isJsonValue, sanitiseObject } from './json-sanitisation.js';
export {
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
} from './express-middleware.js';
export { isLevelEnabled } from './pure-functions.js';
export { convertLogLevel, toConsolaLevel } from './log-level-conversion.js';
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
export { MultiSinkLogger } from './multi-sink-logger.js';
export { createFileSink } from './file-sink.js';

export type { LoggerOptions, Logger, JsonObject } from './types.js';
export type { RequestLoggerOptions } from './express-middleware.js';
export type { FileSinkConfig, LoggerSinkConfig, LoggerSinkEnvironment } from './sink-config.js';
export type { LogLevel, BaseLoggingEnvironment } from './log-levels.js';
export type { FileSinkInterface, FileSystem, SimpleWriteStream } from './file-sink.js';
export { startTimer } from './timing.js';
export type { Duration, Timer } from './timing.js';
