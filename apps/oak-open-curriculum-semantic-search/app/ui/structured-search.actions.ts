'use server';

import {
  SearchRequest,
  buildBody,
  baseUrl,
  safeJsonParse,
  HybridResponseSchema,
  SuggestionResponseSchema,
  MultiScopeHybridResponseSchema,
} from './structured-search.shared';
import { structuredSearchFixture, suggestionFixture } from './__fixtures__/search-structured';
import type {
  StructuredBody,
  SuggestionItem,
  MultiScopeHybridResponse,
  SearchScope,
} from './structured-search.shared';

type StructuredRequestInput = Parameters<typeof buildBody>[0];

export async function searchAction(
  req: unknown,
): Promise<{ result: unknown | null; error?: string }> {
  const input = SearchRequest.parse(req);
  const base = baseUrl();

  if (process.env.SEMANTIC_SEARCH_USE_FIXTURES === 'true') {
    if (input.scope === 'all') {
      const buckets = ['lessons', 'units', 'sequences'].map((scope) => ({
        scope,
        result: structuredSearchFixture,
      }));
      return {
        result: {
          scope: 'all',
          buckets,
          suggestions: suggestionFixture.suggestions,
        },
      };
    }
    return {
      result: {
        ...structuredSearchFixture,
        scope: structuredSearchFixture.scope,
        suggestions: suggestionFixture.suggestions,
      },
    };
  }

  try {
    if (input.scope === 'all') {
      const multi = await requestMultiScopeSearch(base, input);
      return { result: multi };
    }

    const body = buildBody(input);
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
    const scope: SearchScope = body.scope === 'all' ? 'lessons' : body.scope;
    const response = await fetch(new URL('/api/search/suggest', base).toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prefix,
        scope,
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

async function requestMultiScopeSearch(
  base: string,
  input: StructuredRequestInput,
): Promise<MultiScopeHybridResponse> {
  const queryBase = {
    text: input.text,
    subject: input.subject,
    keyStage: input.keyStage,
    minLessons: input.minLessons,
    size: input.size,
    includeFacets: input.includeFacets ?? true,
    phaseSlug: input.phaseSlug,
  } as const;

  const scopes: SearchScope[] = ['lessons', 'units', 'sequences'];
  const results = await Promise.all(
    scopes.map(async (scope) => {
      const response = await requestStructuredSearch(base, buildBody({ ...queryBase, scope }));
      return { scope, result: response } as const;
    }),
  );

  const suggestions = await requestSuggestions(base, {
    scope: 'lessons',
    text: input.text,
    subject: input.subject,
    keyStage: input.keyStage,
    includeFacets: input.includeFacets ?? true,
  });

  const payload: MultiScopeHybridResponse = {
    scope: 'all',
    buckets: results,
    suggestions,
  };

  const parsed = MultiScopeHybridResponseSchema.safeParse(payload);
  return parsed.success ? parsed.data : payload;
}
