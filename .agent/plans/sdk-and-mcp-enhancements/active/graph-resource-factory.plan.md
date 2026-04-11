---
name: "Graph Resource Factory"
overview: "Extract shared infrastructure from the 3 existing graph-as-MCP-resource+tool surfaces into a factory, then refactor existing graphs to use it."
parent_plan: "open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "misconception-graph-mcp-surface.plan.md"
  - "eef-evidence-mcp-surface.plan.md"
  - "nc-knowledge-taxonomy-surface.plan.md"
  - "agent-guidance-consolidation.plan.md"
specialist_reviewer: "code-reviewer, type-reviewer, test-reviewer"
isProject: false
todos:
  - id: t1-analyse-pattern
    content: "Analyse the 3 existing graph surfaces and document the exact invariant vs variable parts"
    status: done
  - id: t2-design-factory
    content: "Design the factory API: createGraphResource, createGraphToolDef, createGraphToolExecutor (no createGraphResourceRegistrar — registration in app layer)"
    status: done
  - id: t3-implement-factory
    content: "Implement graph-resource-factory.ts with typed factory functions"
    status: done
  - id: t4-unit-tests
    content: "Write unit tests for factory functions (config in → correct shapes out)"
    status: done
  - id: t5-refactor-prerequisite
    content: "Refactor prior-knowledge-graph-resource.ts and aggregated-prior-knowledge-graph.ts to use factory"
    status: done
  - id: t6-refactor-threads
    content: "Refactor thread-progressions-resource.ts and aggregated-thread-progressions.ts to use factory"
    status: done
  - id: t7-refactor-curriculum-model
    content: "Assess curriculum-model: justified exception — composes two sources, priority 1.0. TSDoc documented."
    status: done
  - id: t8-verify-no-behavioural-change
    content: "Run full test suite to verify refactoring is behaviour-preserving"
    status: done
  - id: t9-public-export
    content: "Factory is SDK-internal (not exported). Only resource constants and getters exported."
    status: done
  - id: t10-handoff
    content: "Hand off to parent plan: factory ready for misconception, EEF, and NC taxonomy surfaces"
    status: pending
---

# Graph Resource Factory

**Status**: DONE
**Last Updated**: 2026-04-10
**Branch**: `planning/kg_eef_integration`
**Parent**: `open-education-knowledge-surfaces.plan.md` (WS-1)

## Problem

The repository has 3 existing graph-as-MCP-resource+tool surfaces:

1. **Prerequisite graph** — resource + tool, ~160 lines
2. **Thread progressions** — resource + tool, ~160 lines
3. **Curriculum model** — resource + tool, ~180 lines (slightly
   different: composes two data sources)

And 3 planned:

4. Misconception graph
5. EEF evidence strands
6. NC knowledge taxonomy

All follow an identical 6-layer boilerplate pattern:

1. Resource constant (`name`, `uri`, `title`, `description`,
   `mimeType`, `annotations`)
2. JSON getter (`JSON.stringify(sourceData, null, 2)`)
3. Tool definition (`title`, `description`, `securitySchemes`,
   `annotations`, empty input schema)
4. Tool executor (`formatToolResponse({...})`)
5. Registration in `definitions.ts` + `executor.ts`
6. Resource registration function (destructure constant, wrap handler)

The only things that vary per graph:

- Name, URI, title, description
- Source data object
- Priority (0.5 supplementary or 1.0 essential)
- Stats embedded in the description

## Decision

Extract a typed factory module that produces all 6 layers from a
single configuration object. Refactor the 2 pure graph surfaces
(prior knowledge graph, thread progressions) to use the factory.
Assess whether curriculum model (which composes two sources) can
also use the factory or should remain bespoke.

## Scope

This plan covers infrastructure extraction and refactoring only.
It does NOT add new graph surfaces — those are tracked by sibling
plans. The factory must be ready before the siblings execute.

## Implementation

### Phase 1: Design (T1-T2)

**T1: Pattern analysis** — Confirm the invariant vs variable parts
by reading the 3 existing implementations side by side. Document:

- Exact lines that are identical across all 3
- Exact lines that vary (and what they vary by)
- Whether curriculum-model fits the pattern or is genuinely different

**T2: Factory API design** — Design the configuration type and
factory functions:

```typescript
interface GraphSurfaceConfig {
  /** Kebab-case identifier, e.g. 'prior-knowledge-graph' */
  readonly name: string;
  /** Human-readable display name */
  readonly title: string;
  /** Multi-line description for AI agents (may include stats) */
  readonly description: string;
  /** URI scheme segment, e.g. 'prior-knowledge-graph' */
  readonly uriSegment: string;
  /** URI scheme prefix, default 'curriculum' */
  readonly uriScheme?: string;
  /** Resource priority: 0.5 (supplementary) or 1.0 (essential) */
  readonly priority?: 0.5 | 1.0;
  /** The data to serialise and return */
  readonly sourceData: unknown;
  /** Summary line for tool response */
  readonly summary: string;
}
```

### Phase 2: Implement (T3-T4)

**T3: Factory module** — `graph-resource-factory.ts`

Factory functions:

- `createGraphResource(config)` → resource constant
- `createGraphJsonGetter(config)` → `() => string`
- `createGraphToolDef(config)` → tool definition with annotations
- `createGraphInputSchema()` → `Record<string, never>` (always empty)
- `createGraphToolExecutor(config)` → `() => CallToolResult`
- `createGraphResourceRegistrar(config)` → registration function

Each function is independently usable — the factory is compositional,
not monolithic. A consumer that needs a custom executor (like EEF's
recommendation tool) can use the resource and registration factories
without the tool executor factory.

**T4: Unit tests** — Test that factory produces correct shapes:

- Resource constant has correct `uri`, `mimeType`, `annotations`
- Tool def has correct `title`, `annotations`, `securitySchemes`
- Executor returns valid `CallToolResult` via `formatToolResponse`
- Registration function calls `server.registerResource` correctly

### Phase 3: Refactor (T5-T8)

**T5: Prerequisite graph** — Refactor to use factory. Before/after
diff should show ~140 lines removed, ~20 lines of config added.
All existing tests must continue to pass.

**T6: Thread progressions** — Same refactoring pattern.

**T7: Curriculum model assessment** — The curriculum model composes
`ontologyData` + `toolGuidanceData`. If it doesn't fit the factory
cleanly, leave it bespoke and document why. Don't force the pattern.

**T8: Full verification** — Run `pnpm check`. The refactoring must
be behaviour-preserving. No test changes should be needed (the
outputs are identical).

### Phase 4: Export and handoff (T9-T10)

**T9: Public export** — Export the factory from `public/mcp-tools.ts`
so sibling plans can import it.

**T10: Handoff** — Update parent plan status. The factory is ready
for the misconception, EEF, and NC taxonomy plans to consume.

## Sequencing

```text
T1 pattern analysis  ──▶  T2 API design
                                │
                     T3 implement factory
                     T4 unit tests
                                │
                     T5 refactor prior knowledge graph
                     T6 refactor thread progressions
                     T7 assess curriculum model
                                │
                     T8 verify (pnpm check)
                     T9 public export
                     T10 handoff
```

T1-T2 are research/design. T3-T4 are new code. T5-T7 are refactoring
(parallel). T8-T10 are verification and handoff.

## Size Estimate

~150 lines of new code (factory module + tests). ~280 lines removed
from existing files (replaced by ~40 lines of config). Net reduction
of ~90 lines. No new dependencies.

## Exit Criteria

1. `graph-resource-factory.ts` exists with typed factory functions
2. Prerequisite graph and thread progressions use the factory
3. Curriculum model decision documented (uses factory or justified
   exception)
4. Factory exported from `public/mcp-tools.ts`
5. All existing tests pass without modification
6. `pnpm check` passes

## Key Files

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/prior-knowledge-graph-resource.ts` | Refactor |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts` | Refactor |
| `packages/sdks/oak-curriculum-sdk/src/mcp/thread-progressions-resource.ts` | Refactor |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts` | Refactor |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Add export |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Simplify registrations |
