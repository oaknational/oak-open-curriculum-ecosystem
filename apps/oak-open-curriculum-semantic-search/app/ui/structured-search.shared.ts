import { z } from 'zod';

export interface StructuredBody {
  scope: 'units' | 'lessons';
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
}

export const SearchRequest = z.object({
  scope: z.enum(['units', 'lessons']),
  text: z.string(),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().positive().optional(),
  size: z.number().int().positive().optional(),
});

export function buildBody(input: z.infer<typeof SearchRequest>): StructuredBody {
  return {
    scope: input.scope,
    text: input.text,
    subject: input.subject || undefined,
    keyStage: input.keyStage || undefined,
    minLessons: input.minLessons,
    size: input.size,
  };
}

export function baseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (fromEnv) {
    return fromEnv;
  }
  const fromVercel = process.env.VERCEL_URL;
  if (fromVercel) {
    return `https://${fromVercel}`;
  }
  if (fromVercel) {
    return `https://${fromVercel}`;
  }
  return 'http://localhost:3000';
}

export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
