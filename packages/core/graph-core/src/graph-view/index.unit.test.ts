/**
 * T7a inline-fixture compile-time smoke-test for `DeepKeyPath` array-stop
 * discipline (WS4.4 interface-contract half per the 2026-05-22 test-partition
 * amendment in `graph-stack.plan.md`).
 *
 * The constraint under test is **structural**: `DeepKeyPath<T, D>` must
 * stop at array boundaries — element-index paths like `'tags.0'` or
 * `'tags[number]'` MUST NOT appear in the resulting union, at any depth.
 * If the implementation regresses to recursing into array element types,
 * the negative `@ts-expect-error` assertions stop firing and the test
 * breaks loudly at compile time.
 *
 * The inline `FixtureNode` exercises:
 * - Depth-2 nested-object path (positive).
 * - Depth-3 nested-object path (positive).
 * - Root-level array field (`tags`) — array-stop at depth 1 (negative).
 * - Nested-level array field (`headline.mechanisms`) — array-stop at
 *   depth 2 (negative). Without this, the test would only prove the
 *   root-level array-stop and would not exercise the inner-branch
 *   short-circuit in the recursion.
 *
 * The instantiation-contract half (T7a-b in graph-corpus-sdk WS4.5)
 * exercises the same constraint against the real `EefStrand` TNode.
 * Each home tests its own invariants per the addendum's
 * §Architectural amendment.
 */

import { ok, type Result } from '@oaknational/result';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type {
  DeepKeyPath,
  GraphManifest,
  GraphView,
  NodeProjection,
  SubgraphResult,
} from './index.js';

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

describe('DeepKeyPath array-stop discipline (T7a interface-contract half)', () => {
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
  it('admits a minimal object that satisfies the manifest + subgraph contract', () => {
    const stubManifest: GraphManifest = {
      nodeCount: 0,
      edgeTypes: [],
      edgeCount: 0,
      version: 'fixture-0',
      lastUpdated: '2026-05-22',
      schemaHash: 'fixture-hash',
      sparseRelationsByNodeId: [],
    };

    const view: GraphView<FixtureNode> = {
      manifest: () => stubManifest,
      subgraph: (): Result<SubgraphResult<FixtureNode>, never> => ok({ nodes: [], edges: [] }),
    };

    // The structural assignment above is the load-bearing contract check —
    // TypeScript rejects the binding at declaration if any method signature
    // is wrong. The runtime expectation below proves the construction path
    // executes without throw, satisfying the "do not test types alone"
    // testing-strategy rule.
    expectTypeOf(view).toExtend<GraphView<FixtureNode>>();
    expect(typeof view.manifest).toBe('function');
  });
});
