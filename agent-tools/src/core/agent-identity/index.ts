/**
 * Public exports for deterministic agent identity derivation.
 *
 * @remarks
 * The identity derivation surface is intentionally seed-agnostic. Harness
 * wrappers decide which platform-specific stable seed to pass; this package
 * only turns that explicit seed into a deterministic human-readable name.
 */

export {
  deriveIdentity,
  type DerivedIdentityResult,
  type DeriveIdentityOptions,
  type IdentityResult,
  type OverrideIdentityResult,
} from './derive.js';
