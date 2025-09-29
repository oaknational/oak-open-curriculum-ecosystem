import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';
import { runSuggestions } from '../../../../src/lib/suggestions';
import type { SuggestQuery } from '../../../../src/lib/suggestions/types';
import {
  SearchSuggestionRequestSchema,
  SearchSuggestionResponseSchema,
  DEFAULT_SUGGESTION_CACHE,
  type SearchSuggestionRequest,
  type SearchSuggestionResponse,
} from '../../../../src/types/oak';
import { resolveFixtureModeFromRequest, applyFixtureModeCookie } from '../../../lib/fixture-mode';
import { buildSingleScopeFixture } from '../../../ui/search-fixtures/builders';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = SearchSuggestionRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trimmedPrefix = parsed.data.prefix.trim();
  if (trimmedPrefix.length === 0) {
    return NextResponse.json({ error: 'PREFIX_REQUIRED' }, { status: 400 });
  }

  const { mode, persist } = resolveFixtureModeFromRequest(req);
  const payload =
    mode === 'fixtures'
      ? buildFixtureSuggestions(parsed.data)
      : await fetchSuggestionsFromIndex({ request: parsed.data, prefix: trimmedPrefix });

  const response = NextResponse.json(payload);
  applyFixtureModeCookie(response, persist);
  return response;
}

function buildFixtureSuggestions(request: SearchSuggestionRequest): SearchSuggestionResponse {
  const baseFixture = buildSingleScopeFixture();
  const suggestions = (baseFixture.suggestions ?? []).filter(
    (item) => item.scope === request.scope,
  );
  const limit = typeof request.limit === 'number' ? request.limit : suggestions.length;
  const limited = suggestions.slice(0, limit);

  return SearchSuggestionResponseSchema.parse({
    suggestions: limited,
    cache: baseFixture.suggestionCache ?? DEFAULT_SUGGESTION_CACHE,
  });
}

async function fetchSuggestionsFromIndex(params: {
  request: SearchSuggestionRequest;
  prefix: string;
}): Promise<SearchSuggestionResponse> {
  const { request, prefix } = params;
  const query = normaliseSuggestQuery(request, prefix);
  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';
  const cacheKey = JSON.stringify({ v: indexVersion, q: query });
  const fetchCached = unstable_cache(
    async (payload: SuggestQuery) => runSuggestions(payload),
    [cacheKey],
    { tags: ['search-suggest', `index:${indexVersion}`] },
  );

  const result = await fetchCached(query);
  return SearchSuggestionResponseSchema.parse(result);
}

function normaliseSuggestQuery(request: SearchSuggestionRequest, prefix: string): SuggestQuery {
  const subject = request.subject && isSubject(request.subject) ? request.subject : undefined;
  const keyStage = request.keyStage && isKeyStage(request.keyStage) ? request.keyStage : undefined;

  return {
    prefix,
    scope: request.scope,
    subject,
    keyStage,
    phaseSlug: request.phaseSlug,
    limit: request.limit,
  };
}
