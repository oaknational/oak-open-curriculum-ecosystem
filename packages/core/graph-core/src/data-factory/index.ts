/**
 * RDF/JS-aligned DataFactory constructors for graph-core terms and quads.
 *
 * This sub-path owns pure Term construction. Dataset implementations consume
 * these helpers where they need standard RDF/JS shapes, while downstream
 * vocabulary tables can import `namedNode` directly and retain const-typed
 * IRI values.
 */

import type {
  BlankNode,
  DefaultGraph,
  GraphTerm,
  Literal,
  NamedNode,
  ObjectTerm,
  PredicateTerm,
  Quad,
  SubjectTerm,
  TripleTerm,
} from '../term/index.js';

const RDF_LANG_STRING_IRI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString';
const XSD_STRING_IRI = 'http://www.w3.org/2001/XMLSchema#string';

/**
 * NamedNode with a preserved literal `value` type.
 */
export type NamedNodeTerm<Value extends string = string> = NamedNode & {
  readonly value: Value;
};

/**
 * BlankNode with a preserved literal `value` type.
 */
export type BlankNodeTerm<Label extends string = string> = BlankNode & {
  readonly value: Label;
};

/**
 * Literal with a preserved literal lexical value type.
 */
export type LiteralTerm<Value extends string = string> = Literal & {
  readonly value: Value;
};

/**
 * Construct an RDF/JS NamedNode with literal IRI type preservation.
 */
export function namedNode<Value extends string>(value: Value): NamedNodeTerm<Value> {
  return { termType: 'NamedNode', value };
}

/**
 * Construct an RDF/JS BlankNode with literal label type preservation.
 */
export function blankNode<Label extends string>(value: Label): BlankNodeTerm<Label> {
  return { termType: 'BlankNode', value };
}

/**
 * Construct the RDF/JS default graph term.
 */
export function defaultGraph(): DefaultGraph {
  return { termType: 'DefaultGraph', value: '' };
}

/**
 * Construct a Literal. A string second argument creates an rdf:langString
 * language-tagged literal; a NamedNode second argument creates a datatype
 * literal; omitting the second argument creates an xsd:string literal.
 *
 * TODO(WS1.6): decide whether vocabulary-registry ergonomics need a separate
 * datatype-IRI helper. WS1.3 deliberately treats string modifiers as language
 * tags only; pass `namedNode(datatypeIri)` for datatype literals.
 */
export function literal<Value extends string>(
  value: Value,
  languageOrDatatype?: string | NamedNode,
): LiteralTerm<Value> {
  const modifier = languageOrDatatype ?? namedNode(XSD_STRING_IRI);

  if (typeof modifier === 'string') {
    return {
      termType: 'Literal',
      value,
      language: modifier,
      direction: '',
      datatype: namedNode(RDF_LANG_STRING_IRI),
    };
  }

  return {
    termType: 'Literal',
    value,
    language: '',
    direction: '',
    datatype: modifier,
  };
}

/**
 * Construct an RDF 1.2 triple-as-term with RDF/JS empty-string value.
 */
export function tripleTerm(
  subject: SubjectTerm,
  predicate: PredicateTerm,
  object: ObjectTerm,
): TripleTerm {
  return {
    termType: 'TripleTerm',
    value: '',
    subject,
    predicate,
    object,
  };
}

/**
 * Construct a Quad, defaulting to the default graph when no graph is supplied.
 */
export function quad(
  subject: SubjectTerm,
  predicate: PredicateTerm,
  object: ObjectTerm,
  graph: GraphTerm = defaultGraph(),
): Quad {
  return {
    termType: 'Quad',
    subject,
    predicate,
    object,
    graph,
  };
}
