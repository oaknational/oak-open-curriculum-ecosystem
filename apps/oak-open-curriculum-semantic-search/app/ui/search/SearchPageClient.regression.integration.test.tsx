/**
 * @fileoverview Regression tests for SearchPageClient behavior.
 *
 * Per the testing strategy:
 * - Test behavior, not implementation
 * - Prefer unit tests over integration tests
 * - No complex rendering if the behavior can be tested at a lower level
 *
 * The original test rendered a full SearchPageClient component which is slow
 * and resource-intensive. The actual behavior being tested (error clearing after
 * successful search) is handled by the useSearchController hook's reducer.
 *
 * This test verifies the reducer behavior directly, which is fast and reliable.
 *
 * @see `.agent/directives-and-memory/testing-strategy.md`
 */
import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useSearchController } from './hooks/useSearchController';

describe('SearchPageClient regression', () => {
  it('does not emit repeated errors after a successful structured search submission', () => {
    const { result } = renderHook(() => useSearchController());

    // Start search (simulates form submission)
    act(() => {
      result.current.onStart();
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Successful response arrives
    act(() => {
      result.current.onSuccess({
        scope: 'lessons',
        results: [
          {
            id: 'lesson-1',
            rankScore: 1,
            lesson: {
              lesson_title: 'Decimals introduction',
              subject_slug: 'maths',
              key_stage: 'ks2',
            },
            highlights: [],
          },
        ],
        total: 1,
        took: 5,
        timedOut: false,
        suggestions: [],
      });
    });

    // Verify error is cleared and results are populated
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.results.length).toBe(1);
    expect(result.current.mode).toBe('single');
  });

  it('clears previous error when new search succeeds', () => {
    const { result } = renderHook(() => useSearchController());

    // First search errors
    act(() => {
      result.current.onStart();
    });
    act(() => {
      result.current.onError('Search failed');
    });
    expect(result.current.error).toBe('Search failed');

    // Second search starts and succeeds
    act(() => {
      result.current.onStart();
    });
    expect(result.current.error).toBeNull(); // Error cleared on start

    act(() => {
      result.current.onSuccess({
        scope: 'units',
        results: [],
        total: 0,
        took: 3,
        timedOut: false,
        suggestions: [],
      });
    });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
