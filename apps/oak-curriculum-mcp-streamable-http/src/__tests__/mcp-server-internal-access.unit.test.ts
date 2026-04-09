/**
 * Unit tests for B3 hybrid approach: McpServer internal server access.
 *
 * These tests verify that we can:
 * 1. Access McpServer's internal Server via .server property
 * 2. The setRequestHandler method exists (actual usage tested in E2E)
 *
 * This enables returning our pre-generated JSON Schema with examples directly,
 * bypassing the SDK's lossy Zod→JSON Schema conversion.
 *
 * @see application.ts for the actual implementation
 * @see .agent/plans/sdk-and-mcp-enhancements/b3-tools-list-override-test-plan.md
 */
import { describe, it, expect } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types';

describe('McpServer internal server access', () => {
  it('McpServer exposes .server property', () => {
    const mcpServer = new McpServer({ name: 'test', version: '1.0.0' });
    expect(mcpServer.server).toBeDefined();
    expect(typeof mcpServer.server).toBe('object');
  });

  it('.server has setRequestHandler method', () => {
    const mcpServer = new McpServer({ name: 'test', version: '1.0.0' });
    expect(typeof mcpServer.server.setRequestHandler).toBe('function');
  });

  it('ListToolsRequestSchema is importable', () => {
    expect(ListToolsRequestSchema).toBeDefined();
    expect(typeof ListToolsRequestSchema).toBe('object');
  });
});
