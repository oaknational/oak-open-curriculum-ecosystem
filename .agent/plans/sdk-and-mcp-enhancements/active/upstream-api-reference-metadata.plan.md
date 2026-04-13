---
name: "Upstream API Reference Metadata"
overview: "Add an upstreamApi field to every generated MCP tool descriptor, providing the full upstream Oak API URL template, HTTP method, separated path/query parameters, and documented statuses — both in _meta (visible to MCP clients) and as a top-level descriptor field (for SDK consumers)."
specialist_reviewer: "code-reviewer, type-reviewer, mcp-reviewer"
isProject: false
todos:
  - id: t1-add-types
    content: "Add UpstreamApiParameter and UpstreamApiReference interfaces to mcp-protocol-types.ts; add upstreamApi to ToolMeta"
    status: pending
  - id: t2-update-contract
    content: "Add upstreamApi field to ToolDescriptor in generate-tool-descriptor-file.ts"
    status: pending
  - id: t3-thread-data
    content: "Thread baseUrl + param metadata from mcp-tool-generator.ts through generate-tool-file.ts to emit-index.ts"
    status: pending
  - id: t4-emit-field
    content: "Build and emit the upstreamApi literal in emit-index.ts (both top-level and _meta)"
    status: pending
  - id: t5-regenerate
    content: "Run pnpm sdk-codegen to regenerate all tool files with the new field"
    status: pending
  - id: t6-update-tests
    content: "Update unit and E2E tests that assert on tool descriptor shape"
    status: pending
  - id: t7-quality-gates
    content: "Run pnpm check to verify all gates pass"
    status: pending
---

# Upstream API Reference Metadata

**Status**: PENDING — design complete, ready for implementation
**Last Updated**: 2026-04-13

## Problem

Generated MCP tools wrap Oak Open Curriculum API endpoints, but the
tool descriptors don't expose enough information for someone to call
the upstream API directly. The `path` and `method` fields exist
internally, but there is no base URL, no path-vs-query parameter
separation, and this metadata is not visible to MCP clients.

**Use case**: developers discover tools via MCP, then want to call the
Oak Open Curriculum API directly to fetch content. They need the full
URL template, which parameters go in the path vs query string, and
what the API returns — without having to cross-reference the OpenAPI
spec separately.

## Design

Add an `upstreamApi` field to every generated tool, emitted in two
places:

- **`_meta.upstreamApi`** — visible to MCP clients via `tools/list`
- **Top-level `upstreamApi`** — available to SDK consumers alongside
  `toolOutputJsonSchema`

Both share the same shape. The response schema is NOT duplicated — SDK
consumers reference the existing `toolOutputJsonSchema` field on the
same descriptor.

### New types (in `mcp-protocol-types.ts`)

```typescript
interface UpstreamApiParameter {
  readonly name: string;
  readonly in: 'path' | 'query';
  readonly required: boolean;
  readonly type: string;
  readonly description?: string;
  readonly enum?: readonly (string | number | boolean)[];
  readonly default?: unknown;
}

interface UpstreamApiReference {
  readonly baseUrl: string;
  readonly path: string;
  readonly method: string;
  readonly url: string;
  readonly parameters: readonly UpstreamApiParameter[];
  readonly documentedStatuses: readonly string[];
}
```

### Example output (get-key-stages-subject-lessons)

```typescript
upstreamApi: {
  baseUrl: 'https://open-api.thenational.academy/api/v0',
  path: '/key-stages/{keyStage}/subject/{subject}/lessons',
  method: 'GET',
  url: 'https://open-api.thenational.academy/api/v0/key-stages/{keyStage}/subject/{subject}/lessons',
  parameters: [
    { name: 'keyStage', in: 'path', required: true, type: 'string',
      description: 'Key stage slug...', enum: ['ks1','ks2','ks3','ks4'] },
    { name: 'subject', in: 'path', required: true, type: 'string',
      description: 'Subject slug...', enum: ['art','citizenship',...] },
    { name: 'unit', in: 'query', required: false, type: 'string',
      description: 'Optional unit slug...' },
    { name: 'offset', in: 'query', required: false, type: 'number', default: 0 },
    { name: 'limit', in: 'query', required: false, type: 'number', default: 10 },
  ],
  documentedStatuses: ['200', '400', '401', '404'],
}
```

## Files to Change

### 1. Types — `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts`

- Add `UpstreamApiParameter` interface
- Add `UpstreamApiReference` interface
- Add `readonly upstreamApi?: UpstreamApiReference` to `ToolMeta`

### 2. Contract — `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`

- Add `readonly upstreamApi?: UpstreamApiReference` to the
  `ToolDescriptor` interface
- `UpstreamApiReference` is already re-exported from
  `mcp-protocol-types.ts` via the contract's import chain

### 3. Generator orchestrator — `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts`

- Extract `baseUrl` from `schema.servers?.[0]?.url ?? ''`
- Pass `baseUrl`, `pathParamMetadata`, and `queryParamMetadata`
  through to `generateToolFile`

### 4. Tool file assembly — `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-file.ts`

- Update `generateToolFile` signature to accept `baseUrl`
- Pass `baseUrl`, `pathParamMetadata`, `queryParamMetadata` to
  `emitIndex`

### 5. Descriptor emitter — `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`

- Update `emitIndex` and `buildExports` signatures to accept
  `baseUrl`, `pathParamMetadata`, `queryParamMetadata`
- Build the `upstreamApi` literal from the available metadata
- Emit it both as a top-level field and inside `_meta`
- Helper function:
  `buildUpstreamApiLiteral(baseUrl, path, method, pathParamMetadata,
  queryParamMetadata, documentedStatuses)`

### 6. Regenerate

- Run `pnpm sdk-codegen` — all ~24 generated tool files get the new
  field

### 7. Tests

- Update unit tests for `emit-index.ts` and `generate-tool-file.ts`
  that assert on descriptor shape
- Update any snapshot or E2E tests that check tool descriptor
  structure (e.g. `server.e2e.test.ts` hardcoded tool assertions)

## Data Flow

```text
OpenAPI Schema (servers[0].url + paths + operations)
  ↓
mcp-tool-generator.ts — extracts baseUrl, iterates operations
  ↓
generate-tool-file.ts — assembles per-tool .ts file
  ↓
emit-index.ts — builds descriptor object literal
  ↓
├── top-level upstreamApi field → SDK consumers (+ toolOutputJsonSchema)
└── _meta.upstreamApi field    → MCP clients via tools/list
```

## Scope Boundaries

- **Only generated tools** get `upstreamApi` — aggregated/hand-written
  tools (EEF, misconception graph, etc.) do not map to upstream API
  endpoints and must NOT receive this field
- **No response schema duplication** — `toolOutputJsonSchema` already
  exists on the descriptor; the `upstreamApi` field does not repeat it
- **Parameter names use the original OpenAPI names** (e.g. `keyStage`,
  not the MCP-normalised name without `Slug` suffix — since these are
  for calling the API directly)
- **Base URL comes from the OpenAPI schema** (`servers[0].url`), not
  hardcoded

## Pre-Implementation Review Findings

These are open questions and potential issues to resolve before or
during implementation. A pre-implementation review with code-reviewer,
type-reviewer, and mcp-reviewer is recommended.

### F1: `_meta` payload size

Adding `upstreamApi` to `_meta` on every tool increases the
`tools/list` response payload. For tools with many enum values (e.g.
`subject` has 17 values), the parameter array is non-trivial. Verify
that MCP clients (Cursor, Claude Desktop, etc.) handle larger `_meta`
gracefully. Mitigation: if payload size is a concern, omit `enum`
arrays from the `_meta` version and keep them only on the top-level
descriptor.

### F2: `default` field typing

The `default` field on `UpstreamApiParameter` is typed as `unknown`.
This is one of the permitted exceptions (genuinely polymorphic data
from OpenAPI — defaults can be string, number, or boolean). Verify
this satisfies the `unknown-is-type-destruction` rule. Alternative:
use `readonly default?: string | number | boolean` to match the enum
type union.

### F3: Parameter name divergence — MCP vs API

The MCP flat input schema normalises parameter names (strips `Slug`
suffix via `normaliseParamName`). The `upstreamApi` field uses original
OpenAPI names. This is intentional — someone calling the API directly
needs the real parameter names. But it means `upstreamApi.parameters`
names may differ from `inputSchema` property names. Document this
divergence clearly in TSDoc.

### F4: Redundancy with existing `path` and `method` fields

The top-level descriptor already has `path` and `method` fields. The
`upstreamApi` object also contains `path` and `method`. This is
intentional — `upstreamApi` is a self-contained reference that makes
sense in isolation (especially in `_meta` where the top-level fields
are not visible). But the redundancy should be acknowledged in TSDoc.

### F5: Base URL stability

The base URL comes from the OpenAPI schema's `servers[0].url`. If the
upstream API adds multiple server entries (e.g. staging vs production),
the generator takes the first. Verify this is the correct behaviour
and consider whether the field should be named `productionBaseUrl` to
be explicit.

### F6: Aggregated tool exclusion

Aggregated tools (`AGGREGATED_TOOL_DEFS`) are hand-written and do not
pass through the codegen pipeline. Verify that no downstream code
assumes ALL tools have `upstreamApi`. The field is optional on both
`ToolMeta` and `ToolDescriptor` — confirm that consumer code
(e.g. `listUniversalTools`, the MCP registration path) handles the
absent case.

### F7: Future work — description text enrichment

A follow-up session should consider appending a brief API reference
line to the tool's `description` text (e.g.
"Upstream API: GET https://open-api.thenational.academy/api/v0/subjects").
This makes the information visible to LLMs that read descriptions but
not `_meta`. Deferred to a separate session per owner decision.

## Size Estimate

~80 lines of new type definitions and helper code in the codegen
pipeline. ~24 generated tool files updated (automated via
`pnpm sdk-codegen`). ~30 lines of test updates. No new dependencies.

## Exit Criteria

1. Every generated tool has `upstreamApi` on both `_meta` and
   top-level
2. `upstreamApi.url` is the full URL template (base + path)
3. Parameters correctly separated into path vs query with original
   OpenAPI names
4. Aggregated tools do NOT have `upstreamApi`
5. `toolOutputJsonSchema` is NOT duplicated in `upstreamApi`
6. `pnpm check` passes
7. Pre-implementation review findings F1-F6 resolved

## Key Files

| File | Change |
|------|--------|
| `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts` | Add types |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts` | Add field to contract |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts` | Thread baseUrl |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-file.ts` | Pass data through |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts` | Emit upstreamApi |
| `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/*.ts` | Regenerated (all ~24) |
