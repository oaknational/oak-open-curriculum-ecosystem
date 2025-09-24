import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';
import { runSuggestions } from '../../../../src/lib/suggestions';
import type { SuggestQuery } from '../../../../src/lib/suggestions/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(_req: NextRequest): Promise<Response> {
  const parsed = SuggestBodySchema.safeParse(await _req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
  }

  const prefix = parsed.data.prefix.trim();
  if (prefix.length === 0) {
    return NextResponse.json({ error: 'PREFIX_REQUIRED' }, { status: 400 });
  }

  const subject =
    parsed.data.subject && isSubject(parsed.data.subject) ? parsed.data.subject : undefined;
  const keyStage =
    parsed.data.keyStage && isKeyStage(parsed.data.keyStage) ? parsed.data.keyStage : undefined;

  const query: SuggestQuery = {
    prefix,
    scope: parsed.data.scope,
    subject,
    keyStage,
    phaseSlug: parsed.data.phaseSlug,
    limit: parsed.data.limit,
  };

  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';
  const cacheKey = JSON.stringify({ v: indexVersion, q: query });
  const fetchCached = unstable_cache(
    async (payload: SuggestQuery) => runSuggestions(payload),
    [cacheKey],
    { tags: ['search-suggest', `index:${indexVersion}`] },
  );

  const result = await fetchCached(query);
  return NextResponse.json(result);
}

const SuggestBodySchema = z.object({
  prefix: z.string().min(1),
  scope: z.enum(['lessons', 'units', 'sequences']),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  phaseSlug: z.string().optional(),
  limit: z.number().int().min(1).max(20).optional(),
});
