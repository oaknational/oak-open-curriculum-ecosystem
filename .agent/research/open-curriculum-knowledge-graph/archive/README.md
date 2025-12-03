# Archived Research Artifacts

**Archived**: December 2025

## Why These Files Are Archived

The files in this folder represent **early research artifacts** that had the **wrong emphasis**. They focused heavily on API mechanisms (endpoints, schemas) rather than domain knowledge and understanding.

### Key Problem

The original graph contained:

- 27 Endpoint nodes
- 24 Schema nodes
- ~80 API mapping edges (Concept → Endpoint, Endpoint → Schema, etc.)

**This was wrong because**: Agents already see endpoint information from `tools/list`. Duplicating it in the knowledge graph wasted tokens and provided no additional reasoning capability.

### The Correct Focus

The knowledge graph should capture **domain knowledge that ISN'T in the OpenAPI schema**:

- Concept-to-concept relationships
- Inferred relationships (Programme as derived view, Unit context, etc.)
- Structural navigation for agent reasoning

### Current Implementation Documents

For the correct approach, see:

- `../knowledge-graph-analysis-synthesis.md` — Comprehensive synthesis
- `../optimised-graph-proposal.md` — Target structure (~28 concepts, ~45 edges)
- `../knowledge-graph-tool-research.md` — Tool patterns and integration
- `../complementary-by-construction.md` — Ontology/graph separation

## Archived Files

| File             | Description                               | Reason for Archive              |
| ---------------- | ----------------------------------------- | ------------------------------- |
| `kg-graph.ts`    | TypeScript graph with 89 nodes, 118 edges | Wrong API focus                 |
| `kg-graph.md`    | Human-readable version of above           | Wrong API focus                 |
| `kg-overview.md` | Overview document                         | Describes wrong graph structure |

## Do NOT Use These Files

These files should **not** be used as the basis for implementation. The concept IDs and descriptions are still valuable reference, but the structure (Endpoint/Schema nodes, API mapping edges) is wrong.

Extract concept information if needed, but author the new graph fresh following the synthesis document.
