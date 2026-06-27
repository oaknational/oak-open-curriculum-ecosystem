/**
 * Unit tests for public resource detection.
 *
 * Pure function tests with no IO, no side effects, no mocks.
 */

import { describe, it, expect } from 'vitest';
import { isPublicResourceUri } from './public-resources.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';
import { OAK_UNDER_THE_HOOD_RESOURCE_URI } from '../register-resources.js';

describe('isPublicResourceUri', () => {
  describe('returns true for public resources', () => {
    it('returns true for getting-started documentation', () => {
      expect(isPublicResourceUri('docs://oak/getting-started.md')).toBe(true);
    });
  });

  describe('returns true for widget resource (static HTML, no user data)', () => {
    it('returns true for widget URI', () => {
      expect(isPublicResourceUri(WIDGET_URI)).toBe(true);
    });
  });

  describe('returns true for the app-local orientation pointer (ADR-205)', () => {
    // Imports the URI the resource is actually registered under, so a future rename of
    // the registered resource fails this test until the allowlist is updated in step
    // (drift guard for the first app-local public resource).
    it('returns true for the Oak: Under the Hood resource URI as registered', () => {
      expect(isPublicResourceUri(OAK_UNDER_THE_HOOD_RESOURCE_URI)).toBe(true);
    });
  });

  describe('returns false for non-public resources', () => {
    it('returns false for unknown widget URIs', () => {
      expect(isPublicResourceUri('ui://other/widget.html')).toBe(false);
    });

    it('returns false for unknown documentation URIs', () => {
      expect(isPublicResourceUri('docs://other/file.md')).toBe(false);
    });

    it('returns false for the removed tools and workflows doc resources (single-sourced via curriculum://model)', () => {
      expect(isPublicResourceUri('docs://oak/tools.md')).toBe(false);
      expect(isPublicResourceUri('docs://oak/workflows.md')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isPublicResourceUri('')).toBe(false);
    });

    it('returns false for arbitrary strings', () => {
      expect(isPublicResourceUri('not-a-uri')).toBe(false);
    });

    it('returns false for similar but not exact URIs', () => {
      expect(isPublicResourceUri('ui://widget/oak-curriculum-app.html/')).toBe(false);
      expect(isPublicResourceUri('UI://widget/oak-curriculum-app.html')).toBe(false);
      expect(isPublicResourceUri('docs://oak/getting-started.MD')).toBe(false);
    });

    it('returns false for partial matches', () => {
      expect(isPublicResourceUri('ui://widget/oak-curriculum-app')).toBe(false);
      expect(isPublicResourceUri('docs://oak/getting-started')).toBe(false);
    });
  });
});
