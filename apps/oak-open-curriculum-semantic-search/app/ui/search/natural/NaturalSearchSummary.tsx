'use client';

import type { JSX } from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import type { NaturalSearchSummary } from './NaturalSearch.helpers';
import {
  SearchStructuredRequestSchema,
  type SearchStructuredRequest,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import { isSubject, isKeyStage } from '../../../../src/adapters/sdk-guards';
import { LESSONS_SCOPE, UNITS_SCOPE, SEQUENCES_SCOPE } from '../../../../src/lib/search-scopes';
import { getAppTheme } from '../../themes/app-theme-helpers';

export type NaturalSummaryState = NaturalSearchSummary | null;

export function DerivedSummary({ summary }: { summary: NaturalSummaryState }): JSX.Element {
  if (!summary) {
    return (
      <SummaryCard data-testid="natural-summary" aria-live="polite">
        <OakTypography as="h3" $font="body-3-bold">
          Derived parameters
        </OakTypography>
        <OakTypography as="p" $font="body-3" $color="text-primary">
          Submit a prompt to populate the derived summary.
        </OakTypography>
      </SummaryCard>
    );
  }

  const entries = buildSummaryEntries(summary);

  return (
    <SummaryCard data-testid="natural-summary" aria-live="polite">
      <OakTypography as="h3" $font="body-3-bold">
        Derived parameters
      </OakTypography>
      <SummaryList>
        {entries.map((entry) => (
          <SummaryItem key={entry.term}>
            <SummaryTerm as="dt" $font="body-3">
              {entry.term}
            </SummaryTerm>
            <SummaryDetails as="dd" $font="body-3">
              {entry.description}
            </SummaryDetails>
          </SummaryItem>
        ))}
      </SummaryList>
    </SummaryCard>
  );
}

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

interface SummaryEntry {
  readonly term: string;
  readonly description: string;
}

function buildSummaryEntries(summary: NaturalSearchSummary): SummaryEntry[] {
  const structured = SearchStructuredRequestSchema.parse(summary.structured);
  return [
    { term: 'Original prompt', description: summary.prompt.trim() || '(not set)' },
    { term: 'Derived query', description: structured.text?.trim() || '(not derived)' },
    { term: 'Scope', description: formatScope(structured.scope) },
    { term: 'Subject', description: formatSubject(structured.subject) },
    { term: 'Key stage', description: formatKeyStage(structured.keyStage) },
    { term: 'Phase', description: formatPhase(structured.phaseSlug) },
    { term: 'Minimum lessons', description: formatMinLessons(structured.minLessons) },
    { term: 'Results per request', description: String(structured.size ?? 10) },
  ];
}

function formatScope(scope: SearchStructuredRequest['scope'] | 'all'): string {
  if (scope === LESSONS_SCOPE) {
    return 'Lessons';
  }
  if (scope === UNITS_SCOPE) {
    return 'Units';
  }
  if (scope === SEQUENCES_SCOPE) {
    return 'Sequences';
  }
  if (scope === 'all') {
    return 'All content';
  }
  throw new Error(`Unexpected search scope: ${String(scope)}`);
}

function formatSubject(subject: SearchStructuredRequest['subject'] | undefined): string {
  if (!subject) {
    return 'Any';
  }
  if (!isSubject(subject)) {
    throw new Error(`Unexpected subject value: ${String(subject)}`);
  }
  return titleCase(subject);
}

function formatKeyStage(keyStage: SearchStructuredRequest['keyStage'] | undefined): string {
  if (!keyStage) {
    return 'Any';
  }
  if (!isKeyStage(keyStage)) {
    throw new Error(`Unexpected key stage value: ${String(keyStage)}`);
  }
  return keyStage.toUpperCase();
}

function formatPhase(phase: SearchStructuredRequest['phaseSlug'] | undefined): string {
  if (!phase) {
    return 'Any';
  }
  return titleCase(phase);
}

function formatMinLessons(minLessons: SearchStructuredRequest['minLessons'] | undefined): string {
  if (typeof minLessons !== 'number') {
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
