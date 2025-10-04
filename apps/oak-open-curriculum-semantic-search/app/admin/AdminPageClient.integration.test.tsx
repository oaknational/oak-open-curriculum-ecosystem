import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../ui/themes/light';
import { AdminPageClient } from './AdminPageClient';
import type { FixtureMode } from '../lib/fixture-mode';

const refreshMock = vi.fn();
const setFixtureModeMock = vi.hoisted(() => vi.fn<(mode: FixtureMode) => Promise<void>>());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock('../ui/ops/admin/ZeroHitDashboard', () => ({
  ZeroHitDashboard: () => <div data-testid="zero-hit-dashboard" />,
}));

vi.mock('../ui/global/Fixture/fixture-mode-toggle.actions', () => ({
  setFixtureMode: setFixtureModeMock,
}));

const theme = createLightTheme();

function renderAdmin(props: Partial<Parameters<typeof AdminPageClient>[0]> = {}): void {
  const { initialFixtureMode = 'live', showFixtureToggle = true } = props;
  render(
    <StyledThemeProvider theme={theme}>
      <AdminPageClient
        initialFixtureMode={initialFixtureMode}
        showFixtureToggle={showFixtureToggle}
      />
    </StyledThemeProvider>,
  );
}

describe('AdminPageClient', () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setFixtureModeMock.mockReset();
    setFixtureModeMock.mockResolvedValue(undefined);
    refreshMock.mockReset();
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

  it('renders fixture scenario radios when the toggle is enabled', () => {
    renderAdmin({ initialFixtureMode: 'fixtures-empty' });

    const radioGroup = screen.getByRole('radiogroup', { name: /admin data/i });
    const liveRadio = within(radioGroup).getByRole('radio', { name: /Live data/i });
    const successRadio = within(radioGroup).getByRole('radio', {
      name: /Fixtures \(success\)/i,
    });
    const emptyRadio = within(radioGroup).getByRole('radio', {
      name: /Fixtures \(empty\)/i,
    });
    const errorRadio = within(radioGroup).getByRole('radio', {
      name: /Fixtures \(error\)/i,
    });

    expect(liveRadio).not.toBeChecked();
    expect(successRadio).not.toBeChecked();
    expect(emptyRadio).toBeChecked();
    expect(errorRadio).not.toBeChecked();

    expect(
      screen.getByText(
        /Viewing empty admin fixtures so you can validate messaging without touching live infrastructure\./i,
      ),
    ).toBeInTheDocument();
  });

  it('persists fixture mode changes when a radio is selected', async () => {
    renderAdmin({ initialFixtureMode: 'fixtures' });

    const radioGroup = screen.getByRole('radiogroup', { name: /admin data/i });
    const emptyRadio = within(radioGroup).getByRole('radio', {
      name: /Fixtures \(empty\)/i,
    });
    const errorRadio = within(radioGroup).getByRole('radio', {
      name: /Fixtures \(error\)/i,
    });
    const liveRadio = within(radioGroup).getByRole('radio', { name: /Live data/i });

    await act(async () => {
      fireEvent.click(emptyRadio);
    });

    await screen.findByText(
      /Viewing empty admin fixtures so you can validate messaging without touching live infrastructure\./i,
    );

    await act(async () => {
      fireEvent.click(errorRadio);
    });

    await screen.findByText(/Simulating admin errors/i);

    await act(async () => {
      fireEvent.click(liveRadio);
    });

    await screen.findByText(/Using live data/i);

    expect(setFixtureModeMock).toHaveBeenNthCalledWith(1, 'fixtures-empty');
    expect(setFixtureModeMock).toHaveBeenNthCalledWith(2, 'fixtures-error');
    expect(setFixtureModeMock).toHaveBeenNthCalledWith(3, 'live');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('does not render radios when the toggle is hidden', () => {
    renderAdmin({ showFixtureToggle: false });

    expect(screen.queryByRole('radiogroup', { name: /admin data/i })).not.toBeInTheDocument();
  });
});
