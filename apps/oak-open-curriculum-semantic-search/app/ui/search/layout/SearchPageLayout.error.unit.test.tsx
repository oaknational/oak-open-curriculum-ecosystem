import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { SearchPageLayout } from './SearchPageLayout';
import { createLightTheme } from '../../themes/light';
import type { StructuredFollowUpHandlers } from '../hooks/useStructuredFollowUp';
import type { SearchController } from '../hooks/useSearchController';
import type { StructuredSearchAction } from '../structured/StructuredSearch';
import { FixtureModeProvider } from '../../global/Fixture/FixtureModeContext';
import { createMockMediaQueryAPI } from '../../../lib/media-query/MediaQueryContext.test-helpers';
import { MediaQueryContext } from '../../../lib/media-query/MediaQueryContext';

function renderWithProviders(ui: ReactNode) {
  const theme = createLightTheme();
  const mockAPI = createMockMediaQueryAPI(false);
  return render(
    <MediaQueryContext.Provider value={mockAPI}>
      <StyledThemeProvider theme={theme}>
        <OakThemeProvider theme={oakDefaultTheme}>
          <FixtureModeProvider initialMode="live">{ui}</FixtureModeProvider>
        </OakThemeProvider>
      </StyledThemeProvider>
    </MediaQueryContext.Provider>,
  );
}

describe('SearchPageLayout error banner', () => {
  it('renders the provided error message in the alert banner', () => {
    const errorMessage = 'Fixture mode requested an error response for natural-language search.';

    const controller: SearchController = {
      mode: 'idle',
      results: [],
      facets: null,
      meta: null,
      multiBuckets: null,
      suggestions: [],
      error: errorMessage,
      loading: false,
      onStart: vi.fn(),
      onSuccess: vi.fn(),
      onError: vi.fn(),
    };

    const followUp: StructuredFollowUpHandlers = {
      handleSuggestionSelect: vi.fn(),
      handleFacetSelect: vi.fn(),
      handleScopeChange: vi.fn(),
      recordPayload: vi.fn(),
    };

    const searchAction: StructuredSearchAction = vi.fn();

    renderWithProviders(
      <SearchPageLayout
        controller={controller}
        followUp={followUp}
        searchAction={searchAction}
        initialFixtureMode="live"
        showFixtureToggle={false}
        variant="default"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });
});
