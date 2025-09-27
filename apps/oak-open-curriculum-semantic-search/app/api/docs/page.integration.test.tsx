import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../../ui/themes/light';
import { createDarkTheme } from '../../ui/themes/dark';
import ApiDocsPage from './page';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

type RedocProps = {
  readonly specUrl: string;
  readonly options: {
    readonly theme: {
      readonly colors: {
        readonly text: { readonly primary: string; readonly secondary: string };
        readonly background: { readonly main: string };
      };
    };
  };
};

const redocCalls: RedocProps[] = [];

vi.mock('redoc', () => ({
  RedocStandalone: (props: RedocProps) => {
    redocCalls.push(props);
    return <div data-testid="redoc" data-spec={props.specUrl} />;
  },
}));

function lastRedocCall(): RedocProps {
  if (redocCalls.length === 0) {
    throw new Error('Redoc was not invoked');
  }
  return redocCalls[redocCalls.length - 1];
}

beforeEach(() => {
  redocCalls.length = 0;
});

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

  it('paints the page container with the neutral background token', () => {
    renderDocs();

    const container = screen.getByTestId('api-docs-page');
    const styles = window.getComputedStyle(container);
    const expected = resolveUiColor(createLightTheme(), 'bg-neutral');
    expect(styles.backgroundColor).toBe(hexToRgb(expected));
  });

  it('applies dark theme surface colours to the docs wrapper', () => {
    renderDocsDark();

    const wrapper = screen.getByTestId('redoc').parentElement as HTMLElement;
    expect(wrapper).toBeTruthy();
    const styles = window.getComputedStyle(wrapper);
    const expectedHex = resolveUiColor(createDarkTheme(), 'bg-neutral');
    const expected = hexToRgb(expectedHex);
    const cssVar = styles.getPropertyValue('--docs-surface').trim();

    if (styles.backgroundColor.startsWith('var(')) {
      expect(cssVar).toBe(expectedHex);
    } else {
      expect(styles.backgroundColor).toBe(expected);
    }
  });

  it('passes resolved colour tokens to Redoc', () => {
    renderDocs();

    const props = lastRedocCall();
    const theme = createLightTheme();
    expect(props.options.theme.colors.text.primary).toBe(resolveUiColor(theme, 'text-primary'));
    expect(props.options.theme.colors.text.secondary).toBe(resolveUiColor(theme, 'text-subdued'));
    expect(props.options.theme.colors.background.main).toBe(theme.app.colors.surfaceCard);
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
