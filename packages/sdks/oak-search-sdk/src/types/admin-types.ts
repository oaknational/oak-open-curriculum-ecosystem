/**
 * Admin service types — setup, connection, ingestion, and index metadata.
 */

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

/** Options for setup and reset operations. */
export interface SetupOptions {
  /** Whether to emit verbose progress output. */
  readonly verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Connection and index listing types
// ---------------------------------------------------------------------------

/** Result of an Elasticsearch connectivity check. */
export interface ConnectionStatus {
  /** Whether the connection was successful. */
  readonly connected: boolean;

  /** Elasticsearch cluster name, when connected. */
  readonly clusterName?: string;

  /** Elasticsearch version, when connected. */
  readonly version?: string;

  /** Error message, when connection failed. */
  readonly error?: string;
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

/** Result of a synonym-only update. */
export interface SynonymsResult {
  /** Whether the update was successful. */
  readonly success: boolean;

  /** Number of synonyms in the updated set. */
  readonly count: number;

  /** Error message, when the update failed. */
  readonly error?: string;
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
// Index metadata types
// ---------------------------------------------------------------------------

/**
 * Error type for index metadata operations.
 *
 * Uses a discriminated union on the `type` field for exhaustive matching.
 */
export type IndexMetaError =
  | { readonly type: 'not_found' }
  | { readonly type: 'network_error'; readonly message: string }
  | {
      readonly type: 'mapping_error';
      readonly field: string;
      readonly message: string;
    }
  | {
      readonly type: 'validation_error';
      readonly message: string;
      readonly details: string;
    }
  | { readonly type: 'unknown'; readonly message: string };
