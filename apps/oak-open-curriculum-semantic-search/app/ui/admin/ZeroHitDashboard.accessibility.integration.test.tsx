import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { ReactNode } from 'react';
import { createLightTheme } from '../themes/light';
import { ZeroHitDashboard } from './ZeroHitDashboard';
import type { TelemetryState } from './ZeroHitDashboard.types';

const telemetryStateMock = vi.fn<() => TelemetryState>();

vi.mock('./use-zero-hit-telemetry', () => ({
  useZeroHitTelemetry: () => telemetryStateMock(),
}));

function withTheme(children: ReactNode) {
  return <StyledThemeProvider theme={createLightTheme()}>{children}</StyledThemeProvider>;
}

const baseTelemetry: TelemetryState['data'] = {
  summary: {
    total: 4,
    byScope: { lessons: 2, units: 1, sequences: 1 },
    latestIndexVersion: 'v-live',
  },
  recent: [],
};

describe('ZeroHitDashboard accessibility affordances', () => {
  beforeEach(() => {
    telemetryStateMock.mockReset();
    telemetryStateMock.mockReturnValue({
      data: baseTelemetry,
      loading: false,
      error: null,
      refresh: vi.fn().mockResolvedValue(undefined),
    });
    document.cookie = 'semantic-search-fixtures=off';
  });

  afterEach(() => {
    document.cookie = 'semantic-search-fixtures=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('announces telemetry updates via an aria-live status message', () => {
    render(withTheme(<ZeroHitDashboard />));

    const statusNotice = screen.getByRole('status');
    expect(statusNotice).toHaveAttribute('aria-live', 'polite');
    expect(statusNotice).toHaveTextContent('Zero-hit telemetry updated');
    expect(statusNotice).toHaveTextContent('Latest index version: v-live');
  });

  it('flags deterministic fixtures when the fixture cookie is active', () => {
    document.cookie = 'semantic-search-fixtures=on';
    render(withTheme(<ZeroHitDashboard />));

    const statusNotice = screen.getByRole('status');
    expect(statusNotice).toHaveTextContent('Deterministic fixtures active');
  });

  it('surfaces friendly outage guidance when telemetry fails', () => {
    telemetryStateMock.mockReturnValue({
      data: null,
      loading: false,
      error: 'Request failed with status 503',
      refresh: vi.fn().mockResolvedValue(undefined),
    });

    render(withTheme(<ZeroHitDashboard />));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Zero-hit telemetry is temporarily unavailable');
    expect(alert).toHaveTextContent('status 503');
  });
});
