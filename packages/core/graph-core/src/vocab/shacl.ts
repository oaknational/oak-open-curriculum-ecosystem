/**
 * SHACL (Shapes Constraint Language) vocabulary terms.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper.
 *
 * @see https://www.w3.org/TR/shacl/
 */

import { namedNode } from '../data-factory/index.js';

export const SHACL = {
  NodeShape: namedNode('http://www.w3.org/ns/shacl#NodeShape'),
  PropertyShape: namedNode('http://www.w3.org/ns/shacl#PropertyShape'),
  Shape: namedNode('http://www.w3.org/ns/shacl#Shape'),
  ValidationReport: namedNode('http://www.w3.org/ns/shacl#ValidationReport'),
  ValidationResult: namedNode('http://www.w3.org/ns/shacl#ValidationResult'),
  IRI: namedNode('http://www.w3.org/ns/shacl#IRI'),
  BlankNode: namedNode('http://www.w3.org/ns/shacl#BlankNode'),
  Literal: namedNode('http://www.w3.org/ns/shacl#Literal'),
  path: namedNode('http://www.w3.org/ns/shacl#path'),
  targetClass: namedNode('http://www.w3.org/ns/shacl#targetClass'),
  targetNode: namedNode('http://www.w3.org/ns/shacl#targetNode'),
  targetSubjectsOf: namedNode('http://www.w3.org/ns/shacl#targetSubjectsOf'),
  targetObjectsOf: namedNode('http://www.w3.org/ns/shacl#targetObjectsOf'),
  minCount: namedNode('http://www.w3.org/ns/shacl#minCount'),
  maxCount: namedNode('http://www.w3.org/ns/shacl#maxCount'),
  datatype: namedNode('http://www.w3.org/ns/shacl#datatype'),
  nodeKind: namedNode('http://www.w3.org/ns/shacl#nodeKind'),
  class: namedNode('http://www.w3.org/ns/shacl#class'),
  property: namedNode('http://www.w3.org/ns/shacl#property'),
  message: namedNode('http://www.w3.org/ns/shacl#message'),
  severity: namedNode('http://www.w3.org/ns/shacl#severity'),
  Violation: namedNode('http://www.w3.org/ns/shacl#Violation'),
  Warning: namedNode('http://www.w3.org/ns/shacl#Warning'),
  Info: namedNode('http://www.w3.org/ns/shacl#Info'),
} as const;
