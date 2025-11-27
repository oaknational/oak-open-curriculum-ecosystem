import { describe, it, expect, vi } from 'vitest';
import { extractAuthContext } from './tool-auth-context.js';
import type { Request } from 'express';
import type { Logger } from '@oaknational/mcp-logger';

describe('extractAuthContext', () => {
  const createMockLogger = (): Logger =>
    ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }) as unknown as Logger;

  it('should extract auth context when present', () => {
    const req = {
      headers: { authorization: 'Bearer test-token' },
      auth: { userId: 'user_123' },
    } as unknown as Request;
    const logger = createMockLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toEqual({
      userId: 'user_123',
      token: 'test-token',
      scopes: undefined,
    });
  });

  it('should return undefined when no Authorization header', () => {
    const req = {
      headers: {},
      auth: { userId: 'user_123' },
    } as unknown as Request;
    const logger = createMockLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when req.auth missing', () => {
    const req = {
      headers: { authorization: 'Bearer test-token' },
      auth: undefined,
    } as unknown as Request;
    const logger = createMockLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when Authorization header is malformed', () => {
    const req = {
      headers: { authorization: 'InvalidFormat' },
      auth: { userId: 'user_123' },
    } as unknown as Request;
    const logger = createMockLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when Authorization header is not Bearer', () => {
    const req = {
      headers: { authorization: 'Basic dXNlcjpwYXNz' },
      auth: { userId: 'user_123' },
    } as unknown as Request;
    const logger = createMockLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });

  it('should return undefined when req.auth has no userId', () => {
    const req = {
      headers: { authorization: 'Bearer test-token' },
      auth: { userId: null },
    } as unknown as Request;
    const logger = createMockLogger();

    const result = extractAuthContext(req, logger);

    expect(result).toBeUndefined();
  });
});
