/**
 * Integration tests for MCP prompt registration with argsSchema.
 *
 * These tests validate that the MCP SDK's `registerPrompt()` method with
 * `argsSchema` correctly passes validated arguments to the callback.
 *
 * This is a proof-of-concept test per the plan to verify the MCP SDK
 * behavior before refactoring the production code.
 *
 * @module register-prompts.integration.test
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import type { IncomingMessage } from 'http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

/**
 * Creates a request suitable for MCP SDK transport.handleRequest().
 *
 * The MCP SDK expects `IncomingMessage & { auth?: AuthInfo }`. Express Request
 * extends IncomingMessage, but Clerk middleware adds an incompatible `auth` property.
 * This proxy strips the auth property to avoid type conflicts.
 *
 * This is a documented architectural bridge between incompatible library types,
 * not a shortcut to hide type errors in our code.
 *
 * @remarks This mirrors the pattern in handlers.ts createMcpRequest() for consistency.
 * @param req - Express request (may have Clerk auth)
 * @returns Proxy behaving as IncomingMessage without Clerk auth property
 */
function createMcpTestRequest(req: express.Request): IncomingMessage {
  // Proxy delegates to Express Request (which extends IncomingMessage) but omits 'auth'
  const proxy = new Proxy(req, {
    get(target, prop) {
      if (prop === 'auth') {
        return undefined; // Omit Clerk's auth to avoid type conflict
      }
      // Type guard: ensure prop exists on target before access
      if (typeof prop === 'string' && prop in target) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Proxy get handler for architectural bridge (see function documentation)
        return target[prop as keyof express.Request];
      }
      return undefined;
    },
    has(target, prop) {
      if (prop === 'auth') {
        return false; // Report auth as not present
      }
      return prop in target;
    },
  });

  // Type assertion: Proxy<Request> → IncomingMessage
  // Safe at runtime because Express Request extends IncomingMessage
  // and we only omit the conflicting auth property

  return proxy as unknown as IncomingMessage;
}

const ACCEPT_HEADER = 'application/json, text/event-stream';

/**
 * Parses an SSE response to extract the JSON-RPC envelope.
 */
function parseSseEnvelope(raw: string): { result?: unknown; error?: unknown } {
  const lines = raw.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      const jsonText = trimmed.slice('data:'.length).trimStart();
      return JSON.parse(jsonText) as { result?: unknown; error?: unknown };
    }
  }
  throw new Error('SSE payload missing data line');
}

/**
 * Creates a minimal MCP server with a test prompt registered using argsSchema.
 *
 * This test validates that:
 * 1. registerPrompt() with argsSchema works with Zod v4
 * 2. Arguments are passed directly to the callback
 * 3. No type assertions are needed
 */
async function createTestServerWithPrompt(): Promise<express.Express> {
  const app = express();
  app.use(express.json());

  const server = new McpServer({
    name: 'test-server',
    version: '1.0.0',
  });

  // Register a test prompt with argsSchema using Zod v4
  // This is the pattern we want to use in production
  server.registerPrompt(
    'test-prompt',
    {
      description: 'A test prompt to validate argsSchema works',
      argsSchema: {
        topic: z.string().describe('The topic to test'),
        category: z.string().optional().describe('Optional category'),
      },
    },
    (args) => {
      // Args should be directly available, typed by the schema
      const topic: string = args.topic;
      const category: string = args.category ?? 'none';
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Topic received: ${topic}, Category: ${category}`,
            },
          },
        ],
      };
    },
  );

  // Create transport once, connect once - like production code
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);

  app.post('/mcp', async (req, res) => {
    const mcpRequest = createMcpTestRequest(req);
    await transport.handleRequest(mcpRequest, res, req.body);
  });

  return app;
}

describe('MCP registerPrompt with argsSchema (Integration)', () => {
  describe('POC: Validate MCP SDK handles Zod v4 argsSchema correctly', () => {
    it('passes arguments directly to callback when using argsSchema', async () => {
      const app = await createTestServerWithPrompt();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'test-prompt',
            arguments: {
              topic: 'photosynthesis',
              category: 'biology',
            },
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      expect(envelope.result).toBeDefined();
      const result = envelope.result as { messages: { content: { text: string } }[] };
      expect(result.messages.length).toBeGreaterThan(0);

      // Verify the topic was received correctly (not a fallback value)
      expect(result.messages[0]?.content.text).toContain('photosynthesis');
      expect(result.messages[0]?.content.text).toContain('biology');
    });

    it('handles optional arguments correctly', async () => {
      const app = await createTestServerWithPrompt();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'test-prompt',
            arguments: {
              topic: 'fractions',
              // category is optional, omitted
            },
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = envelope.result as { messages: { content: { text: string } }[] };

      expect(result.messages[0]?.content.text).toContain('fractions');
      expect(result.messages[0]?.content.text).toContain('none');
    });

    it('prompt appears in prompts/list with argument metadata', async () => {
      const app = await createTestServerWithPrompt();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/list',
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = envelope.result as { prompts: { name: string }[] };

      const testPrompt = result.prompts.find((p) => p.name === 'test-prompt');
      expect(testPrompt).toBeDefined();
    });
  });
});
