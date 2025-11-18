import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FixtureMode } from '../../../lib/fixture-mode';
import { Providers as AppProviders } from '../../../lib/Providers';
import Header from './Header';
import { resolveAppTokens } from '../../themes/semantic-theme-resolver';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useServerInsertedHTML: () => {
    // no-op for client-side tests
  },
}));

function renderHeader(initialFixtureMode: FixtureMode = 'live') {
  render(
    <AppProviders initialMode="light" initialFixtureMode={initialFixtureMode}>
      <Header />
    </AppProviders>,
  );
}

describe('Header', () => {
  it('renders navigation links with the primary font family', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const homeLink = within(nav).getByRole('link', { name: 'Home' });
    const linkLabel = within(homeLink).getByText('Home');
    const linkStyle = getComputedStyle(linkLabel);

    expect(linkStyle.fontFamily).toMatch(/Lexend/i);
  });

  it('exposes the primary navigation routes with accessible labels', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    const expectations: { name: string; href: string }[] = [
      { name: 'Home', href: '/' },
      { name: 'Structured search', href: '/structured_search' },
      { name: 'Natural language search', href: '/natural_language_search' },
      { name: 'Admin', href: '/admin' },
      { name: 'Status', href: '/status' },
      { name: 'Docs', href: '/api/docs' },
    ];

    expectations.forEach(({ name, href }) => {
      const link = within(nav).getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('styles navigation states with Oak palette colours', () => {
    renderHeader();
    const styles = Array.from(document.querySelectorAll('style[data-styled]'))
      .map((style) => style.textContent ?? '')
      .join('');

    const palette = resolveAppTokens('light').palette;

    expect(styles).toContain(palette.brandPrimary);
    expect(styles).toContain(palette.brandPrimaryBright);
  });

  it('lays out header regions with explicit grid areas', () => {
    renderHeader();
    const banner = screen.getByRole('banner');
    const bannerStyle = getComputedStyle(banner);
    expect(bannerStyle.display).toBe('grid');
    const areas = bannerStyle.gridTemplateAreas.replace(/\s+/g, ' ').trim();
    expect(areas).toContain("'logo'");
    expect(areas).toContain("'nav'");
    expect(areas).toContain("'utilities'");
  });

  it('renders the fixture mode toggle bound to the shared context', () => {
    renderHeader('fixtures');
    const toggle = screen.getByRole('group', { name: 'Fixture mode' });
    const fixtureOption = within(toggle).getByRole('radio', { name: 'Fixtures (success)' });
    expect(fixtureOption).toBeChecked();
  });
});
