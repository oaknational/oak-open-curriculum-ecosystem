# Broader Resource Types

**Status**: 📋 Backlog — No clear timeline
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Priority**: Low — Document ideas for future consideration
**Dependencies**: SDK extraction complete

> **Note**: Overlaps with [advanced-features.md](../post-sdk-extraction/advanced-features.md). Consider consolidating when work begins.

---

## Goal

Index additional resource types beyond lessons and units for comprehensive search.

---

## Resource Types

| Resource Type   | Source                     | Search Use Cases                  |
| --------------- | -------------------------- | --------------------------------- |
| **Sequences**   | `/sequences` API           | Browse Year 7 Science curriculum  |
| **Worksheets**  | `/lessons/{lesson}/assets` | Find downloadable worksheets      |
| **Quizzes**     | `/lessons/{lesson}/quiz`   | Find assessment questions         |
| **Transcripts** | Already indexed            | Deep content search               |

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

## Unified Search Endpoint

Search across all resource types with type faceting:

```typescript
GET /api/search?q=pythagoras&types=lesson,unit,worksheet
```

---

## Implementation Approach

1. Define field definitions in SDK type-gen (schema-first)
2. Create index schemas via `pnpm type-gen`
3. Build ingestion pipeline for each resource type
4. Add unified search endpoint with type faceting

---

## When to Prioritize

Promote from backlog when:

1. User research shows demand for asset/quiz search
2. Teacher feedback indicates resource discovery needs
3. SDK extraction is complete and stable

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../roadmap.md)                                                                | Linear execution path |
| [Cardinal Rule](../../../directives-and-memory/rules.md)                                      | Types from schema    |
| [../post-sdk-extraction/advanced-features.md](../post-sdk-extraction/advanced-features.md)    | Overlapping content  |

