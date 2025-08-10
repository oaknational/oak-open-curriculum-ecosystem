import { describe, it, expect } from 'vitest';
import { createOakClient } from '../../src/client/oak-client';
import type { HttpAdapter, HttpResponse } from '../../src/adapters/types';

describe('OakClient Factory', () => {
  describe('createOakClient', () => {
    it('creates client with injected dependencies', () => {
      // Given: Mock HTTP adapter
      const mockHttp: HttpAdapter = {
        request: (): Promise<HttpResponse> =>
          Promise.resolve({
            status: 200,
            body: '{}',
            headers: {},
          }),
      };

      // When: Create client
      const client = createOakClient({
        http: mockHttp,
        config: { baseUrl: 'https://api.oak.com' },
      });

      // Then: Client is created with expected methods
      expect(client).toBeDefined();
      // Check method exists
      expect('searchLessons' in client).toBe(true);
    });

    it('validates required configuration', () => {
      // Given: Mock HTTP adapter
      const mockHttp: HttpAdapter = {
        request: (): Promise<HttpResponse> =>
          Promise.resolve({
            status: 200,
            body: '{}',
            headers: {},
          }),
      };

      // When: Create client without base URL
      // Then: Should throw error
      expect(() =>
        createOakClient({
          http: mockHttp,
          config: { baseUrl: '' },
        }),
      ).toThrow('Base URL required');
    });

    it('searchLessons method works with injected dependencies', async () => {
      // Given: Mock HTTP adapter that returns search results
      const mockApiResponse = {
        total: 1,
        page: 1,
        limit: 10,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Test Lesson',
            subject_name: 'Mathematics',
            key_stage_slug: 'ks3',
          },
        ],
      };

      const mockHttp: HttpAdapter = {
        request: (url: string): Promise<HttpResponse> => {
          expect(url).toContain('/api/v1/search');
          return Promise.resolve({
            status: 200,
            body: JSON.stringify(mockApiResponse),
            headers: { 'content-type': 'application/json' },
          });
        },
      };

      // When: Create client and search
      const client = createOakClient({
        http: mockHttp,
        config: { baseUrl: 'https://api.oak.com' },
      });

      const results = await client.searchLessons({ subject: 'mathematics' });

      // Then: Results are properly transformed
      expect(results.total).toBe(1);
      expect(results.lessons[0].title).toBe('Test Lesson');
      expect(results.lessons[0].subject).toBe('Mathematics');
    });

    it('passes API key to requests when configured', async () => {
      // Given: Mock that verifies API key
      const mockHttp: HttpAdapter = {
        request: (_url: string, options): Promise<HttpResponse> => {
          expect(options.headers?.Authorization).toBe('Bearer test-key');
          return Promise.resolve({
            status: 200,
            body: JSON.stringify({ total: 0, page: 1, limit: 10, lessons: [] }),
            headers: {},
          });
        },
      };

      // When: Create client with API key
      const client = createOakClient({
        http: mockHttp,
        config: {
          baseUrl: 'https://api.oak.com',
          apiKey: 'test-key',
        },
      });

      await client.searchLessons({ subject: 'mathematics' });
      // Then: API key was included (verified in mock)
    });
  });
});
