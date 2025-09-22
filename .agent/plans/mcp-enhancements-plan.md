# MCP Enhancements Plan

## Future Hardening – Tool Generation

- Collapse the generated `*Tool` stubs once we can derive handlers directly from the descriptor constants. The descriptor should be the single source of truth for transports, tooling, and docs.
- Emit a stable constant data structure first, then synthesise TypeScript types, Zod schemas, and type guards from that data so request/response validation remains consistent end-to-end without manual assertions.
- Thread the derived types and guards through `execute-tool-call`, the universal translation layer, and future transports so no path operates on `unknown` values.
- Remove placeholder, no-op `handle` implementations once the generator can route through real executors; this avoids dead code and clarifies the runtime shape for contributors.
- Add generator-level tests that assert descriptions, parameter metadata, and validation rules stay aligned with the upstream OpenAPI schema.
- Investigate higher-level “hero” tools (e.g. `suggest_lesson_plan`) once the canonical transport and compliance work, and the semantic search work, is complete.
