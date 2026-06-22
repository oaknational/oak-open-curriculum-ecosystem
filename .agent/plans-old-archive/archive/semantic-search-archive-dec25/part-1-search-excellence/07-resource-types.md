# 07: Broader Resource Types

**Status**: 📋 PENDING  
**Priority**: Medium  
**Created**: 2025-12-24  
**Source**: Extracted from phase-11-plus-future.md (Phase 14)

---

## Overview

Beyond lessons and units, the Oak curriculum includes additional resource types that should be indexed for comprehensive search:

| Resource Type | Source | Search Use Cases |
|---------------|--------|------------------|
| **Sequences** | `/sequences` API | Browse Year 7 Science curriculum |
| **Worksheets** | `/lessons/{lesson}/assets` | Find downloadable worksheets |
| **Quizzes** | `/lessons/{lesson}/quiz` | Find assessment questions |
| **Transcripts** | Already indexed | Deep content search |

---

## Proposed Schemas

### Sequence Document (Enhanced)

Already partially indexed, but should include:

```typescript
interface SequenceDocument {
  sequence_slug: string;
  sequence_title: string;
  subject_slug: string;
  phase_slug: string;           // 'primary' | 'secondary'
  key_stages: string[];
  years: string[];
  unit_slugs: string[];
  unit_count: number;
  lesson_count: number;
  // New fields
  has_ks4_options: boolean;
  sequence_semantic: string;    // ELSER searchable summary
}
```

### Asset Document

```typescript
interface AssetDocument {
  asset_id: string;
  lesson_slug: string;
  unit_slug: string;
  asset_type: 'worksheet' | 'slides' | 'video' | 'supplementary';
  format: 'pdf' | 'pptx' | 'mp4';
  title: string;
  download_url: string;
  subject_slug: string;
  key_stage: string;
}
```

### Quiz Document

```typescript
interface QuizDocument {
  quiz_id: string;
  lesson_slug: string;
  quiz_type: 'starter' | 'exit';
  question_text: string;
  answers: string[];
  correct_answer: string;
  topic_tags: string[];
  subject_slug: string;
  key_stage: string;
}
```

---

## Unified Search Endpoint

Once all resource types are indexed, provide a unified search endpoint:

```
GET /api/search?q=pythagoras&types=lesson,unit,worksheet,quiz
```

With faceting by resource type.

---

## Implementation Approach

1. Define field definitions in SDK type-gen (schema-first)
2. Create index schemas via `pnpm type-gen`
3. Build ingestion pipeline for each resource type
4. Add unified search endpoint with type faceting

---

## Related Documents

- [phase-11-plus-future.md](../phase-11-plus-future.md) - Original detailed plan (Phase 14)
- [Cardinal Rule](../../../directives/principles.md) - All types from schema at compile time


