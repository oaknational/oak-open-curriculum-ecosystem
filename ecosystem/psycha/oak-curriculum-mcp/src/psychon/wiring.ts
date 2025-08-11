/**
 * Psychon wiring - dependency injection and composition
 * Assembles all organs into a living whole
 */

import { createLogger } from '../chorai/aither';
import { createSdkClient } from '../chorai/stroma';
import { createCurriculumOrgan } from '../organa/curriculum';
import { createMcpOrgan } from '../organa/mcp';
import type { Logger } from '@oaknational/mcp-moria';
import type { CurriculumOrgan } from '../organa/curriculum';
import type { McpOrgan } from '../organa/mcp';

/**
 * Configuration for the Oak Curriculum MCP server
 */
export interface ServerConfig {
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Oak API key */
  apiKey?: string;
  /** Server name for MCP */
  serverName?: string;
  /** Server version */
  serverVersion?: string;
}

/**
 * Wired dependencies for the server
 */
export interface WiredDependencies {
  logger: Logger;
  curriculumOrgan: CurriculumOrgan;
  mcpOrgan: McpOrgan;
  config: Required<ServerConfig>;
}

/**
 * Wires all dependencies together
 */
export function wireDependencies(config?: ServerConfig): WiredDependencies {
  // Create logger with config
  const logger = createLogger({
    name: 'oak-curriculum-mcp',
    level: config?.logLevel ?? 'info',
  });

  // Create SDK client
  const sdk = createSdkClient({
    apiKey: config?.apiKey,
  });

  // Create curriculum organ
  const curriculumOrgan = createCurriculumOrgan({ sdk, logger });

  // Create MCP organ
  const mcpOrgan = createMcpOrgan(curriculumOrgan, logger);

  // Return wired dependencies
  return {
    logger,
    curriculumOrgan,
    mcpOrgan,
    config: {
      logLevel: config?.logLevel ?? 'info',
      apiKey: config?.apiKey ?? '',
      serverName: config?.serverName ?? 'oak-curriculum-mcp',
      serverVersion: config?.serverVersion ?? '0.0.1',
    },
  };
}
