# Add-ons: Sequence Diagram + Neo4j Data Model (ASCII)

Below are two additional artifacts you can paste directly into documentation:

1. A **sequence diagram** showing the runtime flow: search → traverse → merge → pathway.
2. A **Neo4j data model mini-diagram** showing nodes/relationships for curriculum + derived subjects.

As requested:

- Outer wrapper is quadruple backticks
- Diagrams inside are triple backticks

---

## 1) Sequence diagram: Search → Traverse → Merge → Pathway

Purpose:

- Make the request/response flow concrete for UIs, SDKs, and MCP tool callers.
- Show where Elastic vs Neo4j are invoked, and what each contributes.

```text
Actors:
  User/UI/SDK/MCP Client
  TypeScript API (BFF)
  Elastic Cloud (Hybrid Search)
  Neo4j AuraDB (Knowledge Graph)

+-------------------+     +---------------------+     +-----------------------+     +----------------------+
| Client            |     | TypeScript API      |     | Elastic Cloud         |     | Neo4j AuraDB         |
+-------------------+     +---------------------+     +-----------------------+     +----------------------+
         |                           |                           |                           |
         | 1) Query + constraints    |                           |                           |
         |-------------------------->|                           |                           |
         |  (e.g. "climate change",  |                           |                           |
         |   KS3, tier=?, examBoard?)|                           |                           |
         |                           |                           |                           |
         |                           | 2) Hybrid search request  |                           |
         |                           |-------------------------->|                           |
         |                           |  - lexical (BM25)         |                           |
         |                           |  - semantic (kNN vector)  |                           |
         |                           |  - filters/facets         |                           |
         |                           |                           |                           |
         |                           | 3) Candidates + scores    |                           |
         |                           |<--------------------------|                           |
         |                           |  (top-K lessons/units +   |                           |
         |                           |   highlights/snippets)     |                           |
         |                           |                           |                           |
         |                           | 4) Graph expansion query  |                           |
         |                           |------------------------------->                        |
         |                           |  - map candidates->concepts |                           |
         |                           |  - fetch neighborhoods       |                           |
         |                           |  - prereqs / relatedness     |                           |
         |                           |  - enforce constraints       |                           |
         |                           |                           |                           |
         |                           | 5) Graph context            |                           |
         |                           |<-------------------------------|                        |
         |                           |  (concept nodes/edges,         |                        |
         |                           |   paths, scores, provenance)   |                        |
         |                           |                           |                           |
         |                           | 6) Merge & rank              |                           |
         |                           |  - blend ES + graph scores   |                           |
         |                           |  - dedupe/diversify          |                           |
         |                           |  - attach "why" explanations |                           |
         |                           |                           |                           |
         |                           | 7) Build learning journeys   |                           |
         |                           |  - choose phases (foundation |                           |
         |                           |    / core / extension)       |                           |
         |                           |  - create stepwise pathways  |                           |
         |                           |  - add evidence snippets     |                           |
         |                           |                           |                           |
         | 8) Response: results + paths + explanations              |                           |
         |<--------------------------|                           |                           |
         |                           |                           |                           |

Notes:
- Elastic’s job: fast recall + ranking signals + evidence snippets (highlights).
- Neo4j’s job: traversal, multi-hop reasoning, prerequisites, cross-subject connections.
- API’s job: orchestration, policy/constraints, blending, explainability payloads.
```

---

## 2) Neo4j data model mini-diagram (nodes + relationships)

Purpose:

- Provide a canonical, idiomatic schema shape for Oak’s curriculum corpus
  plus “derived subjects” like Climate Change.

Key modeling principles:

- Keep node labels meaningful and stable.
- Prefer explicit relationships over repeated denormalised fields.
- Store confidence/provenance on relationships that are inferred by ML/heuristics.
- Use “DerivedSubject” as a first-class node so you can version and curate it.

```text
+----------------------------------------------------------------------------------+
|                              CORE CURRICULUM GRAPH                               |
+----------------------------------------------------------------------------------+

Nodes (labels):
  (:Lesson {id, title, keyStage, subject, examBoard?, tier?, ...})
  (:Unit   {id, title, keyStage, subject, examBoard?, tier?, ...})
  (:Programme {id, title, keyStage, subject, ...})   // optional grouping above units
  (:Concept {id, name, aliases[], description?, ...})
  (:Subject {id, name})
  (:KeyStage {id, name})  // or keep as property instead of node
  (:ExamBoard {id, name}) // only where relevant
  (:Tier {id, name})      // only where relevant

Primary relationships:
  (:Lesson)-[:IN_UNIT]->(:Unit)
  (:Unit)-[:IN_PROGRAMME]->(:Programme)              // optional
  (:Lesson)-[:TEACHES {confidence, method, source}]->(:Concept)
  (:Concept)-[:PREREQ_OF {confidence, source}]->(:Concept)
  (:Concept)-[:RELATED_TO {weight, reason}]->(:Concept)
  (:Subject)-[:INCLUDES]->(:Unit)
  (:Subject)-[:HAS_CONCEPT]->(:Concept)              // optional derived linkage

Curriculum constraints (two common patterns):

Pattern A (properties on content nodes):
  (:Lesson {keyStage:"KS3", examBoard:"AQA", tier:"Higher"})
  (:Unit   {keyStage:"KS4", examBoard:"Edexcel", tier:"Foundation"})

Pattern B (explicit nodes for constraints):
  (:Lesson)-[:FOR_KEY_STAGE]->(:KeyStage)
  (:Lesson)-[:FOR_EXAM_BOARD]->(:ExamBoard)
  (:Lesson)-[:FOR_TIER]->(:Tier)

Choose A unless you have heavy constraint traversal queries or many-to-many needs.

+----------------------------------------------------------------------------------+
|                           DERIVED SUBJECTS / TOPIC LENSES                         |
+----------------------------------------------------------------------------------+

Nodes:
  (:DerivedSubject {id, name, version, owner, status, createdAt, updatedAt})
  (:ConceptCluster {id, name, method, version})   // optional: communities / clusters

Relationships:
  (:DerivedSubject)-[:HAS_CONCEPT {role, weight, curator?}]->(:Concept)
    role: "foundation" | "core" | "extension" | "controversy" | etc.

  (:DerivedSubject)-[:RECOMMENDS {strategy, version}]->(:Lesson)
  (:DerivedSubject)-[:RECOMMENDS]->(:Unit)

  (:DerivedSubject)-[:HAS_PATH {id, title, version}]->(:LearningPath)
  (:LearningPath)-[:HAS_STEP {index}]->(:PathStep)
  (:PathStep)-[:USES {why}]->(:Concept)
  (:PathStep)-[:POINTS_TO]->(:Lesson)  OR  (:PathStep)-[:POINTS_TO]->(:Unit)

Explainability / provenance links (recommended):
  (:EdgeEvidence {id, type, snippet, sourceRef, createdAt})
  (:Lesson)-[:EVIDENCE_FOR]->(:EdgeEvidence)
  (:EdgeEvidence)-[:SUPPORTS]->(:Lesson)-[:TEACHES]->(:Concept)
  (:EdgeEvidence)-[:SUPPORTS]->(:Concept)-[:PREREQ_OF]->(:Concept)

This gives you:
- “Why is this lesson in the climate change pathway?”
- “Which concept link justified this prerequisite hop?”

+----------------------------------------------------------------------------------+
|                                EXEMPLAR: CLIMATE CHANGE                           |
+----------------------------------------------------------------------------------+

(:DerivedSubject {name:"Climate Change", version:"v1"})
  -[:HAS_CONCEPT {role:"foundation"}]->(:Concept {name:"Energy transfer"})
  -[:HAS_CONCEPT {role:"core"}]->(:Concept {name:"Greenhouse effect"})
  -[:HAS_CONCEPT {role:"core"}]->(:Concept {name:"Carbon cycle"})
  -[:HAS_CONCEPT {role:"extension"}]->(:Concept {name:"Externalities"})
  -[:HAS_CONCEPT {role:"extension"}]->(:Concept {name:"Policy instruments"})

Then traversal:
  climateChange -> concepts -> lessons/units across subjects
  plus PREREQ_OF chains to generate coherent stepwise journeys.

```

---

## Optional: Indexing & constraint guidance (pasteable notes)

- Use stable IDs for nodes (lessonId/unitId/conceptId), and make those match IDs stored in Elasticsearch.
- Store inferred edges like TEACHES/PREREQ_OF with:
  - `confidence` (0..1)
  - `method` ("keyword", "embedding", "llm", "human")
  - `source` (pipeline version / model version)
- Version derived subjects:
  - `(:DerivedSubject {version:"v1"})` so you can iterate safely and compare.

---

## Glossary and field map (reference view)

Glossary (shared terms):

- Lesson: atomic teaching item with content, metadata, and transcript fields.
- Unit: aggregation of lessons with rollup text and structure.
- Sequence: ordered grouping of units within a subject and phase.
- Thread: cross-sequence strand for related concepts.
- Concept: graph node for a knowledge item or curriculum term.
- DerivedSubject: curated concept set plus recommended paths.
- Path/Step: ordered learning journey with evidence and constraints.

Field map (Elastic to graph guidance):

```text
-------------------------+-----------------------------------+-----------------------------+
| Concept                | Elastic index fields (examples)   | Graph nodes/properties      |
+-------------------------+-----------------------------------+-----------------------------+
| Subject                | subject_slug                      | (:Subject {id/name})        |
| Key stage              | key_stage                         | (:KeyStage {id/name})       |
| Exam board             | exam_boards                        | (:ExamBoard {id/name})      |
| Tier                   | tiers                              | (:Tier {id/name})           |
| Thread                 | thread_slugs, thread_titles        | (:Thread) or Concept node   |
| Categories             | categories                         | (:Concept or :Category)     |
| Prior knowledge        | prior_knowledge_requirements       | (:Concept) edges/metadata   |
| Lesson semantics       | lesson_content_semantic            | content_semantic            |
| Lesson structure       | lesson_structure                   | description/summary         |
| Unit semantics         | unit_content_semantic              | content_semantic            |
| Unit structure         | unit_structure                     | description/summary         |
| Sequence semantics     | sequence_semantic                  | content_semantic            |
+-------------------------+-----------------------------------+-----------------------------+
```

Notes:
- Use SDK-generated schemas for canonical field names and shapes.
- Treat this table as a mapping guide, not a strict schema.
