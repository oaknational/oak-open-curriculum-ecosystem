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

### User Personas

All vocabulary mining work exists to serve these audiences:

| Persona                 | Context                | Primary Needs                                                    |
| ----------------------- | ---------------------- | ---------------------------------------------------------------- |
| **Student**             | Learning new concepts  | Clear definitions, learning paths, "what comes next"             |
| **Teacher**             | Lesson planning        | Vocabulary to introduce, misconceptions to address               |
| **School Leader**       | Curriculum planning    | NC coverage, progression mapping                                 |
| **Curriculum Planner**  | Strategic design       | Cross-subject vocabulary, prerequisite chains                    |
| **Parent (Homeschool)** | Supporting learning    | Clear structure, prerequisites                                   |
| **Adult Learner**       | Self-directed learning | Context-appropriate explanations, flexible paths                 |
| **AI Agent**            | Search & tutoring      | Query expansion, prerequisite reasoning, misconception detection |

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

### 3. Generator Specifications

Each generator serves specific user personas with measurable impact:

#### Thread Progression Generator ✅ COMPLETE

| Aspect        | Details                                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Audiences** | Student, Teacher, Curriculum Planner, AI Agent                                                                                                                           |
| **User Need** | "What's the learning path for X?"                                                                                                                                        |
| **Impact**    | Enables clear progression through curriculum threads across years. Students see what comes next; teachers plan multi-year curricula; AI agents recommend learning paths. |
| **Output**    | `thread-progression-data.ts` (164 threads, 14 subjects)                                                                                                                  |
| **MCP Tool**  | `get-thread-progressions`                                                                                                                                                |

#### Prerequisite Graph Generator ✅ COMPLETE

| Aspect        | Details                                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | Student, Teacher, Parent, AI Agent                                                                                                                                                 |
| **User Need** | "What should I know before this?"                                                                                                                                                  |
| **Impact**    | Enables learning path planning. Students identify gaps; teachers diagnose readiness; parents plan homeschool curricula; AI agents check prerequisites before recommending content. |
| **Output**    | `prerequisite-graph-data.ts` (1601 units, 3408 edges)                                                                                                                              |
| **MCP Tool**  | `get-prerequisite-graph`                                                                                                                                                           |

#### Misconception Graph Generator 📋 PLANNED

| Aspect        | Details                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | Teacher, AI Agent                                                                                                                   |
| **User Need** | "What mistakes should I watch for?"                                                                                                 |
| **Impact**    | Enables proactive error prevention. Teachers prepare for common mistakes; AI tutors detect and address misconceptions in real-time. |
| **Output**    | `misconception-graph-data.ts` (estimated ~12K misconceptions)                                                                       |
| **MCP Tool**  | `get-misconception-graph` (deferred until search optimisation complete)                                                             |

#### Vocabulary Processor 📋 PLANNED

| Aspect        | Details                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Audiences** | Student, Teacher, AI Agent                                                                                                                                                     |
| **User Need** | "What does X mean?" "When is Y introduced?"                                                                                                                                    |
| **Impact**    | Curated glossary enables clear definitions. Students get age-appropriate explanations; teachers know when terms are introduced; AI agents provide accurate vocabulary context. |
| **Output**    | `vocabulary-graph-data.ts` (curated from 13K raw keywords)                                                                                                                     |
| **MCP Tool**  | `get-vocabulary-graph` (deferred until search optimisation complete)                                                                                                           |

#### Synonym Miner 📋 PLANNED

| Aspect        | Details                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | AI Agent, Search System                                                                                                                                        |
| **User Need** | "Find lessons about [synonym]"                                                                                                                                 |
| **Impact**    | Enables query expansion for search. User queries match curriculum content even with different wording. Improves search recall without manual synonym curation. |
| **Output**    | Enhanced `synonymsData` (target: 10x current 163 entries)                                                                                                      |
| **MCP Tool**  | None (feeds into search directly)                                                                                                                              |

#### NC Coverage Generator 📋 PLANNED

| Aspect        | Details                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | School Leader, Curriculum Planner                                                                                                                                |
| **User Need** | "Does this cover the NC?" "What NC gaps exist?"                                                                                                                  |
| **Impact**    | Enables curriculum gap analysis. School leaders verify coverage; curriculum planners identify missing areas; MAT coordinators ensure consistency across schools. |
| **Output**    | `nc-coverage-graph-data.ts` (mapping ~7K NC statements to units)                                                                                                 |
| **MCP Tool**  | `get-nc-coverage-graph` (deferred until search optimisation complete)                                                                                            |

### 4. MCP Tool Integration

Tools return full graph data in `structuredContent` for AI agent reasoning.

**CRITICAL**: No new MCP tools until search optimisation is complete. The focus is on extracting and processing data for search improvement first.

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
