---
title: Native MCP SDK auth vs bespoke — build-vs-buy spike
collection: security-and-privacy
lane: future
type: strategic-spike
status: strategic-brief
created: 2026-06-16
thread: observability-sentry-otel
decision_named: >-
  Should the oak-curriculum-mcp-streamable-http app replace its bespoke MCP
  auth subsystem (mcpAuth + handleAuthError + createMcpAuthClerk + OAuth
  metadata/PRM wiring) with native auth from @modelcontextprotocol/sdk
  (requireBearerAuth + mcpAuthRouter) and/or @clerk/mcp-tools' express
  integration? This brief gathers the evidence; it does not decide.
---

# Native MCP SDK auth vs bespoke — build-vs-buy spike

> **This is a decision-naming brief, not a migration plan.** Its output is a
> grounded go / no-go / partial recommendation with a capability-vs-gap
> matrix. No production auth code is changed under this brief. Execution (if
> any) is authored only on promotion to `current/`.

## 1. Problem and intent

`apps/oak-curriculum-mcp-streamable-http` hand-rolls its MCP OAuth
resource-server auth: `src/auth/mcp-auth/mcp-auth.ts` (`mcpAuth`,
`handleAuthError`), `src/auth/mcp-auth/mcp-auth-clerk.ts`
(`createMcpAuthClerk`), the OAuth-metadata / PRM endpoint wiring in
`src/auth-routes.ts`, `src/global-auth-context.ts`, the OAuth proxy in
`src/oauth-proxy/`, and `src/conditional-clerk-middleware.ts`.

This subsystem was built when the MCP authorization spec and SDK auth
support were immature. The recent Clerk `@clerk/express` 2.1.25 episode
(see grounding below) surfaced that the bespoke layer carries real,
recurring maintenance coupling and at least one latent design risk
(vendor throws routed to HTTP 500 instead of a spec-compliant 401/5xx
classification). The intent is to determine, with first-hand evidence,
whether the bespoke subsystem can now be **replaced or substantially
reduced** by native, first-party building blocks that did not exist (or
were not viable) a year ago.

**Grounding (first-hand, this thread, 2026-06-16):**

- `@modelcontextprotocol/sdk@1.29.0` ships a complete `server/auth/`
  surface: `middleware/bearerAuth` (`requireBearerAuth`),
  `middleware/allowedMethods`, `middleware/clientAuth`, `router`
  (`mcpAuthRouter`), `handlers/metadata` (PRM / AS metadata),
  `provider`, and `providers/`.
- `@clerk/mcp-tools@0.5.0` ships an `express/` integration surface plus
  OAuth client `stores/` (redis, fs, sqlite, postgres) — beyond the
  `verifyClerkToken` primitive we already consume.
- The Clerk 2.1.25 security-fix episode is recorded in the auth chain
  review (the `handleAuthError` catch-all → 500 brittleness, the
  ADR-193 membrane considerations, and the verified fact that the
  invalid-token path returns 401 in production).

## 2. End goal, mechanism, and means

- **End goal** — a maintainable, spec-compliant MCP auth surface for the
  Curriculum MCP server that minimises bespoke code we must keep aligned
  with the evolving MCP authorization spec and the Clerk SDK, without
  losing any guarantee the bespoke layer currently provides.
- **Mechanism** — first-party libraries (the MCP SDK auth surface and
  Clerk's MCP tools) now encode the spec's required behaviours
  (401 + `WWW-Authenticate`, PRM/AS metadata per RFC 9728, bearer-token
  verification, RFC 8707 resource binding). If they cover our cases,
  adopting them deletes bespoke code and shifts spec-conformance
  maintenance to the vendors. Build-vs-buy: evaluate the first-party
  integration before keeping bespoke (see user-memory
  `feedback_build_vs_buy_first`).
- **Means** — a bounded investigation producing a capability-vs-gap
  matrix and a recommendation. Work items in §"Investigation work items".

## 3. Domain boundaries and non-goals

**In scope (evaluate for replacement):**

- HTTP-level bearer auth enforcement (`mcpAuth` → `requireBearerAuth`?).
- Vendor-error → HTTP-status classification (`handleAuthError` 401/5xx).
- OAuth Protected Resource Metadata + AS metadata endpoints
  (`auth-routes.ts` → `mcpAuthRouter` / `handlers/metadata`?).
- The Clerk token-verification adapter (`createMcpAuthClerk` →
  `@clerk/mcp-tools/express`?).
- The OAuth proxy (`src/oauth-proxy/`) and conditional Clerk middleware.

**Non-goals:**

- This brief does **not** migrate any code. No production behaviour change.
- Does **not** revisit Clerk as the identity provider (ADR-053) — Clerk
  remains the IdP regardless of which auth plumbing wins.
- Does **not** touch upstream-API auth / tool-level auth interception
  (ADR-054) — that is a different trust boundary.
- Does **not** re-open the ADR-160 redaction barrier as a behaviour; if
  native auth cannot carry the redaction/fingerprint hooks, that is a
  recorded gap, not a licence to drop redaction.

## 4. Dependencies and sequencing

| Prerequisite | Class | Note / minimum shape without it |
|---|---|---|
| Clerk 2.1.25 stabilisation (branded-getAuth fix; `getAuth`-seam DI) | `beneficial` | Done 2026-06-16. Gives a clean, green baseline to diff a migration against. Without it the spike can still run, but the baseline would be red and comparisons noisier. |
| Current MCP authorization spec pinned (the version the SDK 1.29.0 targets) | `blocking` | The capability matrix must be evaluated against one named spec revision; without a pinned spec the gap analysis is not falsifiable. |
| First-hand read of installed SDK 1.29.0 + `@clerk/mcp-tools` 0.5.0 source/docs | `blocking` | The whole brief is evidence-driven; vendor capability claims must be verified first-hand (not from memory or changelogs alone). |

## 5. Investigation work items (the spike)

These are research deliverables, each producing recorded evidence. They
are **not** TDD execution cycles; no product code lands here.

1. **Capability map** — for each in-scope bespoke behaviour, identify the
   native equivalent in SDK 1.29.0 / `@clerk/mcp-tools` 0.5.0 and verify
   it first-hand. Behaviours to cover: 401 + `WWW-Authenticate` on
   missing/invalid token; PRM at both the unqualified and path-qualified
   `/.well-known/oauth-protected-resource[/mcp]` (RFC 9728 §3.1); AS
   metadata; RFC 8707 resource/audience binding; deny-by-default trace
   propagation; the 401-vs-5xx classification under infra/wiring faults.
2. **Gap analysis** — enumerate bespoke behaviours with **no** native
   equivalent and record each as a gap with severity: e.g. the ADR-160
   non-bypassable redaction barrier + fingerprint ordering
   (`runtime-redaction*`, `createSentryHooks`), conditional Clerk
   middleware for public paths, rate-limiter ordering on `/mcp`,
   host-validation 403 path, Result-typed flush/close. A gap that native
   auth cannot carry is a reason to keep (or wrap) that slice.
3. **Clerk express-integration evaluation** — determine whether
   `@clerk/mcp-tools/express` provides a resource-server handler and/or
   OAuth-proxy that subsumes `createMcpAuthClerk` and `src/oauth-proxy/`,
   and how its error model maps to 401 vs 5xx (the exact question the
   Clerk 2.1.25 review left open).
4. **Migration blast-radius + test-transfer estimate** — which files are
   deleted/replaced, which of the 142 e2e + relevant integration tests
   transfer unchanged, which must be rewritten, and the rough effort.
5. **Decision artifact** — a build-vs-buy recommendation (adopt / adopt-
   partial / keep-bespoke) with the capability-vs-gap matrix as evidence,
   authored as an ADR (or ADR-superseding note) under
   `docs/architecture/architectural-decisions/`.

## 6. Strategic acceptance criteria and success signals

- **Acceptance** — a single decision artifact exists that: (a) names the
  decision; (b) carries a complete capability-vs-gap matrix grounded
  first-hand in SDK 1.29.0, `@clerk/mcp-tools` 0.5.0, and one pinned MCP
  spec revision; (c) gives an explicit adopt / adopt-partial /
  keep-bespoke recommendation with reasons; (d) for "keep-bespoke",
  records the specific native gaps that justify it so the decision is
  re-checkable when the SDK next ships.
- **Success signal** — the owner can make a confident build-vs-buy call
  from the artifact without re-doing the research, and a future agent can
  re-evaluate by re-running the matrix against a newer SDK.
- **Anti-signal (reject)** — a recommendation that rests on "the existing
  code works" rather than on a capability/gap comparison. Existence is
  not correctness (this brief exists because the bespoke layer's
  existence is not evidence it is the best option).

## 7. Risks and unknowns

| Risk / unknown | Mitigation |
|---|---|
| Native auth may not carry the ADR-160 redaction barrier / fingerprint ordering | Treat as a first-class gap; "adopt-partial" (native enforcement + bespoke redaction hooks) is a valid outcome. |
| The MCP auth spec is still evolving; adopting native locks us to the SDK's spec cadence | Record the spec revision evaluated; the decision artifact must state the re-evaluation trigger (SDK minor that changes the auth surface). |
| `@clerk/mcp-tools` is early (0.5.0) and may itself change error/throw behaviour | This is the same class of coupling the 2.1.25 episode exposed; the matrix must include the vendor's error→status model explicitly. |
| Sunk-cost bias toward the bespoke layer | The decision artifact is reviewed by `architecture-expert` + `security-expert` against the matrix, not against the current code's familiarity. |
| Migration effort underestimated | Work item 4 produces the blast-radius estimate before any promotion. |

## 8. Promotion trigger into `current/`

Promote to `current/` as a migration plan **only if** the decision
artifact's recommendation is "adopt" or "adopt-partial" **and** the owner
approves it. On promotion, author executable TDD-cycle workstreams that
replace bespoke surfaces one trust-boundary at a time, with the existing
e2e suite as the behaviour-preservation safety net. If the recommendation
is "keep-bespoke", this brief is archived with the decision artifact as
its outcome — no migration plan is created.

> **Execution decisions are finalised only at promotion.** Any
> implementation detail above is reference context for the investigation,
> not a committed execution path.

## Reviewers to invoke during the spike

`mcp-expert` (spec-conformance of the native surface), `clerk-expert`
(the `@clerk/mcp-tools` express integration + error model), and, for the
decision artifact, `security-expert` (no auth guarantee is lost) and
`architecture-expert` (boundary placement; ADR-193 membrane). Per the
plan skill, `assumptions-expert` reviews the decision artifact for
proportionality before any promotion.

## Foundation alignment

- `.agent/directives/principles.md` — build-vs-buy, simplicity without
  quality compromise.
- `.agent/directives/testing-strategy.md` — on promotion, the e2e suite
  is the behaviour-preservation net; this brief lands no tests.
- Related: ADR-053 (Clerk as IdP), ADR-054 (tool-level auth
  interception), ADR-160 (non-bypassable redaction barrier), ADR-193
  (system/vendor type boundary membrane),
  `security-and-privacy/developing-secure-mcp-servers.research.md`.
