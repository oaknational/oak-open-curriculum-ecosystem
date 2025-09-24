# Semantic Search Continuation Prompt

Plan: .agent/plans/semantic-search/semantic-search-target-alignment-plan.md
Context: .agent/plans/semantic-search/semantic-search-target-alignment-context.md

All work must be clear, useful, specific, actions must be atomic and measurable. Please structure the work using @GO.md , replacing all reviews with self reviews. All work specified must be fully aligned with the rules @rules.md and the testing strategy @testing-strategy.md at all points

===

What has shipped

- Server-side RRF across lessons, units, and sequences with enriched totals, facets, and highlights.
- `/api/search/suggest` delivering completion + fallback suggestions with caching and structured logging.
- Zero-hit telemetry helper logging scope/filters/index version and supporting optional webhooks.
- OpenAPI/MCP artefacts refreshed; deployment checklist documents Elasticsearch bootstrap plus admin flows.

Current focus (Phase 1)

1. Wire UI/server actions so facet or scope changes trigger structured follow-up searches and show totals/facets/suggestions.
2. Migrate search/admin surfaces to Oak Components + semantic tokens (cards, dropdowns, facets, status panels); remove ad-hoc styling.
3. Design observability surfaces (dashboards/webhook consumer) to exploit the zero-hit telemetry payloads.
4. Keep `oak_sequence_facets` ingestion + caching responsive while UI work lands.
5. Run lint → test → build → doc-gen quality gates once UI and observability changes are complete.

Constraints & reminders

- Follow GO.md cadence (ACTION → REVIEW, grounding every third task, British spelling).
- No `dangerouslySetInnerHTML`; highlights already sanitised.
- All styling must flow through `theme.app` tokens/Oak Components; The MUST BE NO ad-hoc styles at all, avoid raw hex codes and inline styles.
- Tests must avoid or mock network I/O; expand unit/a11y coverage for new UI functionality.
- Consult `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md` and the context snapshot before planning tasks.

Quick start checklist

1. Read GO.md, AGENT.md, repository rules, and the testing strategy.
2. Read the target alignment plan, make sure it remains fully coherent and self-consistent.
3. Skim the target alignment plan Phase 1 features, workstreams, acceptance criteria, deployment section.
4. Review outstanding tasks for Phase 1 (UI wiring, token migration, observability dashboards, quality gates).
5. Begin with ACTION: implement facet-driven searches
6. Once all back-end work is complete, begin on the Oak Component migration, being sure to locate and read ALL oak component documentation in this repo, and online as necessary.
