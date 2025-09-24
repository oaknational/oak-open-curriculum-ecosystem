'use client';

import type { JSX, FormEvent } from 'react';
import { OakBox, OakPrimaryButton } from '@oaknational/oak-components';
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
    <OakBox
      as="form"
      onSubmit={(ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        onSubmit(ev);
      }}
      id="structured-panel"
      role="tabpanel"
      aria-labelledby="structured-tab"
      $display="grid"
      $gap="space-between-sm"
    >
      <ScopeField value={model.scope} onChange={onChange} />
      <QueryField value={model.text} onChange={onChange} />
      <SubjectField value={model.subject ?? ''} onChange={onChange} />
      <KeyStageField value={model.keyStage ?? ''} onChange={onChange} />
      <MinLessonsField value={model.minLessons ?? 0} onChange={onChange} />
      <SizeField value={model.size ?? 10} onChange={onChange} />

      <OakPrimaryButton type="submit" disabled={disabled} element="button">
        Search
      </OakPrimaryButton>
    </OakBox>
  );
}
