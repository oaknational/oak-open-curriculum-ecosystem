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

// #region agent log — CI hang diagnosis (debug session c79357)
// Emit process-level diagnostics to stderr so they appear in CI output
// even if vitest's output buffering swallows stdout.
const isCI = process.env['CI'] === 'true';
if (isCI) {
  const pid = process.pid;
  const heapMB = () => Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const rssMB = () => Math.round(process.memoryUsage().rss / 1024 / 1024);

  console.error(`[diag:${pid}] test.setup.ts loaded — heap=${heapMB()}MB rss=${rssMB()}MB`);

  process.on('exit', (code) => {
    console.error(`[diag:${pid}] process exit — code=${code} heap=${heapMB()}MB rss=${rssMB()}MB`);
  });

  process.on('SIGTERM', () => {
    console.error(`[diag:${pid}] SIGTERM received — heap=${heapMB()}MB rss=${rssMB()}MB`);
  });

  process.on('SIGINT', () => {
    console.error(`[diag:${pid}] SIGINT received — heap=${heapMB()}MB rss=${rssMB()}MB`);
  });

  process.on('warning', (warning) => {
    if (warning.name === 'MaxListenersExceededWarning' || warning.message.includes('memory')) {
      console.error(`[diag:${pid}] process warning: ${warning.name} — ${warning.message}`);
    }
  });
}
// #endregion

// Cleanup after each test case to prevent state pollution
afterEach(() => {
  vi.useRealTimers(); // Ensure fake timers are always reset
  vi.clearAllMocks(); // Clear all mock state
});
