'use client';

import type { JSX } from 'react';
import { OakBox, OakTypography, OakUL } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { z } from 'zod';
import { renderSafeHighlight } from './searchResultsHighlight';
import { resolveBreakpoint } from './shared/breakpoints';

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

export const ResultsSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  row-gap: var(--app-gap-section);
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
