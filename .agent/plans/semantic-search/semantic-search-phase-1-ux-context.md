# Semantic Search Phase 1 – UX Context Snapshot

_Last updated: 2025-09-26 (post Admin/Docs baseline refresh)_

## Active Focus

- Execute the UX plan (`semantic-search-phase-1-ux.md`): responsive grids, surface hierarchy, accessibility fixes, and cross-device polish for Search, Admin, Docs, and Health pages.
- Ensure semantic theme tokens, bridge CSS variables, and global styles remain the single source of truth across light/dark modes.
- Use automated visual + accessibility testing (Playwright, axe) to protect layout and typography contracts.
- Progress immediate Search tasks (audit → prototype → implementation) while drafting the Health shell UX contract; keep artefacts logged per GO cadence.
- Run the full quality gate (`pnpm qg`) regularly after substantive changes to uphold repository standards.

## Current State

- Semantic tokens (`semanticThemeSpec`, resolver helpers) exist with brand palette entries and CSS variable bridge; layout breakpoints/clamps now drive Admin and Docs via shared Styled Components wrappers.
- `ThemeGlobalStyle` paints `html`, `body`, and `#app-theme-root`; light/dark `<meta name="theme-color">` now resolves from semantic `bg-primary` tokens with unit coverage.
- Playwright responsive suite enforces Admin/Docs behaviour at `bp-xxl` (container width clamped 1 200 – 1 260 px, axe violations = 0); Search `bp-xs`/`bp-lg`, Admin `bp-md`, and Health `bp-xs` still marked `test.fail()` pending UX work.
- Navigation and hero layouts still waste space on phones; Health surface remains raw JSON awaiting UI shell brief.
- 2025-09-27 audit confirms Search controls stay stacked across `bp-xs`/`bp-md`/`bp-lg` (media queries not applying) and hero clamp exceeds 45 ch, reaffirming responsive CSS gaps.
- Follow-up prototype swaps the Search layout media queries to use semantic breakpoints via `resolveBreakpoint`; manual Playwright sampling shows `ControlsGrid` now aligns to two columns at 800 px while `SecondaryGrid` and `ResultsGrid` await data-backed assertions.

## Tooling & References

- Dev server: `pnpm dev` (Next.js; see `/tmp/semantic-dev.log` for output).
- Playwright MCP available via `pnpm dlx @playwright/mcp@latest` (server alias `playwright`).
- Storybook reference: https://components.thenational.academy/?path=/docs/introduction--docs
- Theme documentation: `.agent/plans/semantic-search/semantic-theme-inventory.md`, `.agent/plans/semantic-search/semantic-theme-spec.md`, `apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md`.

## Outstanding UX Questions

- Do we need Oak-provided dark-mode token variants (icons, emphasis surfaces), or should we formalise local overrides? (Still open.)
- Can Oak Components expose precomputed CSS variable sheets to simplify runtime bridge logic? (Still open.)
- Are additional breakpoints required once Search hero media lands, or does the `bp-xs` → `bp-xxl` ramp remain sufficient?
- What telemetry/health UI patterns best balance clarity and brand tone once functionality delivers structured outputs? (Feeds into Health shell work.)

## Interactions with Functionality Stream

- UX relies on functionality work for reliable telemetry, health, and admin status data.
- Observability improvements must feed UX redesigns so error states display actionable messaging.
- Health UI shell depends on structured responses; keep footage of raw JSON states available for regression review until functionality shifts.
- Keep documentation updates sync’d with functionality plan (`semantic-search-phase-1-functionality-context.md`).
