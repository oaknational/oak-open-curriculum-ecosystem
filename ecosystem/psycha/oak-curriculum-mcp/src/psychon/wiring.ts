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
import type { LogLevel } from '@oaknational/mcp-histos-logger';

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
 * Map server config log level to LogLevel
 */
function mapLogLevel(level?: 'debug' | 'info' | 'warn' | 'error'): LogLevel {
  switch (level) {
    case 'debug':
      return 'DEBUG';
    case 'info':
      return 'INFO';
    case 'warn':
      return 'WARN';
    case 'error':
      return 'ERROR';
    default:
      return 'INFO';
  }
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
 * Default server configuration values
 */
const DEFAULT_CONFIG: Required<ServerConfig> = {
  logLevel: 'info',
  apiKey: '',
  serverName: 'oak-curriculum-mcp',
  serverVersion: '0.0.1',
};

/**
 * Build complete server configuration with defaults
 */
function buildServerConfig(config?: ServerConfig): Required<ServerConfig> {
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    logLevel: config.logLevel ?? DEFAULT_CONFIG.logLevel,
    apiKey: config.apiKey ?? DEFAULT_CONFIG.apiKey,
    serverName: config.serverName ?? DEFAULT_CONFIG.serverName,
    serverVersion: config.serverVersion ?? DEFAULT_CONFIG.serverVersion,
  };
}

/**
 * Wires all dependencies together
 */
export function wireDependencies(config?: ServerConfig): WiredDependencies {
  // Build complete config with defaults
  const serverConfig = buildServerConfig(config);

  // Create logger with config
  const logger = createLogger({
    name: 'oak-curriculum-mcp',
    level: mapLogLevel(serverConfig.logLevel),
    enableFileLogging: true,
  });

  // Create SDK client
  const sdk = createSdkClient({
    apiKey: serverConfig.apiKey,
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
    config: serverConfig,
  };
}
