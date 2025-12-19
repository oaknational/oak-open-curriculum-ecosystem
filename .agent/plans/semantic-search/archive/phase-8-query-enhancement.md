# Phase 8: Query Enhancement

**Status**: 📋 PLANNED  
**Estimated Effort**: 1-2 days  
**Prerequisites**: Phase 3 (Multi-Index Search & Fields)  
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

This phase focuses on query-level improvements:

1. **Production Query Patterns** - Evaluate patterns from OWA's `constructElasticQuery.ts`
2. **OWA Compatibility Layer** - Prepare for future OWA integration
3. **Semantic Query Rules** - Pattern-based query rewriting

### Context: Phase 2 Learnings

Reranking was extensively evaluated in Phase 2 with these findings:

| Configuration               | Result             | Lesson                                |
| --------------------------- | ------------------ | ------------------------------------- |
| Rerank on `transcript_text` | 22+ second latency | Field too long for cross-encoder      |
| Rerank on `lesson_title`    | NDCG dropped 3%    | Field too short for semantic signal   |
| Combined field needed       | Not tested         | Would require new `rerank_text` field |

**Conclusion**: Reranking is NOT recommended for lessons without significant field redesign. Unit reranking with `rollup_text` (~300 chars/lesson) may be viable - test in Phase 3.

---

## Part 8a: Production Query Patterns

### Patterns Worth Evaluating

Based on analysis of OWA's `constructElasticQuery.ts`:

#### 1. Phrase Matching Priority

**Production approach**:

```json
{
  "multi_match": {
    "query": "solving quadratic equations",
    "type": "phrase",
    "fields": ["title^6", "pupilLessonOutcome^3"]
  }
}
```

**Our current**: No phrase matching priority.

**Action**: Add phrase boost to BM25 component, measure impact on MRR/NDCG.

#### 2. Fuzzy Configuration

**Production approach**:

```json
{
  "multi_match": {
    "query": "pythagorus",
    "fuzziness": "AUTO:4,7",
    "prefix_length": 1
  }
}
```

**Our current**: `fuzziness: "AUTO"` (less precise).

**Action**: Adopt production's tighter fuzzy settings, measure impact.

#### 3. `copy_to` Aggregated Field Pattern

**Production**: Uses `all_fields` via `copy_to` for fuzzy matching across multiple fields.

**Action**: Evaluate if this improves recall without hurting precision.

### Implementation Tasks (7a)

| Task                    | Description                                | Test Type |
| ----------------------- | ------------------------------------------ | --------- |
| Phrase boost evaluation | Add phrase matching with field boosts      | Smoke     |
| Fuzzy config comparison | Compare AUTO vs AUTO:4,7                   | Smoke     |
| Field boost tuning      | Test title^6, outcome^3 vs current weights | Smoke     |
| ADR for query changes   | Document any changes with measured impact  | -         |

---

## Part 8b: OWA Compatibility Layer

For future OWA integration, prepare response field mappings.

### Response Field Mappings

```typescript
/**
 * Maps our search response fields to OWA expected fields.
 *
 * @example
 * // Our response
 * { lesson_title: "Solving Quadratics", key_stage_slug: "ks4" }
 *
 * // OWA expected
 * { title: "Solving Quadratics", keyStageSlug: "ks4", keyStageShortCode: "KS4" }
 */
const fieldMappings = {
  // Direct renames
  lesson_title: 'title',
  key_stage_slug: 'keyStageSlug',
  subject_slug: 'subjectSlug',

  // Derived fields
  keyStageShortCode: (doc) => doc.key_stage_slug.toUpperCase(), // 'KS4'
  yearTitle: (doc) => `Year ${doc.year_slug.slice(1)}`, // 'Year 10'
};
```

### Implementation Tasks (7b)

| Task                      | Description                          | Test Type |
| ------------------------- | ------------------------------------ | --------- |
| Field mapping definition  | Document all field mappings          | Unit      |
| Transform function        | Pure function to transform responses | Unit      |
| ADR for OWA compatibility | Document approach and rationale      | -         |

---

## Part 8c: Semantic Query Rules

Pattern-based query rewriting to improve search intelligence.

### Concept: Query Rules

Query rules transform user queries based on detected patterns:

```typescript
// Example rules
const queryRules = [
  // Tier inference
  { pattern: /pythagoras|trigonometry|calculus/i, action: { suggestFilter: { tier: 'higher' } } },

  // Year group to key stage
  {
    pattern: /\by(?:ear\s*)?(\d{1,2})\b/i,
    action: (match) => ({ keyStage: yearToKeyStage(match[1]) }),
  },

  // Subject normalisation
  { pattern: /\bmath(?:s|ematics)?\b/i, action: { normalise: 'maths' } },
];
```

### Integration with OWA Aliases

Enhanced with OWA alias patterns from Phase 3a:

```typescript
// OWA-style PF matching
{ pattern: /\by5\s+maths?\b/i, action: { keyStage: 'ks2', subject: 'maths' } }
{ pattern: /\bgcse\b/i, action: { keyStage: 'ks4' } }
{ pattern: /\bpearson\b/i, action: { examBoard: 'edexcel' } }
```

### Implementation Tasks (7c)

| Task                      | Description                                | Test Type   |
| ------------------------- | ------------------------------------------ | ----------- |
| Query rule interface      | Define rule structure and execution        | Unit        |
| 5+ basic rules            | Implement initial semantic rules           | Unit        |
| OWA alias integration     | Import patterns from Phase 3a synonym work | Unit        |
| Rule application pipeline | Integrate rules into search flow           | Integration |

---

## Success Criteria

### 7a: Production Query Patterns

- [ ] Phrase matching boost evaluated (with A/B metrics)
- [ ] Fuzzy config comparison documented
- [ ] Field boost tuning documented
- [ ] ADRs for any query changes

### 7b: OWA Compatibility

- [ ] OWA field mapping documented
- [ ] Transform function implemented and tested
- [ ] ADR for OWA compatibility approach

### 7c: Semantic Query Rules

- [ ] Query rule interface defined
- [ ] 5+ semantic query rules implemented
- [ ] OWA alias patterns integrated
- [ ] Rules integrated into search pipeline

---

## TDD Requirements

| Component           | Test First                                               |
| ------------------- | -------------------------------------------------------- |
| Phrase boost        | Smoke test: measure MRR/NDCG with/without phrase boost   |
| Fuzzy config        | Smoke test: compare typo handling with different configs |
| Field mapper        | Unit test: transforms response correctly                 |
| Query rule executor | Unit test: applies rules to query, returns modifications |

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

### Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way hybrid (BM25 + ELSER)
└── rrf-query-helpers.ts            # Shared helpers
```

### Search Quality

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/
├── ground-truth/                   # Ground truth queries
└── metrics.ts                      # MRR, NDCG calculations
```

### New Query Rules

```text
apps/oak-open-curriculum-semantic-search/src/lib/query-rules/
├── rules.ts                        # Rule definitions
├── executor.ts                     # Rule execution logic
└── index.ts                        # Barrel exports
```

---

## Dependencies

- **Upstream**: Phase 3 (OWA alias import from synonym work)
- **Blocks**: None (enhancements to existing search)

---

## Related Documents

- [Phase 3](./phase-3-multi-index-and-fields.md) - OWA aliases imported there
- [Requirements](./requirements.md) - Success metrics (MRR, NDCG targets)
