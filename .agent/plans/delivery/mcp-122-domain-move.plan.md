---
id: mcp-122-domain-move
node_type: delivery
name: "Domain move: the release serves at mcp.thenational.academy/mcp"
overview: "One canonical address on a dedicated Oak subdomain serves MCP clients, SSE streams, and human visitors by content negotiation, fronted by the Cloudflare edge over the app's existing origin — final before the store listing submits."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - packaging-and-distribution
  - auth-and-access
  - served-surface
tickets:
  - MCP-122
depends_on: []
owner_gates: []
last_updated: 2026-09-01
---

# Domain move: `mcp.thenational.academy/mcp`

## Goal

The app is reached at `https://mcp.thenational.academy/mcp` — the same
URL serving MCP protocol traffic, SSE streams, and a human-readable
page by content negotiation — with the app's own origin untouched
behind the edge, the earlier alpha endpoint alive through a deprecation
window, and the domain final **before** the store listing submits
(MCP-122 blocks MCP-106). Probed facts grounding this plan are recorded
on the ticket; the load-bearing ones are in §Mechanism.

## Mechanism

**One path, three behaviours** (owner-set, do-not-re-decide): requests
are told apart by method + Content-Type + Accept together — POST with a
JSON body is MCP; GET accepting `text/event-stream` is the SSE leg; GET
accepting `text/html` is a person and receives the human page. The
triple is app code, not edge routing — live in production since
v1.82.0 and domain-agnostic.

**Edge**: a dedicated subdomain, `mcp.thenational.academy`, fronts the
app through the Cloudflare edge (MCP-172), which presents the app's own
Vercel hostname as the Host so Vercel selects the serving project. The
whole app is served at that host — the root and `/mcp*`, both RFC 9728
metadata forms, and the OAuth authorization-server metadata (verified
live 2026-09-01). The main website's namespace and application code
are untouched.

**Self-description**: the app derives its resource and metadata URLs
from the request Host; behind the edge the origin's own hostname
arrives instead. The app therefore carries a canonical-public-origin
configuration (`CANONICAL_HOST`, a bare hostname validated at startup;
never a request header), so PRM documents, resource URLs, OAuth
resource indicators, and the `WWW-Authenticate` challenge state the
canonical origin wherever the app is fronted.

**Assets stay home**: signed asset-download URLs (5-minute TTL, never
bookmarked) remain on the app's own origin — the smallest correct
shape; nothing under the main website's namespace is claimed.

**Transition**: the earlier alpha endpoint remains live through a
deprecation window serving its existing traffic and self-describing the
canonical resource; existing connectors continue to work and re-point
on their own clock. MCP clients follow redirects unevenly, so the old
endpoint serves rather than bounces.

## Acceptance (falsifiable)

1. **Canonical self-description behind a proxy** — `repo-safe`: tests
   prove PRM, resource URL, and OAuth resource indicators state the
   canonical origin when fronted (forwarded-host on, off, and absent).
2. **The negotiation triple on one path** — `repo-safe`: a three-way
   test proves POST json → MCP, GET event-stream → SSE, GET html →
   human page, and non-matching requests still refuse with 406.
3. **Live on the canonical domain** — `owner-held`: the owner (or a
   named verifier) walks MCP connect, OAuth sign-in, and a browser visit
   at `mcp.thenational.academy/mcp`; the walk is recorded on MCP-122.
4. **Old endpoint unbroken** — `owner-held`: an existing alpha
   connector completes a session during the deprecation window;
   recorded on MCP-122.
5. **Conformance against the new origin** — `repo-safe`: the MCPJam
   suites run green in CI against the canonical origin (M5's
   instrument, re-pointed).

## Slices

Each a single-story PR, default round budget:

1. `canonical-origin` — the origin pin + gated forwarded-host trust,
   red-first (AC1).
2. `negotiation-triple` — the html leg on `/mcp`, preserving the MCP
   and SSE contracts, red-first (AC2).
3. `edge-change` — the Cloudflare edge fronting `mcp.thenational.academy`
   over the app's origin (MCP-172), live (AC3).
4. `transition-and-conformance` — deprecation-window posture, connector
   verification, conformance re-point (AC4, AC5).

## Decision gates (dated)

- **Edge mechanism** — asked 2026-07-23 with two main-domain candidates
  and a named dedicated-subdomain fallback; resolved at owner word
  2026-09-01: the dedicated subdomain `mcp.thenational.academy`, fronted
  by the Cloudflare edge. The authoritative record is the MCP-122
  ticket comment (2026-09-01).

## Dated notes

- **2026-08-02** — Landed into the corpus from the orphaned branch
  `jimcresswell/mcp-122-domain-move-…` (found holding the only copy
  during the owner-directed branch-estate review; authored 2026-07-23,
  born-sketch). The original edge-mechanism gate deadline (2026-07-26,
  the release-node P3D tempo) lapsed unanswered during the
  submission-conn handover; the gate's expiry is renewed and the
  decision re-prices from current facts when the domain-move lane
  opens. All probed facts and dates in this plan are as of 2026-07-23.
- **2026-09-01** — Re-trued to the delivered design at owner word: the
  plan's 2026-07-23 goal named the main domain
  (`www.thenational.academy/mcp`) with the dedicated subdomain as the
  in-plan fallback; the fallback is what shipped. The canonical address
  is `mcp.thenational.academy/mcp`, served behind the Cloudflare edge
  (MCP-172) with `CANONICAL_HOST` naming it. Probed 2026-09-01: the
  canonical host serves MCP, the browser page, and both PRM forms at
  root and `/mcp*`; `www.thenational.academy/mcp` returns 404; the
  earlier alpha endpoint still serves and self-describes the canonical
  origin. The edge-mechanism gate is discharged by the live edge and
  its row removed. The estate-wide reference sweep (PR #944) re-points
  MCP server references to the canonical address and retires
  `oaknational.dev` mentions from live surfaces. Slices 1–3 are landed;
  slice 4's conformance re-point rides PR #944 and its owner-held walks
  (AC3, AC4) are recorded on the ticket when done. The authoritative
  record is the MCP-122 ticket comment (2026-09-01).

## Out of scope

- Moving the app's hosting: the origin stays where it is; only the
  public address moves — smallest change that makes the address final.
- The main site's application: both mechanisms are configuration in
  front of it; no main-site code changes ride this lane.
- Store-listing content updates: MCP-106 carries the listing; this lane
  only makes the endpoint it states final.
- Clerk configuration execution: the change list (resource indicators,
  allowed origins, redirect URLs) is enumerated here but executes with
  the MCP-67 production-promotion lane (Clerk writes are owner-gated;
  coordination noted on both tickets).
