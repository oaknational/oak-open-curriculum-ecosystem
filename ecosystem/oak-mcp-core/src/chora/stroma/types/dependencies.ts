/**
 * Central dependency interfaces for dependency injection
 */

import type { Logger } from '../../aither/logging/logger-interface.js';
import type { GenericDataClient } from './generic-client.js';

/**
 * Generic operations interface that phenotypes can implement
 */
export type GenericOperations = Record<string, unknown>;

/**
 * Core dependencies required by most components
 * Uses generic types to avoid coupling to specific implementations
 */
export interface CoreDependencies {
  dataClient: GenericDataClient;
  logger: Logger;
  operations: GenericOperations;
}

/**
 * Server configuration
 */
export interface ServerConfig {
  name: string;
  version: string;
}

/**
 * Dependencies for the MCP server
 */
export interface ServerDependencies extends CoreDependencies {
  config: ServerConfig;
}
