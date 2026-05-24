/**
 * Unit tests for the RDF 1.2 Term hierarchy and `equals`.
 */

import { describe, expect, it } from 'vitest';

import {
  equals,
  type BlankNode,
  type DefaultGraph,
  type Literal,
  type NamedNode,
  type Quad,
  type Term,
  type TripleTerm,
} from './index.js';

const xsdString: NamedNode = {
  termType: 'NamedNode',
  value: 'http://www.w3.org/2001/XMLSchema#string',
};

const rdfLangString: NamedNode = {
  termType: 'NamedNode',
  value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
};

const exA: NamedNode = { termType: 'NamedNode', value: 'http://example/a' };
const exB: NamedNode = { termType: 'NamedNode', value: 'http://example/b' };
const exP: NamedNode = { termType: 'NamedNode', value: 'http://example/p' };

const plainHello: Literal = {
  termType: 'Literal',
  value: 'hello',
  language: '',
  direction: '',
  datatype: xsdString,
};

describe('equals — NamedNode', () => {
  it('returns true for IRI-equal NamedNodes', () => {
    const a: NamedNode = { termType: 'NamedNode', value: 'http://example/a' };
    expect(equals(a, exA)).toBe(true);
  });

  it('returns false for differing IRIs', () => {
    expect(equals(exA, exB)).toBe(false);
  });
});

describe('equals — BlankNode', () => {
  it('returns true for same-label blank nodes', () => {
    const a: BlankNode = { termType: 'BlankNode', value: 'b0' };
    const b: BlankNode = { termType: 'BlankNode', value: 'b0' };
    expect(equals(a, b)).toBe(true);
  });

  it('returns false for different labels', () => {
    const a: BlankNode = { termType: 'BlankNode', value: 'b0' };
    const b: BlankNode = { termType: 'BlankNode', value: 'b1' };
    expect(equals(a, b)).toBe(false);
  });
});

describe('equals — DefaultGraph', () => {
  it('returns true for any two DefaultGraphs', () => {
    const a: DefaultGraph = { termType: 'DefaultGraph', value: '' };
    const b: DefaultGraph = { termType: 'DefaultGraph', value: '' };
    expect(equals(a, b)).toBe(true);
  });
});

describe('equals — Literal', () => {
  it('returns true for fully-equal literals', () => {
    const a: Literal = { ...plainHello };
    expect(equals(a, plainHello)).toBe(true);
  });

  it('returns false when values differ', () => {
    const a: Literal = { ...plainHello, value: 'world' };
    expect(equals(a, plainHello)).toBe(false);
  });

  it('returns false when languages differ', () => {
    const a: Literal = { ...plainHello, language: 'en', datatype: rdfLangString };
    const b: Literal = { ...plainHello, language: 'fr', datatype: rdfLangString };
    expect(equals(a, b)).toBe(false);
  });

  it('returns false when directions differ', () => {
    const a: Literal = { ...plainHello, direction: 'ltr' };
    const b: Literal = { ...plainHello, direction: 'rtl' };
    expect(equals(a, b)).toBe(false);
  });

  it('returns false when datatypes differ', () => {
    const a: Literal = { ...plainHello };
    const b: Literal = { ...plainHello, datatype: rdfLangString };
    expect(equals(a, b)).toBe(false);
  });
});

describe('equals — cross-termType', () => {
  it('returns false when termTypes differ', () => {
    const dg: DefaultGraph = { termType: 'DefaultGraph', value: '' };
    expect(equals(exA, dg)).toBe(false);
    expect(equals(plainHello, exA)).toBe(false);
  });
});

describe('equals — TripleTerm', () => {
  it('returns true for structurally identical triple terms', () => {
    const a: TripleTerm = {
      termType: 'TripleTerm',
      value: '',
      subject: exA,
      predicate: exP,
      object: exB,
    };
    const b: TripleTerm = {
      termType: 'TripleTerm',
      value: '',
      subject: { termType: 'NamedNode', value: 'http://example/a' },
      predicate: { termType: 'NamedNode', value: 'http://example/p' },
      object: { termType: 'NamedNode', value: 'http://example/b' },
    };
    expect(equals(a, b)).toBe(true);
  });

  it('recurses into nested triple-term objects', () => {
    const inner: TripleTerm = {
      termType: 'TripleTerm',
      value: '',
      subject: exA,
      predicate: exP,
      object: exB,
    };
    const outer: TripleTerm = {
      termType: 'TripleTerm',
      value: '',
      subject: exA,
      predicate: exP,
      object: inner,
    };
    expect(equals(outer, outer)).toBe(true);
  });

  it('returns false when a nested term differs', () => {
    const a: TripleTerm = {
      termType: 'TripleTerm',
      value: '',
      subject: exA,
      predicate: exP,
      object: exB,
    };
    const b: TripleTerm = {
      termType: 'TripleTerm',
      value: '',
      subject: exA,
      predicate: exP,
      object: exA,
    };
    expect(equals(a, b)).toBe(false);
  });
});

describe('equals — Quad', () => {
  const baseQuad: Quad = {
    termType: 'Quad',
    subject: exA,
    predicate: exP,
    object: exB,
    graph: { termType: 'DefaultGraph', value: '' },
  };

  it('returns true for structurally identical quads', () => {
    const copy: Quad = {
      termType: 'Quad',
      subject: { termType: 'NamedNode', value: 'http://example/a' },
      predicate: { termType: 'NamedNode', value: 'http://example/p' },
      object: { termType: 'NamedNode', value: 'http://example/b' },
      graph: { termType: 'DefaultGraph', value: '' },
    };
    expect(equals(baseQuad, copy)).toBe(true);
  });

  it('returns false when graph differs', () => {
    const named: Quad = { ...baseQuad, graph: exA };
    expect(equals(baseQuad, named)).toBe(false);
  });

  it('returns false when object differs', () => {
    const flipped: Quad = { ...baseQuad, object: exA };
    expect(equals(baseQuad, flipped)).toBe(false);
  });
});

describe('Term union shape (compile-time)', () => {
  it('admits every Term kind under the Term union', () => {
    const namedNode: Term = exA;
    const blankNode: Term = { termType: 'BlankNode', value: 'b' };
    const literal: Term = plainHello;
    const defaultGraph: Term = { termType: 'DefaultGraph', value: '' };
    const tripleTerm: Term = {
      termType: 'TripleTerm',
      value: '',
      subject: exA,
      predicate: exP,
      object: exB,
    };
    const all: readonly Term[] = [namedNode, blankNode, literal, defaultGraph, tripleTerm];
    expect(all).toHaveLength(5);
  });
});
