# MCP Graph Tools

**Status**: 📋 Planned  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 9)  
**Priority**: Medium  
**Dependencies**: Vocabulary mining generators complete

---

## Goal

Expose vocabulary mining graph outputs as MCP tools for AI agent consumption.

---

## What's Already Built

| Graph | Data File | Status |
|-------|-----------|--------|
| Thread Progressions | `thread-progression-data.ts` | ✅ Complete |
| Prerequisite Graph | `prerequisite-graph-data.ts` | ✅ Complete |
| Misconception Graph | `misconception-graph-data.ts` | 📋 Pending |
| Vocabulary Graph | `vocabulary-graph-data.ts` | 📋 Pending |
| NC Coverage Graph | `nc-coverage-graph-data.ts` | 📋 Pending |

---

## MCP Tools to Create

### Tool 1: get-thread-progressions ✅

Already implemented in `aggregated-thread-progressions.ts`.

### Tool 2: get-prerequisite-graph ✅

Already implemented in `aggregated-prerequisite-graph.ts`.

### Tool 3: get-misconception-graph

```typescript
{
  name: 'get-misconception-graph',
  description: 'Returns common misconceptions clustered by topic.',
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
    topic: { type: 'string', optional: true },
  },
}
```

### Tool 4: get-vocabulary-graph

```typescript
{
  name: 'get-vocabulary-graph',
  description: 'Returns curated curriculum vocabulary with relationships.',
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
    crossSubject: { type: 'boolean', optional: true },
  },
}
```

### Tool 5: get-nc-coverage-graph

```typescript
{
  name: 'get-nc-coverage-graph',
  description: 'Returns National Curriculum statement coverage mapping.',
  parameters: {
    subject: { type: 'string', optional: true },
    keyStage: { type: 'string', optional: true },
    year: { type: 'number', optional: true },
  },
}
```

---

## Size Considerations

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

## Success Criteria

- [ ] Each tool imports from corresponding `-data.ts` file
- [ ] Optional filtering parameters supported
- [ ] Uses `formatOptimizedResult` for response formatting
- [ ] Comprehensive TSDoc
- [ ] Unit tests verify filtering logic
- [ ] Quality gates pass

---

## Related Documents

- [roadmap.md](../roadmap.md) — Linear execution path
- [vocabulary-mining-bulk.md](vocabulary-mining-bulk.md) — Generates the graph data

