/**
 * Unit tests for the graph-native EEF view, over the REAL corpus only
 * (a synthetic `EefStrand` is a category error — EEF facts come from the
 * committed `as const` snapshot). They prove the corpus constructs into the
 * view, the bounded subgraph returns the pinned member + edge sets, and the
 * `EefStrandId` / `'related_strand'` types flow to the boundary without
 * widening (the four named id-flow proofs).
 */

import type { SubgraphError } from '@oaknational/graph-core/graph-view';
import { describe, expect, expectTypeOf, it } from 'vitest';

import { eefStrandGraph } from './eef-graph.js';
import type { EefStrandId } from './strand-lookup.js';

const byLocale = (a: string, b: string): number => a.localeCompare(b);

describe('eefStrandGraph — graph-native EEF view over the real corpus', () => {
  it('constructs over the whole corpus and is queryable (no throw at load)', () => {
    // Reaching this test means module-load construction did not throw on the
    // real corpus (no duplicate ids, no dangling related-strand edges).
    const result = eefStrandGraph.subgraph({ rootIds: ['eef-tl-feedback'], depth: 0 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.nodes.map((strand) => strand.id)).toEqual(['eef-tl-feedback']);
  });

  it('returns the feedback depth-1 neighbourhood with all member-induced edges', () => {
    const result = eefStrandGraph.subgraph({ rootIds: ['eef-tl-feedback'], depth: 1 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const memberIds = result.value.nodes.map((strand) => strand.id).sort(byLocale);
    expect(memberIds).toEqual([
      'eef-tl-feedback',
      'eef-tl-mastery-learning',
      'eef-tl-metacognition-and-self-regulation',
    ]);

    // The member-induced edge set: every edge with BOTH endpoints in the member
    // set. Four edges — feedback's two outgoing edges and the two reverse edges
    // (mastery-learning->feedback, metacognition->feedback). There is no direct
    // mastery<->metacognition edge, and feedback's reach to other strands is
    // outside the depth-1 frontier.
    const edgeKeys = result.value.edges
      .map((edge) => `${edge.source}|${edge.target}`)
      .sort(byLocale);
    expect(edgeKeys).toEqual([
      'eef-tl-feedback|eef-tl-mastery-learning',
      'eef-tl-feedback|eef-tl-metacognition-and-self-regulation',
      'eef-tl-mastery-learning|eef-tl-feedback',
      'eef-tl-metacognition-and-self-regulation|eef-tl-feedback',
    ]);
  });

  it('preserves the full strand payload on member nodes (inline related_guidance_reports per decision B)', () => {
    const result = eefStrandGraph.subgraph({ rootIds: ['eef-tl-feedback'], depth: 0 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const [feedback] = result.value.nodes;
    expect(feedback?.id).toBe('eef-tl-feedback');
    // The node is the full V1 strand payload, not a re-narrowed record.
    expect(feedback?.headline).toBeDefined();
    expect(feedback?.definition).toBeDefined();
  });

  it('flows EefStrandId / related_strand types to the boundary without widening', () => {
    const result = eefStrandGraph.subgraph({ rootIds: ['eef-tl-feedback'], depth: 1 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    // The four named non-widening id-flow proofs. `toEqualTypeOf` (not the
    // vacuous `toExtend`) is load-bearing: each assertion FAILS if the result
    // widened to `SubgraphResult<EefStrand, string, string>`.
    expectTypeOf(result.value.edges[0].type).toEqualTypeOf<'related_strand'>();
    expectTypeOf(result.value.edges[0].source).toEqualTypeOf<EefStrandId>();
    expectTypeOf(result.value.edges[0].target).toEqualTypeOf<EefStrandId>();

    type RootNotFound = Extract<SubgraphError<EefStrandId>, { kind: 'SubgraphRootNotFound' }>;
    expectTypeOf<RootNotFound['rootId']>().toEqualTypeOf<EefStrandId>();
  });
});
