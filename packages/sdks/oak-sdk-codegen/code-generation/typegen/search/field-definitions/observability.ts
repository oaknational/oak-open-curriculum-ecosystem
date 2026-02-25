/**
 * Field definitions for observability and operational indexes.
 *
 * This module contains field definitions for indexes that track system behaviour
 * and operational data:
 * - **oak_meta**: Ingestion metadata and version tracking
 * - **oak_zero_hit_telemetry**: Zero-result search queries for analysis
 *
 * Observability indexes are distinguished from curriculum indexes:
 * - **Curriculum indexes**: Store educational content (lessons, units, sequences, threads)
 * - **Observability indexes**: Store system behaviour and operational data (metrics, logs, telemetry)
 *
 * These indexes are critical for:
 * - Audit trails (when data was ingested, what was included)
 * - Search quality monitoring (identifying gaps in content coverage)
 * - System health tracking (ingestion performance, error rates)
 *
 * By defining fields ONCE in this module, we ensure that Zod schemas and ES mappings
 * can never diverge, eliminating "strict_dynamic_mapping_exception" errors.
 *
 * @see `./curriculum.ts` for curriculum index definitions
 */

import type { IndexFieldDefinitions } from './types.js';

/**
 * Field definitions for the oak_meta index.
 *
 * This index stores ingestion metadata and version tracking.
 * All ingestion operations write a record here for audit trails.
 *
 * Contains 6 required fields:
 * - version: Timestamp-based version string (e.g., "v2024-01-15-143022")
 * - ingested_at: ISO 8601 timestamp of ingestion completion
 * - subjects: Array of subject slugs included in this ingestion
 * - key_stages: Array of key stages included in this ingestion
 * - duration_ms: Total ingestion time in milliseconds
 * - doc_counts: Object with per-index document counts
 *
 * @see IndexMetaDocSchema
 * @see OAK_META_MAPPING
 */
export const META_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'version', zodType: 'string', optional: false },
  { name: 'ingested_at', zodType: 'string', optional: false },
  { name: 'subjects', zodType: 'array-string', optional: false },
  { name: 'key_stages', zodType: 'array-string', optional: false },
  { name: 'duration_ms', zodType: 'number', optional: false },
  { name: 'doc_counts', zodType: 'object', optional: false },
] as const;

/**
 * Field definitions for the oak_zero_hit_telemetry index.
 *
 * This index stores zero-result search queries for content gap analysis.
 * When a search returns no results, the query is logged here to help identify:
 * - Missing content that teachers/students are looking for
 * - Search quality issues (queries that should match but don't)
 * - Trending topics not yet covered in curriculum
 *
 * Contains 9 fields (5 required, 4 optional):
 * - `@timestamp`: When the zero-hit search occurred (ES date field)
 * - search_scope: Which index was searched (lessons, units, sequences, etc.)
 * - query: The search text that returned no results
 * - filters: Applied filters (key stages, subjects, years) as flattened object
 * - index_version: Which data version was searched against
 * - request_id: Optional correlation ID for distributed tracing
 * - session_id: Optional user session identifier
 * - took_ms: Optional search execution time in milliseconds
 * - timed_out: Optional flag indicating if search timed out
 *
 * @see ZeroHitDocSchema
 * @see OAK_ZERO_HIT_MAPPING
 */
export const ZERO_HIT_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: '@timestamp', zodType: 'string', optional: false },
  { name: 'search_scope', zodType: 'string', optional: false },
  { name: 'query', zodType: 'string', optional: false },
  { name: 'filters', zodType: 'object', optional: false },
  { name: 'index_version', zodType: 'string', optional: false },
  { name: 'request_id', zodType: 'string', optional: true },
  { name: 'session_id', zodType: 'string', optional: true },
  { name: 'took_ms', zodType: 'number', optional: true },
  { name: 'timed_out', zodType: 'boolean', optional: true },
] as const;
