import { type NextRequest, NextResponse } from 'next/server';
import { parseQuery } from '../../../../src/lib/query-parser';
import { llmEnabled } from '../../../../src/lib/env';
import type { StructuredQuery } from '../../../../src/lib/run-hybrid-search';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';
import {
  DEFAULT_INCLUDE_FACETS,
  SearchNaturalLanguageRequestSchema,
} from '../../../../src/types/oak';
import type { SearchNaturalLanguageRequest } from '../../../../src/types/oak';
import { resolveFixtureModeFromRequest, applyFixtureModeCookie } from '../../../lib/fixture-mode';
import { buildSingleScopeFixture } from '../../../ui/search-fixtures/builders';

type NaturalStructuredPayload = Omit<StructuredQuery, 'scope'> & {
  scope: StructuredQuery['scope'] | 'all';
};

type NaturalRequestBody = SearchNaturalLanguageRequest;

export async function POST(req: NextRequest): Promise<Response> {
  if (!llmEnabled()) {
    return renderLlmDisabled();
  }

  const parsedBody = SearchNaturalLanguageRequestSchema.safeParse(await req.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
  }

  const requestPayload = await buildNaturalPayload(parsedBody.data);
  const { mode, persist } = resolveFixtureModeFromRequest(req);

  if (mode === 'fixtures') {
    const lessonsFixture = buildSingleScopeFixture();
    const response = NextResponse.json({
      scope: 'lessons',
      results: lessonsFixture.results,
      total: lessonsFixture.total,
      took: lessonsFixture.took,
      timedOut: lessonsFixture.timedOut,
      aggregations: lessonsFixture.aggregations,
      facets: lessonsFixture.facets,
      suggestions: lessonsFixture.suggestions,
      suggestionCache: lessonsFixture.suggestionCache,
    });
    applyFixtureModeCookie(response, persist);
    return response;
  }

  const response = await forwardStructuredSearch(req, requestPayload);
  const bodyJson: unknown = await response.json();
  const nextResponse = NextResponse.json(bodyJson, { status: response.status });
  applyFixtureModeCookie(nextResponse, persist);
  return nextResponse;
}

function renderLlmDisabled(): Response {
  return NextResponse.json(
    {
      error: 'LLM_DISABLED',
      message:
        'Natural-language parsing is disabled on this deployment. Use /api/search with a structured body.',
    },
    { status: 501 },
  );
}

async function buildNaturalPayload(body: NaturalRequestBody): Promise<NaturalStructuredPayload> {
  const parsed = await parseQuery(body.q);

  return {
    scope: resolveScope(body.scope, parsed.intent),
    text: parsed.text.length > 0 ? parsed.text : body.q,
    subject: pickSubject(body.subject, parsed.subject),
    keyStage: pickKeyStage(body.keyStage, parsed.keyStage),
    minLessons: body.minLessons ?? parsed.minLessons,
    size: body.size,
    includeFacets: body.includeFacets ?? DEFAULT_INCLUDE_FACETS,
    phaseSlug: body.phaseSlug,
  } satisfies NaturalStructuredPayload;
}

function forwardStructuredSearch(
  req: NextRequest,
  payload: NaturalStructuredPayload,
): Promise<Response> {
  return fetch(new URL('/api/search', req.url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

function resolveScope(
  provided: NaturalRequestBody['scope'],
  inferred: 'units' | 'lessons',
): NaturalStructuredPayload['scope'] {
  return provided ?? inferred;
}

function pickSubject(
  candidate: string | undefined,
  fallback: StructuredQuery['subject'] | undefined,
): StructuredQuery['subject'] | undefined {
  if (candidate && isSubject(candidate)) {
    return candidate;
  }
  return fallback;
}

function pickKeyStage(
  candidate: string | undefined,
  fallback: StructuredQuery['keyStage'] | undefined,
): StructuredQuery['keyStage'] | undefined {
  if (candidate && isKeyStage(candidate)) {
    return candidate;
  }
  return fallback;
}
