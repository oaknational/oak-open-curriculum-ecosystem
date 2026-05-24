/**
 * Vendor-isolation boundary for graph-ingest parsers.
 *
 * Both the `jsonld-compatible` and `turtle` sub-path parsers consume
 * RDF/JS-compatible Term + Quad outputs from third-party libraries
 * (`jsonld.js` via n-quads, `n3.js` directly). This module normalises
 * those outputs through graph-core's `DataFactory` constructors so
 * the resulting `DatasetCore` carries only graph-core's typed
 * `Term`/`Quad` values — never raw vendor Quads.
 *
 * The vendor-isolation discipline is load-bearing: n3.js's
 * `Literal.direction` is typed as `string | null`, while graph-core's
 * `Literal.direction` is the narrower union `'' | 'ltr' | 'rtl'`.
 * Passing n3 literals directly into a `DatasetCore` would silently
 * widen the type through structural assignment. The narrower direction
 * union is the RDF 1.1 surface graph-core commits to; n3's wider
 * surface is collapsed to `''` here per `principles.md` §"NEVER create
 * compatibility layers" — when RDF 1.2 base-direction support lands
 * the discriminator change is at this boundary, not scattered through
 * downstream code.
 *
 * @packageDocumentation
 */

import {
  blankNode,
  defaultGraph,
  literal,
  namedNode,
  quad,
} from '@oaknational/graph-core/data-factory';
import type {
  GraphTerm,
  ObjectTerm,
  PredicateTerm,
  Quad,
  SubjectTerm,
} from '@oaknational/graph-core/term';
import type { Quad as N3Quad, Term as N3Term } from 'n3';

/**
 * Discriminated failure variants when an n3 Term cannot be mapped to a
 * graph-core Term. In practice every Term emitted by a Turtle or
 * N-Quads parser is a NamedNode / BlankNode / Literal / DefaultGraph;
 * `unsupported-term` fires only if a Variable or other unexpected
 * termType reaches this boundary (Variables are not produced by
 * parsing a serialised RDF document but are admissible in the n3 Term
 * union, so the check is defensive).
 */
export interface NormalizeError {
  readonly kind: 'unsupported-term';
  readonly position: 'subject' | 'predicate' | 'object' | 'graph';
  readonly termType: string;
}

/**
 * Map an n3 subject Term to a graph-core SubjectTerm. n3 admits
 * NamedNode | BlankNode | Variable in subject position; Variable is
 * rejected here as not present in any Turtle/N-Quads document.
 */
function toSubjectTerm(term: N3Term): SubjectTerm | NormalizeError {
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  if (term.termType === 'BlankNode') {
    return blankNode(term.value);
  }
  return { kind: 'unsupported-term', position: 'subject', termType: term.termType };
}

/**
 * Map an n3 predicate Term to a graph-core PredicateTerm
 * (`NamedNode`). The graph-core surface forbids non-NamedNode
 * predicates by type; n3 admits Variable in predicate position so the
 * check is defensive.
 */
function toPredicateTerm(term: N3Term): PredicateTerm | NormalizeError {
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  return { kind: 'unsupported-term', position: 'predicate', termType: term.termType };
}

/**
 * Map an n3 object Term to a graph-core ObjectTerm.
 *
 * For `Literal`, `language` is preferred over `datatype` when present
 * (RDF/JS language-tagged literals carry both: the language string and
 * the implicit `rdf:langString` datatype). graph-core's `literal()`
 * helper handles the discrimination at its language-vs-datatype
 * parameter.
 */
function toObjectTerm(term: N3Term): ObjectTerm | NormalizeError {
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  if (term.termType === 'BlankNode') {
    return blankNode(term.value);
  }
  if (term.termType === 'Literal') {
    const lang = term.language;
    if (typeof lang === 'string' && lang.length > 0) {
      return literal(term.value, lang);
    }
    return literal(term.value, namedNode(term.datatype.value));
  }
  return { kind: 'unsupported-term', position: 'object', termType: term.termType };
}

/**
 * Map an n3 graph Term to a graph-core GraphTerm.
 */
function toGraphTerm(term: N3Term): GraphTerm | NormalizeError {
  if (term.termType === 'DefaultGraph') {
    return defaultGraph();
  }
  if (term.termType === 'NamedNode') {
    return namedNode(term.value);
  }
  if (term.termType === 'BlankNode') {
    return blankNode(term.value);
  }
  return { kind: 'unsupported-term', position: 'graph', termType: term.termType };
}

/**
 * Type guard discriminating a `NormalizeError` from a successful
 * Term/Quad output. Exported so the parser modules can narrow uniformly.
 */
export function isNormalizeError(
  value: SubjectTerm | PredicateTerm | ObjectTerm | GraphTerm | Quad | NormalizeError,
): value is NormalizeError {
  return 'kind' in value && value.kind === 'unsupported-term';
}

/**
 * Map a single n3 Quad to a graph-core Quad, returning the first
 * normalisation error encountered (subject → predicate → object →
 * graph order).
 */
export function normalizeQuad(input: N3Quad): Quad | NormalizeError {
  const subject = toSubjectTerm(input.subject);
  if (isNormalizeError(subject)) {
    return subject;
  }
  const predicate = toPredicateTerm(input.predicate);
  if (isNormalizeError(predicate)) {
    return predicate;
  }
  const object = toObjectTerm(input.object);
  if (isNormalizeError(object)) {
    return object;
  }
  const graph = toGraphTerm(input.graph);
  if (isNormalizeError(graph)) {
    return graph;
  }
  return quad(subject, predicate, object, graph);
}
