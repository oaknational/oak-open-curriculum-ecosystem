---
name: "Sentry Observability Translation Crosswalk"
overview: >
  Provide a lossless recovery mapping for superseded scope into the narrowed
  child plan plus companion plans so no removed capability intent is lost in
  translation.
source_plan: "archive/superseded/sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md"
target_plans:
  - "sentry-canonical-alignment.plan.md"
  - "sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)"
  - "search-observability.plan.md"
  - "sentry-otel-integration.execution.plan.md"
todos:
  - id: crosswalk-audit
    content: "Verify all removed and reframed scope has a concrete target owner and acceptance lane"
    status: done
  - id: crosswalk-maintenance
    content: "Update mappings when any item changes owner, status, or acceptance criteria"
    status: pending
---

# Sentry Observability Translation Crosswalk

## Role

This document is the audit trail that proves narrowing was compartmentalisation,
not deletion.

## Path Convention

Frontmatter paths are relative to
`.agent/plans/architecture-and-infrastructure/`:

1. active plans use file names only,
2. archived references include their relative archive path.

## Removed-Item Mapping (Frontmatter Todo Recovery)

Source for this table: dropped todo items in
`sentry-canonical-alignment.plan.md`.

| Removed item from narrowed child plan | New authoritative owner |
|---|---|
| `custom-metrics` | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` — EXP-A |
| `cli-metrics` | `search-observability.plan.md` — CLI-MET |
| `mcp-request-context` | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` — EXP-B |
| `cli-early-init` | `search-observability.plan.md` — CLI-PRELOAD decision lane (intentional reframing, not mandatory preload) |
| `trace-propagation-es` | `search-observability.plan.md` — ES-PROP (moved from EXP-C1 on 2026-04-16) |
| `trace-propagation-oak-api` | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` — EXP-C2 |
| `profiling-evaluation` | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` — EXP-D |
| `source-maps-automation` | Parent WS6 (`sentry-otel-integration.execution.plan.md`) + `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-E |

## Section-Level Mapping (Superseded Plan to Current Plan Set)

Source for this table: sections from
`archive/superseded/sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md`.

| Superseded section | Current owner |
|---|---|
| Gap 1 — Early SDK Init | `sentry-canonical-alignment.plan.md` (completed) |
| Gap 2 — Express Error Handler | `sentry-canonical-alignment.plan.md` (completed) |
| Gap 3 — Adapter Surface Extension | `sentry-canonical-alignment.plan.md` (completed) |
| Native MCP Server Wrapping investigation/adoption | `sentry-canonical-alignment.plan.md` (completed) |
| Gap 3.5 — Custom Metrics | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-A |
| Gap 4 — Trace Propagation Targets | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-C2 (third-party) + `search-observability.plan.md` ES-PROP (Elasticsearch) |
| Gap 5 — Profiling | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-D |
| Gap 6 — Source Map Automation | Parent WS6 + `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-E |
| Search CLI Gap Analysis | `search-observability.plan.md` (all 4 layers) |
| CLI command context enrichment | `search-observability.plan.md` CLI-CTX |
| CLI logger singleton DI remediation (from `cli-logger-di-audit` note) | `search-observability.plan.md` CLI-0 |
| CLI `close()` over `flush()` | `sentry-canonical-alignment.plan.md` frontmatter todo `cli-close-instead-of-flush` (done) |

## Full-Gamut Coverage Matrix

| Capability family | Plan owner | Provenance |
|---|---|---|
| Error capture and request context | `sentry-canonical-alignment.plan.md`, `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` | Migrated |
| Tracing and transport/session MCP signal | `sentry-canonical-alignment.plan.md` | Migrated |
| Metrics | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` and `search-observability.plan.md` | Migrated |
| Profiling | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` | Migrated |
| Source maps and release linkage | Parent plan WS6 + `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` | Migrated |
| CLI-specific observability maturity | `search-observability.plan.md` | Migrated |
| Alerting and runbook operations | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-F | New expansion scope |
| Architecture options ("other options") | `sentry-observability-maximisation-mcp.plan.md (successor to archived sentry-observability-expansion.plan.md)` EXP-G | New expansion scope |

## Verification Rule

Any future scope narrowing is invalid unless this crosswalk is updated in the
same change set with:

1. item moved,
2. new owner plan,
3. acceptance lane,
4. rationale for move.
