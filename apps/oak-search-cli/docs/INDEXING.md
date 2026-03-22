# Indexing Playbook

**Last Updated**: 2026-03-22

Use this guide when populating Elasticsearch Serverless with Oak Curriculum data.

## Data sources

- All content flows through `@oaknational/curriculum-sdk`; never perform raw HTTP requests.
- SDK adapters must expose lesson-planning data, canonical URLs, sequences, provenance fields, and suggestion inputs. Run `pnpm sdk-codegen` when SDK schema changes, then rerun `pnpm make` to regenerate search validators and fixtures.

## Canonical URLs

Include canonical URLs in every document to aid traceability and deterministic fixtures:

- Lesson: `https://www.thenational.academy/teachers/lessons/{lesson_slug}`
- Unit: `https://www.thenational.academy/teachers/programmes/{subjectSlug}-{phaseSlug}/units/{unit_slug}`
- Sequence: `https://www.thenational.academy/teachers/programmes/{sequence_slug}/units`
- Subject programmes: `https://www.thenational.academy/teachers/key-stages/{ks}/subjects/{subject_slug}/programmes`

## Index Schema Management

All Elasticsearch index mappings, Zod schemas, and TypeScript types are defined in the SDK at sdk-codegen time.

**NEVER** define mappings or document interfaces in this app. Import from SDK:

```typescript
import type { SearchLessonsIndexDoc } from '@oaknational/sdk-codegen/search';
import { OAK_LESSONS_MAPPING } from '@oaknational/curriculum-sdk/elasticsearch.js';
```

**Documentation**:

- **SDK Field Definitions Guide**: [`packages/sdks/oak-sdk-codegen/code-generation/typegen/search/README.md`](../../../packages/sdks/oak-sdk-codegen/code-generation/typegen/search/README.md)
- **Field Definitions Source**: [`packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/`](../../../packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/)

**Adding a field?**

1. Add to field definitions in SDK
2. Run `pnpm sdk-codegen` from repo root
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
- Semantic: `sequence_semantic` (`semantic_text`) remains in the schema/mapping and is the locked end-state for the sequence document contract, but the current builder path does not yet populate it, so sequence retrieval is lexical-only today. The locked producer design is deterministic: rework sequence indexing so `sequence_semantic` is built from ordered concrete unit content and shared unit-summary data, then fail fast on zero units, missing required summaries, or empty normalised output. [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md) is the permanent contract; the queued follow-up plan carries execution detail until the implementation lands.
- Suggestions: completion payloads for sequence discovery.

## Resilient bulk indexing

- **Batch size**: 250-300 documents per bulk call; adjust if ES returns 413/429 responses.
- **Retry strategy**: exponential backoff (e.g., 1s, 2s, 4s, 8s) with jitter; abort after configurable max attempts and log failure.
- **Idempotence**: carry progress markers (key stage + subject + offset) so reruns continue from the last successful chunk.
- **Logging**: emit structured logs per batch with doc counts, duration, and error summaries; correlate with zero-hit thresholds in dashboards.
- **Alias strategy**: index to versioned write indices (`oak_lessons_v2026-03-07-143022`) using the blue/green lifecycle service. Use `oaksearch admin versioned-ingest` to orchestrate the full cycle (create, ingest, verify, swap, clean up). See [ADR-130](../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md).

### Operational CLI: `validate-aliases` vs `admin count`

These commands answer different questions. Do not treat green alias health as proof that live data matches the latest bulk snapshot.

**`oaksearch admin validate-aliases`** (SDK `validateAliases`) checks **structural** alias health only: for each curriculum index kind, the name must exist in Elasticsearch as an **alias** (not a bare index) and must point at a **non-null** physical index. It does **not** verify document counts, field population, freshness relative to `bulk-downloads/manifest.json`, or agreement with `oak_meta`. See ADR-130 for rollback and promote-time coherence checks.

**`oaksearch admin count`** issues the Elasticsearch **`_count`** API against each **read alias** (e.g. `oak_lessons`). That returns **true parent document** counts and excludes internal nested documents created by `semantic_text` / ELSER chunking (unlike `_cat/indices`, which can inflate counts). The CLI prints a **TOTAL** row that is the **sum** of the six index kinds.

**Interpreting counts**: Live counts follow whatever **versioned physical index** the aliases currently reference (visible as `targetIndex` in `validate-aliases` output, e.g. `oak_lessons_v2026-03-15-134856`). If the bulk manifest's `downloadedAt` is **newer** than that version stamp, **pre-stage** `admin count` can legitimately sit **below** the counts you expect **after** `admin stage` from the current bulk -- until you stage, validate, and promote. Compare like with like: same bulk directory, same stage output, or same promoted version.

**Staged validation**: Do not use `admin count` to validate a newly staged version before promotion; it only reads the live aliases. Use the version returned by `oaksearch admin stage`, treat the stage output as the authoritative staged count evidence, then run the field-readback audit from the **repo root** with an explicit ledger path:

```bash
pnpm tsx apps/oak-search-cli/operations/ingestion/field-readback-audit.ts \
  --ledger .agent/plans/semantic-search/archive/completed/field-gap-ledger.json \
  --target-version <version> \
  --attempts 6 --interval-ms 5000 \
  --emit-json
```

The audit resolves each ledger field against the concrete staged indexes, reports `existsCount` / `missingCount` per field, and exits non-zero if any `must_be_populated` field has zero documents or any mapping is missing. The `--emit-json` flag writes the full `ReadbackAuditResult` to stdout for evidence capture.

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
        const failures = res.items.filter(
          (item): item is { index: { error: unknown } } =>
            'index' in item && item.index !== undefined && item.index.error !== undefined,
        );
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

1. Swap aliases via `oaksearch admin versioned-ingest` (or manually via `oaksearch admin validate-aliases` then the SDK lifecycle service) so read aliases point at the fresh versioned indices. See [ADR-130](../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md).
2. Increment and persist `SEARCH_INDEX_VERSION` (environment variable or config store) -- the app will not mutate this automatically.
3. Call `revalidateTag` for the new version to flush cached search/suggestion results.
4. Trigger rollup rebuild (`GET /api/rebuild-rollup`) if not already part of the ingest run.
5. Capture metrics: total docs per index, duration, retry count, zero-hit baseline.

## Optional production search smoke

This section documents a manual smoke procedure for verifying search filter
behaviour against live production indexes after `admin promote`. It is intended
for operator use only and is **not** part of `pnpm test` or default CI -- it
requires live credentials and a running production cluster.

### Prerequisites

- Prod MCP credentials **or** direct ES credentials for the production cluster.
- The `search` MCP tool available on the production MCP server, **or** a local
  `oaksearch` CLI configured with production ES credentials.

### Query matrix

Run each query and compare results against the expected behaviour described.

#### Baseline retrieval (one per scope)

Verify basic retrieval returns non-empty results for each search scope:

**Lessons baseline**:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "size": 10
}
```

Expected: `total > 0`, hits array non-empty.

**Units baseline**:

```json
{
  "scope": "units",
  "query": "energy",
  "subject": "science",
  "keyStage": "ks3",
  "size": 10
}
```

Expected: `total > 0`, hits array non-empty.

**Sequences baseline**:

```json
{
  "scope": "sequences",
  "query": "maths",
  "size": 10
}
```

Expected: `total > 0`, hits include known sequences (e.g. `maths-primary`, `maths-secondary`).

**Threads baseline**:

```json
{
  "scope": "threads",
  "subject": "maths",
  "keyStage": "ks2",
  "size": 10
}
```

Expected: `total > 0`, hits array non-empty.

#### F1 reproduction: `threadSlug` filter on lessons

This reproduces [finding F1](../../../.agent/plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md#f1---threadslug-filter-on-lessons-returns-empty-unexpectedly) -- verify that `threadSlug` narrows baseline results rather than collapsing to zero:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "threadSlug": "number-fractions",
  "size": 10
}
```

Expected: `total > 0`, returned lessons include `"number-fractions"` in their
`thread_slugs` array. If `total = 0`, the production index may still contain
stale data predating the `thread_slugs` pipeline fix -- compare the alias
`targetIndex` version against the fix commit date.

#### F2 reproduction: `category` filter on sequences

This reproduces [finding F2](../../../.agent/plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md#f2---category-filter-on-sequences-appears-non-functional) -- verify that an invalid category returns zero results:

```json
{
  "scope": "sequences",
  "query": "maths",
  "category": "nonexistentzzz",
  "size": 10
}
```

Expected: `total = 0` **and** an empty hits array. If results still appear,
`category_titles` may be empty in indexed documents -- check whether the alias
points at an index version that postdates the `categoryMap` wiring fix.

### Interpretation notes

- **SDK `total` reflects page cardinality, not ES `hits.total`**: `searchLessons`
  and `searchSequences` set `total` to the length of the returned result set
  (post score filter), not the Elasticsearch `hits.total` value. Do not use
  `total` alone to compare "how many matched in the index".
- **Use `admin count` for live alias doc counts**: `oaksearch admin count`
  returns true parent document counts via the ES `_count` API, excluding
  internal nested documents from ELSER chunking.
- **Compare bulk vintage to alias version**: when diagnosing data gaps, check
  the `targetIndex` version stamp from `admin validate-aliases` output against
  the `downloadedAt` timestamp in `bulk-downloads/manifest.json` to confirm
  whether the live index was built from the expected bulk snapshot.

### Explicit exclusion

This smoke procedure is **not** part of `pnpm test`, `pnpm test:e2e`, or any
default CI pipeline. It requires live production credentials and is intended
solely for operator use after `admin promote` to confirm that filter behaviour
matches expectations in the promoted index.

## Troubleshooting

- **Bulk errors**: Inspect `res.items` for mapping issues; ensure payload fields match templates.
- **Timeouts**: Reduce batch size or increase client timeout; verify ES cluster health.
- **Missing metadata**: Confirm SDK exposes required fields; escalate upstream rather than hardcoding fallbacks.
- **Cache staleness**: Confirm `SEARCH_INDEX_VERSION` bumped and `revalidateTag` invoked; check logs for cache key usage.

---

## Related ADRs

| ADR                                                                                                           | Topic                                    |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [ADR-064](../../../docs/architecture/architectural-decisions/064-elasticsearch-mapping-organization.md)       | Elasticsearch Index Mapping Organization |
| [ADR-067](../../../docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md)     | SDK Generated Elasticsearch Mappings     |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)                   | Batch-Atomic Ingestion                   |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)            | Bulk-First Ingestion Strategy            |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)                   | ES Bulk Retry Strategy                   |
| [ADR-130](../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md)                | Blue/Green Index Swapping                |
| [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md) | Sequence Semantic Contract and Ownership |
