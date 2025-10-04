# Semantic Search UX Foundations

## Guiding Principles

- **Design for evolution**: favour composable primitives that can be rearranged without deep rewrites. Shared layout scaffolding, typography clusters, and motion primitives should live in `ui/global` so teams can iterate on features by swapping sections, not rewriting pages.
- **Surface intent first**: every screen begins with a succinct summary of purpose, primary actions, and current state. Results pages place findings above the fold; operations pages elevate system health before controls.
- **Responsive by default**: treat breakpoints as first-class tokens. Each component owns a minimal layout contract (stack orientation, gap tokens, min widths) and defers to composed grids for complex behaviour.
- **Accessible interactions**: ensure focus order mirrors semantic order, provide motion fallbacks, and keep live regions scoped to meaningful changes.
- **Deterministic modes**: fixture and live data paths must share UI affordances. Controls for switching mode live in the header, while contextual notices remain close to the affected surface.

## Directory & Module Structure

```text
app/ui
├── global
│   ├── Header
│   │   ├── Header.tsx
│   │   ├── Header.styles.ts
│   │   ├── Header.test.tsx
│   │   └── index.ts
│   ├── Theme
│   │   └── (theme bridges, selectors)
│   ├── Fixture
│   │   ├── FixtureModeMenu.tsx
│   │   └── FixtureNotice.tsx
│   ├── Layout
│   │   ├── PageContainer.tsx
│   │   ├── Grid.tsx
│   │   └── index.ts
│   └── README.md (explains layering)
├── search
│   ├── Landing
│   ├── Structured
│   ├── Natural
│   ├── Components (Hero, Controls, Results, Secondary, Skeletons)
│   └── hooks
├── ops
│   ├── Admin
│   └── Status
└── shared (tokens, breakpoints, typography clusters, motion utils)
```

- Introduce barrel `app/ui/index.ts` exposing `global`, `search`, and `ops` namespaces to keep imports short.
- Tests mirror the directory tree with `.test.tsx` or `.integration.test.tsx` collocated near their component.

## Layout System

- **Page container**: single component exporting the current `PageContainer`/`OperationsPage` logic. Accepts props for `as`, `variant` (`default`, `ops`, `landing`), and optional `maxWidth` override.
- **Grid primitives**: provide `ResponsiveGrid` and `Cluster` components with prop-driven templates (e.g. `columns={{ base: 1, lg: '1fr minmax(0,1fr)' }}`). Use CSS variables for gaps; fall back to tokens derived from `ThemeBridgeProvider`.
- **Stack tokens**: define spacing enums (`'stack-xs'`, `'cluster-s'`) in `shared/spacing.ts` mapping to CSS variables. Components reference enums, not raw variables, making future theming adjustments trivial.

## Header & Navigation Blueprint

- Grid layout with areas `logo`, `nav`, `utilities`. Utilities slot hosts the theme toggle and the new fixture mode menu.
- On `max-width < md`, utilities wrap under nav with left alignment; theme and fixture selectors stack vertically.
- Introduce `useNavItems()` to centralise labelling (fixing "Homes"). Provide optional icon slot for Oak mark link.
- Persist skip links as the first element inside `body` (or directly beneath header) to retain keyboard access.

### Header Grid Specification (2025-10-04)

- **Base / ≤ `md` (≤768px)**: single-column CSS grid ordered `logo` → `nav` → `utilities`, `row-gap: getSpacingVar('stack')`, `padding-inline: getSpacingVar('inline-base')`, and `justify-items: start` to keep utilities left aligned.
- **≥ `lg` (≥1024px)**: three-column grid `auto minmax(0, 1fr) auto` with areas `logo nav utilities`, `column-gap: getSpacingVar('cluster')`, `row-gap: getSpacingVar('section')`, `align-items: center`, and utilities anchored with `justify-self: end` while remaining flex-stacked internally.
- **≥ `xl` (≥1360px)**: promote inline padding to `getSpacingVar('inline-wide')` and optionally clamp nav width with `getAppTheme(theme).app.layout.containerMaxWidth` to prevent drift on ultra-wide viewports.

## Fixture Mode Architecture

- Promote `FixtureModeContext` within `ui/global/Fixture`. Header menu dispatches mode changes via context, which proxies to the existing server action.
- `FixtureNotice` becomes a lightweight pill component with variants (`info`, `warning`, `error`). Surfaces pull copy from context, not from internal maps.
- All pages consume the context to know current mode; server components still read cookies for SSR so UI stays in sync on first render.

## Search Surface Composition

- **Hero region**: new `SearchHero` accepts `variant`, `ctaButtons`, and supporting copy tokens. Provide a `HeroLayout` that centres content on wide screens while collapsing gracefully on mobile.
- **Controls**: break into `SearchControlPanel`, `SearchForm`, and `SearchModeTabs`. Controls grid leverages `ResponsiveGrid` with column maps: `{ base: 1, lg: 'minmax(280px, 0.85fr) minmax(320px, 1.15fr)' }`.
- **Results**: wrap `SearchResults` in `ResultsContainer` offering sticky summary, motion-safe hover states, and accent borders. Provide `ResultCard` component for more pronounced emphasis.
- **Secondary content**: move suggestions/facets into `SearchSupportPanel`. On wide screens, render alongside results; on narrow viewports, use accordions below primary content.
- **Skeletons**: add `ResultsSkeleton` and `SummarySkeleton` components under `search/components/Skeletons.tsx` using theme-aware shimmer, disabled when `prefers-reduced-motion` is set.

## Natural Language Fixture Reliability

- Update request handler guard order: resolve fixture mode before `llmEnabled()` check. Only enforce the LLM gate for live mode requests.
- Expand integration tests to cover `(fixtures, fixtures-empty, fixtures-error, live)` for natural-language route, ensuring payload shape matches client expectations.
- Ensure UI error messaging distinguishes fixture-simulated errors from network issues.

## Admin & Status Surface Patterns

- **Admin**: adopt `OperationsBlueprint` with sections (`Overview`, `Quick Actions`, `Jobs`, `Telemetry`). Job cards include status chips, descriptive copy, and collapsible logs with auto-scroll.
- **Status**: add `StatusSummaryCard` featuring severity icon, overall tone, timestamp, and quick links. Service cards gain consistent height, optional action links, and iconography.
- Provide shared `OpsCard` and `OpsSectionHeader` primitives to keep styling consistent across operations surfaces.

## Testing & Tooling

- Rebaseline Playwright flows after layout updates (landing, structured, natural, admin, status). Capture light/dark + mobile/desktop snapshots.
- Add reduced-motion snapshots to guard animation fallbacks.
- Introduce Jest helpers for asserting layout token usage (e.g. `expectStylesToUseToken(component, '--app-gap-section')`).

## Process Notes

- Run Workstreams sequentially where dependencies exist (global → header → search surfaces → ops).
- After each workstream, update `snagging.md` with evidence (screenshots, logs) and record findings in `snagging.md` until items are resolved.
- Keep change sets small (one workstream per PR) to reduce review burden and maintain flow state.
