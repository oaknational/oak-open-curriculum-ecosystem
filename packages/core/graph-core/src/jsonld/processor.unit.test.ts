/**
 * Unit tests for the injected-driver JSON-LD processor boundary.
 */

import { describe, expect, it } from 'vitest';

import type { JsonLdContext, JsonLdDocument, JsonLdFrame } from './processor.js';
import { createJsonLdProcessorWithDriver } from './processor.js';

const implementation = {
  name: 'jsonld.js',
  version: '9',
  spec: 'JSON-LD 1.1',
} as const;

const inputDocument: JsonLdDocument = {
  '@id': 'https://example.org/input',
};

const context: JsonLdContext = {
  id: '@id',
};

const frame: JsonLdFrame = {
  '@type': 'Thing',
};

describe('JsonLdProcessor unit boundary', () => {
  it('keeps malformed processor output outside the graph-core boundary', async () => {
    const processor = createJsonLdProcessorWithDriver({
      implementation,
      async expand(): Promise<unknown> {
        return 'not expanded JSON-LD';
      },
      async compact(): Promise<unknown> {
        return [];
      },
      async frame(): Promise<unknown> {
        return 'not framed JSON-LD';
      },
    });

    await expect(processor.expand(inputDocument)).resolves.toStrictEqual({
      ok: false,
      error: {
        kind: 'invalid_processor_output',
        operation: 'expand',
        message: 'JSON-LD processor returned non-JSON output for expand.',
      },
    });
    await expect(processor.compact(inputDocument, context)).resolves.toStrictEqual({
      ok: false,
      error: {
        kind: 'invalid_processor_output',
        operation: 'compact',
        message: 'JSON-LD processor returned non-JSON output for compact.',
      },
    });
    await expect(processor.frame(inputDocument, frame)).resolves.toStrictEqual({
      ok: false,
      error: {
        kind: 'invalid_processor_output',
        operation: 'frame',
        message: 'JSON-LD processor returned non-JSON output for frame.',
      },
    });
  });

  it('reports processor failures without throwing through the adapter', async () => {
    const cause = new Error('invalid IRI');
    const processor = createJsonLdProcessorWithDriver({
      implementation,
      async expand(): Promise<unknown> {
        throw cause;
      },
      async compact(): Promise<unknown> {
        return {};
      },
      async frame(): Promise<unknown> {
        return {};
      },
    });

    await expect(processor.expand(inputDocument)).resolves.toStrictEqual({
      ok: false,
      error: {
        kind: 'processor_failed',
        operation: 'expand',
        message: 'invalid IRI',
        cause,
      },
    });
  });
});
