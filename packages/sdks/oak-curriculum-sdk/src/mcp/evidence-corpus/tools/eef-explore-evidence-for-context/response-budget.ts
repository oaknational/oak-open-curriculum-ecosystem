/**
 * Output-budget guard for `eef-explore-evidence-for-context`.
 *
 * The MCP-client output budget (~10k tokens) cannot hold the whole corpus once
 * the mandatory dual-emit and the citation envelope are counted — measurement
 * shows the 30-strand corpus at ~26k tokens. The response is therefore capped:
 * when selection plus traversal yields more than {@link MAX_RESPONSE_STRANDS},
 * the first N (subgraph order — seeds before their neighbours) are kept and the
 * caller discloses the total. Relevance ordering within the cap is a gate-1b
 * ranking concern.
 */

import type { SubgraphResult } from '@oaknational/graph-core/graph-view';
import { type EefStrand } from '@oaknational/graph-corpus-sdk/eef-strands';

/** Maximum strands emitted in one response (see module docstring). */
export const MAX_RESPONSE_STRANDS = 12;

/** A budget-capped subgraph: the kept strands, the edges among them, the total. */
export interface CappedSubgraph {
  readonly nodes: readonly EefStrand[];
  readonly edges: SubgraphResult<EefStrand>['edges'];
  readonly totalMatched: number;
}

/**
 * Cap the subgraph to `max` strands for the output budget, keeping subgraph
 * order (seeds first) and dropping any edge whose endpoints are not both
 * retained (no dangling edges).
 *
 * @param subgraph - The full subgraph traversal result.
 * @param max - The maximum number of strands to keep.
 */
export function capForBudget(subgraph: SubgraphResult<EefStrand>, max: number): CappedSubgraph {
  const nodes = subgraph.nodes.slice(0, max);
  const keptIds = new Set(nodes.map((node) => node.id));
  const edges = subgraph.edges.filter(
    (edge) => keptIds.has(edge.source) && keptIds.has(edge.target),
  );
  return { nodes, edges, totalMatched: subgraph.nodes.length };
}
