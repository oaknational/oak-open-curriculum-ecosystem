## HTTP MCP Server — Strict MVP Context

Last updated: 2025-09-17 (refreshed after generator and lint fixes)

### Goal

Deliver the HTTP MCP server fully type-safe using the enforced flow:

core (base types) → SDK (specific) → apps (specific only).

### Current Status

- Core/server-kit: removed; required helpers integrated elsewhere. OakMcp types are maintained in the SDK for compatibility and validators.
- SDK:
  - Generates `MCP_TOOLS` map with literal `name` (now emitted as `Readonly<Record<ToolName, ToolDescriptor>>`).
  - Emits `types.ts` with `ToolName`, `isToolName`, `OakMcpToolBase<TIn,TOut>`, and `getResponseSchemaForEndpoint(...)` returning a `ZodSchema`.
  - Emits `lib.ts` (`McpToolRegistry`, `attachMcpHandlers`, `formatStandardContent`); removed unnecessary generic from `call(...)`.
  - Zod: input/output schemas generated; per‑tool `...Tool: OakMcpToolBase<In,Out>` emitted; `zodOutputSchema` defers, resolution done inside `validateOutput`.
  - Emissions updated to avoid index signatures (use `Record`) and use generic constructors for `Set`.
- Apps:
  - STDIO and HTTP apps consume `MCP_TOOLS` directly; arrays of tools removed; handlers iterate the map.
  - Logger imports corrected; wiring adjusted to avoid legacy server-kit/core usage.
- Quality gates:
  - `pnpm type-gen`, build and type‑check succeed. Lint partially passing; remaining items are targeted for SDK and other packages.
  - Some generator unit tests assert emitted code text/lines. Given refactors, we will convert these to behavioural/structural assertions (see Testing Strategy) rather than brittle line checks.

### Gaps to Target State

- Transport stream abstraction aligned to Node streams; verify no remaining generic stream references.
- Finish lint clean-up in generated SDK tools (unsafe error‑typed usage; remaining index signatures) and across other packages.
- Update tests to assert behaviour not implementation, especially generator tests relying on specific textual headers.

### Enforced Rules (summary)

- No `@modelcontextprotocol/sdk` imports in apps (vendor imports live in SDK generation only).
- No `as`, `any`, `Record<string, *>`, or index signatures where mapped types apply.
- Unknown only at external boundaries; validate with Zod/validators, then operate in trusted zone.
- Prefer type-only imports.
- Avoid `Object.*` and `Reflect.*`; use type-safe helpers.
- Transport: Streamable HTTP, not SSE.

### Next Steps

1. Unify generator to call the canonical writer
   - Remove local `generateToolFile` from `mcp-tool-generator.ts`; import and use `parts/generate-tool-file.ts` so `emitOakTool` runs for every tool.
2. Generate accessor for response schemas
   - In generated `types.ts`, export `getResponseSchemaForEndpoint(method, path)` that finds the endpoint in generated `endpoints` and returns `response` (with `/x/{y}` → `/x/:y` normalisation).
3. Emit runtime validators into per-tool objects
   - Ensure each tool exports `...Tool: OakMcpToolBase<In,Out>` with `zodInputSchema` (params) and `zodOutputSchema` (from accessor). Keep MCP JSON Schemas for protocol fields.
4. Quality gates
   - Run full gates from repo root; fix any type/lint/doc/test failures.
5. Tests (behaviour-first)
   - Convert generator tests from string/line-based expectations to behavioural checks:
     - Verify presence and shape of `invoke(client, params)`, `pathParams`/`queryParams`, and `inputSchema` (`properties`, `required`).
     - Verify `validateInput`/`validateOutput` semantics via `safeParse`.
   - Executor: test argument coercion and split logic via pure helpers; integration tests use simple fakes and no I/O.
6. Docs
   - Update usage examples to consume `MCP_TOOLS` and show runtime validation.

### References

- Plan: `.agent/plans/http-mvp-plan.md`
- Rules: `.agent/directives/principles.md`
