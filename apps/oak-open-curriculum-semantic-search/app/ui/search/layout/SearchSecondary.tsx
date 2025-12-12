import { useCallback, useEffect, useMemo, useState, type ComponentProps, type JSX } from 'react';
import { useTheme } from 'styled-components';
import { SearchFacetsSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { SearchSuggestions } from '../components/SearchSuggestions';
import { SearchFacets } from '../components/SearchFacets';
import {
  FacetsPanel,
  MobileAccordionButton,
  MobileAccordionContent,
  MobileAccordionSection,
  MobileSupportStack,
  SecondaryGrid,
  SuggestionsPanel,
} from './SearchPageClient.styles';
import { resolveBreakpoint, type BreakpointName } from '../../shared/breakpoints';

interface SearchSecondaryProps {
  readonly suggestions: ComponentProps<typeof SearchSuggestions>['suggestions'];
  readonly onSelectSuggestion: ComponentProps<typeof SearchSuggestions>['onSelectSuggestion'];
  readonly facets: ComponentProps<typeof SearchFacets>['facets'];
  readonly onSelectSequence: ComponentProps<typeof SearchFacets>['onSelectSequence'];
}

export function SearchSecondary({
  suggestions,
  onSelectSuggestion,
  facets,
  onSelectSequence,
}: SearchSecondaryProps): JSX.Element | null {
  const isLargeScreen = useBreakpointMatch('lg');
  const hasSuggestions = suggestions.length > 0;
  const hasFacets = useMemo(() => {
    const parsed = SearchFacetsSchema.safeParse(facets);
    if (!parsed.success) {
      return false;
    }
    return (parsed.data.sequences?.length ?? 0) > 0;
  }, [facets]);

  if (isLargeScreen) {
    return renderDesktopSupport({ suggestions, onSelectSuggestion, facets, onSelectSequence });
  }

  if (!hasSuggestions && !hasFacets) {
    return null;
  }

  return renderMobileSupport({
    suggestions,
    onSelectSuggestion,
    facets,
    onSelectSequence,
    showSuggestions: hasSuggestions,
    showFacets: hasFacets,
  });
}

function renderDesktopSupport({
  suggestions,
  onSelectSuggestion,
  facets,
  onSelectSequence,
}: SearchSecondaryProps): JSX.Element {
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

function renderMobileSupport({
  suggestions,
  onSelectSuggestion,
  facets,
  onSelectSequence,
  showSuggestions,
  showFacets,
}: SearchSecondaryProps & {
  readonly showSuggestions: boolean;
  readonly showFacets: boolean;
}): JSX.Element {
  return (
    <MobileSupportStack data-testid="search-support-mobile">
      {showSuggestions ? (
        <MobileSupportAccordion id="suggestions" label="Toggle suggestions">
          <SearchSuggestions suggestions={suggestions} onSelectSuggestion={onSelectSuggestion} />
        </MobileSupportAccordion>
      ) : null}
      {showFacets ? (
        <MobileSupportAccordion id="facets" label="Toggle programmes & units">
          <SearchFacets facets={facets} onSelectSequence={onSelectSequence} />
        </MobileSupportAccordion>
      ) : null}
    </MobileSupportStack>
  );
}

function MobileSupportAccordion({
  id,
  label,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly children: JSX.Element;
}): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen((previous) => !previous);
  }, []);

  return (
    <MobileAccordionSection data-open={open}>
      <MobileAccordionButton
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={handleToggle}
      >
        {label}
      </MobileAccordionButton>
      <MobileAccordionContent id={`${id}-content`} role="region" hidden={!open} aria-hidden={!open}>
        {open ? children : null}
      </MobileAccordionContent>
    </MobileAccordionSection>
  );
}

function useBreakpointMatch(name: BreakpointName): boolean {
  const theme = useTheme();

  const computeMatch = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    const query = `(min-width: ${resolveBreakpoint(theme, name)})`;
    return window.matchMedia(query).matches;
  }, [theme, name]);

  const [matches, setMatches] = useState<boolean>(computeMatch);

  useEffect(() => {
    // SSR guard: state is already initialised correctly via computeMatch
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const query = `(min-width: ${resolveBreakpoint(theme, name)})`;
    const media = window.matchMedia(query);

    const update = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Synchronise with current match state, then listen for changes
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial sync with browser API after hydration; useSyncExternalStore would be overkill for this simple case
    setMatches(media.matches);
    media.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
    };
  }, [theme, name, computeMatch]);

  return matches;
}
