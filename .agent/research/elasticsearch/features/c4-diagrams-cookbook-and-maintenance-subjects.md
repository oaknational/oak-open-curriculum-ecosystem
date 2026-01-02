# Add-ons pack: Query cookbook + Schema evolution + Constraints matrix (ASCII + pasteable)

This pack adds:

1. A **query cookbook** (Elasticsearch + Cypher) for common use-cases.
2. A **schema migration / evolution strategy** for Neo4j in practice.
3. A **constraints matrix** covering KS / tier / exam board approaches.

Diagrams and code snippets are in triple backticks.

---

## Quick recipe cards (index view)

- Candidate generation (Elastic hybrid search) -> section 1.1
- Candidate to graph mapping -> section 1.2
- Concept expansion -> section 1.3
- Prerequisite chains -> section 1.4
- Derived subject creation -> section 1.5
- Recommendations from derived subjects -> section 1.6
- Merge ES + graph scores -> section 1.7
- "Why this?" payload -> section 1.8

This is an index view; the canonical query shapes remain in the sections below.

## 1) Query Cookbook

### 1.1 Candidate generation (Elastic hybrid search)

Use-case:

- Start from a user query (e.g. “climate change feedback loops KS3”)
- Return candidate lessons/units with text + semantic relevance.
- Apply curriculum constraints as filters where applicable.

```json
POST /educational-resources/_search
{
  "size": 25,
  "query": {
    "bool": {
      "must": [
        { "match": { "body": { "query": "climate change feedback loops", "boost": 0.5 } } }
      ],
      "filter": [
        { "term": { "keyStage": "KS3" } },
        { "terms": { "contentType": ["lesson", "unit"] } }
      ]
    }
  },
  "knn": {
    "field": "embedding",
    "query_vector": "<queryVector>",
    "k": 25,
    "num_candidates": 200,
    "boost": 0.5
  },
  "_source": ["id", "title", "subject", "keyStage", "examBoard", "tier", "keywords", "unitId"],
  "highlight": {
    "fields": { "body": { "fragment_size": 160, "number_of_fragments": 2 } }
  }
}
```

Notes:

- You can “fan out” the query: run multiple ES queries for key concepts and merge.
- Use highlights to capture evidence snippets for explainability.

---

### 1.2 Map Elastic candidates to graph nodes (Neo4j: content lookup)

Use-case:

- Given ES candidate IDs, fetch their graph representation and attached concepts.

```cypher
// Input: $ids = [ "lesson:123", "unit:456", ... ]
MATCH (c)
WHERE (c:Lesson OR c:Unit) AND c.id IN $ids
OPTIONAL MATCH (c)-[t:TEACHES]->(con:Concept)
RETURN
  c.id            AS id,
  labels(c)       AS labels,
  c.title         AS title,
  c.subject       AS subject,
  c.keyStage      AS keyStage,
  c.examBoard     AS examBoard,
  c.tier          AS tier,
  collect({
    conceptId: con.id,
    concept: con.name,
    confidence: t.confidence,
    method: t.method
  }) AS teachesConcepts;
```

---

### 1.3 Expand neighborhood around concepts (Neo4j: traversal)

Use-case:

- Starting from a set of concepts (seeded by derived subject or extracted from candidates),
  find nearby concepts (related/prereq) and connected content.

```cypher
// Input: $conceptIds, $maxHops (e.g. 2)
MATCH (seed:Concept)
WHERE seed.id IN $conceptIds

CALL {
  WITH seed
  MATCH p = (seed)-[:RELATED_TO|PREREQ_OF*1..$maxHops]-(nbr:Concept)
  RETURN seed.id AS seedId, collect(DISTINCT nbr) AS neighbors
}
WITH seed, neighbors
UNWIND neighbors AS c2

// bring back connected lessons/units with TEACHES edges
OPTIONAL MATCH (content)-[t:TEACHES]->(c2)
WHERE (content:Lesson OR content:Unit)
RETURN
  seed.id AS seedConceptId,
  collect(DISTINCT {
    conceptId: c2.id,
    concept: c2.name
  }) AS expandedConcepts,
  collect(DISTINCT {
    id: content.id,
    title: content.title,
    labels: labels(content),
    confidence: t.confidence,
    method: t.method
  }) AS connectedContent;
```

---

### 1.4 Find prerequisite chains (Neo4j: paths)

Use-case:

- Build a coherent “learning journey” by ordering concepts from prerequisites to advanced.

Example A: all prerequisites up to depth N:

```cypher
MATCH (target:Concept {id: $targetConceptId})
MATCH p = (pre:Concept)-[:PREREQ_OF*1..$depth]->(target)
RETURN pre.id AS prereqId, pre.name AS prereq, length(p) AS distance
ORDER BY distance ASC;
```

Example B: shortest prerequisite path between two concepts:

```cypher
MATCH (a:Concept {id: $from}), (b:Concept {id: $to})
MATCH p = shortestPath( (a)-[:PREREQ_OF*..10]->(b) )
RETURN [n IN nodes(p) | n { .id, .name }] AS conceptPath;
```

---

### 1.5 Create a Derived Subject (Neo4j: write pattern)

Use-case:

- Create “Climate Change v1” with curated concepts and weights.

```cypher
MERGE (ds:DerivedSubject {id: $id})
SET ds.name = $name,
    ds.version = $version,
    ds.owner = $owner,
    ds.status = $status,
    ds.updatedAt = datetime()

WITH ds
UNWIND $concepts AS c
  MERGE (con:Concept {id: c.id})
  MERGE (ds)-[r:HAS_CONCEPT]->(con)
  SET r.role = c.role,
      r.weight = c.weight,
      r.curator = c.curator,
      r.updatedAt = datetime();

RETURN ds;
```

Input shape example:

- $concepts = [
  {id:"concept:greenhouse_effect", role:"core", weight:0.95, curator:"oak-team"},
  ...
  ]

---

### 1.6 Generate recommended content for a Derived Subject (Neo4j)

Use-case:

- Fetch lessons/units relevant to “Climate Change” based on HAS_CONCEPT -> TEACHES links.

```cypher
MATCH (ds:DerivedSubject {id: $dsId})-[:HAS_CONCEPT]->(c:Concept)
MATCH (content)-[t:TEACHES]->(c)
WHERE (content:Lesson OR content:Unit)

// optional constraints
AND ($keyStage IS NULL OR content.keyStage = $keyStage)
AND ($examBoard IS NULL OR content.examBoard = $examBoard)
AND ($tier IS NULL OR content.tier = $tier)

WITH ds, content,
     sum(coalesce(t.confidence, 0.0)) AS score,
     collect(DISTINCT c.name)[0..8] AS matchedConcepts
RETURN
  content.id AS id,
  content.title AS title,
  labels(content) AS labels,
  score AS graphScore,
  matchedConcepts
ORDER BY graphScore DESC
LIMIT 50;
```

---

### 1.7 Merge Elastic results with Neo4j graph scores (application logic)

Use-case:

- Elastic returns (id, esScore, highlights)
- Neo4j returns (id, graphScore, matchedConcepts)
- Merge into a unified ranking.

```text
Recommended scoring shape (simple + explainable):
  combinedScore = w_es * normalize(esScore) + w_graph * normalize(graphScore)

where:
  - normalize can be min-max over the candidate list
  - w_es and w_graph can vary by query type
```

---

### 1.8 “Why this?” explainability payload

Use-case:

- For each recommended item, return:
  - top matched concepts
  - a snippet from Elastic highlight
  - a graph explanation (path or concept-edge evidence)

Neo4j evidence pattern (optional but powerful):

```cypher
MATCH (content {id:$contentId})-[t:TEACHES]->(c:Concept)<-[hc:HAS_CONCEPT]-(ds:DerivedSubject {id:$dsId})
OPTIONAL MATCH (ev:EdgeEvidence)-[:SUPPORTS]->(content)-[:EVIDENCE_FOR]->(ev)
RETURN
  content.id AS id,
  content.title AS title,
  collect(DISTINCT {
    concept: c.name,
    confidence: t.confidence,
    role: hc.role,
    weight: hc.weight
  })[0..5] AS whyConcepts;
```

Then attach ES highlight fragments.

---

## 2) Neo4j schema migration / evolution strategy

Goal:

- Evolve your graph safely as you learn (new node types, new relationships, new properties).
- Avoid breaking consumers (UIs, SDKs, MCP tools).

### 2.1 Core principles

- Prefer additive changes:
  - new labels, new properties, new rel types are low-risk.
- Version inference and derived artifacts:
  - store pipeline/model version on inferred edges.
  - store derived subjects with versions (v1, v2).
- Avoid renaming label/relationship types unless you must:
  - instead, add the new one and keep the old temporarily.

### 2.2 Practical evolution workflow

```text
1) Write a schema “contract” doc:
   - node labels, required IDs, relationship types, key properties.

2) Add migrations as idempotent Cypher scripts:
   - each script can be rerun safely (MERGE/SET, conditional).

3) Use a “schema version” node:
   (:Schema {name:"oak-kg", version: 12, appliedAt: datetime()})

4) Deploy sequence:
   a) apply Neo4j migration
   b) update API to understand both old+new shapes (compat layer)
   c) backfill data (async job)
   d) switch reads to new schema
   e) eventually remove old paths/labels

Note: in this repo, compatibility layers are disallowed. If you need a transition, use an explicit cutover plan and remove legacy paths immediately after backfill.
```

### 2.3 Idempotent migration examples

Add a uniqueness constraint (Neo4j 5 style):

```cypher
CREATE CONSTRAINT concept_id_unique IF NOT EXISTS
FOR (c:Concept)
REQUIRE c.id IS UNIQUE;
```

Add indexes for performance:

```cypher
CREATE INDEX lesson_id IF NOT EXISTS FOR (l:Lesson) ON (l.id);
CREATE INDEX unit_id IF NOT EXISTS FOR (u:Unit) ON (u.id);
CREATE INDEX ds_id IF NOT EXISTS FOR (d:DerivedSubject) ON (d.id);
```

Backfill missing `keyStage` property from existing relationships (if you adopt Pattern B later):

```cypher
MATCH (l:Lesson)-[:FOR_KEY_STAGE]->(ks:KeyStage)
WHERE l.keyStage IS NULL
SET l.keyStage = ks.id;
```

### 2.4 Compatibility layer patterns (API)

- Create a translation layer:
  - If the graph stores constraints as nodes (Pattern B) but the API expects properties (Pattern A),
    the API can map either to a unified internal model.

- Use feature flags:
  - “use_new_prereq_edges”
  - “use_concept_clusters_v2”

### 2.5 Testing + observability for graph evolution

- Add query “golden tests”:
  - given a seed concept, ensure traversal returns stable core results.
- Monitor:
  - query latency percentiles (p50/p95)
  - cardinalities (#Concept, #TEACHES edges)
  - drift in inference confidence distributions

---

## 3) Constraints matrix (Key stage / exam board / tier)

The goal is to support:

- Broad users (students/adults) who want cross-curriculum discovery
- Teachers who need KS-appropriate content
- GCSE users where exam board and tier matter

There are two main modeling strategies, plus a hybrid.

Constraints lens (summary):

- Broad discovery: key stage optional, exam board/tier off by default.
- Teacher planning: key stage required, exam board/tier when KS4.
- Derived subjects: apply constraints during content selection, not concept definition.

### 3.1 Constraint modeling strategies

```text
Pattern A: Properties on content nodes (recommended default)
  Lesson.keyStage = "KS3"
  Lesson.examBoard = "AQA" (nullable)
  Lesson.tier = "Higher" (nullable)

Pros:
  - simplest
  - fastest for filtering in Cypher with WHERE
  - easy to mirror in Elasticsearch

Cons:
  - harder if constraints become many-to-many (e.g., one lesson fits multiple boards)

Pattern B: Explicit constraint nodes (only when needed)
  (Lesson)-[:FOR_KEY_STAGE]->(KeyStage)
  (Lesson)-[:FOR_EXAM_BOARD]->(ExamBoard)
  (Lesson)-[:FOR_TIER]->(Tier)

Pros:
  - flexible for many-to-many relationships
  - makes constraint traversal easy

Cons:
  - more joins in Cypher, can add query overhead
  - more ingestion complexity
```

### 3.2 Constraint matrix by user type

```text
+----------------------+---------------------+------------------+---------------------------+
| User / Consumer      | Needs KS filter?    | Needs board/tier?| Typical default behavior  |
+----------------------+---------------------+------------------+---------------------------+
| Students (general)   | Yes (age)           | Rarely           | KS inferred from profile  |
| Adult learners       | Optional            | No               | KS filter off by default  |
| Teachers             | Yes                 | Sometimes (KS4)   | KS required, board/tier UI|
| Curriculum designers | Yes                 | Yes (design work)| full constraint controls  |
| Engineers / SDK      | Depends             | Depends          | constraints passed via API|
| MCP / AI assistants  | Yes (safe output)   | When asked       | conservative constraints  |
+----------------------+---------------------+------------------+---------------------------+
```

### 3.3 How constraints affect derived subjects (e.g., “Climate Change”)

Rule set (recommended):

- Derived subject concept set is global (same concepts), but
- Path generation is constraint-aware:
  - KS2 path uses simpler prerequisites and age-appropriate content
  - KS4 path can include more technical science and policy depth
  - Exam board/tier constraints narrow to applicable GCSE variants

Mechanically:

- You query the same graph, but add filters during content selection:
  - `WHERE content.keyStage = $ks`
  - `AND (content.examBoard = $board OR content.examBoard IS NULL)`
  - `AND (content.tier = $tier OR content.tier IS NULL)`

---

## Bonus: ASCII data-flow “at a glance” (mini)

```text
User query
  -> Elastic hybrid search (candidates + snippets)
  -> Neo4j traversal (concept links + prerequisites + paths)
  -> API merge (rank + dedupe + explain)
  -> UI/SDK/MCP output (results + pathways + “why this?”)
```

---

## Anti-patterns and guardrails

- Do not introduce compatibility layers in runtime code; replace and cut over.
- Avoid HTTP proxy layers when an SDK can be called in-process.
- Do not mix field naming conventions (snake_case for Elastic, camelCase for graph) in the same model.
- Avoid unbounded traversal; always apply hop limits and constraints.
- Do not treat graph scores as authoritative without provenance.

If you want an extra layer of documentation polish, I can also produce:

- a “**glossary**” (Concept vs Topic vs Lesson vs Unit vs Programme vs DerivedSubject),
- “**API contract**” examples (TypeScript types and JSON shapes),
- a “**path scoring rubric**” (how to rank candidate pathways).
