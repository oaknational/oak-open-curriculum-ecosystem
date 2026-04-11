import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import {
  getContentArray,
  getStructuredContentData,
  parseJsonRpcResult,
  parseSseEnvelope,
} from './helpers/sse.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, message: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(message);
  }

  return value;
}

function expectObjectField(value: Record<string, unknown>, key: string): void {
  requireRecord(value[key], `Expected "${key}" to be an object`);
}

function expectNumberField(value: Record<string, unknown>, key: string): void {
  expect(typeof value[key]).toBe('number');
}

function expectArrayField(value: Record<string, unknown>, key: string): void {
  expect(Array.isArray(value[key])).toBe(true);
}

function readTextContentAtIndex(content: readonly unknown[], index: number): string {
  const entry = content[index];

  if (
    typeof entry !== 'object' ||
    entry === null ||
    !('type' in entry) ||
    entry.type !== 'text' ||
    !('text' in entry) ||
    typeof entry.text !== 'string'
  ) {
    throw new Error(`Expected content[${String(index)}] to be TextContent`);
  }

  return entry.text;
}

async function callTool(name: string, args: Record<string, unknown>) {
  const { app } = await createStubbedHttpApp();
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({
      jsonrpc: '2.0',
      id: 'fallback-proof',
      method: 'tools/call',
      params: { name, arguments: args },
    });

  expect(response.status).toBe(200);

  const envelope = parseSseEnvelope(response.text);
  const result = parseJsonRpcResult(envelope);

  expect(result.isError).not.toBe(true);

  return result;
}

describe('WS3 non-UI fallback proof', () => {
  it('get-curriculum-model returns summary text, JSON payload text, and structuredContent', async () => {
    const result = await callTool('get-curriculum-model', {});
    const content = getContentArray(result);
    const summary = readTextContentAtIndex(content, 0);
    const jsonPayload = readTextContentAtIndex(content, 1);
    const parsedPayload: unknown = JSON.parse(jsonPayload);
    const structuredContent = getStructuredContentData(result);
    const parsedPayloadRecord = requireRecord(
      parsedPayload,
      'Expected curriculum model payload to be an object',
    );
    const structuredContentRecord = requireRecord(
      structuredContent,
      'Expected curriculum model structuredContent to be an object',
    );

    expect(content).toHaveLength(2);
    expect(summary).toContain('Oak Curriculum model loaded');
    expectObjectField(parsedPayloadRecord, 'domainModel');
    expectObjectField(parsedPayloadRecord, 'toolGuidance');
    expectObjectField(structuredContentRecord, 'domainModel');
    expectObjectField(structuredContentRecord, 'toolGuidance');
    expect(structuredContentRecord.summary).toBe(summary);
  });

  it('user-search returns summary text, JSON payload text, and structuredContent', async () => {
    const result = await callTool('user-search', {
      query: 'fractions',
      scope: 'lessons',
      size: 3,
    });
    const content = getContentArray(result);
    const summary = readTextContentAtIndex(content, 0);
    const jsonPayload = readTextContentAtIndex(content, 1);
    const parsedPayload: unknown = JSON.parse(jsonPayload);
    const structuredContent = getStructuredContentData(result);
    const parsedPayloadRecord = requireRecord(
      parsedPayload,
      'Expected user-search payload to be an object',
    );
    const structuredContentRecord = requireRecord(
      structuredContent,
      'Expected user-search structuredContent to be an object',
    );

    expect(content).toHaveLength(2);
    expect(summary).toContain('fractions');
    expect(summary).toMatch(/^(Found|No) /u);
    expect(summary.length).toBeGreaterThan(20);
    expect(parsedPayloadRecord.scope).toBe('lessons');
    expectNumberField(parsedPayloadRecord, 'total');
    expectArrayField(parsedPayloadRecord, 'results');
    expect(structuredContentRecord.scope).toBe('lessons');
    expectNumberField(structuredContentRecord, 'total');
    expectArrayField(structuredContentRecord, 'results');
    expect(structuredContentRecord.summary).toBe(summary);
  });
});
