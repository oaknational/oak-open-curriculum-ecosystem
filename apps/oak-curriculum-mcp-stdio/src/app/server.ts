/**
 * MCP Server implementation for Oak Curriculum API.
 *
 * Receives validated `RuntimeConfig` from the entry point and
 * delegates to `wireDependencies` for composition. Does not
 * read `process.env` directly.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  toolNames,
  getToolFromToolName,
  type ToolDescriptorForName,
  executeToolCall,
  createOakPathBasedClient,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { wireDependencies } from './wiring.js';
import type { ServerConfig } from './wiring.js';
import { startTimer, type Logger, type ErrorContext } from '@oaknational/logger/node';
import { createToolResponseHandlers } from './tool-response-handlers.js';
import type { UniversalToolExecutors } from '../tools/index.js';
import { validateOutput } from './validation.js';
import { isInformationalError } from './informational-errors.js';
import { generateCorrelationId } from '../correlation/index.js';
import { createChildLogger } from '../logging/index.js';
import type { RuntimeConfig } from '../runtime-config.js';

/**
 * Threshold in milliseconds for slow operation warnings.
 * Tool executions exceeding this duration will be logged at WARN level.
 *
 * @internal
 */
const SLOW_OPERATION_THRESHOLD_MS = 5000;

/**
 * Setup shutdown handler
 */
function setupShutdownHandler(server: { close: () => Promise<void> }, logger: Logger): void {
  process.on('SIGINT', () => {
    logger.info('Shutting down server');
    void server.close().then(() => {
      process.exit(0);
    });
  });
}

/**
 * Creates and starts the Oak Curriculum MCP server.
 *
 * @param runtimeConfig - Validated runtime configuration from resolveEnv
 * @param config - Server-specific configuration (apiKey, serverName, etc.)
 */
export async function createServer(
  runtimeConfig: RuntimeConfig,
  config: ServerConfig,
): Promise<void> {
  const { logger, config: serverConfig, toolExecutors } = wireDependencies(runtimeConfig, config);

  logToolDiscovery(logger);

  const server = new McpServer({
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });
  const client = createOakPathBasedClient({ apiKey: serverConfig.apiKey, logger });
  registerMcpTools(server, client, logger, toolExecutors);

  const transport = new StdioServerTransport();
  logger.debug('Connecting STDIO transport...');
  await server.connect(transport);
  logger.debug('STDIO transport connected');

  logger.info('Oak Curriculum MCP server started', {
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });

  setupShutdownHandler(server, logger);
}

function logToolDiscovery(logger: Logger): void {
  try {
    const sortedToolNames = [...toolNames].toSorted((a, b) => a.localeCompare(b));
    logger.info('MCP tool module initialised', {
      tools: sortedToolNames.length,
      sample: sortedToolNames.slice(0, 3),
    });
  } catch (err: unknown) {
    logger.error('Failed to inspect tools', { error: err });
  }
}

function ensureDescriptorDescription(
  descriptor: { readonly description?: string },
  toolName: string,
): string {
  if (typeof descriptor.description !== 'string' || descriptor.description.trim().length === 0) {
    throw new Error(`Tool descriptor missing description for ${toolName}`);
  }
  return descriptor.description;
}

function createHandlersForTool(
  correlatedLogger: Logger,
  name: string,
  description: string,
  descriptor: ReturnType<typeof getToolFromToolName>,
  input: ReturnType<typeof getToolFromToolName>['toolMcpFlatInputSchema'],
): ReturnType<typeof createToolResponseHandlers> {
  return createToolResponseHandlers(correlatedLogger, {
    name,
    description,
    inputSchemaRaw: descriptor.inputSchema,
    inputSchemaZod: input,
    outputSchemaRaw: descriptor.toolOutputJsonSchema,
    outputSchemaZod: descriptor.zodOutputSchema,
  });
}

function handleToolResult(
  execResult: Awaited<ReturnType<typeof executeToolCall>>,
  params: unknown,
  descriptor: ReturnType<typeof getToolFromToolName>,
  handlers: ReturnType<typeof createToolResponseHandlers>,
  errorContext?: ErrorContext,
): ReturnType<ReturnType<typeof createToolResponseHandlers>['handleSuccess']> {
  if (!execResult.ok) {
    if (isInformationalError(execResult.error)) {
      return handlers.handleInformational(execResult.error.message, errorContext);
    }
    return handlers.handleExecutionError(params, execResult.error, errorContext);
  }
  const validation = validateOutput(descriptor, execResult.value);
  if (!validation.ok) {
    return handlers.handleValidationError(
      params,
      execResult.value,
      validation.message,
      errorContext,
    );
  }
  return handlers.handleSuccess(execResult.value);
}

// eslint-disable-next-line max-lines-per-function -- Error enrichment adds necessary context
function createToolHandler<TName extends (typeof toolNames)[number]>(
  name: TName,
  description: string,
  descriptor: ToolDescriptorForName<TName>,
  input: ToolDescriptorForName<TName>['toolMcpFlatInputSchema'],
  client: ReturnType<typeof createOakPathBasedClient>,
  logger: Logger,
  toolExecutors?: UniversalToolExecutors,
) {
  return async (params: unknown) => {
    const timer = startTimer();
    const correlationId = generateCorrelationId();
    const correlatedLogger = createChildLogger(logger, correlationId);

    correlatedLogger.debug('Tool execution started', { toolName: name, correlationId });

    const handlers = createHandlersForTool(correlatedLogger, name, description, descriptor, input);

    const execResult = toolExecutors?.executeMcpTool
      ? await toolExecutors.executeMcpTool(name, params ?? {})
      : await executeToolCall(name, params, client);

    const duration = timer.end();

    const errorContext: ErrorContext = {
      correlationId,
      duration,
      toolName: name,
    };

    const result = handleToolResult(execResult, params, descriptor, handlers, errorContext);
    const isSlowOperation = duration.ms > SLOW_OPERATION_THRESHOLD_MS;

    const status = !execResult.ok
      ? 'with error'
      : validateOutput(descriptor, execResult.value).ok
        ? 'success'
        : 'with validation error';

    const logMethod = isSlowOperation ? 'warn' : 'debug';
    const logData = {
      toolName: name,
      correlationId,
      duration: duration.formatted,
      durationMs: duration.ms,
      ...(isSlowOperation && { slowOperation: true }),
    };

    correlatedLogger[logMethod](`Tool execution completed ${status}`, logData);

    return result;
  };
}

function registerMcpTools(
  server: McpServer,
  client: ReturnType<typeof createOakPathBasedClient>,
  logger: Logger,
  toolExecutors?: UniversalToolExecutors,
): void {
  for (const name of toolNames) {
    const descriptor: ToolDescriptorForName<typeof name> = getToolFromToolName(name);
    const flatSchema = descriptor.toolMcpFlatInputSchema;
    const description = ensureDescriptorDescription(descriptor, name);

    const handler = createToolHandler(
      name,
      description,
      descriptor,
      flatSchema,
      client,
      logger,
      toolExecutors,
    );

    server.registerTool(name, { title: name, description, inputSchema: flatSchema.shape }, handler);
  }
}

export { logToolDiscovery, registerMcpTools };
