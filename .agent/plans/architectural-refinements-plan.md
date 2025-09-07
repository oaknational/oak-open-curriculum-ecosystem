# Architectural Refinements Plan (Deferred)

Status: Deferred from Part 2; execute after import hygiene and docs polish.

## Goals

- Introduce explicit DI injection in apps using `@oaknational/mcp-core` factory outputs.
- Remove any residual implicit lookups; document ownership of composition.

This stage is deliberately minimal, time‑boxed, and focused on onboarding and clarity.

## Scope

- Define app-level composition functions and pass providers/runtime to integrations/tools.
- Document patterns and examples; add tests where behaviourful.

### Deliverables (documentation first, minimal code changes)

- Provider system overview (structure, contracts, DI usage): `docs/architecture/provider-system.md`
- Onboarding guide (links: quick start, architecture, providers): `docs/onboarding.md`
- Plan updated with open questions and decision placeholders (this file)

## Non-Goals

- Feature work; only structural composition improvements.

## Acceptance

- Apps acquire dependencies exclusively via injected runtime/providers.
- Lint boundaries remain green; tests unchanged.
- Docs updated with examples and guidance.

## Open Questions (to discuss/decide)

- Providers folder naming: is there a more semantically useful name than `providers/`?
  - Candidate alternatives: `platforms/`, `runtimes/`, `adapters/`.
- Cloudflare Workers support status: what is needed to ensure web APIs only (no Node deps)?
  - Inventory Node usages; define minimum provider surface for Workers; agree validation strategy.
- Canonical tiering: apps/services → libs → core/utilities — what does “excellent” look like here?
  - Define ownership and dependency arrows; publish boundaries and examples.
- Onboarding docs: what must a new dev read first, and in what order? Keep it fast and accurate.

## Minimal, Impactful Steps (time‑boxed)

1. Write provider system overview doc (referencing provider contracts) and link it from architecture index.
2. Add a concise onboarding guide that points to quick start, providers, and architecture.
3. Capture the open questions above with decision placeholders and next‑step prompts.
4. Optional: tiny DI exemplar commit (compose runtime in one app location) without behaviour change.

## Notes

- Keep scope tight; prioritise clarity over breadth. Defer deeper refactors to dedicated follow‑ups once decisions are made.
