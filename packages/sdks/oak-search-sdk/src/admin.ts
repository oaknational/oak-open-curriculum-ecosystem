/**
 * Admin capability surface for `@oaknational/oak-search-sdk`.
 *
 * This surface contains privileged lifecycle and write operations.
 */

export { createSearchSdk } from './create-search-sdk.js';
export { createAdminService } from './admin/index.js';
export {
  createIndexLifecycleService,
  createAliasLifecycleService,
  buildLifecycleDeps,
  buildAliasLifecycleDeps,
  createVersionedIndexResolver,
  withLifecycleLease,
  validateLeaseTtl,
  DEFAULT_LEASE_TTL_MS,
  readIndexMeta,
  writeIndexMeta,
} from './admin/index.js';
export {
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  BASE_INDEX_NAMES,
  resolveSearchIndexName,
  resolveZeroHitIndexName,
} from './read.js';
export type { SearchIndexTarget, SearchIndexKind, IndexResolverFn } from './read.js';

export type {
  SearchSdk,
  SearchSdkConfig,
  AdminService,
  AdminError,
  IndexSetupResult,
  SetupResult,
  ConnectionStatus,
  IndexInfo,
  IndexDocCount,
  SynonymsResult,
  IngestOptions,
  IngestResult,
  DocCountExpectations,
  DocCountVerification,
  IndexDocCountStatus,
  AliasSwap,
  AliasTargetInfo,
  AliasTargetMap,
  AliasLifecycleDeps,
  AliasLifecycleService,
  IndexLifecycleDeps,
  IndexLifecycleService,
  VersionedIngestOptions,
  VersionedIngestResult,
  StageResult,
  PromoteResult,
  RollbackResult,
  AliasValidationResult,
  AliasHealthEntry,
} from './types/index.js';
export type { LifecycleLease } from './admin/lifecycle-lease.js';
