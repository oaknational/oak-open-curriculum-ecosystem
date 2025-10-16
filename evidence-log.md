# Evidence Log

## MCP Tool Surface Refactor

- 2025-10-19 (Codex): Step 1a — removed the duplicate descriptor block from `generate-tool-file.ts` so generated tools rely solely on the `emitIndex` output.
  - Command: `pnpm type-gen` (repo root) ✅
  - Verification: `src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts` now exports a single descriptor (`getSubjectsYears`) plus the stub alias; duplicate `getSubjectsYears` definition is gone.
  - Next: Adjust templates to thread helper aliases through descriptors/registry (Step 1b).

- 2025-10-19 (Codex): Step 1b — generator now threads helper aliases through tool descriptors.
  - Changes: `generate-types-file.ts` exports `ToolArgsForName`, `ToolClientForName`, and `ToolResultForName`; tool files import those aliases and `emit-index.ts` applies them in the `invoke` signature and `ToolDescriptor` satisfies clause.
  - Command: `pnpm type-gen` (repo root) ✅
  - Verification: `get-subjects-years.ts` shows `invoke(client: ToolClientForName<typeof name>, args: ToolArgsForName<typeof name>)` and the descriptor satisfies `ToolDescriptor<..., ToolArgsForName<typeof name>, ToolResultForName<typeof name>>`.
  - Next: Update `generate-lib-file.ts` to remove registry casts and rerun `pnpm type-gen` before attempting the SDK build.

- 2025-10-19 (Codex): Step 1c — removed registry cast by trusting helper aliases.
  - Changes: `generate-lib-file.ts` now returns `getToolFromToolName(toolName)` directly in `getToolDescriptorForOperationId`.
  - Command: `pnpm type-gen` (repo root) ✅
  - Verification: `src/types/generated/api-schema/mcp-tools/lib.ts` no longer uses `as ToolDescriptorForOperationId<TId>`.
  - Next: Attempt SDK build (`pnpm build --filter @oaknational/oak-curriculum-sdk`) to confirm duplicate-export errors are resolved; if it fails, revisit generator output before moving on.

- 2025-10-19 (Codex): Step 1d — generalised the shared `ToolDescriptor` contract.
  - Changes: `generate-tool-descriptor-file.ts` now emits `ToolDescriptor<TClient, TArgs, TResult>` without importing the SDK client or union aliases.
  - Command: `pnpm type-gen` (repo root) ✅
  - Verification: `src/types/generated/api-schema/mcp-tools/tool-descriptor.ts` exposes the 3-parameter generic used by generated tool descriptors.
  - Next: Re-run `pnpm build --filter @oaknational/oak-curriculum-sdk`; resolve any remaining type errors before advancing to Step 2.

- 2025-10-19 (Codex): `pnpm build --filter @oaknational/oak-curriculum-sdk` ❌
  - Failure: TypeScript reports `ToolDescriptor` generics collapsing to `never` (e.g., `ToolClientForName` “not generic”), registry casts widening unions, and cyclic references between descriptors and helper aliases.
  - Action: Simplified approach—reverted `ToolDescriptor` back to a single `TResult` generic, restored descriptor imports of `OakApiPathBasedClient`/`ToolArgs`, and limited helper aliases to wrappers around existing `ToolArgs/TToolClient` definitions.

- 2025-10-19 (Codex): Regenerated artefacts (`pnpm type-gen` ✅) after reverting the generic changes, but a subsequent `pnpm build --filter @oaknational/oak-curriculum-sdk` still fails. Current blockers:
  - Duplicate `OperationId` exports in `src/index.ts`.
  - Registry types collapsing (`ToolDescriptorForName<TName>` resolves to `never`) causing argument validation errors.
  - `tool-descriptor.ts` imports (`../../../../../client/index.js`, `../types.js`) now flagged as missing because the build compiles TypeScript before emitting `.js` outputs.
  - Next focus: resolve `OperationId` duplication (Step 2) and revisit registry typing to avoid the `never` collapse, while ensuring generator templates do not introduce runtime `.js` imports that lack `.d.ts` coverage.

- 2025-10-19 (Codex): Preparing Step 1 restructuring.
  - Decision: apply the `contract/`, `generated/data`, `generated/aliases`, `generated/runtime` folder split with corresponding naming conventions (contract file `tool-descriptor.contract.ts`, internal literal `MCP_TOOL_DEFINITIONS`, helper aliases suffixed `ForName`, guard comments explaining the dependency flow).
  - Action plan: update generator templates to emit into the new directories, add guard comments, and capture the rationale in ADR `docs/architecture/architectural-decisions/050-mcp-tool-layering-dag.md`.

- 2025-10-20 (Codex): Implemented layered generator outputs with `ToolOperationId*` aliases.
  - Changes: `generate-definitions-file.ts`, `generate-index-file.ts`, `generate-types-file.ts`, and `generate-lib-file.ts` now emit to `contract/`, `generated/data`, `generated/aliases`, and `generated/runtime` directories, renaming `OperationId` to `ToolOperationId` and deriving invocation types via `ToolDescriptorInvocation<T>`.
  - Commands: `pnpm type-gen` ✅ (multiple runs) to regenerate artefacts after each template adjustment.
  - Verification: `src/types/generated/api-schema/mcp-tools/generated/data/definitions.ts` declares `export type ToolOperationId = ...` and `isToolOperationId`; `generated/runtime/lib.ts` initialises descriptors via the helper `storeDescriptor` without casts.
  - Follow-up: `pnpm type-check --filter @oaknational/oak-curriculum-sdk` still fails because `execute-tool-call.ts` and the registry now need to narrow descriptor invocations to avoid intersecting every `ToolArgs` variant.
- 2025-10-20 (Codex): Narrowed runtime invocations and normalised response-map fixtures.
  - Changes: `generate-lib-file.ts` emits a validated-args comment and casts to `never` post-Zod validation; `execute-tool-call.ts` mirrors the same safety check. Response-map generation now strips `ReferenceObject` definitions via `normaliseSchemaComponents`, and cross-validation tests include the new `path`, `colonPath`, `method`, and `source` fields.
  - Commands: `pnpm type-gen` ✅, `pnpm type-check --filter @oaknational/oak-curriculum-sdk` ✅.
  - Outcome: Type-check no longer reports the `ToolArgs` intersection or response-map fixture errors, unblocking Step 2 of the recovery plan.

## Semantic Search Recovery

- 2025-10-21 (Codex): Generated canonical search index document schemas, guards, and doc re-exports; removed hand-written types and adopted the generated surface in the semantic search app.
  - Changes: Added `generate-search-index-docs.ts` to emit `src/types/generated/search/index-documents.ts` and documentation aliases; updated SDK exports/tsup config; search workspace now imports `isSearch*IndexDoc` guards from the SDK and replaces implicit-`any` array iterations with typed helpers.
  - Commands: `pnpm type-gen` ✅, `pnpm build --filter @oaknational/oak-curriculum-sdk` ✅, `pnpm type-check --filter @oaknational/open-curriculum-semantic-search` ✅.
  - Outcome: Search index structures now flow entirely from type-gen, and the semantic search workspace type-checks cleanly without local guard duplicates.
