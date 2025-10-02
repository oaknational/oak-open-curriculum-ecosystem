import { useCallback, type ComponentProps, type JSX } from 'react';
import { OakTypography } from '@oaknational/oak-components';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import { SearchFacets } from '../SearchFacets';
import { SearchSuggestions } from '../SearchSuggestions';
import type { StructuredFollowUpHandlers } from './useStructuredFollowUp';
import type { SearchController } from './useSearchController';
import { buildSkipLinks } from './SearchPageHeroContent';
import type { SearchLayoutVariant } from './SearchPageLayout.types';

export { SearchHero, resolveResultsSectionId } from './SearchPageHeroContent';
export type { SearchLayoutVariant } from './SearchPageLayout.types';
import {
  ControlsGrid,
  FacetsPanel,
  NaturalPanelCard,
  SecondaryGrid,
  StructuredPanelCard,
  SuggestionsPanel,
  type ControlsLayout,
} from './SearchPageClient.styles';

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
