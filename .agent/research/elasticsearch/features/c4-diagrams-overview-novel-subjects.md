# C4 diagrams for Oak’s Elastic + Neo4j “Derived Subjects” architecture (ASCII)

Below are four C4 levels — **Context, Container, Component, Code** — expressed as copy-pasteable ASCII diagrams, plus guidance on **which levels to maintain**, and a second set focused specifically on **“Climate Change” as a derived subject**.

Conventions:

- Diagrams are in triple backticks for clean copying.
- Notes and guidance are plain text around them.
- Arrows show primary request/data flows, not every possible integration.

---

## How to read this pack (audience lenses)

- Executive/leadership: skim C1 and C2 here, then the capability matrix below.
- Engineering: C2 and C3 here, then the data model and cookbook files.
- Operations: cookbook + constraints matrix, then the path scoring rubric.

## Multi-view policy (single source, multiple views)

Use this pack as a set of complementary views:

- C4 diagrams here are the canonical architecture view.
- Query and constraint patterns live in `c4-diagrams-cookbook-and-maintenance-subjects.md`.
- Graph schema and derived-subject modelling live in `c4-diagrams-data-model-novel-subjects.md`.
- Path quality and scoring live in `c4-diagrams-path-scoring-novel-subjects.md`.
- The longform background is in `elastic-and-neo4j-novel-subjects.md` (context only).

## Phasing guidance (ES-only now, Neo4j later)

- Near-term: ES-native, graph-adjacent features (Graph Explore API, significant terms, transforms) for immediate search improvements. See `../methods/graph-elastic.md`.
- Later: Neo4j for true multi-hop traversal; export graph-derived views back into Elasticsearch (paths, concept clusters, derived subjects) to improve retrieval and enable novel subjects.
- Treat the diagrams in this pack as a future-state target; use the methods notes for immediate ES-only changes.

## Level 1: System Context (C1)

Purpose:

- Explain the system to mixed audiences (teachers, curriculum designers, leadership, partners, engineers).
- Answer: _“What is the system and who/what does it interact with?”_

```text
+----------------------------------------------------------------------------------+
|                               Oak Knowledge Platform                              |
|            (Search + Knowledge Graph for curriculum discovery & pathways)         |
+----------------------------------------------------------------------------------+
          ^                 ^                  ^                  ^
          |                 |                  |                  |
          |                 |                  |                  |
+---------+------+   +------+----------+  +-----+---------+  +-----+--------------+
| Teachers       |   | Curriculum      |  | Students /    |  | Engineers /        |
| & Tutors       |   | Designers       |  | Adult Learners|  | EdTech Builders    |
+----------------+   +-----------------+  +---------------+  +--------------------+
          \                 |                  |                  /
           \                |                  |                 /
            \               |                  |                /
             v              v                  v               v
+----------------------------------------------------------------------------------+
|                                Interfaces & Consumers                             |
|  - Web UIs (planning, discovery, concept maps, pathways)                           |
|  - SDKs (TypeScript) for internal/external integration                             |
|  - MCP Servers (LLM tools) for chat assistants / agents                            |
+----------------------------------------------------------------------------------+
                                       |
                                       v
+----------------------------------------------------------------------------------+
|                                 External Dependencies                             |
|  - Oak Bulk Download API / Data exports (lesson/unit/metadata/text)                |
|  - Managed Search: Elastic Cloud                                                  |
|  - Managed Graph: Neo4j AuraDB                                                    |
|  - Embedding model provider (internal pipeline or hosted inference)                |
|  - Identity/Access (SSO, tokens, org auth)                                         |
+----------------------------------------------------------------------------------+
```

What this diagram communicates:

- One “system box”.
- Multiple user groups.
- Key external dependencies (Bulk API, Elastic, Neo4j, embeddings, auth).

---

## Level 2: Container Diagram (C2)

Purpose:

- Explain the deployable/runnable pieces and how they connect.
- Answer: _“What applications and data stores run this, and how do they talk?”_

```text
+----------------------------------------------------------------------------------+
|                           Managed Cloud Environment                                |
+----------------------------------------------------------------------------------+

   [Web UI]            [CLI Tools]             [SDK Users]          [MCP Clients]
     |                     |                       |                    |
     +---------------------+-----------------------+--------------------+
                                       |
                                       v
+----------------------------------------------------------------------------------+
|                          API Gateway / BFF (TypeScript)                            |
|  - AuthN/AuthZ                                                                    |
|  - Query orchestration                                                             |
|  - Result merging & ranking                                                        |
|  - Path generation + explainability payloads                                       |
+------------------------------+--------------------------------+-------------------+
                               |                                |
                               |                                |
                               v                                v
+-------------------------------+        +------------------------------------------+
|      Elastic Cloud             |        |            Neo4j AuraDB                 |
|  (Hybrid Search & Retrieval)   |        |  (Knowledge Graph & Traversal)          |
|                                |        |                                          |
|  - BM25 / lexical              |        |  - curriculum structure                  |
|  - embeddings / vectors        |        |  - concept graph                          |
|  - filters/facets              |        |  - multi-hop path queries                 |
|  - fast top-K retrieval        |        |  - provenance + explainability            |
+-------------------------------+        +------------------------------------------+

                                       ^
                                       |
+----------------------------------------------------------------------------------+
|                                Data & Enrichment Pipeline                         |
|  - Bulk download ingest                                                           |
|  - Normalise IDs                                                                  |
|  - Extract concepts (keywords/definitions/misconceptions)                          |
|  - Compute embeddings                                                              |
|  - Index into Elastic (already exists)                                             |
|  - NEW: Load into Neo4j (nodes + edges + scores + provenance)                      |
+----------------------------------------------------------------------------------+
```

Key message:

- Elastic answers “what matches?” quickly.
- Neo4j answers “how is it connected / what path makes sense?”.
- The TS API orchestrates and merges.

---

## Level 3: Component Diagram (C3) – zoom into the TypeScript API/BFF

Purpose:

- Help engineers reason about responsibilities, test boundaries, and ownership.
- Answer: _“Inside the API, what are the major modules and how do they collaborate?”_

```text
+----------------------------------------------------------------------------------+
|                    TypeScript API / Backend-for-Frontend (BFF)                     |
+----------------------------------------------------------------------------------+

  +-------------------+       +----------------------+       +--------------------+
  | AuthService       |       | QueryUnderstanding   |       | Telemetry /        |
  | - users/roles     |       | - query intent       |       | Observability      |
  | - org access      |       | - constraints        |       | - logs/metrics     |
  +-------------------+       +----------------------+       +--------------------+
             |                           |                             |
             +---------------------------+-----------------------------+
                                         |
                                         v
                           +-------------------------------+
                           | Orchestrator / Use-Case Layer |
                           | - SearchThenTraverse          |
                           | - DerivedSubjectBuilder       |
                           | - Pathways                    |
                           +-------+---------------+-------+
                                   |               |
                       +-----------+               +-----------+
                       |                                   |
                       v                                   v
        +-------------------------------+     +----------------------------------+
        | ElasticSearchService          |     | GraphTraversalService            |
        | - hybrid retrieval            |     | - multi-hop traversal            |
        | - filters/facets              |     | - prerequisites / communities    |
        | - candidate generation        |     | - explainability/provenance      |
        +---------------+---------------+     +-------------------+--------------+
                        |                                         |
                        v                                         v
        +-------------------------------+     +----------------------------------+
        | ResultMerger & Ranker         |     | PathBuilder                      |
        | - blend scores                |     | - choose nodes/edges             |
        | - dedupe & diversify          |     | - apply constraints (KS/tier)    |
        | - “why this result” payload  |     | - assemble stepwise journey      |
        +---------------+---------------+     +-------------------+--------------+
                        |                                         |
                        +---------------------+-------------------+
                                              |
                                              v
                                +-------------------------------+
                                | ResponseAssembler             |
                                | - UI payloads                 |
                                | - SDK payloads                |
                                | - MCP tool outputs            |
                                +-------------------------------+
```

Notes:

- This keeps search and graph concerns separate.
- Orchestrator layer owns “product logic” (derived subjects, learning journeys).
- ResultMerger is where you control blending and explainability.

---

## Level 4: Code Diagram (C4) – “Only if valuable”

Purpose:

- Illustrate critical interfaces/classes for a feature.
- Often replaced by code + docs.
- Answer: _“How do core types fit together?”_

This is a minimal “worth it” code-level view: the orchestration seam.

```text
+--------------------------------------------------------------+
| SearchThenTraverseUseCase                                    |
|--------------------------------------------------------------|
| - execute(query, constraints)                                |
|   1) candidates = ElasticSearchService.search(...)           |
|   2) graphCtx  = GraphTraversalService.expand(candidates...) |
|   3) merged    = ResultMerger.merge(candidates, graphCtx)    |
|   4) paths     = PathBuilder.build(merged, graphCtx, ...)    |
|   5) return ResponseAssembler.assemble(...)                  |
+--------------------------------------------------------------+

Interfaces:
- ElasticSearchService: hybrid retrieval / filters / candidates
- GraphTraversalService: traversal / paths / relatedness
- ResultMerger: scoring, dedupe, diversification, explanations
- PathBuilder: construct learning journeys & derived subjects
```

You usually don’t need a more detailed class diagram than this — code + tests win.

---

# Which C4 levels should you maintain?

Recommended maintenance strategy:

1. **Always maintain C1 (Context)**
   - It’s stable, easy to keep accurate, and useful for every audience.

2. **Maintain C2 (Container) as the primary engineering reference**
   - This is where Elastic vs Neo4j roles are clarified.
   - Update when you add/remove deployables (e.g., queue, cache, inference service).

3. **Maintain C3 (Component) only for containers with complex domain logic**
   - Here, your TS API is domain-heavy (derived subjects, pathways), so C3 is worth it.
   - Keep it high-level (10–15 boxes max). Avoid “every file”.

4. **Treat C1/C2/C3 as a triad**
   - Keep them in sync; avoid updating one without the others.

5. **C4 (Code) only for the 1–3 most confusing/critical areas**
   - E.g., the orchestration seam, scoring, path selection rules.
   - Otherwise, rely on code and unit tests.

Practical rule of thumb:

- If an architecture diagram can’t survive a refactor without being totally rewritten, it’s too detailed.

---

## Capability matrix (Elastic-only vs Elastic + Neo4j)

```text
------------------------------+-------------------+---------------------------+
| Capability                   | Elastic only      | Elastic + Neo4j            |
+------------------------------+-------------------+---------------------------+
| Hybrid retrieval (BM25+ELSER)| Yes               | Yes                        |
| Facets and filters           | Yes               | Yes                        |
| Prerequisite traversal       | Limited (rules)   | Yes (graph paths)          |
| Derived subjects/pathways    | Limited (rules)   | Yes (graph-first)          |
| Explainability (why this)    | Snippets/highlights| Snippets + edge evidence  |
| Cross-subject cohesion       | Limited           | Strong (multi-hop links)   |
| RAG over ontology concepts   | Limited           | Yes (ontology index/graph) |
+------------------------------+-------------------+---------------------------+
```

Interpretation:
- Elastic-only can deliver strong discovery and relevance.
- Neo4j adds path-aware reasoning, provenance, and derived-subject workflows.

---

# C4 diagrams specifically for “Climate Change” as a derived subject

This second set focuses on one flagship capability:

- Create a derived subject “Climate Change” spanning multiple disciplines.
- Provide concept-centred organisation and novel pathways.
- Respect constraints (key stage, exam board/tier where relevant).
- Offer explainability (“why is this in the pathway?”).

---

## Climate Change – C1 System Context (C1)

```text
+----------------------------------------------------------------------------------+
|                    Derived Subject Builder: "Climate Change"                       |
|          (Cross-disciplinary learning journeys across the Oak corpus)              |
+----------------------------------------------------------------------------------+

Users:
  [Teachers]       [Curriculum Designers]     [Students/Adults]     [AI Agents/MCP]
      |                    |                       |                      |
      +--------------------+-----------------------+----------------------+
                                       |
                                       v
System capabilities:
  - Define/curate concept set (greenhouse effect, carbon cycle, etc.)
  - Discover lessons/units across subjects (geo, bio, chem, econ, politics)
  - Generate learning journeys (prereqs -> core -> extension)
  - Explain why each step belongs (concept evidence + graph path)

External systems:
  - Elastic Cloud (hybrid search candidates)
  - Neo4j AuraDB (concept graph traversal and paths)
  - Oak bulk corpus (lesson/unit/metadata/text)
```

---

## Climate Change – C2 Containers (C2)

```text
+----------------------------------------------------------------------------------+
|                               Derived Subject Containers                          |
+----------------------------------------------------------------------------------+

 [UI: "Create Subject"]         [UI: "Explore Pathway"]           [MCP Tools]
          |                               |                         |
          +-------------------------------+-------------------------+
                                          |
                                          v
+----------------------------------------------------------------------------------+
| TypeScript API: Derived Subject Service                                            |
| - builds "Climate Change" subject graph                                            |
| - generates pathways & explanations                                                 |
+------------------------------+--------------------------------+-------------------+
                               |                                |
                               v                                v
+-------------------------------+        +------------------------------------------+
| Elastic Cloud                  |        | Neo4j AuraDB                             |
| - candidate lessons/units      |        | - concept graph                           |
| - evidence snippets            |        | - prerequisites/relatedness/community     |
| - semantic similarity          |        | - pathfinding + constraints               |
+-------------------------------+        +------------------------------------------+
                               ^
                               |
+----------------------------------------------------------------------------------+
| Data pipeline                                                                      |
| - extract concepts from corpus                                                      |
| - embeddings + indexing (Elastic existing)                                          |
| - NEW: graph load (Neo4j)                                                          |
+----------------------------------------------------------------------------------+
```

---

## Climate Change – C3 Components (C3) inside the Derived Subject Service

```text
+----------------------------------------------------------------------------------+
|              DerivedSubjectService (TypeScript API components)                     |
+----------------------------------------------------------------------------------+

+-------------------------+     +--------------------------+     +----------------+
| ConceptSetManager       |     | CandidateFinder          |     | EvidenceStore  |
| - seed list (curated)   |     | - ES hybrid queries      |     | - snippets     |
| - aliases/synonyms      |     | - multi-query expansion  |     | - citations    |
| - concept taxonomy      |     | - filter by constraints  |     | - provenance   |
+-----------+-------------+     +------------+-------------+     +--------+-------+
            |                                |                            |
            +----------------------+---------+----------------------------+
                                   |
                                   v
                      +-------------------------------+
                      | GraphEnricher                 |
                      | - map candidates -> concepts  |
                      | - fetch neighborhoods         |
                      | - prereq expansion            |
                      +---------------+---------------+
                                      |
                                      v
                      +-------------------------------+
                      | PathGenerator                 |
                      | - choose route through graph  |
                      | - constraint-aware selection  |
                      | - create phases               |
                      |   (foundation/core/extend)    |
                      +---------------+---------------+
                                      |
                                      v
                      +-------------------------------+
                      | ExplanationBuilder            |
                      | - "why this step"             |
                      | - show concept edges used     |
                      | - show evidence snippets      |
                      +---------------+---------------+
                                      |
                                      v
                      +-------------------------------+
                      | OutputAdapters                |
                      | - UI payloads                 |
                      | - SDK types                   |
                      | - MCP tool responses          |
                      +-------------------------------+
```

---

## Climate Change – C4 Code seam (C4)

This is the one code-level diagram that tends to be worth keeping:

```text
+--------------------------------------------------------------------------+
| buildDerivedSubject(subjectKey="climate-change", constraints)            |
|--------------------------------------------------------------------------|
| 1) concepts = ConceptSetManager.get("climate-change")                    |
| 2) candidates = CandidateFinder.findLessonsUnits(concepts, constraints)  |
| 3) graphCtx = GraphEnricher.expand(concepts, candidates, constraints)    |
| 4) path = PathGenerator.generate(graphCtx, constraints)                  |
| 5) explanation = ExplanationBuilder.explain(path, graphCtx, evidence)    |
| 6) return OutputAdapters.format(path, explanation)                       |
+--------------------------------------------------------------------------+
```

---

# Optional: A simple “C4 decision” checklist for your repo

- Do we have C1 and C2 in the repo root? (Yes/No)
- Does C2 clearly show Elastic vs Neo4j responsibilities? (Yes/No)
- Does C3 exist for the TypeScript API only (not every service)? (Yes/No)
- Do we avoid C4 unless it’s a critical seam? (Yes/No)
- Are the diagrams updated as part of PR review? (Yes/No)

---

## Change log

- 2026-01-01: Added audience lenses, multi-view policy, and capability matrix.
