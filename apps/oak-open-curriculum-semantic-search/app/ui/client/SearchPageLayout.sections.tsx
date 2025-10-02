import { useCallback, type ComponentProps, type JSX } from 'react';
import { OakTypography } from '@oaknational/oak-components';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import { SearchFacets } from '../SearchFacets';
import { SearchSuggestions } from '../SearchSuggestions';
import type { StructuredFollowUpHandlers } from './useStructuredFollowUp';
import type { SearchController } from './useSearchController';
import {
  AccentTypography,
  ControlsGrid,
  FacetsPanel,
  HeroCard,
  HeroHeadingCluster,
  NaturalPanelCard,
  SecondaryGrid,
  StructuredPanelCard,
  SuggestionsPanel,
  type ControlsLayout,
} from './SearchPageClient.styles';

export type SearchLayoutVariant = 'default' | 'structured' | 'natural';

export function SearchForms({
  searchAction,
  controller,
  followUp,
  variant,
  layout,
}: {
  searchAction: StructuredSearchAction;
  controller: SearchController;
  followUp: StructuredFollowUpHandlers;
  variant: SearchLayoutVariant;
  layout: ControlsLayout;
}): JSX.Element {
  const showStructured = variant !== 'natural';
  const showNatural = variant !== 'structured';
  return (
    <ControlsGrid as="section" aria-label="Search controls" $layout={layout}>
      {showStructured ? (
        <StructuredPanel searchAction={searchAction} controller={controller} followUp={followUp} />
      ) : null}
      {showNatural ? <NaturalPanel controller={controller} /> : null}
    </ControlsGrid>
  );
}

export function SearchSecondary({
  suggestions,
  onSelectSuggestion,
  facets,
  onSelectSequence,
}: {
  suggestions: ComponentProps<typeof SearchSuggestions>['suggestions'];
  onSelectSuggestion: ComponentProps<typeof SearchSuggestions>['onSelectSuggestion'];
  facets: ComponentProps<typeof SearchFacets>['facets'];
  onSelectSequence: ComponentProps<typeof SearchFacets>['onSelectSequence'];
}): JSX.Element {
  return (
    <SecondaryGrid>
      <SuggestionsPanel>
        <SearchSuggestions suggestions={suggestions} onSelectSuggestion={onSelectSuggestion} />
      </SuggestionsPanel>
      <FacetsPanel>
        <SearchFacets facets={facets} onSelectSequence={onSelectSequence} />
      </FacetsPanel>
    </SecondaryGrid>
  );
}

export function SearchHero({ variant }: { variant: SearchLayoutVariant }): JSX.Element {
  const showExtendedCopy = variant === 'default';
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
      {showExtendedCopy
        ? HERO_BODY_PARAGRAPHS.map((paragraph) => (
            <OakTypography as="p" $font="body-2" key={paragraph}>
              {paragraph}
            </OakTypography>
          ))
        : null}
      <OakTypography as="p" $font="body-2">
        {variant === 'natural' ? 'Need structure? ' : 'Ready to start? '}
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

export function SearchSkipLinks({ variant }: { variant: SearchLayoutVariant }): JSX.Element | null {
  const links = buildSkipLinks(variant);
  if (links.length === 0) {
    return null;
  }
  return (
    <OakTypography
      as="nav"
      aria-label="Skip links"
      $display="flex"
      $flexWrap="wrap"
      $gap="space-between-xs"
    >
      {links.map((link) => (
        <OakTypography as="a" $font="body-4-bold" key={link.href} href={link.href}>
          {link.label}
        </OakTypography>
      ))}
    </OakTypography>
  );
}

export function resolveControlLayout(variant: SearchLayoutVariant): ControlsLayout {
  if (variant === 'structured') {
    return 'structured';
  }
  if (variant === 'natural') {
    return 'natural';
  }
  return 'both';
}

const HERO_BODY_PARAGRAPHS: ReadonlyArray<string> = [
  'We expose two search experiences: a structured search experience and a natural language search experience. Both combine traditional lexical search with semantic search to deliver more relevant results.',
  'The structured search allows filtering on many dimensions, such as subject, year, and topic.',
  'The natural language search takes queries like "find me lessons about history that can be adapted for Leeds", passes that to an LLM to figure out the intent, and then defers to the structured search to find the best results with hybrid lexical and semantic search.',
];

function buildSkipLinks(variant: SearchLayoutVariant): Array<{ href: string; label: string }> {
  switch (variant) {
    case 'structured':
      return [{ href: '#structured-search-panel', label: 'Skip to structured search form' }];
    case 'natural':
      return [{ href: '#natural-search-panel', label: 'Skip to natural language search form' }];
    default:
      return [
        { href: '#structured-search-panel', label: 'Skip to structured search form' },
        { href: '#natural-search-panel', label: 'Skip to natural language search form' },
      ];
  }
}

function StructuredPanel({
  searchAction,
  controller,
  followUp,
}: {
  searchAction: StructuredSearchAction;
  controller: SearchController;
  followUp: StructuredFollowUpHandlers;
}): JSX.Element {
  const { onStart } = controller;

  const handleSetLoading = useCallback(
    (isLoading: boolean) => {
      if (isLoading) {
        onStart();
      }
    },
    [onStart],
  );

  return (
    <StructuredPanelCard
      as="section"
      aria-labelledby="structured-heading"
      data-testid="structured-search-panel"
      id="structured-search-panel"
      $ba="border-solid-s"
    >
      <OakTypography as="h2" id="structured-heading" $font="heading-6">
        Structured
      </OakTypography>
      <StructuredSearch
        action={searchAction}
        onResults={controller.onSuccess}
        onError={controller.onError}
        setLoading={handleSetLoading}
        onScopeChange={followUp.handleScopeChange}
        onSubmitPayload={followUp.recordPayload}
      />
    </StructuredPanelCard>
  );
}

function NaturalPanel({ controller }: { controller: SearchController }): JSX.Element {
  const { onStart } = controller;

  const handleSetLoading = useCallback(
    (isLoading: boolean) => {
      if (isLoading) {
        onStart();
      }
    },
    [onStart],
  );

  return (
    <NaturalPanelCard
      as="section"
      aria-labelledby="nl-heading"
      data-testid="natural-search-panel"
      id="natural-search-panel"
      $ba="border-solid-s"
    >
      <OakTypography as="h2" id="nl-heading" $font="heading-6">
        Natural language
      </OakTypography>
      <NaturalSearchComponent
        onResults={controller.onSuccess}
        onError={controller.onError}
        setLoading={handleSetLoading}
      />
    </NaturalPanelCard>
  );
}
