/**
 * Unit tests for the `DatasetCore` ↔ `PropertyGraph` projection.
 *
 * The load-bearing test is §Test discipline invariant #6
 * (`graph-stack.plan.md`): every default-graph dataset inside the
 * projection's declared scope round-trips losslessly through
 * `toPropertyGraph` followed by `fromPropertyGraph`. The remaining
 * tests describe the structural shape the projection produces, plus
 * the out-of-scope categories that are dropped by design.
 */

import { describe, expect, it } from 'vitest';

import { createDataset } from '@oaknational/graph-core/dataset';
import {
  blankNode,
  literal,
  namedNode,
  quad,
  tripleTerm,
} from '@oaknational/graph-core/data-factory';

import { fromPropertyGraph, toPropertyGraph } from './index.js';

const RDF_TYPE = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');

const alice = namedNode('http://example.test/alice');
const bob = namedNode('http://example.test/bob');
const carol = namedNode('http://example.test/carol');
const personType = namedNode('http://example.test/Person');
const teacherType = namedNode('http://example.test/Teacher');
const namePredicate = namedNode('http://example.test/name');
const agePredicate = namedNode('http://example.test/age');
const knowsPredicate = namedNode('http://example.test/knows');
const teachesPredicate = namedNode('http://example.test/teaches');
const namedGraph = namedNode('http://example.test/g1');
const blankSubject = blankNode('b1');
const blankTarget = blankNode('b2');

const labelQuad = quad(alice, RDF_TYPE, personType);
const secondLabelQuad = quad(alice, RDF_TYPE, teacherType);
const stringPropertyQuad = quad(alice, namePredicate, literal('Alice'));
const datatypePropertyQuad = quad(
  alice,
  agePredicate,
  literal('42', namedNode('http://www.w3.org/2001/XMLSchema#integer')),
);
const langPropertyQuad = quad(alice, namePredicate, literal('Alice', 'en'));
const aliceKnowsBob = quad(alice, knowsPredicate, bob);
const aliceKnowsCarol = quad(alice, knowsPredicate, carol);
const aliceTeachesBlank = quad(alice, teachesPredicate, blankTarget);
const blankKnowsCarol = quad(blankSubject, knowsPredicate, carol);

describe('toPropertyGraph + fromPropertyGraph', () => {
  it('round-trips the canonical fixture losslessly (invariant #6)', () => {
    const inScopeQuads = [
      labelQuad,
      secondLabelQuad,
      stringPropertyQuad,
      datatypePropertyQuad,
      langPropertyQuad,
      aliceKnowsBob,
      aliceKnowsCarol,
      aliceTeachesBlank,
      blankKnowsCarol,
    ];
    const original = createDataset(inScopeQuads);

    const projected = toPropertyGraph(original);
    const reconstructed = fromPropertyGraph(projected);

    expect(reconstructed.size).toBe(original.size);
    for (const expectedQuad of inScopeQuads) {
      expect(reconstructed.has(expectedQuad)).toBe(true);
    }
  });
});

describe('toPropertyGraph projection shape', () => {
  it('places rdf:type → NamedNode quads into the source node labels', () => {
    const dataset = createDataset([labelQuad, secondLabelQuad]);

    const projected = toPropertyGraph(dataset);
    const aliceNode = projected.nodes.find((node) => node.id.value === alice.value);

    expect(aliceNode).toBeDefined();
    expect(aliceNode?.labels).toEqual([personType, teacherType]);
    expect(aliceNode?.properties).toEqual([]);
    expect(projected.edges).toEqual([]);
  });

  it('places Literal-valued quads into the source node properties', () => {
    const dataset = createDataset([stringPropertyQuad, datatypePropertyQuad, langPropertyQuad]);

    const projected = toPropertyGraph(dataset);
    const aliceNode = projected.nodes.find((node) => node.id.value === alice.value);

    expect(aliceNode?.properties).toEqual([
      { predicate: namePredicate, value: literal('Alice') },
      {
        predicate: agePredicate,
        value: literal('42', namedNode('http://www.w3.org/2001/XMLSchema#integer')),
      },
      { predicate: namePredicate, value: literal('Alice', 'en') },
    ]);
    expect(projected.edges).toEqual([]);
  });

  it('places non-label NamedNode/BlankNode-object quads into edges', () => {
    const dataset = createDataset([aliceKnowsBob, aliceTeachesBlank, blankKnowsCarol]);

    const projected = toPropertyGraph(dataset);

    expect(projected.edges).toEqual([
      { source: alice, predicate: knowsPredicate, target: bob, properties: [] },
      { source: alice, predicate: teachesPredicate, target: blankTarget, properties: [] },
      { source: blankSubject, predicate: knowsPredicate, target: carol, properties: [] },
    ]);
  });

  it('materialises edge targets as nodes even when they have no outgoing facts', () => {
    const dataset = createDataset([aliceKnowsBob]);

    const projected = toPropertyGraph(dataset);
    const ids = projected.nodes.map((node) => node.id.value);

    expect(ids).toContain(alice.value);
    expect(ids).toContain(bob.value);
  });

  it('preserves parallel edges with the same predicate', () => {
    const dataset = createDataset([aliceKnowsBob, aliceKnowsCarol]);

    const projected = toPropertyGraph(dataset);
    const aliceOutgoing = projected.edges.filter((edge) => edge.source.value === alice.value);

    expect(aliceOutgoing).toHaveLength(2);
    expect(aliceOutgoing.map((edge) => edge.target.value)).toEqual([bob.value, carol.value]);
  });

  it('ignores quads in named graphs', () => {
    const namedGraphQuad = quad(alice, namePredicate, literal('Alice'), namedGraph);
    const dataset = createDataset([namedGraphQuad]);

    const projected = toPropertyGraph(dataset);

    // Alice is the subject, but the quad is filtered out before any node
    // materialisation runs — so the projected graph is empty rather than
    // containing a labelless, propertyless node for alice.
    expect(projected.nodes).toEqual([]);
    expect(projected.edges).toEqual([]);
  });

  it('treats rdf:type with a BlankNode object as an edge, not a label', () => {
    // The `labels` field is typed `readonly NamedNode[]`; a BlankNode
    // object on rdf:type falls through the label branch and lands as an
    // edge. This pins the label-guard discipline.
    const blankClassEdge = quad(alice, RDF_TYPE, blankTarget);
    const dataset = createDataset([blankClassEdge]);

    const projected = toPropertyGraph(dataset);
    const aliceNode = projected.nodes.find((node) => node.id.value === alice.value);

    expect(aliceNode?.labels).toEqual([]);
    expect(projected.edges).toEqual([
      { source: alice, predicate: RDF_TYPE, target: blankTarget, properties: [] },
    ]);
  });

  it('ignores quads whose object is a TripleTerm (RDF 1.2 annotation deferred)', () => {
    const annotated = quad(alice, knowsPredicate, tripleTerm(alice, knowsPredicate, bob));
    const dataset = createDataset([annotated]);

    const projected = toPropertyGraph(dataset);

    expect(projected.nodes.map((node) => node.id.value)).toEqual([alice.value]);
    expect(projected.edges).toEqual([]);
  });

  it('emits an empty PropertyGraph for an empty dataset', () => {
    const dataset = createDataset();

    const projected = toPropertyGraph(dataset);

    expect(projected.nodes).toEqual([]);
    expect(projected.edges).toEqual([]);
  });
});

describe('fromPropertyGraph reconstruction', () => {
  it('emits one quad per label, property, and edge, all in the default graph', () => {
    const dataset = createDataset([labelQuad, stringPropertyQuad, aliceKnowsBob]);

    const reconstructed = fromPropertyGraph(toPropertyGraph(dataset));

    expect(reconstructed.size).toBe(3);
    for (const reproducedQuad of reconstructed) {
      expect(reproducedQuad.graph.termType).toBe('DefaultGraph');
    }
  });
});
