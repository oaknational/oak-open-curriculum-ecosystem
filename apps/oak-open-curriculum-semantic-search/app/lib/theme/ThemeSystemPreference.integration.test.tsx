import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from './ThemeContext';
import { MediaQueryContext } from '../media-query/MediaQueryContext';

function ResolvedProbe(): React.JSX.Element {
  const { resolved } = useThemeContext();
  return <span data-testid="resolved">{resolved}</span>;
}

describe('ThemeProvider system preference subscription', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates resolved when system preference changes (mocked)', async () => {
    // Create a mock MediaQueryList that starts as light and changes to dark
    let changeListener: ((event: MediaQueryListEvent) => void) | null = null;
    const mockMatchMedia = vi.fn((query: string) => {
      const mql = {
        matches: false, // Initial: light mode
        media: query,
        onchange: null,
        addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            changeListener = listener;
          }
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      } as unknown as MediaQueryList;
      return mql;
    });

    const mockAPI = {
      matchMedia: mockMatchMedia,
    };

    render(
      <MediaQueryContext.Provider value={mockAPI}>
        <ThemeProvider initialMode="system">
          <ResolvedProbe />
        </ThemeProvider>
      </MediaQueryContext.Provider>,
    );

    // Initial system preference is light
    expect(screen.getByTestId('resolved').textContent).toBe('light');

    // Simulate system preference change to dark
    if (changeListener) {
      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked above
        changeListener!({
          matches: true,
          media: '(prefers-color-scheme: dark)',
        } as MediaQueryListEvent);
      });
    }

    // Should update to dark
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });
});
