# Oak Components — Comprehensive Guide (Next.js App Router + TypeScript)

Official docs/Storybook: [components.thenational.academy](https://components.thenational.academy/?path=/docs/introduction--docs)

> **Audience:** Oak engineers and AI agents building internal demos and production features that should look and feel like [thenational.academy](https://www.thenational.academy).  
> **Goal:** Install, configure, and use `@oaknational/oak-components` effectively — from theming and SSR to real UI patterns (with a special focus on search UX), local dev, and deployment. Align examples with Next.js 15 + React 19 and repository conventions (pnpm, strict TS, British spelling).
>
> This guide draws on the public `oak-components` repo, usage patterns in Oak Web Application (OWA), and internal best practices. Examples use **Next.js App Router** and **TypeScript**.

---

## 0) Quickstart (TL;DR)

```bash
# 1) install
pnpm add @oaknational/oak-components styled-components

# 2) types (TS projects)
pnpm add -D @types/styled-components

# 3) env (images/icons/illustrations)
# .env.local
NEXT_PUBLIC_OAK_ASSETS_HOST=<provided-by-oak>
NEXT_PUBLIC_OAK_ASSETS_PATH=<provided-by-oak>

# 4) Next.js compiler (SSR for styled-components)
# next.config.ts
export default { compiler: { styledComponents: true } } as const;

# 5) wrap your app
# app/layout.tsx
import { OakThemeProvider, oakDefaultTheme, OakGlobalStyle } from "@oaknational/oak-components";
import { Lexend } from "next/font/google";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lexend = Lexend({ subsets: ["latin"] });
  return (
    <html lang="en">
      <OakGlobalStyle />
      <body className={lexend.className}>
        <OakThemeProvider theme={oakDefaultTheme}>{children}</OakThemeProvider>
      </body>
    </html>
  );
}
```

---

## 1) Installation & Project Prereqs

- **React 18** and **Next.js 13.5+** recommended.
- Install the library and peers:

  ```bash
  npm i @oaknational/oak-components styled-components
  npm i -D @types/styled-components
  ```

- **Env vars** (for image/icon hosting):

  ```bash
  NEXT_PUBLIC_OAK_ASSETS_HOST=...
  NEXT_PUBLIC_OAK_ASSETS_PATH=...
  ```

  These are required for components that fetch Oak-hosted assets (icons, illustrations, etc).

### 1.1 Next.js SSR for styled-components

Enable the SWC transform so styles render on the server and hydrate without FOUC:

```ts
// next.config.ts
import type { NextConfig } from 'next';
const config: NextConfig = { compiler: { styledComponents: true } };
export default config;
```

If you’re on styled-components v6 and need stricter SSR control, consider the `useServerInsertedHTML` pattern in a custom registry — but the compiler flag above is typically sufficient for Oak demos.

### 1.2 Next/Image remote patterns (optional, recommended)

Allow Oak assets (and Cloudinary fallback) to be served by Next/Image:

```ts
// next.config.ts
import type { NextConfig } from 'next';
const config: NextConfig = {
  compiler: { styledComponents: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_OAK_ASSETS_HOST!,
        port: '',
        pathname: `${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/**`,
      },
      {
        protocol: 'https',
        hostname: 'oaknationalacademy-res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
export default config;
```

---

## 2) App bootstrap — theme, globals, font

Oak uses **Lexend**. Combine Oak’s theme + global styles with Next’s optimized font loader:

```tsx
// app/layout.tsx
import { OakThemeProvider, oakDefaultTheme, OakGlobalStyle } from '@oaknational/oak-components';
import { Lexend } from 'next/font/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lexend = Lexend({ subsets: ['latin'] });
  return (
    <html lang="en">
      <OakGlobalStyle />
      <body className={lexend.className}>
        <OakThemeProvider theme={oakDefaultTheme}>{children}</OakThemeProvider>
      </body>
    </html>
  );
}
```

**Why these pieces?**

- `OakGlobalStyle` applies base resets + Oak defaults (typography, base elements).
- `OakThemeProvider` supplies the Oak design tokens (colors, spacing, breakpoints).
- The **Lexend** font locks in Oak’s typographic feel across the app.

---

## 3) Mental Model — Atomic Design

The library is organized as:

- **Atoms:** generic, minimal, usually unstyled primitives (e.g. `Box`, low-level inputs).
- **Molecules:** styled combinations of atoms (e.g. `IconButton`, `Button`, simple field + label).
- **Pages:** page-level sections composed of multiple atoms/molecules (e.g. complex forms, modals with logic).

**Rule of thumb:** Atoms don’t import molecules/pages; molecules don’t import pages. Page-level components may contain state/logic.

---

## 4) Common Components & Patterns

> The actual component names may evolve; the patterns are stable.

### 4.1 Buttons

```tsx
import { Button /* or OakPrimaryButton */ } from "@oaknational/oak-components";

<Button type="button">Default</Button>
<Button type="submit" /* variant="primary" */>Search</Button>
```

### 4.2 Icon + IconButton

```tsx
import { Icon, IconButton } from "@oaknational/oak-components";

<Icon name="search" aria-hidden="true" />
<IconButton icon={<Icon name="search" />} aria-label="Search" onClick={...} />
```

### 4.3 Inputs & Labels

```tsx
import { TextInput } from '@oaknational/oak-components';

<TextInput
  label="Search"
  placeholder="Type your query…"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  required
/>;
```

### 4.4 Modal (page-level)

```tsx
import { OakModal } from '@oaknational/oak-components';

<OakModal isOpen={open} onClose={setOpen}>
  {/* content */}
</OakModal>;
```

### 4.5 Layout helpers

Primitives like `Box` are handy for spacing or structure. Prefer theme spacing and tokens over hard-coded CSS values.

```tsx
import { Box } from '@oaknational/oak-components';

<Box /* e.g. padding="md" */>
  <h2>Section</h2>
  <p>Content…</p>
</Box>;
```

---

## 5) Building a search experience (Oak‑style)

Below are **two** complementary approaches: a lightweight demo you can drop into any app, and the **OWA-inspired structure** used in production.

### 5.1 Lightweight demo (client component)

```tsx
// app/(demo)/search/page.tsx
'use client';
import { useState } from 'react';
import { TextInput, Icon, IconButton, Button } from '@oaknational/oak-components';

export default function DemoSearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ id: string; title: string; blurb?: string }>>([]);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    // TODO: call your internal search API
    const data = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json());
    setResults(data.items);
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSearch} role="search" aria-label="Search for resources">
        <TextInput
          label="Search"
          placeholder="Try 'algebra'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <IconButton type="submit" icon={<Icon name="search" />} aria-label="Search" />
        {/* alternatively: <Button type="submit">Search</Button> */}
      </form>

      {loading && <p>Loading…</p>}

      <ul aria-live="polite">
        {results.map((r) => (
          <li key={r.id}>
            <h3>{r.title}</h3>
            {r.blurb && <p>{r.blurb}</p>}
            {/* use a styled Oak Button/Link to navigate */}
            <Button onClick={() => location.assign(`/resource/${r.id}`)}>View</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Notes**

- Use `role="search"` and a programmatic label (or visible heading) for accessibility.
- Prefer an **IconButton** with `aria-label`, or a text **Button** (“Search”).
- Announce results area via `aria-live="polite"` for better SR feedback on updates.

### 5.2 OWA‑inspired structure (production‑friendly)

The OWA search page composes providers, head/pagination helpers, and a `Search` view, while fetching static data at build time. Here’s how to emulate the **structure** without copying internal logic:

```tsx
// app/teachers/search/page.tsx (App Router equivalent structure)
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { Metadata } from 'next';
import { SearchView } from '@/components/search/View'; // your own view that uses Oak inputs/buttons
import { getSearchPageData } from '@/lib/api'; // your API client

export const metadata: Metadata = {
  title: 'Search for Free Teaching Resources',
  description: 'Search for Free Teaching Resources',
  robots: { index: false }, // OWA noindex on search listings
};

export default async function TeachersSearchPage() {
  const curriculumData = await getSearchPageData(); // key stages, subjects, etc.

  // set up your own search/filter hooks client-side within <SearchView/>
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      {/* Optional: pagination head component, canonical links, etc. */}
      <SearchView curriculumData={curriculumData} />
    </OakThemeProvider>
  );
}
```

Inside `SearchView`, compose Oak inputs (TextInput, checkboxes/toggles for filters), and Oak Buttons. Keep filter state client-side, and use Next’s RSC + client components split to minimize JS where possible.

**Key takeaways from OWA:**

- Keep **theme provider** near the page/root.
- Fetch **taxonomy data** (key stages, subjects, content types) server-side for quick first paint.
- Encapsulate filter state + results + pagination in dedicated hooks/components.

---

## 6) Local dev & Storybook

### 6.1 Storybook

The components library ships with Storybook. In your **app**, you can also run a Storybook that imports `@oaknational/oak-components` for rapid UI iteration:

```bash
npm run storybook
```

Set **Lexend** in Storybook preview and inject `OakGlobalStyle` + `OakThemeProvider` so stories look like Oak. Mirroring production env vars (`NEXT_PUBLIC_OAK_ASSETS_*`) ensures icons/images show up.

### 6.2 Testing components inside a host app

A handy workflow uses **yalc** to iterate on `oak-components` locally while testing in your app:

```bash
# inside oak-components repo
npm i -g yalc
npm run publish:local

# in your app
yalc add @oaknational/oak-components
# ... develop ...
yalc remove @oaknational/oak-components && npm i  # restore from npm
```

Oak’s OWA includes convenience scripts that automate this; you can mirror that pattern in your demo repo.

---

## 7) Quality Gates & CI/CD (what to mirror)

- **Conventional Commits** + **semantic-release** automate versioning & npm publish.
- **Verify** pipeline typically runs: formatting, lint, type-checks, tests, and static analysis.
- **Node 20** is standard across CI for the library.
- **Release** happens on `main` merges with signed provenance.

For an internal demo, you can simplify: keep conventional commits and a minimal CI (format/lint/type/test). If you publish a forked/internal package, semantic-release remains an option.

---

## 8) Deployment & environments

### 8.1 Next.js App (your demo)

- **Vercel** recommended; configure environment variables (`NEXT_PUBLIC_OAK_ASSETS_*`).
- For preview deployments, restrict access to Oak staff where needed (Vercel protection or Cloudflare auth).
- Cache headers should be respected by any proxy/CDN layer; leave heavy caching tuning out of the initial demo.

### 8.2 Components Storybook (optional)

If you host your own Storybook:

- Build with `npm run build-storybook`.
- Host on Vercel (static) or any static site host.
- Use a custom domain (e.g., `components.your-subdomain`) and lock it down if internal-only.

---

## 9) Troubleshooting & gotchas

- **FOUC / style flicker:** Ensure `compiler.styledComponents = true`. If issues persist, verify there’s a **single** styled-components version in your lockfile.
- **Icons/images not loading:** Double-check `NEXT_PUBLIC_OAK_ASSETS_HOST` and `NEXT_PUBLIC_OAK_ASSETS_PATH`. Add Next/Image `remotePatterns` for those hosts.
- **Anchor/button quirks:** When using button components as anchors, supply appropriate props (`href`, `role="link"`, `as="a"`) and verify layout alignment. Prefer plain `Button` for actions, and Next `<Link>` + Oak styles for navigation.
- **Accessibility:** Always use the `label` prop for inputs. Provide `aria-label` for icon-only controls. Mark results containers with `aria-live="polite"` if contents update dynamically.
- **Theming overrides:** Stick to `oakDefaultTheme` for an Oak demo. If you extend the theme, keep token names/styles intact to avoid mismatches.

---

## 10) Full search page example (drop‑in)

This example shows a cohesive Oak‑styled search page you can adapt for the demo app. It uses RSC for data bootstrapping + a client search bar.

```tsx
// app/teachers/search/page.tsx
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import SearchClient from './SearchClient';
import { getSearchTaxonomy } from '@/lib/api'; // keyStages, subjects, contentTypes, etc.

export default async function Page() {
  const taxonomy = await getSearchTaxonomy();
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <SearchClient taxonomy={taxonomy} />
    </OakThemeProvider>
  );
}
```

```tsx
// app/teachers/search/SearchClient.tsx
'use client';
import { useState } from 'react';
import { TextInput, Icon, IconButton, Button } from '@oaknational/oak-components';

type Props = {
  taxonomy: {
    keyStages: Array<{ slug: string; title: string }>;
    subjects: Array<{ slug: string; title: string }>;
    contentTypes: Array<{ slug: string; title: string }>;
  };
};

export default function SearchClient({ taxonomy }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ id: string; title: string; blurb?: string }>>([]);
  const [selectedKeyStages, setSelectedKeyStages] = useState<string[]>([]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    const params = new URLSearchParams({ q: query, ks: selectedKeyStages.join(',') });
    const data = await fetch(`/api/search?${params}`).then((r) => r.json());
    setResults(data.items);
    setLoading(false);
  }

  return (
    <section>
      <header>
        <h1>Search for Free Teaching Resources</h1>
      </header>

      <form onSubmit={submit} role="search" aria-label="Search for resources">
        <TextInput
          label="Search"
          placeholder="Try 'algebra'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <IconButton icon={<Icon name="search" />} type="submit" aria-label="Search" />
      </form>

      {/* Simple filter pills (substitute real Oak components if available) */}
      <div aria-label="Key stage filters">
        {taxonomy.keyStages.map((ks) => {
          const active = selectedKeyStages.includes(ks.slug);
          return (
            <Button
              key={ks.slug}
              type="button"
              onClick={() =>
                setSelectedKeyStages((s) =>
                  s.includes(ks.slug) ? s.filter((x) => x !== ks.slug) : [...s, ks.slug],
                )
              }
              /* variant={active ? "primary" : "secondary"} */
              aria-pressed={active}
            >
              {ks.title}
            </Button>
          );
        })}
      </div>

      {loading && <p>Loading…</p>}

      <ul aria-live="polite">
        {results.map((r) => (
          <li key={r.id}>
            <h3>{r.title}</h3>
            {r.blurb && <p>{r.blurb}</p>}
            <Button onClick={() => location.assign(`/resource/${r.id}`)}>View</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

## 11) Checklist (copy/paste)

- [ ] Install `@oaknational/oak-components` (+ `styled-components`, TS types).
- [ ] Set `NEXT_PUBLIC_OAK_ASSETS_HOST` and `NEXT_PUBLIC_OAK_ASSETS_PATH`.
- [ ] Enable `compiler.styledComponents = true` in `next.config.ts`.
- [ ] Use `<OakGlobalStyle />` and `<OakThemeProvider theme={oakDefaultTheme}>` in `app/layout.tsx`.
- [ ] Use Oak components for inputs, buttons, modals, icons; keep labels and `aria-*` attributes.
- [ ] Optionally set Next/Image `remotePatterns` for Oak/CDN hosts.
- [ ] For demos: keep CI simple; for packages: prefer Conventional Commits + semantic-release.
- [ ] For previews: protect deployments; keep env vars configured in each environment.

---

## 12) Appendix: Useful Scripts

- **Storybook**: `npm run storybook`
- **Build Storybook**: `npm run build-storybook`
- **Local publish (yalc)**: `npm run publish:local` (in `oak-components`), then `yalc add @oaknational/oak-components` in your app
- **Remove local publish**: `yalc remove @oaknational/oak-components && npm i`

---

_Happy shipping — and keep it Oak‑y._
