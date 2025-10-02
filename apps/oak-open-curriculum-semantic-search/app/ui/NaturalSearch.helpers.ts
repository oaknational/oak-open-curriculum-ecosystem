import { z } from 'zod';
import type { NaturalBody } from './NaturalSearch.types';
import {
  SearchStructuredRequestSchema,
  SearchNaturalLanguageRequestSchema,
} from '../../src/types/oak';

const NaturalSearchSummarySchema = z
  .object({
    prompt: z.string(),
    structured: SearchStructuredRequestSchema,
  })
  .loose();

export type NaturalSearchSummary = z.infer<typeof NaturalSearchSummarySchema>;

const NaturalSearchSuccessSchema = z
  .object({
    result: z.unknown(),
    summary: NaturalSearchSummarySchema,
  })
  .loose();

export type NaturalSearchSuccessPayload = z.infer<typeof NaturalSearchSuccessSchema>;

const NaturalSearchErrorSchema = z
  .object({
    error: z.string(),
    message: z.string().optional(),
  })
  .loose();

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function parseResponse(
  responseOk: boolean,
  text: string,
): { error: string | null; payload: NaturalSearchSuccessPayload | null } {
  const parsed = safeJsonParse(text);
  const success = NaturalSearchSuccessSchema.safeParse(parsed);
  if (success.success) {
    return { error: null, payload: success.data };
  }

  const error = NaturalSearchErrorSchema.safeParse(parsed);
  if (error.success) {
    return { error: error.data.error, payload: null };
  }

  if (!responseOk) {
    return { error: 'Search failed', payload: null };
  }

  return { error: null, payload: null };
}

export function normaliseNaturalRequest(model: Pick<NaturalBody, 'q'>): NaturalBody {
  const prompt = typeof model.q === 'string' ? model.q.trim() : '';
  return SearchNaturalLanguageRequestSchema.parse({ q: prompt });
}

export async function submitNaturalSearchRequest(
  body: NaturalBody,
): Promise<NaturalSearchSuccessPayload> {
  const response = await fetch('/api/search/nl', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const { error, payload } = parseResponse(response.ok, await response.text());
  if (error || !payload) {
    throw new Error(error ?? 'Search failed');
  }
  return payload;
}
