/**
 * Unit tests for rate limit configuration.
 *
 * Tests PURE functions only - no IO, no side effects, no mocks.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
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

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return 0 when rate limiting is disabled', () => {
      vi.useFakeTimers({ now: 1000 });
      const disabledConfig = { ...config, enabled: false };
      const delay = calculateDelay(950, disabledConfig);
      expect(delay).toBe(0);
    });

    it('should return 0 when enough time has elapsed', () => {
      vi.useFakeTimers({ now: 1000 });
      const delay = calculateDelay(900, config);
      expect(delay).toBe(0);
    });

    it('should return 0 when more than enough time has elapsed', () => {
      vi.useFakeTimers({ now: 1000 });
      const delay = calculateDelay(800, config);
      expect(delay).toBe(0);
    });

    it('should calculate delay when not enough time has elapsed', () => {
      vi.useFakeTimers({ now: 1000 });
      const delay = calculateDelay(970, config);
      expect(delay).toBe(70);
    });

    it('should calculate delay correctly at various time points', () => {
      vi.useFakeTimers({ now: 1000 });

      expect(calculateDelay(999, config)).toBe(99);
      expect(calculateDelay(950, config)).toBe(50);
      expect(calculateDelay(901, config)).toBe(1);
    });

    it('should handle lastRequestTime of 0 (no previous request)', () => {
      vi.useFakeTimers({ now: 1000 });
      const delay = calculateDelay(0, config);
      expect(delay).toBe(0);
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
