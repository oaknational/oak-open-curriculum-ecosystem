/**
 * Unit tests for MCP body parser utilities.
 *
 * These tests verify the pure functions that extract data from MCP request bodies.
 * Per testing-strategy.md: Unit tests are for pure functions with NO IO, NO mocks.
 */

import { describe, it, expect } from 'vitest';
import { getResourceUriFromBody } from './mcp-body-parser.js';

describe('getResourceUriFromBody', () => {
  describe('returns URI string when body has valid params.uri', () => {
    it('extracts URI from valid MCP resources/read body', () => {
      const body = {
        method: 'resources/read',
        params: { uri: 'ui://widget/oak-curriculum-app.html' },
      };

      expect(getResourceUriFromBody(body)).toBe('ui://widget/oak-curriculum-app.html');
    });

    it('extracts documentation URI', () => {
      const body = {
        method: 'resources/read',
        params: { uri: 'docs://oak/getting-started.md' },
      };

      expect(getResourceUriFromBody(body)).toBe('docs://oak/getting-started.md');
    });

    it('extracts URI regardless of other params', () => {
      const body = {
        method: 'resources/read',
        params: { uri: 'test://uri', other: 'value' },
      };

      expect(getResourceUriFromBody(body)).toBe('test://uri');
    });
  });

  describe('returns undefined for invalid bodies', () => {
    it('returns undefined for missing params', () => {
      const body = { method: 'resources/read' };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });

    it('returns undefined for missing uri in params', () => {
      const body = {
        method: 'resources/read',
        params: { other: 'value' },
      };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });

    it('returns undefined for non-string uri', () => {
      const body = {
        method: 'resources/read',
        params: { uri: 123 },
      };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });

    it('returns undefined for null uri', () => {
      const body = {
        method: 'resources/read',
        params: { uri: null },
      };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });

    it('returns undefined for undefined body', () => {
      expect(getResourceUriFromBody(undefined)).toBeUndefined();
    });

    it('returns undefined for null body', () => {
      expect(getResourceUriFromBody(null)).toBeUndefined();
    });

    it('returns undefined for non-object body', () => {
      expect(getResourceUriFromBody('string')).toBeUndefined();
      expect(getResourceUriFromBody(123)).toBeUndefined();
      expect(getResourceUriFromBody(true)).toBeUndefined();
    });

    it('returns undefined for array body', () => {
      expect(getResourceUriFromBody([{ params: { uri: 'test' } }])).toBeUndefined();
    });

    it('returns undefined for params that is not an object', () => {
      const body = {
        method: 'resources/read',
        params: 'not-an-object',
      };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });

    it('returns undefined for params that is null', () => {
      const body = {
        method: 'resources/read',
        params: null,
      };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });

    it('returns undefined for params that is an array', () => {
      const body = {
        method: 'resources/read',
        params: [{ uri: 'test' }],
      };

      expect(getResourceUriFromBody(body)).toBeUndefined();
    });
  });
});
