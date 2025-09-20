<!-- markdownlint-disable -->

### New Chat Continuation Prompt — HTTP MCP Strict Type-Safety

Context: We’re delivering a fully type-safe HTTP MCP server. The SDK generates the canonical `MCP_TOOLS` map and types. Apps consume only SDK types and `MCP_TOOLS`. No arrays-of-tools. No `as`, no `any`, no `Record<...>`, no `Object.*`/`Reflect.*`. Zod validators are generated from the OpenAPI schema; no manual Zod.

What we have now:

- `OakMcpToolBase<TIn,TOut>` extends MCP `Tool`; JSON Schema remains for MCP fields, Zod is carried via `zodInputSchema`/`zodOutputSchema` for runtime validation.
- `McpToolRegistry` generics fixed; `validateInput(args)` call corrected.
- Transport uses Node `Readable`/`Writable` streams consistently.
- Typegen (`pnpm type-gen`) succeeds.

What’s left:

- Emit per-tool `OakMcpToolBase<In,Out>` objects in generated tool files (wire `emitOakTool`).
- Implement compile-time output Zod mapping from operation IDs using generated endpoints (avoid hard-coded tables and circular deps).
- Run full quality gates from repo root and fix any residual issues.

Your task now:

1. Wire `emitOakTool` so each tool file exports an `OakMcpToolBase<In,Out>` using JSON Schema (MCP) + Zod (validation). Ensure no hard-coded Zod; import from generated Zod artifacts.
2. Implement dynamic output schema selection by `operationId` from generated endpoints, avoiding circular imports (introduce a thin accessor if needed).
3. Rebuild and run quality gates (see root plan); address any failures.

Please proceed, narrate key edits, and fail fast on invariant breaches.
