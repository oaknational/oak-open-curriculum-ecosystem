# Indexing Playbook

This guide summarises how we populate Elasticsearch Serverless from the Oak Curriculum SDK. Use it alongside `oak-curriculum-hybrid-search-definitive-guide.md` when running or automating ingestion jobs.

## Data sources

All content comes from the Oak Curriculum SDK (`@oaknational/oak-curriculum-sdk`). We never make raw HTTP requests. The SDK provides:

- Lessons (metadata + transcripts)
- Units (metadata, lesson relationships)
- Sequences (phase/subject navigation)
- Canonical URLs for every resource

## Canonical URLs

We index canonical URLs as keywords for traceability:

- Lesson: `https://www.thenational.academy/teachers/lessons/{lesson_slug}`
- Unit: `https://www.thenational.academy/teachers/programmes/{subjectSlug}-{phaseSlug}/units/{unit_slug}`
- Subject programmes: `https://www.thenational.academy/teachers/key-stages/{ks}/subjects/{subject_slug}/programmes`
- Sequence: `https://www.thenational.academy/teachers/programmes/{sequence_slug}/units`

## Field expectations

### Lessons (`oak_lessons`)

- Metadata: `lesson_id`, `lesson_slug`, `lesson_title`, `subject_slug`, `key_stage`
- Relationships: `unit_ids`, `unit_titles`, `unit_count`
- Teacher content: `lesson_keywords`, `key_learning_points`, `misconceptions_and_common_mistakes`, `teacher_tips`, `content_guidance`
- Transcript: `transcript_text` (full text, term vectors)
- Semantic: `lesson_semantic` (text sent verbatim; ES derives the embedding)
- Suggestions: `title_suggest` with `subject` + `key_stage` contexts

### Unit rollup (`oak_unit_rollup`)

- Metadata: `unit_id`, `unit_slug`, `unit_title`, `subject_slug`, `key_stage`
- Lesson relationship: `lesson_ids`, `lesson_count`
- Topical context: `unit_topics` (optional, derived from SDK tags or titles)
- Rollup text: concatenated ~300-character lesson snippets, sentence-aware, stored in `rollup_text`
- Semantic: `unit_semantic` receives `copy_to` from `unit_title` and `rollup_text`
- URLs: `unit_url`, `subject_programmes_url`
- Suggestions: `title_suggest` with contexts

### Units (`oak_units`)

- Mirrors metadata from `oak_unit_rollup` without the rollup snippets. Used for analytics, joins, and facets where large text fields are unnecessary.

### Sequences (`oak_sequences`)

- Titles, phase and subject metadata, `key_stages`, `years`, `unit_slugs`, `thread_slugs`, `category_titles`
- Optional `sequence_semantic` field if semantic recall becomes necessary.

## Bulk indexing helpers

Use the official Elasticsearch JS client with bulk batches of 250–500 documents and exponential backoff on HTTP 429 responses.

```ts
import { Client } from '@elastic/elasticsearch';

const es = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: { apiKey: process.env.ELASTICSEARCH_API_KEY! },
});

type BulkItem = { index: { _index: string; _id: string } } | Record<string, unknown>;

export async function bulkIndex(
  index: string,
  docs: Array<{ id: string; body: Record<string, unknown> }>,
) {
  const body: BulkItem[] = [];
  for (const doc of docs) {
    body.push({ index: { _index: index, _id: doc.id } });
    body.push(doc.body);
  }

  const res = await es.bulk({ refresh: false, body });
  if (res.errors) {
    const failed = res.items.filter((item) => (item as any).index?.error);
    throw new Error(`Bulk indexing had errors (${failed.length}).`);
  }
}
```

## Rollup snippet generation

1. Pull lesson metadata/transcripts for each unit.
2. Extract teacher-facing sections (keywords, key learning points, tips) before falling back to transcript sentences.
3. Trim to ~300 characters per lesson, respecting sentence boundaries.
4. Join with separators (e.g. two newlines) to keep highlights readable.
5. Write the combined text into `rollup_text` and copy to `unit_semantic`.

## Operational cadence

- Run `/api/index-oak` then `/api/rebuild-rollup` on a nightly schedule.
- After updating synonyms or analyser settings, re-run the same endpoints to refresh documents.
- Capture metrics: bulk job duration, number of documents indexed, errors, zero-hit query counts (to inform synonyms).
