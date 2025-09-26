import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../../ui/themes/light';
import { createDarkTheme } from '../../ui/themes/dark';
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

function renderDocsDark(): void {
  render(
    <StyledThemeProvider theme={createDarkTheme()}>
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

  it('applies dark theme surface colours to the docs wrapper', () => {
    renderDocsDark();

    const wrapper = screen.getByTestId('redoc').parentElement as HTMLElement;
    expect(wrapper).toBeTruthy();
    const styles = window.getComputedStyle(wrapper);
    const expected = hexToRgb(createDarkTheme().app.colors.surfaceCard);
    expect(styles.backgroundColor).toBe(expected);
  });
});

function hexToRgb(hex: string): string {
  const div = document.createElement('div');
  div.style.color = hex;
  document.body.appendChild(div);
  const computed = getComputedStyle(div).color;
  document.body.removeChild(div);
  return computed;
}
