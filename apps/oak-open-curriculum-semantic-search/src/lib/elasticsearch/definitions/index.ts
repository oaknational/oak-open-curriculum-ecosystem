/**
 * Elasticsearch index definitions for Oak Curriculum Search.
 *
 * This directory contains JSON mapping files for all search indexes.
 * These are static definitions, not generated code.
 *
 * @module lib/elasticsearch/definitions
 *
 * ## Index Inventory
 *
 * | Index | File | Purpose |
 * |-------|------|---------|
 * | `oak_lessons` | `oak-lessons.json` | Lesson documents with semantic embeddings |
 * | `oak_unit_rollup` | `oak-unit-rollup.json` | Unit aggregated content for search |
 * | `oak_units` | `oak-units.json` | Basic unit metadata |
 * | `oak_sequences` | `oak-sequences.json` | Programme sequence documents |
 * | `oak_sequence_facets` | `oak-sequence-facets.json` | Sequence facet navigation data |
 *
 * ## Synonyms
 *
 * Synonyms are NOT stored here. The single source of truth is:
 * `@oaknational/oak-curriculum-sdk/mcp/ontology-data.ts` → `ontologyData.synonyms`
 *
 * Use `buildElasticsearchSynonyms()` from `@oaknational/oak-curriculum-sdk` to
 * generate ES-compatible synonym sets.
 *
 * ## Future Indexes (planned)
 *
 * | Index | Purpose |
 * |-------|---------|
 * | `oak_threads` | Thread documents for thread-centric search |
 * | `oak_ontology` | Domain knowledge for RAG |
 * | `oak_lesson_transcripts` | Chunked transcripts for deep retrieval |
 * | `oak_content_guidance` | Safeguarding/content warnings |
 * | `oak_lesson_planning` | Pedagogical context |
 * | `oak_assets` | Resource discovery |
 */

// This module exists for documentation purposes.
// The JSON files are imported directly where needed.
export {};
