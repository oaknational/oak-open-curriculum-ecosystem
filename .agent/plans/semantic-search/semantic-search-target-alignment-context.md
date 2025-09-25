# Semantic Search Target Alignment – Context Snapshot

_Last updated: 2025-09-26 (semantic theme alignment planning)_

## Active Focus

- Align semantic-search light/dark themes with Oak Components tokens while keeping SSR hydration stable.
- Remove residual bespoke styling; ensure all UI surfaces consume Oak primitives and spacing/grid conventions.
- Extend Phase 1 beyond UI: harden ingestion, query execution, telemetry, and admin workflows so the service is production-ready.
- Prepare expanded tests and Playwright inspection to validate the refreshed design.

## Recent Progress

- Documented Oak colour/typography/spacing/radius exports and Storybook anchors in `.agent/plans/semantic-search/semantic-theme-inventory.md`.
- Implemented the `semanticThemeSpec`, helper resolvers, and associated tests; Playwright checks confirm CSS variables expose the expected values.
- Verified button/background tokens align with the spec; identified that typography/navigation still inherit browser defaults.

## Immediate Next Actions

- Apply `bg-primary`/`text-primary` (and related tokens) at the global and page-wrapper levels so light/dark themes are honoured end-to-end.
- Audit custom wrappers (header, forms, labels, nav) and replace inherited/hex colours with Oak token props.
- Re-run Playwright probes across modes after the fixes, then resume Phase 1 ingestion/telemetry work.

## Operational Notes

- Dev server: `pnpm dev` (currently bound on localhost:3000; logs at `/tmp/semantic-dev.log`).
- Playwright MCP tools available via `pnpm dlx @playwright/mcp@latest` (server alias `playwright`).
- Reference Storybook: https://components.thenational.academy/?path=/docs/introduction--docs
- Theme references captured in `.agent/plans/semantic-search/semantic-theme-inventory.md`, `.agent/plans/semantic-search/semantic-theme-spec.md`, and `apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md` (Oak integration guide).
- Hydration mitigation: inline pre-hydration script remains the stop-gap; revisit once Oak publishes aligned SSR hashes.
- Global foreground/background currently default to browser values; short-term fix must live in our theme bridge until Oak Components exposes dark-mode-aware global styles.

## Key Constraints & Decisions

- All theme data must ultimately satisfy Oak exports (`OakTheme`, `oakUiRoleTokens`, spacing/font tokens); derive local types from constant specs rather than handwritten interfaces.
- Type generation (`pnpm type-gen`) stays the single source of truth for SDK contracts—no manual schema edits.
- Use British spelling everywhere (project standard).

## Outstanding Questions

- Where Oak lacks a dark-mode-appropriate token (e.g. icon accents), decide whether to introduce a local constant or request an upstream addition.
- Confirm whether Oak Components can expose precomputed CSS variable sheets to simplify our Theme Bridge in a later phase.
- Determine operational levers (cron cadence, telemetry thresholds) needed once ingestion hardening tasks resume.
- Check whether Oak Components intends to ship first-class dark theme support; document necessary overrides for downstream apps in the meantime.
