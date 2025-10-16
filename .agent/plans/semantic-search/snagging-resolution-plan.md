# Semantic Search SDK Recovery Plan (Cardinal Rule Enforcement)

_All work must uphold the Cardinal Rule: every static structure is generated from the Open Curriculum OpenAPI schema, with the SDK acting as the single source of truth. Sequencing follows `.agent/directives-and-memory/rules.md` and `docs/agent-guidance/testing-strategy.md`. Further guidance is available in `.agent/directives-and-memory/AGENT.md`._

## Recovery Plan

1. **Stabilise canonical MCP helper surface**
   - **Current state (verified 2025-10-19):** The latest elevated `pnpm type-gen` regenerated all artefacts. Helper maps and alias types now exist, but each generated tool file still exports two descriptors (one from `emitIndex`, one from `generateToolFile`), method casing is inconsistent (`GET` vs `get`), and metadata placeholders remain (`description` shorthand). These defects cascade into `pnpm build` (52 duplicate export errors) and `pnpm type-check` (collapsed helper unions, `never` reductions, duplicate `OperationId` exports). Registry code retains a cast to satisfy the widened descriptor type, and generator tests still rely on string snapshots.
   - **Goal:** Amend the generator templates so tools emit a single, correctly typed descriptor that aligns with the narrowed helper aliases; ensure the registry and barrel consume those aliases without casts; convert generator tests to behavioural proofs. Each change should be followed by `pnpm type-gen` and manual inspection before proceeding.
   - **Generator/runtime boundary:** Do not edit generated files directly. Every change must be implemented in the templates within `packages/sdks/oak-curriculum-sdk/type-gen/typegen/...`, then validated by re-running `pnpm type-gen`.
   - **Naming and structure conventions:**
     - Keep the base contract in `contract/tool-descriptor.contract.ts` (or `.base.ts`) exporting `ToolDescriptorContract` (or `BaseToolDescriptor`). This file must remain dependency-free apart from platform imports and should carry a guard comment explaining the one-way flow.
     - Under `generated/data`, emit `definitions.ts` (internally named `MCP_TOOL_DEFINITIONS` even if the export stays `MCP_TOOLS`) and a curated `index.ts`. All helpers (`toolNames`, `getToolFromToolName`, etc.) live here.
     - Under `generated/aliases`, emit `types.ts`, exporting aliases that make the provenance clear (e.g., `ToolArgsForName` derived from the definitions map).
     - Under `generated/runtime`, emit `lib.ts` and `tools/get-*.ts`, each importing only from the contract and alias layers.
     - Document these conventions in the generator templates (comments at the top of each emitted file) so future updates preserve the dependency flow, and track the decision in `docs/architecture/architectural-decisions/050-mcp-tool-layering-dag.md`.
   - **Incremental actions:**
     1. Restructure the generated output hierarchy to reflect the dependency flow explicitly:
        - `contract/` (e.g., `tool-descriptor.contract.ts`) stays completely standalone and imports only platform dependencies.
        - `generated/data/` holds the literal descriptor data (`definitions.ts`, curated `index.ts`, and per-tool descriptor files under `tools/`). These modules may import the contract but nothing else.
        - `generated/aliases/` contains `types.ts` and any helper aliases derived strictly from the literal map.
        - `generated/runtime/` houses the registry/utility layer (e.g., `lib.ts`) that consumes the helpers/aliases.
          Update generator templates and import paths accordingly before regenerating.
     2. Update `generate-tool-file.ts` / `emit-index.ts` so each tool emits exactly one descriptor with upper-case HTTP methods, fully initialised metadata, and the curated helper aliases (`ToolArgsForName`, `ToolResultForName`). Verify by regenerating and checking a representative tool file.
     3. Adjust `generate-lib-file.ts` to remove casts by consuming the helper aliases and keep the flow `contract → data → aliases → runtime`.
     4. Keep `tool-descriptor.ts` completely generic—no imports from generated data or aliases—and ensure `generate-types-file.ts` derives aliases strictly from `definitions.ts`.
     5. After each template change, run `pnpm type-gen` (repo root) and log the outcome in this plan before continuing. Only move ahead once regeneration succeeds and manual inspection confirms the expected structure.
     6. Once generator output is stable, run `pnpm build --filter @oaknational/oak-curriculum-sdk` to confirm duplicate exports and type collapses are resolved; if it still fails, loop back to the relevant template before touching runtime code.
     7. Rewrite generator unit tests to import the generated modules at runtime and assert observable behaviour (e.g., `getToolFromOperationId('getSequences-getSequenceUnits')` returns the expected descriptor), eliminating text-based checks.
   - **Update 2025-10-19:** Steps 1a–1c complete: tool files now emit a single descriptor, helper aliases flow through `emit-index`, and `generate-lib-file.ts` no longer casts the registry lookup. `pnpm type-gen` passes. Next stop: run `pnpm build --filter @oaknational/oak-curriculum-sdk`; if duplicate-export errors persist, refine templates before proceeding to Step 2.
     [//]: # (Additive status correction 2025-10-19T23:59:59Z ensuring plan reflects latest regeneration results)
   - **Update 2025-10-19 (post-layer split verification):** The regenerated surface now conforms to the `contract → generated/data → generated/aliases → generated/runtime` DAG. Representative outputs—including `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`, `.../generated/data/definitions.ts`, and `.../generated/data/tools/get-subjects-years.ts`—show a single descriptor per tool importing only the contract and response-map helpers, and the literal map remains internal as `MCP_TOOL_DEFINITIONS`. Remaining Step 1 gaps:
     - Generator/unit tests still pin the pre-split contract signature and rely on string snapshots (`type-gen/typegen/mcp-tools/mcp-tool-generator.unit.test.ts`), so behavioural coverage must be added before rerunning `pnpm test`.
     - `generated/runtime/lib.ts` needs a second pass to prove that `listTools` and `call` expose `ToolDescriptorForName` unions without collapsing to `never`; add targeted assertions once the typings are settled.
     - After tightening tests and registry typing, rerun `pnpm type-gen`, `pnpm build --filter @oaknational/oak-curriculum-sdk`, and `pnpm type-check --filter @oaknational/oak-curriculum-sdk`, recording the outcomes here before advancing to Step 2.
2. **Align curated barrel, registry, and package root**
   - **Current state (verified 2025-10-19):** The barrel now re-exports helpers, but `src/index.ts` double-defines `OperationId` (directly and via the barrel), and the generated registry still relies on casts because descriptor types collapse to `never` when unions combine. These issues surface as `TS2300` and `TS2322` errors during `pnpm type-check`.
   - **Goal:** Once Step 1 yields clean descriptors, prune duplicate exports in `src/index.ts`, ensure the registry consumes helper aliases without casts, and add behavioural checks that prove the curated surface.
   - **Incremental actions:**
     1. After generator fixes, update `src/index.ts` to re-export the curated symbols explicitly, removing duplicate `OperationId` exports. Run `pnpm type-check --filter @oaknational/oak-curriculum-sdk` and record the outcome in this plan.
     2. Add a lightweight integration test that imports the SDK entry point, enumerates `toolNames`, and invokes both `getToolFromToolName` and `getToolFromOperationId` to demonstrate the surface works. Keep the test behavioural (no key-count assertions).
     3. If `type-check` still fails, loop back to Step 1 (descriptor typing) before continuing; do not proceed to downstream work until this command is green.

3. **Realign registry/executor runtime code**
   - **Current state (verified 2025-10-19):** `McpToolRegistry` now stores the client, but casts remain (`as ToolDescriptorForOperationId<T>`), and runtime tests still mock `MCP_TOOLS`. Generated tool files reference `endpoint.get` and bare `description` identifiers, causing `TS2551`/`TS18004` errors.
   - **Goal:** Once generator output is fixed, update runtime code and tests to use helper aliases directly, eliminating casts and stale mocks.
   - **Incremental actions:**
     1. Update `generate-lib-file.ts` and runtime executor code to rely on helper aliases, removing all casts. Regenerate and run `pnpm build --filter @oaknational/oak-curriculum-sdk` to confirm errors disappear.
     2. Rewrite `execute-tool-call.unit.test.ts` (and related mocks) to use helper imports (`toolNames`, `getToolFromToolName`); rerun the targeted test file via `pnpm test --filter execute-tool-call`.
     3. Iterate until both the SDK build and executor tests succeed, logging each command result here before moving on.

4. **Convert generator and doc tests to behavioural proofs**
   - **Current state (verified 2025-10-19):** Generator tests still string-match output, causing `pnpm test` to fail once descriptors change. Several TypeScript diagnostics highlight outdated fixtures (`MetaRecord` unused, response-map fixtures missing fields).
   - **Goal:** Replace snapshot-style assertions with runtime checks, update fixtures to match the refined types, and ensure doc-generation scripts compile cleanly.
   - **Incremental actions:**
     1. For each failing generator test, import the actual generated modules (after `pnpm type-gen`) and assert observable behaviour (`isToolName`, `getToolFromOperationId`, specific descriptor metadata).
     2. Update validation/doc fixtures to satisfy the stricter types surfaced in `pnpm type-check`.
     3. Re-run `pnpm test --filter @oaknational/oak-curriculum-sdk` after each batch of fixes, documenting outcomes here.

5. **Refresh documentation and developer guidance**
   - **Current state:** Authored docs (README, ADRs) still reference `MCP_TOOLS`. `generate-ai-doc.ts` already uses helper exports but lacks explicit behavioural validation.
   - **Goal:** Once code/tests stabilise, update documentation to describe the helper surface and cite the new behavioural tests as evidence.
   - **Incremental actions:**
     1. Amend README/ADRs to mark `MCP_TOOLS` as internal and highlight `toolNames`/helper usage.
     2. Run `pnpm markdownlint:root` and `pnpm lint -- --fix` to confirm docs comply.

6. **Re-validate downstream workspaces**
   - **Current state:** Downstream builds/tests fail because the SDK build fails. After Steps 1–5, we must re-run the full command sequence to ensure apps compile and tests pass.
   - **Incremental actions:**
     1. Execute `pnpm build`, `pnpm type-check`, `pnpm test`, `pnpm test:ui`, and `pnpm test:e2e` sequentially, logging each result here.
     2. Address any downstream failures by applying helper-based updates, then rerun the failed command before continuing.

7. **Document completion and handover**
   - Record final command outputs, highlight residual risks (if any), and capture lessons learned for future generator work.

- **Phase 4 tactical checklist (must stay in sync with generators before proceeding):**
  1. Update `generate-tool-descriptor-file.ts` so `ToolDescriptor` references helper aliases (`ToolArgsForName<T>`, `ToolResultForName<T>`) and continues to avoid circular imports.
  2. Extend `generate-types-file.ts` to emit those aliases (`ToolArgsForName`, `ToolResultForName`, `ToolClientForName`) using `import type` exclusively.
  3. Refresh `generate-definitions-file.ts` to keep readonly maps internal and stop emitting `...Tool` stubs—each generated tool file must export a single descriptor.
  4. Adjust `generate-tool-file.ts` so every descriptor is emitted once with the specialised `(client: OakApiPathBasedClient, args: ToolArgsForName<'tool-name'>)` signature, re-exporting the helper alias rather than redefining interfaces.
  5. Update `generate-lib-file.ts` to rely on the helper aliases when forwarding clients/arguments and remove any lingering structural types.
  6. Run `pnpm clean && pnpm type-gen`, then inspect `definitions.ts`, `types.ts`, `lib.ts`, and a representative tool file to confirm the above holds (no duplicate exports, only `import type` crossings).
  7. Realign generator unit tests (`emitters`, `generate-tool-file.header`, `generate-lib-file`, etc.) and runtime mocks (e.g., `execute-tool-call.unit.test.ts`) so they assert the new signatures and no longer expect legacy exports; ensure the `zodgen` e2e harness is free of `as T` assertions once artefacts regenerate.
  8. Only after these steps pass locally run the SDK-scoped gates (`pnpm build`, `pnpm type-check`, `pnpm lint -- --fix`, `pnpm test`) and capture the outcomes in this plan before re-entering the full repo-wide quality-gate sequence.

> _Do not move to Phase 5 until every item in this checklist is complete and logged._

5. **Rewrite generator tests as behavioural proofs**
   - **Current state (verified):** Template tests still expect exports like `MCP_TOOLS` in `definitions.ts`, mock files without new helpers, and string-matching of obsolete scaffolding. The doc-generation tooling (`type-gen/generate-ai-doc.ts`, related helpers) still imports `MCP_TOOLS`, so documentation builds fail even after generators are fixed.
   - **Intended impact:** Rebuild tests and supporting scripts so they assert on observable behaviour—e.g., `definitions.ts` exporting readonly helper maps, `types.ts` emitting precise alias types, `lib` consuming accessors—and ensure doc-generation entry points are exercised against the new accessor surface without relying on the removed literal. No doc-gen commands need to run; the requirement is code that type-checks and passes lint with behavioural coverage proving the flow.
   - **Risks & mitigations:**
     - _Risk:_ Behavioural tests might unknowingly import both `definitions.ts` and `types.ts`, creating a circular dependency within the test harness that masks runtime cycles.
       - _Mitigation:_ Structure tests to import artefacts separately (one test per generated file) and exercise them independently. Add a meta-test that loads each module with `vm.createContext` or dynamic import, ensuring neither module imports the other at runtime.
     - _Risk:_ Snapshot drift if templates change frequently.
       - _Mitigation:_ Avoid snapshot testing altogether. Instead, execute the generated helpers (e.g., call `getToolNameFromOperationId` with a known id) and assert on the runtime outcome, satisfying the behavioural testing rule.
   - **Implementation approach:**
     1. Update each generator unit test to import the generated module, run representative helper functions, and assert on their observable results (e.g., the correct descriptor key is returned, unknown keys throw typed errors).
     2. Update doc-generation scripts (e.g., `type-gen/generate-ai-doc.ts`) to use the curated accessor helpers and ensure they compile and lint without relying on `MCP_TOOLS`.
     3. Amend doc-generation and generator behavioural tests to enumerate tools through `toolNames`/helper functions.
     4. Add a compile-time check that both generated files and the doc-generation entry points type-check in isolation, reinforcing the absence of circular dependencies and confirming no extra tooling is required beyond lint/type-check. This is a prelude to moving the type-gen into a separate workspace, but that work is out of scope for this recovery plan.

6. **Repair downstream consumers**
   - **Current state (verified):** Apps (`oak-curriculum-mcp-stdio`, CLI entry points, etc.) still import `MCP_TOOLS` and rely on implicit widening. Type-check currently fails because those exports no longer exist.
   - **Intended impact:** Update consumers to use the curated helpers (`toolNames`, `getToolFromToolName`, typed aliases). Where iteration is required, convert readonly arrays via spread instead of mutating in place.
   - **Risks & mitigations:**
     - _Risk:_ Updating consumers piecemeal may reintroduce `MCP_TOOLS` via local copies.
       - _Mitigation:_ Refuse to create interim constants; insist on importing the canonical helpers. Align each consumer change with behavioural tests (e.g., verifying the CLI logs the correct count via `toolNames.length`).
     - _Risk:_ CLI tools expect `MCP_TOOLS` for logging or metrics.
       - _Mitigation:_ Provide utility functions (e.g., `countTools()` that uses `toolNames.length`) within the SDK and prove their behaviour with unit tests.
   - **Implementation approach:**
     1. For each consumer, replace `MCP_TOOLS` imports with `toolNames`/`getToolFromToolName`.
     2. Update sorting logic to use copies of `toolNames`.
     3. Run `pnpm type-check` and relevant behavioural tests to verify the consumer now compiles and functions, logging any remaining issues.
     4. Augment consumer tests so they prove helper-driven listing, registration, and execution outcomes without depending on internal structures.

7. **Document the canonical surface and remaining risks**
   - **Current state (verified):** Plans and READMEs reference `MCP_TOOLS` as a public export, and documentation for the accessor surface is absent. Doc-generation scripts previously depended on `MCP_TOOLS`, so they must be updated (Step 5) before documentation can be refreshed.
   - **Intended impact:** Update this plan, and relevant READMEs to describe the new helper set, record hashes of generated artefacts, and flag any open risks (e.g., pending consumer updates). Documentation updates rely solely on running lint and type-check over the updated doc-generation code; no doc-gen tooling execution is required for acceptance.
   - **Risks & mitigations:**
     - _Risk:_ Documentation may lag behind code, encouraging future reintroduction of literals.
       - _Mitigation:_ As soon as gates turn green, capture the canonical export list and link supporting evidence in the docs. This can be achieved through generated documentation (pnpm doc-gen), but should also include authored documentation. Include behavioural test references so the documentation points to verified outcomes rather than implementation detail.
   - **Implementation approach:**
     1. After completing Steps 1–6, update README content and this plan document to reflect the new helpers. Confirm the updated doc-generation scripts pass type-check and lint.
     2. Record stakeholder acknowledgement once quality gates are green.
     3. Explicitly document the curated helper surface (e.g., `toolNames`, `getToolFromToolName`, generated alias types) as the supported API while marking `MCP_TOOLS` as internal-only, citing the behavioural tests that cover those helpers.

## Quality Gate Visibility Sequence

_Run these commands from the repo root with zero edits between them. Each failure informs the recovery steps above; log outcomes in this plan document._

1. `pnpm install` — verify deterministic dependency graph.
2. `pnpm clean` — surface reliance on stale artefacts.
3. `pnpm type-gen` — confirm generators emit the refactored helpers and types.
4. `pnpm build` — ensure `tsup` emits the curated surface (`dist/*.js`) without leaking `src/` imports.
5. `pnpm type-check` — enumerate downstream consumers still relying on removed exports.
6. `pnpm lint -- --fix` — expose boundary violations (e.g., stray `docs/_typedoc_src` imports) introduced during refactor.
7. `pnpm format:root` — keep diffs reviewable post-change.
8. `pnpm markdownlint:root` — ensure markdown docs meet standards.
9. `pnpm test` — validate generator/runtime behaviour under unit and integration coverage.
10. `pnpm test:ui` — confirm UI flows remain compatible with the new SDK surface.
11. `pnpm test:e2e` — ensure system-level interactions resolve the curated exports without missing modules.
12. `pnpm dev:smoke` — final developer-experience smoke; add the npm script if absent or document the agreed alternative.
13. Record the outcome of a behavioural verification that imports the SDK entry point and exercises helper functions, demonstrating the curated surface works end to end.
14. Capture the results of a repository-wide check (e.g., `rg MCP_TOOLS`) showing the only remaining references outside tests reside in the internal literal definition, and log those findings alongside the command outcomes.

- **Update 2025-10-19:** Re-ran the core commands with elevated permissions:
  - `pnpm type-gen` ✅ — regeneration completes, but every tool file still exports two descriptors and uses mixed-case method accessors.
  - `pnpm build` ❌ — esbuild reports 52 duplicate-export errors stemming from the duplicated descriptors.
  - `pnpm type-check` ❌ — SDK scope reports duplicate identifiers (`OperationId`), descriptor unions collapsing to `never`, registry casts, outdated unit-test mocks, and generator fixture mismatches.
  - Downstream commands remain red until the generator fixes land; next action is to complete Step 1.
- **Next checkpoints:**
  - [ ] Step 1 — Generator templates emit single, correctly typed descriptors; `pnpm type-gen` followed by manual inspection and logged outcome.
  - [ ] Step 2 — `pnpm type-check --filter @oaknational/oak-curriculum-sdk` passes after pruning duplicate exports; behavioural SDK test added.
  - [ ] Step 3 — `pnpm build --filter @oaknational/oak-curriculum-sdk` and targeted executor tests pass without casts.
  - [ ] Step 4 — `pnpm test --filter @oaknational/oak-curriculum-sdk` green with behavioural generator tests.
  - [ ] Step 5 — Documentation updated; `pnpm lint -- --fix` and `pnpm markdownlint:root` green.
  - [ ] Step 6 — Full workspace gates (`pnpm build`, `pnpm type-check`, `pnpm test`, `pnpm test:ui`, `pnpm test:e2e`, `pnpm dev:smoke`) rerun and logged.
