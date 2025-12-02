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
 * Parse tool success payload from generated tools using formatData().
 *
 * Generated tools (via universal-tools/executor.ts) return responses with
 * JSON in `content[0].text` containing `{ status, data }`.
 *
 * For aggregated tools using formatOptimizedResult(), use getStructuredContentData()
 * which reads from `structuredContent`.
 */
export function parseToolSuccessPayload(result: JsonRpcResult): ToolSuccessPayload {
  const content = getContentArray(result);
  const textEntry = readFirstTextContent(content);
  const parsed: unknown = JSON.parse(textEntry);
  return ToolSuccessSchema.parse(parsed);
}
