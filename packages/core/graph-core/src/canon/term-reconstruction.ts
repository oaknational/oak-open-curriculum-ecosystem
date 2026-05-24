/**
 * Term reconstruction from rdf-canonize NQuads.parse output.
 *
 * The N-Quads parser emits a minimal POJO shape (`{ termType, value, ... }`)
 * that lacks the RDF/JS canonical fields (notably `direction: ''` on
 * literals per RDF 1.2). Each helper routes its parsed term through the
 * graph-core `data-factory` so the reconstructed `DatasetCore` carries
 * canonical Term shapes throughout. Invalid term-position shapes (e.g. a
 * Literal in subject position) throw `TermReconstructionError`, which the
 * caller in `canonicalize.ts` surfaces in the outer `CanonicalizationError.message`.
 */

import { blankNode, defaultGraph, literal, namedNode, quad } from '../data-factory/index.js';
import type { GraphTerm, ObjectTerm, PredicateTerm, Quad, SubjectTerm } from '../term/index.js';

import type { ParsedQuad, ParsedQuadTerm } from './runtime.js';

const RDF_LANG_STRING_IRI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString';

type TermPosition = 'subject' | 'predicate' | 'object' | 'graph';

export class TermReconstructionError extends Error {
  readonly position: TermPosition;
  readonly termType: string;

  constructor(position: TermPosition, termType: string, detail: string) {
    super(`${position} term reconstruction failed (termType=${termType}): ${detail}`);
    this.name = 'TermReconstructionError';
    this.position = position;
    this.termType = termType;
  }
}

/**
 * Reconstruct a Literal object term from its parsed shape.
 *
 * Branches on the datatype IRI: the rdf:langString datatype requires a
 * language tag and produces a language-tagged literal; every other
 * datatype produces a datatyped literal. Missing required metadata
 * (no datatype, or rdf:langString without a tag) throws
 * `TermReconstructionError` so the outer Result envelope surfaces the
 * shape mismatch precisely.
 */
function literalFromParsed(term: ParsedQuadTerm): ObjectTerm {
  const datatypeIri = term.datatype?.value;
  if (datatypeIri === undefined) {
    throw new TermReconstructionError('object', 'Literal', 'literal is missing a datatype IRI');
  }
  if (datatypeIri === RDF_LANG_STRING_IRI) {
    const tag = term.language;
    if (tag === undefined) {
      throw new TermReconstructionError(
        'object',
        'Literal',
        'rdf:langString literal is missing a language tag',
      );
    }
    return literal(term.value, tag);
  }
  return literal(term.value, namedNode(datatypeIri));
}

/**
 * Reconstruct a subject term. The RDF data model permits only NamedNode
 * and BlankNode in subject position; any other termType is a reconstruction
 * failure and throws `TermReconstructionError`. The `default` arm is an
 * exhaustiveness proof: if `ParsedQuadTerm.termType` grows a new variant,
 * the `const exhaustive: never` assignment fails to compile.
 */
function toSubject(term: ParsedQuadTerm): SubjectTerm {
  switch (term.termType) {
    case 'NamedNode':
      return namedNode(term.value);
    case 'BlankNode':
      return blankNode(term.value);
    case 'Literal':
    case 'DefaultGraph':
      throw new TermReconstructionError(
        'subject',
        term.termType,
        'only NamedNode or BlankNode are valid in subject position',
      );
    default: {
      const exhaustive: never = term.termType;
      throw new TermReconstructionError('subject', String(exhaustive), 'unknown termType');
    }
  }
}

/**
 * Reconstruct a predicate term. The RDF data model permits only NamedNode
 * in predicate position; BlankNode, Literal, and DefaultGraph in predicate
 * position are reconstruction failures and throw `TermReconstructionError`.
 * The `default` arm asserts `never` for compile-time exhaustiveness.
 */
function toPredicate(term: ParsedQuadTerm): PredicateTerm {
  switch (term.termType) {
    case 'NamedNode':
      return namedNode(term.value);
    case 'BlankNode':
    case 'Literal':
    case 'DefaultGraph':
      throw new TermReconstructionError(
        'predicate',
        term.termType,
        'only NamedNode is valid in predicate position',
      );
    default: {
      const exhaustive: never = term.termType;
      throw new TermReconstructionError('predicate', String(exhaustive), 'unknown termType');
    }
  }
}

/**
 * Reconstruct an object term. The RDF data model permits NamedNode,
 * BlankNode, and Literal in object position; DefaultGraph is a
 * reconstruction failure. Literal reconstruction delegates to
 * `literalFromParsed` to keep this function's cyclomatic complexity
 * under the lint limit. The `default` arm asserts `never` for
 * compile-time exhaustiveness.
 */
function toObject(term: ParsedQuadTerm): ObjectTerm {
  switch (term.termType) {
    case 'NamedNode':
      return namedNode(term.value);
    case 'BlankNode':
      return blankNode(term.value);
    case 'Literal':
      return literalFromParsed(term);
    case 'DefaultGraph':
      throw new TermReconstructionError(
        'object',
        term.termType,
        'DefaultGraph is not a valid object term',
      );
    default: {
      const exhaustive: never = term.termType;
      throw new TermReconstructionError('object', String(exhaustive), 'unknown termType');
    }
  }
}

/**
 * Reconstruct a graph term. The RDF data model permits DefaultGraph,
 * NamedNode, and BlankNode in graph position; Literal is a
 * reconstruction failure. The `default` arm asserts `never` for
 * compile-time exhaustiveness.
 */
function toGraph(term: ParsedQuadTerm): GraphTerm {
  switch (term.termType) {
    case 'DefaultGraph':
      return defaultGraph();
    case 'NamedNode':
      return namedNode(term.value);
    case 'BlankNode':
      return blankNode(term.value);
    case 'Literal':
      throw new TermReconstructionError(
        'graph',
        term.termType,
        'Literal is not a valid graph term',
      );
    default: {
      const exhaustive: never = term.termType;
      throw new TermReconstructionError('graph', String(exhaustive), 'unknown termType');
    }
  }
}

/**
 * Reconstruct a canonical `Quad` from an rdf-canonize parsed quad. Each
 * term position routes through its position-specific reconstruction
 * helper so position-illegal term shapes (e.g. a Literal in the subject
 * slot) throw `TermReconstructionError` with the failing position named.
 */
export function reconstructQuad(parsed: ParsedQuad): Quad {
  return quad(
    toSubject(parsed.subject),
    toPredicate(parsed.predicate),
    toObject(parsed.object),
    toGraph(parsed.graph),
  );
}
