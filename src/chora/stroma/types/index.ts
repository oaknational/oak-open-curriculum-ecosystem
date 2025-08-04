/**
 * @fileoverview Type physics - fundamental constants of our system
 * @module substrate/types
 *
 * These types are the unchanging laws that all components follow.
 * They include runtime constants and pure functions with zero dependencies.
 */

// Logging physics - fundamental constants and laws
export {
  LOG_LEVELS,
  type LogLevel,
  type LogLevelName,
  isLogLevel,
  isLogLevelName,
  getLogLevelValue,
  getLogLevelName,
} from './logging.js';

// Core physics - dependency injection patterns
export type { Dependencies, Context } from './core.js';
