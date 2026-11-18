import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { metaRunDataFrom, reduceRunDataFrom, validateRunDataFrom } from './run-inputs.js';
import type { MapResult, ReduceResult, ValidateResult } from './stage-io.js';
import type { Cluster, FinderInstance } from '../schemas.js';

function instance(overrides: Partial<FinderInstance> & Pick<FinderInstance, 'id'>): FinderInstance {
  return {
    file: 'a.md',
    line: 1,
    quote: 'stub',
    factClass: 'status-assertion',
    subject: 'G1',
    subjectFromGazetteer: true,
    predicate: 'status',
    valueNorm: 'done',
    assertionKind: 'authored',
    confidence: 'high',
    ...overrides,
  };
}

const instanceF1 = instance({
  id: 'f1',
  file: 'a.md',
  line: 1,
  quote: 'discharged',
  valueNorm: 'discharged',
});
const instanceF2 = instance({ id: 'f2', file: 'b.md', line: 2, quote: 'done', valueNorm: 'done' });

const mapResult: MapResult = {
  ok: true,
  partition: [{ window: 'W01', fileCount: 1 }],
  coverage: [{ window: 'W01', instanceCount: 2 }],
  mapComplete: true,
  incompleteWindows: [],
  instanceCount: 2,
  instances: [instanceF1, instanceF2],
};

/** The same map result with f2 gone — the partial-grounding fixture. */
const shrunkMapResult: MapResult = {
  ok: true,
  partition: [{ window: 'W01', fileCount: 1 }],
  coverage: [{ window: 'W01', instanceCount: 1 }],
  mapComplete: true,
  incompleteWindows: [],
  instanceCount: 1,
  instances: [instanceF1],
};

const g1StatusCluster: Cluster = {
  id: 'exact:status-assertion:G1:status',
  clusterKind: 'exact-key',
  factClass: 'status-assertion',
  subject: 'G1',
  predicate: 'status',
  verdict: 'conflict',
  distinctValueNorms: ['discharged', 'done'],
  memberInstanceIds: ['f1', 'f2'],
};

const reduceResult: ReduceResult = {
  ok: true,
  instanceCount: 2,
  clusters: [g1StatusCluster],
  reduceComplete: true,
  incompleteChunks: [],
};

describe('reduceRunDataFrom', () => {
  it('extracts instances from a successful map result', () => {
    const result = reduceRunDataFrom(mapResult);
    expect(isOk(result)).toBe(true);
    expect(unwrap(result).instances).toHaveLength(2);
  });

  it('errs on an INCOMPLETE map result, naming the dead windows', () => {
    const partial: MapResult = { ...mapResult, mapComplete: false, incompleteWindows: ['W01'] };
    const result = reduceRunDataFrom(partial);
    expect(!result.ok && result.error.message).toContain('W01');
  });

  it('errs on a failed map result', () => {
    expect(isErr(reduceRunDataFrom({ ok: false, error: 'boom' }))).toBe(true);
  });
});

describe('validateRunDataFrom', () => {
  it('joins reduce clusters with map-result grounding instances', () => {
    const result = validateRunDataFrom({
      mapResult,
      reduceResult,
      priorValidateResults: [],
      validateTokenCeiling: 1000,
    });
    expect(isOk(result)).toBe(true);
    const data = unwrap(result);
    expect(data.clusters).toHaveLength(1);
    expect(data.groundingInstances.map((i) => i.id).sort((a, b) => a.localeCompare(b))).toEqual([
      'f1',
      'f2',
    ]);
    expect(data.validateTokenCeiling).toBe(1000);
  });

  const passAllVerdict = {
    sameFact: { pass: true, confidence: 'high' },
    authoredNotCited: { pass: true, confidence: 'high' },
    genuineConflict: { pass: true, confidence: 'med' },
    liveSurface: { pass: true, confidence: 'high' },
    importance: 'high',
  } as const;

  /** A prior attempt that resolved g1StatusCluster WITH its disposition/voter evidence. */
  const evidencedPriorResult: ValidateResult = {
    ok: true,
    // True BECAUSE incompleteClusterIds is empty — validateSuccessSchema refines the
    // flag against the list, so a fixture may never carry the contradiction.
    validateComplete: true,
    resolvedClusterIds: ['exact:status-assertion:G1:status'],
    incompleteClusterIds: [],
    missingClusterIds: [],
    dispositions: [
      { clusterId: 'exact:status-assertion:G1:status', disposition: 'flagged', reason: null },
    ],
    voterVerdicts: [
      { clusterId: 'exact:status-assertion:G1:status', voterId: 'v1', verdict: passAllVerdict },
      { clusterId: 'exact:status-assertion:G1:status', voterId: 'v2', verdict: passAllVerdict },
    ],
  };

  it('narrows to the unresolved tail on resume, using prior resolved ids', () => {
    const priorValidateResults: ValidateResult[] = [evidencedPriorResult];
    const result = validateRunDataFrom({
      mapResult,
      reduceResult,
      priorValidateResults,
      validateTokenCeiling: 1000,
    });
    expect(isErr(result)).toBe(true);
  });

  it('seeds EXACTLY the unresolved cluster on resume — the resolved one never re-votes', () => {
    const secondCluster: Cluster = {
      ...g1StatusCluster,
      id: 'exact:status-assertion:G1:ratification-status',
      predicate: 'ratification-status',
    };
    const twoClusterReduce: ReduceResult = {
      ok: true,
      instanceCount: 2,
      clusters: [g1StatusCluster, secondCluster],
      reduceComplete: true,
      incompleteChunks: [],
    };
    const priorValidateResults: ValidateResult[] = [evidencedPriorResult];
    const result = validateRunDataFrom({
      mapResult,
      reduceResult: twoClusterReduce,
      priorValidateResults,
      validateTokenCeiling: 1000,
    });
    expect(isOk(result)).toBe(true);
    expect(unwrap(result).clusters.map((cluster) => cluster.id)).toEqual([
      'exact:status-assertion:G1:ratification-status',
    ]);
  });

  it('carries ONLY the unresolved seed grounding on resume — a small tail never hauls the full corpus payload', () => {
    const instanceF3 = instance({ id: 'f3', file: 'c.md', line: 3, valueNorm: 'open' });
    const instanceF4 = instance({ id: 'f4', file: 'd.md', line: 4, valueNorm: 'closed' });
    const fourInstanceMap: MapResult = {
      ...mapResult,
      coverage: [{ window: 'W01', instanceCount: 4 }],
      instanceCount: 4,
      instances: [instanceF1, instanceF2, instanceF3, instanceF4],
    };
    const secondCluster: Cluster = {
      ...g1StatusCluster,
      id: 'exact:status-assertion:G1:gate-state',
      predicate: 'gate-state',
      distinctValueNorms: ['open', 'closed'],
      memberInstanceIds: ['f3', 'f4'],
    };
    const twoClusterReduce: ReduceResult = {
      ok: true,
      instanceCount: 4,
      clusters: [g1StatusCluster, secondCluster],
      reduceComplete: true,
      incompleteChunks: [],
    };
    const result = validateRunDataFrom({
      mapResult: fourInstanceMap,
      reduceResult: twoClusterReduce,
      priorValidateResults: [evidencedPriorResult],
      validateTokenCeiling: 1000,
    });
    expect(isOk(result)).toBe(true);
    const data = unwrap(result);
    expect(data.clusters.map((cluster) => cluster.id)).toEqual([
      'exact:status-assertion:G1:gate-state',
    ]);
    expect(data.groundingInstances.map((i) => i.id).sort((a, b) => a.localeCompare(b))).toEqual([
      'f3',
      'f4',
    ]);
  });

  it('de-duplicates grounding instances shared by two seed clusters — one instance, one grounding entry', () => {
    const sharedMemberCluster: Cluster = {
      ...g1StatusCluster,
      id: 'reducer:status-assertion:G1:status-phrase',
      clusterKind: 'reducer',
      predicate: 'status-phrase',
      verdict: 'latent',
      distinctValueNorms: ['done'],
      memberInstanceIds: ['f2', 'f1'],
    };
    const twoClusterReduce: ReduceResult = {
      ok: true,
      instanceCount: 2,
      clusters: [g1StatusCluster, sharedMemberCluster],
      reduceComplete: true,
      incompleteChunks: [],
    };
    const result = validateRunDataFrom({
      mapResult,
      reduceResult: twoClusterReduce,
      priorValidateResults: [],
      validateTokenCeiling: 1000,
    });
    expect(isOk(result)).toBe(true);
    const ids = unwrap(result).groundingInstances.map((i) => i.id);
    expect(ids.toSorted((a, b) => a.localeCompare(b))).toEqual(['f1', 'f2']);
  });

  it('refuses resolved cluster ids lacking disposition evidence in ANY prior checkpoint — an unevidenced id must never silently skip re-voting', () => {
    const unevidenced: ValidateResult = {
      ok: true,
      validateComplete: true,
      resolvedClusterIds: ['exact:status-assertion:G1:status'],
      incompleteClusterIds: [],
      missingClusterIds: [],
      dispositions: [],
      voterVerdicts: [],
    };
    const result = validateRunDataFrom({
      mapResult,
      reduceResult,
      priorValidateResults: [unevidenced],
      validateTokenCeiling: 1000,
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('exact:status-assertion:G1:status');
    expect(String(!result.ok && result.error)).toContain('evidence');
  });

  it('errs on an INCOMPLETE map or reduce result — dead windows/chunks must never seed voting', () => {
    const base = {
      priorValidateResults: [],
      validateTokenCeiling: 500_000,
    };
    const partialMap: MapResult = { ...mapResult, mapComplete: false, incompleteWindows: ['W01'] };
    expect(isErr(validateRunDataFrom({ ...base, mapResult: partialMap, reduceResult }))).toBe(true);
    const partialReduce: ReduceResult = {
      ...reduceResult,
      reduceComplete: false,
      incompleteChunks: [0],
    };
    expect(isErr(validateRunDataFrom({ ...base, mapResult, reduceResult: partialReduce }))).toBe(
      true,
    );
  });

  it('errs on a failed reduce result', () => {
    const result = validateRunDataFrom({
      mapResult,
      reduceResult: { ok: false, error: 'boom' },
      priorValidateResults: [],
      validateTokenCeiling: 1000,
    });
    expect(isErr(result)).toBe(true);
  });

  it('errs on a failed map result instead of silently building empty grounding', () => {
    const result = validateRunDataFrom({
      mapResult: { ok: false, error: 'map died' },
      reduceResult,
      priorValidateResults: [],
      validateTokenCeiling: 1000,
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('map result was not ok');
  });

  it('errs naming the exact member ids a cluster references but the map result lacks', () => {
    const result = validateRunDataFrom({
      mapResult: shrunkMapResult,
      reduceResult,
      priorValidateResults: [],
      validateTokenCeiling: 1000,
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('exact:status-assertion:G1:status:f2');
  });
});

describe('metaRunDataFrom', () => {
  const flaggedValidateResult: ValidateResult = {
    ok: true,
    validateComplete: true,
    resolvedClusterIds: ['exact:status-assertion:G1:status'],
    incompleteClusterIds: [],
    missingClusterIds: [],
    dispositions: [
      { clusterId: 'exact:status-assertion:G1:status', disposition: 'flagged', reason: null },
    ],
    voterVerdicts: [],
  };

  it('projects flagged clusters with instance grounding, and no held clusters when none were held', () => {
    const result = metaRunDataFrom({
      mapResult,
      reduceResult,
      validateResults: [flaggedValidateResult],
    });
    expect(isOk(result)).toBe(true);
    const data = unwrap(result);
    expect(data.clusters).toHaveLength(1);
    expect(data.clusters[0]?.instances).toHaveLength(2);
    expect(data.heldClusters).toHaveLength(0);
  });

  it('projects a held-for-review cluster into heldClusters with grounding — held enters the ledger, never vanishes', () => {
    const held: ValidateResult = {
      ...flaggedValidateResult,
      dispositions: [
        {
          clusterId: 'exact:status-assertion:G1:status',
          disposition: 'held-for-review',
          reason: null,
        },
      ],
    };
    const result = metaRunDataFrom({ mapResult, reduceResult, validateResults: [held] });
    expect(isOk(result)).toBe(true);
    const data = unwrap(result);
    expect(data.clusters).toHaveLength(0);
    expect(data.heldClusters).toHaveLength(1);
    expect(data.heldClusters[0]?.instances).toHaveLength(2);
  });

  it('returns EMPTY cluster sets when every cluster is dismissed — a clean audit is a valid terminal state, never an error', () => {
    const dismissed: ValidateResult = {
      ...flaggedValidateResult,
      dispositions: [
        { clusterId: 'exact:status-assertion:G1:status', disposition: 'dismissed', reason: null },
      ],
    };
    const result = metaRunDataFrom({ mapResult, reduceResult, validateResults: [dismissed] });
    expect(isOk(result)).toBe(true);
    expect(unwrap(result).clusters).toHaveLength(0);
    expect(unwrap(result).heldClusters).toHaveLength(0);
  });

  it('accepts ZERO validate results when reduce produced zero clusters — the nothing-clustered corpus skips validate and flows to the empty ledger', () => {
    const emptyReduce: ReduceResult = { ...reduceResult, clusters: [], instanceCount: 0 };
    const result = metaRunDataFrom({ mapResult, reduceResult: emptyReduce, validateResults: [] });
    expect(isOk(result)).toBe(true);
    expect(unwrap(result).clusters).toHaveLength(0);
    expect(unwrap(result).heldClusters).toHaveLength(0);
  });

  it('errs when clusters exist but NO validate result was supplied at all', () => {
    const result = metaRunDataFrom({ mapResult, reduceResult, validateResults: [] });
    expect(!result.ok && result.error.message).toContain('exact:status-assertion:G1:status');
  });

  it('errs naming every cluster no validate attempt ever dispositioned — an undispositioned cluster must never silently vanish from the ledger', () => {
    const empty: ValidateResult = { ...flaggedValidateResult, dispositions: [] };
    const result = metaRunDataFrom({ mapResult, reduceResult, validateResults: [empty] });
    expect(!result.ok && result.error.message).toContain('exact:status-assertion:G1:status');
  });

  it('errs on an INCOMPLETE map or reduce result — partial coverage must never seed meta', () => {
    const partialMap: MapResult = { ...mapResult, mapComplete: false, incompleteWindows: ['W01'] };
    expect(
      isErr(
        metaRunDataFrom({
          mapResult: partialMap,
          reduceResult,
          validateResults: [flaggedValidateResult],
        }),
      ),
    ).toBe(true);
    const partialReduce: ReduceResult = {
      ...reduceResult,
      reduceComplete: false,
      incompleteChunks: [1],
    };
    expect(
      isErr(
        metaRunDataFrom({
          mapResult,
          reduceResult: partialReduce,
          validateResults: [flaggedValidateResult],
        }),
      ),
    ).toBe(true);
  });

  it('keeps the LAST recorded disposition across multiple validate attempts for one cluster', () => {
    const first: ValidateResult = {
      ...flaggedValidateResult,
      dispositions: [
        {
          clusterId: 'exact:status-assertion:G1:status',
          disposition: 'held-for-review',
          reason: null,
        },
      ],
    };
    const second = flaggedValidateResult;
    const result = metaRunDataFrom({ mapResult, reduceResult, validateResults: [first, second] });
    expect(isOk(result)).toBe(true);
    expect(unwrap(result).clusters).toHaveLength(1);
    expect(unwrap(result).heldClusters).toHaveLength(0);
  });

  it('errs naming unresolvable member ids of HELD clusters — held grounding is as load-bearing as flagged', () => {
    const held: ValidateResult = {
      ...flaggedValidateResult,
      dispositions: [
        {
          clusterId: 'exact:status-assertion:G1:status',
          disposition: 'held-for-review',
          reason: null,
        },
      ],
    };
    const result = metaRunDataFrom({
      mapResult: shrunkMapResult,
      reduceResult,
      validateResults: [held],
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('exact:status-assertion:G1:status:f2');
  });

  it('errs on a failed reduce result', () => {
    const result = metaRunDataFrom({
      mapResult,
      reduceResult: { ok: false, error: 'boom' },
      validateResults: [flaggedValidateResult],
    });
    expect(isErr(result)).toBe(true);
  });

  it('errs on a failed map result instead of building rows on empty grounding', () => {
    const result = metaRunDataFrom({
      mapResult: { ok: false, error: 'map died' },
      reduceResult,
      validateResults: [flaggedValidateResult],
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('map result was not ok');
  });

  it('errs naming unresolvable member ids of flagged clusters', () => {
    const result = metaRunDataFrom({
      mapResult: shrunkMapResult,
      reduceResult,
      validateResults: [flaggedValidateResult],
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('exact:status-assertion:G1:status:f2');
  });
});
