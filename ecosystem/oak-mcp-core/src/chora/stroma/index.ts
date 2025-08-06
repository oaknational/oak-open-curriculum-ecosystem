/**
 * @fileoverview Substrate - The physics of our system
 * @module substrate
 *
 * The substrate contains fundamental types, contracts, and schemas
 * that form the unchanging laws everything else follows.
 * Like physics in biology, it provides constraints enabling self-organization.
 */

// Re-export all types - the fundamental constants
export {
  LOG_LEVELS,
  type LogLevel,
  type LogLevelName,
  isLogLevel,
  isLogLevelName,
  getLogLevelValue,
  getLogLevelName,
  type Dependencies,
  type Context,
  type CoreDependencies,
  type ServerDependencies,
  type ProcessEnv,
  type GenericDataClient,
  type GenericOperations,
} from './types/index.js';

// Re-export all contracts - the cell membranes
export type { Logger, ConfigProvider, EventBus } from './contracts/index.js';

// Event schemas will be added here as we define organ communication
