import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelect from './client/ThemeSelect';
import { ThemeProvider, useThemeContext } from '../lib/theme/ThemeContext';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { oakDefaultTheme } from '@oaknational/oak-components';
import type { AppTokens } from './themes/tokens';

function ModeProbe(): React.JSX.Element {
  const { mode } = useThemeContext();
  return <span data-testid="mode">{mode}</span>;
}

describe('ThemeSelect', () => {
  it('changes mode and persists when selecting an option', () => {
    render(
      <StyledThemeProvider
        theme={{
          ...oakDefaultTheme,
          app: { colors: {}, space: {}, radii: {}, fontSizes: {}, layout: {} } as AppTokens,
        }}
      >
        <ThemeProvider initialMode="system">
          <ThemeSelect />
          <ModeProbe />
        </ThemeProvider>
      </StyledThemeProvider>,
    );

    const select = screen.getByLabelText('Theme selection') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});
