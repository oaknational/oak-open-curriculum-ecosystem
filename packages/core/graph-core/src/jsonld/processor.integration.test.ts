/**
 * Integration tests for the versioned JSON-LD processor adapter.
 */

import { describe, expect, it } from 'vitest';

import { createDataset } from '../dataset/index.js';
import { literal, namedNode, quad } from '../data-factory/index.js';
import type { DatasetCore } from '../dataset/index.js';
import type { JsonLdDocument, JsonLdFrame, JsonLdObject } from './processor.js';
import { createJsonLdProcessor } from './processor.js';

const SKOS_CONCEPT_IRI = 'http://www.w3.org/2004/02/skos/core#Concept';
const SKOS_PREF_LABEL_IRI = 'http://www.w3.org/2004/02/skos/core#prefLabel';
const EXAMPLE_VOCAB_PREFIX = 'https://example.org/vocab#';
const EXAMPLE_THREAD_IRI = `${EXAMPLE_VOCAB_PREFIX}Thread`;
const RDF_TYPE_IRI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

const skosContext = {
  skos: 'http://www.w3.org/2004/02/skos/core#',
  Concept: 'skos:Concept',
  prefLabel: 'skos:prefLabel',
} satisfies JsonLdObject;

const knownSkosDocument: JsonLdDocument = {
  '@context': skosContext,
  '@id': 'https://example.org/concepts/fractions',
  '@type': 'Concept',
  prefLabel: {
    '@language': 'en',
    '@value': 'Fractions',
  },
};

const exampleThreadsContext = {
  ex: EXAMPLE_VOCAB_PREFIX,
  skos: 'http://www.w3.org/2004/02/skos/core#',
  id: '@id',
  type: '@type',
  includesThread: {
    '@id': 'ex:includesThread',
    '@type': '@id',
  },
  prefLabel: 'skos:prefLabel',
} satisfies JsonLdObject;

const minimalLinkedThreadsRawImport: JsonLdDocument = {
  // Minimal contract fixture for linked-thread raw import shape, not a domain corpus.
  '@context': exampleThreadsContext,
  '@graph': [
    {
      id: 'https://example.org/unit/fractions',
      type: 'ex:Unit',
      includesThread: 'https://example.org/thread/fractions',
    } satisfies JsonLdObject,
    {
      id: 'https://example.org/thread/fractions',
      type: 'ex:Thread',
      prefLabel: 'Fractions thread',
    } satisfies JsonLdObject,
    {
      id: 'https://example.org/unit/ratio',
      type: 'ex:Unit',
      includesThread: 'https://example.org/thread/ratio',
    } satisfies JsonLdObject,
    {
      id: 'https://example.org/thread/ratio',
      type: 'ex:Thread',
      prefLabel: 'Ratio thread',
    } satisfies JsonLdObject,
  ],
};

const threadFrame: JsonLdFrame = {
  '@context': exampleThreadsContext,
  '@type': 'ex:Thread',
};

function expectOk<T>(result: { readonly ok: true; readonly value: T } | { readonly ok: false }): T {
  expect(result.ok).toBe(true);
  if (result.ok) {
    return result.value;
  }
  throw new Error('Expected JSON-LD processor result to be Ok.');
}

function getStringField(record: JsonLdObject, key: string): string {
  const value = record[key];
  if (typeof value !== 'string') {
    throw new Error(`Expected ${key} to be a string.`);
  }
  return value;
}

function getGraph(document: JsonLdObject): readonly JsonLdObject[] {
  const value = document['@graph'];
  if (
    !Array.isArray(value) ||
    !value.every(
      (item): item is JsonLdObject =>
        typeof item === 'object' && item !== null && !Array.isArray(item),
    )
  ) {
    throw new Error('Expected framed JSON-LD document to contain an object @graph.');
  }
  return value;
}

function datasetFromFramedThreads(document: JsonLdObject): DatasetCore {
  const dataset = createDataset();

  for (const item of getGraph(document)) {
    const id = getStringField(item, 'id');
    const type = expandExampleVocabIri(getStringField(item, 'type'));
    const label = getStringField(item, 'prefLabel');

    dataset
      .add(quad(namedNode(id), namedNode(RDF_TYPE_IRI), namedNode(type)))
      .add(quad(namedNode(id), namedNode(SKOS_PREF_LABEL_IRI), literal(label)));
  }

  return dataset;
}

function expandExampleVocabIri(value: string): string {
  return value.startsWith('ex:') ? `${EXAMPLE_VOCAB_PREFIX}${value.slice('ex:'.length)}` : value;
}

function expectSameDataset(actual: DatasetCore, expected: DatasetCore): void {
  expect(actual.size).toBe(expected.size);
  for (const expectedQuad of expected) {
    expect(actual.has(expectedQuad)).toBe(true);
  }
}

describe('JsonLdProcessor integration', () => {
  it('expands a known SKOS document deterministically', async () => {
    const processor = createJsonLdProcessor();

    const expanded = expectOk(await processor.expand(knownSkosDocument));

    expect(expanded).toStrictEqual([
      {
        '@id': 'https://example.org/concepts/fractions',
        '@type': [SKOS_CONCEPT_IRI],
        [SKOS_PREF_LABEL_IRI]: [
          {
            '@language': 'en',
            '@value': 'Fractions',
          },
        ],
      },
    ]);
  });

  it('compacts an expanded SKOS document back to the declared context shape', async () => {
    const processor = createJsonLdProcessor();
    const expanded = expectOk(await processor.expand(knownSkosDocument));

    const compacted = expectOk(await processor.compact(expanded, skosContext));

    expect(compacted['@context']).toStrictEqual(skosContext);
    expect(compacted['@id']).toBe('https://example.org/concepts/fractions');
    expect(compacted['@type']).toBe('Concept');
    expect(compacted['prefLabel']).toStrictEqual({
      '@language': 'en',
      '@value': 'Fractions',
    });
  });

  it('frames a minimal linked-thread raw import deterministically as DatasetCore quads', async () => {
    const processor = createJsonLdProcessor();

    const framed = expectOk(await processor.frame(minimalLinkedThreadsRawImport, threadFrame));
    const actual = datasetFromFramedThreads(framed);
    const expected = createDataset([
      quad(
        namedNode('https://example.org/thread/fractions'),
        namedNode(RDF_TYPE_IRI),
        namedNode(EXAMPLE_THREAD_IRI),
      ),
      quad(
        namedNode('https://example.org/thread/fractions'),
        namedNode(SKOS_PREF_LABEL_IRI),
        literal('Fractions thread'),
      ),
      quad(
        namedNode('https://example.org/thread/ratio'),
        namedNode(RDF_TYPE_IRI),
        namedNode(EXAMPLE_THREAD_IRI),
      ),
      quad(
        namedNode('https://example.org/thread/ratio'),
        namedNode(SKOS_PREF_LABEL_IRI),
        literal('Ratio thread'),
      ),
    ]);

    expectSameDataset(actual, expected);
  });

  it('keeps remote context dereferencing outside graph-core', async () => {
    const processor = createJsonLdProcessor();
    const result = await processor.expand({
      '@context': 'https://example.org/remote-context.jsonld',
      '@id': 'https://example.org/concepts/remote-context',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatchObject({
        kind: 'remote_context_disallowed',
        operation: 'expand',
      });
      expect(result.error.message).toContain(
        'Remote JSON-LD context loading is disabled for graph-core',
      );
    }
  });
});
