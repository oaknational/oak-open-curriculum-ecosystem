'use client';

import { type JSX } from 'react';
import { OakBox, OakTypography, OakUL } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { z } from 'zod';
import type { SearchMeta } from './client/useSearchController';
import { renderSafeHighlight } from './searchResultsHighlight';
import { resolveBreakpoint } from './shared/breakpoints';

function ResultItem({
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
  const parts: string[] = [];
  if (subject) {
    parts.push(`Subject: ${subject}`);
  }
  if (keyStage) {
    parts.push(`Key stage: ${keyStage}`);
  }
  const meta = parts.join(' · ');

  return (
    <OakBox
      as="li"
      $ba="border-solid-s"
      $borderColor="border-neutral"
      $borderRadius="border-radius-s"
      $pa="inner-padding-m"
    >
      <OakTypography as="div" $font="body-2-bold">
        {title}
      </OakTypography>
      {meta ? (
        <OakTypography as="div" $font="body-4" $color="text-subdued" $mt="space-between-ssx">
          {meta}
        </OakTypography>
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
    </OakBox>
  );
}

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
const ItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform((v) => String(v)),
    unit: UnitSchema.nullable().optional(),
    lesson: LessonSchema.optional(),
    highlights: z.array(z.string()).optional(),
  })
  .strict();
const ResultsSchema = z.array(ItemSchema);

const ResultsSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  row-gap: var(--app-gap-section);
`;

const ResultsGrid = styledComponents(OakUL).attrs({
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

export function SearchResults({
  results,
  meta,
}: {
  results: unknown[];
  meta?: SearchMeta | null;
}): JSX.Element | null {
  const parsed = ResultsSchema.safeParse(results);
  if (!parsed.success || parsed.data.length === 0) {
    return null;
  }

  function titleFor(rec: z.infer<typeof ItemSchema>): string {
    return rec.lesson?.lesson_title || rec.unit?.unit_title || rec.id;
  }

  function subjectFor(rec: z.infer<typeof ItemSchema>): string {
    return rec.lesson?.subject_slug || rec.unit?.subject_slug || '';
  }

  function keyStageFor(rec: z.infer<typeof ItemSchema>): string {
    return rec.lesson?.key_stage || rec.unit?.key_stage || '';
  }

  function highlightsFor(rec: z.infer<typeof ItemSchema>): string[] {
    return rec.highlights ?? [];
  }

  const summary = buildSummary(meta);

  return (
    <ResultsSection as="section" aria-live="polite" $mt="space-between-xl">
      <SearchSummary summary={summary} />
      <ResultsGrid $reset>
        {parsed.data.map((rec) => (
          <ResultItem
            key={rec.id}
            title={titleFor(rec)}
            subject={subjectFor(rec)}
            keyStage={keyStageFor(rec)}
            highlights={highlightsFor(rec)}
          />
        ))}
      </ResultsGrid>
    </ResultsSection>
  );
}

export default SearchResults;

function buildSummary(meta?: SearchMeta | null): {
  primary: string | null;
  secondary: string | null;
} {
  if (!meta) {
    return { primary: null, secondary: null };
  }

  const scopeLabel = formatScope(meta.scope);
  const primary = `${meta.total} result${meta.total === 1 ? '' : 's'} for ${scopeLabel}`;
  const timedOut = meta.timedOut ? 'Results may be incomplete (timed out).' : null;
  const took = `Took ${meta.took}ms`;
  const secondary = timedOut ? `${took}. ${timedOut}` : took;
  return { primary, secondary };
}

function formatScope(scope: SearchMeta['scope']): string {
  if (scope === 'lessons') {
    return 'lessons';
  }
  if (scope === 'units') {
    return 'units';
  }
  return 'programmes';
}

function SearchSummary({
  summary,
}: {
  summary: { primary: string | null; secondary: string | null };
}): JSX.Element | null {
  if (!summary.primary && !summary.secondary) {
    return null;
  }

  return (
    <OakBox $display="flex" $flexDirection="column" $gap="space-between-ssx" $mb="space-between-s">
      {summary.primary ? (
        <OakTypography as="p" $font="body-3" $color="text-subdued">
          {summary.primary}
        </OakTypography>
      ) : null}
      {summary.secondary ? (
        <OakTypography as="p" $font="body-4" $color="text-subdued">
          {summary.secondary}
        </OakTypography>
      ) : null}
    </OakBox>
  );
}
