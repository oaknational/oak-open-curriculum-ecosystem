import { z } from 'zod';
import type { NaturalBody } from './NaturalSearch.types';

const ApiResponseSchema = z
  .object({
    results: z.array(z.unknown()).default([]),
    error: z.string().optional(),
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
  resOk: boolean,
  txt: string,
): { error: string | null; results: unknown[] } {
  const parsed = safeJsonParse(txt);
  const safe = ApiResponseSchema.safeParse(parsed);
  if (!safe.success) {
    return { error: resOk ? null : 'Search failed', results: [] };
  }
  const data = safe.data;
  if (!resOk && data.error) {
    return { error: data.error, results: [] };
  }
  return { error: null, results: data.results };
}

export function normaliseNaturalRequest(model: NaturalBody): NaturalBody {
  return {
    q: model.q,
    scope: model.scope,
    size: model.size && model.size > 0 ? model.size : undefined,
    subject: model.subject || undefined,
    keyStage: model.keyStage || undefined,
    minLessons: model.minLessons,
    phaseSlug: model.phaseSlug || undefined,
  };
}

export async function submitNaturalSearchRequest(body: NaturalBody): Promise<unknown[]> {
  const response = await fetch('/api/search/nl', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const { error, results } = parseResponse(response.ok, text);
  if (error) {
    throw new Error(error);
  }
  return results;
}
