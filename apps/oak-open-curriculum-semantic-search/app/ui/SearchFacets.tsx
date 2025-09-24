'use client';

import type { JSX } from 'react';
import sc from 'styled-components';
import { z } from 'zod';

const SequenceFacetSchema = z
  .object({
    sequenceSlug: z.string(),
    keyStage: z.string(),
    keyStageTitle: z.string().optional(),
    years: z.array(z.string()).default([]),
    units: z.array(z.object({ unitSlug: z.string(), unitTitle: z.string() })).default([]),
    unitCount: z.number().optional(),
    lessonCount: z.number().optional(),
  })
  .catchall(z.unknown());

const FacetsSchema = z
  .object({
    sequences: z.array(SequenceFacetSchema).default([]),
  })
  .catchall(z.unknown());

const FacetWrapper = sc.aside`
  margin-top: ${(p) => p.theme.app.space.lg};
  border: 1px solid ${(p) => p.theme.app.colors.borderSubtle};
  border-radius: ${(p) => p.theme.app.radii.sm};
  padding: ${(p) => p.theme.app.space.sm};
`;

const FacetHeading = sc.h3`
  margin: 0 0 ${(p) => p.theme.app.space.sm} 0;
`;

const FacetList = sc.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: ${(p) => p.theme.app.space.xs};
`;

const FacetItem = sc.li`
  font-size: ${(p) => p.theme.app.fontSizes.xs};
`;

export function SearchFacets({ facets }: { facets: unknown }): JSX.Element | null {
  const parsed = FacetsSchema.safeParse(facets);
  if (!parsed.success) {
    return null;
  }

  const sequences = parsed.data.sequences ?? [];
  if (sequences.length === 0) {
    return null;
  }

  return (
    <FacetWrapper aria-label="Sequence facets">
      <FacetHeading>Programmes &amp; units</FacetHeading>
      <FacetList>
        {sequences.map((seq) => (
          <FacetItem key={`${seq.sequenceSlug}-${seq.keyStage}`}>
            <strong>{seq.sequenceSlug}</strong>
            {seq.keyStageTitle ? ` · ${seq.keyStageTitle}` : ` · ${seq.keyStage}`}
            {seq.years && seq.years.length ? ` · Years ${seq.years.join(', ')}` : null}
            {seq.unitCount !== undefined ? ` · ${seq.unitCount} units` : null}
            {seq.lessonCount !== undefined ? ` · ${seq.lessonCount} lessons` : null}
          </FacetItem>
        ))}
      </FacetList>
    </FacetWrapper>
  );
}
