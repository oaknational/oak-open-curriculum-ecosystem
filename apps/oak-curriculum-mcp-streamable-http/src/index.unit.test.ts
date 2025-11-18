import request from 'supertest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type express from 'express';

import {
  executeToolCall,
  isToolName,
  toolNames,
  getToolFromToolName,
  type ToolName,
  type ToolExecutionResult,
  McpToolError,
} from '@oaknational/oak-curriculum-sdk';
// Helpers to parse first SSE data frame from the Streamable HTTP transport
function parseFirstSseData(text: string): unknown {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      const jsonPart = trimmed.slice('data:'.length).trim();
      try {
        return JSON.parse(jsonPart);
      } catch {
        // ignore
      }
    }
  }
  return undefined;
}
function isTextContent(value: unknown): value is { type: string; text: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { text?: unknown }).text === 'string'
  );
}
import { createApp } from './application.js';

describe('Oak Curriculum MCP Streamable HTTP', () => {
  let app: express.Express;

  /** @todo refactor the underlying lying so we don't have to care about envs in unit tests */
  beforeEach(() => {
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    process.env.OAK_API_KEY = 'test-key';
    // Use real Clerk key format for middleware initialization
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    // Bypass auth for unit tests (testing tool execution, not auth) - safe for local dev only
    process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL; // Ensure bypass works (only works when NOT on Vercel)
    vi.restoreAllMocks();
    app = createApp();
  });

  it('returns 401 with Clerk auth when bypass not enabled', async () => {
    // Save current bypass setting
    const originalBypass = process.env.DANGEROUSLY_DISABLE_AUTH;
    // Disable bypass temporarily
    delete process.env.DANGEROUSLY_DISABLE_AUTH;
    const authApp = createApp();
    const res = await request(authApp)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    // Restore bypass setting for other tests
    if (originalBypass) {
      process.env.DANGEROUSLY_DISABLE_AUTH = originalBypass;
    }
    expect(res.status).toBe(401);
  });

  it('lists tools with auth bypassed', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    expect(typeof payload).toBe('object');
    const tools = (payload as { result?: { tools?: unknown[] } }).result?.tools;
    expect(Array.isArray(tools)).toBe(true);
    expect(tools?.length).toBeGreaterThan(0);
  });

  it('executes a tool via executeToolCall, formatting success', async () => {
    const preferred: ToolName = toolNames.includes('get-changelog')
      ? ('get-changelog' as ToolName)
      : toolNames[0];
    const descriptor = getToolFromToolName(preferred);
    expect(descriptor.name).toBe(preferred);
    vi.spyOn({ isToolName }, 'isToolName').mockReturnValue(true);
    vi.spyOn({ executeToolCall }, 'executeToolCall').mockResolvedValue({
      status: 200,
      data: { ok: true },
    });

    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: preferred, arguments: { params: {} } },
      });

    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    expect(typeof payload).toBe('object');
    const content = (payload as { result?: { content?: unknown[] } }).result?.content ?? [];
    expect(Array.isArray(content)).toBe(true);
    expect(content[0]).toHaveProperty('type', 'text');
  });

  it('returns formatted error when executeToolCall fails', async () => {
    const preferred: ToolName = toolNames.includes('get-changelog')
      ? ('get-changelog' as ToolName)
      : toolNames[0];
    vi.spyOn({ isToolName }, 'isToolName').mockReturnValue(true);
    const errorResult: ToolExecutionResult = {
      error: new McpToolError('boom', preferred),
    };
    vi.spyOn({ executeToolCall }, 'executeToolCall').mockResolvedValue(errorResult);

    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: preferred, arguments: { params: {} } },
      });

    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    expect(typeof payload).toBe('object');
    const result = (payload as { result?: { isError?: unknown; content?: unknown[] } }).result;
    const content = result?.content ?? [];
    if (result) {
      expect(Array.isArray(content)).toBe(true);
      const first = content[0];
      expect(isTextContent(first)).toBe(true);
      if (isTextContent(first)) {
        expect(first.text).toContain('Execution failed:');
      }
    } else {
      const error = (payload as { error?: { message?: string } }).error;
      expect(error?.message).toContain('boom');
    }
  });
});
