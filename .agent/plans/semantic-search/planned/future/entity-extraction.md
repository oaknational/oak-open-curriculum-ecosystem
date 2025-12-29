# Entity Extraction & Graph

**Status**: 📋 Planned (Post-SDK)  
**Parent**: [README.md](../../README.md) | [roadmap.md](../../roadmap.md) (Future work)  
**Priority**: Future  
**Dependencies**: Core search complete, MCP graph tools

---

## Overview

This phase adds intelligent entity extraction and relationship discovery:

1. **NER Models** — Extract curriculum entities from transcripts
2. **Graph API Discovery** — Find co-occurring concepts
3. **Enrich Processor** — Join reference data at ingest time

---

## Entity Types

| Type | Examples | Use Case |
|------|----------|----------|
| `CONCEPT` | "quadratic equation", "photosynthesis" | Concept-based search |
| `TOPIC` | "algebra", "cell biology" | Topic clustering |
| `SKILL` | "solving", "analysing", "comparing" | Skill-based filtering |
| `NOTATION` | "x²", "∑", "≤" | Mathematical notation search |
| `TERM` | "coefficient", "mitochondria" | Vocabulary search |

---

## Implementation Approach

### NER Inference

```typescript
// Inference endpoint configuration
const nerEndpoint = {
  inference_id: 'curriculum-ner',
  model_id: 'dslim/bert-base-NER',  // Or fine-tuned curriculum model
  task_type: 'ner',
};
```

### Co-occurrence Graph

```typescript
const coOccurrence = await esClient.search({
  index: 'oak_lessons',
  aggs: {
    concept_pairs: {
      significant_terms: {
        field: 'extracted_entities.text.keyword',
        min_doc_count: 3,
      },
    },
  },
});
```

### Relationship Types

| Relationship | Example |
|--------------|---------|
| `CO_OCCURS_WITH` | "algebra" co-occurs with "equations" |
| `PREREQUISITE_OF` | "linear equations" prerequisite of "quadratics" |
| `PART_OF` | "SOHCAHTOA" part of "trigonometry" |

---

## Implementation Tasks

### Phase 9a: NER Setup

| Task | Description | Test Type |
|------|-------------|-----------|
| NER inference endpoint | Deploy model to ES inference API | Integration |
| Entity extraction logic | Extract entities from transcript text | Unit |
| Confidence filtering | Filter by threshold (>0.7) | Unit |
| Document enrichment | Add entities to lesson documents | Integration |
| Re-index Maths KS4 | Apply NER to existing lessons | E2E |

### Phase 9b: Graph Discovery

| Task | Description | Test Type |
|------|-------------|-----------|
| Co-occurrence aggregation | Find frequently co-occurring concepts | Integration |
| Relationship extraction | Identify concept relationships | Unit |
| Graph data structure | Store relationships for querying | Unit |

### Phase 9c: Enrich Processor

| Task | Description | Test Type |
|------|-------------|-----------|
| Reference indices | Create oak_ref_subjects, oak_ref_key_stages | Integration |
| Enrich policies | Define enrichment policies | Integration |
| Ingest pipeline | Apply enrichment at index time | Integration |

---

## Key Files

```text
apps/oak-open-curriculum-semantic-search/src/lib/entity-extraction/
├── ner-client.ts          # ES inference API client
├── entity-filter.ts       # Confidence filtering
├── entity-types.ts        # Entity type definitions
└── index.ts               # Barrel exports

apps/oak-open-curriculum-semantic-search/src/lib/graph/
├── co-occurrence.ts       # Co-occurrence queries
├── relationships.ts       # Relationship extraction
└── index.ts               # Barrel exports
```

---

## Success Criteria

- [ ] NER extracting entities from >80% lessons
- [ ] Entity confidence threshold filtering working (>0.7)
- [ ] Graph API discovering >20 concept relationships
- [ ] Enrich processor joining reference data
- [ ] All quality gates pass

---

## Evaluation Requirements

Entity extraction changes search behaviour:

1. **Before**: Baseline MRR for concept-based queries
2. **After**: MRR with entity-enriched documents
3. **Record**: [EXPERIMENT-LOG.md](../../../../evaluations/EXPERIMENT-LOG.md)

---

## Related Documents

- [roadmap.md](../../roadmap.md) — Linear execution path
- [advanced-features.md](advanced-features.md) — Other future work

