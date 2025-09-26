'use client';

import type { JSX, FormEvent } from 'react';
import { OakBox } from '@oaknational/oak-components';
import type { StructuredBody } from './structured-search.shared';
import {
  ScopeField,
  QueryField,
  SubjectField,
  KeyStageField,
  MinLessonsField,
  SizeField,
} from './structured-fields';
import { useStructuredSearchHandlers } from './StructuredSearchClient.hooks';
import { PrimarySubmitButton } from './client/SearchPageClient.styles';
import styledComponents from 'styled-components';

export default function StructuredSearchClient(props: {
  action: (input: StructuredBody) => Promise<{ result: unknown | null; error?: string }>;
  onResultsAction: (result: unknown | null) => void;
  onErrorAction: (message: string | null) => void;
  setLoadingAction: (isLoading: boolean) => void;
  onScopeChange?: (scope: StructuredBody['scope']) => void;
  onSubmitPayload?: (payload: StructuredBody) => void;
}): JSX.Element {
  const { model, pending, handleChange, handleSubmit } = useStructuredSearchHandlers(props);

  return (
    <StructuredForm
      model={model}
      onChange={handleChange}
      onSubmit={() => {
        handleSubmit();
      }}
      disabled={pending}
    />
  );
}

function StructuredForm({
  model,
  onChange,
  onSubmit,
  disabled,
}: {
  model: StructuredBody;
  onChange: (patch: Partial<StructuredBody>) => void;
  onSubmit: (ev: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <StructuredFormContainer id="structured-panel" role="tabpanel" aria-labelledby="structured-tab">
      <StyledForm
        data-testid="structured-search-form"
        onSubmit={(ev: FormEvent<HTMLFormElement>) => {
          ev.preventDefault();
          onSubmit(ev);
        }}
      >
        <ScopeField value={model.scope} onChange={onChange} />
        <QueryField value={model.text} onChange={onChange} />
        <SubjectField value={model.subject ?? ''} onChange={onChange} />
        <KeyStageField value={model.keyStage ?? ''} onChange={onChange} />
        <MinLessonsField value={model.minLessons ?? 0} onChange={onChange} />
        <SizeField value={model.size ?? 10} onChange={onChange} />

        <PrimarySubmitButton type="submit" disabled={disabled}>
          Search
        </PrimarySubmitButton>
      </StyledForm>
    </StructuredFormContainer>
  );
}

const StructuredFormContainer = styledComponents(OakBox)`
  display: grid;
  width: 100%;
  min-inline-size: 0;
`;

const StyledForm = styledComponents('form')`
  display: grid;
  gap: var(--app-gap-cluster);
  width: 100%;
`;
