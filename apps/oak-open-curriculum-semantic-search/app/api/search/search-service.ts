import { unstable_cache } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import {
  SearchStructuredRequestSchema,
  SearchSuggestionResponseSchema,
  isSearchScope,
  type SearchStructuredRequest,
  type SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import { isKeyStage, isSubject } from '../../../src/adapters/sdk-guards';
import { runHybridSearch, runHybridSearchAllScopes } from '../../../src/lib/run-hybrid-search';
import { logZeroHit } from '../../../src/lib/observability/zero-hit';
import { DEFAULT_NARROW_SCOPE, MULTI_SCOPE } from '../../../src/lib/search-scopes';
import type { HybridSearchResult, StructuredQuery } from '../../../src/lib/run-hybrid-search';
import {
  resolveFixtureModeFromRequest,
  applyFixtureModeCookie,
  type FixtureMode,
} from '../../lib/fixture-mode';
import type { SafeParseReturnType } from 'zod/v3';
import {
  buildFixtureResponse,
  isMultiScopePayload,
  resolveSequencePhase,
  type SearchResponsePayload,
} from './fixture-responses';

export function parseSearchRequest(
  payload: unknown,
): SafeParseReturnType<unknown, SearchStructuredRequest> {
  return SearchStructuredRequestSchema.safeParse(payload);
}

export function buildStructuredQuery(body: SearchStructuredRequest): StructuredQuery {
  const subject = body.subject && isSubject(body.subject) ? body.subject : undefined;
  const keyStage = body.keyStage && isKeyStage(body.keyStage) ? body.keyStage : undefined;
  const scope = isSearchScope(body.scope) ? body.scope : DEFAULT_NARROW_SCOPE;

  return {
    scope,
    text: body.text,
    subject,
    keyStage,
    minLessons: body.minLessons,
    size: body.size,
    from: body.from,
    highlight: body.highlight,
    includeFacets: body.includeFacets,
    phaseSlug: body.phaseSlug,
  };
}

export function buildMultiScopeInput(query: StructuredQuery): Omit<StructuredQuery, 'scope'> {
  const { scope: _unused, ...rest } = query;
  void _unused;
  return rest;
}

export function createCachedRunner(
  indexVersion: string,
  query: StructuredQuery,
): (payload: StructuredQuery) => Promise<HybridSearchResult> {
  const cacheKey = JSON.stringify({ v: indexVersion, q: query });
  return unstable_cache(async (payload: StructuredQuery) => runHybridSearch(payload), [cacheKey], {
    tags: ['search-structured', `index:${indexVersion}`],
  });
}

export async function fetchAllScopeSuggestions(
  req: NextRequest,
  body: SearchStructuredRequest,
  query: StructuredQuery,
): Promise<SearchSuggestionItem[]> {
  const suggestionResponse = await fetch(new URL('/api/search/suggest', req.url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prefix: body.text,
      scope: DEFAULT_NARROW_SCOPE,
      subject: query.subject,
      keyStage: query.keyStage,
      phaseSlug: query.phaseSlug,
      limit: 10,
    }),
  });

  if (!suggestionResponse.ok) {
    return [];
  }

  const suggestionJson: unknown = await suggestionResponse.json();
  return parseSuggestionList(suggestionJson);
}

function parseSuggestionList(value: unknown): SearchSuggestionItem[] {
  const parsed = SearchSuggestionResponseSchema.safeParse(value);
  return parsed.success ? parsed.data.suggestions : [];
}

export async function resolveSearchResponse(params: {
  body: SearchStructuredRequest;
  query: StructuredQuery;
  req: NextRequest;
  indexVersion: string;
}): Promise<SearchResponsePayload> {
  const { body, query, req, indexVersion } = params;
  const runCached = createCachedRunner(indexVersion, query);

  if (body.scope === MULTI_SCOPE) {
    const multi = await runHybridSearchAllScopes(buildMultiScopeInput(query));
    const suggestions = await fetchAllScopeSuggestions(req, body, query);
    return suggestions.length > 0 ? { ...multi, suggestions } : multi;
  }

  return runCached(query);
}

export interface ZeroHitLoggingOptions {
  readonly skipLog?: boolean;
  readonly skipPersistence?: boolean;
  readonly skipWebhook?: boolean;
}

export async function logZeroHitsForResult(params: {
  result: SearchResponsePayload;
  query: StructuredQuery;
  indexVersion: string;
  options?: ZeroHitLoggingOptions;
}): Promise<void> {
  const { result, query, indexVersion, options } = params;
  const common = {
    text: query.text,
    subject: query.subject,
    keyStage: query.keyStage,
    indexVersion,
    webhookUrl: process.env.ZERO_HIT_WEBHOOK_URL,
    skipLog: options?.skipLog,
    skipPersistence: options?.skipPersistence,
    skipWebhook: options?.skipWebhook,
  } as const;

  if (isMultiScopePayload(result)) {
    for (const bucket of result.buckets) {
      await logZeroHit({
        ...common,
        total: bucket.result.total,
        scope: bucket.scope,
        phaseSlug: resolveSequencePhase(bucket.scope, query.phaseSlug),
        took: bucket.result.took,
        timedOut: bucket.result.timedOut,
      });
    }
    return;
  }

  if (!('total' in result)) {
    return;
  }

  await logZeroHit({
    ...common,
    total: result.total,
    scope: result.scope,
    phaseSlug: query.phaseSlug,
    took: result.took,
    timedOut: result.timedOut,
  });
}

export async function handleFixtureModeRequest(params: {
  body: SearchStructuredRequest;
  mode: Exclude<FixtureMode, 'live'>;
  persist: FixtureMode | undefined;
  query: StructuredQuery;
  indexVersion: string;
}): Promise<Response> {
  const { body, mode, persist, query, indexVersion } = params;

  if (mode === 'fixtures-error') {
    const response = NextResponse.json(
      {
        error: 'FIXTURE_ERROR',
        message: 'Fixture mode requested an error response for structured search.',
      },
      { status: 503 },
    );
    applyFixtureModeCookie(response, persist);
    return response;
  }

  const fixtureResult = buildFixtureResponse(body, mode);
  await logZeroHitsForResult({
    result: fixtureResult,
    query,
    indexVersion,
    options: { skipLog: true, skipPersistence: true, skipWebhook: true },
  });
  const response = NextResponse.json(fixtureResult);
  applyFixtureModeCookie(response, persist);
  return response;
}

export async function handleStructuredSearchRequest(params: {
  req: NextRequest;
  body: SearchStructuredRequest;
  query: StructuredQuery;
  indexVersion: string;
}): Promise<Response> {
  const { req, body, query, indexVersion } = params;
  const { mode, persist } = resolveFixtureModeFromRequest(req);

  if (mode !== 'live') {
    return handleFixtureModeRequest({ body, mode, persist, query, indexVersion });
  }

  const result = await resolveSearchResponse({ body, query, req, indexVersion });
  await logZeroHitsForResult({ result, query, indexVersion });
  const response = NextResponse.json(result);
  applyFixtureModeCookie(response, persist);
  return response;
}
