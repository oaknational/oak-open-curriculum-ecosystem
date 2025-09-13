'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { z } from 'zod';

const ApiResponseSchema = z
  .object({
    results: z.array(z.unknown()).default([]),
    error: z.string().optional(),
  })
  .loose();

function parseResponse(resOk: boolean, txt: string): { error: string | null; results: unknown[] } {
  const parsed = (() => {
    try {
      return JSON.parse(txt) as unknown;
    } catch {
      return null as unknown;
    }
  })();
  const safe = ApiResponseSchema.safeParse(parsed);
  if (!safe.success) return { error: resOk ? null : 'Search failed', results: [] };
  const data = safe.data;
  if (!resOk && data.error) return { error: data.error, results: [] };
  return { error: null, results: data.results };
}

export interface NaturalBody {
  q: string;
  scope?: 'units' | 'lessons';
  size?: number;
}

export default function NaturalSearchComponent({
  onResults,
  onError,
  setLoading,
}: {
  onResults: (results: unknown[]) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}): JSX.Element {
  const [nl, setNl] = useState<NaturalBody>({ q: '', scope: 'units', size: 10 });

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>): Promise<void> {
    ev.preventDefault();
    setLoading(true);
    onError(null);
    onResults([]);
    try {
      const body: NaturalBody = {
        q: nl.q,
        scope: nl.scope,
        size: nl.size && nl.size > 0 ? nl.size : undefined,
      };
      const res = await fetch('/api/search/nl', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const txt = await res.text();
      const { error, results } = parseResponse(res.ok, txt);
      if (error) throw new Error(error);
      onResults(results);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(ev) => {
        void onSubmit(ev);
      }}
      style={{ display: 'grid', gap: '0.5rem' }}
      id="nl-panel"
      role="tabpanel"
      aria-labelledby="nl-tab"
    >
      <label>
        Query
        <input
          type="text"
          value={nl.q}
          onChange={(e) => {
            setNl((s) => ({ ...s, q: e.target.value }));
          }}
          required
        />
      </label>

      <label>
        Scope
        <select
          value={nl.scope}
          onChange={(e) => {
            setNl((s) => ({ ...s, scope: e.target.value as 'units' | 'lessons' }));
          }}
        >
          <option value="units">Units</option>
          <option value="lessons">Lessons</option>
        </select>
      </label>

      <label>
        Size
        <input
          type="number"
          min={1}
          max={100}
          value={nl.size ?? 10}
          onChange={(e) => {
            setNl((s) => ({ ...s, size: Number(e.target.value) }));
          }}
        />
      </label>

      <button type="submit">Search</button>
    </form>
  );
}
