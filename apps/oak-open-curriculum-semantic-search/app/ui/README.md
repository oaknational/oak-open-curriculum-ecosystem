# UI Package Layout

Semantic search UI is organised into four layers:

- `global/` – cross-cutting primitives (header, theming, fixture controls, layout helpers)
- `search/` – landing, structured, and natural search surfaces plus supporting hooks/utilities
- `ops/` – operational surfaces (admin, status) that lean on the global layout primitives
- `shared/` – token helpers and shared utilities consumed by all layers

Components favour composability: global primitives expose tokens and responsive wrappers; surface directories compose them into full pages; leaf modules (e.g. hooks, utilities) live alongside their consumers. Tests sit next to the code they prove (`*.unit.test.ts` for pure functions, `*.integration.test.tsx` for composed components) so TDD remains the default workflow.

## Header contract

- `global/Header/Header.tsx` renders a three-area CSS grid (`logo`, `nav`, `utilities`) that collapses to a stacked column layout below the `app.layout.breakpoints.lg` breakpoint. Padding tokens map directly to the theme helpers: `getSpacingVar('inline-base')` on small screens and `getSpacingVar('inline-wide')` at `≥ xl`.
- Utilities (theme selector + fixture toggle) live inside a column-stacked cluster so the controls stay left aligned on narrow viewports whilst right-aligning at desktop sizes. Token usage (`app.space.gap.stack`, `app.space.gap.cluster`) mirrors the `snagging-system-foundations.md` blueprint.
- Navigation metadata is centralised in `global/Header/useNavItems.ts`, which now labels the landing route as `Home` and surfaces the fixture toggle via the shared `HeaderUtilityItemType` definition.

## Fixture mode context

- `global/Fixture/FixtureModeContext.tsx` bootstraps the current mode from cookies during SSR and exposes `useFixtureMode()` for client components.
- `global/Header/Header.tsx` consumes the context so the `SearchFixtureModeToggle` reflects existing state when the header renders; interactions dispatch `setMode` before the server refetch updates downstream pages.
- Surface-level notices (e.g. the search hero pill) should read from the same hook to avoid drift between header controls and body copy.
