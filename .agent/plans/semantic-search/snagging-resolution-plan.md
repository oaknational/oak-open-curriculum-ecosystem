# Semantic Search SDK Recovery Plan (Cardinal Rule Enforcement)

_All work must uphold the Cardinal Rule: every static structure is generated from the Open Curriculum OpenAPI schema, with the SDK acting as the single source of truth. Sequencing follows `.agent/directives-and-memory/rules.md` and `docs/agent-guidance/testing-strategy.md`. Further guidance is available in `.agent/directives-and-memory/AGENT.md`._

## Recovery Plan

1. **Regenerate canonical MCP helper surface**
   - **Current state (verified):** `definitions.ts` keeps `MCP_TOOLS` internal and exports accessor helpers, but signatures such as `getToolFromOperationId` widen the result to the full union, and there are no literal-driven aliases (`ToolArgsForName`, `ToolResultForName`, etc.). `types.ts` only defines the structural `ToolDescriptor` interface, so compiled consumers cannot derive argument/result types. There is no circular dependency today—keep it that way.
   - **Intended impact:** Extend the generator so `definitions.ts` emits fully generic helpers (`getToolFromOperationId<TId>()`, `getOperationIdFromToolName<TName>()`, etc.) and literal-driven readonly maps. Introduce a complementary `types.ts` output that derives precise `ToolArgs`, `ToolResult`, and related aliases strictly from the literal data (without importing `MCP_TOOLS`). This restores compile-time guarantees for every tool.
   - **Risks & mitigations:**
     - _Risk:_ Accidentally importing `ToolDescriptor` (from `types.ts`) back into `definitions.ts`, re-forming the previous circular dependency.
       - _Mitigation:_ Keep `types.ts` unaware of the literal map by emitting `type`-only exports in `definitions.ts` (e.g., `export type ToolMap = typeof MCP_TOOLS;`) and consuming those via `import type { ToolMap, ToolName } from './definitions.js';` in `types.ts`. Enforce this in the generator template with a behavioural test that loads the generated output and fails when a value import sneaks in.
     - _Risk:_ Helper generics referencing concrete union members (e.g., `ToolNameForOperationId<TId>` returning `ToolDescriptorForName<TName>`) could expand into distributive unions that depend on value-level imports.
       - _Mitigation:_ Generate all helper types within `definitions.ts` using conditional types that reference the readonly maps, then export them as `type` aliases. `types.ts` will consume only these aliases, ensuring the flow is `literals → helper types → runtime types`, never the reverse. Prove this with tests that import helpers and exercise them at runtime (e.g., asserting `getToolFromOperationId` returns the correct descriptor for a known operation id).
     - _Risk:_ Regeneration accidentally re-exports `MCP_TOOLS`.
       - _Mitigation:_ Add a generator regression test that imports the barrel and asserts (at runtime) that `typeof (index as { MCP_TOOLS?: unknown }).MCP_TOOLS === 'undefined'`. Complement with a template assertion to detect accidental value exports.
   - **Implementation approach:**
     1. Update `generate-definitions-file.ts` to emit generic helpers that rely solely on the internal maps. Ensure every exported helper is `export function ...` or `export type ...` referencing readonly maps defined above.
     2. Update `generate-types-file.ts` to import the helper `type`s from `definitions.ts` (never the literals) and emit aliases like `export type ToolArgs<TName extends ToolName> = Parameters<ToolDescriptorForName<TName>['invoke']>[1];` guarded by `import type` statements.
     3. Add behavioural generator tests that: (a) compile the emitted files, (b) import helpers to execute representative lookups, and (c) fail if value-level imports occur.
     4. Regenerate via `pnpm type-gen`, confirm the emitted files preserve the one-way dependency graph, and log hashes.

2. **Curate the public MCP barrel and top-level exports**
   - **Current state (verified):** `src/types/generated/api-schema/mcp-tools/index.ts` merely re-exports `definitions.ts`. The package root (`src/index.ts`) still exports `MCP_TOOLS`, even though it no longer exists—downstream packages import it and now fail to type-check.
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

3. **Align runtime code with the accessor surface**
   - **Current state (verified):** `universal-tools.ts` pulls `typeSafeKeys` from `docs/_typedoc_src`, violating package boundaries, and it (along with MCP servers) still imports `MCP_TOOLS` directly. Runtime code bypasses the barrel, so the curated interface provides no benefit.
   - **Intended impact:** Move any shared helpers into SDK-owned modules, swap direct literal access (`MCP_TOOLS`) for accessor functions, and update MCP servers to enumerate tools via `toolNames` and `getToolFromToolName`.
   - **Risks & mitigations:**
     - _Risk:_ Pulling helpers into runtime modules might tempt a back-reference to `MCP_TOOLS` for convenience.
       - _Mitigation:_ Enforce helper functions that accept `ToolName` and retrieve descriptors via `getToolFromToolName`. Add unit coverage that executes these helpers end-to-end (mocking the returned descriptor where needed) to prove callers only use the accessor path.
     - _Risk:_ Consumer code may attempt to mutate `toolNames` (readonly) or rely on object iteration order.
       - _Mitigation:_ Spread readonly arrays before mutation (`[...toolNames].toSorted(...)`) and capture this pattern in behavioural tests that demonstrate sorting remains deterministic without mutating the source array.
   - **Implementation approach:**
     1. Create or relocate a local helper (e.g., `typeSafeEntries.ts`) under the SDK to replace the docs dependency.
     2. Update runtime files (`universal-tools.ts`, `execute-tool-call.ts`, MCP servers) to import from the barrel only.
     3. Update unit tests to execute the revised runtime flows, demonstrating that tool lookups succeed via the new helpers and fail fast when an unknown tool is requested.

4. **Repair MCP registry invocation flow**
   - **Current state (verified):** The generated `lib.ts` (and its template `generate-lib-file.ts`) call `descriptor.invoke(parsed.data)` without supplying the required `OakApiPathBasedClient`. Every generated descriptor currently expects `(client, args)`, so registry calls will throw at runtime.
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
     3. Add a compile-time check that both generated files and the doc-generation entry points type-check in isolation, reinforcing the absence of circular dependencies and confirming no extra tooling is required beyond lint/type-check.

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

7. **Document the canonical surface and remaining risks**
   - **Current state (verified):** Plans and READMEs reference `MCP_TOOLS` as a public export, and documentation for the accessor surface is absent. Doc-generation scripts previously depended on `MCP_TOOLS`, so they must be updated (Step 5) before documentation can be refreshed.
   - **Intended impact:** Update this plan, and relevant READMEs to describe the new helper set, record hashes of generated artefacts, and flag any open risks (e.g., pending consumer updates). Documentation updates rely solely on running lint and type-check over the updated doc-generation code; no doc-gen tooling execution is required for acceptance.
   - **Risks & mitigations:**
     - _Risk:_ Documentation may lag behind code, encouraging future reintroduction of literals.
       - _Mitigation:_ As soon as gates turn green, capture the canonical export list and link supporting evidence in the docs. This can be achieved through generated documentation (pnpm doc-gen), but should also include authored documentation. Include behavioural test references so the documentation points to verified outcomes rather than implementation detail.
   - **Implementation approach:**
     1. After completing Steps 1–6, update README content and evidence logs to reflect the new helpers. Confirm the updated doc-generation scripts pass type-check and lint.
     2. Record stakeholder acknowledgement once quality gates are green.

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
