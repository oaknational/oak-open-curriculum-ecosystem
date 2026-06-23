/**
 * Integration test (G1a + G2 + G4b): the emitted graph corpus loads from
 * `@oaknational/sdk-codegen/graph-corpus` and constructs a `GraphView` over the
 * full corpus without throwing.
 *
 * @remarks
 * This is the "integration (emitted corpus loads)" proof at corpus scale: the
 * generator unit tests specify the emitted shape against fixtures; this test
 * exercises the REAL emitted dataset (unit/thread/lesson/misconception/keyword
 * nodes; prerequisiteFor + thread→unit→lesson→misconception chain +
 * lesson→keyword `containsKeyword` edges) through the loader and the
 * `createGraphView` construction contract, proving the integrity resolution
 * holds at scale (zero dangling endpoints, no duplicate ids).
 */
import { describe, expect, it } from 'vitest';

import { graphCorpus } from './graph-corpus.js';
import { createCurriculumPriorKnowledgeView } from './prior-knowledge-view.js';

const EDGE_TYPES = [
  'prerequisiteFor',
  'containsUnit',
  'containsLesson',
  'addressesMisconception',
  'containsKeyword',
] as const;

const EDGE_TYPE_SET: ReadonlySet<string> = new Set(EDGE_TYPES);

describe('curriculum graph corpus (integration over the emitted dataset)', () => {
  it('loads the emitted one-graph corpus with every node kind and edge type present', () => {
    expect(graphCorpus.nodes.length).toBeGreaterThan(1000);
    expect(graphCorpus.edges.length).toBeGreaterThan(1000);
    for (const kind of ['unit', 'thread', 'lesson', 'misconception', 'keyword'] as const) {
      expect(graphCorpus.nodes.some((node) => node.kind === kind)).toBe(true);
    }
    for (const type of EDGE_TYPES) {
      expect(graphCorpus.edges.some((edge) => edge.type === type)).toBe(true);
    }
    expect(graphCorpus.edges.every((edge) => EDGE_TYPE_SET.has(edge.type))).toBe(true);
  });

  it('carries a materialised kind-qualified id on every node', () => {
    expect(graphCorpus.nodes.every((node) => node.id.startsWith(`${node.kind}:`))).toBe(true);
  });

  it('has zero dropped edges and zero dropped duplicates (integrity resolution complete)', () => {
    expect(graphCorpus.droppedEdges).toHaveLength(0);
    expect(graphCorpus.droppedDuplicates).toHaveLength(0);
  });

  it('resolves every edge endpoint to a node id (zero dangling at corpus scale)', () => {
    const ids = new Set(graphCorpus.nodes.map((node) => node.id));
    const dangling = graphCorpus.edges.filter(
      (edge) => !ids.has(edge.source) || !ids.has(edge.target),
    );
    expect(dangling).toHaveLength(0);
  });

  it('constructs the prior-knowledge view over the corpus without throwing', () => {
    expect(() => createCurriculumPriorKnowledgeView(3)).not.toThrow();
  });
});
