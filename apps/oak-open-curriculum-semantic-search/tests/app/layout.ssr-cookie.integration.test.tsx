import { describe, it, expect, vi } from 'vitest';
import { createElement, Fragment } from 'react';
import { renderToString } from 'react-dom/server';

// Avoid styled-components theme dependency; we only assert data-theme-mode.
vi.mock('styled-components', () => {
  const styled = new Proxy(
    (Comp: React.ComponentType<{ children?: React.ReactNode }>) => {
      const Wrapped: React.FC<{ children?: React.ReactNode }> = (props) =>
        createElement(Comp, props);
      Wrapped.displayName = 'styled(Comp)';
      return () => Wrapped;
    },
    {
      get: (_target, tag: string) => {
        const Element: React.FC<{ children?: React.ReactNode }> = (props) =>
          createElement(tag, props);
        Element.displayName = `styled(${tag})`;
        return () => Element;
      },
    },
  );
  const createGlobalStyle = () => {
    const Global: React.FC<{ children?: React.ReactNode }> = () => null;
    Global.displayName = 'GlobalStyleMock';
    return Global;
  };
  class ServerStyleSheetMock {
    instance = {
      clearTag: vi.fn(),
    };
    getStyleElement() {
      return createElement(Fragment, {});
    }
  }
  const StyleSheetManager = ({ children }: { children?: React.ReactNode }) => {
    return createElement(Fragment, {}, children);
  };
  const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
    return createElement(Fragment, {}, children);
  };
  return {
    __esModule: true,
    default: styled,
    createGlobalStyle,
    ServerStyleSheet: ServerStyleSheetMock,
    StyleSheetManager,
    ThemeProvider,
  };
});

// Minimal typed mock for next/headers.cookies
vi.mock('next/headers', () => {
  type CookieValue = { value: string };
  type CookieJar = { get: (name: string) => CookieValue | undefined };
  type CookiesFn = () => Promise<CookieJar>;
  const cookies: CookiesFn = async () => ({
    get: (name: string) => (name === 'theme-mode' ? { value: 'dark' } : undefined),
  });
  return { cookies };
});

// Mock next/font/google Lexend to avoid runtime call in server render
vi.mock('../../app/ui/global/Theme', () => {
  return {
    lexend: { className: '', variable: '' },
    workSans: { className: '', variable: '' },
  };
});

import RootLayout from '../../app/layout';

describe('layout SSR cookie mapping', () => {
  it('sets data-theme-mode from cookie value', async () => {
    const html = await RootLayout({ children: createElement('div') });
    const markup = renderToString(html);
    expect(markup).toContain('data-theme-mode="dark"');
  });
});
