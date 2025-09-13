'use client';

import type { JSX, FormEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import {
  ScopeField,
  QueryField,
  SubjectField,
  KeyStageField,
  MinLessonsField,
  SizeField,
} from './structured-fields';
import { z } from 'zod';

export interface StructuredBody {
  scope: 'units' | 'lessons';
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildStructuredBody(s: StructuredBody): StructuredBody {
  return {
    scope: s.scope,
    text: s.text,
    subject: s.subject || undefined,
    keyStage: s.keyStage || undefined,
    minLessons: s.minLessons && s.minLessons > 0 ? s.minLessons : undefined,
    size: s.size && s.size > 0 ? s.size : undefined,
  };
}

function parseStructuredResponse(
  ok: boolean,
  txt: string,
): { error: string | null; results: unknown[] } {
  const Resp = z
    .object({ results: z.array(z.unknown()).default([]), error: z.string().optional() })
    .loose();
  const parsed = safeJsonParse(txt);
  const safe = Resp.safeParse(parsed);
  if (!safe.success) return { error: ok ? null : 'Search failed', results: [] };
  const data = safe.data;
  if (!ok && data.error) return { error: data.error, results: [] };
  return { error: null, results: data.results };
}

function StructuredForm({
  model,
  onChange,
  onSubmit,
}: {
  model: StructuredBody;
  onChange: (patch: Partial<StructuredBody>) => void;
  onSubmit: (ev: FormEvent<HTMLFormElement>) => void;
}): JSX.Element {
  return (
    <form
      onSubmit={(ev) => {
        onSubmit(ev);
      }}
      style={{ display: 'grid', gap: '0.5rem' }}
      id="structured-panel"
      role="tabpanel"
      aria-labelledby="structured-tab"
    >
      <ScopeField value={model.scope} onChange={onChange} />
      <QueryField value={model.text} onChange={onChange} />
      <SubjectField value={model.subject ?? ''} onChange={onChange} />
      <KeyStageField value={model.keyStage ?? ''} onChange={onChange} />
      <MinLessonsField value={model.minLessons ?? 0} onChange={onChange} />
      <SizeField value={model.size ?? 10} onChange={onChange} />

      <button type="submit">Search</button>
    </form>
  );
}

const PopulatedStructuredForm = ({
  structured,
  setStructured,
  onSubmit,
}: {
  structured: StructuredBody;
  setStructured: Dispatch<SetStateAction<StructuredBody>>;
  onSubmit: (ev: FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <StructuredForm
      model={structured}
      onChange={(patch) => setStructured((s) => ({ ...s, ...patch }))}
      onSubmit={(ev) => {
        void onSubmit(ev);
      }}
    />
  );
};

function StructuredSearchInner({
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

  async function onSubmit(ev: FormEvent<HTMLFormElement>): Promise<void> {
    ev.preventDefault();
    setLoading(true);
    onError(null);
    onResults([]);
    try {
      const body = buildStructuredBody(structured);
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const txt = await res.text();
      const { error, results } = parseStructuredResponse(res.ok, txt);
      if (error) throw new Error(error);
      onResults(results);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PopulatedStructuredForm
      structured={structured}
      setStructured={setStructured}
      onSubmit={onSubmit}
    />
  );
}

export function StructuredSearch(props: {
  onResults: (results: unknown[]) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}): JSX.Element {
  return <StructuredSearchInner {...props} />;
}

export default StructuredSearch;
