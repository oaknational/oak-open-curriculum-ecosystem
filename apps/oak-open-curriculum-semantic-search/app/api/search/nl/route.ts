import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseQuery } from '../../../../src/lib/query-parser';
import { llmEnabled } from '../../../../src/lib/env';
import type { StructuredQuery } from '../../../../src/lib/run-hybrid-search';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';

type NaturalStructuredPayload = Omit<StructuredQuery, 'scope'> & {
  scope: StructuredQuery['scope'] | 'all';
};

const BodySchema = z.object({
  q: z.string().min(1),
  scope: z.enum(['units', 'lessons', 'sequences', 'all']).optional(),
  size: z.number().int().min(1).max(100).optional(),
  includeFacets: z.boolean().optional(),
  phaseSlug: z.string().optional(),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().min(0).optional(),
});

type NaturalRequestBody = z.infer<typeof BodySchema>;

export async function POST(req: NextRequest): Promise<Response> {
  if (!llmEnabled()) {
    return renderLlmDisabled();
  }

  const parsedBody = BodySchema.safeParse(await req.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: z.treeifyError(parsedBody.error) }, { status: 400 });
  }

  const requestPayload = await buildNaturalPayload(parsedBody.data);
  const response = await forwardStructuredSearch(req, requestPayload);
  const bodyJson: unknown = await response.json();
  return NextResponse.json(bodyJson, { status: response.status });
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
    includeFacets: body.includeFacets ?? true,
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
