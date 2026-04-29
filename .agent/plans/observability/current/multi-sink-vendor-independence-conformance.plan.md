---
name: "Multi-Sink Vendor-Independence Conformance"
overview: >
  Programmatically prove ADR-162's vendor-independence clause. Two conformance
  tests: (1) emission persistence test — runs MCP server + widget + Search CLI
  in SENTRY_MODE=off and asserts structural event information persists via
  stdout/err with no loss beyond the network hop; (2) structural import lint
  (no-vendor-observability-import) — ESLint rule forbids @sentry/* and future
  telemetry-vendor imports outside the allowlisted adapter + composition-root
  paths. Together these operationalise ADR-162 Mechanisms #4 + #5.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
strategic_parent: "observability/future/sentry-observability-maximisation.plan.md"
blocked_on:
  - "docs/explorations/2026-04-18-vendor-independence-conformance-test-shape.md (exploration 8; informs test-shape choices)"
  - "observability-events-workspace.plan.md (emissions need schemas before persistence can be asserted — 2026-04-20: events-workspace is beta-gate, which makes WS2+ (emission-persistence test) beta-gate too; WS1 carve-out (no-vendor-observability-import ESLint rule) lands in alpha scope per the maximisation plan's restructure Phase 5 carve-out)"
release_gate: "WS1 carve-out alpha; WS2+ emission-persistence beta"
todos:
  - id: ws1-red
    content: "WS1 (RED): emission-persistence integration test + no-vendor-observability-import RuleTester cases. Both fail initially."
    status: pending
    priority: next
  - id: ws2-green
    content: "WS2 (GREEN): emission-persistence harness + ESLint rule implementation; both test surfaces pass."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): document both tests in ADR-162 Enforcement section; runbook for on-failure triage."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: pnpm check exit 0; ESLint rule runs in CI at warn; emission-persistence test runs in deploy pipeline (not PR check per ADR-161 unless network-free)."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: architecture-reviewer-wilma (adversarial: what failure modes bypass the conformance test) + architecture-reviewer-fred (boundary correctness) + type-reviewer (ESLint rule shape)."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: ADR-162 Enforcement Open Question closure; rule documentation in eslint-plugin-standards README; runbook."
    status: pending
isProject: false
---

# Multi-Sink Vendor-Independence Conformance

**Last Updated**: 2026-04-18
**Status**: 🟡 PLANNING — blocks on exploration 8 + events workspace
**Scope**: Two conformance tests — emission persistence under `SENTRY_MODE=off`, plus structural import lint. Together they operationalise ADR-162 Mechanisms #4 + #5.

---

## Context

[ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
§Enforcement Mechanism #4 (emission persistence) and Mechanism #5
(structural import lint) together prove the vendor-independence clause.
Mechanism #4 alone is insufficient — it can miss a consumer that
imports a vendor SDK directly but still emits to stdout (finding
P2-1 from architecture-reviewer-fred's Phase 1 review). Mechanism #5
closes that gap structurally.

### Problem Statement

The vendor-independence clause is stated in ADR-162 but has no
programmatic proof today. Without a test, the clause is aspirational;
a contributor can break vendor-independence without anything flagging
the regression.

### Existing Capabilities

- `SENTRY_MODE=off` already supported in the foundation; MCP server
  and Search CLI both degrade to stdout-only under it.
- `@oaknational/eslint-plugin-standards` exists and hosts other
  repo-specific rules; a new rule is additive.
- `@oaknational/logger` fan-out model (ADR-143) already emits to
  stdout as the baseline sink.

---

## Design Principles

This plan operationalises two enforcement doctrines that now live in
[ADR-162 § Enforcement Principles](../../../../docs/architecture/architectural-decisions/162-observability-first.md#enforcement-principles)
(graduated 2026-04-29): **prove, don't assert** (paired emission +
structural tests) and **allowlist, not blocklist** (explicit
permitted-location listing, composition-root carve-out encoded
file-by-file).

Plan-scoped tradeoffs (not doctrine):

- **Structural over behavioural where possible** — the ESLint rule
  runs at every commit; the emission test runs per release. Catching
  a regression at commit-time is cheaper. This is sequencing, not
  doctrine.
- **Composition-root carve-out is explicit** — per ADR-162's
  §Vendor-Independence clause, composition roots MAY import vendor
  SDKs as DI wiring. The allowlist encodes this carve-out file-by-
  file, not via pattern. (This is now part of the ADR's allowlist
  doctrine; cited here for plan-body clarity.)

**Non-Goals** (YAGNI):

- Runtime vendor-swap benchmarking — out of scope; the test proves
  the property holds, not that swaps are fast.
- Multi-vendor simultaneous emission (dual-export) — owned by
  `observability/future/second-backend-evaluation.plan.md`.
- Widget-side structural import lint — widget bundle is a distinct
  context; initial rule scope is apps/ + packages/sdks/ only.
  Widget-path lint added once `@sentry/browser` L-12 wiring stabilises.

### Conformance Scope Expansion (recorded 2026-04-19)

The initial conformance scope (above) covers **two sinks**: stdout
(baseline) and Sentry (today). Per the three-sink architecture
confirmed at
[ADR-162 § History 2026-04-19](../../../../docs/architecture/architectural-decisions/162-observability-first.md#history)
and owned by
[`future/second-backend-evaluation.plan.md`](../future/second-backend-evaluation.plan.md),
the conformance scope **expands per sink** as each adapter lands:

- **Sink 2 (warehouse adapter)**: PR introducing the warehouse
  adapter must extend the emission-persistence test to assert
  schema-conformant payloads reach the warehouse sink (or the
  warehouse-side capture harness in CI), and must extend the
  `no-vendor-observability-import` allowlist to permit the
  warehouse SDK only inside `packages/libs/<warehouse>-exporter/`
  and the composition root.
- **Sink 3 (PostHog adapter)**: same shape — PR extends both
  conformance surfaces. PostHog SDK allowlisted only inside
  `packages/libs/posthog-exporter/` and composition root.

**Allowlist mechanism is the right shape**: `vendorPatterns` and
`allowedPaths` already accept new entries; no rule-author work
needed per sink, only configuration. RuleTester cases for each new
vendor pattern land with that vendor's adapter PR. The
emission-persistence harness is reusable across sinks because it
asserts on captured payload shape, not on the sink mechanism.

---

## Dependencies

**Blocking**:

- Exploration 8 — `docs/explorations/2026-04-18-vendor-independence-conformance-test-shape.md`.
  Decides exact emission-persistence assertion shape (structural
  subset match, OTel field preservation, attribute round-trip).
- `observability-events-workspace.plan.md` — emission-persistence
  test composes events workspace schemas.

**Related**:

- ADR-162 §Enforcement Mechanisms #4 + #5.
- `sentry-observability-maximisation-mcp.plan.md` — consuming workspace;
  post-Phase-5 will pass this conformance.
- `observability/future/second-backend-evaluation.plan.md` — consumer
  of the vendor-independence property.

---

## WS1 — Conformance Tests (RED)

### 1.1: Emission-persistence test

**Test**: `vendor-independence-emission-persistence.e2e.test.ts` —
spins up the MCP server with `SENTRY_MODE=off`; exercises a tool call;
captures stdout; asserts the captured log lines contain the expected
`tool_invoked` event fields (categorical context, correlation keys,
release) with structural shape matching the events-workspace schema.
Repeat for each emitting workspace (MCP server, Search CLI). Widget
deferred until L-12 stabilises.

**Pipeline note**: runs in the deploy pipeline + smoke lane per
ADR-161. Can it run PR-check? Yes if fully in-process — emission-capture
is stdout inspection, no network. Confirmed via exploration 8.

### 1.2: Structural-import ESLint rule

**Test**: `no-vendor-observability-import.unit.test.ts` — RuleTester
cases:

- Import of `@sentry/node` inside `apps/**/src/handlers/` → flagged.
- Import of `@sentry/node` inside `apps/**/src/index.ts` → allowed (composition-root carve-out).
- Import of `@sentry/node` inside `apps/**/src/app/*.ts` → allowed (composition-root carve-out).
- Import of `@sentry/node` inside `packages/libs/sentry-node/src/` → allowed (adapter library).
- Import of `@oaknational/observability-events` in any path → allowed.
- Import of a future vendor (`@some-telemetry-vendor/*`) from
  non-allowlisted path → flagged.
- Import inside a `*.unit.test.ts` file → allowed (test fixtures).

**Acceptance**: both test surfaces compile and fail for expected
reasons.

---

## WS2 — Conformance Test Implementation (GREEN)

### 2.1: Emission-persistence harness

**File**: `packages/core/observability-events/src/test-harness/emission-persistence.ts`
— reusable harness: `captureStdoutDuring(fn)` + `assertEventEmitted(schema, capture)`.

**Consuming tests**: in each emitting workspace, compose the harness
plus the events-workspace `assertEventConformance` helper.

### 2.2: ESLint rule

**File**: `packages/core/oak-eslint/src/rules/no-vendor-observability-import.ts`.

Rule schema: `{ vendorPatterns: string[], allowedPaths: string[] }`.

Config (initial): `vendorPatterns: ['@sentry/*']`, `allowedPaths` is
a file-glob allowlist covering `packages/libs/sentry-*/**`,
`packages/core/observability*/**`, specific `apps/**/src/index.ts` +
`apps/**/src/app/*.ts` files.

Register at severity `warn` initially per
[`patterns/warning-severity-is-off-severity.md`](../../../memory/active/patterns/warning-severity-is-off-severity.md) — escalates to `error` once the
existing composition-root imports are allowlisted.

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: ADR-162 Enforcement closure

- Mechanism #4 Open Question (CI vs phase-close) closes based on
  exploration 8 → decided in this plan's WS1.
- Mechanism #5 landing documented with file path, severity, allowlist
  rationale.

### 3.2: eslint-plugin-standards README

`packages/core/oak-eslint/README.md` — entry for
`no-vendor-observability-import` with config example + the carve-out
rationale.

### 3.3: Runbook

`docs/operations/vendor-independence-runbook.md` (new) — on-failure
triage: what the test failure means, how to distinguish a real
regression from an intentional vendor-adoption change, how to update
the allowlist.

---

## WS4 — Quality Gates

```bash
pnpm check
```

Exit 0. Emission-persistence test may be gated by environment
(requires deployed MCP server instance or local stub).

---

## WS5 — Adversarial Review

- `architecture-reviewer-wilma` — pressure-test the conformance design:
  what failure modes bypass both tests? (Example: a consumer dynamically
  imports the vendor SDK via `await import(...)` — does the ESLint rule
  catch it? A consumer wraps vendor SDK in an internal package facade
  that re-exports — does anything catch the re-export path?)
- `architecture-reviewer-fred` — boundary correctness; allowlist
  discipline.
- `type-reviewer` — ESLint rule type shape; RuleTester case coverage.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Allowlist drift (new composition roots added without allowlist update) | Reviewer-matrix question ADR-162 Mechanism #2; `warn` severity at first catches without blocking; `error` after allowlist-review-discipline is documented. |
| Dynamic imports bypass the ESLint rule | Wilma pressure-test identifies; depcruise complement covers dynamic resolution if needed. |
| Emission-persistence test shape too loose → accepts impoverished events as conforming | Exploration 8 sets strict-subset assertion; conformance helper enforces full shape. |
| Test runs only in deploy pipeline; PR regressions catch only at merge | If exploration 8 confirms in-process feasibility, move to PR-check lane. |

---

## Foundation Alignment

- ADR-078 DI — composition-root carve-out is the DI seam.
- ADR-143 — fan-out sink model; stdout sink is the fallback.
- ADR-154 — framework/consumer separation; this plan enforces the
  separation.
- ADR-160 — redaction barrier applies upstream of emission persistence;
  the test must confirm redaction still holds under `SENTRY_MODE=off`.
- ADR-161 — determines whether the persistence test runs in PR check or
  deploy pipeline.
- ADR-162 — the ADR this plan operationalises.

---

## Documentation Propagation

- ADR-162 Enforcement Mechanisms #4 + #5 completion.
- eslint-plugin-standards README entry.
- Runbook for vendor-independence.
- High-level observability plan § Vendor-Independence Invariants.

---

## Consolidation

Run `/jc-consolidate-docs`. Candidate pattern: **allowlist-not-blocklist
as the structural default for vendor-boundary enforcement**.

---

## Acceptance Summary

1. Emission-persistence test runs in the chosen pipeline and passes
   against current branch.
2. `no-vendor-observability-import` rule landed at `warn`; zero
   in-tree violations outside the allowlist.
3. ADR-162 Mechanism #4 + #5 sections updated with concrete
   references.
4. Runbook exists.
5. `pnpm check` exit 0.
