/**
 * @fileoverview Generic environment configuration for MCP servers
 * @module @oaknational/mcp-core
 *
 * This provides base environment configuration that all MCP servers inherit.
 * Phenotypes can extend this with their specific environment needs.
 */

import { getBoolean, getEnum, getLogLevel } from './env-parser.js';

/**
 * Environment configuration - validated once on module load
 */
export const env = {
  LOG_LEVEL: getLogLevel('LOG_LEVEL', 'INFO'),
  NODE_ENV: getEnum('NODE_ENV', ['development', 'production', 'test'] as const, 'production'),
  ENABLE_DEBUG_LOGGING: getBoolean('ENABLE_DEBUG_LOGGING', false),
} as const;

/**
 * Inferred environment type
 */
export type Environment = typeof env;
