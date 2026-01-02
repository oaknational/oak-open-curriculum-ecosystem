# Thread-Based Search — Learning Progression as a Search Dimension

**Status**: ✅ PARTIALLY COMPLETE — Indexing done, advanced queries pending
**Parent**: [roadmap.md](../../roadmap.md)
**Priority**: Backlog — Foundational work complete
**Updated**: 2026-01-02

---

## ✅ Completed Work (Milestone 5)

### Thread Index

```text
oak_threads: 164 documents
```

All 164 threads indexed with metadata:
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

See [ADR-097: Context Enrichment Architecture](../../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md).

---

## Why Threads Matter

**Threads are Oak's unique advantage.** No other education search service has:

1. **164 conceptual progressions** spanning Reception → Year 11
2. **Ordered unit sequences** showing how ideas build over time
3. **Cross-key-stage connections** linking primary to secondary
4. **Subject-specific conceptual strands** (not just topics)

---

## 📋 Remaining Work (Backlog)

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

### MCP Tool Ideas

| Tool | Purpose |
|------|---------|
| `search-by-thread` | Search within a specific thread |
| `get-progression` | Get ordered units for a thread |
| `find-prerequisites` | What should be taught before X? |
| `find-next-steps` | What comes after X? |

### UX Concepts

**Progression Breadcrumb**:

```text
🧵 Number: Fractions
   Year 3 → Year 4 → [Year 5: This Lesson] → Year 6 → Year 7
```

**Thread Filter Chips**:

```text
🔍 "fractions"
   [All Threads] [Number ✓] [Ratio & Proportion] [Algebra]
```

---

## Implementation Notes

The foundational data is in place. Advanced features should be driven by:
1. User research showing demand for progression queries
2. MRR improvement experiments
3. MCP tool requirements

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-097](../../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context enrichment architecture |
| [roadmap.md](../../roadmap.md) | Master roadmap |
