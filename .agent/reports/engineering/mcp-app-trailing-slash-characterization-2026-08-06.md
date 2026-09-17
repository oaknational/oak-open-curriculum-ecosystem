# MCP app trailing-forward-slash behavior — read-only characterization (2026-08-06)

Owner-commissioned (verbatim scope: "let's make the mcp app express app
policy on trailing forward slashes explicit, in an ADR, in express, and
if necessary in vercel configuration... but this is strictly read only
for now, as changes like that could break things"). Produced by a
read-only investigation agent at the Director seat; no file, config, or
behavior was changed. Citation baseline: origin/main at `dd6aff00a`
(PR #794 landed); live probes against app v1.152.2 on both hosts.
This report is the input to the future ADR; the ADR itself awaits the
owner's word.

## (a) Behavior matrix

### Express layer (code)

`strict routing` is set **nowhere** — no `app.set(...)` in the app, and
no `Router()` receives a `strict` option
(`src/app/bootstrap-helpers.ts:236` creates the bare `express()`;
`src/oauth-proxy/oauth-proxy-routes.ts:44` a bare `Router()`). Express
5.2.1; the router is built with `strict: this.enabled('strict
routing')`, so trailing slash is optional on **every** route path.

| Mount | Where | `/path/` variant hits |
| --- | --- | --- |
| `app.get('/')` landing page | `src/app/static-content.ts:23` | `/` only (no slash variant exists) |
| Static, root mount | `static-content.ts:135` (`redirect:false, index:false, etag, maxAge:0`) | directory/miss falls through via `next()`; outside `/mcp` that ends at Express's final 404 |
| Static, routed mount at `/mcp` | `static-content.ts:136` (`ROUTED_ASSET_BASE='/mcp'`) | `app.use` prefix-matches `/mcp`, `/mcp/`, `/mcp/*`; `redirect:false` suppresses the 301 `/mcp`→`/mcp/`; `index:false` suppresses index probing; directories and misses fall through |
| `/mcp` HTML negotiation | `src/application.ts:99–108`, logic `src/mcp-middleware.ts:58–86` | `app.use('/mcp', …)` — matches `/mcp`, `/mcp/`, every subpath; GET/HEAD with `text/html` Accept gets the landing page, 200 no-store |
| `/mcp` accept gate | `src/application.ts:109`, `src/mcp-middleware.ts:97–147` | same prefix semantics; 406 without `text/event-stream`; non-GET also needs `application/json` (so bare HEAD is 406) |
| MCP protocol routes | `src/auth-routes.ts:126,128` (`app.post('/mcp')`, `app.get('/mcp')`) | non-strict: `/mcp/` matches; `/mcp/anything` does not |
| **DELETE `/mcp`** | **not registered anywhere** (stateless transport, `sessionIdGenerator: undefined`, `src/app/core-endpoints.ts:142`) | inferred: a DELETE passing the accept gate falls to Express's final 404, not the spec-suggested 405 (unprobed — write-shaped) |
| `/.well-known/oauth-protected-resource` (+`/mcp` variant), `/.well-known/oauth-authorization-server` | `src/auth-routes.ts:81–93` | non-strict: slash variants match in-process (confirmed live on alpha) |
| `/oauth/register\|authorize\|token` | `oauth-proxy-routes.ts:67–80`, mounted at `src/app/oauth-and-caching-setup.ts:115` | non-strict: slash variants match (unprobed; two are POST) |
| `/healthz` | `src/app/health-endpoints.ts:11,15` | `/healthz/` matches (confirmed live) |
| `/assets/download/:lesson/:type` | `src/asset-download/asset-download-route.ts:176` | slash variant matches non-strict (unprobed) |

Composition consequence under `/mcp` (order: static → negotiation →
gate → routes): any `/mcp/*` path that is not a real file — directories
(`/mcp/oak-ds/`), missing assets, `styles.css/` — **never 404s**:
browser Accept gets the landing page (200), anything else gets 406.

### Vercel layer

`vercel.json` (the only one in the repo): `framework: "express"` +
`ignoreCommand` — **no `trailingSlash`, no rewrites, no redirects**.
Observed on alpha: no platform normalization — slash variants pass
through to Express untouched. Dashboard-level project config: unknown
from the repo (observed behavior implies none).

### Edge layer (Cloudflare, canonical host)

Repo record: origin rule "scoped to `/mcp` and `/mcp/*`"
(`static-asset-paths.ts:16–17`; the change is `oaknational/Cloud-Config#551`,
MCP-172; MCP-344 extended scope to the path-scoped well-knowns).
**Exact rule expression and wildcard semantics: unknown from this
repo.** Observed: `/mcp/` IS routed to the app; qualified well-knowns
are routed slashless-exact only — their slash variants fall to the main
site.

### Live probes (2026-08-06, `curl -sI`, app v1.152.2)

| Path | www.thenational.academy | curriculum-mcp-alpha.oaknational.dev |
| --- | --- | --- |
| `/mcp` bare HEAD | 406 JSON | 406 JSON |
| `/mcp/` bare HEAD | 406 JSON | 406 JSON |
| `/mcp` Accept: text/html | 200 text/html, no-store | 200 text/html |
| `/mcp/` Accept: text/html | 200 text/html | 200 text/html |
| `/mcp` / `/mcp/` Accept: text/event-stream (HEAD) | both 406 (HEAD needs json too) | both 406 |
| `/mcp/oak-ds/styles.css` | 200 text/css | 200 text/css |
| `/mcp/oak-ds/styles.css/` | 406 | — |
| `/mcp/oak-ds/` bare / with text/html | 406 / **200 landing page** | 406 / **200 landing page** |
| `/mcp/oak-ds/missing-file.css` | 406 (never 404 under `/mcp`) | — |
| `/oak-ds/styles.css` | — (not edge-routed) | 200 text/css |
| `/oak-ds/` (any Accept) | — | **404** (root static falls through) |
| `/.well-known/oauth-protected-resource` | **404 main-site HTML (not edge-routed)** | 200 JSON |
| `/.well-known/oauth-protected-resource/` | **308 → slashless** (main site's redirect) | 200 JSON |
| `/.well-known/oauth-protected-resource/mcp` | 200 JSON (app) | 200 JSON |
| `/.well-known/oauth-protected-resource/mcp/` | **308 → slashless** (main site) | 200 JSON |
| `/.well-known/oauth-authorization-server` (+`/`) | 200 JSON (app) / 308 main site | 200 / 200 |
| `/healthz` / `/healthz/` | — | 200 / 200 |

Two notable canonical-host facts: (1) the unqualified PRM path is
served by the main site's 404 — only the RFC 9728 path-qualified
`/…/mcp` variant reaches the app; (2) slash variants of the well-knowns
only work because the MAIN SITE (a different team's deployment)
308-redirects them onto the slashless path — an accidental
cross-project repair, not a designed contract.

## (b) Where behavior is implicit

1. All trailing-slash equivalence on declared routes rides the Express
   non-strict DEFAULT — zero declared policy, zero tests.
2. The 200-HTML/406-never-404 space under `/mcp/*` is an emergent
   composition of `app.use` prefix semantics + fall-through static +
   negotiation ordering — asserted nowhere as a policy.
3. `redirect:false, index:false` is the one declared piece, pinned only
   indirectly (`mcp-html-negotiation.integration.test.ts` bare-`/mcp`
   status pins); nothing pins `/mcp/` or directory paths.
4. Vercel non-normalization exists only as the absence of a
   `trailingSlash` key.
5. Edge slash-variant repair depends on the main site's redirect
   config.
6. `CLERK_SKIP_PATHS` is exact-match
   (`src/conditional-clerk-middleware.ts:34–43,99`): slash variants do
   not skip clerkMiddleware while their routes still match — same
   observable status today, silently different middleware path. The
   `/mcp` branch (`:110`) IS slash-tolerant.

## (c) Risks if each implicit behavior changed

- **Enabling strict routing**: `POST /mcp/` becomes 404 on both hosts —
  breaks any MCP client configured with a trailing slash, silently (no
  test would go red). Well-known slash variants 404 on alpha.
- **Losing `redirect:false`**: `GET /mcp` 301s to `/mcp/` before the
  negotiation and the protocol GET leg; SSE clients and
  non-redirect-following agents break. Caught for bare `/mcp` by the
  negotiation suite; the `/mcp/` and directory legs are unpinned.
- **Adding `trailingSlash` to vercel.json (either value)**: converts
  in-place equivalence into a 308 hop on the PROTOCOL endpoint —
  POST-based JSON-RPC clients follow redirects inconsistently; either
  value is a regression here.
- **Edge rule narrowing** to exact `/mcp`: drops `/mcp/` and every
  asset — the exact MCP-509 failure class. Widening to root namespaces
  is ruled out (`static-asset-paths.ts:21–26`).
- **Main site changing its trailing-slash policy**: the accidental 308
  repair of well-known slash variants disappears — undetectable from
  this repo's CI.
- **Making missing assets 404 under `/mcp`**: must not be done by
  reordering mounts — assets must stay ahead of the accept/auth gates.

## (d) Draft policy recommendation for the ADR

**Canonical form is slashless; slash variants are tolerated in place
(equivalence), never redirected; all self-published URLs are
slashless.**

- The app already publishes only slashless self-descriptions
  (`MCP_RESOURCE_PATH = '/mcp'`, `src/served-origin.ts:30`; the PRM
  `resource` at `auth-routes.ts:75`). Keep that as the contract.
- Tolerance-in-place beats redirect-normalization because the primary
  consumer is a POST JSON-RPC + SSE-GET protocol client: redirects on
  POST/SSE are the least-interoperable HTTP behavior in this
  population. It beats strictness (404) because slash-appending client
  configs are a real, silent failure class and strictness buys nothing
  (no route ambiguity exists).
- Make the tolerance DECLARED AND PINNED: integration tests asserting
  `POST/GET /mcp/` ≡ `/mcp` (status class per Accept), `/healthz/`,
  both well-known slash variants; plus a direct pin on `/mcp/oak-ds/`
  and one missing-asset path so the never-404-under-`/mcp` consequence
  is a recorded decision rather than a surprise.
- Named tradeoffs: duplicate URLs for the same content (mitigated:
  HTML is no-store, assets ETag-revalidated); the
  200-landing-page-for-any-`/mcp/*`-browser-GET behavior is generous —
  the ADR should either ratify it (friendly catch-all) or scope a
  follow-up for real 404s under `/mcp` for asset-shaped misses; edge
  slash variants of well-knowns remain out-of-contract (RFC 9728/8414
  clients use exact paths) — document the main-site 308 as observed,
  unrelied-upon behavior.

## (e) What would need Vercel or edge config to enforce

- **Recommended policy: nothing.** It is the live status quo;
  enforcement is app-layer tests + the ADR. Explicitly: `vercel.json`
  must KEEP `trailingSlash` unset (worth a comment or a config test).
- If the ADR instead chose redirect-normalization: app-level middleware
  only (Vercel `trailingSlash` cannot scope by method and would hit
  POST).
- If slash variants of the well-knowns were to become first-class on
  the canonical host: an `oaknational/Cloud-Config` change — cross-repo
  PR, outside this repo's control.

## Test coverage

No test pins any trailing-slash variant; zero redirect-class assertions
exist in any test file. Indirect coverage only:
`mcp-html-negotiation.integration.test.ts` (bare `/mcp` status pins)
and `oak-ds-static.integration.test.ts` (asset 200s, gate ordering,
subresource-prefix invariant). The `redirect:false`/`index:false`
options themselves are untested.

## Known unknowns

Exact Cloudflare rule expression and wildcard semantics (Cloud-Config);
Vercel dashboard-level redirect settings (observed absent, not read);
`/oauth/*` slash variants on www (unprobed — two of three are POST);
DELETE-`/mcp` live behavior (inferred 404 from code, unprobed as
write-shaped).
