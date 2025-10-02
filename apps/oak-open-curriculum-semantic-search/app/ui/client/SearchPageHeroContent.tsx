import type { JSX } from 'react';
import { OakTypography } from '@oaknational/oak-components';
import type { SearchLayoutVariant } from './SearchPageLayout.types';
import { AccentTypography, HeroCard, HeroHeadingCluster } from './SearchPageClient.styles';

const HERO_BODY_PARAGRAPHS: ReadonlyArray<string> = [
  'We expose two search experiences: a structured search experience and a natural language search experience. Both combine traditional lexical search with semantic search to deliver more relevant results.',
  'The structured search allows filtering on many dimensions, such as subject, year, and topic.',
  'The natural language search takes queries like "find me lessons about history that can be adapted for Leeds", passes that to an LLM to figure out the intent, and then defers to the structured search to find the best results with hybrid lexical and semantic search.',
];

const STRUCTURED_HERO_PARAGRAPHS: ReadonlyArray<string> = [
  'Filter the Oak curriculum catalogue by subject, key stage, scope, and minimum results to direct your planning.',
  'Refine queries quickly, keep provenance in clear view, and rely on deterministic fixtures to evidence the experience.',
];

const NATURAL_HERO_PARAGRAPHS: ReadonlyArray<string> = [
  'Describe what you need in plain language so we can derive structured parameters and run hybrid queries.',
  'Review the derived filter summary, tweak the prompt, and explore deterministic fixtures to evidence outcomes.',
];

export function SearchHero({ variant }: { variant: SearchLayoutVariant }): JSX.Element {
  if (variant === 'structured') {
    return <StructuredHero />;
  }
  if (variant === 'natural') {
    return <NaturalHero />;
  }

  return <DefaultHero />;
}

export function buildSkipLinks(
  variant: SearchLayoutVariant,
): Array<{ href: string; label: string }> {
  switch (variant) {
    case 'structured':
      return buildStructuredSkipLinks();
    case 'natural':
      return [
        { href: '#natural-search-panel', label: 'Skip to natural language search form' },
        { href: '#natural-search-results', label: 'Skip to natural language results' },
      ];
    default:
      return [
        { href: '#structured-search-panel', label: 'Skip to structured search form' },
        { href: '#natural-search-panel', label: 'Skip to natural language search form' },
        { href: '#search-results', label: 'Skip to search results' },
      ];
  }
}

export function resolveResultsSectionId(variant: SearchLayoutVariant): string {
  if (variant === 'structured') {
    return 'structured-search-results';
  }
  if (variant === 'natural') {
    return 'natural-search-results';
  }
  return 'search-results';
}

function DefaultHero(): JSX.Element {
  return (
    <HeroCard data-testid="search-hero" $ba="border-solid-s">
      <OakTypography as="h1" $font="heading-3">
        <HeroHeadingCluster as="span">
          <AccentTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Hybrid
          </AccentTypography>
          <OakTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Search
          </OakTypography>
          <OakTypography as="span" $font="heading-3">
            <em>Alpha</em>
          </OakTypography>
        </HeroHeadingCluster>
      </OakTypography>
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        Search lessons, units, and sequences.
      </OakTypography>
      {HERO_BODY_PARAGRAPHS.map((paragraph) => (
        <OakTypography as="p" $font="body-2" key={paragraph}>
          {paragraph}
        </OakTypography>
      ))}
      <OakTypography as="p" $font="body-2">
        Ready to start?{' '}
        <OakTypography as="a" href="/structured_search" $font="body-2-bold">
          Open structured search
        </OakTypography>{' '}
        or{' '}
        <OakTypography as="a" href="/natural_language_search" $font="body-2-bold">
          Open natural language search
        </OakTypography>
        .
      </OakTypography>
    </HeroCard>
  );
}

function StructuredHero(): JSX.Element {
  return (
    <HeroCard data-testid="search-hero" $ba="border-solid-s">
      <OakTypography as="h1" $font="heading-3">
        Structured search
      </OakTypography>
      {STRUCTURED_HERO_PARAGRAPHS.map((paragraph) => (
        <OakTypography as="p" $font="body-2" key={paragraph}>
          {paragraph}
        </OakTypography>
      ))}
      <OakTypography as="p" $font="body-2">
        Prefer conversational briefs?{' '}
        <OakTypography as="a" href="/natural_language_search" $font="body-2-bold">
          Switch to natural language search
        </OakTypography>
        .
      </OakTypography>
    </HeroCard>
  );
}

function NaturalHero(): JSX.Element {
  return (
    <HeroCard data-testid="search-hero" $ba="border-solid-s">
      <OakTypography as="h1" $font="heading-3">
        Natural language search
      </OakTypography>
      {NATURAL_HERO_PARAGRAPHS.map((paragraph) => (
        <OakTypography as="p" $font="body-2" key={paragraph}>
          {paragraph}
        </OakTypography>
      ))}
      <OakTypography as="p" $font="body-2">
        Need filters instead?{' '}
        <OakTypography as="a" href="/structured_search" $font="body-2-bold">
          Switch to structured search
        </OakTypography>
        .
      </OakTypography>
    </HeroCard>
  );
}

function buildStructuredSkipLinks(): Array<{ href: string; label: string }> {
  return [
    { href: '#structured-search-panel', label: 'Skip to structured search form' },
    { href: '#structured-search-results', label: 'Skip to structured results' },
  ];
}
