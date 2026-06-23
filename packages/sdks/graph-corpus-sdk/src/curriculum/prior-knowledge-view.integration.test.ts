/**
 * Integration test (G1b c1): the prior-knowledge view describes bounded
 * anchored PREDECESSOR retrieval over the real emitted corpus.
 *
 * @remarks
 * The view's contract is "prior knowledge of X = X's predecessors" (units that
 * are `prerequisiteFor` X). These tests exercise the REAL corpus and check the
 * result against an INDEPENDENT reference incoming-BFS computed here from
 * `graphCorpus.edges`, so they specify the behaviour without mirroring the
 * implementation. The direction test is decisive: it proves the view returns
 * predecessors, not successors.
 */
import { graphCorpus, type GraphCorpusNodeId } from '@oaknational/sdk-codegen/graph-corpus';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_PREREQUISITE_DEPTH,
  MAX_PREREQUISITE_DEPTH,
  priorKnowledgeSubgraph,
  createCurriculumPriorKnowledgeView,
} from './prior-knowledge-view.js';
import { required } from './test-helpers.js';

/** The prerequisite subgraph's edges — the one-graph corpus carries the G2 chain types too. */
const prerequisiteEdges = graphCorpus.edges.filter((edge) => edge.type === 'prerequisiteFor');

/** Reference incoming-adjacency: target → its direct predecessors (the sources of edges into it). */
const predecessorsOf = new Map<GraphCorpusNodeId, GraphCorpusNodeId[]>();
for (const edge of prerequisiteEdges) {
  const existing = predecessorsOf.get(edge.target);
  if (existing) {
    existing.push(edge.source);
  } else {
    predecessorsOf.set(edge.target, [edge.source]);
  }
}

/** Adds unseen direct predecessors of the frontier to `members`; returns the next frontier. */
function expandPredecessorFrontier(
  frontier: readonly GraphCorpusNodeId[],
  members: Set<GraphCorpusNodeId>,
): GraphCorpusNodeId[] {
  const next: GraphCorpusNodeId[] = [];
  for (const id of frontier) {
    for (const pred of predecessorsOf.get(id) ?? []) {
      if (!members.has(pred)) {
        members.add(pred);
        next.push(pred);
      }
    }
  }
  return next;
}

/** Reference bounded predecessor set (anchor ∪ predecessors within `depth`), independent of the view. */
function expectedPredecessorMembers(
  anchors: readonly GraphCorpusNodeId[],
  depth: number,
): Set<GraphCorpusNodeId> {
  const members = new Set<GraphCorpusNodeId>(anchors);
  let frontier: readonly GraphCorpusNodeId[] = anchors;
  for (let level = 0; level < depth && frontier.length > 0; level += 1) {
    frontier = expandPredecessorFrontier(frontier, members);
  }
  return members;
}

/** A unit with at least one direct predecessor (a non-self-loop incoming edge), chosen deterministically. */
const anchorWithPredecessors: GraphCorpusNodeId = required(
  [...prerequisiteEdges]
    .filter((edge) => edge.source !== edge.target)
    .map((edge) => edge.target)
    .sort((a, b) => a.localeCompare(b))[0],
  'corpus has no non-self-loop prerequisite edge to anchor the prior-knowledge test',
);

/**
 * A clean directed pair (a is prerequisiteFor b) with no reverse edge and a !== b.
 * "No reverse" means b is not a predecessor of a, read from the same
 * `predecessorsOf` oracle (no separate edge-key set).
 */
const cleanDirectedEdge = required(
  prerequisiteEdges.find(
    (edge) =>
      edge.source !== edge.target && !(predecessorsOf.get(edge.source) ?? []).includes(edge.target),
  ),
  'corpus has no clean one-directional prerequisite edge for the direction test',
);

describe('prior-knowledge view — bounded anchored predecessor retrieval', () => {
  it('returns the anchor and its predecessors within the default depth, true-direction edges', () => {
    const result = priorKnowledgeSubgraph([anchorWithPredecessors.replace('unit:', '')]);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const ids = new Set<GraphCorpusNodeId>(result.value.nodes.map((node) => node.id));
    const expected = expectedPredecessorMembers(
      [anchorWithPredecessors],
      DEFAULT_PREREQUISITE_DEPTH,
    );
    expect(ids).toStrictEqual(expected);
    expect(result.value.edges.every((edge) => edge.type === 'prerequisiteFor')).toBe(true);
    // Every returned edge is internal to the member set, in true prerequisite-to-dependent orientation.
    expect(result.value.edges.every((edge) => ids.has(edge.source) && ids.has(edge.target))).toBe(
      true,
    );
  });

  it('defaults to depth 2 and echoes the depth used', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const defaulted = priorKnowledgeSubgraph([slug]);
    const explicit = priorKnowledgeSubgraph([slug], DEFAULT_PREREQUISITE_DEPTH);
    expect(defaulted.ok && explicit.ok).toBe(true);
    if (!defaulted.ok || !explicit.ok) {
      return;
    }
    expect(defaulted.value.depth).toBe(2);
    expect(new Set(defaulted.value.nodes.map((n) => n.id))).toStrictEqual(
      new Set(explicit.value.nodes.map((n) => n.id)),
    );
  });

  it('retrieves PREDECESSORS not successors (decisive direction check)', () => {
    const prereqSlug = cleanDirectedEdge.source.replace('unit:', ''); // a, the prerequisite
    const dependentSlug = cleanDirectedEdge.target.replace('unit:', ''); // b, depends on a

    // Prior knowledge of b (depth 1) includes its prerequisite a.
    const ofDependent = priorKnowledgeSubgraph([dependentSlug], 1);
    expect(ofDependent.ok).toBe(true);
    if (!ofDependent.ok) {
      return;
    }
    expect(ofDependent.value.nodes.map((n) => n.id)).toContain(cleanDirectedEdge.source);

    // Prior knowledge of a (depth 1) does NOT include b — b is a successor, not prior knowledge.
    const ofPrereq = priorKnowledgeSubgraph([prereqSlug], 1);
    expect(ofPrereq.ok).toBe(true);
    if (!ofPrereq.ok) {
      return;
    }
    expect(ofPrereq.value.nodes.map((n) => n.id)).not.toContain(cleanDirectedEdge.target);
  });

  it('resolves a bare unit slug to its kind-qualified node id', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const result = priorKnowledgeSubgraph([slug]);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.resolvedAnchors).toStrictEqual([anchorWithPredecessors]);
    expect(result.value.unknownAnchors).toStrictEqual([]);
  });

  it('depth is caller-adjustable: depth 1 members ⊆ depth 2 members', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const d1 = priorKnowledgeSubgraph([slug], 1);
    const d2 = priorKnowledgeSubgraph([slug], 2);
    expect(d1.ok && d2.ok).toBe(true);
    if (!d1.ok || !d2.ok) {
      return;
    }
    const d2ids = new Set(d2.value.nodes.map((n) => n.id));
    expect(d1.value.nodes.every((n) => d2ids.has(n.id))).toBe(true);
  });

  it('returns a well-formed empty result for an empty anchor list', () => {
    const result = priorKnowledgeSubgraph([]);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.nodes).toStrictEqual([]);
    expect(result.value.edges).toStrictEqual([]);
    expect(result.value.resolvedAnchors).toStrictEqual([]);
    expect(result.value.unknownAnchors).toStrictEqual([]);
  });

  it('reports unknown anchors and returns well-formed empty when none resolve', () => {
    const result = priorKnowledgeSubgraph(['definitely-not-a-real-unit-slug-xyz']);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.nodes).toStrictEqual([]);
    expect(result.value.resolvedAnchors).toStrictEqual([]);
    expect(result.value.unknownAnchors).toStrictEqual(['definitely-not-a-real-unit-slug-xyz']);
  });

  it('resolves known anchors and reports unknown ones in a mixed list', () => {
    const known = anchorWithPredecessors.replace('unit:', '');
    const result = priorKnowledgeSubgraph([known, 'no-such-unit']);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.resolvedAnchors).toStrictEqual([anchorWithPredecessors]);
    expect(result.value.unknownAnchors).toStrictEqual(['no-such-unit']);
  });

  it('accepts a query exactly at the depth ceiling (inclusive upper bound)', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const result = priorKnowledgeSubgraph([slug], MAX_PREREQUISITE_DEPTH);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.depth).toBe(MAX_PREREQUISITE_DEPTH);
  });

  it('returns SubgraphDepthExceeded for a depth beyond the ceiling', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const result = priorKnowledgeSubgraph([slug], MAX_PREREQUISITE_DEPTH + 1);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('SubgraphDepthExceeded');
  });

  it('validates depth before anchor resolution: out-of-range depth errs even when no anchors resolve', () => {
    const result = priorKnowledgeSubgraph(
      ['definitely-not-a-real-unit-slug-xyz'],
      MAX_PREREQUISITE_DEPTH + 1,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('SubgraphDepthExceeded');
  });

  it('returns only the anchor at depth 0 (no predecessor traversal)', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const result = priorKnowledgeSubgraph([slug], 0);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.nodes.map((n) => n.id)).toStrictEqual([anchorWithPredecessors]);
    expect(result.value.edges).toStrictEqual([]);
  });

  it('de-duplicates a repeated anchor slug (anchors are a set)', () => {
    const slug = anchorWithPredecessors.replace('unit:', '');
    const once = priorKnowledgeSubgraph([slug]);
    const twice = priorKnowledgeSubgraph([slug, slug]);
    expect(once.ok && twice.ok).toBe(true);
    if (!once.ok || !twice.ok) {
      return;
    }
    expect(twice.value.resolvedAnchors).toStrictEqual([anchorWithPredecessors]);
    expect(new Set(twice.value.nodes.map((n) => n.id))).toStrictEqual(
      new Set(once.value.nodes.map((n) => n.id)),
    );
  });

  it('constructs the module-load view within a generous startup-cost bound', () => {
    const start = performance.now();
    createCurriculumPriorKnowledgeView();
    const elapsedMs = performance.now() - start;
    // Sub-millisecond at corpus scale in practice; 250ms is a generous, non-flaky ceiling.
    expect(elapsedMs).toBeLessThan(250);
  });
});
