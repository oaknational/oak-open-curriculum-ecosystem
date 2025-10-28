import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../themes/light';
import { LandingPage } from './LandingPage';

function renderLanding(): void {
  const theme = createLightTheme();
  render(
    <StyledThemeProvider theme={theme}>
      <LandingPage />
    </StyledThemeProvider>,
  );
}

describe('LandingPage', () => {
  it('presents hero messaging that introduces hybrid search', () => {
    renderLanding();

    expect(
      screen.getByRole('heading', { level: 1, name: /search the oak curriculum your way/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/combine deterministic filters with conversational discovery/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start structured search/i })).toHaveAttribute(
      'href',
      '/structured_search',
    );
    expect(screen.getByRole('link', { name: /start natural language search/i })).toHaveAttribute(
      'href',
      '/natural_language_search',
    );
  });

  it('offers structured and natural CTA cards with accessible link text', () => {
    renderLanding();

    const structuredHeading = screen.getByRole('heading', { level: 2, name: /structured search/i });
    const naturalHeading = screen.getByRole('heading', {
      level: 2,
      name: /natural language search/i,
    });

    expect(structuredHeading).toBeInTheDocument();
    expect(naturalHeading).toBeInTheDocument();

    const structuredLink = screen
      .getAllByRole('link', { name: /structured search/i })
      .find((link) => link.getAttribute('href')?.includes('/structured_search'));
    const naturalLink = screen
      .getAllByRole('link', { name: /natural language search/i })
      .find((link) => link.getAttribute('href')?.includes('/natural_language_search'));

    expect(structuredLink).not.toBeUndefined();
    expect(structuredLink).toHaveAttribute('href', '/structured_search');
    expect(naturalLink).not.toBeUndefined();
    expect(naturalLink).toHaveAttribute('href', '/natural_language_search');
  });

  it('does not render embedded search forms on the landing page', () => {
    renderLanding();

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
