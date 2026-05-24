/**
 * SKOS Core (Simple Knowledge Organization System) vocabulary terms.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper.
 *
 * @see https://www.w3.org/TR/skos-reference/
 */

import { namedNode } from '../data-factory/index.js';

export const SKOS = {
  Concept: namedNode('http://www.w3.org/2004/02/skos/core#Concept'),
  ConceptScheme: namedNode('http://www.w3.org/2004/02/skos/core#ConceptScheme'),
  Collection: namedNode('http://www.w3.org/2004/02/skos/core#Collection'),
  prefLabel: namedNode('http://www.w3.org/2004/02/skos/core#prefLabel'),
  altLabel: namedNode('http://www.w3.org/2004/02/skos/core#altLabel'),
  hiddenLabel: namedNode('http://www.w3.org/2004/02/skos/core#hiddenLabel'),
  broader: namedNode('http://www.w3.org/2004/02/skos/core#broader'),
  narrower: namedNode('http://www.w3.org/2004/02/skos/core#narrower'),
  related: namedNode('http://www.w3.org/2004/02/skos/core#related'),
  inScheme: namedNode('http://www.w3.org/2004/02/skos/core#inScheme'),
  hasTopConcept: namedNode('http://www.w3.org/2004/02/skos/core#hasTopConcept'),
  topConceptOf: namedNode('http://www.w3.org/2004/02/skos/core#topConceptOf'),
  definition: namedNode('http://www.w3.org/2004/02/skos/core#definition'),
  example: namedNode('http://www.w3.org/2004/02/skos/core#example'),
  note: namedNode('http://www.w3.org/2004/02/skos/core#note'),
  notation: namedNode('http://www.w3.org/2004/02/skos/core#notation'),
} as const;
