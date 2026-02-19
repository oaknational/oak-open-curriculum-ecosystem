import assert from 'node:assert/strict';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';

export type JsonObject = Readonly<Record<PropertyKey, unknown>>;

type JsonArray = readonly unknown[];

interface TextContentEntry {
  readonly type: 'text';
  readonly text: string;
}

export interface JsonResponse {
  readonly res: Response;
  readonly text: string;
}

export interface JsonRpcEnvelope {
  readonly result?: unknown;
  readonly error?: unknown;
}

export async function fetchJson(url: URL | string, init?: RequestInit): Promise<JsonResponse> {
  const res = await fetch(url, init);
  const text = await res.text();
  return { res, text };
}

export function parseFirstSsePayload(raw: string): JsonRpcEnvelope {
  const line = raw
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value.startsWith('data: '));
  if (!line) {
    throw new Error('SSE payload must include at least one data line');
  }
  const jsonPayload = line.slice('data: '.length);
  const parsed: unknown = JSON.parse(jsonPayload);
  return ensureRecord(parsed, 'SSE envelope');
}

export function extractToolNames(raw: string): readonly string[] {
  const envelope = parseFirstSsePayload(raw);
  const result = ensureRecord(envelope.result, 'tools/list result');
  const tools = ensureArray(result.tools, 'tools/list tools array');
  const names = tools.map((entry, index) => {
    const label = `tool entry ${String(index)}`;
    const toolRecord = ensureRecord(entry, label);
    return ensureString(toolRecord.name, `${label} name`);
  });
  const unique = new Set(names);
  assert.equal(unique.size, names.length, 'tools/list should not contain duplicate tool names');
  return names;
}

export function extractFirstText(content: readonly unknown[], description: string): string {
  const entries = ensureArray(content, `${description} array`);
  for (const entry of entries) {
    if (isTextContent(entry)) {
      return entry.text;
    }
  }
  throw new Error(`No text content found in ${description}`);
}

/**
 * Extract the JSON data text from a 2-item content array.
 *
 * All tools return `[summary, jsonData]` via formatToolResponse().
 * The summary (content[0]) is human-readable; the JSON (content[1])
 * contains `{ status, data }`.
 */
export function extractJsonText(content: readonly unknown[], description: string): string {
  const entries = ensureArray(content, `${description} array`);
  if (entries.length < 2) {
    throw new Error(`${description} must have at least 2 items (got ${String(entries.length)})`);
  }
  const jsonItem = entries[1];
  if (!isTextContent(jsonItem)) {
    throw new Error(`${description}[1] must be a text content entry`);
  }
  return jsonItem.text;
}

export function ensureRecord(value: unknown, description: string): JsonObject {
  if (!isJsonObject(value)) {
    throw new Error(`${description} must be an object`);
  }
  return value;
}

export function ensureArray(value: unknown, description: string): JsonArray {
  if (!Array.isArray(value)) {
    throw new Error(`${description} must be an array`);
  }
  return value;
}

export function ensureString(value: unknown, description: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${description} must be a string`);
  }
  return value;
}

export function ensureBoolean(value: unknown, description: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${description} must be a boolean`);
  }
  return value;
}

export function ensureOptionalString(value: unknown, description: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return ensureString(value, description);
}

export function asOptionalRecord(value: unknown): JsonObject | undefined {
  return isJsonObject(value) ? value : undefined;
}

export function createAuthHeaders(context: SmokeContext): Record<string, string> {
  if (!context.devToken) {
    return {};
  }
  return { Authorization: `Bearer ${context.devToken}` };
}

export function createToolHeaders(context: SmokeContext): Record<string, string> {
  return {
    ...createAuthHeaders(context),
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTextContent(value: unknown): value is TextContentEntry {
  if (!isJsonObject(value)) {
    return false;
  }
  return value.type === 'text' && typeof value.text === 'string';
}
