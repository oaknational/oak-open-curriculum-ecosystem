/**
 * App wiring - dependency injection and composition
 * Assembles all components into a working MCP server
 */

import { createMcpToolsModule } from '../tools/index.js';
import type { McpToolsModule } from '../tools/index.js';
import { createInMemoryStorage, createNodeClock } from '@oaknational/mcp-providers-node';
import { createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import { resolveToolExecutors } from './stub-executors.js';
import { type Logger } from '@oaknational/mcp-logger/node';
import { createStdioLogger } from '../logging/index.js';
import { loadRuntimeConfig } from '../runtime-config.js';

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
  mcpOrgan: McpToolsModule;
  config: Required<ServerConfig>;
  runtime: {
    storage: ReturnType<typeof createInMemoryStorage>;
    clock: ReturnType<typeof createNodeClock>;
  };
  toolExecutors: ReturnType<typeof resolveToolExecutors>;
}

/**
 * Default server configuration values
 */
const DEFAULT_CONFIG: Required<ServerConfig> = {
  logLevel: 'info',
  apiKey: process.env.OAK_API_KEY ?? '',
  serverName: 'oak-curriculum-stdio',
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
 * Wire all dependencies together
 */
export function wireDependencies(config?: ServerConfig): WiredDependencies {
  const serverConfig = buildServerConfig(config);
  const runtimeConfig = loadRuntimeConfig();
  const logger = createStdioLogger(runtimeConfig);
  // Compose CoreRuntime
  const coreLogger = {
    trace: (message: string, context?: unknown) => {
      logger.debug(message, context);
    },
    debug: (message: string, context?: unknown) => {
      logger.debug(message, context);
    },
    info: (message: string, context?: unknown) => {
      logger.info(message, context);
    },
    warn: (message: string, context?: unknown) => {
      logger.warn(message, context);
    },
    error: (message: string, context?: unknown) => {
      logger.error(message, context);
    },
    fatal: (message: string, context?: unknown) => {
      logger.error(message, context);
    },
  };
  const runtime = {
    logger: coreLogger,
    clock: createNodeClock(),
    storage: createInMemoryStorage(),
  };

  // Create SDK client via injected config
  if (!serverConfig.apiKey) {
    throw new Error('OAK_API_KEY is required');
  }
  const client = createOakPathBasedClient(serverConfig.apiKey);

  const toolExecutors = resolveToolExecutors();

  // Create MCP tools module with injected client
  const mcpOrgan = createMcpToolsModule({ client, ...toolExecutors });

  return {
    logger,
    mcpOrgan,
    config: serverConfig,
    runtime,
    toolExecutors,
  };
}
