import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseQuery } from '../../../../src/lib/query-parser';
import { llmEnabled } from '../../../../src/lib/env';
import { runHybridSearch, type StructuredQuery } from '../../../../src/lib/run-hybrid-search';

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
  if (!body.success)
    return NextResponse.json({ error: z.treeifyError(body.error) }, { status: 400 });

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

  const out = await runHybridSearch(structured);
  return NextResponse.json({ derived: structured, results: out.results });
}
