# Static-First as an Architectural Constraint

> **Origin**: opal-connection-site, 2026-03-28
> **Source evidence**: Astro static site on Cloudflare Pages — SSR, Worker
>   runtime, and client-side state explicitly prohibited unless justified
> **Status**: Transferable pattern for web projects

## The Problem

Modern web frameworks default to runtime complexity: server-side rendering,
client-side hydration, API routes, middleware, edge functions. Each capability
is individually useful but collectively creates an architecture that is harder
to reason about, harder to test, and harder to deploy reliably.

For many web projects — especially landing pages, documentation, marketing
sites, and content-first applications — the simplest correct architecture is
static HTML delivered from a CDN. Adding runtime complexity should require
justification, not be the default.

## The Pattern

### Static delivery is the default

`astro build` (or equivalent) produces `dist/`. A CDN serves it. No server, no
runtime, no edge functions. This is the architecture until a requirement
genuinely needs something more.

### Runtime complexity requires justification

Before adding SSR, client-side state, API routes, or edge functions, answer:

1. **Can this be done at build time?** Data that changes rarely can be fetched
   at build time and baked into static pages.
2. **Can this be done with semantic HTML and CSS?** Accordions, tabs, theme
   toggles, and many interactive patterns work without JavaScript.
3. **Is the complexity proportional to the value?** A contact form might
   justify a single API route. A preference toggle might justify a small
   `<script>`. Neither justifies a full hydration framework.

### Keep environment typing honest

Do not declare runtime types (`Env`, `KVNamespace`, `D1Database`) unless the
matching adapter, binding, and dependency are actually configured. Stale runtime
typing is worse than no runtime typing — it creates a false promise that agents
and developers will build on.

### The deployment path is a contract

`astro build → dist/ → wrangler pages deploy ./dist` (or equivalent). This
path should be documented, tested by the build gate, and never contradicted by
config files or type declarations that imply a different runtime model.

## How It Works Here

- `astro.config.mjs`: static output mode, no SSR adapter
- `wrangler.jsonc`: Pages deployment, no Worker bindings
- `src/env.d.ts`: minimal, no runtime type declarations
- `principles.md`: "Default to static delivery, semantic HTML, and CSS. Do not
  add SSR, Worker runtime behaviour, or client-side state unless the
  requirement genuinely needs it."
- The only client-side JavaScript is a theme toggle (~20 lines)

## When to Adopt

Any web project where the primary content is known at build time. This includes
landing pages, documentation, blogs, marketing sites, and many content-first
applications. The constraint applies until it doesn't — and the moment it stops
applying should be documented as an architectural decision.

## Anti-Patterns

- Installing an SSR adapter "just in case" — it changes the build output and
  deployment model even when unused
- Declaring Worker bindings or edge function types without configured
  dependencies — agents will build on the false premise
- Using client-side state management for data that could be baked into the page
  at build time
- Adding hydration to a component that works with CSS alone
