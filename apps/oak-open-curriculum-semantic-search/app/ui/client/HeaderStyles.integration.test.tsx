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
    const homeLink = within(nav).getByRole('link', { name: 'Home' });
    const homeLabel = within(homeLink).getByText('Home');
    const linkStyle = getComputedStyle(homeLabel);

    expect(linkStyle.fontFamily).toMatch(/Lexend/i);
  });
});
