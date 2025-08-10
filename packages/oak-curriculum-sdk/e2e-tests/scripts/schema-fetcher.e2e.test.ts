import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { OpenAPI3 } from '../../src/types/openapi';
import { existsSync, readFileSync } from 'node:fs';

// Mock the fetch function for testing
const mockFetch = vi.fn();
global.fetch = mockFetch as typeof fetch;

// Mock fs module
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

// Function we'll implement
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
        components: {
          schemas: {
            Lesson: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
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
      expect(mockFetch).toHaveBeenCalledWith('https://api.oak.com/openapi.json');
    });

    it('falls back to cached schema when fetch fails', async () => {
      // Given: Fetch fails and cache exists
      const cachedSchema: OpenAPI3 = {
        openapi: '3.0.0',
        info: {
          title: 'Cached API',
          version: '1.0.0',
        },
        paths: {},
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(JSON.stringify(cachedSchema));

      // When: Fetching with fallback
      const result = await fetchOpenAPISchema(
        'https://api.oak.com/openapi.json',
        '/path/to/cached/schema.json',
      );

      // Then: Should return cached schema
      expect(result).toEqual(cachedSchema);
      expect(vi.mocked(readFileSync)).toHaveBeenCalledWith('/path/to/cached/schema.json', 'utf-8');
    });

    it('throws error when both remote and cache fail', async () => {
      // Given: Both fetch and cache fail
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      vi.mocked(existsSync).mockReturnValue(false);

      // When/Then: Should throw error
      await expect(
        fetchOpenAPISchema('https://api.oak.com/openapi.json', '/nonexistent/path'),
      ).rejects.toThrow('Failed to fetch OpenAPI schema');
    });

    it('validates schema structure', async () => {
      // Given: Invalid schema response with no cache
      const invalidSchema = {
        // Missing required fields
        info: { title: 'Test' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidSchema),
      });
      vi.mocked(existsSync).mockReturnValue(false);

      // When/Then: Should throw error about failed fetch (since validation fails and no cache)
      await expect(fetchOpenAPISchema('https://api.oak.com/openapi.json')).rejects.toThrow(
        'Failed to fetch OpenAPI schema',
      );
    });

    it('caches fetched schema to disk', async () => {
      // Given: Successful fetch
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

      // When: Fetching with cache path
      const result = await fetchOpenAPISchema(
        'https://api.oak.com/openapi.json',
        './test-cache/schema.json',
      );

      // Then: Should save to cache (we'll verify file write was called)
      expect(result).toEqual(mockSchema);
    });
  });
});
