---
name: "A Server Component Reads Its Data Layer Directly — Never HTTP-Fetches Its Own Route Handler"
polarity: pattern
use_this_when: "A Next.js (or equivalent RSC) server component fetches data — and any shape involving fetch('/api/…'), NEXT_PUBLIC_BASE_URL, or localhost self-calls appears."
category: code
layer: family
proven_in: "curriculum-hub-demo 2026-07-01 (data-plane lane): a server component self-fetching NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3010'/api/… was replaced by the typed direct call; the untrusted-unknown apparatus (runtime guard + narrowing) deleted with it. Grounded against live react.dev ('access your data layer without having to build an API') and the installed Next.js 16.2.4 docs ('you do not need to use API Routes and Route Handlers together')."
proven_date: 2026-07-01
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "The self-fetch is a waterfall + a needless layer AND a latent deploy bug (localhost breaks off-box); it also manufactures an untrusted boundary inside trusted code, dragging in guards that strict-validation-at-boundary never asked for."
  stable: true
---

# A Server Component Reads Its Data Layer Directly

> **POLARITY: PATTERN.** The typed direct call is *inside* the trust
> boundary — the runtime guard the self-fetch needed deletes too.

## The shape

1. The server component imports and calls the data-layer function
   directly (the same function the Route Handler would call). Route
   Handlers exist for *external* consumers, not for the app's own
   server-rendered pages.
2. The direct call is typed end-to-end, so the `unknown`-narrowing
   apparatus a fetch boundary requires (guard + validator) is deleted,
   not relocated — `strict-validation-at-boundary` targets untrusted
   input, and an in-process typed call is not one.
3. Verify framework best practice against the LIVE official docs (the
   installed package's bundled docs are version-accurate), never from
   memory — the self-fetch shape reads plausibly and used to be common.

## The sibling module-boundary rule

Client-boundary guards and view-models must NOT live in a `server-only`
module: a client component importing the runtime value pulls
`server-only` into the client bundle and `next build` fails. Shared
view-models + runtime guards go in a client-safe `*-types.ts`;
SDK/secret wiring stays server-only (worked instance 2026-06-30:
`isSearchResults` moved from the server-only search client to a
client-safe types module).
