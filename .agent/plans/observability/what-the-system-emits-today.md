---
title: "What the System Emits Today"
status: active
last_updated: 2026-04-19
purpose: >
  Forward-motion evidence artefact. One page showing what the running
  system actually emits, per axis and per runtime, at current HEAD.
  Updated at every lane close. Externally verifiable: any reader can
  run the system and check that the claimed emissions happen. The
  gap between this artefact and ADR-162's five-axis principle is the
  honest measure of observability progress.
update_protocol: >
  At every observability lane close, the implementer updates the
  relevant matrix cell(s) with: (a) the specific file:line where the
  emission lives; (b) the test id that asserts the emission happens;
  (c) the date of the lane close. Empty cells state the named
  future plan that will populate them.
---

# What the System Emits Today

**Governance**: Operationalises [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
by making the principle's five-axis claim externally verifiable. Names
the gap between claim and code as a first-class artefact.

**Why this exists**: plan documents describe what *will* emit. This
document describes what *does* emit. When the two diverge, the gap is
the honest measure of observability progress. An empty cell is
permitted; an empty cell with no named future home is a defect.

**How to read**:

- Each cell is either **populated** (`✓` + file:line + test id + date)
  or **empty** (`✗` + owning future plan path).
- A **stranger test** applies: a new engineer reading only this file
  should be able to tell in 30 seconds what the observability envelope
  actually is.
- This is NOT a plan; it is a snapshot. Plans live under `active/`,
  `current/`, and `future/`.

---

## Runtime Coverage Matrix

| Axis | MCP Server (`apps/oak-curriculum-mcp-streamable-http`) | MCP Widget (browser) | Search CLI (`apps/oak-search-cli`) |
|---|---|---|---|
| **Engineering** | **✓** Sentry error capture via `wrapMcpServerWithSentry` at `src/app/core-endpoints.ts:98`. Express error handler at `src/index.ts:40-41`. Redaction barrier enforced by `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts` (18 tests, ADR-160 closure). Source-map upload via `pnpm sourcemaps:upload`. `require-observability-emission` ESLint rule at `warn`; `preserve-caught-error` at `error` (2026-04-19). | **✗** not wired. Owning lane: [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) §L-12; prereq lane: §L-12-prereq (extract `packages/core/telemetry-redaction-core/`). | **✓** logger + Sentry wired for CLI observability (per `sentry-otel-integration.execution.plan.md` parent foundation closure 2026-04-17). `preserve-caught-error` at `error` (2026-04-19). Source-map upload scope TBD. |
| **Product** | **✗** no `tool_invoked` emission; no `search_query` structured event. Owning lanes: (schemas) [`current/observability-events-workspace.plan.md`](current/observability-events-workspace.plan.md) Wave 2; (emitter) [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) §L-3 / §L-9 Wave 3. | **✗** no widget-level product emission. Owning lane: §L-12 Wave 4. | **✗** no `search_query` structured event at CLI boundary. Owning lane: [`current/search-observability.plan.md`](current/search-observability.plan.md) (next-branch). |
| **Usability** | **✗** no `feedback_submitted` tool; no `widget_session_outcome` correlation. Owning lanes: §L-9 (feedback MCP tool, Wave 3); §L-12 (widget session outcome, Wave 4). | **✗** no session-outcome emission. Owning lane: §L-12 Wave 4 + [`current/accessibility-observability.plan.md`](current/accessibility-observability.plan.md) (cross-axis). | — not in scope (CLI has no interactive session surface). |
| **Accessibility** | — not applicable at the server runtime. | **✗** no `a11y_preference_tag` (reduced-motion, high-contrast, prefers-color-scheme); no frustration proxies; no keyboard-only-session tag. Owning lane: [`current/accessibility-observability.plan.md`](current/accessibility-observability.plan.md) Wave 4 (blocked on exploration 3 — already full in Phase 3). | — not in scope. |
| **Security** | **partial** — rate limiting lands app-layer per ADR-158; structured `auth_failure` + `rate_limit_triggered` emission not yet present. Owning lane: [`current/security-observability.plan.md`](current/security-observability.plan.md) Wave 4. | — not applicable (widget does not own trust-boundary decisions). | — not yet scoped. |

**Cell count**: 3 of 13 in-scope cells populated (23%). Each future
session that populates a cell narrows the gap; each that doesn't is
a signal worth naming.

---

## Sinks Today vs Planned

The current emission surface fans out to **two sinks**: stdout
(baseline, always-on) and Sentry (engineering observability). Per
the three-sink architecture confirmed at
[ADR-162 § History 2026-04-19](../../../docs/architecture/architectural-decisions/162-observability-first.md#history)
and owned by
[`future/second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md),
the planned post-MVP sink set is:

| Sink | Purpose | Status today | Owning plan / trigger |
|---|---|---|---|
| stdout (`@oaknational/logger`) | Vendor-independence baseline | **active** (per ADR-162) | n/a — always-on |
| Sentry | Engineering observability | **active** (`wrapMcpServerWithSentry` at `core-endpoints.ts:98`; `setUser({ id: userId })` per-request) | [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md) |
| Data warehouse (Sink 2) | Durable analytical SQL | **planned** (public-beta target; vendor open) | [`future/second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md) — vendor open per [Exploration 9](../../../docs/explorations/2026-04-19-data-warehouse-selection.md); promotion additionally gated on identity-policy ruling ([Exploration 10](../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md)) |
| PostHog (Sink 3) | Interactive product analytics | **planned** (vendor settled per owner ruling 2026-04-19; timing open, post-public-beta) | [`future/second-backend-evaluation.plan.md`](future/second-backend-evaluation.plan.md) — vendor decision settled on existing Oak-org usage; promotion (timing) gated on a named data-scientist or product-owner question + warehouse-adapter-shipped (owner-confirmed hard blocker) + identity-policy ruling |

**Identity envelope**: today, Sentry per-request scope receives the
opaque Clerk user ID via `observability.setUser({ id: userId })` in
`apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`. Whether
that identifier flows into Sinks 2 and 3 is a policy ruling
explicitly deferred to
[Exploration 10 (redaction policy — Clerk identity downstream)](../../../docs/explorations/2026-04-19-redaction-policy-clerk-identity-downstream.md);
the ADR-160 closure principle applies uniformly to whatever the
ruling permits.

---

## Vendor-Independence Status

ADR-162's vendor-independence clause states: "Minimum functionality
(structured stdout/err via `@oaknational/logger`) persists in the
absence of any third-party backend."

**Today**: this is a **structural claim**, not a tested invariant.
`wrapMcpServerWithSentry` at `core-endpoints.ts:98` is an unconditional
call into `@sentry/node`; inertness under `SENTRY_MODE=off` is a
vendor-SDK behaviour, not a structural property (see ADR-162 §Open
Questions).

**Tested invariant target**: [`current/multi-sink-vendor-independence-conformance.plan.md`](current/multi-sink-vendor-independence-conformance.plan.md)
Wave 5 — emission-persistence test runs MCP server + widget + Search
CLI in `SENTRY_MODE=off` and asserts structural event information
persists via stdout/err.

**Nearer-term evidence target**: a **minimum-viable conformance test**
at today's scope (MCP server only, engineering axis only, one tool
invocation, `SENTRY_MODE=off`, assert event information visible in
stdout). This is authorable against the existing logger + adapter
without the events workspace. Converts ADR-162's vendor-independence
claim from "architectural intent" to "tested invariant at current
scope" before Wave 2 opens. Widens as each axis' schemas land.

---

## Compile-Time Gates (active today)

| Gate | Severity | Scope | Purpose |
|---|---|---|---|
| `@oaknational/no-eslint-disable` | `error` | repo-wide via `recommended.ts` | Blocks unjustified rule suppression |
| `@oaknational/require-observability-emission` | `warn` | `src/**/*.ts` in 5 Wave-1 workspaces | Flags newly-exported async functions with no observability emission (96 coverage-gap warnings today = Wave 3+ emitter surfaces) |
| `preserve-caught-error` (ESLint core) | `error` | `src/**/*.ts` in 5 Wave-1 workspaces | Enforces `{ cause }` on `new Error` inside `catch` (ADR-088 + ADR-162 engineering axis; landed 2026-04-19) |
| ADR-160 barrier closure | blocking test | `packages/libs/sentry-node` | 18-test closure asserting non-bypassable redaction |

Planned (not yet landed):

| Gate | Severity (planned) | Owning lane |
|---|---|---|
| `require-observability-emission` (schema-usage detection path) | `warn` at add, `error` later | Wave 2 — unlocks when events workspace lands |
| `no-vendor-observability-import` | `warn` at add, `error` later | Wave 2 carve-out of vendor-independence plan |
| Emission-persistence test (full) | blocking test | Wave 5 vendor-independence conformance plan |
| MVP-scope emission-persistence test (partial) | blocking test | **proposal** — not yet lane-scoped |

---

## Update Log

- **2026-04-19** — Artefact created. Baseline state recorded: 3/13
  runtime cells populated, vendor-independence is structural claim
  not tested invariant, 3 compile-time gates active + 4 planned.
  Triggered by honest-evaluation discussion after L-EH initial close.
- **2026-04-19** — L-DOC initial landed. 0 matrix cells moved (docs
  lane is meta), but the reader-side discoverability defect named in
  the Phase 5 honest-evaluation pass is closed: the
  `wrapMcpServerWithSentry` wiring at `core-endpoints.ts:98`,
  redaction barrier, DI seam, per-request span, and scope enrichment
  are now discoverable by reading workspace docs without grepping
  source. New doc: `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
  as the authoritative app-level guide. Expanded:
  `packages/libs/sentry-node/README.md` from 4-line stub to package-
  level reference. Shrunk: app README Observability section to a
  summary + link. L-DOC initial §RED corrected during execution —
  content-presence test shape was authored and removed after
  testing-strategy.md review (tests must prove behaviour, not
  constrain implementation wording); acceptance moved to the
  reviewer matrix.
- **2026-04-19** — Sinks subsection added. 0 matrix cells moved (no
  new code emissions), but the architectural sink set is now
  recorded as a first-class artefact: stdout + Sentry (active);
  warehouse + PostHog (planned, gated on explorations 9 + 10 and
  named-question triggers). Identity-envelope policy explicitly
  named as deferred to exploration 10. Reflects the three-sink
  collapse owner-confirmed 2026-04-19 and recorded at ADR-162
  History.

Each future update appends here: date + lane + cells populated +
gates added.

---

## Related

- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
- [`high-level-observability-plan.md`](./high-level-observability-plan.md)
  — axes, launch criteria, plan map.
- [`active/sentry-observability-maximisation-mcp.plan.md`](active/sentry-observability-maximisation-mcp.plan.md)
  — lane execution authority.
- [`architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`](../architecture-and-infrastructure/current/observability-strategy-restructure.plan.md)
  — restructure phases 1–5.
