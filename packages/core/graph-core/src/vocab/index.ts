/**
 * Vocabulary registry sub-path.
 *
 * Exposes per-vocabulary const-typed `NamedNodeTerm` namespaces and a
 * reverse-lookup `byIri` function. Forward lookups (e.g. `RDFS.label`)
 * preserve literal IRI types for compile-time use sites; reverse
 * lookup returns `NamedNodeTerm | undefined` because the IRI key is a
 * runtime string.
 *
 * @example
 * ```typescript
 * import { RDFS, byIri } from '@oaknational/graph-core/vocab';
 *
 * const label = RDFS.label.value;
 * //    ^? 'http://www.w3.org/2000/01/rdf-schema#label'
 *
 * const resolved = byIri('http://www.w3.org/2000/01/rdf-schema#label');
 * // resolved equals RDFS.label
 * ```
 */

export { DCTERMS } from './dcterms.js';
export { OWL } from './owl.js';
export { PROV } from './prov.js';
export { RDFS } from './rdfs.js';
export { SCHEMA } from './schema-org.js';
export { SHACL } from './shacl.js';
export { SKOS } from './skos.js';
export { byIri } from './registry.js';
