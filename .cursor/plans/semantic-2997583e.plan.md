<!-- 2997583e-a641-4b3c-85c3-f42860118bc1 1e20919c-cce5-49e5-96c1-5ae9e7c82b27 -->
# Semantic Search Recovery Implementation Plan

*Implementation plan for `.agent/plans/semantic-search/snagging-resolution-plan.md`; treat that document as the source of truth. Record progress updates directly within it.*

## Reflection Highlights

- Hold the Cardinal Rule: all runtime/static types must flow from `pnpm type-gen` outputs.
- Prioritise simplicity via accessors and behavioural proofs rather than literal re-exports.
- Lean on TDD: add/repair behavioural tests before adjusting generators or consumers.
- Use the quality gates as sensors, run them often to see the current state of the repo and the workspaces in it.
- Preserve type information end to end — eliminate all type assertions by tightening generated helpers and runtime signatures.
- Working code is the objective: ship the registry + SDK surface fixes so downstream apps build and run again.

## Phase 1 – Regenerate canonical MCP helper surface

- Enhance `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts` to emit generic helpers (`getToolFromOperationId<TId>()`, `getOperationIdFromToolName<TName>()`, literal-driven readonly maps) and associated exported type aliases only.
- Emit complementary `types.ts` by adding a generator (likely `generate-types-file.ts`) that `import type` symbols from the generated definitions, defining `ToolArgs<TName>`, `ToolResult<TName>`, etc., without touching literals.
- Remove the now-unneeded synonym generator; rely on canonical enums from `path-parameters.ts` and let downstream agents handle any fuzzy matching.
- Add behavioural generator tests covering the new helpers by importing the generated files and exercising representative lookups and type-only imports.
- Extend generator outputs so the registry helpers provide precise `ToolArgs`/`ToolResult` signatures, allowing runtime consumers to compile with zero type assertions.
- **Status:** Done. `ToolDescriptor` now lives in its own generated contract, breaking the circular definition between `definitions.ts` and `types.ts`.

## Phase 2 – Curate generated barrel and SDK entry point

- Adjust generator output (e.g., `generate-index-file.ts`) so the barrel explicitly re-exports only approved helpers/types; ensure `src/types/generated/api-schema/mcp-tools/index.ts` reflects this surface.
- Update `packages/sdks/oak-curriculum-sdk/src/index.ts` to re-export solely from the curated barrel and remove `MCP_TOOLS` exposure.
- Add runtime tests that import the SDK entry (`src/index.ts`) and assert the available exports match the allow list.
- Ensure the curated barrel exposes the refined helper/types needed to eliminate downstream assertions.
- **Status:** Mostly done. `src/index.ts` now re-exports through the curated barrel, but duplicate `OperationId` exports remain to be cleaned up alongside the Phase 4 fixes.

## Phase 3 – Align runtime code with accessor helpers

- Move any shared helpers into SDK-owned modules (e.g., `type-helpers.ts`) to replace doc dependencies while keeping strong typing.
- Update consumers like `src/mcp/universal-tools.ts`, `src/mcp/execute-tool-call.ts`, and related runtime modules to enumerate tools via `toolNames`/`getToolFromToolName`, guarding the readonly data with non-mutating copies where needed.
- Refine runtime signatures so all MCP execution paths compile without type assertions.
- Cover these paths with unit/integration tests to prove enumeration, lookup, and error handling operate through the accessor surface only.
- **Status:** Complete. Runtime and server code now depend exclusively on generated helpers.

## Phase 4 – Repair MCP registry invocation flow

- Modify `type-gen/typegen/mcp-tools/parts/generate-lib-file.ts` so the generated registry accepts an `OakApiPathBasedClient`, forwarding it as the first argument to each descriptor’s `invoke`.
- Regenerate `lib.ts` and adjust runtime callers (e.g., MCP servers) to supply the client explicitly.
- Add behavioural tests around `McpToolRegistry.call` validating success, validation failures, and unknown-tool handling while confirming the client is forwarded.
- Confirm the refined types eliminate the need for downstream assertions when registering or calling tools.
- **Status:** In progress. Quality gate sweep (install → e2e) exposed additional blockers:
- MCP tool generator now emits duplicate descriptor exports (`getLessonsTranscript`, `getThreads`, etc.) because the doc-stub alias collides with the canonical descriptor; build and tests halt on these duplicates.
- `ToolDescriptor` generics still widen `(client, args)` to `unknown`, leading to 200+ `TS7006`/`no-unsafe-*` diagnostics once descriptors are consumed downstream.
- Downstream apps cannot resolve `@oaknational/oak-curriculum-sdk` because `pnpm build` aborts, cascading into type/lint/test failures.
- Generator unit tests and runtime mocks remain pinned to the pre-standalone descriptor surface.
- The `zodgen` e2e suite still detects forbidden `as T` assertions in generated artefacts.
- **Next actions:**

  1. Tighten the generated `ToolDescriptor` signature (`OakApiPathBasedClient`, `ToolArgsForName<T>`, `ToolResultForName<T>`) and thread these generics through the template helpers without reintroducing cycles.
  2. Update tool templates to emit a single descriptor export per file (drop the legacy `...Tool` alias or rename it) and regenerate to unblock build/test.
  3. Deduplicate `OperationId` exports in `src/index.ts`/barrel and align mocks/tests with `toolNames` helpers.
  4. Regenerate + rerun `pnpm clean && pnpm type-gen && pnpm type-check` to verify the SDK compiles before revisiting doc/test behaviouralisation.

## Phase 5 – Behaviouralise generator & doc tooling tests

- Refactor existing generator tests to assert observable behaviour (e.g., helper functions returning expected descriptors) instead of snapshot/string checks.
- Update doc-generation scripts such as `type-gen/generate-ai-doc.ts` to rely on accessor helpers; add tests proving they enumerate tools without accessing literals.
- Include meta-tests ensuring `definitions.ts` and `types.ts` import each other only via `import type`, guarding against circular dependencies.

## Phase 6 – Repair downstream consumers

- Replace all remaining `MCP_TOOLS` references across apps (`apps/oak-curriculum-mcp-stdio`, CLI scripts, etc.) with the curated helpers and new type aliases.
- Ensure list manipulations spread `toolNames` before mutation; prove via unit/integration coverage that flows like registration and execution succeed post-change.
- Verify downstream codebases compile without type assertions, relying solely on the curated helper surface.

## Phase 7 – Documentation & plan updates

- Update `.agent/plans/semantic-search/snagging-resolution-plan.md` and relevant READMEs to describe the curated helper surface and document behavioural evidence; treat that file as the canonical log of progress.
- Record artefact hashes post-generation and call out remaining risks or follow-ups directly within the source plan.
- Document the “zero type assertions” guarantee and reference the behavioural tests that enforce it.

## Phase 8 – Quality gate sequence & verification

- Run the mandated commands (`pnpm install`, `pnpm clean`, … `pnpm dev:smoke`) in order, capturing outcomes in `.agent/plans/semantic-search/snagging-resolution-plan.md`.
- Perform `rg MCP_TOOLS` confirming only internal literals remain, logging results in the source plan.
- Execute a behavioural smoke script importing the SDK entry point to exercise helper functions end-to-end, noting outcomes in the source plan.

### To-dos

- [x] Update MCP tool generator templates and behavioural tests to emit accessor helpers and precise tool type aliases derived from generated literals.
- [x] Restrict the generated barrel and SDK entry point to approved helper exports and prove via runtime tests.
- [x] Refactor runtime modules to consume helpers, replace external dependencies, and cover behaviour with tests — ensuring there are no type assertions.
- [ ] **Update generated registry to forward client dependencies and adjust callers with test coverage, keeping the surface assertion-free.** _(Blocked on reconciling `ToolDescriptor.invoke` typing, duplicate exports, and regenerated tool descriptors.)_
- [ ] Rewrite generator/doc tooling tests to assert observable behaviour and guard against circular dependencies.
- [ ] Replace remaining MCP_TOOLS usage, refresh documentation, and run the full quality gate sequence, recording each gate result in `.agent/plans/semantic-search/snagging-resolution-plan.md`.