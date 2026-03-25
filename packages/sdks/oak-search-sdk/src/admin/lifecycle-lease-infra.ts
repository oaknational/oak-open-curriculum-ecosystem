/**
 * Lifecycle lease infrastructure — barrel re-export.
 *
 * Implementation is split across sibling modules by responsibility:
 * - `lifecycle-lease-infra-shared` — types, constants, pure helpers
 * - `lifecycle-lease-infra-acquire` — index bootstrapping and acquisition
 * - `lifecycle-lease-infra-renew-release` — renewal, release, inspection
 */

export {
  DEFAULT_LEASE_TTL_MS,
  validateLeaseTtl,
  type LifecycleLease,
  type LeaseStatus,
} from './lifecycle-lease-infra-shared.js';

export { acquireLease } from './lifecycle-lease-infra-acquire.js';

export {
  renewLease,
  releaseLease,
  inspectLease,
  forceReleaseLease,
} from './lifecycle-lease-infra-renew-release.js';
