'use client';

import type { FormEvent, JSX } from 'react';
import { useCallback, useMemo, useState } from 'react';
import styledComponents from 'styled-components';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import { PrimarySubmitButton } from './client/SearchFormControls.styles';
import { normaliseNaturalRequest, submitNaturalSearchRequest } from './NaturalSearch.helpers';
import type { StructuredBody } from './structured-search.shared';
import { SearchStructuredRequestSchema } from '../../src/types/oak';
import { getAppTheme } from './themes/app-theme-helpers';
import type { NaturalSummaryState } from './NaturalSearchSummary';
import { DerivedSummary } from './NaturalSearchSummary';

export default function NaturalSearchComponent({
  onResults,
  onError,
  setLoading,
  onDerivedPayload,
}: {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  onDerivedPayload?: (payload: StructuredBody) => void;
}): JSX.Element {
  const behaviour = useNaturalSearchBehaviour({
    onResults,
    onError,
    setLoading,
    onDerivedPayload,
  });

  return (
    <NaturalFormContainer data-testid="natural-search-container">
      <NaturalSearchForm
        prompt={behaviour.prompt}
        onPromptChange={behaviour.handlePromptChange}
        onSubmit={behaviour.handleSubmit}
      />
      <DerivedSummary summary={behaviour.summary} />
    </NaturalFormContainer>
  );
}

interface UseNaturalSearchArgs {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  onDerivedPayload?: (payload: StructuredBody) => void;
}

interface NaturalSearchBehaviour {
  prompt: string;
  summary: NaturalSummaryState;
  handlePromptChange: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

function useNaturalSearchBehaviour(args: UseNaturalSearchArgs): NaturalSearchBehaviour {
  const { onResults, onError, setLoading, onDerivedPayload } = args;
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState<NaturalSummaryState>(null);

  const handlePromptChange = useCallback((value: string) => {
    setPrompt(value);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      onError(null);
      onResults([]);
      try {
        const requestBody = normaliseNaturalRequest({ q: prompt });
        const { result, summary: derived } = await submitNaturalSearchRequest(requestBody);
        onResults(result);
        setSummary(derived);
        if (onDerivedPayload) {
          const structuredPayload = SearchStructuredRequestSchema.parse(derived.structured);
          onDerivedPayload(structuredPayload);
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [onDerivedPayload, onError, onResults, prompt, setLoading],
  );

  return useMemo(
    () => ({ prompt, summary, handlePromptChange, handleSubmit }),
    [prompt, summary, handlePromptChange, handleSubmit],
  );
}

function NaturalSearchForm({
  prompt,
  onPromptChange,
  onSubmit,
}: {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}): JSX.Element {
  return (
    <StyledNaturalForm
      data-testid="natural-search-form"
      onSubmit={(event) => {
        void onSubmit(event);
      }}
    >
      <OakTypography as="label" htmlFor="natural-query" $font="body-3-bold">
        Describe what you need
      </OakTypography>
      <PromptTextarea
        id="natural-query"
        name="natural-query"
        value={prompt}
        required
        rows={4}
        onChange={(event) => {
          onPromptChange(event.target.value);
        }}
      />
      <PrimarySubmitButton type="submit">Search</PrimarySubmitButton>
    </StyledNaturalForm>
  );
}

const NaturalFormContainer = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  width: 100%;
  min-inline-size: 0;
`;

const StyledNaturalForm = styledComponents('form')`
  display: grid;
  gap: var(--app-gap-cluster);
  width: 100%;
`;

const PromptTextarea = styledComponents.textarea`
  width: 100%;
  min-height: 8rem;
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  border: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderStrong};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
  font: inherit;
`;
