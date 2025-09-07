/**
 * @oaknational/mcp-logger
 *
 * Adaptive logging library for multi-runtime MCP applications
 * Uses Consola with feature detection to adapt configuration
 */

export { createAdaptiveLogger } from './adaptive.js';
export { ConsolaLogger } from './consola-logger.js';
export {
  convertLogLevel,
  toConsolaLevel,
  mergeLogContext,
  normalizeError,
  isLevelEnabled,
} from './pure-functions.js';
export type { LoggerOptions } from './types.js';
export type { Logger } from '@oaknational/mcp-core';

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
