import { describe, expect, it } from 'vitest';
import { createApp } from '../index.js';
import { loadRuntimeConfig, type RuntimeConfig } from '../runtime-config.js';
import { createTestLogger } from './test-helpers/create-test-logger.js';

function createRuntimeConfig(overrides: NodeJS.ProcessEnv = {}): RuntimeConfig {
  const baseEnv: NodeJS.ProcessEnv = {
    OAK_API_KEY: 'test-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_value',
    CLERK_SECRET_KEY: 'sk_test_value',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    LOG_LEVEL: 'debug',
  };
  return loadRuntimeConfig({ ...baseEnv, ...overrides });
}

function contextMatchesPhase(context: unknown, phase: string): boolean {
  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    return false;
  }
  return Reflect.get(context, 'phase') === phase;
}

function contextNumberValue(context: unknown, key: string): number | undefined {
  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    return undefined;
  }
  const value: unknown = Reflect.get(context, key);
  return typeof value === 'number' ? value : undefined;
}

function contextStringValue(context: unknown, key: string): string | undefined {
  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    return undefined;
  }
  const value: unknown = Reflect.get(context, key);
  return typeof value === 'string' ? value : undefined;
}

function verifyPhaseLogging(
  entries: { message: string; context?: unknown }[],
  phase: string,
): void {
  const startEntry = entries.find(
    (entry) =>
      entry.message === 'bootstrap.phase.start' && contextMatchesPhase(entry.context, phase),
  );
  expect(startEntry).toBeDefined();

  const finishEntry = entries.find(
    (entry) =>
      entry.message === 'bootstrap.phase.finish' && contextMatchesPhase(entry.context, phase),
  );
  expect(finishEntry).toBeDefined();
  if (!finishEntry) {
    return;
  }

  const durationMs = contextNumberValue(finishEntry.context, 'durationMs');
  expect(durationMs).toBeGreaterThanOrEqual(0);

  const formatted = contextStringValue(finishEntry.context, 'duration');
  expect(formatted).toBeDefined();
}

function verifyTotalBootstrapLogging(entries: { message: string; context?: unknown }[]): void {
  const totalEntry = entries.find((entry) => entry.message === 'bootstrap.complete');
  expect(totalEntry).toBeDefined();
  if (!totalEntry) {
    return;
  }

  const totalDurationMs = contextNumberValue(totalEntry.context, 'durationMs');
  expect(totalDurationMs).toBeGreaterThanOrEqual(0);
  const totalDuration = contextStringValue(totalEntry.context, 'duration');
  expect(totalDuration).toBeDefined();
}

describe('bootstrap instrumentation', () => {
  it('logs start and finish events for each bootstrap phase', () => {
    const { logger, entries } = createTestLogger();
    const runtimeConfig = createRuntimeConfig();

    createApp({ runtimeConfig, logger });

    const phases = [
      'setupBaseMiddleware',
      'applySecurity',
      'initializeCoreEndpoints',
      'setupAuthRoutes',
    ];

    for (const phase of phases) {
      verifyPhaseLogging(entries, phase);
    }

    verifyTotalBootstrapLogging(entries);
  });
});
