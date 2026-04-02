import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppView } from './App.js';
import { initialAppRuntimeState } from './app-runtime-state.js';

describe('AppView', () => {
  it('renders a deterministic pre-connection state without scaffold copy', () => {
    render(<AppView state={initialAppRuntimeState} isConnected={false} error={null} />);

    expect(screen.getByText('Waiting for MCP host connection')).toBeTruthy();
    expect(screen.queryByText(/shell ready/iu)).toBeNull();
  });

  it('renders the connected status label when connected', () => {
    render(<AppView state={initialAppRuntimeState} isConnected={true} error={null} />);

    expect(screen.getByText('Connected to MCP host')).toBeTruthy();
  });

  it('renders the active tool name from runtime state', () => {
    render(
      <AppView
        state={{
          ...initialAppRuntimeState,
          currentToolName: 'user-search',
        }}
        isConnected={true}
        error={null}
      />,
    );

    expect(screen.getByText('user-search')).toBeTruthy();
  });

  it('renders a connection error in an alert role', () => {
    render(
      <AppView
        state={initialAppRuntimeState}
        isConnected={false}
        error={new Error('connection timeout')}
      />,
    );

    const alert = screen.getByRole('alert');

    expect(alert.textContent).toContain('connection timeout');
  });

  it('renders a runtime error message in an alert role', () => {
    render(
      <AppView
        state={{
          ...initialAppRuntimeState,
          errorMessage: 'unexpected disconnect',
        }}
        isConnected={true}
        error={null}
      />,
    );

    const alert = screen.getByRole('alert');

    expect(alert.textContent).toContain('unexpected disconnect');
  });
});
