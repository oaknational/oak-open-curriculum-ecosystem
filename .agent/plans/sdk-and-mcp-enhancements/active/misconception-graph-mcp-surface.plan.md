---
name: "Misconception Graph MCP Surface"
overview: "Expose the existing misconception graph data as both an MCP resource and an aggregated tool, following the established prerequisite-graph pattern."
parent_plan: "mcp-app-extension-migration.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, test-reviewer"
isProject: false
todos:
  - id: t1-resource-constant
    content: "Create misconception-graph-resource.ts with MISCONCEPTION_GRAPH_RESOURCE constant and getMisconceptionGraphJson() getter"
    status: pending
  - id: t2-aggregated-tool
    content: "Create aggregated-misconception-graph.ts with tool definition, guidance, and runMisconceptionGraphTool() executor"
    status: pending
  - id: t3-register-definitions
    content: "Add get-misconception-graph to AGGREGATED_TOOL_DEFS in definitions.ts"
    status: pending
  - id: t4-register-executor
    content: "Add handler in AGGREGATED_HANDLERS map in executor.ts"
    status: pending
  - id: t5-public-export
    content: "Export MISCONCEPTION_GRAPH_RESOURCE and getMisconceptionGraphJson from public/mcp-tools.ts"
    status: pending
  - id: t6-register-resource
    content: "Add registerMisconceptionGraphResource() to register-resources.ts in the MCP app"
    status: pending
  - id: t7-adr-123-update
    content: "Update ADR-123 resources table with curriculum://misconception-graph"
    status: pending
  - id: t8-e2e-test
    content: "Add E2E assertions for get-misconception-graph tool and misconception resource"
    status: pending
  - id: t9-guidance
    content: "Create misconception-guidance.ts with AGGREGATED_MISCONCEPTION_GUIDANCE constant"
    status: pending
  - id: t10-doc-resource-annotations
    content: "Add annotations (audience, priority) to the 3 documentation resources"
    status: pending
---

# Misconception Graph MCP Surface

**Status**: PENDING
**Last Updated**: 2026-04-08
**Branch**: TBD (new branch from `main` after WS3 merge)

## Context

The misconception graph data pipeline is fully built:

- **Extractor**: `vocab-gen/extractors/misconception-extractor.ts` extracts
  per-lesson misconceptions with responses
- **Generator**: `bulk/generators/misconception-graph-generator.ts` produces
  typed JSON with stats
- **Generated data**: 12,858 misconceptions across 20 subjects, all key stages
- **Types**: `MisconceptionGraph`, `MisconceptionNode`, `MisconceptionGraphStats`
- **Loader**: `generated/vocab/misconception-graph/index.ts` with typed export

The prerequisite graph and thread progressions are both exposed as MCP
resources AND aggregated tools. The misconception graph is not — it is only
available internally via the `@oaknational/sdk-codegen/vocab-data` subpath.

## Decision

Follow the exact pattern established by `prerequisite-graph-resource.ts` and
`aggregated-prerequisite-graph.ts`. No new patterns, no new infrastructure.

## Implementation

### Phase 1: SDK surface (curriculum-sdk)

**T1: Resource constant** — `misconception-graph-resource.ts`

```typescript
export const MISCONCEPTION_GRAPH_RESOURCE = {
  name: 'misconception-graph',
  uri: 'curriculum://misconception-graph',
  title: 'Oak Curriculum Misconception Graph',
  description: 'Common misconceptions with teacher responses, by subject and key stage.',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 0.5,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
};

export function getMisconceptionGraphJson(): string {
  return JSON.stringify(misconceptionGraph, null, 2);
}
```

Pattern source: `prerequisite-graph-resource.ts`

**T9: Guidance constant** — `misconception-guidance.ts`

Teacher-oriented guidance for how the model should use misconception data
(identifying common mistakes, suggesting diagnostic questions, planning
remediation). Pattern source: `prerequisite-guidance.ts`.

**T2: Aggregated tool** — `aggregated-misconception-graph.ts`

- Empty `GET_MISCONCEPTION_GRAPH_FLAT_ZOD_SCHEMA` (no parameters)
- Tool definition with description embedding live stats from the graph
- `runMisconceptionGraphTool()` returning `CallToolResult` via `formatToolResponse`
- Annotations: `readOnlyHint: true`, `idempotentHint: true`

Pattern source: `aggregated-prerequisite-graph.ts`

**T3: Register in definitions** — add to `AGGREGATED_TOOL_DEFS`
**T4: Register in executor** — add to `AGGREGATED_HANDLERS`
**T5: Public export** — add to `public/mcp-tools.ts` barrel

### Phase 2: Server surface (MCP app)

**T6: Register resource** — `register-resources.ts`

Add `registerMisconceptionGraphResource()` following the same pattern as
`registerPrerequisiteGraphResource()`. Call it from `registerAllResources()`.

### Phase 3: Documentation and tests

**T7: ADR-123 update** — add row to resources table:

| `curriculum://misconception-graph` | Misconception data | 0.5 | `["assistant"]` |

**T8: E2E assertions** — verify in `server.e2e.test.ts`:

- Tool appears in `tools/list` response
- Tool call returns structured misconception data
- Resource appears in `resources/list` response
- Resource read returns JSON with expected shape

**T10: Documentation resource annotations** — `documentation-resources.ts`

The 3 documentation resources (`getting-started`, `tools-reference`,
`workflows`) currently have no `annotations`. Add `audience` and `priority`
consistent with the other resources:

- `getting-started`: `{ priority: 0.8, audience: ['user', 'assistant'] }`
- `tools-reference`: `{ priority: 0.6, audience: ['assistant'] }`
- `workflows`: `{ priority: 0.5, audience: ['user', 'assistant'] }`

## Sequencing

```text
T1 resource constant     ─┐
T9 guidance constant      ├─▶ T3 definitions ──▶ T4 executor ──▶ T5 export
T2 aggregated tool       ─┘
                                                                      │
T6 register resource ◀──────────────────────────────────────────────┘
T7 ADR-123 update
T8 E2E tests (after T4 + T6)
```

All Phase 1 tasks are independent of each other. Phase 2 depends on T5.
Phase 3 depends on Phase 2.

## Size estimate

~200 lines of new code (following established patterns), ~50 lines of test
additions, ~10 lines of documentation updates. No new dependencies, no new
infrastructure, no new patterns.

## Exit criteria

1. `get-misconception-graph` tool appears in `tools/list`
2. Tool call returns 12,858+ misconception nodes with stats
3. `curriculum://misconception-graph` resource appears in `resources/list`
4. Resource read returns valid JSON matching `MisconceptionGraph` type
5. ADR-123 updated
6. `pnpm check` passes
7. `server.e2e.test.ts` aggregated tool count updated

## Key files

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-resource.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-guidance.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add entry |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Add handler |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Add exports |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Add resource |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts` | Update count |
| `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Add row |
