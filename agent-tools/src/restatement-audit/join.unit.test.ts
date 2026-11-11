import { describe, expect, it } from 'vitest';

import {
  chunkForReducer,
  factKeyOf,
  freeTextInstances,
  joinInstances,
  recountReducerCluster,
} from './join.js';
import type { FinderInstance } from './schemas.js';

function instance(overrides: Partial<FinderInstance> & Pick<FinderInstance, 'id'>): FinderInstance {
  return {
    file: 'a.md',
    line: 1,
    quote: 'stub',
    factClass: 'status-assertion',
    subject: 's0-window-sample',
    subjectFromGazetteer: true,
    predicate: 'status',
    valueNorm: 'completed',
    assertionKind: 'authored',
    confidence: 'high',
    ...overrides,
  };
}

describe('factKeyOf', () => {
  it('composes factClass, subject, and predicate deterministically', () => {
    const key = factKeyOf({ factClass: 'count', subject: 's0-window-sample', predicate: 'count' });
    expect(key).toBe('count:s0-window-sample:count');
  });

  it('is order-independent input, deterministic output for the same fields', () => {
    const a = factKeyOf({ factClass: 'count', subject: 'x', predicate: 'y' });
    const b = factKeyOf({ predicate: 'y', factClass: 'count', subject: 'x' });
    expect(a).toBe(b);
  });
});

describe('joinInstances', () => {
  it('emits nothing for empty input', () => {
    expect(joinInstances([])).toEqual([]);
  });

  it('emits nothing for a single unrepeated fact', () => {
    expect(joinInstances([instance({ id: 'f1' })])).toEqual([]);
  });

  it('clusters instances of mixed assertionKind sharing one fact-key (voters, not the join, weigh kinds)', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', assertionKind: 'authored' }),
      instance({ id: 'f2', file: 'b.md', assertionKind: 'citation' }),
    ];
    const clusters = joinInstances(instances);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]?.verdict).toBe('latent');
    expect(clusters[0]?.memberInstanceIds).toEqual(['f1', 'f2']);
  });

  it('drops instances whose value normalises to the empty string instead of building an invalid cluster', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', valueNorm: '.' }),
      instance({ id: 'f2', file: 'b.md', valueNorm: ',' }),
      instance({ id: 'f3', file: 'a.md', valueNorm: 'completed' }),
      instance({ id: 'f4', file: 'b.md', valueNorm: 'completed' }),
    ];
    const clusters = joinInstances(instances);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]?.memberInstanceIds).toEqual(['f3', 'f4']);
    expect(clusters[0]?.distinctValueNorms).toEqual(['completed']);
  });

  it('emits nothing when the same value repeats within one file only', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', line: 1 }),
      instance({ id: 'f2', file: 'a.md', line: 5 }),
    ];
    expect(joinInstances(instances)).toEqual([]);
  });

  it('flags CONFLICT when two files disagree on the value', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', valueNorm: 'completed' }),
      instance({ id: 'f2', file: 'b.md', valueNorm: 'in progress' }),
    ];
    const clusters = joinInstances(instances);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]?.verdict).toBe('conflict');
    expect(clusters[0]?.distinctValueNorms.toSorted((a, b) => a.localeCompare(b))).toEqual([
      'completed',
      'in progress',
    ]);
    expect(clusters[0]?.memberInstanceIds).toEqual(['f1', 'f2']);
  });

  it('flags CONFLICT within a single file at two mentions', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', line: 1, valueNorm: 'completed' }),
      instance({ id: 'f2', file: 'a.md', line: 40, valueNorm: 'in progress' }),
    ];
    expect(joinInstances(instances)[0]?.verdict).toBe('conflict');
  });

  it('flags LATENT when the same value repeats across two distinct files', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', valueNorm: 'completed' }),
      instance({ id: 'f2', file: 'b.md', valueNorm: 'completed' }),
    ];
    const clusters = joinInstances(instances);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]?.verdict).toBe('latent');
    expect(clusters[0]?.distinctValueNorms).toEqual(['completed']);
  });

  it('treats formatting variants as the same value, not a false conflict', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', valueNorm: 'Completed.' }),
      instance({ id: 'f2', file: 'b.md', valueNorm: '  completed' }),
    ];
    expect(joinInstances(instances)[0]?.verdict).toBe('latent');
  });

  it('excludes free-text-subject instances (subjectFromGazetteer: false) from the exact-key join', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', valueNorm: 'completed', subjectFromGazetteer: false }),
      instance({ id: 'f2', file: 'b.md', valueNorm: 'in progress', subjectFromGazetteer: false }),
    ];
    expect(joinInstances(instances)).toEqual([]);
  });

  it('keeps distinct fact-keys in separate clusters', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', predicate: 'status', valueNorm: 'completed' }),
      instance({ id: 'f2', file: 'b.md', predicate: 'status', valueNorm: 'in progress' }),
      instance({ id: 'f3', file: 'a.md', predicate: 'count', valueNorm: '681' }),
      instance({ id: 'f4', file: 'b.md', predicate: 'count', valueNorm: '681' }),
    ];
    const clusters = joinInstances(instances);
    expect(clusters).toHaveLength(2);
    expect(clusters.map((cluster) => cluster.verdict).sort((a, b) => a.localeCompare(b))).toEqual([
      'conflict',
      'latent',
    ]);
  });

  it('produces a deterministic exact-key cluster id from the fact-key', () => {
    const instances = [
      instance({ id: 'f1', file: 'a.md', valueNorm: 'completed' }),
      instance({ id: 'f2', file: 'b.md', valueNorm: 'completed' }),
    ];
    expect(joinInstances(instances)[0]?.id).toBe('exact:status-assertion:s0-window-sample:status');
  });
});

describe('recountReducerCluster', () => {
  it('recomputes CONFLICT from a homogeneous reducer-proposed group', () => {
    const members = [
      instance({
        id: 'f1',
        file: 'a.md',
        subject: 'freeform-x',
        subjectFromGazetteer: false,
        valueNorm: 'completed',
      }),
      instance({
        id: 'f2',
        file: 'b.md',
        subject: 'freeform-x',
        subjectFromGazetteer: false,
        valueNorm: 'in progress',
      }),
    ];
    const cluster = recountReducerCluster('r1', members);
    expect(cluster?.verdict).toBe('conflict');
    expect(cluster?.clusterKind).toBe('reducer');
    expect(cluster?.id).toBe('r1');
  });

  it('recomputes LATENT from a homogeneous reducer-proposed group', () => {
    const members = [
      instance({
        id: 'f1',
        file: 'a.md',
        subject: 'freeform-x',
        subjectFromGazetteer: false,
        valueNorm: 'completed',
      }),
      instance({
        id: 'f2',
        file: 'b.md',
        subject: 'freeform-x',
        subjectFromGazetteer: false,
        valueNorm: 'completed',
      }),
    ];
    expect(recountReducerCluster('r1', members)?.verdict).toBe('latent');
  });

  it('JOINS members whose free-text subject wording differs — rejecting them would defeat the reducer entirely; the voters sameFact test owns that judgment', () => {
    const members = [
      instance({
        id: 'f1',
        file: 'a.md',
        subject: 'freeform-x',
        subjectFromGazetteer: false,
        valueNorm: 'completed',
      }),
      instance({
        id: 'f2',
        file: 'b.md',
        subject: 'the freeform x register',
        subjectFromGazetteer: false,
        valueNorm: 'in progress',
      }),
    ];
    const cluster = recountReducerCluster('r1', members);
    expect(cluster?.verdict).toBe('conflict');
    expect(cluster?.subject).toBe('freeform-x');
  });

  it('rejects a proposal whose members span DIFFERENT factClasses — no wording judgment can bridge a count and a status', () => {
    const members = [
      instance({ id: 'f1', file: 'a.md', subjectFromGazetteer: false, factClass: 'count' }),
      instance({
        id: 'f2',
        file: 'b.md',
        subjectFromGazetteer: false,
        factClass: 'status-assertion',
      }),
    ];
    expect(recountReducerCluster('r1', members)).toBeNull();
  });

  it('collapses duplicate member ids before counting — [f1, f1] is one statement, not a repetition', () => {
    const one = instance({
      id: 'f1',
      file: 'a.md',
      subject: 'freeform-x',
      subjectFromGazetteer: false,
      valueNorm: 'completed',
    });
    expect(recountReducerCluster('r1', [one, one])).toBeNull();
  });

  it('rejects a proposal with fewer than two members', () => {
    expect(recountReducerCluster('r1', [instance({ id: 'f1' })])).toBeNull();
  });

  it('rejects a proposal with zero members', () => {
    expect(recountReducerCluster('r1', [])).toBeNull();
  });

  it('drops empty-normal-form members before recount (a proposal shrinking below 2 dies)', () => {
    const members = [
      instance({ id: 'f1', file: 'a.md', subject: 'freeform-x', subjectFromGazetteer: false }),
      instance({
        id: 'f2',
        file: 'b.md',
        subject: 'freeform-x',
        subjectFromGazetteer: false,
        valueNorm: '.',
      }),
    ];
    expect(recountReducerCluster('r1', members)).toBeNull();
  });

  it('rejects same-value repetition confined to one file (not a genuine cross-file restatement)', () => {
    const members = [
      instance({ id: 'f1', file: 'a.md', subject: 'freeform-x', subjectFromGazetteer: false }),
      instance({ id: 'f2', file: 'a.md', subject: 'freeform-x', subjectFromGazetteer: false }),
    ];
    expect(recountReducerCluster('r1', members)).toBeNull();
  });
});

describe('freeTextInstances', () => {
  it('keeps only subjectFromGazetteer: false instances', () => {
    const instances = [
      instance({ id: 'f1', subjectFromGazetteer: true }),
      instance({ id: 'f2', subjectFromGazetteer: false }),
    ];
    expect(freeTextInstances(instances).map((i) => i.id)).toEqual(['f2']);
  });
});

describe('chunkForReducer', () => {
  it('returns no chunks for an empty input', () => {
    expect(chunkForReducer([])).toEqual([]);
  });

  it('returns one chunk when the input is smaller than maxChunks', () => {
    const instances = [instance({ id: 'f1' }), instance({ id: 'f2' })];
    const chunks = chunkForReducer(instances, 3);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toHaveLength(2);
  });

  it('escalates past one chunk only once the residual set exceeds targetChunkSize', () => {
    const instances = Array.from({ length: 7 }, (_, i) => instance({ id: `f${i}` }));
    const chunks = chunkForReducer(instances, 3, 2);
    expect(chunks.length).toBeLessThanOrEqual(3);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length > 0)).toBe(true);
    expect(chunks.flat()).toHaveLength(7);
  });

  it('never exceeds maxChunks even for a very large residual set — the cap wins over targetChunkSize', () => {
    const instances = Array.from({ length: 900 }, (_, i) => instance({ id: `f${i}` }));
    const chunks = chunkForReducer(instances, 3, 200);
    expect(chunks).toHaveLength(3);
    expect(chunks.flat()).toHaveLength(900);
    expect(chunks.every((chunk) => chunk.length === 300)).toBe(true);
  });

  it('preserves instance order across chunks', () => {
    const instances = Array.from({ length: 5 }, (_, i) => instance({ id: `f${i}` }));
    const chunks = chunkForReducer(instances, 2, 1);
    expect(chunks.flat().map((i) => i.id)).toEqual(['f0', 'f1', 'f2', 'f3', 'f4']);
  });
});
