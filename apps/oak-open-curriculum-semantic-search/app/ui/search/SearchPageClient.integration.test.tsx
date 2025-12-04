import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import { LESSONS_SCOPE, UNITS_SCOPE, SEQUENCES_SCOPE } from '../../../src/lib/search-scopes';
import { buildSingleScopeFixture, buildEmptyFixture } from '../../lib/search-fixtures/builders';
import {
  STRUCTURED_EMPTY_RESULTS_MESSAGE,
  STRUCTURED_FIXTURE_OUTAGE_MESSAGE,
} from './content/structured-search-messages';
import {
  renderWithTheme,
  structuredPropsRef,
  facetPropsRef,
  resetSearchPageTestState,
  mockMatchMedia,
} from './SearchPageClient.test-helpers';

function getStructuredProps() {
  if (!structuredPropsRef.current) {
    throw new Error('StructuredSearch was not rendered or props not captured');
  }
  return structuredPropsRef.current;
}

function getFacetProps() {
  if (!facetPropsRef.current) {
    throw new Error('SearchFacets was not rendered or props not captured');
  }
  return facetPropsRef.current;
}

describe('SearchPageClient', () => {
  beforeEach(() => {
    resetSearchPageTestState();
  });

  it('applies theme-driven spacing to the main layout shell', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const content = screen.getByTestId('search-page-content');
    const computed = getComputedStyle(content);

    expect(computed.getPropertyValue('gap')).toBe('var(--app-gap-section)');
  });

  it('places hero and results within the primary grid so outcomes remain visible', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { initialFixtureMode: 'fixtures', showFixtureToggle: true });

    const primaryGrid = screen.getByTestId('search-primary-grid');
    expect(within(primaryGrid).getByLabelText('Search hero and controls')).toBeInTheDocument();
    expect(
      within(primaryGrid).getByText(
        /Begin a search to explore structured or natural language results/i,
      ),
    ).toBeInTheDocument();

    const fixture = buildSingleScopeFixture({});

    await waitFor(() => {
      expect(screen.getByTestId('structured-search')).toBeInTheDocument();
    });

    await act(async () => {
      getStructuredProps().onResults?.(fixture);
    });

    await waitFor(() => {
      expect(within(primaryGrid).getByText(/results for lessons/i)).toBeInTheDocument();
    });
  });

  it('shows motion-safe skeletons while a structured search is running', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { initialFixtureMode: 'fixtures', showFixtureToggle: true });

    await waitFor(() => {
      expect(screen.getByTestId('structured-search')).toBeInTheDocument();
    });

    await act(async () => {
      getStructuredProps().setLoading?.(true);
    });

    expect(screen.getByTestId('search-summary-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('search-results-skeleton')).toBeInTheDocument();

    const fixture = buildSingleScopeFixture({
      overrides: {
        facets: {
          sequences: [
            {
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
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('structured-search')).toBeInTheDocument();
    });

    await act(async () => {
      getStructuredProps().onResults?.(fixture);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('search-results-skeleton')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Using fixture scenario: success/i)).toBeInTheDocument();
    expect(screen.getByTestId('search-results-summary')).toBeInTheDocument();
  });

  it('shows only the structured form and skip link on the structured variant', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { variant: 'structured' });

    expect(screen.getByTestId('structured-search-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('natural-search-panel')).not.toBeInTheDocument();

    const skipNav = screen.getByRole('navigation', { name: /skip links/i });
    expect(
      within(skipNav).getByRole('link', { name: /structured search form/i }),
    ).toBeInTheDocument();
    expect(
      within(skipNav).queryByRole('link', { name: /natural language search form/i }),
    ).not.toBeInTheDocument();
  });

  it('shows only the natural form and skip link on the natural variant', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { variant: 'natural' });

    expect(screen.getByTestId('natural-search-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('structured-search-panel')).not.toBeInTheDocument();

    const skipNav = screen.getByRole('navigation', { name: /skip links/i });
    expect(
      within(skipNav).getByRole('link', { name: /natural language search form/i }),
    ).toBeInTheDocument();
    expect(
      within(skipNav).queryByRole('link', { name: /structured search form/i }),
    ).not.toBeInTheDocument();
  });

  it('invokes the structured search action when a facet is selected after a submission', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: UNITS_SCOPE, results: [], total: 0, took: 5, timedOut: false },
    });
    renderWithTheme(action);

    const basePayload: SearchStructuredRequest = {
      scope: UNITS_SCOPE,
      text: 'fractions',
      includeFacets: true,
    };

    await waitFor(() => {
      expect(screen.getByTestId('structured-search')).toBeInTheDocument();
    });

    await act(async () => {
      getStructuredProps().onSubmitPayload?.(basePayload);
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

    await waitFor(() => {
      expect(screen.getByTestId('facets')).toBeInTheDocument();
    });

    await act(async () => {
      getFacetProps().onSelectSequence?.(facet);
    });

    await waitFor(() => {
      expect(action).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: SEQUENCES_SCOPE,
          phaseSlug: 'maths-primary',
        }),
      );
    });
  });

  it('runs a follow-up search when the scope changes', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 7, timedOut: false },
    });
    renderWithTheme(action);

    const basePayload: SearchStructuredRequest = {
      scope: UNITS_SCOPE,
      text: 'fractions',
      includeFacets: true,
      subject: 'maths',
    };

    await act(async () => {
      getStructuredProps().onSubmitPayload?.(basePayload);
    });

    await act(async () => {
      getStructuredProps().onScopeChange?.(LESSONS_SCOPE);
    });

    await waitFor(() => {
      expect(action).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: LESSONS_SCOPE,
        }),
      );
    });
  });

  it('surfaces totals and suggestions when structured results arrive', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 5, timedOut: false },
    });
    renderWithTheme(action);

    const fixture = buildSingleScopeFixture({
      overrides: {
        facets: {
          sequences: [
            {
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
            },
          ],
        },
      },
    });

    const payload = {
      scope: LESSONS_SCOPE,
      results: [
        {
          id: 'lesson-1',
          rankScore: 1,
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
          scope: LESSONS_SCOPE,
          url: '/lessons/decimals-recap',
          contexts: {},
        },
      ],
      facets: fixture.facets,
    };

    await act(async () => {
      getStructuredProps().onResults?.(payload);
    });

    await waitFor(() => {
      expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
    });
    expect(screen.getByText('Took 9ms')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /decimals introduction/i }),
    ).toBeInTheDocument();
    const meta = screen.getAllByTestId('search-result-meta')[0];
    expect(within(meta).getByTestId('search-result-meta-subject')).toHaveTextContent(
      'Subject: maths',
    );
    expect(within(meta).getByTestId('search-result-meta-key-stage')).toHaveTextContent(
      'Key stage: ks2',
    );
    expect(screen.getByRole('button', { name: /decimals recap/i })).toBeInTheDocument();
    const summary = screen.getByTestId('search-results-summary');
    expect(summary).toHaveAttribute('data-sticky', 'true');
  });

  it('moves secondary panels into the support column alongside results', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 5, timedOut: false },
    });
    renderWithTheme(action);

    const fixture = buildSingleScopeFixture({
      overrides: {
        facets: {
          sequences: [
            {
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
            },
          ],
        },
      },
    });

    const payload = {
      scope: LESSONS_SCOPE,
      results: [
        {
          id: 'lesson-1',
          rankScore: 1,
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
          scope: LESSONS_SCOPE,
          url: '/lessons/decimals-recap',
          contexts: {},
        },
      ],
      facets: fixture.facets,
    };

    await act(async () => {
      getStructuredProps().onResults?.(payload);
    });

    const supportColumn = screen.getByTestId('search-support-column');
    expect(
      within(supportColumn).getByRole('heading', { level: 3, name: /suggestions/i }),
    ).toBeInTheDocument();
    expect(within(supportColumn).getByTestId('facets')).toBeInTheDocument();
  });

  it('collapses suggestion and facet panels behind mobile accordions', async () => {
    mockMatchMedia(false);
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 5, timedOut: false },
    });
    renderWithTheme(action);

    const fixture = buildSingleScopeFixture({
      overrides: {
        facets: {
          sequences: [
            {
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
            },
          ],
        },
      },
    });

    await act(async () => {
      getStructuredProps().onResults?.(fixture);
    });

    const mobileSupport = screen.getByTestId('search-support-mobile');
    const suggestionsToggle = within(mobileSupport).getByRole('button', {
      name: /toggle suggestions/i,
    });
    const facetsToggle = within(mobileSupport).getByRole('button', {
      name: /toggle programmes & units/i,
    });

    expect(suggestionsToggle).toHaveAttribute('aria-expanded', 'false');
    expect(facetsToggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(suggestionsToggle);

    await waitFor(() => {
      expect(suggestionsToggle).toHaveAttribute('aria-expanded', 'true');
    });
    const firstSuggestion = fixture.suggestions[0]?.label ?? '';
    if (firstSuggestion) {
      expect(
        within(mobileSupport).getByRole('button', { name: new RegExp(firstSuggestion, 'i') }),
      ).toBeInTheDocument();
    }

    fireEvent.click(facetsToggle);

    await waitFor(() => {
      expect(facetsToggle).toHaveAttribute('aria-expanded', 'true');
    });

    expect(within(mobileSupport).getByTestId('facets')).toBeInTheDocument();
  });

  it('replays structured search when a suggestion is selected', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 6, timedOut: false },
    });
    renderWithTheme(action);

    const basePayload: SearchStructuredRequest = {
      scope: LESSONS_SCOPE,
      text: 'fractions',
      includeFacets: true,
      subject: 'maths',
      keyStage: 'ks2',
    };

    await act(async () => {
      getStructuredProps().onSubmitPayload?.(basePayload);
    });

    const resultPayload = {
      scope: LESSONS_SCOPE,
      results: [],
      total: 1,
      took: 9,
      timedOut: false,
      suggestions: [
        {
          label: 'Decimals recap',
          scope: LESSONS_SCOPE,
          subject: 'maths',
          keyStage: 'ks2',
          url: '/lessons/decimals-recap',
          contexts: {},
        },
      ],
    };

    await act(async () => {
      getStructuredProps().onResults?.(resultPayload);
    });

    const suggestionButton = await screen.findByRole('button', { name: /decimals recap/i });

    fireEvent.click(suggestionButton);

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    const followUpPayload = action.mock.calls.at(-1)?.[0];
    expect(followUpPayload).toMatchObject({
      scope: LESSONS_SCOPE,
      text: 'Decimals recap',
      subject: 'maths',
      keyStage: 'ks2',
    });
    expect(followUpPayload?.phaseSlug).toBeUndefined();
  });

  it('renders fixture datasets when fixture mode is enabled', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 4, timedOut: false },
    });

    renderWithTheme(action, { initialFixtureMode: 'fixtures', showFixtureToggle: true });

    const fixture = buildSingleScopeFixture();

    await act(async () => {
      getStructuredProps().onResults?.(fixture);
    });

    expect(screen.getByText(/Using fixture scenario: success/i)).toBeInTheDocument();
    const headline = fixture.results[0]?.lesson?.lesson_title;
    if (headline) {
      expect(screen.getByText(headline)).toBeInTheDocument();
    }
  });

  it('shows fixture scenario pill when deterministic fixtures are enabled', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 4, timedOut: false },
    });

    renderWithTheme(action, { initialFixtureMode: 'fixtures', showFixtureToggle: true });

    expect(screen.getByText(/Using fixture scenario: success/i)).toBeInTheDocument();
  });

  it('announces deterministic empty fixtures and empty-state guidance', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 4, timedOut: false },
    });

    renderWithTheme(action, { initialFixtureMode: 'fixtures-empty', showFixtureToggle: true });

    expect(screen.getByText(/Using fixture scenario: empty dataset/i)).toBeInTheDocument();

    const emptyFixture = buildEmptyFixture({ scope: 'lessons' });

    await act(async () => {
      getStructuredProps().onResults?.(emptyFixture);
    });

    await waitFor(() => {
      expect(screen.getByText('0 results for lessons')).toBeInTheDocument();
    });

    expect(screen.getByText(STRUCTURED_EMPTY_RESULTS_MESSAGE)).toBeInTheDocument();
  });

  it('announces deterministic fixture outage messaging when errors occur', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 4, timedOut: false },
    });

    renderWithTheme(action, { initialFixtureMode: 'fixtures-error', showFixtureToggle: true });

    expect(screen.getByText(/Using fixture scenario: simulated outage/i)).toBeInTheDocument();

    await act(async () => {
      getStructuredProps().onError?.(STRUCTURED_FIXTURE_OUTAGE_MESSAGE);
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(STRUCTURED_FIXTURE_OUTAGE_MESSAGE);
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
