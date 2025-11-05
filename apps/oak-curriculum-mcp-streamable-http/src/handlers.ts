import type express from 'express';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from '@oaknational/mcp-logger';

import type { RuntimeConfig } from './runtime-config.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  zodRawShapeFromToolInputJsonSchema,
  listUniversalTools,
  createUniversalToolExecutor,
  createStubToolExecutionAdapter,
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/oak-curriculum-sdk';

export interface ToolHandlerDependencies {
  readonly createClient: typeof createOakPathBasedClient;
  readonly executeMcpTool: typeof executeToolCall;
  readonly createExecutor: typeof createUniversalToolExecutor;
}

const defaultDependencies: ToolHandlerDependencies = {
  createClient: createOakPathBasedClient,
  executeMcpTool: executeToolCall,
  createExecutor: createUniversalToolExecutor,
};

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;

export interface RegisterHandlersOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly runtimeConfig: RuntimeConfig;
  readonly logger: Logger;
}

export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
  const deps: ToolHandlerDependencies = {
    ...defaultDependencies,
    ...(options.overrides ?? {}),
  };
  const useStubTools = options.runtimeConfig.useStubTools;
  const stubExecutor = useStubTools ? createStubToolExecutionAdapter() : undefined;
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    server.registerTool(
      tool.name,
      { title: tool.name, description: tool.description ?? tool.name, inputSchema: input },
      async (params: unknown) => {
        const client = deps.createClient(options.runtimeConfig.env.OAK_API_KEY);
        const executor = deps.createExecutor({
          executeMcpTool: async (name, args) => {
            const execution = await (stubExecutor
              ? stubExecutor(name, args ?? {})
              : deps.executeMcpTool(name, args, client));
            logValidationFailureIfPresent(name, execution, options.logger);
            return execution;
          },
        });
        return executor(tool.name, params ?? {});
      },
    );
  }
}

function logValidationFailureIfPresent(
  name: string,
  execution: ToolExecutionResult,
  logger: Logger,
): void {
  const cause = extractValidationCause(execution);
  if (!cause) {
    return;
  }
  const { error, details } = cause;
  const rawForLog = truncateForLog(details.raw);
  const issuesForLog = truncateForLog(details.issues);
  logger.warn('MCP tool validation failed', {
    toolName: name,
    message: error.message,
    issues: issuesForLog ?? null,
    rawPayload: rawForLog ?? null,
  });
}

interface ValidationDetails {
  readonly raw?: unknown;
  readonly issues?: unknown;
}

function isValidationDetails(value: unknown): value is ValidationDetails {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'raw' in value || 'issues' in value;
}

function extractValidationCause(
  execution: ToolExecutionResult,
): { readonly error: McpToolError; readonly details: ValidationDetails } | undefined {
  if (!('error' in execution) || !execution.error) {
    return undefined;
  }
  const { error } = execution;
  if (!(error instanceof McpToolError) || error.code !== 'OUTPUT_VALIDATION_ERROR') {
    return undefined;
  }
  if (!(error.cause instanceof TypeError)) {
    return undefined;
  }
  const details = isValidationDetails(error.cause.cause) ? error.cause.cause : undefined;
  if (!details) {
    return undefined;
  }
  return { error, details };
}

function truncateForLog(value: unknown, maxLength = 2000): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  let serialised: string | undefined;
  if (typeof value === 'string') {
    serialised = value;
  } else {
    try {
      serialised = JSON.stringify(value);
    } catch {
      serialised = undefined;
    }
  }
  if (!serialised) {
    return '[unserialisable]';
  }
  if (serialised.length <= maxLength) {
    return serialised;
  }
  return `${serialised.slice(0, maxLength)}...`;
}

export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    await transport.handleRequest(req, res, req.body);
  };
}
