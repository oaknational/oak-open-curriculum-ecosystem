import type { Metadata, Viewport } from 'next';
import type { JSX } from 'react';

import { cookies } from 'next/headers';

import { lexend } from './ui/fonts';
import StyledComponentsRegistry from './lib/registry';
import { Providers } from './lib/Providers';
import HeaderStyles from './ui/client/HeaderStyles';

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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'rgb(190 242 189)' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1021' },
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
      <body className={lexend.className}>
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
