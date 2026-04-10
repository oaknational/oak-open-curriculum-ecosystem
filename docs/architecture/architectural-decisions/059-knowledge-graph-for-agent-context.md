# ADR-059: Curriculum Concept Map for Agent Context

## Status

Accepted

> **Update (March 2026)**: The standalone `get-knowledge-graph` tool was first merged into
> `get-ontology`, and then both `get-ontology` and `get-help` were consolidated into
> `get-curriculum-model`. The concept map data (property graph of concepts and edges)
> now lives in the `domainModel.propertyGraph` section of the `get-curriculum-model`
> response. The architectural principle — complementary data enriching the domain model —
> remains valid.
>
> **Terminology note (April 2026)**: This ADR's structure is a **schema-level
> concept map** — a 28-node, 45-edge JSON property graph derived from the
> API schema and domain knowledge. It is useful for AI agent orientation but
> is not a knowledge graph in the formal sense. The
> [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)
> is the formal W3C-compliant knowledge graph (RDF, OWL, SKOS, SHACL; 26
> classes, 40+ properties, ~150K nodes). The two serve different purposes:
> this concept map provides compact agent context (~5K tokens); the ontology
> provides authoritative curriculum structure for graph integration work.

## Context

AI agents using the Oak MCP server benefit from understanding the curriculum domain model before using other tools. ADR-058 established the context grounding pattern (now via `get-curriculum-model`) providing rich definitions, enumerated values, and workflow guidance.

However, agents also need to understand **how curriculum concepts relate to each other** — the structural relationships that are implicit in the domain but not explicit in the API schema or the prose definitions of the ontology.

### The Gap

The ontology answers: "What do these curriculum concepts mean?"

But agents also need to know:

- How does the Subject → Sequence → Unit → Lesson hierarchy work?
- What relationships exist between Units and Threads?
- How does the Programme concept relate to other entities (it's derived, not an API entity)?
- Which relationships are explicit in the API vs. inferred from domain knowledge?

### Complementary Design

| Artifact                                    | Purpose                | Content                                              |
| ------------------------------------------- | ---------------------- | ---------------------------------------------------- |
| **Ontology** (`get-ontology`)               | What things **mean**   | Rich prose definitions, enumerated values, workflows |
| **Knowledge Graph** (`get-knowledge-graph`) | How things **connect** | Terse edge relationships, navigable structure        |

Combined, they provide complete domain context in approximately 5K tokens.

## Decision

Implement a **schema-level knowledge graph** that captures concept TYPE relationships, exposed via:

1. **Tool**: `get-knowledge-graph` — Model-controlled, for ChatGPT and agents that request context on-demand
2. **Resource**: `curriculum://knowledge-graph` — Application-controlled, for MCP clients that pre-inject context

### Graph Structure

The knowledge graph contains approximately 28 concept nodes organised by category:

- **Structure** (4): Subject, Sequence, Unit, Lesson
- **Content** (5): Quiz, Question, Answer, Asset, Transcript
- **Context** (3): Phase, KeyStage, YearGroup
- **Taxonomy** (2): Thread, Category
- **KS4** (5): Programme, Tier, Pathway, ExamBoard, ExamSubject
- **Metadata** (9+): Keyword, Misconception, ContentGuidance, etc.

The graph contains approximately 45 edges with two types:

- **Explicit edges**: Relationships directly stated in the API schema or glossary
- **Inferred edges**: Relationships implied by domain knowledge but not explicit in the API (marked with `inferred: true`)

### Size Constraints

| Artifact        | Size  | Tokens |
| --------------- | ----- | ------ |
| Ontology        | ~15KB | ~4K    |
| Knowledge Graph | ~6KB  | ~1.5K  |
| **Combined**    | ~21KB | ~5.5K  |

This fits comfortably in agent context windows while providing complete domain understanding.

### Implementation

The graph is authored as static data with `as const` for type safety:

```typescript
export const conceptGraph = {
  version: '1.0.0',
  concepts: [...],
  edges: [...],
  seeOntology: 'This property graph is part of the get-curriculum-model response. See structuralPatterns for API traversal guidance.',
} as const;
```

Types are derived from the data structure, ensuring compile-time validation of edge references.

## Rationale

1. **Complementary by construction**: The ontology and graph serve distinct purposes with minimal overlap. Ontology provides meaning, graph provides structure.

2. **Inferred relationships are valuable**: The graph makes implicit domain knowledge explicit. For example, Programme is a derived concept (not an API entity) — the graph captures its relationships to Sequence, Tier, ExamBoard, etc.

3. **Schema-level, not instance-level**: The graph captures concept TYPE relationships, not specific instances. This keeps it small and stable.

4. **Dual-exposure pattern**: Following ADR-058, both tool and resource exist to serve different MCP client patterns.

5. **Static data is appropriate**: The concept structure is stable. Unlike instance data, it doesn't need to be fetched from the API.

## Consequences

### Positive

- **Better agent reasoning**: Agents can understand and navigate the curriculum domain structure
- **Explicit inferred relationships**: Domain knowledge that was previously implicit is now explicit and machine-readable
- **Compact context**: Combined ontology + graph provides complete domain understanding in ~5K tokens
- **Type-safe authoring**: The `as const` pattern ensures compile-time validation of edge references

### Negative

- **Manual maintenance**: The graph is authored, not generated. Changes to the domain model require manual updates.
- **Potential drift**: If the API schema changes significantly, the graph may become stale.

### Mitigations

- Cross-reference validation tests ensure concept IDs match between ontology and graph
- The graph's `version` field supports future evolution
- TSDoc documentation explains the relationship to the API schema

## Related Decisions

- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md) - Establishes the dual-exposure pattern
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md) - Type generation principles

## References

- [Knowledge Graph Analysis Synthesis](.agent/research/open-curriculum-knowledge-graph/knowledge-graph-analysis-synthesis.md)
- [Optimised Graph Proposal](.agent/research/open-curriculum-knowledge-graph/optimised-graph-proposal.md)
- [Complementary by Construction](.agent/research/open-curriculum-knowledge-graph/complementary-by-construction.md)
