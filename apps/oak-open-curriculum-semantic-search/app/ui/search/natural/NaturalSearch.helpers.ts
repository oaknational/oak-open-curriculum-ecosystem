import { z } from 'zod';
import type {
  SearchNaturalLanguageRequest,
  SearchStructuredRequest,
} from '@oaknational/oak-curriculum-sdk';
import {
  SearchStructuredRequestSchema,
  SearchNaturalLanguageRequestSchema,
} from '@oaknational/oak-curriculum-sdk';

const NaturalSearchSummarySchema = z
  .object({
    prompt: z.string(),
    structured: z.unknown(),
  })
  .loose();

export type NaturalSearchSummary = z.infer<typeof NaturalSearchSummarySchema>;

const NaturalSearchSuccessSchema = z
  .object({
    result: z.unknown(),
    summary: NaturalSearchSummarySchema,
  })
  .loose();

type RawNaturalSearchSuccess = z.infer<typeof NaturalSearchSuccessSchema>;

export type NaturalSearchSuccessPayload = RawNaturalSearchSuccess & {
  summary: NaturalSearchSummary & { structured: SearchStructuredRequest };
};

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

const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  FIXTURE_ERROR: 'Fixture mode requested an error response for natural-language search.',
  LLM_DISABLED:
    'Natural-language parsing is disabled on this deployment. Use /api/search with a structured body.',
};

export function parseResponse(
  responseOk: boolean,
  text: string,
): { error: string | null; payload: NaturalSearchSuccessPayload | null } {
  const parsed = safeJsonParse(text);
  const success = NaturalSearchSuccessSchema.safeParse(parsed);
  if (success.success) {
    const structured = SearchStructuredRequestSchema.safeParse(success.data.summary.structured);
    if (!structured.success) {
      return { error: 'Search failed', payload: null };
    }

    const payload: NaturalSearchSuccessPayload = {
      ...success.data,
      summary: {
        ...success.data.summary,
        structured: structured.data,
      },
    };
    return { error: null, payload };
  }

  const error = NaturalSearchErrorSchema.safeParse(parsed);
  if (error.success) {
    const resolvedMessage =
      error.data.message ?? KNOWN_ERROR_MESSAGES[error.data.error] ?? error.data.error;
    return { error: resolvedMessage, payload: null };
  }

  if (!responseOk) {
    return { error: 'Search failed', payload: null };
  }

  return { error: null, payload: null };
}

export function normaliseNaturalRequest(
  model: Pick<SearchNaturalLanguageRequest, 'q'>,
): SearchNaturalLanguageRequest {
  const prompt = typeof model.q === 'string' ? model.q.trim() : '';
  return SearchNaturalLanguageRequestSchema.parse({ q: prompt });
}

export async function submitNaturalSearchRequest(
  body: SearchNaturalLanguageRequest,
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
