import { act, render, screen, waitFor } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../themes/light';
import type { StructuredBody } from '../structured-search.shared';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import type { StructuredSearchAction } from '../StructuredSearch';
import SearchPageClient from './SearchPageClient';

type StructuredComponentProps = {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  onScopeChange?: (scope: StructuredBody['scope']) => void;
  onSubmitPayload?: (payload: StructuredBody) => void;
  action?: StructuredSearchAction;
};

type FacetComponentProps = {
  facets: unknown;
  onSelectSequence?: (facet: SequenceFacet) => void;
};

const structuredPropsRef: { current: StructuredComponentProps | null } = { current: null };
const facetPropsRef: { current: FacetComponentProps | null } = { current: null };

function renderStructured(props: StructuredComponentProps): JSX.Element {
  structuredPropsRef.current = props;
  return <div data-testid="structured-search" />;
}

function renderFacets(props: FacetComponentProps): JSX.Element {
  facetPropsRef.current = props;
  return <div data-testid="facets" />;
}

vi.mock('../StructuredSearch', () => ({
  StructuredSearch: renderStructured,
  default: renderStructured,
}));

vi.mock('../SearchFacets', () => ({
  SearchFacets: renderFacets,
}));

function renderWithTheme(action: StructuredSearchAction): void {
  render(
    <StyledThemeProvider theme={createLightTheme()}>
      <SearchPageClient searchStructured={action} />
    </StyledThemeProvider>,
  );
}

describe('SearchPageClient', () => {
  beforeEach(() => {
    structuredPropsRef.current = null;
    facetPropsRef.current = null;
  });

  it('invokes the structured search action when a facet is selected after a submission', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'units', results: [], total: 0, took: 5, timedOut: false },
    });
    renderWithTheme(action);

    const basePayload: StructuredBody = {
      scope: 'units',
      text: 'fractions',
      includeFacets: true,
    };

    await act(async () => {
      structuredPropsRef.current?.onSubmitPayload?.(basePayload);
    });

    const facet: SequenceFacet = {
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
    };

    await act(async () => {
      facetPropsRef.current?.onSelectSequence?.(facet);
    });

    await waitFor(() => {
      expect(action).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: 'sequences',
          phaseSlug: 'maths-primary',
        }),
      );
    });
  });

  it('runs a follow-up search when the scope changes', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 7, timedOut: false },
    });
    renderWithTheme(action);

    const basePayload: StructuredBody = {
      scope: 'units',
      text: 'fractions',
      includeFacets: true,
      subject: 'maths',
    };

    await act(async () => {
      structuredPropsRef.current?.onSubmitPayload?.(basePayload);
    });

    await act(async () => {
      structuredPropsRef.current?.onScopeChange?.('lessons');
    });

    await waitFor(() => {
      expect(action).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: 'lessons',
        }),
      );
    });
  });

  it('surfaces totals and suggestions when structured results arrive', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 5, timedOut: false },
    });
    renderWithTheme(action);

    const payload = {
      scope: 'lessons',
      results: [
        {
          id: 'lesson-1',
          lesson: {
            lesson_title: 'Decimals introduction',
            subject_slug: 'maths',
            key_stage: 'ks2',
          },
          highlights: [],
        },
      ],
      total: 1,
      took: 9,
      timedOut: false,
      suggestions: [
        {
          label: 'Decimals recap',
          scope: 'lessons' as const,
          url: '/lessons/decimals-recap',
          contexts: {},
        },
      ],
    };

    await act(async () => {
      structuredPropsRef.current?.onResults?.(payload);
    });

    await waitFor(() => {
      expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    });
    expect(screen.getByText('Took 9ms')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decimals recap/i })).toBeInTheDocument();
  });
});
