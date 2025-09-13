'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { KEY_STAGES, SUBJECTS } from '../../src/adapters/sdk-guards';
import { LabeledInput, LabeledSelect } from './fields';
import { z } from 'zod';

export interface StructuredBody {
  scope: 'units' | 'lessons';
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
}

export function StructuredSearch({
  onResults,
  onError,
  setLoading,
}: {
  onResults: (results: unknown[]) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}): JSX.Element {
  const [structured, setStructured] = useState<StructuredBody>({
    scope: 'units',
    text: '',
    subject: '',
    keyStage: '',
    minLessons: 0,
    size: 10,
  });

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>): Promise<void> {
    ev.preventDefault();
    setLoading(true);
    onError(null);
    onResults([]);
    try {
      const body: StructuredBody = {
        scope: structured.scope,
        text: structured.text,
        subject: structured.subject || undefined,
        keyStage: structured.keyStage || undefined,
        minLessons:
          structured.minLessons && structured.minLessons > 0 ? structured.minLessons : undefined,
        size: structured.size && structured.size > 0 ? structured.size : undefined,
      };
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const txt = await res.text();
      const Resp = z
        .object({ results: z.array(z.unknown()).default([]), error: z.string().optional() })
        .loose();
      const parsed = (() => {
        try {
          return JSON.parse(txt);
        } catch {
          return null;
        }
      })();
      const safe = Resp.safeParse(parsed);
      if (!safe.success) {
        if (!res.ok) throw new Error('Search failed');
        onResults([]);
        return;
      }
      const data = safe.data;
      if (!res.ok && data.error) throw new Error(data.error);
      onResults(data.results);
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
      id="structured-panel"
      role="tabpanel"
      aria-labelledby="structured-tab"
    >
      <LabeledSelect
        label="Scope"
        id="structured-scope"
        value={structured.scope}
        onChange={(v) => {
          if (v === 'units' || v === 'lessons') setStructured((s) => ({ ...s, scope: v }));
        }}
        options={['units', 'lessons']}
      />

      <LabeledInput
        label="Query"
        id="structured-query"
        type="text"
        value={structured.text}
        required
        onChange={(v) => {
          if (typeof v === 'string') setStructured((s) => ({ ...s, text: v }));
        }}
      />

      <LabeledSelect
        label="Subject"
        id="structured-subject"
        value={structured.subject ?? ''}
        onChange={(v) => {
          setStructured((s) => ({ ...s, subject: v }));
        }}
        options={SUBJECTS}
        includeAny
      />

      <LabeledSelect
        label="Key Stage"
        id="structured-ks"
        value={structured.keyStage ?? ''}
        onChange={(v) => {
          setStructured((s) => ({ ...s, keyStage: v }));
        }}
        options={KEY_STAGES}
        includeAny
      />

      <LabeledInput
        label="Minimum lessons (units only)"
        id="structured-minlessons"
        type="number"
        value={structured.minLessons ?? 0}
        min={0}
        onChange={(v) => {
          if (typeof v === 'number') setStructured((s) => ({ ...s, minLessons: v }));
        }}
      />

      <LabeledInput
        label="Size"
        id="structured-size"
        type="number"
        value={structured.size ?? 10}
        min={1}
        max={100}
        onChange={(v) => {
          if (typeof v === 'number') setStructured((s) => ({ ...s, size: v }));
        }}
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default StructuredSearch;
