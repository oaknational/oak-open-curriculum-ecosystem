/**
 * Compile-time + runtime contract test for the `graph-view` query layer.
 *
 * Covers three invariants of the public contract:
 *
 * 1. `DeepKeyPath<T, D>` array-stop discipline — the recursion MUST stop at
 *    array boundaries: element-index paths like `'tags.0'` or `'tags[number]'`
 *    MUST NOT appear in the resulting path union, at any depth. The negative
 *    `@ts-expect-error` assertions break loudly at compile time if the
 *    implementation regresses to recursing into array element types.
 * 2. `NodeProjection<TNode>` accepts a list whose every element is a valid
 *    `DeepKeyPath`.
 * 3. `GraphView<TNode, TNodeId, TEdgeType>` is satisfiable by a minimal object
 *    implementing the sole `subgraph` operation — the structural binding is
 *    the load-bearing type check, and the runtime assertion proves the
 *    construction path executes without throw (the "do not test types alone"
 *    testing-strategy rule).
 *
 * The inline `FixtureNode` exercises `DeepKeyPath` at depths 1–3 plus
 * root-level (`tags`) and nested-level (`headline.mechanisms`) array-stop.
 */

import { ok, type Result } from '@oaknational/result';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { DeepKeyPath, GraphView, NodeProjection, SubgraphResult } from './index.js';

type FixtureNode = {
  readonly id: string;
  readonly displayName: string;
  readonly headline: {
    readonly impact_months: number;
    readonly cost_rating: string;
    readonly deep: {
      readonly nested: string;
    };
    readonly mechanisms: readonly string[];
  };
  readonly tags: readonly string[];
};

type ValidPaths = DeepKeyPath<FixtureNode, 4>;

describe('DeepKeyPath array-stop discipline', () => {
  it('admits depth-1 scalar paths', () => {
    expectTypeOf<'id'>().toExtend<ValidPaths>();
    expectTypeOf<'displayName'>().toExtend<ValidPaths>();
  });

  it('admits depth-2 nested-object scalar paths', () => {
    expectTypeOf<'headline.impact_months'>().toExtend<ValidPaths>();
    expectTypeOf<'headline.cost_rating'>().toExtend<ValidPaths>();
  });

  it('admits depth-3 nested-object scalar paths', () => {
    expectTypeOf<'headline.deep.nested'>().toExtend<ValidPaths>();
  });

  it('admits array fields as leaves (the field name itself, no recursion)', () => {
    expectTypeOf<'tags'>().toExtend<ValidPaths>();
    expectTypeOf<'headline.mechanisms'>().toExtend<ValidPaths>();
  });

  it('rejects element-index paths at the root level (array-stop at depth 1)', () => {
    // @ts-expect-error: array-stop constraint — element-index path 'tags.0' must not be a DeepKeyPath union member, never recurse into array element types
    const _rootIndex: ValidPaths = 'tags.0';
    // @ts-expect-error: array-stop constraint — 'tags[number]' must not be a DeepKeyPath union member, no element-index notation permitted
    const _rootBracket: ValidPaths = 'tags[number]';
    expect(typeof _rootIndex).toBe('string');
    expect(typeof _rootBracket).toBe('string');
  });

  it('rejects element-index paths at nested levels (array-stop at depth 2)', () => {
    // @ts-expect-error: array-stop constraint — nested-array element-index path 'headline.mechanisms.0' must not be in the DeepKeyPath union; recursion must terminate at the array boundary regardless of depth
    const _nestedIndex: ValidPaths = 'headline.mechanisms.0';
    // @ts-expect-error: array-stop constraint — 'headline.mechanisms[number]' must not be in the DeepKeyPath union; element-index notation rejected at every level
    const _nestedBracket: ValidPaths = 'headline.mechanisms[number]';
    expect(typeof _nestedIndex).toBe('string');
    expect(typeof _nestedBracket).toBe('string');
  });

  it('rejects unknown top-level keys', () => {
    // @ts-expect-error: 'nonexistent' is not a field on FixtureNode, so it must not appear in the DeepKeyPath union
    const _unknown: ValidPaths = 'nonexistent';
    expect(typeof _unknown).toBe('string');
  });
});

describe('NodeProjection accepts valid path lists', () => {
  it('admits a projection whose every element is a valid DeepKeyPath', () => {
    const projection: NodeProjection<FixtureNode> = [
      'id',
      'headline.impact_months',
      'headline.deep.nested',
      'tags',
    ];
    expectTypeOf(projection).toExtend<NodeProjection<FixtureNode>>();
    expect(projection[0]).toBe('id');
  });
});

describe('GraphView interface implementation contract', () => {
  it('admits a minimal object that satisfies the subgraph-only contract', () => {
    const view: GraphView<FixtureNode, string, string> = {
      subgraph: (): Result<SubgraphResult<FixtureNode, string, string>, never> =>
        ok({ nodes: [], edges: [] }),
    };

    // The structural assignment above is the load-bearing contract check —
    // TypeScript rejects the binding at declaration if the method signature
    // is wrong. The runtime expectations below prove the construction AND
    // invocation paths execute without throw and yield a Result, satisfying
    // the "do not test types alone" testing-strategy rule.
    expectTypeOf(view).toExtend<GraphView<FixtureNode, string, string>>();
    expect(typeof view.subgraph).toBe('function');
    const result = view.subgraph({ rootIds: [], depth: 1 });
    expect(result.ok).toBe(true);
  });
});
