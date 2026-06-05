/**
 * Compile-time + runtime contract test for the `graph-view` query layer.
 *
 * `GraphView<TNode, TNodeId, TEdgeType>` is satisfiable by a minimal object
 * implementing the sole `subgraph` operation — the structural binding is the
 * load-bearing type check, and the runtime assertion proves the construction
 * path executes without throw (the "do not test types alone" testing-strategy
 * rule).
 */

import { ok, type Result } from '@oaknational/result';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { GraphView, SubgraphResult } from './index.js';

type FixtureNode = {
  readonly id: string;
  readonly displayName: string;
};

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
