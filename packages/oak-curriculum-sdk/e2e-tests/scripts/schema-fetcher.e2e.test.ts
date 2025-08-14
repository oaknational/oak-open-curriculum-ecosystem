import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { OpenAPI3 } from '../../src/types/openapi';

// Mock the fetch function for testing
const mockFetch = vi.fn();
global.fetch = mockFetch as typeof fetch;

// Function we'll test
import { fetchOpenAPISchema } from '../../scripts/schema-fetcher';

describe('OpenAPI Schema Fetcher Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchOpenAPISchema', () => {
    it('fetches schema from remote URL successfully', async () => {
      // Given: A mock OpenAPI schema response
      const mockSchema: OpenAPI3 = {
        openapi: '3.0.0',
        info: {
          title: 'Oak Curriculum API',
          version: '1.0.0',
        },
        paths: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSchema),
      });

      // When: Fetching the schema
      const result = await fetchOpenAPISchema('https://api.oak.com/openapi.json');

      // Then: Should return the parsed schema
      expect(result).toEqual(mockSchema);
      expect(mockFetch).toHaveBeenCalledWith('https://api.oak.com/openapi.json');
    });

    it('throws error when fetch fails', async () => {
      // Given: Fetch fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // When/Then: Should throw error
      await expect(fetchOpenAPISchema('https://api.oak.com/openapi.json')).rejects.toThrow(
        'Network error',
      );
    });

    it('throws error when response is not ok', async () => {
      // Given: Server returns error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      // When/Then: Should throw error
      await expect(fetchOpenAPISchema('https://api.oak.com/openapi.json')).rejects.toThrow(
        'HTTP 404: Not Found',
      );
    });

    it('validates schema structure', async () => {
      // Given: Invalid schema response
      const invalidSchema = {
        // Missing required fields
        info: { title: 'Test' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidSchema),
      });

      // When/Then: Should throw error about invalid schema
      await expect(fetchOpenAPISchema('https://api.oak.com/openapi.json')).rejects.toThrow(
        'Invalid OpenAPI schema',
      );
    });

    it('accepts valid OpenAPI 3.x schema', async () => {
      // Given: Valid OpenAPI 3.1 schema
      const mockSchema: OpenAPI3 = {
        openapi: '3.1.0',
        info: {
          title: 'Test API',
          version: '2.0.0',
        },
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: {
                '200': {
                  description: 'Success',
                },
              },
            },
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSchema),
      });

      // When: Fetching the schema
      const result = await fetchOpenAPISchema('https://api.oak.com/openapi.json');

      // Then: Should return the parsed schema
      expect(result).toEqual(mockSchema);
    });
  });
});
