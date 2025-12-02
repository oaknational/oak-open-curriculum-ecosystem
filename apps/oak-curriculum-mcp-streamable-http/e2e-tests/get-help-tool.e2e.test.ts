/**
 * E2E tests for the get-help tool.
 *
 * These tests prove that MCP clients can:
 * - Discover the help tool via tools/list
 * - Call the tool to get server-level guidance
 * - Call the tool with a tool_name to get specific help
 *
 * The tests exercise the full MCP protocol path, proving the help system
 * delivers value to users who need guidance.
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope, parseJsonRpcResult, getStructuredContentData } from './helpers/sse.js';
import { z } from 'zod';

const ToolsListResultSchema = z.object({
  tools: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      inputSchema: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
});

/**
 * Schema for tool call results per OpenAI Apps SDK reference.
 *
 * Per https://developers.openai.com/apps-sdk/reference#tool-results:
 * - `content`: Model AND widget see this (human-readable summary)
 * - `structuredContent`: Model AND widget see this (FULL data for reasoning)
 * - `_meta`: Widget ONLY sees this (additional widget metadata)
 */
const ToolCallResultSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
    }),
  ),
  structuredContent: z.record(z.string(), z.unknown()).optional(),
  _meta: z.record(z.string(), z.unknown()).optional(),
  isError: z.boolean().optional(),
});

describe('get-help Tool E2E', () => {
  describe('tools/list - Client can discover help', () => {
    it('includes get-help tool in tools list', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = ToolsListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const tools = parsed.data?.tools ?? [];
      const helpTool = tools.find((t) => t.name === 'get-help');

      expect(helpTool).toBeDefined();
    });

    it('get-help tool description explains its purpose', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ToolsListResultSchema.safeParse(envelope.result);

      const tools = parsed.data?.tools ?? [];
      const helpTool = tools.find((t) => t.name === 'get-help');

      // Proves: Description helps models understand when to use it
      expect(helpTool?.description).toContain('Use this when');
    });
  });

  describe('tools/call get-help - Client gets server guidance', () => {
    it('returns overview when called without parameters', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: {},
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      expect(result.isError).not.toBe(true);

      // Full data is in structuredContent per OpenAI Apps SDK
      const data = getStructuredContentData(result);

      // Proves: Response provides actionable guidance
      expect(data).toHaveProperty('serverOverview');
      expect(data).toHaveProperty('toolCategories');
    });

    it('returns workflows to guide common tasks', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: {},
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      // Full data is in structuredContent per OpenAI Apps SDK
      const data = getStructuredContentData(result);

      // Proves: Response includes step-by-step guidance
      expect(data).toHaveProperty('workflows');
    });

    it('returns tips to help users succeed', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: {},
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      // Full data is in structuredContent per OpenAI Apps SDK
      const data = getStructuredContentData(result);

      // Proves: Response includes practical tips
      expect(data).toHaveProperty('tips');
    });
  });

  describe('tools/call get-help with tool_name - Client gets specific help', () => {
    it('returns help for search tool', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: { tool_name: 'search' },
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      expect(result.isError).not.toBe(true);

      // Full data is in structuredContent per OpenAI Apps SDK
      const data = getStructuredContentData(result) as { tool: string };

      // Proves: Response is specific to the requested tool
      expect(data.tool).toBe('search');
    });

    it('returns category context for the tool', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: { tool_name: 'fetch' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      // Full data is in structuredContent per OpenAI Apps SDK
      const data = getStructuredContentData(result);

      // Proves: Response helps user understand tool's role
      expect(data).toHaveProperty('category');
    });

    it('returns related workflows for the tool', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: { tool_name: 'search' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      // Full data is in structuredContent per OpenAI Apps SDK
      const data = getStructuredContentData(result);

      // Proves: Response shows how tool fits into workflows
      expect(data).toHaveProperty('relatedWorkflows');
    });

    it('returns error for unknown tool', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-help',
            arguments: { tool_name: 'nonexistent-tool' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ToolCallResultSchema.safeParse(envelope.result);

      // Proves: Error handling is clear and helpful
      expect(parsed.data?.isError).toBe(true);
      expect(parsed.data?.content[0]?.text).toContain('Unknown tool');
    });
  });
});
