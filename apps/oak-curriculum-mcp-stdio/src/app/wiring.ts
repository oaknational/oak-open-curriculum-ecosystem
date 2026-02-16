/**
 * App wiring - dependency injection and composition
 * Assembles all components into a working MCP server
 */

import { createMcpToolsModule } from '../tools/index.js';
import type { McpToolsModule } from '../tools/index.js';
import { createOakPathBasedClient } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { Client } from '@elastic/elasticsearch';
import { createSearchSdk } from '@oaknational/oak-search-sdk';

/**
 * Creates a simple clock provider for runtime timing needs.
 */
function createNodeClock() {
  return { now: () => Date.now() };
}

/**
 * Creates an in-memory key-value storage provider.
 * Suitable for session-scoped data that doesn't need persistence.
 */
function createInMemoryStorage() {
  const store = new Map<string, string>();
  return {
    get: (key: string) => Promise.resolve(store.get(key) ?? null),
    set: (key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    },
    delete: (key: string) => {
      store.delete(key);
      return Promise.resolve();
    },
  };
}
import { resolveToolExecutors } from './stub-executors.js';
import type { StdioEnv } from '../runtime-config.js';
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
 * Creates a SearchRetrievalService when Elasticsearch credentials are present.
 */
function createSearchRetrieval(
  env: StdioEnv,
  logger: { info: (msg: string) => void },
): SearchRetrievalService | undefined {
  const esUrl = env.ELASTICSEARCH_URL;
  const esApiKey = env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esApiKey) {
    logger.info(
      'Search retrieval service not configured — ELASTICSEARCH_URL or ELASTICSEARCH_API_KEY missing. Search tools will return "not configured" errors.',
    );
    return undefined;
  }

  const esClient = new Client({ node: esUrl, auth: { apiKey: esApiKey } });
  const searchSdk = createSearchSdk({
    deps: { esClient },
    config: { indexTarget: 'primary' },
  });
  logger.info('Search retrieval service configured (Elasticsearch connected)');
  return searchSdk.retrieval;
}

/**
 * Wire all dependencies together
 */
/** Adapts the STDIO logger into the CoreRuntime logger shape. */
function createCoreLogger(logger: Logger) {
  return {
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
}

export function wireDependencies(config?: ServerConfig): WiredDependencies {
  const serverConfig = buildServerConfig(config);
  const runtimeConfig = loadRuntimeConfig();
  const logger = createStdioLogger(runtimeConfig);
  const runtime = {
    logger: createCoreLogger(logger),
    clock: createNodeClock(),
    storage: createInMemoryStorage(),
  };

  // Create SDK client via injected config
  if (!serverConfig.apiKey) {
    throw new Error('OAK_API_KEY is required');
  }
  const client = createOakPathBasedClient(serverConfig.apiKey);

  const toolExecutors = resolveToolExecutors();
  const searchRetrieval = createSearchRetrieval(runtimeConfig.env, logger);

  // Create MCP tools module with injected client and optional search retrieval
  const mcpOrgan = createMcpToolsModule({ client, ...toolExecutors, searchRetrieval });

  return {
    logger,
    mcpOrgan,
    config: serverConfig,
    runtime,
    toolExecutors,
  };
}
