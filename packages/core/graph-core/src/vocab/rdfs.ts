/**
 * RDF Schema (RDFS) vocabulary terms.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper, preserving literal IRI types for
 * compile-time use sites.
 *
 * @see https://www.w3.org/TR/rdf-schema/
 */

import { namedNode } from '../data-factory/index.js';

export const RDFS = {
  label: namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
  comment: namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
  subClassOf: namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'),
  subPropertyOf: namedNode('http://www.w3.org/2000/01/rdf-schema#subPropertyOf'),
  domain: namedNode('http://www.w3.org/2000/01/rdf-schema#domain'),
  range: namedNode('http://www.w3.org/2000/01/rdf-schema#range'),
  Resource: namedNode('http://www.w3.org/2000/01/rdf-schema#Resource'),
  Class: namedNode('http://www.w3.org/2000/01/rdf-schema#Class'),
  Literal: namedNode('http://www.w3.org/2000/01/rdf-schema#Literal'),
  isDefinedBy: namedNode('http://www.w3.org/2000/01/rdf-schema#isDefinedBy'),
  seeAlso: namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
} as const;
