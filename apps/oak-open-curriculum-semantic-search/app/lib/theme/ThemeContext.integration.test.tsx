import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from './ThemeContext';
import type { JSX } from 'react';

function ModeProbe(): JSX.Element {
  const { mode, setMode } = useThemeContext();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => setMode('light')}>light</button>
      <button onClick={() => setMode('dark')}>dark</button>
      <button onClick={() => setMode('system')}>system</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('initialises from provided initialMode', () => {
    render(
      <ThemeProvider initialMode="dark">
        <ModeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('updates mode via context setter and persists', () => {
    render(
      <ThemeProvider initialMode="system">
        <ModeProbe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('light'));
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });
});
