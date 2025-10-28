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
- ✅ `ThemeGlobalStyle` now injects deterministic light/dark foreground/background rules (see `app/lib/theme/bridge.integration.test.tsx`).
- ✅ Brand accents: CTA buttons, active links, and header borders now draw from `oakGreen` in light mode (with the global background lifted to `mint30`), and shared border/CTA tokens in dark mode keep the keystone colour visible while mint handles link contrast.
- ⚠️ Outstanding: layout wrappers (header, main panels, navigation) still lean on generic Oak tokens rather than the new `app.*` CSS variables, so spacing/contrast audits remain (particularly in navigation spacing and multi-column responsive breakpoints).
- ⏭️ Next: drive spacing, card surfaces, and responsive behaviour from the semantic theme—including deeper `oakGreen` accents—before resuming the remaining Phase 1 workstreams.

### Design Considerations

- Prefer Oak exports (`oakUiRoleTokens`, `oakColorTokens`, `oakSpaceBetweenTokens`, `oakFontTokens`, etc.) when composing local theme data.
- Where Oak lacks a concept we need, define a constant spec and derive both the type and a type guard from it; do not introduce ad-hoc interfaces.
- Every colour in the semantic themes must be explainable: either the Oak default value or a documented override with accessibility rationale.
- Space, radius, and typography values should reference Oak tokens and be converted to CSS values centrally (e.g. the Theme Bridge) to avoid drift; component layout must consume the emitted CSS variables for gap/padding rather than hard-coded values.
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
- Introduce a deterministic `ThemeGlobalStyle` sheet that applies `bg-primary`/`text-primary` to `html`, `body`, and the `#app-theme-root` wrapper; ensure the style tag mounts before component-level sheets in both SSR and CSR.
- Wire the App Router root layout to mount the global style wrapper exactly once (SSR + client) and expose an escape hatch for Playwright to probe the active mode.
- Backfill integration coverage asserting that mode toggles re-render the `html/body` rules and that the SSR markup captures the light-mode defaults.

4. **Align UI components**

- Sweep the semantic-search UI for custom elements that could be Oak components and replace them; update layout props to use the refreshed spacing/grid tokens.
- Catalogue each wrapper that still relies on magic numbers and convert to Oak tokens:
  - `SearchPageClient` shell (`$maxWidth`, `$pa`, `$gap`, `$background`, `$color`).
  - Header + nav wrappers (`HeaderStyles`, breadcrumbs, page hero) to consume Oak spacing + border tokens rather than literal CSS.
  - Form panels (`StructuredSearch`, `NaturalSearch`) and filter chips to align with `app.space` + `app.colors`.
  - Results list + cards (`SearchResults`, `SearchResultCard`) to adopt Oak elevations, emphasised backgrounds, and new muted text token.
- Review typography usage (headings, summary text, result metadata) and map each surface to the refreshed theme ramp, adding quotes/caption overrides where Oak tokens fall short.
- Confirm the dark theme meets contrast expectations using Oak Storybook guidance once global colours are applied.
- Remove any residual hex/rgba literals in the app; all styling must originate from Oak tokens or the semantic spec (e.g. `mint30` for the base background, `bg-btn-secondary` for cards), recording exceptions in the doc.

5. **Verification**
   - Expand unit tests: lock the semantic theme spec, CSS variable emission, and any helper guards; update snapshot assertions where values shift.
   - Extend `app/lib/theme/bridge.integration.test.tsx` with SSR markup snapshots and mode-toggle assertions that inspect the injected styles for both wrappers and document root.
   - Backstop component-level contracts (`SearchPageClient`, `SearchSuggestions`, `SearchFacets`, `SearchResults`) with expectations over key Oak props (backgrounds, borders, typography) so regressions surface close to source.
   - Run `pnpm qg`; add targeted Playwright MCP checks for hydration warnings and dark-mode visuals (including screenshot diff of hero section and result list backgrounds).
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

1. ACTION: Refresh this plan and the context snapshot with responsive layout goals, palette extensions, and navigation spacing alignment tasks.
2. REVIEW: Confirm plan/context updates reflect responsive layout + palette objectives without contradicting prior milestones.
3. ACTION: Add failing tests that lock header spacing, responsive search grids, and extended theme palette exports (including deeper `oakGreen` shades).
4. REVIEW: QUALITY-GATE: run `pnpm -C apps/oak-open-curriculum-semantic-search test SearchPageClient.integration.test.tsx HeaderStyles.integration.test.tsx` to observe failing assertions.
5. QUALITY-GATE: Capture baseline notes/snapshots from failing tests to guide implementation.
6. GROUNDING: read GO.md and follow all instructions. REMINDER: Use british spelling.
7. ACTION: Implement responsive layout + spacing changes driven by theme CSS variables, introduce additional brand palette shades, and remove hard-coded styles from header/search components.
8. REVIEW: Inspect updated components to ensure spacing/colour rules flow exclusively via Oak tokens or bridge variables; adjust any residual hard-coded values.
9. QUALITY-GATE: run `pnpm -C apps/oak-open-curriculum-semantic-search test SearchPageClient.integration.test.tsx HeaderStyles.integration.test.tsx theme-factory.unit.test.ts` to confirm green state.
10. QUALITY-GATE: Execute `pnpm format`, `pnpm lint`, `pnpm type-check`, and `pnpm build` at repo root once updates settle.

## Pending Phases (for awareness)

Detailed scopes for the next phases live in `.agent/plans/semantic-search/semantic-search-phase-2-3-plan.md`.

- **Search platform hardening** – ingestion resilience, zero-hit observability, sequence facet depth.
- **Content & ontology enrichment** – align lesson/sequence payloads with curriculum ontology requirements.
- **MCP & regression suites** – broaden automated coverage (browser, contract, smoke) as the UI solidifies.
