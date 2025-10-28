import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../ui/themes/light';
import { AdminPageClient } from './AdminPageClient';
import type { FixtureMode } from '../lib/fixture-mode';
import { FixtureModeProvider } from '../ui/global/Fixture/FixtureModeContext';

vi.mock('../ui/ops/admin/ZeroHitDashboard', () => ({
  ZeroHitDashboard: () => <div data-testid="zero-hit-dashboard" />,
}));

const theme = createLightTheme();

function renderAdmin(props: Partial<Parameters<typeof AdminPageClient>[0]> = {}): void {
  const { initialFixtureMode = 'live', showFixtureToggle = true } = props;
  render(
    <StyledThemeProvider theme={theme}>
      <FixtureModeProvider initialMode={initialFixtureMode as FixtureMode}>
        <AdminPageClient
          initialFixtureMode={initialFixtureMode as FixtureMode}
          showFixtureToggle={showFixtureToggle}
        />
      </FixtureModeProvider>
    </StyledThemeProvider>,
  );
}

describe('AdminPageClient', () => {
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

  it('renders a fixture scenario pill when fixtures are enabled', () => {
    renderAdmin({ initialFixtureMode: 'fixtures-empty' });

    expect(
      screen.getByText(
        /Viewing empty admin fixtures so you can validate messaging without touching live infrastructure\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: /admin data/i })).not.toBeInTheDocument();
  });

  it('does not render radios when the toggle is hidden', () => {
    renderAdmin({ showFixtureToggle: false });

    expect(screen.queryByRole('radiogroup', { name: /admin data/i })).not.toBeInTheDocument();
  });
});
