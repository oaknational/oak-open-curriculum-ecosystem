# Oak Curriculum Knowledge Graph Research

This folder contains research, analysis, and design documents for the Oak Curriculum Knowledge Graph — a complement to the existing `get-ontology` agent support tool.

---

## Quick Start: Which Document to Read

| If you want to...                    | Read this                               |
| ------------------------------------ | --------------------------------------- |
| Implement `get-knowledge-graph`      | `knowledge-graph-analysis-synthesis.md` |
| Understand the target structure      | `optimised-graph-proposal.md`           |
| Understand ontology/graph separation | `complementary-by-construction.md`      |
| Understand tool integration patterns | `knowledge-graph-tool-research.md`      |

---

## V1 vs V2+: Two Different Scopes

### V1: Agent Support Tool (Current Implementation)

**Purpose**: Provide agents with a static view of how curriculum concept TYPES relate.

| Aspect          | V1 Specification                                 |
| --------------- | ------------------------------------------------ |
| **Tool name**   | `get-knowledge-graph`                            |
| **Graph level** | Schema-level (concept TYPES, not instances)      |
| **Delivery**    | Static — full graph in one request               |
| **Content**     | ~28 concept nodes, ~45 domain relationship edges |
| **Size**        | ~6KB (~1.5K tokens)                              |
| **Searchable**  | No (delivered whole)                             |
| **Use case**    | Agent context grounding before API calls         |

**Example V1 content**:

- Concept types: `Subject`, `Unit`, `Lesson`, `Thread`, `KeyStage`
- Relationships: `Subject → Sequence → Unit → Lesson`
- Inferred edges: `Unit → Subject` (belongsTo), `Programme → Tier` (uses)

### V2+: Concept-Layer Graph (Future Vision)

**Purpose**: Enable advanced discovery, prerequisite checking, and subject design through a richer conceptual model.

| Aspect          | V2+ Vision                                                           |
| --------------- | -------------------------------------------------------------------- |
| **Graph level** | Instance-level (actual concepts like "greenhouse effect")            |
| **Concepts**    | Explicit (from Oak data) + Implicit (NLP-extracted from transcripts) |
| **Delivery**    | Searchable via dedicated tools                                       |
| **New tools**   | `concept-search`, `concept-neighbours`, `concept-path`               |
| **New edges**   | `CONCEPT_PREREQUISITE_FOR_CONCEPT`, `CONCEPT_REFINES_CONCEPT`        |
| **Use case**    | Subject design, cross-subject discovery, progression analysis        |

**Example V2+ content**:

- Specific concepts: "greenhouse effect", "climate feedback loops", "particle model of matter"
- Prerequisite chains: `particle-model → gas-pressure → atmospheric-pressure → greenhouse-effect`
- Confidence scores for NLP-extracted concepts

---

## Document Organisation

```
open-curriculum-knowledge-graph/
│
├── README.md                              # This file
│
│   ══════════════════════════════════════
│   V1 IMPLEMENTATION DOCUMENTS
│   ══════════════════════════════════════
│
├── knowledge-graph-analysis-synthesis.md  # PRIMARY REFERENCE
│   └── Comprehensive synthesis of all findings
│       Start here when implementing
│
├── optimised-graph-proposal.md            # TARGET STRUCTURE
│   └── Defines ~28 concepts, ~45 edges
│       TypeScript interface and example data
│
├── knowledge-graph-tool-research.md       # TOOL PATTERNS
│   └── Analysis of existing agent support tools
│       Integration points and SDK patterns
│
├── complementary-by-construction.md       # SEPARATION OF CONCERNS
│   └── How ontology and graph complement each other
│       What belongs in each artifact
│
├── document-review-and-corrections.md     # AUDIT
│   └── Review of all documents
│       Corrections and clarifications made
│
│   ══════════════════════════════════════
│   V2+ FUTURE VISION DOCUMENTS
│   ══════════════════════════════════════
│
├── oak-knowledge-graph-support.md         # FUTURE: Concept-layer graph
│   └── Explicit/implicit concepts
│       NLP extraction, confidence scores
│
├── oak-subject-design-tool.md             # FUTURE: Subject design tool
│   └── Orchestrates existing Oak tools
│       Uses concept graph for discovery
│
│   ══════════════════════════════════════
│   ARCHIVED (Wrong Focus)
│   ══════════════════════════════════════
│
└── archive/
    ├── README.md                          # Why these are archived
    ├── kg-graph.ts                        # 89 nodes, API-heavy (wrong)
    ├── kg-graph.md                        # Human-readable version
    └── kg-overview.md                     # Described wrong structure
```

---

## Key Concepts

### What is the Knowledge Graph?

The **Oak Curriculum Knowledge Graph (schema-level)** captures:

- **Structure and form**: How concept TYPES relate to each other
- **Domain relationships**: Subject → Sequence → Unit → Lesson hierarchy
- **Inferred relationships**: Edges not explicit in the API but implied by the domain

It is NOT:

- API endpoint mappings (agents see `tools/list`)
- Instance data (specific lessons like "adding-fractions")
- A queryable database (V1 delivers the whole graph)

### How Does it Complement the Ontology?

| Ontology (`get-ontology`)      | Knowledge Graph (`get-knowledge-graph`) |
| ------------------------------ | --------------------------------------- |
| What things **mean**           | How things **connect**                  |
| Rich prose definitions         | Terse edge relationships                |
| Enumerated values (ks1, maths) | Concept identifiers only                |
| Workflow guidance              | Navigable structure                     |
| UK education context           | Inferred relationships                  |

Together: ~20KB (~5K tokens) for complete domain context.

### Why Archive the Original kg-graph Files?

The original research artifacts (`kg-graph.ts`, `kg-graph.md`) had the **wrong emphasis**:

- 27 Endpoint nodes, 24 Schema nodes (API implementation detail)
- ~80 edges mapping concepts to endpoints (redundant with `tools/list`)

Agents don't need this — they already know about endpoints. The graph should capture **domain knowledge that isn't in the API schema**.

---

## Implementation Reading Order

When implementing `get-knowledge-graph`:

1. **Re-read foundation documents** (per project rules):
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`

2. **Read implementation documents** (in order):
   - `knowledge-graph-analysis-synthesis.md` — Comprehensive synthesis
   - `optimised-graph-proposal.md` — Target structure
   - `complementary-by-construction.md` — Ontology/graph separation
   - `knowledge-graph-tool-research.md` — Tool patterns

3. **Reference the prompt**:
   - `.agent/prompts/implement-knowledge-graph-tool.prompt.md`

4. **Follow TDD at all levels** (per testing-strategy.md):
   - Unit tests for graph data structure
   - Integration tests for tool definition
   - E2E tests for tool in MCP server

---

## File Status Summary

| Document                                | Status        | Purpose                 |
| --------------------------------------- | ------------- | ----------------------- |
| `knowledge-graph-analysis-synthesis.md` | ✅ V1 PRIMARY | Comprehensive reference |
| `optimised-graph-proposal.md`           | ✅ V1         | Target structure        |
| `knowledge-graph-tool-research.md`      | ✅ V1         | Tool patterns           |
| `complementary-by-construction.md`      | ✅ V1         | Separation of concerns  |
| `document-review-and-corrections.md`    | ✅ META       | Audit and corrections   |
| `oak-knowledge-graph-support.md`        | ⚠️ V2+        | Future concept-layer    |
| `oak-subject-design-tool.md`            | ⚠️ V2+        | Future design tool      |
| `archive/*`                             | ❌ DEPRECATED | Wrong API focus         |

---

## Token Budget

| Artifact             | Size     | Tokens    |
| -------------------- | -------- | --------- |
| Ontology (existing)  | ~15KB    | ~4K       |
| Knowledge Graph (V1) | ~6-8KB   | ~1.5-2K   |
| **Combined**         | ~20-23KB | **~5-6K** |

This fits comfortably in agent context windows while providing complete domain understanding.
