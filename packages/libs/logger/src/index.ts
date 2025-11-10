/**
 * @oaknational/mcp-logger
 *
 * Runtime-agnostic logging library for multi-runtime MCP applications
 * Outputs OpenTelemetry-compliant single-line JSON logs
 */

// Unified Logger
export { UnifiedLogger } from './unified-logger';

// Context Merging
export { mergeLogContext } from './context-merging';

// Error Normalisation
export { normalizeError } from './error-normalisation';

// JSON Sanitisation
export { sanitiseForJson, isJsonValue, sanitiseObject } from './json-sanitisation';

// Express Middleware (optional, requires express peer dependency)
export {
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
  type RequestLoggerOptions,
} from './express-middleware';

// Legacy exports from pure-functions
export { isLevelEnabled } from './pure-functions';

export type { LoggerOptions } from './types';
export type { Logger } from './types';
export type { JsonObject } from './types';
export {
  DEFAULT_HTTP_SINK_CONFIG,
  parseSinkConfigFromEnv,
  type LoggerSinkConfig,
  type LoggerSinkEnvironment,
} from './sink-config';

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
} from './log-levels';

// Timing utilities
export { startTimer, type Duration, type Timer } from './timing';

// Error Context Enrichment
export { enrichError, type ErrorContext } from './error-context';

// Resource Attributes
export { buildResourceAttributes, getDeploymentEnvironment } from './resource-attributes';
export type { ResourceAttributes } from './resource-attributes';

// OpenTelemetry Format
export { logLevelToSeverityNumber, logLevelToSeverityText } from './otel-format';
export type { OtelLogRecord } from './otel-format';
