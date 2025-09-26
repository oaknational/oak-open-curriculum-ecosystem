import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { SearchResults } from './SearchResults';
import type { SearchMeta } from './client/useSearchController';

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

  it('renders totals and timing information from meta', () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchResults results={[sampleResult]} meta={sampleMeta} />
      </OakThemeProvider>,
    );

    expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    expect(screen.getByText('Took 12ms')).toBeInTheDocument();
    expect(screen.getByText(/Decimals introduction/)).toBeInTheDocument();
  });

  it('announces when the query timed out', () => {
    const meta: SearchMeta = { ...sampleMeta, timedOut: true, took: 15 };

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchResults results={[sampleResult]} meta={meta} />
      </OakThemeProvider>,
    );

    expect(
      screen.getByText('Took 15ms. Results may be incomplete (timed out).'),
    ).toBeInTheDocument();
  });

  function renderResults(meta: SearchMeta = sampleMeta) {
    return render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchResults results={[sampleResult]} meta={meta} />
      </OakThemeProvider>,
    );
  }

  function queryRequired<T extends Element>(container: HTMLElement, selector: string): T {
    const node = container.querySelector(selector);
    expect(node).not.toBeNull();
    return node as T;
  }

  it('applies Oak spacing and border tokens to the results list', () => {
    const { container } = renderResults();

    const section = queryRequired<HTMLElement>(container, 'section');
    expect(section.getAttribute('aria-live')).toBe('polite');

    const list = queryRequired<HTMLElement>(container, 'ul');
    const listStyles = getComputedStyle(list);
    expect(listStyles.display).toBe('grid');
    expect(listStyles.getPropertyValue('row-gap')).toBe('var(--app-gap-section)');
    expect(listStyles.getPropertyValue('column-gap')).toBe('var(--app-gap-grid)');

    const item = queryRequired<HTMLElement>(list, 'li');
    const itemStyles = getComputedStyle(item);
    expect(itemStyles.padding).toBe('1rem');
    expect(itemStyles.borderRadius).toBe('0.25rem');
    expect(itemStyles.borderTopWidth).toBe('0.063rem');
  });
});
