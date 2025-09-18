import type express from 'express';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
// getMcpTools no longer used now that tools are registered directly from MCP_TOOLS
import { readEnv } from './env.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  isToolName,
  MCP_TOOLS,
  zodRawShapeFromToolInputJsonSchema,
  typeSafeEntries,
  validateResponse,
  isValidationFailure,
  type HttpMethod,
} from '@oaknational/oak-curriculum-sdk';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
function toHttpMethod(methodUpper: string): HttpMethod {
  if (methodUpper === 'GET') return 'get';
  if (methodUpper === 'POST') return 'post';
  if (methodUpper === 'PUT') return 'put';
  if (methodUpper === 'DELETE') return 'delete';
  if (methodUpper === 'PATCH') return 'patch';
  throw new Error('Unsupported method: ' + methodUpper);
}

function validateOutput(
  path: string,
  methodUpper: string,
  data: unknown,
): { ok: true } | { ok: false; message: string } {
  const httpMethod = toHttpMethod(methodUpper);
  const validation = validateResponse(path, httpMethod, 200, data);
  if (validation.ok) {
    return { ok: true };
  }
  if (isValidationFailure(validation)) {
    const first = validation.issues[0];
    const message = first.message;
    return { ok: false, message };
  }
  return { ok: false, message: 'Output validation failed' };
}

export function findTool(name: string, tools: readonly Tool[]): Tool {
  for (const tool of tools) {
    if (tool.name === name) {
      return tool;
    }
  }
  throw new Error('Unknown tool: ' + name);
}

export function registerHandlers(server: McpServer): void {
  for (const [name, def] of typeSafeEntries(MCP_TOOLS)) {
    const input = zodRawShapeFromToolInputJsonSchema(def.inputSchema);
    const description = def.method.toUpperCase() + ' ' + def.path;
    server.registerTool(
      name,
      { title: name, description, inputSchema: input },
      async (params: unknown) => {
        const env = readEnv();
        const client = createOakPathBasedClient(env.OAK_API_KEY);
        if (!isToolName(name)) throw new Error('Unknown tool');
        const execResult = await executeToolCall(name, params, client);
        if (execResult.error) {
          const e = execResult.error;
          const message = e instanceof Error ? e.message : 'Unknown error';
          return { content: [{ type: 'text', text: 'Error: ' + message }], isError: true };
        }
        const out = validateOutput(def.path, def.method, execResult.data);
        if (!out.ok)
          return { content: [{ type: 'text', text: 'Error: ' + out.message }], isError: true };
        return { content: [{ type: 'text', text: JSON.stringify(execResult.data) }] };
      },
    );
  }
}

export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    await transport.handleRequest(req, res, req.body);
  };
}
