import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

  it('renders the experimental-service disclaimer in the main content area', () => {
    render(<AppView onOpenLink={() => undefined} />);

    const main = screen.getByRole('main');

    expect(
      within(main).getByText(
        'This service is experimental. It uses Oak National Academy content, but AI can make mistakes and output should not be treated as official resources.',
      ),
    ).toBeTruthy();
  });

  it('keeps the brand banner header outside the main landmark', () => {
    render(<AppView onOpenLink={() => undefined} />);

    const main = screen.getByRole('main');

    expect(main.querySelector('header')).toBeNull();
    expect(screen.getByRole('banner')).toBeTruthy();
  });
});

describe('AppView safe-area insets', () => {
  it('applies no inline styling when the host provides no safe-area insets', () => {
    render(<AppView onOpenLink={() => undefined} />);

    const shell = screen.getByTestId('oak-mcp-app-shell');

    expect(shell.getAttribute('style')).toBeNull();
  });

  it('exposes host insets as custom properties and emits no inline padding declarations', () => {
    render(
      <AppView
        onOpenLink={() => undefined}
        safeAreaInsets={{ top: 12, right: 8, bottom: 4, left: 16 }}
      />,
    );

    const shell = screen.getByTestId('oak-mcp-app-shell');

    expect(shell.style.getPropertyValue('--oak-safe-area-inset-top')).toBe('12px');
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-right')).toBe('8px');
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-bottom')).toBe('4px');
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-left')).toBe('16px');
    // The authored `.oak-app` token padding must survive: no inline
    // padding declarations that would shadow the class rule.
    expect(shell.style.paddingTop).toBe('');
    expect(shell.style.paddingRight).toBe('');
    expect(shell.style.paddingBottom).toBe('');
    expect(shell.style.paddingLeft).toBe('');
  });

  it('emits zero-value custom properties and no inline padding for zero insets (ChatGPT desktop)', () => {
    render(
      <AppView
        onOpenLink={() => undefined}
        safeAreaInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
      />,
    );

    const shell = screen.getByTestId('oak-mcp-app-shell');

    // Zero insets compose to zero EXTRA padding via the custom
    // properties; they must never zero out the token padding itself.
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-top')).toBe('0px');
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-right')).toBe('0px');
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-bottom')).toBe('0px');
    expect(shell.style.getPropertyValue('--oak-safe-area-inset-left')).toBe('0px');
    expect(shell.style.paddingTop).toBe('');
    expect(shell.style.paddingRight).toBe('');
    expect(shell.style.paddingBottom).toBe('');
    expect(shell.style.paddingLeft).toBe('');
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
