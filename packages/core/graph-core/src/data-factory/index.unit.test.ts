/**
 * Unit tests for the RDF/JS-aligned DataFactory constructors.
 */

import { describe, expect, expectTypeOf, it } from 'vitest';

import type { Literal, NamedNode } from '../term/index.js';
import { blankNode, defaultGraph, literal, namedNode, quad, tripleTerm } from './index.js';

const exSubject = namedNode('http://example.test/subject');
const exPredicate = namedNode('http://example.test/predicate');
const exObject = namedNode('http://example.test/object');

describe('DataFactory constructors', () => {
  it('constructs NamedNodes with literal value types preserved', () => {
    const node = namedNode('http://example.test/resource');

    expectTypeOf(node.value).toEqualTypeOf<'http://example.test/resource'>();
    expect(node).toEqual({
      termType: 'NamedNode',
      value: 'http://example.test/resource',
    });
  });

  it('constructs BlankNodes with literal labels preserved', () => {
    const node = blankNode('b1');

    expectTypeOf(node.value).toEqualTypeOf<'b1'>();
    expect(node).toEqual({ termType: 'BlankNode', value: 'b1' });
  });

  it('constructs the RDF/JS default graph singleton shape', () => {
    expect(defaultGraph()).toEqual({ termType: 'DefaultGraph', value: '' });
  });

  it('constructs xsd:string literals when no language or datatype is supplied', () => {
    const value = literal('hello');

    expectTypeOf(value.value).toEqualTypeOf<'hello'>();
    expect(value).toEqual({
      termType: 'Literal',
      value: 'hello',
      language: '',
      direction: '',
      datatype: namedNode('http://www.w3.org/2001/XMLSchema#string'),
    });
  });

  it('constructs language-tagged literals with rdf:langString datatype', () => {
    const value = literal('hello', 'en');

    expect(value).toEqual({
      termType: 'Literal',
      value: 'hello',
      language: 'en',
      direction: '',
      datatype: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString'),
    });
  });

  it('constructs datatype literals with the supplied datatype', () => {
    const xsdInteger = namedNode('http://www.w3.org/2001/XMLSchema#integer');
    const value = literal('42', xsdInteger);

    expect(value).toEqual({
      termType: 'Literal',
      value: '42',
      language: '',
      direction: '',
      datatype: xsdInteger,
    });
  });

  it('constructs TripleTerms with uniform empty-string value', () => {
    const value = tripleTerm(exSubject, exPredicate, exObject);

    expect(value).toEqual({
      termType: 'TripleTerm',
      value: '',
      subject: exSubject,
      predicate: exPredicate,
      object: exObject,
    });
  });

  it('constructs Quads with a default graph when graph is omitted', () => {
    const value = quad(exSubject, exPredicate, exObject);

    expect(value).toEqual({
      termType: 'Quad',
      subject: exSubject,
      predicate: exPredicate,
      object: exObject,
      graph: defaultGraph(),
    });
  });
});

describe('DataFactory return types (compile-time)', () => {
  it('keeps namedNode values assignable to narrower NamedNode contracts', () => {
    type RdfsLabel = NamedNode & {
      readonly value: 'http://www.w3.org/2000/01/rdf-schema#label';
    };

    const label: RdfsLabel = namedNode('http://www.w3.org/2000/01/rdf-schema#label');

    expect(label.value).toBe('http://www.w3.org/2000/01/rdf-schema#label');
  });

  it('keeps datatype literals assignable to the base Literal contract', () => {
    const typedLiteral: Literal = literal(
      '2026',
      namedNode('http://www.w3.org/2001/XMLSchema#gYear'),
    );

    expect(typedLiteral.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#gYear');
  });
});
