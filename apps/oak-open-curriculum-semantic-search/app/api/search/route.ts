import { type NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { isKeyStage, isSubject } from '../../../src/adapters/sdk-guards';
import type {
  StructuredQuery,
  HybridSearchResult,
  MultiScopeHybridResult,
} from '../../../src/lib/run-hybrid-search';
import { runHybridSearch, runHybridSearchAllScopes } from '../../../src/lib/run-hybrid-search';
import { SearchRequest, SuggestionResponseSchema } from '../../ui/structured-search.shared';
import type { StructuredBody, SuggestionItem } from '../../ui/structured-search.shared';
import { logZeroHit } from '../../../src/lib/observability/zero-hit';
import { resolveFixtureModeFromRequest, applyFixtureModeCookie } from '../../lib/fixture-mode';
import { buildFixtureForScope } from '../../ui/search-fixtures/builders';
import { MULTI_SCOPE, DEFAULT_NARROW_SCOPE, SEQUENCES_SCOPE } from '../../../src/lib/search-scopes';
import { isSearchScope } from '../../../src/types/oak';

type StructuredSearchBody = StructuredBody;
type MultiScopeResponse = MultiScopeHybridResult & { suggestions?: SuggestionItem[] };
type FixtureResponse = ReturnType<typeof buildFixtureForScope>;
type SearchResponsePayload = HybridSearchResult | MultiScopeResponse | FixtureResponse;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = SearchRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;
  const query = buildStructuredQuery(body);
  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';
  const { mode, persist } = resolveFixtureModeFromRequest(req);

  const result: SearchResponsePayload =
    mode === 'fixtures'
      ? buildFixtureResponse(body)
      : await resolveSearchResponse({ body, query, req, indexVersion });

  await logZeroHitsForResult({ result, query, indexVersion });
  const response = NextResponse.json(result);
  applyFixtureModeCookie(response, persist);
  return response;
}

function buildStructuredQuery(body: StructuredSearchBody): StructuredQuery {
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

async function resolveSearchResponse(params: {
  body: StructuredSearchBody;
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

function buildMultiScopeInput(query: StructuredQuery): Omit<StructuredQuery, 'scope'> {
  const { scope: _scope, ...rest } = query;
  void _scope;
  return rest;
}

function createCachedRunner(indexVersion: string, query: StructuredQuery) {
  const cacheKey = JSON.stringify({ v: indexVersion, q: query });
  return unstable_cache(async (payload: StructuredQuery) => runHybridSearch(payload), [cacheKey], {
    tags: ['search-structured', `index:${indexVersion}`],
  });
}

async function fetchAllScopeSuggestions(
  req: NextRequest,
  body: StructuredSearchBody,
  query: StructuredQuery,
): Promise<SuggestionItem[]> {
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
  const parsedSuggestions = SuggestionResponseSchema.safeParse(suggestionJson);
  return parsedSuggestions.success ? parsedSuggestions.data.suggestions : [];
}

async function logZeroHitsForResult(params: {
  result: SearchResponsePayload;
  query: StructuredQuery;
  indexVersion: string;
}): Promise<void> {
  const { result, query, indexVersion } = params;
  const common = {
    text: query.text,
    subject: query.subject,
    keyStage: query.keyStage,
    indexVersion,
    webhookUrl: process.env.ZERO_HIT_WEBHOOK_URL,
  } as const;

  if (isMultiScopePayload(result)) {
    for (const bucket of result.buckets) {
      await logZeroHit({
        ...common,
        total: bucket.result.total,
        scope: bucket.scope,
        phaseSlug: bucket.scope === SEQUENCES_SCOPE ? query.phaseSlug : undefined,
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

function buildFixtureResponse(body: StructuredSearchBody): FixtureResponse {
  return buildFixtureForScope(body.scope);
}

function isMultiScopePayload(value: SearchResponsePayload): value is MultiScopeResponse {
  return value.scope === MULTI_SCOPE && 'buckets' in value;
}
