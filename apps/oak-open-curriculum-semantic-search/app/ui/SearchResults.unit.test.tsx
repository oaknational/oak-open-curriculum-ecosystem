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

  it('DEBUG inspect rendered markup', () => {
    const { container } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchResults results={[sampleResult]} meta={sampleMeta} />
      </OakThemeProvider>,
    );

    // eslint-disable-next-line no-console
    console.log(container.innerHTML);
    expect(true).toBe(false);
  });
});
