'use client';

import type { JSX, FormEvent, FormEventHandler, Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo, useState } from 'react';
import styledComponents from 'styled-components';
import { PrimarySubmitButton } from './client/SearchPageClient.styles';
import type { NaturalBody, NaturalScopeChoice } from './NaturalSearch.types';
import {
  QueryField,
  ScopeField,
  SizeField,
  NaturalScopeGuidance,
  NaturalFilterFields,
  computeFilterVisibility,
  createStructuredPatchUpdater,
} from './NaturalSearchFields';
import { normaliseNaturalRequest, submitNaturalSearchRequest } from './NaturalSearch.helpers';

function NaturalSearchForm({
  nl,
  setNl,
  onSubmit,
}: {
  nl: NaturalBody;
  setNl: Dispatch<SetStateAction<NaturalBody>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}): JSX.Element {
  const scope: NaturalScopeChoice = nl.scope ?? 'auto';
  const visibility = useMemo(() => computeFilterVisibility(scope), [scope]);
  const handleStructuredPatch = useMemo(() => createStructuredPatchUpdater(setNl), [setNl]);

  return (
    <NaturalFormContainer id="nl-panel" role="tabpanel" aria-labelledby="nl-tab">
      <StyledNaturalForm data-testid="natural-search-form" onSubmit={onSubmit}>
        <QueryField nl={nl} setNl={setNl} />
        <ScopeField nl={nl} setNl={setNl} />
        <NaturalScopeGuidance scope={scope} />
        <NaturalFilterFields
          nl={nl}
          visibility={visibility}
          onStructuredChange={handleStructuredPatch}
        />
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
  const [nl, setNl] = useState<NaturalBody>({ q: '', size: 10 });

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      onError(null);
      onResults([]);
      try {
        const requestBody = normaliseNaturalRequest(nl);
        const results = await submitNaturalSearchRequest(requestBody);
        onResults(results);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [nl, onError, onResults, setLoading],
  );

  return (
    <NaturalSearchForm
      nl={nl}
      setNl={setNl}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    />
  );
}

const NaturalFormContainer = styledComponents('div')`
  display: grid;
  width: 100%;
  min-inline-size: 0;
`;

const StyledNaturalForm = styledComponents('form')`
  display: grid;
  gap: var(--app-gap-cluster);
  width: 100%;
`;
