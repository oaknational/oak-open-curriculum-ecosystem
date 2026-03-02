/**
 * Integration tests for observe CLI handlers.
 */

import { describe, it, expect, vi } from 'vitest';
import type { ObservabilityService } from '@oaknational/oak-search-sdk';
import { ok } from '@oaknational/result';
import { handleTelemetry, handleSummary } from './handlers.js';

/** Create a mock observability service returning ok() Results for I/O methods. */
function createMockObservability(): ObservabilityService {
  return {
    recordZeroHit: vi.fn().mockResolvedValue(ok(undefined)),
    getRecentZeroHits: vi.fn().mockReturnValue([]),
    getZeroHitSummary: vi.fn().mockReturnValue({
      total: 5,
      byScope: {},
      latestVersion: 'v1',
    }),
    persistZeroHitEvent: vi.fn().mockResolvedValue(ok(undefined)),
    fetchTelemetry: vi.fn().mockResolvedValue(
      ok({
        summary: { total: 10, byScope: {} },
        recentEvents: [],
      }),
    ),
  };
}

describe('handleTelemetry', () => {
  it('calls fetchTelemetry with the specified limit', async () => {
    const observability = createMockObservability();

    await handleTelemetry(observability, { limit: 20 });

    expect(observability.fetchTelemetry).toHaveBeenCalledWith({ limit: 20 });
  });

  it('returns ok with the telemetry result', async () => {
    const observability = createMockObservability();

    const result = await handleTelemetry(observability, { limit: 50 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        summary: { total: 10, byScope: {} },
        recentEvents: [],
      });
    }
  });
});

describe('handleSummary', () => {
  it('calls getZeroHitSummary on the observability service', () => {
    const observability = createMockObservability();

    const result = handleSummary(observability);

    expect(observability.getZeroHitSummary).toHaveBeenCalled();
    expect(result).toEqual({
      total: 5,
      byScope: {},
      latestVersion: 'v1',
    });
  });
});
