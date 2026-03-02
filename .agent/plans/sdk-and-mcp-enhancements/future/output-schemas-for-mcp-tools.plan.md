# Output Schemas for MCP Tools

**Status**: Future
**Created**: 2 March 2026
**Last Updated**: 2 March 2026
**Priority**: Medium — improves model reasoning, ChatGPT integration, and spec compliance

## Context

The MCP spec (2025-06-18) defines `outputSchema` as an optional field on tool
definitions. The `@modelcontextprotocol/sdk` (1.27.0) already supports it in
the `ToolSchema` type. The project currently ships all 30 tools (23 generated,
7 aggregated) without `outputSchema`.

### Why This Matters

1. **Model reasoning**: The spec says output schemas help "guiding clients and
   LLMs to properly parse and utilize the returned data." The model sees the
   schema at `tools/list` time, giving it a structural understanding of what
   each tool returns before calling it.
2. **ChatGPT integration**: The OpenAI Apps SDK reference states
   `structuredContent` "Must match the declared `outputSchema`, when provided."
   ChatGPT actively uses it as a contract.
3. **Context grounding**: Including `oakContextHint` as a formally declared
   property in the output schema makes it a first-class part of the tool's
   return type — a stronger signal than an incidental field in the response.
4. **Spec compliance**: The spec says "Servers MUST provide structured results
   that conform to this schema" when one is declared. This aligns with our
   schema-first principles.
5. **Validation**: The spec says "Clients SHOULD validate structured results
   against this schema." This gives clients a machine-checkable contract.

### SDK Limitation

The SDK (1.27.0) restricts `outputSchema` to `type: "object"` at the root
level. There is an open issue
([modelcontextprotocol/modelcontextprotocol#1906](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1906))
about this conflicting with the prose spec which allows arrays and primitives.
For now, all schemas must be object-typed.

## Cardinal Rule Compliance

Output schemas for the 23 generated tools MUST be generated at `sdk-codegen`
time from the OpenAPI spec. This is non-negotiable — the schemas must flow from
the same source as `inputSchema`, `description`, and `documentedStatuses`.

The 7 aggregated tools have hand-authored definitions and will have
hand-authored output schemas, consistent with their existing pattern.

## Scope

### Generated Tools (23)

- Extend the code-generation pipeline
  (`code-generation/typegen/mcp-tools/parts/`) to emit `outputSchema` from
  the OpenAPI response schemas
- Each tool's output schema should describe the shape of the
  `structuredContent` object it returns
- Include `oakContextHint` as an optional string property (present when
  `requiresDomainContext` is true)
- Include `summary` as a required string property (always present via
  `formatToolResponse`)

### Aggregated Tools (7)

- Add `outputSchema` to each tool definition in its definition module
- Schema must match the actual `structuredContent` shape produced by the
  tool's execution function
- Tools: `search`, `fetch`, `get-curriculum-model`, `get-thread-progressions`,
  `get-prerequisite-graph`, `browse-curriculum`, `explore-topic`

### Shared Response Envelope

All tools using `formatToolResponse` produce a common envelope:

```typescript
{
  summary: string;         // Always present
  oakContextHint?: string; // Present when includeContextHint !== false
  status?: string;         // Present when provided
  ...toolSpecificData      // Spread from the data parameter
}
```

Consider defining a shared base schema that individual tool schemas extend.

## Approach

1. **Start with aggregated tools** — hand-authored, lower risk, validates the
   pattern
2. **Extend to generated tools** — update the generator templates, run
   `pnpm sdk-codegen`, verify all 23 tools get correct schemas
3. **Add validation tests** — verify `structuredContent` conforms to declared
   `outputSchema` in integration tests
4. **E2E verification** — confirm schemas appear in `tools/list` responses

## Dependencies

- MCP SDK 1.27.0+ (already met)
- No upstream API changes needed
- Generator template changes in `code-generation/typegen/mcp-tools/parts/`

## Open Questions

- Should the `oakContextHint` field be included in the schema even for tools
  where `requiresDomainContext` is false? (Currently it defaults to included
  unless explicitly excluded.)
- Should `_meta` fields like `toolName` and `annotations/title` be part of the
  schema? (Probably not — `_meta` is widget-only and not part of
  `structuredContent`.)
- Monitor the SDK `type: "object"` restriction — if resolved, consider whether
  any tools would benefit from non-object root types.

## Related

- [ADR-029: No Manual API Data Structures](../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md)
- [ADR-030: SDK Single Source of Truth](../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](../../../docs/architecture/architectural-decisions/031-generation-time-extraction.md)
- [Schema-First Execution Directive](../../directives/schema-first-execution.md)
- MCP spec: [Tools — Output Schema](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#output-schema)
- OpenAI Apps SDK: [Tool Results Reference](https://developers.openai.com/apps-sdk/reference#tool-results)
