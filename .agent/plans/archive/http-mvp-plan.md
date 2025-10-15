<!-- markdownlint-disable -->

# HTTP Server MVP — Strict Type-Safety Plan

Date: 2025-09-17
Owner: Engineering (MCP/Oak SDK)

## Objective

Deliver the HTTP MCP server fully type-safe. Enforce the strict type flow:

core (generic base types) → SDK (specific) → apps (specific only).

## Non‑Negotiable Rules

- No `@modelcontextprotocol/sdk` imports outside `packages/core/mcp-core`.
- No `as`, `any`, `Record<string, *>`, or index signatures where mapped types apply.
- Apps must not import base types. Apps consume SDK-specific types only.
- JSON-ish types are quarantined; prefer exact compile-time types end-to-end.
- Unknown only at external boundaries; validate with Zod or official SDKs, then operate in a trusted zone.
- Type-only imports are required where applicable: `import type { ... }`.
- Avoid `Object.*` and `Reflect.*`; prefer type-safe helpers.
- Transport is Streamable HTTP; do not use SSE.

## Testing Discipline (Behaviour-First)

- Tests must prove useful behaviour, never implementation details.
- Prefer pure functions and unit tests; use simple fakes for integration tests; no I/O except in E2E.
- Use TDD: Red (failing test), Green (minimal code), Refactor (keep behaviour proven).
- Avoid brittle string/line assertions in generator tests; assert exported shapes and runtime behaviour instead.
- Mocking remains simple and injected; no complex mocks or side-effectful tests.

## Architectural updates (since initial draft)

- `mcp-core` and `mcp-server-kit` were removed. Any needed helpers were relocated; server-kit is deleted.
- MCP types and the canonical tool map are generated and owned by the SDK. Apps import the generated `MCP_TOOLS` directly; arrays of tools are removed.
- We retain OakMcp types that extend `@modelcontextprotocol/sdk` types inside the SDK to preserve compatibility and to attach input/output validators.

## SDK (packages/sdks/oak-curriculum-sdk)

- Generators emit strict tool map and helpers:
  - `export const MCP_TOOLS` — canonical tool map (key equals literal `name`).
  - `types.ts` exports `ToolName`, `isToolName`, `OakMcpToolBase<TIn,TOut>`; `OakMcpToolBase` continues to extend the MCP `Tool` type.
  - `lib.ts` exports `McpToolRegistry`, `attachMcpHandlers`, `formatStandardContent` (generated).
- Validators: input/output schema validators are generated and will be attached to each tool definition; unknown at boundary, validated before execution via generated Zod.
- Forbidden patterns removed in scripts and emitted code: no `Record<...>`, no `Object.*`, no vague index signatures, no `as` (except `as const` in emitted literals).

## Apps (HTTP/STDIO)

- Apps import `MCP_TOOLS` directly from the SDK. Arrays of tools have been removed.
- Handlers iterate `MCP_TOOLS` via type-safe helpers to register tools and to invoke `executeToolCall`.
- STDIO/HTTP wiring updated to avoid legacy helpers and deleted files.

## Acceptance Criteria

- Apps only import SDK-specific types and `MCP_TOOLS`; searching the repo shows no base or upstream SDK type usage in apps.
- SDK emits strict tool map with literal `name` and validators; no prohibited patterns in generated code.
- Type-only imports used where applicable.
- Docs build succeeds with no errors for exported types/functions.
- Quality gates pass from repo root: `pnpm make && pnpm qg`.
- Tests assert behaviour:
  - Generator tests verify exported tool descriptors (`invoke`, `pathParams`, `queryParams`, `inputSchema.required/properties`) and runtime validators semantics; no text-line expectations.
  - Executor tests verify argument coercion, split into path/query using emitted metadata, and required/optional handling, all in-process with simple fakes.
  - Providers/storage/env tests prove observable behaviour (e.g., get/set/delete round-trip) with standard `expect` usage.

## Progress

- Completed:
  - Removed server-kit; relocated formatting functions where required.
  - SDK typegen hardened: eliminated prohibited patterns in generators and emitted code; moved from arrays of tools to generated `MCP_TOOLS` map.
  - `OakMcpToolBase<TIn,TOut>` updated to extend MCP `Tool` while carrying Zod validators via dedicated `zodInputSchema`/`zodOutputSchema` fields (JSON Schema remains for MCP contract fields).
  - Generator unification: single `generateToolFile` path now used by all writers.
  - Output schema accessor generated: `getResponseSchemaForEndpoint(method, path)` returns typed `ZodSchema` and normalises path placeholders.
  - `generate-lib-file.ts`: removed unnecessary generic on `McpToolRegistry.call(...)`.
  - Index generator: `MCP_TOOLS` emitted as `Readonly<Record<ToolName, ToolDescriptor>>`.
  - Params emitter: `Set` generics emitted via constructor type args; validators maps emitted as `Readonly<Record<...>>`.
  - OpenAI connector generator trimmed to satisfy `max-lines`.
  - Typegen runs clean (`pnpm type-gen` succeeds). Build and type-check pass.

- In progress:
  - Per-tool `...Tool: OakMcpToolBase<In,Out>` objects are emitted; `zodOutputSchema` defers resolution; `validateOutput` to use a typed schema variable to satisfy unsafe-call lint.
  - Replace remaining index signatures in emitted files (e.g. `ValidRequestParams`) with `Record`-based type aliases.
  - Repo-wide lint clean-up in non-SDK packages (env, providers-node, storage, transport, notion app).
  - Update tests to behaviour-first structure; convert brittle code-text assertions to structural/behavioural assertions.

- Blockers/risks:
  - Circular import risk when referencing generated Zod endpoints from generated tool files. Mitigation: centralize endpoint schema accessors and import them from a stable leaf module to avoid cycles.
  - JSON Schema vs Zod duality: MCP `Tool` requires JSON Schema; we also need precise runtime validation. Strategy: keep JSON Schema fields for MCP and carry Zod via explicit fields used by our registry/validators.
  - Ensuring zero hard-coded Zod/types/values in emitters: any placeholder must be replaced with programmatic extraction from OpenAPI or generated Zod artifacts.

## Next Steps

1. Unify tool file generation (single source of truth)
   - Remove the locally defined `generateToolFile` in `packages/sdks/oak-curriculum-sdk/scripts/typegen/mcp-tools/mcp-tool-generator.ts`.
   - Import and use `packages/sdks/oak-curriculum-sdk/scripts/typegen/mcp-tools/parts/generate-tool-file.ts`’s `generateToolFile` so that `emitOakTool` is executed for every tool.
   - Acceptance: regenerated tool files contain both the existing executor export and a per-tool `...Tool: OakMcpToolBase<In,Out>` export.
2. Compile-time output schema accessor
   - In the generated `types.ts`, expose `getResponseSchemaForEndpoint(method, path)` that imports `src/types/generated/zod/endpoints.ts` and returns `endpoint.response` for the matching `(method, path)`; for path matching convert OpenAPI placeholders `/x/{y}` → `/x/:y`.
   - Ensure this accessor is a leaf to avoid circular imports from tool files.
3. Wire runtime validators into each tool
   - Ensure `validateOutput` uses a typed local schema variable: `const schema: ZodSchema = getResponseSchemaForEndpoint(...); schema.safeParse(...)`.
   - Keep MCP `inputSchema`/`outputSchema` JSON Schemas (derived from OpenAPI) for protocol fields; use Zod at runtime for validation.
   - Emit `validateInput`/`validateOutput` using `safeParse`, returning `{ ok, data | message }`.
4. Strengthen generated type surfaces
   - Ensure `MCP_TOOLS` remains the canonical exported map with literal tool names and descriptor shape.
   - Optionally emit `OAK_TOOLS` (map of `OakMcpToolBase`) if required by apps; otherwise consumers import per-tool `...Tool` when needed.
5. Remove prohibited patterns in generators and output
   - Eliminate `as`, `any`, `Record<...>`, `Object.*`/`Reflect.*` from both scripts and emitted code (except `as const` in emitted literals).
   - Use type-only imports where applicable.
6. Tests (TDD for generators)
   - Replace line/text expectations with behavioural assertions:
     - Assert that generated modules export `invoke(client, params)`, `pathParams`/`queryParams` metadata with correct `required` flags, and `inputSchema` shape (`properties`, `required`).
     - Assert `validateInput`/`validateOutput` semantics via `safeParse`, not implementation lines.
   - Add/keep a unit test for `getResponseSchemaForEndpoint` covering placeholder normalisation and method casing.
   - Executor tests: unit-test helpers (string/JSON coercion, split, required rules) and an integration test for full request building with simple fakes.
   - Classification workflow for failures: update tests when contracts changed intentionally; otherwise, fix code regressions minimally.
7. Run quality gates (from repo root)
   - `pnpm i`
   - `pnpm type-gen`
   - `pnpm build`
   - `pnpm type-check`
   - `pnpm lint -- --fix`
   - `pnpm doc-gen`
   - `pnpm format:root`
   - `pnpm markdownlint:root`
   - `pnpm test`
   - `pnpm test:e2e`
8. Documentation
   - Update SDK docs to show `MCP_TOOLS` as the only app entry‑point; demonstrate runtime input/output validation via per‑tool `...Tool`.

## Out of Scope

- Prompts/Resources tooling (post-MVP).
- OpenTelemetry/error library extraction.
