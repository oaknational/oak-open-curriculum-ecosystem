/**
 * Internal RDF-namespace constants used by the projection.
 *
 * The WS1.6 vocabulary registry (`@oaknational/graph-core/vocab`) ships
 * the RDFS, SKOS, PROV-O, DCTERMS, OWL, SHACL, and schema.org namespaces
 * but **not** the RDF core namespace, which carries `rdf:type`. The
 * projection treats `rdf:type` as the conventional label predicate (see
 * `@oaknational/graph-project/property-graph` TSDoc), so the IRI must
 * be available somewhere.
 *
 * This module is the single, intra-package home for that constant; both
 * forward (`to-property-graph.ts`) and reverse (`from-property-graph.ts`)
 * projection files import it rather than duplicating the IRI literal.
 *
 * **Inc.2 follow-up** (per ADR-173 §Increments row 7 retrospective
 * review): when an RDF core namespace vocab file lands in
 * `@oaknational/graph-core/vocab`, replace the local constant here with
 * an import from that vocab module. The cross-package duplication
 * between `graph-core/data-factory` (which already hardcodes
 * `rdf:langString`) and this module should be resolved by a dedicated
 * RDF vocab cycle, not by ad-hoc edits in projection code.
 */

import { namedNode, type NamedNodeTerm } from '@oaknational/graph-core/data-factory';
import type { NamedNode } from '@oaknational/graph-core/term';

const RDF_TYPE_IRI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

/**
 * The `rdf:type` predicate as a `NamedNode` with literal IRI type
 * preservation. Used by the reverse projection to emit
 * `<subject> rdf:type <label>` quads.
 */
export const rdfType: NamedNodeTerm<typeof RDF_TYPE_IRI> = namedNode(RDF_TYPE_IRI);

/**
 * Predicate identity test against `rdf:type`. Used by the forward
 * projection to route quads onto the `labels` field rather than the
 * `properties` or `edges` fields.
 */
export function isRdfTypePredicate(predicate: NamedNode): boolean {
  return predicate.value === RDF_TYPE_IRI;
}
