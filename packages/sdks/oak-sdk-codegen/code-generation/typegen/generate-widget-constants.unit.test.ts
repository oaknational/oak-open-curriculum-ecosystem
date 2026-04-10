/**
 * Unit tests for cross-domain widget constants.
 *
 * Tests the generator output shape: URI format, cache-busting strategy.
 * The constants feed both sdk-codegen (generated files) and the SDK
 * (projection and registration functions).
 *
 * @see cross-domain-constants.ts — source of truth for widget constants
 */

import { describe, it, expect } from 'vitest';
import { BASE_WIDGET_URI } from './cross-domain-constants.js';

describe('cross-domain widget constants', () => {
  describe('BASE_WIDGET_URI', () => {
    it('follows the ui://widget/ URI scheme', () => {
      expect(BASE_WIDGET_URI).toMatch(/^ui:\/\/widget\/.+\.html$/);
    });

    it('includes a hash or local suffix for cache-busting', () => {
      // Local dev: "local", production: 8-char hex
      expect(BASE_WIDGET_URI).toMatch(/-(local|[a-f0-9]{8})\.html$/);
    });
  });
});
