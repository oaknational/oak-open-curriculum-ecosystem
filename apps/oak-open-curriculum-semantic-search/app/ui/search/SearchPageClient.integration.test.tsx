import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../themes/light';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import type { FixtureMode } from '../../lib/fixture-mode';
import SearchPageClient from './SearchPageClient';
import { LESSONS_SCOPE, UNITS_SCOPE, SEQUENCES_SCOPE } from '../../../src/lib/search-scopes';
import { buildSingleScopeFixture, buildEmptyFixture } from '../../lib/search-fixtures/builders';
import {
  STRUCTURED_EMPTY_RESULTS_MESSAGE,
  STRUCTURED_FIXTURE_OUTAGE_MESSAGE,
} from './content/structured-search-messages';
import { FixtureModeProvider } from '../global/Fixture/FixtureModeContext';

const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const setFixtureModeMock = vi.hoisted(() => vi.fn<(mode: FixtureMode) => Promise<void>>());

vi.mock('../global/Fixture/fixture-mode-toggle.actions', () => ({
  setFixtureMode: setFixtureModeMock,
}));

type StructuredComponentProps = {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  onScopeChange?: (scope: SearchStructuredRequest['scope']) => void;
  onSubmitPayload?: (payload: SearchStructuredRequest) => void;
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

vi.mock('./structured/StructuredSearch', () => ({
  StructuredSearch: renderStructured,
  default: renderStructured,
}));

vi.mock('./components/SearchFacets', () => ({
  SearchFacets: renderFacets,
}));

type AppTheme = ReturnType<typeof createLightTheme>;

function renderWithTheme(
  action: StructuredSearchAction,
  options: {
    theme?: AppTheme;
    initialFixtureMode?: FixtureMode;
    showFixtureToggle?: boolean;
    variant?: 'default' | 'structured' | 'natural';
  } = {},
): AppTheme {
  const {
    theme = createLightTheme(),
    initialFixtureMode = 'live',
    showFixtureToggle = false,
    variant = 'default',
  } = options;

  render(
    <StyledThemeProvider theme={theme}>
      <FixtureModeProvider initialMode={initialFixtureMode}>
        <SearchPageClient
          searchStructured={action}
          initialFixtureMode={initialFixtureMode}
          showFixtureToggle={showFixtureToggle}
          variant={variant}
        />
      </FixtureModeProvider>
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

  it('routes the hero CTAs to dedicated structured and natural search pages', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const structuredLink = screen.getByRole('link', { name: /open structured search/i });
    const naturalLink = screen.getByRole('link', { name: /open natural language search/i });

    expect(structuredLink).toHaveAttribute('href', '/structured_search');
    expect(naturalLink).toHaveAttribute('href', '/natural_language_search');
  });

  it('presents structured-only hero messaging and skip links on the structured route', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 5, timedOut: false },
    });

    renderWithTheme(action, { variant: 'structured' });

    expect(
      screen.getByRole('heading', { level: 1, name: /structured search/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/filter the oak curriculum catalogue by subject, key stage and scope/i),
    ).toBeInTheDocument();

    const skipLinksNav = screen.getByRole('navigation', { name: /skip links/i });
    const skipLinks = within(skipLinksNav).getAllByRole('link');
    expect(skipLinks).toHaveLength(2);
    expect(skipLinks[0]).toHaveAccessibleName(/skip to structured search form/i);
    expect(skipLinks[1]).toHaveAccessibleName(/skip to structured results/i);

    expect(screen.queryByTestId('natural-search-panel')).not.toBeInTheDocument();
  });

  it('surfaces natural language hero messaging, prompt-only controls, and skip links on the natural route', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 4, timedOut: false },
    });

    renderWithTheme(action, { variant: 'natural' });

    expect(
      screen.getByRole('heading', { level: 1, name: /natural language search/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/describe what you need in plain language/i)).toBeInTheDocument();

    expect(screen.getByLabelText('Describe what you need')).toBeInTheDocument();
    expect(screen.queryByLabelText('Scope')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Subject')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Key Stage')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Phase')).not.toBeInTheDocument();

    const summary = screen.getByTestId('natural-summary');
    expect(
      within(summary).getByRole('heading', { level: 3, name: /derived parameters/i }),
    ).toBeInTheDocument();
    expect(summary).toHaveTextContent(/Submit a prompt to populate the derived summary/i);

    const skipLinksNav = screen.getByRole('navigation', { name: /skip links/i });
    const skipLinks = within(skipLinksNav).getAllByRole('link');
    expect(skipLinks).toHaveLength(2);
    expect(skipLinks[0]).toHaveAccessibleName(/skip to natural language search form/i);
    expect(skipLinks[1]).toHaveAccessibleName(/skip to natural language results/i);

    expect(screen.queryByTestId('structured-search-panel')).not.toBeInTheDocument();
  });

  it('surfaces the structured Phase selector with an accessible label', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
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
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const content = screen.getByTestId('search-page-content');
    const computed = getComputedStyle(content);
    expect(computed.getPropertyValue('max-width')).toBe(
      'min(100%, var(--app-layout-container-max-width))',
    );
  });

  it('renders a fixture scenario pill when fixtures are enabled on the page', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { showFixtureToggle: true, initialFixtureMode: 'fixtures-empty' });

    expect(screen.getByText(/Using fixture scenario: empty dataset/i)).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: /search data/i })).not.toBeInTheDocument();
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
      structuredPropsRef.current?.onSubmitPayload?.(basePayload);
    });

    await act(async () => {
      structuredPropsRef.current?.onScopeChange?.(LESSONS_SCOPE);
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
      structuredPropsRef.current?.onSubmitPayload?.(basePayload);
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
      structuredPropsRef.current?.onResults?.(resultPayload);
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
      structuredPropsRef.current?.onResults?.(fixture);
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
      structuredPropsRef.current?.onResults?.(emptyFixture);
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
      structuredPropsRef.current?.onError?.(STRUCTURED_FIXTURE_OUTAGE_MESSAGE);
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(STRUCTURED_FIXTURE_OUTAGE_MESSAGE);
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
