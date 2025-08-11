/**
 * Phaneron - Configuration Layer
 *
 * Manages configuration for the Oak Curriculum MCP server.
 * Note: The SDK manages its own configuration per ADR-027.
 * This only handles MCP-specific configuration.
 */

import { z } from 'zod';
import type { Logger } from '@oaknational/mcp-moria';

/**
 * MCP Server Configuration Schema
 * Only includes MCP-specific settings, not SDK configuration
 */
const ConfigSchema = z.object({
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info')
    .describe('Logging level for the MCP server'),

  MCP_SERVER_NAME: z
    .string()
    .default('oak-curriculum-mcp')
    .describe('Name of the MCP server for protocol identification'),

  MCP_SERVER_VERSION: z.string().default('1.0.0').describe('Version of the MCP server'),
});

/**
 * Inferred type from the configuration schema
 */
export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(
  logger?: Logger,
  env: Record<string, string | undefined> = process.env,
): Config {
  // Parse environment variables
  const result = ConfigSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    const errorMessage = `Invalid MCP configuration: ${JSON.stringify(errors, null, 2)}`;

    if (logger) {
      logger.error('Configuration validation failed', { errors });
    }

    throw new Error(errorMessage);
  }

  if (logger) {
    logger.debug('Configuration loaded', {
      config: {
        LOG_LEVEL: result.data.LOG_LEVEL,
        MCP_SERVER_NAME: result.data.MCP_SERVER_NAME,
        MCP_SERVER_VERSION: result.data.MCP_SERVER_VERSION,
      },
    });
  }

  return result.data;
}

/**
 * Export the configuration schema for testing
 */
export { ConfigSchema };
