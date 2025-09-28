# Semantic Search Phase 1 – UX Context Snapshot

_Last updated: 2025-09-30 (fixture source enrichment + module outline)_

## Active Focus

- Execute the UX plan (`semantic-search-phase-1-ux.md`): responsive grids, surface hierarchy, accessibility fixes, and cross-device polish for Search, Admin, Docs, and Health pages.
- Ensure semantic theme tokens, bridge CSS variables, and global styles remain the single source of truth across light/dark modes.
- Use automated visual + accessibility testing (Playwright, axe) to protect layout and typography contracts.
- Progress immediate Search tasks (audit → prototype → implementation) while drafting the Health shell UX contract; keep artefacts logged per GO cadence.
- Run the full quality gate (`pnpm qg`) regularly after substantive changes to uphold repository standards.

## Current State

- Semantic tokens (`semanticThemeSpec`, resolver helpers) exist with brand palette entries and CSS variable bridge; layout breakpoints/clamps now drive Admin and Docs via shared Styled Components wrappers.
- `ThemeGlobalStyle` paints `html`, `body`, and `#app-theme-root`; light/dark `<meta name="theme-color">` now resolves from semantic `bg-primary` tokens with unit coverage.
- Playwright responsive suite enforces Admin/Docs behaviour at `bp-xxl` (container width clamped 1 200 – 1 260 px, axe violations = 0); Admin `bp-md` and Health `bp-xs` remain guarded until their UX work lands.
- Search tests now pass at `bp-xs`/`bp-md`/`bp-lg` with seeded fixtures; structured/natural forms expose valid tabpanels and high-contrast submit buttons. Hero copy still needs tightening at `bp-lg` to hit the 45 ch target.
- Navigation and hero layouts still waste space on phones; `/healthz` intentionally serves raw JSON while a separate status page UI is planned to surface the same data with Oak styling.
- Playwright environment sets `SEMANTIC_SEARCH_USE_FIXTURES=true` and `NEXT_DISABLE_DEV_ERRORS=1`, producing deterministic responses while keeping the dev overlay out of axe checks.
- Platform status page design drafted: reuse `PageContainer`, hero summary banner, `bp-md` two-column card grid (status vs diagnostics), accessible `role="status"` region, and Accept header toggle so users can consume UI or raw JSON while `/healthz` remains an API endpoint.
- Theme selector radios now resolve semantic tokens to Oak hex values in dark mode, delivering visible outlines validated by integration tests (`rgb(228, 228, 228)` / `rgb(255, 255, 255)`).
- 2025-09-28 update: hero + controls now stay stacked below the `xl` breakpoint to keep widths within the container clamp; the Playwright overflow guard at 1 100 px now passes (artefacts in `tests/visual/responsive-baseline.spec.ts` → `Overflow guard 1100px`, see `test-results/responsive-baseline-Search-e065d-flow-the-viewport-at-1100px-Google-Chrome`).
- Structured search UI includes the Phase selector (primary/secondary) while natural search scopes default to auto so the backend can infer intent unless users pick Units/Lessons/Sequences explicitly.
- Playwright fixture toggle (`SEMANTIC_SEARCH_USE_FIXTURES`) now underpins deterministic Search assertions; structured "All content" calls fan out across lesson/unit/sequence buckets and fixtures mirror that multi-scope payload. Fixture sources for KS2 maths, KS4 maths, KS3 history, and KS3 art are captured with manual suggestions ready for builder modelling.
- Fixture reference notes (`fixtures/REFERENCE.md`) catalogue provenance and schema alignment; `app/ui/search-fixtures/README.md` outlines forthcoming data modules and builders so the UX stream can centralise fixture logic without violating the cardinal rule.
- 2025-09-28: `SearchResults.unit.test.tsx` now mounts the new `mode`/`multiBuckets` signature and asserts multi-scope bucket rendering so TypeScript aligns with the component API before rerunning `pnpm make`.
- 2025-09-28: `pnpm make` now passes end-to-end after the SearchResults unit test update cleared the type-check regression.
- Wide-view hero layout still needs validation that structured and natural panels remain visible above the fold at `xl`/`xxl`; adjust `HeroControlsCluster` track ratios if further Playwright sweeps highlight controls slipping below the hero copy.
- 2025-09-29: API docs Redoc theme now resolves Oak UI tokens to hex (`resolveUiColor`), the page container uses the neutral background token with elevated card styling, and integration coverage asserts the options payload stays in-valid colour space (`app/api/docs/page.integration.test.tsx`).
- 2025-09-29: Admin shell clamps to the semantic container width, clears inherited hashes on mount, and Playwright regression coverage (`Admin page responsive regressions`) now captures screenshots plus overflow/axe assertions across lg/md/xxl viewports.
- 2025-09-29: Full `pnpm qg` suite passes following the docs/admin fixes and the markdownlint newline correction; continue to monitor Notion MCP E2E flake potential but no failures observed in the latest run.
- 2025-09-30: Hero accent text contrast iteration is paused until the fixture/toggle work lands; revisit once deterministic data paths are complete.

## Tooling & References

- Dev server: `pnpm dev` (Next.js; see `/tmp/semantic-dev.log` for output).
- Playwright MCP available via `pnpm dlx @playwright/mcp@latest` (server alias `playwright`).
- Storybook reference: <https://components.thenational.academy/?path=/docs/introduction--docs>
- Theme documentation: `.agent/plans/semantic-search/semantic-theme-inventory.md`, `.agent/plans/semantic-search/semantic-theme-spec.md`, `apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md`.

## Outstanding UX Questions

- Do we need Oak-provided dark-mode token variants (icons, emphasis surfaces), or should we formalise local overrides? (Still open.)
- Can Oak Components expose precomputed CSS variable sheets to simplify runtime bridge logic? (Still open.)
- Are additional breakpoints required once Search hero media lands, or does the `bp-xs` → `bp-xxl` ramp remain sufficient?
- What telemetry/health UI patterns best balance clarity and brand tone once functionality delivers structured outputs? (To be resolved alongside the status page effort after fixtures land.)
- When should we resume hero polish (clamp, accent styling) after fixtures and status page work completes? (Track post-fixture follow-up.)

## Interactions with Functionality Stream

- UX relies on functionality work for reliable telemetry, health, and admin status data.
- Observability improvements must feed UX redesigns so error states display actionable messaging.
- Health UI shell depends on structured responses; keep footage of raw JSON states available for regression review until functionality shifts.
- Keep documentation updates sync’d with functionality plan (`semantic-search-phase-1-functionality-context.md`).
