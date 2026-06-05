/**
 * Polymorphic query-layer contract for typed graphs (the `graph-view`
 * sub-path export of `@oaknational/graph-core`).
 *
 * See `./interface.ts` for the GraphView interface and `./types.ts`
 * for the subgraph result shapes.
 */

export { createGraphView, type CreateGraphViewInput, type GraphEdge } from './create-graph-view.js';
export { type GraphView } from './interface.js';
export { type SubgraphError, type SubgraphResult } from './types.js';
