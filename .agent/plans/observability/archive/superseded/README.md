# Superseded Plans — Observability Workspace

Plans archived here have been intentionally narrowed, reframed, or
replaced by current/active plans. Each entry records the supersession
mapping: which superseded scope went where, with concrete owner +
acceptance lane + rationale.

## Plan Supersession Discipline (Verification Rule)

When a plan is narrowed, reframed, or superseded, the same change set
that performs the supersession MUST also land a supersession mapping.
The mapping records, for every dropped scope item:

1. **Item moved** — verbatim frontmatter id or section heading.
2. **New owner plan** — file path of the plan now owning the scope.
3. **Acceptance lane** — the named todo or section in the new owner.
4. **Rationale for move** — one-sentence reason for the route choice.

The mapping lives in this README (or as an appendix on the archived
source plan itself), **never as a standalone plan**. A standalone
crosswalk plan after the supersession lands is duplicative; the
audit trail belongs adjacent to the artefact it traces.

(Doctrine graduated 2026-04-29 from
`sentry-observability-translation-crosswalk.plan.md`.)

---

## sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md

Source-plan archive of the canonical-alignment plan as it stood before
the 2026-04-15 value reframe. Narrowing was compartmentalisation, not
deletion — every removed scope item has a concrete owner.

### Removed-Item Mapping (Frontmatter Todo Recovery)

Source: dropped todo items in the narrowed child plan
`sentry-canonical-alignment.plan.md`.

| Removed item | New authoritative owner |
|---|---|
| `custom-metrics` | `sentry-observability-maximisation-mcp.plan.md` — EXP-A |
| `cli-metrics` | `search-observability.plan.md` — CLI-MET |
| `mcp-request-context` | `sentry-observability-maximisation-mcp.plan.md` — EXP-B |
| `cli-early-init` | `search-observability.plan.md` — CLI-PRELOAD decision lane (intentional reframing, not mandatory preload) |
| `trace-propagation-es` | `search-observability.plan.md` — ES-PROP (moved from EXP-C1 on 2026-04-16) |
| `trace-propagation-oak-api` | `sentry-observability-maximisation-mcp.plan.md` — EXP-C2 |
| `profiling-evaluation` | `sentry-observability-maximisation-mcp.plan.md` — EXP-D |
| `source-maps-automation` | Parent WS6 (`sentry-otel-integration.execution.plan.md`) + `sentry-observability-maximisation-mcp.plan.md` EXP-E |

### Section-Level Mapping (Superseded Plan to Current Plan Set)

Source: sections from
`sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md`.

| Superseded section | Current owner |
|---|---|
| Gap 1 — Early SDK Init | `sentry-canonical-alignment.plan.md` (completed) |
| Gap 2 — Express Error Handler | `sentry-canonical-alignment.plan.md` (completed) |
| Gap 3 — Adapter Surface Extension | `sentry-canonical-alignment.plan.md` (completed) |
| Native MCP Server Wrapping investigation/adoption | `sentry-canonical-alignment.plan.md` (completed) |
| Gap 3.5 — Custom Metrics | `sentry-observability-maximisation-mcp.plan.md` EXP-A |
| Gap 4 — Trace Propagation Targets | `sentry-observability-maximisation-mcp.plan.md` EXP-C2 (third-party) + `search-observability.plan.md` ES-PROP (Elasticsearch) |
| Gap 5 — Profiling | `sentry-observability-maximisation-mcp.plan.md` EXP-D |
| Gap 6 — Source Map Automation | Parent WS6 + `sentry-observability-maximisation-mcp.plan.md` EXP-E |
| Search CLI Gap Analysis | `search-observability.plan.md` (all 4 layers) |
| CLI command context enrichment | `search-observability.plan.md` CLI-CTX |
| CLI logger singleton DI remediation (from `cli-logger-di-audit` note) | `search-observability.plan.md` CLI-0 |
| CLI `close()` over `flush()` | `sentry-canonical-alignment.plan.md` frontmatter todo `cli-close-instead-of-flush` (done) |

### Full-Gamut Coverage Matrix

| Capability family | Plan owner | Provenance |
|---|---|---|
| Error capture and request context | `sentry-canonical-alignment.plan.md`, `sentry-observability-maximisation-mcp.plan.md` | Migrated |
| Tracing and transport/session MCP signal | `sentry-canonical-alignment.plan.md` | Migrated |
| Metrics | `sentry-observability-maximisation-mcp.plan.md` and `search-observability.plan.md` | Migrated |
| Profiling | `sentry-observability-maximisation-mcp.plan.md` | Migrated |
| Source maps and release linkage | Parent plan WS6 + `sentry-observability-maximisation-mcp.plan.md` | Migrated |
| CLI-specific observability maturity | `search-observability.plan.md` | Migrated |
| Alerting and runbook operations | `sentry-observability-maximisation-mcp.plan.md` EXP-F | New expansion scope |
| Architecture options ("other options") | `sentry-observability-maximisation-mcp.plan.md` EXP-G | New expansion scope |

### Provenance

Tables migrated from
`sentry-observability-translation-crosswalk.plan.md` during the
2026-04-29 deep consolidation pass; the standalone crosswalk plan
was archived to `archive/completed/` in the same change set.

---

## observability-config-coherence.plan.pre-orthogonal-axes-2026-05-02.md

Source-plan archive of the strategic brief that prescribed four
related architectural concerns (sink registry unification, env-layer
validation, locality classification, build-log signal) plus a
parallel config-management-platform evaluation. Superseded 2026-05-02
because the orthogonal-axes shape (`OBSERVABILITY_SINKS` typed list +
`OBSERVABILITY_FIXTURES` orthogonal switch) is the structural cure
the brief was missing — it answers the brief's four open design
questions and absorbs WS-A/B/C/D into a single coherent executable
plan.

### Scope Routing

| Source workstream | New owner plan | Acceptance lane |
|---|---|---|
| WS-A — Unify sink registry | `current/observability-multi-sink-and-fixtures-shape.plan.md` | WS2 (sentry-node) + WS3 (env layer) |
| WS-B — Sentry validation at env layer (superRefine) | `current/observability-multi-sink-and-fixtures-shape.plan.md` | WS3 |
| WS-C — Build-log + startup signal | `current/observability-multi-sink-and-fixtures-shape.plan.md` | WS4 + WS8.4 (operator runbook) |
| WS-D — ServerInstrumenter port | `current/observability-multi-sink-and-fixtures-shape.plan.md` | WS6 |
| WS-E — Config-management-platform evaluation | `future/config-management-platform-evaluation.plan.md` | NEW STUB spawned by new owner plan WS11.1 |
| Open Design Q1 — sink registry location | `current/observability-multi-sink-and-fixtures-shape.plan.md` D11 | Decided: `@oaknational/observability` (framework layer) |
| Open Design Q2 — locality enforcement strength | `current/observability-multi-sink-and-fixtures-shape.plan.md` D9 | Decided: warn in preview, fail-closed in production |
| Open Design Q3 — warnings channel shape | `current/observability-multi-sink-and-fixtures-shape.plan.md` D10 | Decided: sibling `warnings` field on Result success path |
| Open Design Q4 — helper placement | `current/observability-multi-sink-and-fixtures-shape.plan.md` D11 | Decided: shared `@oaknational/env` |

---

## local-dev-sentry-boundary-regression-investigation.plan.pre-shape-fix-2026-05-02.md

Source-plan archive of the wrong-framed predecessor. The plan
correctly diagnosed the proximate symptom (`pnpm dev` from
`apps/oak-curriculum-mcp-streamable-http` failing on Sentry release
resolution) and traced the throw site to `runtime-error.ts:74`, but
framed the cure too narrowly as a local-dev configuration question.
The actual cure is structural: `SENTRY_MODE` conflates sink-target
selection with fixture-vs-live capture; the correct shape is
orthogonal axes per `principles.md § Architectural Excellence Over
Expediency` (graduated 2026-05-02). The structural cure makes the
local-dev failure impossible by construction — local dev with no
observability env vars defaults to stdout-only via the always-implicit
baseline; no Sentry sink, no release resolution.

### Scope Routing

| Source phase | New owner plan | Acceptance lane |
|---|---|---|
| Phase 0 — Reproduce + trace throw site | `current/observability-multi-sink-and-fixtures-shape.plan.md` | Context section preserves diagnostic evidence; throw-site reading absorbed into WS1 (D7a verification of `sentry-build-environment.ts`) |
| Phase 1 — Canonical config options for local-dev disable | `current/observability-multi-sink-and-fixtures-shape.plan.md` | Subsumed: orthogonal-axes shape replaces single-switch; "off" is no longer a value, it is empty `OBSERVABILITY_SINKS=[]` |
| Phase 2 — Owner decision on canonical option + structural enforcement | `current/observability-multi-sink-and-fixtures-shape.plan.md` D2 + WS3 | Decided: stdout always-implicit baseline; structural enforcement via env-layer `superRefine` |
| Phase 3 — Implement cure with RED→GREEN tests | `current/observability-multi-sink-and-fixtures-shape.plan.md` | WS1 (RED) → WS4 (GREEN); outermost regression-guard E2E pins the contract |
| Owner-stated invariant (*"local dev MUST NOT require Sentry release identity"*) | `current/observability-multi-sink-and-fixtures-shape.plan.md` | Acceptance criterion #2 |
