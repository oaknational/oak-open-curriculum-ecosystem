import { describe, it, expect } from 'vitest';
import { extractAuthContext } from './tool-auth-context.js';
import { createFakeLogger, createFakeRequest } from '../test-helpers/fakes.js';

describe('extractAuthContext', () => {
  it('should extract auth context when present', () => {
    const req = createFakeRequest({
      headers: { authorization: 'Bearer test-token' },
      auth: () => ({ userId: 'user_123' }),
    });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toEqual({
      userId: 'user_123',
      token: 'test-token',
      scopes: undefined,
    });
  });

  it('should return undefined when no Authorization header', () => {
    const req = createFakeRequest({ headers: {}, auth: () => ({ userId: 'user_123' }) });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when req.auth missing', () => {
    const req = createFakeRequest({
      headers: { authorization: 'Bearer test-token' },
      auth: undefined,
    });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when Authorization header is malformed', () => {
    const req = createFakeRequest({
      headers: { authorization: 'InvalidFormat' },
      auth: () => ({ userId: 'user_123' }),
    });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when Authorization header is not Bearer', () => {
    const req = createFakeRequest({
      headers: { authorization: 'Basic dXNlcjpwYXNz' },
      auth: () => ({ userId: 'user_123' }),
    });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when req.auth has no userId', () => {
    const req = createFakeRequest({
      headers: { authorization: 'Bearer test-token' },
      auth: () => ({ userId: null }),
    });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when callable req.auth throws', () => {
    const req = createFakeRequest({
      headers: { authorization: 'Bearer test-token' },
      auth: () => {
        throw new Error('boom');
      },
    });
    const logger = createFakeLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });
});
