'use client';

import type { JSX, FormEvent } from 'react';
import sc from 'styled-components';
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

const FormGrid = sc.form`
  display: grid;
  gap: ${(p) => p.theme.app.space.sm};
`;

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
    <FormGrid
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmit(ev);
      }}
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

      <button type="submit" disabled={disabled}>
        Search
      </button>
    </FormGrid>
  );
}
