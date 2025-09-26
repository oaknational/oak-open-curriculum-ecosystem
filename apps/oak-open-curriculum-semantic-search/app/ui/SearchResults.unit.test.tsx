import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { SearchResults } from './SearchResults';
import type { SearchMeta } from './client/useSearchController';
import { createLightTheme } from './themes/light';

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

  function renderWithProviders(results: unknown[], meta?: SearchMeta) {
    return render(
      <StyledThemeProvider theme={createLightTheme()}>
        <OakThemeProvider theme={oakDefaultTheme}>
          <SearchResults results={results} meta={meta} />
        </OakThemeProvider>
      </StyledThemeProvider>,
    );
  }

  it('renders totals and timing information from meta', () => {
    renderWithProviders([sampleResult], sampleMeta);

    expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    expect(screen.getByText('Took 12ms')).toBeInTheDocument();
    expect(screen.getByText(/Decimals introduction/)).toBeInTheDocument();
  });

  it('announces when the query timed out', () => {
    const meta: SearchMeta = { ...sampleMeta, timedOut: true, took: 15 };

    renderWithProviders([sampleResult], meta);

    expect(
      screen.getByText('Took 15ms. Results may be incomplete (timed out).'),
    ).toBeInTheDocument();
  });

  function renderResults(meta: SearchMeta = sampleMeta) {
    return renderWithProviders([sampleResult], meta);
  }

  it('applies Oak spacing and border tokens to the results list', () => {
    const { container } = renderResults();

    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    const sectionEl = section as HTMLElement;
    expect(sectionEl.getAttribute('aria-live')).toBe('polite');

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
});
