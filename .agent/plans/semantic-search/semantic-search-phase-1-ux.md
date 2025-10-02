# Semantic Search Phase 1 – UX Plan

## Vision

- Present semantic search with a confident first impression: `/search` acts as a landing page that introduces the hybrid search proposition, showcases structured vs natural experiences, and routes users clearly.
- Deliver dedicated `/structured_search` and `/natural_language_search` workspaces with accessible, high-quality UX that feels cohesive with Oak’s design system across light and dark themes.
- Keep deterministic fixtures, accessibility, and automated evidence at the heart of delivery so designers, engineers, and tests share a single source of truth.
- Extend the same rigour to supporting surfaces (admin telemetry and status) so Phase 1 closes with a demonstrably complete UX slice.

## Current Status Highlights

- Semantic theme tokens, layout wrappers, and fixture toggles are stable; search regression ("Maximum update depth exceeded") is resolved with regression tests guarding the flow.
- Deterministic fixtures (search + admin streams) are powered by the SDK pipeline, and Playwright/RTL suites already exercise success/empty/error scenarios.
- Admin telemetry/history UX, status-page tone handling, and a formal cross-surface UX review remain open.

## End-State Definition

- `/` (app root) = focused landing page with an introductory hero, supporting copy, and two prominent CTA cards leading to the relevant search experiences (with `/search` reduced to a redirect).
- `/structured_search` and `/natural_language_search` = fully dedicated experiences with consistent hero treatment, navigation, skip links, accessible messaging, deterministic fixtures, and polished empty/error states.
- Top-level navigation includes Search, Structured search, Natural language search, Admin, Status, and Docs, with consistent styling and focus handling.
- Admin console exposes telemetry history/feedback backed by SDK fixtures; status page communicates tone/failure states with comprehensive test coverage.
- All surfaces pass accessibility checks (keyboard, aria-live, skip links, contrast) and are evidenced through automated artefacts plus plan updates.

## Execution Plan (GO cadence)

1. REMINDER: use British spelling.
2. **ACTION:** Rebuild the app root (`/`) as the landing page (hero messaging, CTA cards, supporting copy) removing embedded forms and configure `/search` to redirect here.  
   **REVIEW:** RTL + manual light/dark sweep at `bp-xs`/`bp-md` to confirm layout, focus order, and hero readability.
3. **ACTION:** Rebuild `/structured_search` with condensed hero, dedicated skip links, and ensure structured form/results live solely here; update navigation entry.  
   **REVIEW:** Run `SearchPageClient.integration` variant + Playwright fixture success scenario to validate focus and above-the-fold behaviour.
4. **ACTION:** Rebuild `/natural_language_search` with textarea-first flow, derived-parameter summary, and consistent hero styling; update navigation entry.  
   **REVIEW:** Execute RTL coverage for natural route and perform manual keyboard/screen-reader audit.
5. **ACTION:** Update shared layout/styles to support landing/structured/natural variants while preserving semantic tokens across light/dark themes.  
   **REVIEW:** Run `pnpm -C apps/oak-open-curriculum-semantic-search test app/ui/client/SearchPageClient.integration.test.tsx --run` to confirm variant handling remains green.
6. **GROUNDING:** read GO.md and follow all instructions.
7. **ACTION:** Finalise navigation and CTA linking across search/admin/status, ensuring ARIA labelling and focus outlines.  
   **REVIEW:** Manual nav tour plus quick axe pass to confirm accessibility.
8. **ACTION:** Simplify natural-language panel implementation (multiline textarea, derived parameters) with failing tests first, keeping shared behaviour coherent.  
   **REVIEW:** Run new unit/integration suites (`NaturalSearch.*`, `useSearchController.*`) and Playwright natural fixture scenario.
9. **ACTION:** Harden structured-search error/empty states (503 banner, aria-live, empty guidance) and add regression coverage.  
   **REVIEW:** Run RTL error/empty tests and Playwright `fixtures-error` capture with screenshots.
10. **ACTION:** Auto-submit fixture queries in capture script and regenerate search/admin artefacts at xs/md/lg/xxl.  
    **REVIEW:** Inspect artefacts + axe reports; update plan with observations.
11. **ACTION:** Refine fixture status banner tone/copy and pressed states across search/admin surfaces.  
    **REVIEW:** Keyboard-only audit and RTL assertions for focus/pressed feedback.
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

- 2025-10-02 – Action 2: Created landing page integration test to drive the hero + CTA experience for `/`.
- 2025-10-02 – Action 2: Implemented landing page components, routed `/` to the new layout, and redirected `/search` to `/`; updated integration coverage (`LandingPage.integration`, `/search` redirect, SearchPageClient regression) to green.
- 2025-10-02 – Action 2: Completed manual light/dark review at `bp-xs`/`bp-md`, confirmed hero readability and CTA focus outlines, and captured artefacts under `apps/oak-open-curriculum-semantic-search/test-artifacts/landing/2025-10-02/`.
- 2025-10-02 – Action 3: Added structured-route RTL coverage for condensed hero + skip links and refactored hero/skip-link logic with new structured copy; SearchResults now exposes anchored sections per variant.
- 2025-10-02 – Action 3 (Review): Ran targeted Playwright structured scenarios (`tests/visual/fixture-toggle.spec.ts`, `tests/visual/responsive-baseline.spec.ts`) to validate hero focus, skip links, and overflow guards; stored screenshots under `apps/oak-open-curriculum-semantic-search/test-artifacts/structured/2025-10-02/`.
- 2025-10-02 – Action 4/5: Introduced natural-language hero messaging + skip links (RTL) and updated responsive Playwright coverage with new artefacts at `test-artifacts/structured/2025-10-02/natural-hero-bp-md.png`.
- 2025-10-02 – Action 5: Harmonised shared layout styling across landing/structured/natural variants; captured passing RTL + Playwright runs as evidence.

## Upcoming Focus

- **Actions 6–7:** Maintain GO cadence (grounding complete) and align navigation/CTA wiring with the new routes, including accessibility sweeps.
- **Actions 8–11:** Extend natural-language controller, error/empty fixtures, and fixture banner tone with tests-first delivery.
- **Actions 12–21:** Complete grounding checkpoints, regenerate artefacts, run quality gates, and deliver the final cross-surface UX review with evidence.

## Action Status

- **Action 2:** Completed – landing page review signed off with artefacts and RTL regression.
- **Action 3:** Completed – structured hero and fixtures verified via RTL + Playwright with responsive evidence captured.
- **Action 4:** Completed – natural language hero copy, skip links, and results anchoring delivered with RTL coverage.
- **Action 5:** Completed – shared layout/styles refactored for all variants; responsive Playwright suite regenerated.
- **Actions 6–21:** Pending (next: navigation/CTA alignment plus accessibility verification).

## Verification & Evidence

- Visual reviews: start the dev server in the search app workspace with `pnpm dev > /tmp/semantic-dev.log 2>&1 &` so that the server logs are available for debugging and the app starts in the background. And then open the app in the browser at `http://localhost:3000` using the Playwright MCP tools, examine layout, review console output, and ensure the app is responsive, use screenshots to document states, and review those states. We are aiming for design excellence, very high usability, and full accessibility compliance.
- Tests: maintain unit → integration → RTL → Playwright hierarchy; update suites as surfaces shift (landing CTAs, dedicated pages, admin telemetry, status tone).
- Artefacts: regenerate deterministic screenshots + axe reports after major UI updates; store under `apps/oak-open-curriculum-semantic-search/test-artifacts/`.
- Quality gates: `pnpm make` for intermediate checkpoints; `pnpm qg` for milestone validation and final hand-off.

## Documentation & Communication

- Keep this plan as the single source of truth; update Recent Progress and action statuses after each REVIEW.
- Log UX review outcomes, accessibility notes, and artefact links here to avoid reliance on removed context docs.
- Coordinate with design/research stakeholders during ACTION 13 and ACTION 20 to ensure qualitative feedback is captured alongside automated evidence.
