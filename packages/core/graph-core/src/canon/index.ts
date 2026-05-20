/**
 * Public surface of `@oaknational/graph-core/canon`.
 *
 * Exposes RDFC-1.0 canonicalisation of graph-core Datasets. The native
 * rdf-canonize types are deliberately not re-exported: callers consume the
 * graph-core-shaped Result and Dataset surfaces only.
 */

export {
  canonicalize,
  type CanonicalizationError,
  type CanonicalizationErrorKind,
  type CanonicalizationResult,
  type CanonicalizedDataset,
} from './canonicalize.js';
