import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { oakColorTokens } from '@oaknational/oak-components';
import { Providers as AppProviders } from '../../lib/Providers';
import { createLightTheme } from '../themes/light';
import HeaderStyles from './HeaderStyles';

function renderHeader() {
  const theme = createLightTheme();
  render(
    <AppProviders initialMode="light">
      <HeaderStyles />
    </AppProviders>,
  );
  return theme;
}

describe('HeaderStyles', () => {
  it('uses theme spacing and brand colours for navigation', () => {
    const theme = renderHeader();

    const header = screen.getByRole('banner');
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    const headerStyle = getComputedStyle(header);
    const navStyle = getComputedStyle(nav);
    const backgroundToken = theme.uiColors['bg-primary'];
    const backgroundHex = backgroundToken ? oakColorTokens[backgroundToken] : '#ebfbeb';

    expect(headerStyle.borderBottomColor).toBe(hexToRgb(theme.app.colors.headerBorder));
    expect(headerStyle.backgroundColor).toBe(hexToRgb(backgroundHex));
    expect(navStyle.rowGap).toBe(theme.app.space.gap.cluster);
    expect(navStyle.columnGap).toBe(theme.app.space.gap.cluster);
  });

  it('renders navigation links with the primary font family', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const homeLink = within(nav).getByRole('link', { name: 'Home' });
    const homeLabel = within(homeLink).getByText('Home');
    const linkStyle = getComputedStyle(homeLabel);

    expect(linkStyle.fontFamily).toMatch(/Lexend/i);
  });
});

function hexToRgb(hex: string): string {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}
