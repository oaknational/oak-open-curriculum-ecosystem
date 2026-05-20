import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { blankNode, literal, namedNode, quad } from '../data-factory/index.js';
import { createDataset, type DatasetCore } from '../dataset/index.js';
import type { Literal, Quad } from '../term/index.js';

import {
  canonicalize,
  type CanonicalizationError,
  type CanonicalizationResult,
  type CanonicalizedDataset,
} from './canonicalize.js';
import type { CanonizeRuntime } from './runtime.js';

const knows = namedNode('http://xmlns.com/foaf/0.1/knows');
const name = namedNode('http://xmlns.com/foaf/0.1/name');

function blankNodeDataset(orderedBlankLabels: readonly [string, string]): DatasetCore {
  const [a, b] = orderedBlankLabels;
  return createDataset([
    quad(blankNode(a), knows, blankNode(b)),
    quad(blankNode(b), name, literal('Bob')),
    quad(blankNode(a), name, literal('Alice')),
  ]);
}

function expectOk(result: CanonicalizationResult): CanonicalizedDataset {
  if (!result.ok) {
    throw new Error(
      `expected ok result, got error kind=${result.error.kind}: ${result.error.message}`,
    );
  }
  return result.value;
}

function expectErr(result: CanonicalizationResult): CanonicalizationError {
  if (result.ok) {
    throw new Error('expected error result, got ok');
  }
  return result.error;
}

function onlyLiteralObject(dataset: DatasetCore): Literal {
  const quads: Quad[] = Array.from(dataset);
  if (quads.length !== 1) {
    throw new Error(`expected exactly one quad, got ${quads.length}`);
  }
  const [onlyQuad] = quads;
  if (onlyQuad === undefined || onlyQuad.object.termType !== 'Literal') {
    throw new Error(`expected single Literal-object quad, got ${onlyQuad?.object.termType}`);
  }
  return onlyQuad.object;
}

describe('canonicalize (RDFC-1.0)', () => {
  it('produces an identical SHA-256 hash for the same logical content ingested in two different blank-node label orders', async () => {
    const datasetA = blankNodeDataset(['b1', 'b2']);
    const datasetB = blankNodeDataset(['zzz', 'aaa']);

    const [a, b] = await Promise.all([canonicalize(datasetA), canonicalize(datasetB)]);
    const okA = expectOk(a);
    const okB = expectOk(b);

    expect(okA.hash).toBe(okB.hash);
    expect(okA.canonicalNQuads).toBe(okB.canonicalNQuads);
  });

  it('is idempotent: re-canonicalising the reconstructed dataset returns the same canonical N-Quads and hash', async () => {
    const dataset = blankNodeDataset(['x', 'y']);
    const first = expectOk(await canonicalize(dataset));
    const second = expectOk(await canonicalize(first.dataset));

    expect(second.canonicalNQuads).toBe(first.canonicalNQuads);
    expect(second.hash).toBe(first.hash);
  });

  it('returns a DatasetCore whose Literal terms carry the canonical RDF/JS shape (direction: "")', async () => {
    const dataset = createDataset([quad(namedNode('http://example/s'), name, literal('Alice'))]);
    const { dataset: canonicalDataset } = expectOk(await canonicalize(dataset));

    const onlyObject = onlyLiteralObject(canonicalDataset);

    // direction is the RDF 1.2 Term field whose default empty-string presence
    // is the load-bearing proof that data-factory reshaping ran.
    expect(onlyObject.direction).toBe('');
    expect(onlyObject.language).toBe('');
  });

  it('returns a helpful error result when the underlying canonize call rejects the input', async () => {
    const failingRuntime: CanonizeRuntime = {
      canonize: async () => {
        throw new Error('synthetic canonize failure');
      },
      parseNQuads: () => {
        throw new Error('should not be reached');
      },
    };

    const error = expectErr(
      await canonicalize(blankNodeDataset(['x', 'y']), { runtime: failingRuntime }),
    );

    expect(error.kind).toBe('canonize_failed');
    expect(error.step).toBe('canonize');
    expect(error.message).toContain('rdf-canonize canonize call');
    expect(error.cause?.message).toBe('synthetic canonize failure');
  });

  it('returns reparse_failed when the canonical N-Quads cannot be reparsed', async () => {
    const reparseFailingRuntime: CanonizeRuntime = {
      canonize: async () => '_:b0 <http://example/p> _:b1 .\n',
      parseNQuads: () => {
        throw new Error('synthetic reparse failure');
      },
    };

    const error = expectErr(
      await canonicalize(blankNodeDataset(['x', 'y']), { runtime: reparseFailingRuntime }),
    );

    expect(error.kind).toBe('reparse_failed');
    expect(error.step).toBe('parse_nquads');
    expect(error.cause?.message).toBe('synthetic reparse failure');
  });

  it('returns reconstruction_failed when reparsed terms have an unsupported shape', async () => {
    const reconstructFailingRuntime: CanonizeRuntime = {
      canonize: async () => '',
      // Emit a quad whose subject is a Literal — illegal in RDF; reconstruction throws.
      parseNQuads: () => [
        {
          subject: {
            termType: 'Literal',
            value: 'oops',
            datatype: { termType: 'NamedNode', value: 'urn:x' },
          },
          predicate: { termType: 'NamedNode', value: 'urn:p' },
          object: { termType: 'NamedNode', value: 'urn:o' },
          graph: { termType: 'DefaultGraph', value: '' },
        },
      ],
    };

    const error = expectErr(
      await canonicalize(blankNodeDataset(['x', 'y']), { runtime: reconstructFailingRuntime }),
    );

    expect(error.kind).toBe('reconstruction_failed');
    expect(error.step).toBe('reconstruct_dataset');
    expect(error.cause?.message).toContain('Unexpected subject termType');
  });

  it('produces a hash that is the SHA-256 of the canonical N-Quads string', async () => {
    const dataset = blankNodeDataset(['x', 'y']);
    const { canonicalNQuads, hash } = expectOk(await canonicalize(dataset));

    const expected = createHash('sha256').update(canonicalNQuads, 'utf8').digest('hex');
    expect(hash).toBe(expected);
  });
});
