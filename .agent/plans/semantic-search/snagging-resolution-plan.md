# Semantic Search UX Snagging Resolution Plan

## Objectives

- Restore visual polish and information hierarchy across all semantic search surfaces before wiring real Elasticsearch back-ends.
- Consolidate client-side UI structure so shared primitives, fixtures, and layout patterns are obvious and reusable.
- Resolve blocking UX bugs (fixture toggle placement, natural language fixtures, navigation regressions) while uplifting responsive behaviour and accessibility.

## Workstream 1 – UI Architecture & Organisation

1. **Adopt surface-first directories**: split `app/ui/client` into `global/` (navigation, theming, fixture controls), `search/` (hero, layout, forms, results), and `ops/` (admin/status shared pieces). Re-export via `index.ts` files to preserve import ergonomics.
2. **Promote shared tokens & helpers**: move layout tokens (breakpoints, grid helpers) into `app/ui/shared/` with clear naming; document intent in the local README.
3. **Update import paths & snapshots**: adjust tests/story-like fixtures after moving files; ensure existing integration tests still compile with new paths.
4. **Add structure README**: replace the one-line README with a short rationale describing the new organisation and expected layering (global → surface → leaf component).

## Workstream 2 – Navigation & Header Polish

1. **Fix labelling and semantics**: rename the "Homes" nav item to "Home"; retain Oak logo link with explicit `aria-label`.
2. **Responsive header grid**: refactor header layout to use CSS grid with three regions (logo, nav, utility). When the viewport narrows, allow utilities to drop below nav and left-align.
3. **Integrate fixture mode selector**: replace the per-page radio group with a global header dropdown (select or menu) driven by the same actions; ensure it only renders when fixtures are enabled.
4. **Keep skip links & focus order intact**: verify skip links remain the first interactive items; ensure header utilities stay focus-visible after layout changes.
5. **Theme selector refinement**: update styling so contrast and focus rings meet AA when stacked; confirm dark-mode tokens still render correctly.

## Workstream 3 – Landing Page Rework

1. **Hero layout**: widen the hero card (max 70ch), centre it on wide screens, and collapse to full width on small screens; enforce a single-line heading using non-breaking spaces or typographic tweaks.
2. **Primary CTAs**: introduce two Oak primary buttons within the hero for structured vs natural search; create secondary text links beneath for further reading.
3. **Copy differentiation**: revise hero sub-heading vs body copy so each conveys distinct value propositions (guidance vs exploration).
4. **CTA cards**: convert cards into full-card links using `<Link>` wrappers, add `prefers-reduced-motion` guard on hover lift/backlight, and strengthen hover states (glow/backlight, focus outline).
5. **Responsive spacing**: tighten vertical rhythm on large monitors while ensuring comfortable stacking on mobile; use CSS variables rather than hard-coded values.

## Workstream 4 – Search Surfaces (Structured & Natural)

1. **Fixture messaging**: shrink the banner to a one-line pill (`Using fixture scenario: …`) positioned near the header or hero; rely on the new header dropdown for switching modes.
2. **Priority layout**: restructure the page into a two-column grid on ≥lg screens (controls + hero vs results), keeping results visible above the fold; on small screens, stack hero → controls → results with short gaps.
3. **Controls clarity**: simplify `SearchPageControlsGrid` rules, add section headings, and ensure inputs align vertically with consistent spacing.
4. **Results prominence**: introduce a contrasting surface and sticky summary header, increase card padding, and add subtle accent border/indicator for hover/focus.
5. **Secondary content**: relocate suggestions/facets into a collapsible or right-column panel on wide screens so they support, rather than displace, results.
6. **Skeleton/loading states**: add lightweight skeleton or shimmer for results and derived summaries to reduce perceived latency.
7. **Accessibility & motion**: provide reduced-motion fallbacks for result hover effects and ensure `aria-live` regions only announce meaningful updates.

## Workstream 5 – Natural Language Fixtures Reliability

1. **Route guard ordering**: allow fixture modes to bypass the `llmEnabled` hard block so deterministic fixtures work without OpenAI credentials.
2. **Error resilience**: improve `parseResponse` messaging to surface fixture-triggered errors cleanly in the UI banner.
3. **Regression coverage**: add route-level tests covering each fixture mode to ensure responses stay shaped for the existing client schema.

## Workstream 6 – Admin Page Redesign

1. **Information architecture**: split the page into hero overview, quick actions, job runners, and telemetry; apply consistent headings.
2. **Action panels**: convert job controls into cards with descriptive text, run buttons, status chips, and collapsible log output (auto-scroll with sticky headers).
3. **Telemetry integration**: move the zero-hit dashboard into a dedicated section with clearer separation from operational buttons; add summary chips at the top.
4. **Responsive grid**: use the same layout tokens as search pages so actions wrap gracefully; consider sticky sidebar for quick links on large screens.
5. **A11y checks**: ensure button states announce loading/completion, and logs remain screen-reader friendly without overwhelming announcements.

## Workstream 7 – Status Page Redesign

1. **Intent-first hero**: introduce a top summary card with overall status indicator, timestamp, and quick legend for tone colours.
2. **Cards layout**: restructure service cards into a responsive grid with consistent heights, icons, and actionable links where applicable.
3. **Alert treatment**: restyle fatal alerts with stronger contrast, include suggested next steps, and make dismissal possible if not critical.
4. **Diagnostics section**: evolve into a richer toolkit (links to health endpoints, docs, last deploy metadata) with copy emphasising operator tasks.
5. **Testing**: expand integration tests to assert new structure and ensure the `status-helpers` formatting still matches the revised UI.

## Workstream 8 – Cross-cutting Quality & Evidence

1. **Regression tests**: update Playwright journeys for landing, structured, natural, admin, and status to capture new layouts (including reduced-motion snapshots).
2. **Visual regressions**: capture before/after screenshots (light & dark modes, mobile & desktop) and attach to the UX plan for sign-off.
3. **Accessibility audit**: rerun axe and manual keyboard sweeps after each surface refactor; document findings alongside fixes.
4. **Docs & changelog**: refresh relevant docs (e.g. `semantic-search-responsive-layout-architecture.md`) to reflect the new layout strategy and fixture control location.
5. **Follow-up checklist**: once back-end integration begins, flag any UI dependencies (e.g. real search latency, telemetry endpoints) that might need additional states.
