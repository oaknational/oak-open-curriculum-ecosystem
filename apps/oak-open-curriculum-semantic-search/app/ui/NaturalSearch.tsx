'use client';

import type { JSX, FormEventHandler, Dispatch, SetStateAction } from 'react';
import sc from 'styled-components';
import { useState } from 'react';
import { z } from 'zod';

const ApiResponseSchema = z
  .object({
    results: z.array(z.unknown()).default([]),
    error: z.string().optional(),
  })
  .loose();

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseResponse(resOk: boolean, txt: string): { error: string | null; results: unknown[] } {
  const parsed = safeJsonParse(txt);
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

function QueryField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
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
  );
}

function ScopeField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
    <label>
      Scope
      <select
        value={nl.scope}
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'units' || v === 'lessons') setNl((s) => ({ ...s, scope: v }));
        }}
      >
        <option value="units">Units</option>
        <option value="lessons">Lessons</option>
      </select>
    </label>
  );
}

function SizeField({
  nl,
  setNl,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
}): JSX.Element {
  return (
    <label>
      Size
      <input
        type="number"
        min={1}
        max={100}
        value={nl.size ?? 10}
        onChange={(e) => {
          const n = Number(e.target.value);
          setNl((s) => ({ ...s, size: Number.isFinite(n) && n > 0 ? n : s.size }));
        }}
      />
    </label>
  );
}

const FormGrid = sc.form`
  display: grid;
  gap: ${(p) => p.theme.app.space.sm};
`;

function NaturalSearchForm({
  nl,
  setNl,
  onSubmit,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}): JSX.Element {
  return (
    <FormGrid onSubmit={onSubmit} id="nl-panel" role="tabpanel" aria-labelledby="nl-tab">
      <QueryField nl={nl} setNl={setNl} />
      <ScopeField nl={nl} setNl={setNl} />
      <SizeField nl={nl} setNl={setNl} />
      <button type="submit">Search</button>
    </FormGrid>
  );
}

export default function NaturalSearchComponent({
  onResults,
  onError,
  setLoading,
}: {
  onResults: Dispatch<SetStateAction<unknown[]>>;
  onError: Dispatch<SetStateAction<string | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
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
    <NaturalSearchForm
      nl={nl}
      setNl={setNl}
      onSubmit={(ev) => {
        void onSubmit(ev);
      }}
    />
  );
}
