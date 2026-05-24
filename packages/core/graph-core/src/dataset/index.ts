/**
 * RDF/JS-aligned DatasetCore and DataFactory surface.
 *
 * The DatasetCore implementation is a small in-memory RDF dataset that
 * follows the RDF/JS mutable set contract: `add` and `delete` return the
 * dataset itself, `has` uses structural Quad equality, `match` returns an
 * independent DatasetCore, and iteration yields quads in insertion order.
 *
 * DataFactory helpers construct the Term and Quad POJOs defined by
 * `@oaknational/graph-core/term`. The helper return types preserve literal
 * string values where downstream vocabulary tables need const-typed IRIs.
 */

import {
  equals,
  type GraphTerm,
  type ObjectTerm,
  type PredicateTerm,
  type Quad,
  type SubjectTerm,
} from '../term/index.js';

/**
 * RDF/JS DatasetCore-compatible mutable set of Quads.
 */
export interface DatasetCore extends Iterable<Quad> {
  readonly size: number;
  add(quad: Quad): DatasetCore;
  delete(quad: Quad): DatasetCore;
  has(quad: Quad): boolean;
  match(
    subject?: SubjectTerm | null,
    predicate?: PredicateTerm | null,
    object?: ObjectTerm | null,
    graph?: GraphTerm | null,
  ): DatasetCore;
}

interface QuadPattern {
  readonly subject: SubjectTerm | null;
  readonly predicate: PredicateTerm | null;
  readonly object: ObjectTerm | null;
  readonly graph: GraphTerm | null;
}

type PatternMatcher = (candidate: Quad, pattern: QuadPattern) => boolean;

function matchesSubject(candidate: Quad, pattern: QuadPattern): boolean {
  return pattern.subject === null || equals(candidate.subject, pattern.subject);
}

function matchesPredicate(candidate: Quad, pattern: QuadPattern): boolean {
  return pattern.predicate === null || equals(candidate.predicate, pattern.predicate);
}

function matchesObject(candidate: Quad, pattern: QuadPattern): boolean {
  return pattern.object === null || equals(candidate.object, pattern.object);
}

function matchesGraph(candidate: Quad, pattern: QuadPattern): boolean {
  return pattern.graph === null || equals(candidate.graph, pattern.graph);
}

const patternMatchers: readonly PatternMatcher[] = [
  matchesSubject,
  matchesPredicate,
  matchesObject,
  matchesGraph,
];

function matchesPattern(candidate: Quad, pattern: QuadPattern): boolean {
  return patternMatchers.every((matcher) => matcher(candidate, pattern));
}

/**
 * Create an RDF/JS-aligned mutable in-memory DatasetCore.
 */
export function createDataset(quads: Iterable<Quad> = []): DatasetCore {
  const entries: Quad[] = [];

  const dataset: DatasetCore = {
    get size(): number {
      return entries.length;
    },
    add(candidate: Quad): DatasetCore {
      if (!dataset.has(candidate)) {
        entries.push(candidate);
      }
      return dataset;
    },
    delete(candidate: Quad): DatasetCore {
      const index = entries.findIndex((entry) => equals(entry, candidate));
      if (index >= 0) {
        entries.splice(index, 1);
      }
      return dataset;
    },
    has(candidate: Quad): boolean {
      return entries.some((entry) => equals(entry, candidate));
    },
    match(
      subject: SubjectTerm | null = null,
      predicate: PredicateTerm | null = null,
      object: ObjectTerm | null = null,
      graph: GraphTerm | null = null,
    ): DatasetCore {
      const pattern: QuadPattern = { subject, predicate, object, graph };
      return createDataset(entries.filter((entry) => matchesPattern(entry, pattern)));
    },
    [Symbol.iterator](): Iterator<Quad> {
      return entries[Symbol.iterator]();
    },
  };

  for (const item of quads) {
    dataset.add(item);
  }

  return dataset;
}
