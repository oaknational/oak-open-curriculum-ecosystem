/**
 * Admin service — barrel export.
 *
 * Only consumer-facing APIs are exported here. Internal operations
 * (alias swap, resolver, list/delete) are implementation details
 * wired through `IndexLifecycleDeps` via `buildLifecycleDeps`.
 */

export { createAdminService } from './create-admin-service.js';
export type { AliasSwap, AliasTargetInfo } from '../types/index-lifecycle-types.js';
export { createIndexLifecycleService } from './index-lifecycle-service.js';
export { buildLifecycleDeps } from './build-lifecycle-deps.js';
