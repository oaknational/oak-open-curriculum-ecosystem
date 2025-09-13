import type { Metadata, Viewport } from 'next';
import type { JSX } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

import { lexend } from '@/app/ui/fonts';
import StyledComponentsRegistry from '@/app/lib/registry';
import { Providers } from '@/app/lib/Providers';
import ThemeSelect from '@/app/ui/ThemeSelect';

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
        <Link href="/" style={{ marginRight: '1rem' }}>
          Home
        </Link>
        <Link href="/">Search</Link>
        <Link href="/api/docs" style={{ marginLeft: '1rem' }}>
          API Docs
        </Link>
      </nav>
      <ThemeSelect />
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {
            "(function(){try{var c=document.cookie.match(/(?:^|; )theme-mode=([^;]+)/);var m=c?decodeURIComponent(c[1]):null;var ls=null;try{ls=localStorage.getItem('theme-mode')}catch(_){};var pref=(ls||m);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=pref==='dark'||(pref===null||pref==='system')&&d;document.documentElement.dataset.theme=dark?'dark':'light';}catch(e){}})();"
          }
        </Script>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
