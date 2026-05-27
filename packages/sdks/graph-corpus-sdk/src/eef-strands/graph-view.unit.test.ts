import { describe, expect, it } from 'vitest';
import type { GraphView } from '@oaknational/graph-core/graph-view';

import {
  EefStrandsGraphView,
  type EefStrandEdgeType,
  type EefStrandsGraphViewInput,
  type EefStrandsManifestMeta,
} from './graph-view.js';
import type { EefStrand } from './types.js';

const META: EefStrandsManifestMeta = {
  version: '0.2.0',
  lastUpdated: '2026-01-15',
  schemaHash: 'sha256:test-fixture',
};

/**
 * Fixture graph (insertion order s1..s5):
 *   s1 → s2, s3      s2 → s3      s3 → (none)
 *   s4 → s1          s5 → (none)
 * 4 edges; s3 and s5 are sparse (omit `related_strands`).
 */
const STRANDS: readonly EefStrand[] = [
  { id: 's1', name: 'Strand One', slug: 'strand-one', related_strands: ['s2', 's3'] },
  { id: 's2', name: 'Strand Two', slug: 'strand-two', related_strands: ['s3'] },
  { id: 's3', name: 'Strand Three', slug: 'strand-three' },
  { id: 's4', name: 'Strand Four', slug: 'strand-four', related_strands: ['s1'] },
  { id: 's5', name: 'Strand Five', slug: 'strand-five' },
];

function build(
  input: EefStrandsGraphViewInput = { strands: STRANDS, meta: META },
): GraphView<EefStrand, EefStrandEdgeType> {
  const result = EefStrandsGraphView.create(input);
  if (!result.ok) {
    throw new Error(`fixture failed to construct: ${JSON.stringify(result.error)}`);
  }
  return result.value;
}

describe('EefStrandsGraphView.create', () => {
  it('constructs an adapter when the strand data is referentially intact', () => {
    const result = EefStrandsGraphView.create({ strands: STRANDS, meta: META });
    expect(result.ok).toBe(true);
  });

  it('rejects a corpus with a duplicate strand id', () => {
    const result = EefStrandsGraphView.create({
      strands: [
        { id: 's1', name: 'One', slug: 'one' },
        { id: 's1', name: 'One Again', slug: 'one-again' },
      ],
      meta: META,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'DuplicateStrandId', strandId: 's1' });
    }
  });

  it('rejects a related_strand edge that targets a non-existent node', () => {
    const result = EefStrandsGraphView.create({
      strands: [{ id: 's1', name: 'One', slug: 'one', related_strands: ['ghost'] }],
      meta: META,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({
        kind: 'DanglingRelatedStrand',
        source: 's1',
        target: 'ghost',
      });
    }
  });
});

describe('EefStrandsGraphView.manifest', () => {
  it('reports node/edge counts, the edge-type vocabulary, and injected metadata', () => {
    const manifest = build().manifest();
    expect(manifest.nodeCount).toBe(5);
    expect(manifest.edgeCount).toBe(4);
    expect(manifest.edgeTypes).toEqual(['related_strand']);
    expect(manifest.version).toBe('0.2.0');
    expect(manifest.lastUpdated).toBe('2026-01-15');
    expect(manifest.schemaHash).toBe('sha256:test-fixture');
  });

  it('surfaces strands with no outgoing edges in sparseRelationsByNodeId', () => {
    expect(build().manifest().sparseRelationsByNodeId).toEqual(['s3', 's5']);
  });

  it('reports an empty edge-type vocabulary when no edges exist', () => {
    const manifest = build({
      strands: [{ id: 'only', name: 'Only', slug: 'only' }],
      meta: META,
    }).manifest();
    expect(manifest.edgeCount).toBe(0);
    expect(manifest.edgeTypes).toEqual([]);
  });
});

describe('EefStrandsGraphView.subgraph', () => {
  it('returns only the roots and no edges at depth 0', () => {
    const result = build().subgraph({ rootIds: ['s1'], depth: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nodes.map((n) => n.id)).toEqual(['s1']);
      expect(result.value.edges).toEqual([]);
    }
  });

  it('returns direct neighbours and their edges at depth 1', () => {
    const result = build().subgraph({ rootIds: ['s1'], depth: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nodes.map((n) => n.id)).toEqual(['s1', 's2', 's3']);
      expect(result.value.edges).toEqual([
        { source: 's1', type: 'related_strand', target: 's2' },
        { source: 's1', type: 'related_strand', target: 's3' },
      ]);
    }
  });

  it('traverses transitively and terminates on a cycle within the depth bound', () => {
    const result = build().subgraph({ rootIds: ['s4'], depth: 3 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nodes.map((n) => n.id)).toEqual(['s4', 's1', 's2', 's3']);
      expect(result.value.edges).toEqual([
        { source: 's4', type: 'related_strand', target: 's1' },
        { source: 's1', type: 'related_strand', target: 's2' },
        { source: 's1', type: 'related_strand', target: 's3' },
        { source: 's2', type: 'related_strand', target: 's3' },
      ]);
    }
  });

  it('returns a lone sparse root with no edges regardless of depth', () => {
    const result = build().subgraph({ rootIds: ['s3'], depth: 5 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nodes.map((n) => n.id)).toEqual(['s3']);
      expect(result.value.edges).toEqual([]);
    }
  });

  it('fails with SubgraphRootNotFound for an unknown root id', () => {
    const result = build().subgraph({ rootIds: ['s1', 'ghost'], depth: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'SubgraphRootNotFound', rootId: 'ghost' });
    }
  });

  it('fails with SubgraphDepthExceeded for a negative depth', () => {
    const result = build().subgraph({ rootIds: ['s1'], depth: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'SubgraphDepthExceeded', depth: -1, limit: 10 });
    }
  });

  it('fails with SubgraphDepthExceeded above the depth limit', () => {
    const result = build().subgraph({ rootIds: ['s1'], depth: 11 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'SubgraphDepthExceeded', depth: 11, limit: 10 });
    }
  });
});

describe('EefStrandsGraphView Inc.3 stub operations', () => {
  it('returns NotImplementedYet from summary', () => {
    const result = build().summary();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'NotImplementedYet', operation: 'summary' });
    }
  });

  it('returns NotImplementedYet from getNode', () => {
    const result = build().getNode({ nodeId: 's1' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'NotImplementedYet', operation: 'getNode' });
    }
  });

  it('returns NotImplementedYet from enumerateNodes', () => {
    const result = build().enumerateNodes({ pageIndex: 0, pageSize: 10 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'NotImplementedYet', operation: 'enumerateNodes' });
    }
  });

  it('returns NotImplementedYet from neighbours', () => {
    const result = build().neighbours({ nodeId: 's1' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'NotImplementedYet', operation: 'neighbours' });
    }
  });

  it('returns NotImplementedYet from findByTag', () => {
    const result = build().findByTag('literacy');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ kind: 'NotImplementedYet', operation: 'findByTag' });
    }
  });
});
