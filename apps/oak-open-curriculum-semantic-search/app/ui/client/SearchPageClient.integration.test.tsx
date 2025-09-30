import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../themes/light';
import type { StructuredBody } from '../structured-search.shared';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import type { StructuredSearchAction } from '../StructuredSearch';
import type { FixtureMode } from '../../lib/fixture-mode';
import SearchPageClient from './SearchPageClient';

const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const setFixtureModeMock = vi.hoisted(() => vi.fn<(mode: FixtureMode) => Promise<void>>());

vi.mock('../fixture-mode-toggle.actions', () => ({
  setFixtureMode: setFixtureModeMock,
}));

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
  return (
    <div data-testid="structured-search">
      <form aria-label="Structured search form" role="form">
        <label htmlFor="structured-phase-select">Phase</label>
        <select id="structured-phase-select" defaultValue="">
          <option value="">(any)</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </form>
    </div>
  );
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

type AppTheme = ReturnType<typeof createLightTheme>;

function renderWithTheme(
  action: StructuredSearchAction,
  options: {
    theme?: AppTheme;
    initialFixtureMode?: FixtureMode;
    showFixtureToggle?: boolean;
  } = {},
): AppTheme {
  const {
    theme = createLightTheme(),
    initialFixtureMode = 'live',
    showFixtureToggle = false,
  } = options;

  render(
    <StyledThemeProvider theme={theme}>
      <SearchPageClient
        searchStructured={action}
        initialFixtureMode={initialFixtureMode}
        showFixtureToggle={showFixtureToggle}
      />
    </StyledThemeProvider>,
  );
  return theme;
}

describe('SearchPageClient', () => {
  beforeEach(() => {
    structuredPropsRef.current = null;
    facetPropsRef.current = null;
    refreshMock.mockReset();
    setFixtureModeMock.mockReset();
    setFixtureModeMock.mockResolvedValue(undefined);
  });

  it('links the hero copy to the structured and natural search panels', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const structuredLink = screen.getByRole('link', { name: /jump to structured search/i });
    const naturalLink = screen.getByRole('link', { name: /try the natural language search/i });

    expect(structuredLink).toHaveAttribute('href', '#structured-search-panel');
    expect(naturalLink).toHaveAttribute('href', '#natural-search-panel');
  });

  it('surfaces the structured Phase selector with an accessible label', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const structuredPanel = screen.getByTestId('structured-search-panel');
    const phaseSelect = within(structuredPanel).getByLabelText('Phase');

    expect(phaseSelect).toHaveAttribute('id', 'structured-phase-select');
    const options = within(phaseSelect).getAllByRole('option');
    const optionLabels = options.map((opt) => opt.textContent?.trim());
    expect(optionLabels).toEqual(['(any)', 'Primary', 'Secondary']);
  });

  it('caps the main layout inline size using the app layout CSS variable', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const content = screen.getByTestId('search-page-content');
    const computed = getComputedStyle(content);
    expect(computed.getPropertyValue('max-width')).toBe(
      'min(100%, var(--app-layout-container-max-width))',
    );
  });

  it('allows developers to toggle fixture mode when the toggle is visible', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { showFixtureToggle: true, initialFixtureMode: 'fixtures' });

    expect(screen.getByText(/Search data: Fixtures/i)).toBeInTheDocument();
    const toggleButton = screen.getByTestId('fixture-mode-toggle');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(setFixtureModeMock).toHaveBeenCalledWith('live');
      expect(refreshMock).toHaveBeenCalled();
    });

    expect(screen.getByText(/Search data: Live/i)).toBeInTheDocument();
  });

  it('applies theme-driven spacing to the main layout shell', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const content = screen.getByTestId('search-page-content');
    const computed = getComputedStyle(content);

    expect(computed.getPropertyValue('gap')).toBe('var(--app-gap-section)');
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

  it('replays structured search when a suggestion is selected', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: 'lessons', results: [], total: 0, took: 6, timedOut: false },
    });
    renderWithTheme(action);

    const basePayload: StructuredBody = {
      scope: 'lessons',
      text: 'fractions',
      includeFacets: true,
      subject: 'maths',
      keyStage: 'ks2',
    };

    await act(async () => {
      structuredPropsRef.current?.onSubmitPayload?.(basePayload);
    });

    const resultPayload = {
      scope: 'lessons',
      results: [],
      total: 1,
      took: 9,
      timedOut: false,
      suggestions: [
        {
          label: 'Decimals recap',
          scope: 'lessons' as const,
          subject: 'maths',
          keyStage: 'ks2',
          url: '/lessons/decimals-recap',
          contexts: {},
        },
      ],
    };

    await act(async () => {
      structuredPropsRef.current?.onResults?.(resultPayload);
    });

    const suggestionButton = await screen.findByRole('button', { name: /decimals recap/i });

    fireEvent.click(suggestionButton);

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    const followUpPayload = action.mock.calls.at(-1)?.[0];
    expect(followUpPayload).toMatchObject({
      scope: 'lessons',
      text: 'Decimals recap',
      subject: 'maths',
      keyStage: 'ks2',
    });
    expect(followUpPayload?.phaseSlug).toBeUndefined();
  });
});
