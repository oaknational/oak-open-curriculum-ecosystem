# Semantic Search Target Alignment Plan

## Programme Goals

- Deliver the hybrid semantic search experience via Next.js App Router, backed by the SDK and Elasticsearch Serverless.
- Keep all runtime behaviour compatible with Vercel constraints (Node 18/20, streaming, invocation timeouts).
- Lean on generated types from the SDK so schema changes flow through `pnpm type-gen` without manual patches.

## Current Focus – Phase 1: Semantic Theme Alignment

### Objectives

- Produce first-class light and dark themes that reuse Oak Components tokens, palettes, and layout conventions.
- Eliminate bespoke styling in favour of Oak primitives so the UI reads consistently across modes.
- Guarantee type-safety by deriving app-specific tokens from constant specs that satisfy Oak types.

### Status Snapshot (2025-09-26)

- ✅ Oak token inventory captured in `.agent/plans/semantic-search/semantic-theme-inventory.md`.
- ✅ `semanticThemeSpec` plus typed resolvers implemented; unit coverage added in `theme-factory.unit.test.ts`.
- ⚠️ Outstanding: global foreground/background still default to browser values; layout wrappers (header, main panels, labels) rely on inherited black text and white backgrounds.
- ⏭️ Next: wire Oak tokens into the global CSS bridge and component wrappers so both light/dark modes consume `uiColors` entirely, then resume Phase 1 workstreams.

### Design Considerations

- Prefer Oak exports (`oakUiRoleTokens`, `oakColorTokens`, `oakSpaceBetweenTokens`, `oakFontTokens`, etc.) when composing local theme data.
- Where Oak lacks a concept we need, define a constant spec and derive both the type and a type guard from it; do not introduce ad-hoc interfaces.
- Every colour in the semantic themes must be explainable: either the Oak default value or a documented override with accessibility rationale.
- Space, radius, and typography values should reference Oak tokens and be converted to CSS values centrally (e.g. the Theme Bridge) to avoid drift.
- Theme switching must stay SSR-safe; any DOM-prefetch scripts must reference shared helpers so they cannot fall out of sync with runtime logic.

### Task Breakdown

1. **Audit Oak theming surface**
   - Catalogue the relevant Oak tokens (role colours, spacing, radius, font families, typography ramps) and capture Storybook references for navigation later. _(Completed 2025-09-26; see `.agent/plans/semantic-search/semantic-theme-inventory.md`.)_
   - Summarise the gaps in Oak coverage that our semantic themes must fill so we know where custom properties are unavoidable.
2. **Author the semantic theme spec**
   - Define a constant `semanticThemeSpec` (light/dark) that spreads `oakDefaultTheme.uiColors` and explicitly sets every `OakUiRoleToken`, documenting which entries remain Oak defaults.
   - Describe app-level tokens (spacing scales, radii, typography, layout) using Oak token names; expose helper lookups that resolve to CSS values for the Theme Bridge.
   - Provide derived TypeScript types (and, where helpful, runtime guards) from the constant specs so tests can assert contract changes.
   - Design captured in `.agent/plans/semantic-search/semantic-theme-spec.md`; keep the document in sync as implementation details firm up.
3. **Update theme factories and bridge**
   - Refactor `createLightTheme` / `createDarkTheme` to read from the spec, returning immutable theme objects.

- Adjust `ThemeBridgeProvider` and `ThemeCssVars` to emit CSS variables from the helper lookups rather than hard-coded strings. _(Completed.)_
- Thread references back to the hydration script / theme context so all sources of truth interoperate. _(Completed.)_
- Introduce a global style layer (or Oak wrapper) that applies `bg-primary`/`text-primary` to `html`, `body`, and the root layout so browser defaults no longer leak through in either mode.
- Ensure the page-level layout (`SearchPageClient`, header, form panels) uses Oak `$background`, `$color`, and border tokens instead of inheriting or hard-coding values.

4. **Align UI components**

- Sweep the semantic-search UI for custom elements that could be Oak components and replace them; update layout props to use the refreshed spacing/grid tokens.
- Review typography usage (headings, summary text, result metadata) and map each surface to the refreshed theme ramp.
- Confirm the dark theme meets contrast expectations using Oak Storybook guidance once global colours are applied.
- Remove any residual hex/rgba literals in the app; all styling must originate from Oak tokens or the semantic spec.

5. **Verification**
   - Expand unit tests: lock the semantic theme spec, CSS variable emission, and any helper guards; update snapshot assertions where values shift.
   - Run `pnpm qg`; add targeted Playwright MCP checks for hydration warnings and dark-mode visuals.
6. **Documentation and follow-up**
   - Note deviations or desired upstream enhancements for `@oaknational/oak-components`.
   - Update ADR-045 / UI snagging plan if mitigation strategy changes.
   - Record outstanding follow-ups (e.g. long-term CSS variable bridge) for the next phase.
   - Maintain `apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md` with integration guidance for downstream apps.

### Remaining Phase 1 Scope – Demonstration Baseline

Objective: showcase a complete hybrid search experience with first-class filtering, ingestion, and observability so the service works end to end.

- **Indices**
  - Continue using `oak_lessons`, `oak_units`, `oak_unit_rollup`, and `oak_sequences` as the core search indices.
  - Introduce and maintain `oak_sequence_facets` to store condensed hierarchy metadata (subject → sequence → unit → year/key stage counts) plus suggestion seeds so facets stay responsive without overloading the primary indices.
- **Features**
  - Structured/NL endpoints expose filters for subject, key stage, year, programme (sequence), and unit, returning facet buckets sourced from `oak_sequence_facets`.
  - Responses include totals, pagination metadata, and optional aggregation blocks that the UI renders alongside results.
  - Zero-hit logging captures scope, filters, and `SEARCH_INDEX_VERSION`, feeding the admin dashboard and telemetry pipelines.
  - Admin page presents ingestion/rollup triggers, index version, and latest zero-hit metrics drawn from status endpoints.
- **Ingestion**
  - Operate a shared ingestion harness (backfill + nightly) that draws solely on SDK data and materialises `oak_sequence_facets` efficiently with retries, alias swaps, and logging.
  - Document operational runbooks and backoff strategies so the pipeline stays supportable.
- **Exit Criteria**
  - UI reflects lessons/units/sequences with live facets, totals, and suggestion metadata across all supported scopes.
  - Suggestion dropdown delivers completion data with cache/version context and telemetry logging verified.
  - Zero-hit dashboard or interim report highlights scope/filter trends using structured logs.
  - Quality gates (format → type-check → lint → test → build → doc-gen) pass with updated artefacts.

## Phase 1 Workstreams (beyond UI)

1. **Elasticsearch configuration** – Align setup scripts/templates with the four-index topology, completion contexts, highlight offsets, and synonyms; add automated checks where feasible.
2. **Environment validation & SDK adapters** – Enforce credential variants (`OAK_API_KEY`, bearer token), index version tagging, logging controls, and AI provider safety. Ensure SDK adapters surface canonical URLs, lesson-planning data, sequences, and provenance with unit coverage.
3. **Ingestion & rollup pipeline** – Provide resilient bulk indexing (batched retries, alias swaps) for lessons, units, sequences, and sequence facets. Rollup rebuild must emit enriched snippets and trigger cache invalidation.
4. **Query execution** – Maintain server-side RRF builders for lessons/units/sequences, facet handling, pagination, and consistent formatting across structured/NL endpoints.
5. **Suggestions & telemetry** – Operate `/api/search/suggest`, zero-hit logging/webhook flows, status endpoints, and ingestion progress logs with actionable observability.
6. **OpenAPI, MCP & regression** – Keep OpenAPI/MCP artefacts in sync, remove legacy fusion helpers, and expand regression tests spanning env validation, ingestion transforms, query builders, and suggestions.
7. **Operations & admin** – Ensure `/admin` exposes ingestion triggers, zero-hit summaries, and index metadata with Oak Components and optimistic UI flows backed by quality gates.

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

### Outstanding Todo (GO cadence)

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
40. ACTION: Wire suggestion and facet interactions so selecting a suggestion, facet, or scope change replays a structured search with the correct payload (including sequence follow-up support). _(Completed 2025-09-24; `useStructuredFollowUp` now dispatches structured queries with preserved filters.)_

## Pending Phases (for awareness)

Detailed scopes for the next phases live in `.agent/plans/semantic-search/semantic-search-phase-2-3-plan.md`.

- **Search platform hardening** – ingestion resilience, zero-hit observability, sequence facet depth.
- **Content & ontology enrichment** – align lesson/sequence payloads with curriculum ontology requirements.
- **MCP & regression suites** – broaden automated coverage (browser, contract, smoke) as the UI solidifies.
