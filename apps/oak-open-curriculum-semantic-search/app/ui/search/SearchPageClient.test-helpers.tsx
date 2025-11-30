import { render } from '@testing-library/react';
import type { JSX } from 'react';
import { vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import type { FixtureMode } from '../../lib/fixture-mode';
import { FixtureModeProvider } from '../global/Fixture/FixtureModeContext';
import { createLightTheme } from '../themes/light';
import { mockMatchMedia as createMockMatchMedia } from './mock-match-media';
import SearchPageClient from './SearchPageClient';

export const refreshMock = vi.fn<AppRouterInstance['refresh']>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const setFixtureModeMock = vi.hoisted(() => vi.fn<(mode: FixtureMode) => Promise<void>>());

vi.mock('../global/Fixture/fixture-mode-toggle.actions', () => ({
  setFixtureMode: setFixtureModeMock,
}));

interface StructuredComponentProps {
  onResults: (result: unknown | null) => void;
  onError: (message: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  onScopeChange?: (scope: SearchStructuredRequest['scope']) => void;
  onSubmitPayload?: (payload: SearchStructuredRequest) => void;
  action?: StructuredSearchAction;
}

interface FacetComponentProps {
  facets: unknown;
  onSelectSequence?: (facet: SequenceFacet) => void;
}

export const structuredPropsRef: { current: StructuredComponentProps | null } = { current: null };
export const facetPropsRef: { current: FacetComponentProps | null } = { current: null };

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

export const mockMatchMedia = createMockMatchMedia;

export type AppTheme = ReturnType<typeof createLightTheme>;

const FIXTURE_MODES: readonly FixtureMode[] = [
  'fixtures',
  'fixtures-empty',
  'fixtures-error',
  'live',
] as const;
const VARIANTS = ['default', 'structured', 'natural'] as const;

function isAppTheme(value: unknown): value is AppTheme {
  return typeof value === 'object' && value !== null && 'app' in value;
}

function isFixtureMode(value: unknown): value is FixtureMode {
  return typeof value === 'string' && FIXTURE_MODES.some((mode) => mode === value);
}

function isVariant(value: unknown): value is (typeof VARIANTS)[number] {
  return typeof value === 'string' && VARIANTS.some((candidate) => candidate === value);
}

export function renderWithTheme(
  action: StructuredSearchAction,
  options: {
    theme?: AppTheme;
    initialFixtureMode?: FixtureMode;
    showFixtureToggle?: boolean;
    variant?: 'default' | 'structured' | 'natural';
  } = {},
): AppTheme {
  let theme: AppTheme = createLightTheme();
  if (isAppTheme(options.theme)) {
    theme = options.theme;
  }

  let initialFixtureMode: FixtureMode = 'live';
  if (isFixtureMode(options.initialFixtureMode)) {
    initialFixtureMode = options.initialFixtureMode;
  }

  const showFixtureToggle = options.showFixtureToggle === true;

  let variant: 'default' | 'structured' | 'natural' = 'default';
  if (isVariant(options.variant)) {
    variant = options.variant;
  }

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

export function resetSearchPageTestState(): void {
  mockMatchMedia(true);
  structuredPropsRef.current = null;
  facetPropsRef.current = null;
  refreshMock.mockReset();
  setFixtureModeMock.mockReset();
  setFixtureModeMock.mockResolvedValue(undefined);
}
