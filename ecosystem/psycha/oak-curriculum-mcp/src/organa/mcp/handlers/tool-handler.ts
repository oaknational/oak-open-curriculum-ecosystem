/**
 * MCP Tool Handler - Bridge to SDK
 *
 * Thin protocol adapter that delegates all tool execution to the SDK.
 * The SDK handles all validation, parameter checking, and API calls.
 */

import {
  executeToolCall,
  isToolName,
  createOakPathBasedClient,
} from '@oaknational/oak-curriculum-sdk';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

// Lazy client creation
let client: ReturnType<typeof createOakPathBasedClient> | null = null;

function getClient(): ReturnType<typeof createOakPathBasedClient> {
  if (!client) {
    const apiKey = process.env.OAK_API_KEY;
    if (!apiKey) {
      throw new McpError(ErrorCode.InvalidRequest, 'OAK_API_KEY environment variable is not set');
    }
    client = createOakPathBasedClient(apiKey);
  }
  return client;
}

// Export for testing only
export function _resetClient(): void {
  client = null;
}

function generateToolCallResponse(isError: boolean, text: string): CallToolResult {
  const base: CallToolResult = {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
  return isError ? { ...base, isError: true } : base;
}

/**
 * Handle MCP tool call requests by delegating to SDK
 */
export async function handleToolCall(request: CallToolRequest): Promise<CallToolResult> {
  const { name, arguments: args } = request.params;

  // Validate tool exists using SDK's type guard
  if (!isToolName(name)) {
    return generateToolCallResponse(true, `Unknown tool: ${name}`);
  }

  try {
    // Delegate ALL execution to SDK with client
    const result = await executeToolCall(name, args, getClient());

    // Handle SDK errors
    if (result.error) {
      return generateToolCallResponse(true, result.error.message);
    }

    // Return successful result formatted for MCP
    return generateToolCallResponse(false, JSON.stringify(result.data, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return generateToolCallResponse(true, message);
  }
}
