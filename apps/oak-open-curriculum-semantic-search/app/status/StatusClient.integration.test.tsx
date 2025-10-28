import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { ReactNode } from 'react';
import { createLightTheme } from '../ui/themes/light';
import { StatusClient } from './StatusClient';
import type { HealthPayload } from './types';

function withTheme(children: ReactNode) {
  return <StyledThemeProvider theme={createLightTheme()}>{children}</StyledThemeProvider>;
}

const healthyPayload: HealthPayload = {
  status: { es: 'ok', sdk: 'ok', llm: 'enabled' },
  details: {},
};

describe('StatusClient', () => {
  it('raises an alert-style card when a fatal message is provided', () => {
    const payload: HealthPayload = {
      status: { es: 'down', sdk: 'error', llm: 'disabled' },
      details: { fatal: 'Elasticsearch cluster unreachable.' },
    };

    render(withTheme(<StatusClient payload={payload} />));

    const outageAlert = screen.getByRole('alert');
    expect(outageAlert).toHaveTextContent('Platform outage detected');
    expect(outageAlert).toHaveTextContent('Elasticsearch cluster unreachable');
  });

  it('does not emit an alert card when no fatal message exists', () => {
    render(withTheme(<StatusClient payload={healthyPayload} />));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Elasticsearch responding to health checks.')).toBeInTheDocument();
    expect(screen.getByText('SDK parity checks are passing.')).toBeInTheDocument();
  });
});
