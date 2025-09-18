import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseQuery } from '../../../../src/lib/query-parser';
import { llmEnabled } from '../../../../src/lib/env';
import type { StructuredQuery } from '../../../../src/lib/run-hybrid-search';

const BodySchema = z.object({
  q: z.string().min(1),
  scope: z.enum(['units', 'lessons']).optional(),
  size: z.number().int().min(1).max(100).optional(),
});

export async function POST(req: NextRequest): Promise<Response> {
  if (!llmEnabled()) {
    return NextResponse.json(
      {
        error: 'LLM_DISABLED',
        message:
          'Natural-language parsing is disabled on this deployment. Use /api/search with a structured body.',
      },
      { status: 501 },
    );
  }

  const body = BodySchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: z.treeifyError(body.error) }, { status: 400 });
  }

  const { q, scope, size } = body.data;
  const parsed = await parseQuery(q);

  const structured: StructuredQuery = {
    scope: scope ?? parsed.intent,
    text: parsed.text.length > 0 ? parsed.text : q,
    subject: parsed.subject,
    keyStage: parsed.keyStage,
    minLessons: parsed.minLessons,
    size,
  };

  // Delegate to structured endpoint to share the Data Cache and response shape
  const res = await fetch(new URL('/api/search', req.url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(structured),
    // Do not set cache hints here; structured route owns caching
  });
  const json: unknown = await res.json();
  return NextResponse.json(json, { status: res.status });
}
