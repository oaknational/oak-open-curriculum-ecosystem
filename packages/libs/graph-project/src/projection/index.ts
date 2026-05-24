/**
 * Projection sub-path: `DatasetCore` ↔ `PropertyGraph`.
 *
 * `toPropertyGraph` derives the property-graph view; `fromPropertyGraph`
 * reconstructs a default-graph dataset from the property-graph view.
 * Together they satisfy the §Test discipline invariant #6 round-trip
 * contract for inputs inside the projection's declared scope (see
 * `@oaknational/graph-project/property-graph` TSDoc).
 */

export { toPropertyGraph } from './to-property-graph.js';
export { fromPropertyGraph } from './from-property-graph.js';
