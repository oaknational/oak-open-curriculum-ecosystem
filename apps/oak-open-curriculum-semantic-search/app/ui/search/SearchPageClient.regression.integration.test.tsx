import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../themes/light';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import SearchPageClient from './SearchPageClient';
import { FixtureModeProvider } from '../global/Fixture/FixtureModeContext';

describe('SearchPageClient regression', () => {
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
        <FixtureModeProvider initialMode="live">
          <SearchPageClient
            searchStructured={action}
            initialFixtureMode="live"
            showFixtureToggle={false}
          />
        </FixtureModeProvider>
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
