import { readFileSync } from 'node:fs';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import { escapeInlineScript } from '../lib/inline-script';

import './globals.css';

export const metadata: Metadata = {
  title: 'Design showcase — Oak Open Curriculum Design System',
  description:
    'Live one-page showcase of the Oak Open Curriculum Design System: tokens, components, identity and theme switching.',
  // The fidelity tool's app-identity sentinel (a capture must prove the
  // answering server IS this app, never a port-squatting neighbour).
  other: { 'oak-app': 'oak-design-showcase' },
};

// The design system's theme/motion state owner, inlined pre-paint (kit docs
// §4): a plain relative read (cwd = the workspace root under next dev,
// next build and next start alike) — bundler module resolution cannot
// supply a real fs path in a bundled server component, so
// public/oak-theme.js is a tracked copy of the workspace package's file,
// and tools/validate-kit-assets.ts (root repo-validators:check chain)
// turns any drift into a red gate. A raw inline <head> script is the only
// shape that cannot flash: it executes during parse, before first paint —
// next/script beforeInteractive does not block hydration and its external
// fetch can let first paint precede theme application (ADR-213 §3).
const oakThemeSource = escapeInlineScript(readFileSync('public/oak-theme.js', 'utf8'));

// No font pipeline here by design: the kit self-hosts Lexend through its
// own @font-face (framework-invariant trunk, ADR-213) — a package consumer
// adds nothing.
// suppressHydrationWarning: the pre-paint script mutates <html> (data-theme /
// data-motion) before React hydrates; the escape hatch works one level deep.
export default function RootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: oakThemeSource }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
