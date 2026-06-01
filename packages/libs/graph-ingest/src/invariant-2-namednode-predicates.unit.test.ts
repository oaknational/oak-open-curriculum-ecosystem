/**
 * Contract test for §Test discipline invariant #2 from
 * `graph-stack.plan.md`: every emitted edge carries a `NamedNode`
 * predicate, never a bare string.
 *
 * The invariant applies to every graph-ingest parser. The contract is
 * proven structurally at compile time (graph-core's `Quad.predicate`
 * is typed `PredicateTerm = NamedNode`, enforced by the
 * `DataFactory.quad()` constructor signature) and at runtime here
 * across the actual parser outputs of both parsers (Turtle and JSON-LD).
 *
 * The runtime check is the defensive complement: it catches the case
 * where a future parser bypasses the DataFactory boundary (e.g.
 * inserts a raw vendor Quad via `as unknown as Quad`), which would
 * compile but breaks the invariant.
 */

import type { JsonLdDocument } from '@oaknational/graph-core/jsonld';
import type { DatasetCore } from '@oaknational/graph-core/dataset';
import { describe, expect, it } from 'vitest';

import { parseJsonLdCompatible } from './jsonld-compatible/index.js';
import { parseTurtle } from './turtle/index.js';

// The invariant-2 contract test uses smaller fixtures than the
// parser-specific unit tests (3-quad Turtle here vs 5-quad SKOS in
// `turtle/index.unit.test.ts`; 2-quad JSON-LD here vs 3-quad Person
// in `jsonld-compatible/index.unit.test.ts`). The smaller fixtures
// isolate the invariant under test (every emitted edge carries a
// NamedNode predicate) from richer boundary coverage that belongs
// in the per-parser test files — the minimum-viable fixture that
// produces at least one edge in each parser path.
const TURTLE_FIXTURE = String.raw`
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix ex: <https://example.test/concepts/> .
ex:scheme a skos:ConceptScheme ;
  skos:hasTopConcept ex:concept-1 .
ex:concept-1 a skos:Concept .
`;

const JSONLD_FIXTURE: JsonLdDocument = {
  '@context': { name: 'https://schema.org/name', Person: 'https://schema.org/Person' },
  '@id': 'https://example.test/people/ada',
  '@type': 'Person',
  name: 'Ada',
};

function assertEveryPredicateIsNamedNode(dataset: DatasetCore): void {
  for (const q of dataset) {
    expect(q.predicate.termType).toBe('NamedNode');
  }
}

describe('invariant #2: every emitted edge carries a NamedNode predicate', () => {
  it('holds across parseTurtle output', () => {
    const result = parseTurtle(TURTLE_FIXTURE);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    assertEveryPredicateIsNamedNode(result.value.dataset);
  });

  it('holds across parseJsonLdCompatible output', async () => {
    const result = await parseJsonLdCompatible(JSONLD_FIXTURE);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    assertEveryPredicateIsNamedNode(result.value.dataset);
  });
});
