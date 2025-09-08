# Architectural Refinements Plan (Deferred)

Status: Deferred from Part 2; execute after import hygiene and docs polish.

## Goals

- Introduce explicit DI injection in apps using `@oaknational/mcp-core` factory outputs.
- Remove any residual implicit lookups; document ownership of composition.

This stage is deliberately minimal, time‑boxed, and focused on onboarding and clarity.

## Adopted Workspace Structure

Adopt Option A from `workspace-structure-options.md`:

- `apps/` – runnable MCP servers
- `packages/core/` – core contracts/utilities (`@oaknational/mcp-core`)
- `packages/libs/` – reusable libraries
- `packages/providers/` – platform providers (node, workers)
- `packages/sdks/` – client SDKs

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

## Remaining Next Steps (time‑boxed, minimal)

1. Architecture index update (docs)
   - Add Option A layout and “Rules & Relationships” to `docs/architecture/README.md`.
   - Cross‑link `docs/architecture/provider-system.md` and `docs/onboarding.md`.
   - Bound: 60–90 min.

2. Placement verification (structure)
   - Confirm `packages/providers/` and `packages/sdks/` contain current providers/SDKs.
   - Completed: `oak-curriculum-sdk` rehomed to `packages/sdks/oak-curriculum-sdk`; workspace and tsconfig updated.
   - Bound: 15–30 min.

3. DI exemplar (code‑light)
   - In Notion app: centralise `createRuntime(nodeProviders)` in a single wiring point and thread runtime via params (no behaviour change).
   - Bound: 60–90 min.

4. Import policy confirmation (lint/docs)
   - Re‑assert package‑only inter‑workspace imports (`@oaknational/*`); allow intra‑package relatives; avoid private internals. No `@workspace/*` alias.
   - Ensure ESLint config comments and docs reflect policy. Status: rules enforced and applied across apps/libs; docs updated.
   - Bound: 30 min.

5. Decision record
   - Add ADR: “ADR‑041 Workspace Structure (Option A) – adopted”. Short, links to options doc.
   - Bound: 30–45 min.

6. Gates and push
   - Run format → type‑check → lint → test → build → identity‑check (0); commit and push.
   - Bound: 10–20 min.

Deferred (tracked elsewhere): Cloudflare Workers provider POC (`serverless-hosting-plan.md`), provider naming finalisation after POC.

## Minimal, Impactful Steps (time‑boxed)

1. Write provider system overview doc (referencing provider contracts) and link it from architecture index.
2. Add a concise onboarding guide that points to quick start, providers, and architecture.
3. Capture the open questions above with decision placeholders and next‑step prompts.
4. Optional: tiny DI exemplar commit (compose runtime in one app location) without behaviour change.

## Notes

- Keep scope tight; prioritise clarity over breadth. Defer deeper refactors to dedicated follow‑ups once decisions are made.
