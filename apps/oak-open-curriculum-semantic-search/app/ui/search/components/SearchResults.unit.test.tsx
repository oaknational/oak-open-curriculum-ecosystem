import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { SearchResults } from './SearchResults';
import type { MultiScopeBucketView, SearchMeta } from '../hooks/useSearchController';
import type { SearchResultItem } from './SearchResults.schemas';
import { createLightTheme } from '../../themes/light';
import { STRUCTURED_EMPTY_RESULTS_MESSAGE } from '../content/structured-search-messages';

describe('SearchResults', () => {
  const sampleMeta: SearchMeta = {
    scope: 'lessons',
    total: 1,
    took: 12,
    timedOut: false,
  };

  const sampleResult: SearchResultItem = {
    id: 'lesson-1',
    rankScore: 1,
    lesson: {
      lesson_title: 'Decimals introduction',
      subject_slug: 'maths',
      key_stage: 'ks2',
    },
    highlights: ['<em>decimal</em> place value'],
  };

  function renderWithProviders(
    overrides: {
      mode?: 'idle' | 'single' | 'multi';
      results?: SearchResultItem[];
      meta?: SearchMeta | null;
      multiBuckets?: MultiScopeBucketView[] | null;
      loading?: boolean;
    } = {},
  ) {
    const {
      mode = 'single',
      results = [sampleResult],
      meta = sampleMeta,
      multiBuckets = null,
      loading = false,
    } = overrides;

    const theme = createLightTheme();

    const renderResult = render(
      <StyledThemeProvider theme={theme}>
        <OakThemeProvider theme={oakDefaultTheme}>
          <SearchResults
            mode={mode}
            results={results}
            meta={meta}
            multiBuckets={multiBuckets}
            loading={loading}
          />
        </OakThemeProvider>
      </StyledThemeProvider>,
    );
    return { theme, ...renderResult };
  }

  it('renders totals and timing information from meta', () => {
    renderWithProviders();

    expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    expect(screen.getByText('Took 12ms')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /Decimals introduction/i }),
    ).toBeInTheDocument();
    const meta = screen.getByTestId('search-result-meta');
    expect(within(meta).getByTestId('search-result-meta-subject')).toHaveTextContent(
      'Subject: maths',
    );
    expect(within(meta).getByTestId('search-result-meta-key-stage')).toHaveTextContent(
      'Key stage: ks2',
    );
  });

  it('announces when the query timed out', () => {
    const meta: SearchMeta = { ...sampleMeta, timedOut: true, took: 15 };

    renderWithProviders({ meta });

    expect(
      screen.getByText('Took 15ms. Results may be incomplete (timed out).'),
    ).toBeInTheDocument();
  });

  it('renders an empty-state notice when no results are returned', () => {
    const meta: SearchMeta = { ...sampleMeta, total: 0 };

    renderWithProviders({ results: [], meta });

    expect(screen.getByText('0 results for lessons')).toBeInTheDocument();
    expect(screen.getByText(STRUCTURED_EMPTY_RESULTS_MESSAGE)).toBeInTheDocument();
  });

  it('clamps highlight copy and exposes metadata for styling', () => {
    renderWithProviders();

    const highlightItems = screen.getAllByTestId('search-result-highlight-item');
    expect(highlightItems).not.toHaveLength(0);
    expect(highlightItems[0]).toHaveAttribute('data-line-clamp', '3');
    expect(highlightItems[0]).toHaveTextContent('decimal place value');
  });

  it('shows an instruction state before any search has executed', () => {
    renderWithProviders({ mode: 'idle', results: [], meta: null });

    expect(
      screen.getByText('Begin a search to explore structured or natural language results.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(STRUCTURED_EMPTY_RESULTS_MESSAGE)).not.toBeInTheDocument();
  });

  function renderResults(meta: SearchMeta = sampleMeta) {
    return renderWithProviders({ meta });
  }

  it('applies Oak spacing and border tokens to the results list', () => {
    const { container, theme } = renderResults();

    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    const sectionEl = section as HTMLElement;
    expect(sectionEl.getAttribute('aria-live')).toBe('polite');
    expect(sectionEl.getAttribute('role')).toBe('status');

    const list = screen.getByTestId('search-results-grid');
    const listStyles = getComputedStyle(list);
    expect(listStyles.display).toBe('grid');
    expect(listStyles.getPropertyValue('row-gap')).toBe('var(--app-gap-section)');
    expect(listStyles.getPropertyValue('column-gap')).toBe('var(--app-gap-grid)');

    const item = within(list).getAllByRole('listitem')[0];
    const itemStyles = getComputedStyle(item);
    expect(itemStyles.padding).toBe(theme.app.space.padding.card);
    expect(itemStyles.borderRadius).toBe(theme.app.radii.card);
    expect(itemStyles.borderTopWidth).toBe('1px');
  });

  it('renders bucketed sections when multiple scopes return data', () => {
    const lessonBucket: MultiScopeBucketView = {
      scope: 'lessons',
      meta: sampleMeta,
      results: [sampleResult],
      facets: null,
    };
    const unitBucket: MultiScopeBucketView = {
      scope: 'units',
      meta: { ...sampleMeta, scope: 'units', total: 1 },
      results: [
        {
          id: 'unit-1',
          rankScore: 2,
          unit: {
            unit_title: 'Decimals unit',
            subject_slug: 'maths',
            key_stage: 'ks2',
          },
          highlights: [],
        },
      ],
      facets: null,
    };

    renderWithProviders({
      mode: 'multi',
      results: [],
      meta: null,
      multiBuckets: [lessonBucket, unitBucket],
    });

    expect(screen.getByRole('heading', { level: 2, name: 'Lessons' })).toBeInTheDocument();
    expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    expect(screen.getAllByText('Took 12ms')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 2, name: 'Units' })).toBeInTheDocument();
    expect(screen.getByText('1 result for units')).toBeInTheDocument();
    const resultLists = screen.getAllByTestId('search-results-grid');
    expect(resultLists).toHaveLength(2);
    expect(within(resultLists[1]).getByText('Decimals unit')).toBeInTheDocument();
  });
});
