/**
 * Reverse-lookup registry for the vocabularies exported under
 * `@oaknational/graph-core/vocab`. Maps every registered IRI to its
 * canonical `NamedNodeTerm`.
 *
 * The registry is built once at module-load time from the namespaces it
 * imports. Adding a vocabulary is a two-step landing: define the
 * namespace file, then add it to the `NAMESPACES` array below. The
 * collision invariant is enforced by the unit-test suite.
 */

import { typeSafeValues } from '@oaknational/type-helpers';

import type { NamedNodeTerm } from '../data-factory/index.js';

import { DCTERMS } from './dcterms.js';
import { OWL } from './owl.js';
import { PROV } from './prov.js';
import { RDFS } from './rdfs.js';
import { SCHEMA } from './schema-org.js';
import { SHACL } from './shacl.js';
import { SKOS } from './skos.js';

const NAMESPACES: readonly Readonly<Record<string, NamedNodeTerm>>[] = [
  RDFS,
  SKOS,
  PROV,
  DCTERMS,
  OWL,
  SHACL,
  SCHEMA,
];

const REGISTRY: ReadonlyMap<string, NamedNodeTerm> = new Map(
  NAMESPACES.flatMap((namespace) =>
    typeSafeValues(namespace).map((term) => [term.value, term] as const),
  ),
);

/**
 * Resolve an IRI to its registered `NamedNodeTerm`, or `undefined` when
 * the IRI is not present in any registered vocabulary. A miss is not an
 * error — callers decide whether an unknown IRI is a normal "outside our
 * vocabularies" condition or a signal worth handling.
 *
 * @example
 * ```typescript
 * const term = byIri('http://www.w3.org/2000/01/rdf-schema#label');
 * // term satisfies NamedNodeTerm with value 'http://www.w3.org/2000/01/rdf-schema#label'
 * ```
 */
export function byIri(iri: string): NamedNodeTerm | undefined {
  return REGISTRY.get(iri);
}
