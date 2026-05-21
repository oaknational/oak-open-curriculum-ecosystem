/**
 * PROV-O (Provenance Ontology) vocabulary terms.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper.
 *
 * @see https://www.w3.org/TR/prov-o/
 */

import { namedNode } from '../data-factory/index.js';

export const PROV = {
  Entity: namedNode('http://www.w3.org/ns/prov#Entity'),
  Activity: namedNode('http://www.w3.org/ns/prov#Activity'),
  Agent: namedNode('http://www.w3.org/ns/prov#Agent'),
  Person: namedNode('http://www.w3.org/ns/prov#Person'),
  Organization: namedNode('http://www.w3.org/ns/prov#Organization'),
  SoftwareAgent: namedNode('http://www.w3.org/ns/prov#SoftwareAgent'),
  wasDerivedFrom: namedNode('http://www.w3.org/ns/prov#wasDerivedFrom'),
  wasGeneratedBy: namedNode('http://www.w3.org/ns/prov#wasGeneratedBy'),
  wasAttributedTo: namedNode('http://www.w3.org/ns/prov#wasAttributedTo'),
  wasAssociatedWith: namedNode('http://www.w3.org/ns/prov#wasAssociatedWith'),
  used: namedNode('http://www.w3.org/ns/prov#used'),
  generatedAtTime: namedNode('http://www.w3.org/ns/prov#generatedAtTime'),
  startedAtTime: namedNode('http://www.w3.org/ns/prov#startedAtTime'),
  endedAtTime: namedNode('http://www.w3.org/ns/prov#endedAtTime'),
} as const;
