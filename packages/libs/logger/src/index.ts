/**
 * @oaknational/mcp-logger
 *
 * Adaptive logging library for multi-runtime MCP applications
 * Uses Consola with feature detection to adapt configuration
 */

export { createAdaptiveLogger } from './adaptive';
export { ConsolaLogger } from './consola-logger';
export {
  convertLogLevel,
  toConsolaLevel,
  mergeLogContext,
  normalizeError,
  isLevelEnabled,
} from './pure-functions';
export type { LoggerOptions } from './types';
export type { Logger } from './types';
export type { JsonObject } from './types';

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
