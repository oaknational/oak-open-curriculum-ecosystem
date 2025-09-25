import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useTheme } from 'styled-components';
import { useThemeContext } from './ThemeContext.js';
import { Providers as AppProviders } from '../Providers.js';
import { createLightTheme } from '../../ui/themes/light.js';
import { createDarkTheme } from '../../ui/themes/dark.js';
import { resolveUiColor } from './ThemeGlobalStyle.js';

function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders initialMode="light">{children}</AppProviders>;
}

function flattenCssRules(sheet: CSSStyleSheet): string[] {
  try {
    return Array.from(sheet.cssRules ?? []).map((rule) => rule.cssText ?? '');
  } catch {
    return [];
  }
}

function collectStyles(): string {
  return Array.from(document.styleSheets)
    .flatMap((sheet) => flattenCssRules(sheet as CSSStyleSheet))
    .join('');
}

function findGlobalStyle(): HTMLStyleElement | null {
  return document.getElementById('app-theme-global') as HTMLStyleElement | null;
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
    expect(styleEl?.textContent || '').toMatch(/--app-gap-section/);
  });

  it('exposes theme.app tokens to styled-components consumers', () => {
    const TokenProbe = () => {
      const theme = useTheme() as unknown as {
        app?: { space?: { gap?: { section?: string } } };
      };
      return (
        <span data-testid="token-section">{theme?.app?.space?.gap?.section ?? 'missing'}</span>
      );
    };
    render(
      <Providers>
        <TokenProbe />
      </Providers>,
    );
    expect(screen.getByTestId('token-section').textContent).toBe('3.5rem');
  });

  function renderAndCollectThemeStyles(): {
    initialStyles: string;
    darkStyles: string;
    lightBackground: string;
    lightForeground: string;
    darkBackground: string;
    darkForeground: string;
  } {
    const lightTheme = createLightTheme();
    const darkTheme = createDarkTheme();
    const lightBackground = resolveUiColor(lightTheme, 'bg-primary');
    const lightForeground = resolveUiColor(lightTheme, 'text-primary');
    const darkBackground = resolveUiColor(darkTheme, 'bg-primary');
    const darkForeground = resolveUiColor(darkTheme, 'text-primary');

    const ToggleToDark = () => {
      const { setMode } = useThemeContext();
      return (
        <button onClick={() => setMode('dark')} data-testid="global-style-toggle">
          dark
        </button>
      );
    };

    render(
      <Providers>
        <ToggleToDark />
        <div>probe</div>
      </Providers>,
    );

    const initialStyles = collectStyles().replace(/\s+/g, '');

    act(() => {
      screen.getByTestId('global-style-toggle').click();
    });

    const darkStyles = collectStyles().replace(/\s+/g, '');

    return {
      initialStyles,
      darkStyles,
      lightBackground,
      lightForeground,
      darkBackground,
      darkForeground,
    };
  }

  it('applies theme background/foreground tokens to html and body elements', () => {
    const {
      initialStyles,
      darkStyles,
      lightBackground,
      lightForeground,
      darkBackground,
      darkForeground,
    } = renderAndCollectThemeStyles();

    expect(initialStyles).toContain(
      `html,body{background-color:${lightBackground.toLowerCase()};color:${lightForeground.toLowerCase()};`,
    );
    expect(initialStyles).toContain(
      `#app-theme-root{background-color:${lightBackground.toLowerCase()};color:${lightForeground.toLowerCase()};`,
    );
    expect(initialStyles).toContain('--app-color-brand-primary:#287c34;');
    expect(initialStyles).toContain('--app-color-brand-primary-deep:#144d24;');
    expect(initialStyles).toContain('--app-color-brand-primary-bright:#35a04c;');
    expect(initialStyles).toContain('--app-layout-control-column-min-width:20rem;');
    expect(initialStyles).toContain('--app-layout-secondary-column-min-width:18rem;');

    expect(darkStyles).toContain(
      `html,body{background-color:${darkBackground.toLowerCase()};color:${darkForeground.toLowerCase()};`,
    );
    expect(darkStyles).toContain(
      `#app-theme-root{background-color:${darkBackground.toLowerCase()};color:${darkForeground.toLowerCase()};`,
    );
    expect(darkStyles).toContain('--app-color-brand-primary:#287c34;');
    expect(darkStyles).toContain('--app-color-brand-primary-deep:#0b2a16;');
    expect(darkStyles).toContain('--app-color-brand-primary-bright:#6ed680;');
  });

  it('mounts a single ThemeGlobalStyle sheet and reuses it when mode changes', () => {
    const ToggleToDark = () => {
      const { setMode } = useThemeContext();
      return (
        <button onClick={() => setMode('dark')} data-testid="global-style-toggle">
          dark
        </button>
      );
    };

    render(
      <Providers>
        <ToggleToDark />
        <div>probe</div>
      </Providers>,
    );

    expect(findGlobalStyle()).not.toBeNull();
    expect(document.querySelectorAll('#app-theme-global')).toHaveLength(1);

    act(() => {
      screen.getByTestId('global-style-toggle').click();
    });

    expect(findGlobalStyle()).not.toBeNull();
    expect(document.querySelectorAll('#app-theme-global')).toHaveLength(1);
  });

  it('changes semantic tokens and CSS vars when mode toggles', () => {
    const ColorProbe = () => {
      const theme = useTheme() as unknown as { app?: { colors?: { textMuted?: string } } };
      return <span data-testid="color">{theme?.app?.colors?.textMuted ?? 'missing'}</span>;
    };
    const Toggler = () => {
      const { setMode } = useThemeContext();
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
    const cssBefore = getComputedStyle(rootEl).getPropertyValue('--app-color-text-muted');

    act(() => {
      screen.getByTestId('toggle2').click();
    });

    const after = screen.getAllByTestId('color')[0].textContent;
    const cssAfter = getComputedStyle(rootEl).getPropertyValue('--app-color-text-muted');
    expect(after).not.toBe(before);
    expect(cssAfter.trim()).not.toBe(cssBefore.trim());
  });

  it('syncs wrapper data-theme when mode toggles', () => {
    const Toggle = () => {
      const { mode, setMode } = useThemeContext();
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

  it('syncs wrapper data-theme when ThemeContext mode changes', () => {
    const ThemeToggle = () => {
      const { mode, setMode } = useThemeContext();
      return (
        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          data-testid="theme-toggle"
        >
          toggle
        </button>
      );
    };
    render(
      <Providers>
        <ThemeToggle />
      </Providers>,
    );

    const root = () => document.getElementById('app-theme-root')?.dataset.theme;
    expect(root()).toBe('light');

    act(() => {
      screen.getByTestId('theme-toggle').click();
    });

    expect(root()).toBe('dark');
  });
});
