# Document Relationships

**Boundary**: retrieval-quality-engine  
**Legacy Stream Label**: search-quality  
**Level**: 2  
**Status**: 📋 Ready — Level 1 complete and validated  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17

---

## Overview

This plan exploits document relationships (threads, sequences, prerequisites) to improve search relevance through cross-referencing and relationship scoring.

**Prerequisite**: Level 1 validated (ground truth review complete).

**Exit Criteria** (from [search-acceptance-criteria.md](../../search-acceptance-criteria.md)):

| Criterion           | Target | Current | Status             |
| ------------------- | ------ | ------- | ------------------ |
| Level 1 exhausted   | Complete | ✅ Complete | 🔓 Ready to proceed |
| Relationship-query baseline captured | Complete before implementation | Pending | 📋 Required in this plan |

---

## Standard Approaches Checklist

All items must be attempted and documented before this level can be declared "exhausted":

- [ ] Cross-reference boosting between lessons and units
- [ ] Prerequisite/successor relationship scoring
- [ ] Thread context integration
- [ ] Sequence context integration

---

## What's Already Complete

### Thread Index

```text
oak_threads: threads across all 16 subjects (exact count from bulk data)
```

All threads indexed with metadata:

- `thread_slug`
- `thread_title`
- `subject_slug`
- `unit_count`, `lesson_count`
- `year_span` (start/end)
- `key_stages`

### Thread Fields on Units

Unit documents now include:

- `thread_slugs` — All associated thread slugs
- `thread_titles` — Human-readable thread names
- `thread_orders` — Position in each thread

See [ADR-097: Context Enrichment Architecture](../../../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md).

---

## Why Threads Matter

**Threads are Oak's unique advantage.** No other education search service has:

1. **164 conceptual progressions** spanning Reception → Year 11
2. **Ordered unit sequences** showing how ideas build over time
3. **Cross-key-stage connections** linking primary to secondary
4. **Subject-specific conceptual strands** (not just topics)

---

## Remaining Work

### Advanced Thread Queries

These query patterns are ready to implement when needed:

**Prerequisites Query** — Find units in same thread with lower order:

```typescript
async function findPrerequisites(unitSlug: string): Promise<Unit[]> {
  const unit = await getUnitSummary(unitSlug);
  const prerequisites: Unit[] = [];

  for (const thread of unit.threads) {
    const query = {
      bool: {
        must: [{ nested: { path: 'thread_orders', 
          query: { term: { 'thread_orders.thread_slug': thread.threadSlug } } } }],
        filter: [{ nested: { path: 'thread_orders', 
          query: { range: { 'thread_orders.order': { lt: thread.order } } } } }],
      },
    };
    const results = await esClient.search({ index: 'oak_units', query });
    prerequisites.push(...results.hits.hits.map((h) => h._source));
  }
  return prerequisites;
}
```

**Thread-Grouped Search** — Aggregate results by thread:

```typescript
async function searchWithThreadGrouping(query: string) {
  return esClient.search({
    index: 'oak_lessons',
    query: { match: { title: query } },
    aggs: {
      by_thread: {
        terms: { field: 'thread_slugs', size: 20 },
        aggs: { top_lessons: { top_hits: { size: 5 } } },
      },
    },
  });
}
```

### Cross-Reference Boosting

Boost documents that share thread context with high-ranking results:

```typescript
// If top result is in thread X, boost other results in thread X
const threadBoost = {
  function_score: {
    query: originalQuery,
    functions: [{
      filter: { term: { thread_slugs: topResultThread } },
      weight: 1.2,
    }],
    score_mode: 'multiply',
  },
};
```

### Prerequisite Scoring

Incorporate prerequisite relationships into relevance:

```typescript
// For "what comes before X" queries, use prerequisite graph
const prerequisiteQuery = {
  bool: {
    must: [{ match: { title: topic } }],
    should: [{
      nested: {
        path: 'thread_orders',
        query: { range: { 'thread_orders.order': { lt: targetOrder } } },
        score_mode: 'avg',
      },
    }],
  },
};
```

---

## Evaluation Requirements

Before implementing Level 2 features:

1. Follow the evidence workflow in
   [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md)
   for authoring/versioning.
2. **Create ground truths** for relationship queries:
   - "What comes before quadratics?" → Expected unit list
   - "Show me the fractions progression" → Expected thread
3. **Baseline**: Document current MRR for these query types
4. **After**: Measure improvement
5. **Record**: [EXPERIMENT-LOG.md](../../../../evaluations/EXPERIMENT-LOG.md)

---

## Checklist

- [ ] Create ground truths for relationship queries
- [ ] Implement cross-reference boosting
- [ ] Implement prerequisite scoring
- [ ] Implement thread-grouped search
- [ ] Benchmark all changes
- [ ] Document in ADR

---

## Related Documents

| Document                                                                                      | Purpose                 |
| --------------------------------------------------------------------------------------------- | ----------------------- |
| [ADR-097](../../../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context enrichment      |
| [../../search-acceptance-criteria.md](../../search-acceptance-criteria.md)                    | Level 2 checklist       |
| [../roadmap.md](../../roadmap.md)                                                                | Master roadmap          |
| [modern-es-features.md](modern-es-features.md)                                                 | Next tier               |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Ground-truth/evidence authority |
