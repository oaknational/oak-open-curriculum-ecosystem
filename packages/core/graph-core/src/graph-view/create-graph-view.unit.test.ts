/**
 * Structural unit tests for the generic bounded-BFS `createGraphView` factory.
 *
 * These tests exercise the domain-generic traversal machinery over a synthetic
 * node type (`TNodeId = string`) via a fresh `makeNode` fixture — graph-core
 * carries NO EEF/MCP names (ADR-179); the EEF instantiation is proven over the
 * real corpus in graph-corpus-sdk (WS2.1). They pin every traversal and error
 * semantic the `subgraph` contract promises:
 *
 * - depth-0 = roots only; depth-1 = roots + one outgoing hop; depth-N bounded BFS;
 * - member edges = every edge whose BOTH endpoints are in the member set
 *   (member-induced, not merely the roots' outgoing edges);
 * - root-not-found and depth-out-of-range as the two ratified `Result` errors;
 * - an isolated root yields `ok` with the single member, not an error;
 * - cycles terminate via the visited set;
 * - duplicate node ids and dangling edges fail at CONSTRUCTION (throw), per the
 *   infallible-or-throw construction contract — they are NOT new per-call error
 *   variants.
 */

import { describe, expect, it } from 'vitest';

import { createGraphView } from './create-graph-view.js';

type SyntheticNode = {
  readonly id: string;
  readonly label: string;
};

const makeNode = (id: string, label: string = id): SyntheticNode => ({ id, label });

/** Stable comparison key for an edge, independent of object identity. */
const edgeKey = (edge: { readonly source: string; readonly target: string }): string =>
  `${edge.source}->${edge.target}`;

const edgeKeysOf = (
  edges: readonly { readonly source: string; readonly target: string }[],
): string[] => edges.map(edgeKey).sort((a, b) => a.localeCompare(b));

const idsOf = (nodes: readonly SyntheticNode[]): string[] =>
  nodes.map((node) => node.id).sort((a, b) => a.localeCompare(b));

describe('createGraphView — construction-time validation (throws, not a Result)', () => {
  it('throws on a duplicate node id', () => {
    expect(() =>
      createGraphView<SyntheticNode, string, string>({
        nodes: [makeNode('a'), makeNode('a', 'second-a')],
        edges: [],
        nodeId: (node) => node.id,
        maxDepth: 3,
      }),
    ).toThrow(/duplicate node id/i);
  });

  it('throws on an edge whose source is not a known node', () => {
    expect(() =>
      createGraphView<SyntheticNode, string, string>({
        nodes: [makeNode('a')],
        edges: [{ source: 'ghost', type: 'rel', target: 'a' }],
        nodeId: (node) => node.id,
        maxDepth: 3,
      }),
    ).toThrow(/source/i);
  });

  it('throws on an edge whose target is not a known node', () => {
    expect(() =>
      createGraphView<SyntheticNode, string, string>({
        nodes: [makeNode('a')],
        edges: [{ source: 'a', type: 'rel', target: 'ghost' }],
        nodeId: (node) => node.id,
        maxDepth: 3,
      }),
    ).toThrow(/target/i);
  });

  it('throws on a negative maxDepth', () => {
    expect(() =>
      createGraphView<SyntheticNode, string, string>({
        nodes: [makeNode('a')],
        edges: [],
        nodeId: (node) => node.id,
        maxDepth: -1,
      }),
    ).toThrow(/maxDepth/i);
  });

  it('accepts maxDepth = 0 (a roots-only view is valid)', () => {
    expect(() =>
      createGraphView<SyntheticNode, string, string>({
        nodes: [makeNode('a')],
        edges: [],
        nodeId: (node) => node.id,
        maxDepth: 0,
      }),
    ).not.toThrow();
  });
});

describe('createGraphView — subgraph traversal semantics', () => {
  // Root `a` at depth 1 has members {a, b, c} and FOUR member-induced edges
  // (a->b, a->c, and the reverse b->a, c->a). The edge b->d is excluded because
  // `d` is one hop beyond the depth-1 frontier, i.e. outside the member set.
  const view = createGraphView<SyntheticNode, string, string>({
    nodes: ['a', 'b', 'c', 'd'].map((id) => makeNode(id)),
    edges: [
      { source: 'a', type: 'rel', target: 'b' },
      { source: 'a', type: 'rel', target: 'c' },
      { source: 'b', type: 'rel', target: 'a' },
      { source: 'c', type: 'rel', target: 'a' },
      { source: 'b', type: 'rel', target: 'd' },
    ],
    nodeId: (node) => node.id,
    maxDepth: 5,
  });

  it('depth 0 returns roots only and edges among the roots', () => {
    const result = view.subgraph({ rootIds: ['a'], depth: 0 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(idsOf(result.value.nodes)).toEqual(['a']);
    expect(result.value.edges).toEqual([]);
  });

  it('depth 1 returns roots + one outgoing hop and ALL member-induced edges', () => {
    const result = view.subgraph({ rootIds: ['a'], depth: 1 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(idsOf(result.value.nodes)).toEqual(['a', 'b', 'c']);
    // Four edges: a->b, a->c, and the reverse b->a, c->a. b->d is excluded (d not a member).
    expect(edgeKeysOf(result.value.edges)).toEqual(['a->b', 'a->c', 'b->a', 'c->a']);
  });

  it('returns SubgraphRootNotFound when a root is absent from the node set', () => {
    const result = view.subgraph({ rootIds: ['missing'], depth: 1 });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toEqual({ kind: 'SubgraphRootNotFound', rootId: 'missing' });
  });

  it('returns SubgraphDepthExceeded for a negative depth', () => {
    const result = view.subgraph({ rootIds: ['a'], depth: -1 });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toEqual({ kind: 'SubgraphDepthExceeded', depth: -1, limit: 5 });
  });

  it('returns SubgraphDepthExceeded for a depth above maxDepth', () => {
    const result = view.subgraph({ rootIds: ['a'], depth: 6 });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toEqual({ kind: 'SubgraphDepthExceeded', depth: 6, limit: 5 });
  });

  it('accepts depth exactly equal to maxDepth and traverses to completion', () => {
    const result = view.subgraph({ rootIds: ['a'], depth: 5 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    // Depth 5 reaches the whole component: a->b->d, plus c and the reverse edges.
    expect(idsOf(result.value.nodes)).toEqual(['a', 'b', 'c', 'd']);
    expect(edgeKeysOf(result.value.edges)).toEqual(['a->b', 'a->c', 'b->a', 'b->d', 'c->a']);
  });
});

describe('createGraphView — isolated roots and cycles', () => {
  it('returns ok with the single member for an isolated root (present, no outgoing edges)', () => {
    const view = createGraphView<SyntheticNode, string, string>({
      nodes: [makeNode('lonely'), makeNode('other')],
      edges: [{ source: 'other', type: 'rel', target: 'lonely' }],
      nodeId: (node) => node.id,
      maxDepth: 3,
    });
    const result = view.subgraph({ rootIds: ['lonely'], depth: 2 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(idsOf(result.value.nodes)).toEqual(['lonely']);
    expect(result.value.edges).toEqual([]);
  });

  it('terminates on a cycle and returns each member once', () => {
    const view = createGraphView<SyntheticNode, string, string>({
      nodes: [makeNode('x'), makeNode('y')],
      edges: [
        { source: 'x', type: 'rel', target: 'y' },
        { source: 'y', type: 'rel', target: 'x' },
      ],
      nodeId: (node) => node.id,
      maxDepth: 10,
    });
    const result = view.subgraph({ rootIds: ['x'], depth: 10 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(idsOf(result.value.nodes)).toEqual(['x', 'y']);
    expect(edgeKeysOf(result.value.edges)).toEqual(['x->y', 'y->x']);
  });

  it('supports multiple roots, unioning their bounded neighbourhoods', () => {
    const view = createGraphView<SyntheticNode, string, string>({
      nodes: ['p', 'q', 'r'].map((id) => makeNode(id)),
      edges: [
        { source: 'p', type: 'rel', target: 'q' },
        { source: 'r', type: 'rel', target: 'q' },
      ],
      nodeId: (node) => node.id,
      maxDepth: 3,
    });
    const result = view.subgraph({ rootIds: ['p', 'r'], depth: 1 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(idsOf(result.value.nodes)).toEqual(['p', 'q', 'r']);
    expect(edgeKeysOf(result.value.edges)).toEqual(['p->q', 'r->q']);
  });
});
