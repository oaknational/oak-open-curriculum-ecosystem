---
name: "MCP Output Schemas and Response Validation"
overview: "Expose truthful `outputSchema` metadata for every MCP tool while preserving schema-derived validation of upstream API responses and aligning transport-level response shapes with the declared contract."
source_research:
  - "../roadmap.md"
todos:
  - id: phase-0-contract-audit
    content: "Phase 0: Audit the current generated-response validation path, tool inventory, and transport registration surfaces so the work is scoped against the real MCP contract rather than the raw OpenAPI payload shape."
    status: pending
  - id: phase-1-generated-tool-schemas
    content: "Phase 1: Generate truthful `outputSchema` objects for the 23 generated tools by composing the existing response JSON Schemas into the actual MCP `structuredContent` envelope."
    status: pending
  - id: phase-2-aggregated-tool-schemas
    content: "Phase 2: Add hand-authored `outputSchema` declarations for the 8 aggregated tools, matching each tool's real `structuredContent` shape rather than forcing an over-generic shared envelope."
    status: pending
  - id: phase-3-transport-exposure
    content: "Phase 3: Expose `outputSchema` through the MCP registration and `tools/list` surfaces, and align any transport that would otherwise advertise a false contract."
    status: pending
  - id: phase-4-validation-and-review
    content: "Phase 4: Prove that runtime `structuredContent` conforms to the declared schemas and run the required reviewer set before the plan is marked complete."
    status: pending
---

# MCP Output Schemas and Response Validation

**Last Updated**: 2026-03-07
**Status**: Current — queued, not started
**Priority**: High — improves model reasoning and spec compliance, but only if
the declared contract matches the real MCP response surface

## Why This Plan Exists

The MCP tool surface currently exposes `inputSchema` but not `outputSchema`.
That leaves models and MCP clients without a machine-checkable description of
the `structuredContent` they will receive.

The earlier plan version blurred two different contracts:

1. **Upstream API response validation**
2. **MCP tool result declaration**

This rewrite separates them explicitly.

## The Key Clarification

### Contract A — Upstream API Responses

For generated tools, the repository already generates both:

1. `toolOutputJsonSchema`
2. `zodOutputSchema`

These come from the generated response descriptors and are already used to
validate the raw upstream payload in the generated runtime executor before the
result becomes an MCP response.

This is the relevant existing behaviour:

1. generated descriptors expose `toolOutputJsonSchema` and `zodOutputSchema`
2. `callTool()` validates the raw tool output against `descriptor.validateOutput`
3. successful execution returns `{ status, data }`

That validation path is valuable and must remain generator-driven.

### Contract B — MCP `structuredContent`

`outputSchema` is not the raw API response schema. It is the schema for the
final MCP `structuredContent` object exposed to clients at tool-call time.

For generated tools, the runtime wraps the validated API payload in the MCP
response envelope created by `formatToolResponse()`. That means the MCP output
contract is a composed wrapper, not the raw OpenAPI response body.

For aggregated tools, the output contract is whatever their execution functions
actually place into `structuredContent`.

## Current State

### Tool Inventory

The repository currently exposes:

1. **23 generated tools**
2. **8 aggregated tools**

Total: **31 tools**

The aggregated set is:

1. `search`
2. `fetch`
3. `get-curriculum-model`
4. `get-thread-progressions`
5. `get-prerequisite-graph`
6. `browse-curriculum`
7. `explore-topic`
8. `download-asset`

### Transport Inventory

The current transports do not expose the same tool surface:

1. **Universal/streamable HTTP** exposes all 31 tools through
   `listUniversalTools()`
2. **Stdio** currently exposes only the 23 generated tools

That distinction matters for this plan:

1. the universal/HTTP surface is the main place where all 31 tool contracts
   must become visible
2. stdio must not advertise generated-tool `outputSchema` until its success
   responses return matching `structuredContent`

### What Already Exists

1. generated JSON Schema and Zod response descriptors
2. generated runtime validation for raw tool outputs
3. aggregated tool definitions and execution functions
4. a shared `formatToolResponse()` helper for most MCP results
5. transport-specific tool registration layers

### What Is Missing

1. truthful `outputSchema` metadata on the MCP tool definitions
2. a clear generator/runtime distinction between raw response validation and MCP
   output declaration
3. transport-level propagation of `outputSchema` through `tools/list`
4. proof that every declared schema matches the actual emitted
   `structuredContent`

## Design Principles

### 1. Preserve Existing Response Validation

This work must not replace schema-derived response validation with hand-authored
runtime logic.

Generated tools already validate upstream payloads. The plan must strengthen
that story, not regress it.

### 2. Declare the MCP Contract Truthfully

If a tool advertises `outputSchema`, the declared schema must match the real
`structuredContent` object that transport returns.

No transport may advertise a schema it does not actually honour.

### 3. Keep Generated and Authored Work in Their Proper Layers

1. **Generated tools**: compose output schemas at `sdk-codegen` time from the
   generated response JSON Schemas plus the MCP wrapper contract
2. **Aggregated tools**: hand-author the output schema beside the hand-authored
   tool definition
3. **Runtime**: consume these schemas; do not invent them

### 4. Prefer Precise Contracts Over Over-Generalised Helpers

`formatToolResponse()` creates a common framing pattern, but not every tool
exposes the same top-level fields. A helper may be used where truthful, but the
plan must not force a fake universal `status?: string` contract across tools
that do not actually emit that field.

### 5. Land on the canonical descriptor surface, not today's app seam

`outputSchema` must be threaded through the canonical transport-neutral SDK tool
descriptor surface, not directly through whatever temporary app-owned exposure
path exists at the time. If the boundary-simplification plan replaces a mixed or
app-owned exposure surface, this plan must consume the new canonical descriptor
rather than extending the superseded seam.

## Scope

In scope:

1. generating MCP output schemas for the 23 generated tools
2. hand-authoring MCP output schemas for the 8 aggregated tools
3. explicitly preserving and documenting generated upstream-response validation
4. exposing `outputSchema` through the MCP registration and `tools/list`
   surfaces
5. aligning any transport whose success responses would otherwise contradict the
   declared schema
6. tests that prove declared `outputSchema` matches runtime `structuredContent`

Out of scope:

1. changing upstream API payloads
2. replacing Zod validation with ad hoc JSON Schema runtime validation
3. introducing compatibility layers or dual contracts
4. broad MCP Apps/widget migration work unrelated to tool metadata

## Resolved Decisions

### 1. Source of Truth for Generated Tool Output

Use the **generated SDK response descriptors** as the source of truth for the
validated payload inside the MCP wrapper.

That means:

1. do not derive generated output schemas from hand-written runtime objects
2. do not derive generated output schemas from the undecorated
   `api-schema-original.json`
3. do derive them from the generated response descriptor JSON Schemas produced
   from the SDK-decorated schema flow already used by runtime validation

### 2. Relationship Between Validation and `outputSchema`

The plan should make this explicit:

1. **runtime validation** continues to use generated validators for the raw
   upstream payload
2. **`outputSchema`** documents the post-wrapper MCP `structuredContent`
3. generated MCP output schemas should be composed from the already-generated
   response JSON Schema plus the wrapper fields actually emitted at runtime

### 3. Transport Truthfulness

The plan must stay explicit about the current split:

1. the universal/HTTP runtime already uses `formatToolResponse()` for generated
   and aggregated MCP outputs
2. the stdio success path currently returns text content only for generated
   tools
3. therefore stdio cannot advertise the generated-tool MCP wrapper schema until
   its success response shape is aligned

### 4. Root Type Restriction

Every emitted `outputSchema` must remain object-shaped at the root. This still
allows truthful object unions such as `oneOf` over different
`{ status, data }` pairings where needed.

### 5. Boundary sequencing

Phases 0-2 of this plan can proceed while the runtime-boundary follow-up is
queued or in progress. However, Phase 3 must consume the canonical descriptor
groundwork from `mcp-runtime-boundary-simplification.plan.md` rather than
extending the current app-owned `listUniversalTools()` / `tools/list` exposure
seam directly.

## Output Shape Strategy

### Generated Tools

For generated tools, the intended MCP output contract is:

```typescript
{
  summary: string;
  status: number | string;
  data: <validated response payload>;
  oakContextHint?: string;
}
```

Important nuance:

1. `status` is top-level because the generated runtime currently passes
   `{ status, data }` into `formatToolResponse()`
2. `summary` is always present
3. `oakContextHint` is present only when the descriptor says the tool requires
   domain context
4. if a tool has multiple documented statuses, the schema should model the
   actual `{ status, data }` pairing truthfully rather than pretending only the
   primary status exists

### Aggregated Tools

Aggregated tools must match their real `structuredContent` shape exactly.

Examples:

1. `fetch`: `summary`, `status`, `id`, `type`, `canonicalUrl`, `httpStatus`,
   `data`, optional `oakContextHint`
2. `search`: different but still object-shaped outputs for scoped search versus
   suggest mode
3. `download-asset`: `summary`, `downloadUrl`, `lesson`, `type`
4. graph/model tools: `summary` plus the graph/model payload they already expose

Do not force all aggregated tools into one artificial shared envelope if that
would reduce truthfulness.

## Execution Phases

### Phase 0 — Audit the Real Contract

Goal: remove ambiguity before editing generators or runtime surfaces.

Tasks:

1. confirm the tool count and aggregated inventory
2. document the exact generated validation flow from descriptor response schema
   to `callTool()`
3. document the actual `structuredContent` shape for:
   - one generated tool with a single documented status
   - one generated tool with multiple documented statuses
   - each aggregated tool family
4. identify every transport surface that must expose or consume `outputSchema`
5. identify any transport that would advertise a false contract unless response
   shaping is aligned first

Phase complete when:

1. the plan still describes **31** tools, not stale counts
2. the generator/runtime split is written down clearly
3. there is no remaining ambiguity about where response validation already
   happens

### Phase 1 — Generate Output Schemas for Generated Tools

Goal: emit truthful MCP output schemas for generated tools at `sdk-codegen`
time.

Tasks:

1. extend the MCP tool generator contract so generated descriptors can carry a
   generated `outputSchema`
2. compose that schema from the already-generated response JSON Schema plus the
   wrapper fields the MCP runtime actually emits
3. ensure multi-status tools model the real `status`/`data` relationship rather
   than collapsing to the first documented response only
4. keep the existing generated response validation path intact
5. update generated-tool listing metadata so the new schema is available to
   transport layers

Required outcome:

1. generated tools still validate raw upstream payloads with generated validators
2. generated descriptors now also expose a truthful MCP `outputSchema`
3. no hand-authored per-tool overrides are introduced for generated tools

### Phase 2 — Add Output Schemas for Aggregated Tools

Goal: declare truthful MCP output contracts for all aggregated tools.

Tasks:

1. add `outputSchema` beside each aggregated tool definition
2. model the actual `structuredContent` emitted by each tool family
3. use small shared helpers only where they remain truthful
4. cover the eighth aggregated tool, `download-asset`, explicitly

Required outcome:

1. every aggregated tool has an `outputSchema`
2. no schema claims a top-level field that the tool does not actually emit
3. the authored schemas remain small, readable, and colocated with the tool
   definition

### Phase 3 — Expose the Schemas Through Canonical MCP Surfaces

Goal: make the declared schemas visible to clients without creating a false
contract on any transport.

Tasks:

1. add `outputSchema` to the canonical transport-neutral SDK tool descriptor
   surface
2. expose it through the SDK-owned protocol projection used for `tools/list`
3. expose it through the registration path each transport uses, staying
   helper-compatible for app-rendering tools
4. align any transport response-shaping path that would otherwise declare an
   `outputSchema` but fail to return matching `structuredContent`

Important boundary:

If a transport cannot yet honour the declared schema, fix the transport or keep
`outputSchema` off that transport until it can. Do not knowingly publish a
lying contract.

Transport-specific expectation:

1. universal/HTTP should expose `outputSchema` for all 31 tools once the
   declared contracts are available
2. stdio currently exposes only the 23 generated tools and should only expose
   `outputSchema` after its success path returns matching `structuredContent`

Phase gate:

Do not start this phase until Phase 3 of
`mcp-runtime-boundary-simplification.plan.md` has completed and the canonical
descriptor / projection surface is available.

### Phase 4 — Prove the Contract

Goal: verify both sides of the story:

1. generated/raw response validation still works
2. declared MCP output schemas match runtime `structuredContent`

Minimum test coverage:

1. generator tests for generated output-schema composition
2. a multi-status generated tool test
3. aggregated-tool tests for representative schema families
4. HTTP `tools/list` tests proving `outputSchema` is exposed
5. integration tests proving actual `structuredContent` conforms to the
   declared schema for representative generated and aggregated tools

Minimum reviewers:

1. `mcp-reviewer`
2. `code-reviewer`
3. `docs-adr-reviewer`
4. `test-reviewer` if test files change materially

## Dependencies and Sequencing

1. Phases 0-2 can begin immediately.
2. Phase 3 is blocked on Phase 3 of
   `mcp-runtime-boundary-simplification.plan.md`.
3. If the canonical descriptor surface lands first in the same branch, this plan
   must consume it instead of extending `listUniversalTools()` or an app-owned
   `tools/list` override directly.
4. Do not land transport-exposure work for `outputSchema` against the
   pre-simplification app-owned exposure path.

## Quality Gates

Because this work changes generated artefacts, shared runtime code, and MCP app
surfaces, treat all quality gates as blocking.

Run the full quality-gate sequence defined in
`docs/governance/development-practice.md`. For this work, the expected sequence
is:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm format:root
pnpm markdownlint:root
```

Add targeted test commands during development, but do not treat them as a
replacement for the full gate set.

## Completion Criteria

This plan is complete when all of the following are true:

1. all **31** tools have truthful `outputSchema` declarations
2. generated-tool output schemas are produced at codegen time
3. generated upstream-response validation remains intact and explicitly
   documented in the implementation
4. the universal/HTTP surface exposes `outputSchema` for all 31 tools
5. stdio only exposes `outputSchema` after its generated-tool success responses
   have been aligned to the declared contract
6. no transport advertises a schema it does not honour
7. tests prove representative `structuredContent` objects conform to the
   declared schemas
8. the reviewer set signs off with no unresolved blocking findings

## Related

- [ADR-029: No Manual API Data Structures](../../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md)
- [ADR-030: SDK Single Source of Truth](../../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](../../../../docs/architecture/architectural-decisions/031-generation-time-extraction.md)
- [Schema-First Execution Directive](../../../directives/schema-first-execution.md)
- [MCP Runtime Boundary Simplification](mcp-runtime-boundary-simplification.plan.md)
- MCP spec: [Tools — Output Schema](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#output-schema)
- OpenAI Apps SDK: [Tool Results Reference](https://developers.openai.com/apps-sdk/reference#tool-results) (useful as a comparison point for `structuredContent` expectations, not as separate migration scope)
