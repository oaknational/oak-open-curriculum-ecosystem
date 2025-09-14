# Semantic Search Caching Plan (Next.js App Router on Vercel)

Role: Define a safe, performant caching strategy for API routes and server data used by the Semantic Search app on Vercel. Focus on Next.js App Router behaviours, Vercel Data Cache, CDN caching headers, tag‑based revalidation, and operational guardrails.

Related plans: `semantic-search-api-plan.md`, `semantic-search-ui-plan.md`, `semantic-search-documentation-plan.md`

---

## Goals

- Reduce latency and cost for read endpoints without serving stale critical data.
- Prefer fine‑grained, explicit caching with clear invalidation (tags) over broad, implicit caching.
- Keep behaviour deterministic (no hidden cache invalidations via cookies/headers access).

---

## Constraints and principles

- Use the Oak SDK for data; avoid raw HTTP.
- Admin/side‑effect routes must never be cached.
- Do not rely on browser cache for correctness; use short‑lived browser hints only for GET docs.
- Accessing `cookies()`/`headers()` in handlers forces dynamic behaviour; avoid in cacheable routes.
- Conform to Vercel and Next.js guidance; avoid anti‑patterns (e.g., async layout unrelated to API, third‑party script tags over `next/script`).

---

## Endpoint classes and caching policy

1. Public docs/static artefacts

- Examples: `GET /api/openapi.json`, docs pages (if served by app).
- Policy: Static with periodic revalidation.
  - Next.js: `export const revalidate = 60 * 60; // 1h` and `export const dynamic = 'force-static'`.
  - CDN: set `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
  - Invalidate on schema changes via tag revalidation (optional) or by versioning the schema path.

2. Public Structured Search (deterministic, read‑only)

- Example: `POST /api/search` (body parameters: scope, subject, keyStage, minLessons, text).
- Policy: Data‑cache via `unstable_cache` keyed by a stable hash of the validated payload; tag with the current index/rollup version.
  - Next.js App Router route handler: wrap core execution in `unstable_cache(fn, [cacheKey], { tags: ['search-structured', 'index:vX'] })`.
  - Set `export const dynamic = 'force-dynamic'` (POST responses are not CDN‑cached) and omit CDN cache headers.
  - Revalidation: trigger `revalidateTag('index:vX')` (or rotate tag version) after index/rollup completes.

3. Public Natural‑Language Search (delegates to structured)

- Example: `POST /api/search/nl` (501 if LLM disabled).
- Policy: Do not cache on the NL boundary. Instead, transform NL → validated Structured payload
  deterministically, then call the Structured Search path so the Data Cache key is the structured
  payload (best unstructured→structured key). This ensures NL benefits from the same caching.
  - Next.js: `export const revalidate = 0; export const dynamic = 'force-dynamic'` on the NL route.
  - The structured route remains the only cache owner via `unstable_cache`.

4. Admin/maintenance routes

- Examples: `GET /api/index-oak`, `GET /api/rebuild-rollup` (guarded by `x-api-key`).
- Policy: Never cache. Always `revalidate = 0`, `dynamic = 'force-dynamic'`, and do not emit CDN cache headers.
- Side effects: on success, invalidate relevant tags (see “Invalidation”).

---

## Next.js Data Cache (granular server data)

Use when:

- The underlying data is immutable for a time window; request parameters are fully captured by the cache key; and fresh data arrival is coordinated (index/rollup) so we can invalidate.

Mechanisms:

- `unstable_cache` for arbitrary async functions (including POST bodies), with explicit keys and `tags`.
- `fetch()` with `cache: 'force-cache'`/`next: { revalidate }` for GET upstreams (SDK should handle fetch internally; prefer `unstable_cache` in our layer for clarity and tagging).
- Tag revalidation: `revalidateTag(tag)` to invalidate data across regions; runs within ~300ms.

Key design:

- Key = stable JSON of validated, normalised payload + version prefix (e.g., `v1|{"scope":"units",...}`) hashed (e.g., SHA‑256 hex) to keep size bounded.
- Tags = `['search-structured', 'index:vX']` where `vX` is a monotonic index version you bump after rollups.

---

## CDN caching (Vercel Edge) vs Data Cache

- CDN caching requires cacheable responses (primarily GET) with explicit `Cache-Control` headers.
- Data Cache is per‑region cache for server data (works with App Router), independent from CDN.
- Use CDN for static artefacts (OpenAPI JSON, static docs). Use Data Cache for search results.
- Avoid caching dynamic POST responses at CDN; rely on Data Cache where appropriate.

---

## Invalidation and versioning

- On `index-oak` and `rebuild-rollup` success:
  - Rotate index tag (e.g., from `index:v7` → `index:v8`) and call `revalidateTag('index:v8')`.
  - Optionally keep a shorter lived global tag `search-structured` for manual flushes.
- For OpenAPI or docs artefacts, either bump a path version (`/api/openapi.v2.json`) or rely on time‑based revalidation.

---

## Example snippets

Structured search handler (POST) with data cache and tags:

````ts
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache, revalidateTag } from 'next/cache';
import { createHash } from 'node:crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function stableKey(payload: unknown, indexVersion: string): string {
  const json = JSON.stringify(payload);
  const hash = createHash('sha256').update(json).digest('hex');
  return `${indexVersion}|${hash}`;
}

const cachedSearch = (indexVersion: string) =>
  unstable_cache(
    async (payload: unknown) => {
      // Execute deterministic structured search using SDK
      // return await sdk.searchStructured(payload)
      return { results: [] };
    },
    undefined,
    { tags: ['search-structured', `index:${indexVersion}`] },
  );

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  // TODO: validate & normalise body here
  const indexVersion = process.env.SEARCH_INDEX_VERSION ?? 'v1';
  const key = stableKey(body, indexVersion);
  const get = cachedSearch(indexVersion);
  const data = await get(key)(body);
  return NextResponse.json(data, { status: 200 });
}
NL route delegating to structured (no own caching):

```ts
// app/api/search/nl/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function nlToStructured(nl: { q: string }): unknown {
  // Deterministically map NL query to structured payload
  // return { scope, subject, keyStage, minLessons, text };
  return {};
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const nl = await req.json();
  const structured = nlToStructured(nl);
  const res = await fetch(new URL('/api/search', req.url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(structured),
    // Important: do not force cache here; structured route owns Data Cache
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
````

````

Invalidate after rollup:

```ts
// app/api/rebuild-rollup/route.ts
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // run rollup …
  const nextVersion = 'v8'; // compute/persist your new version
  revalidateTag(`index:${nextVersion}`);
  return NextResponse.json({ ok: true, version: nextVersion });
}
````

OpenAPI JSON with CDN cache:

```ts
// app/api/openapi.json/route.ts
import { NextResponse } from 'next/server';
export const dynamic = 'force-static';
export const revalidate = 60 * 60; // 1 hour

export async function GET() {
  const json = {
    /* build or load cached schema */
  };
  const res = NextResponse.json(json);
  res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res;
}
```

---

## Operational guardrails

- Do not access `cookies()`/`headers()` in cacheable routes; it disables static optimisations and can change cache keys implicitly.
- Keep validation strict; only cache validated, normalised inputs.
- Use short TTLs or no cache for any data that can expose user‑specific context.
- Consider `runtime = 'nodejs'` unless all dependencies are edge‑safe; move to `runtime = 'edge'` selectively for GET docs if desired.

---

## Checklist

- Classify each route into one of the policies above.
- Add `dynamic`/`revalidate` exports to every route.
- Add CDN headers only to GET artefacts.
- Wrap deterministic compute in `unstable_cache` with explicit keys and tags.
- Call `revalidateTag` on index/rollup completion and rotate index version.
- Monitor hit/miss with logging (sampled) to validate behaviour.

---

## References

- Vercel Data Cache: https://vercel.com/docs/infrastructure/data-cache
- Vercel Monorepos Remote Caching: https://vercel.com/docs/monorepos/remote-caching
- Next.js CI Build Caching (Pages): https://nextjs.org/docs/14/pages/building-your-application/deploying/ci-build-caching
- Vercel Production Checklist: https://vercel.com/docs/production-checklist
- Conformance (general): NEXTJS_USE_NEXT_SCRIPT, NEXTJS_NO_ASYNC_LAYOUT
