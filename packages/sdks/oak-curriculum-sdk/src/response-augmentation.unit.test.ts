/**
 * Unit tests for response augmentation behaviour
 *
 * These tests prove the correct behaviour of response augmentation,
 * focusing on what the function does, not how it does it.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { augmentResponseWithCanonicalUrl } from './response-augmentation.js';

const mockCreateAdaptiveLogger = vi.fn(() => ({
  warn: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
}));
vi.mock('@oaknational/mcp-logger', () => ({
  createAdaptiveLogger: mockCreateAdaptiveLogger,
}));

describe('augmentResponseWithCanonicalUrl', () => {
  let mockLogger: ReturnType<typeof mockCreateAdaptiveLogger>;

  beforeEach(async () => {
    const { createAdaptiveLogger } = vi.mocked(await import('@oaknational/mcp-logger'));
    createAdaptiveLogger.mockReset();
    mockLogger = mockCreateAdaptiveLogger();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('lesson responses', () => {
    it('should add canonicalUrl field to lesson responses', () => {
      const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
      expect(result).toHaveProperty('slug', 'add-two-numbers');
      expect(result).toHaveProperty('title', 'Add Two Numbers');
    });

    it('should handle lesson responses with id field', () => {
      const response = { id: 'lesson:add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });

    it('should extract ID from path when not in response', () => {
      const response = { title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/lessons/add-two-numbers',
      );
    });
  });

  describe('sequence responses', () => {
    it('should add canonicalUrl field to sequence responses', () => {
      const response = { slug: 'maths-ks1', title: 'Maths KS1' };
      const result = augmentResponseWithCanonicalUrl(response, '/sequences/maths-ks1', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/maths-ks1/units',
      );
    });
  });

  describe('unit responses with context', () => {
    it('should add canonicalUrl field to unit responses with context', () => {
      const response = {
        slug: 'place-value',
        title: 'Place Value',
        subjectSlug: 'maths',
        phaseSlug: 'ks1',
      };
      const result = augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/programmes/maths-ks1/units/place-value',
      );
    });

    it('should omit canonicalUrl when unit context is missing', () => {
      const response = { slug: 'place-value', title: 'Place Value' };
      const result = augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
      expect(mockLogger.warn).toHaveBeenCalledWith('Could not generate canonical URL', {
        contentType: 'unit',
        id: 'place-value',
        context: {},
      });
    });

    it('should omit canonicalUrl when unit context is partial', () => {
      const response = {
        slug: 'place-value',
        title: 'Place Value',
        subjectSlug: 'maths',
        // missing phaseSlug
      };
      const result = augmentResponseWithCanonicalUrl(response, '/units/place-value', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
      expect(mockLogger.warn).toHaveBeenCalledWith('Could not generate canonical URL', {
        contentType: 'unit',
        id: 'place-value',
        context: {},
      });
    });
  });

  describe('subject responses with context', () => {
    it('should add canonicalUrl field to subject responses with context', () => {
      const response = {
        slug: 'maths',
        title: 'Maths',
        keyStageSlugs: ['ks1', 'ks2'],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).toHaveProperty('canonicalUrl');
      expect(result.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
      );
    });

    it('should omit canonicalUrl when subject context is missing', () => {
      const response = { slug: 'maths', title: 'Maths' };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
      expect(mockLogger.warn).toHaveBeenCalledWith('Could not generate canonical URL', {
        contentType: 'subject',
        id: 'maths',
        context: {},
      });
    });

    it('should omit canonicalUrl when subject context is empty', () => {
      const response = {
        slug: 'maths',
        title: 'Maths',
        keyStageSlugs: [],
      };
      const result = augmentResponseWithCanonicalUrl(response, '/subjects/maths', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
      expect(mockLogger.warn).toHaveBeenCalledWith('Could not generate canonical URL', {
        contentType: 'subject',
        id: 'maths',
        context: { subject: { keyStageSlugs: [] } },
      });
    });
  });

  describe('non-GET requests', () => {
    it('should not add canonicalUrl for POST requests', () => {
      const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'post');

      expect(result).not.toHaveProperty('canonicalUrl');
    });

    it('should not add canonicalUrl for PUT requests', () => {
      const response = { slug: 'add-two-numbers', title: 'Add Two Numbers' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'put');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('unsupported content types', () => {
    it('should not add canonicalUrl for unsupported paths', () => {
      const response = { slug: 'some-content', title: 'Some Content' };
      const result = augmentResponseWithCanonicalUrl(response, '/unknown/some-content', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('error handling', () => {
    it('should warn when ID cannot be extracted', () => {
      const response = { title: 'Some Content' };
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
      expect(mockLogger.warn).toHaveBeenCalledWith('Could not extract ID from response', {
        path: '/lessons/',
        contentType: 'lesson',
      });
    });

    // Non-object responses cannot be passed to this function by type design

    it('should handle array responses', () => {
      const response = ['item1', 'item2'];
      const result = augmentResponseWithCanonicalUrl(response, '/lessons/add-two-numbers', 'get');

      expect(result).not.toHaveProperty('canonicalUrl');
      expect(mockLogger.warn).toHaveBeenCalledWith('Could not extract ID from response', {
        path: '/lessons/add-two-numbers',
        contentType: 'lesson',
      });
    });
  });
});
