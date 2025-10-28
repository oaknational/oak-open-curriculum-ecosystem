/**
 * E2E test for MCP protocol functionality
 * Tests tool discovery and execution through the MCP protocol
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';

// Type for MCP content messages
type McpContent = { type: string; text?: string }[];

function expectSuccessfulResult(result: Awaited<ReturnType<Client['callTool']>>) {
  expect(result).toBeDefined();
  expect(result.isError).not.toBe(true);
  const contentList = result.content as McpContent | undefined;
  if (!contentList || contentList.length === 0) {
    throw new Error('Tool response did not include content');
  }
  const [content] = contentList;
  expect(content.type).toBe('text');
  if (typeof content.text !== 'string') {
    throw new Error('Tool response content was not textual');
  }
  const parsed = JSON.parse(content.text) as unknown;
  expect(parsed).toBeTruthy();
  return parsed;
}

function extractDataArray(payload: unknown): unknown[] {
  if (Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: unknown[] }).data;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  throw new Error('Tool response did not contain an array payload');
}

describe('MCP Protocol E2E', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    const apiKey = process.env.OAK_API_KEY;
    if (!apiKey) {
      throw new Error('OAK_API_KEY is not set');
    }

    // Create client transport pointing to built server
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
      env: {
        ...process.env,
        OAK_API_KEY: apiKey,
        LOG_LEVEL: 'error',
      },
    });

    // Create MCP client
    client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    // Connect client
    await client.connect(transport);
  });

  afterAll(async () => {
    // Clean up
    await client.close();
    await transport.close();
  });

  describe('Tool Discovery', () => {
    it('should list all available tools', async () => {
      const toolsResponse = await client.listTools();

      expect(toolsResponse.tools).toBeDefined();
      expect(toolsResponse.tools.length).toBeGreaterThan(0);

      // Verify some expected tools are present
      const toolNames = toolsResponse.tools.map((t) => t.name);
      expect(toolNames).toContain('get-subjects');
      expect(toolNames).toContain('get-key-stages');
      expect(toolNames).toContain('get-search-lessons');

      // Verify tool structure
      const firstTool = toolsResponse.tools[0];
      expect(firstTool).toHaveProperty('name');
      expect(firstTool).toHaveProperty('description');
      expect(firstTool).toHaveProperty('inputSchema');
    });
  });

  describe('Tool Execution', () => {
    it('should execute tool without parameters', async () => {
      const payload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-key-stages',
          arguments: { params: {} },
        }),
      );
      const dataArray = extractDataArray(payload);
      expect(Array.isArray(dataArray)).toBe(true);
      expect(dataArray.length).toBeGreaterThan(0);
    });

    it('should execute tool with parameters', async () => {
      const payload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-search-lessons',
          arguments: {
            params: {
              query: {
                q: 'fractions',
              },
            },
          },
        }),
      );
      expect(Array.isArray(extractDataArray(payload))).toBe(true);
    });

    it('should handle optional parameters correctly', async () => {
      // Call with only required parameters
      const basePayload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-sequences-units',
          arguments: {
            params: {
              path: {
                sequence: 'english-primary',
              },
            },
          },
        }),
      );
      expect(Array.isArray(extractDataArray(basePayload))).toBe(true);

      // Call with optional parameters
      const optionalPayload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-sequences-units',
          arguments: {
            params: {
              path: {
                sequence: 'english-primary',
              },
              query: {
                year: '1',
              },
            },
          },
        }),
      );
      expect(Array.isArray(extractDataArray(optionalPayload))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown tool error', async () => {
      await expect(
        client.callTool({ name: 'non-existent-tool', arguments: { params: {} } }),
      ).rejects.toThrow(/Tool non-existent-tool not found/);
    });

    it('should handle missing required parameters', async () => {
      await expect(
        client.callTool({ name: 'get-search-lessons', arguments: { params: {} } }),
      ).rejects.toThrow(/Invalid arguments.*get-search-lessons/);
    });

    it('should handle invalid parameter values', async () => {
      await expect(
        client.callTool({
          name: 'get-key-stages-subject-lessons',
          arguments: {
            params: {
              path: { keyStage: 'invalid-stage', subject: 'maths' },
            },
          },
        }),
      ).rejects.toThrow(/Invalid arguments.*get-key-stages-subject-lessons/);
    });
  });
});
