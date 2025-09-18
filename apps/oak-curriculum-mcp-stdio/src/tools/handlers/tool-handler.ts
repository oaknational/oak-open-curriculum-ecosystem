/**
 * MCP Tool Handler - Bridge to SDK
 *
 * Thin protocol adapter that delegates all tool execution to the SDK.
 * The SDK handles all validation, parameter checking, and API calls.
 */

import { executeToolCall, isToolName } from '@oaknational/oak-curriculum-sdk';
import type { OakApiPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export type SdkClient = OakApiPathBasedClient;

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
 * Factory: create a tool-call handler bound to an injected SDK client
 */
export function createHandleToolCall(client: SdkClient) {
  return async function handleToolCall(request: CallToolRequest): Promise<CallToolResult> {
    const { name, arguments: params } = request.params;

    // Validate tool exists using SDK's type guard
    if (!isToolName(name)) {
      return generateToolCallResponse(true, `Unknown tool: ${name}`);
    }

    try {
      // Delegate ALL execution to SDK with injected client
      const result = await executeToolCall(name, params, client);

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
  };
}
