# Rollup Generation Guide

The rollup process produces unit-level documents in `oak_unit_rollup` that power semantic unit search, snippets, and suggestion payloads. This guide outlines the definitive approach.

## Objectives

- Provide teacher-centric snippets that summarise each unit without duplicating full transcripts.
- Populate `rollup_text`, `unit_semantic`, completion payloads, and canonical URLs.
- Support cache invalidation and telemetry after each rebuild.

## Inputs

- Oak Curriculum SDK data: lessons, lesson metadata, transcripts, teacher notes, canonical URLs.
- Configuration: snippet length (~300 characters per lesson), sentence boundary detector, priority ordering for metadata vs transcripts.

## Process steps

1. **Fetch unit context**
   - Retrieve unit metadata plus associated lessons, including teacher metadata and transcripts.
   - Collect canonical URLs for unit and lessons.

2. **Select snippet content**
   - Preferred order per lesson: `key_learning_points` → `teacher_tips` → `lesson_keywords` → fallback transcript sentences.
   - If metadata missing, extract the first sentence matching query context; avoid truncated words.
   - Enforce British spelling; remove HTML tags.

3. **Trim & normalise**
   - Limit each lesson snippet to ≈300 characters; ensure sentences close with punctuation.
   - Append lesson title if needed for clarity.
   - Join snippets with double newlines to aid highlight readability.

4. **Populate rollup document**
   - Set `rollup_text` to concatenated snippets.
   - Copy combined text into `unit_semantic` (`semantic_text`) via `copy_to` or explicit field.
   - Update metadata fields: `lesson_ids`, `lesson_count`, `unit_topics`, `years`, canonical URLs.
   - Refresh completion payload: `title_suggest` with contexts (subject, key_stage, sequence).

5. **Write to Elasticsearch**
   - Index via bulk helper with retry/backoff.
   - Log snippet sources (metadata vs transcript) and total characters for analytics.

6. **Post-write actions**
   - Rotate aliases to point to the new rollup index version.
   - Increment `SEARCH_INDEX_VERSION` and persist it.
   - Call `revalidateTag` for the new version to invalidate cached search/suggestion results.
   - Emit structured telemetry event: `semantic-search.rollup-updated` with unit counts, duration, version.

## Testing & validation

- Unit tests: verify snippet selection logic prioritises teacher metadata and trims correctly.
- Integration tests: ensure ES documents include `rollup_text`, canonical URLs, completion payloads, and semantic fields.
- Observability: confirm logs include version, snippet sources, and zero-hit baseline resets.

## Troubleshooting

- **Missing snippets**: confirm SDK returns the required metadata; escalate upstream before hardcoding.
- **Highlight issues**: ensure `term_vector` and `highlight.max_analyzed_offset` set appropriately; regenerate index mappings if needed.
- **Cache staleness**: verify `SEARCH_INDEX_VERSION` bumped and `revalidateTag` executed; check logs for alias swap success.

Keep this guide in sync with the ingestion pipeline and semantic-search API plan whenever rollup logic changes.
