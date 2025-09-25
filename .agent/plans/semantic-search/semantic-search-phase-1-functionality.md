# Semantic Search Phase 1 – Functionality Plan

## Programme Vision

- Deliver the hybrid semantic search service with reliable ingestion, resilient query execution, and observable operations aligned with Oak’s deployment constraints.
- Ensure server behaviour, admin tooling, and API documentation remain in lockstep with the SDK so downstream consumers gain type-safe, predictable responses.
- Maintain rigorous quality gates (TDD, type checks, linting, observability) while iterating on Phase 1 feature completeness.

## Phase Focus – Service Hardening & Operations

Phase 1 functionality work cements the back-end and operational experience:

- Harden ingestion and rollup pipelines (lessons, units, sequences, facets) with retries, observability, and admin controls.
- Expose telemetry (zero-hit metrics, health checks, ingestion status) that product teams can trust.
- Keep business logic unified across structured and natural search endpoints with regression coverage.
- Align admin workflows, docs, and deployment guidance with the reworked UX plan.

## Current State Snapshot (2025-09-26)

- ✅ Token-aligned theme, search UI shell, and bridge integration tests in place.
- ✅ Structured search controllers power totals, suggestions, and facets with unit + integration coverage.
- ✅ Admin endpoints exist for ingestion and rollup triggers.
- ⚠️ Ingestion resilience and operational logging need tightening (alias swaps, retries, zero-hit pipelines).
- ⚠️ Observability endpoints surface raw errors (missing env vars, telemetry failures) without actionable context.
- ⚠️ API documentation and health endpoints require refinement to match Oak standards and new UX expectations.

## Functional Objectives & Workstreams

### 1. Ingestion & Rollup Reliability

- Ensure Elasticsearch setup scripts create indices, mappings, synonyms, completion contexts consistently across environments.
- Implement resilient ingestion with batched retries, backoff, alias swap integrity checks, and metrics for duration & throughput.
- Maintain rollup rebuild pipeline (sequence facets, lesson-planning snippets) with clear logs and admin feedback.

### 2. Query Execution & Business Logic

- Keep structured/natural search endpoints sharing ranking, filtering, and pagination logic via the SDK.
- Guarantee suggestion replay, follow-up queries, and scope changes remain type-safe and well-tested.
- Verify zero-hit logging captures scope, filters, index version, and correlation IDs for telemetry analysis.

### 3. Telemetry, Observability, & Health

- Provide actionable zero-hit dashboards (counts per scope, trend lines, time ranges) and expose them via the redesigned admin experience.
- Upgrade `/healthz` to return Oak-styled status, environmental diagnostics, and guidance when required env vars are missing.
- Integrate logging/metrics with central observability tooling (Sentry/Elastic) and document the hand-offs.

### 4. Documentation & SDK Alignment

- Keep OpenAPI specs, SDK types, and generated docs in sync with service behaviour.
- Ensure the new API docs experience reflects live schema, example payloads, and parity tests.
- Provide operational runbooks covering env configuration, ingestion cadence, and recovery steps.

## Deliverables

- Production-ready ingestion + rollup pipelines with admin triggers and logging.
- Unified search endpoints with full test coverage and zero-hit telemetry instrumentation.
- Observability suite (health, telemetry, dashboards) that aligns with UX polish.
- Updated documentation (OpenAPI, SDK guidance, runbooks) reflecting Phase 1 readiness.

## Dependencies & Collaboration Points

- UX stream: provides redesigned surfaces that expose telemetry/health outputs; functionality work must supply the underlying data.
- DevOps/platform: collaboration for deployment hooks, cron schedules, secrets management.
- SDK maintainers: verify contract changes flow through `pnpm type-gen` and ensure no manual divergence.

## Risks & Mitigations

- **Risk:** Ingestion changes could introduce downtime. **Mitigation:** Leverage blue/green alias swaps, thorough dry-runs, and logging before production rollout.
- **Risk:** Observability pipelines might expose sensitive data. **Mitigation:** Sanitize logs, enforce config validation, and document privacy constraints.
- **Risk:** Documentation drift as UX overhauls API docs. **Mitigation:** Automate doc generation in quality gates and coordinate with UX deliverables.

## Todo (GO cadence)

1. ACTION: Consolidate outstanding ingestion/telemetry requirements from previous plan and new UX expectations into a single backlog.
2. REVIEW: Validate backlog with stakeholders (data, infra, UX) to ensure priorities cover ingestion, telemetry, health, and docs.
3. ACTION: Add failing automated tests covering ingestion resilience (mocked retries, alias swaps) and telemetry output contracts.
4. REVIEW: Inspect failures to confirm they represent real gaps (retry logging, zero-hit summaries, health diagnostics).
5. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search test src/lib/indexing` (or equivalent suites) to baseline current behaviour.
6. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ACTION: Implement ingestion/rollup hardening (batched retries, alias swap verification, logging) with accompanying tests and admin status updates.
8. REVIEW: Conduct peer review focusing on failure handling, observability hooks, and admin feedback loops.
9. ACTION: Enhance telemetry + health endpoints (structured responses, docs, dashboards) and wire into redesigned UX.
10. REVIEW: Validate telemetry outputs end-to-end (service → admin UI → documentation) and adjust SDK/OpenAPI artefacts.
11. QUALITY-GATE: Execute `pnpm format:root`, `pnpm lint`, `pnpm type-check`, full `pnpm test`, and relevant doc-gen/visual regression commands to confirm stability.
12. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
13. ACTION: Finalise runbooks and deployment notes (env vars, cron schedules, alerting) and share with operations.
14. REVIEW: Ensure documentation, telemetry dashboards, and CI gates align; archive completed tasks and signal readiness for Phase 2.
