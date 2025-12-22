/**
 * Test Setup for Oak Open Curriculum Semantic Search
 *
 * Configures the test environment for unit and integration tests.
 * No network calls or external dependencies should be used in tests.
 *
 * NOTE: Per testing-strategy.md, we do NOT mutate process.env globally here.
 * Tests that need environment variables should set them in beforeEach/afterEach
 * with proper cleanup to avoid shared state pollution.
 */

import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case to prevent state pollution
afterEach(() => {
  cleanup(); // Clean up React Testing Library state
  vi.useRealTimers(); // Ensure fake timers are always reset
  vi.clearAllMocks(); // Clear all mock state
});
