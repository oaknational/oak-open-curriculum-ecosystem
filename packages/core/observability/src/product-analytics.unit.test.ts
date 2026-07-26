import { describe, expect, it } from 'vitest';

import {
  createOffProductAnalyticsRuntime,
  type ProductAnalyticsEvent,
} from './product-analytics.js';

interface TestTransport {
  readonly id: string;
}

describe('createOffProductAnalyticsRuntime', () => {
  it('provides exact inert capture, transport observation, and close behaviour', async () => {
    const runtime = createOffProductAnalyticsRuntime<TestTransport>();
    const event: ProductAnalyticsEvent = {
      kind: 'mcp_resource_read',
      resourceName: 'lesson-summary',
      startedAt: new Date('2026-07-26T00:00:00.000Z'),
      durationMs: 12,
      isError: false,
    };
    expect(runtime.mode).toBe('off');
    expect(
      runtime.sink.capture(event, { verifiedActorId: 'verified-clerk-principal' }),
    ).toBeUndefined();
    const transport = { id: 'transport' };
    expect(runtime.transportObserver.observe(transport)).toBe(transport);
    await expect(runtime.close()).resolves.toStrictEqual({ ok: true, value: undefined });
  });
});
