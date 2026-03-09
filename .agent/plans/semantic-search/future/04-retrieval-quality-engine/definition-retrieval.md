# Definition Retrieval

**Boundary**: retrieval-quality-engine  
**Legacy Stream Label**: search-quality  
**Level**: 3  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-17  
**Research**: [data-and-domain-vocabulary.md](../../../../research/elasticsearch/oak-data/data-and-domain-vocabulary.md), [../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md](../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md)

---

## Overview

Definition retrieval is a dedicated capability for "what is X" and "define X" queries. Instead of treating these as general search, we provide a **specialised retrieval path** that surfaces definitions directly.

Oak's lesson data includes keyword definitions — this is a high-value asset we're not currently exploiting for definition-seeking queries.

---

## Problem Statement

**Current behaviour**: "what is a coefficient?" returns general lessons that mention coefficients.

**Desired behaviour**: Returns the definition of "coefficient" alongside relevant lessons.

### Query Examples

| Query | User Intent | Current Result | Desired Result |
|-------|-------------|----------------|----------------|
| "what is a coefficient" | Definition | General algebra lessons | Definition + relevant lessons |
| "define photosynthesis" | Definition | Biology lessons | Definition + relevant lessons |
| "meaning of alliteration" | Definition | English lessons | Definition + relevant lessons |

---

## Boundary Contract

This plan is authoritative for:

- Definition data sources and schema
- Definition index/field modelling
- Definition retriever implementation
- Definition response contract

Query-shape semantics (what counts as DEFINITION, confidence gating, and
allowed policy actions) are authoritative in
[search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md).

Evidence authoring and benchmark comparability are governed by
[ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md).

---

## Architecture: Three Components

### 1. Definition Index

A dedicated field (or index) for keyword definitions:

```typescript
// Option A: Field in existing lesson index
const lessonMapping = {
  // ... existing fields
  keyword_definitions: {
    type: 'object',
    properties: {
      term: { type: 'keyword' },
      definition: { type: 'text' },
      definition_semantic: { type: 'semantic_text', inference_id: '.elser-2-elasticsearch' },
    },
  },
};

// Option B: Dedicated glossary index
const glossaryMapping = {
  term: { type: 'keyword' },
  term_text: { type: 'text', analyzer: 'oak_text_search' },
  definition: { type: 'text' },
  definition_semantic: { type: 'semantic_text', inference_id: '.elser-2-elasticsearch' },
  subject_slug: { type: 'keyword' },
  source_lesson_slugs: { type: 'keyword' },
  provenance: { type: 'keyword' }, // 'oak.keyword', 'curated', 'mined'
};
```

**Recommendation**: Start with Option A (field), evolve to Option B if needed.

### 2. Definition Retriever

A dedicated retriever for definition queries:

```json
{
  "retriever": {
    "standard": {
      "query": {
        "bool": {
          "should": [
            { "match": { "keyword_definitions.term": { "query": "coefficient", "boost": 3.0 } } },
            { "semantic": { "field": "keyword_definitions.definition_semantic", "query": "what is a coefficient" } }
          ]
        }
      }
    }
  }
}
```

### 3. Routing Hook for Definition Intent (Policy-Owned Triggers)

Use the policy boundary's DEFINITION decision to route into the definition
profile. This plan does not redefine trigger patterns locally.

```json
{
  "retriever": {
    "rule": {
      "match_criteria": [{ "type": "exact", "metadata": "query_shape", "value": "DEFINITION" }],
      "ruleset_ids": ["definition-queries"],
      "retriever": {
        "rrf": {
          "retrievers": [
            { "/* definition retriever */" },
            { "/* general retriever (fallback) */" }
          ]
        }
      }
    }
  }
}
```

---

## Data Sources

### Primary: Lesson Keyword Definitions

Oak's API includes keyword definitions for each lesson:

```typescript
// From lesson data
interface LessonKeyword {
  keyword: string;
  definition: string; // Pupil-friendly definition
}

// Example
{
  keyword: "coefficient",
  definition: "A number placed before a variable to multiply it, such as the 2 in 2x"
}
```

**Source**: `/lessons/{slug}/summary` → `lessonKeywords`

### Secondary: Curated Glossary (Future)

For terms not defined in lesson data:

```json
{
  "term": "quadratic equation",
  "definition": "An equation where the highest power of the variable is 2",
  "subject_slug": "maths",
  "provenance": "curated"
}
```

---

## Research Companions

This plan should now be read alongside:

- [../03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md](../03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md)
- [../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md](../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md)
- [learning-graph-surfaces.research.md](learning-graph-surfaces.research.md)

---

## Implementation Phases

### Phase 1: Data Extraction

Extract all keyword definitions from bulk data via a dedicated analysis script added in this plan:

```bash
cd apps/oak-search-cli
pnpm tsx evaluation/analysis/extract-definitions.ts --output evaluation/analysis/definitions.json
```

**Output**: JSON file with all term → definition mappings.

### Phase 2: Index Enhancement

Add definition fields to lesson index:

1. Update index mapping
2. Re-ingest lessons with definition data
3. Verify with `_analyze` API

### Phase 3: Retriever Implementation

Create definition retriever in SDK:

```typescript
// In search-sdk/retrieval/
export function buildDefinitionRetriever(term: string): Retriever {
  return {
    standard: {
      query: {
        bool: {
          should: [
            { match: { 'keyword_definitions.term': { query: term, boost: 3.0 } } },
            { semantic: { field: 'keyword_definitions.definition_semantic', query: term } },
          ],
        },
      },
    },
  };
}
```

### Phase 4: Query Rules

Deploy definition query rules to Elasticsearch. Rule triggers must be sourced
from the query-policy boundary and not duplicated here.

```typescript
// Create ruleset
await esClient.queryRules.putRuleset({
  ruleset_id: 'definition-queries',
  rules: [
    {
      rule_id: 'what-is',
      type: 'pinned',
      criteria: [{ type: 'prefix', metadata: 'query', prefix: 'what is' }],
      actions: { /* route to definition retriever */ },
    },
    // ... more rules
  ],
});
```

---

## Response Format

Definition queries should return a **structured response**:

```typescript
interface DefinitionSearchResult {
  /** The definition, if found */
  definition?: {
    term: string;
    definition: string;
    subject: string;
    sourceLessons: string[];
  };
  
  /** Related lessons (always returned) */
  lessons: LessonSearchResult[];
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Definition query MRR | ≥ 0.90 (definition at position 1) |
| Recall | 100% (if definition exists, we find it) |
| Latency overhead | ≤ 50ms vs regular search |

---

## Ground Truth Queries

Add definition ground truths to validation:

Ground truths must be authored and versioned using the evaluation boundary
workflow so measurements remain comparable across plans.

| Query | Expected | Notes |
|-------|----------|-------|
| "what is a coefficient" | Definition + maths lessons | |
| "define photosynthesis" | Definition + biology lessons | |
| "meaning of alliteration" | Definition + English lessons | |
| "what does denominator mean" | Definition + maths lessons | |

---

## Checklist

- [ ] Extract definitions from bulk data
- [ ] Design index mapping enhancement
- [ ] Implement definition retriever
- [ ] Create query rules for definition intent
- [ ] Add ground truths for definition queries
- [ ] Benchmark definition query MRR
- [ ] Document in ADR

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [data-and-domain-vocabulary.md](../../../../research/elasticsearch/oak-data/data-and-domain-vocabulary.md) | Definition registry design |
| [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Query rules pattern |
| [search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md) | Authoritative DEFINITION policy and routing semantics |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Ground-truth/evidence authority |
| [modern-es-features.md](modern-es-features.md) | Parent Level 3 plan |
| [../roadmap.md](../../roadmap.md) | Master roadmap |
