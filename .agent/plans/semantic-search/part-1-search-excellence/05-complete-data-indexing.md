# 05: Complete Data Indexing

**Status**: 📋 PENDING  
**Priority**: High  
**Created**: 2025-12-24  
**Principle**: Index EVERYTHING — ES is a complete view of the curriculum

---

## Overview

This sub-plan tracks the work to ensure ALL available fields from the Oak API are indexed in Elasticsearch. The principle is that Elasticsearch should be a complete view of the curriculum, not just a search engine.

**Why this matters**: Fields that don't contribute to semantic search still have value for:
- Filtering (e.g., `downloads_available` to show only lessons with downloadable assets)
- Display (e.g., `supervision_level` for content warnings)
- Analysis (e.g., tracking which content needs supervision)
- Future features (we don't know what we'll need later)

---

## Completed Work

### Lesson Fields (2025-12-24)

| Field | Type | Source | Status |
|-------|------|--------|--------|
| `supervision_level` | string | `LessonSummaryResponseSchema.supervisionLevel` | ✅ Added |
| `downloads_available` | boolean | `LessonSummaryResponseSchema.downloadsAvailable` | ✅ Added |

---

## Pending Work

### Lesson Fields to Review

Review `LessonSummaryResponseSchema` for any remaining unindexed fields:

- [ ] Verify all fields from API schema are indexed or explicitly excluded with reason

### Lesson Fields to Add

| Field | Type | Source | Status | Priority |
|-------|------|--------|--------|----------|
| `phase_slug` | string | Derive from key stage | 📋 Planned | High |

### Unit Fields to Add

| Field | Type | Source | Status | Priority |
|-------|------|--------|--------|----------|
| `notes` | string | `UnitSummaryResponseSchema.notes` | 📋 Planned | High |
| `lesson_order` | number | `UnitSummaryResponseSchema.unitLessons[].lessonOrder` | 📋 Planned | High |
| `phase_slug` | string | Derive from key stage | 📋 Planned | High |

### Thread Fields to Add

| Field | Type | Source | Status | Priority |
|-------|------|--------|--------|----------|
| `unit_order` | number | `ThreadUnitsResponseSchema.unitOrder` | 📋 Planned | High |

### Fields Review Checklist

- [ ] Verify all `LessonSummaryResponseSchema` fields indexed or explicitly excluded
- [ ] Verify all `UnitSummaryResponseSchema` fields indexed or explicitly excluded
- [ ] Verify all `ThreadUnitsResponseSchema` fields indexed or explicitly excluded

---

## How to Add a New Field

1. **Add field definition** in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`
2. **Run `pnpm type-gen`** to regenerate Zod schemas and ES mappings
3. **Update document transform** in `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.ts`
4. **Update document creation** in `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`
5. **Run quality gates** to verify all changes

---

## Related Documents

- [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) - Fundamentals-first strategy
- [Cardinal Rule](../../../directives-and-memory/rules.md) - All types from schema at compile time


