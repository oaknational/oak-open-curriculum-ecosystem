import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ColorModeProvider, useColorMode } from './ColorModeContext';
import { ThemeCssVars } from './ThemeCssVars';

const sampleVars = {
  '--app-color-header-border': '#112233',
  '--app-gap-section': '3.5rem',
};

describe('ThemeCssVars', () => {
  it('renders CSS variables scoped to the current mode', () => {
    render(
      <ColorModeProvider initialMode="light">
        <ThemeCssVars vars={sampleVars} />
      </ColorModeProvider>,
    );

    const style = document.getElementById('app-theme-vars');
    expect(style?.textContent).toBe(
      '#app-theme-root[data-theme="light"] {\n' +
        '  --app-color-header-border: #112233;\n' +
        '  --app-gap-section: 3.5rem;\n' +
        '}',
    );
  });

  it('reflects mode updates from ColorModeProvider', () => {
    const setter: { current: ((mode: 'light' | 'dark') => void) | null } = { current: null };

    function Setter(): null {
      const { setMode } = useColorMode();
      setter.current = setMode;
      return null;
    }

    render(
      <ColorModeProvider initialMode="light">
        <Setter />
        <ThemeCssVars vars={sampleVars} />
      </ColorModeProvider>,
    );

    act(() => {
      setter.current?.('dark');
    });

    const style = document.getElementById('app-theme-vars');
    expect(style?.textContent).toBe(
      '#app-theme-root[data-theme="dark"] {\n' +
        '  --app-color-header-border: #112233;\n' +
        '  --app-gap-section: 3.5rem;\n' +
        '}',
    );
  });
});
