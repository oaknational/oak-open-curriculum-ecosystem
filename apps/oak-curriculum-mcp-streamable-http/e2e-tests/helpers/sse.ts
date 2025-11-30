import { z } from 'zod';

const JsonRpcEnvelopeSchema = z.object({
  result: z.unknown().optional(),
  error: z.unknown().optional(),
});

export type JsonRpcEnvelope = z.infer<typeof JsonRpcEnvelopeSchema>;

/**
 * Schema for tool call results with the new optimized format.
 *
 * The format uses:
 * - `content[0].text`: Human-readable summary (NOT JSON)
 * - `structuredContent`: Minimal data for model reasoning
 * - `_meta.fullResults`: Full data for tests and widgets
 */
const JsonRpcResultSchema = z.object({
  tools: z.unknown().optional(),
  content: z.array(z.unknown()).optional(),
  structuredContent: z.unknown().optional(),
  _meta: z
    .object({
      fullResults: z.unknown().optional(),
    })
    .loose()
    .optional(),
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

/**
 * Extract full results from _meta.fullResults.
 *
 * The new optimized response format stores full data in `_meta.fullResults`
 * while `content[0].text` contains only a human-readable summary.
 *
 * @param result - Parsed JSON-RPC result
 * @returns The full results data from _meta
 * @throws Error if _meta.fullResults is not present
 */
export function getFullResultsFromMeta(result: JsonRpcResult): unknown {
  const fullResults = result._meta?.fullResults;
  if (fullResults === undefined) {
    throw new Error('SSE envelope missing _meta.fullResults - response may be using old format');
  }
  return fullResults;
}

/**
 * Parse tool success payload from generated tools using formatData().
 *
 * Generated tools (via universal-tools/executor.ts) return responses with
 * JSON in `content[0].text` containing `{ status, data }`.
 *
 * For aggregated tools using formatOptimizedResult(), use getFullResultsFromMeta()
 * which reads from `_meta.fullResults` instead.
 */
export function parseToolSuccessPayload(result: JsonRpcResult): ToolSuccessPayload {
  const content = getContentArray(result);
  const textEntry = readFirstTextContent(content);
  const parsed: unknown = JSON.parse(textEntry);
  return ToolSuccessSchema.parse(parsed);
}
