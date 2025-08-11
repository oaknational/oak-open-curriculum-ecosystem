/**
 * E2E tests for Oak Curriculum MCP server
 * Tests the full server integration with MCP protocol
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { wireDependencies } from '../src/psychon/wiring';
import type { CallToolRequest, ListToolsRequest } from '@modelcontextprotocol/sdk/types.js';

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
    const { mcpOrgan, logger, config } = wireDependencies({
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
    server.setRequestHandler('tools/list', async (_request: ListToolsRequest) => {
      return {
        tools: mcpOrgan.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    server.setRequestHandler('tools/call', async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;
      try {
        const result = await mcpOrgan.handleTool(name as any, args as any);
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
    if (client) await client.close();
    if (server) await server.close();
  });

  describe('tools/list', () => {
    it('should list all available tools', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.request(
        {
          method: 'tools/list',
          params: {},
        },
        ListToolsRequest,
      );

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

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'oak-search-lessons',
            arguments: {
              query: 'fractions',
              keyStage: 'ks2',
            },
          },
        },
        CallToolRequest,
      );

      expect(response.content).toBeDefined();
      expect(response.content[0].type).toBe('text');

      // Parse result
      const result = JSON.parse(response.content[0].text);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should list key stages', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'oak-list-key-stages',
            arguments: {},
          },
        },
        CallToolRequest,
      );

      expect(response.content).toBeDefined();
      expect(response.content[0].type).toBe('text');

      // Parse result
      const result = JSON.parse(response.content[0].text);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle unknown tool gracefully', async () => {
      // Skip if not running E2E tests
      if (process.env.RUN_E2E !== 'true') {
        console.log('Skipping E2E test - set RUN_E2E=true to run');
        return;
      }

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'unknown-tool',
            arguments: {},
          },
        },
        CallToolRequest,
      );

      expect(response.isError).toBe(true);
      expect(response.content[0].text).toContain('Unknown tool');
    });
  });
});
