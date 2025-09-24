'use client';

import type { JSX } from 'react';
import sc from 'styled-components';
import type { SequenceFacet } from '../../src/lib/hybrid-search/types';
import { SearchFacetsSchema } from '../../src/types/oak';

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

const FacetButton = sc.button`
  all: unset;
  display: block;
  width: 100%;
  text-align: left;
  border: 1px solid ${(p) => p.theme.app.colors.borderSubtle};
  border-radius: ${(p) => p.theme.app.radii.sm};
  padding: ${(p) => p.theme.app.space.xs} ${(p) => p.theme.app.space.sm};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.app.colors.headerBorder};
    outline-offset: 2px;
  }
`;

interface SearchFacetsProps {
  facets: unknown;
  onSelectSequence?: (facet: SequenceFacet) => void;
}

export function SearchFacets({ facets, onSelectSequence }: SearchFacetsProps): JSX.Element | null {
  const sequences = parseSequenceFacets(facets);
  if (sequences.length === 0) {
    return null;
  }

  return (
    <FacetWrapper aria-label="Sequence facets">
      <FacetHeading>Programmes &amp; units</FacetHeading>
      <SequenceFacetList sequences={sequences} onSelectSequence={onSelectSequence} />
    </FacetWrapper>
  );
}

function SequenceFacetList({
  sequences,
  onSelectSequence,
}: {
  sequences: SequenceFacet[];
  onSelectSequence?: (facet: SequenceFacet) => void;
}): JSX.Element {
  return (
    <FacetList>
      {sequences.map((facet) => (
        <FacetItem key={`${facet.sequenceSlug}-${facet.keyStage}`}>
          <FacetButton type="button" onClick={() => onSelectSequence?.(facet)}>
            <strong>{facet.sequenceSlug}</strong>
            {facet.keyStageTitle ? ` · ${facet.keyStageTitle}` : ` · ${facet.keyStage}`}
            {facet.years.length ? ` · Years ${facet.years.join(', ')}` : null}
            {facet.unitCount !== undefined ? ` · ${facet.unitCount} units` : null}
            {facet.lessonCount !== undefined ? ` · ${facet.lessonCount} lessons` : null}
          </FacetButton>
        </FacetItem>
      ))}
    </FacetList>
  );
}

function parseSequenceFacets(facets: unknown): SequenceFacet[] {
  const parsed = SearchFacetsSchema.safeParse(facets);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.sequences ?? [];
}
