# Search Decision Model

**Stream**: search-quality  
**Level**: 3  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-17  
**Research**: [documentation-gap-analysis.md](../../../../research/elasticsearch/oak-data/documentation-gap-analysis.md) (Gaps A, B, C)

---

## Overview

The Search Decision Model defines **HOW search decisions are made**. Without this, the system works but is:

- Hard to reason about
- Hard to tune
- Hard to explain
- Prone to drift as rules and vocab grow

This document establishes three core components:

1. **Query Shape Taxonomy** — Named query types
2. **Confidence Model** — When to apply expansions/routing
3. **Retriever Catalogue** — Named retriever profiles

---

## 1. Query Shape Taxonomy

### The Problem

The system currently treats all queries the same. But user intent varies:

| Query | Intent | Optimal Handling |
|-------|--------|------------------|
| "what is a coefficient" | Definition | Route to definition retriever |
| "Year 5 fractions" | Navigation | Apply filter, standard retrieval |
| "teach me about photosynthesis" | Exploration | Broad retrieval, diverse results |
| "quadratic formula" | Precise topic | Standard retrieval |
| "help struggling students with fractions" | Pedagogical | Boost misconceptions/teacher tips |

### Query Shapes (5 Types)

| Shape | Description | Detection Signals | Allowed Actions |
|-------|-------------|-------------------|-----------------|
| **DEFINITION** | "What is X", "Define X" | Prefix patterns | Route to definition retriever |
| **NAVIGATION** | Specific unit/lesson/year | Structural terms (Year 5, KS3, AQA) | Infer filters, standard retrieval |
| **EXPLORATION** | Learning about a topic | Long queries, no structural terms | Broad retrieval, diverse results |
| **PRECISE_TOPIC** | Curriculum terminology | Short, specific terms | Standard retrieval |
| **PEDAGOGICAL** | Teaching intent | "help", "struggling", "teach" | Boost teacher-facing fields |

### Detection Logic

```typescript
type QueryShape = 'DEFINITION' | 'NAVIGATION' | 'EXPLORATION' | 'PRECISE_TOPIC' | 'PEDAGOGICAL';

function classifyQueryShape(query: string, filters: Filters): QueryShape {
  const normalised = query.toLowerCase().trim();
  
  // DEFINITION: starts with definition patterns
  if (/^(what is|define|meaning of|what does .* mean)/.test(normalised)) {
    return 'DEFINITION';
  }
  
  // NAVIGATION: contains structural terms
  if (containsStructuralTerms(normalised) || hasExplicitFilters(filters)) {
    return 'NAVIGATION';
  }
  
  // PEDAGOGICAL: teaching intent
  if (/\b(help|struggling|teach|introduce|remediat)/.test(normalised)) {
    return 'PEDAGOGICAL';
  }
  
  // EXPLORATION: long queries without precision
  if (normalised.split(' ').length > 5 && !containsCurriculumTerms(normalised)) {
    return 'EXPLORATION';
  }
  
  // Default: PRECISE_TOPIC
  return 'PRECISE_TOPIC';
}
```

### Query Shape → Retriever Mapping

| Shape | Retriever Profile | Expansion Policy | Rerank? |
|-------|-------------------|------------------|---------|
| DEFINITION | `definition_first` | None | No |
| NAVIGATION | `filtered_standard` | None | No |
| EXPLORATION | `broad_recall` | Weak expansion | Yes |
| PRECISE_TOPIC | `standard_hybrid` | Synonyms only | Yes |
| PEDAGOGICAL | `teacher_focused` | Weak expansion | Yes |

---

## 2. Confidence Model

### The Problem

The system currently says "apply when sense is known" but doesn't define what "known" means.

### Confidence Tiers

| Tier | Definition | Example |
|------|------------|---------|
| **CERTAIN** | Explicit filter provided by user | `{ subject: "maths", keyStage: "ks4" }` |
| **HIGH** | Unambiguous structural term | "Year 9" → KS3 |
| **MEDIUM** | Likely inference | "GCSE" → likely KS4 |
| **LOW** | Ambiguous or absent | No filters, generic query |

### Confidence → Allowed Actions

| Action | CERTAIN | HIGH | MEDIUM | LOW |
|--------|---------|------|--------|-----|
| Apply subject filter | ✅ | ✅ | ⚠️ Suggest | ❌ |
| Apply phase filter | ✅ | ✅ | ⚠️ Suggest | ❌ |
| Expand synonyms | ✅ | ✅ | ✅ | ✅ (general only) |
| Route to definition retriever | ✅ | ✅ | ✅ | ✅ |
| Apply sense-bound expansion | ✅ | ✅ | ❌ | ❌ |
| Apply relationship expansion | ✅ | ⚠️ Weak boost | ❌ | ❌ |

### Confidence Derivation

```typescript
interface ConfidenceResult {
  tier: 'CERTAIN' | 'HIGH' | 'MEDIUM' | 'LOW';
  subject?: string;
  keyStage?: string;
  evidence: string[];
}

function deriveConfidence(query: string, filters: Filters): ConfidenceResult {
  const evidence: string[] = [];
  
  // CERTAIN: Explicit filters
  if (filters.subject && filters.keyStage) {
    return { tier: 'CERTAIN', subject: filters.subject, keyStage: filters.keyStage, evidence: ['explicit_filters'] };
  }
  
  // HIGH: Unambiguous structural terms
  const yearMatch = query.match(/\byear\s+(\d+)\b/i);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    const keyStage = yearToKeyStage(year);
    evidence.push(`year_${year}_detected`);
    return { tier: 'HIGH', keyStage, evidence };
  }
  
  // MEDIUM: Likely inference
  if (/\bgcse\b/i.test(query)) {
    evidence.push('gcse_detected');
    return { tier: 'MEDIUM', keyStage: 'ks4', evidence };
  }
  
  // LOW: No clear signals
  return { tier: 'LOW', evidence: ['no_signals'] };
}
```

---

## 3. Retriever Catalogue

### The Problem

Elastic's retriever framework allows many combinations. Without a catalogue:

- Behaviour diverges across services
- Benchmarks become incomparable
- Maintenance cost rises

### Named Retriever Profiles

#### `standard_hybrid` (Default)

Current production configuration.

```json
{
  "name": "standard_hybrid",
  "description": "4-way RRF over structure and content",
  "query_shapes": ["PRECISE_TOPIC"],
  "retriever": {
    "rrf": {
      "retrievers": [
        { "standard": { "query": { "multi_match": { "query": "{{q}}", "fields": ["lesson_title^4", "lesson_keywords^3", "lesson_structure^2"] } } } },
        { "standard": { "query": { "semantic": { "field": "lesson_structure_semantic", "query": "{{q}}" } } } },
        { "standard": { "query": { "multi_match": { "query": "{{q}}", "fields": ["lesson_content^2", "lesson_keywords^1"] } } } },
        { "standard": { "query": { "semantic": { "field": "lesson_content_semantic", "query": "{{q}}" } } } }
      ],
      "rank_window_size": 80,
      "rank_constant": 60
    }
  }
}
```

#### `standard_hybrid_reranked` (Level 3)

Standard hybrid with semantic reranking.

```json
{
  "name": "standard_hybrid_reranked",
  "description": "4-way RRF with semantic reranking",
  "query_shapes": ["PRECISE_TOPIC", "EXPLORATION"],
  "retriever": {
    "text_similarity_reranker": {
      "retriever": { "/* standard_hybrid */" },
      "field": "lesson_structure",
      "inference_id": "jina-reranker",
      "inference_text": "{{q}}",
      "rank_window_size": 50
    }
  }
}
```

#### `definition_first` (Level 3)

Prioritises definition retrieval.

```json
{
  "name": "definition_first",
  "description": "Definition retriever with lesson fallback",
  "query_shapes": ["DEFINITION"],
  "retriever": {
    "rrf": {
      "retrievers": [
        { "/* definition_retriever (boost 2.0) */" },
        { "/* standard_hybrid (boost 1.0) */" }
      ]
    }
  }
}
```

#### `filtered_standard` (Navigation)

Standard hybrid with pre-applied filters.

```json
{
  "name": "filtered_standard",
  "description": "Standard hybrid with inferred filters",
  "query_shapes": ["NAVIGATION"],
  "retriever": {
    "/* standard_hybrid with filter clause */"
  }
}
```

#### `teacher_focused` (Pedagogical)

Boosts teacher-facing fields.

```json
{
  "name": "teacher_focused",
  "description": "Boosts misconceptions and teacher tips",
  "query_shapes": ["PEDAGOGICAL"],
  "retriever": {
    "/* standard_hybrid with field boosts: teacher_tips^3, misconceptions^3 */"
  }
}
```

---

## Search Decision Flow

```
User Query + Filters
        │
        ▼
┌───────────────────────────────────────┐
│ 1. Derive Confidence                   │
│    → CERTAIN / HIGH / MEDIUM / LOW     │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 2. Classify Query Shape                │
│    → DEFINITION / NAVIGATION / etc.    │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 3. Select Retriever Profile            │
│    → Based on shape + confidence       │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 4. Apply Allowed Actions               │
│    → Filters, expansions, routing      │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 5. Execute Search                      │
│    → ES retriever query                │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 6. Log Decision                        │
│    → Shape, confidence, profile, timing│
└───────────────────────────────────────┘
```

---

## Explain Contract

Every search returns an explain object:

```typescript
interface SearchExplain {
  query_shape: QueryShape;
  confidence: ConfidenceResult;
  retriever_profile: string;
  actions_taken: string[];
  filters_inferred: Record<string, string>;
  expansions_applied: string[];
}
```

This enables:

- Debugging ("why did this query return these results?")
- Benchmarking ("which profile was used?")
- User feedback ("we interpreted X as Y")

---

## Checklist

- [ ] Implement query shape classification
- [ ] Implement confidence derivation
- [ ] Define all retriever profiles in code
- [ ] Add explain logging
- [ ] Create ground truths per query shape
- [ ] Benchmark each retriever profile
- [ ] Document in ADR

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [documentation-gap-analysis.md](../../../../research/elasticsearch/oak-data/documentation-gap-analysis.md) | Research gaps A, B, C |
| [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Retriever patterns |
| [operations/governance.md](../07-runtime-governance-and-operations/governance.md) | How the system operates |
| [../roadmap.md](../../roadmap.md) | Master roadmap |
