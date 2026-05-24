/**
 * OWL 2 (Web Ontology Language) vocabulary terms.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper.
 *
 * @see https://www.w3.org/TR/owl2-overview/
 */

import { namedNode } from '../data-factory/index.js';

export const OWL = {
  Ontology: namedNode('http://www.w3.org/2002/07/owl#Ontology'),
  Class: namedNode('http://www.w3.org/2002/07/owl#Class'),
  ObjectProperty: namedNode('http://www.w3.org/2002/07/owl#ObjectProperty'),
  DatatypeProperty: namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty'),
  AnnotationProperty: namedNode('http://www.w3.org/2002/07/owl#AnnotationProperty'),
  NamedIndividual: namedNode('http://www.w3.org/2002/07/owl#NamedIndividual'),
  Thing: namedNode('http://www.w3.org/2002/07/owl#Thing'),
  Nothing: namedNode('http://www.w3.org/2002/07/owl#Nothing'),
  equivalentClass: namedNode('http://www.w3.org/2002/07/owl#equivalentClass'),
  equivalentProperty: namedNode('http://www.w3.org/2002/07/owl#equivalentProperty'),
  sameAs: namedNode('http://www.w3.org/2002/07/owl#sameAs'),
  differentFrom: namedNode('http://www.w3.org/2002/07/owl#differentFrom'),
  inverseOf: namedNode('http://www.w3.org/2002/07/owl#inverseOf'),
  disjointWith: namedNode('http://www.w3.org/2002/07/owl#disjointWith'),
  imports: namedNode('http://www.w3.org/2002/07/owl#imports'),
  versionIRI: namedNode('http://www.w3.org/2002/07/owl#versionIRI'),
} as const;
