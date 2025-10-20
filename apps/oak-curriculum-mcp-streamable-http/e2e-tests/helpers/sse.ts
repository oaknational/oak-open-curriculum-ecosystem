import { z } from 'zod';

const JsonRpcEnvelopeSchema = z.object({
  result: z.unknown().optional(),
  error: z.unknown().optional(),
});

export type JsonRpcEnvelope = z.infer<typeof JsonRpcEnvelopeSchema>;

const TextContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

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

export function readFirstTextContent(content: readonly unknown[]): string {
  for (const entry of content) {
    const parsed = TextContentSchema.safeParse(entry);
    if (parsed.success) {
      return parsed.data.text;
    }
  }
  throw new Error('SSE envelope missing text content entry');
}
