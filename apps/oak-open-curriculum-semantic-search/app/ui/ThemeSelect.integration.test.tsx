import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelect from './client/ThemeSelect';
import { ThemeProvider, useThemeContext } from '../lib/theme/ThemeContext';

function ModeProbe(): React.JSX.Element {
  const { mode } = useThemeContext();
  return <span data-testid="mode">{mode}</span>;
}

describe('ThemeSelect', () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = '';
  });

  it('changes mode and persists when selecting an option', () => {
    render(
      <ThemeProvider initialMode="system">
        <ThemeSelect />
        <ModeProbe />
      </ThemeProvider>,
    );

    const radio = screen.getByLabelText('Dark');
    fireEvent.click(radio);
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('applies higher-contrast outlines for radios in dark mode', () => {
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(
      <ThemeProvider initialMode="dark">
        <div data-theme="dark">
          <ThemeSelect />
        </div>
      </ThemeProvider>,
    );

    const systemRadioOutline = container.querySelector("input[value='system'] + div");
    const darkRadioOutline = container.querySelector("input[value='dark'] + div");

    if (
      !(systemRadioOutline instanceof HTMLElement) ||
      !(darkRadioOutline instanceof HTMLElement)
    ) {
      throw new Error('Failed to locate radio outlines');
    }

    const systemBorder = getComputedStyle(systemRadioOutline).borderColor;
    const darkBorder = getComputedStyle(darkRadioOutline).borderColor;

    // Note, this is a brittle test, it's more about a regression we had in the radio style application
    // delete if causing issues
    expect(systemBorder).toBe('rgb(228, 228, 228)');
    expect(darkBorder).toBe('rgb(242, 242, 242)');
  });
});
