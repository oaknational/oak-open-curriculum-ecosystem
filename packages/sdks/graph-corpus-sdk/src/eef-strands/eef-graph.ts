/**
 * The graph-native EEF view — a single-kind strand graph over the fixed corpus.
 *
 * This module is the SOLE ingest path from the EEF corpus into the graph
 * projection (parent §D5 Do): it reads the strands as nodes and the D2-derived
 * `relatedStrandEdges` as edges, then instantiates the domain-generic
 * `createGraphView` with the EEF type space — one node kind (`strand`,
 * `TNode = EefStrand`, the full strand payload incl. inline
 * `related_guidance_reports` per decision B), one node-id type
 * (`EefStrandId`), and one edge type (`'related_strand'`). The downstream EEF
 * binding operations (inspectStrand, evidenceForMove, the evidence envelope)
 * consume THIS view + the D2 corpus exports — they never re-read the raw corpus.
 *
 * Construction runs once at module load. For the valid fixed corpus it is
 * infallible; a malformed corpus (duplicate id / dangling edge) would throw
 * here, fail-fast, per the `createGraphView` construction contract.
 *
 * `maxDepth = 1`: the EEF surface queries depth 0 (a single strand) and depth 1
 * (a strand plus its directly related strands). One hop is the bounded-relevant
 * ceiling; a deeper query is `SubgraphDepthExceeded`.
 */

import {
  createGraphView,
  type GraphEdge,
  type GraphView,
} from '@oaknational/graph-core/graph-view';

import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import { relatedStrandEdges } from './raw-domains.js';
import type { EefStrand, EefStrandId } from './strand-lookup.js';

/** The EEF strand graph view: `TNode = EefStrand`, `TNodeId = EefStrandId`, `TEdgeType = 'related_strand'`. */
export type EefStrandGraph = GraphView<EefStrand, EefStrandId, 'related_strand'>;

/**
 * The D2 related-strand edges with the contract edge-type literal injected.
 * `as const` pins `type` to `'related_strand'` (an un-annotated literal would
 * widen to `string`); the explicit annotation guards `source`/`target` and the
 * overall shape against future drift in `relatedStrandEdges`.
 */
const relatedStrandGraphEdges: readonly GraphEdge<EefStrandId, 'related_strand'>[] =
  relatedStrandEdges.map((edge) => ({ ...edge, type: 'related_strand' as const }));

/** The graph-native EEF view, constructed once over the fixed corpus. */
export const eefStrandGraph: EefStrandGraph = createGraphView<
  EefStrand,
  EefStrandId,
  'related_strand'
>({
  nodes: EEF_TOOLKIT_DATA.strands,
  edges: relatedStrandGraphEdges,
  nodeId: (strand) => strand.id,
  maxDepth: 1,
});
