/**
 * Types for the index lifecycle service (ADR-130).
 *
 * Separates the blue/green index lifecycle from the admin service,
 * keeping each service bounded and focused.
 */

import type { Result } from '@oaknational/result';
import type { Logger } from '@oaknational/logger';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type { AdminError, IngestOptions, IngestResult } from './admin-types.js';
import type { SearchIndexTarget, SearchIndexKind } from '../internal/index.js';

// --- Alias operation types — canonical definitions for the lifecycle layer ---

/**
 * A single alias swap action. When `fromIndex` is `null`, the alias is being
 * created for the first time (no `remove` action needed).
 *
 * When `bareIndexToRemove` is set, a bare concrete index with that name must
 * be atomically removed via `remove_index` before the alias can be created.
 * This handles the first-run migration from bare indexes to alias-backed
 * versioned indexes (ADR-130).
 */
export interface AliasSwap {
  /** Physical index to remove the alias from, or `null` for first-time setup. */
  readonly fromIndex: string | null;
  /** Physical index to add the alias to. */
  readonly toIndex: string;
  /** The alias name (e.g. `'oak_lessons'`). */
  readonly alias: string;
  /** Bare concrete index to atomically delete before creating the alias. First-run migration only. */
  readonly bareIndexToRemove?: string;
}

/**
 * Current state of an alias name in Elasticsearch. Discriminated union on `isAlias`:
 * `true` — alias pointing to `targetIndex`; `isBareIndex` is always `false`.
 * `false` — not an alias; `isBareIndex` distinguishes a bare concrete index
 * blocking alias creation from a non-existent name (ADR-130).
 */
export type AliasTargetInfo =
  | { readonly isAlias: true; readonly targetIndex: string; readonly isBareIndex: false }
  | { readonly isAlias: false; readonly targetIndex: null; readonly isBareIndex: boolean };

/** Strict map from each {@link SearchIndexKind} to its alias target info. */
export type AliasTargetMap = Readonly<Record<SearchIndexKind, AliasTargetInfo>>;

// --- Versioned ingest ---

/** Options for a versioned ingest cycle (also used by stage). */
export interface VersionedIngestOptions {
  /** Path to the directory containing bulk download data. */
  readonly bulkDir: string;
  /** Optional filter to ingest only specific subjects. */
  readonly subjectFilter?: readonly string[];
  /** Whether to emit verbose progress output. */
  readonly verbose?: boolean;
  /** Minimum expected doc count per index. Defaults to 1. */
  readonly minDocCount?: number;
}

/**
 * Result of a successful versioned ingest cycle.
 */
export interface VersionedIngestResult {
  /** The version string used for the new indexes. */
  readonly version: string;
  /** Ingest statistics from the bulk load. */
  readonly ingestResult: IngestResult;
  /** Previous version that was live before the swap, or null if first run. */
  readonly previousVersion: string | null;
  /** Number of old index generations deleted during cleanup. */
  readonly indexesCleanedUp: number;
  /** Number of old index generations that failed to delete during cleanup. */
  readonly cleanupFailures: number;
}

// ---------------------------------------------------------------------------
// Stage and promote
// ---------------------------------------------------------------------------

/**
 * Result of a successful stage operation. The returned version can later be
 * passed to {@link IndexLifecycleService.promote}.
 */
export interface StageResult {
  /** The version string for the newly staged indexes. */
  readonly version: string;
  /** Ingest statistics from the bulk load. */
  readonly ingestResult: IngestResult;
  /** The version currently live (from metadata), or null if first run. */
  readonly previousVersion: string | null;
}

/**
 * Result of a successful promote operation. Promotion swaps aliases to a
 * previously staged version, writes metadata, and cleans up old generations.
 */
export interface PromoteResult {
  /** The version that is now live. */
  readonly version: string;
  /** The version that was live before promotion, or null if first run. */
  readonly previousVersion: string | null;
  /** Number of old index generations deleted during cleanup. */
  readonly indexesCleanedUp: number;
  /** Number of old index generations that failed to delete during cleanup. */
  readonly cleanupFailures: number;
}

// ---------------------------------------------------------------------------
// Rollback
// ---------------------------------------------------------------------------

/**
 * Result of a successful rollback operation.
 */
export interface RollbackResult {
  /** The version that is now live after rollback. */
  readonly rolledBackToVersion: string;
  /** The version that was removed from live duty. */
  readonly rolledBackFromVersion: string;
}

// ---------------------------------------------------------------------------
// Alias validation
// ---------------------------------------------------------------------------

/**
 * Health status of an individual alias.
 */
export interface AliasHealthEntry {
  /** The alias name. */
  readonly alias: string;
  /** Whether the alias exists and points to a valid index. */
  readonly healthy: boolean;
  /** The physical index the alias points to, or null if unhealthy. */
  readonly targetIndex: string | null;
  /** Human-readable description of any issue. */
  readonly issue?: string;
}

/**
 * Result of alias health validation.
 */
export interface AliasValidationResult {
  /** Whether all aliases are healthy. */
  readonly allHealthy: boolean;
  /** Per-alias health entries. */
  readonly entries: readonly AliasHealthEntry[];
}

// ---------------------------------------------------------------------------
// Dependency injection interface
// ---------------------------------------------------------------------------

/**
 * Injected dependencies for the index lifecycle service.
 *
 * Each dependency is a function or value — simple fakes replace them
 * in tests without vi.mock (ADR-078).
 */
export interface IndexLifecycleDeps {
  /** Create all 6 curriculum indexes with versioned names. */
  readonly createVersionedIndexes: (version: string) => Promise<Result<void, AdminError>>;
  /** Run bulk ingest into versioned indexes. */
  readonly runVersionedIngest: (
    version: string,
    options: IngestOptions,
  ) => Promise<Result<IngestResult, AdminError>>;
  /** Resolve current alias targets for all curriculum indexes. */
  readonly resolveCurrentAliasTargets: () => Promise<Result<AliasTargetMap, AdminError>>;
  /** Atomically swap aliases. */
  readonly atomicAliasSwap: (swaps: readonly AliasSwap[]) => Promise<Result<void, AdminError>>;
  /** Read current index metadata. */
  readonly readIndexMeta: () => Promise<Result<IndexMetaDoc | null, AdminError>>;
  /** Write index metadata. */
  readonly writeIndexMeta: (meta: IndexMetaDoc) => Promise<Result<void, AdminError>>;
  /** List versioned indexes for a base name. */
  readonly listVersionedIndexes: (
    baseName: string,
    target: SearchIndexTarget,
  ) => Promise<Result<readonly string[], AdminError>>;
  /** Delete a single versioned index. */
  readonly deleteVersionedIndex: (indexName: string) => Promise<Result<void, AdminError>>;
  /** Verify doc counts meet minimum threshold for versioned indexes. */
  readonly verifyDocCounts: (
    version: string,
    minDocCount: number,
  ) => Promise<Result<void, AdminError>>;
  /** Generate a version string (defaults to timestamp-based). */
  readonly generateVersion: () => string;
  /** The index target (primary or sandbox). */
  readonly target: SearchIndexTarget;
  /** Optional logger. */
  readonly logger?: Logger;
}

// ---------------------------------------------------------------------------
// Service interface
// ---------------------------------------------------------------------------

/**
 * Index lifecycle service for blue/green index management (ADR-130).
 *
 * Orchestrates versioned index creation, alias swapping, and rollback.
 * Composes existing building blocks without bloating the core `AdminService`.
 */
export interface IndexLifecycleService {
  /**
   * Run a full versioned ingest cycle:
   * create versioned indexes → ingest → verify → swap aliases → metadata → cleanup.
   */
  readonly versionedIngest: (
    options: VersionedIngestOptions,
  ) => Promise<Result<VersionedIngestResult, AdminError>>;

  /**
   * Stage new versioned indexes without promoting them.
   *
   * Creates indexes, ingests data, and verifies doc counts — but does NOT
   * swap aliases. The returned version can be promoted later via {@link promote}.
   */
  readonly stage: (options: VersionedIngestOptions) => Promise<Result<StageResult, AdminError>>;

  /**
   * Promote a previously staged version by swapping aliases to it.
   *
   * Verifies the staged indexes exist, atomically swaps aliases,
   * writes metadata, and cleans up old index generations.
   */
  readonly promote: (version: string) => Promise<Result<PromoteResult, AdminError>>;

  /**
   * Roll back to the previous version recorded in index metadata.
   */
  readonly rollback: () => Promise<Result<RollbackResult, AdminError>>;

  /**
   * Validate alias health across all curriculum indexes.
   */
  readonly validateAliases: () => Promise<Result<AliasValidationResult, AdminError>>;
}
