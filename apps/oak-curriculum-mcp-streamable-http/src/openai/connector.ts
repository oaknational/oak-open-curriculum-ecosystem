import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest, TextContent } from '@modelcontextprotocol/sdk/types.js';

// Internal modules
import {
  createOakPathBasedClient,
  executeToolCall,
  isToolName,
  executeOpenAiToolCall,
  isOpenAiToolName,
  OPENAI_CONNECTOR_TOOL_DEFS,
  getToolFromToolName,
  zodFromToolInputJsonSchema,
  typeSafeKeys,
  MCP_TOOLS,
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

export function registerOpenAiConnectorHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, () => {
    const mcpTools = typeSafeKeys(MCP_TOOLS).map((name) => {
      const tool = MCP_TOOLS[name];
      return {
        name: tool.name,
        method: tool.method,
        path: tool.path,
        operationId: tool.operationId,
        inputSchema: tool.inputSchema,
      } as const;
    });

    const tools = [
      OPENAI_CONNECTOR_TOOL_DEFS.search,
      OPENAI_CONNECTOR_TOOL_DEFS.fetch,
      ...mcpTools,
    ];
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;

    if (isOpenAiToolName(name)) {
      return handleOpenAiTool(args, name);
    }
    if (!isToolName(name)) {
      return formatOpenAiContent({ error: `Unknown or unsupported tool: ${name}` }, true);
    }
    return handleSdkTool(name, args);
  });

  async function handleOpenAiTool(args: unknown, name: 'search' | 'fetch') {
    try {
      const apiKey = process.env.OAK_API_KEY ?? '';
      const client = createOakPathBasedClient(apiKey);
      const payload = await executeOpenAiToolCall(name, args, client);
      return formatOpenAiContent(payload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return formatOpenAiContent({ error: message }, true);
    }
  }

  async function handleSdkTool(name: string, args: unknown) {
    try {
      // Validate against generated JSON Schema via Zod before execution
      if (!isToolName(name)) return formatOpenAiContent({ error: `Unknown tool: ${name}` }, true);
      const def = getToolFromToolName(name);
      const schema = zodFromToolInputJsonSchema(def.inputSchema);
      schema.parse(args ?? {});
      const apiKey = process.env.OAK_API_KEY ?? '';
      const client = createOakPathBasedClient(apiKey);
      const result = await executeToolCall(name, args, client);
      if (result.error) return formatOpenAiContent({ error: result.error.message }, true);
      return formatOpenAiContent(result.data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return formatOpenAiContent({ error: message }, true);
    }
  }
}
