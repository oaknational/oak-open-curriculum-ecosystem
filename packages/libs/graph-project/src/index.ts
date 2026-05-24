/**
 * `@oaknational/graph-project` root barrel.
 *
 * Re-exports the workspace's public surfaces as named exports. The
 * sub-path entrypoints (`@oaknational/graph-project/property-graph`,
 * `@oaknational/graph-project/projection`, etc.) remain the preferred
 * entrypoints per ADR-179.
 */

export type {
  PropertyGraph,
  PropertyGraphEdge,
  PropertyGraphEdgeProperty,
  PropertyGraphNode,
  PropertyGraphNodeId,
  PropertyGraphNodeProperty,
} from './property-graph/index.js';

export { fromPropertyGraph, toPropertyGraph } from './projection/index.js';

export { incoming, neighbours, outgoing } from './adjacency/index.js';
