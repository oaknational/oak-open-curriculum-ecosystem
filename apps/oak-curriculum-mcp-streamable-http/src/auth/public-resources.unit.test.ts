/**
 * Unit tests for public resource detection.
 *
 * Pure function tests with no IO, no side effects, no mocks.
 */

import { describe, it, expect } from 'vitest';
import { isPublicResourceUri } from './public-resources.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';

describe('isPublicResourceUri', () => {
  describe('returns true for public resources', () => {
    it('returns true for getting-started documentation', () => {
      expect(isPublicResourceUri('docs://oak/getting-started.md')).toBe(true);
    });

    it('returns true for tools documentation', () => {
      expect(isPublicResourceUri('docs://oak/tools.md')).toBe(true);
    });

    it('returns true for workflows documentation', () => {
      expect(isPublicResourceUri('docs://oak/workflows.md')).toBe(true);
    });
  });

  describe('returns false for non-public resources', () => {
    it('returns false for widget URI (removed in WS3 Phase 1)', () => {
      expect(isPublicResourceUri(WIDGET_URI)).toBe(false);
    });

    it('returns false for unknown widget URIs', () => {
      expect(isPublicResourceUri('ui://other/widget.html')).toBe(false);
    });

    it('returns false for unknown documentation URIs', () => {
      expect(isPublicResourceUri('docs://other/file.md')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isPublicResourceUri('')).toBe(false);
    });

    it('returns false for arbitrary strings', () => {
      expect(isPublicResourceUri('not-a-uri')).toBe(false);
    });

    it('returns false for similar but not exact URIs', () => {
      expect(isPublicResourceUri('ui://widget/oak-json-viewer.html/')).toBe(false);
      expect(isPublicResourceUri('UI://widget/oak-json-viewer.html')).toBe(false);
      expect(isPublicResourceUri('docs://oak/getting-started.MD')).toBe(false);
    });

    it('returns false for partial matches', () => {
      expect(isPublicResourceUri('ui://widget/oak-json-viewer')).toBe(false);
      expect(isPublicResourceUri('docs://oak/getting-started')).toBe(false);
    });
  });
});
