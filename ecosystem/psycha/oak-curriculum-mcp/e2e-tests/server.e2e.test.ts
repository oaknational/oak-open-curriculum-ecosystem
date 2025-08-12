/**
 * E2E tests for Oak Curriculum MCP server
 * Tests the full server integration with MCP protocol
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { wireDependencies } from '../src/psychon/wiring';

// Type guard for object with property
function hasProperty<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

// Type guard for checking if response has content array
function hasContentArray(obj: unknown): obj is { content: unknown[] } {
  return hasProperty(obj, 'content') && Array.isArray(obj.content);
}

// Type guard for text content item
function isTextContent(item: unknown): item is { type: string; text: string } {
  return (
    hasProperty(item, 'type') &&
    typeof item.type === 'string' &&
    hasProperty(item, 'text') &&
    typeof item.text === 'string'
  );
}

describe('Oak Curriculum MCP Server E2E', () => {
  let client: Client;
  let server: Server;
  let clientTransport: InMemoryTransport;
  let serverTransport: InMemoryTransport;

  beforeAll(async () => {
    // Skip if not running E2E tests
    if (process.env.RUN_E2E !== 'true') {
      return;
    }

    // Wire dependencies with test config
    const { mcpOrgan, config } = wireDependencies({
      apiKey: process.env.OAK_API_KEY,
      logLevel: 'error', // Quiet during tests
    });

    // Create server
    server = new Server(
      {
        name: config.serverName,
        version: config.serverVersion,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Register handlers
    server.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: mcpOrgan.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    // eslint-disable-next-line complexity
    server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;
      try {
        // Validate the tool exists
        const tool = mcpOrgan.tools.find((t) => t.name === name);
        if (!tool) {
          throw new Error(`Unknown tool: ${name}`);
        }

        // Use a switch statement to handle each tool by its literal name
        // The args need to be validated for each tool type
        let result: unknown;
        switch (tool.name) {
          case 'oak-search-lessons': {
            const searchArgs = args ?? {};
            if (!('query' in searchArgs) || typeof searchArgs.query !== 'string') {
              throw new Error('Missing or invalid required parameter: query');
            }
            result = await mcpOrgan.handleTool('oak-search-lessons', {
              query: searchArgs.query,
              keyStage:
                'keyStage' in searchArgs && typeof searchArgs.keyStage === 'string'
                  ? searchArgs.keyStage
                  : undefined,
              subject:
                'subject' in searchArgs && typeof searchArgs.subject === 'string'
                  ? searchArgs.subject
                  : undefined,
            });
            break;
          }
          case 'oak-get-lesson': {
            const lessonArgs = args ?? {};
            if (!('lessonSlug' in lessonArgs) || typeof lessonArgs.lessonSlug !== 'string') {
              throw new Error('Missing or invalid required parameter: lessonSlug');
            }
            result = await mcpOrgan.handleTool('oak-get-lesson', {
              lessonSlug: lessonArgs.lessonSlug,
            });
            break;
          }
          case 'oak-list-key-stages':
            result = await mcpOrgan.handleTool('oak-list-key-stages', {});
            break;
          case 'oak-list-subjects':
            result = await mcpOrgan.handleTool('oak-list-subjects', {});
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Create in-memory transport
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    // Create client
    client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    // Connect
    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  afterAll(async () => {
    // These checks are necessary as the setup may be skipped if RUN_E2E !== 'true'
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (client) await client.close();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (server) await server.close();
  });

  describe('tools/list', () => {
    it('should list all available tools', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.listTools();

      expect(response.tools).toHaveLength(4);

      const toolNames = response.tools.map((t) => t.name);
      expect(toolNames).toContain('oak-search-lessons');
      expect(toolNames).toContain('oak-get-lesson');
      expect(toolNames).toContain('oak-list-key-stages');
      expect(toolNames).toContain('oak-list-subjects');
    });
  });

  describe('tools/call', () => {
    it('should search for lessons', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.callTool({
        name: 'oak-search-lessons',
        arguments: {
          query: 'fractions',
          keyStage: 'ks2',
        },
      });

      // Validate response has content array
      if (!hasContentArray(response)) {
        throw new Error('Response has no content array');
      }
      expect(response.content).toBeDefined();

      // Validate first content item is text
      const firstContent = response.content[0];
      if (!isTextContent(firstContent)) {
        throw new Error('Invalid text content');
      }

      expect(firstContent.type).toBe('text');

      // Parse result
      const result: unknown = JSON.parse(firstContent.text);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should list key stages', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.callTool({
        name: 'oak-list-key-stages',
        arguments: {},
      });

      // Validate response has content array
      if (!hasContentArray(response)) {
        throw new Error('Response has no content array');
      }
      expect(response.content).toBeDefined();

      // Validate first content item is text
      const firstContent = response.content[0];
      if (!isTextContent(firstContent)) {
        throw new Error('Invalid text content');
      }

      expect(firstContent.type).toBe('text');

      // Parse result
      const result: unknown = JSON.parse(firstContent.text);
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should handle unknown tool gracefully', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.callTool({
        name: 'unknown-tool',
        arguments: {},
      });

      expect(response.isError).toBe(true);

      // Validate error content
      if (!hasContentArray(response)) {
        throw new Error('Response has no content array');
      }
      const errorContent = response.content[0];
      if (!isTextContent(errorContent)) {
        throw new Error('Invalid error text content');
      }

      expect(errorContent.text).toContain('Unknown tool');
    });
  });
});
