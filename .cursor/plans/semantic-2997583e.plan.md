<!-- 2997583e-a641-4b3c-85c3-f42860118bc1 1e20919c-cce5-49e5-96c1-5ae9e7c82b27 -->

# Semantic Search Recovery Implementation Plan

_Implementation plan for `.agent/plans/semantic-search/snagging-resolution-plan.md`; treat that document as the source of truth. Record progress updates directly within it._

## Reflection Highlights

- Hold the Cardinal Rule: all runtime/static types must flow from `pnpm type-gen` outputs.
- Prioritise simplicity via accessors and behavioural proofs rather than literal re-exports.
- Lean on TDD: add/repair behavioural tests before adjusting generators or consumers.

## Phase 1 – Regenerate canonical MCP helper surface

- Enhance `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts` to emit generic helpers (`getToolFromOperationId<TId>()`, `getOperationIdFromToolName<TName>()`, literal-driven readonly maps) and associated exported type aliases only.
- Emit complementary `types.ts` by adding a generator (likely `generate-types-file.ts`) that `import type` symbols from the generated definitions, defining `ToolArgs<TName>`, `ToolResult<TName>`, etc., without touching literals.
- Remove the now-unneeded synonym generator; rely on canonical enums from `path-parameters.ts` and let downstream agents handle any fuzzy matching.
- Add behavioural generator tests covering the new helpers by importing the generated files and exercising representative lookups and type-only imports.

## Phase 2 – Curate generated barrel and SDK entry point

- Adjust generator output (e.g., `generate-index-file.ts`) so the barrel explicitly re-exports only approved helpers/types; ensure `src/types/generated/api-schema/mcp-tools/index.ts` reflects this surface.
- Update `packages/sdks/oak-curriculum-sdk/src/index.ts` to re-export solely from the curated barrel and remove `MCP_TOOLS` exposure.
- Add runtime tests that import the SDK entry (`src/index.ts`) and assert the available exports match the allow list.

## Phase 3 – Align runtime code with accessor helpers

- Create/relocate SDK-owned helpers (e.g., `typeSafeEntries.ts`) to replace cross-package dependencies.
- Update consumers like `src/mcp/universal-tools.ts` and related runtime modules to enumerate tools via `toolNames`/`getToolFromToolName`, guarding the readonly data with non-mutating copies where needed.
- Cover these paths with unit/integration tests to prove enumeration, lookup, and error handling operate through the accessor surface only.

## Phase 4 – Repair MCP registry invocation flow

- Modify `type-gen/typegen/mcp-tools/parts/generate-lib-file.ts` so the generated registry accepts an `OakApiPathBasedClient`, forwarding it as the first argument to each descriptor’s `invoke`.
- Regenerate `lib.ts` and adjust runtime callers (e.g., MCP servers) to supply the client explicitly.
- Add behavioural tests around `McpToolRegistry.call` validating success, validation failures, and unknown-tool handling while confirming the client is forwarded.

## Phase 5 – Behaviouralise generator & doc tooling tests

- Refactor existing generator tests to assert observable behaviour (e.g., helper functions returning expected descriptors) instead of snapshot/string checks.
- Update doc-generation scripts such as `type-gen/generate-ai-doc.ts` to rely on accessor helpers; add tests proving they enumerate tools without accessing literals.
- Include meta-tests ensuring `definitions.ts` and `types.ts` import each other only via `import type`, guarding against circular dependencies.

## Phase 6 – Repair downstream consumers

- Replace all remaining `MCP_TOOLS` references across apps (`apps/oak-curriculum-mcp-stdio`, CLI scripts, etc.) with the curated helpers and new type aliases.
- Ensure list manipulations spread `toolNames` before mutation; prove via unit/integration coverage that flows like registration and execution succeed post-change.

## Phase 7 – Documentation & plan updates

- Update `.agent/plans/semantic-search/snagging-resolution-plan.md` and relevant READMEs to describe the curated helper surface and document behavioural evidence; treat that file as the canonical log of progress.
- Record artefact hashes post-generation and call out remaining risks or follow-ups directly within the source plan.

## Phase 8 – Quality gate sequence & verification

- Run the mandated commands (`pnpm install`, `pnpm clean`, … `pnpm dev:smoke`) in order, capturing outcomes in `.agent/plans/semantic-search/snagging-resolution-plan.md`.
- Perform `rg MCP_TOOLS` confirming only internal literals remain, logging results in the source plan.
- Execute a behavioural smoke script importing the SDK entry point to exercise helper functions end-to-end, noting outcomes in the source plan.

### To-dos

- [ ] Update MCP tool generator templates and behavioural tests to emit accessor helpers and precise tool type aliases derived from generated literals.
- [ ] Restrict the generated barrel and SDK entry point to approved helper exports and prove via runtime tests.
- [ ] Refactor runtime modules to consume helpers, replace external dependencies, and cover behaviour with tests.
- [ ] Update generated registry to forward client dependencies and adjust callers with test coverage.
- [ ] Rewrite generator/doc tooling tests to assert observable behaviour and guard against circular dependencies.
- [ ] Replace remaining MCP_TOOLS usage, refresh documentation, and run the full quality gate sequence, recording each gate result in `.agent/plans/semantic-search/snagging-resolution-plan.md`.
