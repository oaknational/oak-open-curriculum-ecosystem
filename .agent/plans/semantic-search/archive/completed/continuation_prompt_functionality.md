Plan: .agent/plans/semantic-search/semantic-search-phase-1-functionality.md
Context: .agent/plans/semantic-search/semantic-search-phase-1-functionality-context.md
Theme inventory: .agent/plans/semantic-search/semantic-theme-inventory.md
Theme spec: .agent/plans/semantic-search/semantic-theme-spec.md
Next.js + Styled Components reference: .agent/reference-docs/ui/styled-components-in-nextjs.md

All work must align with `GO.md`, `.agent/directives-and-memory/AGENT.md`, `.agent/directives-and-memory/rules.md`, and `docs/agent-guidance/testing-strategy.md`. Maintain GO cadence (ACTION → REVIEW with grounding cadence) and use British spelling.

Current status (2025-09-26): Structured search controllers and theme bridge are stable; ingestion/telemetry pipelines need resilience and actionable outputs. Functionality plan focuses on ingestion/rollup hardening, telemetry/health improvements, admin tooling, and documentation.

Immediate focus for next functionality session:

- Consolidate ingestion/telemetry requirements with UX data needs; add failing tests for retries, telemetry payloads, and health diagnostics.
- Address missing environment variables causing `/healthz` and telemetry errors; ensure endpoints provide structured responses.
- Coordinate documentation updates (OpenAPI, admin messaging) alongside UX changes.
