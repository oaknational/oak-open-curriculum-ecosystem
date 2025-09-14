import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';

vi.mock('next/headers', () => {
  return {
    cookies: async () => ({
      get: (name: string) => (name === 'theme-mode' ? { value: 'dark' } : undefined),
    }),
  };
});

// Mock next/font/google Lexend to avoid runtime call in server render
vi.mock('./ui/fonts', () => {
  return {
    lexend: { className: '' },
  };
});

import RootLayout from './layout';

describe('layout SSR cookie mapping', () => {
  it('sets data-theme-mode from cookie value', async () => {
    const html = await RootLayout({ children: React.createElement('div') });
    const markup = renderToString(html);
    expect(markup).toContain('data-theme-mode="dark"');
  });
});
