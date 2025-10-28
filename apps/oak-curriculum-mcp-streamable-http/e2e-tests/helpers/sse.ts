import { z } from 'zod';

const JsonRpcEnvelopeSchema = z.object({
  result: z.unknown().optional(),
  error: z.unknown().optional(),
});

export type JsonRpcEnvelope = z.infer<typeof JsonRpcEnvelopeSchema>;

const JsonRpcResultSchema = z.object({
  tools: z.unknown().optional(),
  content: z.array(z.unknown()).optional(),
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

export function parseToolSuccessPayload(result: JsonRpcResult): ToolSuccessPayload {
  const content = getContentArray(result);
  const textEntry = readFirstTextContent(content);
  const parsed: unknown = JSON.parse(textEntry);
  return ToolSuccessSchema.parse(parsed);
}
