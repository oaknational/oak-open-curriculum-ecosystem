/**
 * Admin service — barrel export.
 */

export { createAdminService } from './create-admin-service.js';
export { createVersionedIndexResolver } from './versioned-index-resolver.js';
export {
  atomicAliasSwap,
  resolveCurrentAliasTargets,
  listVersionedIndexes,
  deleteVersionedIndex,
} from './alias-operations.js';
export type { AliasSwap, AliasTargetInfo } from '../types/index-lifecycle-types.js';
export { createIndexLifecycleService } from './index-lifecycle-service.js';
