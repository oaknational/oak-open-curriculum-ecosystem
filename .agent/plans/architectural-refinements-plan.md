# Architectural Refinements Plan (Deferred)

Status: Deferred from Part 2; execute after import hygiene and docs polish.

## Goals

- Introduce explicit DI injection in apps using `@oaknational/mcp-core` factory outputs.
- Remove any residual implicit lookups; document ownership of composition.

## Scope

- Define app-level composition functions and pass providers/runtime to integrations/tools.
- Document patterns and examples; add tests where behaviourful.

## Non-Goals

- Feature work; only structural composition improvements.

## Acceptance

- Apps acquire dependencies exclusively via injected runtime/providers.
- Lint boundaries remain green; tests unchanged.
- Docs updated with examples and guidance.
