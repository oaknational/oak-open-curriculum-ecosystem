# SDK Enhancements Plan

Status: Proposal (quick wins + high-impact improvements)

## Goals

- Strengthen compile-time generation for MCP tools while keeping the current deterministic build approach.
- Improve developer ergonomics and type-safety for tool inputs/outputs.
- Enhance documentation artifacts for AI agents and humans.

## Quick Wins

1. Export per-tool output types
   - Generate `ToolOutput<ToolName>` types (and union `AllToolOutputs`) from schema responses.
   - Update `ToolExecutionResult` to use generated output type when known.

2. Optional Zod validators for outputs
   - Evaluate if Zod 4 will work with the current Zod generation approach
   - Generate Zod schemas for response bodies and export them per tool.
   - Keep optional to avoid runtime overhead unless used.

3. JSON Schema emission for MCP
   - Export a helper that converts generated parameter metadata into MCP JSON Schema.
   - Reduce duplication in app code that derives schemas for MCP registration.

4. Narrower error types
   - Extend `McpToolError` and `McpParameterError` with standardized `code` enums.
   - Provide helpers for mapping API error shapes to error codes.

5. Offline/CI guardrails
   - Improve error messages when cached schema is missing or invalid.
   - Document the exact workflow for refreshing and committing schemas.

## High-Impact Improvements

1. Strongly-typed executors
   - Propagate exact input and output types into generated executors.
   - Expose a generic `executeToolCallTyped<ToolName>()` that returns typed `data`.

2. Operation grouping & tags
   - Generate groupings by OpenAPI tags and export index helpers.
   - Useful for dynamic tool discovery and docs generation.

3. Rich AI documentation bundle
   - Enhance `generate-ai-doc.ts` to include usage samples and example inputs/outputs per tool.
   - Output a compact JSON bundle with tool metadata for agent consumption.

4. Stability/versioning metadata
   - Emit per-tool stability flags (e.g., experimental/stable) and API version.
   - Facilitate safe tool selection and upgrade planning.

5. Test mocks
   - Have the compile time code generate simple mocks for the SDK and the MCP tools. These will enable integration tests of other systems that use the SDK in tests where we don't care about SDK behaviour.

6. Tool discovery/listing
   - Add a tool that allows tools to be discovered by tag, e.g. 'search'

## Non-Goals

- Changing compile-time generation to runtime fetching (keep current approach).
- Introducing breaking changes to existing SDK consumer APIs without migration path.

## Acceptance

- SDK continues to generate `MCP_TOOLS` deterministically at build time.
- New types and helpers are additive and do not require app changes.
- Documentation and typing improvements demonstrably reduce boilerplate in apps.

## Next Steps (time-boxed)

1. Prototype per-tool output types + typed executor wrapper (2–4h)
2. Add MCP JSON Schema helper export (1–2h)
3. Extend error codes and document mapping (1–2h)
4. Expand AI doc generation with examples (2–3h)
5. Write short README section describing new exports and usage (1h)
