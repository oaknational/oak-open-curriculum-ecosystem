---
id: mcp-67-clerk-production-promotion
node_type: delivery
name: "Clerk production promotion: the app runs on production sign-in"
overview: "Create and validate the dedicated production Clerk instance behind the existing proxy boundary — guards first, owner ceremony second, paired live validation third — with the canonical origin held as a named joint with the domain-mint lane."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Owner zero-open-PRs disposition card (chat, Bonfire seat), 2026-07-23 — ratify-now answer; the plan's two internal owner gates keep their own 2026-07-26 expiries"
serves: first-major-release
impact_areas:
  - auth-and-access
tickets:
  - MCP-67
depends_on: []
owner_gates:
  - awaiting: owner-decision
    clears_when: "Card 1 ledger confirm: the archived decision ledger (D0-D10) re-presented one line each with what changed since 2026-07-21 — D0 now register-backed (D18), D1 superseded by the domain joint below, D2/D8/D10 risk acceptances shown for explicit acceptance"
    expires: 2026-07-30
  - awaiting: external-input
    clears_when: "The canonical production origin is decided: the MCP-122 domain mint (www.thenational.academy/mcp) confirms and supplies the origin, or the D18 current-URL position stands for V1 — either answer unblocks Cards 2-3; guard cycles never wait on it"
    expires: 2026-07-30
last_updated: 2026-07-24
---

# Clerk production promotion

## Dated notes

- 2026-07-24 — Gates re-dated (MCP-141 scan truing, Director-ruled): no
  live seat existed at the authoring expiry, so both cards re-date to
  lane pickup rather than carding the owner cold on Clerk decisions with
  no executor lane. The gate expiries are the outer bound by which both
  must resolve; milestone timing lives in Linear, not here. The M4
  execution ticket minted at the same scan carries the pickup; the
  pointer ticket MCP-67 (Done at its authoring scope) is no longer this
  plan's execution anchor.

## Goal

Teachers sign in to the app through a dedicated production Clerk
instance: an unauthenticated request to the production `/mcp` receives
a standards-compliant challenge, a real assistant completes the full
OAuth flow against the production realm, and a reviewer can walk the
whole journey — this is milestone M4 (production sign-in live), and
M5's unattended conformance runs and M8 both stand on it. Milestone
dates and their sequencing live in Linear.

## Evidence base (probed first-hand, 2026-07-23)

The archived decision ledger
(`.agent/plans-v0-sketch-2026-07-21/delivery/clerk-production-promotion.plan.md`,
disposition: superseded at pickup, evidence base for this pour)
carries the full D0-D10 decisions, three-card ceremony detail, and
report citations. This plan does not restate it. What the live probes
added or changed:

- **The gap is confirmed live**: `/oauth/authorize` on the alpha 307s
  to `native-hippo-15.clerk.accounts.dev` — the Development-realm
  domain shape. The dedicated Clerk application ("Oak Open Curriculum
  MCP") exists and carries **exactly one instance: development**; the
  production instance does not exist yet (Clerk CLI read, 2026-07-23).
- **The proxy boundary is healthy**: both PRM scopes, self-origin AS
  metadata (authorize/token/register, S256), and the 401
  `WWW-Authenticate` challenge with path-scoped `resource_metadata`
  all verified live — the promotion re-points this boundary at
  production credentials with no shape change.
- **One discrepancy to true**: live `scopes_supported` is `["email"]`;
  the archived ledger's D4 says `profile` + `email`. Cycle 1 includes
  reconciling the advertised and requested scope sets (decide at
  Card 1 which is right; the code follows the card).
- **Register movement since the ledger**: D18 ratifies the dedicated
  production instance (the V0's D0 recommendation is now doctrine) and
  holds V1 on the current URL; MCP-122 (in flight) may mint
  `www.thenational.academy/mcp` as the canonical address — hence the
  named domain gate above. This plan never re-decides the origin.

## Mechanism

Three stages, strictly ordered so nothing owner-held blocks anything
agent-buildable:

1. **Guard cycles (agent, now; gate-independent)**: fail-fast
   production guards (reject test keys in production; auth-disable
   valve development-only; authorized-parties in the validated
   boundary); the negative-token conformance suite on the opaque path
   (wrong issuer, wrong resource, expired, session-token, query-param);
   canonical-origin discipline (deployment aliases cannot mint a
   second OAuth resource identifier); the scope-set reconciliation.
   Landing the guards makes dev-keys-on-production a deliberate
   startup failure — a named fail-fast window, acceptable while
   nothing consumes the production endpoint, shown at Card 1.
2. **Create ceremony (owner, after Card 1 + the domain gate)**: the
   production instance act, DNS/certificates for the decided origin,
   production Google credentials (publishing status In production —
   the queue is the long pole, so this fires early in the sitting),
   DCR enabled with consent enforced, token format explicitly pinned
   opaque, Vercel env scoping with live keys in Production only.
3. **Paired live validation (owner + agent)**: owner runs the browser
   ceremonies (real Google account, host-side connect per supported
   host); agent runs every non-interactive check (metadata curls,
   negative-path curls, env-scoping review) and records evidence on
   MCP-67; rollback rehearsed (code-revert keeping the realm).

## Acceptance criteria (each with a proof)

1. **Production guards fail fast.** Proof (`repo-safe`): unit suites —
   test keys rejected in production, auth-disable valve rejected
   outside development, authorized-parties validated at the boundary.
2. **The negative-token suite passes on the opaque path.** Proof
   (`repo-safe`): e2e — the five rejection classes above, against
   opaque-format tokens matching production.
3. **Aliases cannot mint a second resource identifier; metadata holds
   the proxy shape at the canonical origin.** Proof (`repo-safe`):
   e2e suite; (`owner-held`): live curls recorded on MCP-67 at
   validation.
4. **A real assistant completes the full production OAuth flow,
   including denial, revocation, and reconnect.** Proof
   (`owner-held`): the paired validation evidence on MCP-67.
5. **Rollback rehearsed.** Proof (`owner-held`): one reverted
   deployment against the stable origin, evidenced on MCP-67.

## Todos

- Sliced at pickup by the implementer, each slice a single-story PR
  within its round budget (PDR-132). Guard cycles are the first
  slices and precede both gates.

## Out of scope

- The canonical origin decision: MCP-122's mint (or D18's current-URL
  answer) — the named gate above; this plan consumes the answer.
- Machine/unattended-agent authentication (no client-credentials
  grant); Clerk Organizations; custom consent pages or scopes; Google
  API data access — all per the archived ledger's non-goals,
  unchanged.
- The MCPJam conformance suites themselves (M5's lane) — this plan
  supplies the unattended sign-in path they need, not the suites.
