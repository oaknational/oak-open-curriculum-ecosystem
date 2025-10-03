import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { SearchResults } from './SearchResults';
import type { MultiScopeBucketView, SearchMeta } from './client/useSearchController';
import { createLightTheme } from './themes/light';
import { STRUCTURED_EMPTY_RESULTS_MESSAGE } from './content/structured-search-messages';

describe('SearchResults', () => {
  const sampleMeta: SearchMeta = {
    scope: 'lessons',
    total: 1,
    took: 12,
    timedOut: false,
  };

  const sampleResult = {
    id: 'lesson-1',
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
      results?: unknown[];
      meta?: SearchMeta | null;
      multiBuckets?: MultiScopeBucketView[] | null;
    } = {},
  ) {
    const {
      mode = 'single',
      results = [sampleResult],
      meta = sampleMeta,
      multiBuckets = null,
    } = overrides;

    return render(
      <StyledThemeProvider theme={createLightTheme()}>
        <OakThemeProvider theme={oakDefaultTheme}>
          <SearchResults mode={mode} results={results} meta={meta} multiBuckets={multiBuckets} />
        </OakThemeProvider>
      </StyledThemeProvider>,
    );
  }

  it('renders totals and timing information from meta', () => {
    renderWithProviders();

    expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    expect(screen.getByText('Took 12ms')).toBeInTheDocument();
    expect(screen.getByText(/Decimals introduction/)).toBeInTheDocument();
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
    const { container } = renderResults();

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
    expect(itemStyles.padding).toBe('1rem');
    expect(itemStyles.borderRadius).toBe('0.25rem');
    expect(itemStyles.borderTopWidth).toBe('0.063rem');
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
