'use client';

import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

export type SearchController = {
  results: unknown[];
  facets: unknown | null;
  meta: { scope?: string; total?: number } | null;
  error: string | null;
  loading: boolean;
  onStart: () => void;
  onSuccess: (payload: unknown | null) => void;
  onError: (message: string) => void;
};

const FacetUnitSchema = z.object({ unitSlug: z.string(), unitTitle: z.string() });
const FacetSequenceSchema = z
  .object({
    sequenceSlug: z.string(),
    keyStage: z.string(),
    years: z.array(z.string()).default([]),
    units: z.array(FacetUnitSchema).default([]),
    unitCount: z.number().optional(),
    lessonCount: z.number().optional(),
  })
  .catchall(z.unknown());
const FacetsSchema = z
  .object({ sequences: z.array(FacetSequenceSchema).default([]) })
  .catchall(z.unknown());

const HybridPayloadSchema = z
  .object({
    results: z.array(z.unknown()).default([]),
    facets: FacetsSchema.optional(),
    scope: z.string().optional(),
    total: z.number().optional(),
  })
  .catchall(z.unknown());

interface ParsedHybridPayload {
  results: unknown[];
  facets: unknown | null;
  meta: { scope?: string; total?: number } | null;
}

function parseHybridPayload(payload: unknown | null): ParsedHybridPayload | null {
  if (!payload) {
    return null;
  }
  const parsed = HybridPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return null;
  }
  const data = parsed.data;
  return {
    results: data.results,
    facets: data.facets ?? null,
    meta: data.scope || data.total !== undefined ? { scope: data.scope, total: data.total } : null,
  };
}

export function useSearchController(): SearchController {
  const [results, setResults] = useState<unknown[]>([]);
  const [facets, setFacets] = useState<unknown | null>(null);
  const [meta, setMeta] = useState<{ scope?: string; total?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onStart = useCallback(() => {
    setLoading(true);
    setError(null);
    setResults([]);
    setFacets(null);
    setMeta(null);
  }, []);

  const onSuccess = useCallback((payload: unknown | null) => {
    const parsed = parseHybridPayload(payload);
    if (parsed) {
      setResults(parsed.results);
      setFacets(parsed.facets);
      setMeta(parsed.meta);
      setLoading(false);
      return;
    }

    if (Array.isArray(payload)) {
      setResults(payload);
      setFacets(null);
      setMeta(null);
      setLoading(false);
      return;
    }

    setResults([]);
    setFacets(null);
    setMeta(null);
    setLoading(false);
  }, []);

  const onError = useCallback((message: string) => {
    setError(message);
    setLoading(false);
  }, []);

  return useMemo(
    () => ({ results, facets, meta, error, loading, onStart, onSuccess, onError }),
    [results, facets, meta, error, loading, onStart, onSuccess, onError],
  );
}
