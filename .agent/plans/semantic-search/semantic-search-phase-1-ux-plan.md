# Semantic Search Phase 1 – UX Plan

## Vision

- Present semantic search with a confident first impression: `/` acts as a landing page that introduces the hybrid search proposition, and links out to the specific search experiences.
- There is no `/search` route; `/search` redirects to `/` which has prominent CTA cards leading to the relevant search experiences.
- Deliver dedicated `/structured_search` and `/natural_language_search` workspaces with accessible, high-quality UX that feels cohesive with Oak’s design system across light and dark themes.
- Showcase the full natural-language pipeline: users supply free-text prompts only, the server derives structured query parameters, and the client presents both the results and the derived structured query in a read-only card alongside the original request.
- Keep deterministic fixtures, accessibility, and automated evidence at the heart of delivery so designers, engineers, and tests share a single source of truth.
- Extend the same rigour to supporting surfaces (admin telemetry and status) so Phase 1 closes with a demonstrably complete UX slice.
- Establish a layered layout hierarchy leveraging Next.js nested layouts: the root shell shared by all routes, a search layout for landing + search experiences, and an operations layout for admin + status with purpose-built grids and spacing tokens.

## Current Status Highlights

- Semantic theme tokens, layout wrappers, and fixture toggles are stable; search regression ("Maximum update depth exceeded") is resolved with regression tests guarding the flow.
- Deterministic fixtures (search + admin streams) are powered by the SDK pipeline, and Playwright/RTL suites already exercise success/empty/error scenarios.
- Admin telemetry/history UX, status-page tone handling, and a formal cross-surface UX review remain open.

## End-State Definition

- `/` (app root) = focused landing page with an introductory hero, supporting copy, and two prominent CTA cards leading to the relevant search experiences (with `/search` reduced to a redirect).
- `/structured_search` and `/natural_language_search` = fully dedicated experiences with consistent hero treatment, navigation, skip links, accessible messaging, deterministic fixtures, and polished empty/error states; `/natural_language_search` sends prompts to the server for LLM-backed derivation, renders the returned structured parameters in a read-only summary, and never exposes manual filter inputs.
- Top-level navigation includes Search, Structured search, Natural language search, Admin, Status, and Docs, with consistent styling and focus handling.
- Nested layouts share foundational tokens: landing/structured/natural inherit the search layout, while admin/status inherit an operations layout so both surfaces gain consistent spacing, typography, and responsive grids.
- Admin console exposes telemetry history/feedback backed by SDK fixtures; status page communicates tone/failure states with comprehensive test coverage.
- All surfaces pass accessibility checks (keyboard, aria-live, skip links, contrast) and are evidenced through automated artefacts plus plan updates.

## Execution Plan (GO cadence)

1. REMINDER: use British spelling.
2. **ACTION:** Rebuild the app root (`/`) as the landing page (hero messaging, CTA cards, supporting copy) removing embedded forms and configure `/search` to redirect here.  
   **REVIEW:** RTL + manual light/dark sweep at `bp-xs`/`bp-md` to confirm layout, focus order, and hero readability.
3. **ACTION:** Rebuild `/structured_search` with condensed hero, dedicated skip links, and ensure structured form/results live solely here; update navigation entry.  
   **REVIEW:** Run `SearchPageClient.integration` variant + Playwright fixture success scenario to validate focus and above-the-fold behaviour.
4. **ACTION:** Rebuild `/natural_language_search` with a prompt-only form that posts to the server for LLM-backed derivation, then render the returned structured query (and original request) in a clearly read-only summary card; keep hero styling consistent.  
   **REVIEW:** Execute RTL coverage for the natural route, confirm the summary is non-editable, and perform manual keyboard/screen-reader audit of prompt → results → summary focus order.
5. **ACTION:** Update shared layout/styles to support landing/structured/natural variants while preserving semantic tokens across light/dark themes, introducing any required contrast tokens for CTA cards.  
   **REVIEW:** Run `pnpm -C apps/oak-open-curriculum-semantic-search test app/ui/client/SearchPageClient.integration.test.tsx --run` to confirm variant handling remains green and capture light/dark screenshots to evidence the new tokens.
6. **GROUNDING:** read GO.md and follow all instructions.
7. **ACTION:** Finalise navigation and CTA linking across search/admin/status, ensuring ARIA labelling and focus outlines.  
   **REVIEW:** Manual nav tour plus quick axe pass to confirm accessibility.
8. **ACTION:** Implement the server-driven natural-language workflow end-to-end: drop manual filter inputs, ensure the client awaits derived parameters, and display the structured summary using read-only Oak components.  
   **REVIEW:** Run new unit/integration suites (`NaturalSearch.*`, `useSearchController.*`) plus the Playwright natural fixture scenario to prove the prompt→derivation→results loop.
9. **ACTION:** Harden structured-search error/empty states (503 banner, aria-live, empty guidance) and add regression coverage.  
   **REVIEW:** Run RTL error/empty tests and Playwright `fixtures-error` capture with screenshots.
10. **ACTION:** Auto-submit fixture queries in capture script and regenerate search/admin artefacts at xs/md/lg/xxl.  
    **REVIEW:** Inspect artefacts + axe reports; update plan with observations.
11. **ACTION:** Introduce an operations layout for `/admin` and `/status` (shared typography, grids, spacing) and, within that shell, refine fixture status banner tone/copy and pressed states.  
    **REVIEW:** Keyboard-only audit plus RTL assertions for focus/pressed feedback across the new layout, and Playwright captures of admin/status in light/dark modes.
12. **GROUNDING:** read GO.md and follow all instructions.
13. **ACTION:** Conduct structured/natural design review (hero copy, CTA wording, skip links) and document outcomes + token follow-ups.  
    **REVIEW:** Record decisions in this plan and adjust upcoming actions if needed.
14. **ACTION:** Refresh UX documentation/screenshots to reflect landing page, dedicated routes, idle instructions, and fixture guidance; link regenerated artefacts.  
    **REVIEW:** Run `pnpm markdownlint:root` and `pnpm format:root` to keep docs linted; spot-check links.
15. **ACTION:** Admin telemetry/history – draft failing unit/integration/RTL/Playwright specs covering operator feedback and deterministic fixtures.  
    **REVIEW:** Align test scope with stakeholders and confirm completeness before implementation.
16. **ACTION:** Implement admin telemetry/history features using SDK fixtures; ensure deterministic data for UI + Playwright.  
    **REVIEW:** Run admin RTL + Playwright responsive suite; confirm accessibility and observability copy.
17. **ACTION:** Status page hardening – add tone/failure handling with tests-first approach; implement once plan is approved.  
    **REVIEW:** Execute status unit/integration tests and Playwright run to validate layout/tone changes.
18. **GROUNDING:** read GO.md and follow all instructions.
19. **QUALITY-GATE:** Run `pnpm qg`, capturing full evidence for search/admin/status once major UX updates land.
20. **ACTION:** Perform final UX review across landing, structured, natural, admin, and status surfaces with fixtures enabled; capture accessibility notes.  
    **REVIEW:** Log sign-off in this plan, flagging any post-Phase 1 polish items separately.
21. **QUALITY-GATE:** Run `pnpm qg` again and archive artefacts to demonstrate Phase 1 UX completion.

## Recent Progress

- 2025-10-03 – Action 4/8: Extracted the derived-summary UI into `NaturalSearchSummary`, applying SDK `SearchStructuredRequestSchema` parsing and official `isSubject`/`isKeyStage` guards so the natural flow now aligns with the cardinal rule; consolidated skip-link styling and prompt handling within smaller hooks to keep the component under lint thresholds.
- 2025-10-03 – Action 13: Completed a design sweep of landing, structured, and natural experiences; confirmed hero copy and CTA wording match the Phase 1 proposition, skip links remain descriptive, and the new operations layout preserves spacing/focus. Logged a follow-up to retire the "Hybrid Search Alpha" badge once Product approves the wording change.
- 2025-10-03 – Action 11: Introduced the shared `OperationsLayout` for `/admin` and `/status`, migrated both surfaces to the new shell, and refreshed fixture banners with themed backgrounds; verified via RTL and Playwright (`tests/visual/fixture-toggle.spec.ts`, `tests/visual/responsive-baseline.spec.ts`) capturing updated artefacts.
- 2025-10-03 – Action 10: Updated Playwright capture suites to auto-submit structured queries, regenerated admin/search artefacts across breakpoints, and confirmed axe reports stay green after the automation tweak.
- 2025-10-03 – Action 9: Centralised structured-search empty/error copy, wrapped notices in aria-live banners, and extended unit + Playwright coverage so `fixtures-empty`/`fixtures-error` scenarios announce guidance deterministically.
- 2025-10-03 – Action 5 (Review): Ran the full quality gate suite (`pnpm build`, format + lint, unit/integration/Playwright/e2e, smoke) to validate the refactor; natural route axe reports now return zero violations and fixtures remain deterministic.
- 2025-10-03 – Challenge: Discovered lingering manual key-stage casing in the derived summary and duplicate styling bloating `NaturalSearch.tsx`; addressed by introducing the shared summary component and replacing bespoke logic with SDK guards.
- 2025-10-03 – Action 4/8: Rebuilt `/natural_language_search` as a prompt-only flow; the server now derives the structured payload, and the client renders a read-only summary card while dropping manual filters and local derivation.
- 2025-10-03 – Action 4/5 (Review): Ran Vitest suites (`NaturalSearch.unit.test.tsx`, `SearchPageClient.integration.test.tsx`, `app/api/search/nl/route.integration.test.ts`) and Playwright `tests/visual/responsive-baseline.spec.ts` to confirm focus styling, skip links, and accessibility all pass with updated artefacts under `apps/oak-open-curriculum-semantic-search/test-results/`.
- 2025-10-03 – Action 5: Refined skip-link styling, introduced the `--app-gap-stack` token via the theme bridge, and refreshed landing CTA card contrast using Oak palette accents.
- 2025-10-03 – Action 5 (Review): Eliminated remaining lint warnings by switching to the SDK `isSubject`/`isKeyStage` guards, throwing informative errors on unexpected values in the derived summary, and confirming the navigation accessibility suite runs clean after adjusting Axe imports.
- 2025-10-02 – Action 2: Created landing page integration test to drive the hero + CTA experience for `/`.
- 2025-10-02 – Action 2: Implemented landing page components, routed `/` to the new layout, and redirected `/search` to `/`; updated integration coverage (`LandingPage.integration`, `/search` redirect, SearchPageClient regression) to green.
- 2025-10-02 – Action 2: Completed manual light/dark review at `bp-xs`/`bp-md`, confirmed hero readability and CTA focus outlines, and captured artefacts under `apps/oak-open-curriculum-semantic-search/test-artifacts/landing/2025-10-02/`.
- 2025-10-02 – Action 3: Added structured-route RTL coverage for condensed hero + skip links and refactored hero/skip-link logic with new structured copy; SearchResults now exposes anchored sections per variant.
- 2025-10-02 – Action 3 (Review): Ran targeted Playwright structured scenarios (`tests/visual/fixture-toggle.spec.ts`, `tests/visual/responsive-baseline.spec.ts`) to validate hero focus, skip links, and overflow guards; stored screenshots under `apps/oak-open-curriculum-semantic-search/test-artifacts/structured/2025-10-02/`.
- 2025-10-02 – Action 4/5: Introduced natural-language hero messaging + skip links (RTL) and updated responsive Playwright coverage with new artefacts at `test-artifacts/structured/2025-10-02/natural-hero-bp-md.png`.
- 2025-10-02 – Action 5: Harmonised shared layout styling across landing/structured/natural variants; captured passing RTL + Playwright runs as evidence.
- 2025-10-02 – Action 7: Finalised top navigation (Search/Structured/Natural/Admin/Status/Docs), added focus-visible styling, and captured Playwright accessibility evidence (`tests/visual/navigation.accessibility.spec.ts`).
- 2025-10-02 – Action 8: Shifted natural-language search to a textarea-first flow with derived parameter summary; expanded RTL + Playwright coverage to prove the new UX.

## Upcoming Focus

- **Actions 14–21:** Complete documentation refresh, regenerate artefacts, run quality gates, and deliver the final cross-surface UX review with evidence.

## Action Status

- **Action 2:** Completed – landing page review signed off with artefacts and RTL regression.
- **Action 3:** Completed – structured hero and fixtures verified via RTL + Playwright with responsive evidence captured.
- **Action 4:** Completed – Prompt-only natural-language hero, skip links, and derived summary delivered with server-driven workflow.
- **Action 5:** Completed – Shared layout tokens, skip-link focus styling, and CTA contrast refreshed across landing/search.
- **Actions 6–7:** Completed – navigation, CTA alignment, and accessibility verification delivered with artefacts.
- **Action 8:** Completed – Server-driven natural workflow with end-to-end tests (unit, integration, Playwright) proving prompt→derivation→results loop.
- **Actions 9–11:** Completed – structured-search empty/error messaging hardened, capture flows auto-submit for deterministic artefacts, and operations layout shared across admin/status with refreshed fixture banners.
- **Action 12:** Completed – Read GO.md to refresh grounding and align the current todo list with Phase 1 objectives.
- **Action 13:** Completed – Design and copy review across landing, structured, and natural routes with observations captured under Recent Progress.
- **Actions 14–21:** Pending (next: documentation refresh, telemetry/status hardening, artefact regeneration, and final UX review).

## Verification & Evidence

- Visual reviews: start the dev server in the search app workspace with `pnpm dev > /tmp/semantic-dev.log 2>&1 &` so that the server logs are available for debugging and the app starts in the background. And then open the app in the browser at `http://localhost:3000` using the Playwright MCP tools, examine layout, review console output, and ensure the app is responsive, use screenshots to document states, and review those states. We are aiming for design excellence, very high usability, and full accessibility compliance.
- Tests: maintain unit → integration → RTL → Playwright hierarchy; update suites as surfaces shift (landing CTAs, dedicated pages, admin telemetry, status tone).
- Artefacts: regenerate deterministic screenshots + axe reports after major UI updates; store under `apps/oak-open-curriculum-semantic-search/test-artifacts/`.
- Quality gates: `pnpm make` for intermediate checkpoints; `pnpm qg` for milestone validation and final hand-off.

## Documentation & Communication

- Keep this plan as the single source of truth; update Recent Progress and action statuses after each REVIEW.
- Log UX review outcomes, accessibility notes, and artefact links here to avoid reliance on removed context docs.
- Coordinate with design/research stakeholders during ACTION 13 and ACTION 20 to ensure qualitative feedback is captured alongside automated evidence.
