/**
 * Tool Handler with Authentication Error Interception
 *
 * Implements tool execution with auth error detection and MCP-compliant
 * _meta response generation per ADR-054.
 */

import type { Logger } from '@oaknational/logger';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type {
  UniversalToolName,
  createStubToolExecutionAdapter,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { generatedToolRegistry } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { RuntimeConfig } from './runtime-config.js';
import { isAuthError, getAuthErrorType, getAuthErrorDescription } from './auth-error-detector.js';
import { createAuthErrorResponse } from './auth-error-response.js';
import type { ToolHandlerDependencies } from './handlers.js';
import { logValidationFailureIfPresent, logUpstreamErrorIfPresent } from './validation-logger.js';
import { checkMcpClientAuth } from './check-mcp-client-auth.js';

/**
 * Options for {@link handleToolWithAuthInterception}.
 *
 * Consolidates the previous 8 positional parameters into a single
 * options object for readability and maintenance safety.
 */
export interface HandleToolOptions {
  readonly tool: { readonly name: UniversalToolName };
  readonly params: unknown;
  readonly deps: ToolHandlerDependencies;
  readonly stubExecutor?: ReturnType<typeof createStubToolExecutionAdapter>;
  readonly logger: Logger;
  readonly apiKey: string;
  readonly runtimeConfig: RuntimeConfig;
  readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;
}

/**
 * Handles tool execution with authentication error interception.
 *
 * Per ADR-054, this function intercepts auth errors at the tool execution result
 * level (the last layer where structured error objects are accessible) and
 * returns MCP-compliant responses with _meta field for ChatGPT OAuth linking.
 *
 * @param options - Tool execution options
 * @returns Tool execution result or auth error response with _meta
 *
 * @public
 */
export async function handleToolWithAuthInterception(
  options: HandleToolOptions,
): Promise<CallToolResult> {
  const {
    tool,
    params,
    deps,
    stubExecutor,
    logger,
    apiKey,
    runtimeConfig,
    createAssetDownloadUrl,
  } = options;
  const authError = checkMcpClientAuth(tool.name, deps.getResourceUrl(), logger, runtimeConfig);
  if (authError) {
    return authError;
  }

  const client = deps.createClient(apiKey);
  let capturedAuthError: unknown = undefined;

  const executor = deps.createExecutor({
    executeMcpTool: async (name, args) => {
      const execution = await (stubExecutor
        ? stubExecutor(name, args ?? {})
        : deps.executeMcpTool(name, args, client));
      // ADR-054 interception: capture structured auth errors before they're lost
      if (!execution.ok) {
        const target = execution.error.cause ?? execution.error;
        if (isAuthError(target)) {
          capturedAuthError = target;
        }
      }
      logValidationFailureIfPresent(name, execution, logger);
      logUpstreamErrorIfPresent(name, execution, logger);
      return execution;
    },
    searchRetrieval: deps.searchRetrieval,
    generatedTools: generatedToolRegistry,
    createAssetDownloadUrl,
  });

  const result = await executor(tool.name, params ?? {});

  if (capturedAuthError !== undefined) {
    const resourceUrl = deps.getResourceUrl();
    const errorType = getAuthErrorType(capturedAuthError);
    const description = getAuthErrorDescription(capturedAuthError);
    logger.warn('Tool execution auth error', { toolName: tool.name, errorType, description });
    return createAuthErrorResponse(errorType, description, resourceUrl);
  }

  return result;
}
