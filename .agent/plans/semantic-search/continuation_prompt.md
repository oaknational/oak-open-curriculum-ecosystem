Plan: .agent/plans/semantic-search/semantic-search-target-alignment-plan.md
Context: .agent/plans/semantic-search/semantic-search-target-alignment-context.md
Theme inventory: .agent/plans/semantic-search/semantic-theme-inventory.md
Theme spec design: .agent/plans/semantic-search/semantic-theme-spec.md
Storybook reference: <https://components.thenational.academy/?path=/docs/introduction--docs>
Next.js + Styled Components reference: .agent/reference-docs/ui/styled-components-in-nextjs.md

All work must remain aligned with `GO.md`, `.agent/directives-and-memory/AGENT.md`, `.agent/directives-and-memory/rules.md`, and `docs/agent-guidance/testing-strategy.md`. Maintain GO cadence (ACTION → self REVIEW, grounding every few item) and British spelling.

Current status (2025-09-26): Oak token inventory logged; `semanticThemeSpec` design authored. Ready to implement the typed spec, helper resolvers, and tests, then reconnect the Theme Bridge before resuming the remaining Phase 1 workstreams (ingestion, telemetry, admin operations).

Immediate focus for the next session:

- Translate the design notes into code (`semanticThemeSpec`, derived types, helper resolvers).
- Extend unit tests (`theme-factory.unit.test.ts`, `ThemeCssVars.unit.test.tsx`) to lock the new contract.
- Rewire the Theme Bridge to consume the resolved tokens; rerun quality gates.
