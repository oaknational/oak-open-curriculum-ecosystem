import { type NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { isKeyStage, isSubject } from '../../../src/adapters/sdk-guards';
import type { StructuredQuery } from '../../../src/lib/run-hybrid-search';
import { runHybridSearch } from '../../../src/lib/run-hybrid-search';

const StructuredSchema = z.object({
  scope: z.enum(['units', 'lessons']),
  text: z.string().min(1),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().min(0).optional(),
  size: z.number().int().min(1).max(100).optional(),
  from: z.number().int().min(0).optional(),
  highlight: z.boolean().optional(),
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = StructuredSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });

  const b = parsed.data;
  const subject = b.subject && isSubject(b.subject) ? b.subject : undefined;
  const keyStage = b.keyStage && isKeyStage(b.keyStage) ? b.keyStage : undefined;

  const q: StructuredQuery = {
    scope: b.scope,
    text: b.text,
    subject,
    keyStage,
    minLessons: b.minLessons,
    size: b.size,
    from: b.from,
    highlight: b.highlight,
  };

  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';
  const cacheKey = JSON.stringify({ v: indexVersion, q });

  const getCached = unstable_cache(
    async (payload: StructuredQuery) => runHybridSearch(payload),
    [cacheKey],
    { tags: ['search-structured', `index:${indexVersion}`] },
  );

  const out = await getCached(q);
  return NextResponse.json({ results: out.results });
}
