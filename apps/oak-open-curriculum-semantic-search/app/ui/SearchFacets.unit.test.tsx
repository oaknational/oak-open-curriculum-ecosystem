import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import type { SequenceFacet } from '../../src/lib/hybrid-search/types';
import { SearchFacets } from './SearchFacets';

const sampleFacet = (overrides: Partial<SequenceFacet> = {}): SequenceFacet => ({
  subjectSlug: 'maths',
  sequenceSlug: 'fractions-programme',
  keyStage: 'ks2',
  keyStageTitle: 'Key stage 2',
  phaseSlug: 'maths-primary',
  phaseTitle: 'Mathematics primary',
  years: ['4'],
  units: [{ unitSlug: 'unit-1', unitTitle: 'Unit 1' }],
  unitCount: 12,
  lessonCount: 60,
  hasKs4Options: false,
  sequenceUrl: 'https://oak.example/fractions-programme',
  ...overrides,
});

describe('SearchFacets', () => {
  it('invokes a callback when a sequence facet is activated', () => {
    const onSelect = vi.fn();
    const facet = sampleFacet();
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchFacets facets={{ sequences: [facet] }} onSelectSequence={onSelect} />
      </OakThemeProvider>,
    );

    const button = screen.getByRole('button', { name: /fractions-programme/i });
    fireEvent.click(button);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(facet);
    expect(screen.getByText('1 programme')).toBeInTheDocument();
  });
});
