import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../../ui/themes/light';
import ApiDocsPage from './page';

vi.mock('redoc', () => ({
  RedocStandalone: ({ specUrl }: { specUrl: string }) => (
    <div data-testid="redoc" data-spec={specUrl} />
  ),
}));

function renderDocs(): void {
  render(
    <StyledThemeProvider theme={createLightTheme()}>
      <ApiDocsPage />
    </StyledThemeProvider>,
  );
}

describe('ApiDocsPage', () => {
  it('links to the published OpenAPI spec', () => {
    renderDocs();

    const link = screen.getByRole('link', { name: '/api/openapi.json' });
    expect(link).toHaveAttribute('href', '/api/openapi.json');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('embeds Redoc with the spec URL', () => {
    renderDocs();

    const frame = screen.getByTestId('redoc');
    expect(frame).toHaveAttribute('data-spec', '/api/openapi.json');
  });
});
