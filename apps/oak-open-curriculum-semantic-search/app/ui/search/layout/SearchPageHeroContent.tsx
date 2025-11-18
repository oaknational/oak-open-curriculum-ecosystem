import type { JSX } from 'react';
import { OakTypography } from '@oaknational/oak-components';
import type { SearchLayoutVariant } from './SearchPageLayout.types';
import { AccentTypography, HeroCard, HeroHeadingCluster } from './SearchPageClient.styles';

const HERO_LEAD_PARAGRAPH =
  'Blend structured filters with natural-language prompts to surface Oak lessons, units, and programmes in seconds.';

const HERO_BODY_PARAGRAPHS: readonly string[] = [
  'Results stay visible alongside the controls, so you can compare options without scrolling back.',
  'Switch between structured and natural language journeys whenever you need a different approach.',
];

const STRUCTURED_HERO_PARAGRAPHS: readonly string[] = [
  'Choose subject, phase, and scope to target the Oak catalogue with precision.',
  'Results update alongside the form so you can spot the right lesson immediately.',
];

const NATURAL_HERO_PARAGRAPHS: readonly string[] = [
  'Describe what you need in plain language and we will translate it into a structured query for you.',
  'Matching results appear next to the prompt so refinements stay effortless.',
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

export function buildSkipLinks(variant: SearchLayoutVariant): { href: string; label: string }[] {
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
    <HeroCard data-testid="search-hero" $ba="border-solid-s" data-variant="default">
      <OakTypography as="h1" $font="heading-3">
        <HeroHeadingCluster as="span">
          <AccentTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Find
          </AccentTypography>
          <OakTypography as="span" $font="heading-3" $pr="space-between-ssx">
            lessons
          </OakTypography>
          <OakTypography as="span" $font="heading-3">
            faster with hybrid search
          </OakTypography>
        </HeroHeadingCluster>
      </OakTypography>
      <OakTypography as="p" $font="body-3" $color="text-subdued">
        {HERO_LEAD_PARAGRAPH}
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
    <HeroCard data-testid="search-hero" $ba="border-solid-s" data-variant="structured">
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
    <HeroCard data-testid="search-hero" $ba="border-solid-s" data-variant="natural">
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

function buildStructuredSkipLinks(): { href: string; label: string }[] {
  return [
    { href: '#structured-search-panel', label: 'Skip to structured search form' },
    { href: '#structured-search-results', label: 'Skip to structured results' },
  ];
}
