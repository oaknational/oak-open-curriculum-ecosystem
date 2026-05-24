/**
 * Unit tests for property-graph adjacency primitives.
 *
 * These tests describe the system state — what `outgoing`, `incoming`,
 * and `neighbours` produce for any well-formed input — and the product
 * code in `./index.ts` is the path that guides the system into that
 * state. The cycle lands atomically per the TDD invariant in
 * [`tdd-as-design.md`](../../../../../.agent/directives/tdd-as-design.md).
 *
 * Fixtures are hand-built `PropertyGraph` values rather than the output
 * of `toPropertyGraph` over an RDF dataset; the unit-under-test operates
 * on `PropertyGraph` shapes, not on `DatasetCore`, and the test surface
 * must describe that boundary exactly (see §Test discipline invariant in
 * `graph-stack.plan.md` ws3-adjacency row).
 */

import { describe, expect, it } from 'vitest';

import { blankNode, namedNode } from '@oaknational/graph-core/data-factory';
import type { NamedNode } from '@oaknational/graph-core/term';

import type {
  PropertyGraph,
  PropertyGraphEdge,
  PropertyGraphNodeId,
} from '../property-graph/index.js';

import { incoming, neighbours, outgoing } from './index.js';

const alice = namedNode('http://example.test/alice');
const bob = namedNode('http://example.test/bob');
const carol = namedNode('http://example.test/carol');
const dora = namedNode('http://example.test/dora');
const ghost = namedNode('http://example.test/ghost');
const knows = namedNode('http://example.test/knows');
const teaches = namedNode('http://example.test/teaches');

const emptyGraph: PropertyGraph = { nodes: [], edges: [] };

function edge(
  source: PropertyGraphNodeId,
  predicate: NamedNode,
  target: PropertyGraphNodeId,
): PropertyGraphEdge {
  return { source, predicate, target, properties: [] };
}

describe('outgoing', () => {
  it('returns every edge whose source matches the node id, preserving order and parallel edges', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const aliceKnowsBobAgain = edge(alice, knows, bob);
    const aliceKnowsCarol = edge(alice, knows, carol);
    const aliceTeachesDora = edge(alice, teaches, dora);
    const bobKnowsCarol = edge(bob, knows, carol);
    const graph: PropertyGraph = {
      nodes: [],
      edges: [aliceKnowsBob, bobKnowsCarol, aliceKnowsCarol, aliceKnowsBobAgain, aliceTeachesDora],
    };

    const result = outgoing(graph, alice);

    expect(result).toEqual([aliceKnowsBob, aliceKnowsCarol, aliceKnowsBobAgain, aliceTeachesDora]);
  });

  it('returns an empty array when no edges originate at the node id', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const graph: PropertyGraph = { nodes: [], edges: [aliceKnowsBob] };

    expect(outgoing(graph, bob)).toEqual([]);
  });

  it('returns an empty array when the node id is not present in the graph at all', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const graph: PropertyGraph = { nodes: [], edges: [aliceKnowsBob] };

    expect(outgoing(graph, ghost)).toEqual([]);
    expect(outgoing(emptyGraph, ghost)).toEqual([]);
  });
});

describe('incoming', () => {
  it('returns every edge whose target matches the node id, preserving order and parallel edges', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const aliceKnowsBobAgain = edge(alice, knows, bob);
    const carolKnowsBob = edge(carol, knows, bob);
    const doraTeachesBob = edge(dora, teaches, bob);
    const aliceKnowsCarol = edge(alice, knows, carol);
    const graph: PropertyGraph = {
      nodes: [],
      edges: [aliceKnowsBob, aliceKnowsCarol, carolKnowsBob, aliceKnowsBobAgain, doraTeachesBob],
    };

    const result = incoming(graph, bob);

    expect(result).toEqual([aliceKnowsBob, carolKnowsBob, aliceKnowsBobAgain, doraTeachesBob]);
  });

  it('returns an empty array when no edges terminate at the node id', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const graph: PropertyGraph = { nodes: [], edges: [aliceKnowsBob] };

    expect(incoming(graph, alice)).toEqual([]);
  });

  it('returns an empty array when the node id is not present in the graph at all', () => {
    expect(incoming(emptyGraph, ghost)).toEqual([]);
  });
});

describe('self-loops', () => {
  it('appear in both outgoing and incoming for the same node id', () => {
    const bobKnowsBob = edge(bob, knows, bob);
    const aliceKnowsBob = edge(alice, knows, bob);
    const graph: PropertyGraph = { nodes: [], edges: [aliceKnowsBob, bobKnowsBob] };

    expect(outgoing(graph, bob)).toEqual([bobKnowsBob]);
    expect(incoming(graph, bob)).toEqual([aliceKnowsBob, bobKnowsBob]);
  });
});

describe('blank-node identity', () => {
  it('matches structurally by termType and value, not by reference', () => {
    const blankX = blankNode('bX');
    const blankXAgain = blankNode('bX');
    const blankXKnowsCarol = edge(blankX, knows, carol);
    const aliceKnowsBlankX = edge(alice, knows, blankX);
    const graph: PropertyGraph = {
      nodes: [],
      edges: [blankXKnowsCarol, aliceKnowsBlankX],
    };

    expect(outgoing(graph, blankXAgain)).toEqual([blankXKnowsCarol]);
    expect(incoming(graph, blankXAgain)).toEqual([aliceKnowsBlankX]);
  });
});

describe('neighbours', () => {
  it('merges outgoing targets and incoming sources, deduplicated, preserving first-appearance order', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const aliceKnowsCarol = edge(alice, knows, carol);
    const aliceKnowsBobAgain = edge(alice, knows, bob);
    const doraTeachesAlice = edge(dora, teaches, alice);
    const bobTeachesAlice = edge(bob, teaches, alice);
    const graph: PropertyGraph = {
      nodes: [],
      edges: [
        aliceKnowsBob,
        aliceKnowsCarol,
        aliceKnowsBobAgain,
        doraTeachesAlice,
        bobTeachesAlice,
      ],
    };

    expect(neighbours(graph, alice)).toEqual([bob, carol, dora]);
  });

  it('includes self exactly once when a self-loop is present at the node id', () => {
    const bobKnowsBob = edge(bob, knows, bob);
    const graph: PropertyGraph = { nodes: [], edges: [bobKnowsBob] };

    expect(neighbours(graph, bob)).toEqual([bob]);
  });

  it('returns an empty array when the node id has no edges in either direction', () => {
    const aliceKnowsBob = edge(alice, knows, bob);
    const graph: PropertyGraph = { nodes: [], edges: [aliceKnowsBob] };

    expect(neighbours(graph, carol)).toEqual([]);
    expect(neighbours(emptyGraph, ghost)).toEqual([]);
  });
});
