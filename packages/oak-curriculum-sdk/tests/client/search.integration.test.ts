import { describe, it, expect } from 'vitest';
import { searchLessons } from '../../src/client/search';
import type { HttpAdapter, HttpResponse } from '../../src/adapters/types';
import type { SearchParams } from '../../src/client/types';

describe('Search Integration', () => {
  describe('searchLessons', () => {
    it('integrates HTTP with transformation', async () => {
      // Given: Mock response data
      const mockApiResponse = {
        total: 2,
        page: 1,
        limit: 10,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introduction to Fractions',
            subject_name: 'Mathematics',
            key_stage_slug: 'ks3',
          },
          {
            id: 'lesson-2',
            title: 'Advanced Fractions',
            subject_name: 'Mathematics',
            key_stage_slug: 'ks3',
          },
        ],
      };

      // Simple HTTP adapter mock (injected dependency)
      const mockHttp: HttpAdapter = {
        request: (url: string): Promise<HttpResponse> => {
          // Verify URL is built correctly
          expect(url).toContain('/api/v1/search');
          expect(url).toContain('subject=mathematics');

          return Promise.resolve({
            status: 200,
            body: JSON.stringify(mockApiResponse),
            headers: { 'content-type': 'application/json' },
          });
        },
      };

      // When: Search with injected dependencies
      const params: SearchParams = { subject: 'mathematics' };
      const result = await searchLessons(
        { http: mockHttp, config: { baseUrl: 'https://api.oak.com' } },
        params,
      );

      // Then: Results are transformed correctly
      expect(result.total).toBe(2);
      expect(result.lessons).toHaveLength(2);
      expect(result.lessons[0].id).toBe('lesson-1');
      expect(result.lessons[0].title).toBe('Introduction to Fractions');
      expect(result.lessons[0].subject).toBe('Mathematics');
      expect(result.lessons[0].keyStage).toBe('ks3');
    });

    it('handles API errors gracefully', async () => {
      // Given: HTTP adapter that returns error
      const errorHttp: HttpAdapter = {
        request: (): Promise<HttpResponse> =>
          Promise.resolve({
            status: 404,
            body: JSON.stringify({ error: 'Not found' }),
            headers: {},
          }),
      };

      // When: Search with error response
      const params: SearchParams = { subject: 'unknown' };

      // Then: Should throw appropriate error
      await expect(
        searchLessons({ http: errorHttp, config: { baseUrl: 'https://api.oak.com' } }, params),
      ).rejects.toThrow('API request failed with status 404');
    });

    it('includes API key in headers when provided', async () => {
      // Given: Mock that verifies headers
      const mockHttp: HttpAdapter = {
        request: (_url: string, options): Promise<HttpResponse> => {
          // Verify API key is included
          expect(options.headers?.Authorization).toBe('Bearer test-api-key');

          return Promise.resolve({
            status: 200,
            body: JSON.stringify({ total: 0, page: 1, limit: 10, lessons: [] }),
            headers: {},
          });
        },
      };

      // When: Search with API key
      const result = await searchLessons(
        {
          http: mockHttp,
          config: { baseUrl: 'https://api.oak.com', apiKey: 'test-api-key' },
        },
        { subject: 'mathematics' },
      );

      // Then: Request succeeds
      expect(result.total).toBe(0);
    });

    it('handles pagination parameters', async () => {
      // Given: Mock that verifies pagination
      const mockHttp: HttpAdapter = {
        request: (url: string): Promise<HttpResponse> => {
          // Verify pagination params in URL
          expect(url).toContain('page=2');
          expect(url).toContain('limit=20');

          return Promise.resolve({
            status: 200,
            body: JSON.stringify({
              total: 100,
              page: 2,
              limit: 20,
              lessons: [],
            }),
            headers: {},
          });
        },
      };

      // When: Search with pagination
      const result = await searchLessons(
        { http: mockHttp, config: { baseUrl: 'https://api.oak.com' } },
        { subject: 'mathematics', page: 2, limit: 20 },
      );

      // Then: Pagination is preserved
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });
  });
});
