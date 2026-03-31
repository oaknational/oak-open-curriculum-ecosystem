/**
 * `@oaknational/logger`
 *
 * Runtime-agnostic logging library for multi-runtime MCP applications
 * Outputs OpenTelemetry-compliant single-line JSON logs
 */

// Unified Logger
export { UnifiedLogger } from './unified-logger.js';

// Context Merging
export { mergeLogContext } from './context-merging.js';

// Error Normalisation
export { buildNormalizedError, isNormalizedError, normalizeError } from './error-normalisation.js';

// JSON Sanitisation
export { sanitiseForJson, isJsonValue, sanitiseObject } from './json-sanitisation.js';

// Express Middleware (optional, requires express peer dependency)
export {
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
  type ErrorLoggerOptions,
  type HeaderRedactor,
  type RequestLoggerOptions,
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
export {
  DEFAULT_HTTP_SINK_CONFIG,
  parseSinkConfigFromEnv,
  type LoggerSinkConfig,
  type LoggerSinkEnvironment,
} from './sink-config.js';

// Export log level utilities
export {
  LOG_LEVEL_VALUES,
  LOG_LEVEL_KEY,
  ENABLE_DEBUG_LOGGING_KEY,
  isLogLevel,
  getDefaultLogLevel,
  parseLogLevel,
  compareLogLevels,
  shouldLog,
  type LogLevel,
  type BaseLoggingEnvironment,
} from './log-levels.js';

// Timing utilities
export {
  startTimer,
  createPhasedTimer,
  type Duration,
  type Timer,
  type PhaseHandle,
  type PhasedTimer,
  type PhaseResult,
} from './timing.js';

// Error Context Enrichment
export { enrichError, type ErrorContext } from './error-context.js';

// Resource Attributes
export { buildResourceAttributes, getDeploymentEnvironment } from './resource-attributes.js';
export type { ResourceAttributes } from './resource-attributes.js';

// OpenTelemetry Format
export { logLevelToSeverityNumber, logLevelToSeverityText } from './otel-format.js';
export type { OtelLogRecord } from './otel-format.js';
