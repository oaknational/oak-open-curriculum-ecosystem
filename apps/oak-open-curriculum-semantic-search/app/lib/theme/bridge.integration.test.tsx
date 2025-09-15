import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useTheme } from 'styled-components';
import { useColorMode } from './ColorModeContext.js';
import { Providers as AppProviders } from '../Providers.js';

function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders initialMode="light">{children}</AppProviders>;
}

describe('Bridge theming (ADR-045)', () => {
  it('emits a CSS variables style tag', () => {
    render(
      <Providers>
        <div data-testid="probe">probe</div>
      </Providers>,
    );
    const styleEl = document.getElementById('app-theme-vars');
    expect(styleEl).toBeTruthy();
    expect(styleEl?.textContent || '').toMatch(/--app-space-md/);
  });

  it('exposes theme.app tokens to styled-components consumers', () => {
    const TokenProbe = () => {
      const theme = useTheme() as unknown as { app?: { space?: { md?: string } } };
      return <span data-testid="token-md">{theme?.app?.space?.md ?? 'missing'}</span>;
    };
    render(
      <Providers>
        <TokenProbe />
      </Providers>,
    );
    expect(screen.getByTestId('token-md').textContent).toBeTruthy();
  });

  it('changes semantic tokens and CSS vars when mode toggles', () => {
    const ColorProbe = () => {
      const theme = useTheme() as unknown as { app?: { colors?: { headerBorder?: string } } };
      return <span data-testid="color">{theme?.app?.colors?.headerBorder ?? 'missing'}</span>;
    };
    const Toggler = () => {
      const { setMode } = useColorMode();
      return (
        <button onClick={() => setMode('dark')} data-testid="toggle2">
          to dark
        </button>
      );
    };

    render(
      <Providers>
        <Toggler />
        <ColorProbe />
      </Providers>,
    );
    const before = screen.getAllByTestId('color')[0].textContent;
    const rootEl = document.getElementById('app-theme-root') as HTMLElement;
    const cssBefore = getComputedStyle(rootEl).getPropertyValue('--app-color-header-border');

    act(() => {
      screen.getByTestId('toggle2').click();
    });

    const after = screen.getAllByTestId('color')[0].textContent;
    const cssAfter = getComputedStyle(rootEl).getPropertyValue('--app-color-header-border');
    expect(after).not.toBe(before);
    expect(cssAfter.trim()).not.toBe(cssBefore.trim());
  });

  it('syncs wrapper data-theme when mode toggles', () => {
    const Toggle = () => {
      const { mode, setMode } = useColorMode();
      return (
        <button onClick={() => setMode('dark')} data-testid="toggle">
          {mode}
        </button>
      );
    };
    render(
      <Providers>
        <Toggle />
      </Providers>,
    );
    expect(document.getElementById('app-theme-root')?.dataset.theme).toBe('light');
    act(() => {
      screen.getByTestId('toggle').click();
    });
    expect(document.getElementById('app-theme-root')?.dataset.theme).toBe('dark');
  });
});
