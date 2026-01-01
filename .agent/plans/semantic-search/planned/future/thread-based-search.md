# Thread-Based Search — Learning Progression as a Search Dimension

**Status**: 📋 Planned  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 5)  
**Priority**: HIGH — Unique differentiator for Oak search  
**Dependencies**: Milestone 1 (complete ES ingestion)

---

## Vision: Why Threads Matter

**Threads are Oak's unique advantage.** No other education search service has:

1. **164 conceptual progressions** spanning Reception → Year 11
2. **Ordered unit sequences** showing how ideas build over time
3. **Cross-key-stage connections** linking primary to secondary
4. **Subject-specific conceptual strands** (not just topics)

---

## Thread Data Inventory

| Data Point | API Endpoint | Available |
|------------|--------------|-----------|
| All threads | `GET /threads` | ✅ 164 threads |
| Units in thread | `GET /threads/{slug}/units` | ✅ Ordered |
| Thread associations on units | Unit documents | ✅ Available |
| Thread progressions (cached) | MCP `get-thread-progressions` | ✅ Complete |

---

## Implementation Plan

### Phase 1: Thread Index in Elasticsearch

Create dedicated `oak_threads` index with thread metadata and nested units:

```json
{
  "mappings": {
    "properties": {
      "thread_slug": { "type": "keyword" },
      "thread_title": { "type": "text", "analyzer": "english" },
      "subject_slug": { "type": "keyword" },
      "unit_count": { "type": "integer" },
      "lesson_count": { "type": "integer" },
      "year_span": {
        "type": "object",
        "properties": {
          "start": { "type": "integer" },
          "end": { "type": "integer" }
        }
      },
      "key_stages": { "type": "keyword" },
      "units": {
        "type": "nested",
        "properties": {
          "unit_slug": { "type": "keyword" },
          "unit_title": { "type": "text" },
          "unit_order": { "type": "integer" },
          "year_number": { "type": "integer" },
          "key_stage_slug": { "type": "keyword" }
        }
      },
      "embedding": { "type": "sparse_vector" }
    }
  }
}
```

### Phase 2: Thread Fields on Lessons/Units

**Lesson Index Additions**:

```json
{
  "thread_slugs": { "type": "keyword" },
  "thread_positions": {
    "type": "nested",
    "properties": {
      "thread_slug": { "type": "keyword" },
      "position": { "type": "integer" },
      "total_in_thread": { "type": "integer" }
    }
  }
}
```

**Unit Index Additions**:

```json
{
  "thread_slugs": { "type": "keyword" },
  "thread_orders": {
    "type": "nested",
    "properties": {
      "thread_slug": { "type": "keyword" },
      "order": { "type": "integer" }
    }
  }
}
```

### Phase 3: Progression Search Queries

**Prerequisites Query**: Find units in same thread with lower order:

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

### Phase 4: Thread-Grouped Search Results

Search results can be aggregated by thread:

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

### Phase 5: Thread-Based Recommendations

Algorithm: Find adjacent units (±2 positions) in each thread:

```typescript
async function getThreadRecommendations(lessonSlug: string) {
  const lesson = await getLesson(lessonSlug);
  const recommendations = [];

  for (const thread of lesson.thread_positions) {
    const nearby = await esClient.search({
      index: 'oak_units',
      query: {
        nested: {
          path: 'thread_orders',
          query: {
            bool: {
              must: [{ term: { 'thread_orders.thread_slug': thread.thread_slug } }],
              filter: [{ range: { 'thread_orders.order': { 
                gte: thread.position - 2, lte: thread.position + 2 } } }],
            },
          },
        },
      },
    });
    recommendations.push(...nearby.hits.hits);
  }
  return recommendations;
}
```

---

## Implicit Relationships to Surface

Beyond explicit thread associations:

| Relationship | Query |
|--------------|-------|
| Cross-thread units | Units appearing in 2+ threads |
| Thread prerequisite chains | Thread A → Thread B sequences |
| Keyword bridges | Keywords spanning multiple threads |
| Year-level intersections | Which threads are active in Year 5? |

---

## MCP Tool Enhancements

| Tool | Purpose |
|------|---------|
| `search-by-thread` | Search within a specific thread |
| `get-progression` | Get ordered units for a thread |
| `find-prerequisites` | What should be taught before X? |
| `find-next-steps` | What comes after X? |
| `get-thread-overview` | Summary of a thread |

---

## Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Progression queries answered | 0% | 100% |
| Thread coverage in indices | 0 threads | 164 threads |
| Lessons with thread context | ~0% | 100% |

---

## Search UX Enhancements

### Progression Breadcrumb

```text
🧵 Number: Fractions
   Year 3 → Year 4 → [Year 5: This Lesson] → Year 6 → Year 7
```

### Thread Filter Chips

```text
🔍 "fractions"
   [All Threads] [Number ✓] [Ratio & Proportion] [Algebra]
```

### Learning Journey View

```text
├── Number: Fractions (12 lessons)
│   ├── Year 3: Introduction
│   ├── Year 4: Adding fractions
│   └── Year 5: Multiplying fractions
```

---

## Success Criteria

### Must Have

- [ ] `oak_threads` index with all 164 threads
- [ ] Thread fields on lesson documents
- [ ] Thread fields on unit documents
- [ ] Prerequisite query working
- [ ] Progression query working

### Should Have

- [ ] Thread-grouped search results option
- [ ] MCP tools for thread navigation

---

## Evaluation Requirements

Thread-based search introduces new query types that need ground truth:

1. **Create ground truths** for thread-based queries:
   - "What comes before fractions?" → Expected prerequisite units
   - "Show the journey for Number: Fractions" → Expected ordered sequence
   - "What threads contain quadratic equations?" → Expected thread slugs

2. **Before**: Run `pnpm eval:per-category` baseline

3. **Implement**: Add thread index and fields

4. **After**: Run evaluation with thread queries

5. **Record**: Update [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

**Success metric**: Thread-based queries return correct results (MRR ≥0.80 for these structured queries)

---

## Related Documents

- [roadmap.md](../roadmap.md) — Linear execution path
- [ontology-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) — Thread definitions

