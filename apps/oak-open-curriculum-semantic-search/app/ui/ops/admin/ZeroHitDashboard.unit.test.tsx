import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { ReactNode } from 'react';
import { createLightTheme } from '../../themes/light';
import { ZeroHitDashboard } from './ZeroHitDashboard';

const sampleResponse = {
  summary: {
    total: 3,
    byScope: { lessons: 1, units: 1, sequences: 1 },
    latestIndexVersion: 'v-test',
  },
  recent: [
    {
      timestamp: 1_700_000_000_000,
      scope: 'lessons' as const,
      text: 'fractions',
      filters: { subject: 'maths' },
      indexVersion: 'v-test',
    },
  ],
};

type FetchMock = ReturnType<typeof vi.fn>;

function withTheme(children: ReactNode) {
  return <StyledThemeProvider theme={createLightTheme()}>{children}</StyledThemeProvider>;
}

describe('ZeroHitDashboard', () => {
  let fetchMock: FetchMock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleResponse,
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders summary cards and recent events', async () => {
    render(withTheme(<ZeroHitDashboard />));

    await screen.findByText('Total zero-hit queries');
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('fractions')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network error'));
    render(withTheme(<ZeroHitDashboard />));

    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent('network error');
  });

  it('supports manual refresh', async () => {
    render(withTheme(<ZeroHitDashboard />));

    await screen.findByText('Total zero-hit queries');
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleResponse,
    });

    const button = screen.getByRole('button', { name: 'Refresh' });
    fireEvent.click(button);

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
