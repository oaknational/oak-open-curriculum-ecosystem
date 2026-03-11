/**
 * Admin service types — setup, connection, ingestion, and index metadata.
 */
import type { SearchIndexKind } from '../internal/index.js';

// ---------------------------------------------------------------------------
// Setup types
// ---------------------------------------------------------------------------

/** Result of an individual index creation or verification. */
export interface IndexSetupResult {
  /** The Elasticsearch index name. */
  readonly indexName: string;

  /** Whether the index was created, already existed, or errored. */
  readonly status: 'created' | 'exists' | 'error';

  /** HTTP status code from Elasticsearch, when available. */
  readonly httpStatus?: number;

  /** Error message, when `status` is `'error'`. */
  readonly error?: string;
}

/** Aggregate result of a full setup or reset operation. */
export interface SetupResult {
  /** Whether the synonym set was created or updated. */
  readonly synonymsCreated: boolean;

  /** Number of synonyms in the synonym set. */
  readonly synonymCount: number;

  /** Per-index setup results. */
  readonly indexResults: readonly IndexSetupResult[];
}

// ---------------------------------------------------------------------------
// Connection and index listing types
// ---------------------------------------------------------------------------

/**
 * Information returned by a successful Elasticsearch connectivity check.
 *
 * When the connection fails, the error is encoded in the `Result`
 * wrapper as an `AdminError` — this type only represents the
 * success case.
 */
export interface ConnectionStatus {
  /** Elasticsearch cluster name. */
  readonly clusterName: string;

  /** Elasticsearch version string (e.g. `'8.17.0'`). */
  readonly version: string;
}

/** Information about a single Elasticsearch index. */
export interface IndexInfo {
  /** The index name. */
  readonly index: string;

  /** Index health status (green/yellow/red). */
  readonly health: string;

  /** Number of documents in the index. */
  readonly docsCount: number;
}

// ---------------------------------------------------------------------------
// Synonym types
// ---------------------------------------------------------------------------

/**
 * Successful result of a synonym-only update.
 *
 * When the update fails, the error is encoded in the `Result`
 * wrapper as an `AdminError` — this type only represents the
 * success case.
 */
export interface SynonymsResult {
  /** Number of synonyms in the updated set. */
  readonly count: number;
}

// ---------------------------------------------------------------------------
// Ingestion types
// ---------------------------------------------------------------------------

/**
 * Options for running data ingestion.
 *
 * The Oak Curriculum SDK client is accepted here rather than in
 * `SearchSdkDeps`, so consumers that never ingest data need not
 * provide one.
 */
export interface IngestOptions {
  /**
   * Path to the directory containing bulk download data.
   *
   * This is the root directory where Oak bulk data files are stored.
   */
  readonly bulkDir: string;

  /**
   * Optional filter to ingest only specific subjects.
   *
   * When provided, only lessons and units belonging to these subjects
   * are processed. When omitted, all subjects are ingested.
   */
  readonly subjectFilter?: readonly string[];

  /** Whether this is a dry run (no data written to Elasticsearch). */
  readonly dryRun?: boolean;

  /** Whether to emit verbose progress output. */
  readonly verbose?: boolean;
}

/** Summary statistics from an ingestion run. */
export interface IngestResult {
  /** Number of bulk data files processed. */
  readonly filesProcessed: number;

  /** Number of lesson documents indexed. */
  readonly lessonsIndexed: number;

  /** Number of unit documents indexed. */
  readonly unitsIndexed: number;

  /** Number of unit rollup documents indexed. */
  readonly rollupsIndexed: number;

  /** Number of thread documents indexed. */
  readonly threadsIndexed: number;

  /** Number of sequence documents indexed. */
  readonly sequencesIndexed: number;

  /** Number of sequence facet documents indexed. */
  readonly sequenceFacetsIndexed: number;
}

// ---------------------------------------------------------------------------
// Doc count verification types
// ---------------------------------------------------------------------------

/** True parent document count for a single index kind. */
export interface IndexDocCount {
  /** The logical index kind (e.g. `'lessons'`, `'threads'`). */
  readonly kind: SearchIndexKind;
  /** The resolved Elasticsearch index name. */
  readonly index: string;
  /** Parent document count from the Elasticsearch `_count` API. */
  readonly count: number;
}

/**
 * Minimum expected document count per index kind.
 *
 * The caller provides a threshold for each search index kind.
 * `verifyDocCounts` compares each index's actual count against
 * its threshold.
 */
export type DocCountExpectations = Readonly<Record<SearchIndexKind, number>>;

/**
 * Per-index verification status.
 *
 * Reports whether a single index passed its minimum doc count
 * threshold, along with the actual and expected counts.
 */
export interface IndexDocCountStatus {
  /** The search index kind (e.g. `'lessons'`, `'units'`). */
  readonly kind: SearchIndexKind;
  /** The concrete Elasticsearch index name. */
  readonly indexName: string;
  /** Whether the actual count meets or exceeds the expected minimum. */
  readonly passed: boolean;
  /** The actual document count in Elasticsearch. */
  readonly actual: number;
  /** The minimum expected document count. */
  readonly expected: number;
}

/**
 * Comprehensive verification result for all index kinds.
 *
 * Contains per-index pass/fail status and a summary flag.
 */
export interface DocCountVerification {
  /** True when every index meets its minimum doc count threshold. */
  readonly allPassed: boolean;
  /** Per-index verification status for each index kind. */
  readonly results: readonly IndexDocCountStatus[];
}

// ---------------------------------------------------------------------------
// Admin error type
// ---------------------------------------------------------------------------

/**
 * Error type for all admin service operations.
 *
 * Uses a discriminated union on the `type` field for exhaustive matching.
 * Consumers inspect `result.ok` and then narrow via `error.type`.
 */
export type AdminError =
  | {
      /** An Elasticsearch communication or transport error. */
      readonly type: 'es_error';
      /** Human-readable description of the ES error. */
      readonly message: string;
      /** HTTP status code from Elasticsearch, when available. */
      readonly statusCode?: number;
    }
  | {
      /** The requested resource was not found in Elasticsearch. */
      readonly type: 'not_found';
      /** Human-readable description of what was not found. */
      readonly message: string;
    }
  | {
      /** An Elasticsearch mapping conflict or strict dynamic mapping error. */
      readonly type: 'mapping_error';
      /** Human-readable description of the mapping error. */
      readonly message: string;
      /** The field that caused the mapping error, when identifiable. */
      readonly field?: string;
    }
  | {
      /** The input or response failed validation. */
      readonly type: 'validation_error';
      /** Human-readable description of the validation failure. */
      readonly message: string;
      /** Detailed information about the validation failure, when available. */
      readonly details?: string;
    }
  | {
      /** A data source or API failure during data acquisition (e.g. KS4 supplementation). */
      readonly type: 'data_source_error';
      /** Human-readable description of the data source failure. */
      readonly message: string;
    }
  | {
      /** An error that does not fit the other categories. */
      readonly type: 'unknown';
      /** Human-readable description of the unexpected error. */
      readonly message: string;
    };
