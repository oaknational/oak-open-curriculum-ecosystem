/**
 * Unit tests for public resource detection.
 *
 * Pure function tests with no IO, no side effects, no mocks.
 */

import { describe, it, expect } from 'vitest';
import {
  NAVIGATION_GUIDANCE_URIS,
  CREATION_GUIDANCE_URIS,
  WIDGET_URI,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { isPublicResourceUri } from './public-resources.js';

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

  describe('classifies per ADR-205 (data-sensitivity rule)', () => {
    it('classifies the served (live) agent guidance documents as public — and only those', () => {
      for (const uri of NAVIGATION_GUIDANCE_URIS) {
        expect(isPublicResourceUri(uri), uri).toBe(true);
      }
      for (const uri of CREATION_GUIDANCE_URIS) {
        expect(isPublicResourceUri(uri), uri).toBe(false);
      }
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

    it('returns false for the retired under-the-hood pointer resource (MCP-353)', () => {
      expect(isPublicResourceUri('docs://oak/under-the-hood.md')).toBe(false);
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
