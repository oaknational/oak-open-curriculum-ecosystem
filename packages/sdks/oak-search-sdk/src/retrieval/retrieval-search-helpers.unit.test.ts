/**
 * Unit tests for two-way RRF retriever builders (sequences and threads).
 *
 * Verifies that `buildSequenceRetriever` and `buildThreadRetriever` produce
 * the correct RRF shape: two sub-retrievers (BM25 + semantic) with shared
 * filters, correct fields, and correct fusion parameters.
 */

import { describe, it, expect } from 'vitest';
import { buildSequenceRetriever, buildThreadRetriever } from './retrieval-search-helpers.js';

/**
 * Narrows a RetrieverContainer past the ExactlyOne union's undefined member.
 * ES SDK 9.3 types include undefined in ExactlyOne output.
 */
function requireRetriever(retriever: ReturnType<typeof buildSequenceRetriever>) {
  if (!retriever) {
    throw new Error('Retriever was undefined');
  }
  return retriever;
}

/** Extract the RRF envelope, throwing if absent. */
function requireRrf(retriever: ReturnType<typeof buildSequenceRetriever>) {
  const rrf = requireRetriever(retriever).rrf;
  if (!rrf) {
    throw new Error('Expected RRF retriever but rrf was undefined');
  }
  return rrf;
}

/** Extract the standard retriever at the given RRF index, narrowing past undefined. */
function getStandard(retriever: ReturnType<typeof buildSequenceRetriever>, index: number) {
  const entry = requireRrf(retriever).retrievers?.[index];
  if (!entry || !('standard' in entry)) {
    throw new Error(`No standard retriever at index ${index}`);
  }
  const standard = entry.standard;
  if (!standard) {
    throw new Error(`standard was undefined at index ${index}`);
  }
  return standard;
}

describe('buildSequenceRetriever', () => {
  it('produces an RRF envelope with exactly 2 retrievers', () => {
    const rrf = requireRrf(buildSequenceRetriever('algebra', undefined));
    expect(rrf.retrievers).toHaveLength(2);
  });

  it('first retriever is BM25 multi_match on sequence fields with fuzziness AUTO', () => {
    const bm25 = getStandard(buildSequenceRetriever('algebra', undefined), 0);
    const mm = bm25.query?.multi_match;

    expect(mm).toBeDefined();
    expect(mm?.query).toBe('algebra');
    expect(mm?.type).toBe('best_fields');
    expect(mm?.fuzziness).toBe('AUTO');
    expect(mm?.fields).toEqual([
      'sequence_title^2',
      'category_titles',
      'subject_title',
      'phase_title',
    ]);
  });

  it('second retriever is semantic on sequence_semantic', () => {
    const semantic = getStandard(buildSequenceRetriever('algebra', undefined), 1);

    expect(semantic.query).toHaveProperty('semantic');
    expect(semantic.query?.semantic).toEqual({
      field: 'sequence_semantic',
      query: 'algebra',
    });
  });

  it('uses rank_constant 40 and rank_window_size 40', () => {
    const rrf = requireRrf(buildSequenceRetriever('algebra', undefined));
    expect(rrf.rank_constant).toBe(40);
    expect(rrf.rank_window_size).toBe(40);
  });

  it('both sub-retrievers carry the same filter when provided', () => {
    const filter = { bool: { filter: [{ term: { subject_slug: 'maths' } }] } };
    const retriever = buildSequenceRetriever('algebra', filter);

    const bm25Filter = getStandard(retriever, 0).filter;
    const semanticFilter = getStandard(retriever, 1).filter;

    expect(bm25Filter).toEqual(filter);
    expect(semanticFilter).toEqual(filter);
  });

  it('both sub-retrievers have undefined filter when none provided', () => {
    const retriever = buildSequenceRetriever('algebra', undefined);

    expect(getStandard(retriever, 0).filter).toBeUndefined();
    expect(getStandard(retriever, 1).filter).toBeUndefined();
  });
});

describe('buildThreadRetriever', () => {
  it('produces an RRF envelope with exactly 2 retrievers', () => {
    const rrf = requireRrf(buildThreadRetriever('number sense', undefined));
    expect(rrf.retrievers).toHaveLength(2);
  });

  it('first retriever is BM25 multi_match on thread_title^2', () => {
    const bm25 = getStandard(buildThreadRetriever('number sense', undefined), 0);
    const mm = bm25.query?.multi_match;

    expect(mm?.fields).toEqual(['thread_title^2']);
    expect(mm?.fuzziness).toBe('AUTO');
  });

  it('second retriever is semantic on thread_semantic', () => {
    const semantic = getStandard(buildThreadRetriever('number sense', undefined), 1);

    expect(semantic.query?.semantic).toEqual({
      field: 'thread_semantic',
      query: 'number sense',
    });
  });

  it('uses rank_constant 40 and rank_window_size 40', () => {
    const rrf = requireRrf(buildThreadRetriever('number sense', undefined));
    expect(rrf.rank_constant).toBe(40);
    expect(rrf.rank_window_size).toBe(40);
  });
});
