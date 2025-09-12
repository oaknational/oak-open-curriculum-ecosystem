/**
 * E2E test for MCP protocol functionality
 * Tests tool discovery and execution through the MCP protocol
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Type for MCP content messages
type McpContent = { type: string; text?: string }[];

describe('MCP Protocol E2E', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    // Create client transport pointing to built server
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
      env: {
        ...process.env,
        OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-key',
        LOG_LEVEL: 'error', // Keep logs quiet during tests
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
      const result = await client.callTool({
        name: 'get-key-stages',
        arguments: {},
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect((result.content as McpContent).length).toBeGreaterThan(0);

      // Result should be text content with JSON
      const content = (result.content as McpContent)[0];
      expect(content.type).toBe('text');

      // Should be able to parse as JSON
      const data = JSON.parse(content.text ?? '{}') as unknown;
      expect(data).toBeDefined();
    });

    it('should execute tool with parameters', async () => {
      const result = await client.callTool({
        name: 'get-search-lessons',
        arguments: {
          q: 'fractions',
        },
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect((result.content as McpContent).length).toBeGreaterThan(0);

      const content = (result.content as McpContent)[0];
      expect(content.type).toBe('text');

      // Should be able to parse as JSON
      const data = JSON.parse(content.text ?? '{}') as unknown;
      expect(data).toBeDefined();
    });

    it('should handle optional parameters correctly', async () => {
      // Call with only required parameters
      const result = await client.callTool({
        name: 'get-sequences-units',
        arguments: {
          sequence: 'english-primary-ks1',
        },
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();

      // Call with optional parameters
      const resultWithOptional = await client.callTool({
        name: 'get-sequences-units',
        arguments: {
          sequence: 'english-primary-ks1',
          year: '1',
        },
      });

      expect(resultWithOptional).toBeDefined();
      expect(resultWithOptional.content).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown tool error', async () => {
      const result = await client.callTool({
        name: 'non-existent-tool',
        arguments: {},
      });

      expect(result.isError).toBe(true);
      expect(result.content).toBeDefined();
      expect((result.content as McpContent)[0].type).toBe('text');
      expect((result.content as McpContent)[0].text).toContain('Unknown tool');
    });

    it('should handle missing required parameters', async () => {
      const result = await client.callTool({
        name: 'get-search-lessons',
        arguments: {}, // Missing required 'q' parameter
      });

      expect(result.isError).toBe(true);
      expect(result.content).toBeDefined();
      expect((result.content as McpContent)[0].type).toBe('text');
      // The error message should indicate the missing parameter
      const errorText = ((result.content as McpContent)[0].text ?? '').toLowerCase();
      expect(errorText).toContain('invalid request');
    });

    it('should handle invalid parameter values', async () => {
      const result = await client.callTool({
        name: 'get-key-stages-subject-lessons',
        arguments: {
          keyStage: 'invalid-stage', // Invalid enum value
          subject: 'maths',
        },
      });

      expect(result.isError).toBe(true);
      expect(result.content).toBeDefined();
      expect((result.content as McpContent)[0].type).toBe('text');
      // The error message should indicate invalid value
      const errorText = ((result.content as McpContent)[0].text ?? '').toLowerCase();
      expect(errorText).toContain('invalid');
    });
  });
});
