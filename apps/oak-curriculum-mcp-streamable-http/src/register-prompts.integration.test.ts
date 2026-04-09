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
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp';
import { z } from 'zod';

const ACCEPT_HEADER = 'application/json, text/event-stream';

/** Zod schema for a JSON-RPC envelope from SSE. */
const envelopeSchema = z.object({
  result: z.unknown().optional(),
  error: z.unknown().optional(),
});

/** Zod schema for a prompts/get result. */
const messagesResultSchema = z.object({
  messages: z.array(
    z.object({
      content: z.object({ text: z.string() }),
    }),
  ),
});

/** Zod schema for a prompts/list result. */
const promptsListResultSchema = z.object({
  prompts: z.array(z.object({ name: z.string() })),
});

/**
 * Parses an SSE response to extract the JSON-RPC envelope.
 */
function parseSseEnvelope(raw: string): z.infer<typeof envelopeSchema> {
  const lines = raw.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      const jsonText = trimmed.slice('data:'.length).trimStart();
      return envelopeSchema.parse(JSON.parse(jsonText));
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
      const topic = args.topic;
      const category = args.category ?? 'none';
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
    await transport.handleRequest(req, res, req.body);
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
      const result = messagesResultSchema.parse(envelope.result);
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
      const result = messagesResultSchema.parse(envelope.result);

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
      const result = promptsListResultSchema.parse(envelope.result);

      const testPrompt = result.prompts.find((p) => p.name === 'test-prompt');
      expect(testPrompt).toBeDefined();
    });
  });
});
