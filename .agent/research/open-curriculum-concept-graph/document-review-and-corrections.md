# Document Review and Corrections

**Created**: December 2025  
**Purpose**: Identify corrections, clarifications, and enhancements needed across knowledge graph research documents.

---

## Executive Summary

The research documents have **two distinct scopes** that need clear separation:

| Scope                                           | Documents                                                   | Status                             |
| ----------------------------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| **Current Implementation** (agent support tool) | synthesis, tool-research, complementary, optimised-proposal | ✅ Mostly correct                  |
| **Future Vision** (subject design support)      | oak-knowledge-graph-support, oak-subject-design-tool        | ⚠️ Future scope, clearly labelled  |
| **Deprecated Research Artifacts**               | kg-graph.ts, kg-graph.md, kg-overview.md                    | ❌ Wrong focus, should be archived |

---

## 1. Documents to Archive/Deprecate

### 1.1 `kg-graph.ts` — **ARCHIVE**

**Issue**: Heavily API-focused research artifact with wrong emphasis.

**Content**: 89 nodes including 27 Endpoint nodes, 24 Schema nodes, 118 edges mostly mapping concepts to API.

**Action**:

- Add deprecation header
- Move to `.agent/research/open-curriculum-knowledge-graph/archive/`
- Do NOT use as basis for implementation

**Reason**: Agents already see endpoints from `tools/list`. This graph duplicates that information and wastes tokens.

### 1.2 `kg-graph.md` — **ARCHIVE**

**Issue**: Human-readable version of the wrong-focus graph.

**Action**: Archive alongside `kg-graph.ts`

### 1.3 `kg-overview.md` — **ARCHIVE or HEAVY REVISION**

**Issue**: Contains both correct terminology (schema-level graph) AND references to the wrong-focus graph structure. The inline warning note is good but the rest of the document describes the wrong graph.

**Specific problems**:

- Section 3 "Node model and edge model" describes Endpoint/Schema/SourceDoc nodes (wrong)
- Section 4 "How the graph was constructed" describes harvesting endpoints (wrong)
- Mermaid diagrams show "API endpoints mapped to concepts" (wrong)
- Section 6 "How to use the knowledge graph" suggests "Use Endpoint and Schema nodes" (wrong)

**Action**: Either archive entirely (the synthesis document supersedes it) or heavily revise to remove all API-mapping content.

---

## 2. Documents that are Correct (Minor Updates)

### 2.1 `knowledge-graph-tool-research.md` — ✅ CORRECT

**Status**: Well-structured analysis with correct emphasis on concept relationships.

**Minor updates needed**:

- Add explicit note that this is the **authoritative design document** for V1 implementation
- Cross-reference the synthesis document

### 2.2 `complementary-by-construction.md` — ✅ CORRECT

**Status**: Correctly separates ontology (meaning/guidance) from graph (structure/edges).

**Minor updates needed**:

- Add note that some sections reference future vision (e.g., smart guidance)
- Phase 2/3 sections describe future enhancements, should be clearly labelled

### 2.3 `optimised-graph-proposal.md` — ✅ CORRECT

**Status**: Correctly proposes concept-only structure with ~28 nodes and ~40 edges.

**Minor updates needed**:

- Mark as the **target structure for V1**
- Remove any remaining references to ultra-minimal alternative (decision made: use full structure)

### 2.4 `knowledge-graph-analysis-synthesis.md` — ✅ CORRECT (NEW)

**Status**: Comprehensive synthesis created in this session.

**Updates needed**: None (just created)

---

## 3. Documents Describing Future Vision (Clearly Label)

### 3.1 `oak-knowledge-graph-support.md` — ⚠️ FUTURE SCOPE

**Issue**: Describes a DIFFERENT knowledge graph from what we're building now:

- **Explicit vs implicit concepts** (NLP-extracted)
- **Instance-level** graph (actual concepts like "greenhouse effect")
- **Searchable** with tools like `concept-search`, `concept-neighbours`, `concept-path`
- **Prerequisite relationships** between specific concepts

**Current implementation is**:

- **Schema-level** graph (concept TYPES, not instances)
- **Static** (full graph in one request)
- **Not searchable** (delivered whole to agent for reasoning)

**Action**: Add prominent header clarifying this is **FUTURE V2+ scope**, not current implementation.

Suggested header:

```markdown
> **⚠️ FUTURE SCOPE (V2+)**: This document describes an advanced concept-layer
> knowledge graph that extends beyond the current V1 implementation. V1 provides
> a static, schema-level graph of concept TYPE relationships for agent support.
> The explicit/implicit concepts, NLP extraction, and searchable tools described
> here are future extensions.
```

### 3.2 `oak-subject-design-tool.md` — ⚠️ FUTURE SCOPE

**Issue**: Describes a future tool that would consume a concept-layer knowledge graph.

**Current implementation**: The `get-knowledge-graph` tool is for agent context grounding, NOT for subject design orchestration.

**Action**: Add prominent header clarifying this is **FUTURE SCOPE**.

Suggested header:

```markdown
> **⚠️ FUTURE SCOPE**: This document describes a future Subject Design Tool
> that would orchestrate existing Oak Open Curriculum tools and leverage a concept-layer
> knowledge graph (see oak-knowledge-graph-support.md). This is separate from
> the current `get-knowledge-graph` agent support tool being implemented.
```

---

## 4. Specific Content Corrections

### 4.1 Remove/Correct API-Focus Language

**In any document that remains**, remove or correct:

❌ "Which endpoint returns this concept?"  
❌ "Endpoint → Schema → Concept edges"  
❌ "API mappings" as graph content  
❌ "Schema nodes" or "Endpoint nodes"  
❌ "SourceDoc" nodes (research provenance)

Replace with:

✅ "How do concepts relate to each other?"  
✅ "Concept → Concept edges"  
✅ "Domain relationships"  
✅ "Inferred relationships"

### 4.2 Clarify Static vs Searchable

**Current implementation**: Static data structure delivered whole to agent.

Several documents mention future queryable features. Ensure these are clearly marked:

| Feature                    | V1 (Current) | V2+ (Future) |
| -------------------------- | ------------ | ------------ |
| Full graph in one request  | ✅           | ✅           |
| Focus parameter (subgraph) | ❌           | Maybe        |
| `concept-search` tool      | ❌           | Future       |
| `concept-neighbours` tool  | ❌           | Future       |
| `concept-path` tool        | ❌           | Future       |
| Explicit/implicit concepts | ❌           | Future       |
| NLP concept extraction     | ❌           | Future       |

### 4.3 Correct Token Estimates

Ensure consistency:

| Artifact           | Size     | Tokens    |
| ------------------ | -------- | --------- |
| Ontology (current) | ~15KB    | ~4K       |
| Graph (V1 target)  | ~6-8KB   | ~1.5-2K   |
| **Combined**       | ~20-23KB | **~5-6K** |

---

## 5. Proposed Document Structure

### Keep and Enhance

| Document                                | Role                                 |
| --------------------------------------- | ------------------------------------ |
| `knowledge-graph-analysis-synthesis.md` | **PRIMARY**: Comprehensive reference |
| `knowledge-graph-tool-research.md`      | Design analysis and patterns         |
| `complementary-by-construction.md`      | Ontology/graph separation            |
| `optimised-graph-proposal.md`           | Target structure specification       |

### Mark as Future Vision

| Document                         | Role                       |
| -------------------------------- | -------------------------- |
| `oak-knowledge-graph-support.md` | Future V2+ concept-layer   |
| `oak-subject-design-tool.md`     | Future subject design tool |

### Archive (Move to `archive/` folder)

| Document         | Reason                 |
| ---------------- | ---------------------- |
| `kg-graph.ts`    | Wrong API focus        |
| `kg-graph.md`    | Wrong API focus        |
| `kg-overview.md` | References wrong graph |

---

## 6. Implementation Reference Order

When implementing `get-knowledge-graph`, read documents in this order:

1. **`knowledge-graph-analysis-synthesis.md`** — Comprehensive synthesis with proposed structure
2. **`optimised-graph-proposal.md`** — Target structure and size
3. **`complementary-by-construction.md`** — Separation from ontology
4. **`knowledge-graph-tool-research.md`** — Tool patterns and integration points

**Do NOT reference**:

- `kg-graph.ts` (wrong focus, archived)
- `kg-graph.md` (wrong focus, archived)
- `kg-overview.md` (wrong focus, archived)

---

## 7. Summary of Actions

### Immediate (Before Implementation)

1. [ ] Create `archive/` subfolder
2. [ ] Move `kg-graph.ts`, `kg-graph.md`, `kg-overview.md` to archive
3. [ ] Add future-scope headers to `oak-knowledge-graph-support.md` and `oak-subject-design-tool.md`
4. [ ] Review and update token estimates across documents for consistency

### Optional (Post-Implementation)

1. [ ] Update `kg-overview.md` to describe correct graph structure (if keeping)
2. [ ] Add implementation reference links to synthesis document
3. [ ] Create diagram of V1 vs V2+ scope

---

## 8. Key Clarifications for Implementation

### What V1 `get-knowledge-graph` IS:

- **Static** data structure
- **Schema-level** (concept TYPES, not instances)
- **~25 concept nodes** with brief labels
- **~45 edges** showing domain relationships
- **Delivered whole** in `structuredContent` for model reasoning
- **Complements** `get-ontology` (meaning/guidance vs structure/edges)
- **~6KB** payload (~1.5K tokens)

### What V1 `get-knowledge-graph` IS NOT:

- Not searchable (no query parameters in V1)
- Not instance-level (no specific "greenhouse effect" concept)
- Not populated from NLP/LLM extraction
- Not interactive (no neighbour traversal)
- Not for subject design (that's a future tool)

### The Graph Contains:

**Concept nodes** (categories: structure, content, context, taxonomy, ks4, metadata)

**Edges** with:

- `from`, `to`, `rel` (relationship label)
- `inferred?: true` for relationships not explicit in API

**NO**:

- Endpoint nodes
- Schema nodes
- SourceDoc nodes
- API mapping edges

---

## Appendix: Document File Sizes for Reference

| Document                              | Size | Lines |
| ------------------------------------- | ---- | ----- |
| knowledge-graph-analysis-synthesis.md | 27KB | 724   |
| knowledge-graph-tool-research.md      | 22KB | 525   |
| kg-graph.md                           | 39KB | 688   |
| kg-graph.ts                           | 39KB | 1348  |
| kg-overview.md                        | 18KB | 362   |
| optimised-graph-proposal.md           | 17KB | 516   |
| complementary-by-construction.md      | 14KB | 460   |
| oak-knowledge-graph-support.md        | 14KB | 437   |
| oak-subject-design-tool.md            | 14KB | 399   |

The `kg-graph.ts` and `kg-graph.md` files are the largest because they contain the wrong-focus API-heavy structure. The correct V1 implementation will be much smaller (~6KB).
