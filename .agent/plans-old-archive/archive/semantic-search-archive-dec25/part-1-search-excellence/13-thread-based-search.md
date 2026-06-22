# 13: Thread-Based Search — Learning Progression as a Search Dimension

**Status**: 📋 PLANNED  
**Priority**: HIGH — Unique differentiator for Oak search  
**Created**: 2025-12-28  
**Vision**: Build the best education search service that has ever existed  
**Related**:

- [ADR-080: Curriculum Data Denormalisation](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)
- [02b-vocabulary-mining.md](02b-vocabulary-mining.md)
- [09-knowledge-graph-evolution.md](09-knowledge-graph-evolution.md)
- [Ontology: threads section](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts)

---

## Vision: Why Threads Matter

**Threads are Oak's unique advantage.** No other education search service has:

1. **164 conceptual progressions** spanning Reception → Year 11
2. **Ordered unit sequences** showing how ideas build over time
3. **Cross-key-stage connections** linking primary to secondary
4. **Subject-specific conceptual strands** (not just topics)

This is **sector-transformative data**. We have it. We have Elasticsearch. We have AI. If we build it, they will come.

### The Opportunity

| Current State | Target State |
|---------------|--------------|
| Search finds lessons by keyword | Search understands learning progressions |
| "fractions" returns random lessons | "fractions" shows the journey from halves to algebraic fractions |
| No context for "what comes before" | Thread-aware prerequisites |
| Flat search results | Hierarchical thread-grouped results |

---

## Thread Data Inventory

### Available Data

| Data Point | API Endpoint | Structure |
|------------|--------------|-----------|
| All threads | `GET /threads` | `{ data: [{ threadSlug, threadTitle, subjectSlug }] }` |
| Units in thread | `GET /threads/{slug}/units` | `{ data: [{ unitSlug, unitTitle, unitOrder, yearNumber, keyStageSlug }] }` |
| Thread associations on units | `GET /sequences/{seq}/units` | `units[].threads: [{ threadSlug, threadTitle, order }]` |
| Thread progressions (cached) | MCP `get-thread-progressions` | Pre-computed ordered unit sequences |

### Thread Statistics (from get-thread-progressions)

- **164 threads** across 14 subjects
- Year spans range from single year to full Reception→Year 11
- Average ~10 units per thread
- ~1,600 thread↔unit associations

### Example Thread: "Number: Fractions" (Maths)

```text
Year 2: Understanding halves and quarters
Year 3: Unit fractions, comparing fractions
Year 4: Adding fractions with same denominator
Year 5: Adding/subtracting with different denominators
Year 6: Multiplying and dividing fractions
Year 7: Fraction operations review
Year 8: Algebraic fractions
Year 9: Complex fractions
Year 10-11: Algebraic manipulation with fractions
```

This progression is **gold for search**. A teacher searching "fractions" should see this journey, not just random lessons.

---

## Implementation Plan

### Phase 1: Thread Index in Elasticsearch

**Goal**: Create a dedicated `oak_threads` index for thread search and rollups.

**Mapping**:

```json
{
  "mappings": {
    "properties": {
      "thread_slug": { "type": "keyword" },
      "thread_title": { "type": "text", "analyzer": "english" },
      "subject_slug": { "type": "keyword" },
      "subject_title": { "type": "text" },
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
          "key_stage_slug": { "type": "keyword" },
          "lesson_count": { "type": "integer" }
        }
      },
      "embedding": { "type": "sparse_vector" }
    }
  }
}
```

**Ingestion**:

```typescript
async function ingestThreads() {
  const threads = await getThreads();

  for (const thread of threads.data) {
    const units = await getThreadUnits(thread.threadSlug);

    // Compute rollup metrics
    const yearNumbers = units.data.map((u) => u.yearNumber);
    const keyStages = [...new Set(units.data.map((u) => u.keyStageSlug))];

    const doc = {
      thread_slug: thread.threadSlug,
      thread_title: thread.threadTitle,
      subject_slug: thread.subjectSlug,
      unit_count: units.data.length,
      lesson_count: await countLessonsInUnits(units.data),
      year_span: {
        start: Math.min(...yearNumbers),
        end: Math.max(...yearNumbers),
      },
      key_stages: keyStages,
      units: units.data.map((u) => ({
        unit_slug: u.unitSlug,
        unit_title: u.unitTitle,
        unit_order: u.unitOrder,
        year_number: u.yearNumber,
        key_stage_slug: u.keyStageSlug,
      })),
    };

    await indexThread(doc);
  }
}
```

### Phase 2: Thread Fields on Lessons/Units

**Goal**: Every lesson and unit should carry thread context for filtering and grouping.

**Lesson Index Additions**:

```json
{
  "thread_slugs": { "type": "keyword" },
  "thread_titles": { "type": "text" },
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
  "thread_titles": { "type": "text" },
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

**Goal**: Enable "what comes before/after" queries.

**Query: Prerequisites for a Unit**

```typescript
async function findPrerequisites(unitSlug: string): Promise<Unit[]> {
  // Get the unit's thread associations
  const unit = await getUnitSummary(unitSlug);
  const threads = unit.threads;

  const prerequisites: Unit[] = [];

  for (const thread of threads) {
    // Find units in same thread with lower order
    const query = {
      bool: {
        must: [
          { nested: { path: 'thread_orders', query: { term: { 'thread_orders.thread_slug': thread.threadSlug } } } },
        ],
        filter: [
          { nested: { path: 'thread_orders', query: { range: { 'thread_orders.order': { lt: thread.order } } } } },
        ],
      },
    };

    const results = await esClient.search({ index: 'oak_units', query, sort: [{ 'thread_orders.order': 'desc' }] });
    prerequisites.push(...results.hits.hits.map((h) => h._source));
  }

  return prerequisites;
}
```

**Query: Progression Path**

```typescript
async function getProgressionPath(threadSlug: string): Promise<ProgressionStep[]> {
  const query = {
    nested: {
      path: 'thread_orders',
      query: { term: { 'thread_orders.thread_slug': threadSlug } },
    },
  };

  const results = await esClient.search({
    index: 'oak_units',
    query,
    sort: [{ 'thread_orders.order': 'asc' }],
    size: 100,
  });

  return results.hits.hits.map((h) => ({
    unit: h._source,
    order: h._source.thread_orders.find((t) => t.thread_slug === threadSlug)?.order,
  }));
}
```

### Phase 4: Thread-Grouped Search Results

**Goal**: Search results can be grouped by thread for progression context.

**Query: Lessons grouped by thread**

```typescript
async function searchWithThreadGrouping(query: string): Promise<ThreadGroupedResults> {
  const results = await esClient.search({
    index: 'oak_lessons',
    query: { match: { title: query } },
    aggs: {
      by_thread: {
        terms: { field: 'thread_slugs', size: 20 },
        aggs: {
          top_lessons: {
            top_hits: { size: 5, sort: [{ thread_positions.position: 'asc' }] },
          },
        },
      },
    },
  });

  return {
    total: results.hits.total.value,
    byThread: results.aggregations.by_thread.buckets.map((bucket) => ({
      threadSlug: bucket.key,
      lessonCount: bucket.doc_count,
      topLessons: bucket.top_lessons.hits.hits,
    })),
  };
}
```

### Phase 5: Thread-Based Recommendations

**Goal**: "If you liked X, try these related units in the same thread."

**Algorithm**:

1. Find the current lesson/unit's threads
2. Get adjacent units (±2 positions) in each thread
3. Rank by distance from current position
4. Return as "Related in this learning journey"

```typescript
async function getThreadRecommendations(lessonSlug: string): Promise<Recommendation[]> {
  const lesson = await getLesson(lessonSlug);
  const recommendations: Recommendation[] = [];

  for (const thread of lesson.thread_positions) {
    // Get units within ±2 positions
    const nearby = await esClient.search({
      index: 'oak_units',
      query: {
        nested: {
          path: 'thread_orders',
          query: {
            bool: {
              must: [{ term: { 'thread_orders.thread_slug': thread.thread_slug } }],
              filter: [
                { range: { 'thread_orders.order': { gte: thread.position - 2, lte: thread.position + 2 } } },
              ],
            },
          },
        },
      },
    });

    for (const hit of nearby.hits.hits) {
      const unitOrder = hit._source.thread_orders.find((t) => t.thread_slug === thread.thread_slug)?.order;
      recommendations.push({
        unit: hit._source,
        reason:
          unitOrder < thread.position
            ? 'Builds foundation for this topic'
            : 'Extends this concept further',
        distance: Math.abs(unitOrder - thread.position),
      });
    }
  }

  return recommendations.sort((a, b) => a.distance - b.distance);
}
```

---

## Implicit Relationships to Surface

Beyond explicit thread associations, we can infer relationships:

### 1. Cross-Thread Connections

Units that share lessons or keywords across threads:

```typescript
// Find units that appear in multiple threads
const crossThreadUnits = await esClient.search({
  index: 'oak_units',
  query: { range: { 'thread_slugs.length': { gte: 2 } } },
});
```

### 2. Thread Prerequisite Chains

If Thread A's final unit is prerequisite for Thread B's first unit:

```typescript
// Find threads that commonly follow each other
const threadSequences = analyzePrerequisitePatterns(allUnits);
```

### 3. Keyword Bridges

Keywords that appear in multiple threads suggest conceptual connections:

```typescript
// Keywords that bridge threads
const bridgeKeywords = findKeywordsAcrossThreads(lessons);
// e.g., "ratio" appears in both Number and Geometry threads
```

### 4. Year-Level Thread Intersections

At each year level, which threads are active? This helps with curriculum planning:

```typescript
// Threads active in Year 5
const year5Threads = await esClient.search({
  index: 'oak_threads',
  query: {
    bool: {
      must: [
        { range: { 'year_span.start': { lte: 5 } } },
        { range: { 'year_span.end': { gte: 5 } } },
      ],
    },
  },
});
```

---

## Search UX Enhancements

### 1. Progression Breadcrumb

Show where a lesson sits in its thread:

```text
🧵 Number: Fractions
   Year 3 → Year 4 → [Year 5: This Lesson] → Year 6 → Year 7
```

### 2. Thread Filter Chips

Allow filtering search results by thread:

```text
🔍 "fractions"
   [All Threads] [Number ✓] [Ratio & Proportion] [Algebra]
```

### 3. "Learning Journey" View

Toggle between flat results and thread-grouped view:

```text
📚 Flat View | 🧵 Journey View

Journey View:
├── Number: Fractions (12 lessons)
│   ├── Year 3: Introduction to fractions
│   ├── Year 4: Adding fractions
│   └── Year 5: Multiplying fractions
└── Algebra: Algebraic Fractions (4 lessons)
    ├── Year 8: Simple algebraic fractions
    └── Year 9: Complex operations
```

### 4. "What to Teach First" Query

Special query type for progression planning:

```text
🎯 Query: "I want to teach quadratic equations"
📖 Response:
   Before teaching quadratics, ensure students understand:
   1. Algebra: Expressions and Equations (Year 7-8)
   2. Number: Negative Numbers (Year 6-7)
   3. Algebra: Linear Equations (Year 8)
```

---

## MCP Tool Enhancements

### New Tools

| Tool | Purpose |
|------|---------|
| `search-by-thread` | Search within a specific thread |
| `get-progression` | Get ordered units for a thread |
| `find-prerequisites` | What should be taught before X? |
| `find-next-steps` | What comes after X? |
| `get-thread-overview` | Summary of a thread (units, years, key topics) |

### Enhanced Existing Tools

| Tool | Enhancement |
|------|-------------|
| `search` | Add `groupByThread` option |
| `get-lessons-summary` | Include thread position context |
| `get-units-summary` | Include thread associations with order |

---

## Acceptance Criteria

### Must Have

- [ ] `oak_threads` index with all 164 threads
- [ ] Thread fields on lesson documents (`thread_slugs`, `thread_positions`)
- [ ] Thread fields on unit documents (`thread_slugs`, `thread_orders`)
- [ ] Prerequisite query: "What comes before unit X?"
- [ ] Progression query: "Show the learning journey for thread Y"

### Should Have

- [ ] Thread-grouped search results option
- [ ] Cross-thread keyword bridges indexed
- [ ] MCP tools for thread navigation

### Could Have

- [ ] "Learning Journey" view in UI
- [ ] Thread prerequisite chain analysis
- [ ] Year-level thread intersection queries

---

## Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Progression queries answered | 0% | 100% |
| Thread coverage in indices | 0 threads | 164 threads |
| Lessons with thread context | ~0% | 100% |
| Units with thread order | ~0% | 100% |

---

## Related Documents

- [Ontology: threads section](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) — Thread definitions and examples
- [MCP get-thread-progressions](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/) — Existing thread progression tool
- [02b-vocabulary-mining.md](02b-vocabulary-mining.md) — Keywords that can bridge threads
- [09-knowledge-graph-evolution.md](09-knowledge-graph-evolution.md) — Thread as nodes in true knowledge graph

