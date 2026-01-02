# Graph, RAG, and Graph RAG Integration Vision for Oak Curriculum Search

_Date: 2025-12-05_
_Status: RESEARCH - STRATEGIC VISION_

## Executive Summary

This document synthesises research on Elasticsearch's AI capabilities with Oak's curriculum domain to propose an integrated vision for:

1. **Instance-Level Knowledge Graph** — Moving beyond our static schema-level graph to a dynamic graph of actual curriculum relationships
2. **RAG Infrastructure** — Retrieval-Augmented Generation for curriculum question answering
3. **Graph RAG** — Combining graph traversal with RAG for multi-hop curriculum reasoning

The goal is to provide powerful insight and exploration tools that work together to enhance our MCP tools and search capabilities.

## Positioning and Phasing (ES-only now, Neo4j later)

- **Near-term**: ES-native, graph-adjacent features (Graph Explore API, significant terms, transforms, entity-centric indices) for immediate improvements to search and discovery.
- **Later**: Neo4j for true multi-hop traversal. Export graph-derived views back into Elasticsearch (paths, concept clusters, derived subjects) to strengthen retrieval and enable novel subjects.

This vision focuses on ES-based graph, RAG, and Graph RAG; treat Neo4j as a later-phase extension that complements, rather than replaces, Elasticsearch.

---

## 1. Current State: What We Have

### 1.1 Schema-Level Knowledge Graph (Static)

Our `knowledge-graph-data.ts` is a **TBox** (terminological) representation:

```typescript
// ~28 concept TYPES, ~45 relationship TYPES
{
  concepts: [
    { id: 'subject', label: 'Subject', ... },
    { id: 'sequence', label: 'Sequence', ... },
    { id: 'unit', label: 'Unit', ... },
    { id: 'lesson', label: 'Lesson', ... },
    // ...
  ],
  edges: [
    { from: 'subject', to: 'sequence', rel: 'hasSequences' },
    { from: 'unit', to: 'lesson', rel: 'containsLessons' },
    { from: 'thread', to: 'unit', rel: 'linksAcrossYears' },
    // ...
  ],
}
```

**Characteristics**:

- No instance data — only concept TYPE relationships
- Static, authored domain knowledge
- ~5K tokens when combined with ontology
- Used by AI agents to understand domain structure before querying

### 1.2 Ontology Data (Static Definitions)

Our `ontology-data.ts` provides:

- Curriculum structure definitions (key stages, phases, subjects)
- Thread definitions with progression examples
- Programme vs sequence distinction
- KS4 complexity (tiers, exam boards, pathways)
- Workflows for tool usage
- Synonyms (single source of truth for Elasticsearch)

### 1.3 Semantic Search Infrastructure (Blocked but Architected)

Current Elasticsearch Serverless deployment:

- **Indexes**: `oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`
- **ELSER**: `.elser-2-elastic` auto-assigned to `semantic_text` fields
- **Hybrid Search**: BM25 + sparse vectors + RRF ready
- **Synonyms**: 68 rules deployed as `oak-syns`

**Blocking Issue**: Zod/ES mapping field mismatch — must be resolved before real data ingestion.
**Status note (2026-01-01)**: Schema-first alignment is now resolved; see `semantic-search-plans-review.md` for current state.

---

## 2. The Gap: What We're Missing

### 2.1 Instance-Level Knowledge Graph

We have no graph of **actual curriculum relationships** — specific lessons connected to specific units, specific keywords appearing across lessons, specific misconceptions addressed across the curriculum.

**Example of what we're missing**:

```
Lesson:"adding-fractions-year-4" --containedIn--> Unit:"fractions-year-4"
Lesson:"adding-fractions-year-4" --hasKeyword--> Keyword:"denominator"
Lesson:"adding-fractions-year-4" --addresses--> Misconception:"numerator-counts-pieces"
Keyword:"denominator" --alsoAppears--> Lesson:"equivalent-fractions-year-3"
Thread:"number" --links--> Unit:"fractions-year-4"
Thread:"number" --links--> Unit:"fractions-year-5"
```

This instance-level graph would enable:

- "Find all lessons that address misconceptions about fractions"
- "Show how the concept 'denominator' develops across years"
- "What lessons connect Year 3 and Year 7 geometry?"

#### From Property Graph to Instance Graph

Our current `knowledge-graph-data.ts` is a property graph (schema only). The instance data already exists in graph exports (vocabulary, misconceptions, prerequisites, NC coverage), but it is not connected to the schema.

Practical steps to close the gap:

- Validate extracted entity types against the schema concept list before export.
- Generate explicit edges from instance data (e.g. lesson -> hasKeyword -> keyword).
- Produce a unified export that combines schema, instances, and edges for downstream tools.
- Use ontology data (subjects, key stages, threads) as authoritative validation inputs.

### 2.2 Graph Generation from Content

We're not extracting relationships from our content:

- Named Entity Recognition on transcripts
- Keyword co-occurrence analysis
- Implicit relationships from curriculum structure
- Transcript pattern mining (e.g. "also called", "remember, X means", "don't confuse X with Y") for synonyms and misconceptions; LLM extraction is more reliable than regex

### 2.3 RAG Infrastructure

We have no retrieval-augmented generation:

- No LLM integration for answer synthesis
- No grounded responses citing specific curriculum content
- No conversational curriculum assistant

### 2.4 Graph RAG

No combination of graph traversal with RAG:

- Can't answer "How are X and Y connected?"
- Can't synthesise cross-document facts
- Can't explain curriculum progressions with evidence

---

## 3. Elasticsearch Capabilities for Closing the Gap

### 3.1 Graph API for Co-occurrence Discovery

Elasticsearch's Graph API can discover **implicit relationships** without a separate graph database:

```http
POST oak_lessons/_graph/explore
{
  "query": {
    "match": { "lesson_semantic": "fractions" }
  },
  "vertices": [
    { "field": "keywords", "min_doc_count": 3 },
    { "field": "unit_slug", "min_doc_count": 1 }
  ],
  "connections": {
    "query": { "match_all": {} }
  }
}
```

**Result**: Terms that co-occur significantly with "fractions" lessons — revealing the implicit graph.

**Use Case**:

- Discover which keywords cluster together
- Find which units are conceptually related (even without explicit thread links)
- Build query expansion from observed relationships

### 3.2 Explicit Triple Storage

Index relationships as documents for querying:

```typescript
interface CurriculumTriple {
  triple_id: string; // "lesson:adding-fractions|containsKeyword|keyword:denominator"
  source_id: string; // "lesson:adding-fractions"
  source_type: string; // "lesson"
  source_label: string; // "Adding Fractions with Same Denominator"
  relation: string; // "containsKeyword"
  target_id: string; // "keyword:denominator"
  target_type: string; // "keyword"
  target_label: string; // "denominator"
  confidence: number; // 1.0 for explicit, 0.7+ for inferred
  source_doc_id?: string; // Document this was extracted from
  context?: string; // Sentence/context where relationship found
}
```

**Index**: `oak_curriculum_graph`

**Extraction Sources**:

1. **API Structure** (explicit, high confidence):
   - lesson → unit → sequence → subject
   - lesson → keywords, misconceptions
   - unit → threads, categories
2. **NER on Transcripts** (inferred, medium confidence):
   - Extract person names, places, concepts
   - Build edges from co-occurrence
3. **Co-occurrence Mining** (inferred, variable confidence):
   - Keywords appearing together
   - Lessons frequently accessed together (from search logs)

### 3.3 Inference API for LLM Integration

Elasticsearch can call external LLMs/embedding models:

```http
PUT _inference/completion/openai-gpt4
{
  "service": "openai",
  "service_settings": {
    "api_key": "<key>",
    "model_id": "gpt-4"
  }
}
```

Then use in search pipeline:

```http
POST oak_lessons/_search
{
  "query": { ... },
  "ext": {
    "inference": {
      "endpoint_id": "openai-gpt4",
      "prompt": "Based on these lesson excerpts, answer: {{query}}"
    }
  }
}
```

### 3.4 NER via Ingest Pipelines

Extract entities during indexing:

```http
PUT _ingest/pipeline/curriculum-ner
{
  "processors": [
    {
      "inference": {
        "model_id": "distilbert-base-cased-finetuned-conll03",
        "target_field": "extracted_entities",
        "field_map": {
          "transcript_text": "text_field"
        }
      }
    }
  ]
}
```

**Entities to Extract**:

- Historical figures (for History lessons)
- Scientific terms (for Science lessons)
- Mathematical concepts (for Maths lessons)
- Geographic locations (for Geography lessons)

### 3.5 Reranking with Graph Features

Use graph-derived features for result reranking:

```http
POST oak_lessons/_search
{
  "query": { "match": { "lesson_semantic": "photosynthesis" } },
  "rescore": {
    "query": {
      "script_score": {
        "script": {
          "source": """
            // Boost if lesson shares thread with query entity
            def threadBoost = doc['thread_slugs'].contains(params.queryThread) ? 1.5 : 1.0;
            // Boost if lesson has keywords from graph neighbourhood
            def keywordBoost = 1.0;
            for (kw in params.relatedKeywords) {
              if (doc['keywords'].contains(kw)) keywordBoost += 0.2;
            }
            return _score * threadBoost * keywordBoost;
          """,
          "params": {
            "queryThread": "bq01-biology-living-things",
            "relatedKeywords": ["chlorophyll", "chloroplast", "glucose"]
          }
        }
      }
    }
  }
}
```

---

## 4. Proposed Architecture: Three Integrated Layers

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              MCP TOOLS LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │semantic-search│  │explore-graph │  │ask-curriculum│  │find-connections│     │
│  │(enhanced)    │  │(new)         │  │(new RAG)     │  │(new Graph RAG)│       │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────────────────────────────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   LAYER 1: GRAPH      │   │   LAYER 2: RAG        │   │   LAYER 3: GRAPH RAG  │
│                       │   │                       │   │                       │
│ • Instance-level KG   │   │ • Hybrid retrieval    │   │ • Entity detection    │
│ • Triple storage      │   │ • Context assembly    │   │ • Subgraph extraction │
│ • Graph traversal     │   │ • LLM generation      │   │ • Path-based context  │
│ • Co-occurrence       │   │ • Citation tracking   │   │ • Multi-hop synthesis │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                        ELASTICSEARCH SERVERLESS                                 │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         CONTENT INDEXES                                  │  │
│  │  oak_lessons │ oak_units │ oak_unit_rollup │ oak_sequences │ oak_meta   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         GRAPH INDEXES (NEW)                              │  │
│  │  oak_curriculum_graph │ oak_entities │ oak_ontology                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         INFERENCE ENDPOINTS                              │  │
│  │  .elser-2-elastic │ openai-gpt4 │ ner-curriculum │ rerank-v1           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Layer 1: Instance-Level Knowledge Graph

### 5.1 New Index: `oak_curriculum_graph`

Store curriculum relationships as searchable documents:

```typescript
interface OakCurriculumGraphMapping {
  mappings: {
    properties: {
      // Triple identification
      triple_id: { type: 'keyword' };

      // Source entity
      source_id: { type: 'keyword' };
      source_type: { type: 'keyword' }; // lesson, unit, keyword, thread, etc.
      source_label: { type: 'text'; fields: { keyword: { type: 'keyword' } } };

      // Relationship
      relation: { type: 'keyword' };
      relation_category: { type: 'keyword' }; // hierarchical, semantic, temporal, etc.

      // Target entity
      target_id: { type: 'keyword' };
      target_type: { type: 'keyword' };
      target_label: { type: 'text'; fields: { keyword: { type: 'keyword' } } };

      // Metadata
      confidence: { type: 'float' };
      extraction_source: { type: 'keyword' }; // api, ner, cooccurrence
      context: { type: 'text' };
      created_at: { type: 'date' };
    };
  };
}
```

### 5.2 New Index: `oak_entities`

Canonical entity records for disambiguation:

```typescript
interface OakEntitiesMapping {
  mappings: {
    properties: {
      entity_id: { type: 'keyword' };
      entity_type: { type: 'keyword' };
      canonical_label: { type: 'keyword' };
      aliases: { type: 'keyword' }; // Alternative names
      description: { type: 'text' };
      description_semantic: { type: 'semantic_text' };

      // Type-specific metadata
      metadata: { type: 'object'; enabled: false };

      // Graph metrics (computed periodically)
      in_degree: { type: 'integer' }; // How many edges point TO this entity
      out_degree: { type: 'integer' }; // How many edges point FROM this entity
      centrality: { type: 'float' }; // PageRank or similar
    };
  };
}
```

### 5.3 New Index: `oak_ontology`

Index our static ontology/knowledge-graph for semantic search and RAG:

```typescript
interface OakOntologyMapping {
  mappings: {
    properties: {
      doc_id: { type: 'keyword' };
      doc_type: { type: 'keyword' }; // concept, keystage, phase, thread, workflow
      title: { type: 'text'; fields: { keyword: { type: 'keyword' } } };
      description: { type: 'text' };
      description_semantic: { type: 'semantic_text' };

      category: { type: 'keyword' };
      related_concepts: { type: 'keyword' };

      // Full content for RAG
      content_text: { type: 'text' };

      // Metadata
      source: { type: 'keyword' }; // ontology-data, knowledge-graph-data
    };
  };
}
```

### 5.4 Graph Extraction Pipeline

Extract triples during ingestion:

```typescript
async function extractGraphFromLesson(lesson: LessonData): Promise<CurriculumTriple[]> {
  const triples: CurriculumTriple[] = [];

  // Explicit hierarchical relationships
  triples.push({
    source_id: `lesson:${lesson.slug}`,
    source_type: 'lesson',
    source_label: lesson.title,
    relation: 'containedIn',
    relation_category: 'hierarchical',
    target_id: `unit:${lesson.unitSlug}`,
    target_type: 'unit',
    target_label: lesson.unitTitle,
    confidence: 1.0,
    extraction_source: 'api',
  });

  // Keywords
  for (const keyword of lesson.keywords ?? []) {
    triples.push({
      source_id: `lesson:${lesson.slug}`,
      relation: 'hasKeyword',
      relation_category: 'semantic',
      target_id: `keyword:${slugify(keyword)}`,
      target_type: 'keyword',
      target_label: keyword,
      confidence: 1.0,
      extraction_source: 'api',
    });
  }

  // Misconceptions
  for (const misconception of lesson.misconceptions ?? []) {
    triples.push({
      source_id: `lesson:${lesson.slug}`,
      relation: 'addresses',
      relation_category: 'pedagogical',
      target_id: `misconception:${slugify(misconception)}`,
      target_type: 'misconception',
      target_label: misconception,
      confidence: 1.0,
      extraction_source: 'api',
    });
  }

  // NER on transcript (if available)
  if (lesson.transcript) {
    const nerEntities = await extractEntitiesViaNER(lesson.transcript);
    for (const entity of nerEntities) {
      triples.push({
        source_id: `lesson:${lesson.slug}`,
        relation: 'mentions',
        relation_category: 'semantic',
        target_id: `${entity.type}:${entity.id}`,
        target_type: entity.type,
        target_label: entity.label,
        confidence: entity.confidence,
        extraction_source: 'ner',
        context: entity.context,
      });
    }
  }

  return triples;
}
```

### 5.5 Graph Traversal Functions

Query the graph for exploration:

```typescript
/**
 * Find all entities N hops from a starting entity.
 */
async function getNeighbourhood(
  entityId: string,
  maxHops: number = 2,
  maxNeighboursPerHop: number = 100,
): Promise<GraphNeighbourhood> {
  let frontier = new Set([entityId]);
  const visited = new Set<string>();
  const edges: CurriculumTriple[] = [];

  for (let hop = 0; hop < maxHops; hop++) {
    const currentFrontier = [...frontier];
    frontier = new Set();

    for (const nodeId of currentFrontier) {
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      // Get outgoing edges
      const outgoing = await esClient.search({
        index: 'oak_curriculum_graph',
        query: { term: { source_id: nodeId } },
        size: maxNeighboursPerHop,
      });

      // Get incoming edges
      const incoming = await esClient.search({
        index: 'oak_curriculum_graph',
        query: { term: { target_id: nodeId } },
        size: maxNeighboursPerHop,
      });

      for (const hit of [...outgoing.hits.hits, ...incoming.hits.hits]) {
        const triple = hit._source as CurriculumTriple;
        edges.push(triple);

        const neighbourId = triple.source_id === nodeId ? triple.target_id : triple.source_id;
        if (!visited.has(neighbourId)) {
          frontier.add(neighbourId);
        }
      }
    }
  }

  return { rootId: entityId, nodes: [...visited], edges };
}

/**
 * Find paths connecting two entities.
 */
async function findConnections(
  entityA: string,
  entityB: string,
  maxHops: number = 3,
): Promise<GraphPath[]> {
  // Bidirectional BFS from both entities
  const frontierA = await getNeighbourhood(entityA, Math.ceil(maxHops / 2));
  const frontierB = await getNeighbourhood(entityB, Math.ceil(maxHops / 2));

  // Find intersection
  const intersection = frontierA.nodes.filter((n) => frontierB.nodes.has(n));

  if (intersection.length === 0) {
    return []; // No connection within maxHops
  }

  // Reconstruct paths through intersection points
  return reconstructPaths(frontierA, frontierB, intersection);
}
```

---

## 6. Layer 2: RAG Infrastructure

### 6.1 RAG Pipeline Architecture

```
User Query: "How are fractions taught across primary school?"
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. QUERY UNDERSTANDING                                          │
│    • Detect entities: "fractions", "primary school"             │
│    • Map to curriculum concepts: thread:number, phase:primary   │
│    • Identify intent: progression overview                      │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. HYBRID RETRIEVAL                                             │
│    • Semantic: ELSER embedding similarity                       │
│    • Lexical: BM25 on "fractions" + synonyms                    │
│    • Filters: phase=primary, thread contains "number"           │
│    • RRF fusion of multiple retrievers                          │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. CONTEXT ASSEMBLY                                             │
│    • Select top-K documents                                     │
│    • Extract relevant chunks                                    │
│    • Order by year/progression                                  │
│    • Add ontology context (thread definition)                   │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. LLM GENERATION (via Inference API)                           │
│    Prompt:                                                      │
│    "Based on the following Oak curriculum content, explain      │
│     how fractions are taught across primary school.             │
│                                                                 │
│     Context:                                                    │
│     [Year 1] Unit: Introduction to Parts - Lesson: ...          │
│     [Year 2] Unit: Fractions of Shapes - Lesson: ...            │
│     ...                                                         │
│                                                                 │
│     Answer with specific lesson references."                    │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. RESPONSE WITH CITATIONS                                      │
│    "Fractions are introduced in Year 1 through parts and        │
│     wholes [1], developed in Year 2 with shapes [2], ...        │
│                                                                 │
│     Sources:                                                    │
│     [1] Lesson: 'Understanding Parts' (Year 1, Unit: Parts)     │
│     [2] Lesson: 'Fractions of Shapes' (Year 2, Unit: Fractions) │
│     ..."                                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 RAG Implementation

```typescript
interface RagRequest {
  query: string;
  options?: {
    maxDocuments?: number;
    includeOntology?: boolean;
    citationStyle?: 'inline' | 'footnotes';
  };
}

interface RagResponse {
  answer: string;
  citations: Array<{
    id: string;
    type: 'lesson' | 'unit' | 'ontology';
    title: string;
    url: string;
    excerpt: string;
  }>;
  confidence: number;
}

async function askCurriculum(request: RagRequest): Promise<RagResponse> {
  const { query, options = {} } = request;
  const { maxDocuments = 10, includeOntology = true } = options;

  // 1. Hybrid retrieval
  const retrievalResults = await esClient.search({
    index: ['oak_lessons', 'oak_units', 'oak_unit_rollup'],
    size: maxDocuments,
    retriever: {
      rrf: {
        retrievers: [
          {
            standard: {
              query: {
                multi_match: {
                  query,
                  fields: ['title^3', 'description^2', 'rollup_text'],
                },
              },
            },
          },
          {
            knn: {
              field: 'lesson_semantic',
              query_vector_builder: {
                text_embedding: {
                  model_id: '.elser-2-elastic',
                  model_text: query,
                },
              },
            },
          },
        ],
        rank_constant: 60,
        window_size: 100,
      },
    },
  });

  // 2. Optionally add ontology context
  let ontologyContext = '';
  if (includeOntology) {
    const ontologyResults = await esClient.search({
      index: 'oak_ontology',
      query: { match: { description_semantic: query } },
      size: 3,
    });
    ontologyContext = ontologyResults.hits.hits.map((h) => h._source.content_text).join('\n\n');
  }

  // 3. Assemble context
  const context = retrievalResults.hits.hits
    .map((hit, i) => {
      const doc = hit._source;
      return `[${i + 1}] ${doc.title}\n${doc.description || doc.rollup_text}`;
    })
    .join('\n\n');

  // 4. Generate answer via Inference API
  const prompt = buildRagPrompt(query, context, ontologyContext);
  const llmResponse = await esClient.inference.inference({
    inference_id: 'openai-gpt4',
    body: {
      input: prompt,
      task_type: 'completion',
    },
  });

  // 5. Build response with citations
  return {
    answer: llmResponse.completion,
    citations: retrievalResults.hits.hits.map((hit) => ({
      id: hit._id,
      type: hit._index.includes('lesson') ? 'lesson' : 'unit',
      title: hit._source.title,
      url: hit._source.canonical_url,
      excerpt: hit._source.description?.substring(0, 200),
    })),
    confidence: calculateConfidence(retrievalResults),
  };
}
```

### 6.3 RAG Patterns for Curriculum

| Pattern             | Example Query                                    | Retrieval Strategy            | Context Assembly       |
| ------------------- | ------------------------------------------------ | ----------------------------- | ---------------------- |
| **Progression**     | "How is photosynthesis taught across years?"     | Thread filter + year sort     | Chronological ordering |
| **Definition**      | "What is a thread in Oak?"                       | Ontology index primary        | Include examples       |
| **Comparison**      | "Difference between foundation and higher tier?" | KS4 programme factors         | Side-by-side structure |
| **Lesson Planning** | "Lessons about fractions with video"             | Component availability filter | Lesson cards           |
| **Cross-Cutting**   | "What geometry in Year 3 and Year 7?"            | Multi-year filter + thread    | Year-grouped           |

---

## 7. Layer 3: Graph RAG

### 7.1 Graph RAG: The Power Combination

Traditional RAG fails when:

- Answer spans multiple documents
- Implicit connections must be traversed
- "How is X related to Y?" questions

**Graph RAG Solution**: Use graph traversal to build context before LLM generation.

### 7.2 Graph RAG Pipeline

```
User Query: "What connects photosynthesis to respiration?"
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. ENTITY DETECTION                                             │
│    • NER / Concept Detection: "photosynthesis", "respiration"   │
│    • Map to graph entities:                                     │
│      - keyword:photosynthesis                                   │
│      - keyword:respiration                                      │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. GRAPH TRAVERSAL                                              │
│    • Find paths between entities (up to 3 hops)                 │
│    • Result:                                                    │
│      photosynthesis ──mentions── Lesson:photosynthesis-ks3      │
│                                        │                        │
│                                   containedIn                   │
│                                        ▼                        │
│                               Unit:energy-in-living-things      │
│                                        │                        │
│                                  containsLesson                 │
│                                        ▼                        │
│                              Lesson:respiration-ks3             │
│                                        │                        │
│                                   hasKeyword                    │
│                                        ▼                        │
│                                   respiration                   │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. SUBGRAPH SERIALISATION                                       │
│    Convert graph to textual context:                            │
│    "The concept 'photosynthesis' is taught in the lesson        │
│     'Photosynthesis' which is part of the unit 'Energy in       │
│     Living Things'. This same unit contains the lesson          │
│     'Respiration' which introduces the concept 'respiration'.   │
│     Both lessons are connected through the theme of energy      │
│     transfer in living organisms."                              │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. DOCUMENT ENRICHMENT                                          │
│    Fetch full content for entities in subgraph:                 │
│    • Lesson:photosynthesis-ks3 → full description, keywords     │
│    • Lesson:respiration-ks3 → full description, keywords        │
│    • Unit:energy-in-living-things → unit overview               │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. LLM SYNTHESIS                                                │
│    Prompt with graph context + document content:                │
│    "Based on the following curriculum structure and content,    │
│     explain the connection between photosynthesis and           │
│     respiration as taught in Oak's curriculum..."               │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. RESPONSE WITH GRAPH VISUALISATION                            │
│    Answer: "Photosynthesis and respiration are connected        │
│    through the concept of energy transfer in living things.     │
│    In KS3 Science, students learn that photosynthesis           │
│    produces glucose [1], which is then used in respiration      │
│    to release energy [2]. Both concepts are taught within       │
│    the same unit to emphasise this relationship [3]."           │
│                                                                 │
│    [Graph visualisation showing the connection path]            │
│                                                                 │
│    Sources:                                                     │
│    [1] Lesson: Photosynthesis (KS3 Science)                     │
│    [2] Lesson: Respiration (KS3 Science)                        │
│    [3] Unit: Energy in Living Things                            │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Graph RAG Implementation

```typescript
interface GraphRagRequest {
  query: string;
  options?: {
    maxHops?: number;
    includeDocumentContent?: boolean;
    visualiseGraph?: boolean;
  };
}

interface GraphRagResponse {
  answer: string;
  subgraph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  citations: Citation[];
  visualisation?: string; // SVG or Mermaid diagram
}

async function findConnections(request: GraphRagRequest): Promise<GraphRagResponse> {
  const { query, options = {} } = request;
  const { maxHops = 3, includeDocumentContent = true, visualiseGraph = true } = options;

  // 1. Detect entities in query
  const entities = await detectEntitiesInQuery(query);

  if (entities.length < 2) {
    // Fall back to standard RAG if not a connection query
    return fallbackToStandardRag(query);
  }

  // 2. Find paths between entities
  const paths = await findPathsBetweenEntities(entities[0].id, entities[1].id, maxHops);

  if (paths.length === 0) {
    return {
      answer: `No direct connection found between ${entities[0].label} and ${entities[1].label} within ${maxHops} hops.`,
      subgraph: { nodes: [], edges: [] },
      citations: [],
    };
  }

  // 3. Build subgraph from paths
  const subgraph = buildSubgraphFromPaths(paths);

  // 4. Serialise subgraph to text
  const graphContext = serialiseSubgraphToText(subgraph);

  // 5. Optionally fetch full document content
  let documentContext = '';
  if (includeDocumentContent) {
    const nodeIds = subgraph.nodes.map((n) => n.id);
    documentContext = await fetchDocumentContentForNodes(nodeIds);
  }

  // 6. Generate answer with LLM
  const prompt = buildGraphRagPrompt(query, graphContext, documentContext);
  const llmResponse = await generateWithLLM(prompt);

  // 7. Build visualisation
  let visualisation: string | undefined;
  if (visualiseGraph) {
    visualisation = generateMermaidDiagram(subgraph);
  }

  return {
    answer: llmResponse,
    subgraph,
    citations: extractCitationsFromSubgraph(subgraph),
    visualisation,
  };
}

function serialiseSubgraphToText(subgraph: GraphSubgraph): string {
  const lines: string[] = [];

  for (const edge of subgraph.edges) {
    lines.push(
      `${edge.source_label} (${edge.source_type}) ` +
        `--${edge.relation}--> ` +
        `${edge.target_label} (${edge.target_type})`,
    );
  }

  return `Curriculum Knowledge Graph (relevant subgraph):
${lines.join('\n')}`;
}

function generateMermaidDiagram(subgraph: GraphSubgraph): string {
  const lines = ['graph LR'];

  const nodeMap = new Map<string, string>();
  subgraph.nodes.forEach((node, i) => {
    const safeId = `N${i}`;
    nodeMap.set(node.id, safeId);
    lines.push(`    ${safeId}["${node.label}"]`);
  });

  for (const edge of subgraph.edges) {
    const sourceId = nodeMap.get(edge.source_id);
    const targetId = nodeMap.get(edge.target_id);
    lines.push(`    ${sourceId} -->|${edge.relation}| ${targetId}`);
  }

  return lines.join('\n');
}
```

---

## 8. MCP Tool Integration

### 8.1 Enhanced Existing Tools

#### `semantic-search` (Enhanced)

Add graph-based reranking and entity highlighting:

```typescript
interface SemanticSearchEnhanced {
  // Existing fields
  q: string;
  scope?: SearchScope;
  filters?: SearchFilters;

  // NEW: Graph enhancement
  graphEnhancement?: {
    enabled: boolean;
    reranking: boolean; // Boost results connected to query entities
    entityHighlight: boolean; // Highlight detected entities in results
    relatedConcepts: boolean; // Suggest related concepts from graph
  };
}
```

#### `search` (Mode Parameter)

Add modes for different search strategies:

```typescript
interface SearchRequest {
  q: string;
  mode?: 'basic' | 'semantic' | 'graph-enhanced' | 'rag';
}
```

### 8.2 New MCP Tools

#### `explore-graph` (New)

Navigate the curriculum knowledge graph:

```typescript
/**
 * Explore the curriculum knowledge graph from a starting concept.
 *
 * @example
 * explore-graph({ entity: "keyword:photosynthesis", depth: 2 })
 * → Returns subgraph showing lessons, units, related keywords
 */
interface ExploreGraphTool {
  name: 'explore-graph';
  description: `Navigate the curriculum knowledge graph to discover relationships.
    
Use cases:
- Explore what a concept connects to
- Find related lessons and units
- Understand curriculum structure visually

Parameters:
- entity: Starting point (e.g., "keyword:fractions", "lesson:adding-fractions")
- depth: How many hops to explore (1-3, default 2)
- filter: Optional filter by entity type or relationship`;

  inputSchema: {
    entity: string;
    depth?: number;
    filter?: {
      entityTypes?: string[];
      relationTypes?: string[];
    };
  };
}
```

#### `ask-curriculum` (New RAG Tool)

Ask questions answered by curriculum content:

```typescript
/**
 * Ask questions about Oak curriculum content with AI-generated answers
 * grounded in actual lessons and units.
 *
 * @example
 * ask-curriculum({ question: "How is photosynthesis taught across years?" })
 * → Returns synthesised answer with citations to specific lessons
 */
interface AskCurriculumTool {
  name: 'ask-curriculum';
  description: `Ask questions about curriculum content and receive AI-generated
answers grounded in actual Oak lessons and units.

The tool:
1. Searches relevant curriculum content (hybrid semantic + lexical)
2. Assembles context from top results
3. Generates answer using LLM
4. Provides citations to source materials

Use when:
- You need synthesised information across multiple lessons
- You want to understand curriculum progression
- You need to explain curriculum concepts with sources

Answers include citations to specific lessons and units that can be
fetched with the 'fetch' tool for more detail.`;

  inputSchema: {
    question: string;
    options?: {
      maxSources?: number;
      includeOntology?: boolean;
      citationStyle?: 'inline' | 'footnotes';
    };
  };
}
```

#### `find-connections` (New Graph RAG Tool)

Find and explain how curriculum concepts are connected:

```typescript
/**
 * Find how two curriculum concepts are connected through the knowledge graph.
 *
 * @example
 * find-connections({ conceptA: "fractions", conceptB: "decimals" })
 * → Returns explanation of how fractions and decimals connect in curriculum
 */
interface FindConnectionsTool {
  name: 'find-connections';
  description: `Discover how curriculum concepts are connected through
the knowledge graph and provide AI-generated explanations.

This tool:
1. Detects entities in the query
2. Traverses the knowledge graph to find paths
3. Fetches relevant document content
4. Generates explanation using LLM
5. Optionally provides graph visualisation

Use when:
- "How is X related to Y?"
- "What connects these two topics?"
- Understanding cross-cutting curriculum themes`;

  inputSchema: {
    conceptA: string;
    conceptB: string;
    options?: {
      maxHops?: number;
      visualise?: boolean;
      includeFullContent?: boolean;
    };
  };
}
```

---

## 9. Implementation Roadmap

### Phase 0: Resolve Blocking Issues (IMMEDIATE)

Before any graph/RAG work, fix the foundational issues:

1. **Unify field definitions** — Single source for Zod schemas AND ES mappings
2. **Replace console with logger** — Proper logging infrastructure
3. **Ingest real data** — Validate search with actual curriculum content

### Phase 1: Instance-Level Knowledge Graph (After Phase 0)

| Task | Description                               | Effort |
| ---- | ----------------------------------------- | ------ |
| 1.1  | Design `oak_curriculum_graph` schema      | S      |
| 1.2  | Design `oak_entities` schema              | S      |
| 1.3  | Implement triple extraction from API data | M      |
| 1.4  | Add extraction to ingestion pipeline      | M      |
| 1.5  | Implement graph traversal functions       | M      |
| 1.6  | Add `explore-graph` MCP tool              | M      |
| 1.7  | Validate with real curriculum data        | M      |

**Deliverable**: Queryable instance-level knowledge graph populated from curriculum data.

### Phase 2: Ontology Index for RAG Grounding

| Task | Description                                     | Effort |
| ---- | ----------------------------------------------- | ------ |
| 2.1  | Design `oak_ontology` schema                    | S      |
| 2.2  | Generate ontology documents from `ontologyData` | S      |
| 2.3  | Index ontology with semantic embeddings         | S      |
| 2.4  | Test ontology retrieval for domain questions    | S      |

**Deliverable**: Searchable ontology index for RAG grounding.

### Phase 3: RAG Infrastructure

| Task | Description                                             | Effort |
| ---- | ------------------------------------------------------- | ------ |
| 3.1  | Configure OpenAI inference endpoint                     | S      |
| 3.2  | Implement RAG pipeline (retrieve → assemble → generate) | M      |
| 3.3  | Add citation extraction and formatting                  | M      |
| 3.4  | Add `ask-curriculum` MCP tool                           | M      |
| 3.5  | Test with curriculum questions                          | M      |

**Deliverable**: Working RAG for curriculum question answering.

### Phase 4: Graph RAG

| Task | Description                             | Effort |
| ---- | --------------------------------------- | ------ |
| 4.1  | Implement entity detection in queries   | M      |
| 4.2  | Implement path finding between entities | M      |
| 4.3  | Implement subgraph serialisation        | S      |
| 4.4  | Integrate with RAG pipeline             | M      |
| 4.5  | Add Mermaid visualisation generation    | S      |
| 4.6  | Add `find-connections` MCP tool         | M      |
| 4.7  | Test with connection queries            | M      |

**Deliverable**: Graph RAG for multi-hop curriculum reasoning.

### Phase 5: Enhanced Search Integration

| Task | Description                               | Effort |
| ---- | ----------------------------------------- | ------ |
| 5.1  | Add graph reranking to semantic search    | M      |
| 5.2  | Add entity highlighting to search results | S      |
| 5.3  | Add related concepts suggestions          | S      |
| 5.4  | Add mode parameter to search tool         | S      |
| 5.5  | Update search UI for graph features       | M      |

**Deliverable**: Graph-enhanced semantic search with multiple modes.

---

## 10. Considerations and Trade-offs

### 10.1 Elasticsearch vs Dedicated Graph DB

**Why stay in Elasticsearch?**

- Single system to maintain
- Graph API for co-occurrence is sufficient for most needs
- Triple storage with query DSL handles structured traversal
- Avoids sync complexity between ES and Neo4j

**When to consider Neo4j?**

- If we need complex pattern matching (Cypher)
- If we need deep algorithms (PageRank, community detection)
- If graph becomes very large (millions of nodes)

**Recommendation**: Start with ES-only. Add Neo4j only if specific algorithmic needs arise.

### 10.2 NER: Built-in vs External

**Options**:

1. **Elastic's ML NER** — Deploy model via Eland, run in ingest pipeline
2. **External NER API** — Call OpenAI/HF for extraction during ingestion
3. **Rule-based** — Regex patterns for curriculum-specific terms

**Recommendation**:

- Start with rule-based for curriculum-specific terms (key stages, subjects)
- Add ML NER for transcript analysis (historical figures, scientific concepts)
- Use external API (via Inference API) for complex extraction

### 10.3 LLM Provider

**Options**:

1. **OpenAI GPT-4** — Best quality, higher cost
2. **Hugging Face models** — Open source, self-hosted option
3. **Elastic's built-in models** — Integrated but limited

**Recommendation**:

- Start with OpenAI GPT-4 via Inference API
- Add cost monitoring from day one
- Consider HF for cost optimisation later

### 10.4 Graph Size and Performance

**Concerns**:

- Large graphs (millions of triples) may slow traversal
- Multi-hop queries can explode combinatorially

**Mitigations**:

- Limit hop depth (max 3)
- Limit neighbours per hop (max 100)
- Cache common subgraphs
- Pre-compute centrality metrics for popular entities

---

## 11. Success Metrics

| Metric                   | Baseline      | Target                          | Measurement        |
| ------------------------ | ------------- | ------------------------------- | ------------------ |
| **Search Relevance**     | BM25 baseline | +20% MRR with graph enhancement | Labelled query set |
| **RAG Answer Quality**   | N/A           | 80% factual accuracy            | Human evaluation   |
| **Graph Coverage**       | 0 triples     | 10K+ triples from curriculum    | Index stats        |
| **Connection Discovery** | Manual        | <2s response for 3-hop queries  | API latency        |
| **User Satisfaction**    | N/A           | Positive feedback on new tools  | User interviews    |

---

## 12. Dependencies on Current Work

This vision depends on resolving current blocking issues:

1. **Zod/ES Mapping Alignment** — Must be fixed before new indexes can be reliably created
2. **Real Data Ingestion** — Graph extraction requires actual curriculum data
3. **Logger Standardisation** — Proper observability for debugging graph/RAG pipelines

**Recommended Sequence**:

1. Fix blocking issues (Phase 0) ← **CURRENT PRIORITY**
2. Ingest real curriculum data
3. Add `oak_ontology` index (quick win for RAG grounding)
4. Add `oak_curriculum_graph` index
5. Implement RAG pipeline
6. Implement Graph RAG

---

## 13. References

### Elasticsearch Documentation

- [Graph Explore API](https://www.elastic.co/guide/en/elasticsearch/reference/current/graph-explore-api.html)
- [Inference API](https://www.elastic.co/docs/solutions/search/using-openai-compatible-models)
- [Semantic Text Field](https://www.elastic.co/search-labs/blog/hugging-face-elasticsearch-open-inference-api)
- [ELSER](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser)
- [RRF](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html)
- [Elasticsearch MCP Server](https://github.com/elastic/mcp-server-elasticsearch)

### Research Documents (This Repo)

- `../methods/ai-capabilities-elastic.md` — Elastic AI capabilities (ELSER, inference, rerankers)
- `../methods/graph-elastic.md` — ES-only graph-adjacent features for near-term improvements
- `../methods/graph-elastic-neo4j.md` — Later-phase Neo4j integration and graph export back into ES
- `../methods/conversational-rag.md` — RAG patterns and grounding checks
- `../features/elastic-and-neo4j-novel-subjects.md` — Derived subjects and Elastic + Neo4j future-state
- `expanded-architecture-analysis.md` — Architecture proposals for ontology/graph indexing
- `semantic-search-plans-review.md` — Current system status and remaining gaps

### Elastic Blog Posts

- [Graph RAG: Navigating graphs for RAG using Elasticsearch](https://www.elastic.co/search-labs/blog/rag-graph-traversal)
- [Playground for RAG](https://www.elastic.co/search-labs/blog/rag-playground-introduction)
- [Grounding RAG](https://www.elastic.co/search-labs/blog/grounding-rag)

---

## 14. Conclusion

The combination of **Instance-Level Knowledge Graph**, **RAG**, and **Graph RAG** in Elasticsearch represents a significant evolution of Oak's search capabilities:

1. **Knowledge Graph** moves us from schema-level understanding to actual curriculum relationships — enabling discovery of connections that exist in the data but aren't explicit in our static graph.

2. **RAG** enables curriculum question answering with grounded, cited responses — reducing hallucination and providing authoritative answers backed by Oak content.

3. **Graph RAG** combines both for multi-hop reasoning — answering "how are X and Y connected?" questions that span multiple documents and require understanding curriculum structure.

All three layers integrate with and enhance our existing MCP tools, providing teachers and AI agents with powerful curriculum exploration capabilities that go far beyond keyword search.

The implementation path is clear: resolve current blocking issues, ingest real data, then incrementally add graph and RAG capabilities while maintaining the schema-first principles and quality gates that ensure reliability.
