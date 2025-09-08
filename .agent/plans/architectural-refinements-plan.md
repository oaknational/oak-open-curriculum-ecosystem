# Architectural Refinements Plan (Deferred)

Status: Executed (Notion app DI exemplar complete; docs and import policy updated). Remaining: doc cross-links, provider naming decision, Workers POC.

## Goals

- Introduce explicit DI injection in apps using `@oaknational/mcp-core` factory outputs.
- Remove any residual implicit lookups; document ownership of composition.

This stage is deliberately minimal, time‑boxed, and focused on onboarding and clarity.

## Adopted Workspace Structure

Adopt Option A from `workspace-structure-options.md`:

- `apps/` – runnable MCP servers
- `packages/core/` – core contracts/utilities (`@oaknational/mcp-core`)
- `packages/libs/` – reusable libraries
- `packages/runtime-adapters/` – runtime adapters (node, workers)
- `packages/sdks/` – client SDKs

## Scope

- Define app-level composition functions and pass providers/runtime to integrations/tools.
- Document patterns and examples; add tests where behaviourful.

### Deliverables (documentation first, minimal code changes)

- Provider system overview (structure, contracts, DI usage): `docs/architecture/provider-system.md`
- Onboarding guide (links: quick start, architecture, providers): `docs/onboarding.md`
- Plan updated with open questions and decision placeholders (this file)

## Progress

- Notion app DI exemplar implemented: runtime composed centrally and injected into server/tool handlers; no behaviour change; tests unchanged.
- Import policy enforced across workspace; docs reflect policy; ESLint boundaries green.
- Docs added/updated:
  - `docs/architecture/provider-system.md` (provider overview)
  - `docs/onboarding.md` (quick start and links)
  - `docs/architecture/README.md` updated with Option A layout and Rules & Relationships; ADR added.
  - `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md` present.
- Placement verification done: `oak-curriculum-sdk` rehomed to `packages/sdks/oak-curriculum-sdk`.
- Quality gates from repo root all PASS: format, type-check, lint, test, build, identity-check.

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

## Remaining Next Steps (updated)

1. Architecture cross-links (docs)
   - Ensure `docs/architecture/README.md` explicitly links to `provider-system.md` and `onboarding.md` (Onboarding already references provider-system; add back-links for completeness).
   - Bound: 10–15 min.

2. Provider folder naming decision
   - Decide whether to keep `providers/` or adopt an alternative (`platforms/`, `runtimes/`, `adapters/`), document outcome, update references if changed.
   - Bound: 15–30 min (docs-only if unchanged).

3. Workers provider POC (deferred)
   - Track in `serverless-hosting-plan.md`; validate pure web APIs and surface for Workers; add contract tests.
   - Bound: separate POC.

4. Optional: extend DI to Oak Curriculum MCP server
   - Compose `CoreRuntime` in `apps/oak-curriculum-mcp` wiring; inject runtime+logger and SDK client (replace env-driven lazy client) into tool handling.
   - Bound: 2–4 hours including tests (no behaviour change).

## Curriculum MCP DI Steps (detailed)

1. Add runtime composition (wiring)
   - In `apps/oak-curriculum-mcp/src/app/wiring.ts`, compose `CoreRuntime` using `@oaknational/mcp-core.createRuntime` with node providers (logger bridge, clock, storage).
   - Expose `runtime` alongside `logger` and `config` in `WiredDependencies`.

2. Inject SDK client via DI
   - Replace env-driven lazy client in `tools/handlers/tool-handler.ts` with an injected client factory or client instance.
   - Update `createMcpOrgan()` and `handleToolCall()` to accept the injected client (and logger/runtime if desired for logging).
   - Source `apiKey` from `wireDependencies(config)` and construct the client (or a factory) there.

3. Thread dependencies end-to-end
   - Update `wireDependencies` to return `{ logger, runtime, mcpOrgan, config }` where `mcpOrgan` is constructed with injected client.
   - Ensure `server.ts` uses the injected organ and does not perform any env lookups.

4. Tests (no network)
   - Provide a test client stub/factory in unit/integration tests; remove any reliance on process env.
   - Add a small DI test verifying that injected client is used and calls are delegated.

5. Docs
   - Add a short DI note to `apps/oak-curriculum-mcp/README.md` (or the architecture docs) indicating runtime and client injection points.

6. Quality gates
   - Run format → type‑check → lint → test → build → identity‑check from repo root.

Deferred (tracked elsewhere): Cloudflare Workers provider POC (`serverless-hosting-plan.md`), provider naming finalisation after POC.

## Minimal, Impactful Steps (time‑boxed)

1. Write provider system overview doc (referencing provider contracts) and link it from architecture index.
2. Add a concise onboarding guide that points to quick start, providers, and architecture.
3. Capture the open questions above with decision placeholders and next‑step prompts.
4. Optional: tiny DI exemplar commit (compose runtime in one app location) without behaviour change.

## Notes

- Keep scope tight; prioritise clarity over breadth. Defer deeper refactors to dedicated follow‑ups once decisions are made.
