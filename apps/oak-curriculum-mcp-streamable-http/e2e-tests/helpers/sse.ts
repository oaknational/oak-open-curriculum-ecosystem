import { z } from 'zod';

const JsonRpcEnvelopeSchema = z.object({
  result: z.unknown().optional(),
  error: z.unknown().optional(),
});

export type JsonRpcEnvelope = z.infer<typeof JsonRpcEnvelopeSchema>;

/**
 * Schema for tool call results per OpenAI Apps SDK reference.
 *
 * Per https://developers.openai.com/apps-sdk/reference#tool-results:
 * - `content`: Model AND widget see this (human-readable summary)
 * - `structuredContent`: Model AND widget see this (FULL data for reasoning)
 * - `_meta`: Widget ONLY sees this (additional widget metadata)
 */
const JsonRpcResultSchema = z.object({
  tools: z.unknown().optional(),
  content: z.array(z.unknown()).optional(),
  structuredContent: z.record(z.string(), z.unknown()).optional(),
  _meta: z.record(z.string(), z.unknown()).optional(),
  isError: z.boolean().optional(),
});

export type JsonRpcResult = z.infer<typeof JsonRpcResultSchema>;

const TextContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

const ToolSuccessSchema = z.object({
  status: z.union([z.number(), z.string()]),
  data: z.unknown(),
});

export type ToolSuccessPayload = z.infer<typeof ToolSuccessSchema>;

const JsonRpcErrorSchema = z
  .object({
    message: z.string().optional(),
  })
  .loose();

const JsonRpcErrorResultSchema = z
  .object({
    isError: z.boolean().optional(),
    content: z.array(z.unknown()).optional(),
  })
  .loose();

function findFirstDataLine(raw: string): string {
  const lines = raw.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      return trimmed.slice('data:'.length).trimStart();
    }
  }
  throw new Error('SSE payload missing data line');
}

export function parseSseEnvelope(raw: string): JsonRpcEnvelope {
  const jsonText = findFirstDataLine(raw);
  const parsed: unknown = JSON.parse(jsonText);
  return JsonRpcEnvelopeSchema.parse(parsed);
}

export function parseJsonRpcResult(envelope: JsonRpcEnvelope): JsonRpcResult {
  return JsonRpcResultSchema.parse(envelope.result);
}

export function getContentArray(result: JsonRpcResult): readonly unknown[] {
  return result.content ?? [];
}

export function readFirstTextContent(content: readonly unknown[]): string {
  for (const entry of content) {
    const parsed = TextContentSchema.safeParse(entry);
    if (parsed.success) {
      return parsed.data.text;
    }
  }
  throw new Error('SSE envelope missing text content entry');
}

export function hasJsonRpcOrResultError(envelope: JsonRpcEnvelope): boolean {
  const error = JsonRpcErrorSchema.safeParse(envelope.error);
  if (error.success) {
    return true;
  }

  const result = JsonRpcErrorResultSchema.safeParse(envelope.result);
  return result.success && result.data.isError === true;
}

export function readJsonRpcOrResultErrorText(envelope: JsonRpcEnvelope): string {
  const error = JsonRpcErrorSchema.safeParse(envelope.error);
  if (error.success && error.data.message !== undefined) {
    return error.data.message;
  }

  const result = JsonRpcErrorResultSchema.safeParse(envelope.result);
  if (!result.success || result.data.isError !== true) {
    return '';
  }

  for (const entry of result.data.content ?? []) {
    const parsed = TextContentSchema.safeParse(entry);
    if (parsed.success) {
      return parsed.data.text;
    }
  }

  return '';
}

/** structuredContent type from Zod schema - E2E test helper only */
type StructuredContentData = NonNullable<JsonRpcResult['structuredContent']>;

/**
 * Extract full data from structuredContent (per OpenAI Apps SDK).
 *
 * Per OpenAI reference: structuredContent is "Surfaced to the model and the component".
 * This is where the full data lives for aggregated tools.
 *
 * @param result - Parsed JSON-RPC result
 * @returns The full data from structuredContent
 * @throws Error if structuredContent is not present
 */
export function getStructuredContentData(result: JsonRpcResult): StructuredContentData {
  const structured = result.structuredContent;
  if (structured === undefined) {
    throw new Error('SSE envelope missing structuredContent');
  }
  return structured;
}

/**
 * Parse tool success payload from content[1] (JSON data item).
 *
 * All tools now return a 2-item content array via formatToolResponse():
 * - content[0]: human-readable summary
 * - content[1]: JSON data containing `{ status, data }`
 *
 * For structured data access, use getStructuredContentData() which
 * reads from `structuredContent`.
 */
export function parseToolSuccessPayload(result: JsonRpcResult): ToolSuccessPayload {
  const content = getContentArray(result);
  if (content.length < 2) {
    throw new Error(`Expected 2-item content array, got ${String(content.length)}`);
  }
  const secondItem = content[1];
  if (typeof secondItem !== 'object' || secondItem === null) {
    throw new Error('content[1] must be a TextContent object');
  }
  if (!('text' in secondItem) || typeof secondItem.text !== 'string') {
    throw new Error('content[1] must have a string text field');
  }
  const parsed: unknown = JSON.parse(secondItem.text);
  return ToolSuccessSchema.parse(parsed);
}
