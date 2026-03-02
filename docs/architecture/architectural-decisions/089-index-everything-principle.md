# ADR-089: Index Everything Principle for Elasticsearch

**Status**: Accepted  
**Date**: 2025-12-29  
**Related**: [ADR-067](067-sdk-generated-elasticsearch-mappings.md), [ADR-064](064-elasticsearch-mapping-organization.md)

## Context

When designing Elasticsearch indices for the Oak Curriculum, a strategic decision was needed about what to index:

1. **Minimal indexing**: Only index fields directly needed for current search functionality
2. **Complete indexing**: Index all available fields from the Oak API, whether or not they have immediate search utility

The curriculum data includes many fields beyond searchable content:

- Operational fields: `downloadsAvailable`, `supervisionLevel`
- Structural fields: `unitLessons[].lessonOrder`, `notes`
- Classification fields: `phaseSlug`, derived from key stage
- Reference fields: links to related resources

## Decision

**Elasticsearch is not just a search engine — it is a complete view onto the curriculum data.**

All fields from the Oak API that pass through our ingestion pipeline should be indexed in Elasticsearch, whether or not they have immediate search utility.

### Principle Statement

> Index EVERYTHING that the upstream API provides. Elasticsearch should contain a complete, queryable representation of the Oak Curriculum — not a reduced subset.

### Implementation Rules

1. **New fields from API schema changes** must be added to ES mappings
2. **Fields can be explicitly excluded** only with documented rationale
3. **Excluded fields must be tracked** in a central location
4. **No field is "too operational"** — filtering, display, and analysis all benefit

## Rationale

### 1. Filtering Use Cases

Fields that don't contribute to semantic search still enable powerful filtering:

- `downloadsAvailable`: Show only lessons with downloadable assets
- `supervisionLevel`: Filter by content requiring adult supervision
- `tiers`: Filter by foundation/higher

### 2. Display Use Cases

Search results need more than just matching — they need context:

- `notes`: Unit notes for display
- `lessonOrder`: Position in unit for ordering
- `teacherTips`: Pedagogical context

### 3. Analysis Use Cases

Understanding curriculum coverage and structure:

- Which subjects have supervision-required content?
- What's the average unit size by key stage?
- Which lessons lack downloads?

### 4. Future-Proofing

We don't know what we'll need tomorrow. Re-indexing is expensive and requires:

- Bulk download re-processing
- API calls for enrichment
- Downtime or parallel index creation

By indexing everything now, future features become SQL-like queries rather than infrastructure projects.

### 5. The Cost is Minimal

Elasticsearch is designed for document storage. The marginal cost of additional fields is negligible compared to:

- Re-ingestion time (hours to days)
- API rate limit consumption
- Developer time for schema updates

## Consequences

### Positive

- **No re-indexing for new features**: Queries against existing data work immediately
- **Complete API parity**: ES can serve as a read-optimised cache
- **Analyst-friendly**: Ad-hoc queries via Kibana/Playground
- **Filter composition**: Any field can participate in filters

### Negative

- **Larger index size**: ~10-20% more storage per document
- **Schema maintenance**: Must track API schema changes
- **Mapping complexity**: More fields to manage

### Mitigation

- Use SDK-generated mappings (ADR-067) to track schema changes automatically
- Monitor index size and implement lifecycle policies if needed
- Document excluded fields with rationale

## Examples

### Before (Minimal Indexing)

```typescript
// Only searchable fields
{
  lesson_title: "Expanding single brackets",
  lesson_keywords: ["algebra", "brackets"],
  key_stage: "ks4"
}
```

### After (Complete Indexing)

```typescript
{
  lesson_title: "Expanding single brackets",
  lesson_keywords: ["algebra", "brackets"],
  key_stage: "ks4",
  // Plus operational fields
  supervision_level: "no-supervision-required",
  downloads_available: true,
  // Plus structural fields
  lesson_order: 3,
  phase_slug: "secondary",
  // Plus reference fields
  unit_notes: "Students should be familiar with...",
  teacher_tips: [{ tip: "Common misconception: ...", context: "warning" }]
}
```

## Related Decisions

- **[ADR-067](067-sdk-generated-elasticsearch-mappings.md)**: SDK generates ES mappings from API schema
- **[ADR-064](064-elasticsearch-mapping-organization.md)**: Index organisation per resource type
- **[ADR-069](069-systematic-ingestion-progress-tracking.md)**: Systematic ingestion with progress tracking

## Change Log

| Date       | Change                                                       |
| ---------- | ------------------------------------------------------------ |
| 2025-12-29 | Created — formalises principle from semantic-search planning |
