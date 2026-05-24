/**
 * Contract test for §Test discipline invariant #3 from
 * `graph-stack.plan.md`: source path preserved end-to-end on every
 * Quad produced by graph-ingest.
 *
 * Mirrors the invariant-2 precedent in placement (one level above
 * both parser directories) and in shape (a typed assertion helper
 * + `it.each` over parser fixtures). The invariant IS the system
 * state — "every parser output carries source-path coverage" —
 * which a future parser-bypass would break.
 *
 * Test-expert verdict on the WS2.3 cycle: the runtime check is the
 * defensive complement to the compile-time `SourceMap` typing.
 * `sourceMap.size === dataset.size` is the domain-grounded
 * cardinality assertion; per-quad presence (a defined value
 * returned by `sourceMap.get(quadKey(q))`) is the membership
 * assertion.
 */

import type { JsonLdDocument } from '@oaknational/graph-core/jsonld';
import type { DatasetCore } from '@oaknational/graph-core/dataset';
import { describe, expect, it } from 'vitest';

import { parseJsonLdCompatible } from './jsonld-compatible/index.js';
import { parseTurtle } from './turtle/index.js';
import { quadKey, type SourceMap } from './source-path/index.js';

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

function assertEveryQuadHasSourcePath(dataset: DatasetCore, sourceMap: SourceMap): void {
  expect(sourceMap.size).toBe(dataset.size);
  for (const q of dataset) {
    const location = sourceMap.get(quadKey(q));
    expect(location).toBeDefined();
  }
}

describe('invariant #3: source path preserved on every emitted Quad', () => {
  it('holds across parseTurtle output', () => {
    const result = parseTurtle(TURTLE_FIXTURE);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    assertEveryQuadHasSourcePath(result.value.dataset, result.value.sourceMap);
  });

  it('holds across parseJsonLdCompatible output', async () => {
    const result = await parseJsonLdCompatible(JSONLD_FIXTURE);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    assertEveryQuadHasSourcePath(result.value.dataset, result.value.sourceMap);
  });
});
