'use server';

import { z } from 'zod';
import { SearchRequest, buildBody, baseUrl, safeJsonParse } from './structured-search.shared';

export async function searchAction(
  req: z.infer<typeof SearchRequest>,
): Promise<{ results: unknown[]; error?: string }> {
  const input = SearchRequest.parse(req);
  const body = buildBody(input);

  const url = new URL('/api/search', baseUrl()).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    // Allow Next to cache/optimize if appropriate; this is a manual call
    cache: 'no-store',
  });
  const txt = await res.text();
  const Resp = z
    .object({ results: z.array(z.unknown()).default([]), error: z.string().optional() })
    .loose();
  const parsed = Resp.safeParse(safeJsonParse(txt));
  if (!parsed.success) {
    return { results: [], error: res.ok ? undefined : 'Search failed' };
  }
  const data = parsed.data;
  if (!res.ok && data.error) {
    return { results: [], error: data.error };
  }
  return { results: data.results };
}
