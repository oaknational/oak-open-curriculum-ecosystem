import { describe, expect, it } from 'vitest';

import { productionCollaborationStateRuntime } from '../../src/collaboration-state/cli-runtime';

describe('productionCollaborationStateRuntime — supervisor-liveness seam wired (F-101)', () => {
  it('provides a processIsAlive probe that reports this live process alive', () => {
    // The composition-root guard: the production runtime MUST wire the
    // signal-0 probe, or `comms watch --supervisor-pid` would throw at runtime
    // (the wiring gap the F-101 observation proof surfaced). `process.pid` is
    // this test runner — guaranteed alive — so no flaky absent-pid is needed.
    const runtime = productionCollaborationStateRuntime();
    expect(runtime.processIsAlive).toBeDefined();
    expect(runtime.processIsAlive?.(process.pid)).toBe(true);
  });
});
