# Semantic Search Phase 1 – UX Plan

## Programme Vision

- Deliver a hybrid search experience whose interface expresses Oak’s brand, accessibility standards, and clarity of purpose across devices.
- Ensure the design system inside Semantic Search can be lifted into other Oak products without bespoke overrides.
- Use TDD, visual regression, and accessibility checks so UX changes ship with the same rigour as core functionality.

## Phase Focus – UX Alignment

Phase 1’s UX stream turns the current token-aligned theme into an exemplar Oak interface. We will:

- Repair responsive layout behaviour so content reads naturally from 320 px phones up to ultrawide desktops.
- Re-establish Oak’s typographic, spacing, and surface hierarchy on every page (Search, Admin, Docs, Health, derivative flows).
- Replace developer-centric error states with empathetic, brand-aligned messaging and observable status indicators.
- Introduce automation (visual snapshots, accessibility assertions) so design intent stays protected.

## Current State Snapshot (2025-09-26)

- ✅ Semantic theme tokens exist for colours, spacing, typography, and brand palette.
- ✅ Theme bridge emits CSS variables and global styles validated by integration tests.
- ⚠️ Layout remains desktop-fixed: cards fail to stack, white space dominates, hero panels are oversized.
- ⚠️ Admin and API docs views expose raw data/Swagger scaffolding instead of Oak UI, and mobile views are largely unusable.
- ⚠️ Health endpoint returns JSON strings; telemetry cards show raw HTTP errors with no recovery path.

### Recent Progress

- Admin shell now delegates its container, grid, and telemetry cards to shared layout tokens; zero-hit dashboard adopts `--app-layout-secondary-column-min-width`.
- API Docs wrapper consumes the shared container clamp and Oak surfaces, removing bespoke pixel width clamps.
- Responsive layout architecture updated to align with the refined breakpoint ramp (`bp-xs` → `bp-xxl`).
- Playwright baseline still contains intentional `test.fail()` markers for work-in-progress assertions (Search xs, Hero lg, Admin md, Admin xxl, Docs xxl, Health xs); Admin `bp-xxl` now passes locally and requires baseline updates.
- Health surface remains JSON-only; responsive shell debt stays recorded for follow-up.
- Playwright responsive baseline now asserts Admin/Docs `bp-xxl` container clamps without `test.fail()` guards, producing actionable snapshots.
- `<meta name="theme-color">` draws from semantic `bg-primary` tokens, guarded by `layout.meta.unit.test.ts` so browser chrome tracks Oak palette changes.
- Playwright search scenarios run against curated fixtures by toggling `SEMANTIC_SEARCH_USE_FIXTURES`, ensuring local runs avoid Elasticsearch dependencies and keep results deterministic for layout assertions. Tests at `bp-xs`/`bp-md`/`bp-lg` now pass without `test.fail()` guards following the accessible button + layout updates.
- Structured and natural forms now place `<form>` elements inside `tabpanel` containers (no invalid ARIA roles) and share a custom submit button with brand-primary contrast that meets WCAG 2.1 ratios.
- Axe still flags two violations on Health (HTML fallback) until that UI shell lands; search regressions are clean.
- Axe still flags two violations in dev mode due to the Next.js overlay; suppress with `NEXT_DISABLE_DEV_ERRORS` in the Playwright server env, but investigate underlying errors before relaxing assertions.
- 2025-09-27: Introduced `resolveBreakpoint` helper and updated Search layout components to consume semantic breakpoints via styled-components theme; Playwright sampling confirmed `ControlsGrid` now transitions to two columns at `bp-md` while retaining token-driven column clamps.
- Theme selector radios honour dark mode by resolving semantic tokens to Oak colour hex values, yielding visibly lighter outlines with integration coverage guarding `rgb(228, 228, 228)` / `rgb(255, 255, 255)` borders.
- 2025-09-27: Hero/controls now share a `HeroControlsCluster` grid (stacking below `bp-lg`, two columns above), control cards use `surfaceCard` with brand borders for contrast, radio/select groups wrap on narrow widths, and integration tests + Playwright responsive sweeps cover the new theming.
- Structured search now exposes the `phaseSlug` filter via a Phase select, and natural language search treats scope as optional (auto-detects unless the user chooses Units/Lessons/Sequences).

### Outstanding Audit Notes

- **Health telemetry shell:** The `/healthz` route still renders raw JSON and lacks the Oak container/hero wrappers. Responsive layout work must introduce the shared `PageContainer` and card shells once the UI brief lands.
  - Draft shell (2025-09-27): adopt `PageContainer` with hero summary (status badge + uptime note), two-column grid at `bp-md` separating "Status" cards from "Diagnostics" accordion, and reserve a `role="status"` live region for API health messages. Accept-header toggle should serve JSON by default yet promote UI when `text/html` requested without breaking caching.
- **Search hero/control balance:** Validate that the `HeroControlsCluster` column ratios keep both structured and natural panels visible above the fold on `bp-lg`+ widths; adjust tokenised track weights if forms continue to slip below the hero copy.
- **Playwright data mocks:** Extend the deterministic fixture set beyond the existing hybrid search responses so responsive screenshots reflect populated cards, facets, and zero-hit dashboards; document the toggle strategy inside the plan/context to guide future contributors.
- **Search overflow guard:** Playwright now asserts `bp-lg` at 1 100 px and 1 380 px; the narrower viewport still exceeds the clamp by ~98 px, so refine container widths before unguarding the test. The 1 380 px viewport passes with the current clamp.
- **Search hero clamp:** Copy still exceeds the 45 ch target at `bp-lg`; now that fixtures drive deterministic results, we can adjust layout tokens/media queries next.
- **Search hero polish:** Confirm the new clamp (`max-inline-size: min(45ch, 100%)`) keeps hero copy within 45 ch across locales, consider adding an illustration at `bp-xl`, and verify dark-mode contrast on the refreshed control cards.
- Search UX: validate the new hero/control cluster (contrast in dark mode, hero copy clamp ≤45 ch) and capture any additional token work (e.g. hero illustration slots at `bp-xl`).

## Breakpoint Strategy

All responsive work targets a single breakpoint ramp so every surface behaves consistently across the widths mandated in the plan and Playwright suite.

| Token    | Width    | Devices & Goals                                                                                                           |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `bp-xs`  | `0px`    | Phones ≤ 479 px; enforce single-column stacking, readable tap targets, and simplified hero copy.                          |
| `bp-sm`  | `480px`  | Large phones/small tablets; relax typography and allow wider hero content without reintroducing side-by-side forms.       |
| `bp-md`  | `768px`  | Tablet landscape; first breakpoint that permits paired panels (structured vs natural search, status vs logs).             |
| `bp-lg`  | `1024px` | Small desktops/large tablets; primary two-column layouts settle here with balanced gutters.                               |
| `bp-xl`  | `1360px` | Mainstream desktops; unlock three-column grids and expanded secondary content while respecting line-length clamps.        |
| `bp-xxl` | `1760px` | Ultrawide monitors; keeps 2 000 px visual runs centred via container clamps and additional breathing room for dashboards. |

These breakpoints drive layout tokens, Styled Components media queries, and Playwright snapshot widths (360/800/1 200/2 000 align with xs/md/lg/xxl). The responsive architecture document inherits this ramp.

## UX Objectives & Workstreams

### 1. Responsive Layout & Grid System (Breakpoints First)

- Define container clamps, inline padding, and grid behaviour at each breakpoint in `.agent/plans/semantic-search/semantic-search-responsive-layout-architecture.md`.
- Refactor Search page wrappers so:
  - `bp-xs`/`bp-sm`: hero, forms, suggestions, facets, and results stack linearly with `gap.section` rhythm.
  - `bp-md`: structured/natural forms share a two-column grid, secondary panels align beside each other.
  - `bp-lg`: container paddings widen, results adopt two-column cards, hero admits optional media.
  - `bp-xl`/`bp-xxl`: introduce three-column results and expanded admin/docs layouts without exceeding the container clamp.
- Update Admin, Docs, and Health surfaces to follow the same breakpoint-driven rules (stack → dual column → three column) instead of bespoke fixed widths, replacing literal pixel clamps/gaps with the shared layout tokens and CSS variables.

### 2. Visual Hierarchy & Surface Refinement

- Recompose hero and CTA blocks per breakpoint so typography scales smoothly (Lexend ramp) and emphasis surfaces respond to new grid states.
- Convert Admin action panels and telemetry outputs into card clusters that widen at `bp-md` and reflow at `bp-xl`.
- Wrap Redoc (Docs) and Health diagnostics in Oak surfaces with radius/spacing tokens, ensure they honour container clamps through `bp-xxl`, and drive zero-hit dashboards/cards from the emitted layout variables rather than `minmax(180px, 1fr)` fallbacks.

### 3. Accessibility & Readability

- Validate focus order and DOM reading order across breakpoint transitions (no DOM reshuffling; CSS grid areas only).
- Check colour contrast in both modes for the reworked surfaces, paying particular attention to hover/focus states introduced at `bp-sm` and above.
- Add axe coverage to Playwright runs at xs/md/lg/xxl to confirm headings, landmarks, and status regions remain intact, and surface light/dark theme-colour metadata from the semantic palette so browser chrome follows Oak tokens.

### 4. Observability & Regression Safety for UX

- Capture Playwright snapshots at widths representing `bp-xs` (360 px), `bp-md` (800 px), `bp-lg` (1 200 px), and `bp-xxl` (2 000 px) for Search, Admin, Docs, Health.
- Add visual assertions keyed to layout breakpoints (e.g. results column count, stacked vs side-by-side panels).
- Integrate accessibility checks into the same runs to enforce responsive semantics.

#### Upcoming Verification Criteria

- **Admin `bp-xxl` baseline:** Assert `main` width respects `--app-layout-container-max-width` while exceeding 1 200 px, and confirm axe violations remain at 0.
- **Theme colour metadata:** Validate `<meta name="theme-color">` reflects semantic `bg-primary` tokens for both themes (`app/layout.meta.unit.test.ts` guards values via `resolveUiColor`).
- **Baseline artefacts:** Capture before/after Playwright attachments for Search, Admin, and Docs at `bp-xxl` to evidence responsive improvements prior to regenerating snapshots.

## Deliverables

- Breakpoint-driven responsive architecture shared across Search, Admin, Docs, and Health surfaces.
- Redesigned layouts and surfaces that respect Oak hierarchy at each breakpoint.
- Automated visual + accessibility regression checks aligned with the breakpoint ramp.
- Updated documentation describing layout tokens, component behaviour per breakpoint, and QA cadence.

## Collaborations / Dependencies

- Coordinate with functionality plan owners so telemetry/admin data feeds UI components sized for each breakpoint.
- Validate breakpoint behaviour with design stakeholders to ensure alignment with Oak components.
- Sync tooling owners to land Playwright/axe updates without regressing CI performance.

## Risks & Mitigations

- **Risk:** Layout overhaul impacts existing integration tests. **Mitigation:** Drive changes via failing breakpoint-specific visual tests, updating assertions incrementally.
- **Risk:** Palette tweaks may diverge from Oak web components. **Mitigation:** Document overrides with rationale, seek upstream alignment where possible.
- **Risk:** Swagger embed updates could break docs build. **Mitigation:** Pair with functionality stream on API docs hosting changes.

## Progress Log

- ACTION/REVIEW 1–2 COMPLETE: Audit captured Admin/Docs literal clamps; Health noted as pending shell work.
- ACTION/REVIEW 3–4 COMPLETE: Admin page now consumes shared container and telemetry grid tokens; responsive behaviour validated manually.
- ACTION 5 COMPLETE: Docs wrapper migrated to shared layout tokens; Health override remains on roadmap.
- ACTION/REVIEW 7–8 COMPLETE: Playwright admin/docs `bp-xxl` baseline updated, snapshots regenerated, and axe checks recorded post-refactor.
- ACTION/REVIEW 9–10 COMPLETE: Browser chrome metadata sources semantic `bg-primary` tokens with unit tests guarding light/dark parity.
- Integration note: Theme bridge and token specs extended to include breakpoint variables and inline padding clamps (see responsive architecture doc).
- 2025-09-27 audit (Search filters): Structured search form now exposes scope, query, subject, key stage, phase, minimum lessons, and size controls via Oak-labelled inputs; phase options cover primary/secondary slugs and propagate through `useStructuredSearchHandlers`. Natural language scope radios default to “Auto”, clearing the scope from the payload when selected, so scopes remain optional as requested. No additional filter dimensions surfaced in the API contract at this stage, and `includeFacets` stays enabled by default without a UI toggle.
- 2025-09-28 review (Filter gating): Reconfirmed scope-driven visibility rules—structured filters for key stage, phase, and minimum lessons only appear when their scopes apply, while natural search shows a guidance note when scope is Auto/All. Subject remains always visible by design, and backend-only fields (`from`, `highlight`, `includeFacets`) stay implicit with no user-facing gaps identified.
- 2025-09-28 integration (Search layout): `SearchPageClient.integration.test.tsx` now asserts the Phase selector options and the layout clamp expressed as `min(100%, var(--app-layout-container-max-width))`; suite passes under Vitest.
- 2025-09-28 implementation (Multi-scope fixtures): Structured search fan-out now buckets lessons/units/sequences when scope = All; Playwright fixtures mirror this output so responsive snapshots capture populated sections, with a follow-up to enrich card content for more representative screenshots.
- 2025-09-27 quality gates: `pnpm make` succeeded after trimming `SearchHero` under the lint threshold, and the full `pnpm qg` suite passed (format, type-check, lint, tests, smoke).

## Todo (GO cadence)

1. ✅ REMINDER: UseBritish spelling.
2. ✅ ACTION: Audit the API Docs page to reproduce the Redoc colour failure and identify offending theme values.
3. ✅ REVIEW: Record the API Docs findings (failing colour tokens, repro steps) in the plan/context docs.
4. ✅ ACTION: Implement Redoc theme fixes (resolve UI tokens to hex) and extend deterministic integration coverage for the docs page.
5. ✅ REVIEW: Run targeted docs tests (`pnpm -C apps/oak-open-curriculum-semantic-search test app/api/docs/page.integration.test.tsx`) and log results.
6. ✅ GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ✅ ACTION: Audit the Admin page layout and scrolling behaviour, noting hash changes and responsive overflow points.
8. ✅ REVIEW: Document the Admin audit outcomes with proposed layout/hash handling adjustments.
9. ✅ ACTION: Implement Admin layout fixes (container clamps, hash handling) and extend integration/visual tests for the new behaviour.
10. ✅ REVIEW: Capture Admin verification evidence (test outputs, screenshots) and summarise residual risks.
11. ✅ REVIEW: Ensure the documented findings align with UX goals before updating broader docs.
12. ✅ GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
13. ✅ ACTION: Update plan/context/continuation docs with finalised fixes, artefact links, and next steps.
14. ✅ REVIEW: Sanity-check documentation updates for accuracy and clarity.
15. ✅ QUALITY-GATE: Run `pnpm qg` from the repo root once fixes land.
16. ✅ REVIEW: Log the `pnpm qg` outcome, flagging any remaining exceptions.
