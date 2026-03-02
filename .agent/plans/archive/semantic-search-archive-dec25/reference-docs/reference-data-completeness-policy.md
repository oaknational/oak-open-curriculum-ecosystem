# Data Completeness Policy: What We Upload in Full

**Date**: 2025-12-07  
**Status**: ACTIVE POLICY  
**Purpose**: Document which fields are uploaded completely vs. summarized

---

## Policy Statement

**We upload ALL available curriculum data in full, without truncation or sampling, except where intentional summarization serves a specific architectural purpose.**

---

## ✅ Fields Uploaded in Full (No Truncation)

### `oak_lessons` Index

| Field                                | Data Type | Source                           | Completeness                                           |
| ------------------------------------ | --------- | -------------------------------- | ------------------------------------------------------ |
| `transcript_text`                    | Text      | API: `getLessonTranscript()`     | ✅ **FULL** - Complete transcript, no length limits    |
| `lesson_title`                       | Text      | API: `lessonTitle`               | ✅ **FULL**                                            |
| `lesson_keywords`                    | Array     | API: `keywords[]`                | ✅ **ALL** keywords                                    |
| `lesson_keywords_detailed`           | Nested    | API: `lessonKeywords[]`          | ✅ **ALL** keyword objects with definitions (Phase 2B) |
| `key_learning_points`                | Array     | API: `keyLearningPoints[]`       | ✅ **ALL** points                                      |
| `misconceptions_and_common_mistakes` | Array     | API: `misconceptions[]`          | ✅ **ALL** misconceptions                              |
| `misconception_responses`            | Array     | API: `misconceptions[].response` | ✅ **ALL** responses (Phase 2B)                        |
| `teacher_tips`                       | Array     | API: `teacherTips[]`             | ✅ **ALL** tips                                        |
| `content_guidance`                   | Array     | API: `contentGuidance[]`         | ✅ **ALL** guidance                                    |
| `pupil_lesson_outcome`               | Text      | API: `pupilLessonOutcome`        | ✅ **FULL** (Phase 2B)                                 |
| `quiz_questions_text`                | Array     | API: `starterQuiz`, `exitQuiz`   | ✅ **ALL** question text (Phase 2B)                    |

### `oak_units` Index

| Field                          | Data Type | Source                              | Completeness                         |
| ------------------------------ | --------- | ----------------------------------- | ------------------------------------ |
| `unit_title`                   | Text      | API: `unitTitle`                    | ✅ **FULL**                          |
| `unit_topics`                  | Array     | API: `categories[]`                 | ✅ **ALL** topics                    |
| `lesson_ids`                   | Array     | API: `unitLessons[]`                | ✅ **ALL** lessons                   |
| `prior_knowledge_requirements` | Array     | API: `priorKnowledgeRequirements[]` | ✅ **ALL** requirements (Phase 2B)   |
| `national_curriculum_content`  | Array     | API: `nationalCurriculumContent[]`  | ✅ **ALL** statements (Phase 2B)     |
| `why_this_why_now`             | Text      | API: `whyThisWhyNow`                | ✅ **FULL** (Phase 2B)               |
| `threads`                      | Nested    | API: `threads[]`                    | ✅ **ALL** thread objects (Phase 2B) |
| `unit_notes`                   | Text      | API: `notes`                        | ✅ **FULL** (Phase 2B)               |
| `unit_description`             | Text      | API: `description`                  | ✅ **FULL** (Phase 2B)               |

### `oak_sequences` Index

| Field             | Data Type | Source                                                                      | Completeness            |
| ----------------- | --------- | --------------------------------------------------------------------------- | ----------------------- |
| `sequence_slug`   | Text      | API: `/subjects/{subject}/sequences` → `sequenceSlug`                       | ✅ **FULL**             |
| `sequence_title`  | Text      | **Constructed**: `${subjectTitle} ${phaseTitle}`                            | ✅ Derived              |
| `subject_slug`    | Text      | From ingestion context (known at call time)                                 | ✅ Available            |
| `subject_title`   | Text      | API: `/subjects` → `subjectTitle`                                           | ✅ **FULL**             |
| `phase_slug`      | Text      | API: `/subjects/{subject}/sequences` → `phaseSlug`                          | ✅ **FULL**             |
| `phase_title`     | Text      | API: `/subjects/{subject}/sequences` → `phaseTitle`                         | ✅ **FULL**             |
| `key_stages`      | Array     | API: `/subjects/{subject}/sequences` → `keyStages[].keyStageSlug`           | ✅ **ALL**              |
| `years`           | Array     | API: `/subjects/{subject}/sequences` → `years[]`                            | ✅ **ALL**              |
| `unit_slugs`      | Array     | API: `/sequences/{seq}/units` → `units[].unitSlug`                          | ✅ **ALL** units        |
| `category_titles` | Array     | Aggregated: `/sequences/{seq}/units` → `units[].categories[].categoryTitle` | ✅ **ALL** (aggregated) |

### `oak_threads` Index

| Field           | Data Type | Source                                              | Completeness |
| --------------- | --------- | --------------------------------------------------- | ------------ |
| `thread_slug`   | Text      | API: `/threads` → `slug`                            | ✅ **FULL**  |
| `thread_title`  | Text      | API: `/threads` → `title`                           | ✅ **FULL**  |
| `unit_count`    | Number    | **Calculated**: count from unit extraction          | ✅ Derived   |
| `subject_slugs` | Array     | **Aggregated**: from unit summaries (`subjectSlug`) | ✅ Derived   |
| `thread_url`    | Text      | **Constructed**: canonical URL                      | ✅ Derived   |

---

## ⚠️ Intentional Summarization (By Design)

### `rollup_text` in `oak_unit_rollup`

**What**: Unit-level summary field combining lesson-planning data  
**How**: ~300 characters per lesson  
**Why**:

- Unit-level search surface (not lesson-level)
- Prevents index bloat (full transcripts in `oak_lessons`)
- Prioritizes pedagogical content over full transcripts
- Teachers search units by learning objectives, not full text

**Source Hierarchy**:

1. **Preferred**: `key_learning_points` → `teacher_tips` → `lesson_keywords`
2. **Fallback**: First ~300 chars of transcript (only if metadata missing)

**Full Data Availability**: Complete lesson details (including full transcripts) remain searchable in `oak_lessons` index.

---

## Implementation Evidence

### Code Reference: Full Transcript Upload

```typescript
// File: apps/oak-search-cli/src/lib/indexing/document-transforms.ts
// Lines 96-136

export function createLessonDocument({
  lesson,
  transcript, // ← Full transcript from API
  summary,
  // ...
}: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  // ...
  return {
    // ...
    transcript_text: transcript, // ← FULL transcript, NO sampling
    // ...
  };
}
```

### What `extractPassage()` Actually Does

The `extractPassage()` utility function exists in the codebase but is **ONLY** used for:

1. Error messages (when lesson-planning data is missing)
2. Unit tests
3. Archived scaffolding code

**It is NOT used for data storage.**

```typescript
// File: document-transforms.ts
export function extractPassage(text: string): string {
  // Truncates to 300 chars - ONLY for error messages
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/u);
  const pick = sentences.slice(0, 2).join(' ');
  return pick.slice(0, 300);
}

// Usage: ONLY in error messages
throw new Error(
  `Lesson planning data missing for ${lessonTitle}; 
   Transcript excerpt: ${extractPassage(transcript)}`,
);
```

---

## Verification After Ingestion

### Quality Gates

After any ingestion, verify data completeness:

```bash
# 1. Check transcript lengths
GET oak_lessons/_search
{
  "size": 100,
  "_source": ["lesson_id", "lesson_title"],
  "script_fields": {
    "transcript_length": {
      "script": {
        "source": "params._source.transcript_text?.length() ?: 0"
      }
    }
  }
}

# Expected: Most lessons 2000-5000 characters
# Quality Gate: >95% of lessons have >500 characters

# 2. Check for missing transcripts
GET oak_lessons/_count
{
  "query": {
    "bool": {
      "must_not": { "exists": { "field": "transcript_text" } }
    }
  }
}

# Expected: 0 (all lessons should have transcripts)

# 3. Check array field completeness
GET oak_lessons/_search
{
  "size": 0,
  "aggs": {
    "avg_keywords": { "avg": { "script": "doc['lesson_keywords'].size()" } },
    "avg_learning_points": { "avg": { "script": "doc['key_learning_points'].size()" } },
    "avg_misconceptions": { "avg": { "script": "doc['misconceptions_and_common_mistakes'].size()" } }
  }
}

# Expected: Non-zero averages (indicates data is present)
```

### Manual Spot Checks

After Maths KS4 ingestion:

1. **Pick 5 random lessons**
2. **Compare `transcript_text` length in ES with API response**
3. **Verify arrays (`lesson_keywords`, etc.) match API**
4. **Confirm no truncation markers** (no "..." or "[truncated]")

**Pass Criteria**: 100% match between API and ES for all checked fields.

---

## Future Considerations

### When Summarization May Be Needed

**Acceptable summarization scenarios** (must be documented):

1. **Performance**: Field >10MB requires chunking (rare for curriculum)
2. **UX**: Display summaries (but store full data)
3. **Cost**: Embedding APIs charge per token (summarize for embeddings, keep full text)

**Process for adding summarization**:

1. Document in this file WHY summarization is needed
2. Prove full data is preserved elsewhere
3. Add verification queries
4. Update ADR

---

## Related Documents

- **Hybrid Field Strategy**: `.agent/plans/semantic-search/hybrid-field-strategy.md`
- **Phase 4 Deferred Fields**: `.agent/plans/semantic-search/phase-4-deferred-fields.md`
- **ROLLUP.md**: `apps/oak-search-cli/docs/ROLLUP.md`
- **INDEXING.md**: `apps/oak-search-cli/docs/INDEXING.md`

---

## Change Log

| Date       | Change         | Reason                                    |
| ---------- | -------------- | ----------------------------------------- |
| 2025-12-07 | Policy created | User request to clarify data completeness |
