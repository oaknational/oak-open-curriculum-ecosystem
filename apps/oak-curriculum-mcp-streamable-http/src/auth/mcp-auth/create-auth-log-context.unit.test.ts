/**
 * Unit tests for createAuthLogContext helper.
 *
 * Tests verify the pure function correctly constructs log context objects
 * from request/response metadata with optional additional fields.
 */

import { describe, it, expect } from 'vitest';
import { createMockExpressRequest, createMockExpressResponse } from '../../test-helpers/fakes.js';
import { createAuthLogContext } from './auth-response-helpers.js';

describe('createAuthLogContext', () => {
  /**
   * Helper to create minimal Express mock objects
   */
  function createMocks(options: { correlationId?: string } = {}) {
    const req = createMockExpressRequest({
      method: 'POST',
      path: '/mcp',
    });
    const res = createMockExpressResponse();
    res.locals = {
      correlationId: options.correlationId ?? 'test-correlation-id-123',
    };

    return { req, res };
  }

  it('returns base context with method, path, and correlationId', () => {
    const { req, res } = createMocks();

    const context = createAuthLogContext(req, res);

    expect(context).toEqual({
      method: 'POST',
      path: '/mcp',
      correlationId: 'test-correlation-id-123',
    });
  });

  it('merges extra context fields', () => {
    const { req, res } = createMocks();
    const extra = {
      reason: 'Invalid token',
      expectedResource: 'https://example.com/mcp',
    };

    const context = createAuthLogContext(req, res, extra);

    expect(context).toEqual({
      method: 'POST',
      path: '/mcp',
      correlationId: 'test-correlation-id-123',
      reason: 'Invalid token',
      expectedResource: 'https://example.com/mcp',
    });
  });

  it('handles different request methods and paths', () => {
    const req = createMockExpressRequest({
      method: 'GET',
      path: '/api/status',
    });
    const res = createMockExpressResponse();
    res.locals = {
      correlationId: 'another-correlation-id',
    };

    const context = createAuthLogContext(req, res);

    expect(context).toEqual({
      method: 'GET',
      path: '/api/status',
      correlationId: 'another-correlation-id',
    });
  });

  it('handles undefined extra context gracefully', () => {
    const { req, res } = createMocks();

    const context = createAuthLogContext(req, res);

    expect(context).toEqual({
      method: 'POST',
      path: '/mcp',
      correlationId: 'test-correlation-id-123',
    });
  });

  it('extra fields override base fields when names collide', () => {
    const { req, res } = createMocks();
    const extra = {
      method: 'OVERRIDE',
    };

    const context = createAuthLogContext(req, res, extra);

    // Spread operator means extra fields override
    expect(context).toEqual({
      method: 'OVERRIDE', // Overridden by extra
      path: '/mcp',
      correlationId: 'test-correlation-id-123',
    });
  });

  it('handles missing correlationId in res.locals', () => {
    const req = createMockExpressRequest({
      method: 'POST',
      path: '/mcp',
    });
    const res = createMockExpressResponse();
    res.locals = {};

    const context = createAuthLogContext(req, res);

    expect(context).toEqual({
      method: 'POST',
      path: '/mcp',
      correlationId: undefined,
    });
  });
});
