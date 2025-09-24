# Semantic Search Target Alignment Plan

## Infrastructure

- Next.js App Router app, hosted on Vercel, with access to the Oak Open Curriculum data via the SDK in this monorepo.
- [Elastic Hybrid Search](https://www.elastic.co/docs/solutions/search/hybrid-semantic-text) (EHS) with [Elasticsearch Serverless](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/serverless), which has [its own API surface](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/) distinct from the hosted solutions.
- The official Elasticsearch Typescript client, [@elastic/elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch), which includes support for Elasticsearch Serverless.

## Intent

Deliver the hybrid search app so that it matches the definitive architecture: server-side RRF queries over enriched Elasticsearch Serverless indices, fully populated via the SDK with canonical URLs and lesson-planning data, plus the supporting admin flows, suggestion endpoints, and observability. All ingestion and search orchestration runs inside Next.js App Router API routes deployed on Vercel, so every step must remain compatible with that runtime (Node 18/20 edge constraints, streaming limits, invocation timeouts). This plan now subsumes the semantic search index enhancement roadmap and grounds ontology requirements in `docs/architecture/curriculum-ontology.md`.

## Current State Summary

- Elasticsearch setup scripts have been updated to provision all four indices (`oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`) with the definitive analysers, normalisers, completion contexts, and highlight offsets.
- Environment validation now enforces `SEARCH_INDEX_VERSION`, optional zero-hit webhook/LOG_LEVEL defaults, and the new requirements are covered by unit tests. SDK adapters expose additional summary endpoints but still need to emit the enriched payloads into the ingestion pipeline.
- Rollup rebuild now emits lesson-planning snippets drawn from SDK summaries; remaining work is to propagate enriched rollups into API responses and downstream queries.
- Search runtime now issues server-side `rank.rrf` requests for lessons, units, and sequences, returning highlights, totals, and optional aggregations.
- Structured, NL, and suggestion API routes validate facets/phase filters, emit enriched payload envelopes, and now share cached responses with zero-hit logging hooks. Front-end flows still consume only the legacy `results` array and need upgrading, but the SDK exposes canonical facet schemas plus named Zod exports so downstream code stays lint-clean.
- Test suite covers the new helper behaviour, and zero-hit logging now records scope, filters, and index version; observability dashboards and UI surfacing of these events remain outstanding.

## Progress to Date

- Regenerated Elasticsearch mapping templates and setup script so all indices match the definitive schema (including completion contexts, highlight offsets, canonical URL fields, semantic_text fields).
- Expanded runtime env validation (`SEARCH_INDEX_VERSION`, zero-hit webhook, LOG_LEVEL, AI provider checks) with a dedicated unit test suite.
- Prefixed and enriched all SDK search index types (`SearchLessonsIndexDoc`, etc.) so downstream code imports a single, unambiguous set of search-specific interfaces.
- Added schema-derived summary/sequences guards (`isLessonSummary`, `isUnitSummary`, `isSubjectSequences`) and extended the SDK adapter to consume them.
- Added `scripts/check-search-canonical-urls.ts` to verify canonical URL helpers resolve to live teachers-site pages.
- Successfully regenerated the SDK type artifacts (`pnpm type-gen`), producing up-to-date OpenAPI/Zod outputs after the latest schema adjustments.
- Refactored indexing pipeline into pure helpers with unit coverage, replacing ad-hoc transforms in `index-oak.ts` and removing lint/type violations.
- Rebuild route now consumes the shared transforms, generates structured lesson-planning snippets, and relies solely on SDK data.
- Added RRF query builder module and unit tests covering the canonical Elasticsearch request bodies for lessons, units, and sequences.
- Integrated the server-side RRF builders into the live search routes, removed the legacy `rrfFuse` helper, and added integration tests for the structured endpoint contract.
- Refactored `elastic-http.ts` to handle rank/aggregations/from safely with dedicated unit coverage.

- Updated Typedoc configuration and regenerated SDK + semantic-search documentation without warnings.
- Implemented `/api/search/suggest` with cached completion + fallback queries, dedicated logging, and integration coverage.
- Added zero-hit telemetry helper invoked from structured search, including optional webhook dispatch and unit tests.
- Generated search facet types and Zod validators directly from the OpenAPI schema, tightened the emitters to use named exports, and resolved the lint regression highlighted by the workspace quality gates.
- Introduced light/dark AppTheme definitions built on `OakTheme`, rewired the ThemeProvider to switch between them, and replaced the theme selector with Oak radio components.

## Target Outcomes

1. Single-request, server-side RRF searches for lessons, units, and sequences that honour the definitive query bodies (lexical + semantic, highlights, filters, optional facets).
2. Elasticsearch indices constructed by scripts that match the documented settings, including synonyms, analysers, completion contexts, and highlight limits.
3. Robust indexing & rollup flows that ingest enriched SDK data (lesson-planning data, canonical URLs, snippets) and populate all required fields, including suggestion payloads and semantic text inputs.
4. API routes (structured, NL, suggestion/type-ahead, admin) that expose the new scopes safely, validate via generated types, and emit the enriched responses.
5. Comprehensive tests and logging to detect bulk/indexing errors, zero-hit searches, and ensure regression coverage for new behaviours.

## Success Metrics

- **Search responsiveness**: P95 latency for `/api/search`, `/api/search/nl`, and `/api/search/suggest` remains below 900 ms under representative load, with cache hit rates ≥ 60 % for suggestion queries.
- **Ingestion health**: Nightly ingestion completes within 20 minutes, recording zero failed batches and emitting structured success logs for each index.
- **Facet accuracy**: Automated regression tests confirm facet totals against baseline fixtures with ≤ 1 % discrepancy.
- **Zero-hit observability**: Dashboards reflect zero-hit counts, scope distribution, and webhook success rates with < 1 % delivery failure.
- **UI quality**: Axe + unit tests report no WCAG AA regressions; Lighthouse accessibility score ≥ 95 for search/admin surfaces.

## Risks & Considerations

- SDK must already expose the necessary lesson-planning data and canonical URLs; otherwise we need upstream changes.
- Server-side RRF requires Elasticsearch Serverless tier that supports `semantic_text` and rank fusion; verify cluster version/features before rollout.
- Expanded documents increase payload size; monitor ES indexing throughput and query latency during rollout.
- Next.js API routes on Vercel have memory/runtime ceilings; keep ingestion helpers pure/pipelined so they fit within per-invocation limits or split work into batched calls.
- Quality gates may surface latent issues in unrelated workspaces due to shared SDK changes; coordinate with owning teams.
- Nightly rebuilds must remain efficient; each index addition needs clear incremental update strategies, shard sizing, and inference cost monitoring.

## Roadmap Phases

All phases inherit the ontology definitions from `docs/architecture/curriculum-ontology.md` (node IDs, relationships, schema references, provenance) and reuse the definitive hybrid query practices.

### Phase 1 – Demonstration Baseline

Objective: showcase a complete hybrid search experience with first-class filtering and facets while keeping the implementation lean.

- **Indices**
  - Continue using `oak_lessons`, `oak_units`, `oak_unit_rollup`, and `oak_sequences` as the core search indices.
  - Introduce `oak_sequence_facets` to store condensed hierarchy metadata (subject → sequence → unit → year/key stage counts) plus suggestion seeds. This index enables subject, programme (sequence), unit, key stage, and year filtering without overloading the primary indices.
- **Features**
  - Structured/NL endpoints expose filters for subject, key stage, year, sequence (programme), and unit, returning facet buckets sourced from `oak_sequence_facets`.
  - Responses include totals, pagination metadata, and optional aggregation blocks.
  - UI/server actions consume the enriched responses and render facets.
  - Zero-hit logging captures scope, filters, and `SEARCH_INDEX_VERSION`.
  - Search forms, results, and suggestion inputs use Oak Components with `theme.app` tokens; suggestion dropdown is keyboard-accessible and surfaces cache/version state.
  - Admin page presents ingestion/rollup triggers, index version, and latest zero-hit metrics drawing on status endpoints.
  - Replace inline styles with semantic tokens (`surface.card`, `surface.dropdown`, `text.muted`, etc.); ensure light/dark parity and accessibility (contrast, focus states).
- **Ingestion**
  - Create a shared ingestion harness (backfill + nightly) that draws solely on SDK data; ensure it can materialise `oak_sequence_facets` efficiently.
  - Document operational runbooks and backoff strategies.
- **Exit Criteria**
  - UI reflects lessons/units/sequences with live facets and totals across all supported scopes.
  - Suggestion dropdown delivers completion data with cache/version context and telemetry logging verified.
  - Zero-hit dashboard or interim report highlights scope/filter trends using structured logs.
  - Quality gates (format → type-check → lint → test → build → doc-gen) pass with updated artefacts.

### Phase 2 – Content Depth Expansion

Objective: enrich search with pedagogical context, resources, and optional prior knowledge signals, demonstrating the full power of `semantic_text` indices.

- **Indices**
  - `oak_lesson_planning`: denormalised lesson/unit planning metadata (key learning points, misconceptions, teacher tips, accessibility notes, canonical URLs) with semantic embeddings.
  - `oak_lesson_transcripts`: chunked transcripts with timing metadata and long-form embeddings.
  - `oak_content_guidance`: safeguarding tags, supervision levels, accessibility notices, prior knowledge relationships. Add prior knowledge (priorKnowledgeRequirements) and National Curriculum (nationalCurriculumContent) filters/boosting once ingestion proves reliable.
  - `oak_assets`: downloadable/viewable resources with attribution, asset type, accessibility metadata, and completion contexts for suggestions.
  - `oak_assessments`: quiz stem/distractor/objective data for assessment discovery.
- **Features**
  - Augment search responses with optional blocks (planning snippets, transcript excerpts, guidance highlights, resource suggestions) behind feature flags.
  - Extend filters to include safeguarding/accessibility categories; evaluate prior knowledge graph traversal.
  - UI surfaces richer content cards, Oak Component tabs, and contextual guidance callouts with responsive layouts and a11y coverage.
- **Ingestion**
  - Design inference-aware pipelines per index: chunking heuristics, embedding jobs, nightly delta strategies, logging of ontology node IDs.
  - Establish cost monitoring (Elastic inference + storage) and alerting.
- **Documentation**
  - Publish index specs (mappings, chunking strategy, example docs) and query recipes in `apps/oak-open-curriculum-semantic-search/docs/`.
- **Exit Criteria**
  - Planning/transcript/resource indices populated with validated documents and passing ingestion regression tests.
  - Feature-flagged UI sections expose extended content cards without performance regressions.
  - Observability captures ingestion cost/latency metrics and alerts on anomalies.

### Phase 3 – Ontology & Observability Showcase

Objective: surface ontology metadata end-to-end, power advanced suggestions, and deliver observability artefacts that highlight system capabilities.

- **Indices**
  - `oak_ontology_static`: curated ontology metadata (entities, relationships, schema refs) for fast lookup by search responses and MCP tooling.
- **Features**
  - Search results embed `_nodeId`, `_nodeType`, `_schemaRefs`, `_ontologyRefs`, `_provenance` for each hit.
  - Suggestion/type-ahead endpoints span all indices, leveraging completion contexts and facet rollups.
  - Zero-hit webhooks emit ontology-rich payloads; dashboards display zero-hit trends by ontology node.
  - Admin UI presents ontology drill-downs, zero-hit dashboards, and observability widgets sourced from telemetry endpoints.
- **Tooling & Documentation**
  - Provide MCP resources (`mcp://oak/ontology/v1.json`, JSON-LD/Mermaid exports) and update docs with observability walkthroughs.
- **Exit Criteria**
  - Ontology metadata appears in search responses and MCP resources validated by contract tests.
  - Suggestion endpoints leverage ontology indices with proven zero-hit recovery flows.
  - Admin observability UI surfaces dashboards meeting Success Metrics thresholds.

## Implementation Guidance (all phases)

- **Mappings & Pipelines**: define index templates with `semantic_text` fields, lexical analysers, completion contexts, and provenance keywords; reuse the Elasticsearch TypeScript SDK for all ingestion and inference calls.
- **Chunking Strategy**: keep chunk length/overlap consistent for transcripts and planning text so embeddings remain high-quality and RRF weighting stable.
- **Provenance & Ontology Metadata**: enforce ontology-driven identifiers (`Lesson:slug`, etc.) and include MCP metadata placeholders (`ontology.nodesReturned`, `schemaRefs`, `provenanceRequired`) in both stored docs and API responses.
- **Testing & Observability**: add ingestion unit/integration tests, monitor inference latency and shard usage, and maintain zero-hit diagnostics.
- **Versioning**: tie index rollouts to `SEARCH_INDEX_VERSION`, documenting alias swap procedures and rollback steps.

### Typography Enhancements (themes backlog)

| Element                  | Typeface                                             | Weight                     | Size (Desktop) | Size (Mobile) | Line Height |
| ------------------------ | ---------------------------------------------------- | -------------------------- | -------------- | ------------- | ----------- |
| H1 (Hero headline)       | Lexend                                               | Bold                       | 48–56 px       | 32–36 px      | 1.1–1.2     |
| H2 (Section heading)     | Lexend                                               | SemiBold                   | 32 px          | 24 px         | 1.25        |
| H3 (Subheading)          | Lexend                                               | Medium                     | 24 px          | 20 px         | 1.3         |
| Body / Paragraph         | Lexend                                               | Regular                    | 18 px          | 16 px         | 1.5–1.6     |
| Small / UI / Captions    | Lexend                                               | Regular                    | 14–16 px       | 14 px         | 1.4         |
| Hero strapline / tagline | Secondary display face (e.g. Work Sans, Public Sans) | Regular / Medium           | 20–22 px       | 18 px         | 1.4–1.5     |
| Pull quotes / highlights | Secondary display face                               | Bold Italic (if available) | 22–24 px       | 18–20 px      | 1.4         |

Notes:

- Lexend remains the backbone for headings, body copy, and UI elements to preserve brand readability.
- Secondary display faces are reserved for straplines, pull quotes, and highlights to add personality without diluting recognition.
- Weight and size scaling should reinforce hierarchy (dominant H1, structured H2, readable body text).
- Line heights stay tight on large headers (≈1.1–1.2) and generous for copy (≈1.5–1.6) to optimise legibility.

## Workstreams (Phase 1 focus)

1. **Elasticsearch configuration** – Align setup scripts and templates with the four-index topology, completion contexts, highlight offsets, and synonyms. Add automated checks where feasible.
2. **Environment validation & SDK adapters** – Enforce credential variants (`OAK_API_KEY`, bearer token), index version tagging, logging controls, and AI provider safety. Ensure SDK adapters surface canonical URLs, lesson-planning data, sequences, and provenance with unit coverage.
3. **Ingestion & rollup pipeline** – Provide resilient bulk indexing (batched retries, alias swaps) for lessons, units, sequences, and sequence facets. Rollup rebuild must emit enriched snippets and trigger cache invalidation.
4. **Query execution** – Maintain server-side RRF builders for lessons/units/sequences, facet handling, pagination, and consistent formatting across structured/NL endpoints.
5. **Suggestions & telemetry** – Operate `/api/search/suggest`, zero-hit logging/webhook flows, status endpoints, and ingestion progress logs with actionable observability.
6. **OpenAPI, MCP & regression** – Keep OpenAPI/MCP artefacts in sync, remove legacy fusion helpers, and expand regression tests spanning env validation, ingestion transforms, query builders, and suggestions.
7. **UI & accessibility** – Migrate forms/results/admin panes to Oak Components, enforce token-driven styling, and extend unit/a11y tests across search, suggestions, and status dashboards.

### UI principles

- Use Oak Components and `theme.app` tokens for all interactive elements; avoid bespoke hex colours or inline styles.
- Ensure suggestion lists, facet controls, and admin triggers are fully keyboard-accessible and follow WAI-ARIA design patterns.
- Render highlights without `dangerouslySetInnerHTML`; continue using sanitised React fragments.
- Surface cache/index-version context alongside search results to explain stale data scenarios.
- Keep admin dashboards lightweight, relying on back-end telemetry while presenting actionable summaries and failure states.

## Acceptance Criteria

- Four Elasticsearch indices (`oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`) plus `oak_sequence_facets` exist with mappings/settings matching the definitive guide, including completion contexts and highlight offsets.
- Environment validation enforces required credentials, index versioning, logging/telemetry settings, and AI provider safety checks, with unit coverage and clear failure messaging.
- Ingestion pipelines produce enriched, canonical documents with resilient batching/backoff, logging, and alias swap procedures, and rollup rebuild emits lesson-planning snippets.
- `/api/search`, `/api/search/nl`, and `/api/search/suggest` execute server-side pathways with deterministic responses, totals, facets, suggestions, and pagination metadata.
- Zero-hit events log scope, filters, index version, and optional webhook payloads; observability endpoints expose ingestion/search health.
- OpenAPI, MCP tooling, and docs reflect the richer contract; TypeDoc/OpenAPI generation runs cleanly.
- Regression tests cover env validation, ingestion transforms, RRF builders, suggestion logic, and observability helpers; obsolete client-side fusion code is removed.
- Search UI (search/admin) presents scopes, facets, and suggestions via Oak Components with tokenised styling, accessible navigation, and accompanying unit/a11y coverage.

## Deployment & Operations

1. **Provision Elasticsearch Serverless** – Create a dedicated project/endpoint, generate API keys with write/search permissions, and record `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` secrets.
2. **Configure environment variables** – Set `OAK_API_KEY` (or `OAK_API_BEARER`), `SEARCH_API_KEY`, `SEARCH_INDEX_VERSION`, `ZERO_HIT_WEBHOOK_URL` (or `none`), `LOG_LEVEL`, and `AI_PROVIDER`. Validate locally via `pnpm type-check` to ensure `env.ts` passes.
3. **Bootstrap indices** – Run `pnpm -C apps/oak-open-curriculum-semantic-search scripts/elastic-setup` (or trigger the admin “Set up indices” action) to create mappings, synonyms, and the `oak_sequence_facets` store.
4. **Initial ingestion & rollup** – Execute `/api/admin/index-oak` followed by `/api/admin/rebuild-rollup` (through CLI or admin UI). Confirm logs report document counts, alias swaps, and durations.
5. **Admin home expectations** – `/admin` must expose ingestion triggers, last-run summaries, zero-hit metrics, index version, and links to documentation. All operations should require `SEARCH_API_KEY` and provide optimistic UI with failure messaging.
6. **Ongoing updates** – Schedule nightly/weekly ingestion via platform cron (e.g. Vercel Cron) calling the admin endpoints. Monitor zero-hit webhook deliveries and search latency dashboards.
7. **Application deployment** – Deploy the Next.js app to Vercel (or chosen platform) with the above secrets, enable ISR/edge caching per caching plan, and ensure OpenAPI artefacts are rebuilt post-deploy.

## Outstanding Todo (GO cadence)

We continue to follow GO cadence (ACTION → REVIEW with grounding every third item). Styling references should be cross-checked against the catalogue at `.agent/plans/semantic-search/ui-styling-catalogue.md`, updating it as migrations land. Tasks below emphasise Phase 1 completion before Phase 2/3 preparation.

1. ACTION: Catalogue every instance of custom `styled-components`, inline styles, or raw HTML styling in the Next.js app to define the Oak migration scope. _(Completed 2025-09-24; see `.agent/plans/semantic-search/ui-styling-catalogue.md`.)_
2. REVIEW: Confirm the catalogue covers search results, facets, forms, header/nav, theme selector, admin/docs pages, and any tests relying on bespoke styling. _(Completed 2025-09-24.)_
3. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
4. ACTION: Refactor search results and facet panels to use Oak Components and theme tokens exclusively, removing bespoke styled wrappers. _(Completed 2025-09-24; see `SearchFacets.tsx` and `SearchResults.tsx`.)_
5. REVIEW: Verify the updated facets/results maintain layout, accessibility, and sequencing behaviour without custom styles. _(Completed 2025-09-24 via `pnpm -C apps/oak-open-curriculum-semantic-search test`.)_
6. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ACTION: Replace structured/natural search forms and shared field helpers with Oak form primitives (inputs, selects, labels, buttons) wired to theme tokens. _(Completed 2025-09-24 across `StructuredSearchClient`, `NaturalSearch`, and field helpers.)_
8. REVIEW: Ensure form validation, accessibility attributes, and loading states remain correct post-migration. _(Completed 2025-09-24 via unit/integration tests.)_
9. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
10. ACTION: Rebuild header, navigation, theme switcher, tab controls, and layout shells using Oak Components and responsive token utilities. _(Completed 2025-09-24 across `app/ui/client/HeaderStyles.tsx`, `SearchPageClient.tsx`, `SearchTabHeader.tsx`, and `ThemeSelect.tsx`.)_
11. REVIEW: Check header/tab/theme controls for responsive behaviour, focus states, and consistency with Oak design guidance. _(Completed 2025-09-24 via manual inspection; no bespoke styling remains and Oak tokens cover spacing/typography.)_
12. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 prior to continuing the UI migration.)_
13. QUALITY-GATE: Run `pnpm lint` after completing the above changes and resolve any violations. _(Completed 2025-09-24; lint passed from repo root.)_
14. REVIEW: Capture lint outcomes and remediation notes. _(Completed 2025-09-24; no lint errors surfaced, cached runs confirmed consistency.)_
15. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 alongside lint/test preparation.)_
16. QUALITY-GATE: Run `pnpm test` (unit/integration) to ensure coverage of new features. _(Completed 2025-09-24; `pnpm test` succeeded with cached SDK runs and fresh semantic-search suite.)_
17. REVIEW: Summarise test results and fixes applied. _(Completed 2025-09-24; no regressions detected, existing canonical URL warnings persist as expected.)_
18. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 while preparing the admin console migration.)_
19. ACTION: Migrate the admin console (`app/admin/page.tsx`) to Oak layout/button/typography components, eliminating `styled-components`. _(Completed 2025-09-24; see updated admin page implementation.)_
20. REVIEW: Confirm admin actions remain accessible, use Oak tokens for spacing/colour, and preserve streaming output semantics. _(Completed 2025-09-24 via component inspection and new `app/admin/page.integration.test.tsx` coverage.)_
21. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 before refreshing the API docs shell.)_
22. ACTION: Rebuild the API docs page (`app/api/docs/page.tsx`) with Oak Components and theme tokens, removing bespoke wrappers. _(Completed 2025-09-24; see new OakBox/OakHeading layout.)_
23. REVIEW: Validate the docs page layout, typography, and navigation remain functional without custom styling. _(Completed 2025-09-24 via manual inspection and `app/api/docs/page.integration.test.tsx` mocking Redoc.)_
24. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 prior to final quality gates.)_
25. QUALITY-GATE: Run `pnpm build` to confirm production readiness. _(Completed 2025-09-24; resolved Next.js type tightening before successful build.)_
26. REVIEW: Document build outcomes and follow-up actions. _(Completed 2025-09-24; build succeeded across workspaces, traced typed route fix in `HeaderStyles.tsx` and Oak spacing update.)_
27. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 before regenerating docs.)_
28. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` post-integration. _(Completed 2025-09-24; doc-gen succeeded after adjusting `vi.fn` generics.)_
29. REVIEW: Record doc-gen results and remaining documentation tasks. _(Completed 2025-09-24; HTML/JSON outputs refreshed, no outstanding doc gaps.)_
30. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 before drafting the Phase 1 self-review.)_
31. ACTION: Compile a final self-review covering completed milestones, residual risks, and recommended enhancements for future phases. _(Completed 2025-09-24; see `.agent/plans/semantic-search/phase-1-self-review.md`.)_
32. REVIEW: Share the summary to maintain continuity. _(Completed 2025-09-24 via plan/context updates referencing the self-review document.)_
33. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 ahead of Phase 1 exit validation.)_
34. ACTION: Validate Phase 1 exit criteria by reviewing telemetry dashboards, regression artefacts, and quality gate logs; capture evidence links. _(Completed 2025-09-24; see `.agent/plans/semantic-search/phase-1-exit-validation.md`.)_
35. REVIEW: Summarise validation findings, noting outstanding items before advancing to Phase 2. _(Completed 2025-09-24 within the exit validation checklist; outstanding work limited to observability dashboards.)_
36. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 concluding the current GO cadence cycle.)_
37. ACTION: Surface structured search totals, facet counts, and suggestion payloads in the hybrid search UI using the SDK-derived response types (results + metadata + suggestions). _(Completed 2025-09-24; UI now renders summary text, facet counts, and suggestion chips via controller updates.)_
38. REVIEW: Add/extend integration tests (e.g. `SearchPageClient`, `SearchResults`) to assert totals, facet badges, and suggestion chips render correctly for each scope. _(Completed 2025-09-24 via new unit/integration coverage across `SearchResults`, `SearchSuggestions`, `SearchFacets`, and `SearchPageClient`.)_
39. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24; post-step quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`, `pnpm check`) all passed.)_
40. ACTION: Wire suggestion and facet interactions so selecting a suggestion, facet, or scope change replays a structured search with the correct payload (including sequence follow-up support). _(Completed 2025-09-24; `useStructuredFollowUp` now dispatches follow-up searches for scope toggles, programme facets, and suggestions via new helper utilities.)_
41. REVIEW: Expand controller/facet interaction tests to prove follow-up searches fire with the expected body (suggestions, sequences, scope pivots). _(Completed 2025-09-24; coverage added in `SearchPageClient.integration.test.tsx` and `suggestion-search.unit.test.ts` validates suggestion, facet, and rescope payloads.)_
42. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24; re-read GO.md → AGENT.md → metacognition.md before starting telemetry UI work.)_
43. ACTION: Implement zero-hit telemetry surfacing (dashboard page + webhook consumer stub) that aggregates recent events, grouped by scope/index version, using Oak components. _(Completed 2025-09-24; added in-memory store + API routes and new Oak-styled admin dashboard in `apps/oak-open-curriculum-semantic-search/app/ui/admin/ZeroHitDashboard*.tsx`.)_
44. REVIEW: Cover the telemetry surface with unit/integration tests, including mocked webhook deliveries and dashboard grouping logic. _(Completed 2025-09-24; added `ZeroHitDashboard.unit.test.tsx`, extended `app/admin/page.integration.test.tsx`, and ensured qg suite validates the flows.)_
45. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling. _(Completed 2025-09-24 post-dashboard; ready to focus on `oak_sequence_facets` ingestion.)_
46. ACTION: Define the Elasticsearch Serverless sandbox ingestion harness (fixture dataset, CLI flag for `_sandbox` indices, verbose logging, dry-run support) ensuring all requests use `@elastic/elasticsearch`.
    _(Completed 2025-09-25; shipped fixture-backed ingestion harness (`src/lib/indexing/sandbox-harness.ts`), sandbox fixtures under `fixtures/sandbox/`, CLI entrypoint `scripts/sandbox/ingest.ts`, and index-targeting utilities with defaults wired into ingestion/search flows.)_
47. REVIEW: Validate the sandbox plan via unit tests that stub the ES client and by drafting the manual drill (spin up serverless endpoint, seed fixture, inspect counts). _(Completed 2025-09-25; added `sandbox-harness.unit.test.ts`, refreshed `docs/sandbox-ingestion-harness.md` with CLI + drill instructions, and confirmed fixtures satisfy SDK Zod schemas.)_
48. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
    _(Completed 2025-09-25; re-read GO.md → AGENT.md → metacognition.md ahead of sandbox refactor.)_
49. ACTION: Implement zero-hit telemetry persistence using an Elasticsearch Serverless index (`oak_zero_hit_events`) with retention controls, wired through the existing webhook handler.
50. REVIEW: Add coverage confirming dashboard queries read from the persisted index and document retention/alerting considerations.
51. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
52. ACTION: Optimise `oak_sequence_facets` ingestion and caching (batch sizing, cache invalidation hooks) informed by sandbox instrumentation; capture the operational runbook.
53. REVIEW: Add ingestion unit tests/integration drills that exercise facet cache rebuilds, measuring latency thresholds.
54. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
55. ACTION: Enrich the admin console with index health details (document counts, last-run timestamps, index version) and provide explicit controls for bootstrap/reset flows.
56. REVIEW: Write integration coverage ensuring the admin view reflects index health fields and command buttons trigger the correct routes.
57. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
58. ACTION: Update semantic-search documentation (README, admin runbooks, onboarding flow, API notes) to reflect the new UI, telemetry dashboards, sandbox drill, and ingestion requirements.
59. REVIEW: Perform doc self-review ensuring examples align with current UI/API contracts and the onboarding path is comprehensive.
60. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
61. QUALITY-GATE: Run `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`, and `pnpm qg` after completing the above deliverables.
62. REVIEW: Record quality gate outcomes and capture any remediation needed before phase hand-off.
63. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
