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
- Update Admin, Docs, and Health surfaces to follow the same breakpoint-driven rules (stack → dual column → three column) instead of bespoke fixed widths.

### 2. Visual Hierarchy & Surface Refinement

- Recompose hero and CTA blocks per breakpoint so typography scales smoothly (Lexend ramp) and emphasis surfaces respond to new grid states.
- Convert Admin action panels and telemetry outputs into card clusters that widen at `bp-md` and reflow at `bp-xl`.
- Wrap Redoc (Docs) and Health diagnostics in Oak surfaces with radius/spacing tokens and ensure they honour container clamps through `bp-xxl`.

### 3. Accessibility & Readability

- Validate focus order and DOM reading order across breakpoint transitions (no DOM reshuffling; CSS grid areas only).
- Check colour contrast in both modes for the reworked surfaces, paying particular attention to hover/focus states introduced at `bp-sm` and above.
- Add axe coverage to Playwright runs at xs/md/lg/xxl to confirm headings, landmarks, and status regions remain intact.

### 4. Observability & Regression Safety for UX

- Capture Playwright snapshots at widths representing `bp-xs` (360 px), `bp-md` (800 px), `bp-lg` (1 200 px), and `bp-xxl` (2 000 px) for Search, Admin, Docs, Health.
- Add visual assertions keyed to layout breakpoints (e.g. results column count, stacked vs side-by-side panels).
- Integrate accessibility checks into the same runs to enforce responsive semantics.

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

## Todo (GO cadence)

1. ACTION: Draft responsive layout architecture notes (breakpoints, grid tokens, stacking rules) and review with stakeholders.
2. REVIEW: Walk through the architecture notes with design/product to confirm responsive goals cover Search, Admin, Docs, Health.
3. ACTION: Add failing integration/visual tests that capture current layout issues across all breakpoints for each primary page.
4. REVIEW: Analyse captured failures to ensure tests meaningfully represent hero/forms/cards/nav expectations.
5. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search test app/lib/theme/bridge.integration.test.tsx` plus new visual specs to validate failure coverage.
6. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ACTION: Implement responsive grid + hero/card redesign for Search page backed by passing tests and accessibility checks.
8. REVIEW: Peer review Search page outcome against Oak guidelines and recorded tests; capture screenshots for documentation.
9. ACTION: Redesign Admin/Docs/Health layouts with new surfaces, status messaging, and accessibility affordances.
10. REVIEW: Audit cross-page consistency (spacing tokens, typography, error handling) and adjust theme tokens where necessary.
11. QUALITY-GATE: Execute `pnpm format:root`, `pnpm lint`, `pnpm type-check`, `pnpm -C apps/oak-open-curriculum-semantic-search test`, and visual regressions to confirm green state.
12. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
13. ACTION: Update UX documentation (design decisions, QA cadence, palette references) and share with functionality stream.
14. REVIEW: Validate documentation, ensure automation dashboards capture new snapshots, and close UX plan items with sign-off.
