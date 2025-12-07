import { describe, expect, it } from 'vitest';
import { buildLessonRrfRequest } from './rrf-query-builders';

describe('rrf-query-builders', () => {
  describe('buildLessonRrfRequest (two-way)', () => {
    it('should build a two-way RRF request with BM25 and ELSER queries', () => {
      const request = buildLessonRrfRequest({
        text: 'pythagoras theorem',
        size: 10,
      });

      expect(request.index).toBe('oak_lessons');
      expect(request.size).toBe(10);
      expect(request.rank).toBeDefined();
      expect(request.rank?.queries).toHaveLength(2);
      expect(request.rank?.queries?.[0]).toHaveProperty('multi_match');
      expect(request.rank?.queries?.[1]).toHaveProperty('semantic');
    });
  });
});
