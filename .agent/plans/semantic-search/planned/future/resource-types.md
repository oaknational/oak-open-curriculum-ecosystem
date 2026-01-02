# Broader Resource Types

**Status**: 📋 Backlog  
**Parent**: [README.md](../README.md) | [roadmap.md](../../roadmap.md)  
**Priority**: Low (Post-MVP)  
**Dependencies**: SDK extraction complete

> **Note**: Overlaps with [advanced-features.md](advanced-features.md) Phase 14. Consider consolidating.

---

## Goal

Index additional resource types beyond lessons and units for comprehensive search.

---

## Resource Types

| Resource Type | Source | Search Use Cases |
|---------------|--------|------------------|
| **Sequences** | `/sequences` API | Browse Year 7 Science curriculum |
| **Worksheets** | `/lessons/{lesson}/assets` | Find downloadable worksheets |
| **Quizzes** | `/lessons/{lesson}/quiz` | Find assessment questions |
| **Transcripts** | Already indexed | Deep content search |

---

## Proposed Schemas

### Sequence Document (Enhanced)

```typescript
interface SequenceDocument {
  sequence_slug: string;
  sequence_title: string;
  subject_slug: string;
  phase_slug: string;
  key_stages: string[];
  years: string[];
  unit_slugs: string[];
  unit_count: number;
  lesson_count: number;
  has_ks4_options: boolean;
  sequence_semantic: string;  // ELSER searchable
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

## Implementation Approach

1. Define field definitions in SDK type-gen (schema-first)
2. Create index schemas via `pnpm type-gen`
3. Build ingestion pipeline for each resource type
4. Add unified search endpoint with type faceting

---

## Success Criteria

- [ ] Sequence index enhanced with all fields
- [ ] Asset index created and populated
- [ ] Quiz index created and populated
- [ ] Unified search endpoint working
- [ ] All quality gates pass

---

## Related Documents

- [roadmap.md](../roadmap.md) — Linear execution path
- [Cardinal Rule](../../../directives-and-memory/rules.md) — All types from schema at compile time

