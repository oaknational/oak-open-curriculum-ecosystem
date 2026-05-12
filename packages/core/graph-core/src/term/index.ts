/**
 * RDF 1.2 Term hierarchy and Quad type, aligned with the RDF/JS Data Model
 * interface family.
 *
 * Each Term carries a `termType` literal discriminant so consumers can
 * narrow without `instanceof`. Equality is provided as a free function
 * (`equals`) rather than an instance method, keeping all Term values pure
 * POJOs. This matches the framework-tier discipline of `@oaknational/result`
 * and lets ingest pipelines construct terms by object literal without
 * importing a runtime constructor.
 *
 * RDF 1.2 notes:
 * - `TripleTerm` represents a triple-as-term and may appear in object
 *   position only (per the current RDF 1.2 Working Draft); subject and
 *   graph positions retain the RDF 1.1 surface.
 * - `Literal` carries `direction` (base direction) alongside `language`
 *   and `datatype`; an empty-string `direction` denotes "no base
 *   direction declared".
 *
 * @example
 * ```typescript
 * import {
 *   equals,
 *   type Literal,
 *   type NamedNode,
 * } from '@oaknational/graph-core/term';
 *
 * const xsdString: NamedNode = {
 *   termType: 'NamedNode',
 *   value: 'http://www.w3.org/2001/XMLSchema#string',
 * };
 * const hello: Literal = {
 *   termType: 'Literal',
 *   value: 'hello',
 *   language: '',
 *   direction: '',
 *   datatype: xsdString,
 * };
 * equals(hello, hello); // true
 * ```
 */

/**
 * IRI-identified RDF term.
 */
export interface NamedNode {
  readonly termType: 'NamedNode';
  readonly value: string;
}

/**
 * Locally-scoped existential RDF term. The `value` carries the blank-node
 * label; identity is scoped to the enclosing dataset.
 */
export interface BlankNode {
  readonly termType: 'BlankNode';
  readonly value: string;
}

/**
 * Literal RDF term. `language` is the BCP-47 language tag (empty string
 * when absent); `direction` is the RDF 1.2 base direction (`'ltr'`,
 * `'rtl'`, or empty string when absent); `datatype` is the IRI of the
 * literal's datatype (typically `xsd:string` or `rdf:langString`).
 */
export interface Literal {
  readonly termType: 'Literal';
  readonly value: string;
  readonly language: string;
  readonly direction: '' | 'ltr' | 'rtl';
  readonly datatype: NamedNode;
}

/**
 * The default graph of an RDF dataset. Its `value` is the empty string by
 * RDF/JS convention.
 */
export interface DefaultGraph {
  readonly termType: 'DefaultGraph';
  readonly value: '';
}

/**
 * RDF 1.2 triple-as-term. Carries a subject, predicate, and object and
 * may appear in object position of an outer triple. `value` is the empty
 * string by RDF/JS Data Model convention so every Term satisfies a
 * uniform `value: string` shape.
 */
export interface TripleTerm {
  readonly termType: 'TripleTerm';
  readonly value: '';
  readonly subject: SubjectTerm;
  readonly predicate: NamedNode;
  readonly object: ObjectTerm;
}

/**
 * Terms permitted in subject position.
 */
export type SubjectTerm = NamedNode | BlankNode;

/**
 * Terms permitted in predicate position.
 */
export type PredicateTerm = NamedNode;

/**
 * Terms permitted in object position. RDF 1.2 admits `TripleTerm` here.
 */
export type ObjectTerm = NamedNode | BlankNode | Literal | TripleTerm;

/**
 * Terms permitted in graph position.
 */
export type GraphTerm = NamedNode | BlankNode | DefaultGraph;

/**
 * Discriminated union of every Term kind in the RDF 1.2 surface.
 */
export type Term = NamedNode | BlankNode | Literal | DefaultGraph | TripleTerm;

/**
 * Quad: a triple plus the graph it belongs to. RDF/JS-aligned in carrying
 * a `termType: 'Quad'` discriminant so equality may treat Term and Quad
 * uniformly.
 */
export interface Quad {
  readonly termType: 'Quad';
  readonly subject: SubjectTerm;
  readonly predicate: PredicateTerm;
  readonly object: ObjectTerm;
  readonly graph: GraphTerm;
}

/**
 * Structural equality across Terms and Quads. Two values are equal when
 * they share `termType` and every discriminant-specific field is equal
 * recursively. Literals compare by value, language, direction, and
 * datatype (each required to be set; an unspecified language or
 * direction is represented by an empty string).
 *
 * @example
 * ```typescript
 * const a: NamedNode = { termType: 'NamedNode', value: 'http://example/a' };
 * const b: NamedNode = { termType: 'NamedNode', value: 'http://example/a' };
 * equals(a, b); // true
 * ```
 */
type Checker = (a: Term | Quad, b: Term | Quad) => boolean;

function namedNodeEquals(a: Term | Quad, b: Term | Quad): boolean {
  return a.termType === 'NamedNode' && b.termType === 'NamedNode' && a.value === b.value;
}

function blankNodeEquals(a: Term | Quad, b: Term | Quad): boolean {
  return a.termType === 'BlankNode' && b.termType === 'BlankNode' && a.value === b.value;
}

function defaultGraphEquals(a: Term | Quad, b: Term | Quad): boolean {
  return a.termType === 'DefaultGraph' && b.termType === 'DefaultGraph';
}

function literalEquals(a: Term | Quad, b: Term | Quad): boolean {
  return (
    a.termType === 'Literal' &&
    b.termType === 'Literal' &&
    a.value === b.value &&
    a.language === b.language &&
    a.direction === b.direction &&
    a.datatype.value === b.datatype.value
  );
}

function tripleTermEquals(a: Term | Quad, b: Term | Quad): boolean {
  return (
    a.termType === 'TripleTerm' &&
    b.termType === 'TripleTerm' &&
    equals(a.subject, b.subject) &&
    equals(a.predicate, b.predicate) &&
    equals(a.object, b.object)
  );
}

function quadEquals(a: Term | Quad, b: Term | Quad): boolean {
  return (
    a.termType === 'Quad' &&
    b.termType === 'Quad' &&
    equals(a.subject, b.subject) &&
    equals(a.predicate, b.predicate) &&
    equals(a.object, b.object) &&
    equals(a.graph, b.graph)
  );
}

const checkers: readonly Checker[] = [
  namedNodeEquals,
  blankNodeEquals,
  defaultGraphEquals,
  literalEquals,
  tripleTermEquals,
  quadEquals,
];

export function equals(a: Term | Quad, b: Term | Quad): boolean {
  return checkers.some((check) => check(a, b));
}
