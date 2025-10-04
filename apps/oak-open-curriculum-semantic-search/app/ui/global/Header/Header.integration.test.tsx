import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Providers as AppProviders } from '../../../lib/Providers';
import Header from './Header';
import { resolveAppTokens } from '../../themes/semantic-theme-resolver';

function renderHeader() {
  render(
    <AppProviders initialMode="light">
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

    const expectations: Array<{ name: string; href: string }> = [
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
});
