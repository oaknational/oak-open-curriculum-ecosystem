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

// Dependency interfaces - how the organism interfaces with its environment
export type { CoreDependencies, ServerDependencies } from './dependencies.js';

// Generic client interface
export type { GenericDataClient } from './generic-client.js';
export type { GenericOperations } from './dependencies.js';

// Environment types - the organism's environmental awareness
export type { ProcessEnv } from './environment.js';
