/**
 * Admin service — barrel export.
 *
 * Only consumer-facing APIs are exported here. Internal operations
 * (alias swap, resolver, list/delete) are implementation details
 * wired through `IndexLifecycleDeps` via `buildLifecycleDeps`.
 */

export { createAdminService } from './create-admin-service.js';
export type { AliasSwap, AliasTargetInfo } from '../types/index-lifecycle-types.js';
export {
  createIndexLifecycleService,
  createAliasLifecycleService,
} from './index-lifecycle-service.js';
export { buildLifecycleDeps, buildAliasLifecycleDeps } from './build-lifecycle-deps.js';
export { createVersionedIndexResolver } from './versioned-index-resolver.js';
export {
  withLifecycleLease,
  validateLeaseTtl,
  DEFAULT_LEASE_TTL_MS,
  forceReleaseLease,
  inspectLease,
} from './lifecycle-lease.js';
export { readIndexMeta, writeIndexMeta } from './index-meta.js';
export {
  BASE_INDEX_NAMES,
  SEARCH_INDEX_TARGETS,
  resolveAliasName,
  resolveVersionedIndexName,
} from '../internal/index.js';
export type { LifecycleLease } from './lifecycle-lease.js';
