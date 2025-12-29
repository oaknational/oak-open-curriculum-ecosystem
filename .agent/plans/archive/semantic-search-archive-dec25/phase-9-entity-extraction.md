# Phase 9: Entity Extraction & Graph

**Status**: 📋 PLANNED  
**Estimated Effort**: 3-4 days  
**Prerequisites**: Phase 8 (Query Enhancement)  
**Last Updated**: 2025-12-13

---

## Foundation Documents (MUST READ)

Before starting any work on this phase:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

---

## Overview

This phase adds intelligent entity extraction and relationship discovery:

1. **NER Models** - Extract curriculum entities from transcripts
2. **Graph API Discovery** - Find co-occurring concepts
3. **Enrich Processor** - Join reference data at ingest time

---

## Features

### 1. Named Entity Recognition (NER)

Use Hugging Face models via ES Inference API to extract curriculum entities from transcripts.

#### Entity Types

| Type       | Examples                               | Use Case                     |
| ---------- | -------------------------------------- | ---------------------------- |
| `CONCEPT`  | "quadratic equation", "photosynthesis" | Concept-based search         |
| `TOPIC`    | "algebra", "cell biology"              | Topic clustering             |
| `SKILL`    | "solving", "analysing", "comparing"    | Skill-based filtering        |
| `NOTATION` | "x²", "∑", "≤"                         | Mathematical notation search |
| `TERM`     | "coefficient", "mitochondria"          | Vocabulary search            |

#### Implementation Approach

```typescript
// Inference endpoint configuration
const nerEndpoint = {
  inference_id: 'curriculum-ner',
  model_id: 'dslim/bert-base-NER', // Or fine-tuned curriculum model
  task_type: 'ner',
};

// Document enrichment at ingest
const entities = await esClient.inference.inference({
  inference_id: 'curriculum-ner',
  input: lesson.transcript_text,
});

// Store extracted entities
const doc = {
  ...lessonDoc,
  extracted_entities: entities.map((e) => ({
    text: e.text,
    type: e.entity_type,
    confidence: e.score,
  })),
};
```

#### Quality Thresholds

- **Confidence threshold**: > 0.7 (skip low-confidence extractions)
- **Validation**: Manual review for Maths KS4 subset

### 2. Graph API Discovery

Find co-occurring concepts to build relationship understanding.

#### Concept: Co-occurrence Graph

```typescript
// Query: Find concepts that frequently appear together
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

// Result: ["quadratic", "factorising"] appear together in 15 lessons
```

#### Relationship Types

| Relationship      | Example                                         |
| ----------------- | ----------------------------------------------- |
| `CO_OCCURS_WITH`  | "algebra" co-occurs with "equations"            |
| `PREREQUISITE_OF` | "linear equations" prerequisite of "quadratics" |
| `PART_OF`         | "SOHCAHTOA" part of "trigonometry"              |

### 3. Enrich Processor

Join reference data at ingest time for consistent enrichment.

#### Use Cases

| Enrichment           | Source               | Benefit                    |
| -------------------- | -------------------- | -------------------------- |
| `subjectTitle`       | Reference subjects   | "Mathematics" not "maths"  |
| `keyStageTitle`      | Reference key stages | "Key Stage 4" not "ks4"    |
| `nationalCurriculum` | NC standards index   | Align lessons to standards |

#### Implementation

```typescript
// Create enrich policy
await esClient.enrich.putPolicy({
  name: 'subject-titles',
  match: {
    indices: 'oak_ref_subjects',
    match_field: 'slug',
    enrich_fields: ['title', 'description'],
  },
});

// Apply in ingest pipeline
await esClient.ingest.putPipeline({
  id: 'lesson-enrich',
  processors: [
    {
      enrich: {
        policy_name: 'subject-titles',
        field: 'subject_slug',
        target_field: 'subject',
      },
    },
  ],
});
```

---

## Implementation Tasks

### Phase 9a: NER Setup (1.5 days)

| Task                    | Description                           | Test Type   |
| ----------------------- | ------------------------------------- | ----------- |
| NER inference endpoint  | Deploy model to ES inference API      | Integration |
| Entity extraction logic | Extract entities from transcript text | Unit        |
| Confidence filtering    | Filter by threshold (> 0.7)           | Unit        |
| Document enrichment     | Add entities to lesson documents      | Integration |
| Re-index Maths KS4      | Apply NER to existing lessons         | E2E         |

### Phase 9b: Graph Discovery (1 day)

| Task                      | Description                           | Test Type   |
| ------------------------- | ------------------------------------- | ----------- |
| Co-occurrence aggregation | Find frequently co-occurring concepts | Integration |
| Relationship extraction   | Identify concept relationships        | Unit        |
| Graph data structure      | Store relationships for querying      | Unit        |

### Phase 9c: Enrich Processor (1 day)

| Task               | Description                                 | Test Type   |
| ------------------ | ------------------------------------------- | ----------- |
| Reference indices  | Create oak_ref_subjects, oak_ref_key_stages | Integration |
| Enrich policies    | Define enrichment policies                  | Integration |
| Ingest pipeline    | Apply enrichment at index time              | Integration |
| ADR for enrichment | Document approach                           | -           |

---

## Success Criteria

- [ ] NER extracting entities from >80% lessons
- [ ] Entity confidence threshold filtering working
- [ ] Graph API discovering >20 concept relationships
- [ ] Enrich processor joining reference data
- [ ] ADRs written for NER and enrichment approaches
- [ ] All quality gates pass

---

## TDD Requirements

| Component           | Test First                                              |
| ------------------- | ------------------------------------------------------- |
| Entity extraction   | Unit test: extracts expected entities from sample text  |
| Confidence filter   | Unit test: filters entities below threshold             |
| Co-occurrence query | Integration test: returns concept pairs                 |
| Enrich processor    | Integration test: enriches document with reference data |

---

## Quality Gates

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

**All gates must pass. No exceptions.**

---

## Key Files

### New Entity Extraction

```text
apps/oak-open-curriculum-semantic-search/src/lib/entity-extraction/
├── ner-client.ts                   # ES inference API client
├── entity-filter.ts                # Confidence filtering
├── entity-types.ts                 # Entity type definitions
└── index.ts                        # Barrel exports
```

### New Graph Discovery

```text
apps/oak-open-curriculum-semantic-search/src/lib/graph/
├── co-occurrence.ts                # Co-occurrence queries
├── relationships.ts                # Relationship extraction
└── index.ts                        # Barrel exports
```

---

## Environment Variables

```bash
# NER model (if using external)
NER_MODEL_ENDPOINT=https://api.huggingface.co/...
NER_CONFIDENCE_THRESHOLD=0.7
```

---

## Dependencies

- **Upstream**: Phase 7 (query infrastructure)
- **Blocks**: Phase 11 (RAG uses entities for grounding)

---

## Related Documents

- [Phase 10](./phase-10-reference-indices.md) - Reference indices for enrichment
- [Requirements](./requirements.md) - Entity extraction goals
