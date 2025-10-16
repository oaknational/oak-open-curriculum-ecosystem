# Semantic Search SDK Recovery Plan (Cardinal Rule Enforcement)

_All work must uphold the Cardinal Rule: every static structure is generated from the Open Curriculum OpenAPI schema, with the SDK acting as the single source of truth. Sequencing follows `.agent/directives-and-memory/rules.md` and `docs/agent-guidance/testing-strategy.md`. Further guidance is available in `.agent/directives-and-memory/AGENT.md`._

## Recovery Plan

1. **Regenerate canonical MCP helper surface**
   - **Current state (verified):** `definitions.ts` keeps `MCP_TOOLS` internal and exports accessor helpers, but signatures such as `getToolFromOperationId` widen the result to the full union, and there are no literal-driven aliases (`ToolArgsForName`, `ToolResultForName`, etc.). `types.ts` only defines the structural `ToolDescriptor` interface, so compiled consumers cannot derive argument/result types. There is no circular dependency today—keep it that way.
   - **Update 2025-10-15:** Generator review complete; confirmed `generate-definitions-file.ts` lacks generic helper signatures and `generate-types-file.ts` remains structural-only. Implementation work will focus on emitting literal-driven helper types and runtime-safe generics.
   - **Update 2025-10-15 (continued):** Additional review of emitted artefacts shows `definitions.ts` currently exports non-generic helpers and `types.ts` only defines `ToolDescriptor`; no `ToolArgs`/`ToolResult` aliases exist. Behavioural test coverage still expects `MCP_TOOLS` exports and must be rewritten before regeneration.
   - **Update 2025-10-16:** Generator templates now emit generic helpers/types, the barrel exports a curated surface, and synonyms have been removed from type-gen. Behavioural tests cover the new helpers.
   - **Update 2025-10-17:** Phase 3 runtime alignment complete: all SDK consumers now import helper accessors, the helper file is included in the `tsup` bundle, and runtime tests cover the new flows. Build currently fails because the generated registry (`lib.ts`) still expects the old signature and `src/index.ts` re-exports types that `lib.ts` does not provide. Proceed to Phase 4 to regenerate the registry and adjust exports.
   - **Update 2025-10-18:** `ToolDescriptor` now lives in a standalone generated contract (`tool-descriptor.ts`), breaking the recurring circular-type issue between `definitions.ts` and `types.ts`. `types.ts` imports only the accessor aliases, so the cardinal rule holds and we can focus on producing working code.
   - **Update 2025-10-19:** Regenerated artefacts (`pnpm clean && pnpm type-gen`) succeed; the registry template now threads the client and `src/index.ts` re-exports through the curated barrel. `pnpm type-check`, however, still fails because `ToolDescriptor.invoke` remains typed `(client: unknown, args: unknown)`, descriptors emitted by tool generators expect `(client: OakApiPathBasedClient, args: ToolArgs<...>)`, and `OperationId` is exported twice (`path-parameters` + barrel). Immediate fixes:

- tighten the generated `ToolDescriptor` contract so client/args types match the helper aliases without reintroducing circular dependencies;
- regenerate tools/registry to consume the refined contract (eliminating the `never` reductions and unknown args);
- drop the duplicate `OperationId` export from the MCP barrel/root, then rerun `pnpm clean && pnpm type-gen && pnpm type-check` to confirm a green build before tackling generator/doc tests.
- remove the legacy stub export duplication in generated tool files so each descriptor name is emitted exactly once.
- realign generator unit tests and runtime mocks with the standalone descriptor contract (no expectations for structural imports).

* **Implementation approach:**
  1.  Update `generate-definitions-file.ts` to emit generic helpers that rely solely on the internal maps. Ensure every exported helper is `export function ...` or `export type ...` referencing readonly maps defined above.
  2.  Update `generate-types-file.ts` to import the helper `type`s from `definitions.ts` (never the literals) and emit aliases like `export type ToolArgs<TName extends ToolName> = Parameters<ToolDescriptorForName<TName>['invoke']>[1];` guarded by `import type` statements.
  3.  Add behavioural generator tests that: (a) compile the emitted files, (b) import helpers to execute representative lookups, and (c) fail if value-level imports occur.
  4.  Regenerate via `pnpm type-gen`, confirm the emitted files preserve the one-way dependency graph, and log hashes.
  5.  Ensure helpers such as `getToolFromOperationId` retain concrete `OperationId` narrowing by extending the generator templates and covering the behaviour through targeted helper invocations in tests.
  6.  Emit additional helper aliases (e.g., `ToolArgs`, `ToolResult`, `ToolDescriptorForOperationId`) from `types.ts` via `import type` statements so consumers can derive argument and result types without touching literals.
  7.  Refine the generated registry interface so runtime code never requires type assertions when invoking MCP tools.
  8.  Keep all generator regression tests behaviour-focused by importing the emitted modules and exercising their APIs instead of asserting on source text.
  9.  Regenerate MCP tools to remove the stub duplication, propagating the typed descriptor generics through `ToolArgs`/`ToolResult` aliases and updating mocks/tests to match.

2. **Curate the public MCP barrel and top-level exports**
   - **Current state (verified):** `src/types/generated/api-schema/mcp-tools/index.ts` merely re-exports `definitions.ts`. The package root (`src/index.ts`) still exports `MCP_TOOLS`, even though it no longer exists—downstream packages import it and now fail to type-check.
   - **Update 2025-10-16:** Barrel now exports only curated helpers/types; `src/index.ts` re-exports `toolNames`, `getToolFromToolName`, typed aliases, and no longer references `MCP_TOOLS`.
   - **Update 2025-10-17:** After Phase 3 runtime changes, `src/index.ts` must shift its type exports to the regenerated `types.ts` output; `lib.ts` will no longer be the source of those aliases once Phase 4 completes.
   - **Intended impact:** Treat `index.ts` as the deliberate public surface: expose `toolNames`, accessor helpers, type aliases, and nothing else. Update the package root to export the curated barrel (not internal files) and remove the broken `MCP_TOOLS` export.
   - **Risks & mitigations:**
     - _Risk:_ Re-exporting everything from `definitions.ts` could leak literals again if the generator ever reintroduces them.
       - _Mitigation:_ Limit barrel exports to explicit named symbols (`export { toolNames, ... }`). Add a behavioural generator test that imports the barrel and confirms only the approved keys exist by enumerating `Object.keys(module)` and comparing with an allow list.
     - _Risk:_ Updating the package root may tempt us to re-import internals to satisfy consumers.
       - _Mitigation:_ Instead of adding compatibility layers, update consumers (Step 5) and document breaking changes. Use TypeScript to ensure the root only re-exports from the curated barrel and add a test that imports the package root to confirm no forbidden symbols appear at runtime.
   - **Implementation approach:**
     1. Modify `generate-index-file.ts` (if needed) to output explicit export lists.
     2. Update `src/index.ts` to remove `MCP_TOOLS` and only export from the barrel.
     3. Add a behavioural regression test that imports the SDK entry point and verifies only the approved helper names exist (checking `Object.hasOwn` rather than asserting on raw code text).
     4. Demonstrate the curated surface by importing the package root and invoking helper functions (e.g., `getToolFromToolName`) inside behavioural tests, confirming downstream code paths succeed.

3. **Align runtime code with the accessor surface**
   - **Current state (verified):** `universal-tools.ts` pulls `typeSafeKeys` from `docs/_typedoc_src`, violating package boundaries, and it (along with MCP servers) still imports `MCP_TOOLS` directly. Runtime code bypasses the barrel, so the curated interface provides no benefit.
   - **Update 2025-10-17:** All MCP runtime consumers now rely solely on the generated helper surface (`toolNames`, `getToolFromToolName`, etc.), the shared helper lives in `src/types/helpers/type-helpers.ts`, and tests cover the revised flows. Build errors no longer reference `MCP_TOOLS`.
   - **Intended impact:** Move any shared helpers into SDK-owned modules, swap direct literal access (`MCP_TOOLS`) for accessor functions, and update MCP servers to enumerate tools via `toolNames` and `getToolFromToolName`.
   - **Risks & mitigations:**
     - _Risk:_ Pulling helpers into runtime modules might tempt a back-reference to `MCP_TOOLS` for convenience.
       - _Mitigation:_ Enforce helper functions that accept `ToolName` and retrieve descriptors via `getToolFromToolName`. Add unit coverage that executes these helpers end-to-end (mocking the returned descriptor where needed) to prove callers only use the accessor path.
     - _Risk:_ Consumer code may attempt to mutate `toolNames` (readonly) or rely on object iteration order.
       - _Mitigation:_ Spread readonly arrays before mutation (`[...toolNames].toSorted(...)`) and capture this pattern in behavioural tests that demonstrate sorting remains deterministic without mutating the source array.
   - **Implementation approach:**
     1. Create or relocate a local helper (e.g., `typeSafeEntries.ts`) under the SDK to replace the docs dependency.
     2. Update runtime files (`universal-tools.ts`, `execute-tool-call.ts`, MCP servers) to import from the barrel only.
     3. Update unit tests to execute the revised runtime flows, demonstrating that tool lookups succeed via the new helpers and fail fast when an unknown tool is requested — without relying on type assertions.
     4. Replace every remaining runtime, CLI, and test reference to `MCP_TOOLS` (including stdio and streamable servers plus bin scripts) with helper-driven lookups such as `toolNames` and `getToolFromToolName`, ensuring the literal map remains internal.
     5. Document behavioural coverage of helper-based enumeration, registration, and execution to demonstrate the accessor surface is the sole integration point.

4. **Repair MCP registry invocation flow**
   - **Current state (verified):** The generated `lib.ts` (and its template `generate-lib-file.ts`) call `descriptor.invoke(parsed.data)` without supplying the required `OakApiPathBasedClient`. Every generated descriptor currently expects `(client, args)`, so registry calls will throw at runtime. Build is currently blocked because `lib.ts` still imports `../../../client/index.js`, treats `ToolDescriptor` as generic, and `src/index.ts` re-exports types that the generated file does not export.
   - **Intended impact:** Update the generator and emitted library so registry invocations receive a client dependency explicitly, while continuing to rely on accessor helpers (`getToolFromToolName`, etc.). Ensure the registry remains the single entry point for MCP transports.
   - **Risks & mitigations:**
     - _Risk:_ Introducing a client dependency could tempt sharing a singleton client inside the generated file, creating hidden global state.
       - _Mitigation:_ Thread clients through explicit constructor or method parameters (e.g., pass the client into `call`) and prove behaviour with tests that inject a mock client and assert that `invoke` receives it.
     - _Risk:_ Updating the generator may drift from runtime expectations in manual modules (e.g., `universal-tools.ts`).
       - _Mitigation:_ After regeneration, adjust runtime consumers to supply the client and cover the integration with behavioural tests that execute a real descriptor using a stub client.
   - **Implementation approach:**
     1. Modify `generate-lib-file.ts` so `McpToolRegistry` stores a client (in constructor or per-call) and calls `descriptor.invoke(client, parsed.data)`.
     2. Regenerate `lib.ts` via `pnpm type-gen`, confirming the emitted code matches the template change.
     3. Update any runtime usage (e.g., server wiring) to provide the client dependency explicitly.
     4. Add behavioural tests for `McpToolRegistry.call`, injecting a fake descriptor to assert both argument validation and client forwarding.
     5. Ensure those behavioural tests cover success, validation failure, and unknown-tool scenarios using observable outcomes rather than inspecting registry internals.
     6. Update `src/index.ts` to source type aliases from the regenerated `types.ts`, removing duplicate `OperationId` exports and stale references to `lib.ts` types.

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

- **Update 2025-10-18:** Circular references are fixed, `types.ts` now reuses the standalone descriptor contract, and `type-gen` passes. Remaining blockers to working code are (1) updating `generate-lib-file.ts` and the emitted registry to forward clients without forbidden syntax, (2) correcting `src/index.ts` exports to match the new `types.ts` surface, and (3) regenerating + rerunning `pnpm build && pnpm type-check` until the SDK and downstream apps compile. Working code is the priority—complete these steps before moving to test/doc refactors.
- **Update 2025-10-19 (quality gate sweep):** Ran the mandated sequence end to end (install → e2e). Results:
  - `pnpm install`, `pnpm clean`, `pnpm type-gen` ✅ — generation completes but still emits duplicate descriptor blocks (`getLessonsTranscript`, `getThreads`, etc.) because the stub alias now clashes with the main descriptor export.
  - `pnpm build` ❌ — esbuild aborts on the duplicate exports emitted by the MCP tool templates, so no package dist artefacts are produced.
  - `pnpm type-check` ❌ — 233 SDK errors plus downstream module-resolution failures; `ToolDescriptor` generics widen invocations to `unknown`, cascading into `TS7006`/`no-unsafe-assignment` violations, and `@oaknational/oak-curriculum-sdk` cannot be resolved by apps once the build fails.
  - `pnpm lint -- --fix` ❌ — mirrors the type-check fallout, flagging hundreds of `no-unsafe-*` diagnostics because tool arguments/results remain `unknown`.
  - `pnpm format:root` ✅ and `pnpm markdownlint:root` ✅.
  - `pnpm test` ❌ — generator unit tests still expect the old descriptor contract and esbuild reports the duplicate exports; `vi.mock` fixtures in `execute-tool-call.unit.test.ts` no longer match the curated helper surface.
  - `pnpm test:ui` ✅ — Playwright suite remains green.
  - `pnpm test:e2e` ❌ — CLI/server apps fail to resolve the SDK entry (dist missing) and the `zodgen` e2e harness detects lingering `as T` assertions in the generated output.
- [ ] **Update generated registry to forward client dependencies and adjust callers with test coverage, keeping the surface assertion-free.** _(Blocked on reconciling `ToolDescriptor.invoke` typing, duplicate exports, and regenerated tool descriptors.)_
- [ ] Rewrite generator/doc tooling tests to assert observable behaviour and guard against circular dependencies.
- [ ] Replace remaining MCP_TOOLS usage, refresh documentation, and run the full quality gate sequence, recording each gate result in `.agent/plans/semantic-search/snagging-resolution-plan.md`.
- [ ] Remove duplicate descriptor emission and rebaseline generator/unit tests so tool files export a single descriptor that satisfies the typed contract.
