import request from 'supertest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type express from 'express';

import { executeToolCall, isToolName } from '@oaknational/oak-curriculum-sdk';
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
import { createApp } from './index.js';

describe('Oak Curriculum MCP Streamable HTTP', () => {
  const DEV_TOKEN = 'dev-token';
  let app: express.Express;

  beforeEach(() => {
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = 'test-key';
    vi.restoreAllMocks();
    app = createApp();
  });

  it('returns 401 without Authorization header', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('lists tools with dev token', async () => {
    const spyGetMcpTools = vi.spyOn(await import('./mcp-tools.js'), 'getMcpTools').mockReturnValue([
      {
        name: 'oak-get-key-stages',
        description: 'GET /key-stages',
        inputSchema: { type: 'object' },
      },
    ]);

    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

    console.log('lists tools raw text:', res.text);
    expect(res.status).toBe(200);
    expect(spyGetMcpTools).toHaveBeenCalledTimes(1);
    const payload = parseFirstSseData(res.text);
    expect(typeof payload).toBe('object');
    const tools = (payload as { result?: { tools?: unknown[] } }).result?.tools;
    expect(Array.isArray(tools)).toBe(true);
  });

  it('executes a tool via executeToolCall, formatting success', async () => {
    vi.spyOn({ isToolName }, 'isToolName').mockReturnValue(true);
    vi.spyOn(await import('./mcp-tools.js'), 'getMcpTools').mockReturnValue([
      { name: 'some-tool', description: 'desc', inputSchema: { type: 'object' } },
    ]);
    vi.spyOn({ executeToolCall }, 'executeToolCall').mockResolvedValue({ data: { ok: true } });

    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'some-tool', arguments: {} },
      });

    console.log('call tool success raw text:', res.text);
    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    expect(typeof payload).toBe('object');
    const content = (payload as { result?: { content?: unknown[] } }).result?.content ?? [];
    expect(Array.isArray(content)).toBe(true);
    expect(content[0]).toHaveProperty('type', 'text');
  });

  it('returns formatted error when executeToolCall fails', async () => {
    vi.spyOn({ isToolName }, 'isToolName').mockReturnValue(true);
    vi.spyOn(await import('./mcp-tools.js'), 'getMcpTools').mockReturnValue([
      { name: 'failing-tool', description: 'desc', inputSchema: { type: 'object' } },
    ]);
    vi.spyOn({ executeToolCall }, 'executeToolCall').mockResolvedValue({
      error: new Error('boom'),
    } as never);

    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'failing-tool', arguments: {} },
      });

    console.log('call tool error raw text:', res.text);
    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    expect(typeof payload).toBe('object');
    const result = (payload as { result?: { isError?: unknown; content?: unknown[] } }).result;
    expect(result?.isError).toBe(true);
    const content = result?.content ?? [];
    expect(Array.isArray(content)).toBe(true);
    const first = content[0];
    expect(isTextContent(first)).toBe(true);
    if (isTextContent(first)) {
      expect(first.text).toContain('Error:');
    }
  });
});
