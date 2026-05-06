import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppView, openHostLink } from './App.js';
import type { AppRuntimeAction } from './app-runtime-state.js';

describe('AppView', () => {
  it('renders the app shell container', () => {
    render(<AppView onOpenLink={() => undefined} />);

    expect(screen.getByTestId('oak-mcp-app-shell')).toBeTruthy();
  });

  it('renders the brand banner with the Oak National Academy link', () => {
    render(<AppView onOpenLink={() => undefined} />);

    const link = screen.getByRole('link', { name: /oak national academy/iu });

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://www.thenational.academy');
  });

  it('passes onOpenLink through to the banner', () => {
    const calls: string[] = [];

    render(
      <AppView
        onOpenLink={(url) => {
          calls.push(url);
        }}
      />,
    );

    const link = screen.getByRole('link', { name: /oak national academy/iu });

    fireEvent.click(link);

    expect(calls).toStrictEqual(['https://www.thenational.academy']);
  });
});

describe('openHostLink', () => {
  it('opens the requested URL through host link handling when available', () => {
    const dispatched: AppRuntimeAction[] = [];
    const openLinkInputs: { readonly url: string }[] = [];
    const app = {
      getHostCapabilities: () => ({ openLinks: {} }),
      openLink: async (input: { readonly url: string }) => {
        openLinkInputs.push(input);
        return {};
      },
    };

    const opened = openHostLink(app, (action) => dispatched.push(action), 'https://example.com');

    expect(opened).toBe(true);
    expect(openLinkInputs).toStrictEqual([{ url: 'https://example.com' }]);
    expect(dispatched).toStrictEqual([]);
  });

  it('dispatches a runtime error when the host rejects link opening', async () => {
    const dispatched: AppRuntimeAction[] = [];
    const app = {
      getHostCapabilities: () => ({ openLinks: {} }),
      openLink: async () => {
        throw new Error('host denied link');
      },
    };

    const opened = openHostLink(app, (action) => dispatched.push(action), 'https://example.com');
    await Promise.resolve();

    expect(opened).toBe(true);
    expect(dispatched).toStrictEqual([
      {
        type: 'runtime-error',
        errorMessage: 'host denied link',
      },
    ]);
  });

  it('falls back to normal link navigation when host link opening is unavailable', () => {
    const dispatched: AppRuntimeAction[] = [];
    const app = {
      getHostCapabilities: () => ({}),
      openLink: async () => ({}),
    };

    const opened = openHostLink(app, (action) => dispatched.push(action), 'https://example.com');

    expect(opened).toBe(false);
    expect(dispatched).toStrictEqual([]);
  });
});
