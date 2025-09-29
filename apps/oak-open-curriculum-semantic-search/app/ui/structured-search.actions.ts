'use server';

import { cookies } from 'next/headers';
import {
  SearchRequest,
  buildBody,
  baseUrl,
  safeJsonParse,
  HybridResponseSchema,
  SuggestionResponseSchema,
  MultiScopeHybridResponseSchema,
  DEFAULT_SUGGESTION_CACHE,
} from './structured-search.shared';
import type {
  StructuredBody,
  MultiScopeHybridResponse,
  SearchScope,
  SuggestionResponse,
} from './structured-search.shared';
import { buildFixtureForScope } from './search-fixtures/builders';
import { resolveFixtureModeFromCookies } from '../lib/fixture-mode';

type StructuredRequestInput = Parameters<typeof buildBody>[0];

export async function searchAction(
  req: unknown,
): Promise<{ result: unknown | null; error?: string }> {
  const input = SearchRequest.parse(req);
  const base = baseUrl();
  const cookieStore = await cookies();
  const fixtureMode = resolveFixtureModeFromCookies(cookieStore);

  if (fixtureMode === 'fixtures') {
    const fixture = buildFixtureForScope(input.scope);
    return { result: fixture };
  }

  try {
    if (input.scope === 'all') {
      const multi = await requestMultiScopeSearch(base, input);
      return { result: multi };
    }

    const body = buildBody(input);
    const result = await requestStructuredSearch(base, body);
    const suggestionResponse = await requestSuggestions(base, body);
    return { result: { ...result, suggestions: suggestionResponse.suggestions } };
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

async function requestSuggestions(base: string, body: StructuredBody): Promise<SuggestionResponse> {
  const prefix = body.text.trim();
  if (prefix.length <= 1) {
    return {
      suggestions: [],
      cache: DEFAULT_SUGGESTION_CACHE,
    } satisfies SuggestionResponse;
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
      return {
        suggestions: [],
        cache: DEFAULT_SUGGESTION_CACHE,
      } satisfies SuggestionResponse;
    }

    const parsed = SuggestionResponseSchema.safeParse(safeJsonParse(await response.text()));
    if (parsed.success) {
      return parsed.data;
    }
    return {
      suggestions: [],
      cache: DEFAULT_SUGGESTION_CACHE,
    } satisfies SuggestionResponse;
  } catch (error) {
    console.error('Failed to fetch suggestions', error);
    return {
      suggestions: [],
      cache: DEFAULT_SUGGESTION_CACHE,
    } satisfies SuggestionResponse;
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

  const suggestionResponse = await requestSuggestions(base, {
    scope: 'lessons',
    text: input.text,
    subject: input.subject,
    keyStage: input.keyStage,
    includeFacets: input.includeFacets ?? true,
  });

  const payload: MultiScopeHybridResponse = {
    scope: 'all',
    buckets: results,
    suggestions: suggestionResponse.suggestions,
    suggestionCache: suggestionResponse.cache,
  };

  const parsed = MultiScopeHybridResponseSchema.safeParse(payload);
  return parsed.success ? parsed.data : payload;
}
