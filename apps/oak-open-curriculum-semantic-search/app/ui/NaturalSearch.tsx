'use client';

import type { Dispatch, FormEvent, FormEventHandler, JSX, SetStateAction } from 'react';
import { useCallback, useMemo, useState } from 'react';
import styledComponents from 'styled-components';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import { PrimarySubmitButton } from './client/SearchFormControls.styles';
import type { NaturalBody, NaturalScopeChoice } from './NaturalSearch.types';
import {
  QueryField,
  ScopeField,
  SizeField,
  NaturalScopeGuidance,
  NaturalFilterFields,
  computeFilterVisibility,
  createStructuredPatchUpdater,
  formatNaturalScopeLabel,
} from './NaturalSearchFields';
import { normaliseNaturalRequest, submitNaturalSearchRequest } from './NaturalSearch.helpers';
import { SUBJECTS, KEY_STAGES } from '../../src/adapters/sdk-guards';
import { getAppTheme } from './themes/app-theme-helpers';

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
        <NaturalSummary nl={nl} />
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
  onResults: (results: unknown[]) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
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

const SummaryCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  border: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
`;

const SummaryList = styledComponents('dl')`
  display: grid;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  margin: 0;
`;

const SummaryItem = styledComponents('div')`
  display: grid;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  grid-template-columns: max-content 1fr;
  align-items: baseline;
`;

const SummaryTerm = styledComponents(OakTypography)`
  font-weight: 600;
  &::after {
    content: ':';
    margin-inline-start: 0.25rem;
  }
`;

const SummaryDetails = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.colors.textSubdued};
`;

const SUBJECT_LABEL_MAP = new Map(SUBJECTS.map((subject) => [subject, titleCase(subject)]));

const KEY_STAGE_SET = new Set(KEY_STAGES);

interface SummaryItemDescriptor {
  term: string;
  description: string;
}

function NaturalSummary({ nl }: { nl: NaturalBody }): JSX.Element {
  const summary = buildNaturalSummary(nl);
  return (
    <SummaryCard data-testid="natural-summary">
      <OakTypography as="h3" $font="body-3-bold">
        Derived parameters
      </OakTypography>
      <SummaryList>
        {summary.map((item) => (
          <SummaryItem key={item.term}>
            <SummaryTerm as="dt" $font="body-3">
              {item.term}
            </SummaryTerm>
            <SummaryDetails as="dd" $font="body-3">
              {item.description}
            </SummaryDetails>
          </SummaryItem>
        ))}
      </SummaryList>
    </SummaryCard>
  );
}

function buildNaturalSummary(model: NaturalBody): SummaryItemDescriptor[] {
  const query = model.q?.trim() ?? '';
  return [
    { term: 'Query', description: query.length > 0 ? query : '(not set)' },
    { term: 'Scope', description: formatScopeSummary(model.scope) },
    { term: 'Subject', description: formatSubjectSummary(model.subject) },
    { term: 'Key stage', description: formatKeyStageSummary(model.keyStage) },
    { term: 'Phase', description: formatPhaseSummary(model.phaseSlug) },
    { term: 'Minimum lessons', description: formatMinLessonsSummary(model.minLessons) },
    { term: 'Results per request', description: String(model.size ?? 10) },
  ];
}

function formatScopeSummary(scope: NaturalBody['scope'] | undefined): string {
  if (!scope) {
    return 'Auto (Oak decides)';
  }
  return formatNaturalScopeLabel(scope);
}

function formatSubjectSummary(subject: NaturalBody['subject'] | undefined): string {
  if (!subject) {
    return 'Any';
  }
  return SUBJECT_LABEL_MAP.get(subject) ?? titleCase(subject);
}

function formatKeyStageSummary(keyStage: NaturalBody['keyStage'] | undefined): string {
  if (!keyStage) {
    return 'Any';
  }
  if (KEY_STAGE_SET.has(keyStage)) {
    return keyStage.toUpperCase();
  }
  return keyStage;
}

function formatPhaseSummary(phase: NaturalBody['phaseSlug'] | undefined): string {
  if (!phase) {
    return 'Any';
  }
  return titleCase(phase);
}

function formatMinLessonsSummary(minLessons: NaturalBody['minLessons'] | undefined): string {
  if (!minLessons) {
    return 'No minimum';
  }
  return String(minLessons);
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}
