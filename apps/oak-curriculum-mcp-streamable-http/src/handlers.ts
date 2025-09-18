import type express from 'express';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { readEnv } from './env.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  generateCanonicalUrl,
  isToolName,
  MCP_TOOLS,
  zodRawShapeFromToolInputJsonSchema,
  typeSafeEntries,
  validateResponse,
  isValidationSuccess,
  isValidationFailure,
  type ContentType,
  type HttpMethod,
  type ValidationResult,
} from '@oaknational/oak-curriculum-sdk';

function toHttpMethod(methodUpper: string): HttpMethod {
  if (methodUpper === 'GET') {
    return 'get';
  }
  if (methodUpper === 'POST') {
    return 'post';
  }
  if (methodUpper === 'PUT') {
    return 'put';
  }
  if (methodUpper === 'DELETE') {
    return 'delete';
  }
  if (methodUpper === 'PATCH') {
    return 'patch';
  }
  throw new TypeError('Unsupported method: ' + methodUpper);
}

function validateOutput(
  path: string,
  methodUpper: string,
  data: unknown,
): ValidationResult<unknown> {
  const httpMethod = toHttpMethod(methodUpper);
  const validation = validateResponse(path, httpMethod, 200, data);
  if (isValidationSuccess(validation)) {
    return validation;
  }
  if (isValidationFailure(validation)) {
    return validation;
  }
  return {
    ok: false,
    issues: [{ path: [], message: 'Output validation failed', code: 'VALIDATION_ERROR' }],
    firstMessage: 'Output validation failed',
  };
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
        if (!isToolName(name)) {
          throw new Error('Unknown tool');
        }
        const execResult = await executeToolCall(name, params, client);
        if (execResult.error) {
          const e = execResult.error;
          const message = e instanceof Error ? e.message : 'Unknown error';
          return { content: [{ type: 'text', text: 'Error: ' + message }], isError: true };
        }
        const out = validateOutput(def.path, def.method, execResult.data);
        if (isValidationFailure(out)) {
          const firstMessage = out.firstMessage ?? 'Output validation failed';
          return { content: [{ type: 'text', text: 'Error: ' + firstMessage }], isError: true };
        }
        // Augment with canonicalUrl for lesson endpoints when possible
        const payload = maybeAugmentWithCanonicalUrl(execResult.data, params, def.path);
        return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
      },
    );
  }
}

function getOwnStringIfPresent(obj: unknown, key: PropertyKey): string | undefined {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return undefined;
  }
  const d = Object.getOwnPropertyDescriptor(obj, key);
  return typeof d?.value === 'string' ? d.value : undefined;
}

function maybeAugmentWithCanonicalUrl(data: unknown, params: unknown, path: string): unknown {
  try {
    if (!path.startsWith('/lessons/')) {
      return data;
    }
    const lessonSlug = getOwnStringIfPresent(params, 'lesson');
    if (!lessonSlug) {
      return data;
    }
    const ct: ContentType = 'lesson';
    const canonical = generateCanonicalUrl(ct, 'lesson:' + lessonSlug);
    return { data, canonicalUrl: canonical };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Error augmenting with canonicalUrl: ' + msg);
    return data;
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
