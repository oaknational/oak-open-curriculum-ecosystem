/**
 * MCP Server implementation for Oak Curriculum API
 * The living whole that integrates all organs
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  MCP_TOOLS,
  zodRawShapeFromToolInputJsonSchema,
  createOakPathBasedClient,
  executeToolCall,
  isToolName,
  isValidPath,
  typeSafeEntries,
  validateCurriculumResponse,
  isValidationFailure,
  isAllowedMethod,
  type ValidationIssue,
} from '@oaknational/oak-curriculum-sdk';
import { wireDependencies } from './wiring.js';
import type { ServerConfig, Logger } from './wiring.js';
import { createToolResponseHandlers } from './tool-response-handlers.js';

/**
 * Outcome of validating a tool response payload.
 */
export type OutputValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

/**
 * Represents the possible wrapper returned by MCP tool executions where
 * the transport response is nested under a `data` property alongside metadata.
 */
interface ValidationPayloadWrapper {
  readonly data?: unknown;
  readonly response?: unknown;
}

/**
 * Determines whether the supplied payload conforms to the wrapper structure
 * that nests the response payload beneath `data`.
 */
function hasValidationPayloadWrapper(candidate: unknown): candidate is ValidationPayloadWrapper {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }
  return 'data' in candidate && 'response' in candidate;
}

/**
 * Extracts the raw payload for downstream validation, accounting for wrapped responses.
 */
export function pickPayloadForValidation(data: unknown): unknown {
  if (hasValidationPayloadWrapper(data)) {
    return data.data;
  }
  return data;
}

/**
 * Formats the first validation failure into a concise error description for logging.
 */
function formatValidationFailure(details: { readonly issues: readonly ValidationIssue[] }): string {
  if (details.issues.length === 0) {
    return 'Output validation failed';
  }
  const [firstIssue] = details.issues;
  const detail = firstIssue.details;
  const expected = detail?.expected ?? 'unknown';
  const received = detail?.received ?? 'unknown';
  return `${firstIssue.message ?? 'Output validation failed'} (expected ${expected}, received ${received})`;
}

export function validateOutput(
  path: string,
  maybeHttpMethod: string,
  data: unknown,
): OutputValidationResult {
  if (!isValidPath(path)) {
    return { ok: false, message: 'Invalid path: ' + path };
  }
  const httpMethod = maybeHttpMethod.toLowerCase();
  if (!isAllowedMethod(httpMethod)) {
    return { ok: false, message: 'Unsupported method: ' + httpMethod };
  }
  const payload = pickPayloadForValidation(data);
  const validationResult = validateCurriculumResponse(path, httpMethod, 200, payload);
  if (isValidationFailure(validationResult)) {
    return {
      ok: false,
      message: formatValidationFailure(validationResult),
    };
  }
  return { ok: true };
}

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
 * Creates and starts the Oak Curriculum MCP server
 */
export async function createServer(config?: ServerConfig): Promise<void> {
  // Wire dependencies
  const { logger, config: serverConfig } = wireDependencies(config);

  logToolDiscovery(logger);

  // Create McpServer and register tools with Zod validation and SDK execution
  const server = new McpServer({
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });
  const client = createOakPathBasedClient(serverConfig.apiKey);
  registerMcpTools(server, client, logger);

  // Create transport and connect
  const transport = new StdioServerTransport();
  logger.debug('Connecting STDIO transport...');
  await server.connect(transport);
  logger.debug('STDIO transport connected');

  logger.info('Oak Curriculum MCP server started', {
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });

  // Setup shutdown handler
  setupShutdownHandler(server, logger);
}

/**
 * Start server if run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  // Parse log level from environment
  const logLevel = process.env.LOG_LEVEL;
  const validLogLevels = ['debug', 'info', 'warn', 'error'] as const;
  type ValidLogLevel = (typeof validLogLevels)[number];

  function isValidLogLevel(value: unknown): value is ValidLogLevel {
    if (typeof value !== 'string') {
      return false;
    }
    const stringValidLogLevels: readonly string[] = validLogLevels;
    return stringValidLogLevels.includes(value);
  }

  const parsedLogLevel = isValidLogLevel(logLevel) ? logLevel : 'info';

  createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: parsedLogLevel,
  }).catch((error: unknown) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

function logToolDiscovery(logger: Logger): void {
  try {
    const toolNames = Object.keys(MCP_TOOLS).sort();
    logger.info('MCP tool module initialised', {
      tools: toolNames.length,
      sample: toolNames.slice(0, 3),
    });
  } catch (err: unknown) {
    logger.error('Failed to inspect tools', { error: err });
  }
}

function registerMcpTools(
  server: McpServer,
  client: ReturnType<typeof createOakPathBasedClient>,
  logger: Logger,
): void {
  for (const [name, def] of typeSafeEntries(MCP_TOOLS)) {
    const input = zodRawShapeFromToolInputJsonSchema(def.inputSchema);
    const description = def.method.toUpperCase() + ' ' + def.path;
    const handlers = createToolResponseHandlers(logger, {
      name,
      description,
      inputSchemaRaw: def.inputSchema,
      inputSchemaZod: input,
      outputSchemaRaw: def.outputSchema,
      outputSchemaZod: def.outputSchema,
    });
    server.registerTool(
      name,
      { title: name, description, inputSchema: input },
      async (params: unknown) => {
        if (!isToolName(name)) {
          throw new Error('Unknown tool');
        }
        const execResult = await executeToolCall(name, params, client);
        if (execResult.error) {
          return handlers.handleExecutionError(params, execResult.error);
        }
        const out = validateOutput(def.path, def.method, execResult.data);
        if (!out.ok) {
          return handlers.handleValidationError(params, execResult.data, out.message);
        }
        return handlers.handleSuccess(execResult.data);
      },
    );
  }
}
