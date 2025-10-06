# Semantic Search UX Snagging Resolution Plan

## Visual Checks

Start the dev server with `pnpm dev > /tmp/semantic-dev.log 2>&1 &` so it runs in the background and the server logs are available for debugging at `/tmp/semantic-dev.log`. Then use the Playwright MCP server, which is already active, to examine the running app in the browser.

## Guiding Principles

- **Design for evolution**: build composable primitives under `app/ui/global`, `app/ui/search`, and `app/ui/ops` so surfaces can change without rewrites. Shared tokens, grids, and typography live in `app/ui/shared`.
- **Surface intent first**: every page leads with purpose, primary actions, and current state. Results appear above the fold; operations surfaces introduce health at a glance.
- **Responsive by default**: treat breakpoints and spacing tokens as first-class. Use the forthcoming `ResponsiveGrid`, `Cluster`, and `PageContainer` primitives instead of ad-hoc CSS.
- **Accessible interactions**: keep focus order logical, provide reduced-motion variants, and scope live regions to meaningful updates. Respect `prefers-reduced-motion` in hover and loading states.
- **Deterministic modes**: the fixture mode selector resides in the header; contextual notices summarise the active scenario without duplicating controls.
- **Test-driven delivery**: follow TDD. Prefer unit tests for pure utilities, integration tests for composed components/hooks, and Playwright for end-to-end visual and interaction checks. No complex mocks.

## Objectives

- Restore visual polish and information hierarchy across landing, search, admin, and status surfaces ahead of the Elasticsearch back-end work.
- Consolidate the UI architecture into the global/search/ops split with shared layout primitives, Fixture context, and documentation.
- Resolve blocking UX bugs (fixture placement, natural-language fixtures, navigation semantics) while uplifting accessibility, responsiveness, and motion handling.
- Capture deterministic evidence (tests, screenshots, logs) for each workstream in line with the testing strategy.

## Workstream 1 – UI Architecture & Organisation

**Status:** ✅ Complete. Directory reshaping, shared layout primitives, fixture context, and documentation are captured in `app/ui/README.md` and `docs/ARCHITECTURE.md`.

**Remaining actions:** None.

## Workstream 2 – Navigation & Header Polish

**Status:** ✅ Complete. Header grid, navigation metadata, and fixture toggle behaviour are recorded in `app/ui/README.md`, `docs/ARCHITECTURE.md`, and `snagging-system-foundations.md`; Playwright artefacts capture the validated journeys.

**Remaining actions:**

- Monitor Oak Components contrast improvements (tracked in `oak-components-theme-extensions.md`).
- Re-run header visual sweeps whenever downstream workstreams ship major UI changes.

## Workstream 3 – Landing Page Rework

**Status:** ✅ Complete. Landing hero, CTA treatment, and evidence are documented in `snagging.md` (2025-10-18) and supported by `tests/visual/landing.hero.spec.ts`.

**Remaining actions:** None – subsequent monitoring rolls into the cross-cutting evidence sweep.

## Workstream 4 – Search Surfaces (Structured & Natural)

**Status:** 🔄 In progress. Layout, highlight clamping, responsive evidence, and skeleton tone/motion polish are complete (see `docs/ARCHITECTURE.md#search-secondary-accordion`, `snagging.md` entries dated 2025-10-22, and `SearchSkeletons.integration.test.tsx`). Shared result parsing now consumes the SDK-generated `Search*ResponseSchema` artefacts (`SearchResults.schemas.ts` split 2025-10-06) so no ad-hoc Zod remains in the UI layer.

**Remaining actions:**

- Capture refreshed Playwright evidence (responsive + reduced-motion) once the shared branch lands; extend RTL assertions against the new skeleton states.
- Instrument mobile support accordion toggles once the shared analytics client lands; capture panel id + open/closed state for funnel analysis.

## Workstream 5 – Natural Language Fixtures Reliability

**Status:** 🔜 Pending.

1. **Route guard ordering** ✅ (2025-10-06): `/api/search/nl` now resolves fixture mode before `llmEnabled()` with integration coverage for live-disabled fixture paths.
2. **Error messaging** ✅ (2025-10-06): `parseResponse` now prefers server messages and maps known error codes to user-friendly copy, with targeted unit coverage.
3. **Testing**: extend integration coverage for fixture modes (fixtures, empty, error, live) asserting response schema and banner copy.
   - ✅ `app/api/search/nl/route.integration.test.ts` now asserts the fixture error message (`503`) in addition to the error code (2025-10-06).
   - 🔄 Legolas (2025-10-06 10:53 BST): Vitest currently fails before assertions because `tsup` skips `types/generated/query-parser/index.ts`; when the semantic-search app imports the SDK barrel the runtime resolver cannot find `dist/types/generated/query-parser/index.js`. Fix: include the generated parser entry in `tsup.config.ts`, rebuild the SDK, and re-run the targeted Vitest suite to confirm the parser module is published.
   - ⏭ Add UI-level coverage ensuring the natural search error banner renders the descriptive copy delivered by the server.
   - 🔄 Legolas (2025-10-06 10:53 BST): Vitest is still faking the SDK with a CommonJS-style `require` shim, which triggers the ESLint `import/newline-after-import` + `no-restricted-syntax` combo for CJS mocks. Plan: replace the legacy shim with an ESM-aware `vi.mock` that exports typed schema stubs (`SearchStructuredRequestSchema`, `SearchNaturalLanguageRequestSchema`) matching the generated contracts. This keeps helper behaviour under test while satisfying lint and avoiding accidental drift from the SDK surface.

4. **Visual review**: inspect natural-language flows via Playwright MCP, validating fixture messaging/alerts across modes and documenting artefacts in `snagging.md`.

## Workstream 6 – Admin Page Redesign

**Status:** 🔜 Pending.

1. **Information architecture**: apply `OperationsBlueprint` with sections (`Overview`, `Quick Actions`, `Jobs`, `Telemetry`) based on the new layout primitives.
2. **Action panels**: convert job controls into cards with descriptive copy, status chips, and collapsible log output (auto-scroll with sticky headers).
3. **Telemetry separation**: host zero-hit telemetry in its own section with summary chips at the top; integrate fixture notice pill.
4. **Responsive grid**: align with search tokens for consistent wrapping and optional sticky quick links.
5. **Testing**: add integration tests for job card state transitions (using simple stream fakes) and Playwright coverage for the redesigned admin flow, including dark mode.
6. **Visual review**: capture desktop/mobile, light/dark admin screenshots via Playwright MCP and log qualitative checks in `snagging.md`.

## Workstream 7 – Status Page Redesign

**Status:** 🔜 Pending.

1. **Status summary**: introduce `StatusSummaryCard` with severity icon, timestamp, and tone legend above the grid.
2. **Service cards**: standardise height, add optional links, and utilise accent colours consistent with tone tokens.
3. **Alert treatment**: refresh fatal alert styling with stronger contrast, actionable next steps, and optional dismissal when not critical.
4. **Diagnostics enhancements**: list health endpoints, docs, and last deploy metadata using shared `OpsCard` primitives.
5. **Testing**: update integration tests for `status-helpers` to match new copy, add RTL checks for summary card announcements, and refresh Playwright snapshots.
6. **Visual review**: run status page sweeps with Playwright MCP (all modes/breakpoints), saving screenshots and qualitative notes in `snagging.md`.

## Workstream 8 – Cross-cutting Validation & Evidence

**Status:** 🔁 Ongoing across remaining workstreams.

1. **TDD workflow**: run unit/integration tests (`pnpm test --filter "ui"` segment) after each workstream; document failures and fixes in commit messages.
2. **Playwright evidence**: re-baseline journeys (landing, structured, natural, admin, status) in light/dark and mobile/desktop profiles, including reduced-motion mode.
3. **Accessibility audit**: execute axe + manual keyboard sweeps per surface and log findings in `snagging.md` with remediation notes.
4. **Documentation updates**: refresh `semantic-search-responsive-layout-architecture.md`, `semantic-search-phase-1-ux-plan.md`, and relevant READMEs after each workstream.
5. **Release readiness**: maintain a checklist of UX acceptance criteria, test artefacts, and screenshots to support later Elasticsearch integration.
6. **Ad-hoc type & schema audit (Aragorn 2025-10-06)** – Aragorn owns the ongoing sweep to eliminate runtime-defined schemas across the app, partnering with Legolas for verification:
   - ✅ `app/ui/search/components/SearchResults.*`: Local Zod removed; new split (`SearchResults.schemas.ts`) consumes SDK-generated `Search*ResponseSchema.shape.results` with dedicated stylistic and extractor modules (2025-10-06).
   - ✅ `app/ui/search/hooks/useSearchController.ts`: Controller state now stores typed SDK result items/multi-bucket arrays instead of `unknown[]`, parsing loose arrays through schema helpers to retain type safety (2025-10-06).
   - ✅ `src/lib/query-parser.ts`: Natural-language parsing now feeds the SDK’s dedicated `QueryParserRequest/Response` schemas (generated module + exported intent enum) into the LLM bridge, sanitising responses before canonical validation and removing all ad-hoc Zod definitions (2025-10-06). Coordination: Aragorn maintains the SDK generation surface; Legolas owns downstream NL fixture/banner tests.
   - ⏭ `src/lib/env.ts`: `BaseEnvSchema` governs runtime flags; confirm overlap with shared env tooling before duplication.
     - 2025-10-06 – Eowyn: Added `@oaknational/mcp-env` as a dependency and rewrote `env.unit.test.ts` to expect an adaptive provider + repo-root fallback seam (tests currently failing pending implementation wiring and lockfile refresh).
   - ⏭ `app/api/sdk/search-*.ts`: `BodySchema` definitions duplicate request payloads; swap to SDK request schemas.
   - ⏭ `app/api/search/nl/route.integration.test.ts` & related tests: ad-hoc `z.object` assertions; prefer shared fixtures or SDK schemas for contract verification.
   - ⏭ `app/lib/search-fixtures/builders/*`: Interfaces such as `DatasetRecord`, `BuildSingleScopeFixtureOptions`, and handcrafted response merges; evaluate generating these from SDK fixture helpers.
   - ⏭ `src/lib/indexing/*`: Operational interfaces (`SandboxHarnessOptions`, `SequenceFacetProcessingMetrics`, etc.) ensure ingestion bookkeeping; document which are domain-specific versus candidates for SDK extraction.
   - 🔄 Legolas (2025-10-06 10:53 BST): Current blockers:
     - `packages/sdks/oak-curriculum-sdk/src/index.ts` brushes against the 250 line ceiling and still trips `no-restricted-syntax` because we re-export the search response guards via `export *`. Solution: carve out a focused `src/search/index.ts` barrel that publishes the documented search surface (schemas, helpers, guards) with explicit named exports, then trim the root index back to a thin façade.
     - `tsup` omits `types/generated/query-parser/index.ts` from the dist bundle, so runtime imports resolve to nowhere. Fix by including both the generated query-parser file and the new search barrel in `tsup.config.ts`, then re-running `pnpm type-gen && pnpm --filter @oaknational/oak-curriculum-sdk build` to repopulate `dist/types/generated/query-parser/index.js`.
     - Once the new barrel exists, point downstream consumers (`apps/oak-open-curriculum-semantic-search/src/types/oak.ts`, query parser helpers, etc.) at it to reduce churn in the root barrel and make future `type-gen` updates more predictable.
   - 🔄 Aragorn (2025-10-06 11:24 BST): Re-aligned the SDK to `zod@3.25.76` (matching `openapi-zod-client`) and re-ran the quality gate. Type-check now fails where semantic-search fixtures/routes still emit ad-hoc strings (`subjectSlug`, `keyStage`, scope literals, admin fixture contexts). Next actions: upgrade fixture builders and route helpers to consume the SDK enums and schema outputs directly, then prune any lingering `unknown` branches before rerunning the gate (tracked on TODO t5/t8).
   - ✅ Aragorn (2025-10-06 11:43 BST): Fixed `@oaknational/mcp-env` ESM exports to include `.js` suffices, rebuilt the library, and re-ran `pnpm qg` (green). Downstream `oak-curriculum-mcp-stdio` E2E suite now boots with the adaptive provider seam, confirming the env boundary is stable across packages.
   - ✅ Aragorn (2025-10-06 11:56 BST): Full `pnpm check` (type-gen → build → lint → tests → e2e → smoke) succeeds post-seam fix, reaffirming that the monorepo is green end-to-end ahead of the remaining schema sweep.

## Process & Tracking

- Execute workstreams sequentially where dependencies exist (architecture → header → search → ops).
- Record progress and evidence in `snagging.md`, linking to screenshots and logs.
- Keep change sets focussed (one workstream per PR) to support rapid review and maintain creative flow.
- Before handing off to back-end integration, review this plan against completed evidence to confirm readiness.
