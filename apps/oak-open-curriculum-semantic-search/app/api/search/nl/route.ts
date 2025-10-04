import { type NextRequest, NextResponse } from 'next/server';
import { parseQuery } from '../../../../src/lib/query-parser';
import { llmEnabled, optionalEnv } from '../../../../src/lib/env';
import type { StructuredQuery } from '../../../../src/lib/run-hybrid-search';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';
import {
  DEFAULT_INCLUDE_FACETS,
  SearchNaturalLanguageRequestSchema,
  type SearchNaturalLanguageRequest,
  type SearchScopeWithAll,
  type SearchStructuredRequest,
} from '@oaknational/oak-curriculum-sdk';
import {
  resolveFixtureModeFromRequest,
  applyFixtureModeCookie,
  type FixtureMode,
} from '../../../lib/fixture-mode';
import { buildSingleScopeFixture, buildEmptyFixture } from '../../../lib/search-fixtures/builders';
import { LESSONS_SCOPE, UNITS_SCOPE } from '../../../../src/lib/search-scopes';
import { logZeroHit } from '../../../../src/lib/observability/zero-hit';

type NaturalStructuredPayload = SearchStructuredRequest;

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
  return handleNaturalSearchRequest({ req, requestPayload, prompt: parsedBody.data.q });
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

function buildNaturalFixture(mode: FixtureMode) {
  if (mode === 'fixtures-empty') {
    return buildEmptyFixture({ scope: LESSONS_SCOPE });
  }
  return buildSingleScopeFixture();
}

async function handleNaturalSearchRequest(params: {
  req: NextRequest;
  requestPayload: NaturalStructuredPayload;
  prompt: string;
}): Promise<Response> {
  const { req, requestPayload, prompt } = params;
  const { mode, persist } = resolveFixtureModeFromRequest(req);

  if (mode !== 'live') {
    return handleNaturalFixtureRequest({ mode, persist, prompt, requestPayload });
  }

  const response = await forwardStructuredSearch(req, requestPayload);
  const text = await response.text();
  const bodyJson = safeJsonParse(text);

  if (!response.ok || !bodyJson) {
    const errorPayload = bodyJson ?? { error: 'Search failed' };
    const errorResponse = NextResponse.json(errorPayload, { status: response.status });
    applyFixtureModeCookie(errorResponse, persist);
    return errorResponse;
  }

  const nextResponse = NextResponse.json(
    {
      result: bodyJson,
      summary: {
        prompt,
        structured: requestPayload,
      },
    },
    { status: response.status },
  );
  applyFixtureModeCookie(nextResponse, persist);
  return nextResponse;
}

async function handleNaturalFixtureRequest(params: {
  mode: FixtureMode;
  persist: FixtureMode | undefined;
  prompt: string;
  requestPayload: NaturalStructuredPayload;
}): Promise<Response> {
  const { mode, persist, prompt, requestPayload } = params;

  if (mode === 'fixtures-error') {
    return buildNaturalFixtureErrorResponse(persist);
  }

  const lessonsFixture = buildNaturalFixture(mode);
  const response = buildNaturalFixtureSuccessResponse({ prompt, requestPayload, lessonsFixture });
  if (lessonsFixture.total === 0) {
    await logZeroHitForFixture({ requestPayload, lessonsFixture });
  }
  applyFixtureModeCookie(response, persist);
  return response;
}

function buildNaturalFixtureErrorResponse(persist: FixtureMode | undefined): NextResponse {
  const response = NextResponse.json(
    {
      error: 'FIXTURE_ERROR',
      message: 'Fixture mode requested an error response for natural-language search.',
    },
    { status: 503 },
  );
  applyFixtureModeCookie(response, persist);
  return response;
}

function buildNaturalFixtureSuccessResponse({
  prompt,
  requestPayload,
  lessonsFixture,
}: {
  prompt: string;
  requestPayload: NaturalStructuredPayload;
  lessonsFixture: ReturnType<typeof buildNaturalFixture>;
}): NextResponse {
  return NextResponse.json({
    result: {
      scope: lessonsFixture.scope,
      results: lessonsFixture.results,
      total: lessonsFixture.total,
      took: lessonsFixture.took,
      timedOut: lessonsFixture.timedOut,
      aggregations: lessonsFixture.aggregations,
      facets: lessonsFixture.facets,
      suggestions: lessonsFixture.suggestions,
      suggestionCache: lessonsFixture.suggestionCache,
    },
    summary: {
      prompt,
      structured: requestPayload,
    },
  });
}

async function logZeroHitForFixture({
  requestPayload,
  lessonsFixture,
}: {
  requestPayload: NaturalStructuredPayload;
  lessonsFixture: ReturnType<typeof buildNaturalFixture>;
}): Promise<void> {
  const indexVersion = optionalEnv()?.SEARCH_INDEX_VERSION ?? 'v1';
  await logZeroHit({
    total: lessonsFixture.total,
    scope: lessonsFixture.scope,
    text: requestPayload.text,
    subject: requestPayload.subject,
    keyStage: requestPayload.keyStage,
    phaseSlug: requestPayload.phaseSlug,
    indexVersion,
    skipLog: true,
    skipPersistence: true,
    skipWebhook: true,
  });
}

async function buildNaturalPayload(body: NaturalRequestBody): Promise<NaturalStructuredPayload> {
  const parsed = await parseQuery(body.q);
  const intent = parsed.intent === LESSONS_SCOPE ? LESSONS_SCOPE : UNITS_SCOPE;

  return {
    scope: resolveScope(body.scope, intent),
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

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function resolveScope(
  provided: NaturalRequestBody['scope'],
  inferred: typeof LESSONS_SCOPE | typeof UNITS_SCOPE,
): SearchScopeWithAll {
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
