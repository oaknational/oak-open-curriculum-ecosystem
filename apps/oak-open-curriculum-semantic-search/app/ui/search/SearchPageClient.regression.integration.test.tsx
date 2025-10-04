import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../themes/light';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import SearchPageClient from './SearchPageClient';
import type { FixtureMode } from '../../lib/fixture-mode';

const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const setFixtureModeMock = vi.hoisted(() => vi.fn<(mode: FixtureMode) => Promise<void>>());

vi.mock('../global/Fixture/fixture-mode-toggle.actions', () => ({
  setFixtureMode: setFixtureModeMock,
}));

describe('SearchPageClient regression', () => {
  beforeEach(() => {
    refreshMock.mockReset();
    setFixtureModeMock.mockReset();
    setFixtureModeMock.mockResolvedValue(undefined);
  });

  it('does not emit repeated errors after a successful structured search submission', async () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: {
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
        took: 5,
        timedOut: false,
        suggestions: [],
      },
    });

    render(
      <StyledThemeProvider theme={createLightTheme()}>
        <SearchPageClient
          searchStructured={action}
          initialFixtureMode="live"
          showFixtureToggle={false}
        />
      </StyledThemeProvider>,
    );

    const structuredPanel = screen.getByTestId('structured-search-panel');
    const queryInput = within(structuredPanel).getByLabelText('Query');

    fireEvent.change(queryInput, { target: { value: 'fractions' } });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('structured-search-form'));
    });

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    expect(screen.getByText('1 result for lessons')).toBeInTheDocument();
  });
});
