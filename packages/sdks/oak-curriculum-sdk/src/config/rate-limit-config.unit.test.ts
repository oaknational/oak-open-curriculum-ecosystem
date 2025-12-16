/**
 * Unit tests for rate limit configuration.
 *
 * Tests PURE functions only - no IO, no side effects, no mocks.
 */

import { describe, it, expect } from 'vitest';
import {
  createRateLimitConfig,
  calculateDelay,
  DEFAULT_RATE_LIMIT_CONFIG,
  type RateLimitConfig,
} from './rate-limit-config';

describe('rate-limit-config', () => {
  describe('DEFAULT_RATE_LIMIT_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe(true);
      expect(DEFAULT_RATE_LIMIT_CONFIG.minRequestInterval).toBe(100);
      expect(DEFAULT_RATE_LIMIT_CONFIG.maxRequestsPerSecond).toBe(10);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(DEFAULT_RATE_LIMIT_CONFIG)).toBe(true);
    });
  });

  describe('createRateLimitConfig', () => {
    it('should return default config when no overrides provided', () => {
      const config = createRateLimitConfig();
      expect(config).toEqual(DEFAULT_RATE_LIMIT_CONFIG);
    });

    it('should override enabled flag', () => {
      const config = createRateLimitConfig({ enabled: false });
      expect(config.enabled).toBe(false);
      expect(config.minRequestInterval).toBe(100);
      expect(config.maxRequestsPerSecond).toBe(10);
    });

    it('should override minRequestInterval', () => {
      const config = createRateLimitConfig({ minRequestInterval: 200 });
      expect(config.enabled).toBe(true);
      expect(config.minRequestInterval).toBe(200);
      expect(config.maxRequestsPerSecond).toBe(10);
    });

    it('should override maxRequestsPerSecond', () => {
      const config = createRateLimitConfig({ maxRequestsPerSecond: 5 });
      expect(config.enabled).toBe(true);
      expect(config.minRequestInterval).toBe(100);
      expect(config.maxRequestsPerSecond).toBe(5);
    });

    it('should override multiple properties', () => {
      const config = createRateLimitConfig({
        enabled: false,
        minRequestInterval: 500,
        maxRequestsPerSecond: 2,
      });
      expect(config.enabled).toBe(false);
      expect(config.minRequestInterval).toBe(500);
      expect(config.maxRequestsPerSecond).toBe(2);
    });

    it('should not mutate the defaults', () => {
      const before = { ...DEFAULT_RATE_LIMIT_CONFIG };
      createRateLimitConfig({ enabled: false });
      expect(DEFAULT_RATE_LIMIT_CONFIG).toEqual(before);
    });
  });

  describe('calculateDelay', () => {
    const config: RateLimitConfig = {
      enabled: true,
      minRequestInterval: 100,
      maxRequestsPerSecond: 10,
    };

    it('should return 0 when rate limiting is disabled', () => {
      const disabledConfig = { ...config, enabled: false };
      const now = Date.now();
      const delay = calculateDelay(now - 50, disabledConfig);
      expect(delay).toBe(0);
    });

    it('should return 0 when enough time has elapsed', () => {
      const now = Date.now();
      const lastRequest = now - 100; // exactly minRequestInterval ago
      const delay = calculateDelay(lastRequest, config);
      expect(delay).toBe(0);
    });

    it('should return 0 when more than enough time has elapsed', () => {
      const now = Date.now();
      const lastRequest = now - 200; // more than minRequestInterval ago
      const delay = calculateDelay(lastRequest, config);
      expect(delay).toBe(0);
    });

    it('should calculate delay when not enough time has elapsed', () => {
      const now = Date.now();
      const lastRequest = now - 30; // only 30ms elapsed, need 100ms
      const delay = calculateDelay(lastRequest, config);
      expect(delay).toBeGreaterThan(60); // need at least 70ms more
      expect(delay).toBeLessThanOrEqual(70); // but not more than 70ms
    });

    it('should calculate delay correctly at various time points', () => {
      const now = Date.now();

      // Just happened - need almost full interval
      const delay1 = calculateDelay(now - 1, config);
      expect(delay1).toBeGreaterThanOrEqual(99);
      expect(delay1).toBeLessThanOrEqual(100);

      // Halfway through interval
      const delay2 = calculateDelay(now - 50, config);
      expect(delay2).toBeGreaterThanOrEqual(49);
      expect(delay2).toBeLessThanOrEqual(51);

      // Almost ready
      const delay3 = calculateDelay(now - 99, config);
      expect(delay3).toBeGreaterThanOrEqual(0);
      expect(delay3).toBeLessThanOrEqual(2);
    });

    it('should handle lastRequestTime of 0 (no previous request)', () => {
      const delay = calculateDelay(0, config);
      expect(delay).toBe(0); // elapsed time is huge, so no delay needed
    });

    it('should respect different minRequestInterval values', () => {
      const slowConfig = { ...config, minRequestInterval: 500 };
      const now = Date.now();
      const lastRequest = now - 100;
      const delay = calculateDelay(lastRequest, slowConfig);
      expect(delay).toBeGreaterThanOrEqual(390); // need 400ms more (500 - 100)
      expect(delay).toBeLessThanOrEqual(400);
    });
  });
});
