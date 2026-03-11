/**
 * E2E test for MCP protocol functionality
 * Tests tool discovery and execution through the MCP protocol
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { typeSafeGet } from '@oaknational/type-helpers';

// Type for MCP content messages
type McpContent = { type: string; text?: string }[];

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getOwn(value: Record<string, unknown>, key: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(value, key)) {
    return undefined;
  }
  return typeSafeGet(value, key);
}

function isTextContentEntry(value: unknown): value is { type: string; text?: string } {
  if (!isUnknownRecord(value)) {
    return false;
  }
  return getOwn(value, 'type') === 'text' && typeof getOwn(value, 'text') === 'string';
}

function isMcpContent(value: unknown): value is McpContent {
  return Array.isArray(value) && value.every((entry) => isTextContentEntry(entry));
}

function expectSuccessfulResult(result: Awaited<ReturnType<Client['callTool']>>) {
  expect(result).toBeDefined();
  expect(result.isError).not.toBe(true);
  if (!isMcpContent(result.content) || result.content.length === 0) {
    throw new Error('Tool response did not include content');
  }
  const [content] = result.content;
  expect(content.type).toBe('text');
  if (typeof content.text !== 'string') {
    throw new Error('Tool response content was not textual');
  }
  const parsed: unknown = JSON.parse(content.text);
  expect(parsed).toBeTruthy();
  return parsed;
}

function extractDataArray(payload: unknown): unknown[] {
  if (isUnknownRecord(payload)) {
    const data = getOwn(payload, 'data');
    if (Array.isArray(data)) {
      return data;
    }
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
    const apiKey = 'test-api-key';

    // Create client transport pointing to built server
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
      env: {
        ...process.env,
        OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
        OAK_API_KEY: apiKey,
        LOG_LEVEL: 'error',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
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
      expect(toolNames).toContain('get-lessons-quiz');

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
          arguments: {},
        }),
      );
      const dataArray = extractDataArray(payload);
      expect(Array.isArray(dataArray)).toBe(true);
      expect(dataArray.length).toBeGreaterThan(0);
    });

    it('should execute tool with parameters', async () => {
      const payload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-subject-detail',
          arguments: {
            subject: 'maths',
          },
        }),
      );
      expect(payload).toBeTruthy();
    });

    it('should handle optional parameters correctly', async () => {
      // Call with only required parameters
      const basePayload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-sequences-units',
          arguments: {
            sequence: 'english-primary',
          },
        }),
      );
      expect(Array.isArray(extractDataArray(basePayload))).toBe(true);

      // Call with optional parameters
      const optionalPayload = expectSuccessfulResult(
        await client.callTool({
          name: 'get-sequences-units',
          arguments: {
            sequence: 'english-primary',
            year: '1',
          },
        }),
      );
      expect(Array.isArray(extractDataArray(optionalPayload))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown tool error', async () => {
      // MCP SDK returns isError: true instead of rejecting
      const result = await client.callTool({ name: 'non-existent-tool', arguments: {} });
      expect(result.isError).toBe(true);
      if (!isMcpContent(result.content) || result.content.length === 0) {
        throw new TypeError('Test: Expected text content');
      }
      const content = result.content[0];
      expect(content.text).toMatch(/Tool non-existent-tool not found/);
    });

    it('should handle missing required parameters', async () => {
      // MCP SDK returns isError: true instead of rejecting
      const result = await client.callTool({ name: 'get-lessons-quiz', arguments: {} });
      expect(result.isError).toBe(true);
      if (!isMcpContent(result.content) || result.content.length === 0) {
        throw new TypeError('Test: Expected text content');
      }
      const content = result.content[0];
      expect(content.text).toMatch(/Invalid arguments.*get-lessons-quiz/);
    });

    it('should handle invalid parameter values', async () => {
      // MCP SDK returns isError: true instead of rejecting
      const result = await client.callTool({
        name: 'get-key-stages-subject-lessons',
        arguments: {
          keyStage: 'invalid-stage',
          subject: 'maths',
        },
      });
      expect(result.isError).toBe(true);
      if (!isMcpContent(result.content) || result.content.length === 0) {
        throw new TypeError('Test: Expected text content');
      }
      const content = result.content[0];
      expect(content.text).toMatch(/Invalid arguments.*get-key-stages-subject-lessons/);
    });
  });
});
