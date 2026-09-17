import { readFileSync } from 'node:fs';

import { escapeInlineScript } from '@/lib/inline-script';
import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Lexend } from 'next/font/google';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

// Oak's primary typeface. Body default is weight 400 (matches the prototype); 600/700 for
// headings and emphasis. Exposed as the --font-lexend CSS variable consumed by globals.css.
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
});

// The design system's theme/motion state owner, inlined pre-paint (the kit
// docs §4 shape: a plain relative read against the app root — bundler module
// resolution mangles fs paths under Turbopack). public/oak-theme.js is a
// tracked copy of the workspace package's file;
// demos/oak-design-showcase/tools/validate-kit-assets.ts (root
// repo-validators:check chain, so pre-commit and CI both) turns any drift
// into a red gate. A raw inline <head>
// script is the only shape that cannot flash: it executes during parse,
// before first paint — next/script beforeInteractive does not block
// hydration and its external fetch can let first paint precede theme
// application (ADR-213 §3).
// escapeInlineScript: the runtime's header comment contains a literal
// </script> which would otherwise terminate the inline element mid-comment
// and the bootstrap after it would never execute (round-3 review finding).
const oakThemeSource = escapeInlineScript(readFileSync('public/oak-theme.js', 'utf8'));

export const metadata: Metadata = {
  title: 'Curriculum hub — Oak National Academy',
  description: "Search Oak's free, fully sequenced curriculum: lessons, units and threads.",
  // The fidelity tool's app-identity sentinel (a capture must prove the
  // answering server IS this app, never a port-squatting neighbour).
  other: { 'oak-app': 'oak-curriculum-hub' },
};

// suppressHydrationWarning: the pre-paint script mutates <html> (data-theme /
// data-motion) before React hydrates; the escape hatch works one level deep.
export default function RootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <html lang="en-GB" className={lexend.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: oakThemeSource }} />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
