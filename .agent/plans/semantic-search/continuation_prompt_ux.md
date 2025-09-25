Plan: .agent/plans/semantic-search/semantic-search-phase-1-ux.md
Context: .agent/plans/semantic-search/semantic-search-phase-1-ux-context.md
Theme inventory: .agent/plans/semantic-search/semantic-theme-inventory.md
Theme spec: .agent/plans/semantic-search/semantic-theme-spec.md
Storybook reference: <https://components.thenational.academy/?path=/docs/introduction--docs>
Next.js + Styled Components reference: .agent/reference-docs/ui/styled-components-in-nextjs.md

All work must align with `GO.md`, `.agent/directives-and-memory/AGENT.md`, `.agent/directives-and-memory/rules.md`, and `docs/agent-guidance/testing-strategy.md`. Maintain GO cadence (ACTION → REVIEW with grounding cadence) and use British spelling.

Current status (2025-09-26): Semantic theme tokens and bridge exist with test coverage; Playwright screenshots reveal rigid grids and spacing issues across breakpoints. UX plan targets responsive layout overhaul, surface hierarchy, and accessibility polish.

Immediate focus for next UX session:

- Draft responsive layout architecture (breakpoints, grid tokens, stacking rules) and validate with Oak guidance.
- Capture failing Playwright/visual tests across 360/800/1200/2000 widths for Search, Admin, Docs, Health.
- Begin implementing Search page responsive grid + hero/card refinements under new test constraints.

Key context reminders:

- Dev server runs with `pnpm dev` (falls back to port 3001 if 3000 is occupied); logs stream to `/tmp/semantic-dev.log`. Use Playwright MCP (`pnpm dlx @playwright/mcp@latest`) for breakpoint screenshots and visual assertions.
- Observed issues to address: hero + forms remain side-by-side at 360 px, admin “Run” panels are tall strips with empty surroundings, Swagger docs collapse into a narrow column, and health telemetry presents raw JSON/error text. These should guide responsive and hierarchy fixes.
