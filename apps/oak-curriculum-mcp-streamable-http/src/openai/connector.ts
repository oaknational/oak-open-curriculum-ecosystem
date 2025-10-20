import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type {
  CallToolRequest,
  CallToolResult,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';

import {
  createOakPathBasedClient,
  executeToolCall,
  createUniversalToolExecutor,
  isUniversalToolName,
  listUniversalTools,
  createStubToolExecutionAdapter,
} from '@oaknational/oak-curriculum-sdk';

export function formatOpenAiContent(
  value: unknown,
  isError = false,
): { content: readonly TextContent[]; isError?: true } {
  const text = JSON.stringify(value);
  return {
    content: [{ type: 'text', text }],
    ...(isError ? { isError: true as const } : {}),
  };
}

function extractFirstText(result: CallToolResult): string | undefined {
  const first = result.content.length > 0 ? result.content[0] : undefined;
  if (first?.type !== 'text') {
    return undefined;
  }
  return first.text;
}

function decodeCallToolResult(result: CallToolResult): unknown {
  const text = extractFirstText(result);
  if (text === undefined) {
    return result.content;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function decodeCallToolError(result: CallToolResult): unknown {
  const text = extractFirstText(result);
  if (text !== undefined) {
    return text;
  }
  return { content: result.content };
}

export function registerOpenAiConnectorHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, () => {
    return { tools: listUniversalTools() };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;

    if (!isUniversalToolName(name)) {
      return formatOpenAiContent({ error: `Unknown or unsupported tool: ${name}` }, true);
    }
    const apiKey = process.env.OAK_API_KEY ?? '';
    const client = createOakPathBasedClient(apiKey);
    const useStubTools = process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS === 'true';
    const stubExecutor = useStubTools ? createStubToolExecutionAdapter() : undefined;
    const executor = createUniversalToolExecutor({
      executeMcpTool: (toolName, toolArgs) =>
        stubExecutor
          ? stubExecutor(toolName, toolArgs ?? {})
          : executeToolCall(toolName, toolArgs, client),
    });

    try {
      const result = await executor(name, args ?? {});
      if (result.isError) {
        const errorPayload = decodeCallToolError(result);
        return formatOpenAiContent({ error: errorPayload }, true);
      }
      const payload = decodeCallToolResult(result);
      return formatOpenAiContent(payload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return formatOpenAiContent({ error: message }, true);
    }
  });
}
