# Indexing Playbook

**Last Updated**: 2026-01-03

Use this guide when populating Elasticsearch Serverless with Oak Curriculum data.

## Data sources

- All content flows through `@oaknational/oak-curriculum-sdk`; never perform raw HTTP requests.
- SDK adapters must expose lesson-planning data, canonical URLs, sequences, provenance fields, and suggestion inputs. Run `pnpm type-gen` when SDK schema changes, then rerun `pnpm make` to regenerate search validators and fixtures.

## Canonical URLs

Include canonical URLs in every document to aid traceability and deterministic fixtures:

- Lesson: `https://www.thenational.academy/teachers/lessons/{lesson_slug}`
- Unit: `https://www.thenational.academy/teachers/programmes/{subjectSlug}-{phaseSlug}/units/{unit_slug}`
- Sequence: `https://www.thenational.academy/teachers/programmes/{sequence_slug}/units`
- Subject programmes: `https://www.thenational.academy/teachers/key-stages/{ks}/subjects/{subject_slug}/programmes`

## Index Schema Management

All Elasticsearch index mappings, Zod schemas, and TypeScript types are defined in the SDK at type-gen time.

**NEVER** define mappings or document interfaces in this app. Import from SDK:

```typescript
import type { SearchLessonsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { OAK_LESSONS_MAPPING } from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
```

**Documentation**:

- **SDK Field Definitions Guide**: [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md`](../../../packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md)
- **Field Definitions Source**: [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/`](../../../packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/)

**Adding a field?**

1. Add to field definitions in SDK
2. Run `pnpm type-gen` from repo root
3. Reset the index
4. Re-ingest data

## Field expectations

### Lessons (`oak_lessons`)

- Identifiers: `lesson_id`, `lesson_slug`, `unit_ids`, `unit_titles`.
- Metadata: `subject_slug`, `key_stage`, `year_groups`, `lesson_keywords`, `key_learning_points`, `misconceptions_and_common_mistakes`, `teacher_tips`, `content_guidance`.
- Transcript: `transcript_text` with `term_vector: with_positions_offsets` for highlights.
- Semantic: `lesson_semantic` (`semantic_text` field) with direct copy of transcript or curated semantic text.
- URLs & provenance: canonical URL, unit canonical URLs, curriculum version, published flags.
- Suggestions: `title_suggest` completion field with contexts `{ subject, key_stage }` and optional `sequence_id`.

### Unit rollup (`oak_unit_rollup`)

- Identifiers: `unit_id`, `unit_slug`, `subject_slug`, `key_stage`, `years`.
- Lessons: `lesson_ids`, `lesson_count` (integer), snippet metadata.
- Snippets: `rollup_text` (~300 characters per lesson, sentence aware) prioritising lesson-planning data before transcript fallback.
- Semantic: `unit_semantic` (`semantic_text` with `copy_to` from title + rollup).
- Facets: `unit_topics`, `phase_slug`, `programme_slug`.
- URLs: `unit_url`, `subject_programmes_url`.
- Suggestions: `title_suggest` with contexts and optional `sequence_id`.

### Units (`oak_units`)

- Mirrors unit identifiers and facets without the heavy rollup text; used for aggregations and analytics.

### Sequences (`oak_sequences`)

- Core fields: `sequence_id`, `sequence_slug`, `sequence_title`, `category_titles`, `phase_slug`, `key_stages`, `years`, canonical URL, unit slugs.
- Semantic (optional): `sequence_semantic` (`semantic_text`) derived from curated descriptions.
- Suggestions: completion payloads for sequence discovery.

## Resilient bulk indexing

- **Batch size**: 250–300 documents per bulk call; adjust if ES returns 413/429 responses.
- **Retry strategy**: exponential backoff (e.g., 1s, 2s, 4s, 8s) with jitter; abort after configurable max attempts and log failure.
- **Idempotence**: carry progress markers (key stage + subject + offset) so reruns continue from the last successful chunk.
- **Logging**: emit structured logs per batch with doc counts, duration, and error summaries; correlate with zero-hit thresholds in dashboards.
- **Alias strategy**: index to versioned write indices (`oak_lessons_v2025-03-16`) then call `pnpm -C apps/oak-search-cli elastic:alias-swap` (wraps `scripts/alias-swap.sh`) once ingestion succeeds.

Example helper (simplified):

```ts
const BATCH_SIZE = 250;

async function indexDocuments({
  client,
  index,
  docs,
}: {
  client: Client;
  index: string;
  docs: Document[];
}) {
  for (const chunk of chunkArray(docs, BATCH_SIZE)) {
    await retry(async () => {
      const body = chunk.flatMap((doc) => [{ index: { _index: index, _id: doc.id } }, doc.body]);
      const res = await client.bulk({ refresh: false, body });
      if (res.errors) {
        const failures = res.items.filter((item) => (item as any).index?.error);
        throw new BulkError(failures);
      }
    });
  }
}
```

## Rollup snippet generation

1. Fetch lessons for each unit using the SDK, including lesson-planning data and transcripts.
2. Prefer lesson-planning data blocks (key learning points, teacher tips) for snippets; fall back to transcript sentences if metadata missing.
3. Trim to ~300 characters per lesson, ensuring sentence boundaries.
4. Concatenate snippets with double newlines; include lesson titles for context if needed.
5. Write combined string to `rollup_text`, copy to `unit_semantic`, and update completion contexts.
6. Log snippet source (metadata vs transcript) for auditing.

## Suggestion payloads

- Lessons/units: include `input` array with title variants (`lesson_title`, `unit_title`), synonyms, teacher phrases; set contexts for subject/key stage.
- Sequences: include sequence title, category titles, year ranges; context by subject and phase.
- Keep payloads concise (<100 characters) to avoid truncation; use British spelling.

## Post-ingestion steps

1. Swap aliases via `pnpm -C apps/oak-search-cli elastic:alias-swap` (shell wrapper around `scripts/alias-swap.sh`) so read aliases point at the fresh indices.
2. Increment and persist `SEARCH_INDEX_VERSION` (environment variable or config store) – the app will not mutate this automatically.
3. Call `revalidateTag` for the new version to flush cached search/suggestion results.
4. Trigger rollup rebuild (`GET /api/rebuild-rollup`) if not already part of the ingest run.
5. Capture metrics: total docs per index, duration, retry count, zero-hit baseline.

## Troubleshooting

- **Bulk errors**: Inspect `res.items` for mapping issues; ensure payload fields match templates.
- **Timeouts**: Reduce batch size or increase client timeout; verify ES cluster health.
- **Missing metadata**: Confirm SDK exposes required fields; escalate upstream rather than hardcoding fallbacks.
- **Cache staleness**: Confirm `SEARCH_INDEX_VERSION` bumped and `revalidateTag` invoked; check logs for cache key usage.

---

## Related ADRs

| ADR                                                                                                       | Topic                                    |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [ADR-064](../../../docs/architecture/architectural-decisions/064-elasticsearch-mapping-organization.md)   | Elasticsearch Index Mapping Organization |
| [ADR-067](../../../docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md) | SDK Generated Elasticsearch Mappings     |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)               | Batch-Atomic Ingestion                   |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)        | Bulk-First Ingestion Strategy            |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)               | ES Bulk Retry Strategy                   |
