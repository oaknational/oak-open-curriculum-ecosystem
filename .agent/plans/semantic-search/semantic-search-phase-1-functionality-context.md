# Semantic Search Phase 1 – Functionality Context Snapshot

_Last updated: 2025-09-26_

## Active Focus

- Execute the functionality plan (`semantic-search-phase-1-functionality.md`): ingestion resilience, telemetry/health improvements, admin tooling, documentation, and operational readiness.
- Maintain alignment with the SDK and OpenAPI artefacts via `pnpm type-gen`; avoid manual schema drift.
- Provide reliable data and status outputs that the UX plan can surface in redesigned interfaces.

## Current State

- Structured search endpoints and controllers deliver totals, suggestions, and facets with unit/integration coverage.
- Admin endpoints exist for ingestion and rollup triggers but need stronger feedback when operations succeed/fail.
- Zero-hit telemetry and `/healthz` return raw errors when required env vars are absent.
- Hydration is managed via an inline script; revisit once Oak Components publish SSR-consistent styles.

## Operational Notes

- Environment variables (e.g. `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `SEARCH_API_KEY`, `SEARCH_INDEX_VERSION`) must be validated; current dev logs show missing values causing 400/500 responses.
- Ingestion scripts must handle alias swaps, retries, and logging; telemetry requires structured outputs consumable by admin UI.
- Observability targets include Sentry/Elastic dashboards (to be defined) and zero-hit trend reporting.

## Outstanding Questions

- What cron cadence and retry policies should govern ingestion/rollup in production?
- How should zero-hit and ingestion metrics feed platform dashboards beyond the admin UI?
- Are additional dark-mode adjustments needed in functionality (icon assets, API responses) once UX finalises design?
- Can Oak Components or platform teams provide upstream health/telemetry helpers to reduce local maintenance?

## Dependencies & Coordination

- UX plan requires reliable telemetry/health data formats; coordinate to avoid UI stubs blocking functionality shipping.
- Platform/DevOps collaboration needed for deployment, secrets management, and alerting.
- SDK maintainers must stay informed about schema or response shape changes to keep clients type-safe.
