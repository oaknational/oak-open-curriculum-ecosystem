import { type NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { isKeyStage, isSubject } from '../../../src/adapters/sdk-guards';
import type {
  StructuredQuery,
  HybridSearchResult,
  MultiScopeHybridResult,
} from '../../../src/lib/run-hybrid-search';
import { runHybridSearch, runHybridSearchAllScopes } from '../../../src/lib/run-hybrid-search';
import { SuggestionResponseSchema } from '../../ui/structured-search.shared';
import type { SuggestionItem } from '../../ui/structured-search.shared';
import { logZeroHit } from '../../../src/lib/observability/zero-hit';

const StructuredSchema = z.object({
  scope: z.enum(['units', 'lessons', 'sequences', 'all']),
  text: z.string().min(1),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().min(0).optional(),
  size: z.number().int().min(1).max(100).optional(),
  from: z.number().int().min(0).optional(),
  highlight: z.boolean().optional(),
  includeFacets: z.boolean().optional(),
  phaseSlug: z.string().optional(),
});

type StructuredSearchBody = z.infer<typeof StructuredSchema>;
type MultiScopeResponse = MultiScopeHybridResult & { suggestions?: SuggestionItem[] };
type SearchResponsePayload = HybridSearchResult | MultiScopeResponse;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = StructuredSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
  }

  const body = parsed.data;
  const query = buildStructuredQuery(body);
  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';
  const result = await resolveSearchResponse({ body, query, req, indexVersion });
  await logZeroHitsForResult({ result, query, indexVersion });
  return NextResponse.json(result);
}

function buildStructuredQuery(body: StructuredSearchBody): StructuredQuery {
  const subject = body.subject && isSubject(body.subject) ? body.subject : undefined;
  const keyStage = body.keyStage && isKeyStage(body.keyStage) ? body.keyStage : undefined;

  return {
    scope: body.scope === 'all' ? 'lessons' : body.scope,
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

  if (body.scope === 'all') {
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
      scope: 'lessons',
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

  if (result.scope === 'all') {
    for (const bucket of result.buckets) {
      await logZeroHit({
        ...common,
        total: bucket.result.total,
        scope: bucket.scope,
        phaseSlug: bucket.scope === 'sequences' ? query.phaseSlug : undefined,
        took: bucket.result.took,
        timedOut: bucket.result.timedOut,
      });
    }
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
