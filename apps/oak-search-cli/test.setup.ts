/**
 * Test Setup for Oak Open Curriculum Semantic Search
 *
 * Configures the test environment for unit and integration tests.
 * No network calls or external dependencies should be used in tests.
 *
 * NOTE: Per testing-strategy.md, tests do not read or mutate process.env.
 * Tests that need configuration should construct explicit env-like objects and
 * pass them through the code under test.
 */

import { afterEach, vi } from 'vitest';

// Cleanup after each test case to prevent state pollution
afterEach(() => {
  vi.useRealTimers(); // Ensure fake timers are always reset
  vi.clearAllMocks(); // Clear all mock state
});
