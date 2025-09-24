'use server';

import {
  SearchRequest,
  buildBody,
  baseUrl,
  safeJsonParse,
  HybridResponseSchema,
  SuggestionResponseSchema,
} from './structured-search.shared';
import type { StructuredBody, SuggestionItem } from './structured-search.shared';

export async function searchAction(
  req: unknown,
): Promise<{ result: unknown | null; error?: string }> {
  const input = SearchRequest.parse(req);
  const body = buildBody(input);
  const base = baseUrl();

  try {
    const result = await requestStructuredSearch(base, body);
    const suggestions = await requestSuggestions(base, body);
    return { result: { ...result, suggestions } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return { result: null, error: message };
  }
}

async function requestStructuredSearch(base: string, body: StructuredBody) {
  const response = await fetch(new URL('/api/search', base).toString(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const parsed = HybridResponseSchema.safeParse(safeJsonParse(await response.text()));
  if (!response.ok || !parsed.success) {
    throw new Error('Search failed');
  }

  return parsed.data;
}

async function requestSuggestions(base: string, body: StructuredBody): Promise<SuggestionItem[]> {
  const prefix = body.text.trim();
  if (prefix.length <= 1) {
    return [];
  }

  try {
    const response = await fetch(new URL('/api/search/suggest', base).toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prefix,
        scope: body.scope,
        subject: body.subject,
        keyStage: body.keyStage,
        phaseSlug: body.phaseSlug,
        limit: 10,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const parsed = SuggestionResponseSchema.safeParse(safeJsonParse(await response.text()));
    return parsed.success ? parsed.data.suggestions : [];
  } catch (error) {
    console.error('Failed to fetch suggestions', error);
    return [];
  }
}
