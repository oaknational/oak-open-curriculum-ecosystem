import type { Result } from '@oaknational/result';
import type { Logger } from '@oaknational/logger';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type { AdminError, IngestOptions, IngestResult } from './admin-types.js';
import type { SearchIndexTarget, SearchIndexKind } from '../internal/index.js';
export interface AliasSwap {
  readonly fromIndex: string | null;
  readonly toIndex: string;
  readonly alias: string;
  readonly bareIndexToRemove?: string;
}
export type AliasTargetInfo =
  | { readonly isAlias: true; readonly targetIndex: string; readonly isBareIndex: false }
  | { readonly isAlias: false; readonly targetIndex: null; readonly isBareIndex: boolean };
export type AliasTargetMap = Readonly<Record<SearchIndexKind, AliasTargetInfo>>;
export interface VersionedIngestOptions {
  readonly bulkDir: string;
  readonly subjectFilter?: readonly string[];
  readonly verbose?: boolean;
  readonly minDocCount?: number;
}
export interface VersionedIngestResult {
  readonly version: string;
  readonly ingestResult: IngestResult;
  readonly previousVersion: string | null;
  readonly indexesCleanedUp: number;
  readonly cleanupFailures: number;
}
export interface StageResult {
  readonly version: string;
  readonly ingestResult: IngestResult;
  readonly previousVersion: string | null;
}
export interface PromoteResult {
  readonly version: string;
  readonly previousVersion: string | null;
  readonly indexesCleanedUp: number;
  readonly cleanupFailures: number;
}
export interface RollbackResult {
  readonly rolledBackToVersion: string;
  readonly rolledBackFromVersion: string;
}
export interface AliasHealthEntry {
  readonly alias: string;
  readonly healthy: boolean;
  readonly targetIndex: string | null;
  readonly issue?: string;
}
export interface AliasValidationResult {
  readonly allHealthy: boolean;
  readonly entries: readonly AliasHealthEntry[];
}
export interface IndexLifecycleDeps {
  readonly createVersionedIndexes: (version: string) => Promise<Result<void, AdminError>>;
  readonly runVersionedIngest: (
    version: string,
    options: IngestOptions,
  ) => Promise<Result<IngestResult, AdminError>>;
  readonly resolveCurrentAliasTargets: () => Promise<Result<AliasTargetMap, AdminError>>;
  readonly atomicAliasSwap: (swaps: readonly AliasSwap[]) => Promise<Result<void, AdminError>>;
  readonly readIndexMeta: () => Promise<Result<IndexMetaDoc | null, AdminError>>;
  readonly writeIndexMeta: (meta: IndexMetaDoc) => Promise<Result<void, AdminError>>;
  readonly listVersionedIndexes: (
    baseName: string,
    target: SearchIndexTarget,
  ) => Promise<Result<readonly string[], AdminError>>;
  readonly deleteVersionedIndex: (indexName: string) => Promise<Result<void, AdminError>>;
  readonly verifyDocCounts: (
    version: string,
    minDocCount: number,
  ) => Promise<Result<void, AdminError>>;
  readonly generateVersion: () => string;
  readonly target: SearchIndexTarget;
  readonly logger?: Logger;
}
export interface AliasLifecycleDeps {
  readonly resolveCurrentAliasTargets: () => Promise<Result<AliasTargetMap, AdminError>>;
  readonly atomicAliasSwap: (swaps: readonly AliasSwap[]) => Promise<Result<void, AdminError>>;
  readonly readIndexMeta: () => Promise<Result<IndexMetaDoc | null, AdminError>>;
  readonly writeIndexMeta: (meta: IndexMetaDoc) => Promise<Result<void, AdminError>>;
  readonly listVersionedIndexes: (
    baseName: string,
    target: SearchIndexTarget,
  ) => Promise<Result<readonly string[], AdminError>>;
  readonly deleteVersionedIndex: (indexName: string) => Promise<Result<void, AdminError>>;
  readonly verifyDocCounts: (
    version: string,
    minDocCount: number,
  ) => Promise<Result<void, AdminError>>;
  readonly target: SearchIndexTarget;
  readonly logger?: Logger;
}
export interface IndexLifecycleService {
  readonly versionedIngest: (
    options: VersionedIngestOptions,
  ) => Promise<Result<VersionedIngestResult, AdminError>>;
  readonly stage: (options: VersionedIngestOptions) => Promise<Result<StageResult, AdminError>>;
  readonly promote: (version: string) => Promise<Result<PromoteResult, AdminError>>;
  readonly rollback: () => Promise<Result<RollbackResult, AdminError>>;
  readonly validateAliases: () => Promise<Result<AliasValidationResult, AdminError>>;
}
export interface AliasLifecycleService {
  readonly promote: (version: string) => Promise<Result<PromoteResult, AdminError>>;
  readonly rollback: () => Promise<Result<RollbackResult, AdminError>>;
  readonly validateAliases: () => Promise<Result<AliasValidationResult, AdminError>>;
}
