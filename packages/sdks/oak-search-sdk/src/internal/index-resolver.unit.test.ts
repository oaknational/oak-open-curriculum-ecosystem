/**
 * Unit tests for the index name resolver.
 *
 * Pure function tests — no IO, no mocks.
 */

import { describe, it, expect } from 'vitest';
import {
  resolveSearchIndexName,
  resolveZeroHitIndexName,
  createIndexResolver,
} from './index-resolver.js';

describe('resolveSearchIndexName', () => {
  it('resolves primary lessons index', () => {
    expect(resolveSearchIndexName('lessons', 'primary')).toBe('oak_lessons');
  });

  it('resolves sandbox lessons index', () => {
    expect(resolveSearchIndexName('lessons', 'sandbox')).toBe('oak_lessons_sandbox');
  });

  it('resolves primary unit_rollup index', () => {
    expect(resolveSearchIndexName('unit_rollup', 'primary')).toBe('oak_unit_rollup');
  });

  it('resolves sandbox sequences index', () => {
    expect(resolveSearchIndexName('sequences', 'sandbox')).toBe('oak_sequences_sandbox');
  });

  it('resolves all primary index kinds', () => {
    expect(resolveSearchIndexName('lessons', 'primary')).toBe('oak_lessons');
    expect(resolveSearchIndexName('unit_rollup', 'primary')).toBe('oak_unit_rollup');
    expect(resolveSearchIndexName('units', 'primary')).toBe('oak_units');
    expect(resolveSearchIndexName('sequences', 'primary')).toBe('oak_sequences');
    expect(resolveSearchIndexName('sequence_facets', 'primary')).toBe('oak_sequence_facets');
    expect(resolveSearchIndexName('threads', 'primary')).toBe('oak_threads');
  });
});

describe('resolveZeroHitIndexName', () => {
  it('resolves primary zero-hit index', () => {
    expect(resolveZeroHitIndexName('primary')).toBe('oak_zero_hit_events');
  });

  it('resolves sandbox zero-hit index', () => {
    expect(resolveZeroHitIndexName('sandbox')).toBe('oak_zero_hit_events_sandbox');
  });
});

describe('createIndexResolver', () => {
  it('creates a resolver function bound to primary target', () => {
    const resolve = createIndexResolver('primary');
    expect(resolve('lessons')).toBe('oak_lessons');
    expect(resolve('units')).toBe('oak_units');
  });

  it('creates a resolver function bound to sandbox target', () => {
    const resolve = createIndexResolver('sandbox');
    expect(resolve('lessons')).toBe('oak_lessons_sandbox');
    expect(resolve('units')).toBe('oak_units_sandbox');
  });
});
