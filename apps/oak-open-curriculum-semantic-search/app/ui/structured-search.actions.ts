'use server';

import { z } from 'zod';
import { SearchRequest, buildBody, baseUrl, safeJsonParse } from './structured-search.shared';

const FacetUnitSchema = z.object({ unitSlug: z.string(), unitTitle: z.string() });

const FacetSequenceSchema = z
  .object({
    sequenceSlug: z.string(),
    keyStage: z.string(),
    years: z.array(z.string()).default([]),
    units: z.array(FacetUnitSchema).default([]),
    unitCount: z.number().optional(),
    lessonCount: z.number().optional(),
    keyStageTitle: z.string().optional(),
    phaseSlug: z.string().optional(),
    phaseTitle: z.string().optional(),
    hasKs4Options: z.boolean().optional(),
    sequenceUrl: z.string().optional(),
  })
  .catchall(z.unknown());

const FacetsSchema = z
  .object({ sequences: z.array(FacetSequenceSchema).default([]) })
  .catchall(z.unknown());

const StructuredResponseSchema = z
  .object({
    scope: z.enum(['lessons', 'units', 'sequences']),
    results: z.array(z.unknown()).default([]),
    facets: FacetsSchema.optional(),
    total: z.number().optional(),
    error: z.string().optional(),
  })
  .catchall(z.unknown());

export async function searchAction(
  req: z.infer<typeof SearchRequest>,
): Promise<{ result: unknown | null; error?: string }> {
  const input = SearchRequest.parse(req);
  const body = buildBody(input);

  const url = new URL('/api/search', baseUrl()).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const parsed = StructuredResponseSchema.safeParse(safeJsonParse(await res.text()));
  if (!parsed.success) {
    return { result: null, error: res.ok ? undefined : 'Search failed' };
  }

  if (!res.ok && parsed.data.error) {
    return { result: null, error: parsed.data.error };
  }

  return { result: parsed.data };
}
