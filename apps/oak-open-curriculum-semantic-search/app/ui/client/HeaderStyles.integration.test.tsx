import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Providers as AppProviders } from '../../lib/Providers';
import HeaderStyles from './HeaderStyles';

function renderHeader() {
  render(
    <AppProviders initialMode="light">
      <HeaderStyles />
    </AppProviders>,
  );
}

describe('HeaderStyles', () => {
  it('renders navigation links with the primary font family', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const searchLink = within(nav).getByRole('link', { name: 'Search' });
    const linkLabel = within(searchLink).getByText('Search');
    const linkStyle = getComputedStyle(linkLabel);

    expect(linkStyle.fontFamily).toMatch(/Lexend/i);
  });

  it('exposes the primary navigation routes with accessible labels', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    const expectations: Array<{ name: string; href: string }> = [
      { name: 'Search', href: '/' },
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
});
