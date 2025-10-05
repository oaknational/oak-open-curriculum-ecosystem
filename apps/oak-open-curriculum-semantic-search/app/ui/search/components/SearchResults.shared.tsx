'use client';

import type { JSX } from 'react';
import { OakBox, OakTypography, OakUL } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { z } from 'zod';
import { renderSafeHighlight } from './searchResultsHighlight';
import { resolveBreakpoint } from '../../shared/breakpoints';
import { getAppTheme } from '../../themes/app-theme-helpers';
import { resolveUiColor } from '../../../lib/theme/ThemeGlobalStyle';

const UnitSchema = z
  .object({
    unit_title: z.string().optional(),
    subject_slug: z.string().optional(),
    key_stage: z.string().optional(),
  })
  .partial();

const LessonSchema = z
  .object({
    lesson_title: z.string().optional(),
    subject_slug: z.string().optional(),
    key_stage: z.string().optional(),
  })
  .partial();

export const ItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform((v) => String(v)),
    unit: UnitSchema.nullable().optional(),
    lesson: LessonSchema.optional(),
    highlights: z.array(z.string()).optional(),
    rankScore: z.number().optional(),
  })
  .strict();

export const ResultsSchema = z.array(ItemSchema);

export function ResultItem({
  title,
  subject,
  keyStage,
  highlights,
}: {
  title: string;
  subject: string;
  keyStage: string;
  highlights: string[];
}): JSX.Element {
  const metaEntries = buildMetaEntries(subject, keyStage);

  return (
    <ResultCard as="li">
      <ResultHeading as="h3" $font="heading-6">
        {title}
      </ResultHeading>
      {metaEntries.length > 0 ? (
        <ResultMetaList data-testid="search-result-meta">
          {metaEntries.map((entry) => (
            <ResultMetaBadge key={entry.kind} data-testid={entry.testId}>
              {entry.label}
            </ResultMetaBadge>
          ))}
        </ResultMetaList>
      ) : null}
      {highlights.length > 0 ? (
        <OakUL $mt="space-between-s">
          {highlights.map((h, i) => (
            <OakTypography as="li" key={i} $font="body-4">
              {renderSafeHighlight(String(h))}
            </OakTypography>
          ))}
        </OakUL>
      ) : null}
    </ResultCard>
  );
}

export const ResultsSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  row-gap: var(--app-gap-section);
`;

export const ResultsSummaryContainer = styledComponents(OakBox).attrs({
  'data-testid': 'search-results-summary',
  'data-sticky': 'true',
})`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  margin-bottom: var(--app-gap-section);

  ${({ theme }) => {
    const lg = resolveBreakpoint(theme, 'lg');
    return css`
      @media (min-width: ${lg}) {
        position: sticky;
        top: calc(var(--app-gap-section) * 0.5);
      }
    `;
  }}
`;

export const ResultsGrid = styledComponents(OakUL).attrs({
  'data-testid': 'search-results-grid',
})`
  display: grid;
  row-gap: var(--app-gap-section);
  column-gap: var(--app-gap-grid);
  grid-template-columns: minmax(0, 1fr);

  ${({ theme }) => {
    const md = resolveBreakpoint(theme, 'md');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${md}) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (min-width: ${xl}) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    `;
  }}
`;

const ResultCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  border: 1px solid
    ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  box-shadow: 0 0.75rem 2.5rem -1.5rem
    ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};
`;

const ResultHeading = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
`;

const ResultMetaList = styledComponents(OakBox)`
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
`;

const ResultMetaBadge = styledComponents(OakTypography).attrs({ $font: 'body-4' })`
  display: inline-flex;
  align-items: center;
  padding-inline: calc(var(--app-gap-inline, var(--app-gap-cluster)) / 2);
  padding-block: 0.25rem;
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
  color: ${({ theme }) => getAppTheme(theme).app.colors.textSubdued};
`;

function buildMetaEntries(
  subject: string,
  keyStage: string,
): Array<{
  kind: 'subject' | 'key-stage';
  label: string;
  testId: `search-result-meta-${string}`;
}> {
  const entries: Array<{
    kind: 'subject' | 'key-stage';
    label: string;
    testId: `search-result-meta-${string}`;
  }> = [];
  if (subject) {
    entries.push({
      kind: 'subject',
      label: `Subject: ${subject}`,
      testId: 'search-result-meta-subject',
    });
  }
  if (keyStage) {
    entries.push({
      kind: 'key-stage',
      label: `Key stage: ${keyStage}`,
      testId: 'search-result-meta-key-stage',
    });
  }
  return entries;
}

export function extractTitle(rec: z.infer<typeof ItemSchema>): string {
  if (rec.lesson?.lesson_title) {
    return rec.lesson.lesson_title;
  }
  if (rec.unit?.unit_title) {
    return rec.unit.unit_title;
  }
  return rec.id;
}

export function extractSubject(rec: z.infer<typeof ItemSchema>): string {
  if (rec.lesson?.subject_slug) {
    return rec.lesson.subject_slug;
  }
  if (rec.unit?.subject_slug) {
    return rec.unit.subject_slug;
  }
  return '';
}

export function extractKeyStage(rec: z.infer<typeof ItemSchema>): string {
  if (rec.lesson?.key_stage) {
    return rec.lesson.key_stage;
  }
  if (rec.unit?.key_stage) {
    return rec.unit.key_stage;
  }
  return '';
}

export function extractHighlights(rec: z.infer<typeof ItemSchema>): string[] {
  return Array.isArray(rec.highlights) ? rec.highlights : [];
}
