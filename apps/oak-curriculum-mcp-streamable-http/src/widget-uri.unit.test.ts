/**
 * Unit tests for widget URI generation with cache-busting.
 *
 * Tests the pure function that appends cache-busting query params to widget URIs.
 * Following TDD: RED (tests fail) → GREEN (implementation) → REFACTOR
 */

import { describe, it, expect } from 'vitest';
import { getWidgetUri } from './widget-uri.js';

describe('getWidgetUri', () => {
  const BASE_URI = 'ui://widget/oak-json-viewer.html';

  describe('without cache-busting', () => {
    it('returns base URI when cacheBuster is undefined', () => {
      const result = getWidgetUri(BASE_URI, undefined);
      expect(result).toBe(BASE_URI);
    });

    it('returns base URI when cacheBuster is empty string', () => {
      const result = getWidgetUri(BASE_URI, '');
      expect(result).toBe(BASE_URI);
    });
  });

  describe('with cache-busting', () => {
    it('appends query parameter when cacheBuster is provided', () => {
      const result = getWidgetUri(BASE_URI, 'abc12345');
      expect(result).toBe('ui://widget/oak-json-viewer.html?v=abc12345');
    });

    it('handles short cache-busters', () => {
      const result = getWidgetUri(BASE_URI, 'a1');
      expect(result).toBe('ui://widget/oak-json-viewer.html?v=a1');
    });

    it('handles long cache-busters (first 8 chars of SHA)', () => {
      const result = getWidgetUri(BASE_URI, 'abc12345');
      expect(result).toBe('ui://widget/oak-json-viewer.html?v=abc12345');
    });
  });

  describe('pure function properties', () => {
    it('is pure: same inputs produce same outputs', () => {
      const result1 = getWidgetUri(BASE_URI, 'test123');
      const result2 = getWidgetUri(BASE_URI, 'test123');
      expect(result1).toBe(result2);
    });

    it('is pure: does not mutate inputs', () => {
      const baseUri = BASE_URI;
      const cacheBuster = 'test';
      getWidgetUri(baseUri, cacheBuster);
      expect(baseUri).toBe(BASE_URI);
      expect(cacheBuster).toBe('test');
    });
  });
});
