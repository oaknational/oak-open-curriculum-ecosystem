import { describe, expect, it } from 'vitest';
import type { SubgraphResult } from '@oaknational/graph-core/graph-view';
import { loadEefCorpus, type EefStrand } from '@oaknational/graph-corpus-sdk/eef-strands';

import { capForBudget } from './response-budget.js';

// Real corpus strands as nodes (capForBudget operates over EefStrand) — no
// stubbing or casts; the function only needs valid strand objects and ids.
function corpusStrands(count: number): readonly EefStrand[] {
  const result = loadEefCorpus({ now: new Date('2026-05-01T00:00:00.000Z') });
  if (!result.ok) {
    throw new Error(`expected the real corpus to load: ${result.error.kind}`);
  }
  const strands = result.value.strands.slice(0, count);
  if (strands.length < count) {
    throw new Error(`expected at least ${String(count)} strands in the corpus`);
  }
  return strands;
}

function subgraphOf(
  nodes: readonly EefStrand[],
  edges: SubgraphResult<EefStrand>['edges'],
): SubgraphResult<EefStrand> {
  return { nodes, edges };
}

describe('capForBudget', () => {
  it('keeps the first `max` strands in subgraph order and reports the total', () => {
    const nodes = corpusStrands(4);
    const result = capForBudget(subgraphOf(nodes, []), 2);

    expect(result.nodes).toEqual(nodes.slice(0, 2));
    expect(result.totalMatched).toBe(4);
  });

  it('drops edges whose endpoints are not both retained (no dangling edges)', () => {
    const nodes = corpusStrands(4);
    const [a, b, c, d] = nodes.map((node) => node.id);
    if (a === undefined || b === undefined || c === undefined || d === undefined) {
      throw new Error('expected four distinct strand ids');
    }
    const kept = { source: a, type: 'related_strand', target: b }; // both retained
    const edges = [
      kept,
      { source: a, type: 'related_strand', target: c }, // target dropped by cap
      { source: c, type: 'related_strand', target: d }, // both dropped by cap
    ];
    const result = capForBudget(subgraphOf(nodes, edges), 2);

    expect(result.edges).toEqual([kept]);
  });

  it('is a no-op when the subgraph is within the cap', () => {
    const nodes = corpusStrands(2);
    const [a, b] = nodes.map((node) => node.id);
    if (a === undefined || b === undefined) {
      throw new Error('expected two distinct strand ids');
    }
    const edges = [{ source: a, type: 'related_strand', target: b }];
    const result = capForBudget(subgraphOf(nodes, edges), 12);

    expect(result.nodes).toEqual(nodes);
    expect(result.edges).toEqual(edges);
    expect(result.totalMatched).toBe(2);
  });
});
