---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-04-16
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

## Role

This prompt is an operational entry point only. The active plans are
authoritative for scope, status, sequencing, acceptance criteria, and
evidence requirements.

## Workstream

Branch `feat/otel_sentry_enhancements` carries the remaining Milestone 2
observability closure work after PR #73 merged to `main` on 2026-03-31.

## Read First

1. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
2. [sentry-canonical-alignment.plan.md](../../plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md)
3. [sentry-observability-expansion.plan.md](../../plans/architecture-and-infrastructure/active/sentry-observability-expansion.plan.md)
4. [search-observability.plan.md](../../plans/architecture-and-infrastructure/active/search-observability.plan.md)
5. [sentry-observability-translation-crosswalk.plan.md](../../plans/architecture-and-infrastructure/active/sentry-observability-translation-crosswalk.plan.md)
6. [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
7. [ADR-158](../../../docs/architecture/architectural-decisions/158-multi-layer-security-and-rate-limiting.md)

## Current State (2026-04-16)

- Shared observability foundation is implemented for the HTTP MCP server
  and Search CLI.
- Native MCP wrapping is adopted on the HTTP live path.
- `@oaknational/sentry-mcp` has been deleted after the migration.
- Local `.env.local` provisioning is complete for both runtimes.
- The remaining branch-critical work is human-operated:
  Vercel credential provisioning plus the deployment evidence bundle.
- Follow-on capability work is intentionally split into companion plans:
  MCP-server expansion, search observability, and translation maintenance.
- Current user-directed sequence is: validate what exists, then continue with
  the MCP-server-confined expansion plan, and defer broader search work to a
  later session and PR.

## Next Safe Step

1. Set `SENTRY_MODE`, `SENTRY_DSN`, and `SENTRY_TRACES_SAMPLE_RATE` on
   the Vercel project for the HTTP MCP server.
2. Deploy with live Sentry enabled and gather the evidence bundle
   required by the parent plan.
3. After validation is complete, continue with
   `sentry-observability-expansion.plan.md`. Treat
   `search-observability.plan.md` as a later session/PR unless the work is
   explicitly confined to the MCP server.

## Hard Invariants

- `sendDefaultPii: false`
- `SENTRY_MODE=off` remains the kill switch default
- DI/testability and redaction boundaries remain intact
- No duplicate custom MCP tracing system on the authoritative live path
- Scope moves must update the translation crosswalk in the same change set

## Authority Rule

1. The parent execution plan is authoritative for foundation facts,
   remaining branch closure work, and deployment evidence.
2. The child plan is authoritative for HTTP live-path alignment history
   and its acceptance boundary.
3. The companion plans are authoritative for post-baseline expansion and
   search follow-on work.
4. If this prompt conflicts with the active plans, the active plans win.
