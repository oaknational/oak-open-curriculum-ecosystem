/**
 * Elasticsearch index definitions for Oak Curriculum Search.
 *
 * Index mappings are now generated at SDK sdk-codegen time and imported from:
 * `@oaknational/curriculum-sdk/types/generated/search/es-mappings/`
 *
 * ## Index Inventory
 *
 * | Index | SDK Export | Purpose |
 * |-------|------------|---------|
 * | `oak_lessons` | `OAK_LESSONS_MAPPING` | Lesson documents with semantic embeddings |
 * | `oak_unit_rollup` | `OAK_UNIT_ROLLUP_MAPPING` | Unit aggregated content for search |
 * | `oak_units` | `OAK_UNITS_MAPPING` | Basic unit metadata |
 * | `oak_sequences` | `OAK_SEQUENCES_MAPPING` | Programme sequence documents |
 * | `oak_sequence_facets` | `OAK_SEQUENCE_FACETS_MAPPING` | Sequence facet navigation data |
 * | `oak_threads` | `OAK_THREADS_MAPPING` | Thread documents for progression-centric search |
 * | `oak_meta` | `OAK_META_MAPPING` | Ingestion metadata |
 *
 * ## Synonyms
 *
 * Synonyms are NOT stored here. The single source of truth is:
 * `@oaknational/sdk-codegen/synonyms` → `synonymsData`
 *
 * Use `buildElasticsearchSynonyms()` from `@oaknational/sdk-codegen/synonyms` to
 * generate ES-compatible synonym sets.
 *
 * ## Future Indexes (planned)
 *
 * | Index | Purpose |
 * |-------|---------|
 * | `oak_ontology` | Domain knowledge for RAG |
 * | `oak_lesson_transcripts` | Chunked transcripts for deep retrieval |
 * | `oak_content_guidance` | Safeguarding/content warnings |
 * | `oak_lesson_planning` | Pedagogical context |
 * | `oak_assets` | Resource discovery |
 */

// This module exists for documentation purposes.
// Mappings are now imported from the SDK in ../setup/index.ts
export {};
