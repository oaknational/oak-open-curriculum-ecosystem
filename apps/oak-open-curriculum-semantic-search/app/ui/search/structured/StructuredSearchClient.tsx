'use client';

import type { JSX, FormEvent } from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';
import {
  ScopeField,
  QueryField,
  SubjectField,
  KeyStageField,
  PhaseField,
  MinLessonsField,
  SizeField,
} from './structured-fields';
import { Fragment } from 'react';
import { useStructuredSearchHandlers } from './StructuredSearchClient.hooks';
import { PrimarySubmitButton } from '../components/SearchFormControls.styles';
import styledComponents from 'styled-components';
import {
  MULTI_SCOPE,
  LESSONS_SCOPE,
  UNITS_SCOPE,
  SEQUENCES_SCOPE,
} from '../../../../src/lib/search-scopes';

export default function StructuredSearchClient(props: {
  action: (input: SearchStructuredRequest) => Promise<{ result: unknown | null; error?: string }>;
  onResultsAction: (result: unknown | null) => void;
  onErrorAction: (message: string | null) => void;
  setLoadingAction: (isLoading: boolean) => void;
  onScopeChange?: (scope: SearchStructuredRequest['scope']) => void;
  onSubmitPayload?: (payload: SearchStructuredRequest) => void;
}): JSX.Element {
  console.debug('[StructuredSearchClient] render start');
  const { model, pending, handleChange, handleSubmit } = useStructuredSearchHandlers(props);
  console.debug('[StructuredSearchClient] render snapshot', {
    pending,
    model,
  });

  return (
    <StructuredForm
      model={model}
      onChange={handleChange}
      onSubmit={() => {
        console.debug('[StructuredSearchClient] <StructuredForm> onSubmit fired');
        handleSubmit();
      }}
      disabled={pending}
    />
  );
}

function resolveStructuredVisibility(scope: SearchStructuredRequest['scope']): {
  subject: boolean;
  keyStage: boolean;
  phase: boolean;
  minLessons: boolean;
} {
  return {
    subject: true,
    keyStage: scope === MULTI_SCOPE || scope === LESSONS_SCOPE || scope === UNITS_SCOPE,
    phase: scope === MULTI_SCOPE || scope === SEQUENCES_SCOPE,
    minLessons: scope === MULTI_SCOPE || scope === UNITS_SCOPE,
  };
}

function StructuredScopeGuidance({
  scope,
}: {
  scope: SearchStructuredRequest['scope'];
}): JSX.Element | null {
  if (scope !== MULTI_SCOPE) {
    return null;
  }

  return (
    <OakTypography as="p" $font="body-4" $color="text-subdued">
      Filters apply to specific categories: Subject &amp; Key stage affect lessons and units, Phase
      applies to programmes, and Minimum lessons applies to units.
    </OakTypography>
  );
}

function StructuredFilterFields({
  model,
  onChange,
  visibility,
}: {
  model: SearchStructuredRequest;
  onChange: (patch: Partial<SearchStructuredRequest>) => void;
  visibility: ReturnType<typeof resolveStructuredVisibility>;
}): JSX.Element {
  const descriptors = [
    {
      key: 'subject',
      visible: visibility.subject,
      render: () => <SubjectField value={model.subject ?? ''} onChange={onChange} />,
    },
    {
      key: 'key-stage',
      visible: visibility.keyStage,
      render: () => <KeyStageField value={model.keyStage ?? ''} onChange={onChange} />,
    },
    {
      key: 'phase',
      visible: visibility.phase,
      render: () => <PhaseField value={model.phaseSlug ?? ''} onChange={onChange} />,
    },
    {
      key: 'min-lessons',
      visible: visibility.minLessons,
      render: () => <MinLessonsField value={model.minLessons ?? 0} onChange={onChange} />,
    },
  ];

  return (
    <>
      {descriptors
        .filter((descriptor) => descriptor.visible)
        .map((descriptor) => (
          <Fragment key={descriptor.key}>{descriptor.render()}</Fragment>
        ))}
    </>
  );
}

function StructuredForm({
  model,
  onChange,
  onSubmit,
  disabled,
}: {
  model: SearchStructuredRequest;
  onChange: (patch: Partial<SearchStructuredRequest>) => void;
  onSubmit: (ev: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}): JSX.Element {
  const scope = model.scope;
  const visibility = resolveStructuredVisibility(scope);

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
        <StructuredScopeGuidance scope={scope} />
        <QueryField value={model.text} onChange={onChange} />
        <StructuredFilterFields model={model} onChange={onChange} visibility={visibility} />
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
