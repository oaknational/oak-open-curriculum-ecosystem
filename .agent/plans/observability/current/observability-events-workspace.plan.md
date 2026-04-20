---
name: "Observability Events Workspace"
overview: >
  Establish `packages/core/observability-events/` as the Zod-first, code-enforced
  event-schema contract between emitting workspaces and downstream analytics
  pipelines. Holds MVP schema set (tool_invoked, search_query, feedback_submitted,
  auth_failure, rate_limit_triggered, widget_session_outcome, a11y_preference_tag),
  correlation-keys contract, and a conformance helper every consuming workspace
  composes into its own tests. Converts "documented event schema" from Markdown
  to code-enforced.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
strategic_parent: "observability/future/sentry-observability-maximisation.plan.md"
blocked_on:
  - "docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md (exploration 4; blocks the MVP schema shape)"
todos:
  - id: ws1-red
    content: "WS1 (RED): author Zod schemas for seven MVP events + correlation-keys + conformance helper; contract tests fail because no implementations exist yet."
    status: pending
    priority: next
  - id: ws2-green
    content: "WS2 (GREEN): implement schemas + correlation-keys + conformance helper; all contract tests pass."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): TSDoc on every public symbol; event-catalog.md data-scientist-facing reference; workspace README; ADR-162 Mechanism #3 cross-references."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: pnpm check from repo root exit 0, no filtering."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: docs-adr-reviewer (schema/contract completeness); type-reviewer (Zod 4 usage; io='input' v 'output' semantics); sentry-reviewer (schema/emission fit)."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: update observability high-level plan, ADR-162 Open Questions closure for enforcement mechanism #3, and cross-references from every consuming workspace's README."
    status: pending
isProject: false
---

# Observability Events Workspace

**Last Updated**: 2026-04-20
**Status**: 🟡 PLANNING — queued; exploration 4 blocks MVP schema shape
**Scope**: New `packages/core/observability-events/` Zod-first workspace holding the MVP event-schema contract + conformance helper. Consumed by every schema-dependent emitting workspace.

**Release-gate posture** (2026-04-20): this workspace is **required
for public beta**, not for public alpha. Owner direction recorded in
`sentry-observability-maximisation-mcp.plan.md § Alpha vs public-beta
gates`: *"we absolutely must create the events workspace, but it does
not necessarily need to block public alpha, it absolutely does block
public beta."* Consequence for sequencing: alpha-gate emitter lanes
(maximisation plan L-1 free-signal and L-3 MCP request context) emit
Sentry-native or scope-context shapes and do NOT consume this
workspace; they can land before this workspace exists. Beta-gate
emitter lanes (maximisation plan L-4b metrics, plus the sibling
`security-observability` and `accessibility-observability` plans,
plus the now-deferred L-9 feedback and L-12 widget) ARE schema-
dependent and block on this workspace landing first.

---

## Context

[ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
states that every capability emits structured events in documented stable
schemas the downstream analytics pipelines depend on. The direction-setting
session (docs/explorations/2026-04-18-observability-strategy-and-restructure.md §3.8)
concluded the schema contract deserves a **new code workspace**, not a
Markdown artefact, matching the repo's schema-first pattern (ADR-029,
ADR-030, ADR-031).

### Problem Statement

Today event payloads are emitted as free-shape logger/Sentry calls. There
is no contract between emitting code and downstream consumers (analytics
pipelines, data scientists, PostHog bridge, future SLO work). A contributor
can add a new emission site with any shape and no tooling flags the drift.

### Existing Capabilities

- `@oaknational/logger` provides structured OTel-compliant emission.
- `packages/libs/sentry-node/` provides the redaction barrier (ADR-160).
- `@oaknational/result` provides the Result pattern for error flows.
- Zod 4 (via `z4mini`) is available for schema authoring; MCP SDK
  preserves `.meta({ examples })` via `toJSONSchema()` (see
  `.agent/memory/active/distilled.md` § Zod 4 `.meta({ examples })`).

This workspace composes those primitives; it does not re-implement them.

### Multi-Sink Consumer Posture (recorded 2026-04-19)

Per the three-sink architecture confirmed in
[ADR-162 § History 2026-04-19](../../../../docs/architecture/architectural-decisions/162-observability-first.md#history)
and owned by
[`future/second-backend-evaluation.plan.md`](../future/second-backend-evaluation.plan.md),
the schemas this workspace authors are the **single vendor-neutral
input** consumed by all three planned sinks: Sentry (today),
warehouse adapter (Sink 2; public-beta target), and PostHog adapter
(Sink 3; post-public-beta on a named question). The schema-shape
constraint is therefore **vendor-neutrality across all three sinks**,
not just Sentry-conformance. Vendor-specific projection (Sentry
`metrics.*` adapter shape, PostHog capture-payload mapping,
warehouse column projection) lives in each adapter package, not in
the schemas themselves. The schema-set scope here is unchanged —
seven MVP events — but its consumers expand sequentially as each
adapter lands.

---

## Design Principles

1. **Zod-first, not Markdown-first** — schemas are the source of truth;
   `event-catalog.md` is derived or referenced, not parallel.
2. **Zero runtime dependencies beyond Zod** — core workspace hygiene per
   ADR-154 framework/consumer separation.
3. **Provider-neutral shapes** — schemas carry OpenTelemetry-compatible
   attribute names where applicable; no vendor-specific fields leak in.
4. **Emission-site conformance proven by a test, not by review** —
   conformance helper validates an emitted event round-trips through its
   schema; consuming workspaces compose it into their test suite
   (parallel to ADR-160's redaction-barrier closure).
5. **Values redacted, categories preserved** — `tool_invoked` carries
   categorical filter context (subject, key-stage, keyword) without
   leaking values per ADR-160.

**Non-Goals** (YAGNI):

- Dashboards, derived views, or ingest pipelines — owned by downstream
  consumers.
- PostHog/Vercel/GCP-specific output formats — vendor adapters, not
  schemas.
- Runtime emission helpers — emission sites use `logger` + `Sentry` +
  `observability-events` schemas; this workspace does not ship an
  emission wrapper.

---

## Dependencies

**Blocking**:

- **Exploration 4** — `docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md`
  (Phase 3 of the restructure). Determines categorical axes for
  `tool_invoked.arguments_shape`, schema-vs-per-lifecycle-event
  vocabulary, session correlation shape. Without the exploration, the
  MVP schema set can be stubbed but not finalised.

**Related**:

- `sentry-observability-maximisation-mcp.plan.md` — L-0/L-1/L-3 use the
  event catalog; L-9 uses `feedback_submitted`.
- `search-observability.plan.md` — `search_query` emission site.
- `security-observability.plan.md` — `auth_failure`, `rate_limit_triggered`
  emission sites.
- `accessibility-observability.plan.md` — `a11y_preference_tag`,
  `widget_session_outcome` emission sites.
- `multi-sink-vendor-independence-conformance.plan.md` — compose events
  workspace emissions into the vendor-independence test.

---

## WS1 — Schema Contract Tests (RED)

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 1.1: MVP schema set contract tests

**Tests** (all in `packages/core/observability-events/src/**/*.unit.test.ts`):

- `tool-invoked.schema.unit.test.ts` — asserts schema accepts a valid
  payload (with categorical filter context), rejects an extra field,
  rejects missing required fields, and preserves `.meta({ examples })`
  through `toJSONSchema()`.
- `search-query.schema.unit.test.ts` — parallel shape.
- `feedback-submitted.schema.unit.test.ts` — closed-set `category` enum
  (per A.3 decision on L-9 privacy invariant).
- `auth-failure.schema.unit.test.ts` — trust-boundary fields only; no
  payload bodies.
- `rate-limit-triggered.schema.unit.test.ts`.
- `widget-session-outcome.schema.unit.test.ts` — stage vocabulary TBD
  via product-owner input (flagged in session report §9).
- `a11y-preference-tag.schema.unit.test.ts` — preference keys from
  exploration 3.

### 1.2: Correlation-keys contract tests

- `correlation-keys.unit.test.ts` — asserts every schema embeds
  `trace_id` / `session_id` / `release` per the correlation contract;
  asserts the correlation-keys parser rejects malformed shapes.

### 1.3: Conformance helper tests

- `conformance.unit.test.ts` — asserts `assertEventConformance(event,
  schema)` round-trips a valid event, throws with a specific error
  shape on invalid events, and preserves categorical-vs-value
  redaction boundaries from ADR-160.

**Acceptance Criteria**:

1. All new tests compile.
2. All new tests fail for the expected reason ("schema not yet exported").
3. No existing tests broken.

---

## WS2 — Workspace Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Workspace scaffolding

**File**: `packages/core/observability-events/package.json` + associated
tsconfig, tsup, vitest, eslint, knip config per monorepo conventions.

**Changes**:

- Workspace name: `@oaknational/observability-events`.
- Runtime dependencies: `zod` only.
- Dev dependencies: monorepo shared toolchain.
- Exports: `./schemas` + `./correlation-keys` + `./conformance`.

### 2.2: Schemas

**Files**: `src/schemas/*.ts` (one per MVP event type).

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/observability-events test
# Expected: all WS1 tests pass
```

### 2.3: Conformance helper

**File**: `src/conformance.ts`.

Exports `assertEventConformance<TSchema>(event, schema): asserts event is
z.infer<TSchema>` — throws with a structured error on mismatch.

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: TSDoc

Every exported symbol carries TSDoc with at least one `@example`. Public
schemas carry `.meta({ examples })` entries that survive
`toJSONSchema()`.

### 3.2: event-catalog.md

`packages/core/observability-events/docs/event-catalog.md` — data-scientist-
facing reference. For each event: purpose, when emitted, fields, categorical
axes, redaction applied, downstream consumers expected.

### 3.3: Workspace README

`packages/core/observability-events/README.md` — purpose, scope, compose-
into-your-tests guidance, link to ADR-162 and event catalog.

### 3.4: ADR-162 Mechanism #3 closure

Cross-reference this workspace from ADR-162 §Enforcement Mechanisms #3
(conformance test helper). Mechanism #3's Open Question in the ADR
closes when this plan lands.

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm check
```

Phase-boundary criterion: exit 0, no filtering.

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Reviewer matrix:

- `docs-adr-reviewer` — schema/contract completeness; ADR-162
  alignment.
- `type-reviewer` — Zod 4 usage; `io: 'input'` vs `io: 'output'`
  semantics per distilled.md edge case on `.meta()`.
- `sentry-reviewer` — schema/emission fit for Sentry's event and
  metric surfaces; categorical-vs-value redaction boundary.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Exploration 4 lands late; MVP schema shape not finalisable | WS1 stubs schemas with placeholder categorical axes; WS2 finalises once exploration lands. Plan promotion to `active/` blocks on exploration 4 close. |
| Zod 4 `.meta()` loses examples through `z.preprocess()` (distilled.md edge case) | Avoid `z.preprocess()` in schemas; if required, document the limitation per-field. |
| Downstream consumers bypass the schema contract | Conformance helper + reviewer-matrix question (ADR-162 Mechanism #2) catches. ESLint rule #1 flags uninstrumented emission sites. |
| Schema churn during Phase 2 | `/1` version suffix on export paths once stable; break-glass migration plan per schema. Not in MVP scope. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- [ADR-029](../../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) — no manual data structures; schemas are the contract.
- [ADR-030](../../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — schema-first single source of truth.
- [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — consuming workspaces inject this workspace's helpers.
- [ADR-143](../../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) — sink model; events flow through it.
- [ADR-154](../../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md) — framework (this workspace) vs consumer separation.
- [ADR-160](../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) — redaction governs every field.
- [ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md) — the ADR this workspace exists to operationalise.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

- Workspace README at creation time.
- `event-catalog.md` data-scientist-facing.
- Cross-references from consuming-workspace READMEs (MCP app, search
  CLI, widget).
- ADR-162 Enforcement Mechanism #3 references this workspace.
- High-level observability plan § Plan Map updated.

---

## Consolidation

After quality gates pass, run `/jc-consolidate-docs`. Candidate pattern:
**code-enforced schema contracts as a first-class alternative to Markdown
specs** (if this approach survives a second unrelated context validation).

---

## Acceptance Summary

1. `packages/core/observability-events/` workspace exists and is a
   member of the pnpm workspace graph.
2. MVP schema set (seven events) + correlation-keys + conformance helper
   all implemented and tested.
3. Every consuming workspace's test composes the conformance helper.
4. `event-catalog.md` published.
5. ADR-162 Mechanism #3 Open Question closed.
6. `pnpm check` exit 0 from repo root.
