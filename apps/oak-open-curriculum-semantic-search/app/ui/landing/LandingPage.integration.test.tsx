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
      screen.getByRole('heading', { level: 1, name: /hybrid search for oak resources/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /choose between structured filtering and natural language understanding to start exploring/i,
      ),
    ).toBeInTheDocument();
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

    const structuredLink = screen.getByRole('link', { name: /explore structured search/i });
    const naturalLink = screen.getByRole('link', { name: /explore natural language search/i });

    expect(structuredLink).toHaveAttribute('href', '/structured_search');
    expect(naturalLink).toHaveAttribute('href', '/natural_language_search');
  });

  it('does not render embedded search forms on the landing page', () => {
    renderLanding();

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
