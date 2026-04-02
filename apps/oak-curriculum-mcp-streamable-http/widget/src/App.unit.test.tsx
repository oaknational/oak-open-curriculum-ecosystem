import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppView } from './App.js';
import { initialAppRuntimeState } from './app-runtime-state.js';

describe('AppView', () => {
  it('renders a deterministic pre-connection state without scaffold copy', () => {
    render(<AppView state={initialAppRuntimeState} isConnected={false} error={null} />);

    expect(screen.getByText('Waiting for MCP host connection')).toBeDefined();
    expect(screen.queryByText(/shell ready/iu)).toBeNull();
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

    expect(screen.getByText('user-search')).toBeDefined();
  });
});
