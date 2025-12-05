# Entity Discovery Pipeline

_Date: 2025-12-05_
_Status: PLANNING_

## Overview

Entity discovery for the curriculum knowledge graph is a **multi-step pipeline** because entities come from different sources at different times:

1. **Static Entities** — Defined in `ontology-data.ts` and `knowledge-graph-data.ts`, available at type-gen time
2. **Explicit Entities** — Extracted from API data structure during curriculum ingestion
3. **Discovered Entities** — Extracted from content (transcripts, descriptions) after data is indexed

This document describes the pipeline architecture and implementation approach.

---

## Entity Sources and Timing

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           ENTITY DISCOVERY PIPELINE                             │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐ │
│  │   STATIC ENTITIES   │    │  EXPLICIT ENTITIES  │    │ DISCOVERED ENTITIES │ │
│  │                     │    │                     │    │                     │ │
│  │ Source:             │    │ Source:             │    │ Source:             │ │
│  │ • ontology-data.ts  │    │ • Curriculum API    │    │ • Transcripts       │ │
│  │ • knowledge-graph-  │    │ • Lesson metadata   │    │ • Descriptions      │ │
│  │   data.ts           │    │ • Unit structure    │    │ • Quiz questions    │ │
│  │                     │    │                     │    │                     │ │
│  │ When:               │    │ When:               │    │ When:               │ │
│  │ pnpm type-gen       │    │ During ingestion    │    │ Post-ingestion      │ │
│  │                     │    │                     │    │ (batch job)         │ │
│  │ Examples:           │    │ Examples:           │    │                     │ │
│  │ • Concept types     │    │ • lesson:slug       │    │ Examples:           │ │
│  │ • Key stages        │    │ • unit:slug         │    │ • Historical figures│ │
│  │ • Phases            │    │ • keyword:term      │    │ • Scientific terms  │ │
│  │ • Subjects          │    │ • thread:slug       │    │ • Co-occurring terms│ │
│  │ • Schema edges      │    │ • misconception:id  │    │                     │ │
│  │                     │    │                     │    │ Confidence:         │ │
│  │ Confidence: 1.0     │    │ Confidence: 1.0     │    │ 0.5 - 0.95          │ │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────────┘ │
│           │                          │                          │              │
│           ▼                          ▼                          ▼              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         oak_entities INDEX                               │  │
│  │                         oak_curriculum_graph INDEX                       │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Stage 1: Static Entities (Type-Gen Time)

### Source Data

- **`ontology-data.ts`**: Key stages, phases, subjects, threads, workflows, synonyms
- **`knowledge-graph-data.ts`**: ~28 concept types, ~45 schema-level edges

### Output

Documents for `oak_ontology` index — schema-level domain knowledge for RAG grounding.

### When

Run during `pnpm type-gen` as part of SDK type generation.

### Implementation

```typescript
// packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-ontology-docs.ts

import { ontologyData } from '../../../src/mcp/ontology-data.js';
import { conceptGraph } from '../../../src/mcp/knowledge-graph-data.js';

export function generateStaticOntologyDocuments(): OntologyDoc[] {
  const docs: OntologyDoc[] = [];

  // Concepts from knowledge graph
  for (const concept of conceptGraph.concepts) {
    docs.push({
      doc_id: `concept:${concept.id}`,
      doc_type: 'concept',
      title: concept.label,
      description: concept.brief,
      concept_id: concept.id,
      concept_category: concept.category,
      source: 'knowledge-graph-data',
      content_text: buildConceptContent(concept),
    });
  }

  // Edges from knowledge graph
  for (const edge of conceptGraph.edges) {
    docs.push({
      doc_id: `edge:${edge.from}-${edge.rel}-${edge.to}`,
      doc_type: 'edge',
      from_concept: edge.from,
      to_concept: edge.to,
      relation: edge.rel,
      inferred: edge.inferred ?? false,
      source: 'knowledge-graph-data',
    });
  }

  // Key stages from ontology
  for (const ks of ontologyData.curriculumStructure.keyStages) {
    docs.push({
      doc_id: `keystage:${ks.slug}`,
      doc_type: 'keystage',
      title: ks.name,
      description: ks.description,
      content_text: buildKeyStageContent(ks),
      source: 'ontology-data',
    });
  }

  // Phases, subjects, threads, workflows...
  // Similar patterns

  return docs;
}
```

### Entities Produced

| Entity Type | Count | Source                   |
| ----------- | ----- | ------------------------ |
| `concept`   | ~28   | knowledge-graph-data     |
| `edge`      | ~45   | knowledge-graph-data     |
| `keystage`  | 4     | ontology-data            |
| `phase`     | 2     | ontology-data            |
| `subject`   | ~13   | ontology-data            |
| `thread`    | ~3    | ontology-data (examples) |
| `workflow`  | ~5    | ontology-data            |

---

## Stage 2: Explicit Entities (Ingestion Time)

### Source Data

Curriculum API responses during `pnpm es:ingest-live`:

- Lesson metadata (keywords, misconceptions, learning objectives)
- Unit structure (units, sequences, threads)
- Hierarchical relationships (lesson→unit→sequence→subject)

### When

During curriculum data ingestion — synchronous with document indexing.

### Implementation

```typescript
// apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/ingestion/extract-triples.ts

export async function extractExplicitTriples(lesson: LessonData): Promise<CurriculumTriple[]> {
  const triples: CurriculumTriple[] = [];
  const timestamp = new Date().toISOString();

  // 1. Hierarchical: lesson → unit
  triples.push({
    triple_id: `${lesson.slug}|containedIn|${lesson.unitSlug}`,
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
    created_at: timestamp,
  });

  // 2. Semantic: lesson → keywords
  for (const keyword of lesson.keywords ?? []) {
    const keywordSlug = slugify(keyword);
    triples.push({
      triple_id: `${lesson.slug}|hasKeyword|${keywordSlug}`,
      source_id: `lesson:${lesson.slug}`,
      source_type: 'lesson',
      source_label: lesson.title,
      relation: 'hasKeyword',
      relation_category: 'semantic',
      target_id: `keyword:${keywordSlug}`,
      target_type: 'keyword',
      target_label: keyword,
      confidence: 1.0,
      extraction_source: 'api',
      created_at: timestamp,
    });
  }

  // 3. Pedagogical: lesson → misconceptions
  for (const misconception of lesson.misconceptions ?? []) {
    triples.push({
      triple_id: `${lesson.slug}|addresses|${slugify(misconception)}`,
      source_id: `lesson:${lesson.slug}`,
      source_type: 'lesson',
      source_label: lesson.title,
      relation: 'addresses',
      relation_category: 'pedagogical',
      target_id: `misconception:${slugify(misconception)}`,
      target_type: 'misconception',
      target_label: misconception,
      confidence: 1.0,
      extraction_source: 'api',
      created_at: timestamp,
    });
  }

  // 4. Taxonomic: unit → threads (from unit data)
  // ... similar pattern

  return triples;
}

// Extract entities from triples
export function extractEntitiesFromTriples(triples: CurriculumTriple[]): CurriculumEntity[] {
  const entityMap = new Map<string, CurriculumEntity>();

  for (const triple of triples) {
    // Source entity
    if (!entityMap.has(triple.source_id)) {
      entityMap.set(triple.source_id, {
        entity_id: triple.source_id,
        entity_type: triple.source_type,
        canonical_label: triple.source_label,
        aliases: [],
        source: 'api',
        created_at: triple.created_at,
      });
    }

    // Target entity
    if (!entityMap.has(triple.target_id)) {
      entityMap.set(triple.target_id, {
        entity_id: triple.target_id,
        entity_type: triple.target_type,
        canonical_label: triple.target_label,
        aliases: [],
        source: 'api',
        created_at: triple.created_at,
      });
    }
  }

  return Array.from(entityMap.values());
}
```

### Triples Produced

| Relation         | Category     | Example                                     |
| ---------------- | ------------ | ------------------------------------------- |
| `containedIn`    | hierarchical | lesson:fractions-y4 → unit:fractions-year-4 |
| `hasKeyword`     | semantic     | lesson:fractions-y4 → keyword:denominator   |
| `addresses`      | pedagogical  | lesson:fractions-y4 → misconception:...     |
| `hasKeyLearning` | pedagogical  | lesson:fractions-y4 → learning:...          |
| `taggedWith`     | taxonomic    | unit:fractions-y4 → thread:number           |
| `belongsTo`      | hierarchical | unit:fractions-y4 → sequence:maths-primary  |

### Entities Produced

| Entity Type     | Source          | Confidence |
| --------------- | --------------- | ---------- |
| `lesson`        | API data        | 1.0        |
| `unit`          | API data        | 1.0        |
| `sequence`      | API data        | 1.0        |
| `keyword`       | Lesson metadata | 1.0        |
| `misconception` | Lesson metadata | 1.0        |
| `thread`        | Unit metadata   | 1.0        |

---

## Stage 3: Discovered Entities (Post-Ingestion)

### Why Post-Ingestion?

Some entities **cannot be extracted until content is indexed**:

1. **NER on transcripts** — Requires transcript text, which may be fetched lazily
2. **Co-occurrence analysis** — Requires aggregations over indexed documents
3. **Disambiguation** — Requires seeing all contexts where a term appears

### Source Data

- Indexed lesson transcripts (`oak_lesson_transcripts`)
- Indexed lesson descriptions
- Quiz questions and answers
- Teacher tips and learning objectives

### When

Batch job run periodically or triggered after ingestion:

```bash
pnpm es:discover-entities --since "2025-12-01"
```

### Sub-Pipeline 3a: NER Extraction

Named Entity Recognition to extract people, places, scientific concepts.

```typescript
// apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/discovery/ner-extraction.ts

interface NEREntity {
  text: string;
  type: 'person' | 'place' | 'scientific_term' | 'historical_event' | 'concept';
  confidence: number;
  context: string; // Surrounding sentence
  source_doc_id: string;
}

export async function runNERExtraction(options: {
  since?: Date;
  subjects?: string[];
  batchSize?: number;
}): Promise<void> {
  const { since, subjects, batchSize = 100 } = options;

  // 1. Query documents needing NER
  const scrollResponse = await esClient.search({
    index: 'oak_lesson_transcripts',
    scroll: '5m',
    size: batchSize,
    query: {
      bool: {
        must: [{ exists: { field: 'transcript_text' } }],
        must_not: [{ term: { ner_processed: true } }],
        filter: since ? [{ range: { indexed_at: { gte: since.toISOString() } } }] : [],
      },
    },
  });

  // 2. Process in batches
  for await (const batch of scrollBatches(scrollResponse)) {
    const entities: NEREntity[] = [];

    for (const doc of batch) {
      // Call NER model (via ES Inference API or external)
      const extracted = await extractEntitiesViaNER(doc.transcript_text);
      entities.push(
        ...extracted.map((e) => ({
          ...e,
          source_doc_id: doc._id,
        })),
      );
    }

    // 3. Convert to triples and entities
    const triples = nerEntitiesToTriples(entities);
    const canonicalEntities = disambiguateEntities(entities);

    // 4. Index to graph
    await bulkIndexTriples(triples);
    await bulkUpsertEntities(canonicalEntities);

    // 5. Mark documents as processed
    await markNERProcessed(batch.map((d) => d._id));
  }
}
```

#### NER Model Options

| Option                | Pros                          | Cons                      |
| --------------------- | ----------------------------- | ------------------------- |
| ES Inference API + HF | Integrated, no external calls | Limited model selection   |
| OpenAI via Inference  | High quality                  | Cost per token            |
| Rule-based patterns   | Fast, domain-specific         | Limited to known patterns |
| Hybrid                | Best of both                  | More complex              |

**Recommendation**: Start with rule-based for curriculum-specific terms (subjects, key stages), add ML NER for transcript analysis.

### Sub-Pipeline 3b: Co-occurrence Mining

Use ES Graph API to discover implicit relationships.

```typescript
// apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/discovery/cooccurrence-mining.ts

export async function mineCooccurrences(options: {
  field: string; // e.g., 'keywords'
  minDocCount?: number; // Minimum document frequency
  minSignificance?: number; // Minimum significance score
}): Promise<void> {
  const { field, minDocCount = 5, minSignificance = 0.5 } = options;

  // 1. Get all unique values in field
  const termsAgg = await esClient.search({
    index: 'oak_lessons',
    size: 0,
    aggs: {
      unique_terms: {
        terms: { field, size: 10000 },
      },
    },
  });

  const terms = termsAgg.aggregations.unique_terms.buckets;

  // 2. For each term, find co-occurring terms
  for (const term of terms) {
    const graphResponse = await esClient.graph.explore({
      index: 'oak_lessons',
      query: { term: { [field]: term.key } },
      vertices: [{ field, min_doc_count: minDocCount }],
      connections: {
        query: { match_all: {} },
      },
    });

    // 3. Create co-occurrence edges
    for (const connection of graphResponse.connections) {
      if (connection.weight < minSignificance) continue;

      const triple: CurriculumTriple = {
        triple_id: `${term.key}|cooccurs|${connection.target}`,
        source_id: `keyword:${slugify(term.key)}`,
        source_type: 'keyword',
        source_label: term.key,
        relation: 'cooccurs',
        relation_category: 'semantic',
        target_id: `keyword:${slugify(connection.target)}`,
        target_type: 'keyword',
        target_label: connection.target,
        confidence: connection.weight,
        extraction_source: 'cooccurrence',
        created_at: new Date().toISOString(),
      };

      await indexTriple(triple);
    }
  }
}
```

### Sub-Pipeline 3c: Entity Disambiguation

Merge duplicate entities and establish canonical forms.

```typescript
// apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/discovery/disambiguation.ts

interface DisambiguationResult {
  canonical_id: string;
  merged_ids: string[];
  confidence: number;
}

export async function runDisambiguation(): Promise<void> {
  // 1. Find potential duplicates using semantic similarity
  const candidates = await findDuplicateCandidates();

  // 2. Group by similarity clusters
  const clusters = clusterBySimilarity(candidates, threshold: 0.9);

  // 3. For each cluster, choose canonical form
  for (const cluster of clusters) {
    const canonical = selectCanonicalEntity(cluster);
    const mergedIds = cluster.filter(e => e.entity_id !== canonical.entity_id);

    // 4. Update entity with aliases
    await esClient.update({
      index: 'oak_entities',
      id: canonical.entity_id,
      body: {
        doc: {
          aliases: [
            ...canonical.aliases,
            ...mergedIds.map(e => e.canonical_label),
          ],
          updated_at: new Date().toISOString(),
        },
      },
    });

    // 5. Update triples to point to canonical entity
    await rewriteTriplesToCanonical(mergedIds, canonical.entity_id);

    // 6. Delete merged entities
    await bulkDeleteEntities(mergedIds.map(e => e.entity_id));
  }
}
```

---

## Pipeline Orchestration

### CLI Commands

```bash
# Full discovery pipeline
pnpm es:discover-entities

# Individual stages
pnpm es:discover-entities --stage ner
pnpm es:discover-entities --stage cooccurrence
pnpm es:discover-entities --stage disambiguation

# Incremental (since last run)
pnpm es:discover-entities --incremental

# Specific subjects
pnpm es:discover-entities --subjects maths,science
```

### Scheduling

For production, run discovery as a scheduled job:

```typescript
// Suggested cron schedule
// Run NER nightly at 2am
'0 2 * * *': 'es:discover-entities --stage ner --incremental'

// Run co-occurrence weekly on Sunday
'0 3 * * 0': 'es:discover-entities --stage cooccurrence'

// Run disambiguation after each full ingestion
// (triggered manually or via webhook)
```

---

## Graph Metrics Computation

After entity discovery, compute graph metrics for ranking and exploration.

```typescript
// apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/discovery/compute-metrics.ts

export async function computeGraphMetrics(): Promise<void> {
  // 1. Compute in-degree for each entity
  const inDegreeAgg = await esClient.search({
    index: 'oak_curriculum_graph',
    size: 0,
    aggs: {
      by_target: {
        terms: { field: 'target_id', size: 100000 },
      },
    },
  });

  // 2. Compute out-degree for each entity
  const outDegreeAgg = await esClient.search({
    index: 'oak_curriculum_graph',
    size: 0,
    aggs: {
      by_source: {
        terms: { field: 'source_id', size: 100000 },
      },
    },
  });

  // 3. Update entities with metrics
  const bulkOps = [];
  for (const bucket of inDegreeAgg.aggregations.by_target.buckets) {
    bulkOps.push(
      { update: { _index: 'oak_entities', _id: bucket.key } },
      { doc: { in_degree: bucket.doc_count } },
    );
  }
  for (const bucket of outDegreeAgg.aggregations.by_source.buckets) {
    bulkOps.push(
      { update: { _index: 'oak_entities', _id: bucket.key } },
      { doc: { out_degree: bucket.doc_count } },
    );
  }

  await esClient.bulk({ body: bulkOps });

  // 4. Compute centrality (simplified PageRank)
  // For production, consider using graph analytics library
  await computeCentralityMetrics();
}
```

---

## Quality Metrics

### Entity Coverage

| Metric                   | Target | Measurement              |
| ------------------------ | ------ | ------------------------ |
| Explicit entity coverage | 100%   | All API entities indexed |
| NER entity coverage      | 80%+   | Sample transcript review |
| Disambiguation accuracy  | 95%+   | Manual audit of merges   |
| Triple count             | 10K+   | Index stats              |

### Performance

| Metric               | Target     | Measurement        |
| -------------------- | ---------- | ------------------ |
| Ingestion extraction | <100ms/doc | Timing logs        |
| NER batch processing | <1min/100  | Batch job duration |
| Co-occurrence mining | <10min     | Full job duration  |
| Graph query latency  | <500ms     | API response times |

---

## Dependencies

### Phase 1.5 (Must Complete First)

- [ ] Fix Zod/ES mapping alignment
- [ ] Replace console with logger
- [ ] Ingest real curriculum data

### Phase 4 (Static Ontology)

- [ ] Implement `generateStaticOntologyDocuments()`
- [ ] Create `oak_ontology` index
- [ ] Index static documents

### Phase 5 (This Pipeline)

- [ ] Implement explicit extraction during ingestion
- [ ] Create `oak_curriculum_graph` and `oak_entities` indexes
- [ ] Implement NER extraction pipeline
- [ ] Implement co-occurrence mining
- [ ] Implement disambiguation
- [ ] Implement graph metrics computation
- [ ] Add CLI commands for discovery stages

---

## References

- [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md)
- [Search Generator Spec - Entity Schemas](./search-generator-spec.md#oak_curriculum_graph-triple-schema)
- [ES Graph API](https://www.elastic.co/guide/en/elasticsearch/reference/current/graph-explore-api.html)
- [ES Inference API](https://www.elastic.co/docs/solutions/search/using-openai-compatible-models)
