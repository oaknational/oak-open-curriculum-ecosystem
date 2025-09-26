'use client';

import type { JSX, FormEventHandler, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { OakBox, OakRadioButton, OakRadioGroup } from '@oaknational/oak-components';
import { LabeledInput } from './fields';
import { PrimarySubmitButton } from './client/SearchPageClient.styles';
import styledComponents from 'styled-components';

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
  if (!safe.success) {
    return { error: resOk ? null : 'Search failed', results: [] };
  }
  const data = safe.data;
  if (!resOk && data.error) {
    return { error: data.error, results: [] };
  }
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
    <LabeledInput
      label="Query"
      id="natural-query"
      type="text"
      value={nl.q}
      required
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setNl((state) => ({ ...state, q: next }));
      }}
    />
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
    <OakRadioGroup
      name="natural-scope"
      label="Scope"
      value={nl.scope ?? 'units'}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === 'units' || value === 'lessons') {
          setNl((state) => ({ ...state, scope: value }));
        }
      }}
      $gap="space-between-xs"
    >
      <OakRadioButton id="natural-scope-units" value="units" label="Units" />
      <OakRadioButton id="natural-scope-lessons" value="lessons" label="Lessons" />
    </OakRadioGroup>
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
    <LabeledInput
      label="Size"
      id="natural-size"
      type="number"
      value={nl.size ?? 10}
      min={1}
      max={100}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const n = Number(event.target.value);
        setNl((state) => ({ ...state, size: Number.isFinite(n) && n > 0 ? n : state.size }));
      }}
    />
  );
}

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
    <NaturalFormContainer id="nl-panel" role="tabpanel" aria-labelledby="nl-tab">
      <StyledNaturalForm data-testid="natural-search-form" onSubmit={onSubmit}>
        <QueryField nl={nl} setNl={setNl} />
        <ScopeField nl={nl} setNl={setNl} />
        <SizeField nl={nl} setNl={setNl} />
        <PrimarySubmitButton type="submit">Search</PrimarySubmitButton>
      </StyledNaturalForm>
    </NaturalFormContainer>
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
      if (error) {
        throw new Error(error);
      }
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

const NaturalFormContainer = styledComponents(OakBox)`
  display: grid;
`;

const StyledNaturalForm = styledComponents('form')`
  display: grid;
  gap: var(--app-gap-cluster);
`;
