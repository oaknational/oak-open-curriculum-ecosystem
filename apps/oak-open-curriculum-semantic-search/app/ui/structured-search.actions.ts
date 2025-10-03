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
import { buildApiUrl, resolveFixtureQueryParam } from './structured-search.actions.helpers';
import { isSearchScope } from '../../src/types/oak';
import {
  NARROW_SEARCH_SCOPES,
  DEFAULT_NARROW_SCOPE,
  MULTI_SCOPE,
} from '../../src/lib/search-scopes';
import {
  StructuredSearchRequestError,
  createStructuredSearchError,
  formatStructuredSearchError,
} from './structured-search.actions.error';

type StructuredRequestInput = Parameters<typeof buildBody>[0];

const EMPTY_SUGGESTION_RESPONSE: SuggestionResponse = {
  suggestions: [],
  cache: DEFAULT_SUGGESTION_CACHE,
} satisfies SuggestionResponse;

export async function searchAction(
  req: unknown,
): Promise<{ result: unknown | null; error?: string }> {
  const input = SearchRequest.parse(req);
  const base = baseUrl();
  const cookieStore = await cookies();
  const fixtureMode = resolveFixtureModeFromCookies(cookieStore);
  const fixtureQuery = resolveFixtureQueryParam(fixtureMode);

  if (fixtureMode === 'fixtures') {
    const fixture = buildFixtureForScope(input.scope);
    return { result: fixture };
  }

  try {
    if (input.scope === MULTI_SCOPE) {
      const multi = await requestMultiScopeSearch({ base, input, fixtureQuery });
      return { result: multi };
    }

    const body = buildBody(input);
    const result = await requestStructuredSearch({ base, body, fixtureQuery });
    const suggestionResponse = await requestSuggestions({ base, body, fixtureQuery });
    return { result: { ...result, suggestions: suggestionResponse.suggestions } };
  } catch (error: unknown) {
    console.error('Structured search action failed', error);
    const message = formatStructuredSearchError(error);
    return { result: null, error: message };
  }
}

async function requestStructuredSearch(params: {
  base: string;
  body: StructuredBody;
  fixtureQuery?: string;
}) {
  const { base, body: requestBody, fixtureQuery } = params;
  const response = await fetch(buildApiUrl(base, '/api/search', fixtureQuery), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });

  const raw = await response.text();
  const parsedBody = safeJsonParse(raw);
  const parsed = HybridResponseSchema.safeParse(parsedBody);

  if (!response.ok) {
    throw createStructuredSearchError(response, parsedBody);
  }

  if (!parsed.success) {
    throw new StructuredSearchRequestError({
      message: 'Structured search response could not be parsed.',
      statusCode: response.status,
      code: 'INVALID_RESPONSE',
    });
  }

  return parsed.data;
}

async function requestSuggestions(params: {
  base: string;
  body: StructuredBody;
  fixtureQuery?: string;
}): Promise<SuggestionResponse> {
  const { base, body, fixtureQuery } = params;
  const prefix = body.text.trim();
  if (prefix.length <= 1) {
    return EMPTY_SUGGESTION_RESPONSE;
  }

  try {
    const scope: SearchScope = isSearchScope(body.scope) ? body.scope : DEFAULT_NARROW_SCOPE;
    const response = await fetch(buildApiUrl(base, '/api/search/suggest', fixtureQuery), {
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
      return EMPTY_SUGGESTION_RESPONSE;
    }

    const parsed = SuggestionResponseSchema.safeParse(safeJsonParse(await response.text()));
    return parsed.success ? parsed.data : EMPTY_SUGGESTION_RESPONSE;
  } catch (error: unknown) {
    console.error('Failed to fetch suggestions', error);
    return EMPTY_SUGGESTION_RESPONSE;
  }
}

async function requestMultiScopeSearch(params: {
  base: string;
  input: StructuredRequestInput;
  fixtureQuery?: string;
}): Promise<MultiScopeHybridResponse> {
  const { base, input, fixtureQuery } = params;
  const queryBase = {
    text: input.text,
    subject: input.subject,
    keyStage: input.keyStage,
    minLessons: input.minLessons,
    size: input.size,
    includeFacets: input.includeFacets ?? true,
    phaseSlug: input.phaseSlug,
  } as const;

  const scopes = NARROW_SEARCH_SCOPES;
  const results = await Promise.all(
    scopes.map(async (scope) => {
      const response = await requestStructuredSearch({
        base,
        body: buildBody({ ...queryBase, scope }),
        fixtureQuery,
      });
      return { scope, result: response } as const;
    }),
  );

  const suggestionResponse = await requestSuggestions({
    base,
    body: {
      scope: DEFAULT_NARROW_SCOPE,
      text: input.text,
      subject: input.subject,
      keyStage: input.keyStage,
      includeFacets: input.includeFacets ?? true,
    },
    fixtureQuery,
  });

  const payload: MultiScopeHybridResponse = {
    scope: MULTI_SCOPE,
    buckets: results,
    suggestions: suggestionResponse.suggestions,
    suggestionCache: suggestionResponse.cache,
  };

  const parsed = MultiScopeHybridResponseSchema.safeParse(payload);
  return parsed.success ? parsed.data : payload;
}
