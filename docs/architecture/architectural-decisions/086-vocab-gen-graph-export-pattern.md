# ADR-086: Vocabulary Mining and Graph Export Pattern

**Status**: Accepted  
**Date**: 2025-12-25  
**Authors**: AI Agent  
**Deciders**: Engineering Team

## Context

Oak National Academy has unique, structured educational content in bulk download files (~630MB across 30 files) containing:

- 13,349 unique keywords with definitions
- 12,777 misconceptions with teacher responses
- 7,881 prior knowledge requirements
- 7,454 National Curriculum statements
- 164 curriculum threads with ordered unit progressions

This data enables user-valuable features like "What's the learning path for fractions?" and "What should I know before trigonometry?" - questions that AI agents need to answer for teachers, students, and curriculum planners.

### Forces

1. **User value first**: Raw extraction counts are not success metrics. Value comes from transformed, user-facing structures.
2. **MCP tool consumption**: AI agents need static graph data in structuredContent to reason about curriculum relationships.
3. **Repeatability**: The pipeline must be fully automated and idempotent (`pnpm vocab-gen`).
4. **TypeScript limitations**: Large literal types with `as const` exceed TypeScript's serialization limits (error TS7056).
5. **Pattern consistency**: New graph exports should follow established patterns (`knowledge-graph-data.ts`).

## Decision

### 1. Multi-Step Pipeline Architecture

The vocabulary mining pipeline is multi-step by design:

```text
EXTRACTION (Exploratory) → PROCESSING (Value Creation) → OUTPUT (User-Facing)
```

- **Extraction**: Mine everything from bulk data speculatively
- **Processing**: Transform raw data into user-valuable structures
- **Output**: Generate static graph files for MCP tool consumption

### 2. Graph Export Pattern

All generated graphs follow the `knowledge-graph-data.ts` pattern with these requirements:

1. **Explicit interface types first** (not `typeof` derivation for large graphs)
2. **Typed export** using `: InterfaceName` annotation
3. **Version and source metadata** for reproducibility
4. **TSDoc documentation** for AI agent understanding
5. **Cross-references** to related MCP tools

#### For small graphs (< 5,000 lines):

```typescript
export const threadProgressionGraph = {
  version: '1.0.0',
  // ... data
} as const;

export type ThreadProgressionGraph = typeof threadProgressionGraph;
```

#### For large graphs (> 5,000 lines):

```typescript
// Explicit interface types FIRST
export interface PrerequisiteNode { ... }
export interface PrerequisiteEdge { ... }
export interface PrerequisiteGraph { ... }

// Typed export (NOT as const - exceeds TS serialization limits)
export const prerequisiteGraph: PrerequisiteGraph = {
  version: '1.0.0',
  // ... data
};
```

### 3. MCP Tool Integration

Each generated graph has a corresponding MCP tool:

| Graph               | MCP Tool                  | User Need                    |
| ------------------- | ------------------------- | ---------------------------- |
| Thread Progressions | `get-thread-progressions` | "What's the learning path?"  |
| Prerequisite Graph  | `get-prerequisite-graph`  | "What should I know before?" |

Tools return full graph data in `structuredContent` for AI agent reasoning.

### 4. Pipeline Location

The `vocab-gen/` pipeline lives in the SDK alongside `type-gen/`:

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/           ← Generates types from OpenAPI
├── vocab-gen/          ← Generates graphs from bulk data
│   ├── extractors/     ← Pure functions, one per data type
│   └── generators/     ← Transform extracted data to graphs
└── src/mcp/
    ├── thread-progression-data.ts    ← Generated
    └── prerequisite-graph-data.ts    ← Generated
```

## Rationale

1. **Explicit interfaces for large graphs** solve TypeScript error TS7056 which occurs when the compiler tries to serialize literal types exceeding its maximum length. This is a documented TypeScript limitation with large `as const` structures.

2. **Multi-step pipeline** separates concerns: extractors are pure functions tested in isolation; generators transform to user-valuable output; writers handle serialization.

3. **SDK location** follows the pattern of `type-gen/` - both generate static artifacts consumed by the runtime.

4. **MCP tool integration** ensures AI agents can answer user questions about curriculum structure and prerequisites.

## Consequences

### Positive

- AI agents can answer "what comes before?" and "what's the learning path?" questions
- Pipeline is fully repeatable via `pnpm vocab-gen`
- Generated graphs have consistent structure following established patterns
- TypeScript compilation succeeds for graphs of any size

### Negative

- Large graph exports lose some type inference benefits (no literal types for property values)
- Two different patterns needed based on graph size (small uses `as const`, large uses explicit interfaces)

### Neutral

- Graphs must be regenerated when bulk download data updates
- MCP tools must be registered manually in `AGGREGATED_TOOL_DEFS`

## Related

- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md) - Original graph pattern
- [02b-vocabulary-mining.md](../../../.agent/plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md) - Full pipeline specification
- [TypeScript Issue #26979](https://github.com/microsoft/TypeScript/issues/26979) - Type inference performance with large literals
