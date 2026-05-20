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

export function reconstructQuad(parsed: ParsedQuad): Quad {
  return quad(
    toSubject(parsed.subject),
    toPredicate(parsed.predicate),
    toObject(parsed.object),
    toGraph(parsed.graph),
  );
}
