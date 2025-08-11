/**
 * Unit tests for search pure functions
 * These are true unit tests - no mocks, no IO, no side effects
 */

import { describe, it, expect } from 'vitest';
import { validateSearchParams, formatSearchResultsForLog } from './search-pure';

describe('validateSearchParams', () => {
  it('should accept valid search parameters', () => {
    // Given: Valid parameters
    const params = {
      q: 'fractions',
      keyStage: 'ks2' as const,
      subject: 'maths',
      limit: 10,
    };

    // When: Validate
    const result = validateSearchParams(params);

    // Then: Parameters are returned
    expect(result).toEqual(params);
  });

  it('should trim query string', () => {
    // Given: Query with whitespace
    const params = { q: '  fractions  ' };

    // When: Validate
    const result = validateSearchParams(params);

    // Then: Query is trimmed
    expect(result.q).toBe('fractions');
  });

  it('should reject empty query', () => {
    // Given: Empty query
    const params = { q: '' };

    // When/Then: Validation throws
    expect(() => validateSearchParams(params)).toThrow('Search query is required');
  });

  it('should reject whitespace-only query', () => {
    // Given: Whitespace query
    const params = { q: '   ' };

    // When/Then: Validation throws
    expect(() => validateSearchParams(params)).toThrow('Search query is required');
  });

  it('should reject invalid key stage', () => {
    // Given: Invalid key stage
    const params = {
      q: 'fractions',
      keyStage: 'invalid' as any,
    };

    // When/Then: Validation throws
    expect(() => validateSearchParams(params)).toThrow('Invalid key stage: invalid');
  });

  it('should accept valid key stages', () => {
    // Given: Each valid key stage
    const validStages = ['eyfs', 'ks1', 'ks2', 'ks3', 'ks4', 'ks5'] as const;

    validStages.forEach((keyStage) => {
      const params = { q: 'test', keyStage };
      const result = validateSearchParams(params);
      expect(result.keyStage).toBe(keyStage);
    });
  });

  it('should reject limit below 1', () => {
    // Given: Limit too low
    const params = { q: 'fractions', limit: 0 };

    // When/Then: Validation throws
    expect(() => validateSearchParams(params)).toThrow('Limit must be between 1 and 100');
  });

  it('should reject limit above 100', () => {
    // Given: Limit too high
    const params = { q: 'fractions', limit: 101 };

    // When/Then: Validation throws
    expect(() => validateSearchParams(params)).toThrow('Limit must be between 1 and 100');
  });

  it('should trim subject if provided', () => {
    // Given: Subject with whitespace
    const params = { q: 'fractions', subject: '  maths  ' };

    // When: Validate
    const result = validateSearchParams(params);

    // Then: Subject is trimmed
    expect(result.subject).toBe('maths');
  });
});

describe('formatSearchResultsForLog', () => {
  it('should format empty results', () => {
    // Given: Empty array
    const results: unknown[] = [];

    // When: Format
    const message = formatSearchResultsForLog(results);

    // Then: Returns appropriate message
    expect(message).toBe('No lessons found');
  });

  it('should format single result', () => {
    // Given: One result
    const results = [{ id: 1 }];

    // When: Format
    const message = formatSearchResultsForLog(results);

    // Then: Returns singular message
    expect(message).toBe('Found 1 lesson');
  });

  it('should format multiple results', () => {
    // Given: Multiple results
    const results = [{ id: 1 }, { id: 2 }, { id: 3 }];

    // When: Format
    const message = formatSearchResultsForLog(results);

    // Then: Returns plural message
    expect(message).toBe('Found 3 lessons');
  });
});
