import { namedNode, quad } from '@oaknational/graph-core/data-factory';
import { describe, expect, it } from 'vitest';

import { parseTurtle } from './index.js';

// A minimal SKOS Turtle fixture. Five quads represent the smallest
// SKOS scheme that exercises the invariants the parser must preserve:
//   1 ConceptScheme declaration (rdf:type)
//   2 Concept declarations (rdf:type × 2)
//   1 hasTopConcept relation (scheme → concept)
//   1 broader relation (concept-1 → concept-2)
// = 5 quads. The named-domain rationale (named concepts + their
// taxonomic relation) means the count is a domain fact, not a test-
// author choice; that satisfies the audit-shape avoidance per
// `test-immediate-fails.md` item 16.
const SKOS_TURTLE_FIXTURE = String.raw`
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix ex: <https://example.test/concepts/> .

ex:scheme a skos:ConceptScheme ;
  skos:hasTopConcept ex:concept-1 .

ex:concept-1 a skos:Concept .

ex:concept-2 a skos:Concept ;
  skos:broader ex:concept-1 .
`;

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const SKOS_CONCEPT_SCHEME = 'http://www.w3.org/2004/02/skos/core#ConceptScheme';
const SKOS_CONCEPT = 'http://www.w3.org/2004/02/skos/core#Concept';
const SKOS_HAS_TOP_CONCEPT = 'http://www.w3.org/2004/02/skos/core#hasTopConcept';
const SKOS_BROADER = 'http://www.w3.org/2004/02/skos/core#broader';
const EX_SCHEME = 'https://example.test/concepts/scheme';
const EX_CONCEPT_1 = 'https://example.test/concepts/concept-1';
const EX_CONCEPT_2 = 'https://example.test/concepts/concept-2';

describe('parseTurtle', () => {
  it('parses a minimal SKOS scheme into the five expected quads', () => {
    const result = parseTurtle(SKOS_TURTLE_FIXTURE);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const dataset = result.value;

    expect(dataset.size).toBe(5);
    expect(
      dataset.has(quad(namedNode(EX_SCHEME), namedNode(RDF_TYPE), namedNode(SKOS_CONCEPT_SCHEME))),
    ).toBe(true);
    expect(
      dataset.has(
        quad(namedNode(EX_SCHEME), namedNode(SKOS_HAS_TOP_CONCEPT), namedNode(EX_CONCEPT_1)),
      ),
    ).toBe(true);
    expect(
      dataset.has(quad(namedNode(EX_CONCEPT_1), namedNode(RDF_TYPE), namedNode(SKOS_CONCEPT))),
    ).toBe(true);
    expect(
      dataset.has(quad(namedNode(EX_CONCEPT_2), namedNode(RDF_TYPE), namedNode(SKOS_CONCEPT))),
    ).toBe(true);
    expect(
      dataset.has(quad(namedNode(EX_CONCEPT_2), namedNode(SKOS_BROADER), namedNode(EX_CONCEPT_1))),
    ).toBe(true);
  });

  it('returns deterministic Datasets on repeated parses of the same input', () => {
    const first = parseTurtle(SKOS_TURTLE_FIXTURE);
    const second = parseTurtle(SKOS_TURTLE_FIXTURE);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }

    expect(first.value.size).toBe(second.value.size);
    for (const q of first.value) {
      expect(second.value.has(q)).toBe(true);
    }
  });

  it('returns err turtle-syntax when the input is not valid Turtle', () => {
    const result = parseTurtle('this is not turtle <<< <<<');

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('turtle-syntax');
  });

  it('returns ok with an empty Dataset for empty input', () => {
    const result = parseTurtle('');

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.size).toBe(0);
  });
});
