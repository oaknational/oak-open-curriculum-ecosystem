/**
 * App wiring - dependency injection and composition.
 *
 * Assembles all components into a working MCP server. The validated
 * `RuntimeConfig` is threaded through from the entry point — this
 * module does not read `process.env` directly.
 */

import { createMcpToolsModule } from '../tools/index.js';
import type { McpToolsModule, UniversalToolExecutors } from '../tools/index.js';
import {
  createOakPathBasedClient,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { createSearchRetrieval as createSearchRetrievalFromCredentials } from '@oaknational/oak-search-sdk';
import { resolveToolExecutors } from './stub-executors.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { type Logger } from '@oaknational/logger/node';
import { createStdioLogger } from '../logging/index.js';

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

/**
 * Configuration for the Oak Curriculum MCP server.
 *
 * All fields are derived from `RuntimeConfig` at the entry point.
 * The `apiKey` is guaranteed present by schema validation.
 */
export interface ServerConfig {
  /** Oak API key (required — validated by StdioEnvSchema) */
  apiKey: string;
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
  toolExecutors: UniversalToolExecutors;
}

/**
 * Build complete server configuration with defaults.
 */
function buildServerConfig(config: ServerConfig): Required<ServerConfig> {
  return {
    apiKey: config.apiKey,
    serverName: config.serverName ?? 'oak-curriculum-stdio',
    serverVersion: config.serverVersion ?? '0.0.1',
  };
}

/**
 * Creates a SearchRetrievalService from validated STDIO environment.
 *
 * Delegates to the shared factory in `@oaknational/oak-search-sdk`.
 * ES credentials are guaranteed present by `loadRuntimeConfig` validation.
 */
function createSearchRetrieval(
  runtimeConfig: RuntimeConfig,
  logger: { info: (msg: string) => void },
): SearchRetrievalService {
  const retrieval = createSearchRetrievalFromCredentials(runtimeConfig.env);
  logger.info('Search retrieval service configured (Elasticsearch connected)');
  return retrieval;
}

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

/**
 * Wire all dependencies together.
 *
 * @param runtimeConfig - Validated runtime configuration from resolveEnv
 * @param config - Server-specific configuration (apiKey, serverName, etc.)
 */
export function wireDependencies(
  runtimeConfig: RuntimeConfig,
  config: ServerConfig,
): WiredDependencies {
  const serverConfig = buildServerConfig(config);
  const logger = createStdioLogger(runtimeConfig);
  const runtime = {
    logger: createCoreLogger(logger),
    clock: createNodeClock(),
    storage: createInMemoryStorage(),
  };

  const client = createOakPathBasedClient({ apiKey: serverConfig.apiKey, logger });

  const executorOverrides = resolveToolExecutors(runtimeConfig.useStubTools);
  const searchRetrieval = runtimeConfig.useStubTools
    ? createStubSearchRetrieval()
    : createSearchRetrieval(runtimeConfig, logger);
  const toolExecutors: UniversalToolExecutors = { ...executorOverrides, searchRetrieval };

  const mcpOrgan = createMcpToolsModule({ client, ...toolExecutors });

  return {
    logger,
    mcpOrgan,
    config: serverConfig,
    runtime,
    toolExecutors,
  };
}
