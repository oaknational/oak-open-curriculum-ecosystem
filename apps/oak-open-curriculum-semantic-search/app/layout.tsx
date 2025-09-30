import type { Metadata, Viewport } from 'next';
import type { JSX } from 'react';

import { cookies } from 'next/headers';

import Script from 'next/script';

import { lexend, workSans } from './ui/fonts';
import StyledComponentsRegistry from './lib/registry';
import { Providers } from './lib/Providers';
import HeaderStyles from './ui/client/HeaderStyles';
import { WebVitals } from './ui/web-vitals';

/**
 * Inline script injected before hydration to sync the DOM with the preferred theme.
 * This keeps the rendered HTML cacheable (always the universal light snapshot) while
 * avoiding React hydration mismatches when the browser favours dark mode. The logic
 * mirrors `app/lib/theme/theme-utils.ts` resolution rules (cookie → localStorage → system preference),
 * so keep the two in lockstep if either changes.
 */
const THEME_PREHYDRATION_SCRIPT = `(() => {
  try {
    const doc = document;
    const cookieMatch = doc.cookie.match(/(?:^|;\\s*)theme-mode=([^;]+)/);
    const cookieValue = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    let stored = null;
    try {
      stored = window.localStorage ? window.localStorage.getItem('theme-mode') : null;
    } catch (_) {
      stored = null;
    }
    const mode = (cookieValue || stored || 'system');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : prefersDark ? 'dark' : 'light';
    doc.documentElement.dataset.themeMode = mode;
    doc.documentElement.dataset.theme = resolved;
    const root = doc.getElementById('app-theme-root');
    if (root) {
      root.dataset.theme = resolved;
    }
  } catch (_) {
    /* ignore – React providers will reconcile on hydration */
  }
})();`;

export const metadata: Metadata = {
  title: 'Oak Semantic Search',
  description: 'Hybrid search (BM25 + semantic) with SDK-first data',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', rel: 'icon' },
      { url: '/favicons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

// Colours derived from semantic theme `bg-primary` tokens; see layout.meta.unit.test.ts for guard rails.
const LIGHT_THEME_COLOR = '#ebfbeb';
const DARK_THEME_COLOR = '#1b1b1b';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: LIGHT_THEME_COLOR },
    { media: '(prefers-color-scheme: dark)', color: DARK_THEME_COLOR },
  ],
} as const;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  /** @todo move all of this into an appropriate theme helper */
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get('theme-mode')?.value;
  const initialMode =
    cookieValue === 'light' || cookieValue === 'dark' || cookieValue === 'system'
      ? cookieValue
      : 'system';

  return (
    <html
      lang="en"
      data-theme-mode={initialMode}
      data-theme={initialMode === 'dark' ? 'dark' : 'light'}
    >
      <head>
        <Script id="theme-prehydration" strategy="beforeInteractive">
          {THEME_PREHYDRATION_SCRIPT}
        </Script>
      </head>
      <body className={`${lexend.className} ${workSans.className}`}>
        <WebVitals />
        <StyledComponentsRegistry>
          <Providers initialMode={initialMode}>
            <HeaderStyles />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
