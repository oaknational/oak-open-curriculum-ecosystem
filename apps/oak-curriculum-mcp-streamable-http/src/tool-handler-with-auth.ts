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
import { logValidationFailureIfPresent } from './validation-logger.js';
import { checkMcpClientAuth } from './check-mcp-client-auth.js';

/**
 * Handles tool execution with authentication error interception.
 *
 * Per ADR-054, this function intercepts auth errors at the ToolExecutionResult
 * level (the last layer where structured error objects are accessible) and
 * returns MCP-compliant responses with _meta field for ChatGPT OAuth linking.
 *
 * @param tool - Tool descriptor with UniversalToolName
 * @param params - Tool invocation parameters
 * @param deps - Tool handler dependencies (client, executor, etc.)
 * @param stubExecutor - Optional stub executor for testing
 * @param logger - Logger for observability
 * @param apiKey - API key for upstream client
 * @param runtimeConfig - Runtime configuration including auth bypass flag
 * @returns Tool execution result or auth error response with _meta
 *
 * @public
 */
export async function handleToolWithAuthInterception(
  tool: { readonly name: UniversalToolName },
  params: unknown,
  deps: ToolHandlerDependencies,
  stubExecutor: ReturnType<typeof createStubToolExecutionAdapter> | undefined,
  logger: Logger,
  apiKey: string,
  runtimeConfig: RuntimeConfig,
): Promise<CallToolResult> {
  // Preventive MCP client auth checking (BEFORE SDK execution)
  // This is MCP OAuth (ChatGPT → us), NOT upstream API auth (us → Oak API)
  const authError = checkMcpClientAuth(tool.name, deps.getResourceUrl(), logger, runtimeConfig);
  if (authError) {
    return authError;
  }

  // EXISTING: Upstream API auth error interception (AFTER SDK execution)
  // This is ADR-054 - we do NOT modify this
  const client = deps.createClient(apiKey);

  // Closure variable to capture auth errors from ToolExecutionResult callback
  let capturedAuthError: unknown = undefined;

  const executor = deps.createExecutor({
    executeMcpTool: async (name, args) => {
      const execution = await (stubExecutor
        ? stubExecutor(name, args ?? {})
        : deps.executeMcpTool(name, args, client));

      // CRITICAL INTERCEPTION POINT (per ADR-054):
      // Here we have ToolExecutionResult with structured error objects.
      // This is the last layer where error cause chains are accessible.
      if ('error' in execution && execution.error) {
        const authCheckTarget = execution.error.cause ?? execution.error;

        if (isAuthError(authCheckTarget)) {
          // Capture auth error for post-executor handling
          capturedAuthError = authCheckTarget;
        }
      }

      logValidationFailureIfPresent(name, execution, logger);
      return execution;
    },
    searchRetrieval: deps.searchRetrieval,
    generatedTools: generatedToolRegistry,
  });

  const result = await executor(tool.name, params ?? {});

  // After executor returns, check if we captured an auth error
  if (capturedAuthError !== undefined) {
    const resourceUrl = deps.getResourceUrl();
    const errorType = getAuthErrorType(capturedAuthError);
    const description = getAuthErrorDescription(capturedAuthError);

    logger.warn('Tool execution auth error', {
      toolName: tool.name,
      errorType,
      description,
    });

    return createAuthErrorResponse(errorType, description, resourceUrl);
  }

  // No auth error, return normal result
  return result;
}
