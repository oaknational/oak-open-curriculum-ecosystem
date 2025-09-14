import type { Metadata, Viewport } from 'next';
import React, { type JSX } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';

import { lexend } from './ui/fonts';
import ThemeSelect from './ui/ThemeSelect';
import StyledComponentsRegistry from './lib/registry';
import { Providers } from './lib/Providers';

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

function Header(): JSX.Element {
  return (
    <header
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <Link href="/" aria-label="Home">
        <Image
          src="/oak-national-academy-logo-512.png"
          alt="Oak National Academy"
          width={32}
          height={32}
          style={{ display: 'block' }}
        />
      </Link>
      <nav aria-label="Primary">
        <Link href="/" style={{ marginLeft: '1rem' }}>
          Home
        </Link>
        <Link href="/api/docs" style={{ marginLeft: '1rem' }}>
          Open API Docs
        </Link>
        <span style={{ marginLeft: '1rem' }}>|</span>
        <Link href="/admin" style={{ marginLeft: '1rem' }}>
          Admin
        </Link>
        <Link href="/healthz" style={{ marginLeft: '1rem' }}>
          Health (API)
        </Link>
      </nav>
      <ThemeSelect />
    </header>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get('theme-mode')?.value;
  const initialMode =
    cookieValue === 'light' || cookieValue === 'dark' || cookieValue === 'system'
      ? cookieValue
      : 'system';
  return (
    <html lang="en" data-theme-mode={initialMode}>
      <body className={lexend.className}>
        <StyledComponentsRegistry>
          <Providers initialMode={initialMode}>
            <Header />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
