/**
 * Unit tests for retry configuration with exponential backoff.
 *
 * Tests PURE functions only - no IO, no side effects, no mocks.
 */

import { describe, it, expect } from 'vitest';
import {
  createRetryConfig,
  calculateBackoff,
  shouldRetry,
  getMaxRetriesForStatus,
  DEFAULT_RETRY_CONFIG,
  type RetryConfig,
} from './retry-config';

describe('retry-config', () => {
  describe('DEFAULT_RETRY_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_RETRY_CONFIG.enabled).toBe(true);
      expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(3);
      expect(DEFAULT_RETRY_CONFIG.initialDelayMs).toBe(1000);
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2);
      expect(DEFAULT_RETRY_CONFIG.maxDelayMs).toBe(60000);
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toEqual([429, 503]);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(DEFAULT_RETRY_CONFIG)).toBe(true);
    });

    it('should have readonly retryableStatusCodes array', () => {
      expect(Object.isFrozen(DEFAULT_RETRY_CONFIG.retryableStatusCodes)).toBe(true);
    });
  });

  describe('createRetryConfig', () => {
    it('should return default config when no overrides provided', () => {
      const config = createRetryConfig();
      expect(config).toEqual(DEFAULT_RETRY_CONFIG);
    });

    it('should override enabled flag', () => {
      const config = createRetryConfig({ enabled: false });
      expect(config.enabled).toBe(false);
      expect(config.maxRetries).toBe(3);
    });

    it('should override maxRetries', () => {
      const config = createRetryConfig({ maxRetries: 5 });
      expect(config.maxRetries).toBe(5);
      expect(config.initialDelayMs).toBe(1000);
    });

    it('should override initialDelayMs', () => {
      const config = createRetryConfig({ initialDelayMs: 500 });
      expect(config.initialDelayMs).toBe(500);
      expect(config.backoffMultiplier).toBe(2);
    });

    it('should override backoffMultiplier', () => {
      const config = createRetryConfig({ backoffMultiplier: 3 });
      expect(config.backoffMultiplier).toBe(3);
      expect(config.maxDelayMs).toBe(60000);
    });

    it('should override maxDelayMs', () => {
      const config = createRetryConfig({ maxDelayMs: 30000 });
      expect(config.maxDelayMs).toBe(30000);
      expect(config.initialDelayMs).toBe(1000);
    });

    it('should override retryableStatusCodes', () => {
      const config = createRetryConfig({ retryableStatusCodes: [429] });
      expect(config.retryableStatusCodes).toEqual([429]);
    });

    it('should override multiple properties', () => {
      const config = createRetryConfig({
        enabled: false,
        maxRetries: 1,
        initialDelayMs: 2000,
        retryableStatusCodes: [503],
      });
      expect(config.enabled).toBe(false);
      expect(config.maxRetries).toBe(1);
      expect(config.initialDelayMs).toBe(2000);
      expect(config.retryableStatusCodes).toEqual([503]);
    });

    it('should not mutate the defaults', () => {
      const before = { ...DEFAULT_RETRY_CONFIG };
      createRetryConfig({ enabled: false });
      expect(DEFAULT_RETRY_CONFIG).toEqual(before);
    });
  });

  describe('calculateBackoff', () => {
    const config: RetryConfig = {
      enabled: true,
      maxRetries: 3,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      maxDelayMs: 60000,
      retryableStatusCodes: [429, 503],
    };

    it('should calculate exponential backoff for attempt 0', () => {
      const delay = calculateBackoff(0, config);
      expect(delay).toBe(1000); // 1000 * 2^0 = 1000
    });

    it('should calculate exponential backoff for attempt 1', () => {
      const delay = calculateBackoff(1, config);
      expect(delay).toBe(2000); // 1000 * 2^1 = 2000
    });

    it('should calculate exponential backoff for attempt 2', () => {
      const delay = calculateBackoff(2, config);
      expect(delay).toBe(4000); // 1000 * 2^2 = 4000
    });

    it('should calculate exponential backoff for attempt 3', () => {
      const delay = calculateBackoff(3, config);
      expect(delay).toBe(8000); // 1000 * 2^3 = 8000
    });

    it('should cap delay at maxDelayMs', () => {
      const delay = calculateBackoff(10, config); // Would be 1024000ms
      expect(delay).toBe(60000); // capped at maxDelayMs
    });

    it('should respect different initialDelayMs', () => {
      const customConfig = { ...config, initialDelayMs: 500 };
      expect(calculateBackoff(0, customConfig)).toBe(500);
      expect(calculateBackoff(1, customConfig)).toBe(1000);
      expect(calculateBackoff(2, customConfig)).toBe(2000);
    });

    it('should respect different backoffMultiplier', () => {
      const customConfig = { ...config, backoffMultiplier: 3 };
      expect(calculateBackoff(0, customConfig)).toBe(1000); // 1000 * 3^0
      expect(calculateBackoff(1, customConfig)).toBe(3000); // 1000 * 3^1
      expect(calculateBackoff(2, customConfig)).toBe(9000); // 1000 * 3^2
    });

    it('should respect different maxDelayMs', () => {
      const customConfig = { ...config, maxDelayMs: 5000 };
      expect(calculateBackoff(0, customConfig)).toBe(1000);
      expect(calculateBackoff(1, customConfig)).toBe(2000);
      expect(calculateBackoff(2, customConfig)).toBe(4000);
      expect(calculateBackoff(3, customConfig)).toBe(5000); // capped
      expect(calculateBackoff(10, customConfig)).toBe(5000); // capped
    });

    it('should handle backoffMultiplier of 1 (linear)', () => {
      const linearConfig = { ...config, backoffMultiplier: 1 };
      expect(calculateBackoff(0, linearConfig)).toBe(1000);
      expect(calculateBackoff(1, linearConfig)).toBe(1000);
      expect(calculateBackoff(5, linearConfig)).toBe(1000);
    });
  });

  describe('shouldRetry', () => {
    const config: RetryConfig = {
      enabled: true,
      maxRetries: 3,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      maxDelayMs: 60000,
      retryableStatusCodes: [429, 503],
    };

    it('should return false when retry is disabled', () => {
      const disabledConfig = { ...config, enabled: false };
      expect(shouldRetry(429, disabledConfig)).toBe(false);
      expect(shouldRetry(503, disabledConfig)).toBe(false);
    });

    it('should return true for 429 status code', () => {
      expect(shouldRetry(429, config)).toBe(true);
    });

    it('should return true for 503 status code', () => {
      expect(shouldRetry(503, config)).toBe(true);
    });

    it('should return false for 200 status code', () => {
      expect(shouldRetry(200, config)).toBe(false);
    });

    it('should return false for 404 status code', () => {
      expect(shouldRetry(404, config)).toBe(false);
    });

    it('should return false for 500 status code', () => {
      expect(shouldRetry(500, config)).toBe(false);
    });

    it('should return false for 502 status code', () => {
      expect(shouldRetry(502, config)).toBe(false);
    });

    it('should respect custom retryableStatusCodes', () => {
      const customConfig = { ...config, retryableStatusCodes: [429] };
      expect(shouldRetry(429, customConfig)).toBe(true);
      expect(shouldRetry(503, customConfig)).toBe(false);
    });

    it('should handle empty retryableStatusCodes', () => {
      const emptyConfig = { ...config, retryableStatusCodes: [] };
      expect(shouldRetry(429, emptyConfig)).toBe(false);
      expect(shouldRetry(503, emptyConfig)).toBe(false);
      expect(shouldRetry(200, emptyConfig)).toBe(false);
    });

    it('should handle custom status codes', () => {
      const customConfig = { ...config, retryableStatusCodes: [502, 504, 429] };
      expect(shouldRetry(502, customConfig)).toBe(true);
      expect(shouldRetry(504, customConfig)).toBe(true);
      expect(shouldRetry(429, customConfig)).toBe(true);
      expect(shouldRetry(500, customConfig)).toBe(false);
      expect(shouldRetry(503, customConfig)).toBe(false);
    });
  });

  describe('getMaxRetriesForStatus', () => {
    const config: RetryConfig = {
      enabled: true,
      maxRetries: 5,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      maxDelayMs: 60000,
      retryableStatusCodes: [429, 503, 404, 500],
    };

    it('should return maxRetries when no statusCodeMaxRetries defined', () => {
      expect(getMaxRetriesForStatus(429, config)).toBe(5);
      expect(getMaxRetriesForStatus(503, config)).toBe(5);
      expect(getMaxRetriesForStatus(404, config)).toBe(5);
    });

    it('should return per-status limit when statusCodeMaxRetries defined', () => {
      const configWithLimits: RetryConfig = {
        ...config,
        statusCodeMaxRetries: { 404: 2, 500: 2 },
      };
      expect(getMaxRetriesForStatus(404, configWithLimits)).toBe(2);
      expect(getMaxRetriesForStatus(500, configWithLimits)).toBe(2);
    });

    it('should fall back to maxRetries for codes not in statusCodeMaxRetries', () => {
      const configWithLimits: RetryConfig = {
        ...config,
        statusCodeMaxRetries: { 404: 2, 500: 2 },
      };
      expect(getMaxRetriesForStatus(429, configWithLimits)).toBe(5);
      expect(getMaxRetriesForStatus(503, configWithLimits)).toBe(5);
    });

    it('should handle empty statusCodeMaxRetries', () => {
      const configWithEmpty: RetryConfig = {
        ...config,
        statusCodeMaxRetries: {},
      };
      expect(getMaxRetriesForStatus(429, configWithEmpty)).toBe(5);
      expect(getMaxRetriesForStatus(404, configWithEmpty)).toBe(5);
    });
  });
});
