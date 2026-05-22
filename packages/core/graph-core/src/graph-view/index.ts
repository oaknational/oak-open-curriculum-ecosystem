/**
 * Polymorphic query-layer contract for typed graphs (the `graph-view`
 * sub-path export of `@oaknational/graph-core`).
 *
 * See `./interface.ts` for the GraphView interface and `./types.ts`
 * for the supporting type-level utilities — projection paths, filter
 * predicates, return shapes, and error variants.
 */

export { type GraphView } from './interface.js';
export {
  type DeepKeyPath,
  type EnumerateNodesError,
  type EnumerateNodesResult,
  type FieldPredicate,
  type FindByTagError,
  type GraphManifest,
  type GraphSummary,
  type GraphSummaryError,
  type InvalidTagFormat,
  type NeighbourResult,
  type NodeFilter,
  type NodeNotFoundError,
  type NodeProjection,
  type NotImplementedYet,
  type SubgraphError,
  type SubgraphResult,
} from './types.js';
