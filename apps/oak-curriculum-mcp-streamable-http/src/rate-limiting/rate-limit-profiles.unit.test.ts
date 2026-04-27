import { describe, it, expect } from 'vitest';

import {
  MCP_RATE_LIMIT,
  OAUTH_RATE_LIMIT,
  METADATA_RATE_LIMIT,
  ASSET_RATE_LIMIT,
} from './rate-limit-profiles.js';

describe('rate limit profiles', () => {
  describe('MCP_RATE_LIMIT', () => {
    it('allows 120 requests per minute', () => {
      expect(MCP_RATE_LIMIT.windowMs).toBe(60_000);
      expect(MCP_RATE_LIMIT.limit).toBe(120);
    });

    it('returns standard error shape', () => {
      expect(MCP_RATE_LIMIT.message).toStrictEqual({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Try again later.',
      });
    });
  });

  describe('OAUTH_RATE_LIMIT', () => {
    it('allows 30 requests per 15 minutes', () => {
      expect(OAUTH_RATE_LIMIT.windowMs).toBe(900_000);
      expect(OAUTH_RATE_LIMIT.limit).toBe(30);
    });

    it('returns OAuth error shape', () => {
      expect(OAUTH_RATE_LIMIT.message).toStrictEqual({
        error: 'too_many_requests',
        error_description: 'Rate limit exceeded. Try again later.',
      });
    });
  });

  describe('METADATA_RATE_LIMIT', () => {
    it('allows 60 requests per minute', () => {
      expect(METADATA_RATE_LIMIT.windowMs).toBe(60_000);
      expect(METADATA_RATE_LIMIT.limit).toBe(60);
    });

    it('returns OAuth error shape', () => {
      expect(METADATA_RATE_LIMIT.message).toStrictEqual({
        error: 'too_many_requests',
        error_description: 'Rate limit exceeded. Try again later.',
      });
    });
  });

  describe('ASSET_RATE_LIMIT', () => {
    it('allows 60 requests per minute', () => {
      expect(ASSET_RATE_LIMIT.windowMs).toBe(60_000);
      expect(ASSET_RATE_LIMIT.limit).toBe(60);
    });

    it('returns standard error shape', () => {
      expect(ASSET_RATE_LIMIT.message).toStrictEqual({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Try again later.',
      });
    });
  });
});
