# Sub-Plan 08: MCP Graph Tools

**Status**: 📋 PLANNED — Deferred from 02b  
**Priority**: MEDIUM — Enables AI agent use cases  
**Parent**: [README.md](README.md)  
**Prerequisite**: [02b-vocabulary-mining.md](02b-vocabulary-mining.md) (generators complete)  
**Created**: 2025-12-26  
**Source**: Extracted from 02b to focus that plan on search implementation

---

## Purpose

Expose vocabulary mining graph outputs as MCP tools for AI agent consumption.

This work was deferred from 02b to maintain focus on search implementation. The graphs are already generated; this plan adds the MCP tool layer.

---

## What's Already Built (by 02b)

| Graph | Data File | Status |
|-------|-----------|--------|
| Thread Progressions | `thread-progression-data.ts` | ✅ GENERATED |
| Prerequisite Graph | `prerequisite-graph-data.ts` | ✅ GENERATED |
| Misconception Graph | `misconception-graph-data.ts` | 📋 Pending (02b) |
| Vocabulary Graph | `vocabulary-graph-data.ts` | 📋 Pending (02b) |
| NC Coverage Graph | `nc-coverage-graph-data.ts` | 📋 Pending (02b) |

---

## MCP Tools to Create

### Tool 1: get-thread-progressions

**Status**: ✅ COMPLETE

Already implemented in `aggregated-thread-progressions.ts`.

### Tool 2: get-prerequisite-graph

**Status**: ✅ COMPLETE

Already implemented in `aggregated-prerequisite-graph.ts`.

### Tool 3: get-misconception-graph

**Status**: 📋 PLANNED — Awaiting 02b generator

```typescript
{
  name: 'get-misconception-graph',
  description: `Returns common misconceptions clustered by topic.
  
  Use this to answer questions like:
  - "What mistakes should I watch for when teaching fractions?"
  - "Common misconceptions in Year 7 science"
  - "How do I address the misconception that..."
  
  Returns topics with associated misconceptions and teacher responses.`,
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
    topic: { type: 'string', optional: true },
  },
}
```

### Tool 4: get-vocabulary-graph

**Status**: 📋 PLANNED — Awaiting 02b processor

```typescript
{
  name: 'get-vocabulary-graph',
  description: `Returns curated curriculum vocabulary with relationships.
  
  Use this to answer questions like:
  - "What key terms should students know for this topic?"
  - "Cross-subject vocabulary for STEM"
  - "When is 'denominator' first introduced?"
  
  Returns high-value terms with definitions, cross-subject links, and progression.`,
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
    crossSubject: { type: 'boolean', optional: true },
  },
}
```

### Tool 5: get-nc-coverage-graph

**Status**: 📋 PLANNED — Awaiting 02b generator

```typescript
{
  name: 'get-nc-coverage-graph',
  description: `Returns National Curriculum statement coverage mapping.
  
  Use this to answer questions like:
  - "Which lessons cover this NC statement?"
  - "What percentage of Year 5 maths NC is covered?"
  - "Find gaps in NC coverage"
  
  Returns NC statements with covering units and lessons.`,
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
    year: { type: 'number', optional: true },
  },
}
```

---

## Implementation Pattern

Follow the existing patterns in:
- `aggregated-thread-progressions.ts`
- `aggregated-prerequisite-graph.ts`
- `aggregated-knowledge-graph.ts`

Key elements:
1. Import static data from generated `-data.ts` file
2. Create aggregated tool that returns full graph or filtered subset
3. Use `formatOptimizedResult` for type-safe result formatting
4. Register in tool descriptors

---

## Size Considerations

Some graphs may be too large for AI context windows:

| Graph | Est. Size | Strategy |
|-------|-----------|----------|
| Thread Progressions | ~100KB | ✅ Return full |
| Prerequisite Graph | ~500KB | ⚠️ Consider filtering |
| Misconception Graph | ~2MB | ❌ Must filter/summarise |
| Vocabulary Graph | ~3MB | ❌ Must filter/summarise |
| NC Coverage | ~300KB | ✅ Return full |

**Strategy for large graphs**:
1. Return summary/stats by default
2. Support filtering by subject/keyStage/year
3. Offer subgraph queries (e.g., "fractions prerequisites only")

---

## Acceptance Criteria

For each MCP tool:
- [ ] Imports from corresponding `-data.ts` file
- [ ] Supports optional filtering parameters
- [ ] Uses `formatOptimizedResult` for response formatting
- [ ] Has comprehensive TSDoc
- [ ] Unit tests verify filtering logic
- [ ] Quality gates pass

---

## Dependencies

- **Blocking**: 02b generators must complete first
- **Non-blocking**: Can be done in parallel with other search work

---

## Related Documents

- [02b-vocabulary-mining.md](02b-vocabulary-mining.md) — Generates the graph data files
- [aggregated-thread-progressions.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts) — Pattern reference
- [aggregated-prerequisite-graph.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts) — Pattern reference

