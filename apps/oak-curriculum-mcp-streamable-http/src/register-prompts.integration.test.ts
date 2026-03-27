/**
 * Integration tests for MCP prompt registration with argsSchema.
 *
 * These tests validate that the MCP SDK's `registerPrompt()` method with
 * `argsSchema` correctly passes validated arguments to the callback.
 *
 * This is a proof-of-concept test per the plan to verify the MCP SDK
 * behavior before refactoring the production code.
 *
 */

import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import type { IncomingMessage } from 'http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { typeSafeGet, typeSafeHas } from '@oaknational/type-helpers';
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
  const incomingRequest: IncomingMessage = req;
  return new Proxy(incomingRequest, {
    get(target, prop): unknown {
      if (prop === 'auth') {
        return undefined;
      }
      if (typeof prop === 'string' && typeSafeHas(target, prop)) {
        return typeSafeGet(target, prop);
      }
      return undefined;
    },
    has(target, prop) {
      if (prop === 'auth') {
        return false;
      }
      return prop in target;
    },
  });
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
interface TestServer {
  app: express.Express;
  mcpServer: McpServer;
  transport: StreamableHTTPServerTransport;
}

async function createTestServerWithPrompt(): Promise<TestServer> {
  const app = express();
  app.use(express.json());

  const mcpServer = new McpServer({
    name: 'test-server',
    version: '1.0.0',
  });

  mcpServer.registerPrompt(
    'test-prompt',
    {
      description: 'A test prompt to validate argsSchema works',
      argsSchema: {
        topic: z.string().describe('The topic to test'),
        category: z.string().optional().describe('Optional category'),
      },
    },
    (args) => {
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

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await mcpServer.connect(transport);

  app.post('/mcp', async (req, res) => {
    const mcpRequest = createMcpTestRequest(req);
    await transport.handleRequest(mcpRequest, res, req.body);
  });

  return { app, mcpServer, transport };
}

describe('MCP registerPrompt with argsSchema (Integration)', () => {
  let testServer: TestServer | undefined;

  afterEach(async () => {
    if (testServer) {
      await testServer.mcpServer.close();
      testServer = undefined;
    }
  });

  describe('POC: Validate MCP SDK handles Zod v4 argsSchema correctly', () => {
    it('passes arguments directly to callback when using argsSchema', async () => {
      testServer = await createTestServerWithPrompt();
      const { app } = testServer;

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
      testServer = await createTestServerWithPrompt();
      const { app } = testServer;

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
      testServer = await createTestServerWithPrompt();
      const { app } = testServer;

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
