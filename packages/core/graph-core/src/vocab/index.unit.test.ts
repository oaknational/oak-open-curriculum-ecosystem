/**
 * Unit tests for the vocabulary registry — forward namespace lookup,
 * reverse-by-IRI lookup, and the literal-IRI type-preservation invariant.
 */

import { typeSafeValues } from '@oaknational/type-helpers';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { NamedNodeTerm } from '../data-factory/index.js';
import { byIri, DCTERMS, OWL, PROV, RDFS, SCHEMA, SHACL, SKOS } from './index.js';

describe('vocabulary forward lookup', () => {
  it('RDFS exposes the rdfs:label IRI as a const-typed NamedNode', () => {
    expectTypeOf(RDFS.label.value).toEqualTypeOf<'http://www.w3.org/2000/01/rdf-schema#label'>();
    expect(RDFS.label).toEqual({
      termType: 'NamedNode',
      value: 'http://www.w3.org/2000/01/rdf-schema#label',
    });
  });

  it('SKOS exposes the skos:prefLabel IRI as a const-typed NamedNode', () => {
    expectTypeOf(
      SKOS.prefLabel.value,
    ).toEqualTypeOf<'http://www.w3.org/2004/02/skos/core#prefLabel'>();
    expect(SKOS.prefLabel.value).toBe('http://www.w3.org/2004/02/skos/core#prefLabel');
  });

  it('PROV exposes the prov:wasDerivedFrom IRI as a const-typed NamedNode', () => {
    expectTypeOf(
      PROV.wasDerivedFrom.value,
    ).toEqualTypeOf<'http://www.w3.org/ns/prov#wasDerivedFrom'>();
    expect(PROV.wasDerivedFrom.value).toBe('http://www.w3.org/ns/prov#wasDerivedFrom');
  });

  it('DCTERMS exposes the dcterms:title IRI as a const-typed NamedNode', () => {
    expectTypeOf(DCTERMS.title.value).toEqualTypeOf<'http://purl.org/dc/terms/title'>();
    expect(DCTERMS.title.value).toBe('http://purl.org/dc/terms/title');
  });

  it('OWL exposes the owl:Class IRI as a const-typed NamedNode', () => {
    expectTypeOf(OWL.Class.value).toEqualTypeOf<'http://www.w3.org/2002/07/owl#Class'>();
    expect(OWL.Class.value).toBe('http://www.w3.org/2002/07/owl#Class');
  });

  it('SHACL exposes the sh:NodeShape IRI as a const-typed NamedNode', () => {
    expectTypeOf(SHACL.NodeShape.value).toEqualTypeOf<'http://www.w3.org/ns/shacl#NodeShape'>();
    expect(SHACL.NodeShape.value).toBe('http://www.w3.org/ns/shacl#NodeShape');
  });

  it('SCHEMA exposes the schema:CreativeWork IRI as a const-typed NamedNode', () => {
    expectTypeOf(SCHEMA.CreativeWork.value).toEqualTypeOf<'https://schema.org/CreativeWork'>();
    expect(SCHEMA.CreativeWork.value).toBe('https://schema.org/CreativeWork');
  });
});

describe('vocabulary namespace shape invariants', () => {
  const namespaces: readonly (readonly [string, Readonly<Record<string, NamedNodeTerm>>])[] = [
    ['RDFS', RDFS],
    ['SKOS', SKOS],
    ['PROV', PROV],
    ['DCTERMS', DCTERMS],
    ['OWL', OWL],
    ['SHACL', SHACL],
    ['SCHEMA', SCHEMA],
  ];

  it.each(namespaces)('%s entries are all NamedNodes', (_label, namespace) => {
    for (const term of typeSafeValues(namespace)) {
      expect(term.termType).toBe('NamedNode');
      expect(typeof term.value).toBe('string');
      expect(term.value.length).toBeGreaterThan(0);
    }
  });
});

describe('vocabulary reverse lookup via byIri', () => {
  it('returns the registered NamedNode for a known IRI', () => {
    const resolved = byIri('http://www.w3.org/2000/01/rdf-schema#label');

    expect(resolved).toEqual(RDFS.label);
  });

  it('resolves a SKOS IRI without confusion with RDFS', () => {
    const resolved = byIri('http://www.w3.org/2004/02/skos/core#prefLabel');

    expect(resolved).toEqual(SKOS.prefLabel);
  });

  it('resolves a schema.org IRI honouring its https base', () => {
    const resolved = byIri('https://schema.org/CreativeWork');

    expect(resolved).toEqual(SCHEMA.CreativeWork);
  });

  it('returns undefined for an unknown IRI', () => {
    expect(byIri('http://example.test/unknown')).toBeUndefined();
  });

  it('round-trips every registered entry through byIri', () => {
    const namespaces: readonly Readonly<Record<string, NamedNodeTerm>>[] = [
      RDFS,
      SKOS,
      PROV,
      DCTERMS,
      OWL,
      SHACL,
      SCHEMA,
    ];

    for (const namespace of namespaces) {
      for (const term of typeSafeValues(namespace)) {
        expect(byIri(term.value)).toEqual(term);
      }
    }
  });
});

describe('vocabulary registry collision invariant', () => {
  it('every IRI is registered to exactly one namespace entry', () => {
    const namespaces: readonly Readonly<Record<string, NamedNodeTerm>>[] = [
      RDFS,
      SKOS,
      PROV,
      DCTERMS,
      OWL,
      SHACL,
      SCHEMA,
    ];

    const iris = namespaces.flatMap((namespace) =>
      typeSafeValues(namespace).map((term) => term.value),
    );
    const unique = new Set(iris);

    expect(unique.size).toBe(iris.length);
  });
});
