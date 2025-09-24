import { z } from 'zod';

export interface StructuredBody {
  scope: 'units' | 'lessons' | 'sequences';
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
  includeFacets?: boolean;
  phaseSlug?: string;
}

export const SearchRequest = z.object({
  scope: z.enum(['units', 'lessons', 'sequences']),
  text: z.string(),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().positive().optional(),
  size: z.number().int().positive().optional(),
  phaseSlug: z.string().optional(),
  includeFacets: z.boolean().optional(),
});

export function buildBody(input: z.infer<typeof SearchRequest>): StructuredBody {
  return {
    scope: input.scope,
    text: input.text,
    subject: input.subject || undefined,
    keyStage: input.keyStage || undefined,
    minLessons: input.minLessons,
    size: input.size,
    includeFacets: input.includeFacets ?? true,
    phaseSlug: input.phaseSlug || undefined,
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
