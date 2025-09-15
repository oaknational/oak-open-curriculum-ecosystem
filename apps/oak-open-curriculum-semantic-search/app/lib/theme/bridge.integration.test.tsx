import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useTheme } from 'styled-components';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';

import { ColorModeProvider, useColorMode } from './ColorModeContext.js';
import { ThemeBridgeProvider } from './ThemeBridgeProvider.js';
import { HtmlThemeAttribute } from './HtmlThemeAttribute.js';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <ColorModeProvider initialMode="light">
        <ThemeBridgeProvider>{children}</ThemeBridgeProvider>
      </ColorModeProvider>
    </OakThemeProvider>
  );
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
    const { rerender } = render(
      <Providers>
        <HtmlThemeAttribute />
        <ColorProbe />
      </Providers>,
    );
    const before = screen.getAllByTestId('color')[0].textContent;
    const cssBefore = getComputedStyle(document.documentElement).getPropertyValue(
      '--app-color-header-border',
    );
    // Toggle
    const Toggler = () => {
      const { toggle } = useColorMode();
      return (
        <button onClick={toggle} data-testid="toggle2">
          toggle
        </button>
      );
    };
    rerender(
      <Providers>
        <HtmlThemeAttribute />
        <Toggler />
        <ColorProbe />
      </Providers>,
    );
    act(() => {
      screen.getByTestId('toggle2').click();
    });
    const after = screen.getAllByTestId('color')[0].textContent;
    const cssAfter = getComputedStyle(document.documentElement).getPropertyValue(
      '--app-color-header-border',
    );
    expect(after).not.toBe(before);
    expect(cssAfter.trim()).not.toBe(cssBefore.trim());
  });
  it('syncs <html data-theme> when mode toggles', () => {
    const Toggle = () => {
      const { mode, toggle } = useColorMode();
      return (
        <button onClick={toggle} data-testid="toggle">
          {mode}
        </button>
      );
    };
    render(
      <Providers>
        <HtmlThemeAttribute />
        <Toggle />
      </Providers>,
    );
    expect(document.documentElement.dataset.theme).toBe('light');
    act(() => {
      screen.getByTestId('toggle').click();
    });
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
