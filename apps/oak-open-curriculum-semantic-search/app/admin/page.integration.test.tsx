import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import AdminPage from './page';
import { createLightTheme } from '../ui/themes/light';

vi.mock('../ui/admin/ZeroHitDashboard', () => ({
  ZeroHitDashboard: () => <div data-testid="zero-hit-dashboard" />,
}));

const theme = createLightTheme();

function renderAdmin(): void {
  render(
    <StyledThemeProvider theme={theme}>
      <AdminPage />
    </StyledThemeProvider>,
  );
}

describe('AdminPage', () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    window.history.replaceState(null, '', '/admin#tag/sdk/paths/~1api~1sdk');
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    window.history.replaceState(null, '', '/');
  });

  it('clears any existing hash on mount', () => {
    renderAdmin();

    expect(replaceStateSpy).toHaveBeenLastCalledWith(null, '', '/admin');
    expect(window.location.hash).toBe('');
  });

  it('clamps the main container to the semantic layout width', () => {
    renderAdmin();

    const container = screen.getByTestId('admin-page');
    expect(container).toHaveStyle({
      maxWidth: 'min(100%, var(--app-layout-container-max-width))',
      width: 'min(100%, var(--app-layout-container-max-width))',
    });
  });
});
