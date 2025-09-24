import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach, afterAll } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../ui/themes/light';
import AdminPage from './page';

type UseStreamState = 'idle' | 'running' | 'error';

const { runSpy, useStreamMock } = vi.hoisted(() => {
  const run = vi.fn<() => Promise<void>>(() => Promise.resolve());
  const stream = vi.fn(
    (
      url: string,
      method: 'GET' | 'POST',
    ): { state: UseStreamState; text: string; run: () => Promise<void> } => {
      if (url === '/api/admin/index-oak') {
        return { state: 'running', text: 'Indexing…', run };
      }
      return { state: 'idle', text: `${method} ${url}`, run };
    },
  );

  return { runSpy: run, useStreamMock: stream };
});

const fetchMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      summary: {
        total: 0,
        byScope: { lessons: 0, units: 0, sequences: 0 },
        latestIndexVersion: null,
      },
      recent: [],
    }),
  }),
);

vi.mock('../lib/useStream', () => ({
  useStream: useStreamMock,
}));

vi.stubGlobal('fetch', fetchMock);

function renderWithTheme(): void {
  render(
    <StyledThemeProvider theme={createLightTheme()}>
      <AdminPage />
    </StyledThemeProvider>,
  );
}

describe('AdminPage', () => {
  beforeEach(() => {
    runSpy.mockClear();
    useStreamMock.mockClear();
    fetchMock.mockClear();
  });

  afterEach(() => {
    fetchMock.mockClear();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders headings and stream outputs with Oak-wrapped buttons', async () => {
    renderWithTheme();

    const adminHeading = await screen.findByRole('heading', { level: 1, name: 'Admin tools' });
    const elasticHeading = await screen.findByRole('heading', {
      level: 2,
      name: 'Elasticsearch setup',
    });
    const zeroHitHeadings = await screen.findAllByRole('heading', {
      level: 2,
      name: 'Zero-hit telemetry',
    });

    expect(adminHeading).toBeInTheDocument();
    expect(elasticHeading).toBeInTheDocument();
    expect(zeroHitHeadings.length).toBeGreaterThan(0);
    await screen.findByText('No zero-hit events recorded yet.');

    const statusRegions = screen.getAllByRole('status');
    expect(statusRegions).toHaveLength(3);
    expect(statusRegions[0]).toHaveTextContent('POST /api/admin/elastic-setup');
    expect(statusRegions[1]).toHaveTextContent('Indexing…');
    expect(statusRegions[2]).toHaveTextContent('GET /api/admin/rebuild-rollup');
  });

  it('invokes the stream runner when an action button is clicked', async () => {
    renderWithTheme();

    const buttons = await screen.findAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Run');

    fireEvent.click(buttons[0]);

    expect(runSpy).toHaveBeenCalledTimes(1);
  });

  it('shows loading state for in-progress actions', async () => {
    renderWithTheme();

    const allButtons = await screen.findAllByRole('button');
    const runningButton = allButtons.find((button) => button.textContent?.includes('Running…'));
    expect(runningButton).toBeDefined();
  });
});
