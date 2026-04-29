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
