import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// Mock theme-utils to control system preference and subscription behavior
vi.mock('./theme-utils', async () => {
  const actual = await vi.importActual('./theme-utils');
  return {
    ...actual,
    getSystemPrefersDark: () => false,
    subscribeToSystemPrefersDark: (onChange: (pref: boolean) => void) => {
      // Simulate an async system change to dark
      setTimeout(() => {
        try {
          onChange(true);
        } catch {
          // ignore
        }
      }, 0);
      return () => undefined;
    },
  };
});

import { ThemeProvider, useThemeContext } from './ThemeContext';

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
    render(
      <ThemeProvider initialMode="system">
        <ResolvedProbe />
      </ThemeProvider>,
    );

    // Initial mocked _resolved_system preference is light
    expect(screen.getByTestId('resolved').textContent).toBe('light');

    // Advance timers to trigger mocked system change to dark
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });
});
