/**
 * Re-exports typed Object.* wrappers from the shared \@oaknational/type-helpers
 * package. This file preserves the existing import path for consumers within
 * this workspace while eliminating duplication with the generation workspace.
 */

export {
  typeSafeKeys,
  typeSafeValues,
  typeSafeEntries,
  typeSafeFromEntries,
  typeSafeGet,
  typeSafeSet,
  typeSafeHas,
  typeSafeHasOwn,
  typeSafeOwnKeys,
} from '@oaknational/type-helpers';
