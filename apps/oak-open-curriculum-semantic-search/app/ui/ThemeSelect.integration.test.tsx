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
});
