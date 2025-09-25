# Semantic Search Phase 1 – UX Context Snapshot

_Last updated: 2025-09-26_

## Active Focus

- Execute the UX plan (`semantic-search-phase-1-ux.md`): responsive grids, surface hierarchy, accessibility fixes, and cross-device polish for Search, Admin, Docs, and Health pages.
- Ensure semantic theme tokens, bridge CSS variables, and global styles remain the single source of truth across light/dark modes.
- Use automated visual + accessibility testing (Playwright, axe) to protect layout and typography contracts.

## Current State

- Semantic tokens (`semanticThemeSpec`, resolver helpers) exist with brand palette entries and CSS variable bridge.
- `ThemeGlobalStyle` paints `html`, `body`, and `#app-theme-root`; integration tests guard the injection order.
- Navigation and typography still inherit defaults; hero and card layouts waste space and ignore mobile needs.
- Playwright snapshots highlight rigid grids (20 rem min columns) that fail on 360 px viewports.

## Tooling & References

- Dev server: `pnpm dev` (Next.js; see `/tmp/semantic-dev.log` for output).
- Playwright MCP available via `pnpm dlx @playwright/mcp@latest` (server alias `playwright`).
- Storybook reference: https://components.thenational.academy/?path=/docs/introduction--docs
- Theme documentation: `.agent/plans/semantic-search/semantic-theme-inventory.md`, `.agent/plans/semantic-search/semantic-theme-spec.md`, `apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md`.

## Outstanding UX Questions

- Do we need Oak-provided dark-mode token variants (icons, emphasis surfaces), or should we formalise local overrides?
- Can Oak Components expose precomputed CSS variable sheets to simplify runtime bridge logic?
- What responsive breakpoints best mirror other Oak products (OWA) while meeting accessibility guidelines?
- How should telemetry/health data be visualised to balance clarity and brand tone once functionality work delivers structured outputs?

## Interactions with Functionality Stream

- UX relies on functionality work for reliable telemetry, health, and admin status data.
- Observability improvements must feed UX redesigns so error states display actionable messaging.
- Keep documentation updates sync’d with functionality plan (`semantic-search-phase-1-functionality-context.md`).
