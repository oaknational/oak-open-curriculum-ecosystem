# Semantic Search Responsive Layout Architecture (Phase 1)

_Last updated: 2025-09-26_

## Purpose

Describe the responsive layout contract for Semantic Search so every surface (Search, Admin, Docs, Health) behaves consistently from 360 px phones to 2 000 px desktops. All guidance aligns with the `bp-xs` → `bp-xxl` ramp defined in the Phase 1 UX plan.

## References

- `.agent/plans/semantic-search/semantic-search-phase-1-ux.md`
- `.agent/plans/semantic-search/semantic-search-phase-1-ux-context.md`
- `.agent/plans/semantic-search/semantic-theme-inventory.md`
- `.agent/plans/semantic-search/semantic-theme-spec.md`
- Oak Components Storybook: <https://components.thenational.academy/?path=/docs/introduction--docs>
- `.agent/reference-docs/ui/styled-components-in-nextjs.md`

## Breakpoint Tokens

| Token    | Width    | Devices & Intent                                                                                              |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `bp-xs`  | `0px`    | Phones ≤ 479 px; enforce single-column stacks and thumb-friendly spacing.                                     |
| `bp-sm`  | `480px`  | Large phones/small tablets; relax typography, widen hero text without reintroducing side-by-side forms.       |
| `bp-md`  | `768px`  | Tablet landscape; first dual-column breakpoint for forms and admin/health dashboards.                         |
| `bp-lg`  | `1024px` | Small desktops; container padding widens, hero gains optional secondary media, results adopt two columns.     |
| `bp-xl`  | `1360px` | Standard desktops; three-column grids and expanded secondary panels appear while line length remains clamped. |
| `bp-xxl` | `1760px` | Ultrawide; maintain centred layout at 2 000 px snapshots, offer denser dashboards without stretching copy.    |

Expose these as CSS variables (`--app-bp-xs` … `--app-bp-xxl`) via the theme bridge for use in Styled Components media queries and Playwright assertions.

## Global Tokens & Variables

- Update `semanticThemeSpec.app.layout.containerMaxWidth` to `clamp(20rem, 92vw, 78rem)` (1 248 px max) to protect line length on wide monitors.
- Introduce `layout.inlinePadding.base = space-between-l` and `layout.inlinePadding.wide = space-between-xl`; bridge exports `--app-layout-inline-padding-base`/`wide`.
- Existing gap tokens remain the cadence:
  - `gap.grid` for multi-column gutters.
  - `gap.section` for vertical spacing between major sections.
  - `gap.cluster` for internal card spacing.
- `main` element baseline style:
  - `margin-inline: auto; max-inline-size: var(--app-layout-container-max-width);`
  - `padding-inline: clamp(var(--app-layout-inline-padding-base), 4vw, var(--app-layout-inline-padding-wide));`
  - `padding-block: var(--app-gap-cluster);` switching to `var(--app-gap-section)` at `bp-lg`.
  - `display: flex; flex-direction: column; row-gap: var(--app-gap-section);`.

## Breakpoint Playbook

### `bp-xs` (0 – 479 px)

- All primary surfaces stack vertically; grids collapse to single track `grid-template-columns: 1fr`.
- Search:
  - Hero constrained to `max-inline-size: 45ch`; copy aligned `flex-start`.
  - Structured/Natural panels follow DOM order with `grid-template-areas: "structured" "natural"`.
  - Suggestions/Facets stack with collapsed horizontal padding.
  - Results cards use single-column list with `row-gap: var(--app-gap-section)`.
- Admin: sections render as a vertical list; telemetry dashboard sits below action panels.
- Docs: header content stacked; Redoc wrapper fills width with `min-height: 40rem` and `overflow: hidden`.
- Health: status, telemetry, and error details stack; introduce Oak alert components to replace raw text.
- Navigation and buttons preserve Oak tap targets (min 44 px) and focus outlines.

### `bp-sm` (480 – 767 px)

- Maintain single-column layout but allow wider hero text and form controls.
- Search hero may introduce supporting imagery below copy using `order` without altering DOM.
- Increase inline padding slightly via fluid clamp; ensure suggestions/facets adopt `gap.grid` for clarity.
- Admin quick links compress into stacked cards with emphasised headings.
- Docs metadata (schema link, last updated) sits beside the CTA within the header using `display: grid; grid-template-columns: 1fr auto;` but collapses gracefully below if content wraps.

### `bp-md` (768 – 1023 px)

- First breakpoint for two-column behaviour.
- Search:
  - Forms grid: `grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr)`; `grid-template-areas: "structured natural"` with DOM order preserved.
  - Secondary panels adopt two columns `minmax(16rem, 1fr)`.
  - Results switch to two columns `repeat(2, minmax(0, 1fr))` with consistent `row-gap`.
- Admin: action sections use `repeat(auto-fit, minmax(18rem, 1fr))`; telemetry (`ZeroHitDashboard`) spans full width via `grid-column: 1 / -1`.
- Docs: header becomes `grid-template-columns: 2fr 1fr`; Redoc wrapper capped at `min(100%, 70rem)`.
- Health: status cards occupy column one, diagnostics column two (`grid-template-columns: minmax(16rem, 1fr) minmax(16rem, 1fr)`).

### `bp-lg` (1024 – 1359 px)

- Container padding increases to `var(--app-layout-inline-padding-wide)`; block padding shifts to `var(--app-gap-section)`.
- Search hero supports an auxiliary column (`grid-template-columns: minmax(0, 3fr) minmax(0, 2fr)`), optional panel hidden below `bp-lg` remains `display: none`.
- Structured panel gains width priority (`minmax(0, 1.4fr)`), natural panel clamps at `minmax(18rem, 1fr)`.
- Secondary panels retain two columns but allow row wrap; results remain two columns with increased card padding.
- Admin action grid matches search forms; logs adopt `max-block-size: 16rem; overflow: auto`.
- Docs: Redoc wrapper uses `border-radius: var(--app-radius-card)` with Oak surface colours (`surfaceRaised`).
- Health: introduce summary sidebar with Oak badges while diagnostics list scrolls.

### `bp-xl` (1360 – 1759 px)

- Results grid expands to three columns when card width ≥ 22 rem (`grid-template-columns: repeat(3, minmax(0, 1fr))`).
- Search secondary content may add a third column for future metrics using `grid-auto-flow: column; auto-fit`.
- Admin dashboard arranges action cards in three columns, telemetry remains full width.
- Docs metadata shifts to fixed width sidebar (`minmax(16rem, auto)`) while content grid keeps `2fr 1fr` ratio.
- Health diagnostics allow optional third column via `grid-template-columns: minmax(16rem, 1fr) minmax(16rem, 1fr) minmax(16rem, 1fr)`; guard with `@supports (grid-template-columns)` feature queries to avoid regressions.

### `bp-xxl` (1760 px and above)

- Container clamp prevents layouts from exceeding `78rem`; centre the shell with auto margins.
- Search results maintain three columns but increase `gap.grid` via clamp to avoid cramped metrics (`gap: clamp(var(--app-gap-grid), 3vw, var(--app-gap-section))`).
- Admin and Health dashboards may introduce supplementary insight columns/forms while respecting the container cap.
- Ensure typography line length stays ≤ 75 ch by capping hero/paragraph widths with `max-inline-size` values.

## Accessibility & Testing Hooks

- DOM order always matches reading order; breakpoint changes rely on CSS grid areas and `order` modifiers only.
- Define focus outlines through semantic tokens so they remain visible on every surface at each breakpoint.
- Playwright MCP suite captures screenshots and layout assertions at 360 (xs), 800 (md), 1 200 (lg), and 2 000 (xxl) widths. Add selectors per section (`data-testid="search-hero"`, `"admin-run-panel"`, `"docs-spec-wrapper"`, `"health-status-card"`).
- Integrate axe checks into these runs to ensure heading hierarchy, landmarks, and `role="status"` regions persist.

## Implementation Notes

1. Extend `semanticThemeSpec` with breakpoint and inline padding entries; update the resolver and bridge to emit new CSS variables.
2. Refactor Search/Admin/Docs/Health wrappers to consume the breakpoint variables via Styled Components media queries.
3. Replace hard-coded min-widths (`20rem`, `900px`, etc.) with token-driven clamps defined above.
4. Update integration tests (`ThemeBridgeProvider`, `SearchPageClient.integration.test.tsx`) to assert new variables and responsive behaviour.
5. Add Playwright MCP scripts that exercise each breakpoint, capturing baselines before implementing responsive fixes.

Following this playbook keeps semantic tokens as the single source of truth and resolves the rigid grid issues observed in the 360 px and 2 000 px snapshots.
