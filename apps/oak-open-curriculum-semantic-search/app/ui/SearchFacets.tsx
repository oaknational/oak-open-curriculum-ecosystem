'use client';

import type { JSX } from 'react';
import {
  OakBox,
  OakHeading,
  OakSecondaryButton,
  OakTypography,
  OakUL,
} from '@oaknational/oak-components';
import type { SequenceFacet } from '../../src/lib/hybrid-search/types';
import { SearchFacetsSchema } from '../../src/types/oak';

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
    <OakBox
      as="aside"
      aria-label="Sequence facets"
      $mt="space-between-l"
      $pa="inner-padding-m"
      $ba="border-solid-s"
      $borderColor="border-neutral-lighter"
      $borderRadius="border-radius-s"
    >
      <OakHeading tag="h3" $font="heading-6" $mb="space-between-s">
        Programmes &amp; units
      </OakHeading>
      <SequenceFacetList sequences={sequences} onSelectSequence={onSelectSequence} />
    </OakBox>
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
    <OakUL $reset $display="grid" $gap="space-between-s">
      {sequences.map((facet) => (
        <OakBox as="li" key={`${facet.sequenceSlug}-${facet.keyStage}`}>
          <FacetButton facet={facet} onSelectSequence={onSelectSequence} />
        </OakBox>
      ))}
    </OakUL>
  );
}

function FacetButton({
  facet,
  onSelectSequence,
}: {
  facet: SequenceFacet;
  onSelectSequence?: (facet: SequenceFacet) => void;
}): JSX.Element {
  const metaParts: string[] = [];
  const keyStageLabel = facet.keyStageTitle ? facet.keyStageTitle : facet.keyStage;
  if (keyStageLabel) {
    metaParts.push(keyStageLabel);
  }
  if (facet.years.length > 0) {
    metaParts.push(`Years ${facet.years.join(', ')}`);
  }
  if (facet.unitCount !== undefined) {
    metaParts.push(`${facet.unitCount} units`);
  }
  if (facet.lessonCount !== undefined) {
    metaParts.push(`${facet.lessonCount} lessons`);
  }

  return (
    <OakSecondaryButton
      type="button"
      width="100%"
      textAlign="left"
      onClick={() => onSelectSequence?.(facet)}
    >
      <OakTypography as="strong" $display="block" $font="body-2-bold">
        {facet.sequenceSlug}
      </OakTypography>
      {metaParts.length > 0 ? (
        <OakTypography
          as="span"
          $display="block"
          $font="body-4"
          $color="text-subdued"
          $mt="space-between-ssx"
        >
          {metaParts.join(' · ')}
        </OakTypography>
      ) : null}
    </OakSecondaryButton>
  );
}

function parseSequenceFacets(facets: unknown): SequenceFacet[] {
  const parsed = SearchFacetsSchema.safeParse(facets);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.sequences ?? [];
}
