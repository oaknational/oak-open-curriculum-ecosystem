/**
 * Type definitions for batch ingestion.
 */

import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient } from '../adapters/oak-adapter';
import type { BulkOperations } from './indexing/bulk-operation-types';
import type { SearchIndexKind } from './search-index-target';
import type { DataIntegrityReport } from './indexing/data-integrity-report';
import type { SequenceFacetProcessingMetrics } from './indexing/sequence-facet-index';

// ============================================================================
// Granularity
// ============================================================================

/**
 * Batch granularity configuration.
 *
 * Controls how operations are grouped into batches for dispatch:
 * - `subject-keystage`: One batch per (subject, keyStage) pair (default, ~68 batches)
 * - `subject`: One batch per subject containing all key stages (~17 batches)
 * - `all`: Single batch containing everything (legacy behavior)
 */
export type BatchGranularity =
  | { readonly kind: 'subject-keystage' }
  | { readonly kind: 'subject' }
  | { readonly kind: 'all' };

// ============================================================================
// Batch Types
// ============================================================================

/**
 * A curriculum batch containing operations for indexing.
 *
 * When granularity is `subject-keystage`, subject and keyStage are set.
 * When granularity is `subject`, keyStage is null.
 * When granularity is `all`, both are null.
 */
export interface CurriculumBatch {
  readonly kind: 'curriculum';
  readonly subject: SearchSubjectSlug | null;
  readonly keyStage: KeyStage | null;
  readonly operations: BulkOperations;
  readonly dataIntegrityReport: DataIntegrityReport;
}

/**
 * A threads batch containing cross-curriculum thread operations.
 * Always yielded last after all curriculum batches.
 */
export interface ThreadsBatch {
  readonly kind: 'threads';
  readonly operations: BulkOperations;
  /** Subjects that were ingested, used for thread association. */
  readonly subjects: readonly SearchSubjectSlug[];
}

/** Union type for all batch kinds yielded by the generator. */
export type IngestionBatch = CurriculumBatch | ThreadsBatch;

// ============================================================================
// Generator Options
// ============================================================================

/** Options for the batch generator. */
export interface BatchGeneratorOptions {
  /** The Oak API client for fetching curriculum data. */
  readonly client: OakClient;
  /** Subjects to ingest. */
  readonly subjects: readonly SearchSubjectSlug[];
  /** Key stages to ingest. */
  readonly keyStages: readonly KeyStage[];
  /** Limit to specific index kinds. Empty array means all indexes. */
  readonly indexes?: readonly SearchIndexKind[];
  /** Batch granularity. Defaults to `{ kind: 'subject-keystage' }`. */
  readonly granularity?: BatchGranularity;
  /** Optional callback for sequence facet processing metrics. */
  readonly onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void;
}
