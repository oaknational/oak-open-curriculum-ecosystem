/**
 * Polymorphic query-layer contract for typed graphs (the `graph-view`
 * sub-path export of `@oaknational/graph-core`).
 *
 * See `./interface.ts` for the GraphView interface and `./types.ts`
 * for the supporting type-level utilities — projection paths and the
 * subgraph return shapes.
 */

export { createGraphView, type CreateGraphViewInput, type GraphEdge } from './create-graph-view.js';
export { type GraphView } from './interface.js';
export {
  type DeepKeyPath,
  type NodeProjection,
  type SubgraphError,
  type SubgraphResult,
} from './types.js';
